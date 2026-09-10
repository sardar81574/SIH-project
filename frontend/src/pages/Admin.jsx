








// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   ShieldAlert,
//   ShieldCheck,
//   Package,
//   Store,
//   Bell,
//   Trash2,
//   CheckCircle2,
//   XCircle,
//   Eye,
//   RefreshCw,
//   Search,
//   Send,
//   MapPin,
//   Phone,
//   LogOut,
//   MessageSquare,
//   AlertTriangle,
//   Pill,
//   X
// } from "lucide-react";
// import { 
//   collection, 
//   onSnapshot, 
//   query, 
//   orderBy, 
//   doc, 
//   updateDoc, 
//   deleteDoc, 
//   addDoc, 
//   serverTimestamp 
// } from "firebase/firestore";
// import { auth, db } from "../services/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";

// // Authorized Super Admin Emails (Array)
// const AUTHORIZED_ADMIN_EMAILS = [
//   "sardardhakad81@gmail.com",
//   "katariyavishal74@gmail.com"
// ];

// export default function Admin() {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [authChecking, setAuthChecking] = useState(true);

//   // Tabs: 'crops' | 'orders' | 'community' | 'broadcast'
//   const [activeTab, setActiveTab] = useState("crops");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Data Collections
//   const [cropListings, setCropListings] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [communityChats, setCommunityChats] = useState([]);
//   const [broadcastAlerts, setBroadcastAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal for Grain/Chat Photos
//   const [previewImage, setPreviewImage] = useState(null);

//   // Broadcast Form
//   const [broadcastForm, setBroadcastForm] = useState({
//     title: "",
//     message: "",
//     type: "system",
//     actionUrl: "/"
//   });
//   const [sendingBroadcast, setSendingBroadcast] = useState(false);

//   // 1. Auth Guard
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//       setAuthChecking(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Robust Admin Permission Check
//   const isAuthorized = Boolean(
//     currentUser?.email &&
//       AUTHORIZED_ADMIN_EMAILS.some(
//         (email) => email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
//       )
//   );

//   // 2. Real-Time Data Sync
//   useEffect(() => {
//     if (!currentUser || !isAuthorized) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     // Mandi Consignments
//     const unsubCrops = onSnapshot(
//       query(collection(db, "crop_procurement_orders"), orderBy("createdAt", "desc")),
//       (snap) => setCropListings(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
//       (err) => console.warn("Crops sync error:", err)
//     );

//     // Store Orders
//     const unsubOrders = onSnapshot(
//       query(collection(db, "orders"), orderBy("orderDate", "desc")),
//       (snap) => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
//       (err) => console.warn("Orders sync error:", err)
//     );

//     // WhatsApp Community Chats
//     const unsubChats = onSnapshot(
//       query(collection(db, "community_chats"), orderBy("createdAt", "desc")),
//       (snap) => setCommunityChats(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
//       (err) => console.warn("Community sync error:", err)
//     );

//     // Notifications
//     const unsubAlerts = onSnapshot(
//       query(collection(db, "notifications"), orderBy("createdAt", "desc")),
//       (snap) => {
//         setBroadcastAlerts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//         setLoading(false);
//       },
//       (err) => {
//         console.warn("Alerts sync error:", err);
//         setLoading(false);
//       }
//     );

//     return () => {
//       unsubCrops();
//       unsubOrders();
//       unsubChats();
//       unsubAlerts();
//     };
//   }, [currentUser, isAuthorized]);

//   // Operations
//   const handleUpdateStatus = async (collectionName, id, field, value) => {
//     try {
//       await updateDoc(doc(db, collectionName, id), { [field]: value });
//     } catch (err) {
//       alert(`Update failed: ${err.message}`);
//     }
//   };

//   const handleDeleteRecord = async (collectionName, id, label = "record") => {
//     if (window.confirm(`Are you sure you want to permanently delete this ${label}?`)) {
//       try {
//         await deleteDoc(doc(db, collectionName, id));
//       } catch (err) {
//         alert(`Deletion error: ${err.message}`);
//       }
//     }
//   };

//   const handleSendBroadcast = async (e) => {
//     e.preventDefault();
//     if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) return;

