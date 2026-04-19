import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Car, Calendar, Users, Settings, LogOut, ArrowLeft, Navigation, Shield, Activity, Bell, Ticket } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { title: 'Command Center', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: 'Fleet Logistics', path: '/admin/fleet', icon: <Car className="h-5 w-5" /> },
    { title: 'Promo Protocol', path: '/admin/coupons', icon: <Ticket className="h-5 w-5" /> },
    { title: 'Global Tracking', path: '/admin/tracking', icon: <Navigation className="h-5 w-5" /> },
    { title: 'Live Map Telemetry', path: '/admin/map', icon: <Activity className="h-5 w-5" /> },
    { title: 'Reservations', path: '/admin/bookings', icon: <Calendar className="h-5 w-5" /> },
    { title: 'Client Identities', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <div className="dark">
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-inter selection:bg-blue-500/30">
        
        {/* Tactical Sidebar */}
        <aside className="w-full md:w-80 bg-slate-900 border-r border-white/5 flex flex-col shadow-2xl relative z-20">
          <div className="p-10 border-b border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Link to="/" className="relative flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                   <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                   <span className="font-black text-xl text-white uppercase tracking-tighter leading-none">UNITED<span className="text-blue-500">OPS</span></span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 italic">Strategic Port</span>
                </div>
             </Link>
          </div>

          <div className="p-6 px-4">
             <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6 mb-4">Command Modules</div>
             <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                       <div className={`${isActive ? 'text-white' : 'text-blue-500/70 group-hover:text-blue-400'}`}>
                          {item.icon}
                       </div>
                       <span className="text-sm tracking-wide">{item.title}</span>
                       {isActive && (
                         <motion.div 
                           layoutId="activeGlow"
                           className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                         />
                       )}
                    </Link>
                  );
                })}
             </nav>
          </div>

          <div className="mt-auto p-6 space-y-2 border-t border-white/5 bg-slate-900/50">
             <div className="flex items-center gap-4 px-6 py-3 mb-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Online: v4.2.0</span>
             </div>

             <Link to="/admin/config" className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                <Settings className="h-5 w-5" />
                <span className="text-sm">Config</span>
             </Link>
             
             <button 
               onClick={() => {
                 logout();
                 window.location.href = '/';
               }}
               className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
             >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">De-authenticate</span>
             </button>
          </div>
        </aside>

        {/* Intelligence Stream (Main Content) */}
        <div className="flex-grow flex flex-col h-screen overflow-hidden bg-slate-950">
           {/* Header Bar */}
           <header className="h-20 border-b border-white/5 px-12 flex items-center justify-between bg-slate-950/50 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-4">
                 <Activity className="h-5 w-5 text-blue-500" />
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Telemetry Stream</span>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-white/5">
                    <Bell className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Alerts</span>
                 </div>
                 <div className="h-10 w-px bg-white/5"></div>
                 <div className="flex items-center gap-3">
                    <div className="text-right">
                       <div className="text-xs font-black text-white leading-none capitalize">Admin Intelligence</div>
                       <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1">Status: Superuser</div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs border border-white/10 shadow-lg shadow-blue-500/20">
                       AD
                    </div>
                 </div>
              </div>
           </header>

           <main className="flex-grow p-12 overflow-y-auto custom-scrollbar relative">
              <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>
              <div className="max-w-7xl mx-auto">
                 {children}
              </div>
           </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
