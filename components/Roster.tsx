
import React, { useState, useMemo } from 'react';
import { Player, PlayerAttributes } from '../types';
import { Search, SlidersHorizontal, ArrowUpRight, X, Radar, PenLine, User, Activity, Zap, Scale, HeartPulse, Brain, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded Data with Attributes & Bio-Metrics
const players: Player[] = [
  { id: '14', number: 14, name: 'Kelsey Smith', position: 'FWD', status: 'Fit', minutesPlayed: 1450, goals: 6, assists: 2, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100',
    attributes: { pace: 88, shooting: 85, passing: 72, dribbling: 84, defending: 35, physical: 78 },
    bioMechanics: { sprintSymmetry: 49.8, groundContactTime: 185, forceProduction: 2100, fatigueIndex: 12, sleepQuality: 92 },
    loadManagement: { acuteLoad: 2400, chronicLoad: 2100, acwr: 1.14, weeklyStrain: [350, 400, 200, 600, 300, 450, 100] },
    notes: ['Improve decision making in final third', 'High press triggers']
  },
  { id: '2', number: 2, name: 'Ava Morales', position: 'FWD', status: 'Fit', minutesPlayed: 1320, goals: 5, assists: 2, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100',
    attributes: { pace: 90, shooting: 80, passing: 68, dribbling: 88, defending: 30, physical: 72 },
    bioMechanics: { sprintSymmetry: 50.1, groundContactTime: 175, forceProduction: 1950, fatigueIndex: 18, sleepQuality: 85 },
    loadManagement: { acuteLoad: 2100, chronicLoad: 2000, acwr: 1.05, weeklyStrain: [300, 350, 200, 500, 300, 400, 50] }
  },
  { id: '22', number: 22, name: 'Lisa McIntyre', position: 'MID', status: 'Fit', minutesPlayed: 1280, goals: 2, assists: 3, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100',
    attributes: { pace: 70, shooting: 65, passing: 88, dribbling: 78, defending: 75, physical: 80 },
    bioMechanics: { sprintSymmetry: 48.5, groundContactTime: 200, forceProduction: 2200, fatigueIndex: 25, sleepQuality: 78 },
    loadManagement: { acuteLoad: 1800, chronicLoad: 1900, acwr: 0.95, weeklyStrain: [250, 300, 150, 400, 250, 350, 100] }
  },
  { id: '20', number: 20, name: 'Gemma Davitian', position: 'MID', status: 'Fit', minutesPlayed: 1100, goals: 3, assists: 0, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '47', number: 47, name: 'Ellie Egeland', position: 'FWD', status: 'Resting', minutesPlayed: 850, goals: 2, assists: 1, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100',
    attributes: { pace: 92, shooting: 75, passing: 65, dribbling: 85, defending: 40, physical: 65 },
    bioMechanics: { sprintSymmetry: 50.5, groundContactTime: 160, forceProduction: 1800, fatigueIndex: 45, sleepQuality: 60 },
    loadManagement: { acuteLoad: 2800, chronicLoad: 1800, acwr: 1.55, weeklyStrain: [400, 500, 200, 700, 400, 500, 100] } // High Risk
  },
  { id: '15', number: 15, name: 'Mckinley Heaven', position: 'MID', status: 'Injured', minutesPlayed: 400, goals: 2, assists: 0, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '6', number: 6, name: 'Alyssa Abramson', position: 'DEF', status: 'Fit', minutesPlayed: 1580, goals: 0, assists: 2, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '13', number: 13, name: 'Delaney DeMartino', position: 'DEF', status: 'Fit', minutesPlayed: 1600, goals: 0, assists: 2, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '8', number: 8, name: 'Emily Lenhard', position: 'MID', status: 'Fit', minutesPlayed: 900, goals: 0, assists: 2, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '23', number: 23, name: 'Tahirah Turnage-Morales', position: 'DEF', status: 'Fit', minutesPlayed: 1550, goals: 1, assists: 0, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '3', number: 3, name: 'Peyton Bernard', position: 'MID', status: 'Fit', minutesPlayed: 120, goals: 0, assists: 1, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '28', number: 28, name: 'Ella Bulava', position: 'DEF', status: 'Fit', minutesPlayed: 1400, goals: 0, assists: 1, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '5', number: 5, name: 'Mia Mitchell', position: 'MID', status: 'Suspended', minutesPlayed: 800, goals: 0, assists: 1, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '11', number: 11, name: 'Drew Bernard', position: 'DEF', status: 'Fit', minutesPlayed: 300, goals: 0, assists: 0, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '7', number: 7, name: 'Faith Luckey', position: 'GK', status: 'Fit', minutesPlayed: 1570, goals: 0, assists: 0, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
  { id: '0', number: 0, name: 'Maya Cheeseboro', position: 'GK', status: 'Fit', minutesPlayed: 45, goals: 0, assists: 0, avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100' },
];

const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    if (status === 'Fit') colorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (status === 'Injured') colorClass = 'bg-red-500/10 text-red-500 border-red-500/20';
    if (status === 'Suspended') colorClass = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (status === 'Resting') colorClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20';

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit ${colorClass} border`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${status === 'Fit' ? 'animate-pulse' : ''}`} />
            {status}
        </span>
    );
};

