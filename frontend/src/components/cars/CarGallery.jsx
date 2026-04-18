import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Maximize2, Camera, Box, ChevronLeft, ChevronRight, Info, Zap } from 'lucide-react';
import API_BASE_URL from '../../config';

const CarGallery = ({ car }) => {
  const [activeTab, setActiveTab] = useState('gallery'); 
  const [viewMode, setViewMode] = useState('Exterior'); 
  
  // 360 State
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef(null);
  const lastX = useRef(0);

  // 360 Images
  const images360 = car?.images360?.length > 0 ? car.images360 : [
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop&hue=30',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop&hue=60',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop&hue=90',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop&hue=120',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop&hue=150',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop&hue=180',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop&hue=210',
  ];

  // Preload Images for smooth rotation
  useEffect(() => {
    images360.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images360]);

  // Auto-rotate logic
  useEffect(() => {
    let interval;
    if (activeTab === '360' && autoRotate && !isRotating) {
      interval = setInterval(() => {
        setRotationIndex((prev) => (prev + 1) % images360.length);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [activeTab, autoRotate, isRotating, images360.length]);

  // Handle Drag/Swipe Rotation
  const handleStart = (clientX) => {
    setIsRotating(true);
    setAutoRotate(false);
    lastX.current = clientX;
  };

  const handleMove = (clientX) => {
    if (!isRotating) return;
    const deltaX = clientX - lastX.current;
    const threshold = 12; // Lower for more sensitivity
    
    if (Math.abs(deltaX) > threshold) {
      const framesToMove = Math.floor(Math.abs(deltaX) / threshold);
      const direction = deltaX > 0 ? -1 : 1;
      setRotationIndex(prev => (prev + (direction * framesToMove) + images360.length) % images360.length);
      lastX.current = clientX - (deltaX % threshold);
    }
  };

  const handleEnd = () => setIsRotating(false);

  if (!car) return <div className="aspect-[16/9] w-full rounded-[3rem] bg-slate-100 dark:bg-slate-800 animate-pulse"></div>;

  const galleryImages = car?.gallery?.length > 0 ? car.gallery : [{ url: car?.image, category: 'Exterior' }];
  const filteredGallery = galleryImages.filter(img => img.category === viewMode || viewMode === 'All');
  const [galleryIndex, setGalleryIndex] = useState(0);

  return (
    <div className="w-full space-y-6">
      <div 
        ref={containerRef}
        className="relative aspect-[16/9] w-full rounded-[4rem] overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-2xl group border border-slate-200/50 dark:border-white/5"
      >
        <AnimatePresence mode="wait">
          {activeTab === '360' ? (
            <motion.div
              key="360view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-ew-resize select-none touch-none"
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseMove={(e) => handleMove(e.clientX)}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
            >
              <img 
                src={images360[rotationIndex]?.startsWith('http') ? images360[rotationIndex] : `${API_BASE_URL}${images360[rotationIndex]}`} 
                alt="360 view" 
                className="w-full h-full object-contain pointer-events-none transition-transform duration-300" 
              />
              
              {/* Premium 360 Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                 <div className={`p-8 rounded-full border-2 border-dashed border-white/20 transition-all duration-700 ${isRotating ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                       <RotateCcw className="h-8 w-8 text-white animate-spin-slow" />
                    </div>
                 </div>
              </div>

              {/* Angle Progress (Flipkart Style) */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/20 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 group-hover:scale-105 transition-transform">
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">360° View</span>
                 <div className="flex gap-1">
                    {images360.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === rotationIndex ? 'w-4 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'w-1 bg-white/20'}`}></div>
                    ))}
                 </div>
                 <span className="text-[10px] font-black text-blue-500">{rotationIndex + 1}/{images360.length}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="galleryview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="absolute inset-0"
            >
              <img src={filteredGallery[galleryIndex]?.url?.startsWith('http') ? filteredGallery[galleryIndex].url : `${API_BASE_URL}${filteredGallery[galleryIndex]?.url}`} className="w-full h-full object-cover" alt="Gallery" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              
              <button onClick={() => setGalleryIndex(prev => (prev - 1 + filteredGallery.length) % filteredGallery.length)} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all shadow-2xl"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={() => setGalleryIndex(prev => (prev + 1) % filteredGallery.length)} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all shadow-2xl"><ChevronRight className="h-6 w-6" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Controls Overlay */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 transition-all">
           <div className="flex p-1 bg-black/40 sm:bg-black/60 backdrop-blur-2xl rounded-2xl sm:rounded-[1.5rem] border border-white/10 shadow-2xl scale-90 sm:scale-100 origin-top">
              <button 
                onClick={() => setActiveTab('360')} 
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === '360' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
              >
                <Box className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> 360
              </button>
              <button 
                onClick={() => setActiveTab('gallery')} 
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
              >
                <Camera className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Gallery
              </button>
           </div>
           <div className="flex gap-2 sm:gap-3 items-center">
              <div className="hidden sm:flex bg-blue-600/90 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg items-center gap-2 backdrop-blur-md border border-white/20"><Zap className="h-3 w-3 fill-white" /> 4K Resolution</div>
              <button className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl"><Maximize2 className="h-4 sm:h-5 w-4 sm:w-5" /></button>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
           {['Exterior', 'Interior', 'Detail'].map((cat) => (
             <button
               key={cat}
               onClick={() => { setViewMode(cat); setGalleryIndex(0); setActiveTab('gallery'); }}
               className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === cat && activeTab === 'gallery' ? 'bg-blue-600 text-white shadow-lg tracking-normal' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        <div className="flex items-center gap-6 px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
           <div className="flex items-center gap-2 group cursor-help">
              <Box className="h-4 w-4 text-blue-500 group-hover:rotate-45 transition-transform" /> 
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Intertia Mapping</span>
           </div>
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_#3b82f6]"></div>
           <div className="flex items-center gap-2 group cursor-help">
              <Info className="h-4 w-4 text-blue-500" /> 
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Interactive HD</span>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
             {filteredGallery.map((img, i) => (
               <button key={i} onClick={() => setGalleryIndex(i)} className={`relative h-24 w-40 shrink-0 rounded-3xl overflow-hidden transition-all duration-500 ${galleryIndex === i ? 'ring-4 ring-blue-500 ring-offset-4 dark:ring-offset-slate-950 scale-105 z-10' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}><img src={img.url?.startsWith('http') ? img.url : `${API_BASE_URL}${img.url}`} className="w-full h-full object-cover" alt="Thumb" /></button>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarGallery;

