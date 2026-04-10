import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, Coffee, Plane, Check } from 'lucide-react';

const ADDONS = [
  {
    id: 'chauffeur',
    name: 'Private Chauffeur',
    icon: <UserCheck className="h-6 w-6" />,
    price: 50,
    type: 'per_day',
    desc: 'Professional, uniformed driver for elite comfort.'
  },
  {
    id: 'insurance',
    name: 'Full Shield Protection',
    icon: <ShieldCheck className="h-6 w-6" />,
    price: 30,
    type: 'per_day',
    desc: 'Zero-deductible comprehensive security.'
  },
  {
    id: 'concierge',
    name: 'VIP Meet & Greet',
    icon: <Plane className="h-6 w-6" />,
    price: 45,
    type: 'one_time',
    desc: 'Personal escort from airport arrivals to car.'
  },
  {
    id: 'refreshments',
    name: 'Luxe Refreshments',
    icon: <Coffee className="h-6 w-6" />,
    price: 25,
    type: 'one_time',
    desc: 'Premium beverage and snack hamper in-car.'
  }
];

const AddonSelector = ({ selectedAddons, onToggle }) => {
  return (
    <div className="space-y-6">
      <header>
        <h3 className="text-2xl font-black dark:text-white mb-2">Enhance Your Experience</h3>
        <p className="text-slate-500 font-medium">Add premium concierge services to your reservation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADDONS.map((addon) => {
          const isSelected = selectedAddons.find(a => a.id === addon.id);
          
          return (
            <motion.button
              key={addon.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(addon)}
              className={`relative p-6 rounded-[2rem] border-2 text-left transition-all ${
                isSelected 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}>
                  {addon.icon}
                </div>
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="bg-white text-blue-600 rounded-full p-1"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-lg">{addon.name}</h4>
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                  {addon.desc}
                </p>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-2xl font-black">₹{addon.price}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                  {addon.type === 'per_day' ? '/ day' : 'one-time'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AddonSelector;
export { ADDONS };

