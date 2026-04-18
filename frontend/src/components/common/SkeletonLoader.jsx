import { motion } from 'framer-motion';

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner Skeleton */}
        <div className="h-64 sm:h-96 w-full bg-slate-200 dark:bg-slate-900 rounded-[3rem] overflow-hidden relative">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full"
          />
        </div>

        {/* Title & Filters Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-900 rounded-xl" />
          <div className="flex gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-slate-900 rounded-full" />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-96 w-full bg-slate-200 dark:bg-slate-900 rounded-[2.5rem] p-6 space-y-4">
               <div className="h-48 w-full bg-slate-300 dark:bg-slate-800 rounded-3xl" />
               <div className="h-6 w-2/3 bg-slate-300 dark:bg-slate-800 rounded-lg" />
               <div className="h-4 w-1/3 bg-slate-300 dark:bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
