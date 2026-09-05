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
  AlertTriangle,
  Pill,
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

const AUTHORIZED_ADMIN_EMAIL = "sardardhakad81@gmail.com";

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Tabs: 'crops' | 'orders' | 'community' | 'broadcast'
  const [activeTab, setActiveTab] = useState("crops");
  const [searchTerm, setSearchTerm] = useState("");

  // Data Collections
  const [cropListings, setCropListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [communityChats, setCommunityChats] = useState([]);
  const [broadcastAlerts, setBroadcastAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for Grain/Chat Photos
  const [previewImage, setPreviewImage] = useState(null);

  // Broadcast Form
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    type: "system",
    actionUrl: "/"
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // 1. Auth Guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-Time Data Sync
  useEffect(() => {
    if (!currentUser || currentUser.email !== AUTHORIZED_ADMIN_EMAIL) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Mandi Consignments
    const unsubCrops = onSnapshot(
      query(collection(db, "crop_procurement_orders"), orderBy("createdAt", "desc")),
      (snap) => setCropListings(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("Crops sync error:", err)
    );

    // Store Orders
    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("orderDate", "desc")),
      (snap) => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("Orders sync error:", err)
    );

    // WhatsApp Community Chats
    const unsubChats = onSnapshot(
      query(collection(db, "community_chats"), orderBy("createdAt", "desc")),
      (snap) => setCommunityChats(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("Community sync error:", err)
    );

    // Notifications
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
      unsubChats();
      unsubAlerts();
    };
  }, [currentUser]);

  // Operations
  const handleUpdateStatus = async (collectionName, id, field, value) => {
    try {
      await updateDoc(doc(db, collectionName, id), { [field]: value });
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDeleteRecord = async (collectionName, id, label = "record") => {
    if (window.confirm(`Are you sure you want to permanently delete this ${label}?`)) {
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
      alert("Notification broadcasted successfully.");
    } catch (err) {
      alert(`Broadcast failed: ${err.message}`);
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Auth Loading
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-400">Verifying Admin Credentials...</p>
      </div>
    );
  }

  // Access Denied Screen
  if (!currentUser || currentUser.email !== AUTHORIZED_ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-rose-400">Restricted Panel</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This master panel is locked to <strong className="text-slate-200">{AUTHORIZED_ADMIN_EMAIL}</strong>.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            {!currentUser ? (
              <Link to="/login" className="bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold transition">
                Sign In as Admin
              </Link>
            ) : (
              <button onClick={() => signOut(auth).then(() => navigate("/login"))} className="bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold transition">
                Switch Account
              </button>
            )}
            <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans pb-24">
      
      {/* 🌟 HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white">AgriScan Master Control</h1>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                  Root Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut(auth).then(() => navigate("/login"))}
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* 🌟 4 METRIC STRIP CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Crop Listings</span>
              <span className="text-2xl font-black text-white block mt-0.5">{cropListings.length}</span>
            </div>
            <Store className="w-7 h-7 text-emerald-400 opacity-80" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Orders</span>
              <span className="text-2xl font-black text-white block mt-0.5">{orders.length}</span>
            </div>
            <Package className="w-7 h-7 text-blue-400 opacity-80" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Community Chats</span>
              <span className="text-2xl font-black text-white block mt-0.5">{communityChats.length}</span>
            </div>
            <MessageSquare className="w-7 h-7 text-purple-400 opacity-80" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Alerts Pushed</span>
              <span className="text-2xl font-black text-white block mt-0.5">{broadcastAlerts.length}</span>
            </div>
            <Bell className="w-7 h-7 text-amber-400 opacity-80" />
          </div>
        </div>

        {/* 🌟 ACTION BAR & TABS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "crops", label: "Crop Consignments", count: cropListings.length, icon: Store },
              { id: "orders", label: "Marketplace Orders", count: orders.length, icon: Package },
              { id: "community", label: "Area Group Chats", count: communityChats.length, icon: MessageSquare },
              { id: "broadcast", label: "Broadcast Alerts", count: broadcastAlerts.length, icon: Bell }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label} ({tab.count})</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 🌟 TAB 1: CROPS & MANDI LISTINGS */}
        {activeTab === "crops" && (
          <div className="space-y-3">
            {cropListings
              .filter(c => 
                c.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.id?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(crop => (
                <div key={crop.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{crop.cropName} ({crop.variety || "Grade-A"})</span>
                        <span className="text-[10px] font-mono bg-black/40 text-slate-400 px-2 py-0.5 rounded">
                          #{crop.id.slice(0, 8)}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          crop.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : crop.status === "REJECTED"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {crop.status || "CONFIRMED"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Farmer: <strong className="text-slate-200">{crop.farmerName}</strong> • Phone: {crop.phone} • Channel: {crop.procurementChannel}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Valuation</span>
                      <span className="text-sm font-black text-emerald-400">
                        ₹{Number(crop.totalValuation || 0).toLocaleString("en-IN")} ({crop.quantityQuintal} qtl)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{crop.villageAddress || "Address provided"}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {crop.cropPhoto && (
                        <button
                          onClick={() => setPreviewImage(crop.cropPhoto)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Photo
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateStatus("crop_procurement_orders", crop.id, "status", "APPROVED")}
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleUpdateStatus("crop_procurement_orders", crop.id, "status", "REJECTED")}
                        className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleDeleteRecord("crop_procurement_orders", crop.id, "consignment")}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 🌟 TAB 2: STORE ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders
              .filter(o => 
                o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.id?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(order => (
                <div key={order.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">Order #{order.id.slice(0, 8)}</span>
                        <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          {order.orderStatus || "In Transit"}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {order.paymentType === "online" ? "PREPAID" : "COD"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Buyer: <strong className="text-slate-200">{order.customerName}</strong> • Phone: {order.contactPhone}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total</span>
                      <span className="text-sm font-black text-white">
                        ₹{Number(order.totalPayable || order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="inline-block bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md mr-1.5 mb-1">
                        {item.name} × {item.qty}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Address: {order.deliveryAddress} ({order.pincode})
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Packed & Certified")}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold transition"
                      >
                        Packed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Out for Delivery")}
                        className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
                      >
                        Dispatch
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("orders", order.id, "orderStatus", "Delivered")}
                        className="bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 px-2.5 py-1 rounded-lg text-xs font-bold transition"
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => handleDeleteRecord("orders", order.id, "order")}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 🌟 TAB 3: WHATSAPP COMMUNITY CHATS */}
        {activeTab === "community" && (
          <div className="space-y-3">
            {communityChats
              .filter(msg => 
                msg.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(msg => (
                <div key={msg.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-400">{msg.senderName}</strong>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {msg.groupName || msg.groupId}
                      </span>
                    </div>

                    <p className="text-slate-200 leading-relaxed font-medium">{msg.message}</p>

                    {(msg.diseaseTag || msg.medicineTag) && (
                      <div className="flex items-center gap-2 pt-1">
                        {msg.diseaseTag && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                            रोग: {msg.diseaseTag}
                          </span>
                        )}
                        {msg.medicineTag && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                            दवा: {msg.medicineTag}
                          </span>
                        )}
                      </div>
                    )}

                    {msg.image && (
                      <button
                        onClick={() => setPreviewImage(msg.image)}
                        className="mt-2 block border border-slate-800 rounded-xl overflow-hidden"
                      >
                        <img src={msg.image} alt="Upload" className="w-16 h-16 object-cover" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteRecord("community_chats", msg.id, "chat message")}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg self-end sm:self-center transition"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* 🌟 TAB 4: BROADCAST ENGINE */}
        {activeTab === "broadcast" && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Push Broadcast Alert</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Sends notification instantly to all farmers.</p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Alert Category</label>
                  <select
                    value={broadcastForm.type}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-200 outline-none"
                  >
                    <option value="system">System / Announcement</option>
                    <option value="mandi">Mandi Slot Open</option>
                    <option value="disease">Disease Warning</option>
                    <option value="weather">Weather Radar Alert</option>
                    <option value="order">Marketplace Promotion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yellow Rust Warning in MP"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide actionable advisory for farmers..."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Redirect Path</label>
                  <input
                    type="text"
                    placeholder="/crop-doctor or /marketplace"
                    value={broadcastForm.actionUrl}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, actionUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingBroadcast}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingBroadcast ? "Pushing..." : "Send Broadcast"}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Broadcast Alerts ({broadcastAlerts.length})
              </span>

              {broadcastAlerts.map(alert => (
                <div key={alert.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase font-bold">
                        {alert.type}
                      </span>
                      <strong className="text-white">{alert.title}</strong>
                    </div>
                    <p className="text-slate-400 mt-1">{alert.message}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord("notifications", alert.id, "alert")}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 🌟 IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-lg w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Attached Photo</span>
              <button onClick={() => setPreviewImage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={previewImage} alt="Preview" className="w-full max-h-80 object-contain rounded-xl bg-black" />
            <button
              onClick={() => setPreviewImage(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}