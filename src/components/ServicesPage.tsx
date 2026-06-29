import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Sparkles, 
  Check, 
  Phone, 
  Stethoscope, 
  Clock, 
  ShieldCheck, 
  Droplet, 
  Waves, 
  Wind, 
  Library, 
  Wifi, 
  Tv, 
  Compass, 
  Search, 
  Eye, 
  Info, 
  Flame, 
  Dribbble, 
  BookOpen, 
  ShieldAlert,
  Printer,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpRight,
  HelpCircle,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for our custom services structure
interface ServiceItem {
  id: string;
  category: 'methods' | 'diagnostics' | 'laboratory' | 'infrastructure';
  title: string;
  benefit: string;
  method: string;
  indications: string[];
  duration?: string;
  iconName: string;
}

export default function ServicesPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { siteData, isAdminMode, setCurrentPage } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', label: 'Все услуги', count: siteData.services?.length || 0, desc: 'Полный каталог медицинских и сопутствующих услуг' },
    { id: 'methods', label: 'Методы лечения', count: siteData.services?.filter((s: ServiceItem) => s.category === 'methods').length || 0, desc: 'Лечебные процедуры, бальнеология и массаж' },
    { id: 'diagnostics', label: 'Диагностика', count: siteData.services?.filter((s: ServiceItem) => s.category === 'diagnostics').length || 0, desc: 'Компьютерные и функциональные методы скрининга' },
    { id: 'laboratory', label: 'Лаборатория', count: siteData.services?.filter((s: ServiceItem) => s.category === 'laboratory').length || 0, desc: 'Клинические и биохимические исследования' },
    { id: 'infrastructure', label: 'Инфраструктура', count: siteData.services?.filter((s: ServiceItem) => s.category === 'infrastructure').length || 0, desc: 'Сервисные зоны, парк, пляж и активный досуг' }
  ];

  const services: ServiceItem[] = siteData.services || [];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.indications.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Waves': return <Waves className="w-5 h-5" />;
      case 'Wind': return <Wind className="w-5 h-5 text-[#c5a880]" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedService(prev => prev === id ? null : id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#022C22] font-sans selection:bg-[#c5a880]/30 pb-24 print:bg-white print:text-black">
      
      {/* HEADER HERO */}
      <div className="bg-[#022C22] text-white py-14 px-4 sm:px-6 relative overflow-hidden border-b border-[#c5a880]/20 shadow-lg print:hidden">
        {/* Subtle geometric pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#c5a880_2px,transparent_2px)] [background-size:24px_24px]"></div>
        </div>
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[#c5a880]/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <button 
              onClick={onBackToHome}
              className="group flex items-center space-x-2 border border-white/10 hover:border-[#c5a880]/40 bg-white/5 hover:bg-white/10 px-4.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all text-[#c5a880] w-fit cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#c5a880] group-hover:-translate-x-1 transition-transform" />
              <span>На главную страницу</span>
            </button>

            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 text-stone-300 hover:text-white text-xs border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
            >
              <Printer className="w-4 h-4 text-[#c5a880]" />
              <span>Печать прейскуранта</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c5a880] animate-pulse"></span>
            <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Лицензированные стандарты ФТС РФ
            </span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Оздоровительно-лечебные услуги
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed max-w-3xl">
            Высокоэффективное курортное и ведомственное оздоровление, бальнеология нового поколения и передовая терапевтическая база. Все услуги сертифицированы по единым государственным стандартам РФ.
          </p>
        </div>
      </div>

      {/* PRINTABLE HEADER (hidden on screen) */}
      <div className="hidden print:block text-black p-8 border-b-2 border-black mb-6">
        <h1 className="text-3xl font-serif font-black uppercase tracking-tight">Санаторий «Ясная Поляна» ФТС РФ</h1>
        <p className="text-sm mt-1">Официальный каталог медицинских, диагностических и досуговых услуг</p>
        <div className="text-xs mt-3 text-stone-600">Действует на дату: {new Date().toLocaleDateString('ru-RU')} • Гос. лицензия № Л041-00110-91/00554225</div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* INTERACTIVE CATEGORY QUICK BENTO CARD SELECTION */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 print:hidden">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setExpandedService(null);
                }}
                className={`group text-left p-4 rounded-xl border transition-all duration-300 hover:shadow-md relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-[#022C22] text-[#c5a880] border-[#022C22] shadow' 
                    : 'bg-white border-stone-200 hover:border-emerald-950/20 text-[#022C22]'
                }`}
              >
                {/* Subtle card graphic */}
                <div className={`absolute -right-6 -bottom-6 w-16 h-16 rounded-full opacity-[0.03] transition-transform group-hover:scale-125 ${isSelected ? 'bg-white' : 'bg-[#022C22]'}`} />
                
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] uppercase font-mono tracking-wider font-extrabold ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    Раздел
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-black ${isSelected ? 'bg-white/10 text-white' : 'bg-stone-100 text-[#022C22]'}`}>
                    {cat.count}
                  </span>
                </div>
                
                <div className="mt-2">
                  <h3 className="font-serif font-bold text-xs sm:text-sm tracking-tight leading-snug group-hover:text-[#c5a880] transition-colors">
                    {cat.label}
                  </h3>
                  <p className={`text-[10px] leading-tight mt-1 transition-colors line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* TWO COLUMN GRID: STICKY FILTERS & DETAILED ITEMS FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: STICKY SEARCH & DYNAMIC INFO RAIL */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6 print:hidden">
            
            {/* Search Box */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-[#022C22] border-b border-stone-100 pb-3">
                <SlidersHorizontal className="w-4 h-4 text-[#c5a880]" />
                <h3 className="font-serif text-sm font-extrabold uppercase tracking-wide">Параметры поиска</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-black tracking-widest text-[#022C22]">Ключевые слова</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Название, польза, синдром..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#c5a880] focus:bg-white transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* View Controls */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono uppercase font-black text-stone-400">Вид отображения:</span>
                  <div className="flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#022C22]' : 'text-stone-400 hover:text-stone-700'}`}
                      title="Сетка"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm text-[#022C22]' : 'text-stone-400 hover:text-stone-700'}`}
                      title="Список"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Information / Referral Section */}
            <div className="bg-[#022C22] text-[#FAF9F6] p-6 rounded-2xl border border-[#c5a880]/20 shadow relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#c5a880]/5 rounded-full pointer-events-none" />
              <HelpCircle className="w-8 h-8 text-[#c5a880] mb-4" />
              <h4 className="font-serif text-base font-bold text-white mb-2 leading-snug">Важное при заезде на санаторное лечение</h4>
              <p className="text-stone-300 text-[11px] leading-relaxed mb-4">
                Все медицинские процедуры назначаются лечащим врачом-терапевтом на основании вашей **санаторно-курортной карты (форма 072/у)** с учетом имеющихся показаний и отсутствия противопоказаний.
              </p>
              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <div className="flex items-center space-x-2 text-[10px] text-stone-300">
                  <CheckCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Обследования проводятся в первый день (ЭКГ, ОАК)</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-stone-300">
                  <CheckCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Возможно оформление карты на месте за доп. плату</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Связаться с постом:</span>
                <a href="#contacts" className="text-xs font-mono font-bold text-[#c5a880] hover:underline flex items-center">
                  <span>Регистратура</span>
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: INTERACTIVE CARDS DIRECTORY FEED */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Custom Welcome Highlights for Specific Category filtering */}
            {selectedCategory === 'infrastructure' && (
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm print:hidden">
                <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-extrabold mb-1">
                  <Library className="w-4 h-4 text-[#c5a880]" />
                  <span>Благоустройство и рекреация</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#022C22] leading-tight">Общее оснащение курорта</h3>
                <p className="text-stone-500 text-xs leading-relaxed mt-2">
                  Помимо прочего, на охраняемой территории Санатория «Ясная Поляна» к услугам гостей: собственный хвойный парк-арборетум, огороженная пляжная зона (с шезлонгами и тентами), укомплектованный конференц-зал, бесплатная сеть Wi-Fi, читальный зал и спортивно-игровой комплекс.
                </p>
                
                {/* Micro bento highlights list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-1">
                  {[
                    { text: 'Бесплатный Wi-fi', icon: <Wifi className="w-3 h-3 text-emerald-700" /> },
                    { text: 'Библиотека', icon: <BookOpen className="w-3 h-3 text-emerald-700" /> },
                    { text: 'Бильярдный зал', icon: <Activity className="w-3 h-3 text-emerald-700" /> },
                    { text: 'Служба охраны 24/7', icon: <ShieldCheck className="w-3 h-3 text-[#c5a880]" /> },
                    { text: 'Приватный пляж', icon: <Waves className="w-3 h-3 text-emerald-700" /> },
                    { text: 'Лифты в корпусах', icon: <Check className="w-3 h-3 text-[#c5a880]" /> }
                  ].map((badge, bIdx) => (
                    <div key={bIdx} className="bg-stone-55 border border-stone-200/50 p-2.5 rounded-lg flex items-center space-x-2">
                      {badge.icon}
                      <span className="text-[11px] font-bold text-[#022C22]">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Results Count Banner */}
            <div className="flex items-center justify-between bg-white border border-stone-200/80 px-4 py-3 rounded-xl print:hidden">
              <span className="text-xs font-semibold text-stone-500">
                Категория: <span className="font-bold text-[#022C22] font-serif uppercase tracking-wider">{categories.find(c => c.id === selectedCategory)?.label}</span>
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Показано: <span className="font-mono text-white text-[10px] font-extrabold bg-[#022C22] px-2 py-0.5 rounded-full">{filteredServices.length}</span>
              </span>
            </div>

            {/* DYNAMIC CARD VIEW LAYOUT */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-5 print:grid-cols-1 print:gap-4' 
              : 'space-y-4 print:space-y-3'
            }>
              {filteredServices.map((service) => {
                const isExpanded = expandedService === service.id;
                
                return (
                  <div 
                    key={service.id}
                    className={`bg-white border transition-all duration-300 relative overflow-hidden flex flex-col justify-between print:break-inside-avoid print:shadow-none print:border-stone-300 ${
                      isExpanded 
                        ? 'border-[#c5a880]/50 ring-1 ring-[#c5a880]/15 shadow-md rounded-2xl' 
                        : 'border-stone-200 hover:border-stone-300 hover:shadow-md rounded-2xl'
                    } ${viewMode === 'list' ? 'p-5 sm:flex-row sm:items-center sm:gap-6' : 'p-6'}`}
                  >
                    
                    {/* Top Accent Strip strictly for style */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-950/20 via-[#c5a880]/20 to-emerald-950/20" />

                    {/* Card Content Wrapper */}
                    <div className="flex-1 space-y-4">
                      
                      {/* Category & Status tags */}
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase font-mono rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {service.category === 'methods' ? 'Реабилитация ' : service.category === 'diagnostics' ? 'Функц. Диагностика' : service.category === 'laboratory' ? 'Лабораторный тест' : 'Услуга досуга'}
                        </span>
                        {service.duration && (
                          <div className="flex items-center space-x-1 text-stone-400 font-mono text-[10px]">
                            <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                            <span>{service.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* Header title */}
                      <div className="flex items-start space-x-3.5 pt-1">
                        <div className="w-10 h-10 rounded-xl bg-[#022C22]/5 flex items-center justify-center shrink-0 text-[#022C22] border border-[#022C22]/10">
                          {getServiceIcon(service.iconName)}
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-serif font-extrabold text-[#022C22] text-sm sm:text-base leading-snug tracking-tight">
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      {/* Benefit */}
                      <div className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                        <span className="font-bold text-[#022C22] font-mono text-[9px] uppercase tracking-wider block mb-1">Ожидаемый Эффект:</span>
                        <p className="">{service.benefit}</p>
                      </div>

                      {/* Interactive Drawer (Expanded) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="pt-3 border-t border-stone-200/50 space-y-4 overflow-hidden"
                          >
                            <div className="space-y-1">
                              <span className="font-semibold text-stone-500 font-mono text-[9px] uppercase tracking-wider block">Регламент и методы проведения:</span>
                              <p className="text-xs text-stone-700 leading-relaxed bg-amber-50/[0.15] p-3 rounded-lg border border-amber-500/10 text-justify">
                                {service.method}
                              </p>
                            </div>

                            {service.indications?.length > 0 && (
                              <div className="space-y-2">
                                <span className="font-semibold text-stone-500 font-mono text-[9px] uppercase tracking-wider flex items-center text-[#022C22]">
                                  <ShieldAlert className="w-3.5 h-3.5 text-[#c5a880] mr-1" />
                                  Приоритетные показания к назначению:
                                </span>
                                <div className="flex flex-wrap gap-1.5 pl-0.5">
                                  {service.indications.map((ind, i) => (
                                    <span key={i} className="text-[10px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                                      {ind}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>

                    {/* Footer Controls (Buttons block) */}
                    <div className={`mt-5 pt-3 border-t border-stone-100 flex items-center justify-between print:hidden ${viewMode === 'list' ? 'sm:mt-0 sm:pt-0 sm:border-t-0 sm:flex-col sm:justify-center sm:gap-2 sm:border-l sm:pl-5 sm:border-stone-200' : ''}`}>
                      <button
                        onClick={() => toggleExpand(service.id)}
                        className="text-xs font-bold uppercase tracking-wider text-[#022C22] hover:text-[#c5a880] flex items-center space-x-1.5 cursor-pointer transition-colors py-1.5"
                      >
                        <Info className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>{isExpanded ? 'Скрыть детали' : 'Подробнее'}</span>
                      </button>
                      
                      <a
                        href="#contacts"
                        onClick={(e) => {
                          e.preventDefault();
                          onBackToHome();
                          setTimeout(() => {
                            const dom = document.getElementById('contacts');
                            if (dom) {
                              dom.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 150);
                        }}
                        className="text-[10px] font-black uppercase tracking-widest bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] px-4 py-2 rounded-lg transition-all shadow-sm"
                      >
                        Запись
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* EMPTY STATE */}
            {filteredServices.length === 0 && (
              <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-stone-200">
                <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-5 h-5 text-stone-400" />
                </div>
                <h4 className="font-serif text-base font-bold text-stone-700">Ничего не найдено</h4>
                <p className="text-stone-500 text-xs mt-1 max-w-sm mx-auto">
                  Не удалось найти услуги по запросу "{searchQuery}". Попробуйте изменить параметры или сбросить фильтр.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-5 text-xs font-bold text-[#c5a880] hover:text-[#022C22] uppercase tracking-widest font-mono border border-stone-200 bg-white px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Сбросить все фильтры
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

