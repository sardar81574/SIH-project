


















// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Camera, 
//   Upload, 
//   RefreshCw, 
//   ShieldAlert, 
//   CheckCircle2, 
//   AlertTriangle, 
//   Sparkles, 
//   X, 
//   FlipHorizontal,
//   Leaf,
//   Droplet,
//   Pill,
//   Volume2,
//   VolumeX,
//   Printer,
//   ShoppingBag,
//   Clock,
//   ShieldCheck,
//   Flame,
//   Check,
//   Activity,
//   Zap,
//   Microscope,
//   Info
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// export default function CropDoctor() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
  
//   const [activeTab, setActiveTab] = useState('chemical');
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   // Live Camera states
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [cameraStream, setCameraStream] = useState(null);
//   const [facingMode, setFacingMode] = useState('environment');
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   // Handle Gallery Upload
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setSelectedImage(URL.createObjectURL(file));
//       setResult(null);
//       stopCamera();
//     }
//   };

//   // Start Camera
//   const startCamera = async (mode = facingMode) => {
//     try {
//       if (cameraStream) {
//         cameraStream.getTracks().forEach(track => track.stop());
//       }
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: mode,
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         },
//         audio: false
//       });
//       setCameraStream(stream);
//       setIsCameraOpen(true);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (err) {
//       console.error("Camera access error:", err);
//       alert("कैमरा चालू नहीं हो सका। कृपया ब्राउज़र सेटिंग्स में कैमरा परमिशन चेक करें।");
//     }
//   };

//   const stopCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach(track => track.stop());
//       setCameraStream(null);
//     }
//     setIsCameraOpen(false);
//   };

//   const toggleCameraFacing = () => {
//     const nextMode = facingMode === 'environment' ? 'user' : 'environment';
//     setFacingMode(nextMode);
//     startCamera(nextMode);
//   };

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       canvas.width = video.videoWidth || 640;
//       canvas.height = video.videoHeight || 480;

//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       canvas.toBlob((blob) => {
//         if (blob) {
//           const file = new File([blob], `crop_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
//           setImageFile(file);
//           setSelectedImage(URL.createObjectURL(file));
//           setResult(null);
//           stopCamera();
//         }
//       }, 'image/jpeg', 0.95);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       stopCamera();
//       window.speechSynthesis?.cancel();
//     };
//   }, []);

//   // Voice Guidance (Hindi TTS)
//   const toggleVoiceGuide = () => {
//     if (!('speechSynthesis' in window)) {
//       alert("Voice guidance is not supported in this browser.");
//       return;
//     }

//     if (isSpeaking) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//     } else {
//       const textToSpeak = result?.voiceText || `${result?.diseaseName} पाया गया है। कृपया बताए गए उपचार का पालन करें।`;
//       const utterance = new SpeechSynthesisUtterance(textToSpeak);
//       utterance.lang = 'hi-IN';
//       utterance.rate = 0.95;
//       utterance.onend = () => setIsSpeaking(false);
//       utterance.onerror = () => setIsSpeaking(false);
//       setIsSpeaking(true);
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   // Analyze Crop
//   const handleAnalyze = async () => {
//     if (!imageFile) return;
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", imageFile);

//       const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       setResult(response.data);
//     } catch (err) {
//       console.error(err);
//       alert("AI Server se connect nahi ho paya. Backend check karein.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const printPrescription = () => {
//     window.print();
//   };

//   // Fast Extraction variables
//   const detectedCrop = result?.cropName;
//   const detectedDisease = result?.diseaseName;
//   const quickMed = result?.quickSummary?.sateekDawai || result?.chemicalMedicines?.[0]?.name || "विशेषज्ञ से सलाह लें";
//   const quickDosage = result?.quickSummary?.khurakPer15L || result?.chemicalMedicines?.[0]?.dosage || "पैकेट पर देखें";
//   const heatmapImage = result?.heatmapImage;

//   return (
//     <div className="max-w-4xl mx-auto space-y-6 pb-28 md:pb-12 font-sans px-3 sm:px-6">
      
