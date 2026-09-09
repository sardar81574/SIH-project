import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle 
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  ShieldAlert, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  MapPin,
  RefreshCw,
  Search
} from "lucide-react";
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

// Custom Red Pulsing Marker for Infected Hotspots
const redHotspotIcon = new L.DivIcon({
  className: "custom-hotspot-pin",
  html: `<div class="relative flex items-center justify-center">
          <span class="absolute w-7 h-7 bg-rose-500 rounded-full animate-ping opacity-75"></span>
          <span class="relative w-4 h-4 bg-rose-600 border-2 border-white rounded-full shadow-lg"></span>
        </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function CropOutbreakRadar() {
  const { isDarkMode } = useTheme();
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedCropHotspot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState("all");

  // Center on default coordinate (e.g. Jabalpur/Sehore, MP)
  const defaultCenter = [22.7196, 75.8577];

  useEffect(() => {
    const q = query(collection(db, "crop_hotspots"), orderBy("reportedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Demo fallback data agar abhi DB me records kam hon
      if (docs.length === 0) {
        setHotspots([
          {
            id: "demo-hotspot-1",
            farmerName: "रमेश पटेल",
            phone: "9826012345",
            cropName: "गेहूं (Sharbati)",
            disease: "पीला रतुआ (Yellow Stripe Rust)",
            damagePercent: "48.5%",
            severity: "Critical",
            status: "PENDING_INSPECTION",
            location: { lat: 22.7220, lng: 75.8620 },
            recommendedChemical: "Tebuconazole 25.9% EC (Folicur)",
            reportedAt: "10 min ago"
          },
          {
            id: "demo-hotspot-2",
            farmerName: "सुनील धाकड़",
            phone: "9425098765",
            cropName: "चना (Dollar Chana)",
            disease: "घेंटी छेदक इल्ली (Helicoverpa)",
            damagePercent: "36.0%",
            severity: "High",
            status: "PENDING_INSPECTION",
            location: { lat: 22.7115, lng: 75.8490 },
            recommendedChemical: "Hamla 550 @ 35ml per pump",
            reportedAt: "25 min ago"
          }
        ]);
      } else {
        setHotspots(docs);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markVerified = async (id) => {
    try {
      await updateDoc(doc(db, "crop_hotspots", id), {
        status: "VERIFIED_BY_OFFICER",
        verifiedAt: new Date().toLocaleTimeString(),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = hotspots.filter(h => 
    filterSeverity === "all" ? true : h.severity?.toLowerCase() === filterSeverity.toLowerCase()
  );

  return (
    <div className={`w-full min-h-screen font-sans pb-20 ${
      isDarkMode ? "bg-[#070c18] text-white" : "bg-[#f8faf9] text-slate-900"
    }`}>
      
      {/* Top Header */}
      <div className={`p-6 border-b ${
        isDarkMode ? "bg-[#0b1329] border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black uppercase mb-1">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>KVK Field Inspector & Disease Radar</span>
            </div>
            <h1 className="text-2xl font-black">गंभीर फसल रोग प्रकोप रडार (Outbreak Map)</h1>
            <p className="text-xs text-slate-400">
              AI Leaf Scan dwara 30% se adhik kharab kheton ki live GPS locations aur spot verification.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2.5 rounded-2xl border text-center ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">कुल हॉटस्पॉट</span>
              <span className="text-xl font-black text-rose-600">{hotspots.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MAP VIEWPORT (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-xl min-h-[500px] relative z-10">
            <MapContainer 
              center={defaultCenter} 
              zoom={13} 
              scrollWheelZoom={true} 
              style={{ height: "100%", minHeight: "550px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={
                  isDarkMode 
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
              />

              {filtered.map((item) => (
                <React.Fragment key={item.id}>
                  {/* Danger Quarantine Radius (500 Meters) */}
                  <Circle
                    center={[item.location.lat, item.location.lng]}
                    radius={500}
                    pathOptions={{
                      color: "#e11d48",
                      fillColor: "#f43f5e",
                      fillOpacity: 0.25,
                      weight: 1.5,
                      dashArray: "4, 6"
                    }}
                  />

                  {/* Red Pin Marker */}
                  <Marker 
                    position={[item.location.lat, item.location.lng]} 
                    icon={redHotspotIcon}
                    eventHandlers={{
                      click: () => setSelectedCropHotspot(item)
                    }}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1 space-y-1 font-sans text-slate-900">
                        <span className="text-[9px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded block w-fit">
                          {item.severity} Outbreak ({item.damagePercent})
                        </span>
                        <h4 className="font-black text-xs mt-1">{item.cropName}</h4>
                        <p className="text-[11px] text-slate-600 font-bold">रोग: {item.disease}</p>
                        <p className="text-[10px] text-slate-500">किसान: {item.farmerName}</p>

                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center justify-center gap-1.5 w-full bg-slate-900 text-white text-[10px] font-black py-1.5 rounded-lg"
                        >
                          <Navigation className="w-3 h-3 text-emerald-400" />
                          <span>नेविगेशन शुरू करें (Drive)</span>
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              ))}
            </MapContainer>
          </div>

          {/* INSPECTION QUEUE & ACTIONS (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>निरीक्षण हेतु लंबित खेत ({filtered.length})</span>
              </h2>
              
              {/* Filter */}
              <div className="flex gap-1 text-[11px] font-bold">
                <button 
                  onClick={() => setFilterSeverity("all")} 
                  className={`px-2.5 py-1 rounded-lg border ${filterSeverity === "all" ? "bg-emerald-600 text-white border-emerald-600" : "bg-transparent border-slate-700 text-slate-400"}`}
                >
                  सभी
                </button>
                <button 
                  onClick={() => setFilterSeverity("critical")} 
                  className={`px-2.5 py-1 rounded-lg border ${filterSeverity === "critical" ? "bg-rose-600 text-white border-rose-600" : "bg-transparent border-slate-700 text-slate-400"}`}
                >
                  अति-गंभीर
                </button>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map((spot) => (
                <div 
                  key={spot.id} 
                  className={`p-4 rounded-2xl border transition shadow-sm ${
                    isDarkMode 
                      ? "bg-[#0b1329] border-slate-800 hover:border-slate-700" 
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded">
                        क्षति: {spot.damagePercent}
                      </span>
                      <h3 className="font-black text-sm mt-1">{spot.cropName}</h3>
                      <p className="text-xs font-bold text-rose-500 mt-0.5">{spot.disease}</p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {spot.reportedAt}
                    </span>
                  </div>

                  {/* Farmer Info & Recommended Chemical */}
                  <div className={`mt-3 p-2.5 rounded-xl text-xs space-y-1 ${
                    isDarkMode ? "bg-slate-900/60" : "bg-slate-50"
                  }`}>
                    <p className="text-slate-400">किसान: <strong className="text-white dark:text-slate-200">{spot.farmerName}</strong> ({spot.phone || "मोबाइल उपलब्ध"})</p>
                    <p className="text-slate-400">सटीक छिड़काव: <strong className="text-emerald-500">{spot.recommendedChemical}</strong></p>
                  </div>

                  {/* Actions for Checker */}
                  <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${spot.location.lat},${spot.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>कॉलम/खेत पर पहुंचें</span>
                    </a>

                    <button
                      onClick={() => markVerified(spot.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-black border transition ${
                        spot.status === "VERIFIED_BY_OFFICER"
                          ? "bg-slate-800 text-slate-500 border-slate-700"
                          : "bg-white/10 hover:bg-white/20 text-slate-300 border-white/15"
                      }`}
                    >
                      {spot.status === "VERIFIED_BY_OFFICER" ? "सत्यापित ✓" : "जांच पूर्ण करें"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}