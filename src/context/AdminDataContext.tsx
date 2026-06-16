import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, MedicalProgram, Testimonial, FAQItem, NewsArticle, ServiceItem } from '../types';
import { 
  ROOMS, 
  MEDICAL_PROGRAMS, 
  TESTIMONIALS, 
  FAQS, 
  RESORT_INFO, 
  IMAGES, 
  EXTRA_IMAGES, 
  VIDEOS 
} from '../data/resortData';
import { DEFAULT_SERVICES } from '../data/servicesData';

export interface SiteData {
  resortInfo: {
    name: string;
    agency: string;
    location: string;
    address: string;
    phone: string;
    phoneDirect: string;
    email: string;
    workingHours: string;
    climatotherapyText: string;
    historyText: string;
    fullName?: string;
    shortName?: string;
    opf?: string;
    inn?: string;
    kpp?: string;
    urAddress?: string;
    factAddress?: string;
    postAddress?: string;
    fax?: string;
    directorName?: string;
    directorRole?: string;
    licence?: string;
    licenceDate?: string;
  };
  hero: {
    badge: string;
    titleFirstPart: string;
    titleSecondPart: string;
    subtitle: string;
    ctaText: string;
    defaultBackgroundMode?: 'video_palace' | 'video_nature' | 'photo' | 'video' | 'all';
    stats?: {
      value: string;
      label: string;
    }[];
    slides?: {
      id: string;
      type: 'photo' | 'video';
      url: string;
    }[];
  };
  rooms: Room[];
  medicalPrograms: MedicalProgram[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  news: NewsArticle[];
  images: {
    hero: string;
    suite: string;
    medical: string;
    nature: string;
  };
  extraImages: {
    standardRoom: string;
    deluxeRoom: string;
    lobby: string;
    pool: string;
    dining: string;
    fitness: string;
  };
  videos: {
    palaceDroneYoutube: string;
    alternativeYaltaYoutube: string;
    swallowsNestYoutube: string;
    crimeaCoastDroneYoutube: string;
    coastalNatureDirect: string;
  };
  services: ServiceItem[];
}

const DEFAULT_SITE_DATA: SiteData = {
  resortInfo: { ...RESORT_INFO },
  hero: {
    badge: 'Престижный оздоровительный комплекс ФТС России',
    titleFirstPart: 'САНАТОРИЙ «ПЕСТОВО»',
    titleSecondPart: 'ЮЖНЫЙ БЕРЕГ КРЫМА',
    subtitle: 'Элитное оздоровление, легендарный парк-арборетум и дворец графини Паниной в Гаспре. Микроклимат царского курорта для вашего оздоровления.',
    ctaText: 'Рассчитать путевку & Забронировать',
    defaultBackgroundMode: 'video_nature',
    stats: [
      { value: '8 га', label: 'Реликтовый Парк' },
      { value: '120+', label: 'Процедур' },
      { value: '50 м', label: 'До собственного пляжа' },
      { value: 'ФТС', label: 'Высший стандарт надежности' }
    ],
    slides: [
      { id: '1', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41851-large.mp4' },
      { id: '2', type: 'photo', url: '/src/assets/images/pestovo_palace_1779780890544.png' },
      { id: '3', type: 'photo', url: '/src/assets/images/pestovo_beach_1779780925661.png' }
    ]
  },
  rooms: [...ROOMS],
  medicalPrograms: [...MEDICAL_PROGRAMS],
  testimonials: [...TESTIMONIALS],
  faqs: [...FAQS],
  news: [
    {
      id: 'news-1',
      title: 'Открытие обновленного корпуса',
      date: '10.05.2026',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
      excerpt: 'После проведения капитального ремонта открыт спальный корпус...',
      content: 'После проведения капитального ремонта открыт спальный корпус. Новые номера оборудованы всем необходимым для комфортного отдыха. Ждем вас!'
    }
  ],
  images: { ...IMAGES },
  extraImages: { ...EXTRA_IMAGES },
  videos: { ...VIDEOS },
  services: [...DEFAULT_SERVICES]
};

const LOCAL_STORAGE_KEY = 'pestovo_resort_editable_data';
const ADMIN_MODE_KEY = 'pestovo_resort_admin_active';

interface AdminDataContextProps {
  siteData: SiteData;
  isAdminMode: boolean;
  setIsAdminMode: (active: boolean) => void;
  updateSiteData: (newData: SiteData) => void;
  updateSection: <K extends keyof SiteData>(key: K, value: SiteData[K]) => void;
  resetToDefault: () => void;
  activeSettingsTab: string;
  setActiveSettingsTab: (tab: string) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  currentPage: 'home' | 'documents' | 'news' | 'medical' | 'services' | 'admin' | 'testimonials';
  setCurrentPage: (page: 'home' | 'documents' | 'news' | 'medical' | 'services' | 'admin' | 'testimonials') => void;
}

const AdminDataContext = createContext<AdminDataContextProps | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'documents' | 'news' | 'medical' | 'services' | 'admin' | 'testimonials'>('home');

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Gentle migration: if the client is still pointing to old defaults, auto-update them to the uploaded images
        let morphed = false;
        if (parsed.images) {
          if (parsed.images.hero === '/src/assets/images/pestovo_hero_processed_1779778734060.png') {
            parsed.images.hero = '/src/assets/images/pestovo_palace_1779780890544.png';
            morphed = true;
          }
          if (parsed.images.nature === '/src/assets/images/pestovo_nature_1779777690866.png') {
            parsed.images.nature = '/src/assets/images/pestovo_beach_1779780925661.png';
            morphed = true;
          }
        }
        if (parsed.extraImages) {
          if (parsed.extraImages.standardRoom === 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80') {
            parsed.extraImages.standardRoom = '/src/assets/images/pestovo_block_1779780908700.png';
            morphed = true;
          }
        }

        // Force-merge fresh official organizational details
        if (parsed.resortInfo) {
          parsed.resortInfo = {
            ...parsed.resortInfo,
            ...RESORT_INFO
          };
          morphed = true;
        }

        // Force-merge fresh ROOMS if legacy room IDs or incorrect count is found
        if (parsed.rooms) {
          const hasLegacyRooms = parsed.rooms.some((r: any) => 
            r.id === 'standard-improved' || 
            r.id === 'junior-suite' || 
            r.id === 'suite-luxury' || 
            r.id === 'apartment-fts'
          );
          if (hasLegacyRooms || parsed.rooms.length !== 2) {
            parsed.rooms = [...ROOMS];
            morphed = true;
          }
        }

        // Backfill and safeguard missing hero or hero properties
        if (!parsed.hero) {
          parsed.hero = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.hero));
          morphed = true;
        } else {
          // Guard against missing properties inside hero
          const defaultHero = DEFAULT_SITE_DATA.hero;
          if (!parsed.hero.badge) { parsed.hero.badge = defaultHero.badge; morphed = true; }
          if (!parsed.hero.titleFirstPart) { parsed.hero.titleFirstPart = defaultHero.titleFirstPart; morphed = true; }
          if (!parsed.hero.titleSecondPart) { parsed.hero.titleSecondPart = defaultHero.titleSecondPart; morphed = true; }
          if (!parsed.hero.subtitle) { parsed.hero.subtitle = defaultHero.subtitle; morphed = true; }
          if (!parsed.hero.ctaText) { parsed.hero.ctaText = defaultHero.ctaText; morphed = true; }
          if (!parsed.hero.defaultBackgroundMode) { parsed.hero.defaultBackgroundMode = defaultHero.defaultBackgroundMode; morphed = true; }
          
          if (!parsed.hero.stats || !Array.isArray(parsed.hero.stats) || parsed.hero.stats.length === 0) {
            parsed.hero.stats = JSON.parse(JSON.stringify(defaultHero.stats));
            morphed = true;
          }
          if (!parsed.hero.slides || !Array.isArray(parsed.hero.slides) || parsed.hero.slides.length === 0) {
            parsed.hero.slides = JSON.parse(JSON.stringify(defaultHero.slides));
            morphed = true;
          } else {
            // Migrating old Vimeo URLs to ultra-stable Mixkit URLs in loaded state
            parsed.hero.slides = parsed.hero.slides.map((slide: any) => {
              if (slide.url && slide.url.includes('vimeo.com')) {
                morphed = true;
                return {
                  ...slide,
                  url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41851-large.mp4'
                };
              }
              return slide;
            });
          }
        }

        // Backfill missing news
        if (!parsed.news || !Array.isArray(parsed.news)) {
          parsed.news = [
            {
              id: 'news-1',
              title: 'Открытие обновленного корпуса',
              date: '10.05.2026',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
              excerpt: 'После проведения капитального ремонта открыт спальный корпус...',
              content: 'После проведения капитального ремонта открыт спальный корпус. Новые номера оборудованы всем необходимым для комфортного отдыха. Ждем вас!'
            }
          ];
          morphed = true;
        }

        // Backfill missing services
        if (!parsed.services || !Array.isArray(parsed.services)) {
          parsed.services = [...DEFAULT_SERVICES];
          morphed = true;
        }

        if (morphed) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }

        setSiteData(parsed);
      } catch (e) {
        console.error('Error parsing stored site data:', e);
        setSiteData(DEFAULT_SITE_DATA);
      }
    }

    const savedAdminMode = localStorage.getItem(ADMIN_MODE_KEY);
    if (savedAdminMode === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  const updateSiteData = (newData: SiteData) => {
    setSiteData(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      alert('Предупреждение: Превышена квота памяти браузера. Пожалуйста, сожмите или уменьшите размер загружаемых картинок перед загрузкой.');
    }
  };

  const updateSection = <K extends keyof SiteData>(key: K, value: SiteData[K]) => {
    setSiteData(prev => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
        alert('Предупреждение: Превышена квота памяти браузера (localStorage). Не удалось сохранить некоторые файлы. Пожалуйста, используйте изображения меньшего разрешения.');
      }
      return updated;
    });
  };

  const resetToDefault = () => {
    if (window.confirm('Вы действительно хотите сбросить все внесенные изменения и вернуть исходное оформление сайта?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSiteData({ ...DEFAULT_SITE_DATA });
      window.location.reload();
    }
  };

  const handleSetAdminMode = (active: boolean) => {
    setIsAdminMode(active);
    if (active) {
      localStorage.setItem(ADMIN_MODE_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_MODE_KEY);
      setShowAdminPanel(false);
    }
  };

  return (
    <AdminDataContext.Provider value={{
      siteData,
      isAdminMode,
      setIsAdminMode: handleSetAdminMode,
      updateSiteData,
      updateSection,
      resetToDefault,
      activeSettingsTab,
      setActiveSettingsTab,
      showAdminPanel,
      setShowAdminPanel,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