//       {/* 🌟 1. HERO HEADER BANNER */}
//       <motion.div 
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-[#0d4718] to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-emerald-500/20"
//       >
//         <div className="relative z-10 space-y-2.5 max-w-2xl">
//           <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase text-emerald-300 border border-emerald-400/30">
//             <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
//             AI Computer-Vision Crop Pathology
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
//             AI Crop Doctor & Clinical Lab
//           </h1>
//           <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed">
//             पत्ती की फोटो अपलोड करें — AI तुरंत सटीक रोग पहचान, विश्वसनीय दवा व 15L पंप की सही खुराक (Dosage) और जैविक उपचार प्रदान करेगा।
//           </p>
//         </div>

//         {/* Ambient background decoration */}
//         <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
//           <Leaf className="w-64 h-64 text-emerald-400 transform -rotate-12" />
//         </div>
//       </motion.div>

//       {/* 🌟 2. SCANNER & UPLOAD SECTION */}
//       <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-7 space-y-5">
        
//         {/* Viewport Box */}
//         <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-950 flex items-center justify-center min-h-[320px] sm:min-h-[380px] shadow-inner">
          
//           {/* Laser Scanning Animation when Analyzing */}
//           {loading && (
//             <motion.div
//               initial={{ top: "0%" }}
//               animate={{ top: ["0%", "95%", "0%"] }}
//               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//               className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-30 shadow-[0_0_15px_#34d399]"
//             />
//           )}

//           {isCameraOpen ? (
//             <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] flex items-center justify-center bg-black">
//               <video 
//                 ref={videoRef} 
//                 autoPlay 
//                 playsInline 
//                 className="w-full h-full object-cover max-h-[400px]"
//               />
//               <canvas ref={canvasRef} className="hidden" />

//               {/* Viewfinder Target Brackets */}
//               <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
//                 <div className="flex justify-between">
//                   <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
//                   <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
//                 </div>
//                 <div className="flex justify-between">
//                   <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
//                   <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
//                 </div>
//               </div>

//               {/* Live Camera Bar Controls */}
//               <div className="absolute bottom-5 left-0 right-0 px-8 flex items-center justify-between z-20">
//                 <button
//                   type="button"
//                   onClick={toggleCameraFacing}
//                   className="bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition"
//                   title="Switch Camera"
//                 >
//                   <FlipHorizontal className="w-5 h-5" />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={capturePhoto}
//                   className="p-1.5 bg-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition"
//                 >
//                   <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
//                     <Camera className="w-6 h-6 text-white" />
//                   </div>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={stopCamera}
//                   className="bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition"
//                   title="Close Camera"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           ) : selectedImage ? (
//             <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] flex items-center justify-center bg-slate-950 p-2">
//               <img 
//                 src={selectedImage} 
//                 alt="Leaf Preview" 
//                 className="max-h-[360px] w-auto max-w-full object-contain rounded-2xl"
//               />
//               <button
//                 onClick={() => {
//                   setSelectedImage(null);
//                   setImageFile(null);
//                   setResult(null);
//                   window.speechSynthesis?.cancel();
//                   setIsSpeaking(false);
//                 }}
//                 className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white p-2 rounded-full transition shadow-md"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <div className="text-center p-8 space-y-3">
//               <div className="w-16 h-16 mx-auto bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-inner">
//                 <Leaf className="w-8 h-8 stroke-[2.2]" />
//               </div>
//               <div className="space-y-1">
//                 <p className="text-base font-black text-white">पत्ती की स्पष्ट फोटो खींचें या चुनें</p>
//                 <p className="text-xs text-slate-400 font-medium">रोग की 98%+ सटीक जांच हेतु पत्ती को रोशनी में रखें</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Action Selectors */}
//         <div className="grid grid-cols-2 gap-3">
//           <button
//             type="button"
//             onClick={() => startCamera('environment')}
//             className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-xs transition border border-emerald-200 shadow-xs active:scale-[0.98]"
//           >
//             <Camera className="w-4 h-4 text-emerald-700" />
//             <span>लाइव कैमरा से फोटो लें</span>
//           </button>

//           <label className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-xs transition border border-slate-200 shadow-xs cursor-pointer active:scale-[0.98]">
//             <Upload className="w-4 h-4 text-slate-600" />
//             <span>गैलरी से अपलोड करें</span>
//             <input 
//               type="file" 
//               accept="image/*" 
//               onChange={handleFileChange} 
//               className="hidden" 
//             />
//           </label>
//         </div>

//         {/* Big Execution Button */}
//         <button
//           onClick={handleAnalyze}
//           disabled={!imageFile || loading || isCameraOpen}
//           className="w-full bg-gradient-to-r from-[#14532d] via-[#166534] to-[#15803d] hover:from-[#0f3d21] hover:to-[#14532d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm py-4 rounded-2xl shadow-xl shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
//         >
//           {loading ? (
//             <>
//               <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
//               <span>AI विश्लेषण व रोग जांच जारी है (Analyzing Leaf Data)...</span>
//             </>
//           ) : (
//             <>
//               <Sparkles className="w-4 h-4 text-emerald-300" />
//               <span>Analyze Crop & Get Treatment (फसल रोग जांचें)</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* 🌟 3. CLEAR DIAGNOSTIC RESULTS REPORT */}
//       <AnimatePresence>
//         {result && (
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="space-y-6"
//           >

//             {/* ❌ Invalid Non-Plant Alert */}
//             {result.isPlant === false && (
//               <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl flex items-start gap-4 shadow-sm">
//                 <div className="bg-rose-100 p-2.5 rounded-2xl text-rose-700 shrink-0">
//                   <ShieldAlert className="w-6 h-6" />
//                 </div>
//                 <div className="space-y-1">
//                   <h4 className="font-black text-sm text-rose-950">अमान्य फोटो (Not a Plant Leaf)</h4>
//                   <p className="text-xs text-rose-800 leading-relaxed font-medium">
//                     {result.message}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* ✅ Genuine Plant Diagnostic View */}
//             {result.isPlant === true && (
//               <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-5 sm:p-8 space-y-7">
                
//                 {/* Status Bar, Voice & Print */}
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
//                   <div className="flex items-center gap-2.5 flex-wrap">
//                     {result.diseaseDetected ? (
//                       <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
//                         <AlertTriangle className="w-4 h-4 text-rose-600" />
//                         संक्रमण पाया गया (Disease Detected)
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
//                         <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                         फसल 100% स्वस्थ है (Healthy Crop)
//                       </span>
//                     )}
//                     <span className="text-[11px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
//                       सटीकता: {result.confidence}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={toggleVoiceGuide}
//                       className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs ${
//                         isSpeaking 
//                           ? 'bg-amber-500 text-white animate-pulse' 
//                           : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
//                       }`}
//                     >
//                       {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
//                       <span>{isSpeaking ? 'आवाज रोकें' : 'रिपोर्ट सुनें (Voice)'}</span>
//                     </button>

//                     <button
//                       onClick={printPrescription}
//                       className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition"
//                       title="पर्चा प्रिंट करें"
//                     >
//                       <Printer className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* 🌟 4. HIGH-IMPACT SPLIT CARDS (Fasal + Rog + Urgent Dawa) */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
//                   {/* Card 1: Fasal */}
//                   <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200 p-4.5 rounded-2xl space-y-1">
//                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
//                       <Leaf className="w-3 h-3 text-emerald-600" /> पहचानी गई फसल
//                     </span>
//                     <h3 className="text-lg font-black text-slate-900">{detectedCrop}</h3>
//                     <p className="text-[11px] text-slate-500 font-medium">खेत की प्रमाणित फसल</p>
//                   </div>

//                   {/* Card 2: Bimari */}
//                   <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 p-4.5 rounded-2xl space-y-1">
//                     <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1">
//                       <Activity className="w-3 h-3 text-amber-600" /> रोग का नाम (Disease)
//                     </span>
//                     <h3 className="text-lg font-black text-amber-950">{detectedDisease}</h3>
//                     <p className="text-[11px] text-amber-800 font-semibold">
//                       गंभीरता: <strong className="text-amber-950">{result.severity || "मध्यम"}</strong>
//                     </p>
//                   </div>

//                   {/* Card 3: Urgent Dawa & Dosage */}
//                   <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 p-4.5 rounded-2xl space-y-1">
//                     <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
//                       <Pill className="w-3 h-3 text-emerald-700" /> सटीक दवा (Direct Remedy)
//                     </span>
//                     <h3 className="text-base font-black text-emerald-950 truncate" title={quickMed}>
//                       {quickMed}
//                     </h3>
//                     <p className="text-[11px] font-bold text-emerald-900">
//                       मात्रा: <strong className="text-emerald-950">{quickDosage}</strong>
//                     </p>
//                   </div>

//                 </div>

//                 {/* AI Pathology Summary Note */}
//                 <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
//                   <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
//                     <Microscope className="w-4 h-4 text-emerald-700" />
//                     <span>AI पैथोलॉजी विश्लेषण व रिपोर्ट:</span>
//                   </div>
//                   <p className="text-xs text-slate-600 leading-relaxed font-medium">
//                     {result.analysisSummary}
//                   </p>

//                   {/* Observed symptoms pill tags */}
//                   {result.symptomsObserved && result.symptomsObserved.length > 0 && (
//                     <div className="pt-1 flex flex-wrap gap-1.5">
//                       {result.symptomsObserved.map((symp, i) => (
//                         <span key={i} className="inline-flex items-center gap-1 text-[11px] font-bold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
//                           <Check className="w-3 h-3 text-emerald-600" />
//                           <span>{symp}</span>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* 🌟 5. THERMAL PATHOLOGY HEATMAP RADAR (Side-by-Side) */}
//                 {heatmapImage && (
//                   <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-xl border border-slate-800">
//                     <div className="flex items-center justify-between flex-wrap gap-2">
//                       <div className="flex items-center gap-2">
//                         <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
//                         <h4 className="text-sm font-black tracking-tight text-white">
//                           AI इंफेक्शन हीटमैप विश्लेषण (Thermal Lesion Hotspots)
//                         </h4>
//                       </div>
//                       <span className="text-xs font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-xl">
//                         संक्रमित सतह: <strong className="text-rose-400">{result.infectionPercent || "N/A"}</strong>
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2 text-center">
//                         <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
//                           असली पत्ती (Original Leaf)
//                         </span>
//                         <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black flex items-center justify-center max-h-56">
//                           <img 
//                             src={selectedImage} 
//                             alt="Original Leaf" 
//                             className="w-full h-56 object-contain"
//                           />
//                         </div>
//                       </div>

//                       <div className="space-y-2 text-center">
//                         <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
//                           AI हीटमैप डायग्नोसिस (Hotspot Heatmap)
//                         </span>
//                         <div className="overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-black flex items-center justify-center max-h-56 shadow-lg shadow-emerald-950/50">
//                           <img 
//                             src={heatmapImage} 
//                             alt="Disease Heatmap" 
//                             className="w-full h-56 object-contain"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Heatmap Legend */}
//                     <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] font-black">
//                       <div className="bg-emerald-950/80 border border-emerald-500/40 p-2 rounded-xl text-emerald-300">
//                         🟢 हरा: स्वस्थ क्लोरोफिल
//                       </div>
//                       <div className="bg-amber-950/80 border border-amber-500/40 p-2 rounded-xl text-amber-300">
//                         🟡 पीला: शुरुआती संक्रमण
//                       </div>
//                       <div className="bg-rose-950/80 border border-rose-500/40 p-2 rounded-xl text-rose-300">
//                         🔴 लाल: गंभीर नेक्रोसिस
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* 🌟 6. CLINICAL TREATMENT TABS */}
//                 <div className="space-y-4 pt-1">
                  
