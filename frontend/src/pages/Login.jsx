import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  KeyRound,
  Sparkles,
  Stethoscope,
  Pill,
  Leaf
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';

export default function Login() {
  const navigate = useNavigate();

  // Auth Modes: 'phone' | 'email'
  const [authMethod, setAuthMethod] = useState('phone');
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 🌟 1. Automatic Persistent Session Check
  useEffect(() => {
    // Session hamesha browser me store rahega jab tak logout na ho
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn("Persistence setup warning:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user || localStorage.getItem('userToken')) {
        navigate('/', { replace: true });
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Setup reCAPTCHA for Phone Auth
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setError('reCAPTCHA समाप्त हो गया। कृपया पुनः प्रयास करें।');
        }
      });
    }
  };

  const saveFarmerSession = (user, fallbackName) => {
    const token = user.accessToken || user.uid;
    const name = user.displayName || user.phoneNumber || (user.email ? user.email.split('@')[0] : fallbackName);
    localStorage.setItem('userToken', token);
    localStorage.setItem('farmerName', name);
    navigate('/', { replace: true });
  };

  // 1. Google Sign-In
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      saveFarmerSession(result.user, 'किसान साथी');
    } catch (err) {
      console.error(err);
      setError('Google लॉगिन में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP to Phone
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (phone.length < 10) {
      setError('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setSuccessMsg('OTP आपके मोबाइल नंबर पर भेज दिया गया है।');
    } catch (err) {
      console.error(err);
      setError('OTP भेजने में समस्या आई। मोबाइल नंबर व इंटरनेट चेक करें।');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('कृपया 6 अंकों का OTP दर्ज करें।');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await confirmationResult.confirm(otp);
      saveFarmerSession(res.user, res.user.phoneNumber || 'किसान साथी');
    } catch (err) {
      console.error(err);
      setError('अमान्य OTP कोड। कृपया सही 6-डिजिट OTP भरें।');
    } finally {
      setLoading(false);
    }
  };

  // 3. Email & Password Auth
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      let res;
      if (isSignUp) {
        res = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        res = await signInWithEmailAndPassword(auth, email, password);
      }
      saveFarmerSession(res.user, res.user.email?.split('@')[0] || 'किसान साथी');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('गलत ईमेल या पासवर्ड। कृपया जांचें।');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('यह ईमेल पहले से पंजीकृत है। लॉगिन करें।');
      } else if (err.code === 'auth/weak-password') {
        setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      } else {
        setError('लॉगिन करने में समस्या आई। विवरण पुनः जांचें।');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#042f24] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-xs font-bold tracking-wider uppercase text-emerald-200">
            सत्यापित किसान सत्र लोड हो रहा है...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02231b] via-[#054332] to-[#011a14] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      {/* Decorative Blur Background Orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-4">
        
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-8 rounded-[32px] border border-white/50 shadow-2xl shadow-black/30 space-y-5">
          
          {/* Brand Icon & Heading */}
          <div className="text-center space-y-1.5">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#054332] to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/20 border border-emerald-400/30">
              <Sprout className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Smart Farmer AI Platform
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              किसान साथी लॉगिन
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              AI फसल डॉक्टर, रोग जांच व कृषि दवाओं तक सीधी पहुंच
            </p>
          </div>

          {/* Error / Success Banners */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-black py-3 px-4 rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google से तुरंत लॉगिन करें</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest absolute">
              या फिर (Or)
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
                authMethod === 'phone'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> मोबाइल OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 ${
                authMethod === 'email'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> ईमेल आईडी
            </button>
          </div>

          {/* 🌟 1. Mobile Phone + OTP Form */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      मोबाइल नंबर (Mobile Number)
                    </label>
                    <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-emerald-700 focus-within:bg-white transition">
                      <span className="bg-slate-100 px-3.5 py-3 text-xs font-black text-slate-600 border-r border-slate-200 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-3 text-xs bg-transparent outline-none font-bold text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full bg-[#054332] hover:bg-[#032d22] disabled:opacity-50 text-white font-black py-3.5 rounded-2xl transition text-xs shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>OTP प्राप्त करें (Send OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      6-अंकों का OTP दर्ज करें (Enter OTP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-3.5 text-center tracking-[0.4em] font-black text-xl rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-700 focus:bg-white transition text-slate-900"
                        required
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full bg-[#054332] hover:bg-[#032d22] disabled:opacity-50 text-white font-black py-3.5 rounded-2xl transition text-xs shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>सत्यापित करें (Verify & Enter)</span>
                        <ShieldCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs font-bold text-emerald-800 hover:underline"
                  >
                    दूसरा मोबाइल नंबर दर्ज करें
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 🌟 2. Email & Password Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ईमेल आईडी (Email Address)
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-700 focus-within:bg-white transition">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    placeholder="kisan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 text-xs bg-transparent outline-none font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पासवर्ड (Password)
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-700 focus-within:bg-white transition">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 text-xs bg-transparent outline-none font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#054332] hover:bg-[#032d22] disabled:opacity-50 text-white font-black py-3.5 rounded-2xl transition text-xs shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'नया खाता बनाएं (Sign Up)' : 'खाते में लॉगिन करें (Sign In)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-bold text-slate-600 hover:text-emerald-800"
                >
                  {isSignUp ? 'पहले से खाता है? लॉगिन करें' : 'नया खाता बनाना चाहते हैं? रजिस्टर करें'}
                </button>
              </div>
            </form>
          )}

          {/* Security Guarantee Strip */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>स्थायी सुरक्षित सत्र (Permanent Persistent Login)</span>
          </div>

        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black text-emerald-200">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1">
            <Stethoscope className="w-3 h-3 text-emerald-300" /> AI Doctor
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1">
            <Pill className="w-3 h-3 text-rose-300" /> Direct Medicine
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1">
            <Leaf className="w-3 h-3 text-green-300" /> 24/7 Sahayak
          </div>
        </div>

      </div>
    </div>
  );
}