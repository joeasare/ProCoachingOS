import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, Clock, MapPin, Shield, Zap, Flag, Activity, Users, ArrowRightLeft, AlertOctagon, MessageSquare, Trophy, Rewind, FastForward, Image as ImageIcon, Video, Upload, Plus, X } from 'lucide-react';
import TacticalField from './TacticalField';
import { FullMatchData } from '../types';
import { mockSessions } from './Schedule';

// --- MOCK DATA FOR SIMULATION (Maryland vs Rutgers) ---
// This serves as the base event data template.
const BASE_MATCH_DATA: FullMatchData = {
  id: 'template', 
  opponent: 'Rutgers',
  date: '2025-10-26',
  venue: 'Ludwig Field',
  lineups: {
    home: {
      formation: '4-3-3 Attack',
      players: [
        { num: 7, name: 'Luckey', pos: 'GK' },
        { num: 6, name: 'Abramson', pos: 'DEF' }, { num: 13, name: 'DeMartino', pos: 'DEF' }, { num: 23, name: 'Turnage', pos: 'DEF' }, { num: 28, name: 'Bulava', pos: 'DEF' },
        { num: 22, name: 'McIntyre', pos: 'MID' }, { num: 20, name: 'Davitian', pos: 'MID' }, { num: 8, name: 'Lenhard', pos: 'MID' },
        { num: 14, name: 'Smith', pos: 'FWD' }, { num: 2, name: 'Morales', pos: 'FWD' }, { num: 47, name: 'Egeland', pos: 'FWD' }
      ]
    },
    away: {
      formation: '4-4-2 Flat',
      players: [
        { num: 1, name: 'Bodmer', pos: 'GK' },
        { num: 3, name: 'Mason', pos: 'DEF' }, { num: 5, name: 'Flanagan', pos: 'DEF' }, { num: 15, name: 'Banks', pos: 'DEF' }, { num: 9, name: 'Lynch', pos: 'DEF' },
        { num: 2, name: 'Kroeger', pos: 'MID' }, { num: 8, name: 'Daigle', pos: 'MID' }, { num: 12, name: 'Schoppe', pos: 'MID' }, { num: 10, name: 'Girman', pos: 'MID' },
        { num: 73, name: 'Tiernan', pos: 'FWD' }, { num: 35, name: 'Lowrey', pos: 'FWD' }
      ]
    }
  },
  finalStats: {
    possession: [48, 52],
    shots: [12, 14],
    shotsOnTarget: [4, 6],
    corners: [5, 7],
    fouls: [9, 11],
    yellowCards: [1, 2],
    redCards: [0, 0]
  },
  events: [
    { id: '0', minute: 0, type: 'whistle', team: 'neutral', description: 'Kick-off! Electric atmosphere for this Big Ten clash.', score: [0, 0] },
    { id: '1', minute: 5, type: 'commentary', team: 'home', description: 'Maryland starting on the front foot, controlling possession in the midfield.', score: [0, 0] },
    { id: '2', minute: 12, type: 'shot', team: 'away', player: 'Tiernan', description: 'Tiernan breaks free down the left, fires a shot! Just wide of the post.', score: [0, 0] },
    { id: '3', minute: 18, type: 'foul', team: 'home', player: 'McIntyre', description: 'Tactical foul by McIntyre to stop the counter.', score: [0, 0] },
    { id: '4', minute: 24, type: 'save', team: 'home', player: 'Luckey', description: 'HUGE SAVE! Luckey dives top right to deny a header from a corner.', isKeyMoment: true, score: [0, 0] },
    { id: '5', minute: 31, type: 'shot', team: 'home', player: 'Smith', description: 'Smith cuts inside, unleashes a strike... saved by Bodmer.', score: [0, 0] },
    { id: '6', minute: 42, type: 'card', team: 'away', player: 'Mason', description: 'Yellow card for Mason after a late challenge on Morales.', score: [0, 0] },
    { id: '7', minute: 45, type: 'whistle', team: 'neutral', description: 'Half Time. A tactical battle, both defenses holding strong.', score: [0, 0] },
    { id: '8', minute: 55, type: 'commentary', team: 'away', description: 'Opponent increasing the pressure now, pressing higher up the pitch.', score: [0, 0] },
    { id: '9', minute: 62, type: 'shot', team: 'away', player: 'Lowrey', description: 'Lowrey hits the crossbar! Maryland survives a scare.', isKeyMoment: true, score: [0, 0] },
    { id: '10', minute: 68, type: 'sub', team: 'home', description: 'Substitution: McIntyre OFF, Winer ON.', score: [0, 0] },
    { id: '11', minute: 75, type: 'save', team: 'home', player: 'Luckey', description: 'Luckey again! Reflex save from point-blank range.', isKeyMoment: true, score: [0, 0] },
    { id: '12', minute: 82, type: 'shot', team: 'home', player: 'Morales', description: 'Counter attack! Morales is through... shot blocked at the last second.', score: [0, 0] },
    { id: '13', minute: 88, type: 'card', team: 'home', player: 'Abramson', description: 'Yellow card for time wasting.', score: [0, 0] },
    { id: '14', minute: 90, type: 'whistle', team: 'neutral', description: 'Full Time. A hard-fought battle comes to an end.', score: [0, 0] }
  ]
};

