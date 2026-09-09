// import React, { useState, useEffect, useRef } from "react";
// import { 
//   Users, 
//   MapPin, 
//   Image as ImageIcon, 
//   Send, 
//   Pill, 
//   AlertTriangle, 
//   CheckCheck, 
//   Paperclip, 
//   ShieldCheck, 
//   X, 
//   Navigation, 
//   RefreshCw, 
//   Lock,
//   PlusCircle,
//   CheckCircle2,
//   Sparkles
// } from "lucide-react";
// import { 
//   collection, 
//   addDoc, 
//   query, 
//   where, 
//   orderBy, 
//   onSnapshot, 
//   serverTimestamp,
//   doc, 
//   getDoc, 
//   setDoc,
//   updateDoc,
//   increment
// } from "firebase/firestore";
// import { db, auth } from "../services/firebase";
// import axios from "axios";

// export default function CommunityGroups() {
//   const [farmerName, setFarmerName] = useState(() => localStorage.getItem("farmerName") || "किसान साथी");
//   const [userGroup, setUserGroup] = useState(null); // { id: "in_mp_jabalpur", name: "Jabalpur", district: "Jabalpur", state: "MP" }
//   const [loadingGroup, setLoadingGroup] = useState(true);
//   const [detectingGps, setDetectingGps] = useState(false);

//   // Manual Location Entry State
//   const [manualDistrict, setManualDistrict] = useState("");
//   const [manualState, setManualState] = useState("Madhya Pradesh");
//   const [showLocationModal, setShowLocationModal] = useState(false);

//   // Chat States
//   const [messages, setMessages] = useState([]);
//   const [inputMsg, setInputMsg] = useState("");
//   const [diseaseName, setDiseaseName] = useState("");
//   const [medicineTip, setMedicineTip] = useState("");
//   const [imageBase64, setImageBase64] = useState("");
//   const [sending, setSending] = useState(false);
//   const [showAttachMenu, setShowAttachMenu] = useState(false);

//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 1. Standardized Normalizer for Geofenced Group ID
//   const normalizeGroupId = (district, state = "MP") => {
//     const cleanDist = district.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
//     const cleanState = state.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 4);
//     return `group_${cleanState}_${cleanDist}`;
//   };

//   // 2. Auto Group Allocator / Creator Engine
//   const joinOrCreateAreaGroup = async (districtName, stateName = "Madhya Pradesh") => {
//     if (!districtName.trim()) return;

//     try {
//       setLoadingGroup(true);
//       const groupId = normalizeGroupId(districtName, stateName);
//       const groupDocRef = doc(db, "community_channels", groupId);
//       const groupSnap = await getDoc(groupDocRef);

//       let groupData = null;

//       if (groupSnap.exists()) {
//         // Group already exists, increment member counter and join
//         groupData = groupSnap.data();
//         await updateDoc(groupDocRef, {
//           totalMembers: increment(1),
//           lastActive: serverTimestamp()
//         });
//       } else {
//         // First farmer in this area: Auto-create official group
//         groupData = {
//           id: groupId,
//           name: `${districtName} किसान दल`,
//           district: districtName.trim(),
//           state: stateName.trim(),
//           totalMembers: 1,
//           createdAt: serverTimestamp(),
//           lastActive: serverTimestamp()
//         };
//         await setDoc(groupDocRef, groupData);
//       }

//       setUserGroup(groupData);

//       // Bind group permanently to farmer profile
//       const user = auth.currentUser;
//       if (user) {
//         await updateDoc(doc(db, "farmers", user.uid), {
//           assignedGroup: groupData,
//           location: `${districtName}, ${stateName}`
//         }).catch(async () => {
//           // If farmers doc doesn't exist yet
//           await setDoc(doc(db, "farmers", user.uid), {
//             name: farmerName,
//             assignedGroup: groupData,
//             location: `${districtName}, ${stateName}`
//           }, { merge: true });
//         });
//       }

//       setShowLocationModal(false);
//     } catch (err) {
//       console.error("Group Allocation Error:", err);
//       alert("ग्रुप बनाने में समस्या आई। कृपया पुनः प्रयास करें।");
//     } finally {
//       setLoadingGroup(false);
//     }
//   };

//   // 3. Check Initial Assigned Group on Mount
//   useEffect(() => {
//     const fetchExistingGroup = async () => {
//       setLoadingGroup(true);
//       const user = auth.currentUser;

//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, "farmers", user.uid));
//           if (userDoc.exists()) {
//             const data = userDoc.data();
//             if (data.name) setFarmerName(data.name);

//             if (data.assignedGroup) {
//               setUserGroup(data.assignedGroup);
//               setLoadingGroup(false);
//               return;
//             }

//             if (data.location) {
//               const parts = data.location.split(",");
//               await joinOrCreateAreaGroup(parts[0], parts[1] || "MP");
//               return;
//             }
//           }
//         } catch (e) {
//           console.warn("Farmer doc read failed:", e);
//         }
//       }

//       // Default initial join prompt
//       setShowLocationModal(true);
//       setLoadingGroup(false);
//     };

//     fetchExistingGroup();
//   }, []);

//   // 4. One-Click GPS Coordinate Detection and Auto-Grouping
//   const handleGPSAutoJoin = () => {
//     if (!navigator.geolocation) {
//       alert("GPS सुविधा उपलब्ध नहीं है। कृपया जिला हाथ से लिखें।");
//       return;
//     }

//     setDetectingGps(true);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         try {
//           const res = await axios.get(
//             `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
//           );
//           const detectedCity = res.data.city || res.data.locality || res.data.principalSubdivision || "Sehore";
//           const detectedState = res.data.principalSubdivision || "Madhya Pradesh";

//           await joinOrCreateAreaGroup(detectedCity, detectedState);
//         } catch (err) {
//           console.error(err);
//           alert("GPS से स्थान नहीं मिला। कृपया अपना जिला स्वयं लिखें।");
//         } finally {
//           setDetectingGps(false);
//         }
//       },
//       () => {
//         alert("कृपया लोकेशन अनुमति स्वीकार करें ताकि आपका एरिया ग्रुप मिल सके।");
//         setDetectingGps(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   // 5. Live WhatsApp Chat Listener for the Active Group
//   useEffect(() => {
//     if (!userGroup?.id) return;

//     const q = query(
//       collection(db, "community_chats"),
//       where("groupId", "==", userGroup.id),
//       orderBy("createdAt", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((d) => {
//         const data = d.data();
//         let timeFormatted = "Just now";
//         if (data.createdAt?.toDate) {
//           timeFormatted = data.createdAt.toDate().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           });
//         }
//         return { id: d.id, ...data, timeFormatted };
//       });
//       setMessages(msgs);
//     }, (err) => console.warn("Live stream error:", err));

//     return () => unsubscribe();
//   }, [userGroup?.id]);

//   // Image Upload Compression
//   const handleImagePick = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const img = new Image();
//       img.src = event.target.result;
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const MAX_WIDTH = 800;
//         const scale = MAX_WIDTH / img.width;
//         canvas.width = MAX_WIDTH;
//         canvas.height = img.height * scale;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         setImageBase64(canvas.toDataURL("image/jpeg", 0.75));
//         setShowAttachMenu(false);
//       };
//     };
//     reader.readAsDataURL(file);
//   };

//   // 6. Send Message to the Unified Group
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMsg.trim() && !imageBase64) return;

//     try {
//       setSending(true);
//       const user = auth.currentUser;

//       const chatPayload = {
//         groupId: userGroup.id,
//         groupName: userGroup.name,
//         district: userGroup.district,
//         senderId: user ? user.uid : "guest_farmer",
//         senderName: farmerName,
//         senderEmail: user ? user.email : "unverified",
//         message: inputMsg.trim(),
//         image: imageBase64 || null,
//         diseaseTag: diseaseName.trim() || null,
//         medicineTag: medicineTip.trim() || null,
//         createdAt: serverTimestamp(),
//       };

