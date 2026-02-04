
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, Star, MapPin, GraduationCap, Clock, ChevronRight, UserPlus, PlayCircle, X, CheckCircle2, Phone, FileText, BellRing, Sliders, Zap, Loader2, RefreshCw, Scale, PenLine, Save, Wifi, Calendar, MessageCircle, Send, CheckSquare, UserCheck, MoreHorizontal, Heart, Share, Repeat2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useToast } from '../context/ToastContext';

// --- Types ---

type RecruitmentStage = 'Identified' | 'Contacted' | 'Evaluation' | 'Visit' | 'Offer' | 'Signed' | 'Closed';

interface TransferTarget {
    id: string;
    name: string;
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    previousSchool: string;
    conference: string;
    eligibilityYears: number;
    gpa: number;
    rating: number; // 1-5 stars
    stats: {
        matches: number;
        minutes: number;
        goals: number;
        assists: number;
    };
    tags: string[]; // e.g., "Grad Transfer", "All-Conference"
    avatar: string;
    status: 'Available' | 'Committed' | 'Pending';
    highlightUrl?: string;
    sourceUrl?: string; // For AI found items
    scoutingReport?: string; // AI Summary
    notes?: string; // Editable notes
    postedDate?: string; // New field for sorting
    recruitmentStage?: RecruitmentStage; // New field for strategy
}

interface ScoutCriteria {
    minGoals: number;
    positions: string[];
    minRating: number;
    accolades: boolean; // Requires All-Conference/All-American
}

