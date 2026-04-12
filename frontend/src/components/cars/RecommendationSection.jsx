import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config';

const RecommendationSection = () => {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const headers = user ? { 'Authorization': `Bearer ${user.token}` } : {};
        const res = await fetch(`${API_BASE_URL}/api/cars/recommendations`, { headers });
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [user]);

  if (loading) return null;
  if (recommendations.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">
               <Sparkles className="h-4 w-4" /> AI Powered discovery
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Recommended for You</h2>
          </div>
          <p className="text-slate-400 max-w-md hidden md:block text-right">
             Our smart engine has analyzed your preferences to suggest the perfect luxury matches.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {recommendations.slice(0, 3).map((car, index) => (
             <motion.div 
               key={car._id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               className="group relative bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-blue-500/50 transition-all duration-500"
             >
                <div className="relative h-60 overflow-hidden">
                   <img 
                     src={car.image} 
                     alt={car.model} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                   <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                      <Sparkles className="h-3 w-3" /> {car.aiInsight || 'AI Suggestion'}
                   </div>
                </div>

                <div className="p-8">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h3 className="text-xl font-bold text-white mb-1">{car.brand} {car.model}</h3>
                         <div className="flex items-center text-yellow-500 text-sm">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            <span className="text-slate-300 font-medium">{car.averageRating || car.rating} rating</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-2xl font-black text-white">₹{car.pricePerDay}</div>
                         <div className="text-xs text-slate-500">per day</div>
                      </div>
                   </div>

                   <Link 
                     to={`/cars/${car._id}`}
                     className="w-full py-4 rounded-2xl bg-white/5 hover:bg-blue-600 text-white font-bold transition-all flex items-center justify-center gap-2 group/btn"
                   >
                     View Details <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;