// --- Gallery Types ---
interface MediaItem {
    id: string;
    type: 'image' | 'video';
    url: string;
    caption?: string;
}

const INITIAL_GALLERY: MediaItem[] = [
    { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2693&auto=format&fit=crop', caption: 'Pre-match huddle' },
    { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?q=80&w=2670&auto=format&fit=crop', caption: 'Goal celebration' },
    { id: '3', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-training-on-a-field-4299-large.mp4', caption: 'Key highlight' }, 
];

// --- Helper Components ---

const StatBar = ({ label, home, away, max = 100 }: { label: string, home: number, away: number, max?: number }) => (
    <div className="mb-4">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
            <span>{home}</span>
            <span>{label}</span>
            <span>{away}</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(home / (home + away || 1)) * 100}%` }}
                className="bg-primary"
            />
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(away / (home + away || 1)) * 100}%` }}
                className="bg-neutral-600"
            />
        </div>
    </div>
);

const MatchDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'feed' | 'stats' | 'lineups' | 'gallery'>('feed');
    const [galleryItems, setGalleryItems] = useState<MediaItem[]>(INITIAL_GALLERY);
    
    // Find session data
    const session = useMemo(() => mockSessions.find(s => s.id === id), [id]);

    // Derived Match Data
    const homeTeam = "MARYLAND";
    const awayTeam = session ? session.title.replace(/^(vs |at )/i, '').toUpperCase() : "OPPONENT";
    const venue = session?.location === 'Home' ? "Ludwig Field" : (session?.location || "Away");
    const date = session ? new Date(session.date).toLocaleDateString() : "Match Date";
    
    // Parse result for display
    const [homeScore, awayScore] = useMemo(() => {
        if (!session?.result) return [0, 0];
        const scores = session.result.split(' ')[1].split('-').map(Number);
        const isHome = session.location === 'Home';
        return isHome ? [scores[0], scores[1]] : [scores[1], scores[0]];
    }, [session]);

    // Filter events up to current time & inject team names
    const currentEvents = useMemo(() => {
        return BASE_MATCH_DATA.events.filter(e => e.minute <= currentTime).reverse().map(e => ({
            ...e,
            description: e.description.replace('Rutgers', awayTeam.charAt(0) + awayTeam.slice(1).toLowerCase())
        }));
    }, [currentTime, awayTeam]);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying && currentTime < 90) {
            interval = setInterval(() => {
                setCurrentTime(prev => Math.min(prev + 1, 90));
            }, 200); // Fast replay speed
        } else if (currentTime >= 90) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTime]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = file.type.startsWith('video/') ? 'video' : 'image';
            const newItem: MediaItem = {
                id: Math.random().toString(),
                type,
                url: URL.createObjectURL(file),
                caption: file.name
            };
            setGalleryItems([newItem, ...galleryItems]);
        }
    };

    const removeMedia = (id: string) => {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 pb-20">
            {/* Nav */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-primary mb-6 transition-colors">
                <ChevronLeft size={16} /> Back to Schedule
            </button>

            {/* Match Header / Scoreboard */}
            <div className="glass-panel p-8 rounded-2xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-neutral-800 to-red-900" />
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Home Team */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                        <div className="text-4xl font-bold tracking-tighter text-[var(--text-primary)]">{homeTeam}</div>
                        <div className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mt-1">Terrapins</div>
                    </div>

                    {/* Score & Time */}
                    <div className="flex flex-col items-center mx-8 min-w-[200px]">
                         <div className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-[var(--text-primary)] leading-none tabular-nums">
                             {homeScore} - {awayScore}
                         </div>
                         <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-border">
                             <Clock size={14} className={isPlaying ? "text-primary animate-pulse" : "text-[var(--text-secondary)]"} />
                             <span className="text-lg font-mono font-bold tabular-nums">{currentTime}'</span>
                         </div>
                         <div className="text-[10px] font-mono text-[var(--text-secondary)] mt-2 uppercase tracking-widest">
                             {session?.result?.split(' ')[0] === 'W' ? 'Full Time - Win' : session?.result?.split(' ')[0] === 'L' ? 'Full Time - Loss' : 'Full Time - Draw'}
                         </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
                        <div className="text-4xl font-bold tracking-tighter text-[var(--text-primary)]">{awayTeam}</div>
                        <div className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest mt-1">Visitor</div>
                    </div>
                </div>

                {/* Scrubber / Controls */}
                <div className="mt-10 flex items-center gap-4">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                    
                    <div className="flex-1 relative h-2 bg-neutral-800 rounded-full cursor-pointer group">
                        <input 
                            type="range" 
                            min="0" 
                            max="90" 
                            value={currentTime} 
                            onChange={(e) => { setCurrentTime(parseInt(e.target.value)); setIsPlaying(false); }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div 
                            className="h-full bg-primary rounded-full relative" 
                            style={{ width: `${(currentTime / 90) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                        
                        {/* Event Markers on Timeline */}
                        {BASE_MATCH_DATA.events.filter(e => e.isKeyMoment || e.type === 'goal').map(e => (
                            <div 
                                key={e.id}
                                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white z-0"
                                style={{ left: `${(e.minute / 90) * 100}%` }}
                                title={`${e.minute}': ${e.type}`}
                            />
                        ))}
                    </div>

                    <div className="text-xs font-mono text-[var(--text-secondary)] w-10 text-right">90'</div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { id: 'feed', label: 'Live Feed', icon: Activity },
                    { id: 'stats', label: 'Match Stats', icon: Zap },
                    { id: 'lineups', label: 'Tactics', icon: Users },
                    { id: 'gallery', label: 'Media', icon: ImageIcon },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                            activeTab === tab.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-[var(--glass)] text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode='wait'>
                        {activeTab === 'feed' && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {currentEvents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
                                        <div className="w-16 h-16 rounded-full bg-[var(--glass)] flex items-center justify-center mb-4">
                                            <Activity size={32} className="opacity-50" />
                                        </div>
                                        <p>Match has not started. Press Play.</p>
                                    </div>
                                ) : (
                                    currentEvents.map((event) => {
                                        const isGoal = event.type === 'goal';
                                        const isSave = event.type === 'save';
                                        const isCard = event.type === 'card';
                                        const isRedCard = isCard && event.description.toLowerCase().includes('red');
                                        const isSub = event.type === 'sub';
                                        const isWhistle = event.type === 'whistle';
                                        
                                        // Styling Logic
                                        let cardClass = 'bg-[var(--glass)] border-border hover:border-border/80';
                                        if (isGoal) cardClass = 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]';
                                        else if (isRedCard) cardClass = 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
                                        else if (isCard) cardClass = 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)]';
                                        else if (isSave) cardClass = 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]';
                                        else if (event.isKeyMoment) cardClass = 'bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(225,29,72,0.15)]';
                                        else if (isSub) cardClass = 'bg-blue-500/5 border-blue-500/20';
                                        else if (isWhistle) cardClass = 'bg-white/5 border-white/10';

                                        return (
                                            <motion.div 
                                                key={event.id}
                                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                layout
                                                className={`p-5 rounded-xl border relative overflow-hidden transition-all duration-300 ${cardClass}`}
                                            >
                                                {/* Event specific background decoration */}
                                                {event.isKeyMoment && !isGoal && !isCard && !isSave && (
                                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
                                                )}
                                                {isGoal && (
                                                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
                                                )}

                                                <div className="flex gap-4 items-start relative z-10">
                                                    {/* Time & Icon Column */}
                                                    <div className="flex flex-col items-center min-w-[50px] gap-2">
                                                        <span className={`text-sm font-bold font-mono ${event.isKeyMoment ? 'text-primary' : 'text-[var(--text-secondary)]'}`}>
                                                            {event.minute}'
                                                        </span>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                                            isGoal ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
                                                            isSave ? 'bg-indigo-500/20 border-indigo-500 text-indigo-500' :
                                                            isRedCard ? 'bg-red-500/20 border-red-500 text-red-500' :
                                                            isCard ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' :
                                                            event.isKeyMoment ? 'bg-primary/20 border-primary text-primary' :
                                                            'bg-[var(--surface)] border-border text-[var(--text-secondary)]'
                                                        }`}>
                                                            {event.type === 'goal' && <Trophy size={14} />}
                                                            {event.type === 'save' && <Shield size={14} />}
                                                            {event.type === 'shot' && <Zap size={14} />}
                                                            {event.type === 'card' && <div className={`w-2.5 h-3.5 rounded-sm ${isRedCard ? 'bg-red-500' : 'bg-yellow-500'}`} />}
                                                            {event.type === 'sub' && <ArrowRightLeft size={14} />}
                                                            {event.type === 'whistle' && <Flag size={14} />}
                                                            {event.type === 'foul' && <AlertOctagon size={14} />}
                                                            {event.type === 'commentary' && <MessageSquare size={14} />}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Content Column */}
                                                    <div className="flex-1 pt-0.5">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className={`text-xs font-bold uppercase tracking-widest ${
                                                                event.team === 'home' ? 'text-primary' : 
                                                                event.team === 'away' ? 'text-red-900' : 
                                                                'text-[var(--text-secondary)]'
                                                            }`}>
                                                                {event.team === 'home' ? 'Maryland' : event.team === 'away' ? awayTeam : 'Official'}
                                                            </span>
                                                            {event.player && (
                                                                <>
                                                                    <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]/30" />
                                                                    <span className="text-xs font-bold text-[var(--text-primary)]">{event.player}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <p className={`text-sm leading-relaxed ${event.isKeyMoment ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-primary)]/80'}`}>
                                                            {event.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'stats' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-panel p-8 rounded-xl"
                            >
                                <h3 className="text-lg font-bold mb-6 text-center">Live Statistics</h3>
                                <StatBar label="Possession %" home={BASE_MATCH_DATA.finalStats.possession[0]} away={BASE_MATCH_DATA.finalStats.possession[1]} />
                                <StatBar label="Total Shots" home={BASE_MATCH_DATA.finalStats.shots[0]} away={BASE_MATCH_DATA.finalStats.shots[1]} />
                                <StatBar label="Shots on Target" home={BASE_MATCH_DATA.finalStats.shotsOnTarget[0]} away={BASE_MATCH_DATA.finalStats.shotsOnTarget[1]} />
                                <StatBar label="Corners" home={BASE_MATCH_DATA.finalStats.corners[0]} away={BASE_MATCH_DATA.finalStats.corners[1]} />
                                <StatBar label="Fouls Committed" home={BASE_MATCH_DATA.finalStats.fouls[0]} away={BASE_MATCH_DATA.finalStats.fouls[1]} />
                            </motion.div>
                        )}

                        {activeTab === 'lineups' && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[500px] glass-panel rounded-xl overflow-hidden relative border border-white/5"
                            >
                                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-white">
                                    Formation: {BASE_MATCH_DATA.lineups.home.formation} vs {BASE_MATCH_DATA.lineups.away.formation}
                                </div>
                                <TacticalField preview={true} />
                            </motion.div>
                        )}

                        {activeTab === 'gallery' && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-panel p-6 rounded-xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                     <h3 className="text-lg font-bold">Match Media</h3>
                                     <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                                        <Upload size={16} />
                                        <span className="text-xs font-bold uppercase">Upload</span>
                                        <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                                     </label>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {galleryItems.map(item => (
                                        <div key={item.id} className="aspect-[4/5] relative group rounded-lg overflow-hidden bg-black/50 border border-white/10 shadow-lg">
                                            {item.type === 'image' ? (
                                                <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            ) : (
                                                <video 
                                                    src={item.url} 
                                                    className="w-full h-full object-cover" 
                                                    controls={false} 
                                                    muted 
                                                    loop 
                                                    onMouseOver={e => e.currentTarget.play()} 
                                                    onMouseOut={e => e.currentTarget.pause()} 
                                                />
                                            )}
                                            
                                            <button 
                                                onClick={() => removeMedia(item.id)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            >
                                                <X size={12} />
                                            </button>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium text-white truncate max-w-[80%]">{item.caption || 'Untitled'}</span>
                                                    {item.type === 'video' ? <Video size={14} className="text-primary" /> : <ImageIcon size={14} className="text-white/70" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Empty State / Dropzone visual */}
                                     <label className="aspect-[4/5] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-primary hover:border-primary/50 transition-colors cursor-pointer bg-[var(--glass)] group">
                                        <div className="w-12 h-12 rounded-full bg-[var(--surface)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus size={24} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider">Add Media</span>
                                        <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                                     </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Match Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-[var(--text-secondary)]" />
                                <div>
                                    <div className="text-sm font-bold">{venue}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">{session?.location === 'Away' ? awayTeam + ' Stadium' : 'College Park, MD'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-[var(--text-secondary)]" />
                                <div>
                                    <div className="text-sm font-bold">{date}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">{session?.startTime} Kickoff</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Form Guide</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold">Maryland</span>
                                <div className="flex gap-1">
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-green-500/20 text-green-500 text-[10px] font-bold">W</span>
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-green-500/20 text-green-500 text-[10px] font-bold">W</span>
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-red-500/20 text-red-500 text-[10px] font-bold">L</span>
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-neutral-500/20 text-neutral-500 text-[10px] font-bold">D</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold truncate max-w-[80px]">{awayTeam}</span>
                                <div className="flex gap-1">
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-green-500/20 text-green-500 text-[10px] font-bold">W</span>
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-green-500/20 text-green-500 text-[10px] font-bold">W</span>
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-green-500/20 text-green-500 text-[10px] font-bold">W</span>
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-green-500/20 text-green-500 text-[10px] font-bold">W</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchDetail;