import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';

const products: Product[] = [
  {
    id: '1',
    name: 'Obsidian Coat',
    price: '€1,200',
    slug: 'obsidian-coat',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=987&auto=format&fit=crop',
    collection: 'Outerwear'
  },
  {
    id: '2',
    name: 'Vapor Silk Dress',
    price: '€890',
    slug: 'vapor-dress',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1083&auto=format&fit=crop',
    collection: 'Dresses'
  },
  {
    id: '3',
    name: 'Carbon Heel',
    price: '€650',
    slug: 'carbon-heel',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600&auto=format&fit=crop',
    collection: 'Footwear'
  },
  {
    id: '4',
    name: 'Structure Blazer',
    price: '€1,450',
    slug: 'structure-blazer',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1057&auto=format&fit=crop',
    collection: 'Tailoring'
  }
];

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group relative flex flex-col ${index % 2 === 0 ? 'md:mt-0' : 'md:mt-32'}`}
    >
      <div className="relative overflow-hidden cursor-none">
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 aspect-[3/4] overflow-hidden"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          {/* Overlay glow on hover */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      </div>

      <div className="mt-6 flex justify-between items-end border-b border-white/20 pb-2">
        <div>
          <h3 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight leading-none group-hover:text-transparent group-hover:outline-text transition-all duration-300" 
              style={{ WebkitTextStroke: '1px white' }}>
            {product.name}
          </h3>
          <p className="text-xs uppercase tracking-[0.2em] mt-2 text-white/60">{product.collection}</p>
        </div>
        <span className="text-sm font-mono">{product.price}</span>
      </div>
      
      {/* Blueprint lines */}
      <div className="absolute -left-4 top-0 h-full w-[1px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -right-4 top-0 h-full w-[1px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const ProductGrid: React.FC = () => {
  return (
    <section className="bg-black text-white min-h-screen py-32 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 flex items-center justify-between">
           <h2 className="text-[10vw] leading-[0.8] font-display font-bold uppercase opacity-20 select-none">Objects</h2>
           <div className="hidden md:block w-32 h-[1px] bg-white/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;