//       await addDoc(collection(db, "community_chats"), chatPayload);

//       setInputMsg("");
//       setImageBase64("");
//       setDiseaseName("");
//       setMedicineTip("");
//     } catch (err) {
//       console.error(err);
//       alert("मैसेज भेजने में समस्या आई।");
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loadingGroup) {
//     return (
//       <div className="max-w-4xl mx-auto py-24 text-center space-y-3">
//         <RefreshCw className="w-8 h-8 text-emerald-800 animate-spin mx-auto" />
//         <p className="text-xs font-bold text-slate-500">आपके क्षेत्र का आधिकारिक किसान ग्रुप तैयार हो रहा है...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 font-sans text-slate-900 pb-24">
      
//       {/* =========================================================
//           WHATSAPP APP CONTAINER (SINGLE GEO-LOCKED ROOM)
//       ========================================================= */}
//       <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
        
//         {/* Top Header: Group Details & Geofence Tag */}
//         <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 z-10 shadow-xs">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-md">
//               <Users className="w-6 h-6" />
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
//                   {userGroup?.name || "स्थानीय किसान दल"}
//                 </h1>
//                 <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
//                   <Lock className="w-2.5 h-2.5" /> Auto-Geofence
//                 </span>
//               </div>
//               <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
//                 <MapPin className="w-3 h-3 text-emerald-400" />
//                 <span>{userGroup?.district}, {userGroup?.state} • केवल स्थानीय किसान</span>
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => setShowLocationModal(true)}
//             className="bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 active:scale-95"
//             title="Change or set area location"
//           >
//             <MapPin className="w-3.5 h-3.5 text-emerald-400" />
//             <span className="hidden sm:inline">स्थान बदलें / सेट करें</span>
//           </button>
//         </div>

//         {/* =========================================================
//             CHAT FEED VIEWPORT
//         ========================================================= */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]/40">
          
//           <div className="text-center my-2">
//             <span className="bg-emerald-50 text-emerald-950 border border-emerald-200 text-[10px] font-bold px-3.5 py-1 rounded-full shadow-2xs inline-block">
//               🌾 आप <strong>{userGroup?.district}</strong> के आधिकारिक किसान ग्रुप में हैं। इस क्षेत्र के सभी किसान अपने आप इसी ग्रुप में जुड़ेंगे।
//             </span>
//           </div>

//           {messages.length === 0 && (
//             <div className="text-center py-20 space-y-2 text-slate-400">
//               <Users className="w-12 h-12 mx-auto text-slate-300" />
//               <p className="text-xs font-bold text-slate-700">इस ग्रुप में अभी कोई चर्चा शुरू नहीं हुई है।</p>
//               <p className="text-[11px]">अपनी फसल की फोटो, कीट या खाद से जुड़ा सवाल सबसे पहले भेजें!</p>
//             </div>
//           )}

//           {messages.map((msg) => {
//             const isMe = msg.senderName === farmerName;

//             return (
//               <div 
//                 key={msg.id} 
//                 className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
//               >
//                 <div className={`max-w-[85%] sm:max-w-[65%] rounded-2xl p-3 shadow-2xs relative ${
//                   isMe 
//                     ? "bg-[#d9fdd3] text-slate-900 rounded-tr-xs" 
//                     : "bg-white text-slate-900 rounded-tl-xs border border-slate-100"
//                 }`}>
                  
//                   {!isMe && (
//                     <span className="text-[11px] font-black text-emerald-800 block mb-1">
//                       {msg.senderName}
//                     </span>
//                   )}

