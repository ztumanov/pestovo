import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { Star, ArrowLeft, MessageSquare, Sparkles, Filter, Home, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestimonialsPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { siteData, isAdminMode, setCurrentPage, setActiveSettingsTab } = useAdminData();
  const testimonials = siteData.testimonials;
  const publishedTestimonials = isAdminMode ? testimonials : testimonials.filter(t => t.isApproved !== false);

  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter testimonials based on selected rating & search query
  const filteredTestimonials = publishedTestimonials.filter(t => {
    const matchesRating = ratingFilter === 'all' || t.rating === ratingFilter;
    const matchesSearch = t.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans selection:bg-[#c5a880]/30">
      
      {/* HEADER HERO */}
      <div className="bg-[#022C22] text-white py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden border-b border-[#c5a880]/30">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Unified Breadcrumbs & Back Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs font-sans text-stone-300">
              <button
                onClick={onBackToHome}
                className="hover:text-[#c5a880] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Главная</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-stone-400">О санатории</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[#c5a880] font-semibold">Книга отзывов отдыхающих</span>
            </nav>

            <button 
              onClick={onBackToHome}
              className="group inline-flex items-center space-x-2 border border-[#c5a880]/40 hover:border-[#c5a880] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-[#c5a880] hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#c5a880] group-hover:-translate-x-1 transition-transform" />
              <span>На главную</span>
            </button>
          </div>

          <span className="text-[#c5a880] text-xs font-mono uppercase tracking-[0.2em] font-semibold block">
            Официальная книга отзывов • ФГКУ «Санаторий «Ясная Поляна» ФТС России»
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3 tracking-tight leading-[1.12]">
            Истории и впечатления наших гостей
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-4 leading-relaxed max-w-[65ch]">
            Искренние отзывы, слова благодарности и очерки от отдыхающих, ветеранов и сотрудников Федеральной таможенной службы России о лечении и пребывании в санатории «Ясная Поляна» в Гаспре.
          </p>
        </div>
      </div>

      {/* 152-FZ COMPLIANCE NOTICE */}
      <div className="bg-emerald-950/5 border-b border-stone-200 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-xs text-stone-700 font-sans">
          <ShieldCheck className="w-4 h-4 text-[#022C22] shrink-0" />
          <span>
            <strong className="text-[#022C22]">Соблюдение № 152-ФЗ:</strong> В соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и нормами врачебной тайны, все отзывы публикуются исключительно в обезличенном формате без раскрытия персональных сведений и деталей диагнозов.
          </span>
        </div>
      </div>

      {/* FILTER & TOOLS BAR */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Rating Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2 flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#c5a880]" />
              Оценка:
            </span>
            <button
              onClick={() => setRatingFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer whitespace-nowrap font-mono tabular-nums ${
                ratingFilter === 'all'
                  ? 'bg-[#022C22] text-[#c5a880] border-[#022C22]'
                  : 'bg-transparent text-stone-600 border-stone-200 hover:border-[#c5a880]/60 hover:bg-stone-50'
              }`}
            >
              Все отзывы ({publishedTestimonials.length})
            </button>
            {[5, 4, 3].map((star) => {
              const count = publishedTestimonials.filter(t => t.rating === star).length;
              return (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border flex items-center gap-1.5 cursor-pointer whitespace-nowrap font-mono tabular-nums ${
                    ratingFilter === star
                      ? 'bg-[#022C22] text-[#c5a880] border-[#022C22] font-bold'
                      : 'bg-transparent text-stone-600 border-stone-200 hover:border-[#c5a880]/60 hover:bg-stone-50'
                  }`}
                >
                  <span>{star} ★</span>
                  <span className="text-[11px] opacity-75">({count})</span>
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
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#022C22] transition-colors"
            />
          </div>

        </div>
      </div>

      {/* REVIEWS GRID AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        
        {/* Admin Float Helper */}
        {isAdminMode && (
          <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-xl flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <span className="px-2 py-0.5 bg-amber-400 rounded text-stone-900 font-bold text-[10px] uppercase font-mono">ADMIN</span>
              <span>Вы находитесь в режиме администратора. Вы можете модерировать, удалять или дополнять отзывы.</span>
            </div>
            <button 
              onClick={() => {
                setActiveSettingsTab('testimonials');
                setCurrentPage('admin');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-500 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg transition-all shadow-sm shrink-0 cursor-pointer"
            >
              Редактировать в админке
            </button>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filteredTestimonials.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            >
              {filteredTestimonials.map((t, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                  key={t.id}
                  className="bg-white border border-stone-200/90 hover:border-[#c5a880]/60 p-7 sm:p-8 rounded-xl relative flex flex-col justify-between h-full shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
                      {/* Stars */}
                      <div className="flex items-center space-x-1">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#c5a880] text-[#c5a880]" />
                        ))}
                        {[...Array(5 - t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-stone-200" />
                        ))}
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-stone-400">
                        № {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed mb-6">
                      «{t.text}»
                    </p>
                  </div>

                  {/* Author line */}
                  <div className="border-t border-stone-100 pt-4 mt-auto">
                    <h4 className="font-serif font-bold text-base text-[#022C22]">{t.author}</h4>
                    <div className="flex justify-between items-center text-xs text-stone-500 font-sans mt-1.5 gap-2">
                      <span>{t.role}</span>
                      <span className="font-mono tabular-nums text-stone-600 shrink-0">{t.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-xl border border-stone-200 max-w-xl mx-auto shadow-sm"
            >
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-lg text-[#022C22]">Отзывы не найдены</h3>
              <p className="text-xs text-stone-600 mt-2 font-sans">
                Попробуйте изменить параметры фильтрации или поисковый запрос.
              </p>
              <button
                onClick={() => {
                  setRatingFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-xs font-bold uppercase tracking-wider text-[#022C22] border border-[#c5a880] bg-white hover:bg-[#FAF9F6] py-2.5 px-5 rounded-lg transition-all cursor-pointer font-sans"
              >
                Сбросить фильтр
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-20 border-t border-stone-200 pt-16 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 bg-[#022C22] border border-[#c5a880]/40 rounded-xl flex items-center justify-center text-[#c5a880] mx-auto mb-5">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#022C22]">Оставить отзыв о пребывании</h3>
          <p className="text-sm text-stone-600 mt-3 mb-8 leading-relaxed font-sans max-w-[60ch] mx-auto">
            Ваши отзывы помогают нам поддерживать высокий стандарт санаторно-курортного лечения и гостеприимства. Нажмите кнопку ниже, чтобы перейти к форме отправки отзыва.
          </p>
          <button
            onClick={() => {
              onBackToHome();
              setTimeout(() => {
                const element = document.getElementById('booking');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 400);
            }}
            className="bg-[#022C22] hover:bg-[#033E31] text-white border border-[#c5a880]/40 px-7 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-lg shadow-md cursor-pointer inline-flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-[#c5a880]" />
            <span>Поделиться впечатлениями</span>
          </button>
        </div>

      </div>

      {/* FOOTER BAR */}
      <footer className="bg-stone-100 border-t border-stone-200 py-6 text-center">
        <p className="text-[11px] text-stone-500 font-mono tabular-nums tracking-wider uppercase">
          ФГКУ «Санаторий «Ясная Поляна» ФТС России» • ПГТ Гаспра • 2026
        </p>
      </footer>

    </div>
  );
}
