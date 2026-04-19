import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Plus, Search, Filter, 
  Trash2, Calendar, Percent, IndianRupee, 
  CheckCircle2, XCircle, Loader2, ArrowLeft,
  Settings, X, Save
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';

const AdminCoupons = () => {
  const { token } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minBookingValue: 0,
    expiryDate: '',
    usageLimit: 100
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await fetchCoupons();
        setIsModalOpen(false);
        setFormData({
          code: '',
          discountType: 'percentage',
          discountValue: '',
          minBookingValue: 0,
          expiryDate: '',
          usageLimit: 100
        });
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create coupon');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) fetchCoupons();
    } catch (err) { console.error('Toggle failed'); }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 lg:p-12 font-inter">
      {/* 1. Dashboard Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <Link to="/admin" className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors mb-4">
             <ArrowLeft className="h-4 w-4" /> Back to Nexus
          </Link>
          <div className="flex items-center gap-4">
             <div className="p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/20">
                <Ticket className="h-8 w-8" />
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Promo Protocol</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">United Reserve Discount Hub</p>
             </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-slate-950 px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Initialize New Code
        </button>
      </div>

      {/* 2. Coupon Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
           <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {coupons.length > 0 ? coupons.map((coupon) => (
            <motion.div 
              key={coupon._id} 
              variants={itemVariants}
              className="group relative bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
            >
              {/* Pulse effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Protocol Code</p>
                    <h3 className="text-2xl font-black tracking-tighter text-blue-500 group-hover:text-white transition-colors uppercase">{coupon.code}</h3>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${coupon.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {coupon.isActive ? 'Active' : 'Offline'}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Impact</p>
                    <p className="text-lg font-black">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'}</p>
                 </div>
                 <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Uses</p>
                    <p className="text-lg font-black">{coupon.usedBy?.length || 0}<span className="text-xs text-slate-500 font-medium">/{coupon.usageLimit}</span></p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                 <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[10px] font-bold">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                 </div>
                 <button 
                  onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                 >
                    <Settings className="h-4 w-4" />
                 </button>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-24 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mx-auto">
                  <Ticket className="h-8 w-8" />
               </div>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs font-black">No active protocols detected.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* 3. Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="mb-8 space-y-1">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">New Protocol</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest underline decoration-blue-500 decoration-2 underline-offset-4">Secure Discount Generation</p>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-6 relative z-10">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Unique Code</label>
                       <input 
                         required
                         type="text" 
                         value={formData.code}
                         onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                         placeholder="E.G. UNITED50" 
                         className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black focus:border-blue-500 outline-none transition-all uppercase"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                       <select 
                         value={formData.discountType}
                         onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                         className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black focus:border-blue-500 outline-none transition-all appearance-none"
                       >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Mount (₹)</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Value</label>
                       <div className="relative">
                          <input 
                            required
                            type="number" 
                            value={formData.discountValue}
                            onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                            placeholder="0"
                            className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black focus:border-blue-500 outline-none transition-all"
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">{formData.discountType === 'percentage' ? '%' : '₹'}</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Usage Limit</label>
                       <input 
                         required
                         type="number" 
                         value={formData.usageLimit}
                         onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                         className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black focus:border-blue-500 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Min Booking Value</label>
                       <input 
                         required
                         type="number" 
                         value={formData.minBookingValue}
                         onChange={(e) => setFormData({...formData, minBookingValue: e.target.value})}
                         className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black focus:border-blue-500 outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                       <input 
                         required
                         type="date" 
                         value={formData.expiryDate}
                         onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                         className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black focus:border-blue-500 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={isProcessing}
                   className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-6 rounded-[2.5rem] mt-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                 >
                   {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : (
                     <><Save className="h-4 w-4" /> Save Protocol</>
                   )}
                 </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;