//                   {/* Disease or Treatment Prescription Card */}
//                   {(msg.diseaseTag || msg.medicineTag) && (
//                     <div className="mb-2 p-2 rounded-xl bg-black/5 border border-black/5 space-y-1 text-xs">
//                       {msg.diseaseTag && (
//                         <div className="flex items-center gap-1 text-[11px] font-black text-rose-800">
//                           <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
//                           <span>रोग / कीट: {msg.diseaseTag}</span>
//                         </div>
//                       )}
//                       {msg.medicineTag && (
//                         <div className="flex items-center gap-1 text-[11px] font-black text-emerald-900">
//                           <Pill className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
//                           <span>सुझाई दवा: {msg.medicineTag}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Attached Image */}
//                   {msg.image && (
//                     <div className="mb-2 rounded-xl overflow-hidden border border-black/10 bg-slate-900">
//                       <img 
//                         src={msg.image} 
//                         alt="Crop Problem" 
//                         className="w-full max-h-72 object-contain"
//                       />
//                     </div>
//                   )}

//                   {/* Body Text */}
//                   {msg.message && (
//                     <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium pr-8">
//                       {msg.message}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
//                     <span>{msg.timeFormatted}</span>
//                     {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
//                   </div>

//                 </div>
//               </div>
//             );
//           })}

//           <div ref={chatEndRef} />
//         </div>

//         {/* =========================================================
//             BOTTOM INPUT & ATTACHMENT TRAY
//         ========================================================= */}
//         {imageBase64 && (
//           <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <img src={imageBase64} alt="Preview" className="w-12 h-12 object-cover rounded-xl border" />
//               <span className="text-xs font-bold text-slate-700">खेत की फोटो संलग्न है</span>
//             </div>
//             <button 
//               type="button" 
//               onClick={() => setImageBase64("")}
//               className="p-1 text-slate-400 hover:text-rose-600"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {showAttachMenu && (
//           <div className="p-3 bg-white border-t border-slate-200 grid sm:grid-cols-2 gap-2 text-xs">
//             <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl">
//               <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
//               <input 
//                 type="text" 
//                 placeholder="रोग का नाम (e.g. Yellow Rust)"
//                 value={diseaseName}
//                 onChange={(e) => setDiseaseName(e.target.value)}
//                 className="bg-transparent outline-none w-full font-bold"
//               />
//             </div>

//             <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl">
//               <Pill className="w-4 h-4 text-rose-600 shrink-0" />
//               <input 
//                 type="text" 
//                 placeholder="सुझाई गई दवा व स्प्रे खुराक"
//                 value={medicineTip}
//                 onChange={(e) => setMedicineTip(e.target.value)}
//                 className="bg-transparent outline-none w-full font-bold"
//               />
//             </div>
//           </div>
//         )}

//         <form 
//           onSubmit={handleSendMessage}
//           className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2"
//         >
//           <button
//             type="button"
//             onClick={() => setShowAttachMenu(!showAttachMenu)}
//             className={`p-2.5 rounded-xl transition ${
//               showAttachMenu ? "bg-emerald-100 text-emerald-900" : "text-slate-500 hover:bg-slate-100"
//             }`}
//             title="रोग व दवा टैग करें"
//           >
//             <Pill className="w-4 h-4" />
//           </button>

//           <label className="p-2.5 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-xl cursor-pointer transition">
//             <Paperclip className="w-4 h-4" />
//             <input type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
//           </label>

//           <input
//             type="text"
//             placeholder={`${userGroup?.name || "ग्रुप"} में मैसेज या सवाल लिखें...`}
//             value={inputMsg}
//             onChange={(e) => setInputMsg(e.target.value)}
//             className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:bg-white focus:border-slate-900"
//           />

//           <button
//             type="submit"
//             disabled={sending || (!inputMsg.trim() && !imageBase64)}
//             className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white p-3 rounded-2xl shadow-xs transition active:scale-95 shrink-0"
//           >
//             <Send className="w-4 h-4" />
//           </button>
//         </form>

//       </div>