//     try {
//       setSendingBroadcast(true);
//       await addDoc(collection(db, "notifications"), {
//         title: broadcastForm.title.trim(),
//         message: broadcastForm.message.trim(),
//         type: broadcastForm.type,
//         actionUrl: broadcastForm.actionUrl.trim() || "/",
//         isRead: false,
//         createdAt: serverTimestamp()
//       });
//       setBroadcastForm({ title: "", message: "", type: "system", actionUrl: "/" });
//       alert("Notification broadcasted successfully.");
//     } catch (err) {
//       alert(`Broadcast failed: ${err.message}`);
//     } finally {
//       setSendingBroadcast(false);
//     }
//   };

//   // Auth Loading
//   if (authChecking) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
//         <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
//         <p className="text-xs font-bold text-slate-400">Verifying Admin Credentials...</p>
//       </div>
//     );
//   }

//   // Access Denied Screen
//   if (!currentUser || !isAuthorized) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
//         <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
//           <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
//             <ShieldAlert className="w-8 h-8" />
//           </div>
//           <div>
//             <h1 className="text-xl font-black text-rose-400">Restricted Panel</h1>
//             <p className="text-xs text-slate-400 mt-2 leading-relaxed">
//               This master panel is locked to:
//             </p>
//             <div className="mt-2 space-y-1">
//               {AUTHORIZED_ADMIN_EMAILS.map((email) => (
//                 <span key={email} className="block text-[11px] font-mono text-emerald-300 bg-black/40 px-2 py-1 rounded">
//                   {email}
//                 </span>
//               ))}
//             </div>
//             {currentUser && (
//               <p className="text-[11px] text-rose-300 mt-3">
//                 Current login: <strong>{currentUser.email}</strong> (Unauthorized)
//               </p>
//             )}
//           </div>
//           <div className="pt-2 flex flex-col gap-2">
//             {!currentUser ? (
//               <Link to="/login" className="bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold transition">
//                 Sign In as Admin
//               </Link>
//             ) : (
//               <button onClick={() => signOut(auth).then(() => navigate("/login"))} className="bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold transition">
//                 Switch Account
//               </button>
//             )}
//             <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition">
//               Back to Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans pb-24">
      
//       {/* HEADER BAR */}
//       <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
//               <ShieldCheck className="w-5 h-5" />
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-sm sm:text-base font-black text-white">AgriScan Master Control</h1>
//                 <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
//                   Root Admin
//                 </span>
//               </div>
//               <p className="text-[10px] text-slate-400 font-mono">{currentUser.email}</p>
//             </div>
//           </div>

//           <button
//             onClick={() => signOut(auth).then(() => navigate("/login"))}
//             className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold transition"
//           >
//             <LogOut className="w-3.5 h-3.5" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
//         {/* 4 METRIC STRIP CARDS */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
//           <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
//             <div>
//               <span className="text-[11px] font-bold text-slate-400 uppercase">Crop Listings</span>
//               <span className="text-2xl font-black text-white block mt-0.5">{cropListings.length}</span>
//             </div>
//             <Store className="w-7 h-7 text-emerald-400 opacity-80" />
//           </div>

//           <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
//             <div>
//               <span className="text-[11px] font-bold text-slate-400 uppercase">Orders</span>
//               <span className="text-2xl font-black text-white block mt-0.5">{orders.length}</span>
//             </div>
//             <Package className="w-7 h-7 text-blue-400 opacity-80" />
//           </div>

//           <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
//             <div>
//               <span className="text-[11px] font-bold text-slate-400 uppercase">Community Chats</span>
//               <span className="text-2xl font-black text-white block mt-0.5">{communityChats.length}</span>
//             </div>
//             <MessageSquare className="w-7 h-7 text-purple-400 opacity-80" />
//           </div>

//           <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
//             <div>
//               <span className="text-[11px] font-bold text-slate-400 uppercase">Alerts Pushed</span>
//               <span className="text-2xl font-black text-white block mt-0.5">{broadcastAlerts.length}</span>
//             </div>
//             <Bell className="w-7 h-7 text-amber-400 opacity-80" />
//           </div>
//         </div>

