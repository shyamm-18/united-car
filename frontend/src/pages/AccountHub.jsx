import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Settings, ShieldCheck,
  ChevronRight, Car, Wallet, Plus, ArrowUpRight, ArrowDownLeft, X, Loader2
} from 'lucide-react';
import API_BASE_URL from '../config';

const AccountHub = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWallet({ balance: data.walletBalance, transactions: data.walletTransactions });
      }
    } catch (err) {
      console.error('Wallet fetch failed', err);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || isNaN(topUpAmount)) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/wallet/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ amount: topUpAmount })
      });
      if (res.ok) {
        await fetchWallet();
        setIsTopUpOpen(false);
        setTopUpAmount('');
      }
    } catch (err) {
      console.error('Top up failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const kycBadge = () => {
    if (user.kycStatus === 'verified') return { label: 'Verified', color: 'bg-green-100 text-green-600' };
    if (user.kycStatus === 'pending')  return { label: 'Pending review', color: 'bg-yellow-100 text-yellow-600' };
    if (user.kycStatus === 'rejected') return { label: 'Rejected', color: 'bg-red-100 text-red-600' };
    return { label: 'Action Required', color: 'bg-red-100 text-red-500' };
  };

  const badge = kycBadge();

  const menuItems = [
    {
      icon: <CalendarDays className="h-6 w-6 text-blue-500" />,
      label: 'My Reservations',
      description: 'View and manage all your bookings',
      to: '/my-bookings',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      icon: <Settings className="h-6 w-6 text-slate-500" />,
      label: 'Account Settings',
      description: 'Update your name, email and password',
      to: '/profile/settings',
      iconBg: 'bg-slate-100 dark:bg-slate-700',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
      label: 'Identity Verification',
      description: 'Submit your Aadhar Card and Driving License',
      to: '/profile/kyc',
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      badge: user.kycStatus !== 'verified' ? badge : null,
    },
    ...(user.role === 'admin' && user.email === 'arebhai09@gmail.com' ? [{
      icon: <Car className="h-6 w-6 text-blue-600" />,
      label: 'Admin Dashboard',
      description: 'Manage fleet, users, bookings and system',
      to: '/admin',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    }] : []),
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">

        {/* 1. Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-colors"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden shrink-0 shadow-lg">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffffff&color=0f172a&size=160`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight truncate">{user.name}</h1>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">User</span>
                 {user.kycStatus === 'verified' && <span className="text-[10px] font-black uppercase tracking-widest bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/20">Verified</span>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. United Wallet Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-200 dark:border-white/5 relative overflow-hidden"
        >
           <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">United Wallet Balance</p>
                 <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{wallet.balance.toLocaleString()}</h2>
              </div>
              <button 
                onClick={() => setIsTopUpOpen(true)}
                className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 hover:scale-110 transition-transform"
              >
                <Plus className="h-6 w-6" />
              </button>
           </div>

           <div className="mt-8 space-y-4 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Transactions</p>
              <div className="space-y-3">
                 {wallet.transactions.length > 0 ? wallet.transactions.slice(-3).reverse().map((tx, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{tx.description}</p>
                            <p className="text-[10px] text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <p className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-400'}`}>
                         {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </p>
                   </div>
                 )) : (
                   <p className="text-xs text-slate-500 italic">No transactions yet.</p>
                 )}
              </div>
           </div>
        </motion.div>

        {/* 3. Navigation Menu Grid */}
        <div className="grid grid-cols-1 gap-3">
          {menuItems.map((item, index) => (
            <motion.div 
              key={item.label} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.05) }}
            >
              <Link
                to={item.to}
                className="flex items-center gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-white/5 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`p-4 rounded-2xl shrink-0 ${item.iconBg} transition-transform group-hover:scale-90`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-800 dark:text-white uppercase tracking-tight">{item.label}</p>
                    {item.badge && (
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.badge.color} border border-current/20 shadow-sm`}>
                        {item.badge.label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1 shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Top Up Modal */}
        <AnimatePresence>
          {isTopUpOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 w-full max-w-sm shadow-2xl relative border border-white/5"
              >
                <button 
                  onClick={() => setIsTopUpOpen(false)}
                  className="absolute top-8 right-8 text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="text-center space-y-4 mb-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                    <Wallet className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Top Up Wallet</h3>
                  <p className="text-sm text-slate-500">Securely add funds to your United Wallet for seamless bookings.</p>
                </div>

                <div className="space-y-6">
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</span>
                      <input 
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-6 pl-12 pr-6 text-2xl font-black text-slate-900 dark:text-white focus:ring-4 ring-blue-500/10 outline-none transition-all"
                      />
                   </div>

                   <button 
                     onClick={handleTopUp}
                     disabled={isProcessing || !topUpAmount}
                     className="w-full py-5 bg-blue-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Top-Up'}
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AccountHub;