//                   {/* Tab Selectors */}
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/70">
//                     <button
//                       onClick={() => setActiveTab('chemical')}
//                       className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
//                         activeTab === 'chemical' 
//                           ? 'bg-[#14532d] text-white shadow-md' 
//                           : 'text-slate-600 hover:text-slate-900'
//                       }`}
//                     >
//                       🧪 रासायनिक दवा (Chemical)
//                     </button>

//                     <button
//                       onClick={() => setActiveTab('organic')}
//                       className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
//                         activeTab === 'organic' 
//                           ? 'bg-[#14532d] text-white shadow-md' 
//                           : 'text-slate-600 hover:text-slate-900'
//                       }`}
//                     >
//                       🌿 जैविक / देसी (Organic)
//                     </button>

//                     <button
//                       onClick={() => setActiveTab('irrigation')}
//                       className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
//                         activeTab === 'irrigation' 
//                           ? 'bg-[#14532d] text-white shadow-md' 
//                           : 'text-slate-600 hover:text-slate-900'
//                       }`}
//                     >
//                       💧 सिंचाई व मौसम सलाह
//                     </button>

//                     <button
//                       onClick={() => setActiveTab('prevent')}
//                       className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
//                         activeTab === 'prevent' 
//                           ? 'bg-[#14532d] text-white shadow-md' 
//                           : 'text-slate-600 hover:text-slate-900'
//                       }`}
//                     >
//                       🛡️ रोकथाम के उपाय
//                     </button>
//                   </div>

