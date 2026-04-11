import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Car, ArrowRight, ShieldCheck, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_CARS } from '../../data/cars';

// Fix for Leaflet default icon issues in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom Car Marker Icon
const carIcon = new L.DivIcon({
  html: `<div class="bg-blue-600 p-2 rounded-full border-2 border-white shadow-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
         </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const FleetMap = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [pickup, setPickup] = useState({ lat: 19.0760, lng: 72.8777 });
  const [activeTab, setActiveTab] = useState('map'); // map or list
  
  const center = [19.0760, 72.8777]; // Mumbai center

  return (
    <div className="h-[400px] md:h-[600px] w-full rounded-[3rem] overflow-hidden border-4 border-slate-100 dark:border-white/5 relative shadow-2xl">
      
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4 max-w-sm w-full">
         <div className="glass p-4 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Navigation className="h-5 w-5" />
               </div>
               <div>
                  <h4 className="font-bold dark:text-white leading-none">Your Location</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Mumbai, Central Hub</p>
               </div>
            </div>
            <div className="relative">
               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
               <input 
                 type="text" 
                 placeholder="Search pickup point..."
                 className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border-none text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
         </div>

         <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 dark:text-white'}`}
            >
              Live Map
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 dark:text-white'}`}
            >
              Nearby List
            </button>
         </div>
      </div>

      {/* Map Implementation */}
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          className="dark:opacity-80"
        />

        {MOCK_CARS.slice(0, 8).map((car) => (
          <Marker 
            key={car._id} 
            position={[car.location.lat, car.location.lng]} 
            icon={carIcon}
            eventHandlers={{
              click: () => setSelectedCar(car),
            }}
          />
        ))}

        {/* Selected Car Details Card */}
        <AnimatePresence>
          {selectedCar && (
            <div className="absolute top-1/2 right-6 -translate-y-1/2 z-[1000] w-80">
              <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className="glass bg-white dark:bg-slate-900/90 rounded-[2.5rem] shadow-2xl p-6 border border-white/20"
              >
                <button 
                  onClick={() => setSelectedCar(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                   <X className="h-4 w-4 text-slate-400" />
                </button>

                <div className="h-40 rounded-[2rem] overflow-hidden mb-4">
                   <img src={selectedCar.image} alt={selectedCar.model} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4">
                   <div>
                      <h3 className="text-xl font-bold dark:text-white leading-tight">{selectedCar.brand} {selectedCar.model}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs font-bold ml-1">{selectedCar.rating}</span>
                         </div>
                         <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                         <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{selectedCar.transmission}</div>
                      </div>
                   </div>

                   <div className="flex justify-between items-center py-4 border-y border-slate-100 dark:border-white/5">
                      <div className="text-sm font-medium text-slate-500">Daily Rate</div>
                      <div className="text-2xl font-black text-blue-600">₹{selectedCar.pricePerDay}</div>
                   </div>

                   <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Available at <span className="text-slate-900 dark:text-white">{selectedCar.location.address}</span>. Ready for immediate pickup.
                   </p>

                   <Link 
                     to={`/cars/${selectedCar._id}`}
                     className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                   >
                      Book This Vehicle <ArrowRight className="h-4 w-4" />
                   </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </MapContainer>

      {/* Trust Badge */}
      <div className="absolute bottom-6 left-6 z-[1000]">
         <div className="flex gap-4">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-900 shadow-xl border border-white/20">
               <ShieldCheck className="h-5 w-5 text-green-500" />
               <span className="text-sm font-bold dark:text-white">Active Fleet Tracking</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FleetMap;

