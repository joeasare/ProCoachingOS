
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, Hexagon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  // Login route removed, so we only hide chrome on HomePage
  const shouldHideChrome = isHomePage;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex bg-[var(--background)] min-h-screen text-[var(--text-primary)] transition-colors duration-300">
       
       {/* Mobile Top Bar - Hidden on Home */}
       {!shouldHideChrome && (
         <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-40 flex items-center px-4 justify-between">
             <div className="flex items-center gap-2">
                 <Hexagon size={24} className="text-primary fill-primary/10" strokeWidth={2} />
                 <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">PitchControl</span>
             </div>
             <button 
               onClick={() => setIsMobileMenuOpen(true)} 
               className="p-2 text-[var(--text-primary)] hover:bg-[var(--glass)] rounded-lg"
             >
                 <Menu size={24} />
             </button>
         </div>
       )}

       {/* Sidebar - Hidden on Home */}
       {!shouldHideChrome && (
         <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            setIsCollapsed={setIsSidebarCollapsed}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobile={isMobile}
         />
       )}

       {/* Main Content Area */}
       <main 
         className={`flex-1 relative overflow-y-auto min-h-screen transition-all duration-300 ${
             !shouldHideChrome && !isMobile ? 'pt-0' : (shouldHideChrome ? 'pt-0' : 'pt-16')
         } ${
             shouldHideChrome || isMobile ? 'ml-0' : (isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]')
         }`}
       >
          {children}
       </main>
    </div>
  )
}

export default Layout;
