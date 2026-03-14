import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Moon, Sun, Laptop } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartOpen, isDark, toggleDark }) => {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between px-6 py-3 rounded-3xl transition-all duration-300 ${
          scrolled ? 'glass' : 'bg-transparent'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter dark:text-white">
              {(import.meta.env.VITE_APP_NAME || 'MiniShop').slice(0, 4)}<span className="text-primary-600">{(import.meta.env.VITE_APP_NAME || 'MiniShop').slice(4)}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDark}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCartOpen}
              className="relative bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl active:scale-95 transition-all hover:bg-primary-600 dark:hover:bg-primary-400"
            >
              <ShoppingBag size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-950 font-black animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
