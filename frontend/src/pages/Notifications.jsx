import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Store,
  CloudSun,
  Trash2,
  CheckCheck,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  getDocs,
  where
} from "firebase/firestore";
import { db, auth } from "../services/firebase";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("all"); // 'all' | 'order' | 'mandi' | 'disease' | 'weather'
  const [loading, setLoading] = useState(true);

  // Safe fallback alerts for fresh accounts
  const initialFallbackAlerts = [
    {
      id: "mock-1",
      title: "Crop Consignment Token Approved",
      message: "Your 50 quintal Sharbati Wheat slot at Jabalpur Mandi has been approved for the morning shift.",
      type: "mandi",
      actionUrl: "/sell-crop",
      isRead: false,
      createdAtTime: "10m ago"
    },
    {
      id: "mock-2",
      title: "Agri Medicine Order Dispatched",
      message: "Order #AG-9421 (Saaf Fungicide & Coragen) has been dispatched via rural express van.",
      type: "order",
      actionUrl: "/marketplace",
      isRead: false,
      createdAtTime: "1h ago"
    },
    {
      id: "mock-3",
      title: "High Humidity Fungal Alert",
      message: "Field relative humidity exceeded 80% in your area. Inspect standing crop for rust and blight.",
      type: "disease",
      actionUrl: "/crop-doctor",
      isRead: true,
      createdAtTime: "Yesterday"
    },
    {
      id: "mock-4",
      title: "Favorable Spray Window Forecast",
      message: "Wind speed normal (9 km/h) with clear sunshine. Ideal conditions for foliar nutrient spraying.",
      type: "weather",
      actionUrl: "/weather",
      isRead: true,
      createdAtTime: "2d ago"
    }
  ];

  // Request browser notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Real-time Firestore Sync with Null-Safe Timestamps
  useEffect(() => {
    setLoading(true);
    const notifRef = collection(db, "notifications");
    const q = query(notifRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map((d) => {
            const data = d.data();
            let timeStr = "Just now";

            if (data.createdAt && typeof data.createdAt.toDate === "function") {
              const date = data.createdAt.toDate();
              timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            }

            return {
              id: d.id,
              ...data,
              createdAtTime: timeStr,
            };
          });
          setNotifications(fetched);
        } else {
          setNotifications(initialFallbackAlerts);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore listener fallback:", error);
        setNotifications(initialFallbackAlerts);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Safe Mark-as-Read (Prevents crash on mock items)
  const handleMarkAsRead = async (item) => {
    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );

      // Only execute Firestore update if it's a real database document
      if (!item.id.startsWith("mock-")) {
        try {
          await updateDoc(doc(db, "notifications", item.id), { isRead: true });
        } catch (e) {
          console.warn("Failed to mark read in db:", e);
        }
      }
    }

    if (item.actionUrl) {
      navigate(item.actionUrl);
    }
  };

  // Safe Mark All as Read (Only touches unread real documents)
  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      const unreadRealItems = notifications.filter(
        (n) => !n.isRead && !n.id.startsWith("mock-")
      );

      if (unreadRealItems.length > 0) {
        const batch = writeBatch(db);
        unreadRealItems.forEach((item) => {
          batch.update(doc(db, "notifications", item.id), { isRead: true });
        });
        await batch.commit();
      }
    } catch (e) {
      console.warn("Batch mark read failed:", e);
    }
  };

  // Safe Delete (Handles both real and local items without throwing 500)
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    if (!id.startsWith("mock-")) {
      try {
        await deleteDoc(doc(db, "notifications", id));
      } catch (err) {
        console.warn("Failed to delete notification from db:", err);
      }
    }
  };

  // Notification Type Styling
  const getTypeMeta = (type) => {
    switch (type) {
      case "order":
        return { icon: ShoppingBag, label: "Order Update", color: "text-blue-700 bg-blue-50 border-blue-200" };
      case "mandi":
        return { icon: Store, label: "Mandi Token", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      case "disease":
        return { icon: AlertTriangle, label: "Crop Disease", color: "text-rose-700 bg-rose-50 border-rose-200" };
      case "weather":
        return { icon: CloudSun, label: "Weather Risk", color: "text-amber-700 bg-amber-50 border-amber-200" };
      default:
        return { icon: ShieldCheck, label: "System Alert", color: "text-slate-700 bg-slate-100 border-slate-200" };
    }
  };

  const filteredList = notifications.filter((item) =>
    filterType === "all" ? true : item.type === filterType
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-28 text-slate-900 space-y-6">
      
      {/* 🌟 HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Agricultural Activity Alerts</h1>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live status updates for mandi tokens, farmgate pickups, orders & weather warnings
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition active:scale-95 shadow-xs"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* 🌟 CATEGORY FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "All Alerts" },
          { id: "mandi", label: "Mandi & Slots" },
          { id: "order", label: "Store Orders" },
          { id: "disease", label: "Crop Disease" },
          { id: "weather", label: "Weather Radar" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 border ${
              filterType === tab.id
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🌟 NOTIFICATIONS LIST */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <RefreshCw className="w-7 h-7 text-slate-400 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Syncing live alerts...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredList.map((item) => {
              const meta = getTypeMeta(item.type);
              const Icon = meta.icon;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleMarkAsRead(item)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3.5 group shadow-xs ${
                    item.isRead
                      ? "bg-white border-slate-200 hover:border-slate-300"
                      : "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${meta.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.createdAtTime}
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </div>

                      <h3 className={`text-sm tracking-tight ${item.isRead ? "text-slate-800 font-bold" : "text-slate-900 font-extrabold"}`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-center">
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNotification(e, item.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Dismiss Alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {!loading && filteredList.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Notifications in this Category</h3>
            <p className="text-xs text-slate-400">All recent activities, orders, and mandi tokens will appear here.</p>
          </div>
        )}
      </div>

    </div>
  );
}