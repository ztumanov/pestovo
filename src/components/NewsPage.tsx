import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Newspaper, X } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { NewsArticle } from '../types';

export default function NewsPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { siteData } = useAdminData();
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  const news = siteData.news || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#022C22] pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-stone-500 hover:text-[#022C22] transition-colors mb-6 font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Вернуться на главную</span>
          </button>
          <div className="flex items-center space-x-3 text-[#c5a880] mb-3">
            <Newspaper className="w-6 h-6" />
            <span className="font-mono tracking-widest uppercase text-sm font-semibold">Новости и события</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#022C22] relative inline-block mb-4">
            Лента новостей
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#c5a880]"></div>
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden cursor-pointer group flex flex-col h-full"
                onClick={() => setSelectedNews(item)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white flex items-center space-x-1.5 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif leading-tight text-xl mb-3 group-hover:text-[#c5a880] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                    {item.excerpt || item.content}
                  </p>
                  <button className="text-[#c5a880] font-bold text-xs uppercase tracking-wider flex items-center space-x-2 w-max border-b border-transparent group-hover:border-[#c5a880] transition-colors pb-0.5">
                    <span>Подробнее</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-12 text-center text-stone-500 border border-dashed border-stone-300 rounded-xl bg-white">
                <Newspaper className="w-12 h-12 mx-auto text-stone-300 mb-4" />
                <p className="font-serif text-lg">Новостей пока нет</p>
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
              className="absolute inset-0 bg-[#022C22]/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedNews(null)}
            ></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="h-64 sm:h-80 w-full relative shrink-0">
                <img 
                  src={selectedNews.image} 
                  alt={selectedNews.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 text-white">
                  <div className="flex items-center space-x-2 text-[#c5a880] text-sm font-mono mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{selectedNews.date}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-serif leading-tight">
                    {selectedNews.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto bg-[#FAF9F6]">
                <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed font-sans prose-headings:font-serif prose-headings:text-[#022C22] prose-a:text-[#c5a880]">
                  {selectedNews.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
