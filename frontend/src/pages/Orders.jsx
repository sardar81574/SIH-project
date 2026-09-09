import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Printer,
  Search,
  ArrowRight,
  Phone,
  RefreshCw,
  X,
  IndianRupee
} from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

// 10 Dynamic Shifting Color Palettes (Matching Dashboard)
const dynamicLightColors = [
  "#f0fdf4", "#eff6ff", "#fefce8", "#fdf4ff", "#f0fdfa",
  "#fff7ed", "#faf5ff", "#ecfeff", "#f7fee7", "#f8fafc",
];

const dynamicDarkColors = [
  "#061412", "#091224", "#141206", "#14081c", "#041416",
  "#1c0e06", "#0f091f", "#06141a", "#0c1606", "#080c14",
];

export default function Orders() {
  const { isDarkMode } = useTheme();
  const { lang, t } = useLanguage();

  const [colorIndex, setColorIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1-Sec Color Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getLabel = (hi, en, mr) => {
    if (lang === "mr") return mr || hi;
    if (lang === "en") return en;
    return hi;
  };

  // Demo Orders Fallback
  const demoOrders = [
    {
      id: "AG-88241",
      orderDateFormatted: "02 Sep 2026",
      deliveryDateFormatted: "05 Sep 2026",
      orderStatus: "Out for Delivery",
      customerName: localStorage.getItem("farmerName") || "Rameshwar Dhakad",
      contactPhone: "9876543210",
      deliveryAddress: "Near Village Primary School, Jamtara, Jabalpur, MP",
      pincode: "482001",
      paymentType: "online",
      totalPayable: 2520,
      deliveryAgent: {
        name: "Vikram Patel",
        phone: "9826012345",
        vehicle: "Agri-Express (MP-20-HA-4412)"
      },
      items: [
        {
          name: "Saaf Fungicide (Carbendazim + Mancozeb)",
          crop: "Wheat (गेहूं)",
          qty: 2,
          unitPrice: 780,
          subtotal: 1560
        },
        {
          name: "Emamectin Benzoate 5% SG (Proclaim)",
          crop: "Gram (चना)",
          qty: 2,
          unitPrice: 480,
          subtotal: 960
        }
      ]
    },
    {
      id: "AG-87910",
      orderDateFormatted: "28 Aug 2026",
      deliveryDateFormatted: "31 Aug 2026",
      orderStatus: "Delivered",
      customerName: localStorage.getItem("farmerName") || "Rameshwar Dhakad",
      contactPhone: "9876543210",
      deliveryAddress: "Farm Barn No. 4, Jamtara, Jabalpur, MP",
      pincode: "482001",
      paymentType: "cod",
      totalPayable: 6800,
      deliveryAgent: {
        name: "Suresh Meena",
        phone: "9425098765",
        vehicle: "Agri Delivery Truck (MP-04-E-8891)"
      },
      items: [
        {
          name: "Kabuli Dollar Chana Certified Seeds",
          crop: "Gram (काबुली चना)",
          qty: 1,
          unitPrice: 6800,
          subtotal: 6800
        }
      ]
    }
  ];

  // Firestore Real-Time Orders Sync
  useEffect(() => {
    setLoading(true);
    let unsubscribe = () => {};

    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("orderDate", "desc"));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot && !snapshot.empty) {
            const fetched = snapshot.docs.map((d) => {
              const data = d.data() || {};
              let orderTimeStr = "Recent";

              if (data.orderDate && typeof data.orderDate.toDate === "function") {
                orderTimeStr = data.orderDate.toDate().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                });
              } else if (typeof data.orderDate === "string") {
                orderTimeStr = data.orderDate;
              }

              const deliveryDt = new Date();
              deliveryDt.setDate(deliveryDt.getDate() + 3);
              const deliveryTimeStr = deliveryDt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });

              return {
                id: d.id,
                ...data,
                orderDateFormatted: orderTimeStr,
                deliveryDateFormatted: data.deliveryDateFormatted || deliveryTimeStr,
                totalPayable: data.totalPayable || data.totalAmount || 0,
                items: Array.isArray(data.items) ? data.items : []
              };
            });
            setOrders(fetched);
          } else {
            setOrders(demoOrders);
          }
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore listener fallback to demo data:", err);
          setOrders(demoOrders);
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn("Firestore init fallback:", err);
      setOrders(demoOrders);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const idMatch = (o.id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const itemMatch = o.items && o.items.some((i) => (i.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    return idMatch || itemMatch;
  });

  const activeBgColor = isDarkMode ? dynamicDarkColors[colorIndex] : dynamicLightColors[colorIndex];

  return (
    <div
      style={{ backgroundColor: activeBgColor }}
      className={`min-h-screen p-4 sm:p-7 font-sans pb-28 transition-colors duration-1000 ease-in-out ${
        isDarkMode ? "text-white" : "text-slate-900"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1. Header Banner */}
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-500 backdrop-blur-md ${
          isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200 text-slate-900"
        }`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>{getLabel("कृषि इनपुट व ऑर्डर ट्रैकिंग", "Agri Input Consignments", "कृषी इनपुट व ऑर्डर ट्रॅकिंग")}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {getLabel("मेरे ऑर्डर", "My Orders", "माझ्या ऑर्डर्स")}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {getLabel(
                "बीज, खाद व दवाइयों के ऑर्डर की लाइव स्थिति व इनवॉइस पर्ची देखें",
                "Track your certified seeds, chemicals, and equipment delivery to farmgate",
                "बियाणे, खते आणि औषधांच्या ऑर्डरची स्थिती आणि पावती पहा"
              )}
            </p>
          </div>

          <Link
            to="/marketplace"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{getLabel("नई दवाइयां/बीज खरीदें", "Buy More Products", "नवीन औषधे/बियाणे खरेदी करा")}</span>
          </Link>
        </div>

        {/* 2. Search Bar */}
        <div className={`flex items-center gap-3 p-3 rounded-2xl border shadow-xs backdrop-blur-sm ${
          isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/90 border-slate-200"
        }`}>
          <Search className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
          <input
            type="text"
            placeholder={getLabel(
              "ऑर्डर आईडी (उदा. AG-88241) या दवाई का नाम खोजें...",
              "Search by Order ID (e.g. AG-88241) or Product Name...",
              "ऑर्डर आयडी किंवा औषधाचे नाव शोधा..."
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold outline-none"
          />
        </div>

        {/* 3. Orders List (Amazon Style) */}
        {loading ? (
          <div className={`text-center py-16 rounded-3xl border ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <RefreshCw className="w-7 h-7 text-emerald-500 animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400">
              {getLabel("ऑर्डर लोड हो रहे हैं...", "Loading orders...", "ऑर्डर्स लोड होत आहेत...")}
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={`text-center py-16 rounded-3xl border space-y-3 ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
            <h3 className="text-sm font-black">
              {getLabel("कोई ऑर्डर नहीं मिला", "No Orders Found", "कोणतीही ऑर्डर आढळली नाही")}
            </h3>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs"
            >
              <span>{getLabel("मंडी देखें", "Explore Marketplace", "बाजारपेठ पहा")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isDelivered = order.orderStatus === "Delivered";

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl border shadow-sm overflow-hidden backdrop-blur-md transition hover:shadow-md ${
                    isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  {/* Amazon Style Header Strip */}
                  <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
                    isDarkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}>
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold block">
                          {getLabel("ऑर्डर दिनांक", "ORDER PLACED", "ऑर्डर तारीख")}
                        </span>
                        <span className={`font-black ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                          {order.orderDateFormatted}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold block">
                          {getLabel("कुल राशि", "TOTAL", "एकूण रक्कम")}
                        </span>
                        <span className={`font-black flex items-center ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                          <IndianRupee className="w-3 h-3" />
                          <span>{Number(order.totalPayable).toLocaleString("en-IN")}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold block">
                          {getLabel("डिलीवरी का पता", "SHIP TO", "पत्ता")}
                        </span>
                        <span className={`font-black truncate max-w-[160px] block ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                          {order.customerName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                        #{order.id}
                      </span>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          isDarkMode
                            ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                            : "bg-white hover:bg-slate-100 border-slate-300 text-slate-800"
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{getLabel("पर्ची / इनवॉइस", "Invoice", "पावती")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Body: Delivery Status & Product Items */}
                  <div className="p-5 space-y-4">
                    
                    {/* Status Ribbon (Fixed Ternary Expression) */}
                    <div className="flex items-center gap-2">
                      {isDelivered ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Truck className="w-5 h-5 text-cyan-500 animate-pulse shrink-0" />
                      )}
                      <div>
                        <h3 className={`text-sm font-black ${isDelivered ? "text-emerald-500" : "text-cyan-500"}`}>
                          {isDelivered
                            ? getLabel("सफलतापूर्वक डिलीवर हो गया", "Delivered Successfully", "यशस्वीरित्या वितरित केले")
                            : getLabel(
                                `रास्ते में है (अनुमानित: ${order.deliveryDateFormatted})`,
                                `On the way (Arriving: ${order.deliveryDateFormatted})`,
                                `मार्गावर आहे (अंदाजे: ${order.deliveryDateFormatted})`
                              )}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {order.paymentType === "online" ? "Prepaid (ऑनलाइन भुगतान किया)" : "Cash on Delivery (डिलीवरी पर नकद)"}
                        </p>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-3 pt-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isDarkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black">{item.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                {getLabel("फसल", "Crop", "पीक")}: {item.crop}
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right text-xs">
                            <span className="text-slate-400 font-bold block">
                              ₹{item.unitPrice} × {item.qty}
                            </span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400 block">
                              ₹{(item.subtotal || item.unitPrice * item.qty).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Agent Contact */}
                    {order.deliveryAgent && !isDelivered && (
                      <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                        isDarkMode ? "bg-cyan-950/30 border-cyan-800/60 text-cyan-200" : "bg-cyan-50 border-cyan-200 text-cyan-950"
                      }`}>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-cyan-500 shrink-0" />
                          <div>
                            <span className="font-black block">{order.deliveryAgent.name} ({order.deliveryAgent.vehicle})</span>
                            <span className="text-[10px] opacity-80">{order.deliveryAddress}</span>
                          </div>
                        </div>

                        <a
                          href={`tel:${order.deliveryAgent.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white font-black text-xs flex items-center gap-1 shadow-xs hover:bg-cyan-500 transition shrink-0"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{getLabel("कॉल करें", "Call", "कॉल करा")}</span>
                        </a>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. Printable Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm uppercase tracking-wide">AgriScan Official Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Details */}
            <div className="border border-slate-200 rounded-2xl p-4 text-xs space-y-3 bg-slate-50">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <h4 className="font-black text-slate-900">AgriScan Pathology & Logistics</h4>
                  <p className="text-[10px] text-slate-500">Certified Agro-Input Delivery Note</p>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <strong>#{selectedOrder.id}</strong>
                  <span className="block text-slate-400">{selectedOrder.orderDateFormatted}</span>
                </div>
              </div>

              <div className="text-[11px] space-y-0.5">
                <p><strong>{getLabel("किसान", "Farmer", "शेतकरी")}:</strong> {selectedOrder.customerName} ({selectedOrder.contactPhone})</p>
                <p><strong>{getLabel("पता", "Address", "पत्ता")}:</strong> {selectedOrder.deliveryAddress} - {selectedOrder.pincode}</p>
              </div>

              <table className="w-full text-left text-[11px] pt-2">
                <thead className="border-b font-bold text-slate-500">
                  <tr>
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items && selectedOrder.items.map((i, idx) => (
                    <tr key={idx} className="border-b border-slate-200/60">
                      <td className="py-1.5">{i.name}</td>
                      <td className="py-1.5 text-center">{i.qty}</td>
                      <td className="py-1.5 text-right font-bold">₹{i.subtotal || i.unitPrice * i.qty}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="py-2 font-black">Total Paid:</td>
                    <td className="py-2 text-right font-black text-sm text-emerald-700">
                      ₹{Number(selectedOrder.totalPayable).toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t ? t("cancel") : "Close"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{getLabel("प्रिंट करें", "Print Slip", "प्रिंट करा")}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}