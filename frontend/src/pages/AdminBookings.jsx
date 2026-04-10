import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Mail, Calendar, MapPin, User, Car, Clock, ArrowRight, TrendingUp, Search, Download } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

const AdminBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookings = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch('http://localhost:5000/api/bookings', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, [user?.token]);

  const handleUpdateTelemetry = async (bookingId, type) => {
    const kmValue = window.prompt(`Enter the ${type === 'start' ? 'Drop-in (Start)' : 'Drop-out (End)'} Odometer Reading (KM):`);
    if (!kmValue || isNaN(kmValue)) return;
    
    try {
      const payload = type === 'start' ? { startKm: Number(kmValue) } : { endKm: Number(kmValue) };
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/telemetry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updatedBooking = await res.json();
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, telemetry: updatedBooking.telemetry } : b));
      } else {
        alert('Failed to update telemetry');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 dark:text-white">Transaction Ledger</h1>
          <p className="text-slate-500 font-medium tracking-wide">Strategic oversight of all customer rental activities.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold text-sm dark:text-white hover:bg-slate-50 transition-all">
           <Download className="h-4 w-4" /> Export Report
        </button>
      </header>

      {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-32 glass animate-pulse rounded-3xl"></div>)}
          </div>
      ) : (
        <div className="glass rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Details</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reserved Vehicle</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Lease (Drop-in / Out)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Odometer Log</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Net Revenue</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {bookings.map((booking, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={booking._id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold dark:text-white text-sm">{booking.user?.name || 'External Client'}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{booking.user?.email || 'Guest Session'}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={booking.car?.image} className="h-10 w-14 object-cover rounded-xl shadow-md border border-white/10" alt="car" />
                          <div className="flex flex-col">
                              <span className="font-bold dark:text-white text-sm">{booking.car?.brand}</span>
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{booking.car?.model}</span>
                          </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold dark:text-white uppercase tracking-tighter"><span className="text-blue-500 mr-2">Drop-in:</span>{new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-slate-400 flex items-center text-[10px] font-black mt-2 uppercase tracking-widest">
                              <span className="text-slate-500 mr-2">Drop-out:</span> {new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                           {booking.telemetry?.totalKm ? (
                             <div className="flex flex-col">
                               <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{booking.telemetry.totalKm} KMs Traveled</span>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Start: {booking.telemetry.startKm} | End: {booking.telemetry.endKm}</span>
                             </div>
                           ) : booking.telemetry?.startKm ? (
                             <div className="flex items-center gap-3">
                               <span className="text-xs font-bold text-slate-500">{booking.telemetry.startKm} KM</span>
                               <button 
                                 onClick={() => handleUpdateTelemetry(booking._id, 'end')}
                                 className="px-3 py-1.5 bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-200 transition-colors"
                               >
                                 Log Drop-out
                               </button>
                             </div>
                           ) : (
                             <button
                               onClick={() => handleUpdateTelemetry(booking._id, 'start')}
                               className="px-3 py-1.5 bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/20 transition-colors self-start"
                             >
                               Log Drop-in
                             </button>
                           )}
                        </div>
                    </td>
                    <td className="px-8 py-6 font-black text-blue-600 dark:text-blue-400 text-lg">
                        ₹{booking.totalPrice}
                    </td>
                    <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {booking.status}
                        </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {bookings.length === 0 && (
              <div className="py-32 text-center opacity-50">
                <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No transaction record found</p>
              </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;

