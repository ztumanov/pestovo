import React, { useState, useEffect } from 'react';
import { useAdminData, SiteData } from '../context/AdminDataContext';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Settings, 
  Home, 
  Phone, 
  Building, 
  HeartHandshake, 
  MessageSquare, 
  HelpCircle, 
  Eye, 
  Folder,
  Sparkles,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Database,
  CheckCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, MedicalProgram, Testimonial, FAQItem } from '../types';

export default function AdminPage({ onBackToHome }: { onBackToHome: () => void }) {
  const {
    siteData,
    updateSiteData,
    updateSection,
    resetToDefault,
    isAdminMode,
    setIsAdminMode,
    activeSettingsTab,
    setActiveSettingsTab,
    currentPage,
    setCurrentPage
  } = useAdminData();

  // Temporary local states for editing
  const [localResortInfo, setLocalResortInfo] = useState({ ...siteData.resortInfo });
  const [localHero, setLocalHero] = useState({ ...siteData.hero });
  const [localImages, setLocalImages] = useState({ ...siteData.images });
  const [localVideos, setLocalVideos] = useState({ ...siteData.videos });
  const [localExtraImages, setLocalExtraImages] = useState({ ...siteData.extraImages });

  // For managing lists
  const [rooms, setRooms] = useState<Room[]>([...siteData.rooms]);
  const [medPrograms, setMedPrograms] = useState<MedicalProgram[]>([...siteData.medicalPrograms]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([...siteData.testimonials]);
  const [faqs, setFaqs] = useState<FAQItem[]>([...siteData.faqs]);

  // Selected sub-items being edited in forms
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  // States for adding new items
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddFaq, setShowAddFaq] = useState(false);

  // State to show save indicator
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmClass?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleResetToDefault = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Сбросить оформление?',
      message: 'Вы действительно хотите сбросить все внесенные изменения и вернуть исходное оформление сайта? Все измененные тексты, изображения, добавленные номера и отзывы будут удалены.',
      confirmText: 'Да, сбросить',
      confirmClass: 'bg-red-600 hover:bg-red-700 text-white font-bold',
      onConfirm: () => {
        localStorage.removeItem('pestovo_resort_editable_data');
        window.location.reload();
      }
    });
  };

  // Sync local state when siteData changes (e.g. loaded dynamically from localStorage on mount)
  useEffect(() => {
    setLocalResortInfo({ ...siteData.resortInfo });
    setLocalHero({ ...siteData.hero });
    setLocalImages({ ...siteData.images });
    setLocalVideos({ ...siteData.videos });
    setLocalExtraImages({ ...siteData.extraImages });
    setRooms([...siteData.rooms]);
    setMedPrograms([...siteData.medicalPrograms]);
    setTestimonials([...siteData.testimonials]);
    setFaqs([...siteData.faqs]);
  }, [siteData]);

  if (!isAdminMode) {
    return (
      <div className="min-h-screen bg-[#022C22] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#0a3d31] border border-[#c5a880]/40 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-[#c5a880]/15 border border-[#c5a880] rounded-full flex items-center justify-center text-[#c5a880] mx-auto text-xl">
            🔒
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#FAF9F6]">Доступ ограничен</h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            Для управления содержимым санатория «Пестово» необходимо войти с правами администратора.
          </p>
          <button 
            onClick={onBackToHome}
            className="w-full bg-[#c5a880] hover:bg-[#b0936b] text-[#022C22] font-semibold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const handleSaveGeneral = () => {
    updateSection('resortInfo', localResortInfo);
    triggerSuccess();
  };

  const handleSaveHero = () => {
    updateSection('hero', localHero);
    updateSection('images', localImages);
    triggerSuccess();
  };

  const handleSaveMedia = () => {
    updateSection('images', localImages);
    updateSection('videos', localVideos);
    updateSection('extraImages', localExtraImages);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // ROOMS HANDLERS
  const handleUpdateRoom = (roomId: string, updatedRoom: Room) => {
    const nextRooms = rooms.map(r => r.id === roomId ? updatedRoom : r);
    setRooms(nextRooms);
    updateSection('rooms', nextRooms);
    setEditingRoomId(null);
    triggerSuccess();
  };

  const handleDeleteRoom = (roomId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить категорию номера?',
      message: 'Вы уверены, что хотите навсегда удалить эту категорию номера? Это действие невозможно отменить.',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextRooms = rooms.filter(r => r.id !== roomId);
        setRooms(nextRooms);
        updateSection('rooms', nextRooms);
        triggerSuccess();
      }
    });
  };

  const handleAddRoom = (newRoom: Omit<Room, 'id'>) => {
    const created: Room = {
      ...newRoom,
      id: `room-${Date.now()}`
    };
    const nextRooms = [...rooms, created];
    setRooms(nextRooms);
    updateSection('rooms', nextRooms);
    setShowAddRoom(false);
    triggerSuccess();
  };

  // MEDICAL PROGRAMS HANDLERS
  const handleUpdateMed = (medId: string, updatedMed: MedicalProgram) => {
    const nextMeds = medPrograms.map(m => m.id === medId ? updatedMed : m);
    setMedPrograms(nextMeds);
    updateSection('medicalPrograms', nextMeds);
    setEditingMedId(null);
    triggerSuccess();
  };

  const handleDeleteMed = (medId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить программу лечения?',
      message: 'Вы уверены, что хотите навсегда удалить эту лечебную программу?',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextMeds = medPrograms.filter(m => m.id !== medId);
        setMedPrograms(nextMeds);
        updateSection('medicalPrograms', nextMeds);
        triggerSuccess();
      }
    });
  };

  const handleAddMed = (newMed: Omit<MedicalProgram, 'id'>) => {
    const created: MedicalProgram = {
      ...newMed,
      id: `med-${Date.now()}`
    };
    const nextMeds = [...medPrograms, created];
    setMedPrograms(nextMeds);
    updateSection('medicalPrograms', nextMeds);
    setShowAddMed(false);
    triggerSuccess();
  };

  // TESTIMONIALS HANDLERS
  const handleUpdateTest = (testId: string, updatedTest: Testimonial) => {
    const nextTests = testimonials.map(t => t.id === testId ? updatedTest : t);
    setTestimonials(nextTests);
    updateSection('testimonials', nextTests);
    setEditingTestId(null);
    triggerSuccess();
  };

  const handleDeleteTest = (testId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить отзыв?',
      message: 'Вы уверены, что хотите безвозвратно удалить этот отзыв отдыхающего?',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextTests = testimonials.filter(t => t.id !== testId);
        setTestimonials(nextTests);
        updateSection('testimonials', nextTests);
        triggerSuccess();
      }
    });
  };

  const handleAddTest = (newTest: Omit<Testimonial, 'id'>) => {
    const created: Testimonial = {
      ...newTest,
      id: `test-${Date.now()}`
    };
    const nextTests = [...testimonials, created];
    setTestimonials(nextTests);
    updateSection('testimonials', nextTests);
    setShowAddTest(false);
    triggerSuccess();
  };

  // FAQ HANDLERS
  const handleUpdateFaq = (faqId: string, updatedFaq: FAQItem) => {
    const nextFaqs = faqs.map(f => f.id === faqId ? updatedFaq : f);
    setFaqs(nextFaqs);
    updateSection('faqs', nextFaqs);
    setEditingFaqId(null);
    triggerSuccess();
  };

  const handleDeleteFaq = (faqId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить вопрос-ответ?',
      message: 'Вы уверены, что хотите удалить этот часто задаваемый вопрос?',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextFaqs = faqs.filter(f => f.id !== faqId);
        setFaqs(nextFaqs);
        updateSection('faqs', nextFaqs);
        triggerSuccess();
      }
    });
  };

  const handleAddFaq = (newFaq: Omit<FAQItem, 'id'>) => {
    const created: FAQItem = {
      ...newFaq,
      id: `faq-${Date.now()}`
    };
    const nextFaqs = [...faqs, created];
    setFaqs(nextFaqs);
    updateSection('faqs', nextFaqs);
    setShowAddFaq(false);
    triggerSuccess();
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Пожалуйста, выберите файл изображения (png, jpg, jpeg, webp).');
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError('Файл слишком большой. Рекомендуется изображение ужать до 2.5 МБ для бесперебойного сохранения в браузере.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const resultStr = e.target.result;
        setLocalImages(prev => ({ ...prev, hero: resultStr }));
        setLocalHero(prev => ({ ...prev, defaultBackgroundMode: 'photo' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: 'hero', name: 'Главная', icon: Home },
    { id: 'general', name: 'Контакты & Инфо', icon: Phone },
    { id: 'rooms', name: 'Каталог Номеров', icon: Building, badge: rooms.length },
    { id: 'medical', name: 'Программы Лечения', icon: HeartHandshake, badge: medPrograms.length },
    { id: 'testimonials', name: 'Отзывы Гостей', icon: MessageSquare, badge: testimonials.length },
    { id: 'faq', name: 'Вопросы & Ответы', icon: HelpCircle, badge: faqs.length },
    { id: 'media', name: 'Медиа & Ссылки', icon: Folder },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      {/* SIDEBAR BLOCK (Deep Emerald) */}
      <aside className="w-full md:w-80 bg-[#022C22] text-[#FAF9F6] flex flex-col md:fixed md:inset-y-0 md:left-0 z-30 border-r border-[#c5a880]/30 shadow-2xl">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#c5a880]/20 bg-[#011F18]/80 flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#c5a880]/15 border border-[#c5a880]/60 rounded-xl text-[#c5a880]">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#FAF9F6] tracking-wide uppercase">Панель Управления</h2>
              <p className="text-[9px] font-mono tracking-widest text-[#c5a880]/80 uppercase">Офис Администратора</p>
            </div>
          </div>
          <div className="pt-2">
            <span className="text-[10px] font-semibold bg-emerald-900 border border-emerald-600 px-2 py-0.5 rounded text-emerald-300 uppercase tracking-wider">
              Режим Разработчика
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 py-6 space-y-1.5 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeSettingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSettingsTab(tab.id);
                  setEditingRoomId(null);
                  setEditingMedId(null);
                  setEditingTestId(null);
                  setEditingFaqId(null);
                  setShowAddRoom(false);
                  setShowAddMed(false);
                  setShowAddTest(false);
                  setShowAddFaq(false);
                }}
                className={`w-full text-left py-3 px-4 text-xs font-semibold rounded-xl transition-all flex items-center justify-between border uppercase tracking-wider cursor-pointer ${
                  active 
                    ? 'bg-[#c5a880] text-[#022C22] border-[#c0a278] shadow-md font-bold' 
                    : 'bg-transparent text-[#FAF9F6]/80 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#022C22]' : 'text-[#c5a880]'}`} />
                  <span>{tab.name}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${active ? 'bg-[#022C22]/10 text-[#022C22]' : 'bg-white/10 text-[#c5a880]'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-[#c5a880]/15 space-y-3 bg-[#011F18]/50">
          <button 
            onClick={handleResetToDefault}
            className="w-full flex items-center justify-center space-x-2 border border-red-500/30 text-red-300 hover:text-white hover:bg-red-950/40 text-[11px] py-2.5 rounded-xl transition-all uppercase tracking-wider font-semibold cursor-pointer"
            title="Сбросить все Ваши правки и вернуть стандартный сайт"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить оформление</span>
          </button>

          <button 
            onClick={onBackToHome}
            className="w-full bg-[#FAF9F6]/10 hover:bg-[#FAF9F6]/15 text-[#FAF9F6] border border-white/10 text-[11px] py-2.5 rounded-xl transition-all uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#c5a880]" />
            Вернуться на сайт
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE REGION */}
      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        
        {/* Workspace TOP header bar */}
        <header className="bg-white border-b border-stone-200 p-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-stone-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
              <span>ПАНЕЛЬ АДМИНИСТРАТИВНОГО УПРАВЛЕНИЯ</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">В СЕТИ</span>
            </div>
            <h1 className="font-serif font-black text-2xl md:text-3xl text-[#022C22] mt-1">
              {siteData.resortInfo.name.toUpperCase()}
            </h1>
            <p className="text-xs text-stone-500 font-medium">Гаспра • Крым • Виртуальный издатель контента</p>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={onBackToHome}
              className="bg-[#022C22] hover:bg-[#c5a880] text-[#FAF9F6] hover:text-[#022C22] font-semibold text-xs py-2.5 px-5 rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 border border-transparent shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться на сайт
            </button>
          </div>
        </header>

        {/* METRICS & QUICK SUMMARY */}
        <section className="bg-white border-b border-stone-100 p-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            
            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Категорий Номеров</span>
                <span className="text-lg font-black block font-mono text-stone-800">{rooms.length}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Программ Лечения</span>
                <span className="text-lg font-black block font-mono text-stone-800">{medPrograms.length}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Отзывов Гостей</span>
                <span className="text-lg font-black block font-mono text-stone-800">{testimonials.length}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Частых Вопросов</span>
                <span className="text-lg font-black block font-mono text-stone-800">{faqs.length}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 hidden lg:flex items-center space-x-3.5 shadow-sm col-span-1">
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">БД сайта</span>
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> Сохранено
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 p-6 md:p-10 max-w-5xl w-full">
          
          {/* TOASTER ALERT SUCCESS */}
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-emerald-800 text-emerald-50 border border-emerald-600 p-4 rounded-xl flex items-center gap-3 text-sm shadow-lg mb-6"
            >
              <div className="p-1.5 bg-white/10 rounded-full">
                <Sparkles className="w-4 h-4 text-[#c5a880]" />
              </div>
              <div>
                <p className="font-bold">Изменения зафиксированы успешно!</p>
                <p className="text-xs text-stone-300">Правки внесены в постоянную базу данных Вашего браузера.</p>
              </div>
            </motion.div>
          )}

          {/* TAB 1: HERO */}
          {activeSettingsTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif font-black text-xl text-[#022C22]">Раздел Welcome Atrium (Главный экран)</h3>
                <p className="text-xs text-stone-400 mt-1">Настройка надписей, главных призывов и режима графической заставки.</p>
              </div>
              
              <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Золотой бейдж сверху</label>
                  <input 
                    type="text" 
                    value={localHero.badge} 
                    onChange={e => setLocalHero({ ...localHero, badge: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 focus:ring-1 focus:ring-[#c5a880]/80"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Заголовок 1 (первая строка)</label>
                    <input 
                      type="text" 
                      value={localHero.titleFirstPart} 
                      onChange={e => setLocalHero({ ...localHero, titleFirstPart: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 focus:ring-1 focus:ring-[#c5a880]/80 font-serif font-bold text-stone-850"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Заголовок 2 (золотая строка)</label>
                    <input 
                      type="text" 
                      value={localHero.titleSecondPart} 
                      onChange={e => setLocalHero({ ...localHero, titleSecondPart: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 focus:ring-1 focus:ring-[#c5a880]/80 font-serif font-bold text-[#b0936b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Описательный подзаголовок</label>
                  <textarea 
                    rows={4}
                    value={localHero.subtitle} 
                    onChange={e => setLocalHero({ ...localHero, subtitle: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 focus:ring-1 focus:ring-[#c5a880]/80 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Текст главной кнопки действия</label>
                  <input 
                    type="text" 
                    value={localHero.ctaText} 
                    onChange={e => setLocalHero({ ...localHero, ctaText: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 focus:ring-1 focus:ring-[#c5a880]/80 font-semibold text-stone-850"
                  />
                </div>

                {/* BACKGROUND IMAGE CONFIGURATION SECTION */}
                <div className="border-t border-stone-100 pt-6 mt-6 space-y-4">
                  <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#c5a880]" />
                    Фоновое оформление главного экрана
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Настройте стиль приветственной заставки. Вы можете выбрать живое видео или установить <strong>собственное фоновое изображение (фото)</strong>.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Mode Choice & Fields */}
                    <div className="lg:col-span-7 space-y-4">
                      
                      <div className="space-y-2 bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#022C22]">Режим заставки по умолчанию</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setLocalHero({ ...localHero, defaultBackgroundMode: 'video_nature' })}
                            className={`p-3 text-xs rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              localHero.defaultBackgroundMode === 'video_nature'
                                ? 'bg-[#022C22] text-[#FAF9F6] border-stone-800 font-bold shadow'
                                : 'bg-white hover:bg-[#FAF9F6] text-stone-700 border-stone-200'
                            }`}
                          >
                            <VideoIcon className="w-4 h-4 text-[#c5a880]" />
                            <span>Природа (MP4)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setLocalHero({ ...localHero, defaultBackgroundMode: 'video_palace' })}
                            className={`p-3 text-xs rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              localHero.defaultBackgroundMode === 'video_palace'
                                ? 'bg-[#022C22] text-[#FAF9F6] border-stone-800 font-bold shadow'
                                : 'bg-white hover:bg-[#FAF9F6] text-stone-700 border-stone-200'
                            }`}
                          >
                            <VideoIcon className="w-4 h-4 text-[#c5a880] animate-pulse" />
                            <span>Дворец (YouTube)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' })}
                            className={`p-3 text-xs rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              localHero.defaultBackgroundMode === 'photo'
                                ? 'bg-[#022C22] text-[#FAF9F6] border-stone-800 font-bold shadow'
                                : 'bg-white hover:bg-[#FAF9F6] text-stone-700 border-stone-200'
                            }`}
                          >
                            <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                            <span>Фото-подложка</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1.5 flex items-center justify-between">
                          <span>Адрес (URL) фонового изображения</span>
                          <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 rounded font-semibold uppercase">Активен</span>
                        </label>
                        <input 
                          type="text" 
                          value={localImages.hero} 
                          onChange={e => {
                            setLocalImages({ ...localImages, hero: e.target.value });
                            setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                          }}
                          placeholder="https://images.unsplash.com/... или base64 код"
                          className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#c5a880]/80"
                        />
                      </div>

                      {/* File upload drag-and-drop info */}
                      <div 
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                          dragActive 
                            ? 'border-[#c5a880] bg-[#c5a880]/10 scale-[0.99]' 
                            : 'border-stone-300 hover:border-[#c5a880] hover:bg-stone-50'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragActive(true);
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragActive(false);
                          if (e.dataTransfer.files?.[0]) {
                            handleFile(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => {
                          document.getElementById('welcome-bg-file-upload-page')?.click();
                        }}
                      >
                        <input 
                          type="file" 
                          id="welcome-bg-file-upload-page" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFile(e.target.files[0]);
                            }
                          }}
                        />
                        <ImageIcon className="w-6 h-6 mx-auto text-stone-400 mb-1" />
                        <span className="text-[11px] block text-stone-500 font-semibold">Перетащите сюда фото или кликните</span>
                        <span className="text-[9px] text-stone-400 block mt-0.5">Форматы: JPG, PNG, WEBP (до 2.5 МБ)</span>
                      </div>
                      {uploadError && (
                        <p className="text-[10px] text-red-500 mt-1 font-medium">{uploadError}</p>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1.5">Предустановленные фотографии:</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setLocalImages({ ...localImages, hero: '/src/assets/images/pestovo_palace_1779780890544.png' });
                              setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                            }}
                            className={`px-3 py-2 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                              localImages.hero === '/src/assets/images/pestovo_palace_1779780890544.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-950 font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            }`}
                          >
                            🏰 Дворец Паниной
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalImages({ ...localImages, hero: '/src/assets/images/pestovo_beach_1779780925661.png' });
                              setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                            }}
                            className={`px-3 py-2 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                              localImages.hero === '/src/assets/images/pestovo_beach_1779780925661.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-950 font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            }`}
                          >
                            🌊 Берег моря в Гаспре
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalImages({ ...localImages, hero: '/src/assets/images/pestovo_block_1779780908700.png' });
                              setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                            }}
                            className={`px-3 py-2 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                              localImages.hero === '/src/assets/images/pestovo_block_1779780908700.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-950 font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            }`}
                          >
                            🏥 Главный Корпус
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalImages({ ...localImages, hero: '/src/assets/images/pestovo_nature_1779777690866.png' });
                              setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                            }}
                            className={`px-3 py-2 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                              localImages.hero === '/src/assets/images/pestovo_nature_1779777690866.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-950 font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            }`}
                          >
                            🌲 Кедровый Парк
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Preview window */}
                    <div className="lg:col-span-5 flex flex-col justify-between border border-stone-200 bg-[#FAF9F6] p-4 rounded-xl">
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Живой предпросмотр:</span>
                        {localImages.hero ? (
                          <div className="relative aspect-video rounded-xl border border-stone-200 overflow-hidden bg-stone-200 shadow-inner">
                            <img 
                              src={localImages.hero} 
                              alt="Welcome slide preview" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-4">
                              <span className="text-[9px] font-mono tracking-widest text-[#c5a880] uppercase">Макет Приветственного Экрана</span>
                              <h5 className="font-serif font-bold text-white text-sm line-clamp-1">{localHero.titleFirstPart || 'САНАТОРИЙ ПЕСТОВО'}</h5>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video bg-white border border-stone-200 rounded-xl flex flex-col items-center justify-center p-4">
                            <ImageIcon className="w-8 h-8 text-stone-300 mb-1" />
                            <span className="text-xs text-stone-400">Фото не установлено</span>
                          </div>
                        )}
                        <span className="text-[11px] text-stone-400 block leading-relaxed">
                          * Предпросмотр показывает, как выбранное фото будет смотреться под основным логотипом. При сохранении, сайт автоматически перейдет в режим фото-обоев.
                        </span>
                      </div>

                      {localImages.hero && (
                        <button
                          type="button"
                          onClick={() => setLocalImages({ ...localImages, hero: '' })}
                          className="text-[10px] border border-stone-300 text-stone-600 hover:text-red-600 hover:border-red-200 bg-white py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 self-end mt-3 cursor-pointer"
                        >
                          <Trash2 className="w-3" />
                          Стереть фото
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-stone-100">
                  <button 
                    onClick={handleSaveHero}
                    className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-3.5 px-8 rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить заголовок и фон
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL & CONTACTS */}
          {activeSettingsTab === 'general' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif font-black text-xl text-[#022C22]">Реквизиты, Контакты и Описание курорта</h3>
                <p className="text-xs text-stone-400 mt-1">Официальные реквизиты санатория ФТС РФ, телефоны и справочные медицинские очерки.</p>
              </div>
              
              <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Название санатория</label>
                    <input 
                      type="text" 
                      value={localResortInfo.name} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, name: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Ведомство / Агентство</label>
                    <input 
                      type="text" 
                      value={localResortInfo.agency} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, agency: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Регион нахождения</label>
                    <input 
                      type="text" 
                      value={localResortInfo.location} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, location: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Эл. Почта (Email)</label>
                    <input 
                      type="text" 
                      value={localResortInfo.email} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, email: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Телефон (Бесплатный Горячий)</label>
                    <input 
                      type="text" 
                      value={localResortInfo.phone} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, phone: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Телефон ресепшн / бронирования</label>
                    <input 
                      type="text" 
                      value={localResortInfo.phoneDirect} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, phoneDirect: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Полный фактический адрес</label>
                  <input 
                    type="text" 
                    value={localResortInfo.address} 
                    onChange={e => setLocalResortInfo({ ...localResortInfo, address: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Режим работы</label>
                  <input 
                    type="text" 
                    value={localResortInfo.workingHours} 
                    onChange={e => setLocalResortInfo({ ...localResortInfo, workingHours: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80"
                  />
                </div>

                <div className="border-t border-stone-200 pt-6 mt-4 space-y-6">
                  <h4 className="font-serif font-black text-[#022C22] text-sm uppercase tracking-wider">Разделы Описания & Климатотерапии</h4>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Историческая справка (Дворец княгини Паниной)</label>
                    <textarea 
                      rows={5}
                      value={localResortInfo.historyText} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, historyText: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Статья про лечебный феномен «Климатотерапии»</label>
                    <textarea 
                      rows={5}
                      value={localResortInfo.climatotherapyText} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, climatotherapyText: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880]/80 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-stone-100">
                  <button 
                    onClick={handleSaveGeneral}
                    className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-3.5 px-8 rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить реквизиты и статьи
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOMS */}
          {activeSettingsTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#022C22]">Каталог Гостиничных Номеров</h3>
                  <p className="text-xs text-stone-400 mt-1">Добавление, изменение цен, параметров и мебели спальных мест на курорте.</p>
                </div>
                {!showAddRoom && !editingRoomId && (
                  <button 
                    onClick={() => setShowAddRoom(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition-all shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Добавить категорию
                  </button>
                )}
              </div>

              {/* LIST ROOMS */}
              {!showAddRoom && !editingRoomId && (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div 
                      key={room.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-5">
                        <img 
                          src={room.image} 
                          alt={room.name} 
                          className="w-24 h-16 object-cover rounded-xl border border-stone-200 shadow-sm flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-serif font-black text-stone-900 text-base md:text-lg">{room.name}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-[9px] uppercase font-mono tracking-wider text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              {room.category}
                            </span>
                            <span className="text-xs text-stone-500 font-mono">{room.area} м² • и убранство</span>
                            <span className="text-xs text-stone-800 font-bold bg-stone-100 border px-1.5 py-0.5 rounded font-mono ml-1">{room.price} ₽ / сутки</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingRoomId(room.id)}
                          className="border border-[#022C22] hover:bg-[#022C22] text-[#022C22] hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteRoom(room.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Удалить категорию"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ADD ROOM COMPONENT */}
              {showAddRoom && (
                <RoomForm 
                  initialData={{
                    name: '',
                    category: '',
                    area: 25,
                    capacity: 'до 2 человек',
                    beds: 'Две кровати',
                    view: 'Вид на парк-арборетум',
                    price: 6000,
                    description: '',
                    amenities: ['Wi-Fi', 'Телевизор', 'Кондиционер', 'Сейф', 'Фен'],
                    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
                  }}
                  onCancel={() => setShowAddRoom(false)}
                  onSave={handleAddRoom}
                />
              )}

              {/* EDIT ROOM COMPONENT */}
              {editingRoomId && (() => {
                const room = rooms.find(r => r.id === editingRoomId);
                return room ? (
                  <div className="bg-stone-50 rounded-2xl border border-[#c5a880]/40 p-6 md:p-8 space-y-4 shadow-sm">
                    <h4 className="font-serif font-black text-md text-[#022C22] flex items-center gap-1.5 uppercase tracking-wide">
                      ⚙️ Внесение изменений: <span className="text-[#b0936b]">{room.name}</span>
                    </h4>
                    <RoomForm 
                      initialData={room}
                      onCancel={() => setEditingRoomId(null)}
                      onSave={(data) => handleUpdateRoom(room.id, { ...data, id: room.id })}
                    />
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* TAB 4: MEDICAL PROGRAMS */}
          {activeSettingsTab === 'medical' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#022C22]">Программы Санаторного Лечения</h3>
                  <p className="text-xs text-stone-400 mt-1">Создание, модификация процедур, списков показаний и лечащих схем.</p>
                </div>
                {!showAddMed && !editingMedId && (
                  <button 
                    onClick={() => setShowAddMed(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition-all shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Добавить программу
                  </button>
                )}
              </div>

              {/* LIST MEDICAL PROGRAMS */}
              {!showAddMed && !editingMedId && (
                <div className="space-y-4">
                  {medPrograms.map((prog) => (
                    <div 
                      key={prog.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-serif font-black text-stone-900 text-base md:text-lg flex items-center gap-2">
                          <span className="text-emerald-700 text-lg">🩺</span> {prog.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{prog.shortDesc}</p>
                        <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#022C22] font-bold bg-[#FAF9F6] border border-[#022C22]/10 px-3 py-1 mt-2.5 rounded-lg">
                          Курс лечения: {prog.duration}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingMedId(prog.id)}
                          className="border border-[#022C22] hover:bg-[#022C22] text-[#022C22] hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteMed(prog.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Удалить программу"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ADD MEDICAL PROGRAM FORM */}
              {showAddMed && (
                <MedicalForm 
                  initialData={{
                    title: '',
                    shortDesc: '',
                    fullDesc: '',
                    indications: ['Основные заболевания'],
                    procedures: ['Грязелечение', 'Ингаляции'],
                    duration: 'от 12 до 21 дня',
                    icon: 'Lungs'
                  }}
                  onCancel={() => setShowAddMed(false)}
                  onSave={handleAddMed}
                />
              )}

              {/* EDIT MEDICAL PROGRAM FORM */}
              {editingMedId && (() => {
                const prog = medPrograms.find(m => m.id === editingMedId);
                return prog ? (
                  <div className="bg-stone-50 rounded-2xl border border-[#c5a880]/40 p-6 md:p-8 space-y-4 shadow-sm">
                    <h4 className="font-serif font-bold text-md text-[#022C22] uppercase tracking-wide">
                      ⚙️ Правка терапевтической программы: {prog.title}
                    </h4>
                    <MedicalForm 
                      initialData={prog}
                      onCancel={() => setEditingMedId(null)}
                      onSave={(data) => handleUpdateMed(prog.id, { ...data, id: prog.id })}
                    />
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeSettingsTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#022C22]">Отзывы Отдыхающих & Служащих</h3>
                  <p className="text-xs text-stone-400 mt-1">Управление гостевыми отзывами, оценками, а также ФИО гостей.</p>
                </div>
                {!showAddTest && !editingTestId && (
                  <button 
                    onClick={() => setShowAddTest(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition-all shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Добавить отзыв
                  </button>
                )}
              </div>

              {/* LIST TESTIMONIALS */}
              {!showAddTest && !editingTestId && (
                <div className="space-y-4">
                  {testimonials.map((test) => (
                    <div 
                      key={test.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-black text-[#022C22] text-sm md:text-base">{test.author}</h4>
                          <span className="bg-yellow-100 text-yellow-850 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 font-bold font-mono">
                            ★ {test.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono mt-1">{test.role} • {test.date}</p>
                        <p className="text-xs text-stone-600 mt-2.5 italic leading-relaxed">"{test.text}"</p>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingTestId(test.id)}
                          className="border border-[#022C22] hover:bg-[#022C22] text-[#022C22] hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteTest(test.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ADD TESTIMONIAL FORM */}
              {showAddTest && (
                <TestimonialForm 
                  initialData={{
                    author: '',
                    role: 'Сотрудник ФТС',
                    rating: 5,
                    text: '',
                    date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                  }}
                  onCancel={() => setShowAddTest(false)}
                  onSave={handleAddTest}
                />
              )}

              {/* EDIT TESTIMONIAL FORM */}
              {editingTestId && (() => {
                const test = testimonials.find(t => t.id === editingTestId);
                return test ? (
                  <div className="bg-stone-50 rounded-2xl border border-[#c5a880]/40 p-6 md:p-8 space-y-4 shadow-sm">
                    <h4 className="font-serif font-bold text-md text-[#022C22] uppercase tracking-wide">
                      ⚙️ Коррекция отзыва: {test.author}
                    </h4>
                    <TestimonialForm 
                      initialData={test}
                      onCancel={() => setEditingTestId(null)}
                      onSave={(data) => handleUpdateTest(test.id, { ...data, id: test.id })}
                    />
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* TAB 6: FAQ */}
          {activeSettingsTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#022C22]">Часто Задаваемые Вопросы (FAQ)</h3>
                  <p className="text-xs text-stone-400 mt-1">Официальные ответы справочной службы на самые частые вопросы посетителей.</p>
                </div>
                {!showAddFaq && !editingFaqId && (
                  <button 
                    onClick={() => setShowAddFaq(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition-all shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Добавить вопрос
                  </button>
                )}
              </div>

              {/* LIST FAQS */}
              {!showAddFaq && !editingFaqId && (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div 
                      key={faq.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-stone-900 text-sm md:text-base">❓ {faq.question}</h4>
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingFaqId(faq.id)}
                          className="border border-[#022C22] hover:bg-[#022C22] text-[#022C22] hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ADD FAQ FORM */}
              {showAddFaq && (
                <FaqForm 
                  initialData={{
                    question: '',
                    answer: ''
                  }}
                  onCancel={() => setShowAddFaq(false)}
                  onSave={handleAddFaq}
                />
              )}

              {/* EDIT FAQ FORM */}
              {editingFaqId && (() => {
                const faq = faqs.find(f => f.id === editingFaqId);
                return faq ? (
                  <div className="bg-stone-50 rounded-2xl border border-[#c5a880]/40 p-6 md:p-8 space-y-4 shadow-sm">
                    <h4 className="font-serif font-bold text-md text-[#022C22] uppercase tracking-wide">
                      ⚙️ Изменение справочного ответа:
                    </h4>
                    <FaqForm 
                      initialData={faq}
                      onCancel={() => setEditingFaqId(null)}
                      onSave={(data) => handleUpdateFaq(faq.id, { ...data, id: faq.id })}
                    />
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* TAB 7: MEDIA & LINKS */}
          {activeSettingsTab === 'media' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="font-serif font-black text-xl text-[#022C22]">Медиа ресурсы, Изображения и Видео</h3>
                <p className="text-xs text-stone-400 mt-1 font-medium">Замена фоновых видео-петель YouTube, а также панорамных фото пляжей и лобби.</p>
              </div>
              
              <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
                
                {/* Background videos */}
                <div className="space-y-4">
                  <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-2">
                    <VideoIcon className="w-4 h-4 text-[#c5a880]" />
                    Видео трансляции и фоновые петли (YouTube ID)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Дворец княгини Паниной (YouTube ID):</label>
                      <input 
                        type="text" 
                        value={localVideos.palaceDroneYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, palaceDroneYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#c5a880]/80"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Альтернативный ролик (Ялта прогулка):</label>
                      <input 
                        type="text" 
                        value={localVideos.alternativeYaltaYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, alternativeYaltaYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#c5a880]/80"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Видео Ласточкино Гнездо (YouTube ID):</label>
                      <input 
                        type="text" 
                        value={localVideos.swallowsNestYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, swallowsNestYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#c5a880]/80"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Крымское побережье дрон:</label>
                      <input 
                        type="text" 
                        value={localVideos.crimeaCoastDroneYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, crimeaCoastDroneYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#c5a880]/80"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Прямопотоковое HD-видео заставки «Природы» (Прямой URL на файл .mp4)</label>
                    <input 
                      type="text" 
                      value={localVideos.coastalNatureDirect} 
                      onChange={e => setLocalVideos({ ...localVideos, coastalNatureDirect: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-[11px] font-mono focus:outline-none focus:border-[#c5a880]/80 text-[#022C22]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block leading-relaxed">Прямой путь на любой медиа-файл MP4 для воспроизведения в беззвучном режиме на главном экране. По умолчанию используется профессиональный CDN поток.</span>
                  </div>
                </div>

                {/* Main section images */}
                <div className="space-y-4 border-t border-stone-100 pt-6">
                  <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-2">
                    <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                    Основные фотографии разделов сайта
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs font-bold text-stone-500 mb-1.5">Фон заставки Welcome (Фото-обои)</label>
                      <input 
                        type="text" 
                        value={localImages.hero} 
                        onChange={e => setLocalImages({ ...localImages, hero: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 mb-2"
                      />
                      {localImages.hero && (
                        <img src={localImages.hero} alt="hero preview" className="w-full h-24 object-cover rounded-lg border border-stone-200 shadow-inner" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs font-bold text-stone-500 mb-1.5">Изображение номера Полулюкс (Раздел спальни)</label>
                      <input 
                        type="text" 
                        value={localImages.suite} 
                        onChange={e => setLocalImages({ ...localImages, suite: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 mb-2"
                      />
                      {localImages.suite && (
                        <img src={localImages.suite} alt="suite preview" className="w-full h-24 object-cover rounded-lg border border-stone-200 shadow-inner" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs font-bold text-stone-500 mb-1.5">Кабинет физиотерапии (Медицина)</label>
                      <input 
                        type="text" 
                        value={localImages.medical} 
                        onChange={e => setLocalImages({ ...localImages, medical: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 mb-2"
                      />
                      {localImages.medical && (
                        <img src={localImages.medical} alt="medical preview" className="w-full h-24 object-cover rounded-lg border border-stone-200 shadow-inner" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
                      <label className="block text-xs font-bold text-stone-500 mb-1.5">Терренкур и природа Царской тропы</label>
                      <input 
                        type="text" 
                        value={localImages.nature} 
                        onChange={e => setLocalImages({ ...localImages, nature: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 mb-2"
                      />
                      {localImages.nature && (
                        <img src={localImages.nature} alt="nature preview" className="w-full h-24 object-cover rounded-lg border border-stone-200 shadow-inner" referrerPolicy="no-referrer" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Extra preset images */}
                <div className="space-y-4 border-t border-stone-100 pt-6">
                  <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-2">
                    <Folder className="w-4 h-4 text-[#c5a880]" />
                    Дополнительные фотографии Галереи & Инфраструктуры
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(localExtraImages).map((key) => {
                      const imageKey = key as keyof typeof localExtraImages;
                      return (
                        <div key={imageKey} className="space-y-1.5 bg-[#FAF9F6] p-3 rounded-xl border border-stone-200">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 truncate">{imageKey}</label>
                          <input 
                            type="text" 
                            value={localExtraImages[imageKey]} 
                            onChange={e => setLocalExtraImages({ ...localExtraImages, [imageKey]: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-[#c5a880]/80 mb-1 font-mono text-xs"
                          />
                          <img 
                            src={localExtraImages[imageKey]} 
                            alt={imageKey} 
                            className="w-full h-20 object-cover rounded-lg border border-stone-200 shadow-inner" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-stone-100">
                  <button 
                    onClick={handleSaveMedia}
                    className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-3.5 px-8 rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить медиа ресурсы
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* CUSTOM CONFIRMATION DIALOG MODAL (Iframe Safe & Accessible) */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FAF9F6] border border-[#c5a880]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center space-x-3 text-amber-600">
                <div className="p-2.5 bg-amber-50 rounded-full text-amber-600 shrink-0">
                  ⚠️
                </div>
                <h3 className="font-serif font-black text-base text-[#022C22] tracking-tight">{confirmModal.title}</h3>
              </div>
              <p className="text-xs text-stone-550 leading-relaxed font-sans">
                {confirmModal.message}
              </p>
              <div className="flex justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-150 text-stone-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 ${
                    confirmModal.confirmClass || 'bg-red-650 hover:bg-red-700 text-white font-bold'
                  }`}
                >
                  {confirmModal.confirmText || 'Да, удалить'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// INLINE TYPE-SAFE SUB-COMPONENTS TO PREVENT BULK CODE

// 1. ROOM ADD/EDIT FORM
interface RoomFormProps {
  initialData: Omit<Room, 'id'> & { id?: string };
  onCancel: () => void;
  onSave: (data: Omit<Room, 'id'>) => void;
}

function RoomForm({ initialData, onCancel, onSave }: RoomFormProps) {
  const [name, setName] = useState(initialData.name);
  const [category, setCategory] = useState(initialData.category);
  const [area, setArea] = useState(initialData.area);
  const [capacity, setCapacity] = useState(initialData.capacity);
  const [beds, setBeds] = useState(initialData.beds);
  const [view, setView] = useState(initialData.view);
  const [price, setPrice] = useState(initialData.price);
  const [description, setDescription] = useState(initialData.description);
  const [image, setImage] = useState(initialData.image);
  
  const [newAmenity, setNewAmenity] = useState('');
  const [amenities, setAmenities] = useState<string[]>([...initialData.amenities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      alert('Заполните название и категорию номера!');
      return;
    }
    onSave({
      name,
      category,
      area: Number(area),
      capacity,
      beds,
      view,
      price: Number(price),
      description,
      amenities,
      image
    });
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Название категории (например, «Стандарт Комфорт»)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Краткое описание вместимости (например, «1-комнатный 2-местный»)</label>
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Площадь номера (кв. м)</label>
          <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Вместимость спальных мест</label>
          <input type="text" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Формат спальных кроватей</label>
          <input type="text" value={beds} onChange={e => setBeds(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Вид из окон номера</label>
          <input type="text" value={view} onChange={e => setView(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Стоимость за сутки (руб.)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Ссылка на фото номера</label>
          <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#c5a880]" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1">Художественное описание номера</label>
        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880] leading-relaxed" />
      </div>

      {/* Amenities Section */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-stone-500">Удобства в номере</label>
        <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl min-h-[44px]">
          {amenities.map((amenity, idx) => (
            <span key={idx} className="bg-[#022C22] text-[#FAF9F6] text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 font-bold">
              {amenity}
              <button type="button" onClick={() => handleRemoveAmenity(idx)} className="text-[#c5a880] hover:text-white font-bold ml-1.5 text-xs">×</button>
            </span>
          ))}
          {amenities.length === 0 && <span className="text-xs text-stone-400 p-1">Список удобств пуст.</span>}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Добавить удобство..."
            value={newAmenity}
            onChange={e => setNewAmenity(e.target.value)}
            className="border border-stone-300 rounded-xl px-4 py-2 text-xs flex-1 focus:outline-none focus:border-[#c5a880]" 
          />
          <button 
            type="button" 
            onClick={handleAddAmenity}
            className="bg-[#022C22] text-white font-bold text-xs px-5 py-2 rounded-xl transition-all hover:bg-emerald-800"
          >
            Добавить
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all">
          Сохранить параметры
        </button>
      </div>
    </form>
  );
}

// 2. MEDICAL PROGRAM FORM
interface MedicalFormProps {
  initialData: Omit<MedicalProgram, 'id'> & { id?: string };
  onCancel: () => void;
  onSave: (data: Omit<MedicalProgram, 'id'>) => void;
}

function MedicalForm({ initialData, onCancel, onSave }: MedicalFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [shortDesc, setShortDesc] = useState(initialData.shortDesc);
  const [fullDesc, setFullDesc] = useState(initialData.fullDesc);
  const [duration, setDuration] = useState(initialData.duration);
  const [icon, setIcon] = useState(initialData.icon);

  const [newIndication, setNewIndication] = useState('');
  const [indications, setIndications] = useState<string[]>([...initialData.indications]);

  const [newProcedure, setNewProcedure] = useState('');
  const [procedures, setProcedures] = useState<string[]>([...initialData.procedures]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      alert('Заполните название и краткое описание программы!');
      return;
    }
    onSave({
      title,
      shortDesc,
      fullDesc,
      indications,
      procedures,
      duration,
      icon
    });
  };

  const handleAddIndication = () => {
    if (newIndication.trim() && !indications.includes(newIndication.trim())) {
      setIndications([...indications, newIndication.trim()]);
      setNewIndication('');
    }
  };

  const handleAddProcedure = () => {
    if (newProcedure.trim() && !procedures.includes(newProcedure.trim())) {
      setProcedures([...procedures, newProcedure.trim()]);
      setNewProcedure('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Название программы (например, «Здоровое дыхание»)</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#022C22] mb-1">Базовая длительность (например, «от 10 до 21 дня»)</label>
          <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Иконка программы</label>
          <select value={icon} onChange={e => setIcon(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880] bg-white">
            <option value="Lungs">Легкие (Дыхание)</option>
            <option value="Heart">Сердце (Кардиология)</option>
            <option value="Brain">Мозг (Антистресс/Нервная)</option>
            <option value="Activity">Волны (Опорно-двигательный/Суставы)</option>
            <option value="Sparkles">Звездочки (Оздоровление/Общее)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Краткое описание (для витрины)</label>
          <input type="text" value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1">Подробное клиническое описание программы</label>
        <textarea rows={4} value={fullDesc} onChange={e => setFullDesc(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880] leading-relaxed" />
      </div>

      {/* Indications and Procedures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-500">Показания к лечению (Indications)</label>
          <div className="space-y-1 max-h-40 overflow-y-auto border border-stone-200 p-2.5 rounded-xl bg-stone-50/50">
            {indications.map((ind, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-stone-750 bg-white border border-stone-200 p-2 rounded-lg pr-1.5 shadow-xs">
                <span className="truncate">{ind}</span>
                <button type="button" onClick={() => setIndications(indications.filter((_, i) => i !== idx))} className="text-red-500 font-bold px-1.5 hover:text-red-700">×</button>
              </div>
            ))}
            {indications.length === 0 && <span className="text-[11px] text-stone-400 p-1 block">Добавьте хотя бы одно показание.</span>}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Новое показание..." value={newIndication} onChange={e => setNewIndication(e.target.value)} className="border border-stone-300 rounded-xl px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-[#c5a880]" />
            <button type="button" onClick={handleAddIndication} className="bg-[#022C22] hover:bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-xl font-bold">Добавить</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-500">Включаемые процедуры (Procedures)</label>
          <div className="space-y-1 max-h-40 overflow-y-auto border border-stone-200 p-2.5 rounded-xl bg-stone-50/50">
            {procedures.map((proc, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-stone-750 bg-white border border-stone-200 p-2 rounded-lg pr-1.5 shadow-xs">
                <span className="truncate">{proc}</span>
                <button type="button" onClick={() => setProcedures(procedures.filter((_, i) => i !== idx))} className="text-red-500 font-bold px-1.5 hover:text-red-700">×</button>
              </div>
            ))}
            {procedures.length === 0 && <span className="text-[11px] text-stone-400 p-1 block">Добавьте хотя бы одну процедуру.</span>}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Новая процедура..." value={newProcedure} onChange={e => setNewProcedure(e.target.value)} className="border border-stone-300 rounded-xl px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-[#c5a880]" />
            <button type="button" onClick={handleAddProcedure} className="bg-[#022C22] hover:bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-xl font-bold">Добавить</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all font-mono">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all">
          Сохранить программу
        </button>
      </div>
    </form>
  );
}

// 3. TESTIMONIAL FORM
interface TestimonialFormProps {
  initialData: Omit<Testimonial, 'id'> & { id?: string };
  onCancel: () => void;
  onSave: (data: Omit<Testimonial, 'id'>) => void;
}

function TestimonialForm({ initialData, onCancel, onSave }: TestimonialFormProps) {
  const [author, setAuthor] = useState(initialData.author);
  const [role, setRole] = useState(initialData.role);
  const [rating, setRating] = useState(initialData.rating);
  const [text, setText] = useState(initialData.text);
  const [date, setDate] = useState(initialData.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      alert('Укажите автора и текст отзыва!');
      return;
    }
    onSave({ author, role, rating, text, date });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">ФИО Гостя (или имя)</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Должность / Ведомство Гостя</label>
          <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Дата визита (свободный ввод)</label>
          <input type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Выставленная оценка (Звезды от 1 до 5)</label>
          <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880] bg-white">
            <option value={5}>★★★★★ (Прекрасно)</option>
            <option value={4}>★★★★☆ (Хорошо)</option>
            <option value={3}>★★★☆☆ (Нормально)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1">Полный текст развернутого отзыва</label>
        <textarea rows={4} value={text} onChange={e => setText(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-[#c5a880]" />
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all">
          Сохранить отзыв
        </button>
      </div>
    </form>
  );
}

// 4. FAQ FORM
interface FaqFormProps {
  initialData: Omit<FAQItem, 'id'> & { id?: string };
  onCancel: () => void;
  onSave: (data: Omit<FAQItem, 'id'>) => void;
}

function FaqForm({ initialData, onCancel, onSave }: FaqFormProps) {
  const [question, setQuestion] = useState(initialData.question);
  const [answer, setAnswer] = useState(initialData.answer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      alert('Укажите вопрос и ответ на него!');
      return;
    }
    onSave({ question, answer });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-sm">
      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1">Формулировка вопроса</label>
        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" />
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1">Развернутый ответ</label>
        <textarea rows={5} value={answer} onChange={e => setAnswer(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-[#c5a880]" />
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all">
          Сохранить вопрос
        </button>
      </div>
    </form>
  );
}
