import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, GripVertical, Trash2, Save, Plus, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Drill, DrillCategory, DrillDifficulty } from '../types';

// Simplified mock drills for the planner picker
const AVAILABLE_DRILLS: Drill[] = [
    { id: '1', title: 'Warm-up: Rondo', category: 'Technical', duration: 15, minPlayers: 10, difficulty: 'Easy', image: '' },
    { id: '2', title: 'Possession: 4v4+3', category: 'Tactical', duration: 20, minPlayers: 11, difficulty: 'Medium', image: '' },
    { id: '3', title: 'Pattern Play: Crossing', category: 'Technical', duration: 15, minPlayers: 14, difficulty: 'Medium', image: '' },
    { id: '4', title: 'Phase of Play: Build-up', category: 'Tactical', duration: 25, minPlayers: 22, difficulty: 'Hard', image: '' },
    { id: '5', title: 'Small Sided Game', category: 'Physical', duration: 20, minPlayers: 10, difficulty: 'Hard', image: '' },
    { id: '6', title: 'Cool Down', category: 'Physical', duration: 10, minPlayers: 1, difficulty: 'Easy', image: '' },
];

const PracticePlanner: React.FC = () => {
    const [plan, setPlan] = useState<Drill[]>([]);
    const [sessionTitle, setSessionTitle] = useState('Match Prep: High Press');
    
    // Custom Activity State
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [customActivity, setCustomActivity] = useState({
        title: '',
        duration: 10,
        category: 'Technical' as DrillCategory,
        minPlayers: 11
    });

    const addToPlan = (drill: Drill) => {
        setPlan([...plan, { ...drill, id: Math.random().toString() }]); // unique ID for list key
    };

    const addCustomToPlan = () => {
        if (!customActivity.title) return;
        const newDrill: Drill = {
            id: Math.random().toString(),
            title: customActivity.title,
            category: customActivity.category,
            duration: customActivity.duration,
            minPlayers: customActivity.minPlayers,
            difficulty: 'Medium',
            image: ''
        };
        addToPlan(newDrill);
        setIsCustomModalOpen(false);
        setCustomActivity({ title: '', duration: 10, category: 'Technical', minPlayers: 11 });
    };

    const removeFromPlan = (index: number) => {
        const newPlan = [...plan];
        newPlan.splice(index, 1);
        setPlan(newPlan);
    };

    const totalDuration = plan.reduce((acc, curr) => acc + curr.duration, 0);

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen flex flex-col lg:flex-row gap-8">
            
            {/* Left: The Plan Timeline */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                         <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Session Designer</h2>
                         <input 
                            type="text" 
                            value={sessionTitle}
                            onChange={(e) => setSessionTitle(e.target.value)}
                            className="bg-transparent text-3xl font-bold text-[var(--text-primary)] focus:outline-none border-b border-transparent focus:border-border pb-1 w-full"
                         />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsCustomModalOpen(true)}
                            className="h-10 px-4 bg-[var(--glass)] border border-border text-[var(--text-primary)] rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[var(--surface)] transition-all"
                        >
                            <Plus size={16} /> Add Custom
                        </button>
                        <button className="h-10 px-6 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20 transition-all">
                            <Save size={16} /> Save Plan
                        </button>
                    </div>
                </div>

                <div className="glass-panel flex-1 rounded-xl p-6 relative overflow-hidden flex flex-col">
                    {/* Timeline Stats */}
                    <div className="flex gap-6 mb-6 pb-6 border-b border-border">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-wider">Duration</span>
                            <span className="text-2xl font-mono text-[var(--text-primary)]">{totalDuration} <span className="text-sm text-[var(--text-secondary)]">min</span></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-wider">Blocks</span>
                            <span className="text-2xl font-mono text-[var(--text-primary)]">{plan.length}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-wider">Intensity</span>
                            <span className="text-2xl font-mono text-emerald-500">Mod</span>
                        </div>
                    </div>

                    {/* Timeline Blocks */}
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                        <AnimatePresence>
                            {plan.map((drill, index) => (
                                <motion.div
                                    key={drill.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    layout
                                    className="group flex items-center gap-4 bg-[var(--glass)] border border-border p-4 rounded-lg relative hover:border-primary/20 transition-colors"
                                >
                                    <div className="text-[var(--text-secondary)] cursor-grab active:cursor-grabbing">
                                        <GripVertical size={20} />
                                    </div>
                                    
                                    {/* Time Marker */}
                                    <div className="flex flex-col items-center w-12 border-r border-border pr-4">
                                        <span className="text-lg font-mono font-bold">{drill.duration}'</span>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-[var(--text-primary)]">{drill.title}</h4>
                                        <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide bg-white/5 px-2 py-0.5 rounded mr-2">{drill.category}</span>
                                        <span className="text-xs text-[var(--text-secondary)]">{drill.minPlayers} players</span>
                                    </div>

                                    <button 
                                        onClick={() => removeFromPlan(index)}
                                        className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {plan.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg text-[var(--text-secondary)]">
                                <AlertCircle size={32} className="mb-4 opacity-50" />
                                <p className="text-sm">Timeline is empty.</p>
                                <p className="text-xs opacity-50">Select drills from the library or add a custom activity.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Visual Timebar */}
                    <div className="h-2 bg-neutral-800 mt-6 rounded-full overflow-hidden flex">
                        {plan.map((d, i) => (
                            <div 
                                key={i} 
                                style={{ width: `${(d.duration / Math.max(90, totalDuration)) * 100}%` }}
                                className={`h-full border-r border-black/50 ${
                                    d.category === 'Technical' ? 'bg-blue-500' :
                                    d.category === 'Tactical' ? 'bg-emerald-500' :
                                    d.category === 'Physical' ? 'bg-red-500' : 'bg-neutral-500'
                                }`} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Drill Picker */}
            <div className="w-full lg:w-96 flex flex-col">
                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-6">Quick Library</h3>
                <div className="glass-panel flex-1 rounded-xl p-4 overflow-y-auto custom-scrollbar h-[calc(100vh-140px)]">
                    <div className="space-y-3">
                        {AVAILABLE_DRILLS.map((drill) => (
                            <motion.div 
                                key={drill.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => addToPlan(drill)}
                                className="p-4 bg-[var(--background)] border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                        drill.category === 'Technical' ? 'text-blue-500 bg-blue-500/10' :
                                        drill.category === 'Tactical' ? 'text-emerald-500 bg-emerald-500/10' :
                                        'text-red-500 bg-red-500/10'
                                    }`}>{drill.category}</span>
                                    <Plus size={14} className="text-[var(--text-secondary)]" />
                                </div>
                                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">{drill.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                                    <span className="flex items-center gap-1"><Clock size={10} /> {drill.duration}m</span>
                                    <span>•</span>
                                    <span>{drill.difficulty}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom Activity Modal */}
            <AnimatePresence>
                {isCustomModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCustomModalOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-sm relative z-10"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-lg font-bold text-[var(--text-primary)]">Custom Activity</h2>
                                <button onClick={() => setIsCustomModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Water Break / Chalk Talk"
                                        className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        value={customActivity.title}
                                        onChange={e => setCustomActivity({...customActivity, title: e.target.value})}
                                        autoFocus
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Duration (min)</label>
                                        <input 
                                            type="number" 
                                            className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                            value={customActivity.duration}
                                            onChange={e => setCustomActivity({...customActivity, duration: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Category</label>
                                        <select 
                                            className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                            value={customActivity.category}
                                            onChange={e => setCustomActivity({...customActivity, category: e.target.value as DrillCategory})}
                                        >
                                            <option value="Technical">Technical</option>
                                            <option value="Tactical">Tactical</option>
                                            <option value="Physical">Physical</option>
                                            <option value="Psychosocial">Psychosocial</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-border bg-[var(--glass)] flex justify-end gap-3">
                                <button onClick={() => setIsCustomModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-hover)]">Cancel</button>
                                <button 
                                    onClick={addCustomToPlan} 
                                    disabled={!customActivity.title}
                                    className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                                >
                                    Add Block
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default PracticePlanner;