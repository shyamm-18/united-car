import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Loader2, Camera } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsUpdating(true);
    const result = await updateProfile({ name, email, password });
    setIsUpdating(false);

    if (result.success) {
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-2 dark:text-white">Account Settings</h1>
          <p className="text-slate-500 font-medium tracking-wide">Manage your identity and security across the UNITED CAR network.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar / Avatar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="glass p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl flex flex-col items-center">
                <div className="relative group mb-6">
                   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600/20">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff&size=256`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <button className="absolute bottom-1 right-1 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera className="h-5 w-5" />
                   </button>
                </div>
                <h3 className="text-xl font-bold dark:text-white">{user?.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{user?.role.toUpperCase()}</p>
             </div>

             <div className="glass p-6 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                <div className="flex items-center gap-3 mb-2 font-bold uppercase text-xs tracking-widest">
                   <Shield className="h-4 w-4" /> Account Security
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-80">
                   Your profile is protected by enterprise-grade encryption and JWT authentication.
                </p>
             </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              {message && (
                <div className="mb-8 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 flex items-center gap-3 font-bold">
                  <CheckCircle className="h-5 w-5" /> {message}
                </div>
              )}

              {error && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center gap-3 font-bold">
                  <AlertCircle className="h-5 w-5" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <section className="space-y-6">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Personal Information</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold ml-2">Display Name</label>
                         <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold ml-2">Email Address</label>
                         <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                            />
                         </div>
                      </div>
                   </div>
                </section>

                <hr className="border-slate-100 dark:border-slate-800" />

                <section className="space-y-6">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Update Security</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-bold ml-2">New Password (Optional)</label>
                         <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                              type="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Leave blank to keep current"
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold ml-2">Confirm New Password</label>
                         <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                              type="password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                            />
                         </div>
                      </div>
                   </div>
                </section>

                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                >
                  {isUpdating ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
