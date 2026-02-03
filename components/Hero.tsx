import React from 'react';
import { motion } from 'framer-motion';
import Scene from './Scene';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
      <Scene />
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-12 w-[1px] h-full bg-white/5 hidden md:block" />
        <div className="absolute top-0 right-12 w-[1px] h-full bg-white/5 hidden md:block" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center mix-blend-difference">
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-display text-[15vw] leading-[0.8] tracking-tighter uppercase font-bold select-none"
        >
          Ephemeral
        </motion.h1>
        
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="font-display text-[15vw] leading-[0.8] tracking-tighter uppercase font-bold text-transparent select-none outline-text"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}
        >
          Structure
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-[-20vh] md:bottom-[-15vh] flex flex-col items-center gap-4"
        >
          <div className="h-24 w-[1px] bg-white/50" />
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to enter</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;