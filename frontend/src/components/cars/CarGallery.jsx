import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Maximize2, Camera, Box, ChevronLeft, ChevronRight, Info } from 'lucide-react';

const CarGallery = ({ car }) => {
  const [activeTab, setActiveTab] = useState('360'); // '360' or 'gallery'
  const [viewMode, setViewMode] = useState('Exterior'); // 'Exterior', 'Interior'
  
  // 360 State
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const containerRef = useRef(null);
  const lastX = useRef(0);

  if (!car) return <div className="aspect-[16/9] w-full rounded-[3rem] bg-slate-100 dark:bg-slate-800 animate-pulse"></div>;

  // Mock 360 images if none provided (for demo)
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

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryImages = car?.gallery?.length > 0 ? car.gallery : [
    { url: car?.image, category: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop', category: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?q=80&w=2070&auto=format&fit=crop', category: 'Detail' },
    { url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop', category: 'Exterior' },
  ];

  const filteredGallery = galleryImages.filter(img => img.category === viewMode || viewMode === 'All');

  // 360 Logic
  const handleMouseDown = (e) => {
    setIsRotating(true);
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isRotating) return;
    const deltaX = e.clientX - lastX.current;
    if (Math.abs(deltaX) > 10) {
      const step = deltaX > 0 ? -1 : 1;
      setRotationIndex((prev) => (prev + step + images360.length) % images360.length);
      lastX.current = e.clientX;
    }
  };

  const handleMouseUp = () => setIsRotating(false);

  // Touch support for 360
  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - lastX.current;
    if (Math.abs(deltaX) > 8) {
      const step = deltaX > 0 ? -1 : 1;
      setRotationIndex((prev) => (prev + step + images360.length) % images360.length);
      lastX.current = e.touches[0].clientX;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Primary Display Area */}
      <div className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl group">
        <AnimatePresence mode="wait">
          {activeTab === '360' ? (
            <motion.div
              key="360view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-ew-resize select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={(e) => { lastX.current = e.touches[0].clientX; }}
              onTouchMove={handleTouchMove}
            >
              <img 
                src={images360[rotationIndex]} 
                alt="360 view" 
                className="w-full h-full object-contain pointer-events-none" 
              />
              
              {/* Interaction Guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 animate-spin-slow" /> Drag to Rotate 360°
                </div>
              </div>

              {/* Angle Indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                 {images360.map((_, i) => (
                   <div key={i} className={`h-1 rounded-full transition-all ${i === rotationIndex ? 'w-6 bg-blue-500' : 'w-1 bg-white/40'}`}></div>
                 ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="galleryview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0"
            >
              <img 
                src={filteredGallery[galleryIndex]?.url} 
                className="w-full h-full object-cover" 
                alt="Gallery detail"
              />
              
              {/* Controls */}
              <button 
                onClick={() => setGalleryIndex(prev => (prev - 1 + filteredGallery.length) % filteredGallery.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all shadow-xl"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setGalleryIndex(prev => (prev + 1) % filteredGallery.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all shadow-xl"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Controls (Overlay Floating) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
           <div className="flex p-1.5 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10">
              <button 
                onClick={() => setActiveTab('360')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === '360' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                 <Box className="h-3.5 w-3.5" /> 360° View
              </button>
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/60 hover:text-white'}`}
              >
                 <Camera className="h-3.5 w-3.5" /> Gallery
              </button>
           </div>
           
           <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/30 transition-all">
              <Maximize2 className="h-5 w-5" />
           </button>
        </div>
      </div>

      {/* Thumbnail / Filter Area */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
           {['Exterior', 'Interior', 'Detail'].map((cat) => (
             <button
               key={cat}
               onClick={() => { setViewMode(cat); setGalleryIndex(0); setActiveTab('gallery'); }}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === cat && activeTab === 'gallery' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Secondary Info */}
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-blue-500" /> WebGL Accelerated
           </div>
           <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
           <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" /> High Definition
           </div>
        </div>
      </div>

      {/* Gallery Thumbnails (only if gallery active) */}
      <AnimatePresence>
        {activeTab === 'gallery' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar pt-2"
          >
             {filteredGallery.map((img, i) => (
               <button 
                 key={i}
                 onClick={() => setGalleryIndex(i)}
                 className={`relative h-20 w-32 shrink-0 rounded-2xl overflow-hidden transition-all ${galleryIndex === i ? 'ring-2 ring-blue-500 ring-offset-4 dark:ring-offset-slate-950 scale-105' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
               >
                 <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
               </button>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarGallery;
