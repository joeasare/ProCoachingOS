
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, Circle, MoveRight, X, ChevronRight, Menu, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Landing3D from './Landing3D';
import { useTheme } from '../context/ThemeContext';

const METHODOLOGY_DATA = [
    {
        id: 0,
        key: 'SESSION',
        title: "Session",
        subtitle: "001 // Tactical Design",
        img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2670&auto=format&fit=crop",
        description: "Architecting the training week. Micro-cycles defined by load management and tactical periodization. We build the engine before we drive the car.",
        tags: ["Periodization", "Load Mgmt", "Micro-cycles"],
        route: '/planning'
    },
    {
        id: 1,
        key: 'ANALYSIS',
        title: "Analysis",
        subtitle: "002 // Performance Metrics",
        img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2670&auto=format&fit=crop",
        description: "Quantifying the invisible. xG models, pressing intensity maps, and pass network topology. Truth lies not in the eye, but in the data.",
        tags: ["xG Models", "Heatmaps", "Topology"],
        route: '/dashboard'
    },
    {
        id: 2,
        key: 'SQUAD',
        title: "Squad",
        subtitle: "003 // Human Capital",
        img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2670&auto=format&fit=crop",
        description: "The human element optimized. Bio-mechanics, psychological profiling, and technical refinement. Building the ultimate athlete through rigorous science.",
        tags: ["Bio-mechanics", "Profiling", "Refinement"],
        route: '/roster'
    }
];

const APP_SECTIONS = [
    { label: 'Dashboard', path: '/dashboard', desc: 'Performance Overview' },
    { label: 'Tactics Board', path: '/tactics', desc: 'Strategic Planning' },
    { label: 'Roster', path: '/roster', desc: 'Athlete Management' },
    { label: 'Schedule', path: '/schedule', desc: 'Season Fixtures' },
    { label: 'Drill Library', path: '/drills', desc: 'Training Database' },
    { label: 'Planning', path: '/planning', desc: 'Session Design' },
    { label: 'System Settings', path: '/settings', desc: 'Configuration' },
];

type FeatureCardProps = { 
  item: typeof METHODOLOGY_DATA[0], 
  index: number, 
  isActive: boolean, 
  onClick: () => void,
  theme: 'dark' | 'light'
};

