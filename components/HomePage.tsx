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
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative flex flex-col gap-4 cursor-pointer transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            onClick={onClick}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                <img 
                    src={item.img} 
                    alt={item.title} 
                    className={`w-full h-full object-cover contrast-125 transition-all duration-[1.5s] ease-out ${isActive ? 'scale-110 grayscale-0' : 'grayscale group-hover:scale-110 group-hover:grayscale-0'}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 flex items-end p-6 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="text-white text-xs font-mono uppercase tracking-widest border border-white/30 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md">
                        {isActive ? 'Active Protocol' : 'Initialize Protocol'}
                    </span>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-start border-t border-[var(--border)] pt-4">
                    <h3 
                        className={`text-4xl md:text-5xl font-black uppercase leading-[0.85] tracking-tighter transition-all duration-500 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)] group-hover:text-transparent group-hover:outline-text'}`} 
                        style={isActive ? {} : { WebkitTextStroke: `1px ${theme === 'dark' ? 'white' : 'black'}` }}
                    >
                        {item.title}
                    </h3>
                    <ArrowDownRight className={`text-[var(--text-secondary)] transition-all duration-500 ${isActive ? 'text-[var(--text-primary)] rotate-[-45deg]' : 'group-hover:text-[var(--text-primary)] group-hover:rotate-[-45deg]'}`} />
                </div>
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-2">
                    {item.subtitle}
                </p>
            </div>
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
    
    // Ensure the user sees the detail view comfortably
    setTimeout(() => {
        if (detailViewRef.current) {
            const yOffset = -120; // Ensure header doesn't cover content
            const y = detailViewRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, 100);
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
                  { label: 'FLOW', id: 'flow' }, 
                  { label: 'DATA', id: 'data' }
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

      {/* Manifest Section */}
      <section id="flow" ref={detailViewRef} className="py-32 px-6 md:px-20 border-t border-[var(--border)] relative z-10 bg-[var(--background)] transition-colors duration-500">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
             
             {/* Left Column: Sticky Content Area */}
             <div className="relative">
                 <div className="sticky top-32 min-h-[400px] z-20">
                     <AnimatePresence mode="wait">
                         {activeData ? (
                             <motion.div 
                                key="active"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="space-y-6"
                             >
                                <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-secondary)] border-b border-[var(--border)] pb-4 mb-2">
                                     <button 
                                        onClick={() => setActiveFeatureIndex(null)}
                                        className="hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors uppercase tracking-widest"
                                     >
                                         <ChevronLeft size={10} />
                                         Index
                                     </button>
                                     <span>/</span>
                                     <span className="uppercase tracking-widest text-primary">{activeData.key}</span>
                                     <span className="ml-auto opacity-50">SYS.MOD.0{activeData.id + 1}</span>
                                </div>
                                
                                <div>
                                    <motion.h2 
                                        className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-[var(--text-primary)]" 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {activeData.title}
                                    </motion.h2>
                                    <motion.p
                                        className="text-xs font-mono text-primary mt-2 uppercase tracking-widest"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {activeData.subtitle}
                                    </motion.p>
                                </div>
                                
                                <motion.div 
                                    className="bg-[var(--surface)] border-l-2 border-primary pl-6 py-2 pr-4 relative"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10 blur-sm rounded-r-lg" />
                                    <p className="text-sm md:text-base text-[var(--text-primary)] leading-relaxed font-light">
                                        {activeData.description}
                                    </p>
                                </motion.div>

                                <motion.div 
                                    className="grid grid-cols-2 gap-4 pt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] block mb-2">Parameters</span>
                                        <div className="flex flex-wrap gap-2">
                                            {activeData.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-1 bg-[var(--border)] rounded text-[10px] uppercase font-bold text-[var(--text-primary)]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] block mb-2">Status</span>
                                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            OPERATIONAL
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className="pt-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <button 
                                        onClick={handleNavigate}
                                        className="group w-full md:w-auto px-8 py-4 bg-[var(--text-primary)] text-[var(--background)] text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center justify-between gap-8"
                                    >
                                        <span>Initiate Protocol</span>
                                        <ArrowDownRight className="transition-transform group-hover:-rotate-90" size={16} />
                                    </button>
                                </motion.div>
                             </motion.div>
                         ) : (
                             <motion.div 
                                key="default"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-12"
                             >
                                <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none text-[var(--text-primary)]">
                                    Kinetic<br/>
                                    <span className="italic font-serif font-light text-[var(--text-secondary)]">Archives</span>
                                </h2>
                                <p className="text-sm md:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-sm">
                                    We strip away the noise. The pitch is no longer just grass; it is a canvas of geometric probability. 
                                    Data is not just numbers—it is the ritual of performance.
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest pt-8 border-t border-[var(--border)] w-fit text-[var(--text-primary)]">
                                    <span>Select a module to explore</span>
                                    <MoveRight size={14} />
                                </div>
                             </motion.div>
                         )}
                     </AnimatePresence>
                 </div>
             </div>

             {/* Right Column: Cards */}
             <div id="data" className="grid grid-cols-1 gap-32 pt-20">
                 {METHODOLOGY_DATA.map((item, i) => (
                     <FeatureCard 
                        key={item.id}
                        item={item}
                        index={i}
                        isActive={activeFeatureIndex === i}
                        onClick={() => handleCardClick(i)}
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