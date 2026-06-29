import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { Star, ArrowLeft, MessageSquare, Sparkles, Filter, Home, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestimonialsPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { siteData, isAdminMode, setCurrentPage, setActiveSettingsTab } = useAdminData();
  const testimonials = siteData.testimonials;

  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter testimonials based on selected rating & search query
  const filteredTestimonials = testimonials.filter(t => {
    const matchesRating = ratingFilter === 'all' || t.rating === ratingFilter;
    const matchesSearch = t.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans selection:bg-[#c5a880]/30">
      
      {/* HEADER HERO */}
      <div className="bg-[#022C22] text-white py-16 px-4 relative overflow-hidden border-b border-[#c5a880]/30 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={onBackToHome}
            className="group flex items-center space-x-2 border border-white/10 hover:border-[#c5a880]/40 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all text-[#c5a880] mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#c5a880] group-hover:-translate-x-1 transition-transform" />
            <span>Вернуться на главную</span>
          </button>

          <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold block">Полная книга отзывов</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black mt-3 tracking-tight">
            Истории наших гостей
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
            Искренние отзывы, слова благодарности, напутствия и очерки от отдыхающих, ветеранов и сотрудников Федеральной таможенной службы России о пребывании в санатории «Ясная Поляна» в Гаспре.
          </p>
        </div>
      </div>

      {/* FILTER & TOOLS BAR */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Rating Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#c5a880]" />
              Фильтр:
            </span>
            <button
              onClick={() => setRatingFilter('all')}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                ratingFilter === 'all'
                  ? 'bg-[#022C22] text-[#FAF9F6] border-[#022C22]'
                  : 'bg-transparent text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              Все отзывы ({testimonials.length})
            </button>
            {[5, 4, 3].map((star) => {
              const count = testimonials.filter(t => t.rating === star).length;
              return (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all border flex items-center gap-1 cursor-pointer ${
                    ratingFilter === star
                      ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold'
                      : 'bg-transparent text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{star} ★</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Text Search Input */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Поиск по отзывам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-stone-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-[#c5a880]/80 focus:ring-1 focus:ring-[#c5a880]/80"
            />
          </div>

        </div>
      </div>

      {/* REVIEWS GRID AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Admin Float Helper */}
        {isAdminMode && (
          <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-sm flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <span className="p-1 bg-amber-400 rounded text-stone-900 font-bold text-[10px] uppercase font-mono shadow-sm">ADMIN</span>
              <span>Вы находитесь в режиме администратора. Вы можете удалять или дополнять отзывы.</span>
            </div>
            <button 
              onClick={() => {
                setActiveSettingsTab('testimonials');
                setCurrentPage('admin');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-500 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded transition-all shadow-sm shrink-0 cursor-pointer"
            >
              Редактировать в админке
            </button>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filteredTestimonials.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTestimonials.map((t, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                  key={t.id}
                  className="bg-white border border-stone-200/80 p-6 sm:p-8 rounded-sm relative flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    {/* Quotation mark decoration */}
                    <span className="absolute top-6 right-8 font-serif text-6xl text-stone-100 leading-none select-none select-none">“</span>
                    
                    {/* Stars */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      {[...Array(5 - t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-stone-200" />
                      ))}
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                      «{t.text}»
                    </p>
                  </div>

                  {/* Author line */}
                  <div className="border-t border-stone-100 pt-4 mt-auto">
                    <h4 className="font-serif font-bold text-sm text-[#022C22]">{t.author}</h4>
                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-wider mt-1.5 uppercase">
                      <span>{t.role}</span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded border border-stone-200 max-w-xl mx-auto shadow-inner"
            >
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-lg text-stone-700">Отзывы не найдены</h3>
              <p className="text-xs text-stone-400 mt-2">
                Попробуйте изменить параметры фильтрации или поисковый запрос.
              </p>
              <button
                onClick={() => {
                  setRatingFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-xs font-bold uppercase tracking-wider text-[#c5a880] border border-stone-200 bg-white hover:bg-stone-50 py-2 px-4 rounded-sm transition-all shadow-sm cursor-pointer"
              >
                Сбросить поиск
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-20 border-t border-stone-200 pt-16 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 bg-[#c5a880]/15 border border-[#c5a880] rounded-full flex items-center justify-center text-[#c5a880] mx-auto text-lg mb-4">
            ✍️
          </div>
          <h3 className="font-serif font-black text-xl text-[#022C22]">Добавить свой отзыв</h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 mb-6 leading-relaxed">
            Ваши отзывы помогают делать лечение и гостеприимство в санатории еще качественнее. Нажмите кнопку ниже, чтобы вернуться на главную страницу и заполнить форму обратной связи.
          </p>
          <button
            onClick={() => {
              onBackToHome();
              // Scroll to review form after back to home
              setTimeout(() => {
                const element = document.getElementById('booking');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 400);
            }}
            className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] p-4 text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#c5a880]" />
            Поделиться своими впечатлениями
          </button>
        </div>

      </div>

      {/* FOOTER BAR */}
      <footer className="bg-stone-100 border-t border-stone-200 py-6 text-center">
        <p className="text-[10px] text-stone-400 font-mono tracking-wide uppercase">
          Санаторий ФТС России «Ясная Поляна» • Гаспра 2026
        </p>
      </footer>

    </div>
  );
}
