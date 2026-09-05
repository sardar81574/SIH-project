import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  User, 
  Camera, 
  MapPin, 
  Phone, 
  Sprout, 
  LandPlot, 
  Edit3, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';

export default function Profile() {
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Farmer Profile State
  const [profile, setProfile] = useState({
    name: 'Ram Singh',
    tagline: 'प्रगतिशील किसान (Progressive Farmer)',
    phone: '+91 98765 43210',
    location: 'Gram Pipariya, Jabalpur, Madhya Pradesh',
    totalLand: '8.5 Acres',
    soilType: 'Black Soil (काली मिट्टी)',
    irrigationType: 'Tubewell & Drip (नलकूप व ड्रिप)',
    primaryCrops: 'Soybean, Wheat, Mustard',
    kisanCreditCard: 'Active (KCC Verified)',
    experience: '12+ Years',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
  });

  // 1. Fetch Profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'farmers', 'ram_singh_default');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(prev => ({
            ...prev,
            ...data,
            name: data.name || prev.name,
            location: data.location || prev.location,
            avatarUrl: data.avatarUrl || prev.avatarUrl
          }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Handle Image Upload & Local Preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Save Updated Profile to Firestore
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const docRef = doc(db, 'farmers', 'ram_singh_default');
      await setDoc(docRef, profile, { merge: true });
      
      // Update local storage name for sync
      localStorage.setItem('farmerName', profile.name);
      
      setIsEditing(false);
      setSuccessMsg('प्रोफाइल सफलतापूर्वक अपडेट हो गई है!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Save profile error:", err);
      alert('प्रोफाइल सेव करने में समस्या आई।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-28 md:pb-10 font-sans px-2 sm:px-4">
      
      {/* 🌟 Header & Action Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Verified Farmer Profile
          </div>
          <h2 className="text-2xl font-black text-gray-900 mt-0.5 tracking-tight">किसान प्रोफाइल</h2>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              document.getElementById('profile-form-submit')?.click();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={saving}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
            isEditing 
              ? 'bg-[#1b5e20] hover:bg-[#154a19] text-white' 
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isEditing ? (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile (सेव करें)</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile (बदलें)</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 🌟 Main Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Avatar & Hero Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left pb-6 border-b border-gray-100">
          <div className="relative group">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-emerald-50 shadow-md"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-[#1b5e20] hover:bg-[#154a19] text-white p-2.5 rounded-2xl shadow-lg transition active:scale-90"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">{profile.name}</h3>
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3" /> आधार व KCC सत्यापित
              </span>
            </div>

            <p className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg w-fit mx-auto sm:mx-0">
              {profile.tagline}
            </p>

            <p className="text-xs text-gray-500 font-semibold flex items-center justify-center sm:justify-start gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{profile.location}</span>
            </p>
          </div>
        </div>

        {/* 🌟 Profile Form / Details Grid */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <button id="profile-form-submit" type="submit" className="hidden" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
            
            {/* Name */}
            <div>
              <label className="block mb-1 text-gray-500">किसान का पूरा नाम (Full Name)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none focus:border-emerald-700 focus:bg-white transition"
                  required
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-extrabold flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{profile.name}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-gray-500">मोबाइल नंबर (Mobile Number)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none focus:border-emerald-700 focus:bg-white transition"
                  required
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-extrabold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>

            {/* Village / Location */}
            <div className="sm:col-span-2">
              <label className="block mb-1 text-gray-500">गाँव व जिला (Village & District)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none focus:border-emerald-700 focus:bg-white transition"
                  required
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-extrabold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Total Land */}
            <div>
              <label className="block mb-1 text-gray-500">कुल कृषि भूमि (Total Land Area)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.totalLand}
                  onChange={(e) => setProfile({ ...profile, totalLand: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none focus:border-emerald-700 focus:bg-white transition"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-extrabold flex items-center gap-2">
                  <LandPlot className="w-4 h-4 text-amber-700" />
                  <span>{profile.totalLand}</span>
                </div>
              )}
            </div>

            {/* Soil Type */}
            <div>
              <label className="block mb-1 text-gray-500">मिट्टी का प्रकार (Soil Type)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.soilType}
                  onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none focus:border-emerald-700 focus:bg-white transition"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-extrabold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-700" />
                  <span>{profile.soilType}</span>
                </div>
              )}
            </div>

            {/* Primary Crops */}
            <div className="sm:col-span-2">
              <label className="block mb-1 text-gray-500">मुख्य फसलें (Primary Crops)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.primaryCrops}
                  onChange={(e) => setProfile({ ...profile, primaryCrops: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 outline-none focus:border-emerald-700 focus:bg-white transition"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-900 font-extrabold flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>{profile.primaryCrops}</span>
                </div>
              )}
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}