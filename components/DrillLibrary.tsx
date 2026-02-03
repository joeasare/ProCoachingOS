import React, { useState } from 'react';
import { Search, Clock, Users, BarChart3, Bookmark, X, Star, ClipboardList, TrendingUp, ChevronRight, Activity, Plus, Save, PenLine, Trash2, Link as LinkIcon, FileText, Video, Paperclip, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drill, DrillCategory, DrillHistory, DrillResource, DrillDifficulty } from '../types';

const MOCK_DRILLS: Drill[] = [
    { 
        id: '1', 
        title: '5v2 Rondo Transition', 
        category: 'Technical', 
        duration: 15, 
        minPlayers: 7, 
        difficulty: 'Medium', 
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
        description: 'High-intensity possession game focusing on quick transitions. The defending pair must win the ball and successfully play to an outside target to rotate out. Encourages rapid reaction to turnovers.',
        coachingPoints: ['Angle of support', 'Speed of play', 'Immediate reaction to loss of possession', 'Communication between defenders'],
        history: [
            { date: '2025-08-10', sessionTitle: 'Pre-season Camp Day 3', rating: 4, notes: 'Good intensity, defenders struggled initially with coordination.' },
            { date: '2025-08-25', sessionTitle: 'Match Prep vs Navy', rating: 5, notes: 'Excellent sharpness. Transition speed was elite.' },
            { date: '2025-09-15', sessionTitle: 'Mid-week Technical', rating: 3, notes: 'Energy levels low. Need to demand more from the outside players.' }
        ],
        resources: [
            { id: 'r1', type: 'video', title: 'Pep Guardiola Rondo Analysis', url: '#' },
            { id: 'r2', type: 'file', title: 'Session_Plan_PDF.pdf', url: '#', fileSize: '2.4 MB' }
        ]
    },
    { 
        id: '2', 
        title: 'High Press Triggers', 
        category: 'Tactical', 
        duration: 30, 
        minPlayers: 14, 
        difficulty: 'Hard', 
        image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=2549&auto=format&fit=crop',
        description: 'Phase of play exercise designed to teach the front three when to initiate the press. Focuses on identifying "triggers" such as a poor touch, a pass to a fullback, or a player receiving with their back to goal.',
        coachingPoints: ['Curved runs to cut passing lanes', 'Unit compactness', 'Verbal triggers ("GO!")', 'Step up of the midfield line'],
        history: [
            { date: '2025-09-02', sessionTitle: 'Tactical Tuesday', rating: 4, notes: 'Solid understanding of the triggers.' },
            { date: '2025-10-01', sessionTitle: 'Match Prep vs Illinois', rating: 5, notes: 'Best pressing session of the year. Smith led the line well.' }
        ],
        resources: [
             { id: 'r3', type: 'link', title: 'Klopp Pressing Theory', url: 'https://example.com' }
        ]
    },
    { 
        id: '3', 
        title: 'Box-to-Box Fitness', 
        category: 'Physical', 
        duration: 45, 
        minPlayers: 2, 
        difficulty: 'Elite', 
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2670&auto=format&fit=crop',
        description: 'Endurance conditioning interval training. Players perform varied intensity runs between the 18-yard boxes, incorporating ball work during active rest periods.',
        coachingPoints: ['Mental resilience', 'Maintaining technique under fatigue', 'Recovery breathing', 'Consistent pace'],
        history: [
            { date: '2025-07-20', sessionTitle: 'Summer Conditioning', rating: 3, notes: 'Several players struggled to complete the final set.' }
        ]
    },
    { 
        id: '4', 
        title: 'Overlap Patterns', 
        category: 'Tactical', 
        duration: 20, 
        minPlayers: 8, 
        difficulty: 'Medium', 
        image: 'https://images.unsplash.com/photo-1517137884378-6229b2836b72?q=80&w=2670&auto=format&fit=crop',
        description: 'Functional pattern play to exploit wide areas. Focuses on timing of the run by the fullback and the weight of the pass from the winger or midfielder.',
        coachingPoints: ['Timing of the overlap', 'Disguise on the pass', 'Quality of the service/cross', 'Movement in the box'],
        history: []
    },
    { 
        id: '5', 
        title: '1v1 Defending Channel', 
        category: 'Technical', 
        duration: 15, 
        minPlayers: 4, 
        difficulty: 'Hard', 
        image: 'https://images.unsplash.com/photo-1543326727-25c2dd534888?q=80&w=2670&auto=format&fit=crop',
        description: 'Isolated defending practice in wide channels. Defender must prevent the attacker from crossing or cutting inside, focusing on body shape and patience.',
        coachingPoints: ['Approach speed', 'Body shape (side on)', 'Don\'t dive in', 'Force away from danger'],
        history: [
            { date: '2025-09-10', sessionTitle: 'Defensive Principles', rating: 4, notes: 'Good patience from the back line.' }
        ]
    },
    { 
        id: '6', 
        title: 'Recovery Yoga', 
        category: 'Physical', 
        duration: 30, 
        minPlayers: 1, 
        difficulty: 'Easy', 
        image: 'https://images.unsplash.com/photo-1544367563-12123d8d5d91?q=80&w=2671&auto=format&fit=crop',
        description: 'Guided mobility and flexibility session to aid regeneration after match day.',
        coachingPoints: ['Breathing', 'Relaxation', 'Range of motion'],
        history: [
            { date: '2025-08-15', sessionTitle: 'Post-Match Recovery', rating: 5, notes: 'Essential session. Squad mood high.' }
        ]
    },
];

