import React from "react";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Mail, 
  ArrowUpRight,
  Heart
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-800/25">
                <Sprout className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Agri<span className="text-emerald-400">Scan</span>
                </span>
                <span className="text-[9px] font-black tracking-widest text-emerald-400 block uppercase -mt-0.5">
                  Smart AI Farm Platform
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Empowering Indian farmers with artificial intelligence for crop leaf disease detection, fair MSP mandi slot booking, and certified chemical supplies.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ICAR & KVK Integrated Standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Services</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><Link to="/crop-doctor" className="hover:text-white transition">Crop Doctor (AI Scan)</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition">Buy Seeds & Medicines</Link></li>
              <li><Link to="/sell-crop" className="hover:text-white transition">Sell Harvest & Mandi Slot</Link></li>
              <li><Link to="/weather" className="hover:text-white transition">Weather & Spray Radar</Link></li>
            </ul>
          </div>

          {/* Tools & Orders */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Farmer Tools</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><Link to="/ai-assistant" className="hover:text-white transition">Kisan Mitra AI Chat</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">My Orders & Shipments</Link></li>
              <li><Link to="/notifications" className="hover:text-white transition">Activity Alerts</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Farmer Profile</Link></li>
            </ul>
          </div>

          {/* Emergency & KVK Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Helpline</h4>
            <div className="space-y-2 text-xs text-slate-400 font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kisan Toll-Free: 1800-180-1551</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Central Hub: Jabalpur & Indore</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@agriscan.farm</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 AgriScan AI Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Farmers
          </p>
        </div>

      </div>
    </footer>
  );
}