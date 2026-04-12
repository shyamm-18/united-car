import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Filter, Search, ChevronDown, User, Settings } from 'lucide-react';
import { MOCK_CARS } from '../data/cars';
import API_BASE_URL from '../config';

const Cars = ({ inSinglePage }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('All');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cars`);
        if (res.ok) {
          const data = await res.json();
          setCars(data.length > 0 ? data : MOCK_CARS); 
        } else {
          setCars(MOCK_CARS);
        }
      } catch (error) {
        setCars(MOCK_CARS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars(); // Load immediately for premium single page feel
  }, []);

  const types = ['All', 'SUV', 'Sports', 'Electric', 'Sedan'];

  const filteredCars = activeType === 'All' 
    ? cars 
    : cars.filter(c => c.type === activeType);

  return (
    <div className={`min-h-screen pb-24 ${inSinglePage ? '' : 'bg-slate-50 dark:bg-slate-950'}`}>
      {/* Header Section */}
      {!inSinglePage && (
        <div className="bg-slate-900 pt-20 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Fleet Background" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Premium Fleet</h1>
              <p className="text-slate-300 text-lg max-w-2xl">Find the perfect vehicle for your next adventure. Unleash the potential of your journey with our handpicked selection of premium cars.</p>
            </motion.div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 ${inSinglePage ? 'pt-24' : '-mt-8'}`}>
        {inSinglePage && (
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 dark:text-white">Our Premium Fleet</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Discover handpicked vehicles for exceptional comfort and performance.</p>
          </div>
        )}
        <div className="glass rounded-xl p-4 md:p-6 mb-12 flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border-none shadow-xl">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by brand or model..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-900 dark:text-white"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${activeType === type ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3,4,5,6].map(i => (
               <div key={i} className="glass rounded-2xl p-4">
                 <div className="h-56 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl mb-4"></div>
                 <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-2"></div>
                 <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-6"></div>
                 <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
               </div>
             ))
          ) : filteredCars.length > 0 ? (
            filteredCars.map((car, index) => (
              <motion.div 
                key={car._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 card-hover flex flex-col"
              >
                <div className="relative h-60 overflow-hidden group">
                  <img src={car.image} onError={(e) => {e.target.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop'}} alt={car.brand} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {car.type}
                    </span>
                    {(car.averageRating >= 4.7 || car.rating >= 4.7) && (
                      <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> Highly Rated
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 group">
                    <div className="bg-slate-900/40 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center justify-center gap-1.5 text-white font-bold text-sm">
                       <Star className="h-4 w-4 text-yellow-400 fill-current" /> {car.averageRating || car.rating || "New"}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white leading-tight">{car.brand}</h3>
                      <p className="text-slate-500">{car.model}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">₹{car.pricePerDay}</span>
                      <span className="text-xs text-slate-400">/day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <User className="h-4 w-4 mr-2" /> {car.seats} Seats
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Settings className="h-4 w-4 mr-2" /> {car.transmission}
                    </div>
                  </div>
                  
                  <Link to={`/cars/${car._id}`} className="w-full block text-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white py-3 rounded-xl font-medium transition-colors">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-12 text-center text-slate-500">
               <p className="text-xl">No cars found matching your criteria.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;

