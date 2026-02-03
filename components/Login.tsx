
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Landing3D from './Landing3D'; // Reusing the 3D background
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        addToast('Please enter credentials', 'error');
        return;
    }

    setIsSubmitting(true);
    try {
        await login(email);
        addToast('Welcome back, Coach.', 'success');
        navigate('/dashboard');
    } catch (error) {
        addToast('Authentication failed', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--background)]">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-50">
        <Landing3D theme={theme} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-[var(--surface)]/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-8">
                <div className="relative">
                    <Hexagon size={48} className="text-primary fill-primary/10" strokeWidth={1.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                </div>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">PitchControl OS</h1>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mt-2">Restricted Access // Staff Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5 ml-1">Identity</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="coach@terps.edu"
                        className="w-full bg-[var(--background)] border border-border rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-1.5 ml-1">Key</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[var(--background)] border border-border rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-primary text-primary-foreground h-12 rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>Initialize Session <ArrowRight size={16} /></>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <span className="text-[10px] text-[var(--text-secondary)]">v2.0.4 Secure Connection</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
