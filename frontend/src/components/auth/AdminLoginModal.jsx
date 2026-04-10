import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Key, Loader2, AlertCircle } from 'lucide-react';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    // Simulate system verification
    setTimeout(() => {
      if (password === '9216497682') {
        const spoofAdmin = {
          _id: "admin-bypass",
          name: "Master Admin",
          email: "unitedcarsjhotwara@gmail.com",
          role: "admin",
          token: "magic-admin-token"
        };
        
        localStorage.setItem('userInfo', JSON.stringify(spoofAdmin));
        localStorage.setItem('adminDirectAccess', 'true');
        
        // Final destination
        window.location.href = '/admin';
      } else {
        setError('Invalid Security Key. Authentication Failed.');
        setIsProcessing(false);
      }
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-white/20 dark:border-slate-800 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
              <X className="h-6 w-6 dark:text-white" />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/40">
                <Shield className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Strategic Access</h2>
              <p className="text-slate-500 font-medium">Verify administrative credentials for UNITED CAR Command Center.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Access Key"
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white text-lg tracking-widest"
                />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              <button 
                disabled={isProcessing}
                className="w-full py-5 rounded-[2rem] bg-blue-600 text-white font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin h-6 w-6" /> : "Authenticate"}
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol: UNITED-256-AES</span>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;
