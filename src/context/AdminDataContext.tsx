import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, MedicalProgram, Testimonial, FAQItem, NewsArticle, ServiceItem, GalleryItem, GalleryCategory, AdminUser, DocumentItem } from '../types';
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
import { INITIAL_DOCUMENTS } from '../data/documentsData';

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
  gallery: GalleryItem[];
  galleryCategories: GalleryCategory[];
  users?: AdminUser[];
  documents?: DocumentItem[];
}

const DEFAULT_SITE_DATA: SiteData = {
  resortInfo: { ...RESORT_INFO },
  hero: {
    badge: 'Оздоровительный комплекс ФТС России',
    titleFirstPart: 'САНАТОРИЙ «ЯСНАЯ ПОЛЯНА»',
    titleSecondPart: 'ЮЖНЫЙ БЕРЕГ КРЫМА',
    subtitle: 'Современный центр оздоровления, эффективного лечения и комплексной реабилитации для должностных лиц таможенных органов и членов их семей.',
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
  services: [...DEFAULT_SERVICES],
  gallery: [
    { id: 'gal-1', src: IMAGES.hero, category: 'nature', title: 'Вид на главный корпус и парк-арборетум' },
    { id: 'gal-2', src: IMAGES.suite, category: 'rooms', title: 'Интерьер Полулюкс Комфорт с панорамой моря' },
    { id: 'gal-3', src: IMAGES.medical, category: 'medical', title: 'Кабинет аппаратной бальнеологии и физиотерапии' },
    { id: 'gal-4', src: IMAGES.nature, category: 'nature', title: 'Исторический терренкур к Черному морю в Гаспре' },
    { id: 'gal-5', src: EXTRA_IMAGES.standardRoom, category: 'rooms', title: 'Номер Стандарт Улучшенный' },
    { id: 'gal-6', src: EXTRA_IMAGES.deluxeRoom, category: 'rooms', title: 'Элегантный Двухкомнатный Люкс' },
    { id: 'gal-7', src: EXTRA_IMAGES.pool, category: 'infrastructure', title: 'Подогреваемый плавательный бассейн' },
    { id: 'gal-8', src: EXTRA_IMAGES.dining, category: 'infrastructure', title: 'Ресторан «Ясная Поляна» - трехразовый шведский стол' },
    { id: 'gal-9', src: EXTRA_IMAGES.fitness, category: 'infrastructure', title: 'Тренажерный зал в спортивно-оздоровительном корпусе' }
  ],
  galleryCategories: [
    { id: 'rooms', name: 'Номера' },
    { id: 'nature', name: 'Парк-Арборетум' },
    { id: 'medical', name: 'Лечебный корпус' },
    { id: 'infrastructure', name: 'Инфраструктура' }
  ],
  users: [
    { id: 'user-1', username: 'admin', password: 'admin2026', role: 'Главный Администратор' },
    { id: 'user-2', username: 'daniliv', password: 'admin', role: 'и.о. Начальника санатория' }
  ],
  documents: [...INITIAL_DOCUMENTS]
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
  currentPage: 'home' | 'documents' | 'news' | 'medical' | 'admin' | 'testimonials' | 'login';
  setCurrentPage: (page: 'home' | 'documents' | 'news' | 'medical' | 'admin' | 'testimonials' | 'login') => void;
}

const AdminDataContext = createContext<AdminDataContextProps | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'documents' | 'news' | 'medical' | 'admin' | 'testimonials' | 'login'>('home');

  // Load from static file on hosting AND local storage on mount
  useEffect(() => {
    async function initializeData() {
      let baseData = { ...DEFAULT_SITE_DATA };
      
      // 1. Try to load published data from the hosting root folder (site-data.json)
      try {
        const response = await fetch('/site-data.json', { cache: 'no-store' });
        if (response.ok) {
          const published = await response.json();
          if (published && typeof published === 'object') {
            baseData = { ...baseData, ...published };
            console.log('Successfully loaded published site-data.json from hosting root');
          }
        }
      } catch (err) {
        console.log('No published site-data.json found on hosting root, falling back to bundled defaults.', err);
      }

      // 1b. Try to load dynamic reviews from the reviews.php script
      try {
        const reviewsResponse = await fetch('/reviews.php', { cache: 'no-store' });
        if (reviewsResponse.ok) {
          const serverReviews = await reviewsResponse.json();
          if (Array.isArray(serverReviews) && serverReviews.length > 0) {
            baseData.testimonials = serverReviews;
            console.log('Successfully loaded dynamic reviews from reviews.php on server:', serverReviews.length);
          }
        }
      } catch (reviewsErr) {
        console.log('No server reviews.php found or error loading, falling back to static testimonials.', reviewsErr);
      }

      // 2. Check if this browser has an active local draft in localStorage
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
            parsed.hero = JSON.parse(JSON.stringify(baseData.hero));
            morphed = true;
          } else {
            // Guard against missing properties inside hero
            const defaultHero = baseData.hero;
            if (!parsed.hero.badge) { 
              parsed.hero.badge = defaultHero.badge; 
              morphed = true; 
            } else if (parsed.hero.badge === 'Престижный оздоровительный комплекс ФТС России') {
              parsed.hero.badge = 'Оздоровительный комплекс ФТС России';
              morphed = true;
            }
            if (!parsed.hero.titleFirstPart) { 
              parsed.hero.titleFirstPart = defaultHero.titleFirstPart; 
              morphed = true; 
            } else if (parsed.hero.titleFirstPart === 'САНАТОРИЙ «ПЕСТОВО»' || parsed.hero.titleFirstPart.includes('ПЕСТОВО')) {
              parsed.hero.titleFirstPart = 'САНАТОРИЙ «ЯСНАЯ ПОЛЯНА»';
              morphed = true;
            }
            if (!parsed.hero.titleSecondPart) { parsed.hero.titleSecondPart = defaultHero.titleSecondPart; morphed = true; }
            if (!parsed.hero.subtitle) { 
              parsed.hero.subtitle = defaultHero.subtitle; 
              morphed = true; 
            } else if (
              parsed.hero.subtitle === 'Элитное оздоровление, легендарный парк-арборетум и дворец графини Паниной в Гаспре. Микроклимат царского курорта для вашего оздоровления.' ||
              parsed.hero.subtitle === 'Предоставляет оздоровления, лечения и реабилитации должностных лиц таможенных органов и членов их семей.'
            ) {
              parsed.hero.subtitle = defaultHero.subtitle;
              morphed = true;
            }
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
            parsed.services = [...baseData.services];
            morphed = true;
          }

          // Backfill missing gallery
          if (!parsed.gallery || !Array.isArray(parsed.gallery)) {
            parsed.gallery = JSON.parse(JSON.stringify(baseData.gallery));
            morphed = true;
          }

          // Backfill missing galleryCategories
          if (!parsed.galleryCategories || !Array.isArray(parsed.galleryCategories)) {
            parsed.galleryCategories = JSON.parse(JSON.stringify(baseData.galleryCategories));
            morphed = true;
          }

          // Backfill missing users
          if (!parsed.users || !Array.isArray(parsed.users)) {
            parsed.users = JSON.parse(JSON.stringify(baseData.users || DEFAULT_SITE_DATA.users || []));
            morphed = true;
          }

          // Backfill missing documents
          if (!parsed.documents || !Array.isArray(parsed.documents)) {
            // Check if there is already a standalone local storage documents item, otherwise use INITIAL_DOCUMENTS
            const savedDocsRaw = localStorage.getItem('pestovo_custom_documents');
            if (savedDocsRaw) {
              try {
                parsed.documents = JSON.parse(savedDocsRaw);
              } catch {
                parsed.documents = JSON.parse(JSON.stringify(INITIAL_DOCUMENTS));
              }
            } else {
              parsed.documents = JSON.parse(JSON.stringify(INITIAL_DOCUMENTS));
            }
            morphed = true;
          }

          if (morphed) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
          }

          setSiteData(parsed);
        } catch (e) {
          console.error('Error parsing stored site data, falling back to hosting base data:', e);
          setSiteData(baseData);
        }
      } else {
        // No local draft, use the base loaded from hosting
        setSiteData(baseData);
      }
    }

    initializeData();

    const savedAdminMode = localStorage.getItem(ADMIN_MODE_KEY);
    if (savedAdminMode === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  const syncSettingsWithServer = async (data: SiteData) => {
    try {
      const credsRaw = localStorage.getItem('pestovo_resort_admin_credentials');
      if (!credsRaw) return;
      const creds = JSON.parse(credsRaw);
      if (!creds || !creds.username || !creds.password) return;

      const response = await fetch('/save_settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          siteData: data
        })
      });

      if (response.ok) {
        console.log('Successfully saved settings to the hosting server via save_settings.php');
      } else {
        const errData = await response.json().catch(() => ({}));
        console.warn('Server settings save returned non-OK status:', response.status, errData.error || '');
      }
    } catch (err) {
      console.log('Skipping real-time save_settings.php sync (offline/local development or network error):', err);
    }
  };

  const updateSiteData = (newData: SiteData) => {
    setSiteData(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      alert('Предупреждение: Превышена квота памяти браузера. Пожалуйста, сожмите или уменьшите размер загружаемых картинок перед загрузкой.');
    }

    // Sync testimonials with PHP server if changed
    if (newData.testimonials) {
      fetch('/reviews.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'save_all',
          reviews: newData.testimonials
        })
      }).catch(err => {
        console.log('Skipping reviews.php sync in local development', err);
      });
    }

    // Securely sync all site settings to PHP server
    syncSettingsWithServer(newData);
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
      
      // Securely sync all site settings to PHP server
      syncSettingsWithServer(updated);
      
      return updated;
    });

    // Sync with reviews.php if we are changing testimonials specifically
    if (key === 'testimonials') {
      fetch('/reviews.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'save_all',
          reviews: value
        })
      }).then(res => {
        if (res.ok) {
          console.log('Successfully synced testimonials with server storage reviews_data.json');
        }
      }).catch(err => {
        console.log('Skipping reviews.php sync in local development', err);
      });
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Вы действительно хотите сбросить все внесенные изменения и вернуть исходное оформление сайта?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('pestovo_resort_admin_credentials');
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
      localStorage.removeItem('pestovo_resort_admin_credentials');
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
