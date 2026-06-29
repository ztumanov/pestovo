import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Brain, 
  Waves, 
  Sparkles, 
  Check, 
  Award, 
  Phone, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  Stethoscope, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MedicalProgram } from '../types';

export default function MedicalPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { siteData, isAdminMode, setCurrentPage, setActiveSettingsTab } = useAdminData();
  const medicalPrograms = siteData.medicalPrograms || [];
  const images = siteData.images || {};

  const [activeTab, setActiveTab] = useState<string>(medicalPrograms[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const getMedicalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lungs': return <Activity className="w-5 h-5 text-[#c5a880]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#c5a880]" />;
      case 'Brain': return <Brain className="w-5 h-5 text-[#c5a880]" />;
      case 'Activity': return <Waves className="w-5 h-5 text-[#c5a880]" />;
      default: return <Sparkles className="w-5 h-5 text-[#c5a880]" />;
    }
  };

  const filteredPrograms = medicalPrograms.filter(prog => 
    prog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prog.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prog.fullDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#022C22] font-sans selection:bg-[#c5a880]/30">
      
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
            <Stethoscope className="w-5 h-5 text-[#c5a880]" />
            <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">Высшая медицинская категория</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">
            Медицинский центр и Лечение
          </h1>
          <p className="text-stone-300 text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
            Комплексные лечебно-оздоровительные программы под наблюдением квалифицированных специалистов Федеральной таможенной службы России. Современная диагностика, бальнеотерапия и уникальный субтропический климат.
          </p>

          {isAdminMode && (
            <div className="mt-6">
              <button 
                onClick={() => { setActiveSettingsTab('medical'); setCurrentPage('admin'); }}
                className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-400 font-bold text-xs px-4 py-2 rounded-md inline-flex items-center gap-2 transition-all shadow hover:scale-105"
              >
                Редактировать программы в Админке
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PROGRAMS SELECTION / SEARCH */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Поиск программы
              </label>
              <input
                type="text"
                placeholder="Название программы или симптомы..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Auto-activate first program from results
                  const matches = medicalPrograms.filter(prog => 
                    prog.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    prog.shortDesc.toLowerCase().includes(e.target.value.toLowerCase())
                  );
                  if (matches.length > 0 && !matches.find(m => m.id === activeTab)) {
                    setActiveTab(matches[0].id);
                  }
                }}
                className="w-full text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#c5a880] transition-colors"
              />
            </div>

            {/* List selector */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 px-1">
                Доступные программы ({filteredPrograms.length})
              </span>
              
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((prog) => (
                  <button
                    key={prog.id}
                    onClick={() => setActiveTab(prog.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      activeTab === prog.id 
                        ? 'bg-white border-[#c5a880] text-[#022C22] shadow-md translate-x-1 font-medium ring-1 ring-[#c5a880]' 
                        : 'bg-white/60 border-stone-200 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`p-2 rounded-lg transition-colors ${activeTab === prog.id ? 'bg-[#022C22] text-[#c5a880]' : 'bg-[#022C22]/5 text-[#022C22]'}`}>
                        {getMedicalIcon(prog.icon)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm leading-snug">
                          {prog.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-1 group-hover:text-stone-700">
                          {prog.shortDesc}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-dashed border-stone-200 text-stone-400 text-sm font-serif">
                  Программы по запросу не найдены
                </div>
              )}
            </div>

            {/* SANATORNO-KURORTNAYA KARTA INFO CARD */}
            <div className="bg-[#022C22]/5 border border-[#022C22]/10 rounded-xl p-5 space-y-4">
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-[#c5a880] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-serif text-sm font-bold text-[#022C22]">Санаторно-курортная карта</h5>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    Для назначения лечения требуется санаторно-курортная карта (форма 072/у). Её можно оформить у терапевта по месту жительства или пройти экспресс-обследование в нашем центре за 1 день.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 border-t border-stone-200/60 pt-3">
                <ShieldAlert className="w-5 h-5 text-[#c5a880] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-serif text-sm font-bold text-[#022C22]">Противопоказания</h5>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    Индивидуальный перечень процедур, их кратность и интенсивность определяются лечащим врачом с учетом возможных противопоказаний.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ACTIVE PROGRAM DETAILED VIEW */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {medicalPrograms.filter(p => p.id === activeTab).map((prog) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
                >
                  
                  {/* Hero Image inside program card */}
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                    <img
                      src={prog.image || images.medical || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200'}
                      alt={prog.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold mb-2">
                          {getMedicalIcon(prog.icon)}
                          <span>Медицинская Программа</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
                          «{prog.title}»
                        </h2>
                      </div>
                      <div className="bg-[#FAF9F6]/10 backdrop-blur-md border border-white/20 text-white font-mono text-xs uppercase px-4 py-2 rounded-lg shrink-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#c5a880]" />
                        <span>Курс: {prog.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Program Description */}
                  <div className="p-6 sm:p-8 space-y-8">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#022C22] mb-3">
                        Описание оздоровительного направления
                      </h4>
                      <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                        {prog.fullDesc}
                      </p>
                    </div>

                    {/* Indications & Procedures list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-100">
                      
                      {/* Indications */}
                      <div className="bg-[#FAF9F6] p-5 rounded-xl border border-stone-200/60">
                        <h4 className="text-[#022C22] font-serif text-sm uppercase tracking-wider font-bold mb-3 pb-1.5 border-b border-[#022C22]/10 flex items-center">
                          <Check className="w-4 h-4 text-emerald-700 mr-2 shrink-0" />
                          Показания к лечению:
                        </h4>
                        <ul className="space-y-2.5">
                          {prog.indications?.map((ind, i) => (
                            <li key={i} className="text-xs text-stone-600 flex items-start leading-relaxed">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a880] mt-1.5 mr-2 shrink-0"></span>
                              <span>{ind}</span>
                            </li>
                          )) || <li className="text-xs text-stone-400 font-serif">Показания уточняются</li>}
                        </ul>
                      </div>

                      {/* Procedures */}
                      <div className="bg-[#022C22]/5 p-5 rounded-xl border border-[#022C22]/10">
                        <h4 className="text-[#022C22] font-serif text-sm uppercase tracking-wider font-bold mb-3 pb-1.5 border-b border-[#022C22]/10 flex items-center">
                          <Check className="w-4 h-4 text-[#c5a880] mr-2 shrink-0" />
                          Комплекс процедур:
                        </h4>
                        <ul className="space-y-2.5">
                          {prog.procedures?.map((proc, i) => (
                            <li key={i} className="text-xs text-stone-600 flex items-start leading-relaxed">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#022C22] mt-1.5 mr-2 shrink-0"></span>
                              <span>{proc}</span>
                            </li>
                          )) || <li className="text-xs text-stone-400 font-serif">Процедуры уточняются</li>}
                        </ul>
                      </div>

                    </div>

                    {/* Booking Prompt */}
                    <div className="bg-[#022C22] text-[#FAF9F6] p-6 rounded-xl border border-[#c5a880]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                      <div className="space-y-1">
                        <span className="text-[#c5a880] font-bold text-xs uppercase tracking-wider font-mono block">Индивидуальный подход</span>
                        <p className="text-xs text-stone-300 max-w-md">
                          Программа лечения составляется персонально с учетом возраста, сопутствующих диагнозов и противопоказаний каждого гостя.
                        </p>
                      </div>
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
                        className="bg-[#c5a880] hover:bg-[#b09268] text-[#022C22] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow hover:shadow-lg hover:scale-105 inline-flex items-center gap-2 shrink-0 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Консультация ординатора</span>
                      </a>
                    </div>

                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* NEW SECTION: LICENSES & CLINICAL BASE */}
        <div className="mt-16 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="bg-[#022C22] text-white p-6 sm:p-8 border-b border-[#c5a880]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold mb-1">
                <Award className="w-4 h-4 text-[#c5a880]" />
                <span>Государственные стандарты лечения</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">Лицензированные виды деятельности и медицинская специализация</h3>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/15 text-stone-300 font-mono text-[10px] sm:text-xs">
              Лицензия № <span className="text-white font-bold">Л041-00110-91/00554225</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: License Card */}
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a880]/5 rounded-bl-full pointer-events-none" />
              <div>
                <h4 className="font-serif text-sm font-bold text-[#022C22] mb-4 uppercase tracking-wider text-[#c5a880] flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-[#c5a880]" />
                  Сведения о лицензии
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-stone-200/50 pb-2.5">
                    <span className="text-stone-500">Регистрационный номер:</span>
                    <span className="font-mono font-bold text-[#022C22]">Л041-00110-91/00554225</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/50 pb-2.5">
                    <span className="text-stone-500">Дата выдачи:</span>
                    <span className="font-bold text-[#022C22]">22 июня 2022 г.</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-stone-500">Дата начала действия:</span>
                    <span className="font-bold text-[#022C22]">22 июня 2022 г.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Specializations (Вид деятельности) */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#022C22] uppercase tracking-wider flex items-center">
                <Stethoscope className="w-4 h-4 mr-2 text-[#c5a880]" />
                Медицинская специализация (по лицензии)
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'диетология',
                  'лечебная физкультура',
                  'медицинский массаж',
                  'организация здравоохранения',
                  'сестринское дело',
                  'терапия',
                  'физиотерапия',
                  'функциональная диагностика'
                ].map((activity, idx) => (
                  <span 
                    key={idx} 
                    className="bg-[#022C22]/5 border border-[#022C22]/10 text-[#022C22] text-xs font-semibold px-3 py-1.5 rounded-lg capitalize hover:bg-[#022C22]/10 transition-colors"
                  >
                    {activity}
                  </span>
                ))}
              </div>
              <p className="text-xs text-stone-500 leading-normal pt-1 text-justify">
                Санаторий «Ясная Поляна» гарантирует полное соответствие оказываемых услуг терапевтическим регламентам Министерства здравоохранения РФ под строгим внутренним контролем качества.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
