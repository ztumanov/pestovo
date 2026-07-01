import React, { useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminFloatBar() {
  const {
    isAdminMode,
    setIsAdminMode,
    currentPage,
    setCurrentPage,
    resetToDefault,
    setActiveSettingsTab
  } = useAdminData();

  // Setup Keyboard shortcut Ctrl + Alt + A to toggle page or go to login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф')) {
        e.preventDefault();
        if (isAdminMode) {
          setCurrentPage(prev => prev === 'admin' ? 'home' : 'admin');
        } else {
          setCurrentPage('login');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode, setCurrentPage]);

  // Expose a global custom event or click listener trigger for footer elements
  useEffect(() => {
    const triggerLogin = () => {
      if (isAdminMode) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('login');
      }
    };

    window.addEventListener('trigger-admin-login', triggerLogin);
    return () => window.removeEventListener('trigger-admin-login', triggerLogin);
  }, [isAdminMode, setCurrentPage]);

  // Securely listen for specific URL address bar parameters (?admin, ?control, ?edit, etc.)
  useEffect(() => {
    const handleUrlCheck = () => {
      const search = window.location.search;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(search);
      
      const hasAdminQuery = searchParams.has('admin') || searchParams.has('control') || searchParams.has('edit') || searchParams.has('editor') || searchParams.has('secret') || searchParams.has('login') || searchParams.has('auth');
      const hasAdminHash = hash === '#admin' || hash === '#admin-login' || hash === '#admin-control' || hash === '#login' || hash === '#auth';
      
      if (hasAdminQuery || hasAdminHash) {
        if (isAdminMode) {
          setCurrentPage('admin');
        } else {
          setCurrentPage('login');
        }
      }
    };

    // Initial check on load
    handleUrlCheck();

    // Listen to route/hash changes in the address bar
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);
    
    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, [isAdminMode, setCurrentPage]);

  return (
    <>
      {/* FLOATING STATUS BAR FOR LOGGED IN ADMIN */}
      <AnimatePresence>
        {isAdminMode && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-0 inset-x-0 z-[95] bg-[#022C22] border-t border-[#c5a880]/40 text-white py-3.5 px-4 sm:px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3 font-sans"
          >
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <span className="font-serif font-bold text-xs tracking-wider uppercase text-[#c5a880] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Редактор Ясной Поляны Активен
                </span>
                <p className="text-[10px] text-stone-300 font-mono mt-0.5">Вам доступны кнопки «Редактировать» у каждого блока и разделов на сайте.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button 
                onClick={() => {
                  setCurrentPage('admin');
                  setActiveSettingsTab('hero');
                }}
                className="bg-[#c5a880] hover:bg-[#b0936b] text-[#022C22] font-semibold text-[10px] sm:text-xs px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all shadow active:scale-95"
              >
                ⚙️ Панель Редактора
              </button>
              
              <button 
                onClick={resetToDefault}
                className="bg-black/40 hover:bg-black/60 border border-stone-500/30 text-stone-300 hover:text-white font-semibold text-[10px] sm:text-xs px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all"
                title="Откатить все изменения к оригинальной версии"
              >
                Сбросить сайт
              </button>

              <button 
                onClick={() => {
                  setIsAdminMode(false);
                  setCurrentPage('home');
                }}
                className="bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 hover:text-white font-semibold text-[10px] sm:text-xs px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all"
              >
                Выйти
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