//         {/* ACTION BAR & TABS */}
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
//           <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
//             {[
//               { id: "crops", label: "Crop Consignments", count: cropListings.length, icon: Store },
//               { id: "orders", label: "Marketplace Orders", count: orders.length, icon: Package },
//               { id: "community", label: "Area Group Chats", count: communityChats.length, icon: MessageSquare },
//               { id: "broadcast", label: "Broadcast Alerts", count: broadcastAlerts.length, icon: Bell }
//             ].map(tab => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
//                     activeTab === tab.id
//                       ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
//                       : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
//                   }`}
//                 >
//                   <Icon className="w-3.5 h-3.5" />
//                   <span>{tab.label} ({tab.count})</span>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="relative w-full sm:w-64">
//             <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
//             <input
//               type="text"
//               placeholder="Search records..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 outline-none focus:border-emerald-500"
//             />
//           </div>
//         </div>

//         {/* TAB 1: CROPS & MANDI LISTINGS */}
//         {activeTab === "crops" && (
//           <div className="space-y-3">
//             {cropListings
//               .filter(c => 
//                 c.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 c.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 c.id?.toLowerCase().includes(searchTerm.toLowerCase())
//               )
//               .map(crop => (
//                 <div key={crop.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm font-black text-white">{crop.cropName} ({crop.variety || "Grade-A"})</span>
//                         <span className="text-[10px] font-mono bg-black/40 text-slate-400 px-2 py-0.5 rounded">
//                           #{crop.id.slice(0, 8)}
//                         </span>
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
//                           crop.status === "APPROVED"
//                             ? "bg-emerald-500/20 text-emerald-400"
//                             : crop.status === "REJECTED"
//                             ? "bg-rose-500/20 text-rose-400"
//                             : "bg-amber-500/20 text-amber-400"
//                         }`}>
//                           {crop.status || "CONFIRMED"}
//                         </span>
//                       </div>
//                       <p className="text-[11px] text-slate-400 mt-0.5">
//                         Farmer: <strong className="text-slate-200">{crop.farmerName}</strong> • Phone: {crop.phone} • Channel: {crop.procurementChannel}
//                       </p>
//                     </div>

//                     <div className="text-left sm:text-right">
//                       <span className="text-[10px] text-slate-400 font-bold uppercase block">Valuation</span>
//                       <span className="text-sm font-black text-emerald-400">
//                         ₹{Number(crop.totalValuation || 0).toLocaleString("en-IN")} ({crop.quantityQuintal} qtl)
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
//                     <span className="text-[11px] text-slate-400 flex items-center gap-1">
//                       <MapPin className="w-3.5 h-3.5 text-emerald-400" />
//                       <span>{crop.villageAddress || "Address provided"}</span>
//                     </span>

//                     <div className="flex items-center gap-2">
//                       {crop.cropPhoto && (
//                         <button
//                           onClick={() => setPreviewImage(crop.cropPhoto)}
//                           className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1"
//                         >
//                           <Eye className="w-3 h-3" /> Photo
//                         </button>
//                       )}

//                       <button
//                         onClick={() => handleUpdateStatus("crop_procurement_orders", crop.id, "status", "APPROVED")}
//                         className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
//                       >
//                         Approve
//                       </button>

//                       <button
//                         onClick={() => handleUpdateStatus("crop_procurement_orders", crop.id, "status", "REJECTED")}
//                         className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
//                       >
//                         Reject
//                       </button>

//                       <button
//                         onClick={() => handleDeleteRecord("crop_procurement_orders", crop.id, "consignment")}
//                         className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* TAB 2: STORE ORDERS */}
//         {activeTab === "orders" && (
//           <div className="space-y-3">
//             {orders
//               .filter(o => 
//                 o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 o.id?.toLowerCase().includes(searchTerm.toLowerCase())
//               )
//               .map(order => (
//                 <div key={order.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm font-black text-white">Order #{order.id.slice(0, 8)}</span>
//                         <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
//                           {order.orderStatus || "In Transit"}
//                         </span>
//                         <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
//                           {order.paymentType === "online" ? "PREPAID" : "COD"}
//                         </span>
//                       </div>
//                       <p className="text-[11px] text-slate-400 mt-0.5">
//                         Buyer: <strong className="text-slate-200">{order.customerName}</strong> • Phone: {order.contactPhone}
//                       </p>
//                     </div>

//                     <div className="text-left sm:text-right">
//                       <span className="text-[10px] text-slate-400 font-bold uppercase block">Total</span>
//                       <span className="text-sm font-black text-white">
//                         ₹{Number(order.totalPayable || order.totalAmount || 0).toLocaleString("en-IN")}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="text-xs text-slate-300 space-y-1">
//                     {order.items?.map((item, idx) => (
//                       <span key={idx} className="inline-block bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md mr-1.5 mb-1">
//                         {item.name} × {item.qty}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
//                     <span className="text-[11px] text-slate-400">
//                       Address: {order.deliveryAddress} ({order.pincode})
//                     </span>

