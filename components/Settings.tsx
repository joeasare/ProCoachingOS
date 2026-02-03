import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HelpCircle, ChevronDown, 
    Moon, Sun, Volume2, Smartphone, Terminal, Shield, 
    ChevronRight, Search, Workflow, MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// --- Types ---

type Tab = 'system' | 'protocol' | 'usecases';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

interface UseCaseItem {
    id: string;
    title: string;
    description: string;
    steps: string[];
    route: string;
}

// --- Data ---

const FAQS: FAQItem[] = [
    {
        category: 'Tactical Board',
        question: "How do I control the 3D camera?",
        answer: "Use Left-Click to rotate the pitch. Right-Click to pan. Scroll to zoom in/out. In 'Animation Mode', the camera locks to a cinematic perspective automatically."
    },
    {
        category: 'Tactical Board',
        question: "How do I create an animation sequence?",
        answer: "Enter 'Animation Mode' (Film icon). Position your players for the first frame. Click 'Capture Frame'. Move players to their next position. Click 'Capture Frame' again. Press Play to interpolate the movement."
    },
    {
        category: 'Roster Management',
        question: "What does the ACWR metric represent?",
        answer: "Acute:Chronic Workload Ratio. It divides the player's workload over the last 7 days by the average of the last 28 days. A value between 0.8 and 1.3 is optimal for injury prevention."
    },
    {
        category: 'Roster Management',
        question: "How is 'Sleep Quality' calculated?",
        answer: "This data is synchronized from wearable devices (WHOOP/Oura) via the API integration. It is normalized to a 0-100 scale where 100 represents optimal recovery."
    },
    {
        category: 'General',
        question: "Can I export match reports?",
        answer: "Yes. Navigate to the Dashboard, select 'Season View', and click the 'Export Stats' button. This generates a CSV file containing all aggregated player performance metrics."
    }
];

const USE_CASES: UseCaseItem[] = [
    {
        id: 'uc1',
        title: 'Opponent Preparation',
        description: 'Standard operating procedure for analyzing upcoming opposition and preparing the squad tactically.',
        steps: [
            'Navigate to [Dashboard] to review opponent form guide.',
            'Open [Tactics Board] and set Opponent Formation (e.g., 4-4-2).',
            'Toggle "Heatmap Layer" to identify opponent pressing zones.',
            'Design counter-strategy and save as "Match Prep" keyframes.',
            'Share formation via [Team Comms] to #match-prep channel.'
        ],
        route: '/tactics'
    },
    {
        id: 'uc2',
        title: 'Injury Rehabilitation',
        description: 'Workflow for managing player return-to-play protocols using bio-metric data.',
        steps: [
            'Check [Roster] for "Injured" or "Resting" status alerts.',
            'Open Player Detail View and review Bio-Mechanics (GCT & Symmetry).',
            'Analyze Load Management graph for ACWR spikes > 1.5.',
            'Go to [Drill Library] and select "Recovery" category drills.',
            'Create a customized [Practice Plan] with reduced intensity blocks.'
        ],
        route: '/roster'
    },
    {
        id: 'uc3',
        title: 'Post-Match Analysis',
        description: 'Deconstructing game performance using the match reporting suite.',
        steps: [
            'Enter [Schedule] and select the completed match.',
            'Upload game footage to the Media Gallery.',
            'Use the "Timeline Scrubber" to tag key events (Goals, Shots).',
            'Compare "xG" vs "Actual Goals" in the Stats tab.',
            'Export Match Report CSV for the technical director.'
        ],
        route: '/schedule'
    },
    {
        id: 'uc4',
        title: 'Set Piece Laboratory',
        description: 'Designing and exporting dead-ball routines for training implementation.',
        steps: [
            'Open [Tactics Board] and enter "Draw Mode" (Pen Tool).',
            'Clear the pitch and position attackers in the box.',
            'Use "Cone" tool to mark delivery zones.',
            'Animate player runs using the [Animation Studio].',
            'Capture screenshot and upload to [Drill Library] as a custom drill.'
        ],
        route: '/tactics'
    },
    {
        id: 'uc5',
        title: 'Team Communication',
        description: 'Protocols for internal messaging, announcements, and direct player feedback via the secure channel.',
        steps: [
            'Navigate to [Team Comms] via the sidebar.',
            'Select the #announcements channel for squad-wide updates.',
            'Post the weekly schedule or video analysis links.',
            'Check Direct Messages for injury status updates from the Physio staff.',
            'Use the "Poll" feature to gauge squad fatigue levels.'
        ],
        route: '/team'
    }
];

// --- Sub-Components ---