//                   {/* TAB 1: CHEMICAL */}
//                   {activeTab === 'chemical' && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
//                       {(result.chemicalMedicines || []).map((item, idx) => (
//                         <div key={idx} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-1.5">
//                           <div className="flex items-center justify-between">
//                             <h5 className="font-black text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
//                               <Pill className="w-4 h-4 text-emerald-700 shrink-0" />
//                               <span>{item.name}</span>
//                             </h5>
//                             <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
//                               सटीक खुराक
//                             </span>
//                           </div>
//                           <p className="text-xs font-bold text-slate-800 pl-6">
//                             मात्रा: <span className="text-emerald-950 font-black">{item.dosage}</span>
//                           </p>
//                           <p className="text-[11px] text-slate-500 font-medium pl-6 flex items-center gap-1">
//                             <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
//                             <span>छिड़काव विधि: {item.howToUse}</span>
//                           </p>
//                         </div>
//                       ))}

//                       <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 font-bold flex items-center gap-2">
//                         <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
//                         <span>सावधानी: स्प्रे करते समय चेहरे पर मास्क लगाएं और तेज धूप में छिड़काव न करें।</span>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* TAB 2: ORGANIC */}
//                   {activeTab === 'organic' && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
//                       {(result.organicCare || []).map((item, idx) => (
//                         <div key={idx} className="bg-green-50/60 p-4 rounded-2xl border border-green-200/80 space-y-1.5">
//                           <h5 className="font-black text-xs sm:text-sm text-green-950 flex items-center gap-2">
//                             <Leaf className="w-4 h-4 text-green-700 shrink-0" />
//                             <span>{item.name}</span>
//                           </h5>
//                           <p className="text-xs font-bold text-slate-800 pl-6">
//                             घोल / अनुपात: <span className="text-green-950 font-black">{item.dosage}</span>
//                           </p>
//                           <p className="text-[11px] text-slate-500 font-medium pl-6">
//                             उपयोग विधि: {item.howToUse}
//                           </p>
//                         </div>
//                       ))}
//                     </motion.div>
//                   )}

