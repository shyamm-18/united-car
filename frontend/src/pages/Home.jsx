import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Cars from './Cars';
import Services from './Services';
import Contact from './Contact';
import RecommendationSection from '../components/cars/RecommendationSection';
import ImpactTicker from '../components/common/ImpactTicker';
import AICarFinder from '../components/cars/AICarFinder';

import TopRatedCars from '../components/cars/TopRatedCars';

const Home = () => {
  const { t } = useTranslation();
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" 
            alt="Luxury Car Showcase" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center h-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tighter"
            >  {t('hero.title')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                {t('hero.luxury')}
              </span>
            </motion.h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('fleet')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
              >
                {t('hero.cta')}
              </button>
            </div>
          </motion.div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer flex flex-col items-center text-white" onClick={() => scrollToSection('fleet')}>
            <span className="text-sm tracking-widest uppercase mb-2 text-white/70">Scroll</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>
      </section>

      <motion.div initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.1}} transition={{duration: 0.6}}>
        <ImpactTicker />
      </motion.div>

      <motion.section initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.1}} transition={{duration: 0.6}} id="ai-finder">
        <AICarFinder />
      </motion.section>

      <motion.div initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.1}} transition={{duration: 0.6}}>
        <TopRatedCars />
      </motion.div>

      {/* Embedded Single Page Sections */}
      <motion.section initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.1}} transition={{duration: 0.6}} id="fleet">
        <Cars inSinglePage={true} />
      </motion.section>

      <motion.section initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.1}} transition={{duration: 0.6}} id="recommendations">
        <RecommendationSection />
      </motion.section>

      <motion.section initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.1}} transition={{duration: 0.6}} id="services">
        <Services />
      </motion.section>

      <motion.section initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true, amount: 0.1}} transition={{duration: 0.6}} id="contact">
        <Contact />
      </motion.section>

    </div>
  );
};

export default Home;