//                     <div className="flex items-center gap-1.5">
//                       <button
//                         onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Packed & Certified")}
//                         className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold transition"
//                       >
//                         Packed
//                       </button>
//                       <button
//                         onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Out for Delivery")}
//                         className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
//                       >
//                         Dispatch
//                       </button>
//                       <button
//                         onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Delivered")}
//                         className="bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
//                       >
//                         Delivered
//                       </button>
//                       <button
//                         onClick={() => handleDeleteRecord("orders", order.id, "order")}
//                         className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
//                       >
//                         <Trash2 className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* TAB 3: WHATSAPP COMMUNITY CHATS */}
//         {activeTab === "community" && (
//           <div className="space-y-3">
//             {communityChats
//               .filter(msg => 
//                 msg.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 msg.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
//               )
//               .map(msg => (
//                 <div key={msg.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3">
//                   <div className="space-y-1 text-xs">
//                     <div className="flex items-center gap-2">
//                       <strong className="text-emerald-400">{msg.senderName}</strong>
//                       <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
//                         {msg.groupName || msg.groupId}
//                       </span>
//                     </div>

//                     <p className="text-slate-200 leading-relaxed font-medium">{msg.message}</p>

//                     {(msg.diseaseTag || msg.medicineTag) && (
//                       <div className="flex items-center gap-2 pt-1">
//                         {msg.diseaseTag && (
//                           <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
//                             रोग: {msg.diseaseTag}
//                           </span>
//                         )}
//                         {msg.medicineTag && (
//                           <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
//                             दवा: {msg.medicineTag}
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     {msg.image && (
//                       <button
//                         onClick={() => setPreviewImage(msg.image)}
//                         className="mt-2 block border border-slate-800 rounded-xl overflow-hidden"
//                       >
//                         <img src={msg.image} alt="Upload" className="w-16 h-16 object-cover" />
//                       </button>
//                     )}
//                   </div>

//                   <button
//                     onClick={() => handleDeleteRecord("community_chats", msg.id, "chat message")}
//                     className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg self-end sm:self-center transition"
//                     title="Delete Message"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* TAB 4: BROADCAST ENGINE */}
//         {activeTab === "broadcast" && (
//           <div className="grid lg:grid-cols-12 gap-6 items-start">
//             <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
//               <div>
//                 <h3 className="text-sm font-black text-white flex items-center gap-2">
//                   <Send className="w-4 h-4 text-emerald-400" />
//                   <span>Push Broadcast Alert</span>
//                 </h3>
//                 <p className="text-[11px] text-slate-400 mt-0.5">Sends notification instantly to all farmers.</p>
//               </div>

//               <form onSubmit={handleSendBroadcast} className="space-y-3">
//                 <div>
//                   <label className="block text-[11px] font-bold text-slate-400 mb-1">Alert Category</label>
//                   <select
//                     value={broadcastForm.type}
//                     onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
//                     className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-200 outline-none"
//                   >
//                     <option value="system">System / Announcement</option>
//                     <option value="mandi">Mandi Slot Open</option>
//                     <option value="disease">Disease Warning</option>
//                     <option value="weather">Weather Radar Alert</option>
//                     <option value="order">Marketplace Promotion</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-[11px] font-bold text-slate-400 mb-1">Headline</label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. Yellow Rust Warning in MP"
//                     value={broadcastForm.title}
//                     onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
//                     className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-200 outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[11px] font-bold text-slate-400 mb-1">Details</label>
//                   <textarea
//                     rows={3}
//                     required
//                     placeholder="Provide actionable advisory for farmers..."
//                     value={broadcastForm.message}
//                     onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
//                     className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 outline-none resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[11px] font-bold text-slate-400 mb-1">Redirect Path</label>
//                   <input
//                     type="text"
//                     placeholder="/crop-doctor or /marketplace"
//                     value={broadcastForm.actionUrl}
//                     onChange={(e) => setBroadcastForm({ ...broadcastForm, actionUrl: e.target.value })}
//                     className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 outline-none"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={sendingBroadcast}
//                   className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
//                 >
//                   <Send className="w-3.5 h-3.5" />
//                   <span>{sendingBroadcast ? "Pushing..." : "Send Broadcast"}</span>
//                 </button>
//               </form>
//             </div>

//             <div className="lg:col-span-7 space-y-2.5">
//               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
//                 Active Broadcast Alerts ({broadcastAlerts.length})
//               </span>

//               {broadcastAlerts.map(alert => (
//                 <div key={alert.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3 text-xs">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase font-bold">
//                         {alert.type}
//                       </span>
//                       <strong className="text-white">{alert.title}</strong>
//                     </div>
//                     <p className="text-slate-400 mt-1">{alert.message}</p>
//                   </div>

//                   <button
//                     onClick={() => handleDeleteRecord("notifications", alert.id, "alert")}
//                     className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
//                   >
//                     <Trash2 className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//       </main>

//       {/* IMAGE PREVIEW MODAL */}
//       {previewImage && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-lg w-full space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-xs font-bold text-slate-300">Attached Photo</span>
//               <button onClick={() => setPreviewImage(null)} className="text-slate-400 hover:text-white">
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//             <img src={previewImage} alt="Preview" className="w-full max-h-80 object-contain rounded-xl bg-black" />
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }














import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  ShieldCheck,
  Package,
  Store,
  Bell,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Send,
  MapPin,
  Phone,
  LogOut,
  MessageSquare,
  Tractor,
  IndianRupee,
  Calendar,
  Layers,
  X
} from "lucide-react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