//                   {/* TAB 3: IRRIGATION */}
//                   {activeTab === 'irrigation' && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-sky-50/80 p-5 rounded-2xl border border-sky-200 space-y-3">
//                       <div className="flex items-center gap-2 text-sky-950 font-black text-xs sm:text-sm">
//                         <Droplet className="w-4 h-4 text-sky-700" />
//                         <span>जल प्रबंधन व मौसम संबंधी निर्देश (Water Advisory)</span>
//                       </div>
//                       <p className="text-xs text-slate-700 font-semibold leading-relaxed">
//                         {result.irrigationAdvisory}
//                       </p>
//                       {result.sprayTiming && (
//                         <div className="pt-2 border-t border-sky-200/60 text-[11px] font-bold text-sky-900">
//                           🕒 <strong>अनुकूल स्प्रे समय:</strong> {result.sprayTiming}
//                         </div>
//                       )}
//                     </motion.div>
//                   )}

//                   {/* TAB 4: PREVENTION */}
//                   {activeTab === 'prevent' && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
//                       <div className="flex items-center gap-2 text-slate-900 font-black text-xs sm:text-sm">
//                         <ShieldCheck className="w-4 h-4 text-emerald-700" />
//                         <span>भविष्य में रोग से बचाव हेतु गाइड (Preventive Protocol)</span>
//                       </div>
//                       <ul className="space-y-2 text-xs text-slate-700 font-medium">
//                         {[
//                           "संक्रमित पत्तियों को समय पर खेत से बाहर निकालकर नष्ट करें।",
//                           "बुवाई से पहले बीजोपचार अनिवार्य रूप से करें।",
//                           "नाइट्रोजन खाद (यूरिया) का असंतुलित उपयोग रोकें।"
//                         ].map((measure, idx) => (
//                           <li key={idx} className="flex items-start gap-2">
//                             <span className="text-emerald-700 font-black">•</span>
//                             <span>{measure}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </motion.div>
//                   )}

//                 </div>

//                 {/* 🌟 7. DIRECT 1-CLICK MARKETPLACE ACTION */}
//                 <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
//                   <div className="text-left w-full sm:w-auto">
//                     <span className="text-[10px] text-slate-400 font-bold uppercase block">दवा व कृषि केंद्र</span>
//                     <p className="text-xs font-black text-slate-800">सुझाई गई अधिकृत दवाएं नजदीकी केंद्रों पर उपलब्ध हैं</p>
//                   </div>

//                   <Link
//                     to="/marketplace"
//                     className="w-full sm:w-auto bg-[#14532d] hover:bg-[#0f3d21] text-white text-xs font-black px-6 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
//                   >
//                     <ShoppingBag className="w-4 h-4" />
//                     <span>दवा दुकान व केंद्र देखें (View Shops)</span>
//                   </Link>
//                 </div>

//               </div>
//             )}

//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }





















