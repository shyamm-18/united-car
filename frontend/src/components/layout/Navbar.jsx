import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Car, LogOut, Sun, Moon } from 'lucide-react';
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
            <a href="/#fleet" className="font-medium hover:text-blue-600 transition-colors uppercase text-[11px] tracking-widest">{t('nav.fleet')}</a >
            <Link to="/unlimited" className="font-medium hover:text-blue-600 transition-colors uppercase text-[11px] tracking-widest">{t('nav.unlimited')}</Link>
            <Link to="/admin" className="font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase text-[11px] tracking-widest">
              Admin
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/my-bookings" className="font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors flex items-center">
                  <User className="h-5 w-5 mr-2" /> {user.name}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl hover:scale-105 transition-transform">
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" className="font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors flex items-center">
                  Settings
                </Link>
                <button 
                  onClick={logout} 
                  className="flex items-center text-slate-500 hover:text-red-500 transition-colors font-medium"
                >
                  <LogOut className="h-5 w-5 mr-1" /> Logout
                </button>
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

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-800 dark:text-white">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100dvh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 top-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 z-40 overflow-y-auto pb-24"
          >
            <div className="flex flex-col p-6 space-y-6 text-center">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="text-xl font-bold dark:text-white">{t('nav.home')}</Link>
              <a onClick={() => setIsMobileMenuOpen(false)} href="/#fleet" className="text-xl font-bold dark:text-white">{t('nav.fleet')}</a>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/unlimited" className="text-xl font-bold dark:text-white">{t('nav.unlimited')}</Link>
              <Link 
                onClick={() => setIsMobileMenuOpen(false)} 
                to="/admin"
                className="text-xl font-black text-blue-600 uppercase tracking-widest block"
              >
                Admin System
              </Link>
              
              <hr className="border-slate-200 dark:border-white/10" />

              {user ? (
                <div className="flex flex-col space-y-6">
                  <div className="text-sm font-bold text-slate-500 uppercase flex justify-center items-center gap-2"><User className="h-5 w-5"/> {user.name}</div>
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/my-bookings" className="text-xl font-bold dark:text-white">My Reservations</Link>
                  {user.role === 'admin' && (
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin" className="text-xl font-black text-blue-500 uppercase">Command Center</Link>
                  )}
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); logout(); }} 
                    className="text-xl font-bold text-red-500 flex justify-center items-center gap-2"
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
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
