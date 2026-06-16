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
  ShieldAlert
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

  const categories = [
    { id: 'all', label: 'Все услуги' },
    { id: 'methods', label: 'Методы лечения' },
    { id: 'diagnostics', label: 'Функциональная диагностика' },
    { id: 'laboratory', label: 'Лабораторная база' },
    { id: 'infrastructure', label: 'Инфраструктура и сервис' }
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
      case 'Activity': return <Activity className="w-5 h-5 text-[#c5a880]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#c5a880]" />;
      case 'Flame': return <Flame className="w-5 h-5 text-[#c5a880]" />;
      case 'Waves': return <Waves className="w-5 h-5 text-[#c5a880]" />;
      case 'Wind': return <Wind className="w-5 h-5 text-[#c5a880]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-[#c5a880]" />;
      case 'Droplet': return <Droplet className="w-5 h-5 text-[#c5a880]" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-[#c5a880]" />;
      default: return <Sparkles className="w-5 h-5 text-[#c5a880]" />;
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedService === id) {
      setExpandedService(null);
    } else {
      setExpandedService(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#022C22] font-sans selection:bg-[#c5a880]/30 pb-20">
      
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

          <div className="flex items-center space-x-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#c5a880]" />
            <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">Лицензированные ведомственные стандарты</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">
            Услуги Санатория «Пестово»
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
            Комплексные лечебные услуги, современное высокотехнологичное оборудование, а также развитая инфраструктура для идеального и восстанавливающего отдыха сотрудников Федеральной таможенной службы и всех гостей здравницы.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          
          {/* Search bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-lg">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 w-4 h-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск по названию, пользе или показанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-medium pl-10 pr-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-lg focus:outline-none focus:border-[#c5a880] transition-colors"
              />
            </div>
            
            <div className="text-stone-400 text-xs font-mono">
              Найдено: <span className="font-bold text-[#022C22]">{filteredServices.length}</span> из <span className="font-bold text-[#022C22]">{services.length}</span>
            </div>
          </div>

          {/* Filtering tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#022C22] text-[#c5a880] shadow-sm'
                    : 'bg-[#FAF9F6] border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* DETAILED SERVICES CARDS LIST */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Custom Quick Highlight block for Infrastucture */}
        {selectedCategory === 'infrastructure' && (
          <div className="bg-[#022C22] rounded-2xl p-6 sm:p-8 text-[#FAF9F6] border border-[#c5a880]/30 shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#c5a880]">
                <Library className="w-5 h-5 text-[#c5a880]" />
                <span className="text-xs font-mono tracking-widest uppercase font-bold">Инфраструктура и Досуг</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Всё для гармонии и спокойствия
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Наш санаторий располагает закрытой благоустроенной парковой лесозоной и превосходным песчаным приватным пляжем. Здесь вы найдете всё необходимое как для тихого чтения, так и для активного пляжного или корпоративного уикенда в кругу семьи.
              </p>
            </div>
            
            {/* Infrastructure badges layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto md:min-w-[400px]">
              {[
                { label: 'Бесплатный Wi-fi', icon: <Wifi className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Библиотека', icon: <BookOpen className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Бильярд', icon: <Activity className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Детская площадка', icon: <Compass className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Конференц-зал', icon: <Tv className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Лифты в корпусах', icon: <Check className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Огражденная охрана', icon: <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Приватный Пляж', icon: <Waves className="w-3.5 h-3.5 text-[#c5a880]" /> },
                { label: 'Служба спасения', icon: <Activity className="w-3.5 h-3.5 text-[#c5a880]" /> }
              ].map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center space-x-2">
                  {item.icon}
                  <span className="text-[10px] sm:text-xs font-semibold text-stone-200">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isExpanded = expandedService === service.id;
            return (
              <div 
                key={service.id}
                className="bg-white border border-stone-200 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-stone-300 p-6 relative overflow-hidden"
              >
                <div>
                  
                  {/* Category Stamp */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase font-mono rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {service.category === 'methods' ? 'процедура' : service.category === 'diagnostics' ? 'диагностика' : service.category === 'laboratory' ? 'анализ' : 'инфраструктура'}
                    </span>
                    {service.duration && (
                      <div className="flex items-center space-x-1 text-stone-400 font-mono text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Header & Icon */}
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-[#022C22]/5 flex items-center justify-center shrink-0 text-[#022C22] border border-[#022C22]/10">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <h3 className="font-serif font-black text-[#022C22] text-sm leading-snug sm:text-base group-hover:text-[#c5a880] transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* Benefit text */}
                  <p className="text-xs text-stone-500 mt-4 leading-relaxed line-clamp-3">
                    <span className="font-bold text-[#022C22] font-mono uppercase text-[9px] block mb-1">Польза и Эффект:</span>
                    {service.benefit}
                  </p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 pt-4 border-t border-stone-100 space-y-4 overflow-hidden"
                      >
                        <div>
                          <span className="font-bold text-[#022C22] font-mono uppercase text-[9px] block mb-1">Методика проведения:</span>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {service.method}
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-[#022C22] font-mono uppercase text-[9px] block mb-2 flex items-center">
                            <ShieldAlert className="w-3.5 h-3.5 text-[#c5a880] mr-1" />
                            Основные Показания:
                          </span>
                          <ul className="grid grid-cols-1 gap-1.5 pl-1">
                            {service.indications.map((ind, i) => (
                              <li key={i} className="text-[11px] text-stone-600 flex items-start leading-tight">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a880] mt-1 mr-2 shrink-0"></span>
                                <span>{ind}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Footer Controls */}
                <div className="mt-6 pt-4 border-t border-stone-100/60 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="text-xs font-bold uppercase tracking-wider text-[#022C22] hover:text-[#c5a880] flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>{isExpanded ? 'Скрыть детали' : 'Подробнее о методике'}</span>
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
                    className="text-[10px] font-bold uppercase tracking-wider bg-[#022C22]/5 p-2 rounded text-[#022C22] hover:bg-[#022C22] hover:text-white transition-all cursor-pointer"
                  >
                    Запись
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-stone-200">
            <span className="text-stone-400 font-serif text-sm">Услуг по заданным критериям фильтра не найдено</span>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 block mx-auto text-xs font-bold text-[#c5a880] uppercase tracking-wider font-mono hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
