import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Play, MousePointer2 } from 'lucide-react';

interface SectionProps {
  children: React.ReactNode;
  visual: React.ReactNode;
  title?: string;
  className?: string;
  videoSrc?: string;
}

const Section: React.FC<SectionProps> = ({ children, visual, title, className = '', videoSrc }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [mode, setMode] = useState<'interactive' | 'video'>('interactive');

  return (
    <div ref={ref} className={`flex flex-col border-b border-slate-900/50 ${className}`}>
      {/* Content Section - Always Top */}
      <div className="w-full flex flex-col items-center justify-center relative z-10 bg-slate-950/30 pt-16 pb-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-4xl w-full"
        >
          {title && <h2 className="text-3xl lg:text-5xl font-bold text-amber-400 serif mb-8 text-center">{title}</h2>}
          <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed max-w-none text-left">
            {children}
          </div>
        </motion.div>
      </div>

      {/* Visual / Video Section - Always Bottom */}
      <div className="w-full bg-slate-900/20 border-y border-slate-800/30 backdrop-blur-sm overflow-hidden relative group min-h-[350px] flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950/60 to-transparent pointer-events-none"></div>
        
        {/* Toggle Switch */}
        {videoSrc && (
          <div className="w-full flex justify-center py-4 relative z-20">
             <div className="flex bg-slate-950/80 backdrop-blur rounded-full p-1 border border-slate-700 shadow-xl">
               <button
                 onClick={() => setMode('interactive')}
                 className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'interactive' ? 'bg-cyan-900 text-cyan-200' : 'text-slate-400 hover:text-white'}`}
               >
                 <MousePointer2 size={16} /> Interactive
               </button>
               <button
                 onClick={() => setMode('video')}
                 className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'video' ? 'bg-rose-900 text-rose-200' : 'text-slate-400 hover:text-white'}`}
               >
                 <Play size={16} /> Video Explanation
               </button>
             </div>
          </div>
        )}

        <div className="w-full flex-1 flex items-center justify-center p-6 md:p-8">
          <AnimatePresence mode='wait'>
            {mode === 'interactive' ? (
              <motion.div 
                key="interactive"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex items-center justify-center"
              >
                {visual}
              </motion.div>
            ) : (
              <motion.div 
                key="video"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 ring-1 ring-slate-800"
              >
                <video 
                  src={videoSrc} 
                  controls 
                  className="w-full h-full object-contain bg-black"
                >
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Section;