//       {/* =========================================================
//           LOCATION MODAL: AUTO GPS OR MANUAL DISTRICT
//       ========================================================= */}
//       {showLocationModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            
//             <div className="text-center space-y-1.5">
//               <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
//                 <MapPin className="w-6 h-6" />
//               </div>
//               <h3 className="text-base sm:text-lg font-black text-slate-900">
//                 अपना क्षेत्र / जिला चुनें
//               </h3>
//               <p className="text-xs text-slate-500 leading-relaxed font-medium">
//                 जैसे ही आप अपना जिला डालेंगे, आपके क्षेत्र का किसान ग्रुप अपने आप बन जाएगा या आप उसमें जुड़ जाएंगे।
//               </p>
//             </div>

//             {/* GPS Auto Button */}
//             <button
//               type="button"
//               onClick={handleGPSAutoJoin}
//               disabled={detectingGps}
//               className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 active:scale-95"
//             >
//               <Navigation className={`w-4 h-4 ${detectingGps ? "animate-spin" : ""}`} />
//               <span>{detectingGps ? "लाइव लोकेशन पहचानी जा रही है..." : "GPS से अपने आप एरिया ग्रुप जोड़ें"}</span>
//             </button>

//             <div className="flex items-center gap-2 my-2">
//               <div className="h-px bg-slate-200 flex-1" />
//               <span className="text-[10px] font-bold text-slate-400 uppercase">अथवा हाथ से लिखें</span>
//               <div className="h-px bg-slate-200 flex-1" />
//             </div>

//             {/* Manual District Entry Form */}
//             <form 
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 joinOrCreateAreaGroup(manualDistrict, manualState);
//               }}
//               className="space-y-3"
//             >
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1">जिले या तहसील का नाम</label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. Sehore, Jabalpur, Indore, Harda"
//                   value={manualDistrict}
//                   onChange={(e) => setManualDistrict(e.target.value)}
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-slate-900"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1">राज्य</label>
//                 <select
//                   value={manualState}
//                   onChange={(e) => setManualState(e.target.value)}
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
//                 >
//                   <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
//                   <option value="Rajasthan">Rajasthan (राजस्थान)</option>
//                   <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
//                   <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
//                   <option value="Gujarat">Gujarat (गुजरात)</option>
//                   <option value="Punjab">Punjab (पंजाब)</option>
//                   <option value="Haryana">Haryana (हरियाणा)</option>
//                 </select>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 {userGroup && (
//                   <button
//                     type="button"
//                     onClick={() => setShowLocationModal(false)}
//                     className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold"
//                   >
//                     रद्द करें
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={!manualDistrict.trim()}
//                   className="flex-1 bg-slate-900 hover:bg-black text-white py-3 rounded-xl text-xs font-black shadow-xs transition active:scale-95"
//                 >
//                   ग्रुप में शामिल हों
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


















import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  MapPin, 
  Send, 
  Pill, 
  AlertTriangle, 
  CheckCheck, 
  Paperclip, 
  X, 
  Navigation, 
  RefreshCw, 
  Lock,
  Flame,
  Radio
} from "lucide-react";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import axios from "axios";

