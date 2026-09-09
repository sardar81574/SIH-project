import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { 
  Tractor, 
  Phone, 
  MapPin, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Navigation, 
  IndianRupee, 
  Crosshair,
  MessageCircle,
  Wind
} from "lucide-react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

export default function CropRentMarketplace() {
  const { t } = useLanguage();
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [gpsLoading, setGpsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    village: "",
    equipmentType: "Tractor (ट्रैक्टर)",
    implements: "रोटावेटर, कल्टीवेटर",
    ratePerHour: "",
    isDroneAvailable: false,
    droneSprayRate: "",
    latitude: 22.7196,
    longitude: 75.8577
  });

  // 1. Fetch Real-Time Listings from Firebase
  useEffect(() => {
    const q = query(collection(db, "rent_listings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setListings(docs);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Owner's Live GPS Location
  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: Number(pos.coords.latitude.toFixed(5)),
            longitude: Number(pos.coords.longitude.toFixed(5))
          }));
          setGpsLoading(false);
        },
        (err) => {
          alert("GPS लोकेशन नहीं मिल सकी। लोकेशन परमिशन ऑन करें।");
          setGpsLoading(false);
        }
      );
    }
  };

  // 3. Save Listing to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.phone || !formData.ratePerHour) {
      alert("कृपया नाम, मोबाइल नंबर और किराया दर भरें!");
      return;
    }

    try {
      await addDoc(collection(db, "rent_listings"), {
        ...formData,
        ratePerHour: Number(formData.ratePerHour),
        droneSprayRate: formData.isDroneAvailable ? Number(formData.droneSprayRate || 0) : 0,
        createdAt: serverTimestamp()
      });
      alert("✅ आपकी कृषि उपकरण सेवा सफलतापूर्वक दर्ज हो गई है!");
      setShowModal(false);
      setFormData({
        ownerName: "",
        phone: "",
        village: "",
        equipmentType: "Tractor (ट्रैक्टर)",
        implements: "रोटावेटर, कल्टीवेटर",
        ratePerHour: "",
        isDroneAvailable: false,
        droneSprayRate: "",
        latitude: 22.7196,
        longitude: 75.8577
      });
    } catch (err) {
      console.error("Listing error:", err);
      alert("डेटा सेव करने में समस्या आई।");
    }
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchSearch = item.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.implements?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === "drone") return matchSearch && item.isDroneAvailable;
    if (filterType === "tractor") return matchSearch && !item.isDroneAvailable;
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 text-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-2">
              <Tractor className="w-4 h-4" />
              <span>किसान कृषि रेंट केंद्र (Custom Hiring)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">ट्रैक्टर, ड्रोन व उपकरण रेंट सेवा</h1>
            <p className="text-xs md:text-sm text-emerald-100 mt-1">
              अपने खेत की जुताई, बुवाई व ड्रोन स्प्रे के लिए नजदीकी किसान साथी को सीधे कॉल करें।
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-3 rounded-2xl text-xs md:text-sm font-black shadow-lg transition active:scale-95 shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <span>अपनी मशीन/ट्रैक्टर किराए पर जोड़ें</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="गांव, नाम या उपकरण खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black border transition ${
                filterType === "all" ? "bg-emerald-600 text-white border-emerald-500" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800"
              }`}
            >
              सभी उपकरण
            </button>
            <button
              onClick={() => setFilterType("drone")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black border transition ${
                filterType === "drone" ? "bg-cyan-600 text-white border-cyan-500" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800"
              }`}
            >
              केवल ड्रोन (दवा स्प्रे)
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Tractor className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-400">अभी कोई उपकरण दर्ज नहीं है। अपनी मशीन सबसे पहले जोड़ें!</p>
            </div>
          ) : (
            filteredListings.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-black text-base flex items-center gap-1.5">
                        <span>{item.ownerName}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{item.village || "मध्य प्रदेश"}</span>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-xs">
                      {item.equipmentType}
                    </span>
                  </div>

                  {/* Pricing Cards */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">ट्रैक्टर किराया</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{item.ratePerHour}/घंटा</span>
                      </span>
                    </div>

                    {item.isDroneAvailable ? (
                      <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl border border-cyan-200 dark:border-cyan-800">
                        <span className="text-[10px] text-cyan-500 font-bold block uppercase flex items-center gap-1">
                          <Wind className="w-3 h-3" /> ड्रोन स्प्रे
                        </span>
                        <span className="text-sm font-black text-cyan-600 dark:text-cyan-300 flex items-center">
                          <IndianRupee className="w-3.5 h-3.5" />
                          <span>{item.droneSprayRate}/एकड़</span>
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <span className="text-[10px] text-slate-400 font-bold">ड्रोन नहीं है</span>
                      </div>
                    )}
                  </div>

                  {/* Implements / Samaan List */}
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                    <strong className="text-amber-700 dark:text-amber-400 block mb-1">साथ में उपलब्ध उपकरण (सामान):</strong>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold">{item.implements || "रोटावेटर, कल्टीवेटर"}</p>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <a
                    href={`tel:${item.phone}`}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>कॉल करें</span>
                  </a>

                  <a
                    href={`https://wa.me/91${item.phone}?text=नमस्ते ${item.ownerName} जी, मुझे आपके ट्रैक्टर/ड्रोन की खेत में आवश्यकता है।`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition active:scale-95"
                    title="व्हाट्सएप पर बात करें"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {item.latitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl transition active:scale-95"
                      title="खेत की लोकेशन मैप पर देखें"
                    >
                      <Navigation className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Kisan Equipment Registration Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 my-8">
              
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-base font-black">अपने उपकरण रेंट पर दर्ज करें</h2>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-black px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
                >
                  बंद करें ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
                
                <div>
                  <label className="text-slate-400 block mb-1">किसान का पूरा नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. रामेश्वर पटेल"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">मोबाइल नंबर (कॉलिंग) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10 अंकों का नंबर"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">गांव व तहसील *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. सिहोरा, जबलपुर"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">मुख्य वाहन/मशीन</label>
                    <select
                      value={formData.equipmentType}
                      onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-emerald-500"
                    >
                      <option>Tractor (ट्रैक्टर)</option>
                      <option>Mini Tractor (छोटा ट्रैक्टर)</option>
                      <option>Harvester (हार्वेस्टर)</option>
                      <option>Power Tiller (पावर टिलर)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">किराया दर (₹ प्रति घंटा) *</label>
                    <input
                      type="number"
                      required
                      placeholder="उदा. 800"
                      value={formData.ratePerHour}
                      onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">साथ में क्या-क्या सामान/उपकरण हैं?</label>
                  <input
                    type="text"
                    placeholder="उदा. 7 फीट रोटावेटर, 9 तवे का कल्टीवेटर, सीड ड्रिल, ट्रॉली"
                    value={formData.implements}
                    onChange={(e) => setFormData({ ...formData, implements: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Drone Special Toggle */}
                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-800/60 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDroneAvailable}
                      onChange={(e) => setFormData({ ...formData, isDroneAvailable: e.target.checked })}
                      className="w-4 h-4 accent-cyan-600 rounded"
                    />
                    <span className="font-bold text-cyan-800 dark:text-cyan-300">
                      क्या आपके पास दवा छिड़काव वाला कृषि ड्रोन भी है?
                    </span>
                  </label>

                  {formData.isDroneAvailable && (
                    <div className="mt-2">
                      <label className="text-slate-400 block mb-1">ड्रोन स्प्रे किराया (₹ प्रति एकड़)</label>
                      <input
                        type="number"
                        placeholder="उदा. 400 प्रति एकड़"
                        value={formData.droneSprayRate}
                        onChange={(e) => setFormData({ ...formData, droneSprayRate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-slate-950 outline-none text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Live GPS Location Capture */}
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-2xl flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold block">खेत की लाइव GPS लोकेशन</span>
                    <span className="text-[10px] text-slate-400">
                      Lat: {formData.latitude}, Lng: {formData.longitude}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black transition active:scale-95 disabled:opacity-50"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                    <span>{gpsLoading ? "लोकेशन ले रहे हैं..." : "वर्तमान GPS लें"}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>सेवा तुरंत लिस्ट करें</span>
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}