const DrillCard: React.FC<{ drill: Drill, onClick: () => void }> = ({ drill, onClick }) => (
    <motion.div 
        layoutId={`card-${drill.id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="glass-panel group rounded-xl overflow-hidden flex flex-col h-full cursor-pointer relative hover:border-primary/50 transition-all"
    >
        <div className="h-40 relative overflow-hidden bg-neutral-900">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
             {drill.image ? (
                <img src={drill.image} alt={drill.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)] opacity-30">
                    <ClipboardList size={48} />
                </div>
             )}
             <span className="absolute top-3 left-3 z-20 px-2 py-1 bg-black/50 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 rounded">
                {drill.category}
             </span>
             {drill.history && drill.history.length > 0 && (
                 <span className="absolute bottom-3 right-3 z-20 flex items-center gap-1 text-[10px] font-bold text-white/80">
                    <Activity size={12} className="text-primary" /> {drill.history.length} Logs
                 </span>
             )}
        </div>
        
        <div className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-primary transition-colors">{drill.title}</h3>
                <Bookmark size={18} className="text-[var(--text-secondary)] hover:text-primary transition-colors" />
            </div>

            <div className="flex gap-4 mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">
                    <Clock size={12} /> {drill.duration}m
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">
                    <Users size={12} /> {drill.minPlayers}+
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] uppercase tracking-wide ml-auto">
                    <BarChart3 size={12} /> {drill.difficulty}
                </div>
            </div>
        </div>
    </motion.div>
);

interface DrillDetailPanelProps { 
    drill: Drill; 
    onClose: () => void;
    onUpdate: (updatedDrill: Drill) => void;
}

const DrillDetailPanel: React.FC<DrillDetailPanelProps> = ({ drill, onClose, onUpdate }) => {
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(drill);
    
    // Resource Management State (Edit Mode)
    const [newResTitle, setNewResTitle] = useState('');
    const [newResUrl, setNewResUrl] = useState('');
    const [newResType, setNewResType] = useState<'video' | 'link' | 'file'>('link');

    // Log Mode State
    const [isLogging, setIsLogging] = useState(false);
    const [logForm, setLogForm] = useState<DrillHistory>({
        date: new Date().toISOString().split('T')[0],
        sessionTitle: '',
        rating: 3,
        notes: ''
    });

    const handleSaveDetails = () => {
        onUpdate(editForm);
        setIsEditing(false);
    };

    const handleAddResource = () => {
        if (!newResTitle) return;
        
        const resource: DrillResource = {
            id: Math.random().toString(),
            title: newResTitle,
            type: newResType,
            url: newResUrl || '#',
            fileSize: newResType === 'file' ? '1.2 MB' : undefined // Mock file size
        };

        setEditForm(prev => ({
            ...prev,
            resources: [...(prev.resources || []), resource]
        }));
        
        setNewResTitle('');
        setNewResUrl('');
    };

    const handleRemoveResource = (id: string) => {
        setEditForm(prev => ({
            ...prev,
            resources: prev.resources?.filter(r => r.id !== id)
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewResTitle(e.target.files[0].name);
            setNewResType('file');
            setNewResUrl('#'); // Mock URL
        }
    };

    const handleSaveLog = () => {
        if (!logForm.sessionTitle || !logForm.notes) return;
        const newHistory = [logForm, ...(drill.history || [])];
        onUpdate({ ...drill, history: newHistory });
        setIsLogging(false);
        // Reset form
        setLogForm({
            date: new Date().toISOString().split('T')[0],
            sessionTitle: '',
            rating: 3,
            notes: ''
        });
    };

    return (
        <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[600px] bg-surface border-l border-border z-[60] shadow-2xl overflow-y-auto"
        >
            {/* Header Image */}
            <div className="relative h-64 bg-neutral-900">
                {drill.image && <img src={drill.image} alt={drill.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-black/40 backdrop-blur hover:bg-white/10 text-white transition-colors border border-white/10"
                >
                    <X size={20} />
                </button>

                <div className="absolute bottom-6 left-8 right-8">
                    <div className="flex gap-2 mb-3">
                         <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded">{drill.category}</span>
                         <span className="px-2 py-1 bg-[var(--glass)] backdrop-blur border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded">{drill.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] leading-tight">{drill.title}</h2>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-primary text-white' : 'bg-black/40 text-white/80 hover:bg-black/60'}`}
                        >
                            <PenLine size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-12 space-y-8">
                {/* Stats Row */}
                <div className="flex gap-8 border-b border-border pb-6">
                    <div>
                        <span className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-widest">Duration</span>
                        <p className="text-lg font-mono font-bold text-[var(--text-primary)] mt-1">{drill.duration} min</p>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-widest">Players</span>
                        <p className="text-lg font-mono font-bold text-[var(--text-primary)] mt-1">{drill.minPlayers}+</p>
                    </div>
                     <div>
                        <span className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-widest">Intensity</span>
                        <p className="text-lg font-mono font-bold text-emerald-500 mt-1">High</p>
                    </div>
                </div>

                {/* Main Content Area: Edit vs View */}
                {isEditing ? (
                    <div className="space-y-6 bg-[var(--glass)] p-6 rounded-xl border border-primary/30">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Edit Mode</h3>
                        
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Description</label>
                            <textarea 
                                className="w-full bg-[var(--surface)] border border-border rounded-lg p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary min-h-[100px]"
                                value={editForm.description}
                                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Coaching Points (One per line)</label>
                            <textarea 
                                className="w-full bg-[var(--surface)] border border-border rounded-lg p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary min-h-[100px]"
                                value={editForm.coachingPoints?.join('\n')}
                                onChange={(e) => setEditForm({...editForm, coachingPoints: e.target.value.split('\n')})}
                            />
                        </div>
                        
                        {/* Resource Manager (Edit Mode) */}
                        <div className="border-t border-border pt-4 mt-4">
                            <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-3 block">Attachments & Resources</label>
                            
                            {/* List Existing Resources */}
                            <div className="space-y-2 mb-4">
                                {editForm.resources?.map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-2 bg-[var(--surface)] border border-border rounded-lg">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                             {r.type === 'video' ? <Video size={14} className="text-primary shrink-0" /> : 
                                              r.type === 'file' ? <FileText size={14} className="text-blue-500 shrink-0" /> : 
                                              <LinkIcon size={14} className="text-emerald-500 shrink-0" />}
                                             <span className="text-xs font-medium text-[var(--text-primary)] truncate">{r.title}</span>
                                        </div>
                                        <button onClick={() => handleRemoveResource(r.id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Resource */}
                            <div className="flex gap-2 mb-2">
                                <select 
                                    className="bg-[var(--surface)] border border-border rounded-lg px-2 text-xs text-[var(--text-primary)] focus:outline-none"
                                    value={newResType}
                                    onChange={(e) => setNewResType(e.target.value as any)}
                                >
                                    <option value="link">Link</option>
                                    <option value="video">Video</option>
                                    <option value="file">File</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Resource Title"
                                    className="flex-1 bg-[var(--surface)] border border-border rounded-lg px-2 text-xs py-2 text-[var(--text-primary)] focus:outline-none"
                                    value={newResTitle}
                                    onChange={(e) => setNewResTitle(e.target.value)}
                                />
                            </div>
                            
                            {newResType !== 'file' ? (
                                <input 
                                    type="text" 
                                    placeholder="URL (https://...)"
                                    className="w-full bg-[var(--surface)] border border-border rounded-lg px-2 text-xs py-2 mb-2 text-[var(--text-primary)] focus:outline-none"
                                    value={newResUrl}
                                    onChange={(e) => setNewResUrl(e.target.value)}
                                />
                            ) : (
                                <div className="relative mb-2">
                                     <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileUpload}
                                     />
                                     <div className="w-full bg-[var(--surface)] border border-dashed border-border rounded-lg px-2 py-2 text-xs text-[var(--text-secondary)] text-center hover:bg-[var(--glass-hover)] transition-colors">
                                        Click to Upload File
                                     </div>
                                </div>
                            )}

                            <button 
                                onClick={handleAddResource}
                                disabled={!newResTitle}
                                className="w-full py-2 bg-[var(--surface)] border border-border rounded-lg text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--glass-hover)] disabled:opacity-50 transition-colors"
                            >
                                + Add Resource
                            </button>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 border-t border-border pt-4">
                            <button 
                                onClick={() => { setIsEditing(false); setEditForm(drill); }}
                                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveDetails}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 flex items-center gap-2"
                            >
                                <Save size={14} /> Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                <ClipboardList size={14} /> Description
                            </h3>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed opacity-90">
                                {drill.description || 'No description available for this drill.'}
                            </p>
                        </div>

                         {/* Resources Section (View Mode) */}
                        {(drill.resources && drill.resources.length > 0) && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                    <Paperclip size={14} /> Resources & Media
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {drill.resources.map(r => (
                                        <div key={r.id} className="flex items-center justify-between p-3 bg-[var(--glass)] border border-border rounded-lg hover:border-primary/40 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    r.type === 'video' ? 'bg-primary/10 text-primary' :
                                                    r.type === 'file' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-emerald-500/10 text-emerald-500'
                                                }`}>
                                                    {r.type === 'video' ? <Video size={16} /> :
                                                     r.type === 'file' ? <FileText size={16} /> :
                                                     <LinkIcon size={16} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-primary transition-colors">{r.title}</p>
                                                    {r.fileSize && <p className="text-[10px] text-[var(--text-secondary)] uppercase">{r.fileSize}</p>}
                                                </div>
                                            </div>
                                            <ExternalLink size={14} className="text-[var(--text-secondary)] group-hover:text-primary" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Coaching Points */}
                        {drill.coachingPoints && (
                            <div className="bg-[var(--glass)] p-5 rounded-xl border border-border">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                                    <TrendingUp size={14} /> Coaching Points
                                </h3>
                                <ul className="space-y-2">
                                    {drill.coachingPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                                            <ChevronRight size={14} className="text-primary mt-0.5 flex-shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {/* Historical Details */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                            <Activity size={14} /> Session Logs
                        </h3>
                        <button 
                            onClick={() => setIsLogging(!isLogging)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${isLogging ? 'bg-primary text-white border-primary' : 'bg-[var(--glass)] border-border hover:border-primary/50'}`}
                        >
                            <Plus size={12} /> Log Session
                        </button>
                    </div>

                    {/* Add Log Form */}
                    <AnimatePresence>
                        {isLogging && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-[var(--glass)] p-5 rounded-xl border border-primary/30 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Date</label>
                                            <input 
                                                type="date"
                                                className="w-full bg-[var(--surface)] border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
                                                value={logForm.date}
                                                onChange={(e) => setLogForm({...logForm, date: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Rating</label>
                                            <div className="flex items-center gap-1 h-[34px]">
                                                {[1,2,3,4,5].map(star => (
                                                    <button 
                                                        key={star}
                                                        onClick={() => setLogForm({...logForm, rating: star})}
                                                        className="hover:scale-110 transition-transform"
                                                    >
                                                        <Star 
                                                            size={20} 
                                                            className={star <= logForm.rating ? "text-primary fill-primary" : "text-[var(--text-secondary)]/30"} 
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Session Title</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. Pre-season Camp Day 4"
                                            className="w-full bg-[var(--surface)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                            value={logForm.sessionTitle}
                                            onChange={(e) => setLogForm({...logForm, sessionTitle: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1 block">Notes</label>
                                        <textarea 
                                            placeholder="How did the drill perform?"
                                            className="w-full bg-[var(--surface)] border border-border rounded-lg p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary min-h-[80px]"
                                            value={logForm.notes}
                                            onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button 
                                            onClick={() => setIsLogging(false)}
                                            className="px-4 py-2 text-xs font-bold uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSaveLog}
                                            disabled={!logForm.sessionTitle || !logForm.notes}
                                            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <Save size={12} /> Save Log
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {drill.history && drill.history.length > 0 ? (
                        <div className="relative border-l border-border ml-2 space-y-6">
                            {drill.history.map((item, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="pl-6 relative"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface border-2 border-primary" />
                                    
                                    <div className="flex flex-col gap-1 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{new Date(item.date).toLocaleDateString()}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--glass)] border border-border text-[var(--text-secondary)] uppercase">{item.sessionTitle}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={10} 
                                                    className={i < item.rating ? "text-primary fill-primary" : "text-[var(--text-secondary)]/30"} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[var(--glass)] p-3 rounded-lg border border-border/50">
                                        <p className="text-xs text-[var(--text-primary)] italic">"{item.notes}"</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center border border-dashed border-border rounded-xl text-[var(--text-secondary)] text-sm">
                            No historical data found. Log a session to track performance.
                        </div>
                    )}
                </div>

                <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <ClipboardList size={16} /> Add to Practice Plan
                </button>
            </div>
        </motion.div>
    );
};

interface CreateDrillModalProps {
    onClose: () => void;
    onSave: (drill: Drill) => void;
}

const CreateDrillModal: React.FC<CreateDrillModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Drill>>({
        title: '',
        category: 'Technical',
        difficulty: 'Medium',
        duration: 15,
        minPlayers: 1,
        description: '',
        image: ''
    });

    const handleSubmit = () => {
        if (!formData.title) return;
        
        const newDrill: Drill = {
            id: Math.random().toString(),
            title: formData.title || 'Untitled Drill',
            category: formData.category as DrillCategory,
            difficulty: formData.difficulty as DrillDifficulty,
            duration: formData.duration || 15,
            minPlayers: formData.minPlayers || 1,
            description: formData.description || '',
            image: formData.image || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2670&auto=format&fit=crop',
            coachingPoints: [],
            resources: []
        };
        onSave(newDrill);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // In a real app, upload to server. Here we use object URL
            setFormData({ ...formData, image: URL.createObjectURL(e.target.files[0]) });
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Upload Custom Drill</h2>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Drill Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Counter Attack Phase Play" 
                            className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Category</label>
                            <select 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value as DrillCategory})}
                            >
                                <option value="Technical">Technical</option>
                                <option value="Tactical">Tactical</option>
                                <option value="Physical">Physical</option>
                                <option value="Psychosocial">Psychosocial</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Difficulty</label>
                            <select 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                value={formData.difficulty}
                                onChange={e => setFormData({...formData, difficulty: e.target.value as DrillDifficulty})}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                                <option value="Elite">Elite</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Duration (Min)</label>
                            <input 
                                type="number" 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                value={formData.duration}
                                onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Min Players</label>
                            <input 
                                type="number" 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                value={formData.minPlayers}
                                onChange={e => setFormData({...formData, minPlayers: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Description</label>
                        <textarea 
                            className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary min-h-[80px]"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Cover Image</label>
                        <div className="relative h-32 w-full bg-[var(--glass)] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-[var(--text-secondary)] hover:border-primary/50 transition-colors group cursor-pointer overflow-hidden">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImageIcon size={24} className="mb-2 opacity-50" />
                                    <span className="text-xs">Click to upload diagram/photo</span>
                                </>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-[var(--glass)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-hover)]">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20">Add to Library</button>
                </div>
            </motion.div>
        </div>
    );
};

const DrillLibrary: React.FC = () => {
    // State management for Drills to support updates
    const [drills, setDrills] = useState<Drill[]>(MOCK_DRILLS);
    const [filter, setFilter] = useState<DrillCategory | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDrillId, setSelectedDrillId] = useState<string | null>(null);
    const [isCreateOpen, setCreateOpen] = useState(false);

    const selectedDrill = drills.find(d => d.id === selectedDrillId);

    const handleUpdateDrill = (updatedDrill: Drill) => {
        setDrills(prev => prev.map(d => d.id === updatedDrill.id ? updatedDrill : d));
    };

    const handleCreateDrill = (newDrill: Drill) => {
        setDrills(prev => [newDrill, ...prev]);
        setCreateOpen(false);
    };

    const filteredDrills = drills.filter(d => 
        (filter === 'All' || d.category === filter) &&
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">Drill Library</h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Access over 500+ elite coaching drills and sessions.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search drills..." 
                            className="w-full bg-[var(--glass)] border border-border rounded-lg pl-9 pr-4 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-primary transition-all placeholder:text-[var(--text-secondary)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setCreateOpen(true)}
                        className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20 whitespace-nowrap"
                    >
                        <Plus size={16} /> New Drill
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {['All', 'Technical', 'Tactical', 'Physical', 'Psychosocial'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat as any)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                            filter === cat 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-[var(--glass)] text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDrills.map((drill) => (
                    <DrillCard 
                        key={drill.id} 
                        drill={drill} 
                        onClick={() => setSelectedDrillId(drill.id)} 
                    />
                ))}
            </div>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selectedDrill && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDrillId(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" 
                        />
                        <DrillDetailPanel 
                            drill={selectedDrill} 
                            onClose={() => setSelectedDrillId(null)}
                            onUpdate={handleUpdateDrill}
                        />
                    </>
                )}
                {isCreateOpen && (
                    <CreateDrillModal 
                        onClose={() => setCreateOpen(false)}
                        onSave={handleCreateDrill}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DrillLibrary;