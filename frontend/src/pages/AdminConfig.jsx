import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Loader2, Camera, Cpu, Zap } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

const AdminConfig = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state if user loads after initial render
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    
    if (password && password !== confirmPassword) {
      setError('Security tokens do not match');
      return;
    }

    setIsUpdating(true);
    const result = await updateProfile({ name, email, password });
    setIsUpdating(false);

    if (result.success) {
      setMessage('Identity configuration updated');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message);
    }
  };

  return (
    <AdminLayout>
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-2 text-white tracking-tighter uppercase">Strategic Configuration</h1>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
           <Cpu className="h-4 w-4 text-blue-500" /> Authorized Personnel Only | Port 8080 Active
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Identity Token */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-10 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl flex flex-col items-center">
              <div className="relative group mb-8">
                 <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-blue-600/20 shadow-2xl relative">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user?.name}&background=1e293b&color=2563eb&size=256&bold=true`} 
                      alt="Operative" 
                      className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                 </div>
                 <button className="absolute -bottom-2 -right-2 p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-110 transition-transform flex items-center justify-center">
                    <Camera className="h-5 w-5" />
                 </button>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">{user?.name}</h3>
              <div className="mt-2 text-blue-500 text-xs font-black uppercase tracking-[0.3em] bg-blue-600/10 px-4 py-1.5 rounded-full border border-blue-600/20">
                 {user?.role === 'admin' ? 'Master Admin' : 'Operative'}
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/10 text-indigo-400">
              <div className="flex items-center gap-3 mb-4 font-black uppercase text-[10px] tracking-widest">
                 <Shield className="h-4 w-4 text-blue-500" /> Security Protocol
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-80 uppercase tracking-wider">
                 Access level: Clear. Encrypted session established. Updates globally propagated under UNITED-AES-256.
              </p>
           </div>
        </div>

        {/* Configuration Interface */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 md:p-14 rounded-[4rem] bg-slate-900 shadow-2xl border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
               <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
            </div>

            {message && (
              <div className="mb-10 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                <CheckCircle className="h-5 w-5" /> {message}
              </div>
            )}

            {error && (
              <div className="mb-10 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <section className="space-y-8">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 border-l-2 border-blue-600 pl-4">Administrative Identity</div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Callsign</label>
                       <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600/50" />
                          <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border border-white/5 outline-none focus:ring-2 focus:ring-blue-600 text-white font-bold text-sm" 
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email</label>
                       <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600/50" />
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border border-white/5 outline-none focus:ring-2 focus:ring-blue-600 text-white font-bold text-sm" 
                          />
                       </div>
                    </div>
                 </div>
              </section>

              <section className="space-y-8">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 border-l-2 border-blue-600 pl-4">Credential Override</div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Sync Key</label>
                       <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600/50" />
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Initialize Override"
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border border-white/5 outline-none focus:ring-2 focus:ring-blue-600 text-white font-bold text-sm placeholder:text-slate-800" 
                          />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Sync Key</label>
                       <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600/50" />
                          <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Verify Overide"
                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border border-white/5 outline-none focus:ring-2 focus:ring-blue-600 text-white font-bold text-sm placeholder:text-slate-800" 
                          />
                       </div>
                    </div>
                 </div>
              </section>

              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full py-6 rounded-3xl bg-blue-600 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
              >
                {isUpdating ? <Loader2 className="animate-spin h-6 w-6" /> : 'Synchronize Identity'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminConfig;
