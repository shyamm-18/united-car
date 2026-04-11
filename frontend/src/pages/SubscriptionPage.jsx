import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, Star, Zap, ShieldCheck, 
  MapPin, Clock, ArrowRight, Sparkles 
} from 'lucide-react';

const SubscriptionPage = () => {
  const plans = [
    {
      name: 'Essential',
      price: '15,000',
      description: 'Perfect for daily city commuting.',
      features: ['Unlimited Use (Swift/I10)', 'Zero Maintenance', 'Standard Insurance', 'Free 24/7 Roadside Assistance'],
      color: 'bg-slate-800',
      tag: 'MOST POPULAR'
    },
    {
      name: 'Executive',
      price: '45,000',
      description: 'The elite choice for business professionals.',
      features: ['Luxury Sedans (BMW/Audi)', 'Priority Booking', 'Zero-Deductible Insurance', 'Monthly Interior Detailing'],
      color: 'bg-blue-600',
      tag: 'ELITE VALUE',
      featured: true
    },
    {
      name: 'Prestige SUV',
      price: '65,000',
      description: 'Unmatched presence for your family.',
      features: ['Full-Size Luxury SUVs', 'Unlimited State Boundary Travel', 'Personal Concierge', 'Monthly Vehicle Swap'],
      color: 'bg-purple-700',
      tag: 'FAMILY FIRST'
    }
  ];

  return (
    <div className="pt-24 pb-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 mb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[150vw] sm:w-[600px] h-[150vw] sm:h-[600px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-8"
          >
            <Sparkles className="h-4 w-4" /> LUXEDRIVE UNLIMITED
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black dark:text-white mb-8 tracking-tighter">
            Freedom without <br/> <span className="text-blue-600">Ownership.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium mb-12">
            One monthly fee. Unlimited luxury. Zero maintenance. The ultimate passive car experience is here.
          </p>
          
          <div className="flex flex-wrap justify-center gap-12 text-slate-400 font-black uppercase tracking-widest text-xs">
             <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-green-500" /> Fully Insured</div>
             <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-blue-500" /> 24/7 Support</div>
             <div className="flex items-center gap-3"><Zap className="h-5 w-5 text-yellow-500" /> Zero Depreciation</div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-[3.5rem] bg-white dark:bg-slate-900 border ${plan.featured ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-100 dark:border-white/5'} shadow-2xl flex flex-col`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black tracking-widest shadow-lg">
                {plan.tag}
              </div>
            )}
            
            <header className="mb-10">
              <h3 className="text-3xl font-black dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{plan.description}</p>
            </header>

            <div className="mb-10 flex items-baseline gap-2">
               <span className="text-4xl md:text-5xl font-black dark:text-white">₹{plan.price}</span>
               <span className="text-slate-400 font-bold text-sm tracking-widest">/ MONTH</span>
            </div>

            <div className="space-y-4 mb-12 flex-grow">
               {plan.features.map((feature, idx) => (
                 <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold dark:text-slate-300">{feature}</span>
                 </div>
               ))}
            </div>

            <Link 
              to="/cars" 
              className={`w-full py-5 rounded-[2rem] text-center font-black text-sm uppercase tracking-widest transition-all ${plan.featured ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-slate-100 dark:bg-white/5 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10'}`}
            >
              Explore Fleet
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Comparison Text */}
      <section className="max-w-4xl mx-auto px-4 text-center">
         <h2 className="text-3xl font-black dark:text-white mb-6">Why Subscribe?</h2>
         <p className="text-slate-500 leading-relaxed font-medium">
            Ownership means depreciation, insurance premiums, and unpredictable service costs. 
            UNITED CAR Unlimited gives you a modern fleet at your fingertips for a single, predictable monthly payment. 
            Swap cars, pause anytime, and drive the future.
         </p>
      </section>
    </div>
  );
};

export default SubscriptionPage;
