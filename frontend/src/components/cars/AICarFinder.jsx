import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, IndianRupee, Users, Compass, Search, ArrowRight, CheckCircle2, Loader2, MapPin, Gauge } from 'lucide-react';
import { MOCK_CARS } from '../../data/cars';
import { Link } from 'react-router-dom';

const AICarFinder = () => {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(5000);
  const [usage, setUsage] = useState('');
  const [location, setLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const usages = [
    { id: 'family', label: 'Family Trip', icon: <Users />, desc: 'Comfortable 7-seaters with extra space.' },
    { id: 'offroad', label: 'Off-Road / Hill', icon: <Compass />, desc: 'Power and 4x4 capability for rough terrain.' },
    { id: 'business', label: 'Business / Luxury', icon: <Sparkles />, desc: 'Premium sedans for a classy impression.' },
    { id: 'economy', label: 'Fuel Efficient', icon: <Gauge />, desc: 'Best mileage for daily running.' }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Convert INR to USD (roughly 1:80) for internal matching
    const budgetUSD = budget / 80;

    setTimeout(() => {
      let filtered = [...MOCK_CARS];

      // Budget filter
      filtered = filtered.filter(car => car.pricePerDay <= budgetUSD + 10);

      // Usage mapping
      if (usage === 'family') {
        filtered = filtered.sort((a, b) => (b.seats >= 7) ? 1 : -1);
      } else if (usage === 'offroad') {
        filtered = filtered.filter(car => car.type === 'SUV');
      } else if (usage === 'business') {
        filtered = filtered.filter(car => car.type === 'Luxury' || car.type === 'Luxury SUV');
      } else if (usage === 'economy') {
        filtered = filtered.filter(car => car.fuel === 'Petrol' || car.fuel === 'Hybrid' || car.fuel === 'Electric');
      }

      // Add AI Insights
      const results = filtered.slice(0, 3).map(car => {
        let reason = "Perfect match for your budget.";
        if (usage === 'family' && car.seats >= 7) reason = "Ideal for families with its 7-seat configuration.";
        if (usage === 'offroad' && car.model === 'Thar') reason = "Iconic 4x4 for ultimate hill terrain power.";
        if (usage === 'economy' && car.fuel === 'Hybrid') reason = "Hybrid tech for maximum fuel savings.";
        if (usage === 'business' && car.brand === 'BMW') reason = "Unmatched executive presence and comfort.";
        
        return { ...car, aiReason: reason };
      });

      setRecommendations(results);
      setIsAnalyzing(false);
      setStep(4);
    }, 2000);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6"
          >
            <Sparkles className="h-4 w-4" /> AI CAR FINDER
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 dark:text-white">What are you looking for?</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Let our AI concierge find the perfect match for your next journey.</p>
        </header>

        <div className="glass p-8 md:p-12 rounded-[3.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 relative shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Budget */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold dark:text-white">Define your daily budget</h3>
                  <p className="text-slate-500">How much are you planning to spend per day?</p>
                </div>
                <div className="space-y-6">
                   <div className="text-5xl font-black text-blue-600 text-center flex items-center justify-center gap-2">
                      <IndianRupee className="h-10 w-10" /> {budget.toLocaleString()}
                   </div>
                   <input 
                     type="range" 
                     min="1000" 
                     max="25000" 
                     step="500" 
                     value={budget}
                     onChange={(e) => setBudget(parseInt(e.target.value))}
                     className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                   />
                   <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Low Budget</span>
                      <span>Premium / Luxury</span>
                   </div>
                </div>
                <button onClick={nextStep} className="w-full py-5 rounded-3xl bg-blue-600 text-white font-bold text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                  Next Step <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Usage */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold dark:text-white">Select primary usage</h3>
                  <p className="text-slate-500">What is the main purpose of your rental?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {usages.map((u) => (
                     <button 
                       key={u.id}
                       onClick={() => setUsage(u.id)}
                       className={`p-6 rounded-[2rem] border-2 text-left transition-all flex gap-4 items-start ${usage === u.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-400'}`}
                     >
                        <div className={`p-3 rounded-2xl ${usage === u.id ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                           {u.icon}
                        </div>
                        <div>
                           <div className="font-bold text-lg">{u.label}</div>
                           <div className={`text-sm opacity-70 ${usage === u.id ? 'text-white' : 'text-slate-500'}`}>{u.desc}</div>
                        </div>
                     </button>
                   ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 py-5 rounded-3xl bg-slate-200 dark:bg-white/5 font-bold dark:text-white">Back</button>
                  <button onClick={nextStep} disabled={!usage} className="flex-[2] py-5 rounded-3xl bg-blue-600 text-white font-bold text-xl hover:bg-blue-700 disabled:opacity-50 transition-all">Continue</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold dark:text-white">Where are you heading?</h3>
                  <p className="text-slate-500">Enter your pickup location or city.</p>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
                  <input 
                    type="text" 
                    placeholder="E.g. Delhi, Mumbai, Bangalore..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 rounded-3xl bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 outline-none focus:border-blue-500 font-bold text-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 py-5 rounded-3xl bg-slate-200 dark:bg-white/5 font-bold dark:text-white">Back</button>
                  <button 
                    onClick={handleAnalyze} 
                    disabled={!location || isAnalyzing}
                    className="flex-[2] py-5 rounded-3xl bg-blue-600 text-white font-black text-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {isAnalyzing ? <><Loader2 className="animate-spin" /> AI is Thinking...</> : <><Search className="h-6 w-6" /> Find My Car</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                   <div className="flex items-center justify-center gap-2 text-green-500 font-black uppercase tracking-widest text-xs mb-2">
                      <CheckCircle2 className="h-4 w-4" /> AI Analysis Complete
                   </div>
                   <h3 className="text-3xl font-black dark:text-white text-blue-600">Top Picks For You</h3>
                   <p className="text-slate-500">Verified recommendations from our 15-car elite fleet.</p>
                </div>

                <div className="space-y-4">
                   {recommendations.map((car, idx) => (
                      <motion.div 
                        key={car._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col md:flex-row gap-6 hover:border-blue-500/50 transition-all"
                      >
                         <div className="w-full md:w-48 h-32 rounded-[2rem] overflow-hidden shrink-0">
                            <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-grow space-y-2 py-2">
                            <div className="flex justify-between items-start">
                               <div>
                                  <h4 className="text-xl font-bold dark:text-white">{car.brand} {car.model}</h4>
                                  <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">{car.type}</div>
                               </div>
                               <div className="text-right">
                                  <div className="text-xl font-black dark:text-white">₹{(car.pricePerDay * 80).toLocaleString()}</div>
                                  <div className="text-[10px] uppercase text-slate-400 font-bold">per day</div>
                               </div>
                            </div>
                            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-900/50 flex items-start gap-2">
                               <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
                               {car.aiReason}
                            </div>
                         </div>
                         <div className="flex items-center">
                            <Link to={`/cars/${car._id}`} className="p-4 rounded-3xl bg-slate-900 dark:bg-blue-600 text-white font-bold hover:scale-105 transition-transform">
                               <ArrowRight className="h-6 w-6" />
                            </Link>
                         </div>
                      </motion.div>
                   ))}
                </div>

                <button onClick={() => setStep(1)} className="w-full py-4 rounded-3xl border-2 border-slate-200 dark:border-white/10 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                   Start New Search
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AICarFinder;
