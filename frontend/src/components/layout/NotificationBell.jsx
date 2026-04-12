import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, CheckCircle2, Clock, Trash2, X, Info, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config';

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Strict validation: Only update state if data is a valid array
        if (Array.isArray(data)) {
           setNotifications(data);
        } else {
           console.warn('API returned non-array data for notifications');
           setNotifications([]);
        }
      } else {
        // Handle 500/404 without crashing
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications - Offline Mode engaged', error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Simple polling for "real-time" feel without WebSockets
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const clearAll = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:scale-110 transition-all focus:outline-none"
      >
        {unreadCount > 0 ? (
          <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <BellRing className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
        ) : (
          <Bell className="h-6 w-6" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg border-2 border-white dark:border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 md:w-96 glass bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] border border-slate-100 dark:border-white/10 z-[2000] overflow-hidden"
          >
            <header className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
               <h4 className="font-black text-lg dark:text-white">Activity Hub</h4>
               {notifications.length > 0 && (
                 <button onClick={clearAll} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 uppercase tracking-widest">
                   <Trash2 className="h-3 w-3" /> Clear
                 </button>
               )}
            </header>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
               {notifications.length > 0 ? (
                 notifications.map((n) => (
                   <div 
                     key={n._id} 
                     onClick={() => !n.isRead && markAsRead(n._id)}
                     className={`px-6 py-5 flex gap-4 border-b border-slate-50 dark:border-white/5 cursor-pointer transition-colors ${n.isRead ? 'opacity-50' : 'bg-blue-50/30 dark:bg-blue-900/10 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'}`}
                   >
                      <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${n.type === 'success' ? 'bg-green-100 text-green-600' : n.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                         {n.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : n.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                      </div>
                      <div className="space-y-1">
                         <div className="flex justify-between items-start gap-2">
                            <h5 className="text-sm font-bold dark:text-white">{n.title}</h5>
                            {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2"></div>}
                         </div>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                         <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                            <Clock className="h-3 w-3" /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-20 text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 text-slate-300">
                       <Bell className="h-8 w-8" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">Quiet as a midnight drive.</p>
                 </div>
               )}
            </div>

            <footer className="px-6 py-4 bg-slate-50 dark:bg-white/5 text-center">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                >
                  Return to Dashboard
                </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
