import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Building
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage({ onBackToHome }: { onBackToHome: () => void }) {
  const {
    setIsAdminMode,
    setCurrentPage,
    siteData,
    updateSection
  } = useAdminData();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate standard secure authorization delay
    setTimeout(() => {
      const lowerUser = username.trim().toLowerCase();
      const usersList = siteData.users || [];
      
      const foundUser = usersList.find(u => u.username.trim().toLowerCase() === lowerUser);

      if (foundUser && foundUser.password === password) {
        setIsSuccess(true);
        // Save last login time and store credentials for server sync
        try {
          localStorage.setItem('pestovo_resort_admin_credentials', JSON.stringify({ username: foundUser.username, password }));
          const updatedUsers = usersList.map(u => {
            if (u.id === foundUser.id) {
              return { ...u, lastLogin: new Date().toLocaleString('ru-RU') };
            }
            return u;
          });
          updateSection('users', updatedUsers);
        } catch (err) {}

        setTimeout(() => {
          setIsAdminMode(true);
          setCurrentPage('admin');
        }, 1000);
      } else {
        setIsLoading(false);
        if (!foundUser) {
          setError('Пользователь с таким логином не найден в системе ведомства.');
        } else {
          setError('Неверный пароль администратора. Пожалуйста, проверьте вводимые данные.');
        }
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 flex flex-col justify-between font-sans relative overflow-hidden selection:bg-[#c5a880]/30 selection:text-[#022C22]">
      {/* Elegantly styled top background graphic pattern */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#022C22]/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#022C22]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="group flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-500 hover:text-[#022C22] transition-colors duration-200 outline-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Вернуться на сайт</span>
        </button>

        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-[#c5a880]" />
          <span className="font-serif text-xs font-bold tracking-widest text-[#022C22] uppercase">
            ФТС РОССИИ
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden"
          >
            {/* Upper part of card with deep brand coloring */}
            <div className="bg-[#022C22] p-8 text-white relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#034D3C] via-[#022C22] to-[#011410] opacity-80"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 bg-[#c5a880]/20 border border-[#c5a880]/30 rounded-2xl flex items-center justify-center text-[#c5a880] shadow-lg mb-4">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <h1 className="font-serif font-extrabold text-xl md:text-2xl tracking-wide uppercase text-white">
                  Авторизация сотрудника
                </h1>
                <p className="text-xs text-stone-300 mt-2 max-w-xs mx-auto leading-relaxed">
                  Личный кабинет управления веб-ресурсом ФГКУ «Санаторий «Ясная Поляна» ФТС России.
                </p>
              </div>
            </div>

            {/* Inner Form content */}
            <div className="p-8 space-y-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#022C22]">Вход выполнен успешно</h3>
                    <p className="text-xs text-stone-500 mt-1">Перенаправление в панель управления сайтом...</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Login Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                      Имя пользователя / Логин
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        disabled={isLoading}
                        placeholder="Например, admin"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (error) setError('');
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#c5a880] focus:bg-white transition-all focus:ring-1 focus:ring-[#c5a880] disabled:opacity-50"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                        Пароль сотрудника
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={isLoading}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError('');
                        }}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-10 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#c5a880] focus:bg-white transition-all focus:ring-1 focus:ring-[#c5a880] disabled:opacity-50 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2"
                    >
                      <span>⚠️</span>
                      <span className="leading-normal">{error}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#022C22] hover:bg-[#034D3C] text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none relative flex items-center justify-center font-mono"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-[#c5a880]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Проверка данных...</span>
                      </div>
                    ) : (
                      'Войти в систему'
                    )}
                  </button>
                </form>
              )}

              {/* Demo Hint Banner */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-1 text-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#c5a880]">Доступ администратора:</span>
                <p className="text-stone-600 leading-relaxed font-mono text-[11px]">
                  👤 Логин: <span className="font-bold text-stone-800">admin</span>
                </p>
                <p className="text-stone-600 leading-relaxed font-mono text-[11px]">
                  🔑 Пароль: <span className="font-bold text-stone-800">admin2026</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full text-center py-6 border-t border-stone-200 bg-stone-100/50">
        <p className="text-[10px] text-stone-500 font-mono tracking-wider">
          © {new Date().getFullYear()} ФГКУ «Санаторий «Ясная Поляна» ФТС России. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
        </p>
      </footer>
    </div>
  );
}
