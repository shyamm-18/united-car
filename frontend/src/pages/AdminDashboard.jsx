import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  TrendingUp, Users, Car, Calendar, 
  DollarSign, ArrowUpRight, ArrowDownRight, 
  Download, FileText, PieChart as PieIcon, BarChart3, Activity, Star, 
  ShieldCheck, Globe, Zap, Cpu, AlertCircle
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { useContext, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navigation from 'lucide-react/dist/esm/icons/navigation';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.token) {
        // If we don't have a token, we stop loading after a short grace period
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
      }
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user?.token]);

  const handleDownloadPDF = () => {
    if (!analytics) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text('UNITED CAR Executive Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Platform Performance Summary (Last 30 Days)', 14, 45);
    const summaryData = [
      ['Total Revenue', `₹${analytics?.summary?.totalRevenue?.toLocaleString() || 0}`],
      ['Total Users', (analytics?.summary?.totalUsers || 0).toString()],
      ['Total Fleet', (analytics?.summary?.totalCars || 0).toString()],
      ['Total Bookings', (analytics?.summary?.totalBookings || 0).toString()]
    ];
    doc.autoTable({
      startY: 50,
      head: [['Key Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    doc.save(`UNITED CAR_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return (
    <AdminLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Cpu className="h-12 w-12 text-blue-600 animate-spin" />
        <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Initializing Strategic Intel...</div>
      </div>
    </AdminLayout>
  );

  const cards = [
    { label: 'Cumulative Revenue', value: analytics?.summary?.totalRevenue ? `₹${analytics.summary.totalRevenue.toLocaleString()}` : '₹0', icon: <DollarSign />, color: 'from-blue-600 to-indigo-600', trend: '+18.2%' },
    { label: 'Growth Velocity', value: '12.4%', icon: <TrendingUp />, color: 'from-emerald-600 to-teal-600', trend: '+2.1%' },
    { label: 'Operational Fleet', value: analytics?.summary?.totalCars ?? 0, icon: <Car />, color: 'from-purple-600 to-violet-600', trend: 'Active' },
    { label: 'Client Base', value: analytics?.summary?.totalUsers ?? 0, icon: <Users />, color: 'from-orange-600 to-amber-600', trend: '+5.4%' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!analytics?.summary && !loading) return (
    <AdminLayout>
       <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 mb-6 shadow-2xl">
             <AlertCircle className="h-10 w-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">No Insight Stream Available</h2>
          <p className="text-slate-500 max-w-sm font-medium mb-10 uppercase tracking-widest text-[10px]">
             The platform is unable to synchronize with the backend analytics engine. Check your connection or administrative permissions.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
          >
             Retry Synchronization
          </button>
       </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 text-white tracking-tighter uppercase">Operational Intelligence</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
             <Globe className="h-4 w-4 text-blue-500" /> Sector: Jhotwara Headquarters | Real-time Stream
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-slate-300 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <Download className="h-4 w-4" /> Intelligence Export
          </button>
        </div>
      </div>

      {/* Strategic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-6 rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl overflow-hidden"
          >
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity`}></div>
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-xl shadow-blue-500/10`}>
                   {card.icon}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-widest">
                   {card.trend}
                </div>
             </div>
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</div>
             <div className="text-3xl font-black text-white tracking-tighter">{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Signal Velocity */}
        <div className="p-8 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8">
              <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
           </div>
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Revenue Velocity</h3>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Financial Pulse</div>
              </div>
           </div>
            <div className="h-[250px] w-full flex items-end gap-1 px-2 relative">
               <svg className="absolute inset-0 w-full h-full px-4 pb-4" preserveAspectRatio="none">
                  <path 
                     d="M0,250 C40,200 80,230 120,150 C160,70 200,100 240,50 L240,250 L0,250 Z" 
                     fill="url(#grad)" 
                     className="opacity-10"
                  />
                  <path 
                     d="M0,250 C40,200 80,230 120,150 C160,70 200,100 240,50" 
                     fill="none" 
                     stroke="#3b82f6" 
                     strokeWidth="3" 
                     className="opacity-80"
                  />
                  <defs>
                     <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#3b82f6', stopOpacity:0}} />
                     </linearGradient>
                  </defs>
               </svg>
               <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-[0.4em] text-slate-700 uppercase pointer-events-none">
                  Streaming Network
               </div>
            </div>
        </div>

        {/* Elite Unit Performance */}
        <div className="p-8 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl">
           <div className="flex justify-between items-start mb-10">
              <div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Unit Logistics</h3>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Top Performing Assets</div>
              </div>
              <Activity className="h-4 w-4 text-emerald-500" />
           </div>
           <div className="space-y-6">
              {analytics.topCars.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black text-blue-500 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      0{i+1}
                   </div>
                   <div className="flex-grow">
                      <div className="font-bold text-white uppercase text-sm">{item.carDetails.brand} {item.carDetails.model}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.bookingCount} Operations Verified</div>
                   </div>
                   <div className="text-right">
                      <div className="font-black text-white">₹{item.totalRevenue.toLocaleString()}</div>
                      <div className="text-[9px] uppercase font-black text-blue-500 tracking-widest">Yield</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Network Mix & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
         <div className="p-8 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl flex flex-col items-center">
            <h3 className="text-sm font-black text-white mb-8 self-start uppercase tracking-widest flex items-center gap-2">
               <PieIcon className="text-purple-600 h-4 w-4" /> Asset Distribution
            </h3>
            <div className="relative w-44 h-44 rounded-full border-[10px] border-white/5 flex items-center justify-center">
               <div className="text-center">
                  <div className="text-3xl font-black text-white leading-none">{analytics.summary.totalCars}</div>
                  <div className="text-[8px] font-black text-slate-600 uppercase mt-1 tracking-widest">Global Units</div>
               </div>
               <div className="absolute inset-0 rounded-full border-[10px] border-blue-600 border-t-transparent border-l-transparent rotate-45 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-10 w-full">
               {analytics.fleetDistribution.map((item, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item._id}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-2 p-8 rounded-[3rem] bg-slate-900 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Network Growth</h3>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Node Acquisition Trends</div>
               </div>
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="h-[250px] w-full flex items-end gap-3 px-4 overflow-x-auto hide-scrollbar">
               {analytics.trends.users.slice(-7).map((day, i) => (
                 <div key={i} className="flex-1 min-w-[30px] flex flex-col items-center gap-3 group">
                    <div 
                      className="w-full bg-blue-600/30 rounded-t-xl transition-all group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
                      style={{ height: `${(day.count / Math.max(...analytics.trends.users.map(u => u.count))) * 100}%` }}
                    ></div>
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{day._id.split('-')[2]}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
