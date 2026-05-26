import React, { useState } from 'react';
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
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, MedicalProgram, Testimonial, FAQItem } from '../types';

export default function AdminPanel() {
  const {
    siteData,
    updateSiteData,
    updateSection,
    resetToDefault,
    isAdminMode,
    setIsAdminMode,
    activeSettingsTab,
    setActiveSettingsTab,
    showAdminPanel,
    setShowAdminPanel
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

  if (!isAdminMode || !showAdminPanel) return null;

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
    if (window.confirm('Удалить категорию номера?')) {
      const nextRooms = rooms.filter(r => r.id !== roomId);
      setRooms(nextRooms);
      updateSection('rooms', nextRooms);
      triggerSuccess();
    }
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
    if (window.confirm('Удалить программу лечения?')) {
      const nextMeds = medPrograms.filter(m => m.id !== medId);
      setMedPrograms(nextMeds);
      updateSection('medicalPrograms', nextMeds);
      triggerSuccess();
    }
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
    if (window.confirm('Удалить этот отзыв?')) {
      const nextTests = testimonials.filter(t => t.id !== testId);
      setTestimonials(nextTests);
      updateSection('testimonials', nextTests);
      triggerSuccess();
    }
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
    if (window.confirm('Удалить этот вопрос?')) {
      const nextFaqs = faqs.filter(f => f.id !== faqId);
      setFaqs(nextFaqs);
      updateSection('faqs', nextFaqs);
      triggerSuccess();
    }
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
    { id: 'rooms', name: 'Номера', icon: Building },
    { id: 'medical', name: 'Лечение', icon: HeartHandshake },
    { id: 'testimonials', name: 'Отзывы', icon: MessageSquare },
    { id: 'faq', name: 'Вопросы & Ответы', icon: HelpCircle },
    { id: 'media', name: 'Медиа & Ссылки', icon: Folder },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end font-sans">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-4xl h-full bg-[#FAF9F6] text-slate-800 flex flex-col shadow-2xl overflow-hidden border-l border-[#c5a880]/40"
      >
        {/* Header toolbar */}
        <div className="bg-[#022C22] text-white p-5 border-b border-[#c5a880]/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#c5a880]/15 border border-[#c5a880]/60 rounded-lg text-[#c5a880]">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg md:text-xl text-[#FAF9F6] tracking-wide uppercase">Редактор контента</h2>
              <p className="text-[10px] font-mono tracking-widest text-[#c5a880] uppercase">Ясная Поляна • Гаспра • Панель администрирования</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={resetToDefault}
              className="flex items-center space-x-1 border border-red-500/40 text-red-300 hover:text-white hover:bg-red-950/40 text-xs px-2.5 py-1.5 rounded-sm transition-all uppercase tracking-wider font-semibold"
              title="Сбросить все Ваши правки и вернуть стандартный сайт"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Сбросить дизайн</span>
            </button>
            <button 
              onClick={() => setShowAdminPanel(false)}
              className="p-2 text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#022C22]/95 border-b border-[#c5a880]/15 py-1 px-4 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center space-x-2">
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
                className={`py-2 px-3.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 uppercase tracking-wider ${
                  active 
                    ? 'border-[#c5a880] text-[#c5a880] bg-white/5' 
                    : 'border-transparent text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Admin Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* TOASTER ALERT SUCCESS */}
          {saveSuccess && (
            <div className="bg-emerald-800 text-emerald-50 border border-emerald-600 p-3 rounded-lg flex items-center gap-2 text-sm shadow-md animate-bounce mb-4">
              <Sparkles className="w-4 h-4 text-[#c5a880]" />
              <span>Изменения сохранены и зафиксированы в браузере! Страница обновится для применения.</span>
            </div>
          )}

          {/* TAB 1: HERO */}
          {activeSettingsTab === 'hero' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-emerald-900 border-b border-emerald-900/15 pb-2">Раздел Welcome Atrium (Главный экран)</h3>
              
              <div className="space-y-4 bg-white p-5 rounded-lg border border-[#c5a880]/20 shadow-sm">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Золотой бейдж сверху</label>
                  <input 
                    type="text" 
                    value={localHero.badge} 
                    onChange={e => setLocalHero({ ...localHero, badge: e.target.value })}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Заголовок 1 (первая строка)</label>
                    <input 
                      type="text" 
                      value={localHero.titleFirstPart} 
                      onChange={e => setLocalHero({ ...localHero, titleFirstPart: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] font-serif font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Заголовок 2 (золотая строка)</label>
                    <input 
                      type="text" 
                      value={localHero.titleSecondPart} 
                      onChange={e => setLocalHero({ ...localHero, titleSecondPart: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] font-serif font-bold text-[#b0936b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Описательный подзаголовок</label>
                  <textarea 
                    rows={4}
                    value={localHero.subtitle} 
                    onChange={e => setLocalHero({ ...localHero, subtitle: e.target.value })}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Текст главной кнопки действия</label>
                  <input 
                    type="text" 
                    value={localHero.ctaText} 
                    onChange={e => setLocalHero({ ...localHero, ctaText: e.target.value })}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                {/* BACKGROUND IMAGE CONFIGURATION SECTION */}
                <div className="border-t border-stone-200 pt-6 mt-6 space-y-4">
                  <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#c5a880]" />
                    Фоновое оформление главного экрана
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Настройте стиль приветственной заставки. Вы можете выбрать живое видео или установить <strong>собственное фоновое изображение (фото)</strong>.
                  </p>

                  {/* 1. Default Background Mode */}
                  <div className="space-y-2 bg-[#FAF9F6] p-4 rounded-lg border border-stone-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#022C22]">Режим заставки по умолчанию</label>
                    <p className="text-[11px] text-stone-500">Определяет, что увидят посетители при первом входе на сайт.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setLocalHero({ ...localHero, defaultBackgroundMode: 'video_nature' })}
                        className={`p-2.5 text-xs rounded border transition-all flex flex-col items-center gap-1 ${
                          localHero.defaultBackgroundMode === 'video_nature'
                            ? 'bg-[#022C22] text-[#FAF9F6] border-amber-500/30 font-bold'
                            : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        <VideoIcon className="w-4 h-4 text-[#c5a880]" />
                        <span>Видео природы (MP4)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocalHero({ ...localHero, defaultBackgroundMode: 'video_palace' })}
                        className={`p-2.5 text-xs rounded border transition-all flex flex-col items-center gap-1 ${
                          localHero.defaultBackgroundMode === 'video_palace'
                            ? 'bg-[#022C22] text-[#FAF9F6] border-amber-500/30 font-bold'
                            : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        <VideoIcon className="w-4 h-4 animate-pulse text-[#c5a880]" />
                        <span>Видео Дворца (YouTube)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' })}
                        className={`p-2.5 text-xs rounded border transition-all flex flex-col items-center gap-1 ${
                          localHero.defaultBackgroundMode === 'photo'
                            ? 'bg-[#022C22] text-[#FAF9F6] border-amber-500/30 font-bold'
                            : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                        <span>Своё изображение (Фото)</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Custom background image settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    
                    {/* Left: Input + Preset Selectors */}
                    <div className="space-y-4">
                      
                      {/* URL input */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center justify-between">
                          <span>Вставьте URL-ссылку на фоновую картинку:</span>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 rounded font-bold">Активный URL</span>
                        </label>
                        <input 
                          type="text" 
                          value={localImages.hero} 
                          onChange={e => {
                            setLocalImages({ ...localImages, hero: e.target.value });
                            setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                          }}
                          placeholder="https://images.unsplash.com/... или base64 код"
                          className="w-full border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>

                      {/* File Upload drag-drop zone */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Или перетащите файл / выберите с компьютера:
                        </label>
                        <div 
                          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
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
                            document.getElementById('welcome-bg-file-upload')?.click();
                          }}
                        >
                          <input 
                            type="file" 
                            id="welcome-bg-file-upload" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleFile(e.target.files[0]);
                              }
                            }}
                          />
                          <ImageIcon className="w-6 h-6 mx-auto text-stone-400 mb-1" />
                          <span className="text-[11px] block text-stone-500 font-medium">Перетащите сюда фото или кликните для выбора</span>
                          <span className="text-[9px] text-stone-400 block mt-0.5">Форматы: JPG, PNG, WEBP (до 2.5 МБ)</span>
                        </div>
                        {uploadError && (
                          <p className="text-[10px] text-red-500 mt-1 font-medium">{uploadError}</p>
                        )}
                      </div>

                      {/* High-quality presets */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Популярные заготовки курорта (Кликните для выбора):
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setLocalImages({ ...localImages, hero: '/src/assets/images/pestovo_palace_1779780890544.png' });
                              setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                            }}
                            className={`px-2 py-1.5 text-[10px] rounded text-left truncate transition-all capitalize border ${
                              localImages.hero === '/src/assets/images/pestovo_palace_1779780890544.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-900 font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            }`}
                          >
                            🏰 Дворец Паниной (Gothic)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalImages({ ...localImages, hero: '/src/assets/images/pestovo_beach_1779780925661.png' });
                              setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                            }}
                            className={`px-2 py-1.5 text-[10px] rounded text-left truncate transition-all capitalize border ${
                              localImages.hero === '/src/assets/images/pestovo_beach_1779780925661.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-900 font-bold'
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
                            className={`px-2 py-1.5 text-[10px] rounded text-left truncate transition-all capitalize border ${
                              localImages.hero === '/src/assets/images/pestovo_block_1779780908700.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-900 font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            }`}
                          >
                            🏥 Солнечный Корпус
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalImages({ ...localImages, hero: '/src/assets/images/pestovo_nature_1779777690866.png' });
                              setLocalHero({ ...localHero, defaultBackgroundMode: 'photo' });
                            }}
                            className={`px-2 py-1.5 text-[10px] rounded text-left truncate transition-all capitalize border ${
                              localImages.hero === '/src/assets/images/pestovo_nature_1779777690866.png'
                                ? 'bg-amber-100/60 border-amber-500/40 text-amber-900 font-bold'
                                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            }`}
                          >
                            🌲 Царский Кедровый Парк
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Preview framed neat */}
                    <div className="flex flex-col justify-between border border-stone-200 bg-stone-50/50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Живой предпросмотр фона:</span>
                        {localImages.hero ? (
                          <div className="relative aspect-video rounded border border-stone-200 overflow-hidden bg-stone-200 group shadow-inner">
                            <img 
                              src={localImages.hero} 
                              alt="Welcome slide preview" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                              <span className="text-[10px] font-mono tracking-widest text-[#c5a880] uppercase">Микро превью главного экрана</span>
                              <h5 className="font-serif font-bold text-white text-xs">{localHero.titleFirstPart || 'САНАТОРИЙ ПЕСТОВО'}</h5>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video bg-stone-100 border-2 border-dashed border-stone-200 rounded flex flex-col items-center justify-center p-4">
                            <ImageIcon className="w-8 h-8 text-stone-300 mb-1" />
                            <span className="text-xs text-stone-400">Фоновое изображение не задано</span>
                          </div>
                        )}
                        <span className="text-[10px] text-stone-400 leading-relaxed block">
                          * Предпросмотр показывает, как изображение будет смотреться в качестве подложки под главным заголовком. При сохранении, сайт автоматически переключится в режим фото-заставки.
                        </span>
                      </div>

                      {/* Helper function to clear back to empty */}
                      {localImages.hero && (
                        <button
                          type="button"
                          onClick={() => setLocalImages({ ...localImages, hero: '' })}
                          className="text-[10px] border border-stone-300 text-stone-600 hover:text-red-500 hover:border-red-200 bg-white py-1 px-2.5 rounded transition-all flex items-center justify-center gap-1 self-end mt-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          Сбросить / Очистить
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSaveHero}
                    className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow hover:scale-[1.02]"
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
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-emerald-900 border-b border-emerald-900/15 pb-2">Реквизиты, Контакты и Описание курорта</h3>
              
              <div className="space-y-4 bg-white p-5 rounded-lg border border-[#c5a880]/20 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Название санатория</label>
                    <input 
                      type="text" 
                      value={localResortInfo.name} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, name: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Ведомство / Агентство</label>
                    <input 
                      type="text" 
                      value={localResortInfo.agency} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, agency: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Регион нахождения</label>
                    <input 
                      type="text" 
                      value={localResortInfo.location} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, location: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Эл. Почта (Email)</label>
                    <input 
                      type="text" 
                      value={localResortInfo.email} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, email: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Телефон (Бесплатный Горячий)</label>
                    <input 
                      type="text" 
                      value={localResortInfo.phone} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, phone: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Телефон прямого бронирования (Ресепшн)</label>
                    <input 
                      type="text" 
                      value={localResortInfo.phoneDirect} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, phoneDirect: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Полный фактический адрес</label>
                  <input 
                    type="text" 
                    value={localResortInfo.address} 
                    onChange={e => setLocalResortInfo({ ...localResortInfo, address: e.target.value })}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Режим работы</label>
                  <input 
                    type="text" 
                    value={localResortInfo.workingHours} 
                    onChange={e => setLocalResortInfo({ ...localResortInfo, workingHours: e.target.value })}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="border-t border-stone-200 pt-4 mt-2 space-y-4">
                  <h4 className="font-serif font-bold text-[#022C22] text-sm">Текстовые блоки о санатории</h4>
                  
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Историческая справка (дворец графини Паниной)</label>
                    <textarea 
                      rows={4}
                      value={localResortInfo.historyText} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, historyText: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Текст про «Климатотерапию»</label>
                    <textarea 
                      rows={4}
                      value={localResortInfo.climatotherapyText} 
                      onChange={e => setLocalResortInfo({ ...localResortInfo, climatotherapyText: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSaveGeneral}
                    className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить контакты
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROOMS */}
          {activeSettingsTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/15 pb-2">
                <h3 className="font-serif font-bold text-lg text-emerald-900">Управление категориями номеров</h3>
                {!showAddRoom && !editingRoomId && (
                  <button 
                    onClick={() => setShowAddRoom(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded flex items-center gap-1 uppercase tracking-wider transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Добавить номер
                  </button>
                )}
              </div>

              {/* LIST ROOMS */}
              {!showAddRoom && !editingRoomId && (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div 
                      key={room.id}
                      className="bg-white rounded-lg border border-stone-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <img 
                          src={room.image} 
                          alt={room.name} 
                          className="w-16 h-12 object-cover rounded border border-stone-200 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm md:text-base">{room.name}</h4>
                          <span className="text-[10px] uppercase font-mono tracking-wide text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            {room.category}
                          </span>
                          <span className="text-xs text-stone-500 ml-2 font-mono">{room.area} м² • {room.price} ₽/сутки</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingRoomId(room.id)}
                          className="border border-emerald-800 hover:bg-emerald-50 text-emerald-950 font-semibold text-xs px-3 py-1.5 rounded transition-all"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteRoom(room.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded transition-all"
                          title="Удалить номер"
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
                    view: 'Вид на море',
                    price: 5000,
                    description: '',
                    amenities: ['Wi-Fi', 'Телевизор', 'Кондиционер', 'Мини-холодильник'],
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
                  <div className="bg-white rounded-lg border border-[#c5a880]/30 p-6 space-y-4 shadow-md">
                    <h4 className="font-serif font-bold text-sm text-amber-900 flex items-center gap-1 uppercase tracking-wide">
                      Редактирование: {room.name}
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
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/15 pb-2">
                <h3 className="font-serif font-bold text-lg text-emerald-900">Программы курортного лечения</h3>
                {!showAddMed && !editingMedId && (
                  <button 
                    onClick={() => setShowAddMed(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded flex items-center gap-1 uppercase tracking-wider transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Добавить программу
                  </button>
                )}
              </div>

              {/* LIST MEDICAL PROGRAMS */}
              {!showAddMed && !editingMedId && (
                <div className="space-y-3">
                  {medPrograms.map((prog) => (
                    <div 
                      key={prog.id}
                      className="bg-white rounded-lg border border-stone-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div>
                        <h4 className="font-serif font-bold text-slate-900 text-sm md:text-base flex items-center gap-1.5">
                          <span>⚕️</span> {prog.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prog.shortDesc}</p>
                        <span className="inline-block text-[10px] uppercase font-mono tracking-widest text-[#022C22] font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 mt-2 rounded">
                          Длительность: {prog.duration}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingMedId(prog.id)}
                          className="border border-emerald-800 hover:bg-emerald-50 text-emerald-950 font-semibold text-xs px-3 py-1.5 rounded transition-all"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteMed(prog.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded transition-all"
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
                    indications: ['Индикация 1'],
                    procedures: ['Процедура 1'],
                    duration: 'от 10 до 14 дней',
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
                  <div className="bg-white rounded-lg border border-[#c5a880]/30 p-6 space-y-4 shadow-md">
                    <h4 className="font-serif font-bold text-sm text-emerald-900 uppercase tracking-wide">
                      Редактирование: {prog.title}
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
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/15 pb-2">
                <h3 className="font-serif font-bold text-lg text-emerald-900">Управление отзывами отдыхающих</h3>
                {!showAddTest && !editingTestId && (
                  <button 
                    onClick={() => setShowAddTest(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded flex items-center gap-1 uppercase tracking-wider transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Написать отзыв
                  </button>
                )}
              </div>

              {/* LIST TESTIMONIALS */}
              {!showAddTest && !editingTestId && (
                <div className="space-y-3">
                  {testimonials.map((test) => (
                    <div 
                      key={test.id}
                      className="bg-white rounded-lg border border-stone-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{test.author}</h4>
                          <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-mono">
                            ★ {test.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-mono mt-0.5">{test.role} • {test.date}</p>
                        <p className="text-xs text-stone-600 mt-2 italic line-clamp-2">"{test.text}"</p>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingTestId(test.id)}
                          className="border border-emerald-800 hover:bg-emerald-50 text-emerald-950 font-semibold text-xs px-2.5 py-1.5 rounded transition-all"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteTest(test.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded transition-all"
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
                    role: 'Отдыхающий',
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
                  <div className="bg-white rounded-lg border border-[#c5a880]/30 p-6 space-y-4 shadow-md">
                    <h4 className="font-serif font-bold text-sm text-emerald-900 uppercase tracking-wide">
                      Редактировать отзыв: {test.author}
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
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/15 pb-2">
                <h3 className="font-serif font-bold text-lg text-emerald-900">Часто задаваемые вопросы (FAQ)</h3>
                {!showAddFaq && !editingFaqId && (
                  <button 
                    onClick={() => setShowAddFaq(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded flex items-center gap-1 uppercase tracking-wider transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Добавить вопрос
                  </button>
                )}
              </div>

              {/* LIST FAQS */}
              {!showAddFaq && !editingFaqId && (
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div 
                      key={faq.id}
                      className="bg-white rounded-lg border border-stone-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">❓ {faq.question}</h4>
                        <p className="text-xs text-stone-600 mt-2 line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        <button 
                          onClick={() => setEditingFaqId(faq.id)}
                          className="border border-emerald-800 hover:bg-emerald-50 text-emerald-950 font-semibold text-xs px-2.5 py-1.5 rounded transition-all"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded transition-all"
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
                  <div className="bg-white rounded-lg border border-[#c5a880]/30 p-6 space-y-4 shadow-md">
                    <h4 className="font-serif font-bold text-sm text-emerald-900 uppercase tracking-wide">
                      Редактировать вопрос
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
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-emerald-900 border-b border-emerald-900/15 pb-2">Фоны блоков, изображения и видеозаставки</h3>
              
              <div className="space-y-6 bg-white p-5 rounded-lg border border-[#c5a880]/20 shadow-sm">
                
                {/* Background videos */}
                <div className="space-y-4">
                  <h4 className="font-bold font-serif text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-1">
                    <VideoIcon className="w-4 h-4 text-[#c5a880]" />
                    Ссылки на видео-петли (YouTube ID)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Главный ролик (Дворец графини Паниной): ID-ролика</label>
                      <input 
                        type="text" 
                        value={localVideos.palaceDroneYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, palaceDroneYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Альтернативный ролик (Прогулка): ID-ролика</label>
                      <input 
                        type="text" 
                        value={localVideos.alternativeYaltaYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, alternativeYaltaYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Дрон Ласточкино гнездо: ID-ролика</label>
                      <input 
                        type="text" 
                        value={localVideos.swallowsNestYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, swallowsNestYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Крымское побережье дрон: ID-ролика</label>
                      <input 
                        type="text" 
                        value={localVideos.crimeaCoastDroneYoutube} 
                        onChange={e => setLocalVideos({ ...localVideos, crimeaCoastDroneYoutube: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Фоновое HD-видео заставки «Природы» (Прямая ссылка на MP4 файл)</label>
                    <input 
                      type="text" 
                      value={localVideos.coastalNatureDirect} 
                      onChange={e => setLocalVideos({ ...localVideos, coastalNatureDirect: e.target.value })}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block leading-relaxed">Введите URL на любой прямой .mp4 файл или оставьте текущий высококачественный стрим Vimeo.</span>
                  </div>
                </div>

                {/* Main section images */}
                <div className="space-y-4 border-t border-stone-200 pt-4">
                  <h4 className="font-bold font-serif text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-1">
                    <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                    Основные изображения разделов
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Фон заставки Welcome (Фото-режим)</label>
                      <input 
                        type="text" 
                        value={localImages.hero} 
                        onChange={e => setLocalImages({ ...localImages, hero: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880] mb-2"
                      />
                      {localImages.hero && (
                        <img src={localImages.hero} alt="hero preview" className="w-full h-24 object-cover rounded border border-stone-200" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Изображение номера Полулюкс (Раздел Номера)</label>
                      <input 
                        type="text" 
                        value={localImages.suite} 
                        onChange={e => setLocalImages({ ...localImages, suite: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880] mb-2"
                      />
                      {localImages.suite && (
                        <img src={localImages.suite} alt="suite preview" className="w-full h-24 object-cover rounded border border-stone-200" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Медицинский кабинет (Кабинет физиотерапии)</label>
                      <input 
                        type="text" 
                        value={localImages.medical} 
                        onChange={e => setLocalImages({ ...localImages, medical: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880] mb-2"
                      />
                      {localImages.medical && (
                        <img src={localImages.medical} alt="medical preview" className="w-full h-24 object-cover rounded border border-stone-200" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Природа и Тропа терренкура</label>
                      <input 
                        type="text" 
                        value={localImages.nature} 
                        onChange={e => setLocalImages({ ...localImages, nature: e.target.value })}
                        className="w-full border border-stone-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880] mb-2"
                      />
                      {localImages.nature && (
                        <img src={localImages.nature} alt="nature preview" className="w-full h-24 object-cover rounded border border-stone-200" referrerPolicy="no-referrer" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Extra preset images */}
                <div className="space-y-4 border-t border-stone-200 pt-4">
                  <h4 className="font-bold font-serif text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-1">
                    <Folder className="w-4 h-4 text-[#c5a880]" />
                    Дополнительные фотографии Галереи & Инфраструктуры
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.keys(localExtraImages).map((key) => {
                      const imageKey = key as keyof typeof localExtraImages;
                      return (
                        <div key={imageKey} className="space-y-1">
                          <label className="block text-[10px] truncate font-semibold uppercase text-stone-500">{imageKey}</label>
                          <input 
                            type="text" 
                            value={localExtraImages[imageKey]} 
                            onChange={e => setLocalExtraImages({ ...localExtraImages, [imageKey]: e.target.value })}
                            className="w-full border border-stone-300 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-[#c5a880]"
                          />
                          <img 
                            src={localExtraImages[imageKey]} 
                            alt={imageKey} 
                            className="w-full h-16 object-cover rounded border border-stone-200" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-stone-200">
                  <button 
                    onClick={handleSaveMedia}
                    className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить медиа ресурсы
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
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
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-emerald-900/15 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Название категории (например, «Стандарт Комфорт»)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Краткое описание вместимости (например, «1-комнатный 2-местный»)</label>
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Площадь номера (кв. м)</label>
          <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Вместимость спальных мест</label>
          <input type="text" value={capacity} onChange={e => setCapacity(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Формат спальных кроватей</label>
          <input type="text" value={beds} onChange={e => setBeds(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Вид из окон номера</label>
          <input type="text" value={view} onChange={e => setView(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Стоимость за сутки (руб.)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Ссылка на фото номера</label>
          <input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm font-mono text-xs" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Художественное описание номера</label>
        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-2 text-sm" />
      </div>

      {/* Amenities Section */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-stone-500">Удобства в номере</label>
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-stone-200 rounded min-h-[44px]">
          {amenities.map((amenity, idx) => (
            <span key={idx} className="bg-emerald-950 text-white text-[11px] px-2 py-1 rounded-sm flex items-center gap-1 font-medium">
              {amenity}
              <button type="button" onClick={() => handleRemoveAmenity(idx)} className="text-[#c5a880] hover:text-white font-bold ml-1 text-xs">×</button>
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
            className="border border-stone-300 rounded px-3 py-1.5 text-xs flex-1 focus:outline-none" 
          />
          <button 
            type="button" 
            onClick={handleAddAmenity}
            className="bg-emerald-800 text-white font-semibold text-xs px-4 py-1.5 rounded transition-all hover:bg-emerald-700"
          >
            Добавить
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-2 px-4 rounded">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2 px-5 rounded">
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
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-emerald-900/15 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Название программы (например, «Здоровое дыхание»)</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Базовая длительность (например, «от 10 до 21 дня»)</label>
          <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Иконка программы</label>
          <select value={icon} onChange={e => setIcon(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm">
            <option value="Lungs">Легкие (Дыхание)</option>
            <option value="Heart">Сердце (Кардиология)</option>
            <option value="Brain">Мозг (Антистресс/Нервная)</option>
            <option value="Activity">Волны (Опорно-двигательный/Суставы)</option>
            <option value="Sparkles">Звездочки (Оздоровление/Общее)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Краткое описание (для витрины)</label>
          <input type="text" value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Подробное клиническое описание программы</label>
        <textarea rows={3} value={fullDesc} onChange={e => setFullDesc(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-2 text-sm" />
      </div>

      {/* Indications and Procedures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-500">Показания к лечению (Indications)</label>
          <div className="space-y-1 max-h-36 overflow-y-auto border border-stone-200 p-2 rounded bg-slate-50">
            {indications.map((ind, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-slate-700 bg-white border border-stone-100 p-1.5 rounded pr-1">
                <span className="truncate">{ind}</span>
                <button type="button" onClick={() => setIndications(indications.filter((_, i) => i !== idx))} className="text-red-500 font-bold px-1.5">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input type="text" placeholder="Новое показание..." value={newIndication} onChange={e => setNewIndication(e.target.value)} className="border border-stone-300 rounded px-2 py-1 text-xs flex-1" />
            <button type="button" onClick={handleAddIndication} className="bg-emerald-800 text-white text-xs px-2.5 py-1 rounded">Добавить</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-500">Включаемые процедуры (Procedures)</label>
          <div className="space-y-1 max-h-36 overflow-y-auto border border-stone-200 p-2 rounded bg-slate-50">
            {procedures.map((proc, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-slate-700 bg-white border border-stone-100 p-1.5 rounded pr-1">
                <span className="truncate">{proc}</span>
                <button type="button" onClick={() => setProcedures(procedures.filter((_, i) => i !== idx))} className="text-red-500 font-bold px-1.5">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input type="text" placeholder="Новая процедура..." value={newProcedure} onChange={e => setNewProcedure(e.target.value)} className="border border-stone-300 rounded px-2 py-1 text-xs flex-1" />
            <button type="button" onClick={handleAddProcedure} className="bg-emerald-800 text-white text-xs px-2.5 py-1 rounded">Добавить</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-2 px-4 rounded">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2 px-5 rounded">
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
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-emerald-900/15 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">ФИО Гостя (или имя)</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Должность / Ведомство Гостя</label>
          <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Дата визита (свободный ввод)</label>
          <input type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Выставленная оценка (Звезды от 1 до 5)</label>
          <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm">
            <option value={5}>★★★★★ (Прекрасно)</option>
            <option value={4}>★★★★☆ (Хорошо)</option>
            <option value={3}>★★★☆☆ (Нормально)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Полный текст развернутого отзыва</label>
        <textarea rows={4} value={text} onChange={e => setText(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-2 text-sm leading-relaxed" />
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-2 px-4 rounded">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2 px-5 rounded">
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
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-emerald-900/15 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Формулировка вопроса</label>
        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Развернутый ответ</label>
        <textarea rows={4} value={answer} onChange={e => setAnswer(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-2 text-sm leading-relaxed" />
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-2 px-4 rounded">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2 px-5 rounded">
          Сохранить вопрос
        </button>
      </div>
    </form>
  );
}
