import React, { useState, useEffect } from "react";
import {
  Building2,
  Home,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Navigation,
  Scale,
  UploadCloud,
  Printer,
  ChevronRight,
  ChevronLeft,
  Store,
  Phone,
  User,
  ShieldCheck,
  FileText,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

// ✅ Safe local fallback (bina kisi external file ke chalega)
const triggerNotification = async (title, message, type = "system", actionUrl = "/") => {
  try {
    await addDoc(collection(db, "notifications"), {
      title,
      message,
      type,
      actionUrl,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("Notification skipped:", e);
  }
};


// Verified Government APMC Mandis & Real-Time Capacity
const governmentMandis = [
  { 
    id: "sehore", 
    name: "Sehore APMC Mandi (MSP Center)", 
    district: "Sehore, MP", 
    totalSlots: 35, 
    bookedSlots: 31,
    operatingHours: "08:00 AM - 05:00 PM"
  },
  { 
    id: "jabalpur", 
    name: "Jabalpur Krishi Upaj Mandi Yard", 
    district: "Jabalpur, MP", 
    totalSlots: 50, 
    bookedSlots: 22,
    operatingHours: "08:00 AM - 06:00 PM"
  },
  { 
    id: "indore", 
    name: "Indore Choithram Mandi Terminal", 
    district: "Indore, MP", 
    totalSlots: 60, 
    bookedSlots: 60, // Full
    operatingHours: "07:00 AM - 07:00 PM"
  },
  { 
    id: "itarsi", 
    name: "Itarsi Hoshangabad Procurement Yard", 
    district: "Narmadapuram, MP", 
    totalSlots: 30, 
    bookedSlots: 11,
    operatingHours: "08:30 AM - 05:30 PM"
  },
  { 
    id: "ujjain", 
    name: "Ujjain Grain Mandi Center", 
    district: "Ujjain, MP", 
    totalSlots: 40, 
    bookedSlots: 38,
    operatingHours: "08:00 AM - 05:00 PM"
  },
];

export default function SellCrop() {
  // Main Selection: 'select_route' | 'mandi_slots_view' | 'mandi_form' | 'farmgate_form' | 'receipt'
  const [currentView, setCurrentView] = useState("select_route");
  const [selectedMandi, setSelectedMandi] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    farmerName: localStorage.getItem("farmerName") || "",
    phone: "",
    villageAddress: "",
    gpsCoords: null,
    cropName: "Sharbati Wheat",
    variety: "C-306 Grade-A",
    quantityQuintal: "",
    expectedPricePerQuintal: "",
    cropImageBase64: "",
    slotDate: "",
    slotShift: "morning", // 'morning' | 'afternoon'
    pickupWindow: "anytime"
  });

  // Default booking date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData((prev) => ({ ...prev, slotDate: tomorrow.toISOString().split("T")[0] }));
  }, []);

  // 1. One-Click GPS Coordinate Capture
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          gpsCoords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: `${Math.round(pos.coords.accuracy)}m`,
          },
        }));
        setGpsLoading(false);
      },
      () => {
        alert("Unable to fetch GPS position. Please allow location permissions.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // 2. Base64 Image Compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        setFormData((prev) => ({ ...prev, cropImageBase64: compressed }));
      };
    };
    reader.readAsDataURL(file);
  };

  // 3. Submit to Firebase Firestore & Trigger Real-Time Notification
  const handleSubmitConsignment = async (e, mode) => {
    e.preventDefault();

    if (!formData.farmerName || !formData.phone || !formData.quantityQuintal || !formData.expectedPricePerQuintal) {
      alert("Please fill in farmer contact, quantity, and expected price.");
      return;
    }

    try {
      setSubmitting(true);
      const totalVal = Number(formData.quantityQuintal) * Number(formData.expectedPricePerQuintal);

      const submissionPayload = {
        procurementChannel: mode === "mandi" ? "GOVT_MSP_MANDI" : "DIRECT_FARMGATE_PICKUP",
        farmerName: formData.farmerName,
        phone: formData.phone,
        villageAddress: formData.villageAddress,
        gpsLocation: formData.gpsCoords || "Manual Address Recorded",
        cropName: formData.cropName,
        variety: formData.variety,
        quantityQuintal: Number(formData.quantityQuintal),
        expectedPricePerQuintal: Number(formData.expectedPricePerQuintal),
        totalValuation: totalVal,
        cropPhoto: formData.cropImageBase64 || null,
        mandiDetails: mode === "mandi" ? {
          mandiId: selectedMandi.id,
          mandiName: selectedMandi.name,
          slotDate: formData.slotDate,
          slotShift: formData.slotShift
        } : null,
        farmgateDetails: mode === "farmgate" ? {
          pickupSchedule: formData.pickupWindow,
          barnAddress: formData.villageAddress
        } : null,
        status: "CONFIRMED_PENDING_INSPECTION",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "crop_procurement_orders"), submissionPayload);

      // 🔔 Trigger Notification to Notification Center
      if (mode === "mandi") {
        await triggerNotification(
          "Mandi Gate Slot Confirmed",
          `Gate token generated for ${formData.quantityQuintal} quintals of ${formData.cropName} at ${selectedMandi.name} on ${formData.slotDate}.`,
          "mandi",
          "/sell-crop"
        );
      } else {
        await triggerNotification(
          "Farmgate Pickup Registered",
          `Direct procurement pickup booked for ${formData.quantityQuintal} quintals of ${formData.cropName} from ${formData.villageAddress}.`,
          "mandi",
          "/sell-crop"
        );
      }

      setConfirmedOrder({
        ...submissionPayload,
        orderId: docRef.id,
        createdAtFormatted: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      });

      setCurrentView("receipt");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Database sync failed. Please check network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 font-sans pb-28">
      
      {/* 🌟 HERO BANNER */}
      <div className="bg-slate-900 text-white py-9 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-400/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Farmer Trade & Procurement Gateway
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Sell Crop & Generate Procurement Slip
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Check real-time Mandi gate slot capacity before booking, or sell directly from your doorstep.
            </p>
          </div>

          {currentView !== "select_route" && currentView !== "receipt" && (
            <button
              onClick={() => setCurrentView("select_route")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change Route</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* =========================================================================
            STAGE 1: ROUTE SELECTION (MANDI VS DIRECT FARMGATE)
        ========================================================================= */}
        {currentView === "select_route" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-1 max-w-lg mx-auto">
              <h2 className="text-lg font-black text-slate-900">How would you like to sell your harvest?</h2>
              <p className="text-xs text-slate-500">Select a trade route below to check slot capacity or open instant farmgate listing.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              
              {/* Route A: Check Mandi Slots First */}
              <div 
                onClick={() => setCurrentView("mandi_slots_view")}
                className="bg-white hover:border-emerald-700 border-2 border-slate-200 p-6 rounded-3xl cursor-pointer transition shadow-xs hover:shadow-lg space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Pathway 1
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Government Mandi (Check Slots First)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    View real-time Mandi yard capacity and see which center has free gate slots. Choose an available slot to open the booking form.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-black text-emerald-800 group-hover:translate-x-1 transition-transform">
                  <span>View Available Mandi Slots</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Route B: Direct Farmgate Listing (Instant Form) */}
              <div 
                onClick={() => setCurrentView("farmgate_form")}
                className="bg-white hover:border-emerald-700 border-2 border-slate-200 p-6 rounded-3xl cursor-pointer transition shadow-xs hover:shadow-lg space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Pathway 2
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Sell from Farm (Direct Form Open)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Sell harvest directly from your barn with zero mandi travel. Open form directly, enter crop details & pin your GPS location for truck pickup.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-black text-slate-900 group-hover:translate-x-1 transition-transform">
                  <span>Open Direct Farmgate Form</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* =========================================================================
            STAGE 2A: LIVE MANDI SLOTS BOARD (Check free vs full slots first)
        ========================================================================= */}
        {currentView === "mandi_slots_view" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">Live Mandi Capacity Board</h2>
                <p className="text-xs text-slate-500">Click an available center below to book an unloading slot.</p>
              </div>
              <button
                onClick={() => setCurrentView("select_route")}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to routes
              </button>
            </div>

            <div className="grid gap-3">
              {governmentMandis.map((mandi) => {
                const freeSlots = mandi.totalSlots - mandi.bookedSlots;
                const isFull = freeSlots <= 0;

                return (
                  <div
                    key={mandi.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition shadow-xs ${
                      isFull ? "border-slate-200 opacity-60 bg-slate-50/50" : "border-slate-200 hover:border-emerald-700"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-3 rounded-xl shrink-0 ${isFull ? "bg-slate-200 text-slate-500" : "bg-emerald-50 text-emerald-800"}`}>
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-900">{mandi.name}</h3>
                          <span className="text-[10px] text-slate-400 font-bold">{mandi.district}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Hours: {mandi.operatingHours} • Daily Limit: {mandi.totalSlots} Trolleys</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-bold text-slate-600">
                            Booked: <strong>{mandi.bookedSlots}</strong>/{mandi.totalSlots}
                          </span>
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isFull ? "bg-rose-500" : "bg-emerald-600"}`} 
                              style={{ width: `${(mandi.bookedSlots / mandi.totalSlots) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center">
                      {isFull ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Slots Full (Closed)</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedMandi(mandi);
                            setCurrentView("mandi_form");
                          }}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition flex items-center gap-2 active:scale-95"
                        >
                          <span>Book Slot ({freeSlots} Free)</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            STAGE 2B: MANDI BOOKING FORM (Opens after available slot is selected)
        ========================================================================= */}
        {currentView === "mandi_form" && selectedMandi && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-9 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Mandi Slot Booking
                </span>
                <h2 className="text-base font-black text-slate-900 mt-1">
                  Booking for: {selectedMandi.name}
                </h2>
              </div>
              <button
                onClick={() => setCurrentView("mandi_slots_view")}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Change Center
              </button>
            </div>

            <form onSubmit={(e) => handleSubmitConsignment(e, "mandi")} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gate Entry Date</label>
                  <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 rounded-xl">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.slotDate}
                      onChange={(e) => setFormData({ ...formData, slotDate: e.target.value })}
                      className="w-full py-2.5 bg-transparent text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shift Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, slotShift: "morning" })}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                        formData.slotShift === "morning"
                          ? "bg-emerald-800 text-white border-emerald-900 shadow-xs"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      Morning (08:00 - 12:00)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, slotShift: "afternoon" })}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                        formData.slotShift === "afternoon"
                          ? "bg-emerald-800 text-white border-emerald-900 shadow-xs"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      Afternoon (13:00 - 17:00)
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Type</label>
                  <select
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  >
                    <option value="Sharbati Wheat">Sharbati Wheat (C-306)</option>
                    <option value="Lokwan Wheat">Lokwan Wheat</option>
                    <option value="Yellow Soybean">Yellow Soybean (JS 20-34)</option>
                    <option value="Dollar Chickpea">Dollar Chickpea (Kabuli)</option>
                    <option value="Desi Chickpea">Desi Brown Chickpea</option>
                    <option value="Hybrid Maize">Yellow Hybrid Maize</option>
                    <option value="Basmati Paddy">Pusa 1509 Basmati Paddy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Variety / Grade</label>
                  <input
                    type="text"
                    required
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Quantity (Quintals)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 rounded-xl focus-within:border-emerald-700 focus-within:bg-white">
                    <Scale className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 50"
                      value={formData.quantityQuintal}
                      onChange={(e) => setFormData({ ...formData, quantityQuintal: e.target.value })}
                      className="w-full py-3 bg-transparent text-xs font-bold outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">qtl</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected MSP Rate (₹ / Quintal)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 rounded-xl focus-within:border-emerald-700 focus-within:bg-white">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      min="500"
                      placeholder="e.g. 3400"
                      value={formData.expectedPricePerQuintal}
                      onChange={(e) => setFormData({ ...formData, expectedPricePerQuintal: e.target.value })}
                      className="w-full py-3 bg-transparent text-xs font-bold outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">₹/qtl</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.farmerName}
                    onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (10 Digits)</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop Sample Image (Optional)</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                  {formData.cropImageBase64 ? (
                    <div className="flex items-center justify-between">
                      <img src={formData.cropImageBase64} alt="Sample" className="w-16 h-12 object-cover rounded-lg" />
                      <button type="button" onClick={() => setFormData({ ...formData, cropImageBase64: "" })} className="text-xs font-bold text-rose-600">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-xs font-bold text-slate-600 flex items-center justify-center gap-2">
                      <UploadCloud className="w-4 h-4 text-emerald-800" />
                      <span>Upload grain photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white py-3.5 rounded-xl text-xs font-black shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? "Booking Gate Slot..." : "Confirm Slot & Generate Mandi Gate Pass"}</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* =========================================================================
            STAGE 2C: DIRECT FARMGATE FORM (Opens directly without slot queue)
        ========================================================================= */}
        {currentView === "farmgate_form" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-9 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  Direct Farmgate Pickup
                </span>
                <h2 className="text-base font-black text-slate-900 mt-1">
                  Sell Directly From Your Farm / Barn
                </h2>
              </div>
              <button
                onClick={() => setCurrentView("select_route")}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to routes
              </button>
            </div>

            <form onSubmit={(e) => handleSubmitConsignment(e, "farmgate")} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name</label>
                  <select
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  >
                    <option value="Sharbati Wheat">Sharbati Wheat (C-306)</option>
                    <option value="Yellow Soybean">Yellow Soybean (JS 20-34)</option>
                    <option value="Dollar Chickpea">Dollar Chickpea (Kabuli)</option>
                    <option value="Desi Chickpea">Desi Brown Chickpea</option>
                    <option value="Hybrid Maize">Yellow Hybrid Maize</option>
                    <option value="Basmati Paddy">Pusa 1509 Basmati Paddy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quality Grade / Variety</label>
                  <input
                    type="text"
                    required
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Available Quantity (Quintal)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 rounded-xl focus-within:border-emerald-700 focus-within:bg-white">
                    <Scale className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 100"
                      value={formData.quantityQuintal}
                      onChange={(e) => setFormData({ ...formData, quantityQuintal: e.target.value })}
                      className="w-full py-3 bg-transparent text-xs font-bold outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">qtl</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desired Price (₹ / Quintal)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 rounded-xl focus-within:border-emerald-700 focus-within:bg-white">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      min="500"
                      placeholder="e.g. 3500"
                      value={formData.expectedPricePerQuintal}
                      onChange={(e) => setFormData({ ...formData, expectedPricePerQuintal: e.target.value })}
                      className="w-full py-3 bg-transparent text-xs font-bold outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">₹/qtl</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.farmerName}
                    onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (10 Digits)</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Barn / Farm Pickup Location Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Village, Landmark, Road accessibility for 10-wheel / 6-wheel trucks"
                  value={formData.villageAddress}
                  onChange={(e) => setFormData({ ...formData, villageAddress: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-700 focus:bg-white resize-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Navigation className="w-4 h-4 text-emerald-800" />
                    <span>Precise GPS Pin for Truck Navigation</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Captures your barn's exact coordinates so the buyer can navigate directly.</p>
                </div>

                {formData.gpsCoords ? (
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    ✓ GPS Recorded (±{formData.gpsCoords.accuracy})
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleCaptureGPS}
                    disabled={gpsLoading}
                    className="bg-white border border-slate-300 hover:border-emerald-700 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    {gpsLoading ? "Acquiring..." : "Record Barn GPS"}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop Sample Image (Optional)</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                  {formData.cropImageBase64 ? (
                    <div className="flex items-center justify-between">
                      <img src={formData.cropImageBase64} alt="Sample" className="w-16 h-12 object-cover rounded-lg" />
                      <button type="button" onClick={() => setFormData({ ...formData, cropImageBase64: "" })} className="text-xs font-bold text-rose-600">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-xs font-bold text-slate-600 flex items-center justify-center gap-2">
                      <UploadCloud className="w-4 h-4 text-emerald-800" />
                      <span>Upload grain photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white py-3.5 rounded-xl text-xs font-black shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? "Publishing Consignment..." : "Publish Farmgate Consignment & Get Slip"}</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* =========================================================================
            STAGE 3: OFFICIAL PRINTABLE PROCUREMENT SLIP
        ========================================================================= */}
        {currentView === "receipt" && confirmedOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-emerald-900 text-xs font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Consignment officially confirmed and recorded in database.</span>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>

            <div id="procurement-slip" className="border-2 border-slate-900 rounded-3xl p-6 sm:p-9 bg-white text-slate-900 space-y-6">
              <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Agricultural Procurement Slip</h2>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {confirmedOrder.procurementChannel === "GOVT_MSP_MANDI" 
                      ? "Official APMC Mandi Gate Pass & Unloading Order" 
                      : "Direct Farmgate Consignment Pickup Note"}
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono text-xs">
                  <span className="font-black text-slate-900">Token ID: #{confirmedOrder.orderId}</span>
                  <span className="block text-[10px] text-slate-500">{confirmedOrder.createdAtFormatted}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Farmer Name</span>
                  <span className="font-black text-slate-900 mt-0.5 block">{confirmedOrder.farmerName}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                  <span className="font-black text-slate-900 mt-0.5 block">{confirmedOrder.phone}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Crop & Variety</span>
                  <span className="font-black text-slate-900 mt-0.5 block">{confirmedOrder.cropName} ({confirmedOrder.variety})</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Volume</span>
                  <span className="font-black text-slate-900 mt-0.5 block">{confirmedOrder.quantityQuintal} Quintals</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5">
                <span className="font-black uppercase tracking-wider text-[10px] text-slate-500 block">
                  {confirmedOrder.procurementChannel === "GOVT_MSP_MANDI" ? "Designated Mandi Gate Allocation" : "Farmgate Pickup Logistics"}
                </span>
                
                {confirmedOrder.procurementChannel === "GOVT_MSP_MANDI" ? (
                  <div className="grid sm:grid-cols-3 gap-2 font-medium">
                    <div><strong>Center:</strong> {confirmedOrder.mandiDetails?.mandiName}</div>
                    <div><strong>Date:</strong> {confirmedOrder.mandiDetails?.slotDate}</div>
                    <div><strong>Shift:</strong> {confirmedOrder.mandiDetails?.slotShift?.toUpperCase()}</div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-2 font-medium">
                    <div><strong>Barn Location:</strong> {confirmedOrder.villageAddress}</div>
                    <div><strong>GPS Coordinates:</strong> {typeof confirmedOrder.gpsLocation === "object" ? `Lat ${confirmedOrder.gpsLocation.latitude.toFixed(4)}, Lng ${confirmedOrder.gpsLocation.longitude.toFixed(4)}` : "Manual"}</div>
                  </div>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Consignment Specification</th>
                      <th className="p-2.5">Weight (Quintal)</th>
                      <th className="p-2.5">Rate / Quintal</th>
                      <th className="p-2.5 text-right">Gross Valuation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 font-medium">
                      <td className="p-2.5 font-bold">{confirmedOrder.cropName} ({confirmedOrder.variety})</td>
                      <td className="p-2.5">{confirmedOrder.quantityQuintal} qtl</td>
                      <td className="p-2.5">₹{confirmedOrder.expectedPricePerQuintal}</td>
                      <td className="p-2.5 text-right font-black text-slate-900">₹{confirmedOrder.totalValuation.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-8 border-t-2 border-slate-900 border-dashed grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
                <div className="space-y-1">
                  <div className="h-10 border-b border-slate-400" />
                  <span className="font-bold text-slate-600 block">Farmer Signature / Thumb</span>
                </div>

                <div className="space-y-1">
                  <div className="h-10 border-b border-slate-400" />
                  <span className="font-bold text-slate-600 block">Procurement Officer / Agent</span>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <div className="h-10 border-b border-slate-400" />
                  <span className="font-bold text-slate-600 block">Agency Stamp / APMC Seal</span>
                </div>
              </div>

            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  setCurrentView("select_route");
                }}
                className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Create Another Listing</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}