import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  X, 
  FlipHorizontal,
  Leaf,
  Droplet,
  Pill,
  Volume2,
  VolumeX,
  Printer,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Flame,
  Check,
  Activity,
  Zap,
  Microscope,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function CropDoctor() {
  const { t, lang } = useLanguage();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [activeTab, setActiveTab] = useState('chemical');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Live Camera states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle Gallery Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
      stopCamera();
    }
  };

  // Start Camera
  const startCamera = async (mode = facingMode) => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert(t({
        hi: "कैमरा चालू नहीं हो सका। कृपया ब्राउज़र सेटिंग्स में कैमरा परमिशन चेक करें।",
        en: "Unable to access camera. Please check camera permissions in browser settings."
      }));
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `crop_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setImageFile(file);
          setSelectedImage(URL.createObjectURL(file));
          setResult(null);
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Voice Guidance (TTS)
  const toggleVoiceGuide = () => {
    if (!('speechSynthesis' in window)) {
      alert("Voice guidance is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToSpeak = result?.voiceText || `${result?.diseaseName} पाया गया है। कृपया बताए गए उपचार का पालन करें।`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Analyze Crop (Live Render Deployment + Local Fallback)
  const handleAnalyze = async () => {
    if (!imageFile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert(t({
        hi: "AI Server से कनेक्ट नहीं हो सका। बैकएंड सर्वर चेक करें।",
        en: "Unable to connect to AI Server. Please check the backend connection."
      }));
    } finally {
      setLoading(false);
    }
  };

  const printPrescription = () => {
    window.print();
  };

  // Fast Extraction variables
  const detectedCrop = result?.cropName;
  const detectedDisease = result?.diseaseName;
  const quickMed = result?.quickSummary?.sateekDawai || result?.chemicalMedicines?.[0]?.name || (lang === 'hi' ? "विशेषज्ञ से सलाह लें" : "Consult Expert");
  const quickDosage = result?.quickSummary?.khurakPer15L || result?.chemicalMedicines?.[0]?.dosage || (lang === 'hi' ? "पैकेट पर देखें" : "Refer to label");
  const heatmapImage = result?.heatmapImage;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 md:pb-12 font-sans px-3 sm:px-6">
      
      {/* 🌟 1. HERO HEADER BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-[#0d4718] to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-emerald-500/20"
      >
        <div className="relative z-10 space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase text-emerald-300 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            AI Computer-Vision Crop Pathology
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            AI Crop Doctor & Clinical Lab
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed">
            {t({
              hi: "पत्ती की फोटो अपलोड करें — AI तुरंत सटीक रोग पहचान, विश्वसनीय दवा व 15L पंप की सही खुराक (Dosage) और जैविक उपचार प्रदान करेगा।",
              en: "Upload a crop leaf photo — AI delivers instant disease diagnosis, verified ICAR medicines, 15L tank dosage, and bio remedies."
            })}
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Leaf className="w-64 h-64 text-emerald-400 transform -rotate-12" />
        </div>
      </motion.div>

      {/* 🌟 2. SCANNER & UPLOAD SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm p-4 sm:p-7 space-y-5 transition-colors duration-300">
        
        {/* Viewport Box */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-950 flex items-center justify-center min-h-[320px] sm:min-h-[380px] shadow-inner">
          
          {/* Laser Scanning Animation when Analyzing */}
          {loading && (
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "95%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-30 shadow-[0_0_15px_#34d399]"
            />
          )}

          {isCameraOpen ? (
            <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] flex items-center justify-center bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover max-h-[400px]"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Brackets */}
              <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                </div>
              </div>

              {/* Live Camera Bar Controls */}
              <div className="absolute bottom-5 left-0 right-0 px-8 flex items-center justify-between z-20">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition"
                  title="Switch Camera"
                >
                  <FlipHorizontal className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={capturePhoto}
                  className="p-1.5 bg-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition"
                >
                  <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition"
                  title="Close Camera"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : selectedImage ? (
            <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] flex items-center justify-center bg-slate-950 p-2">
              <img 
                src={selectedImage} 
                alt="Leaf Preview" 
                className="max-h-[360px] w-auto max-w-full object-contain rounded-2xl"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImageFile(null);
                  setResult(null);
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white p-2 rounded-full transition shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <div className="w-16 h-16 mx-auto bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-inner">
                <Leaf className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black text-white">
                  {t({ hi: "पत्ती की स्पष्ट फोटो खींचें या चुनें", en: "Capture or upload clear crop leaf photo" })}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {t({ hi: "रोग की 98%+ सटीक जांच हेतु पत्ती को रोशनी में रखें", en: "Ensure proper lighting for 98%+ AI diagnostic precision" })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => startCamera('environment')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-300 font-black text-xs transition border border-emerald-200 dark:border-emerald-800 shadow-xs active:scale-[0.98]"
          >
            <Camera className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>{t({ hi: "लाइव कैमरा से फोटो लें", en: "Take Live Photo" })}</span>
          </button>

          <label className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs transition border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer active:scale-[0.98]">
            <Upload className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>{t({ hi: "गैलरी से अपलोड करें", en: "Upload from Gallery" })}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Big Execution Button */}
        <button
          onClick={handleAnalyze}
          disabled={!imageFile || loading || isCameraOpen}
          className="w-full bg-gradient-to-r from-[#14532d] via-[#166534] to-[#15803d] hover:from-[#0f3d21] hover:to-[#14532d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm py-4 rounded-2xl shadow-xl shadow-emerald-900/15 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
              <span>{t({ hi: "AI विश्लेषण व रोग जांच जारी है...", en: "AI Analyzing Crop Pathology..." })}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{t({ hi: "Analyze Crop & Get Treatment (फसल रोग जांचें)", en: "Analyze Crop & Get Treatment" })}</span>
            </>
          )}
        </button>
      </div>

      {/* 🌟 3. CLEAR DIAGNOSTIC RESULTS REPORT */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >

            {/* ❌ Invalid Non-Plant Alert */}
            {result.isPlant === false && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-5 rounded-3xl flex items-start gap-4 shadow-sm">
                <div className="bg-rose-100 dark:bg-rose-900/60 p-2.5 rounded-2xl text-rose-700 dark:text-rose-300 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-rose-950 dark:text-rose-200">
                    {t({ hi: "अमान्य फोटो (Not a Plant Leaf)", en: "Invalid Image (Not a Crop Leaf)" })}
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
                    {result.message}
                  </p>
                </div>
              </div>
            )}

            {/* ✅ Genuine Plant Diagnostic View */}
            {result.isPlant === true && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-900/5 p-5 sm:p-8 space-y-7 transition-colors duration-300">
                
                {/* Status Bar, Voice & Print */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {result.diseaseDetected ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 shadow-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        {t({ hi: "संक्रमण पाया गया (Disease Detected)", en: "Disease Detected" })}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        {t({ hi: "फसल 100% स्वस्थ है (Healthy Crop)", en: "Crop is 100% Healthy" })}
                      </span>
                    )}
                    <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                      {t({ hi: "सटीकता", en: "Confidence" })}: {result.confidence}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleVoiceGuide}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs ${
                        isSpeaking 
                          ? 'bg-amber-500 text-white animate-pulse' 
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />}
                      <span>{isSpeaking ? t({ hi: "आवाज रोकें", en: "Stop Audio" }) : t({ hi: "रिपोर्ट सुनें (Voice)", en: "Listen Report" })}</span>
                    </button>

                    <button
                      onClick={printPrescription}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition"
                      title={t({ hi: "पर्चा प्रिंट करें", en: "Print Prescription" })}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 🌟 4. HIGH-IMPACT SPLIT CARDS (Fasal + Rog + Urgent Dawa) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: Fasal */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> 
                      {t({ hi: "पहचानी गई फसल", en: "Detected Crop" })}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{detectedCrop}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {t({ hi: "खेत की प्रमाणित फसल", en: "Verified Field Specimen" })}
                    </p>
                  </div>

                  {/* Card 2: Bimari */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50 p-4.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1">
                      <Activity className="w-3 h-3 text-amber-600 dark:text-amber-400" /> 
                      {t({ hi: "रोग का नाम (Disease)", en: "Disease Name" })}
                    </span>
                    <h3 className="text-lg font-black text-amber-950 dark:text-amber-200">{detectedDisease}</h3>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                      {t({ hi: "गंभीरता", en: "Severity" })}: <strong className="text-amber-950 dark:text-amber-100">{result.severity || "मध्यम"}</strong>
                    </p>
                  </div>

                  {/* Card 3: Urgent Dawa & Dosage */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 p-4.5 rounded-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                      <Pill className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> 
                      {t({ hi: "सटीक दवा (Direct Remedy)", en: "Verified Medicine" })}
                    </span>
                    <h3 className="text-base font-black text-emerald-950 dark:text-emerald-200 truncate" title={quickMed}>
                      {quickMed}
                    </h3>
                    <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
                      {t({ hi: "मात्रा", en: "Dosage" })}: <strong className="text-emerald-950 dark:text-white">{quickDosage}</strong>
                    </p>
                  </div>

                </div>

                {/* AI Pathology Summary Note */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Microscope className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>{t({ hi: "AI पैथोलॉजी विश्लेषण व रिपोर्ट:", en: "AI Pathology Analysis:" })}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {result.analysisSummary}
                  </p>

                  {/* Observed symptoms pill tags */}
                  {result.symptomsObserved && result.symptomsObserved.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {result.symptomsObserved.map((symp, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{symp}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🌟 5. THERMAL PATHOLOGY HEATMAP RADAR (Side-by-Side) */}
                {heatmapImage && (
                  <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-xl border border-slate-800">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                        <h4 className="text-sm font-black tracking-tight text-white">
                          AI इंफेक्शन हीटमैप विश्लेषण (Thermal Lesion Hotspots)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-xl">
                        संक्रमित सतह: <strong className="text-rose-400">{result.infectionPercent || "N/A"}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 text-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          असली पत्ती (Original Leaf)
                        </span>
                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black flex items-center justify-center max-h-56">
                          <img 
                            src={selectedImage} 
                            alt="Original Leaf" 
                            className="w-full h-56 object-contain"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                          AI हीटमैप डायग्नोसिस (Hotspot Heatmap)
                        </span>
                        <div className="overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-black flex items-center justify-center max-h-56 shadow-lg shadow-emerald-950/50">
                          <img 
                            src={heatmapImage} 
                            alt="Disease Heatmap" 
                            className="w-full h-56 object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Heatmap Legend */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] font-black">
                      <div className="bg-emerald-950/80 border border-emerald-500/40 p-2 rounded-xl text-emerald-300">
                        🟢 हरा: स्वस्थ क्लोरोफिल
                      </div>
                      <div className="bg-amber-950/80 border border-amber-500/40 p-2 rounded-xl text-amber-300">
                        🟡 पीला: शुरुआती संक्रमण
                      </div>
                      <div className="bg-rose-950/80 border border-rose-500/40 p-2 rounded-xl text-rose-300">
                        🔴 लाल: गंभीर नेक्रोसिस
                      </div>
                    </div>
                  </div>
                )}

                {/* 🌟 6. CLINICAL TREATMENT TABS */}
                <div className="space-y-4 pt-1">
                  
                  {/* Tab Selectors */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                    <button
                      onClick={() => setActiveTab('chemical')}
                      className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
                        activeTab === 'chemical' 
                          ? 'bg-[#14532d] text-white shadow-md' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t({ hi: "🧪 रासायनिक दवा", en: "🧪 Chemical Cure" })}
                    </button>

                    <button
                      onClick={() => setActiveTab('organic')}
                      className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
                        activeTab === 'organic' 
                          ? 'bg-[#14532d] text-white shadow-md' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t({ hi: "🌿 जैविक / देसी", en: "🌿 Organic Care" })}
                    </button>

                    <button
                      onClick={() => setActiveTab('irrigation')}
                      className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
                        activeTab === 'irrigation' 
                          ? 'bg-[#14532d] text-white shadow-md' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t({ hi: "💧 सिंचाई व मौसम", en: "💧 Water Advisory" })}
                    </button>

                    <button
                      onClick={() => setActiveTab('prevent')}
                      className={`py-2.5 px-2 text-xs font-black rounded-xl transition ${
                        activeTab === 'prevent' 
                          ? 'bg-[#14532d] text-white shadow-md' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t({ hi: "🛡️ रोकथाम के उपाय", en: "🛡️ Prevention" })}
                    </button>
                  </div>

                  {/* TAB 1: CHEMICAL */}
                  {activeTab === 'chemical' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      {(result.chemicalMedicines || []).map((item, idx) => (
                        <div key={idx} className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h5 className="font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                              <Pill className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                              <span>{item.name}</span>
                            </h5>
                            <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                              {t({ hi: "सटीक खुराक", en: "Dosage" })}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 pl-6">
                            {t({ hi: "मात्रा", en: "Dose" })}: <span className="text-emerald-950 dark:text-emerald-300 font-black">{item.dosage}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pl-6 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{t({ hi: "छिड़काव विधि", en: "Application" })}: {item.howToUse}</span>
                          </p>
                        </div>
                      ))}

                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-950 dark:text-amber-300 font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                        <span>{t({ hi: "सावधानी: स्प्रे करते समय चेहरे पर मास्क लगाएं और तेज धूप में छिड़काव न करें।", en: "Caution: Wear a mask during application and avoid spraying in direct scorching sunlight." })}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: ORGANIC */}
                  {activeTab === 'organic' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      {(result.organicCare || []).map((item, idx) => (
                        <div key={idx} className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-2xl border border-green-200/80 dark:border-green-800/60 space-y-1.5">
                          <h5 className="font-black text-xs sm:text-sm text-green-950 dark:text-green-200 flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-green-700 dark:text-green-400 shrink-0" />
                            <span>{item.name}</span>
                          </h5>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 pl-6">
                            {t({ hi: "घोल / अनुपात", en: "Dilution Ratio" })}: <span className="text-green-950 dark:text-green-300 font-black">{item.dosage}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pl-6">
                            {t({ hi: "उपयोग विधि", en: "Usage Instructions" })}: {item.howToUse}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* TAB 3: IRRIGATION */}
                  {activeTab === 'irrigation' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-sky-50/80 dark:bg-sky-950/20 p-5 rounded-2xl border border-sky-200 dark:border-sky-800/60 space-y-3">
                      <div className="flex items-center gap-2 text-sky-950 dark:text-sky-200 font-black text-xs sm:text-sm">
                        <Droplet className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                        <span>{t({ hi: "जल प्रबंधन व मौसम संबंधी निर्देश (Water Advisory)", en: "Irrigation & Water Management Advisory" })}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                        {result.irrigationAdvisory}
                      </p>
                      {result.sprayTiming && (
                        <div className="pt-2 border-t border-sky-200/60 dark:border-sky-800/60 text-[11px] font-bold text-sky-900 dark:text-sky-300">
                          🕒 <strong>{t({ hi: "अनुकूल स्प्रे समय:", en: "Optimal Spray Window:" })}</strong> {result.sprayTiming}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 4: PREVENTION */}
                  {activeTab === 'prevent' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs sm:text-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>{t({ hi: "भविष्य में रोग से बचाव हेतु गाइड (Preventive Protocol)", en: "Future Preventive Protocols & Crop Health Guide" })}</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {[
                          t({ hi: "संक्रमित पत्तियों को समय पर खेत से बाहर निकालकर नष्ट करें।", en: "Isolate and incinerate heavily infected foliage promptly." }),
                          t({ hi: "बुवाई से पहले बीजोपचार अनिवार्य रूप से करें।", en: "Ensure certified seed chemical/bio treatment prior to sowing." }),
                          t({ hi: "नाइट्रोजन खाद (यूरिया) का असंतुलित उपयोग रोकें।", en: "Avoid excessive nitrogen (urea) overdose to minimize fungal susceptibility." })
                        ].map((measure, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-700 dark:text-emerald-400 font-black">•</span>
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                </div>

                {/* 🌟 7. DIRECT 1-CLICK MARKETPLACE ACTION */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left w-full sm:w-auto">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">
                      {t({ hi: "दवा व कृषि केंद्र", en: "Agri Stores & Centers" })}
                    </span>
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {t({ hi: "सुझाई गई अधिकृत दवाएं नजदीकी केंद्रों पर उपलब्ध हैं", en: "Recommended certified medicines available at nearby verified centers" })}
                    </p>
                  </div>

                  <Link
                    to="/marketplace"
                    className="w-full sm:w-auto bg-[#14532d] hover:bg-[#0f3d21] text-white text-xs font-black px-6 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t({ hi: "दवा दुकान व केंद्र देखें (View Shops)", en: "Locate Stores & Order" })}</span>
                  </Link>
                </div>

              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}