import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Phone, 
  Mail, 
  Lock, 
  User,
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  KeyRound,
  Sparkles,
  Stethoscope,
  Pill,
  Leaf,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { isDarkMode } = useTheme();

  // Helper Labels for Hindi, English, Marathi
  const getLabel = (hi, en, mr) => {
    if (lang === 'mr') return mr || hi;
    if (lang === 'en') return en;
    return hi;
  };

  // Auth Tabs: 'phone_pwd' (Phone + Password) | 'otp' (Phone OTP) | 'email' (Email + Password)
  const [authMethod, setAuthMethod] = useState('phone_pwd');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Inputs
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // OTP Verification States
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  // UI Statuses
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Check Existing Session
  useEffect(() => {
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

  const saveFarmerSession = (user, fallbackName) => {
    const token = user.accessToken || user.uid;
    const name = user.displayName || fallbackName || 'किसान साथी';
    localStorage.setItem('userToken', token);
    localStorage.setItem('farmerName', name);
    navigate('/', { replace: true });
  };

  // 2. Invisible reCAPTCHA Setup
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setError(getLabel('reCAPTCHA समाप्त हो गया। पुनः प्रयास करें।', 'reCAPTCHA expired. Try again.', 'reCAPTCHA कालबाह्य झाले. पुन्हा प्रयत्न करा.'));
        }
      });
    }
  };

  // 3. Google Sign-In
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      saveFarmerSession(result.user, result.user.displayName);
    } catch (err) {
      console.error(err);
      setError(getLabel('Google लॉगिन में समस्या आई। पुनः प्रयास करें।', 'Google sign-in failed. Please try again.', 'Google लॉगिन अयशस्वी झाले.'));
    } finally {
      setLoading(false);
    }
  };

  // 4. Mobile + Password Auth (Maps phone to Firebase Auth internal email)
  const handlePhonePasswordAuth = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError(getLabel('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।', 'Please enter a valid 10-digit mobile number.', 'कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा.'));
      return;
    }
    if (password.length < 6) {
      setError(getLabel('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।', 'Password must be at least 6 characters.', 'पासवर्ड किमान ६ अक्षरांचा असावा.'));
      return;
    }

    setLoading(true);
    // Bridged internal login email for phone + password combo
    const phoneEmail = `farmer_${cleanPhone}@smartfarmer.internal`;

    try {
      await setPersistence(auth, browserLocalPersistence);
      if (isSignUp) {
        if (!fullName.trim()) {
          setError(getLabel('कृपया अपना पूरा नाम दर्ज करें।', 'Please enter your full name.', 'कृपया आपले पूर्ण नाव प्रविष्ट करा.'));
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, phoneEmail, password);
        await updateProfile(userCredential.user, { displayName: fullName.trim() });
        saveFarmerSession(userCredential.user, fullName.trim());
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, phoneEmail, password);
        saveFarmerSession(userCredential.user, userCredential.user.displayName || cleanPhone);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError(getLabel('यह मोबाइल नंबर पहले से दर्ज है। लॉगिन करें।', 'Mobile already registered. Please sign in.', 'हा मोबाईल नंबर आधीच नोंदणीकृत आहे. लॉगिन करा.'));
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(getLabel('गलत मोबाइल नंबर या पासवर्ड।', 'Invalid mobile number or password.', 'चुकीचा मोबाईल नंबर किंवा पासवर्ड.'));
      } else {
        setError(getLabel('लॉगिन विफल रहा। कृपया विवरण पुनः जांचें।', 'Authentication failed. Please verify details.', 'लॉगिन अयशस्वी झाले. माहिती तपासा.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. Send Mobile OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError(getLabel('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।', 'Please enter a valid 10-digit mobile number.', 'कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा.'));
      return;
    }

    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = `+91${cleanPhone}`;

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setSuccessMsg(getLabel('OTP आपके मोबाइल पर भेज दिया गया है।', 'OTP sent to your mobile phone.', 'OTP तुमच्या मोबाईलवर पाठवला आहे.'));
    } catch (err) {
      console.error(err);
      setError(getLabel('OTP भेजने में समस्या आई। इंटरनेट व नंबर जांचें।', 'Failed to send OTP. Check connectivity.', 'OTP पाठवण्यात अडचण आली.'));
    } finally {
      setLoading(false);
    }
  };

  // 6. Verify Mobile OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError(getLabel('कृपया 6 अंकों का OTP दर्ज करें।', 'Enter valid 6-digit OTP.', 'कृपया ६-अंकी OTP प्रविष्ट करा.'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await confirmationResult.confirm(otp);
      saveFarmerSession(res.user, mobileNumber);
    } catch (err) {
      console.error(err);
      setError(getLabel('गलत OTP कोड। कृपया पुनः जांचें।', 'Invalid OTP code. Please retry.', 'चुकीचा OTP कोड.'));
    } finally {
      setLoading(false);
    }
  };

  // 7. Email + Password Auth
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      let res;
      if (isSignUp) {
        res = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName.trim()) {
          await updateProfile(res.user, { displayName: fullName.trim() });
        }
      } else {
        res = await signInWithEmailAndPassword(auth, email, password);
      }
      saveFarmerSession(res.user, fullName || res.user.email?.split('@')[0]);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(getLabel('गलत ईमेल या पासवर्ड।', 'Invalid email or password.', 'चुकीचा ईमेल किंवा पासवर्ड.'));
      } else if (err.code === 'auth/email-already-in-use') {
        setError(getLabel('यह ईमेल पहले से पंजीकृत है। लॉगिन करें।', 'Email already in use. Please sign in.', 'हा ईमेल आधीच नोंदणीकृत आहे.'));
      } else {
        setError(getLabel('लॉगिन नहीं हो सका। विवरण जांचें।', 'Failed to authenticate.', 'प्रमाणीकरण अयशस्वी.'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#042f24] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 className="w-9 h-9 animate-spin text-emerald-400" />
          <p className="text-xs font-black tracking-widest uppercase text-emerald-200">
            {getLabel('सत्यापित किसान सत्र लोड हो रहा है...', 'Authenticating Session...', 'सत्र लोड होत आहे...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#021510] via-[#04251c] to-[#010e0a]' 
        : 'bg-gradient-to-br from-[#0a4635] via-[#11664e] to-[#083528]'
    }`}>
      
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      {/* Decorative Blur Background Circles */}
      <div className="absolute -top-12 -left-12 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-4 my-8">
        
        {/* Main Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 sm:p-8 rounded-[36px] border border-white/40 dark:border-slate-800 shadow-2xl space-y-5 text-slate-900 dark:text-white transition-colors">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#054332] to-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/25 border border-emerald-400/30">
              <Sprout className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
              <Sparkles className="w-3 h-3 text-emerald-500" /> Smart Farmer Precision AI
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isSignUp 
                ? getLabel('नया किसान खाता बनाएं', 'Farmer Registration', 'नवीन शेतकरी नोंदणी')
                : getLabel('किसान साथी लॉगिन', 'Farmer Login Portal', 'शेतकरी लॉगिन')}
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {getLabel('AI फसल डॉक्टर, रोग जांच, रडार व मंडी तक सीधी पहुंच', 'Access AI Crop Diagnostics, Weather Radar & Agri Shop', 'AI पीक तपासणी, हवामान व औषध खरेदी')}
            </p>
          </div>

          {/* Error / Success Alerts */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-black py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center gap-2.5 text-xs active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{getLabel('Google से 1-क्लिक लॉगिन', 'Continue with Google', 'Google सह सुरू ठेवा')}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest absolute">
              {getLabel('या अन्य माध्यम', 'OR WITH', 'किंवा')}
            </span>
          </div>

          {/* 3-Way Mode Tabs */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[11px] font-black gap-0.5">
            <button
              type="button"
              onClick={() => { setAuthMethod('phone_pwd'); setError(''); }}
              className={`py-2 rounded-xl transition ${
                authMethod === 'phone_pwd' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {getLabel('मोबाइल/पासवर्ड', 'Mobile+Pass', 'मोबाईल+पास')}
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('otp'); setError(''); }}
              className={`py-2 rounded-xl transition ${
                authMethod === 'otp' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {getLabel('मोबाइल OTP', 'Mobile OTP', 'मोबाईल OTP')}
            </button>

            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setError(''); }}
              className={`py-2 rounded-xl transition ${
                authMethod === 'email' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {getLabel('ईमेल आईडी', 'Email', 'ईमेल')}
            </button>
          </div>

          {/* 🌟 OPTION A: MOBILE + PASSWORD (LOGIN / SIGNUP) */}
          {authMethod === 'phone_pwd' && (
            <form onSubmit={handlePhonePasswordAuth} className="space-y-3.5 text-xs">
              {isSignUp && (
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {getLabel('किसान का पूरा नाम *', 'Full Name *', 'शेतकऱ्याचे नाव *')}
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 focus-within:border-emerald-600 transition">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="उदा. सरदार धाकड़"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 bg-transparent outline-none font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {getLabel('मोबाइल नंबर (10 अंक) *', 'Mobile Number (10 Digits) *', 'मोबाईल नंबर *')}
                </label>
                <div className="flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden focus-within:border-emerald-600 transition">
                  <span className="bg-slate-100 dark:bg-slate-900 px-3 py-2.5 font-black text-slate-500 border-r border-slate-200 dark:border-slate-800 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 bg-transparent outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {getLabel('पासवर्ड (कम से कम 6 अक्षर) *', 'Password *', 'पासवर्ड *')}
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 focus-within:border-emerald-600 transition">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-transparent outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || mobileNumber.length < 10}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>{isSignUp ? getLabel('खाता बनाएं व प्रवेश करें', 'Register & Enter', 'नोंदणी करा') : getLabel('लॉगिन करें (Sign In)', 'Sign In with Mobile', 'लॉगिन करा')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 🌟 OPTION B: MOBILE OTP AUTH */}
          {authMethod === 'otp' && (
            <div className="space-y-3.5 text-xs">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {getLabel('मोबाइल नंबर (OTP के लिए) *', 'Mobile Number (For OTP) *', 'मोबाईल नंबर *')}
                    </label>
                    <div className="flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden focus-within:border-emerald-600 transition">
                      <span className="bg-slate-100 dark:bg-slate-900 px-3 py-2.5 font-black text-slate-500 border-r border-slate-200 dark:border-slate-800 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-2.5 bg-transparent outline-none font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || mobileNumber.length < 10}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <span>{getLabel('OTP प्राप्त करें (Send OTP)', 'Send OTP', 'OTP पाठवा')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {getLabel('6-अंकों का OTP दर्ज करें *', 'Enter 6-Digit OTP *', '६-अंकी OTP टाका *')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-3 text-center tracking-[0.4em] font-black text-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-emerald-600 transition"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <span>{getLabel('OTP सत्यापित करें', 'Verify OTP', 'सत्यापित करा')}</span>
                        <ShieldCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {getLabel('नंबर बदलें या पुनः भेजें', 'Change number or resend', 'क्रमांक बदला किंवा पुन्हा पाठवा')}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 🌟 OPTION C: EMAIL + PASSWORD AUTH */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3.5 text-xs">
              {isSignUp && (
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {getLabel('किसान का नाम', 'Full Name', 'शेतकऱ्याचे नाव')}
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 focus-within:border-emerald-600 transition">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="उदा. सरदार धाकड़"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 bg-transparent outline-none font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {getLabel('ईमेल आईडी (Email Address) *', 'Email Address *', 'ईमेल पत्ता *')}
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 focus-within:border-emerald-600 transition">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="kisan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-transparent outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {getLabel('पासवर्ड *', 'Password *', 'पासवर्ड *')}
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 focus-within:border-emerald-600 transition">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-transparent outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>{isSignUp ? getLabel('खाता बनाएं (Sign Up)', 'Register Account', 'नोंदणी करा') : getLabel('लॉगिन करें (Sign In)', 'Sign In with Email', 'लॉगिन करा')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle Login / Register */}
          {authMethod !== 'otp' && (
            <div className="text-center pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
              >
                {isSignUp 
                  ? getLabel('पहले से खाता है? लॉगिन करें', 'Already have an account? Sign In', 'आधीच खाते आहे? लॉगिन करा') 
                  : getLabel('नया खाता बनाना है? यहाँ रजिस्टर करें', 'Need an account? Register here', 'नवीन खाते हवे आहे? नोंदणी करा')}
              </button>
            </div>
          )}

          {/* Security Strip */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{getLabel('स्थायी सुरक्षित किसान सत्र (100% Secure)', 'Permanent Secure Session', 'सुरक्षित शेतकरी सत्र')}</span>
          </div>

        </div>

        {/* Bottom Feature Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black text-emerald-100">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-300" /> AI Doctor
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1">
            <Pill className="w-3.5 h-3.5 text-rose-300" /> Medicine Shop
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-green-300" /> 24/7 Sahayak
          </div>
        </div>

      </div>
    </div>
  );
}