import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Roster from './components/Roster';
import Schedule from './components/Schedule'; 
import TacticalField from './components/TacticalField';
import DrillLibrary from './components/DrillLibrary'; 
import PracticePlanner from './components/PracticePlanner'; 
import MatchDetail from './components/MatchDetail';
import Settings from './components/Settings';
import TeamChannel from './components/TeamChannel';
import CustomCursor from './components/CustomCursor';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Simple Error Boundary
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-black text-white">
          <div className="text-center">
             <h2 className="text-2xl font-bold mb-2">System Critical</h2>
             <p className="text-neutral-500">Please reload the interface.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <HashRouter>
              <CustomCursor />
              <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    
                    {/* App Routes (Now Open) */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/roster" element={<Roster />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/match/:id" element={<MatchDetail />} />
                    <Route path="/drills" element={<DrillLibrary />} /> 
                    <Route path="/planning" element={<PracticePlanner />} />
                    <Route path="/team" element={<TeamChannel />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Tactics Route */}
                    <Route path="/tactics" element={
                      <div className="h-[calc(100vh-64px)] md:h-screen w-full p-4 md:p-6 pb-20 flex flex-col">
                          <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Tactics Board</h1>
                            <div className="text-xs md:text-sm text-[var(--text-secondary)] font-mono">LIVE SESSION</div>
                          </div>
                          <div className="flex-1 glass-panel rounded-xl overflow-hidden border border-border relative bg-black">
                            <TacticalField />
                          </div>
                      </div>
                    } />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </HashRouter>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;