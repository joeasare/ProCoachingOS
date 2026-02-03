import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Plus, Filter, ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle2, X, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
}

// 2025 Season Schedule from OCR
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

  const getTypeColor = (type: SessionType) => {
    switch (type) {
      case 'Match': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Training': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Recovery': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  const handleClick = () => {
      if (session.type === 'Match' && session.status === 'Completed') {
          navigate(`/match/${session.id}`);
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className="glass-panel p-5 rounded-xl hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
    >
        {/* Left Color Strip */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeColor(session.type).split(' ')[0].replace('/10', '')}`} />

        <div className="flex justify-between items-start mb-4 pl-3">
            <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getTypeColor(session.type)}`}>
                    {session.type}
                </span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2 group-hover:text-primary transition-colors">{session.title}</h3>
                {session.result && (
                    <span className="text-xs font-mono text-[var(--text-primary)] font-bold mt-1 block">Result: {session.result}</span>
                )}
            </div>
            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <MoreHorizontal size={16} />
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pl-3">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock size={14} />
                <span>{session.startTime} - {session.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <MapPin size={14} />
                <span>{session.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Users size={14} />
                <span>{session.attendees}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Calendar size={14} />
                <span>{new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
        </div>
    </motion.div>
  );
};

interface CreateSessionModalProps {
    onClose: () => void;
    onSave: (session: Session) => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ onClose, onSave }) => {
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
            id: Math.random().toString(36).substr(2, 9),
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
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">New Session</h2>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Match Prep vs Rutgers" 
                            className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    
                    {/* Attendees Field - The requested feature */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1 flex items-center gap-2">
                             Attendees <span className="text-[var(--text-secondary)]/50 font-normal normal-case">(Add Users/Groups)</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="e.g. Full Squad, Staff, K. Smith..." 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
                                value={formData.attendees}
                                onChange={e => setFormData({...formData, attendees: e.target.value})}
                            />
                            <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Date</label>
                             <input 
                                type="date" 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                             />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Start</label>
                                <input 
                                    type="time" 
                                    className="w-full bg-[var(--glass)] border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary" 
                                    value={formData.startTime}
                                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">End</label>
                                <input 
                                    type="time" 
                                    className="w-full bg-[var(--glass)] border border-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-primary" 
                                    value={formData.endTime}
                                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                                />
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Type</label>
                            <select 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
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
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">Location</label>
                            <input 
                                type="text" 
                                className="w-full bg-[var(--glass)] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-border bg-[var(--glass)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-hover)]">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:opacity-90">Create Session</button>
                </div>
            </motion.div>
        </div>
    );
};

const Schedule: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [filter, setFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // Start at October 2025
  
  const filters = ['All', 'Training', 'Match', 'Recovery', 'Meeting'];

  const handleCreateSession = (newSession: Session) => {
      setSessions([...sessions, newSession]);
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
            <button className="h-10 px-4 bg-glass border border-border rounded-lg text-[var(--text-primary)] text-sm font-medium hover:bg-surface hover:border-primary/30 transition-colors flex items-center gap-2">
                <Filter size={14} /> Filter
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20"
            >
                <Plus size={16} /> New Session
            </button>
        </div>
      </div>

      {/* Date Navigation / Timeline Header */}
      <div className="glass-panel p-4 rounded-xl flex justify-between items-center">
         <div className="flex items-center gap-4">
             <button 
                onClick={() => changeMonth('prev')}
                className="p-2 hover:bg-[var(--glass)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
             >
                 <ChevronLeft size={20} />
             </button>
             <span className="text-lg font-mono font-medium text-[var(--text-primary)] w-32 text-center">
                 {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </span>
             <button 
                onClick={() => changeMonth('next')}
                className="p-2 hover:bg-[var(--glass)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
             >
                 <ChevronRight size={20} />
             </button>
         </div>
         <div className="flex gap-2 overflow-x-auto">
            {filters.map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'text-[var(--text-secondary)] hover:bg-[var(--glass)]'}`}
                >
                    {f}
                </button>
            ))}
         </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* Days Headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
             <div key={i} className="text-center py-2 border-b border-border">
                <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">{day}</span>
             </div>
          ))}
      </div>

      {/* Sessions List (Grouped) */}
      <div className="space-y-6">
         <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-border" />
             <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">Events for {currentDate.toLocaleString('default', { month: 'long' })}</span>
             <div className="h-px flex-1 bg-border" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.length > 0 ? (
                filteredSessions.reverse().map(session => (
                    <SessionCard key={session.id} session={session} />
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-[var(--text-secondary)] border-2 border-dashed border-border rounded-xl">
                    No sessions scheduled for this month.
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