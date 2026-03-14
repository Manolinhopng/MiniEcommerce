import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <CartProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Toaster position="bottom-right" />
        
        <Navbar 
          onCartOpen={() => setIsCartOpen(true)} 
          isDark={isDark} 
          toggleDark={() => setIsDark(!isDark)} 
        />

        <main className="container mx-auto px-6 pt-32 pb-20">
          <header className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tightest leading-tight">
              Premium <span className="text-gradient">Collection</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
              Explore our curated selection of high-quality products from the world's best brands. Quality meeting style in every item.
            </p>
          </header>

          <ProductList />
        </main>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <footer className="border-t border-slate-100 dark:border-slate-800 py-12">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
                <span className="font-black text-xs">{import.meta.env.VITE_APP_NAME?.charAt(0) || 'M'}</span>
              </div>
              <span className="font-bold tracking-tighter uppercase">{import.meta.env.VITE_APP_NAME || 'MiniShop'}</span>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              © 2026 {import.meta.env.VITE_APP_NAME || 'MiniShop'}. Created with ❤️ for premium experiences.
            </p>
            <div className="flex gap-6 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
