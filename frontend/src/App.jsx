// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// // Layout & Core Components
// import Navbar from './components/Navbar';
// import ProtectedRoute from './components/ProtectedRoute';
// import LoadingScreen from './components/LoadingScreen';

// // Pages
// import Dashboard from './pages/Dashboard';
// import CropDoctor from './pages/CropDoctor';
// import Weather from './pages/Weather';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import Login from './pages/Login';
// import AIAssistant from './pages/AIAssistant';
// import Marketplace from './pages/Marketplace';
// import SellCrop from './pages/SellCrop';
// import Orders from './pages/Orders';
// import Notifications from './pages/Notifications';
// import Admin from './pages/Admin';
// import CommunityGroups from './pages/CommunityGroups';

// /* =========================================================================
//    SAFE IN-FILE PLACEHOLDERS
// ========================================================================= */
// // frontend/src/App.jsx ke andar:
// useEffect(() => {
//   const timer = setTimeout(() => {
//     setInitialLoading(false);
//   }, 4000); // 👈 4 second tak 3D kisan chalta hua dikhega

//   return () => clearTimeout(timer);
// }, []);









// const Crops = () => (
//   <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//     <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-3">
//       <h2 className="text-2xl font-black text-slate-900">🌱 My Registered Crops</h2>
//       <p className="text-sm text-slate-500 font-medium">
//         खेत व बुवाई का पूरा विवरण।
//       </p>
//     </div>
//   </div>
// );

// // Layout wrapper jisme Navbar har protected route par show hoga
// function AppLayout() {
//   return (
//     <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
//       <Navbar />
//       <main className="flex-1 w-full">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default function App() {
//   const [initialLoading, setInitialLoading] = useState(true);

//   useEffect(() => {
//     // App start hone par 1.2 sec ka smooth initial sync
//     const timer = setTimeout(() => {
//       setInitialLoading(false);
//     }, 1200);

//     return () => clearTimeout(timer);
//   }, []);

//   if (initialLoading) {
//     return <LoadingScreen message="AI Farm Intelligence & Satellite Radar Syncing..." />;
//   }

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Authentication Route */}
//         <Route path="/login" element={<Login />} />

//         {/* Protected App Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<AppLayout />}>
//             {/* Core Views */}
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/crop-doctor" element={<CropDoctor />} />
//             <Route path="/weather" element={<Weather />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/settings" element={<Settings />} />

//             {/* Farm & Commerce Modules */}
//             <Route path="/marketplace" element={<Marketplace />} />
//             <Route path="/crops" element={<Crops />} />
//             <Route path="/ai-assistant" element={<AIAssistant />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/notifications" element={<Notifications />} />
//             <Route path="/sell-crop" element={<SellCrop />} />
//             <Route path="/admin" element={<Admin />} />
//             <Route path="/community" element={<CommunityGroups />} />
//           </Route>
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }







import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Global Context Providers (Day/Night & Multi-Language)
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout & Core Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Dashboard from './pages/Dashboard';
import CropDoctor from './pages/CropDoctor';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AIAssistant from './pages/AIAssistant';
import Marketplace from './pages/Marketplace';
import SellCrop from './pages/SellCrop';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';
import CommunityGroups from './pages/CommunityGroups';
import Admin from './pages/Admin';

const Crops = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors duration-300">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">🌱 My Registered Crops</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">खेत व बुवाई का पूरा विवरण।</p>
    </div>
  </div>
);

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#070c18] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // 3D animation loader 4 seconds tak chalega
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <LoadingScreen message="AI Farm Intelligence & Field Engine Syncing..." />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected App Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crop-doctor" element={<CropDoctor />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/sell-crop" element={<SellCrop />} />
                <Route path="/community" element={<CommunityGroups />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}