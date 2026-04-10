import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, ArrowRight, Home } from 'lucide-react';
import { useEffect } from 'react';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car, bookingData } = location.state || {};

  useEffect(() => {
    if (!car || !bookingData) {
      navigate('/');
    }
  }, [car, bookingData, navigate]);

  if (!car || !bookingData) return null;

  return (
    <div className="min-h-screen pt-20 pb-24 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background aesthetic */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-green-500/10 dark:bg-green-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full glass p-8 md:p-12 rounded-[3.5rem] shadow-2xl bg-white/90 dark:bg-slate-900/90 text-center relative z-10"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="h-14 w-14 text-green-500" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">Booking Confirmed!</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10">
          Pack your bags! Your {car.brand} {car.model} is reserved and waiting for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
           <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-3xl">
              <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                 <Calendar className="h-4 w-4 mr-2 text-blue-500" /> Rental Period
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                 {new Date(bookingData.startDate).toLocaleDateString()} - <br/> {new Date(bookingData.endDate).toLocaleDateString()}
              </div>
           </div>
           
           <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-3xl">
              <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                 <MapPin className="h-4 w-4 mr-2 text-red-500" /> Pickup Point
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                 {bookingData.pickupLocation}
              </div>
           </div>
        </div>

        {bookingData.addons?.length > 0 && (
          <div className="mb-10 text-left">
             <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-2">
                Luxury Extras
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingData.addons.map((addon, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                     <span className="font-bold text-sm dark:text-blue-300">{addon.name}</span>
                     <span className="text-blue-600 dark:text-blue-400 font-black">₹{addon.price}{addon.type === 'per_day' ? '/d' : ''}</span>
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
           <Link 
             to="/my-bookings" 
             className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
           >
             View My Bookings <ArrowRight className="h-5 w-5" />
           </Link>
           <Link 
             to="/" 
             className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
           >
             <Home className="h-5 w-5" /> Back Home
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;

