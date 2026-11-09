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
  FileText, 
  ShieldAlert, 
  Stethoscope, 
  Clock,
  Users,
  UserCheck,
  Microscope,
  Building2,
  Utensils,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MedicalPage({ 
  onBackToHome,
  initialProgramId 
}: { 
  onBackToHome: () => void;
  initialProgramId?: string;
}) {
  const { siteData, isAdminMode, setCurrentPage, setActiveSettingsTab } = useAdminData();
  const medicalPrograms = siteData.medicalPrograms || [];
  const images = siteData.images || {};

  const [activeTab, setActiveTab] = useState<string>(initialProgramId || medicalPrograms[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [profileFilter, setProfileFilter] = useState<string>('all');

  const getMedicalIcon = (iconName: string) => {
    const icon = iconName?.toLowerCase() || '';
    if (icon.includes('lung') || icon.includes('breath') || icon.includes('activity')) {
      return <Activity className="w-5 h-5 text-[#c5a880]" />;
    }
    if (icon.includes('heart') || icon.includes('cardio')) {
      return <Heart className="w-5 h-5 text-[#c5a880]" />;
    }
    if (icon.includes('brain') || icon.includes('stress') || icon.includes('nerv')) {
      return <Brain className="w-5 h-5 text-[#c5a880]" />;
    }
    if (icon.includes('stetho') || icon.includes('med')) {
      return <Stethoscope className="w-5 h-5 text-[#c5a880]" />;
    }
    if (icon.includes('wave') || icon.includes('water')) {
      return <Waves className="w-5 h-5 text-[#c5a880]" />;
    }
    return <Sparkles className="w-5 h-5 text-[#c5a880]" />;
  };

  const profileCategories = [
    { id: 'all', label: 'Все профили' },
    { id: 'respiratory', label: 'Органы дыхания и ЛОР' },
    { id: 'musculoskeletal', label: 'Опорно-двигательный аппарат' },
    { id: 'cardio', label: 'Сердце и сосуды' },
    { id: 'antistress', label: 'Антистресс и психоразгрузка' }
  ];

  const filteredPrograms = medicalPrograms.filter(prog => {
    const matchesSearch =
      prog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.fullDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfile = profileFilter === 'all' || prog.id === profileFilter;
    return matchesSearch && matchesProfile;
  });

  const activeProgramObj = medicalPrograms.find(p => p.id === activeTab) || filteredPrograms[0] || medicalPrograms[0];

  const guestSteps = [
    {
      num: '01',
      title: 'Направление и путевка',
      desc: 'Оформление санаторно-курортной путевки через уполномоченное подразделение ФТС России или отдел бронирования здравницы.'
    },
    {
      num: '02',
      title: 'Санаторно-курортная карта',
      desc: 'Оформление карты по форме № 072/у (для взрослых) или № 076/у (для детей), полиса ОМС и справки об эпидокружении по месту жительства.'
    },
    {
      num: '03',
      title: 'Прием врача и диагностика',
      desc: 'Осмотр лечащим врачом-терапевтом, консультации физиотерапевта, педиатра, врача функциональной диагностики, анализы, ЭКГ, ФВД и УЗИ «РуСкан».'
    },
    {
      num: '04',
      title: 'Персональный курс лечения',
      desc: 'Прохождение назначенных процедур бальнеогрязелечения, аппаратной физиотерапии, ЛФК, терренкура и диетотерапии по 22-дневному меню.'
    }
  ];

  const medicalCabinets = [
    {
      num: '01',
      title: 'Кабинет грязелечения',
      subtitle: 'Сакские сульфидные иловые грязи',
      desc: 'Аппликации целебных сульфидных иловые грязей Сакского озера. Методики хорошо переносятся пациентами и высокоэффективны при болезнях костно-мышечной системы и внутренних органов.'
    },
    {
      num: '02',
      title: 'Бальнеологический кабинет',
      subtitle: '7 видов лечебных ванн и 3 вида душей',
      desc: 'Хвойные, хвойно-жемчужные, йодобромные, лавандовые ванны, ванны с раствором бишофита, экстрактом пиявки, крымскими эфирными маслами и морским коллагеном. Лечебные души: циркулярный, восходящий, подводный душ-массаж.'
    },
    {
      num: '03',
      title: 'Кабинет сухих углекислых ванн',
      subtitle: 'Сосудистая и кардиореабилитация',
      desc: 'Дозированное воздействие углекислым газом для расширения капилляров, улучшения оксигенации тканей, нормализации артериального давления и работы сердечно-сосудистой системы.'
    },
    {
      num: '04',
      title: 'Кабинет физиотерапии и магнитотерапии',
      subtitle: 'Современное аппаратное лечение',
      desc: 'Гальванизация и лекарственный электрофорез, кабинет современной магнитотерапии, инфитатерапия, ультразвук и ультрафонофорез, дарсонвализация, лимфодренаж, диадинамотерапия, амплипульстерапия, УВЧ и СМВ-терапия.'
    },
    {
      num: '05',
      title: 'Ингаляторий',
      subtitle: 'Пульмонология и ЛОР-органы',
      desc: 'Лекарственные ингаляции в сочетании с бальнеолечением и электрофизиопроцедурами при хронических и рецидивирующих бронхитах, бронхиальной астме различных вариантов течения и патологии ЛОР-органов.'
    },
    {
      num: '06',
      title: 'Кабинеты массажа и кушетка «Ормед»',
      subtitle: 'Ручной, аппаратный и гидромассаж',
      desc: 'Кабинеты ручного и механического массажа (классический медицинский массаж, программный массаж на тракционной кушетке «Ормед», гидромассаж), кабинет лимфодренажного и электростатического массажа.'
    },
    {
      num: '07',
      title: 'Зал ЛФК, тренажеров и «Детензор»',
      subtitle: 'Кинезотерапия, механотерапия и терренкур',
      desc: 'Зал ЛФК, кардиотренажеров и механотерапии, открытая спортплощадка. Групповые и индивидуальные комплексы при грыжах, остеохондрозе, артрозах, болезнях сердца и легких; тракционная программа «Детензор»; 3 режима терренкура.'
    },
    {
      num: '08',
      title: 'Кабинет психологической разгрузки',
      subtitle: 'Аппаратный комплекс «Сенсориум»',
      desc: 'Аудиовизуальная и вибротактильная релаксация на аппарате «Сенсориум» для снятия стресса, восстановления психоэмоционального состояния и снижения частоты обострений психосоматических заболеваний.'
    },
    {
      num: '09',
      title: 'Фитобар, бювет и ИК-сауна',
      subtitle: 'Фитотерапия, минеральные воды и термотерапия',
      desc: 'Фитобар с бюветом минеральных вод, где отдыхающим предлагаются кислородный коктейль и лекарственные крымские фитосборы, а также сеансы термотерапии в инфракрасной сауне.'
    }
  ];

  const licenseCategories = [
    {
      code: '1000.1',
      title: 'Первичная доврачебная медико-санитарная помощь в амбулаторных условиях',
      items: [
        { code: '1000.1.5', name: 'Лабораторная диагностика' },
        { code: '1000.1.6', name: 'Лечебная физкультура' },
        { code: '1000.1.7', name: 'Лечебное дело' },
        { code: '1000.1.12', name: 'Медицинский массаж' },
        { code: '1000.1.23', name: 'Физиотерапия' },
        { code: '1000.1.24', name: 'Функциональная диагностика' }
      ]
    },
    {
      code: '1000.2',
      title: 'Первичная врачебная медико-санитарная помощь в амбулаторных условиях',
      items: [
        { code: '1000.2.3', name: 'Организация здравоохранения и общественное здоровье, эпидемиология' },
        { code: '1000.2.5', name: 'Терапия' }
      ]
    },
    {
      code: '1000.4',
      title: 'Первичная специализированная медико-санитарная помощь в амбулаторных условиях',
      items: [
        { code: '1000.4.18', name: 'Диетология' },
        { code: '1000.4.27', name: 'Лечебная физкультура' },
        { code: '1000.4.36', name: 'Организация здравоохранения и общественное здоровье, эпидемиология' },
        { code: '1000.4.67', name: 'Физиотерапия' },
        { code: '1000.4.69', name: 'Функциональная диагностика' }
      ]
    },
    {
      code: '1040',
      title: 'Медицинская помощь при санаторно-курортном лечении',
      items: [
        { code: '1040.11', name: 'Диетология' },
        { code: '1040.16', name: 'Лечебная физкультура' },
        { code: '1040.20', name: 'Медицинский массаж' },
        { code: '1040.24', name: 'Организация здравоохранения и общественное здоровье, эпидемиология' },
        { code: '1040.28', name: 'Педиатрия' },
        { code: '1040.35', name: 'Сестринское дело' },
        { code: '1040.44', name: 'Терапия' },
        { code: '1040.46', name: 'Ультразвуковая диагностика' },
        { code: '1040.48', name: 'Физиотерапия' },
        { code: '1040.50', name: 'Функциональная диагностика' }
      ]
    },
    {
      code: '1070',
      title: 'Проведение медицинских экспертиз',
      items: [
        { code: '1070.8', name: 'Экспертиза качества медицинской помощи' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#022C22] font-sans selection:bg-[#c5a880]/30">
      
      {/* HEADER HERO */}
      <div className="bg-[#022C22] text-white py-14 sm:py-16 px-4 relative overflow-hidden border-b border-[#c5a880]/30">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Unified Breadcrumbs & Back Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <nav aria-label="Навигационная цепочка" className="flex items-center flex-wrap gap-2 text-xs text-stone-300 font-sans">
              <button
                onClick={onBackToHome}
                className="hover:text-[#c5a880] transition-colors cursor-pointer font-medium"
              >
                Главная
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#c5a880]/60 shrink-0" />
              <span className="text-[#c5a880] font-semibold">Медицинское отделение</span>
              {activeProgramObj && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[#c5a880]/60 shrink-0 hidden md:inline" />
                  <span className="text-stone-300 truncate max-w-[260px] hidden md:inline">{activeProgramObj.title}</span>
                </>
              )}
            </nav>

            <button 
              onClick={onBackToHome}
              className="group inline-flex items-center space-x-2 border border-[#c5a880]/40 hover:border-[#c5a880] bg-white/5 hover:bg-[#c5a880] px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all text-[#c5a880] hover:text-[#022C22] cursor-pointer self-start sm:self-auto shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>На главную</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-3 text-xs font-mono uppercase tracking-widest text-[#c5a880]">
            <span>ФГКУ «Санаторий «Ясная Поляна» ФТС России»</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Лицензия № Л041-00110-91/00554225</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight max-w-4xl">
            Медицинское отделение: Лечение и Диагностика
          </h1>
          <p className="text-stone-200 text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
            В медицинском отделении санатория работают 39 сотрудников, включая 5 врачей с большим опытом в санаторно-курортной сфере. 100% среднего и высшего медицинского персонала аккредитованы. Оказывается полный комплекс бальнеологического, грязевого, физиотерапевтического и реабилитационного лечения по стандартам Минздрава РФ.
          </p>

          {/* Architectural Key Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#c5a880]/25 border border-[#c5a880]/30 mt-10">
            <div className="p-4 sm:p-5 bg-[#011F18]">
              <span className="block font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#c5a880]">39</span>
              <span className="text-xs text-stone-300 mt-1 block">сотрудников медицинского отделения</span>
            </div>
            <div className="p-4 sm:p-5 bg-[#011F18]">
              <span className="block font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#c5a880]">100%</span>
              <span className="text-xs text-stone-300 mt-1 block">аккредитация среднего и высшего медперсонала</span>
            </div>
            <div className="p-4 sm:p-5 bg-[#011F18]">
              <span className="block font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#c5a880]">5 врачей</span>
              <span className="text-xs text-stone-300 mt-1 block">с большим опытом в санаторно-курортной сфере</span>
            </div>
            <div className="p-4 sm:p-5 bg-[#011F18]">
              <span className="block font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#c5a880]">24 вида</span>
              <span className="text-xs text-stone-300 mt-1 block">лицензированных медицинских работ и услуг</span>
            </div>
          </div>

          {isAdminMode && (
            <div className="mt-6">
              <button 
                onClick={() => { setActiveSettingsTab('medical'); setCurrentPage('admin'); }}
                className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-400 font-bold text-xs px-4 py-2 rounded-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                Редактировать программы в Админке
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* MEDICAL LEADERSHIP & SPECIALIST CONSULTATIONS */}
        <section className="bg-white border border-stone-200">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-[#9b7b51] font-semibold">
                Руководство медицинской службой · с января 2025 года
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22]">
                Душкин Игорь Фёдорович
              </h2>
              <p className="text-xs sm:text-sm text-[#022C22] font-medium leading-relaxed border-y border-stone-200 py-3">
                Врач высшей категории · Кандидат медицинских наук · Заслуженный врач Республики Крым · Доцент по специальности «Восстановительная медицина» · Ветеран боевых действий СВО
              </p>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-2xl">
                Под руководством И.Ф. Душкина организована комплексная система восстановительного лечения, бальнеогрязелечения Сакскими сульфидными грязями, аппаратной физиотерапии и функционально-ультразвуковой диагностики в строгом соответствии с клиническими рекомендациями Минздрава РФ.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#022C22] text-white p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#c5a880]/30">
              <div className="space-y-4">
                <div className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">
                  Консультации врачей-специалистов
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Согласно стандартам оказания санаторно-курортной помощи, отдыхающие проходят прием лечащего врача-терапевта и получают консультации профильных специалистов:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
                  {[
                    { role: 'Врач-терапевт', note: 'Ведение курса лечения' },
                    { role: 'Врач-физиотерапевт', note: 'Подбор аппаратных методик' },
                    { role: 'Врач-педиатр', note: 'Оздоровление детей с 4 лет' },
                    { role: 'Врач функциональной диагностики', note: 'ЭКГ и спирография (ФВД)' },
                    { role: 'Врач УЗ-диагностики', note: 'Аппарат экспертного класса «РуСкан»' },
                    { role: 'Медсестра диетическая', note: 'Курация диеты весь срок лечения' }
                  ].map((spec, idx) => (
                    <div key={idx} className="bg-[#022C22] p-3">
                      <span className="font-bold text-xs text-white block">{spec.role}</span>
                      <span className="text-[11px] text-[#c5a880] block mt-0.5">{spec.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STEP GUEST ROUTE (ПОШАГОВЫЙ МАРШРУТ ГОСТЯ) */}
        <section className="bg-white border border-stone-200 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#9b7b51] font-bold block mb-1">
                Порядок назначения процедур · Форма 072/у и 076/у
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22]">
                Маршрут гостя: как организовано лечение в санатории
              </h3>
            </div>
            <button
              onClick={() => {
                setCurrentPage('documents');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold uppercase tracking-wider text-[#022C22] hover:text-[#c5a880] inline-flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>Перечень документов для заезда</span>
              <ChevronRight className="w-4 h-4 text-[#c5a880]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guestSteps.map((step) => (
              <div key={step.num} className="border border-stone-200 bg-[#FAF9F6] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
                    <span className="font-mono tabular-nums text-2xl font-bold text-[#c5a880]">{step.num}</span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Этап</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#022C22] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMS INTERACTIVE EXPLORER WITH QUICK PROFILE FILTERS */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#9b7b51] font-bold block mb-1">
                Профильные медицинские программы
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22]">
                Клинические направления оздоровления
              </h3>
            </div>

            {/* Interactive Profile Filter Bar */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 bg-stone-200/60 p-1 border border-stone-200">
              {profileCategories.map((cat) => {
                const isSelected = profileFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setProfileFilter(cat.id);
                      if (cat.id !== 'all') {
                        setActiveTab(cat.id);
                      } else if (medicalPrograms[0]) {
                        setActiveTab(medicalPrograms[0].id);
                      }
                    }}
                    className={`px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-[11px] lg:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#022C22] text-[#c5a880]'
                        : 'text-stone-700 hover:text-[#022C22] hover:bg-white/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: PROGRAMS SELECTION / SEARCH */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Search Bar */}
              <div className="bg-white p-4 border border-stone-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Поиск по процедурам и показаниям
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Например: грязи, ингаляции, РуСкан..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      const matches = medicalPrograms.filter(prog => 
                        prog.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        prog.shortDesc.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        prog.fullDesc.toLowerCase().includes(e.target.value.toLowerCase())
                      );
                      if (matches.length > 0 && !matches.find(m => m.id === activeTab)) {
                        setActiveTab(matches[0].id);
                      }
                    }}
                    className="w-full text-sm bg-[#FAF9F6] border border-stone-200 pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#022C22] transition-colors"
                  />
                </div>
              </div>

              {/* List selector */}
              <div className="space-y-2.5">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((prog, index) => {
                    const isSelected = activeProgramObj?.id === prog.id;
                    return (
                      <button
                        key={prog.id}
                        onClick={() => setActiveTab(prog.id)}
                        className={`w-full text-left p-4 border transition-all duration-200 flex items-start justify-between group cursor-pointer ${
                          isSelected 
                            ? 'bg-[#022C22] border-[#022C22] text-white' 
                            : 'bg-white border-stone-200 hover:border-[#c5a880] text-[#022C22]'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <span className={`font-mono tabular-nums text-xs font-bold mt-0.5 ${isSelected ? 'text-[#c5a880]' : 'text-stone-400'}`}>
                            0{index + 1}
                          </span>
                          <div>
                            <h4 className={`font-serif font-bold text-sm sm:text-base leading-snug ${isSelected ? 'text-white' : 'text-[#022C22]'}`}>
                              {prog.title}
                            </h4>
                            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                              {prog.shortDesc}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-white border border-stone-200 text-stone-500 text-sm font-serif">
                    Программы по запросу не найдены
                  </div>
                )}
              </div>

              {/* SANATORNO-KURORTNAYA KARTA INFO CARD */}
              <div className="bg-white border border-stone-200 p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-[#c5a880] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#022C22]">Санаторно-курортная карта</h5>
                    <p className="text-xs text-stone-600 leading-relaxed mt-1">
                      Для назначения полного комплекса бальнео-, грязе- и физиопроцедур требуется санаторно-курортная карта (форма 072/у для взрослых, 076/у для детей).
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 border-t border-stone-200 pt-3">
                  <ShieldAlert className="w-5 h-5 text-[#c5a880] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#022C22]">Индивидуальные назначения</h5>
                    <p className="text-xs text-stone-600 leading-relaxed mt-1">
                      Перечень процедур, лечебный режим терренкура и диетический стол определяются лечащим врачом и врачом-физиотерапевтом с учетом основного и сопутствующих заболеваний.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ACTIVE PROGRAM DETAILED VIEW */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {activeProgramObj && (
                  <motion.div
                    key={activeProgramObj.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-stone-200 overflow-hidden"
                  >
                    
                    {/* Hero Image inside program card */}
                    <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#022C22]">
                      <img
                        src={activeProgramObj.image || images.medical || '/images/pestovo_medical_1779777676990.png'}
                        alt={activeProgramObj.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold mb-2">
                            {getMedicalIcon(activeProgramObj.icon)}
                            <span>Профильное направление лечения</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">Курс: {activeProgramObj.duration || '14 – 21 день'}</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
                            «{activeProgramObj.title}»
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Program Description */}
                    <div className="p-6 sm:p-10 space-y-8">
                      <div>
                        <h4 className="font-serif text-xl font-bold text-[#022C22] mb-3">
                          Клиническое описание программы
                        </h4>
                        <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-3xl">
                          {activeProgramObj.fullDesc}
                        </p>
                      </div>

                      {/* Indications & Procedures list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-200">
                        
                        {/* Indications */}
                        <div className="bg-[#FAF9F6] p-6 border border-stone-200">
                          <h4 className="text-[#022C22] font-sans text-xs uppercase tracking-wider font-bold mb-4 pb-2 border-b border-stone-200 flex items-center">
                            <Check className="w-4 h-4 text-emerald-800 mr-2 shrink-0" />
                            Показания к назначению
                          </h4>
                          <ul className="space-y-3">
                            {activeProgramObj.indications?.map((ind, i) => (
                              <li key={i} className="text-xs sm:text-sm text-stone-700 flex items-start leading-relaxed font-sans">
                                <span className="font-mono tabular-nums text-[11px] font-bold text-[#9b7b51] mr-2.5 mt-0.5 shrink-0">0{i + 1}.</span>
                                <span>{ind}</span>
                              </li>
                            )) || <li className="text-xs text-stone-500 font-sans">Определяются лечащим врачом</li>}
                          </ul>
                        </div>

                        {/* Procedures */}
                        <div className="bg-[#FAF9F6] p-6 border border-stone-200">
                          <h4 className="text-[#022C22] font-sans text-xs uppercase tracking-wider font-bold mb-4 pb-2 border-b border-stone-200 flex items-center">
                            <Check className="w-4 h-4 text-[#9b7b51] mr-2 shrink-0" />
                            Применяемые методики и процедуры
                          </h4>
                          <ul className="space-y-3">
                            {activeProgramObj.procedures?.map((proc, i) => (
                              <li key={i} className="text-xs sm:text-sm text-stone-700 flex items-start leading-relaxed font-sans">
                                <span className="font-mono tabular-nums text-[11px] font-bold text-[#022C22] mr-2.5 mt-0.5 shrink-0">0{i + 1}.</span>
                                <span>{proc}</span>
                              </li>
                            )) || <li className="text-xs text-stone-500 font-sans">Назначаются индивидуально</li>}
                          </ul>
                        </div>

                      </div>

                      {/* Booking Prompt */}
                      <div className="bg-[#022C22] text-[#FAF9F6] p-6 border border-[#c5a880]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <span className="text-[#c5a880] font-bold text-xs uppercase tracking-wider font-mono block">Стандарты санаторно-курортной помощи</span>
                          <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                            Программа лечения составляется персонально после осмотра лечащим врачом и консультации профильных специалистов (физиотерапевта, педиатра, врача функциональной диагностики).
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
                          className="bg-[#c5a880] hover:bg-[#b09268] text-[#022C22] px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Связаться с санаторием</span>
                        </a>
                      </div>

                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* STRUCTURE OF MEDICAL DEPARTMENT & CABINETS + DIET NUTRITION */}
        <section className="bg-white border border-stone-200 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#9b7b51] font-bold block mb-1">
                Структура медицинского отделения · 9 профильных подразделений
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22]">
                Лечебные кабинеты, оборудование и бальнеогрязелечение
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-md">
              Ванны чередуются с лечебными душами, аппаратной физиотерапией, грязевыми аппликациями Сакского озера и занятиями ЛФК.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalCabinets.map((cab) => (
              <div
                key={cab.num}
                className="bg-[#FAF9F6] border border-stone-200 p-6 flex flex-col justify-between hover:border-[#c5a880] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2 border-b border-stone-200 pb-2.5">
                    <span className="font-mono tabular-nums text-lg font-bold text-[#c5a880]">
                      {cab.num}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 text-right">
                      {cab.subtitle}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#022C22]">
                    {cab.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {cab.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dietetic Nutrition Highlight */}
          <div className="bg-[#022C22] text-white p-6 sm:p-8 border border-[#c5a880]/30 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">
                <Utensils className="w-4 h-4" />
                <span>Лечебное диетическое питание · 22-дневное заказное меню</span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold">
                Организация диетического питания под контролем Совета по питанию
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                Диетическое питание отдыхающих осуществляется по заказной системе на основании 22-дневного меню с учётом рекомендаций специалистов Совета по питанию. Столовая санатория оснащена новым технологическим оборудованием. Согласно диете, назначенной лечащим врачом, отдыхающих весь срок лечения курирует медицинская сестра диетическая.
              </p>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 divide-x divide-white/15 border border-white/15 bg-white/5 text-center">
              <div className="p-4">
                <span className="block font-mono tabular-nums text-2xl font-bold text-[#c5a880]">22 дня</span>
                <span className="text-xs text-stone-300 block mt-1">заказное меню по диетам</span>
              </div>
              <div className="p-4">
                <span className="block font-mono tabular-nums text-2xl font-bold text-[#c5a880]">100%</span>
                <span className="text-xs text-stone-300 block mt-1">курация диетсестрой</span>
              </div>
            </div>
          </div>
        </section>

        {/* DIAGNOSTIC BASE SECTION */}
        <section className="bg-white border border-stone-200 p-6 sm:p-10 space-y-8">
          <div className="border-b border-stone-200 pb-5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#9b7b51] font-bold block mb-1">
              Клиническая и инструментальная диагностика
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22]">
              Диагностическая база санатория
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF9F6] border border-stone-200 p-6 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#9b7b51] font-bold border-b border-stone-200 pb-2">
                01 · Лабораторная диагностика
              </div>
              <h4 className="font-serif text-lg font-bold text-[#022C22]">
                Клинико-биохимическая и ИФА лаборатория
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Лаборатория санатория выполняет широкий спектр клинических, биохимических и иммуноферментных анализов крови, в том числе определяет содержание специфических ферментов для точной оценки функционального состояния органов и контроля эффективности терапии.
              </p>
            </div>

            <div className="bg-[#FAF9F6] border border-[#c5a880] p-6 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#022C22] font-bold border-b border-[#c5a880]/40 pb-2">
                02 · Оснащение 2026 г. · Аппарат «РуСкан»
              </div>
              <h4 className="font-serif text-lg font-bold text-[#022C22]">
                Кабинет ультразвуковой диагностики
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                С 2026 года работает кабинет УЗИ, оснащённый отечественным аппаратом экспертного класса «РуСкан». Проводятся исследования щитовидной железы, печени, желчного пузыря и желчевыводящих путей, почек, мочевого пузыря и мочевыводящих путей, простаты, эндокринной системы, сосудов головы, шеи и нижних конечностей.
              </p>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200 p-6 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#9b7b51] font-bold border-b border-stone-200 pb-2">
                03 · Кардио-респираторный контроль
              </div>
              <h4 className="font-serif text-lg font-bold text-[#022C22]">
                Кабинет функциональной диагностики
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                В кабинете функциональной диагностики проводятся электрокардиографические исследования (ЭКГ) и диагностика функции внешнего дыхания (ФВД / спирография) для объективного подбора нагрузок, терренкура и физиопроцедур.
              </p>
            </div>
          </div>
        </section>

        {/* FULL LICENSE NOMENCLATURE SECTION (24 TYPES OF WORKS/SERVICES) */}
        <section className="bg-white border border-stone-200 overflow-hidden">
          <div className="bg-[#022C22] text-white p-6 sm:p-8 border-b border-[#c5a880]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold mb-1">
                Государственный реестр лицензий Росздравнадзора
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Номенклатура лицензированных медицинских работ и услуг (24 вида)
              </h3>
            </div>
            <div className="text-stone-300 font-mono tabular-nums text-xs border border-[#c5a880]/40 px-4 py-2 bg-white/5 shrink-0">
              Лицензия № <strong className="text-white">Л041-00110-91/00554225</strong>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* License Requisites Header Strip */}
            <div className="bg-[#FAF9F6] border border-stone-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div>
                <span className="text-stone-500 block">Лицензиат:</span>
                <strong className="text-[#022C22] font-bold block mt-1">ФГКУ «Санаторий «Ясная Поляна» ФТС России»</strong>
              </div>
              <div>
                <span className="text-stone-500 block">ИНН / Рег. номер лицензии:</span>
                <strong className="font-mono tabular-nums text-[#022C22] font-bold block mt-1">7713778678 / Л041-00110-91/00554225</strong>
              </div>
              <div>
                <span className="text-stone-500 block">Дата предоставления:</span>
                <strong className="font-mono tabular-nums text-[#022C22] font-bold block mt-1">22.06.2022 (Бессрочно)</strong>
              </div>
              <div>
                <span className="text-stone-500 block">Адрес места осуществления деятельности:</span>
                <strong className="text-[#022C22] font-bold block mt-1">298660, Республика Крым, г. Ялта, пгт. Гаспра, ш. Севастопольское, д. 52</strong>
              </div>
            </div>

            {/* 5 Official Categories with 24 Codes */}
            <div className="space-y-6">
              {licenseCategories.map((cat) => (
                <div key={cat.code} className="border border-stone-200 p-5 sm:p-6 bg-[#FAF9F6]/50">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-4 border-b border-stone-200">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono tabular-nums text-xs font-bold text-[#9b7b51]">
                        Код {cat.code}
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#022C22]">
                        {cat.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-stone-500 shrink-0">
                      Видов работ: {cat.items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.items.map((item) => (
                      <div
                        key={item.code}
                        className="bg-white border border-stone-200 px-3.5 py-2.5 flex items-baseline gap-2.5 text-xs"
                      >
                        <span className="font-mono tabular-nums text-[11px] font-bold text-[#9b7b51] shrink-0">
                          {item.code}
                        </span>
                        <span className="text-[#022C22] font-medium leading-snug">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
