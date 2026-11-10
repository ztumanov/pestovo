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
      <div className="bg-[#022C22] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#c5a880]/30">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Unified Breadcrumbs & Back Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-white/10">
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
              className="group inline-flex items-center space-x-2 border border-[#c5a880]/40 hover:border-[#c5a880] bg-[#011F18] hover:bg-[#c5a880] px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors duration-200 text-[#c5a880] hover:text-[#022C22] cursor-pointer self-start sm:self-auto shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>На главную</span>
            </button>
          </div>

          {/* Structured Header Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center flex-wrap gap-2 bg-[#011F18] border border-[#c5a880]/35 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-[#c5a880]">
                <span>ФГКУ «Санаторий «Ясная Поляна» ФТС России»</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-bold">Лицензия № Л041-00110-91/00554225</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-white">
                Медицинское отделение: Лечение и Диагностика
              </h1>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-3xl">
                В медицинском отделении санатория работают 39 сотрудников, включая 5 врачей с большим опытом в санаторно-курортной сфере. 100% среднего и высшего медицинского персонала аккредитованы. Оказывается полный комплекс бальнеологического, грязевого, физиотерапевтического и реабилитационного лечения по стандартам Минздрава РФ.
              </p>
            </div>

            {/* Official License Verification Card in Header */}
            <div className="lg:col-span-4">
              <div className="bg-[#011F18] border border-[#c5a880]/30 rounded-xl p-5 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#c5a880] font-bold">
                    Государственная лицензия
                  </span>
                  <Award className="w-4 h-4 text-[#c5a880] shrink-0" />
                </div>
                <div>
                  <span className="block font-mono tabular-nums text-sm sm:text-base font-bold text-white">
                    № Л041-00110-91/00554225
                  </span>
                  <span className="block text-xs text-stone-300 mt-1 font-mono tabular-nums">
                    Дата выдачи: 22.06.2022 · Бессрочно
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-300 font-mono tabular-nums">
                  <span>ИНН: 7713778678</span>
                  <span className="text-[#c5a880] font-bold">Росздравнадзор</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Key Metrics Strip — Unified Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-10">
            {[
              { code: '01', val: '39', label: 'сотрудников медицинского отделения', icon: Users },
              { code: '02', val: '100%', label: 'аккредитация среднего и высшего медперсонала', icon: UserCheck },
              { code: '03', val: '5 врачей', label: 'с большим опытом в санаторно-курортной сфере', icon: Stethoscope },
              { code: '04', val: '24 вида', label: 'лицензированных медицинских работ и услуг', icon: FileText }
            ].map((item) => {
              const MetricIcon = item.icon;
              return (
                <div
                  key={item.code}
                  className="p-4 sm:p-5 bg-[#011F18] border border-[#c5a880]/25 rounded-xl flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880] shrink-0">
                      <MetricIcon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#c5a880]/80 tabular-nums">
                      {item.code}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#c5a880] leading-none">
                      {item.val}
                    </span>
                    <span className="text-xs text-stone-300 mt-2 block leading-snug">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {isAdminMode && (
            <div className="mt-6">
              <button 
                onClick={() => { setActiveSettingsTab('medical'); setCurrentPage('admin'); }}
                className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-400 font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                Редактировать программы в Админке
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14 sm:space-y-16">
        
        {/* MEDICAL LEADERSHIP & SPECIALIST CONSULTATIONS */}
        <section className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Medical Service Leadership */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="h-[1px] w-8 bg-[#7C5E38]"></span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#7C5E38] font-bold">
                    Руководство медицинской службой · с января 2025 года
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22] tracking-tight">
                      Душкин Игорь Фёдорович
                    </h2>
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold block mt-1">
                      Заведующий медицинским отделением санатория
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-[#022C22] text-[#c5a880] border border-[#c5a880]/40 flex items-center justify-center shrink-0 hidden sm:flex">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                {/* Structured Qualifications Block */}
                <div className="bg-[#FAF9F6] border border-stone-200/90 rounded-xl p-4 sm:p-5 space-y-2.5">
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-[#7C5E38] font-bold border-b border-stone-200 pb-2">
                    Квалификация, учёная степень и государственные звания
                  </span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {[
                      'Врач высшей категории',
                      'Кандидат медицинских наук',
                      'Заслуженный врач Республики Крым',
                      'Доцент по специальности «Восстановительная медицина»',
                      'Ветеран боевых действий СВО'
                    ].map((qual, qIdx) => (
                      <span
                        key={qIdx}
                        className="inline-flex items-center gap-1.5 bg-white border border-stone-200/90 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#022C22]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7C5E38] shrink-0" />
                        <span>{qual}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  Под руководством И.Ф. Душкина организована комплексная система восстановительного лечения, бальнеогрязелечения Сакскими сульфидными грязями, аппаратной физиотерапии и функционально-ультразвуковой диагностики в строгом соответствии с клиническими рекомендациями Минздрава РФ.
                </p>
              </div>
            </div>

            {/* Right Column: Specialist Consultations Grid */}
            <div className="lg:col-span-5 bg-[#022C22] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#c5a880]/30">
              <div className="space-y-5">
                <div className="border-b border-white/10 pb-3.5">
                  <div className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 shrink-0" />
                    <span>Консультации врачей-специалистов</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mt-2">
                    Согласно стандартам оказания санаторно-курортной помощи, отдыхающие проходят прием лечащего врача-терапевта и получают консультации профильных специалистов:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { role: 'Врач-терапевт', note: 'Ведение курса лечения' },
                    { role: 'Врач-физиотерапевт', note: 'Подбор аппаратных методик' },
                    { role: 'Врач-педиатр', note: 'Оздоровление детей с 4 лет' },
                    { role: 'Врач функциональной диагностики', note: 'ЭКГ и спирография (ФВД)' },
                    { role: 'Врач УЗ-диагностики', note: 'Аппарат экспертного класса «РуСкан»' },
                    { role: 'Медсестра диетическая', note: 'Курация диеты весь срок лечения' }
                  ].map((spec, idx) => (
                    <div
                      key={idx}
                      className="bg-[#011F18] border border-[#c5a880]/25 rounded-xl p-3.5 flex flex-col justify-between h-full"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#c5a880]/80 tabular-nums">
                          0{idx + 1}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]/60" />
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-[13px] text-white block leading-snug">
                          {spec.role}
                        </span>
                        <span className="text-[11px] text-[#c5a880] block mt-1 leading-snug">
                          {spec.note}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STEP GUEST ROUTE (ПОШАГОВЫЙ МАРШРУТ ГОСТЯ) */}
        <section className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 space-y-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-[1px] w-8 bg-[#7C5E38]"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7C5E38] font-bold">
                  Порядок назначения процедур · Форма 072/у и 076/у
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22] tracking-tight mt-1">
                Маршрут гостя: как организовано лечение в санатории
              </h3>
            </div>
            <button
              onClick={() => {
                setCurrentPage('documents');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold uppercase tracking-wider text-[#022C22] hover:text-[#7C5E38] bg-[#F2EFE9] hover:bg-[#c5a880]/20 border border-stone-200/90 px-4 py-2.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start md:self-auto whitespace-nowrap"
            >
              <span>Перечень документов для заезда</span>
              <ChevronRight className="w-4 h-4 text-[#7C5E38]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guestSteps.map((step) => (
              <div
                key={step.num}
                className="border border-stone-200/90 hover:border-[#c5a880] transition-colors rounded-xl bg-[#FAF9F6] p-5 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3.5">
                    <span className="bg-[#022C22] text-[#c5a880] font-mono tabular-nums text-xs font-bold px-2.5 py-1 rounded-md">
                      Этап {step.num}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#7C5E38] font-semibold">
                      Регламент
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#022C22] mb-2 leading-snug">
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
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-[1px] w-8 bg-[#7C5E38]"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7C5E38] font-bold">
                  Профильные медицинские программы
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22] tracking-tight mt-1">
                Клинические направления оздоровления
              </h3>
            </div>

            {/* Interactive Profile Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F2EFE9] p-1.5 rounded-xl border border-stone-200/90">
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
                    className={`px-3 py-1.5 lg:px-3.5 lg:py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#022C22] text-[#c5a880] shadow-2xs'
                        : 'text-stone-700 hover:text-[#022C22] hover:bg-white/80'
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
              <div className="bg-white p-4 sm:p-5 border border-stone-200/90 rounded-xl shadow-xs">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#7C5E38] mb-2">
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
                    className="w-full text-sm bg-[#FAF9F6] border border-stone-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#022C22] transition-colors"
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
                        className={`w-full text-left p-4 sm:p-4.5 border rounded-xl transition-colors duration-200 flex items-start justify-between group cursor-pointer ${
                          isSelected 
                            ? 'bg-[#022C22] border-[#022C22] text-white shadow-sm' 
                            : 'bg-white border-stone-200/90 hover:border-[#c5a880] text-[#022C22]'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5 min-w-0">
                          <span className={`font-mono tabular-nums text-xs font-bold px-2 py-1 rounded-md shrink-0 mt-0.5 ${
                            isSelected ? 'bg-[#011F18] text-[#c5a880] border border-[#c5a880]/30' : 'bg-[#F2EFE9] text-[#7C5E38]'
                          }`}>
                            0{index + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className={`font-serif font-bold text-sm sm:text-base leading-snug ${isSelected ? 'text-white' : 'text-[#022C22]'}`}>
                              {prog.title}
                            </h4>
                            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                              {prog.shortDesc}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-white border border-stone-200 rounded-xl text-stone-500 text-sm font-serif">
                    Программы по запросу не найдены
                  </div>
                )}
              </div>

              {/* SANATORNO-KURORTNAYA KARTA INFO CARD */}
              <div className="bg-[#F2EFE9] border border-stone-200/90 rounded-xl p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#022C22] text-[#c5a880] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#022C22]">Санаторно-курортная карта</h5>
                    <p className="text-xs text-stone-700 leading-relaxed mt-1">
                      Для назначения полного комплекса бальнео-, грязе- и физиопроцедур требуется санаторно-курортная карта (форма 072/у для взрослых, 076/у для детей).
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 border-t border-stone-300/70 pt-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#022C22] text-[#c5a880] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#022C22]">Индивидуальные назначения</h5>
                    <p className="text-xs text-stone-700 leading-relaxed mt-1">
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
                    className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs"
                  >
                    
                    {/* Hero Image inside program card */}
                    <div className="relative h-64 sm:h-76 w-full overflow-hidden bg-[#011F18]">
                      <img
                        src={activeProgramObj.image || images.medical || '/images/pestovo_medical_1779777676990.png'}
                        alt={activeProgramObj.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#011F18]/90 via-[#022C22]/40 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center flex-wrap gap-2 bg-[#011F18]/90 border border-[#c5a880]/40 px-3 py-1 rounded-lg text-[#c5a880] text-xs font-mono uppercase tracking-wider font-bold mb-2.5">
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
                    <div className="p-6 sm:p-8 lg:p-10 space-y-8">
                      <div className="bg-[#FAF9F6] border border-stone-200/90 rounded-xl p-5 sm:p-6">
                        <span className="block text-[11px] font-mono uppercase tracking-widest text-[#7C5E38] font-bold mb-1.5">
                          Клиническая характеристика
                        </span>
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-[#022C22] mb-2.5">
                          Клиническое описание программы
                        </h4>
                        <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                          {activeProgramObj.fullDesc}
                        </p>
                      </div>

                      {/* Indications & Procedures list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Indications */}
                        <div className="bg-[#FAF9F6] p-5 sm:p-6 border border-stone-200/90 rounded-xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                              <h4 className="text-[#022C22] font-sans text-xs uppercase tracking-wider font-bold flex items-center">
                                <Check className="w-4 h-4 text-[#022C22] mr-2 shrink-0" />
                                Показания к назначению
                              </h4>
                              <span className="font-mono text-[11px] text-[#7C5E38] font-bold tabular-nums">
                                {activeProgramObj.indications?.length || 0} поз.
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {activeProgramObj.indications?.map((ind, i) => (
                                <li
                                  key={i}
                                  className="bg-white border border-stone-200/80 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-700 flex items-start leading-snug font-sans"
                                >
                                  <span className="font-mono tabular-nums text-[11px] font-bold text-[#7C5E38] mr-2.5 mt-0.5 shrink-0">
                                    {String(i + 1).padStart(2, '0')}.
                                  </span>
                                  <span>{ind}</span>
                                </li>
                              )) || <li className="text-xs text-stone-500 font-sans">Определяются лечащим врачом</li>}
                            </ul>
                          </div>
                        </div>

                        {/* Procedures */}
                        <div className="bg-[#FAF9F6] p-5 sm:p-6 border border-stone-200/90 rounded-xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                              <h4 className="text-[#022C22] font-sans text-xs uppercase tracking-wider font-bold flex items-center">
                                <Stethoscope className="w-4 h-4 text-[#7C5E38] mr-2 shrink-0" />
                                Применяемые методики и процедуры
                              </h4>
                              <span className="font-mono text-[11px] text-[#7C5E38] font-bold tabular-nums">
                                {activeProgramObj.procedures?.length || 0} мет.
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {activeProgramObj.procedures?.map((proc, i) => (
                                <li
                                  key={i}
                                  className="bg-white border border-stone-200/80 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-700 flex items-start leading-snug font-sans"
                                >
                                  <span className="font-mono tabular-nums text-[11px] font-bold text-[#022C22] mr-2.5 mt-0.5 shrink-0">
                                    {String(i + 1).padStart(2, '0')}.
                                  </span>
                                  <span>{proc}</span>
                                </li>
                              )) || <li className="text-xs text-stone-500 font-sans">Назначаются индивидуально</li>}
                            </ul>
                          </div>
                        </div>

                      </div>

                      {/* Booking Prompt */}
                      <div className="bg-[#022C22] text-[#FAF9F6] p-5 sm:p-6 rounded-xl border border-[#c5a880]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div className="space-y-1">
                          <span className="text-[#c5a880] font-bold text-xs uppercase tracking-wider font-mono block">
                            Стандарты санаторно-курортной помощи
                          </span>
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
                          className="bg-[#c5a880] hover:bg-[#bca075] text-[#022C22] px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
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
        <section className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 space-y-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-[1px] w-8 bg-[#7C5E38]"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7C5E38] font-bold">
                  Структура медицинского отделения · 9 профильных подразделений
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22] tracking-tight mt-1">
                Лечебные кабинеты, оборудование и бальнеогрязелечение
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-md leading-relaxed">
              Ванны чередуются с лечебными душами, аппаратной физиотерапией, грязевыми аппликациями Сакского озера и занятиями ЛФК.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {medicalCabinets.map((cab) => (
              <div
                key={cab.num}
                className="bg-[#FAF9F6] border border-stone-200/90 rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#c5a880] transition-colors h-full"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#022C22] text-[#c5a880] font-mono tabular-nums text-xs font-bold flex items-center justify-center shrink-0">
                      {cab.num}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#7C5E38] font-bold text-right leading-tight">
                      {cab.subtitle}
                    </span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#022C22] leading-snug">
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
          <div className="bg-[#022C22] text-white p-6 sm:p-8 rounded-xl border border-[#c5a880]/30 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center gap-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">
                <Utensils className="w-4 h-4 shrink-0" />
                <span>Лечебное диетическое питание · 22-дневное заказное меню</span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Организация диетического питания под контролем Совета по питанию
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                Диетическое питание отдыхающих осуществляется по заказной системе на основании 22-дневного меню с учётом рекомендаций специалистов Совета по питанию. Столовая санатория оснащена новым технологическим оборудованием. Согласно диете, назначенной лечащим врачом, отдыхающих весь срок лечения курирует медицинская сестра диетическая.
              </p>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-[#011F18] border border-[#c5a880]/25 rounded-xl">
                <span className="block font-mono tabular-nums text-2xl font-bold text-[#c5a880]">22 дня</span>
                <span className="text-xs text-stone-300 block mt-1.5">заказное меню по диетам</span>
              </div>
              <div className="p-4 bg-[#011F18] border border-[#c5a880]/25 rounded-xl">
                <span className="block font-mono tabular-nums text-2xl font-bold text-[#c5a880]">100%</span>
                <span className="text-xs text-stone-300 block mt-1.5">курация диетсестрой</span>
              </div>
            </div>
          </div>
        </section>

        {/* DIAGNOSTIC BASE SECTION */}
        <section className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 space-y-8 shadow-xs">
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center space-x-2 mb-1">
              <span className="h-[1px] w-8 bg-[#7C5E38]"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#7C5E38] font-bold">
                Клиническая и инструментальная диагностика
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#022C22] tracking-tight mt-1">
              Диагностическая база санатория
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF9F6] border border-stone-200/90 rounded-xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#7C5E38] font-bold">
                    01 · Лабораторная диагностика
                  </span>
                  <Microscope className="w-4 h-4 text-[#7C5E38] shrink-0" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#022C22] leading-snug">
                  Клинико-биохимическая и ИФА лаборатория
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Лаборатория санатория выполняет широкий спектр клинических, биохимических и иммуноферментных анализов крови, в том числе определяет содержание специфических ферментов для точной оценки функционального состояния органов и контроля эффективности терапии.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border-2 border-[#c5a880] rounded-xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#c5a880]/40 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#022C22] font-bold">
                    02 · Оснащение 2026 г. · Аппарат «РуСкан»
                  </span>
                  <span className="bg-[#022C22] text-[#c5a880] font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    2026
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#022C22] leading-snug">
                  Кабинет ультразвуковой диагностики
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  С 2026 года работает кабинет УЗИ, оснащённый отечественным аппаратом экспертного класса «РуСкан». Проводятся исследования щитовидной железы, печени, желчного пузыря и желчевыводящих путей, почек, мочевого пузыря и мочевыводящих путей, простаты, эндокринной системы, сосудов головы, шеи и нижних конечностей.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/90 rounded-xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#7C5E38] font-bold">
                    03 · Кардио-респираторный контроль
                  </span>
                  <Activity className="w-4 h-4 text-[#7C5E38] shrink-0" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#022C22] leading-snug">
                  Кабинет функциональной диагностики
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  В кабинете функциональной диагностики проводятся электрокардиографические исследования (ЭКГ) и диагностика функции внешнего дыхания (ФВД / спирография) для объективного подбора нагрузок, терренкура и физиопроцедур.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FULL LICENSE NOMENCLATURE SECTION (24 TYPES OF WORKS/SERVICES) */}
        <section className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-[#022C22] text-white p-6 sm:p-8 border-b border-[#c5a880]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold mb-1.5 flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0" />
                <span>Государственный реестр лицензий Росздравнадзора</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Номенклатура лицензированных медицинских работ и услуг (24 вида)
              </h3>
            </div>
            <div className="text-stone-200 font-mono tabular-nums text-xs border border-[#c5a880]/40 rounded-xl px-4 py-3 bg-[#011F18] shrink-0 self-start md:self-auto">
              Лицензия № <strong className="text-[#c5a880] font-bold">Л041-00110-91/00554225</strong>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* License Requisites Header Strip — Structured Cells */}
            <div className="bg-[#F2EFE9] border border-stone-300/80 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              <div className="bg-white border border-stone-200/90 rounded-lg p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#7C5E38] font-bold block">Лицензиат:</span>
                <strong className="text-[#022C22] font-bold block mt-1.5 text-xs sm:text-[13px] leading-snug">
                  ФГКУ «Санаторий «Ясная Поляна» ФТС России»
                </strong>
              </div>
              <div className="bg-white border border-stone-200/90 rounded-lg p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#7C5E38] font-bold block">ИНН / Рег. номер лицензии:</span>
                <strong className="font-mono tabular-nums text-[#022C22] font-bold block mt-1.5 text-xs sm:text-[13px] leading-snug">
                  7713778678 / Л041-00110-91/00554225
                </strong>
              </div>
              <div className="bg-white border border-stone-200/90 rounded-lg p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#7C5E38] font-bold block">Дата предоставления:</span>
                <strong className="font-mono tabular-nums text-[#022C22] font-bold block mt-1.5 text-xs sm:text-[13px] leading-snug">
                  22.06.2022 (Бессрочно)
                </strong>
              </div>
              <div className="bg-white border border-stone-200/90 rounded-lg p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#7C5E38] font-bold block">Адрес места осуществления деятельности:</span>
                <strong className="text-[#022C22] font-bold block mt-1.5 text-xs sm:text-[13px] leading-snug">
                  298660, Республика Крым, г. Ялта, пгт. Гаспра, ш. Севастопольское, д. 52
                </strong>
              </div>
            </div>

            {/* 5 Official Categories with 24 Codes — Structured Registry Tables */}
            <div className="space-y-5">
              {licenseCategories.map((cat) => (
                <div key={cat.code} className="border border-stone-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="bg-[#FAF9F6] px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="bg-[#022C22] text-[#c5a880] font-mono tabular-nums text-xs font-bold px-2.5 py-1 rounded-md shrink-0">
                        Код {cat.code}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#022C22] leading-snug">
                        {cat.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono tabular-nums font-semibold text-[#022C22] bg-[#F2EFE9] border border-stone-200/90 px-3 py-1 rounded-md shrink-0 self-start sm:self-auto">
                      Видов работ: {cat.items.length}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 bg-white">
                    {cat.items.map((item) => (
                      <div
                        key={item.code}
                        className="bg-[#FAF9F6] hover:bg-[#F2EFE9]/70 transition-colors border border-stone-200/90 rounded-lg px-3.5 py-2.5 flex items-baseline gap-2.5 text-xs"
                      >
                        <span className="font-mono tabular-nums text-[11px] font-bold text-[#7C5E38] bg-[#c5a880]/15 border border-[#c5a880]/30 px-2 py-0.5 rounded shrink-0">
                          {item.code}
                        </span>
                        <span className="text-[#022C22] font-semibold leading-snug">
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