// Authorized Super Admin Emails
const AUTHORIZED_ADMIN_EMAILS = [
  "sardardhakad81@gmail.com",
  "katariyavishal74@gmail.com"
];

// 10 Dynamic Shifting Color Palettes
const dynamicLightColors = [
  "#f0fdf4", "#eff6ff", "#fefce8", "#fdf4ff", "#f0fdfa",
  "#fff7ed", "#faf5ff", "#ecfeff", "#f7fee7", "#f8fafc",
];

const dynamicDarkColors = [
  "#061412", "#091224", "#141206", "#14081c", "#041416",
  "#1c0e06", "#0f091f", "#06141a", "#0c1606", "#080c14",
];

export default function Admin() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { lang } = useLanguage();

  const [colorIndex, setColorIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Tabs: 'crops' | 'orders' | 'rent' | 'community' | 'broadcast'
  const [activeTab, setActiveTab] = useState("crops");
  const [searchTerm, setSearchTerm] = useState("");

  // Firebase Live Collections State
  const [cropListings, setCropListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentEquipments, setRentEquipments] = useState([]);
  const [communityChats, setCommunityChats] = useState([]);
  const [broadcastAlerts, setBroadcastAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Image Preview
  const [previewImage, setPreviewImage] = useState(null);

  // Broadcast Alert Form
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    type: "system",
    actionUrl: "/"
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // 1-Sec Color Rotation Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Auth Guard Verification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const isAuthorized = Boolean(
    currentUser?.email &&
      AUTHORIZED_ADMIN_EMAILS.some(
        (email) => email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
      )
  );

  // 2. Real-Time Multi-Collection Firestore Sync
  useEffect(() => {
    if (!currentUser || !isAuthorized) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Crop Procurement Listings
    const unsubCrops = onSnapshot(
      query(collection(db, "crop_procurement_orders"), orderBy("createdAt", "desc")),
      (snap) => setCropListings(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("Crops sync error:", err)
    );

    // 2. Store Orders
    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("orderDate", "desc")),
      (snap) => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("Orders sync error:", err)
    );

    // 3. Rent Listings (Tractor/Drone)
    const unsubRent = onSnapshot(
      query(collection(db, "rent_listings"), orderBy("createdAt", "desc")),
      (snap) => setRentEquipments(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("Rent sync error:", err)
    );

    // 4. Community Chats
    const unsubChats = onSnapshot(
      query(collection(db, "community_chats"), orderBy("createdAt", "desc")),
      (snap) => setCommunityChats(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("Community sync error:", err)
    );

    // 5. Notifications / Broadcasts
    const unsubAlerts = onSnapshot(
      query(collection(db, "notifications"), orderBy("createdAt", "desc")),
      (snap) => {
        setBroadcastAlerts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.warn("Alerts sync error:", err);
        setLoading(false);
      }
    );

    return () => {
      unsubCrops();
      unsubOrders();
      unsubRent();
      unsubChats();
      unsubAlerts();
    };
  }, [currentUser, isAuthorized]);

  // Master Control Operations
  const handleUpdateStatus = async (collectionName, id, field, value) => {
    try {
      await updateDoc(doc(db, collectionName, id), { [field]: value });
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeleteRecord = async (collectionName, id, label = "record") => {
    if (window.confirm(`Are you sure you want to permanently remove this ${label} from database?`)) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        alert(`Deletion error: ${err.message}`);
      }
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) return;

    try {
      setSendingBroadcast(true);
      await addDoc(collection(db, "notifications"), {
        title: broadcastForm.title.trim(),
        message: broadcastForm.message.trim(),
        type: broadcastForm.type,
        actionUrl: broadcastForm.actionUrl.trim() || "/",
        isRead: false,
        createdAt: serverTimestamp()
      });
      setBroadcastForm({ title: "", message: "", type: "system", actionUrl: "/" });
      alert("✅ Broadcast notification pushed to all farmer screens!");
    } catch (err) {
      alert(`Broadcast failed: ${err.message}`);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const activeBgColor = isDarkMode ? dynamicDarkColors[colorIndex] : dynamicLightColors[colorIndex];

  // Auth Loading Screen
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#041416] flex flex-col items-center justify-center p-4 text-white">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-400">Verifying Admin Permissions...</p>
      </div>
    );
  }

  // Unauthorized Screen
  if (!currentUser || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#060c14] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-rose-400">Master Control Restricted</h1>
            <p className="text-xs text-slate-400 mt-2">
              This master dashboard is reserved only for verified system administrators:
            </p>
            <div className="mt-3 space-y-1">
              {AUTHORIZED_ADMIN_EMAILS.map((email) => (
                <span key={email} className="block text-[11px] font-mono text-emerald-300 bg-black/40 px-2.5 py-1 rounded-lg">
                  {email}
                </span>
              ))}
            </div>
            {currentUser && (
              <p className="text-[11px] text-rose-300 mt-3">
                Logged in as: <strong>{currentUser.email}</strong> (Unauthorized)
              </p>
            )}
          </div>
          <div className="pt-2 flex flex-col gap-2">
            {!currentUser ? (
              <Link to="/login" className="bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black transition">
                Sign In as Admin
              </Link>
            ) : (
              <button 
                onClick={() => signOut(auth).then(() => navigate("/login"))} 
                className="bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-black transition cursor-pointer"
              >
                Switch Account
              </button>
            )}
            <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition">
              Back to App
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ backgroundColor: activeBgColor }}
      className={`min-h-screen font-sans pb-24 transition-colors duration-1000 ease-in-out ${
        isDarkMode ? "text-white" : "text-slate-900"
      }`}
    >
      
      {/* 🌟 1. MASTER ADMIN NAVBAR */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-500 shadow-xs ${
        isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black">SmartFarmer Master Control</h1>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-black uppercase">
                  Root Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/"
              className="text-xs font-bold text-slate-400 hover:text-emerald-500 px-3 py-1.5 transition hidden sm:inline"
            >
              View Farmer Site ➔
            </Link>
            <button
              onClick={() => signOut(auth).then(() => navigate("/login"))}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* 🌟 2. METRIC DASHBOARD CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className={`border p-4 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-xs ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
          }`}>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Crop Listings</span>
              <span className="text-2xl font-black block mt-0.5">{cropListings.length}</span>
            </div>
            <Store className="w-6 h-6 text-emerald-500 opacity-80" />
          </div>

          <div className={`border p-4 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-xs ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
          }`}>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Store Orders</span>
              <span className="text-2xl font-black block mt-0.5">{orders.length}</span>
            </div>
            <Package className="w-6 h-6 text-cyan-500 opacity-80" />
          </div>

          <div className={`border p-4 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-xs ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
          }`}>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Equipment Fleet</span>
              <span className="text-2xl font-black block mt-0.5">{rentEquipments.length}</span>
            </div>
            <Tractor className="w-6 h-6 text-amber-500 opacity-80" />
          </div>

          <div className={`border p-4 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-xs ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
          }`}>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Community Chats</span>
              <span className="text-2xl font-black block mt-0.5">{communityChats.length}</span>
            </div>
            <MessageSquare className="w-6 h-6 text-purple-500 opacity-80" />
          </div>

          <div className={`col-span-2 lg:col-span-1 border p-4 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-xs ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
          }`}>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Alerts Pushed</span>
              <span className="text-2xl font-black block mt-0.5">{broadcastAlerts.length}</span>
            </div>
            <Bell className="w-6 h-6 text-rose-500 opacity-80" />
          </div>
        </div>

        {/* 🌟 3. MASTER TABS BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "crops", label: "Mandi Listings", count: cropListings.length, icon: Store },
              { id: "orders", label: "Store Orders", count: orders.length, icon: Package },
              { id: "rent", label: "Tractor & Drones", count: rentEquipments.length, icon: Tractor },
              { id: "community", label: "Community Feed", count: communityChats.length, icon: MessageSquare },
              { id: "broadcast", label: "Broadcast Engine", count: broadcastAlerts.length, icon: Bell }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-md"
                      : isDarkMode 
                        ? "bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-white" 
                        : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label} ({tab.count})</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search across all records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border pl-9 pr-3 py-1.5 rounded-xl text-xs font-semibold outline-none transition ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* 🌟 TAB 1: CROPS & MANDI CONSIGNMENTS */}
        {activeTab === "crops" && (
          <div className="space-y-3">
            {cropListings
              .filter(c => 
                (c.farmerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.cropName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.id || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(crop => (
                <div 
                  key={crop.id} 
                  className={`border rounded-2xl p-4 space-y-3 backdrop-blur-md transition shadow-xs ${
                    isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">{crop.cropName} ({crop.variety || "Grade-A"})</span>
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                          #{crop.id.slice(0, 8)}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          crop.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : crop.status === "REJECTED"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {crop.status || "PENDING"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Farmer: <strong className={isDarkMode ? "text-slate-200" : "text-slate-800"}>{crop.farmerName}</strong> • 
                        Phone: {crop.phone} • 
                        Channel: {crop.procurementChannel || "Local Mandi"}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Valuation</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ₹{Number(crop.totalValuation || 0).toLocaleString("en-IN")} ({crop.quantityQuintal} Quintal)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{crop.villageAddress || "Village address recorded"}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {crop.cropPhoto && (
                        <button
                          onClick={() => setPreviewImage(crop.cropPhoto)}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> Photo
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateStatus("crop_procurement_orders", crop.id, "status", "APPROVED")}
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("crop_procurement_orders", crop.id, "status", "REJECTED")}
                        className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleDeleteRecord("crop_procurement_orders", crop.id, "mandi consignment")}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 🌟 TAB 2: STORE ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders
              .filter(o => 
                (o.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.id || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(order => (
                <div 
                  key={order.id} 
                  className={`border rounded-2xl p-4 space-y-3 backdrop-blur-md transition shadow-xs ${
                    isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">Order #{order.id.slice(0, 8)}</span>
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded">
                          {order.orderStatus || "Confirmed"}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                          {order.paymentType === "online" ? "PREPAID" : "CASH ON DELIVERY"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Farmer: <strong className={isDarkMode ? "text-slate-200" : "text-slate-800"}>{order.customerName}</strong> • Phone: {order.contactPhone}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Payable</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ₹{Number(order.totalPayable || order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="text-xs space-y-1">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="inline-block bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md mr-1.5 mb-1 font-semibold">
                        {item.name} × {item.qty} (₹{item.unitPrice})
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Destination: {order.deliveryAddress} ({order.pincode})
                    </span>

                    {/* Order Delivery Status Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Packed & Certified")}
                        className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Packed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Out for Delivery")}
                        className="bg-cyan-600/20 text-cyan-600 dark:text-cyan-300 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Dispatch
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Delivered")}
                        className="bg-emerald-600/20 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => handleDeleteRecord("orders", order.id, "order")}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 🌟 TAB 3: TRACTOR & DRONE RENT FLEET */}
        {activeTab === "rent" && (
          <div className="space-y-3">
            {rentEquipments
              .filter(e => 
                (e.ownerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (e.village || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (e.equipmentType || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(machine => (
                <div 
                  key={machine.id}
                  className={`border rounded-2xl p-4 space-y-3 backdrop-blur-md transition shadow-xs ${
                    isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black">{machine.ownerName}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-bold">
                          {machine.equipmentType || "Tractor"}
                        </span>
                        {machine.isDroneAvailable && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-500 px-2 py-0.5 rounded font-bold">
                            Drone Spray Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Location: {machine.village} • Contact: {machine.phone} • GPS: {machine.latitude}, {machine.longitude}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Rental Rates</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ₹{machine.ratePerHour}/hr {machine.isDroneAvailable && `• Drone: ₹${machine.droneSprayRate}/acre`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <p className="text-[11px] text-slate-400">
                      <strong>Implements Included:</strong> {machine.implements || "Cultivator, Rotavator"}
                    </p>

                    <button
                      onClick={() => handleDeleteRecord("rent_listings", machine.id, "equipment listing")}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 🌟 TAB 4: COMMUNITY GROUP CHATS */}
        {activeTab === "community" && (
          <div className="space-y-3">
            {communityChats
              .filter(msg => 
                (msg.senderName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (msg.message || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (msg.groupName || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(msg => (
                <div 
                  key={msg.id} 
                  className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3 backdrop-blur-md shadow-xs ${
                    isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
                  }`}
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-600 dark:text-emerald-400">{msg.senderName}</strong>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                        {msg.groupName || msg.groupId || "General Kisan Chaupal"}
                      </span>
                    </div>

                    <p className="leading-relaxed font-medium">{msg.message}</p>

                    {(msg.diseaseTag || msg.medicineTag) && (
                      <div className="flex items-center gap-2 pt-1">
                        {msg.diseaseTag && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded">
                            रोग: {msg.diseaseTag}
                          </span>
                        )}
                        {msg.medicineTag && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded">
                            दवा: {msg.medicineTag}
                          </span>
                        )}
                      </div>
                    )}

                    {msg.image && (
                      <button
                        onClick={() => setPreviewImage(msg.image)}
                        className="mt-2 block border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden cursor-pointer"
                      >
                        <img src={msg.image} alt="Upload" className="w-16 h-16 object-cover" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteRecord("community_chats", msg.id, "chat message")}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg self-end sm:self-center transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* 🌟 TAB 5: BROADCAST ENGINE */}
        {activeTab === "broadcast" && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className={`lg:col-span-5 border p-5 rounded-2xl space-y-4 backdrop-blur-md shadow-xs ${
              isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
            }`}>
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-500" />
                  <span>Push Broadcast Alert to App</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Sends real-time notification to all active farmers.</p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Alert Category</label>
                  <select
                    value={broadcastForm.type}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
                    className={`w-full border p-2.5 rounded-xl text-xs font-bold outline-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option value="system">System / Announcement</option>
                    <option value="mandi">Mandi Slot Open</option>
                    <option value="disease">Disease Outbreak Warning</option>
                    <option value="weather">Weather Radar Alert</option>
                    <option value="order">Marketplace Discount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. चना व गेहूं पर पीला रतुआ चेतावनी"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className={`w-full border p-2.5 rounded-xl text-xs font-bold outline-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Message Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="किसानों के लिए सटीक सलाह दर्ज करें..."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    className={`w-full border p-2.5 rounded-xl text-xs outline-none resize-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Redirect URL Path</label>
                  <input
                    type="text"
                    placeholder="/crop-doctor ya /marketplace"
                    value={broadcastForm.actionUrl}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, actionUrl: e.target.value })}
                    className={`w-full border p-2.5 rounded-xl text-xs outline-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingBroadcast}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingBroadcast ? "Pushing Alert..." : "Broadcast Alert"}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Broadcast Alerts ({broadcastAlerts.length})
              </span>

              {broadcastAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`border rounded-xl p-3 flex items-start justify-between gap-3 text-xs backdrop-blur-md shadow-xs ${
                    isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">
                        {alert.type}
                      </span>
                      <strong className={isDarkMode ? "text-white" : "text-slate-900"}>{alert.title}</strong>
                    </div>
                    <p className="text-slate-400 mt-1">{alert.message}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord("notifications", alert.id, "alert")}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 🌟 4. ATTACHED PHOTO PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Attached Consignment Image</span>
              <button onClick={() => setPreviewImage(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={previewImage} alt="Preview" className="w-full max-h-80 object-contain rounded-2xl bg-black" />
            <button
              onClick={() => setPreviewImage(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-black cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}