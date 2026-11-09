import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Newspaper, X, User, Home, ChevronRight, ArrowRight } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { NewsArticle } from '../types';
import NewsArticleContent from './NewsArticleContent';

export default function NewsPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { siteData } = useAdminData();
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const news = siteData.news || [];
  const categories = Array.from(new Set(news.map((n) => n.categoryLabel).filter(Boolean))) as string[];

  const filteredNews = activeCategory === 'all'
    ? news
    : news.filter((item) => item.categoryLabel === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#022C22] font-sans selection:bg-[#c5a880]/30">
      {/* Institutional Hero Header */}
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
              <span className="text-[#c5a880] font-semibold">Новости и события</span>
              {selectedNews && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-white font-medium truncate max-w-[220px] sm:max-w-xs">{selectedNews.title}</span>
                </>
              )}
            </nav>

            <button
              onClick={onBackToHome}
              className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-[#c5a880] hover:text-white border border-[#c5a880]/40 hover:border-[#c5a880] px-4 py-2 rounded-lg transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>На главную</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[#c5a880] mb-3">
              <Newspaper className="w-4 h-4" />
              <span className="font-mono tracking-[0.2em] uppercase text-xs font-semibold">
                Официальный пресс-центр • ФГКУ «Санаторий «Ясная Поляна» ФТС России»
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-[1.12] mb-4">
              Новости и события здравницы
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-[65ch]">
              Актуальные материалы о развитии медицинской базы, внедрении нового диагностического оборудования, сезонных программах оздоровления и жизни санатория.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category Filter Bar */}
        {categories.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-6 border-b border-stone-200">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-[#022C22] text-[#c5a880] border-[#022C22]'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-[#c5a880]/60 hover:text-[#022C22]'
                }`}
              >
                Все публикации ({news.length})
              </button>
              {categories.map((cat) => {
                const count = news.filter((n) => n.categoryLabel === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-[#022C22] text-[#c5a880] border-[#022C22]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-[#c5a880]/60 hover:text-[#022C22]'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-mono tabular-nums text-stone-500">
              Показано публикаций: <strong className="text-[#022C22]">{filteredNews.length}</strong>
            </div>
          </div>
        )}

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredNews.length > 0 ? (
            filteredNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white rounded-xl border border-stone-200/90 hover:border-[#c5a880]/70 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full justify-between"
                onClick={() => setSelectedNews(item)}
              >
                <div>
                  <div className="h-56 overflow-hidden relative bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3.5 left-6 right-6 flex items-center justify-between text-white text-xs font-mono tabular-nums">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>{item.date}</span>
                      </span>
                      {item.readTime && <span className="text-stone-200">{item.readTime}</span>}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pb-4">
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100 text-[11px] font-mono uppercase tracking-widest text-[#9b7b51]">
                      <span>{item.categoryLabel || 'События санатория'}</span>
                      <span className="tabular-nums text-stone-400">№ {String(index + 1).padStart(2, '0')}</span>
                    </div>

                    <h3 className="font-serif font-bold leading-snug text-xl text-[#022C22] mb-3 group-hover:text-[#9b7b51] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                      {item.excerpt || item.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...'}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-7 pb-6 pt-4 mt-auto border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[#022C22] group-hover:text-[#9b7b51] font-bold text-xs uppercase tracking-widest transition-colors">
                    Читать материал
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#c5a880] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-stone-500 border border-dashed border-stone-300 rounded-xl bg-white">
              <Newspaper className="w-12 h-12 mx-auto text-stone-300 mb-4" />
              <p className="font-serif text-lg text-[#022C22]">В данной рубрике новостей пока нет</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-[#022C22]/85 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedNews(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#c5a880]/30 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#022C22]/80 hover:bg-[#022C22] text-white border border-[#c5a880]/40 rounded-lg flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm cursor-pointer"
                aria-label="Закрыть публикацию"
              >
                <X className="w-5 h-5 text-[#c5a880]" />
              </button>

              <div className="h-64 sm:h-80 w-full relative shrink-0">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/95 via-[#022C22]/45 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 text-white">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums mb-3 text-[#c5a880]">
                    {selectedNews.categoryLabel && (
                      <span className="uppercase tracking-widest font-bold">
                        {selectedNews.categoryLabel}
                      </span>
                    )}
                    <span className="text-white/40">•</span>
                    <span className="flex items-center text-stone-200">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-[#c5a880]" />
                      {selectedNews.date}
                    </span>
                    {selectedNews.author && (
                      <>
                        <span className="text-white/40">•</span>
                        <span className="flex items-center text-stone-300">
                          <User className="w-3.5 h-3.5 mr-1.5 text-[#c5a880]" />
                          {selectedNews.author}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
                    {selectedNews.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-10 overflow-y-auto bg-[#FAF9F6]">
                {selectedNews.summary && (
                  <p className="text-base sm:text-lg font-serif font-medium text-[#022C22] leading-relaxed border border-[#c5a880]/40 bg-white p-5 rounded-xl mb-8">
                    {selectedNews.summary}
                  </p>
                )}
                <NewsArticleContent content={selectedNews.content} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
