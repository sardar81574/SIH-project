import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  IndianRupee,
  ChevronRight,
  Printer,
  Search,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../services/firebase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fallback demo orders agar database me naye orders na hon
  const demoOrders = [
    {
      id: "AG-88241",
      orderDateFormatted: "02 Sep 2026, 04:30 PM",
      deliveryDateFormatted: "05 Sep 2026",
      orderStatus: "Out for Delivery", // 'Confirmed' | 'Packed' | 'Out for Delivery' | 'Delivered'
      deliveryStep: 3, // 1 to 4
      customerName: localStorage.getItem("farmerName") || "Rameshwar Dhakad",
      contactPhone: "9876543210",
      deliveryAddress: "Near Village Primary School, Jamtara, Jabalpur, MP",
      pincode: "482001",
      paymentType: "online",
      paymentStatus: "PAID",
      totalPayable: 2630,
      deliveryAgent: {
        name: "Vikram Patel",
        phone: "9826012345",
        vehicle: "Agri-Express Van (MP-20-HA-4412)"
      },
      items: [
        {
          name: "Saaf Fungicide (Carbendazim + Mancozeb)",
          crop: "wheat",
          qty: 2,
          unitPrice: 780,
          subtotal: 1560
        },
        {
          name: "Emamectin Benzoate 5% SG (Proclaim)",
          crop: "chickpea",
          qty: 2,
          unitPrice: 480,
          subtotal: 960
        }
      ]
    },
    {
      id: "AG-87910",
      orderDateFormatted: "28 Aug 2026, 11:15 AM",
      deliveryDateFormatted: "31 Aug 2026",
      orderStatus: "Delivered",
      deliveryStep: 4,
      customerName: localStorage.getItem("farmerName") || "Rameshwar Dhakad",
      contactPhone: "9876543210",
      deliveryAddress: "Farm Barn No. 4, Jamtara, Jabalpur, MP",
      pincode: "482001",
      paymentType: "cod",
      paymentStatus: "PAID_ON_DELIVERY",
      totalPayable: 6800,
      deliveryAgent: {
        name: "Suresh Meena",
        phone: "9425098765",
        vehicle: "Agri Delivery Truck (MP-04-E-8891)"
      },
      items: [
        {
          name: "Kabuli Dollar Chana Certified Seeds",
          crop: "chickpea",
          qty: 1,
          unitPrice: 6800,
          subtotal: 6800
        }
      ]
    }
  ];

  // Real-time Firestore Listener
  useEffect(() => {
    setLoading(true);
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("orderDate", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map((d) => {
            const data = d.data();
            
            // Format order date
            let orderTimeStr = "Recent";
            if (data.orderDate && typeof data.orderDate.toDate === "function") {
              const dt = data.orderDate.toDate();
              orderTimeStr = dt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });
            }

            // Calculate estimated delivery date (+3 days)
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
              deliveryDateFormatted: deliveryTimeStr,
              deliveryStep: data.orderStatus === "Delivered" ? 4 : data.orderStatus === "Out for Delivery" ? 3 : 2,
              totalPayable: data.totalPayable || data.totalAmount || 0,
              items: data.items || []
            };
          });
          setOrders(fetched);
        } else {
          setOrders(demoOrders);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore sync fallback to mock:", err);
        setOrders(demoOrders);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter Search
  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.items?.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Tracking Stage Definition
  const trackingMilestones = [
    { step: 1, label: "Order Placed", desc: "Confirmed in system" },
    { step: 2, label: "Packed & Certified", desc: "Quality inspected" },
    { step: 3, label: "Out for Delivery", desc: "On delivery vehicle" },
    { step: 4, label: "Delivered", desc: "Handover completed" },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 font-sans pb-28">
      
      {/* 🌟 HEADER BANNER */}
      <div className="bg-slate-900 text-white py-9 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-400/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Live Consignment Logistics
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              My Orders & Live Shipment Tracker
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Track your certified seeds, agro-chemicals, and dispatch trucks from warehouse to farmgate.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Visit Marketplace</span>
          </Link>
        </div>
      </div>

      {/* 🌟 MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. AG-88241) or Product Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold outline-none py-1.5 pr-3 text-slate-800"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <RefreshCw className="w-7 h-7 text-slate-400 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading your shipments & consignments...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-base font-black text-slate-900">No Orders Found</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't ordered any certified seeds or crop protection medicines yet.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xs"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStep = order.deliveryStep || 2;
              const isDelivered = order.orderStatus === "Delivered" || currentStep === 4;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Top Bar: Order Info & Header */}
                  <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        <PackageCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-black text-slate-900">Order #{order.id}</h2>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}>
                            {order.orderStatus || "In Transit"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Placed on: {order.orderDateFormatted} • Payment: {order.paymentType === "online" ? "Prepaid Online" : "Cash on Delivery"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                        <span className="text-base font-black text-slate-900 block">
                          ₹{Number(order.totalPayable).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Receipt</span>
                      </button>
                    </div>
                  </div>

                  {/* 🌟 4-STAGE LIVE TRACKING PIPELINE */}
                  <div className="p-5 sm:p-7 border-b border-slate-100 space-y-6">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-800" />
                        <span className="font-black text-slate-900">
                          {isDelivered 
                            ? "Delivered successfully to farmgate" 
                            : `Estimated Farm Arrival: ${order.deliveryDateFormatted}`}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Stage {currentStep} of 4
                      </span>
                    </div>

                    {/* Progress Track Bar */}
                    <div className="relative">
                      {/* Connecting Line */}
                      <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -z-0">
                        <div
                          className="h-full bg-slate-900 transition-all duration-700"
                          style={{
                            width: `${((currentStep - 1) / (trackingMilestones.length - 1)) * 100}%`
                          }}
                        />
                      </div>

                      {/* Milestone Indicators */}
                      <div className="grid grid-cols-4 relative z-10 text-center">
                        {trackingMilestones.map((m) => {
                          const isDone = currentStep >= m.step;
                          const isCurrent = currentStep === m.step;

                          return (
                            <div key={m.step} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                                  isDone
                                    ? "bg-slate-900 text-white shadow-xs ring-4 ring-slate-100"
                                    : "bg-white border-2 border-slate-200 text-slate-300"
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : m.step}
                              </div>
                              <span className={`text-xs font-black mt-2 block ${isCurrent ? "text-slate-900" : isDone ? "text-slate-700" : "text-slate-400"}`}>
                                {m.label}
                              </span>
                              <span className="text-[10px] text-slate-400 hidden sm:block font-medium">
                                {m.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Dispatch Agent / Van Card */}
                    {order.deliveryAgent && !isDelivered && (
                      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-black text-emerald-950">Assigned Delivery Fleet</h3>
                            <p className="text-[11px] text-emerald-800 font-semibold">{order.deliveryAgent.vehicle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-emerald-950 font-bold self-end sm:self-auto">
                          <span>Driver: {order.deliveryAgent.name}</span>
                          <a
                            href={`tel:${order.deliveryAgent.phone}`}
                            className="bg-white border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 hover:bg-emerald-100/50 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Agent</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Consignment Items Breakdown */}
                  <div className="p-5 sm:p-6 grid sm:grid-cols-12 gap-6 items-start">
                    
                    {/* Item List */}
                    <div className="sm:col-span-8 space-y-3">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        Ordered Agricultural Products
                      </span>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-50/70 border border-slate-100 rounded-2xl text-xs"
                          >
                            <div>
                              <h4 className="font-black text-slate-900">{item.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Crop: {item.crop}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-600 block">
                                ₹{item.unitPrice} × {item.qty}
                              </span>
                              <span className="font-black text-slate-900 block">
                                ₹{(item.subtotal || item.unitPrice * item.qty).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="sm:col-span-4 p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-xs space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        Delivery Destination
                      </span>
                      <div className="space-y-1 text-slate-700">
                        <span className="font-black text-slate-900 block">{order.customerName}</span>
                        <p className="text-[11px] leading-relaxed text-slate-500">{order.deliveryAddress}</p>
                        <span className="text-[11px] font-mono text-slate-400 block">Pincode: {order.pincode}</span>
                        <span className="text-[11px] font-bold text-slate-600 block">Phone: {order.contactPhone}</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================================================
          PRINTABLE OFFICIAL INVOICE SLIP MODAL
      ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-slate-900" />
                <h3 className="text-base font-black text-slate-900">Consignment Invoice Slip</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Slip Body */}
            <div id="order-invoice" className="border-2 border-slate-900 rounded-2xl p-5 space-y-4 text-xs text-slate-900">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                <div>
                  <h4 className="text-base font-black uppercase">AgriScan Official Receipt</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Agricultural Input Consignment Delivery Note</p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <strong>Order #{selectedOrder.id}</strong>
                  <span className="block text-slate-500 text-[10px]">{selectedOrder.orderDateFormatted}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl">
                <div><strong>Farmer:</strong> {selectedOrder.customerName}</div>
                <div><strong>Phone:</strong> {selectedOrder.contactPhone}</div>
                <div className="col-span-2"><strong>Address:</strong> {selectedOrder.deliveryAddress} ({selectedOrder.pincode})</div>
              </div>

              <table className="w-full text-left text-[11px]">
                <thead className="border-b border-slate-300 font-bold bg-slate-100">
                  <tr>
                    <th className="p-1.5">Item</th>
                    <th className="p-1.5 text-center">Qty</th>
                    <th className="p-1.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((i, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="p-1.5">{i.name}</td>
                      <td className="p-1.5 text-center">{i.qty}</td>
                      <td className="p-1.5 text-right font-bold">₹{i.subtotal || i.unitPrice * i.qty}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="p-2 font-black">Grand Total:</td>
                    <td className="p-2 text-right font-black text-sm">₹{Number(selectedOrder.totalPayable).toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 border-t-2 border-slate-900 border-dashed grid grid-cols-2 gap-4 text-center text-[10px]">
                <div className="space-y-1">
                  <div className="h-8 border-b border-slate-400" />
                  <span>Customer Acknowledgment Signature</span>
                </div>
                <div className="space-y-1">
                  <div className="h-8 border-b border-slate-400" />
                  <span>Delivery Executive Sign & Timestamp</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}