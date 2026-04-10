import { motion } from 'framer-motion';
import { Briefcase, Plane, Star, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const servicesList = [
    {
      id: 1,
      title: "Chauffeur Services",
      description: "Experience the ultimate in luxury and convenience with our professionally trained chauffeurs. Perfect for special occasions or when you simply want to relax and enjoy the ride.",
      icon: <Star className="h-8 w-8 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Airport Transfers",
      description: "Start or end your journey seamlessly. Our premium airport transfer service ensures timely pickups, flight monitoring, and a pristine vehicle waiting for you upon arrival.",
      icon: <Plane className="h-8 w-8 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Corporate Fleet",
      description: "Impress your clients and ensure your executives travel in absolute comfort. We offer tailored corporate rental packages with flexible terms and priority support.",
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "VIP Security Detail",
      description: "For high-profile individuals requiring discretion and protection, we provide armored luxury vehicles accompanied by trained security professionals.",
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950">
      {/* Header Section */}
      <div className="bg-slate-900 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-30" alt="Services Background" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Premium Services</h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto font-light">
              Beyond standard rentals, UNITED CAR offers bespoke automotive experiences tailored to elevate every aspect of your journey.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesList.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-3xl overflow-hidden flex flex-col group card-hover bg-white/80 dark:bg-slate-900/60"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                  {service.icon}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-4 dark:text-white">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>
                <Link to="/contact" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group/link mt-auto">
                  Request Service 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
