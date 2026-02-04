
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Plus, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export type SessionType = 'Training' | 'Match' | 'Recovery' | 'Meeting';

export interface Session {
  id: string;
  title: string;
  type: SessionType;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  attendees: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  result?: string; // e.g. "W 3-0"
  gallery?: { id: string; type: 'image'|'video'; url: string; caption?: string }[];
}

// Keep mockSessions for export so Settings can use it to seed
export const mockSessions: Session[] = [
  { id: '1', title: 'vs LEHIGH', type: 'Match', date: '2025-08-14', startTime: '19:00', endTime: '21:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'W 3-0' },
  { id: '2', title: 'vs SAINT FRANCIS', type: 'Match', date: '2025-08-17', startTime: '13:00', endTime: '15:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'W 5-0' },
  { id: '3', title: 'vs UMBC', type: 'Match', date: '2025-08-21', startTime: '19:00', endTime: '21:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'W 1-0' },
  { id: '4', title: 'at Old Dominion', type: 'Match', date: '2025-08-24', startTime: '13:00', endTime: '15:00', location: 'Away', attendees: 'Travel Squad', status: 'Completed', result: 'L 0-2' },
  { id: '5', title: 'vs NAVY', type: 'Match', date: '2025-08-28', startTime: '19:00', endTime: '21:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'W 2-1' },
  { id: '6', title: 'vs FLORIDA', type: 'Match', date: '2025-08-31', startTime: '13:00', endTime: '15:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'L 1-3' },
  { id: '7', title: 'at James Madison', type: 'Match', date: '2025-09-04', startTime: '19:00', endTime: '21:00', location: 'Away', attendees: 'Travel Squad', status: 'Completed', result: 'L 0-1' },
  { id: '8', title: 'at Penn St.', type: 'Match', date: '2025-09-11', startTime: '19:00', endTime: '21:00', location: 'Away', attendees: 'Travel Squad', status: 'Completed', result: 'L 0-4' },
  { id: '9', title: 'vs INDIANA', type: 'Match', date: '2025-09-18', startTime: '19:00', endTime: '21:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'W 2-1' },
  { id: '10', title: 'vs PURDUE', type: 'Match', date: '2025-09-21', startTime: '13:00', endTime: '15:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'W 2-1' },
  { id: '11', title: 'at USC', type: 'Match', date: '2025-09-25', startTime: '22:00', endTime: '24:00', location: 'Away', attendees: 'Travel Squad', status: 'Completed', result: 'L 0-3' },
  { id: '12', title: 'at UCLA', type: 'Match', date: '2025-09-28', startTime: '16:00', endTime: '18:00', location: 'Away', attendees: 'Travel Squad', status: 'Completed', result: 'L 0-1' },
  { id: '13', title: 'vs ILLINOIS', type: 'Match', date: '2025-10-05', startTime: '13:00', endTime: '15:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'L 1-2' },
  { id: '14', title: 'at Iowa', type: 'Match', date: '2025-10-09', startTime: '19:00', endTime: '21:00', location: 'Away', attendees: 'Travel Squad', status: 'Completed', result: 'L 0-2' },
  { id: '15', title: 'at Nebraska', type: 'Match', date: '2025-10-12', startTime: '13:00', endTime: '15:00', location: 'Away', attendees: 'Travel Squad', status: 'Completed', result: 'L 0-2' },
  { id: '16', title: 'vs MICHIGAN', type: 'Match', date: '2025-10-16', startTime: '19:00', endTime: '21:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'L 3-4' },
  { id: '17', title: 'vs OHIO ST.', type: 'Match', date: '2025-10-19', startTime: '13:00', endTime: '15:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'L 1-3' },
  { id: '18', title: 'vs RUTGERS', type: 'Match', date: '2025-10-26', startTime: '13:00', endTime: '15:00', location: 'Home', attendees: 'Full Squad', status: 'Completed', result: 'T 0-0' },
];

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
  const navigate = useNavigate();

  const isMatch = session.type === 'Match';
  const isCompleted = session.status === 'Completed';
  
  const handleClick = () => {
      if (isMatch && isCompleted) {
          navigate(`/match/${session.id}`);
      }
  };

  const getResultColor = (result?: string) => {
      if (!result) return 'text-[var(--text-secondary)]';
      if (result.startsWith('W')) return 'text-emerald-500';
      if (result.startsWith('L')) return 'text-red-500';
      return 'text-[var(--text-primary)]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className={`glass-panel p-0 rounded-xl transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full border hover:border-primary/40`}
    >
        {/* Status Indicator Bar */}
        <div className={`h-1 w-full ${
            session.type === 'Match' ? 'bg-primary' : 
            session.type === 'Training' ? 'bg-emerald-500' : 'bg-blue-500'
        }`} />

        <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                        {session.type} • {new Date(session.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-primary transition-colors">
                        {session.title}
                    </h3>
                </div>
                {isMatch && isCompleted && (
                    <Trophy size={16} className={session.result?.startsWith('W') ? "text-primary" : "text-[var(--text-secondary)] opacity-20"} />
                )}
            </div>

            <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Clock size={12} />
                        <span className="font-mono">{session.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <MapPin size={12} />
                        <span>{session.location}</span>
                    </div>
                </div>

                {isMatch && isCompleted && session.result ? (
                    <div className="flex items-center justify-between bg-[var(--surface)] p-2 rounded-lg border border-border/50">
                        <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Final Score</span>
                        <span className={`font-mono font-bold ${getResultColor(session.result)}`}>{session.result}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Users size={12} />
                        <span>{session.attendees}</span>
                    </div>
                )}
            </div>
            
            {isMatch && isCompleted && (
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={16} className="text-primary" />
                </div>
            )}
        </div>
    </motion.div>
  );
};

interface CreateSessionModalProps {
    onClose: () => void;
    onSave: (session: Session) => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ onClose, onSave }) => {
    // ... (Modal code remains largely the same, just ensuring consistency)
    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:30',
        type: 'Training' as SessionType,
        attendees: '',
        location: 'Training Center'
    });

    const handleSubmit = () => {
        const newSession: Session = {
            id: '', 
            title: formData.title || 'Untitled Session',
            type: formData.type,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location,
            attendees: formData.attendees || 'Full Squad',
            status: 'Upcoming'
        };
        onSave(newSession);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
                <div className="p-6 border-b border-border flex justify-between items-center bg-[var(--glass)]">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">New Event</h2>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <Plus size={20} className="rotate-45" />
                    </button>
                </div>
                <div className="p-6 space-y-4 bg-[var(--surface)]">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5">Event Title</label>
                        <input 
                            type="text" 
                            className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Tactical Review"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5">Date</label>
                             <input 
                                type="date" 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" 
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                             />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5">Start</label>
                                <input 
                                    type="time" 
                                    className="w-full bg-[var(--glass)] border border-border rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" 
                                    value={formData.startTime}
                                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5">End</label>
                                <input 
                                    type="time" 
                                    className="w-full bg-[var(--glass)] border border-border rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" 
                                    value={formData.endTime}
                                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                                />
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5">Type</label>
                            <select 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as SessionType})}
                            >
                                <option>Training</option>
                                <option>Match</option>
                                <option>Recovery</option>
                                <option>Meeting</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5">Location</label>
                            <input 
                                type="text" 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-border bg-[var(--glass)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold uppercase text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 rounded-lg text-xs font-bold uppercase bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all">Create Event</button>
                </div>
            </motion.div>
        </div>
    );
};

const Schedule: React.FC = () => {
  // Initialize with mockSessions to ensure data is present immediately
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [filter, setFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Start date adjusted to show recent/upcoming relevant matches (October 2025)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); 
  
  const filters = ['All', 'Training', 'Match', 'Recovery', 'Meeting'];

  useEffect(() => {
    // Attempt to fetch real data, but fallback to mock is already set in state initialization
    const q = query(collection(db, 'sessions'), orderBy('date'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
        if (data.length > 0) {
            setSessions(data);
        }
    }, (error) => {
        console.log("Using mock data for schedule");
    });
    return () => unsubscribe();
  }, []);

  const handleCreateSession = async (newSession: Session) => {
      const { id, ...sessionData } = newSession;
      // Add to local state for immediate feedback if offline/demo
      setSessions(prev => [...prev, { ...newSession, id: Math.random().toString() }]);
      
      try {
        await addDoc(collection(db, 'sessions'), sessionData);
      } catch (e) {
          console.warn("Could not save to firestore", e);
      }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
      setCurrentDate(newDate);
  };

  const filteredSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const isSameMonth = sessionDate.getMonth() === currentDate.getMonth() && sessionDate.getFullYear() === currentDate.getFullYear();
      const matchesType = filter === 'All' || s.type === filter;
      return isSameMonth && matchesType;
  });

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">Terrapins Schedule</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">2025 Season • Big Ten Conference</p>
        </div>
        <div className="flex gap-3">
            <button className="h-10 px-4 bg-[var(--glass)] border border-border rounded-lg text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--surface)] hover:border-primary/30 transition-colors flex items-center gap-2">
                <Filter size={14} /> Filter
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20"
            >
                <Plus size={16} /> New Session
            </button>
        </div>
      </div>

      {/* Date Navigation / Timeline Header */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-6">
             <button 
                onClick={() => changeMonth('prev')}
                className="p-2 hover:bg-[var(--glass)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
             >
                 <ChevronLeft size={20} />
             </button>
             <span className="text-xl font-display font-bold text-[var(--text-primary)] w-48 text-center uppercase tracking-tight">
                 {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </span>
             <button 
                onClick={() => changeMonth('next')}
                className="p-2 hover:bg-[var(--glass)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
             >
                 <ChevronRight size={20} />
             </button>
         </div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full">
            {filters.map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-primary-foreground' : 'text-[var(--text-secondary)] hover:bg-[var(--glass)] border border-transparent hover:border-border'}`}
                >
                    {f}
                </button>
            ))}
         </div>
      </div>

      {/* Sessions List (Grouped) */}
      <div className="space-y-6">
         <div className="flex items-center gap-4 opacity-50">
             <div className="h-px flex-1 bg-border" />
             <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">Events for {currentDate.toLocaleString('default', { month: 'long' })}</span>
             <div className="h-px flex-1 bg-border" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSessions.length > 0 ? (
                // Sort by date descending
                filteredSessions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(session => (
                    <SessionCard key={session.id} session={session} />
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-[var(--text-secondary)] border-2 border-dashed border-border rounded-xl">
                    <Calendar size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No scheduled events for this period.</p>
                </div>
            )}
         </div>
      </div>

      <AnimatePresence>
          {isModalOpen && (
              <CreateSessionModal 
                  onClose={() => setIsModalOpen(false)} 
                  onSave={handleCreateSession}
              />
          )}
      </AnimatePresence>

    </div>
  );
};

export default Schedule;
