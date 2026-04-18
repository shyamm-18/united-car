import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Award, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_CARS } from '../../data/cars';
import API_BASE_URL from '../../config';

const TopRatedCars = () => {
  const [topCars, setTopCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCars = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cars/top`);
        if (res.ok) {
          const data = await res.json();
          setTopCars(data);
        }
      } catch (error) {
        console.error("Top Rated Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCars();
  }, []);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold text-xs mb-6 uppercase tracking-widest"
            >
              <Award className="h-4 w-4" /> The Elite Collection
            </motion.div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 dark:text-white leading-[1.1] tracking-tighter">
              Discover Our <span className="text-blue-600">Top Rated</span> Vehicles
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Curated based on thousands of premium journeys. These are the models our clients love the most for their reliability and performance.
            </p>
          </div>
          <Link to="/" className="group flex items-center gap-3 font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-2 shrink-0">
             Explore All <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform text-blue-600" />
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {loading ? (
             [1, 2, 3].map(i => (
               <div key={i} className="h-[400px] sm:h-[550px] rounded-[4rem] bg-slate-200 dark:bg-slate-900 animate-pulse"></div>
             ))
          ) : topCars.map((car, idx) => (
             <motion.div 
               key={car._id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               viewport={{ once: true }}
               className="group relative h-[400px] sm:h-[550px] rounded-[4rem] overflow-hidden shadow-2xl bg-white"
             >
                {/* Image Layer - Full Visibility Optimized */}
                 <div className="absolute inset-x-0 top-0 h-[60%] flex items-center justify-center bg-slate-950 group">
                    <img src={car.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={car.model} />
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
                   <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                       <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> BEST OF THE BEST
                   </div>
                   <button className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-red-500 transition-colors">
                      <Heart className="h-5 w-5" />
                   </button>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-10 left-10 right-10 z-10">
                   <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                         {car.brand} <span className="w-1 h-1 bg-blue-400 rounded-full"></span> {car.type}
                      </div>
                      <h3 className="text-3xl font-black text-white">{car.model}</h3>
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Rate</span>
                            <span className="text-xl font-black text-white">₹{car.pricePerDay}</span>
                         </div>
                         <div className="w-[1px] h-8 bg-white/10"></div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Satisfaction</span>
                            <div className="flex items-center gap-2">
                               <span className="text-xl font-black text-white">{car.averageRating || car.rating}</span>
                               <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-2.5 w-2.5 ${i < Math.floor(car.averageRating || car.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`} />
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <Link 
                     to={`/cars/${car._id}`}
                     className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 group-hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                   >
                      Book This Legend <ArrowRight className="h-5 w-5" />
                   </Link>
                </div>
                
                {/* Secondary Trust Info */}
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-700"></div>
             </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-6">
           <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-green-500" /> Inspected by Experts
           </div>
           <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-green-500" /> Premium Roadside Assist
           </div>
           <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-green-500" /> Fully Sanitized Fleet
           </div>
        </div>
      </div>
    </section>
  );
};

export default TopRatedCars;

