import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  CalendarDays, Settings, ShieldCheck,
  ChevronRight, Car
} from 'lucide-react';

const AccountHub = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] overflow-hidden shadow-2xl mb-6"
        >
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-8 py-10 text-white">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffffff&color=2563eb&size=160`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-black tracking-tight truncate">{user.name}</h1>
                <p className="text-blue-100 text-sm truncate">{user.email}</p>
                <span className="mt-2 inline-block text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {menuItems.map((item) => (
            <motion.div key={item.label} variants={itemVariants}>
              <Link
                to={item.to}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <div className={`p-3 rounded-xl shrink-0 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-800 dark:text-white">{item.label}</p>
                    {item.badge && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badge.color}`}>
                        {item.badge.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default AccountHub;