const FeatureCard: React.FC<FeatureCardProps> = ({ item, index, isActive, onClick, theme }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group cursor-pointer py-12 border-b border-[var(--border)] relative"
            onClick={onClick}
        >
            <div className="flex justify-between items-baseline">
                <h3 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter transition-all duration-700 ${isActive ? 'text-[var(--text-primary)]' : 'text-transparent outline-text opacity-40 hover:opacity-100 hover:text-[var(--text-primary)]'}`} style={isActive ? {} : { WebkitTextStroke: `1px ${theme === 'dark' ? 'white' : 'black'}` }}>
                    {item.title}
                </h3>
                <span className="text-xs font-mono opacity-50 hidden md:block">{item.subtitle}</span>
            </div>
            
            <AnimatePresence>
                {isActive && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="overflow-hidden mt-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="aspect-video bg-neutral-900 overflow-hidden">
                                <img src={item.img} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-between">
                                <p className="text-sm md:text-base leading-relaxed font-light">{item.description}</p>
                                <div className="flex items-center gap-4 mt-8">
                                    <div className="h-px bg-[var(--text-primary)] flex-1" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Explore</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailViewRef = useRef<HTMLDivElement>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const activeData = activeFeatureIndex !== null ? METHODOLOGY_DATA[activeFeatureIndex] : null;

  const handleCardClick = (index: number) => {
    if (activeFeatureIndex === index) {
        setActiveFeatureIndex(null);
        return;
    }
    setActiveFeatureIndex(index);
  };

  const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const handleNavigate = () => {
      if (activeData?.route) {
          navigate(activeData.route);
      }
  };

  return (
    <div ref={containerRef} className="bg-[var(--background)] min-h-screen text-[var(--text-primary)] overflow-hidden selection:bg-[var(--text-primary)] selection:text-[var(--background)] transition-colors duration-500">
      
      {/* Internal Nav - Functional Links & Subtle Menu */}
      <nav className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-40 mix-blend-difference pointer-events-none">
          <div className="flex gap-12 pointer-events-auto">
              {[
                  { label: 'VISION', id: 'vision' }, 
                  { label: 'ARCHIVE', id: 'archive' }
              ].map((item) => (
                  <button 
                      key={item.label} 
                      onClick={() => scrollToSection(item.id)}
                      className="hidden md:block text-[10px] text-white font-bold tracking-[0.3em] hover:blur-[2px] transition-all duration-300 opacity-60 hover:opacity-100"
                  >
                      {item.label}
                  </button>
              ))}
          </div>
          <div className="flex items-center gap-6 pointer-events-auto text-white">
             <div className="hidden md:flex items-center gap-2 opacity-60">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest">SYSTEM ONLINE</span>
             </div>
             <button 
                onClick={() => setIsMenuOpen(true)}
                className="hover:opacity-70 transition-opacity p-2 -mr-2"
             >
                <Menu size={24} strokeWidth={1} />
             </button>
          </div>
      </nav>

      {/* Full Screen Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black text-white flex flex-col justify-center items-center"
            >
                 <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                    <X size={32} strokeWidth={1} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12 max-w-5xl w-full px-12">
                     {APP_SECTIONS.map((item, i) => (
                         <motion.div
                            key={item.path}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="group"
                         >
                            <button 
                                onClick={() => navigate(item.path)}
                                className="text-left w-full group"
                            >
                                <div className="flex items-baseline justify-between border-b border-white/20 pb-4 mb-2 group-hover:border-white transition-colors duration-500">
                                    <span className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-transparent outline-text group-hover:text-white transition-all duration-500" style={{ WebkitTextStroke: '1px white' }}>
                                        {item.label}
                                    </span>
                                    <ArrowDownRight className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-90 text-white" />
                                </div>
                                <span className="text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                                    0{i+1} // {item.desc}
                                </span>
                            </button>
                         </motion.div>
                     ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="vision" className="relative h-[90vh] flex flex-col justify-center items-center overflow-hidden">
        <Landing3D theme={theme} />
        
        <motion.div 
            style={{ y, opacity }}
            className="relative z-10 flex flex-col items-center text-center mix-blend-difference"
        >
            <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[8vw] md:text-[10vw] text-white font-black leading-[0.8] tracking-tighter uppercase whitespace-nowrap"
            >
                Pro<br/>
                <span className="text-transparent outline-text" style={{ WebkitTextStroke: '1.5px white' }}>Coaching OS</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mt-12 text-xs md:text-sm font-mono tracking-[0.5em] uppercase text-white/70 max-w-md text-center"
            >
                The geometry of instinct.
            </motion.p>
        </motion.div>

        <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 100 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="absolute bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-[var(--text-primary)]"
        />
      </section>

      {/* Kinetic Archive Section (Minimalist List) */}
      <section id="archive" className="py-32 px-6 md:px-20 relative bg-[var(--background)] transition-colors duration-500">
         <div className="max-w-6xl mx-auto">
             <div className="mb-24 flex items-baseline gap-4">
                 <h2 className="text-sm font-mono uppercase tracking-[0.2em] opacity-50">Kinetic Archive</h2>
                 <div className="h-px bg-[var(--border)] flex-1" />
             </div>

             <div className="flex flex-col">
                 {METHODOLOGY_DATA.map((item, i) => (
                     <FeatureCard 
                        key={item.id}
                        item={item}
                        index={i}
                        isActive={activeFeatureIndex === i}
                        onClick={() => {
                            handleCardClick(i);
                            if (activeFeatureIndex === i) {
                                navigate(item.route);
                            }
                        }}
                        theme={theme}
                     />
                 ))}
             </div>
         </div>
      </section>

      {/* Footer Minimal */}
      <section className="h-[50vh] flex items-center justify-center border-t border-[var(--border)] bg-[var(--surface)] transition-colors duration-500">
          <div className="text-center space-y-6">
              <Circle size={48} strokeWidth={1} className="mx-auto animate-spin-slow text-[var(--text-secondary)] opacity-20" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-secondary)]">PitchControl OS v2.0</p>
          </div>
      </section>

    </div>
  );
};

export default HomePage;
