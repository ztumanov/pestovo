import React, { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { 
  Shield, 
  Settings, 
  X, 
  Lock, 
  Sparkles, 
  RotateCcw, 
  DoorClosed,
  KeyRound,
  Eye,
  Menu
} from 'lucide-react';
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

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Setup Keyboard shortcut Ctrl + Alt + A (or Ctrl + Shift + A) to toggle secret login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф')) {
        e.preventDefault();
        if (isAdminMode) {
          setCurrentPage(prev => prev === 'admin' ? 'home' : 'admin');
        } else {
          setShowLoginModal(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode, setCurrentPage]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default pass code requested
    if (password === 'admin2026' || password === 'admin' || password === '1234') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      setCurrentPage('admin');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Неверный пароль администратора. Попробуйте "admin2026"');
    }
  };

  // Expose a global custom event or click listener trigger for footer elements
  useEffect(() => {
    const triggerLogin = () => {
      if (isAdminMode) {
        setCurrentPage('admin');
      } else {
        setShowLoginModal(true);
      }
    };

    window.addEventListener('trigger-admin-login', triggerLogin);
    return () => window.removeEventListener('trigger-admin-login', triggerLogin);
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
            className="fixed bottom-0 inset-x-0 z-[95] bg-[#022C22] border-t border-[#c5a880]/40 text-white py-3.5 px-4 sm:px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3"
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
                onClick={() => setIsAdminMode(false)}
                className="bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 hover:text-white font-semibold text-[10px] sm:text-xs px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all"
              >
                Выйти
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN PASSCODE LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#022C22] border-2 border-[#c5a880] w-full max-w-md rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
            >
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-[#c5a880]/10 rounded-full blur-2xl"></div>
              
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white transition-all bg-white/5 p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                <div className="w-12 h-12 bg-[#c5a880]/20 border border-[#c5a880] rounded-full flex items-center justify-center text-[#c5a880] shadow-inner mb-1">
                  <KeyRound className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="font-serif font-bold text-lg md:text-xl text-[#FAF9F6] tracking-wide uppercase">Скрытый вход в админку</h3>
                <p className="text-xs text-stone-300 leading-relaxed max-w-xs">
                  Введите пароль разработчика для вызова функции мгновенного редактирования всех текстов и картинок ведомства.
                </p>
                <div className="bg-white/5 border border-white/5 p-1 px-3 rounded text-[11px] text-stone-400 font-mono">
                  🔑 Подсказка: <span className="text-[#c5a880] font-bold">admin2026</span>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1.5 font-mono">Пароль Администратора</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    className="w-full bg-black/45 border border-[#c5a880]/40 rounded-xl px-4 py-3 text-sm text-center font-mono placeholder-stone-600 focus:outline-none focus:border-[#c5a880] text-white focus:ring-1 focus:ring-[#c5a880]"
                    autoFocus
                  />
                </div>

                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs text-red-400 font-medium bg-red-950/40 p-2 rounded-lg border border-red-500/20"
                  >
                    ⚠️ {loginError}
                  </motion.div>
                )}

                <div className="pt-2 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-3 rounded-xl uppercase tracking-wider transition-all font-mono"
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-[#c5a880] hover:bg-[#b0936b] text-[#022C22] font-semibold text-xs py-3 rounded-xl uppercase tracking-wider transition-all shadow"
                  >
                    Войти в Режим
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