const FaqItem: React.FC<{ item: FAQItem, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-border last:border-0">
            <button 
                onClick={onClick}
                className="w-full py-4 flex items-center justify-between text-left hover:text-primary transition-colors group"
            >
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">{item.category}</span>
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-primary transition-colors">{item.question}</span>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                            {item.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const UseCaseCard: React.FC<{ item: UseCaseItem, index: number }> = ({ item, index }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-xl border border-border"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                    0{index + 1}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{item.title}</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6 border-b border-border pb-4 min-h-[60px]">
                {item.description}
            </p>
            
            <div className="space-y-4">
                {item.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 relative">
                        {/* Vertical Line */}
                        {i !== item.steps.length - 1 && (
                            <div className="absolute left-[7px] top-4 bottom-[-16px] w-px bg-border" />
                        )}
                        
                        <div className="w-4 h-4 rounded-full bg-[var(--surface)] border border-border flex items-center justify-center shrink-0 z-10 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]" />
                        </div>
                        <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                            {step.split(/(\[.*?\])/g).map((part, j) => (
                                part.startsWith('[') && part.endsWith(']') ? (
                                    <span key={j} className="text-primary font-bold">{part.replace(/[\[\]]/g, '')}</span>
                                ) : (
                                    part
                                )
                            ))}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex justify-end">
                 <button 
                    onClick={() => navigate(item.route)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-primary transition-colors"
                 >
                     Start Workflow <ChevronRight size={12} />
                 </button>
            </div>
        </motion.div>
    );
};

// --- Main Component ---

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('protocol');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="p-6 md:p-10 max-w-[1200px] mx-auto min-h-screen">
             {/* Header */}
            <div className="mb-12">
                <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">Support & Configuration</h1>
                <p className="text-[var(--text-secondary)] text-sm mt-1">System preferences and operational knowledge base.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border mb-8 overflow-x-auto">
                {[
                    { id: 'protocol', label: 'Protocol', icon: HelpCircle },
                    { id: 'usecases', label: 'Use Cases', icon: Workflow },
                    { id: 'system', label: 'System', icon: Terminal },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'text-[var(--text-primary)]' 
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode='wait'>
                {activeTab === 'protocol' && (
                    <motion.div 
                        key="protocol"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-3xl"
                    >
                         <div className="flex justify-between items-end mb-8">
                             <div>
                                 <h2 className="text-xl font-bold text-[var(--text-primary)]">Frequently Asked Questions</h2>
                                 <p className="text-xs text-[var(--text-secondary)] mt-1">Common inquiries regarding the operating system.</p>
                             </div>
                             <div className="relative hidden md:block">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                                 <input 
                                    type="text" 
                                    placeholder="Search FAQ..." 
                                    className="bg-[var(--glass)] border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary w-64"
                                 />
                             </div>
                         </div>

                         <div className="bg-[var(--glass)] border border-border rounded-xl px-6 md:px-8">
                            {FAQS.map((faq, i) => (
                                <FaqItem 
                                    key={i} 
                                    item={faq} 
                                    isOpen={openFaqIndex === i} 
                                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} 
                                />
                            ))}
                         </div>
                         
                         <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                             <div>
                                 <h3 className="text-sm font-bold text-[var(--text-primary)]">Still need assistance?</h3>
                                 <p className="text-xs text-[var(--text-secondary)]">Contact the dedicated support engineering team.</p>
                             </div>
                             <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg hover:opacity-90">
                                 Open Ticket
                             </button>
                         </div>
                    </motion.div>
                )}

                {activeTab === 'usecases' && (
                    <motion.div 
                        key="usecases"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="mb-8 max-w-2xl">
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">Operational Workflows</h2>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                Standard operating procedures for common coaching scenarios. 
                                Follow these linear workflows to maximize system efficiency.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {USE_CASES.map((useCase, i) => (
                                <UseCaseCard key={useCase.id} item={useCase} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'system' && (
                    <motion.div 
                        key="system"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl"
                    >
                        <div className="space-y-6">
                            {/* Visual Settings */}
                            <section className="glass-panel p-6 rounded-xl">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                                    <Smartphone size={14} /> Interface
                                </h3>
                                
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[var(--background)] rounded-lg border border-border">
                                            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">Appearance</p>
                                            <p className="text-xs text-[var(--text-secondary)]">Toggle between Light and Dark mode.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={toggleTheme}
                                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--background)] border border-border transition-colors focus:outline-none"
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[var(--background)] rounded-lg border border-border">
                                            <Volume2 size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">Ambient Audio</p>
                                            <p className="text-xs text-[var(--text-secondary)]">Play subtle background drone.</p>
                                        </div>
                                    </div>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--background)] border border-border transition-colors focus:outline-none">
                                        <span className="inline-block h-4 w-4 transform rounded-full bg-[var(--text-secondary)] translate-x-1" />
                                    </button>
                                </div>
                            </section>

                            {/* Privacy */}
                            <section className="glass-panel p-6 rounded-xl">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                                    <Shield size={14} /> Data & Privacy
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-[var(--text-primary)]">GPS Data Sync</span>
                                        <span className="text-xs font-mono text-emerald-500">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-[var(--text-primary)]">Video Storage</span>
                                        <span className="text-xs font-mono text-[var(--text-secondary)]">24GB / 100GB</span>
                                    </div>
                                    <button className="text-xs text-red-500 font-bold hover:underline pt-2">
                                        Clear Local Cache
                                    </button>
                                </div>
                            </section>
                            
                            <div className="flex justify-center pt-8 opacity-50">
                                <p className="text-[10px] uppercase tracking-widest font-mono">
                                    PitchControl OS v2.0.4 // Build 8942
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Settings;