const TransferPortal: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPos, setFilterPos] = useState('All');
    const [selectedAthlete, setSelectedAthlete] = useState<TransferTarget | null>(null);
    const [shortlist, setShortlist] = useState<string[]>([]);
    const { addToast } = useToast();

    // Robustness Features
    const [isComparing, setIsComparing] = useState(false);
    const [localNotes, setLocalNotes] = useState('');
    const [isEditingNotes, setIsEditingNotes] = useState(false);

    // Smart Scout State
    const [isScanning, setIsScanning] = useState(false);
    const [showScoutConfig, setShowScoutConfig] = useState(false);
    const [scoutCriteria, setScoutCriteria] = useState<ScoutCriteria>({
        minGoals: 5,
        positions: ['FWD', 'MID'],
        minRating: 4,
        accolades: true
    });
    const [aiResults, setAiResults] = useState<TransferTarget[]>([]);
    const [groundingMetadata, setGroundingMetadata] = useState<any>(null);

    // AI Logic
    const handleSmartScan = async () => {
        setIsScanning(true);
        setShowScoutConfig(false);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                Act as a specialized, real-time sports data aggregator for NCAA Women's Soccer.
                Search for the most recent transfer activity for the 2025/2026 cycle.
                Prioritize news from Twitter/X, TopDrawerSoccer, and SoccerWire.
                
                CRITICAL INSTRUCTION: Sort findings by DATE POSTED (Newest First).
                
                Filters:
                - Position: ${scoutCriteria.positions.join(' or ')}
                - Performance: ${scoutCriteria.minGoals > 0 ? `Scored > ${scoutCriteria.minGoals} goals` : 'Any'}
                - Accolades: ${scoutCriteria.accolades ? 'All-Conference, All-American' : 'Any'}

                Extract structured data:
                1. Name
                2. Position (GK, DEF, MID, FWD)
                3. Previous School
                4. New School (if committed)
                5. Class/Year
                6. Short Bio/Headline (e.g. "Former U17 National Team standout enters portal")
                7. Date of Post (YYYY-MM-DD)
                8. Source URL

                Output strictly as a JSON array of objects. 
                Keys: "name", "position", "previousSchool", "incomingSchool", "classYear", "details", "date", "sourceUrl".
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });

            if (response.candidates?.[0]?.groundingMetadata) {
                setGroundingMetadata(response.candidates[0].groundingMetadata);
            }

            const text = response.text || '';
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            try {
                const parsed = JSON.parse(cleanedText);
                
                const newTargets: TransferTarget[] = parsed.map((p: any, i: number) => {
                    const isCommitted = p.incomingSchool && p.incomingSchool !== 'Uncommitted' && p.incomingSchool !== 'Available';
                    
                    return {
                        id: `ai-${Date.now()}-${i}`,
                        name: p.name || 'Unknown Athlete',
                        position: (p.position && ['GK','DEF','MID','FWD'].includes(p.position)) ? p.position : 'MID',
                        previousSchool: p.previousSchool || 'NCAA D1',
                        conference: 'Transfer Portal',
                        eligibilityYears: p.classYear?.toLowerCase().includes('grad') ? 1 : 2,
                        gpa: 3.5, 
                        rating: 4,
                        stats: { 
                            matches: 0, 
                            minutes: 0, 
                            goals: parseInt(p.details?.match(/(\d+) goal/)?.[1] || '0'), 
                            assists: parseInt(p.details?.match(/(\d+) assist/)?.[1] || '0') 
                        },
                        tags: [
                            isCommitted ? `Committed: ${p.incomingSchool}` : 'Available',
                            p.classYear || 'Transfer'
                        ].filter(Boolean),
                        avatar: `https://ui-avatars.com/api/?name=${p.name}&background=random&color=fff&bold=true`,
                        status: isCommitted ? 'Committed' : 'Available',
                        sourceUrl: p.sourceUrl,
                        scoutingReport: p.details || `Transfer entry from ${p.previousSchool}.`,
                        postedDate: p.date,
                        recruitmentStage: 'Identified'
                    };
                });

                newTargets.sort((a: TransferTarget, b: TransferTarget) => {
                    const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
                    const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
                    return dateB - dateA;
                });

                setAiResults(newTargets); 
                addToast(`Live Feed: Found ${newTargets.length} updated targets`, 'success');

            } catch (e) {
                console.error("JSON Parse failed", e);
                addToast("Smart Scout completed scan but found unstructured data.", 'info');
            }

        } catch (error) {
            console.error(error);
            addToast("Smart Scout scan failed. Check connection.", 'error');
        } finally {
            setIsScanning(false);
        }
    };

    const toggleShortlist = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (shortlist.includes(id)) {
            setShortlist(prev => prev.filter(i => i !== id));
            addToast('Removed from shortlist', 'info');
        } else {
            setShortlist(prev => [...prev, id]);
            addToast('Added to saved scouts', 'success');
        }
    };

    const updateStage = (stage: RecruitmentStage) => {
        if (selectedAthlete) {
            setAiResults(prev => prev.map(p => p.id === selectedAthlete.id ? { ...p, recruitmentStage: stage } : p));
            setSelectedAthlete(prev => prev ? { ...prev, recruitmentStage: stage } : null);
            addToast(`Stage updated to: ${stage}`, 'success');
        }
    };

    const allTargets = [...aiResults];

    const filteredTargets = allTargets.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.previousSchool.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterPos === 'Saved') {
            return matchesSearch && shortlist.includes(t.id);
        }

        const matchesPos = filterPos === 'All' || t.position === filterPos;
        return matchesSearch && matchesPos;
    });

    const shortlistedPlayers = allTargets.filter(p => shortlist.includes(p.id));

    const handleSaveNotes = () => {
        if (selectedAthlete) {
            selectedAthlete.notes = localNotes;
            setIsEditingNotes(false);
            addToast("Scouting notes updated.", 'success');
        }
    };

    const openDetail = (athlete: TransferTarget) => {
        setSelectedAthlete(athlete);
        setLocalNotes(athlete.notes || '');
        setIsEditingNotes(false);
    };

    const STAGES: RecruitmentStage[] = ['Identified', 'Contacted', 'Evaluation', 'Visit', 'Offer', 'Signed'];

    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            {/* Main Feed Column */}
            <div className="flex-1 max-w-2xl mx-auto border-x border-border min-h-screen relative">
                
                {/* Sticky Header */}
                <div className="sticky top-0 z-30 bg-[var(--background)]/90 backdrop-blur-md border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-[var(--text-primary)]">Transfer Wire</h1>
                        <button 
                            onClick={() => setShowScoutConfig(true)}
                            className="p-2 hover:bg-[var(--glass)] rounded-full text-primary transition-colors"
                        >
                            <Sliders size={20} />
                        </button>
                    </div>
                    
                    {/* Search & Tabs */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search athletes, schools..." 
                                className="w-full bg-[var(--surface)] border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {['All', 'FWD', 'MID', 'DEF', 'GK', 'Saved'].map((pos) => (
                                <button
                                    key={pos}
                                    onClick={() => setFilterPos(pos)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                        filterPos === pos
                                        ? 'bg-primary text-white' 
                                        : 'bg-[var(--surface)] border border-border text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    {pos === 'Saved' && <CheckCircle2 size={12} className="inline mr-1" />}
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed Content */}
                <div className="divide-y divide-border">
                    {/* Smart Scout Config Expansion */}
                    <AnimatePresence>
                        {showScoutConfig && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-[var(--surface)] overflow-hidden border-b border-border"
                            >
                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"><Zap size={14} className="text-primary"/> AI Parameters</h3>
                                        <button onClick={() => setShowScoutConfig(false)}><X size={16} className="text-[var(--text-secondary)]"/></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-2">Target Roles</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['FWD', 'MID', 'DEF', 'GK'].map(pos => (
                                                    <button
                                                        key={pos}
                                                        onClick={() => setScoutCriteria(prev => ({...prev, positions: prev.positions.includes(pos) ? prev.positions.filter(p=>p!==pos) : [...prev.positions,pos]}))}
                                                        className={`px-2 py-1 rounded text-[10px] font-bold border ${scoutCriteria.positions.includes(pos) ? 'bg-primary text-white border-primary' : 'border-border text-[var(--text-secondary)]'}`}
                                                    >
                                                        {pos}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-2">Min. Goals: {scoutCriteria.minGoals}</label>
                                            <input type="range" min="0" max="20" value={scoutCriteria.minGoals} onChange={(e) => setScoutCriteria({...scoutCriteria, minGoals: parseInt(e.target.value)})} className="w-full accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer"/>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSmartScan}
                                        disabled={isScanning}
                                        className="w-full py-2 bg-primary text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        {isScanning ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                        Run Smart Scan
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty / Loading States */}
                    {allTargets.length === 0 && !isScanning && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                                <Globe size={24} className="text-[var(--text-secondary)]" />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Feed Empty</h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6">Initialize the Smart Scout to aggregate real-time transfer data.</p>
                            <button onClick={handleSmartScan} className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm">Start Scanning</button>
                        </div>
                    )}

                    {isScanning && allTargets.length === 0 && (
                        <div className="p-8 text-center space-y-4">
                            <Loader2 size={32} className="animate-spin text-primary mx-auto" />
                            <p className="text-sm text-[var(--text-secondary)] animate-pulse">Analyzing social media streams...</p>
                        </div>
                    )}

                    {/* Feed Items */}
                    {filteredTargets.map((athlete) => (
                        <motion.div 
                            key={athlete.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 hover:bg-[var(--surface)] transition-colors cursor-pointer group"
                            onClick={() => openDetail(athlete)}
                        >
                            <div className="flex gap-4">
                                {/* Avatar Column */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-neutral-800">
                                        <img src={athlete.avatar} alt={athlete.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-[var(--text-primary)] hover:underline">{athlete.name}</h3>
                                                <span className="text-[var(--text-secondary)] text-sm">@{athlete.previousSchool.replace(/\s+/g, '')}</span>
                                                <span className="text-[var(--text-secondary)] text-xs">• {athlete.postedDate || 'Just now'}</span>
                                            </div>
                                            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mt-0.5 mb-2 flex items-center gap-2">
                                                <span className={`font-bold ${athlete.position === 'FWD' ? 'text-blue-500' : 'text-emerald-500'}`}>{athlete.position}</span>
                                                <span>•</span>
                                                <span>{athlete.eligibilityYears}Y Eligibility</span>
                                            </div>
                                        </div>
                                        <button className="text-[var(--text-secondary)] hover:text-primary p-1">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>

                                    <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-3">
                                        {athlete.scoutingReport}
                                    </p>

                                    {/* Stats Card Embedded */}
                                    <div className="bg-[var(--glass)] border border-border rounded-xl p-3 mb-3 flex justify-between items-center max-w-sm">
                                        <div className="text-center px-2">
                                            <span className="block font-bold text-lg">{athlete.stats.matches}</span>
                                            <span className="text-[10px] text-[var(--text-secondary)] uppercase">Games</span>
                                        </div>
                                        <div className="w-px h-8 bg-border" />
                                        <div className="text-center px-2">
                                            <span className="block font-bold text-lg">{athlete.stats.goals}</span>
                                            <span className="text-[10px] text-[var(--text-secondary)] uppercase">Goals</span>
                                        </div>
                                        <div className="w-px h-8 bg-border" />
                                        <div className="text-center px-2">
                                            <span className="block font-bold text-lg">{athlete.stats.assists}</span>
                                            <span className="text-[10px] text-[var(--text-secondary)] uppercase">Assists</span>
                                        </div>
                                        <div className="text-right pl-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${athlete.status === 'Committed' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                                {athlete.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex items-center justify-between max-w-md mt-2 text-[var(--text-secondary)]">
                                        <button className="flex items-center gap-1.5 text-xs hover:text-blue-500 transition-colors group/btn">
                                            <MessageCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            <span>Reply</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs hover:text-green-500 transition-colors group/btn">
                                            <Repeat2 size={16} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                                            <span>Repost</span>
                                        </button>
                                        <button 
                                            onClick={(e) => toggleShortlist(athlete.id, e)}
                                            className={`flex items-center gap-1.5 text-xs transition-colors group/btn ${shortlist.includes(athlete.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                                        >
                                            <Heart size={16} className={`group-hover/btn:scale-110 transition-transform ${shortlist.includes(athlete.id) ? 'fill-current' : ''}`} />
                                            <span>Save</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors group/btn">
                                            <Share size={16} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar - Info/Shortlist (Hidden on mobile) */}
            <div className="hidden xl:block w-80 sticky top-0 h-screen overflow-y-auto p-6 border-l border-border">
                {shortlist.length > 0 ? (
                    <div>
                        <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Star size={16} className="text-primary" /> Saved Prospects
                        </h2>
                        <div className="space-y-3">
                            {shortlistedPlayers.map(p => (
                                <div key={p.id} onClick={() => openDetail(p)} className="p-3 bg-[var(--surface)] border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-all flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800">
                                        <img src={p.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">{p.name}</h4>
                                        <p className="text-xs text-[var(--text-secondary)] truncate">{p.position} • {p.previousSchool}</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setIsComparing(true)} className="w-full mt-4 py-2 border border-border rounded-lg text-xs font-bold hover:bg-[var(--surface)] transition-colors">
                            Compare All ({shortlist.length})
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10 text-[var(--text-secondary)] opacity-60">
                        <UserCheck size={48} className="mx-auto mb-2" strokeWidth={1} />
                        <p className="text-sm">Shortlist is empty.</p>
                    </div>
                )}

                <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3">Trending Schools</h3>
                    <div className="flex flex-wrap gap-2">
                        {['UCLA', 'Stanford', 'UNC', 'Florida St', 'Penn St'].map(s => (
                            <span key={s} className="px-3 py-1 bg-[var(--surface)] rounded-full text-xs text-[var(--text-primary)] hover:bg-[var(--glass-hover)] cursor-pointer">#{s}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detail Slide-Over (Same as before but adjusted z-index for new layout) */}
            <AnimatePresence>
                {selectedAthlete && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAthlete(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" 
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-full md:w-[600px] bg-[var(--surface)] border-l border-border z-[70] shadow-2xl overflow-y-auto"
                        >
                            {/* Panel Header */}
                            <div className="relative h-64 bg-neutral-900">
                                <img src={selectedAthlete.avatar} alt={selectedAthlete.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-black/40 to-transparent" />
                                
                                <button 
                                    onClick={() => setSelectedAthlete(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-black/40 backdrop-blur hover:bg-white/10 text-white transition-colors border border-white/10"
                                >
                                    <X size={20} />
                                </button>

                                <div className="absolute bottom-6 left-8 right-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 ${selectedAthlete.status === 'Committed' ? 'bg-red-500' : 'bg-primary'} text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg`}>
                                            {selectedAthlete.status === 'Committed' ? 'Transfer Committed' : 'Transfer Target'}
                                        </span>
                                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur px-2 py-1 rounded border border-white/10">
                                            <MapPin size={10} className="text-white" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{selectedAthlete.previousSchool}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-bold text-white leading-none tracking-tight">{selectedAthlete.name}</h2>
                                    <div className="flex gap-4 mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-emerald-400" />
                                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">{selectedAthlete.eligibilityYears} Years Eligibility</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-[var(--glass)] border border-border text-[var(--text-primary)] font-bold rounded-lg hover:bg-[var(--glass-hover)] transition-all flex items-center justify-center gap-2">
                                        <PlayCircle size={16} /> View Tape
                                    </button>
                                    <button 
                                        onClick={() => toggleShortlist(selectedAthlete.id)}
                                        className={`flex-1 py-3 border font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                                            shortlist.includes(selectedAthlete.id) 
                                            ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' 
                                            : 'bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-lg shadow-primary/20'
                                        }`}
                                    >
                                        {shortlist.includes(selectedAthlete.id) ? (
                                            <><CheckSquare size={16} /> Saved</>
                                        ) : (
                                            <><UserCheck size={16} /> Save Scout</>
                                        )}
                                    </button>
                                </div>

                                {/* Recruitment Strategy Section */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2 mb-3">
                                        <Send size={14} /> Contact Strategy
                                    </h3>
                                    <div className="bg-[var(--glass)] rounded-xl border border-border p-4">
                                        {/* Stages */}
                                        <div className="flex justify-between items-center relative mb-6 px-2">
                                            {/* Progress Line */}
                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--border)] -z-10" />
                                            
                                            {STAGES.map((stage, i) => {
                                                const currentStageIdx = STAGES.indexOf(selectedAthlete.recruitmentStage || 'Identified');
                                                const isCompleted = i <= currentStageIdx;
                                                const isCurrent = i === currentStageIdx;

                                                return (
                                                    <div key={stage} className="flex flex-col items-center gap-1 group relative">
                                                        <button
                                                            onClick={() => updateStage(stage)}
                                                            className={`w-3 h-3 rounded-full border-2 transition-all ${
                                                                isCompleted ? 'bg-primary border-primary' : 'bg-[var(--surface)] border-[var(--text-secondary)]'
                                                            } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-[var(--surface)]' : ''}`}
                                                        />
                                                        <span className={`absolute -bottom-5 text-[8px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                                            isCurrent ? 'text-primary' : 'text-[var(--text-secondary)] opacity-0 group-hover:opacity-100'
                                                        }`}>
                                                            {stage}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-[var(--surface)] border border-border rounded-lg text-xs font-bold text-[var(--text-primary)] hover:border-primary/50 flex items-center justify-center gap-2 transition-colors">
                                                <MessageCircle size={14} /> DM Player
                                            </button>
                                            <button className="flex-1 py-2 bg-[var(--surface)] border border-border rounded-lg text-xs font-bold text-[var(--text-primary)] hover:border-primary/50 flex items-center justify-center gap-2 transition-colors">
                                                <Phone size={14} /> Call Agent
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Overview */}
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: 'Matches', val: selectedAthlete.stats.matches },
                                        { label: 'Minutes', val: selectedAthlete.stats.minutes },
                                        { label: 'Goals', val: selectedAthlete.stats.goals },
                                        { label: 'Assists', val: selectedAthlete.stats.assists },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[var(--glass)] p-3 rounded-xl border border-border text-center">
                                            <div className="text-xl font-bold text-[var(--text-primary)] font-mono">{stat.val}</div>
                                            <div className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Academic & Bio */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                                        <GraduationCap size={14} /> Academic & Bio
                                    </h3>
                                    <div className="bg-[var(--glass)] rounded-xl border border-border overflow-hidden">
                                        <div className="flex justify-between items-center p-4 border-b border-border/50">
                                            <span className="text-sm text-[var(--text-secondary)]">Current GPA</span>
                                            <span className="text-sm font-bold text-[var(--text-primary)]">{selectedAthlete.gpa}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 border-b border-border/50">
                                            <span className="text-sm text-[var(--text-secondary)]">Major</span>
                                            <span className="text-sm font-bold text-[var(--text-primary)]">Kinesiology</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4">
                                            <span className="text-sm text-[var(--text-secondary)]">Hometown</span>
                                            <span className="text-sm font-bold text-[var(--text-primary)]">San Diego, CA</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Scouting Report & Notes */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2 mb-3">
                                            <FileText size={14} /> Scouting Report
                                        </h3>
                                        <div className="bg-[var(--glass)] p-5 rounded-xl border border-border">
                                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                                                {selectedAthlete.scoutingReport || "No scouting report available for this player."}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {selectedAthlete.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-[var(--surface)] border border-border rounded text-[10px] font-bold uppercase text-[var(--text-secondary)]">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Editable Notes Section */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                                                <PenLine size={14} /> Coaching Notes
                                            </h3>
                                            {!isEditingNotes ? (
                                                <button onClick={() => setIsEditingNotes(true)} className="text-[10px] font-bold uppercase text-primary hover:underline">Edit</button>
                                            ) : (
                                                <button onClick={handleSaveNotes} className="text-[10px] font-bold uppercase text-emerald-500 hover:underline flex items-center gap-1">
                                                    <Save size={10} /> Save
                                                </button>
                                            )}
                                        </div>
                                        {isEditingNotes ? (
                                            <textarea 
                                                className="w-full bg-[var(--surface)] border border-primary/50 rounded-xl p-4 text-sm text-[var(--text-primary)] min-h-[100px] focus:outline-none focus:ring-1 focus:ring-primary"
                                                value={localNotes}
                                                onChange={(e) => setLocalNotes(e.target.value)}
                                                placeholder="Add internal notes about this recruit..."
                                            />
                                        ) : (
                                            <div className="bg-[var(--glass)] p-5 rounded-xl border border-border min-h-[80px]">
                                                {localNotes ? (
                                                    <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{localNotes}</p>
                                                ) : (
                                                    <p className="text-sm text-[var(--text-secondary)] italic">No notes added.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <Globe size={14} className="text-[var(--text-secondary)]" />
                                        <span className="text-xs text-[var(--text-secondary)]">Source: {selectedAthlete.sourceUrl ? 'Google Grounding' : 'Internal Database'}</span>
                                    </div>
                                    {selectedAthlete.sourceUrl && (
                                        <a href={selectedAthlete.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline">
                                            View Source
                                        </a>
                                    )}
                                </div>
                                
                                {groundingMetadata && (
                                    <div className="mt-4 p-4 bg-[var(--surface)] rounded-lg border border-border text-[10px]">
                                        <h4 className="font-bold mb-2">Search Sources</h4>
                                        {groundingMetadata.groundingChunks?.map((chunk: any, i: number) => (
                                            <div key={i} className="mb-1">
                                                {chunk.web?.uri && <a href={chunk.web.uri} target="_blank" className="text-blue-500 hover:underline">{chunk.web.title}</a>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            {/* Comparison Modal (kept mostly same) */}
            <AnimatePresence>
                {isComparing && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsComparing(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[var(--surface)] border border-border rounded-2xl w-full max-w-5xl h-[80vh] relative z-10 flex flex-col overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center bg-[var(--glass)]">
                                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <Scale size={20} /> Candidate Comparison
                                </h2>
                                <button onClick={() => setIsComparing(false)} className="p-2 hover:bg-[var(--glass-hover)] rounded-full text-[var(--text-secondary)]">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-x-auto">
                                <div className="flex h-full min-w-max">
                                    {shortlistedPlayers.map(p => (
                                        <div key={p.id} className="w-72 border-r border-border p-6 flex flex-col gap-6 hover:bg-[var(--glass-hover)] transition-colors">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary mb-3">
                                                    <img src={p.avatar} className="w-full h-full object-cover" />
                                                </div>
                                                <h3 className="font-bold text-lg text-[var(--text-primary)]">{p.name}</h3>
                                                <span className="text-xs text-[var(--text-secondary)] uppercase">{p.position} • {p.previousSchool}</span>
                                            </div>
                                            {/* ... comparison details ... */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TransferPortal;
