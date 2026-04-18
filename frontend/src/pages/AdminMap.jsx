import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Navigation, SignalHigh, Wifi, Car, ShieldAlert, Cpu } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import API_BASE_URL from '../config';

const AdminMap = () => {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [activeCar, setActiveCar] = useState(null);

  // Poll vehicles every 3 seconds to simulate live movement
  const fetchTelemetry = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cars`);
      if (res.ok) {
        let text = await res.text();
        // Fallback for mock if needed
        const data = JSON.parse(text);
        
        // Add artificial jitter to coordinates for "live" effect
        const liveCars = data.map(c => {
           // Default map center pseudo-coords if missing
           const baseX = c.location?.lng || Math.random() * 80 + 10;
           const baseY = c.location?.lat || Math.random() * 80 + 10;
           
           return {
             ...c,
             liveX: baseX + (Math.random() * 4 - 2),
             liveY: baseY + (Math.random() * 4 - 2),
             speed: Math.floor(Math.random() * 80) + 20, // 20-100 km/h
             status: Math.random() > 0.8 ? 'idle' : 'moving'
           }
        });
        setCars(liveCars);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AdminLayout>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black mb-2 dark:text-white flex items-center gap-3">
              <SignalHigh className="text-green-500" /> Global Tracking
           </h1>
           <p className="text-slate-500 font-medium">Real-time GPS Telemetry & Fleet Operations</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-green-500/20">
              <Wifi className="h-4 w-4 animate-pulse" /> SATELLITE LINK ACTIVE
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[70vh]">
         {/* Live Map Display */}
         <div className="lg:col-span-3 glass rounded-[2.5rem] bg-slate-900 overflow-hidden relative border border-blue-500/20 shadow-2xl shadow-blue-900/20">
            {/* Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
            
            {/* Radar Sweep */}
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_90deg,transparent_0deg,rgba(59,130,246,0.1)_90deg,transparent_180deg)] rounded-full animate-[spin_4s_linear_infinite] pointer-events-none"></div>

            <div className="absolute inset-0 p-8">
               {cars.map((c) => (
                  <motion.div
                    key={c._id}
                    animate={{ left: `${c.liveX}%`, top: `${c.liveY}%` }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="absolute cursor-pointer group"
                    onClick={() => setActiveCar(c)}
                  >
                     <div className="relative">
                        <div className={`absolute -inset-4 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 relative ${c.status === 'idle' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                           {c.brand} {c.model}
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* Overlay UI */}
            <div className="absolute bottom-6 left-6 p-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl">
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Metrics</div>
               <div className="flex gap-6">
                  <div>
                    <div className="text-xs text-slate-500">Active Units</div>
                    <div className="text-lg font-black text-white">{cars.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Network</div>
                    <div className="text-lg font-black text-green-500">99.9%</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Side Panel: Active Telemetry */}
         <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-y-auto pr-2">
            {activeCar ? (
               <div className="glass p-6 rounded-3xl bg-slate-900 border border-blue-500/30 text-white">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1 mt-1">Target Locked</div>
                        <h3 className="text-xl font-black">{activeCar.brand} {activeCar.model}</h3>
                     </div>
                     <button onClick={() => setActiveCar(null)} className="text-slate-500 hover:text-white">✕</button>
                  </div>
                  
                  <img src={activeCar.image} alt={activeCar.model} className="w-full h-32 object-cover rounded-xl mb-6 opacity-80 mix-blend-screen" />
                  
                  <div className="space-y-4">
                     <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Navigation className="h-3 w-3"/> Speed</div>
                        <div className="text-2xl font-black text-blue-400">{activeCar.speed} <span className="text-sm text-slate-500">km/h</span></div>
                     </div>
                     <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><MapPin className="h-3 w-3"/> Coordinates</div>
                        <div className="text-sm font-mono text-slate-300">
                           {activeCar.liveY.toFixed(4)}° N<br/>
                           {activeCar.liveX.toFixed(4)}° E
                        </div>
                     </div>
                     <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Cpu className="h-3 w-3"/> Engine Status</div>
                        <div className="text-sm font-bold text-green-400 uppercase tracking-widest">{activeCar.status === 'idle' ? 'Idling' : 'Nominal'}</div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="glass p-8 rounded-3xl bg-white dark:bg-slate-900 h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Navigation className="h-12 w-12 text-slate-400 mb-4" />
                  <div className="text-sm font-bold dark:text-white">Select a vehicle on the map to view detailed telemetry data.</div>
               </div>
            )}
         </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMap;
