import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, MapPin, Search, Filter, 
  Info, ShieldCheck, Activity, User, Phone,
  ArrowRight, Gauge, Droplets, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

// Icon Setup
const carIconNormal = new L.DivIcon({
  html: `<div class="bg-blue-600 p-2 rounded-full border-2 border-white shadow-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const carIconRented = new L.DivIcon({
  html: `<div class="bg-red-500 p-2 rounded-full border-2 border-white shadow-lg text-white animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const AdminFleetTracker = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, rented, available
  
  const center = [26.9124, 75.7873]; // Jaipur Center

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cars`);
        const data = await res.json();
        // Simulate cars scattered around Jaipur HQ
        const jaipurData = data.map(car => ({
          ...car,
          location: {
             lat: 26.9124 + (Math.random() - 0.5) * 0.05,
             lng: 75.7873 + (Math.random() - 0.5) * 0.05,
             address: 'Jaipur, Rajasthan, India'
          }
        }));
        setCars(jaipurData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();

    // Simulation: Move rented cars slightly every 5 seconds
    const interval = setInterval(() => {
      setCars(prev => prev.map(car => {
        if (!car.isAvailable) {
          return {
            ...car,
            location: {
              ...car.location,
              lat: car.location.lat + (Math.random() - 0.5) * 0.001,
              lng: car.location.lng + (Math.random() - 0.5) * 0.001
            },
            telemetry: {
              speed: Math.floor(Math.random() * 80) + 20,
              fuel: Math.max(10, car.telemetry?.fuel - 0.1 || 80)
            }
          };
        }
        return car;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredCars = cars.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'rented') return !c.isAvailable;
    if (filter === 'available') return c.isAvailable;
    return true;
  });

  return (
    <div className="h-[calc(100vh-80px)] w-full relative flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Sidebar: Active Fleet List */}
      <aside className="w-full md:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 z-20 flex flex-col shadow-2xl">
         <div className="p-8 border-b border-slate-100 dark:border-white/5">
            <h1 className="text-3xl font-black dark:text-white mb-2 flex items-center gap-3">
               <Navigation className="text-blue-600 h-8 w-8" /> Command
            </h1>
            <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-widest">Fleet Live Intelligence</p>
            
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl">
               {['all', 'rented', 'available'].map(f => (
                 <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}
                 >
                  {f}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {filteredCars.map(car => (
              <motion.div 
                key={car._id}
                onClick={() => setSelectedCar(car)}
                className={`p-5 rounded-[2rem] border transition-all cursor-pointer group ${selectedCar?._id === car._id ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20 scale-[1.02]' : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-blue-500/30'}`}
              >
                 <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 overflow-hidden shrink-0">
                       <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${car.isAvailable ? 'bg-green-500/10 text-green-500' : 'bg-red-500 text-white animate-pulse'}`}>
                       {car.isAvailable ? 'Ready' : 'ON JOURNEY'}
                    </div>
                 </div>
                 <h3 className="font-black tracking-tight">{car.brand} {car.model}</h3>
                 <p className={`text-xs ${selectedCar?._id === car._id ? 'text-blue-100' : 'text-slate-500'} flex items-center gap-1`}>
                    <MapPin className="h-3 w-3" /> {car.location?.address?.split(',')[0] || 'Jaipur'}
                 </p>
              </motion.div>
            ))}
         </div>
      </aside>

      {/* Map Content */}
      <main className="flex-grow relative z-10">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            className="dark:opacity-80"
          />

          {filteredCars.map(car => (
            <Marker 
              key={car._id} 
              position={[car.location.lat, car.location.lng]} 
              icon={car.isAvailable ? carIconNormal : carIconRented}
              eventHandlers={{
                click: () => setSelectedCar(car),
              }}
            >
               <Popup className="custom-popup">
                  <div className="p-2">
                     <h4 className="font-bold">{car.brand} {car.model}</h4>
                     <p className="text-xs">{car.isAvailable ? 'Available' : 'Currently Rented'}</p>
                  </div>
               </Popup>
            </Marker>
          ))}

          {/* Map Controls */}
          <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
             <button className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-white/20 text-slate-600 dark:text-white hover:scale-105 transition-all">
                <ShieldCheck className="h-6 w-6" />
             </button>
             <button className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-white/20 text-slate-600 dark:text-white hover:scale-105 transition-all">
                <Activity className="h-6 w-6" />
             </button>
          </div>

          {/* HUD for Selected Car */}
          <AnimatePresence>
            {selectedCar && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] md:w-[700px]"
              >
                 <div className="glass p-8 rounded-[3rem] bg-white/90 dark:bg-slate-900/90 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/3 h-44 rounded-[2.5rem] overflow-hidden shrink-0">
                       <img src={selectedCar.image} className="w-full h-full object-cover" alt={selectedCar.model} />
                    </div>

                    <div className="flex-grow">
                        <header className="flex justify-between items-start mb-6">
                           <div>
                              <h3 className="text-2xl font-black dark:text-white leading-tight">{selectedCar.brand} {selectedCar.model}</h3>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCar.isAvailable ? 'text-green-500' : 'text-red-500 animate-pulse'}`}>
                                 {selectedCar.isAvailable ? 'Parked at Hub' : 'Live Tracking Enabled'}
                              </span>
                           </div>
                           <button onClick={() => setSelectedCar(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                              <Info className="h-6 w-6" />
                           </button>
                        </header>

                        <div className="grid grid-cols-3 gap-6">
                           <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Gauge className="h-3 w-3 text-blue-600" /> Speed
                              </div>
                              <div className="text-xl font-black dark:text-white">{selectedCar.telemetry?.speed || 0} <span className="text-[10px] text-slate-400 font-bold uppercase">km/h</span></div>
                           </div>
                           <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Droplets className="h-3 w-3 text-red-500" /> Fuel
                              </div>
                              <div className="text-xl font-black dark:text-white">{Math.floor(selectedCar.telemetry?.fuel || 100)}%</div>
                           </div>
                           <div className="space-y-1">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Zap className="h-3 w-3 text-yellow-500" /> Engine
                              </div>
                              <div className="text-xl font-black text-green-500 uppercase">OK</div>
                           </div>
                        </div>

                        {!selectedCar.isAvailable && (
                          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex gap-4">
                             <div className="flex items-center gap-3 flex-1 p-3 rounded-2xl bg-blue-50 dark:bg-white/5">
                                <User className="h-5 w-5 text-blue-600" />
                                <div className="text-xs font-bold dark:text-white">Active Renter</div>
                             </div>
                             <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer">
                                <Phone className="h-5 w-5" />
                                <span className="text-xs font-bold">Contact</span>
                             </div>
                          </div>
                        )}
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </MapContainer>
      </main>
    </div>
  );
};

export default AdminFleetTracker;
