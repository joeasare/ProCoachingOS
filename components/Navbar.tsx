import React from 'react';
import { NavLink } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const links: NavLink[] = [
  { label: 'ARCHIVE', href: '/archive' },
  { label: 'VOID', href: '/void' },
  { label: 'ESSENCE', href: '/essence' },
];

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-start z-50 mix-blend-difference text-white">
      <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter uppercase font-display group">
        <span className="inline-block group-hover:scale-110 transition-transform duration-500">VOID</span>
        <span className="text-[10px] block font-sans font-light tracking-widest opacity-60">EST. 2025</span>
      </Link>

      <div className="flex flex-col items-end space-y-2">
        {links.map((link) => (
          <Link
            key={link.label}
            to="#"
            className="text-xs md:text-sm tracking-[0.2em] font-light hover:opacity-0 transition-opacity duration-700 relative group"
          >
            {link.label}
            <span className="absolute right-0 top-1/2 h-[1px] w-0 bg-white group-hover:w-full transition-all duration-500 ease-out" />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;