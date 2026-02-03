import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-12 border-t border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold tracking-tighter uppercase">VOID</h2>
            <div className="text-xs text-white/40 max-w-xs leading-relaxed">
                EPHEMERAL STRUCTURES FOR THE MODERN ENTITY.
                <br/>
                DESIGNED IN THE ETHER.
            </div>
        </div>

        <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">
                <Instagram size={20} strokeWidth={1.5} />
            </a>
            <span className="text-[10px] tracking-widest text-white/40">© 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;