// 2 KM Haversine Distance Formula
function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function CommunityGroups() {
  const [farmerName, setFarmerName] = useState(() => localStorage.getItem("farmerName") || "किसान साथी");
  const [userGroup, setUserGroup] = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [detectingGps, setDetectingGps] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 22.7196, lng: 75.8577 });

  const [manualDistrict, setManualDistrict] = useState("");
  const [manualState, setManualState] = useState("Madhya Pradesh");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [medicineTip, setMedicineTip] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [sending, setSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Live Location Tracker
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn("GPS access warning:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const normalizeGroupId = (district, state = "MP") => {
    const cleanDist = district.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanState = state.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 4);
    return `group_${cleanState}_${cleanDist}`;
  };

  const joinOrCreateAreaGroup = async (districtName, stateName = "Madhya Pradesh") => {
    if (!districtName.trim()) return;

    try {
      setLoadingGroup(true);
      const groupId = normalizeGroupId(districtName, stateName);
      const groupDocRef = doc(db, "community_channels", groupId);
      const groupSnap = await getDoc(groupDocRef);

      let groupData = null;

      if (groupSnap.exists()) {
        groupData = groupSnap.data();
        await updateDoc(groupDocRef, {
          totalMembers: increment(1),
          lastActive: serverTimestamp()
        });
      } else {
        groupData = {
          id: groupId,
          name: `${districtName} किसान दल`,
          district: districtName.trim(),
          state: stateName.trim(),
          totalMembers: 1,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp()
        };
        await setDoc(groupDocRef, groupData);
      }

      setUserGroup(groupData);

      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "farmers", user.uid), {
          assignedGroup: groupData,
          location: `${districtName}, ${stateName}`
        }).catch(async () => {
          await setDoc(doc(db, "farmers", user.uid), {
            name: farmerName,
            assignedGroup: groupData,
            location: `${districtName}, ${stateName}`
          }, { merge: true });
        });
      }

      setShowLocationModal(false);
    } catch (err) {
      console.error("Group Allocation Error:", err);
    } finally {
      setLoadingGroup(false);
    }
  };

  useEffect(() => {
    const fetchExistingGroup = async () => {
      setLoadingGroup(true);
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "farmers", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) setFarmerName(data.name);

            if (data.assignedGroup) {
              setUserGroup(data.assignedGroup);
              setLoadingGroup(false);
              return;
            }

            if (data.location) {
              const parts = data.location.split(",");
              await joinOrCreateAreaGroup(parts[0], parts[1] || "MP");
              return;
            }
          }
        } catch (e) {
          console.warn("Farmer doc read failed:", e);
        }
      }

      setShowLocationModal(true);
      setLoadingGroup(false);
    };

    fetchExistingGroup();
  }, []);

  const handleGPSAutoJoin = () => {
    if (!navigator.geolocation) {
      alert("GPS सुविधा उपलब्ध नहीं है।");
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });

        try {
          const res = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const detectedCity = res.data.city || res.data.locality || res.data.principalSubdivision || "Sehore";
          const detectedState = res.data.principalSubdivision || "Madhya Pradesh";

          await joinOrCreateAreaGroup(detectedCity, detectedState);
        } catch (err) {
          console.error(err);
          alert("GPS से स्थान नहीं मिला। कृपया अपना जिला स्वयं लिखें।");
        } finally {
          setDetectingGps(false);
        }
      },
      () => {
        alert("कृपया लोकेशन अनुमति स्वीकार करें।");
        setDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Live Chat Stream Filtered strictly to 2 KM Range
  useEffect(() => {
    if (!userGroup?.id) return;

    const q = query(
      collection(db, "community_chats"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.docs.forEach((d) => {
        const data = d.data();
        let timeFormatted = "Just now";
        if (data.createdAt?.toDate) {
          timeFormatted = data.createdAt.toDate().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        // Check 2 KM Geofence
        const dist = getDistanceKm(
          userCoords.lat, 
          userCoords.lng, 
          data.location?.lat, 
          data.location?.lng
        );

        // Sirf 2 km ke andar wale ya bina location wale local messages accept karein
        if (!data.location || dist <= 2.0) {
          msgs.push({ 
            id: d.id, 
            ...data, 
            timeFormatted, 
            distanceKm: dist ? dist.toFixed(2) : "0.0" 
          });
        }
      });
      setMessages(msgs);
    }, (err) => console.warn("Live stream error:", err));

    return () => unsubscribe();
  }, [userGroup?.id, userCoords]);

  const handleImagePick = (e) => {
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
        setImageBase64(canvas.toDataURL("image/jpeg", 0.75));
        setShowAttachMenu(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() && !imageBase64) return;

    try {
      setSending(true);
      const user = auth.currentUser;

      const chatPayload = {
        groupId: userGroup.id,
        groupName: userGroup.name,
        district: userGroup.district,
        senderId: user ? user.uid : "guest_farmer",
        senderName: farmerName,
        message: inputMsg.trim(),
        image: imageBase64 || null,
        diseaseTag: diseaseName.trim() || null,
        medicineTag: medicineTip.trim() || null,
        location: userCoords,
        isAutoScanAlert: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "community_chats"), chatPayload);

      setInputMsg("");
      setImageBase64("");
      setDiseaseName("");
      setMedicineTip("");
    } catch (err) {
      console.error(err);
      alert("मैसेज भेजने में समस्या आई।");
    } finally {
      setSending(false);
    }
  };

  if (loadingGroup) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-800 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">2 KM किसान कम्युनिटी ग्रुप लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 font-sans text-slate-900 pb-24">
      
      {/* Container */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-md">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                  {userGroup?.name || "2 KM सुरक्षा दल"}
                </h1>
                <span className="text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 2 KM Geofenced
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{userGroup?.district} • आपके 2 KM के दायरे के सभी किसान</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLocationModal(true)}
            className="bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">स्थान बदलें</span>
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]/40">
          <div className="text-center my-2">
            <span className="bg-emerald-100/80 text-emerald-950 border border-emerald-300 text-[10px] font-bold px-3.5 py-1 rounded-full shadow-2xs inline-block">
              📡 इस ग्रुप में केवल <strong>2 किमी</strong> के अंदर स्कैन हुई फसलें व बातचीत लाइव दिखाई देती है।
            </span>
          </div>

          {messages.length === 0 && (
            <div className="text-center py-20 space-y-2 text-slate-400">
              <Users className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">2 किमी के दायरे में अभी कोई बीमारी या चैट नहीं है।</p>
              <p className="text-[11px]">अपनी फसल की जांच करें; खराब होने पर रिपोर्ट यहां ऑटो-पोस्ट होगी।</p>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderName === farmerName;
            const isAutoAlert = msg.isAutoScanAlert;

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isAutoAlert ? "items-center my-3" : isMe ? "items-end" : "items-start"}`}
              >
                {/* 1. Automated Scan Alert Card */}
                {isAutoAlert ? (
                  <div className="w-full max-w-md bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 shadow-md space-y-2.5">
                    <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-rose-800 bg-rose-200 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3 h-3 text-rose-600" /> ऑटो फसल रोग अलर्ट
                      </span>
                      <span className="text-[10px] font-bold text-rose-600">
                        📍 {msg.distanceKm} KM दूर से रिपोर्ट
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {msg.image && (
                        <img 
                          src={msg.image} 
                          alt="Infected" 
                          className="w-20 h-20 rounded-2xl object-cover border border-rose-200 shrink-0" 
                        />
                      )}
                      <div className="space-y-1 text-xs">
                        <h4 className="font-black text-rose-950 text-sm">
                          {msg.cropName}: {msg.diseaseTag}
                        </h4>
                        <p className="text-slate-600 text-[11px]">
                          फसल नुकसान: <strong className="text-rose-700">{msg.infectionPercent}</strong>
                        </p>
                        <div className="bg-white p-2 rounded-xl border border-rose-200 text-[11px]">
                          <span className="text-slate-400 font-bold block text-[9px] uppercase">अनुशंसित दवा:</span>
                          <strong className="text-emerald-700">{msg.medicineTag}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1">
                      <span>किसान: {msg.senderName}</span>
                      <span>{msg.timeFormatted}</span>
                    </div>
                  </div>
                ) : (
                  /* 2. Normal WhatsApp Bubble */
                  <div className={`max-w-[85%] sm:max-w-[65%] rounded-2xl p-3 shadow-2xs relative ${
                    isMe 
                      ? "bg-[#d9fdd3] text-slate-900 rounded-tr-xs" 
                      : "bg-white text-slate-900 rounded-tl-xs border border-slate-100"
                  }`}>
                    {!isMe && (
                      <span className="text-[11px] font-black text-emerald-800 block mb-1">
                        {msg.senderName} ({msg.distanceKm} KM)
                      </span>
                    )}

                    {(msg.diseaseTag || msg.medicineTag) && (
                      <div className="mb-2 p-2 rounded-xl bg-black/5 border border-black/5 space-y-1 text-xs">
                        {msg.diseaseTag && (
                          <div className="flex items-center gap-1 text-[11px] font-black text-rose-800">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>रोग: {msg.diseaseTag}</span>
                          </div>
                        )}
                        {msg.medicineTag && (
                          <div className="flex items-center gap-1 text-[11px] font-black text-emerald-900">
                            <Pill className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>दवा: {msg.medicineTag}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.image && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-black/10 bg-slate-900">
                        <img src={msg.image} alt="Crop" className="w-full max-h-72 object-contain" />
                      </div>
                    )}

                    {msg.message && (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium pr-8">
                        {msg.message}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                      <span>{msg.timeFormatted}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div ref={chatEndRef} />
        </div>

        {/* Input Tray */}
        {imageBase64 && (
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={imageBase64} alt="Preview" className="w-12 h-12 object-cover rounded-xl border" />
              <span className="text-xs font-bold text-slate-700">फोटो संलग्न है</span>
            </div>
            <button type="button" onClick={() => setImageBase64("")} className="p-1 text-slate-400 hover:text-rose-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {showAttachMenu && (
          <div className="p-3 bg-white border-t border-slate-200 grid sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <input 
                type="text" 
                placeholder="रोग का नाम" 
                value={diseaseName} 
                onChange={(e) => setDiseaseName(e.target.value)} 
                className="bg-transparent outline-none w-full font-bold" 
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl">
              <Pill className="w-4 h-4 text-rose-600 shrink-0" />
              <input 
                type="text" 
                placeholder="दवा व स्प्रे खुराक" 
                value={medicineTip} 
                onChange={(e) => setMedicineTip(e.target.value)} 
                className="bg-transparent outline-none w-full font-bold" 
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2.5 rounded-xl transition ${showAttachMenu ? "bg-emerald-100 text-emerald-900" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <Pill className="w-4 h-4" />
          </button>

          <label className="p-2.5 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-xl cursor-pointer transition">
            <Paperclip className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
          </label>

          <input
            type="text"
            placeholder="2 KM किसान ग्रुप में मैसेज लिखें..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold outline-none"
          />

          <button
            type="submit"
            disabled={sending || (!inputMsg.trim() && !imageBase64)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white p-3 rounded-2xl transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">अपना 2 KM दायरा सेट करें</h3>
              <p className="text-xs text-slate-500 font-medium">GPS से आपके 2 किलोमीटर के आसपास के सभी खेतों को ग्रुप में जोड़ा जाएगा।</p>
            </div>

            <button
              type="button"
              onClick={handleGPSAutoJoin}
              disabled={detectingGps}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2"
            >
              <Navigation className={`w-4 h-4 ${detectingGps ? "animate-spin" : ""}`} />
              <span>{detectingGps ? "स्थान पहचाना जा रहा है..." : "GPS से 2 KM ग्रुप कनेक्ट करें"}</span>
            </button>

            <div className="flex items-center gap-2 my-2">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">अथवा जिला लिखें</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); joinOrCreateAreaGroup(manualDistrict, manualState); }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">जिले का नाम</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sehore, Jabalpur, Indore"
                  value={manualDistrict}
                  onChange={(e) => setManualDistrict(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {userGroup && (
                  <button type="button" onClick={() => setShowLocationModal(false)} className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold">
                    रद्द करें
                  </button>
                )}
                <button type="submit" disabled={!manualDistrict.trim()} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-black">
                  शामिल हों
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}