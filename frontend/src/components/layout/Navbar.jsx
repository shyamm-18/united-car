import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Car, LogOut, Sun, Moon, ShieldCheck, CalendarDays, Settings, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full top-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-2xl tracking-tight">
              UNITED <span className="text-blue-600 dark:text-blue-400">CAR</span>
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="font-medium hover:text-blue-600 transition-colors uppercase text-[11px] tracking-widest">{t('nav.home')}</Link>
            <a href="/#fleet" className="font-medium hover:text-blue-600 transition-colors uppercase text-[11px] tracking-widest">{t('nav.fleet')}</a>
            <Link to="/unlimited" className="font-medium hover:text-blue-600 transition-colors uppercase text-[11px] tracking-widest">{t('nav.unlimited')}</Link>
            {user && (
              <Link to="/profile" className="font-medium hover:text-blue-600 transition-colors uppercase text-[11px] tracking-widest">Profile</Link>
            )}
            {user?.email === 'arebhai09@gmail.com' && (
              <Link 
                to="/admin" 
                className="font-extrabold text-blue-600 hover:text-blue-800 transition-colors uppercase text-[11px] tracking-[0.2em] bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4" ref={profileMenuRef}>
                {/* Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=64`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-blue-200 dark:border-blue-800"
                    />
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 max-w-[100px] truncate">{user.name}</span>
                    <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
                          <p className="font-bold text-white text-sm truncate">{user.name}</p>
                          <p className="text-blue-100 text-[11px] truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/my-bookings"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <CalendarDays className="h-4 w-4 text-blue-500" /> My Reservations
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Settings className="h-4 w-4 text-slate-500" /> Account Settings
                          </Link>
                          <Link
                            to="/profile#kyc"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4 text-green-500" /> Identity Verification
                            {user.kycStatus === 'pending' && (
                              <span className="ml-auto text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Pending</span>
                            )}
                            {!user.kycStatus || user.kycStatus === 'unsubmitted' ? (
                              <span className="ml-auto text-[10px] font-black bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Required</span>
                            ) : null}
                          </Link>
                          {user.role === 'admin' && user.email === 'arebhai09@gmail.com' && (
                            <Link
                              to="/admin"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              <Car className="h-4 w-4" /> Admin Dashboard
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">{t('nav.login')}</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-md shadow-blue-500/20">
                  {t('nav.register')}
                </Link>
              </div>
            )}
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-yellow-400 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden relative"
              aria-label="Toggle Theme"
            >
               <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </motion.div>
               </AnimatePresence>
            </motion.button>
            {user && <NotificationBell />}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-yellow-400"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
            
            {user && <NotificationBell />}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 ml-1 text-slate-800 dark:text-white">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 80px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed inset-x-0 top-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 z-40 overflow-y-auto"
          >
            <div className="flex flex-col p-6 space-y-6 text-center pb-12">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="text-xl font-bold dark:text-white">{t('nav.home')}</Link>
              <a onClick={() => setIsMobileMenuOpen(false)} href="/#fleet" className="text-xl font-bold dark:text-white">{t('nav.fleet')}</a>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/unlimited" className="text-xl font-bold dark:text-white">{t('nav.unlimited')}</Link>
              {user?.email === 'arebhai09@gmail.com' && (
                <Link 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  to="/admin"
                  className="text-xl font-black text-blue-600 uppercase tracking-widest block bg-blue-50 dark:bg-blue-900/20 py-3 rounded-2xl"
                >
                  Admin System
                </Link>
              )}
              
              <hr className="border-slate-200 dark:border-white/10" />

              {user ? (
                <div className="flex flex-col space-y-2">
                  {/* Profile Card */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    {/* User Header */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-blue-100 truncate">{user.email}</p>
                      </div>
                      {user.kycStatus === 'approved' ? (
                        <span className="text-[10px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">✓ Verified</span>
                      ) : user.kycStatus === 'pending' ? (
                        <span className="text-[10px] font-black bg-yellow-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">Pending</span>
                      ) : (
                        <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">Unverified</span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <Link
                      onClick={() => setIsMobileMenuOpen(false)}
                      to="/my-bookings"
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold text-slate-800 dark:text-white">My Reservations</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>

                    <Link
                      onClick={() => setIsMobileMenuOpen(false)}
                      to="/profile#kyc"
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-slate-800 dark:text-white">Identity Verification</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>

                    <Link
                      onClick={() => setIsMobileMenuOpen(false)}
                      to="/profile"
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-slate-500" />
                        <span className="font-semibold text-slate-800 dark:text-white">Account Settings</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>

                    {user.role === 'admin' && user.email === 'arebhai09@gmail.com' && (
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        to="/admin"
                        className="flex items-center justify-between px-4 py-3.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-slate-100 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <Car className="h-5 w-5 text-blue-600" />
                          <span className="font-bold text-blue-600">Admin Dashboard</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-blue-400" />
                      </Link>
                    )}

                    <button
                      onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-500">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 pt-4">
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-lg font-bold dark:text-white">
                    {t('nav.login')}
                  </Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/register" className="py-4 rounded-2xl bg-blue-600 text-lg font-black text-white px-8 shadow-xl shadow-blue-500/20">
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
