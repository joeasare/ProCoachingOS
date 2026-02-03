import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hash, Bell, Plus, Image, Paperclip, Smile, Send, MoreVertical, Phone, Video, Users, UserPlus, Star } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  role: string;
  avatar: string;
  content: string;
  timestamp: string;
  reactions: { emoji: string; count: number }[];
  attachments?: string[];
  isMe?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  unread: number;
  category: 'text' | 'voice';
}

const CHANNELS: Channel[] = [
  { id: '1', name: 'general', type: 'public', unread: 0, category: 'text' },
  { id: '2', name: 'announcements', type: 'public', unread: 2, category: 'text' },
  { id: '3', name: 'match-prep', type: 'public', unread: 0, category: 'text' },
  { id: '4', name: 'injury-updates', type: 'public', unread: 5, category: 'text' },
  { id: '5', name: 'tactics', type: 'private', unread: 0, category: 'text' },
  { id: '6', name: 'banter', type: 'public', unread: 0, category: 'text' },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
      { id: '1', sender: 'A. Morales', role: 'Player', avatar: 'https://images.unsplash.com/photo-1548695607-9c73430ba065?auto=format&fit=crop&q=80&w=100', content: 'Anyone have the video link from yesterday\'s session?', timestamp: '10:30 AM', reactions: [] },
      { id: '2', sender: 'J. Assistant', role: 'Coach', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100', content: 'Just uploaded it to the drive. Check the #match-prep channel.', timestamp: '10:32 AM', reactions: [{ emoji: '👍', count: 2 }] },
  ],
  '2': [
      { id: '3', sender: 'A. Ferguson', role: 'Manager', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100', content: '@channel Training moved to 9AM tomorrow due to weather. Bring rain gear.', timestamp: 'Yesterday', reactions: [{ emoji: '🌧️', count: 12 }, { emoji: '👀', count: 3 }] },
  ],
  '4': [
      { id: '4', sender: 'Head Physio', role: 'Staff', avatar: 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=100', content: 'K. Smith is cleared for full contact. Please monitor minutes.', timestamp: '9:00 AM', reactions: [{ emoji: '🙌', count: 8 }] },
  ]
};

const TeamChannel: React.FC = () => {
  const [activeChannelId, setActiveChannelId] = useState('1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = CHANNELS.find(c => c.id === activeChannelId);

  useEffect(() => {
    setMessages(MOCK_MESSAGES[activeChannelId] || []);
  }, [activeChannelId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg: Message = {
      id: Math.random().toString(),
      sender: 'A. Ferguson',
      role: 'Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100',
      content: newMessage,
      timestamp: 'Just now',
      reactions: [],
      isMe: true
    };
    
    setMessages([...messages, msg]);
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden pt-16 md:pt-0">
      
      {/* Sidebar - Channels */}
      <div className="w-64 bg-surface border-r border-border flex-col hidden md:flex">
         <div className="p-4 border-b border-border">
             <div className="flex items-center justify-between mb-4">
                 <h2 className="font-bold text-[var(--text-primary)]">Terrapins FC</h2>
                 <button className="text-[var(--text-secondary)] hover:text-primary"><Bell size={16} /></button>
             </div>
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                 <input 
                    type="text" 
                    placeholder="Jump to..." 
                    className="w-full bg-[var(--glass)] border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-primary"
                 />
             </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
             {/* Text Channels */}
             <div>
                 <div className="flex items-center justify-between px-2 mb-2 group">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Text Channels</h3>
                     <button className="text-[var(--text-secondary)] hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={12} /></button>
                 </div>
                 <div className="space-y-0.5">
                     {CHANNELS.filter(c => c.category === 'text').map(channel => (
                         <button
                            key={channel.id}
                            onClick={() => setActiveChannelId(channel.id)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg group transition-colors ${activeChannelId === channel.id ? 'bg-primary/10 text-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)]'}`}
                         >
                             <div className="flex items-center gap-2">
                                 <Hash size={14} className={activeChannelId === channel.id ? 'opacity-100' : 'opacity-50'} />
                                 <span className="text-sm font-medium">{channel.name}</span>
                             </div>
                             {channel.unread > 0 && (
                                 <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                                     {channel.unread}
                                 </span>
                             )}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Direct Messages */}
             <div>
                 <div className="flex items-center justify-between px-2 mb-2 group">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Direct Messages</h3>
                     <button className="text-[var(--text-secondary)] hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={12} /></button>
                 </div>
                 <div className="space-y-0.5">
                     {['K. Smith', 'A. Morales', 'Coach Staff', 'Physio Room'].map((name, i) => (
                         <button key={i} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)] transition-colors">
                             <div className="w-2 h-2 rounded-full bg-emerald-500" />
                             <span className="text-sm font-medium">{name}</span>
                         </button>
                     ))}
                 </div>
             </div>
         </div>

         <div className="p-4 border-t border-border bg-[var(--surface)]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-border flex items-center justify-center relative">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100" alt="Me" className="w-full h-full object-cover rounded-lg opacity-80" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface rounded-full" />
                </div>
                <div className="flex-1">
                    <div className="text-xs font-bold text-[var(--text-primary)]">A. Ferguson</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">Online</div>
                </div>
                <SettingsButton />
            </div>
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)]">
          {/* Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface/50 backdrop-blur shrink-0">
             <div className="flex items-center gap-4">
                 <Hash size={24} className="text-[var(--text-secondary)]" />
                 <div>
                     <h1 className="text-lg font-bold text-[var(--text-primary)]">{activeChannel?.name}</h1>
                     <p className="text-xs text-[var(--text-secondary)]">Topic: Team updates and general discussion.</p>
                 </div>
             </div>
             <div className="flex items-center gap-4">
                 <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-neutral-800 overflow-hidden">
                             <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=100`} className="w-full h-full object-cover" />
                         </div>
                     ))}
                     <div className="w-8 h-8 rounded-full border-2 border-surface bg-neutral-800 flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                         +12
                     </div>
                 </div>
                 <div className="h-6 w-px bg-border" />
                 <button className="text-[var(--text-secondary)] hover:text-primary"><Phone size={20} /></button>
                 <button className="text-[var(--text-secondary)] hover:text-primary"><Video size={20} /></button>
                 <button className="text-[var(--text-secondary)] hover:text-primary md:hidden"><Users size={20} /></button>
             </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <div className="w-16 h-16 rounded-full bg-[var(--glass)] flex items-center justify-center mb-4">
                      <Hash size={32} className="text-[var(--text-secondary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Welcome to #{activeChannel?.name}!</h3>
                  <p className="text-sm text-[var(--text-secondary)]">This is the start of the {activeChannel?.name} channel.</p>
              </div>

              {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 group ${msg.isMe ? 'flex-row-reverse' : ''}`}
                  >
                      <div className="w-10 h-10 rounded-xl bg-neutral-800 overflow-hidden border border-border shrink-0">
                          <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
                      </div>
                      <div className={`flex flex-col max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-sm font-bold text-[var(--text-primary)]">{msg.sender}</span>
                              <span className="text-[10px] text-[var(--text-secondary)] uppercase bg-[var(--glass)] px-1 rounded">{msg.role}</span>
                              <span className="text-[10px] text-[var(--text-secondary)]">{msg.timestamp}</span>
                          </div>
                          
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                              msg.isMe 
                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                : 'bg-[var(--surface)] border border-border text-[var(--text-primary)] rounded-tl-none'
                          }`}>
                              {msg.content}
                          </div>

                          {msg.reactions.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                  {msg.reactions.map((r, i) => (
                                      <button key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--glass)] border border-border text-[10px] text-[var(--text-secondary)] hover:border-primary/50 transition-colors">
                                          <span>{r.emoji}</span>
                                          <span className="font-bold">{r.count}</span>
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>
                      
                      {/* Hover Actions */}
                      <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1 pt-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                          <button className="p-1 rounded hover:bg-[var(--glass-hover)] text-[var(--text-secondary)]"><Smile size={14} /></button>
                          <button className="p-1 rounded hover:bg-[var(--glass-hover)] text-[var(--text-secondary)]"><MoreVertical size={14} /></button>
                      </div>
                  </motion.div>
              ))}
              <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 pt-0">
              <div className="bg-[var(--glass)] border border-border rounded-xl p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-lg">
                   <textarea 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder={`Message #${activeChannel?.name}`}
                        className="w-full bg-transparent p-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] resize-none focus:outline-none min-h-[40px] max-h-[200px]"
                        rows={1}
                   />
                   <div className="flex justify-between items-center mt-2 px-1">
                       <div className="flex gap-2 text-[var(--text-secondary)]">
                           <button className="p-1.5 rounded-lg hover:bg-[var(--glass-hover)] hover:text-primary transition-colors"><Plus size={18} /></button>
                           <button className="p-1.5 rounded-lg hover:bg-[var(--glass-hover)] hover:text-primary transition-colors"><Image size={18} /></button>
                           <button className="p-1.5 rounded-lg hover:bg-[var(--glass-hover)] hover:text-primary transition-colors"><Paperclip size={18} /></button>
                           <button className="p-1.5 rounded-lg hover:bg-[var(--glass-hover)] hover:text-primary transition-colors"><Smile size={18} /></button>
                       </div>
                       <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                           <Send size={16} />
                       </button>
                   </div>
              </div>
              <div className="text-center mt-2">
                  <span className="text-[10px] text-[var(--text-secondary)]">
                      <strong>Tip:</strong> You can use markdown for formatting. **bold**, *italic*, `code`.
                  </span>
              </div>
          </div>
      </div>

      {/* Right Sidebar - Info (Hidden on small screens) */}
      <div className="w-72 bg-surface border-l border-border hidden xl:flex flex-col">
          <div className="p-6 border-b border-border">
              <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider mb-4">Channel Info</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  Official team channel for general updates, schedule changes, and team-wide announcements.
              </p>
              <div className="flex gap-2">
                   <button className="flex-1 py-1.5 rounded border border-border text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--glass)]">
                       Pinned
                   </button>
                   <button className="flex-1 py-1.5 rounded border border-border text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--glass)]">
                       Files
                   </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Members</h3>
                   <span className="text-xs text-[var(--text-secondary)]">24 Online</span>
              </div>
              
              <div className="space-y-4">
                  {['Coaching Staff', 'Goalkeepers', 'Defenders', 'Midfielders', 'Forwards'].map((role) => (
                      <div key={role}>
                          <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase opacity-70 mb-2">{role}</h4>
                          <div className="space-y-2">
                              {[1,2,3].map(i => (
                                  <div key={i} className="flex items-center gap-3 group cursor-pointer hover:bg-[var(--glass)] p-1.5 rounded-lg -mx-1.5 transition-colors">
                                      <div className="w-8 h-8 rounded bg-neutral-800 border border-border overflow-hidden relative">
                                          <img src={`https://images.unsplash.com/photo-${1500000000000 + (Math.random()*1000)}?w=100`} className="w-full h-full object-cover" />
                                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-surface rounded-full" />
                                      </div>
                                      <div>
                                          <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-primary transition-colors">Player Name</div>
                                          <div className="text-[10px] text-[var(--text-secondary)]">Playing FIFA</div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

// Helper for sidebar
const SettingsButton = () => (
    <button className="text-[var(--text-secondary)] hover:text-primary transition-colors">
        <MoreVertical size={16} />
    </button>
);

export default TeamChannel;