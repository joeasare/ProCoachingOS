import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PoeticSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0.2, 0.8], [50, -50]);

  return (
    <section ref={containerRef} className="min-h-[80vh] flex items-center justify-center py-24 px-6 relative bg-black text-white border-y border-white/10">
      <motion.div 
        style={{ opacity, y }}
        className="max-w-4xl text-center space-y-12"
      >
        <p className="font-display text-4xl md:text-6xl lg:text-7xl uppercase leading-tight tracking-wide">
          Objects that carry <span className="text-white/40 italic font-serif lowercase">memory</span>.
          <br />
          We sculpt the <span className="text-white/40 italic font-serif lowercase">void</span>.
        </p>
        
        <div className="flex justify-between items-center w-full pt-12 border-t border-white/20">
             <span className="text-xs tracking-widest uppercase opacity-50">Collection 004</span>
             <span className="text-xs tracking-widest uppercase opacity-50">Paris / Tokyo</span>
        </div>
      </motion.div>
    </section>
  );
};

export default PoeticSection;