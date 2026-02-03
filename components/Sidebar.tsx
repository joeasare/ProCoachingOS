import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, Settings, CalendarDays, Clipboard, Hexagon, Sun, Moon, ChevronRight, BookOpen, Layers, X, Home, MessageSquare } from 'lucide-react';
import { NavItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: NavItem[] = [
  { icon: Home, label: 'Vision', path: '/' },
  { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: Clipboard, label: 'Tactics Board', path: '/tactics' },
  { icon: Layers, label: 'Practice Plan', path: '/planning' },
  { icon: BookOpen, label: 'Drill Library', path: '/drills' },
  { icon: Users, label: 'Team Roster', path: '/roster' },
  { icon: CalendarDays, label: 'Schedule', path: '/schedule' },
  { icon: MessageSquare, label: 'Team Comms', path: '/team' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  isMobile 
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // On mobile, we force expanded width when open, otherwise hidden
  const sidebarWidth = isMobile ? 280 : (isCollapsed ? 80 : 280);
  const sidebarX = isMobile ? (isMobileMenuOpen ? 0 : -280) : 0;

  return (
    <>
      <motion.aside 
        initial={false}
        animate={{ 
          width: isMobile ? 280 : sidebarWidth,
          x: sidebarX
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-surface border-r border-border flex flex-col z-50 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="h-16 md:h-20 flex items-center px-6 border-b border-border justify-between shrink-0">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
                navigate('/');
                if (isMobile) setIsMobileMenuOpen(false);
            }}
          >
              <div className="relative group-hover:scale-110 transition-transform">
                  <Hexagon size={28} className="text-primary fill-primary/10" strokeWidth={2} />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
              </div>
              
              <AnimatePresence mode='wait'>
                  {(!isCollapsed || isMobile) && (
                      <motion.div 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: -10 }}
                          className="flex flex-col"
                      >
                          <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
                          PitchControl
                          </span>
                          <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono">Pro Suite v2.0</span>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-secondary)]">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-[-12px] top-24 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-primary z-50 shadow-md"
          >
            <ChevronRight size={14} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[var(--glass-hover)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={20} 
                    strokeWidth={isActive ? 2 : 1.5} 
                    className={`min-w-[20px] transition-colors ${isActive ? 'text-primary' : 'text-current'}`} 
                  />
                  
                  <AnimatePresence>
                      {(!isCollapsed || isMobile) && (
                          <motion.span 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="ml-3 text-sm font-medium tracking-wide whitespace-nowrap"
                          >
                          {item.label}
                          </motion.span>
                      )}
                  </AnimatePresence>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Controls */}
        <div className="p-4 border-t border-border space-y-2 shrink-0">
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text-primary)] transition-colors ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
          >
             {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             {(!isCollapsed || isMobile) && <span className="text-xs font-medium">Toggle Theme</span>}
          </button>

          <div 
             className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-default ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
          >
              <div className="w-8 h-8 min-w-[32px] rounded-full bg-neutral-800 border border-border overflow-hidden relative">
                  <img 
                      src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"} 
                      alt="User" 
                      className="w-full h-full object-cover opacity-90"
                  />
              </div>
              {(!isCollapsed || isMobile) && (
                  <div className="overflow-hidden flex-1">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user?.name || 'Coach'}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider truncate">{user?.role || 'Staff'}</p>
                  </div>
              )}
          </div>
        </div>
      </motion.aside>
      
      {/* Mobile Backdrop */}
      {isMobile && isMobileMenuOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}
    </>
  );
};

export default Sidebar;