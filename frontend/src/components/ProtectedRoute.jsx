import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check Firebase Auth & Local Storage Cache
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const localToken = localStorage.getItem('userToken');
      if (user || localToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#042f24] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
            Loading Portal...
          </span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}