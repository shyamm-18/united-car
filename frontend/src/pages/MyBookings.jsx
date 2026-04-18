import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, Car, CreditCard, ChevronRight, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscriptions/my`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (error) {
       console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchSubscriptions();
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/cancel`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (res.ok) {
          fetchBookings(); // Refresh data
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return b.status === 'confirmed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 dark:text-white">Booking Center</h1>
            <p className="text-slate-500 font-medium">Manage your active rentals and voyage history.</p>
          </div>
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-3xl border border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar scroll-smooth w-full md:w-auto">
             {['all', 'active', 'cancelled', 'subscriptions'].map((tab) => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-5 sm:px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all uppercase tracking-tighter shrink-0 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
               >
                 {tab}
               </button>
             ))}
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-44 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : (activeTab === 'subscriptions' ? subscriptions : filteredBookings).length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {(activeTab === 'subscriptions' ? subscriptions : filteredBookings).map((item, index) => (
                <motion.div 
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-6 md:p-8 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 bottom-0 w-2 ${item.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-600'}`}></div>

                  <div className="relative shrink-0">
                    <img src={item.car.image} className="w-full md:w-64 h-44 object-cover rounded-[2rem] shadow-xl" alt={item.car.model} />
                    {activeTab === 'subscriptions' && (
                       <div className="absolute -top-3 -left-3 bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest shadow-lg">
                          UNLIMITED
                       </div>
                    )}
                  </div>
                  
                  <div className="flex-grow space-y-6">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-2xl font-black dark:text-white leading-none mb-2">{item.car.brand} {item.car.model}</h3>
                          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{item.car.type}</span>
                       </div>
                       <div className="text-right flex flex-col items-end gap-3">
                          <div>
                            <div className="text-2xl font-black dark:text-white">₹{item.price?.toLocaleString()}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeTab === 'subscriptions' ? 'Monthly' : 'Total'} Fee</div>
                          </div>
                          
                          {item.status !== 'cancelled' && (
                            <button
                              onClick={async () => {
                                const res = await fetch(`${API_BASE_URL}/api/bookings/${item._id}/agreement`, {
                                  headers: { 'Authorization': `Bearer ${user.token}` }
                                });
                                if (res.ok) {
                                  const blob = await res.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `Rental_Agreement_${item._id}.pdf`;
                                  document.body.appendChild(a);
                                  a.click();
                                  window.URL.revokeObjectURL(url);
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all uppercase tracking-widest border border-white/10"
                            >
                              <CreditCard className="h-3.3 w-3.5" /> Agreement
                            </button>
                          )}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                       <div className="space-y-1">
                          <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Drop-in</div>
                          <div className="font-bold dark:text-white">{new Date(item.startDate).toLocaleDateString()}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeTab === 'subscriptions' ? 'Renews' : 'Drop-out'}</div>
                          <div className="font-bold dark:text-white">{new Date(item.endDate).toLocaleDateString()}</div>
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</div>
                          <div className={`font-black uppercase text-[10px] ${item.status === 'active' ? 'text-blue-600' : item.status === 'confirmed' ? 'text-green-500' : 'text-red-500'}`}>{item.status}</div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 glass rounded-[4rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10">
             <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Car className="h-10 w-10 text-slate-300" />
             </div>
             <h3 className="text-3xl font-black mb-2 dark:text-white">No {activeTab} rentals</h3>
             <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Your journey history will appear here once you make your first elite selection.</p>
             <Link to="/" className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black shadow-2xl shadow-blue-500/20 hover:scale-105 transition-transform inline-flex items-center gap-3">
                Discover the Fleet <ChevronRight className="h-5 w-5" />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
