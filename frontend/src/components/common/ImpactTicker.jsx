import { motion } from 'framer-motion';
import { Users, ShieldCheck, Trophy, Zap } from 'lucide-react';

const ImpactTicker = () => {
  const stats = [
    { icon: <Users className="h-5 w-5" />, label: "Dreams Delivered", value: "1,200+" },
    { icon: <ShieldCheck className="h-5 w-5" />, label: "Safety Rating", value: "99.8%" },
    { icon: <Trophy className="h-5 w-5" />, label: "Luxury Models", value: "15+" },
    { icon: <Zap className="h-5 w-5" />, label: "Cities Reached", value: "45+" }
  ];

  return (
    <div className="bg-blue-600 py-10 overflow-hidden relative group">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center gap-16 pr-16"
        >
          {/* Duplicate for infinite effect */}
          {[...stats, ...stats, ...stats].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 text-white">
               <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                  {stat.icon}
               </div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black">{stat.value}</span>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">{stat.label}</span>
               </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ImpactTicker;