const RadarChart = ({ attributes }: { attributes: PlayerAttributes }) => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const stats = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physical'];
    const values = [
        attributes.pace, attributes.shooting, attributes.passing, 
        attributes.dribbling, attributes.defending, attributes.physical
    ];

    const polyPoints = values.map((val, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const r = (val / 100) * radius;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

    const bgLevels = [0.2, 0.4, 0.6, 0.8, 1].map(level => {
        return stats.map((_, i) => {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const r = level * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
    });

    return (
        <svg width={size} height={size} className="overflow-visible">
            {/* Background Webs */}
            {bgLevels.map((points, i) => (
                <polygon key={i} points={points} fill="none" stroke="currentColor" strokeOpacity={0.1} />
            ))}
            
            {/* Axes */}
            {stats.map((stat, i) => {
                 const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                 const x = center + (radius + 15) * Math.cos(angle);
                 const y = center + (radius + 15) * Math.sin(angle);
                 return (
                     <React.Fragment key={i}>
                        <line 
                            x1={center} y1={center} 
                            x2={center + radius * Math.cos(angle)} 
                            y2={center + radius * Math.sin(angle)} 
                            stroke="currentColor" strokeOpacity={0.1} 
                        />
                        <text 
                            x={x} y={y} 
                            fill="currentColor" 
                            fontSize="9" 
                            textAnchor="middle" 
                            alignmentBaseline="middle"
                            className="uppercase tracking-widest font-mono opacity-50"
                        >
                            {stat}
                        </text>
                     </React.Fragment>
                 )
            })}

            {/* Data Polygon */}
            <polygon points={polyPoints} fill="rgba(225, 29, 72, 0.2)" stroke="var(--primary)" strokeWidth={2} />
        </svg>
    );
}

const BioMetricCard = ({ label, value, unit, icon: Icon, colorClass = "text-[var(--text-primary)]" }: any) => (
    <div className="bg-[var(--glass)] p-4 rounded-xl border border-border flex flex-col justify-between h-24">
        <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">{label}</span>
            <Icon size={14} className="text-[var(--text-secondary)] opacity-50" />
        </div>
        <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-mono font-bold ${colorClass}`}>{value}</span>
            {unit && <span className="text-xs text-[var(--text-secondary)] font-medium">{unit}</span>}
        </div>
    </div>
);

const PlayerDetailPanel = ({ player, onClose }: { player: Player, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'performance'>('overview');

    return (
        <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[540px] bg-surface border-l border-border z-[60] shadow-2xl overflow-y-auto"
        >
            <div className="relative h-48 bg-neutral-900">
                <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2670&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="absolute -bottom-10 left-8 flex items-end gap-4">
                    <div className="w-24 h-24 rounded-xl border-4 border-surface overflow-hidden bg-neutral-800">
                        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="mb-3">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{player.name}</h2>
                        <div className="flex gap-2 text-sm text-[var(--text-secondary)]">
                            <span className="font-mono">#{player.number}</span>
                            <span>•</span>
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>Maryland</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-14 px-8 pb-10 space-y-8">
                {/* Status & Contract */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <StatusBadge status={player.status} />
                        <span className="px-3 py-1 bg-[var(--glass)] border border-border rounded-md text-[10px] uppercase font-bold text-[var(--text-secondary)]">Contract: 2026</span>
                    </div>
                    {/* Tab Switcher */}
                    <div className="flex bg-[var(--glass)] p-1 rounded-lg border border-border/50">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'overview' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('performance')}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'performance' ? 'bg-primary text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Performance
                        </button>
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                         {/* Radar Chart Section */}
                        {player.attributes ? (
                            <div className="bg-[var(--glass)] border border-border rounded-xl p-6 flex flex-col items-center">
                                <div className="w-full flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Technical Profiling</h3>
                                    <Radar size={14} className="text-[var(--text-secondary)]" />
                                </div>
                                <RadarChart attributes={player.attributes} />
                            </div>
                        ) : (
                            <div className="p-8 text-center border border-dashed border-border rounded-xl text-[var(--text-secondary)] text-sm">
                                No scouting data available.
                            </div>
                        )}

                        {/* Season Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[var(--glass)] p-4 rounded-lg text-center border border-border">
                                <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">{player.goals}</div>
                                <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mt-1">Goals</div>
                            </div>
                            <div className="bg-[var(--glass)] p-4 rounded-lg text-center border border-border">
                                <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">{player.assists}</div>
                                <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mt-1">Assists</div>
                            </div>
                            <div className="bg-[var(--glass)] p-4 rounded-lg text-center border border-border">
                                <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">{player.minutesPlayed}'</div>
                                <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mt-1">Minutes</div>
                            </div>
                        </div>

                         {/* Development Plan */}
                         <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Technical Refinement</h3>
                                <button className="text-[var(--text-secondary)] hover:text-primary"><PenLine size={14} /></button>
                            </div>
                            <div className="space-y-3">
                                {player.notes && player.notes.length > 0 ? (
                                    player.notes.map((note, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-[var(--glass)] rounded-lg border border-border/50">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{note}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-[var(--text-secondary)] italic">No active development goals set.</div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'performance' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {/* Load Management Section */}
                        {player.loadManagement ? (
                             <div className="space-y-4">
                                 <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                                     <Activity size={14} /> Periodization & Load
                                 </h3>
                                 
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="bg-[var(--glass)] p-4 rounded-xl border border-border">
                                         <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">Acute Load (7d)</span>
                                         <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">{player.loadManagement.acuteLoad}</div>
                                         <span className="text-[10px] text-[var(--text-secondary)]">Arbitrary Units</span>
                                     </div>
                                     <div className="bg-[var(--glass)] p-4 rounded-xl border border-border">
                                         <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">ACWR</span>
                                         <div className={`text-2xl font-mono font-bold ${player.loadManagement.acwr > 1.5 ? 'text-red-500' : player.loadManagement.acwr < 0.8 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {player.loadManagement.acwr}
                                         </div>
                                         <span className="text-[10px] text-[var(--text-secondary)]">Optimal: 0.8 - 1.3</span>
                                     </div>
                                 </div>

                                 {/* Micro-Cycle Chart */}
                                 <div className="bg-[var(--glass)] p-5 rounded-xl border border-border">
                                     <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-4">Micro-Cycle Strain (Last 7 Days)</span>
                                     <div className="h-32 flex items-end gap-2">
                                        {player.loadManagement.weeklyStrain.map((strain, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="w-full relative h-full flex items-end">
                                                    <div 
                                                        style={{ height: `${(strain / 800) * 100}%` }}
                                                        className={`w-full rounded-t-sm transition-all ${strain > 600 ? 'bg-red-500' : 'bg-primary'} opacity-70 group-hover:opacity-100`}
                                                    />
                                                </div>
                                                <span className="text-[9px] text-[var(--text-secondary)] font-mono uppercase">D{i+1}</span>
                                            </div>
                                        ))}
                                     </div>
                                 </div>
                             </div>
                        ) : (
                            <div className="p-8 text-center border border-dashed border-border rounded-xl text-[var(--text-secondary)] text-sm">
                                No GPS data synchronized.
                            </div>
                        )}

                        {/* Bio-Mechanics Section */}
                        {player.bioMechanics ? (
                             <div className="space-y-4">
                                 <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                                     <Zap size={14} /> Bio-Mechanics & Recovery
                                 </h3>
                                 <div className="grid grid-cols-2 gap-4">
                                     <BioMetricCard label="Sprint Sym." value={`${player.bioMechanics.sprintSymmetry}%`} icon={Scale} />
                                     <BioMetricCard label="GCT" value={player.bioMechanics.groundContactTime} unit="ms" icon={Activity} />
                                     <BioMetricCard label="Force Prod." value={player.bioMechanics.forceProduction} unit="N" icon={TrendingUp} />
                                     <BioMetricCard 
                                        label="Fatigue Idx" 
                                        value={player.bioMechanics.fatigueIndex} 
                                        icon={HeartPulse} 
                                        colorClass={player.bioMechanics.fatigueIndex > 40 ? 'text-red-500' : 'text-emerald-500'}
                                    />
                                     <div className="col-span-2">
                                        <BioMetricCard label="Sleep Quality" value={player.bioMechanics.sleepQuality} unit="/ 100" icon={Brain} />
                                     </div>
                                 </div>
                             </div>
                        ) : (
                            <div className="p-8 text-center border border-dashed border-border rounded-xl text-[var(--text-secondary)] text-sm">
                                No biometric data available.
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

const Roster: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const filteredPlayers = players.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto min-h-screen">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 gap-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] tracking-tight">Team Management</h1>
                <p className="text-[var(--text-secondary)] text-sm mt-1">2025 Season • {players.length} Players Registered</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search athlete..." 
                        className="w-full bg-[var(--glass)] border border-border rounded-lg pl-9 pr-4 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:bg-[var(--glass-hover)] focus:border-primary transition-all placeholder:text-[var(--text-secondary)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-3 py-2 bg-[var(--glass)] border border-border rounded-lg text-[var(--text-secondary)] hover:text-primary hover:border-primary/30 transition-colors">
                    <SlidersHorizontal size={14} />
                </button>
            </div>
       </div>

       {/* Mobile Card View (Visible on Small Screens) */}
       <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredPlayers.map(player => (
                <div 
                    key={player.id} 
                    onClick={() => setSelectedPlayer(player)}
                    className="glass-panel p-4 rounded-xl flex items-center gap-4 active:scale-[0.98] transition-transform"
                >
                    <div className="w-12 h-12 rounded-full bg-neutral-800 overflow-hidden border border-border">
                        <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">{player.name}</h3>
                                <p className="text-xs text-[var(--text-secondary)] uppercase">#{player.number} • {player.position}</p>
                            </div>
                            <StatusBadge status={player.status} />
                        </div>
                        <div className="mt-3 flex gap-4 text-xs text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1"><User size={12} /> {player.minutesPlayed}'</span>
                            <span>•</span>
                            <span>{player.goals} G</span>
                            <span>•</span>
                            <span>{player.assists} A</span>
                        </div>
                    </div>
                </div>
            ))}
       </div>

       {/* Desktop Table View (Hidden on Small Screens) */}
       <div className="hidden md:block glass-panel rounded-xl overflow-hidden shadow-lg border-opacity-50">
           <table className="w-full text-left border-collapse">
               <thead>
                   <tr className="border-b border-border bg-black/20 text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                       <th className="p-4 font-bold w-16 text-center">No.</th>
                       <th className="p-4 font-bold">Athlete</th>
                       <th className="p-4 font-bold">Role</th>
                       <th className="p-4 font-bold">Status</th>
                       <th className="p-4 font-bold text-right">ACWR</th>
                       <th className="p-4 font-bold text-right">Min</th>
                       <th className="p-4 font-bold w-12"></th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                   {filteredPlayers.map((player) => (
                       <motion.tr 
                        key={player.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedPlayer(player)}
                        className="group hover:bg-[var(--glass-hover)] transition-colors cursor-pointer"
                       >
                           <td className="p-4 text-center text-sm font-mono text-[var(--text-secondary)] group-hover:text-primary transition-colors">{player.number}</td>
                           <td className="p-4">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
                                      <img src={player.avatar} alt="" className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                   </div>
                                   <div>
                                        <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight block">{player.name}</span>
                                        <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Maryland</span>
                                   </div>
                               </div>
                           </td>
                           <td className="p-4">
                               <span className="text-[10px] font-bold bg-[var(--glass)] text-[var(--text-secondary)] px-2 py-1 rounded border border-border/50 font-mono">{player.position}</span>
                           </td>
                           <td className="p-4">
                               <StatusBadge status={player.status} />
                           </td>
                           <td className="p-4 text-right">
                               {player.loadManagement ? (
                                   <span className={`text-xs font-bold font-mono ${player.loadManagement.acwr > 1.3 ? 'text-red-500' : 'text-emerald-500'}`}>
                                       {player.loadManagement.acwr}
                                   </span>
                               ) : <span className="text-xs text-[var(--text-secondary)]">-</span>}
                           </td>
                           <td className="p-4 text-right font-mono text-sm text-[var(--text-secondary)]">{player.minutesPlayed}'</td>
                           <td className="p-4 text-center">
                               <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-primary hover:bg-[var(--glass)] transition-all opacity-0 group-hover:opacity-100">
                                   <ArrowUpRight size={16} />
                               </button>
                           </td>
                       </motion.tr>
                   ))}
               </tbody>
           </table>
       </div>

       {/* Player Detail Slide-over */}
       <AnimatePresence>
           {selectedPlayer && (
               <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedPlayer(null)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]" 
                />
                <PlayerDetailPanel player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
               </>
           )}
       </AnimatePresence>
    </div>
  );
};

export default Roster;
