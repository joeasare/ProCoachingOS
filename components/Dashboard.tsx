import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, AlertTriangle, Play, Pause, ChevronRight, ChevronLeft, Zap, Download, X, CloudRain, Sun, Volume2, Maximize2, Users, Sliders, RotateCcw, Upload } from 'lucide-react';
import TacticalField from './TacticalField';
import { useNavigate } from 'react-router-dom';
import { mockSessions, Session } from './Schedule';
import { useToast } from '../context/ToastContext';

// --- Helper Components ---

const StatCard: React.FC<{ label: string; value: string; subtext?: string; icon?: any }> = ({ label, value, subtext, icon: Icon }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="glass-panel rounded-xl p-6 flex flex-col justify-between h-full group hover:border-primary/50 transition-colors min-h-[140px]"
  >
    <div className="flex justify-between items-start">
      <span className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider">{label}</span>
      {Icon && <Icon size={16} className="text-[var(--text-secondary)] group-hover:text-primary transition-colors" />}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl md:text-4xl font-light text-[var(--text-primary)] tracking-tight font-mono">{value}</h3>
      {subtext && <p className="text-[var(--text-secondary)] text-xs mt-2">{subtext}</p>}
    </div>
  </motion.div>
);

interface MatchPreviewCardProps {
    matches: Session[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

const MatchPreviewCard: React.FC<MatchPreviewCardProps> = ({ matches, currentIndex, setCurrentIndex }) => {
    const navigate = useNavigate();
    const match = matches[currentIndex];

    if (!match) return null;

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(Math.max(0, currentIndex - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(Math.min(matches.length - 1, currentIndex + 1));
    };

    // Parse scores
    const [homeScore, awayScore] = useMemo(() => {
        if (!match.result) return [0, 0];
        const scores = match.result.split(' ')[1].split('-').map(Number);
        const isHome = match.location === 'Home';
        return isHome ? [scores[0], scores[1]] : [scores[1], scores[0]];
    }, [match]);

    const opponentName = match.title.replace(/^(vs |at )/i, '');
    const isHome = match.location === 'Home';

    return (
        <div className="glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden h-full flex flex-col justify-center min-h-[200px] border-primary/20 group cursor-default shadow-lg shadow-black/20">
            {/* Abstract Background Gradient */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 w-full">
                <div className="flex justify-between items-center mb-6">
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-[var(--glass)] text-[var(--text-secondary)] uppercase border border-border">
                        Matchday {currentIndex + 1}
                    </span>
                    
                    <div className="flex items-center gap-2 bg-[var(--surface)] rounded-lg border border-border p-1">
                        <button 
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="p-1.5 rounded hover:bg-[var(--glass-hover)] text-[var(--text-secondary)] disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] w-16 text-center border-l border-r border-border mx-1">
                            {new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <button 
                            onClick={handleNext}
                            disabled={currentIndex === matches.length - 1}
                            className="p-1.5 rounded hover:bg-[var(--glass-hover)] text-[var(--text-secondary)] disabled:opacity-30 transition-all cursor-pointer"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
                
                <AnimatePresence mode='wait'>
                    <motion.div 
                        key={match.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between gap-4 mb-8 text-[var(--text-primary)]"
                    >
                        <div className={`flex flex-col items-start ${!isHome ? 'opacity-70' : ''}`}>
                            <span className="text-xl md:text-3xl font-semibold tracking-tighter truncate max-w-[120px] md:max-w-none">
                                {isHome ? 'Maryland' : opponentName}
                            </span>
                            <span className="text-4xl font-display font-bold mt-1 tracking-tighter">
                                {isHome ? homeScore : homeScore}
                            </span>
                        </div>
                        
                        <div className="h-12 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent mx-2 opacity-50" />
                        
                        <div className={`flex flex-col items-end ${isHome ? 'opacity-70' : ''}`}>
                            <span className="text-xl md:text-3xl font-semibold tracking-tighter truncate max-w-[120px] md:max-w-none text-right">
                                {isHome ? opponentName : 'Maryland'}
                            </span>
                            <span className="text-4xl font-display font-bold mt-1 tracking-tighter">
                                {isHome ? awayScore : awayScore}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button 
                    onClick={() => navigate(`/match/${match.id}`)}
                    className="w-full py-3 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                >
                    <Play size={12} fill="currentColor" /> View Match Report
                </button>
            </div>
        </div>
    );
}

// --- Main Dashboard ---

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [statsView, setStatsView] = useState<'Game' | 'Season'>('Game');
  const { addToast } = useToast();
  const [isSimExpanded, setIsSimExpanded] = useState(false);
  
  // Memoize matches to prevent re-filtering
  const matches = useMemo(() => mockSessions.filter(s => s.type === 'Match' && s.status === 'Completed'), []);
  const [activeMatchIndex, setActiveMatchIndex] = useState(matches.length - 1);

  // Helper to determine team color
  const getOpponentColor = (name: string) => {
      const n = name.toUpperCase();
      if (n.includes('RUTGERS')) return '#cc0033'; 
      if (n.includes('PENN')) return '#041E42'; 
      if (n.includes('INDIANA')) return '#990000';
      if (n.includes('MICHIGAN')) return '#00274c';
      if (n.includes('OHIO')) return '#bb0000';
      if (n.includes('IOWA')) return '#FFCD00';
      if (n.includes('UCLA')) return '#2D68C4';
      if (n.includes('USC')) return '#990000';
      return '#444444';
  };

  const activeMatch = matches[activeMatchIndex];
  const activeOpponentColor = useMemo(() => {
     if (!activeMatch) return '#444444';
     const opponent = activeMatch.title.replace(/^(vs |at )/i, '');
     return getOpponentColor(opponent);
  }, [activeMatch]);

  // --- Simulation State ---
  const [simMinute, setSimMinute] = useState(0);
  const [simScore, setSimScore] = useState<[number, number]>([0, 0]);
  const [goalTimes, setGoalTimes] = useState<{home: number[], away: number[]}>({ home: [], away: [] });
  const [isSimPlaying, setIsSimPlaying] = useState(true);

  // Expanded View Control States
  const [weather, setWeather] = useState<'Clear' | 'Rain' | 'Fog'>('Clear');
  const [crowdNoise, setCrowdNoise] = useState(50);
  const [matchIntensity, setMatchIntensity] = useState('High');

  // Setup simulation when match changes
  useEffect(() => {
    if (!activeMatch) return;
    
    const resultParts = activeMatch.result?.split(' '); 
    let mdScore = 0;
    let oppScore = 0;
    
    if (resultParts && resultParts.length >= 2) {
        const scores = resultParts[1].split('-').map(Number);
        mdScore = scores[0];
        oppScore = scores[1];
    }
    
    const isHome = activeMatch.location === 'Home';
    const homeGoalsCount = isHome ? mdScore : oppScore;
    const awayGoalsCount = isHome ? oppScore : mdScore;

    // Generate random minutes for goals (sorted)
    const hTimes = Array.from({ length: homeGoalsCount }, () => Math.floor(Math.random() * 80) + 5).sort((a,b) => a-b);
    const aTimes = Array.from({ length: awayGoalsCount }, () => Math.floor(Math.random() * 80) + 5).sort((a,b) => a-b);
    
    setGoalTimes({ home: hTimes, away: aTimes });
    setSimMinute(0);
    setSimScore([0, 0]);
    setIsSimPlaying(true);
  }, [activeMatch]);

  // Simulation Timer Loop
  useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (isSimPlaying) {
          interval = setInterval(() => {
              setSimMinute(prev => {
                  if (prev >= 90) {
                      setIsSimPlaying(false); // Stop at 90
                      return 90;
                  }
                  const next = prev + 1;
                  
                  // Count goals up to current minute
                  const h = goalTimes.home.filter(t => t <= next).length;
                  const a = goalTimes.away.filter(t => t <= next).length;
                  
                  setSimScore([h, a]);
                  return next;
              });
          }, 100); // Speed: 100ms per simulated minute
      }
      return () => clearInterval(interval);
  }, [goalTimes, isSimPlaying]);

  const handleSimRestart = () => {
      setSimMinute(0);
      setSimScore([0, 0]);
      setIsSimPlaying(true);
  };

  const handleSimToggle = () => {
      setIsSimPlaying(!isSimPlaying);
  };


  // --- Dynamic Stats Calculations ---
  
  // 1. Season Overview Stats
  const stats = useMemo(() => {
    const currentMatches = matches.slice(0, activeMatchIndex + 1);
    let w=0, l=0, d=0;
    let goals=0, shots=0, onTarget=0, saves=0, goalsConceded=0;

    currentMatches.forEach((m, idx) => {
        const parts = m.result?.split(' ');
        if(parts && parts.length >= 2) {
            const outcome = parts[0];
            const score = parts[1].split('-');
            const mdScore = parseInt(score[0]);
            const oppScore = parseInt(score[1]);

            if(outcome === 'W') w++;
            else if(outcome === 'L') l++;
            else d++;

            goals += mdScore;
            goalsConceded += oppScore;
            
            // Deterministic random stats
            const hash = m.id.charCodeAt(0) + idx; 
            const matchShots = 6 + (hash % 14); 
            const matchOnTarget = Math.floor(matchShots * (0.35 + (hash % 4)/10)); 
            const matchSaves = Math.max(1, oppScore + (hash % 5) - 1); 

            shots += matchShots;
            onTarget += matchOnTarget;
            saves += matchSaves;
        }
    });

    const totalGames = currentMatches.length;
    const gpg = totalGames ? (goals / totalGames).toFixed(2) : '0.00';
    const shotsFaced = saves + goalsConceded;
    const svPct = shotsFaced ? (saves / shotsFaced).toFixed(3).substring(1) : '.000';
    const shotAcc = shots ? Math.round((onTarget / shots) * 100) : 0;

    return {
        record: `${w}-${l}-${d}`,
        gpg,
        svPct,
        shotAcc: `${shotAcc}%`,
        totalGoals: goals,
        totalSaves: saves,
        totalShots: shots,
        gamesPlayed: totalGames
    };
  }, [activeMatchIndex, matches]);

  // 2. Dynamic Top Performers
  const topPerformers = useMemo(() => {
      if (statsView === 'Season') {
          // Deterministically distribute goals/saves based on matches played
          let smithGoals = 0, moralesGoals = 0, egelandGoals = 0;
          let luckeySaves = stats.totalSaves;

          // Distribute total goals
          for(let i=0; i < stats.totalGoals; i++) {
              const rand = (i * 137) % 100;
              if (rand < 40) smithGoals++;
              else if (rand < 70) moralesGoals++;
              else egelandGoals++;
          }

          return [
              { name: 'K. Smith', stat: `${smithGoals} Goals`, detail: `${stats.gamesPlayed} Matches`, trend: '+1' },
              { name: 'A. Morales', stat: `${moralesGoals} Goals`, detail: `${stats.gamesPlayed} Matches`, trend: '0' },
              { name: 'F. Luckey', stat: `${luckeySaves} Saves`, detail: `${stats.svPct} SV%`, trend: '+4' }
          ];
      } else {
          // Game Stats
          if (!activeMatch) return [];

          const resultParts = activeMatch.result?.split(' ');
          if (!resultParts || resultParts.length < 2) return [];

          const scores = resultParts[1].split('-').map(Number);
          // Assuming Home-Away score format
          const mdGoals = activeMatch.location === 'Home' ? scores[0] : scores[1];
          const oppGoals = activeMatch.location === 'Home' ? scores[1] : scores[0];

          // Deterministic stats for this match ID
          const seed = activeMatch.id.charCodeAt(0);

          let smithG = 0;
          let moralesG = 0;

          // Distribute MD goals
          for(let i=0; i<mdGoals; i++) {
              if ((seed + i) % 3 !== 0) smithG++;
              else moralesG++;
          }

          const saves = Math.max(1, oppGoals + (seed % 3) + 1);
          
          // Generate realistic match ratings (0-10)
          const ratingSmith = Math.min(9.8, 7.0 + (smithG * 1.5) + (seed % 10)/20).toFixed(1);
          const ratingMorales = Math.min(9.8, 6.8 + (moralesG * 1.5) + (seed % 10)/20).toFixed(1);
          const ratingLuckey = Math.min(9.9, 6.5 + (saves * 0.4) - (oppGoals * 0.3)).toFixed(1);

          return [
              { name: 'K. Smith', stat: `${smithG} Goals`, detail: `Rating: ${ratingSmith}`, trend: smithG > 0 ? '+1' : '0' },
              { name: 'A. Morales', stat: `${moralesG} Goals`, detail: `Rating: ${ratingMorales}`, trend: moralesG > 0 ? '+1' : '0' },
              { name: 'F. Luckey', stat: `${saves} Saves`, detail: `Rating: ${ratingLuckey}`, trend: saves > 3 ? '+1' : '0' }
          ];
      }
  }, [stats, statsView, activeMatch]);

  const handleExport = () => {
    // Mock export
    const csvContent = "data:text/csv;charset=utf-8,Player,Goals,Assists\nSmith,6,2\nMorales,5,2";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "season_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Stats exported to CSV', 'success');
  };

  const handleImport = () => {
      // Mock import
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,.xlsx';
      input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
              // Simulate loading
              addToast(`Importing ${file.name}...`, 'info');
              setTimeout(() => {
                  addToast('Stats imported successfully', 'success');
              }, 1500);
          }
      };
      input.click();
  };

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto space-y-6 md:space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">2025 Season Overview • Big Ten</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <button 
                onClick={handleImport}
                className="flex-1 md:flex-none h-10 px-4 rounded-lg border border-border text-[var(--text-primary)] text-xs font-medium hover:bg-[var(--glass)] hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
             >
                <Upload size={14} /> Import Stats
             </button>
             <button 
                onClick={handleExport}
                className="flex-1 md:flex-none h-10 px-4 rounded-lg border border-border text-[var(--text-primary)] text-xs font-medium hover:bg-[var(--glass)] hover:border-primary/50 transition-colors flex items-center justify-center gap-2"
             >
                <Download size={14} /> Export Stats
             </button>
             <button className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                <Zap size={16} fill="currentColor"/>
             </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall Record" value={stats.record} subtext="Season to Date" icon={Activity} />
        <StatCard label="Goals Per Game" value={stats.gpg} subtext={`${stats.totalGoals} Total Goals`} icon={TrendingUp} />
        <StatCard label="Save Percentage" value={stats.svPct} subtext={`${stats.totalSaves} Total Saves`} icon={AlertTriangle} />
        <StatCard label="Shot Accuracy" value={stats.shotAcc} subtext={`${stats.totalShots} Shots Taken`} icon={Zap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Pitch */}
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-xl p-1 flex flex-col h-[500px] relative overflow-hidden group">
                <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-10 pointer-events-none">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] px-2 py-1 bg-black/40 backdrop-blur rounded">Tactical Analysis</h3>
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <span className="text-[10px] uppercase font-bold text-primary animate-pulse bg-primary/10 px-2 py-1 rounded border border-primary/20">Live Simulation</span>
                        <button 
                            onClick={() => setIsSimExpanded(true)}
                            className="text-xs text-[var(--text-secondary)] hover:text-white bg-black/40 backdrop-blur px-2 py-1 rounded hover:bg-black/60 transition-colors flex items-center gap-1"
                        >
                            Expand <Maximize2 size={12}/>
                        </button>
                    </div>
                </div>
                <div className="flex-1 rounded-lg overflow-hidden bg-black relative border border-white/5 cursor-pointer" onClick={() => setIsSimExpanded(true)}>
                    {/* Interaction Overlay */}
                    <div className="absolute inset-0 z-0 hover:bg-white/5 transition-colors" />
                    
                    {/* Live Simulation Scoreboard Overlay */}
                    <div className="absolute top-16 left-4 z-20 pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl flex flex-col gap-3 min-w-[160px]">
                            {/* Time */}
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                <div className={`w-2 h-2 rounded-full ${simMinute > 0 && simMinute < 90 ? 'bg-primary animate-pulse' : 'bg-neutral-500'}`} />
                                <span className="font-mono font-bold text-sm text-white">{simMinute}'</span>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest ml-auto font-medium">Matchday</span>
                            </div>
                            
                            {/* Score */}
                            <div className="flex justify-between items-center px-1">
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                                        {activeMatch?.location === 'Home' ? 'UMD' : (activeMatch?.title.replace(/^(vs |at )/i, '').substring(0,3).toUpperCase())}
                                    </span>
                                    <span className="text-2xl font-display font-bold text-white leading-none">{simScore[0]}</span>
                                </div>
                                
                                <span className="text-neutral-600 font-light text-xl opacity-50">:</span>
                                
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                                        {activeMatch?.location === 'Home' ? (activeMatch?.title.replace(/^(vs |at )/i, '').substring(0,3).toUpperCase()) : 'UMD'}
                                    </span>
                                    <span className="text-2xl font-display font-bold text-white leading-none">{simScore[1]}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TacticalField preview={true} opponentColor={activeOpponentColor} />
                </div>
            </div>
        </div>

        {/* Side Content */}
        <div className="flex flex-col gap-6">
            <div className="flex-none">
                <MatchPreviewCard 
                    matches={matches} 
                    currentIndex={activeMatchIndex} 
                    setCurrentIndex={setActiveMatchIndex} 
                />
            </div>
            
            <div className="flex-1 glass-panel rounded-xl p-6 flex flex-col gap-6">
                {/* Top Performers */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                            <TrendingUp size={14} /> Top Performers
                        </h3>
                        <div className="flex bg-[var(--glass)] rounded p-0.5 border border-border/50">
                            <button 
                                onClick={() => setStatsView('Game')}
                                className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded transition-colors ${statsView === 'Game' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Game
                            </button>
                            <button 
                                onClick={() => setStatsView('Season')}
                                className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded transition-colors ${statsView === 'Season' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Season
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {topPerformers.map((item, i) => (
                            <motion.div 
                                key={item.name + activeMatchIndex + statsView}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
                                    <p className="text-[10px] text-[var(--text-secondary)] uppercase">{item.detail}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-mono font-bold text-[var(--text-primary)] bg-[var(--glass)] px-2 py-1 rounded border border-border/50 block">
                                        {item.stat}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Expanded Simulation Modal */}
      <AnimatePresence>
        {isSimExpanded && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black flex flex-col"
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
                    <div className="pointer-events-auto flex items-center gap-4 bg-black/60 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Match Simulation</span>
                            <span className="text-[10px] text-neutral-400">Interactive Mode Active</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="text-center">
                                <span className="block text-xl font-bold text-white leading-none">{simScore[0]}</span>
                                <span className="text-[9px] uppercase text-neutral-500">UMD</span>
                            </div>
                            <span className="text-neutral-600">:</span>
                            <div className="text-center">
                                <span className="block text-xl font-bold text-white leading-none">{simScore[1]}</span>
                                <span className="text-[9px] uppercase text-neutral-500">OPP</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleSimToggle}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                title={isSimPlaying ? "Pause Simulation" : "Resume Simulation"}
                            >
                                {isSimPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                            </button>
                            <button 
                                onClick={handleSimRestart}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                title="Restart Game"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsSimExpanded(false)}
                        className="pointer-events-auto p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main 3D Canvas */}
                <div className="flex-1 w-full h-full relative">
                    {/* Expanded Mode: simulationMode=true enables the game loop, preview=false enables orbit controls */}
                    <TacticalField 
                        preview={false} 
                        simulationMode={true}
                        opponentColor={activeOpponentColor} 
                        weather={weather}
                        isPlaying={isSimPlaying}
                        simMinute={simMinute}
                    />
                </div>

                {/* Side Control Panel */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-64 shadow-2xl">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Sliders size={14} /> Simulation Config
                    </h3>

                    <div className="space-y-6">
                        {/* Weather */}
                        <div>
                            <label className="text-[10px] font-bold text-neutral-400 uppercase mb-2 block">Weather Conditions</label>
                            <div className="flex bg-white/5 rounded-lg p-1">
                                {['Clear', 'Rain', 'Fog'].map((w) => (
                                    <button
                                        key={w}
                                        onClick={() => setWeather(w as any)}
                                        className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-colors flex justify-center items-center gap-1 ${
                                            weather === w ? 'bg-primary text-white shadow-lg' : 'text-neutral-500 hover:text-white'
                                        }`}
                                    >
                                        {w === 'Clear' ? <Sun size={12} /> : w === 'Rain' ? <CloudRain size={12} /> : <Zap size={12} />}
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intensity */}
                        <div>
                            <label className="text-[10px] font-bold text-neutral-400 uppercase mb-2 block">Match Intensity</label>
                            <div className="flex items-center justify-between text-xs text-white mb-2 font-mono">
                                <span>Low</span>
                                <span className="text-primary">{matchIntensity}</span>
                                <span>High</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                defaultValue={85}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setMatchIntensity(val > 70 ? 'High' : val > 40 ? 'Med' : 'Low');
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary" 
                            />
                        </div>

                        {/* Crowd */}
                        <div>
                            <label className="text-[10px] font-bold text-neutral-400 uppercase mb-2 block flex justify-between">
                                <span>Crowd Volume</span>
                                <span className="text-primary">{crowdNoise}%</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <Volume2 size={16} className="text-neutral-500" />
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={crowdNoise}
                                    onChange={(e) => setCrowdNoise(parseInt(e.target.value))}
                                    className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary" 
                                />
                            </div>
                        </div>

                        <div className="h-px bg-white/10 w-full" />

                        {/* Scenarios */}
                        <div>
                            <label className="text-[10px] font-bold text-neutral-400 uppercase mb-3 block">Quick Scenarios</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 hover:border-primary/50 transition-colors">
                                    High Press
                                </button>
                                <button className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 hover:border-primary/50 transition-colors">
                                    Low Block
                                </button>
                                <button className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 hover:border-primary/50 transition-colors">
                                    Counter Attack
                                </button>
                                <button className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-white hover:bg-white/10 hover:border-primary/50 transition-colors">
                                    Set Piece
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;