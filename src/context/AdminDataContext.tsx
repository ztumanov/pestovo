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
import { 
  getStorageData, 
  setStorageData, 
  clearStorageData, 
  getFastStorageData, 
  getFastMediaOverrides, 
  saveFastStorageData,
  LEGACY_STORAGE_KEY,
  FAST_CACHE_KEY
} from '../lib/storage';

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
    showStats?: boolean;
    stats?: {
      value: string;
      label: string;
      description?: string;
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

// Deep cleaner for asset paths ensuring all legacy /src/assets/images are converted to /images/
export function deepCleanAssetPaths<T>(obj: T): T {
  if (typeof obj === 'string') {
    return (obj as string).replace(/\/src\/assets\/images\//g, '/images/') as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepCleanAssetPaths(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = deepCleanAssetPaths((obj as any)[key]);
    }
    return res;
  }
  return obj;
}

const DEFAULT_SITE_DATA: SiteData = {
  resortInfo: { ...RESORT_INFO },
  hero: {
    badge: 'Оздоровительный комплекс ФТС России',
    titleFirstPart: 'САНАТОРИЙ «ЯСНАЯ ПОЛЯНА»',
    titleSecondPart: 'ЮЖНЫЙ БЕРЕГ КРЫМА',
    subtitle: 'Современный центр оздоровления, эффективного лечения и комплексной реабилитации для должностных лиц таможенных органов и членов их семей.',
    ctaText: 'Рассчитать путевку & Забронировать',
    defaultBackgroundMode: 'all',
    stats: [
      { value: 'ФТС России', label: 'Ведомственный статус', description: 'Федеральное государственное казенное учреждение' },
      { value: '№ Л041-00110-91', label: 'Лицензия Минздрава РФ', description: 'Официальный медицинский реестр' },
      { value: 'Гаспра • ЮБК', label: 'Южный берег Крыма', description: 'Севастопольское шоссе, 52' },
      { value: 'Климатотерапия', label: 'Профиль оздоровления', description: 'Терапия, реабилитация и ЛФК' }
    ],
    showStats: true,
    slides: [
      { id: '1', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41851-large.mp4' },
      { id: '2', type: 'photo', url: '/images/pestovo_palace_1779780890544.png' },
      { id: '3', type: 'photo', url: '/images/pestovo_beach_1779780925661.png' }
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

/**
 * Synchronously retrieves fast-cached site data or media overrides before initial render
 * to guarantee 0ms latency and prevent any flicker of default images.
 */
function getInitialSynchronousSiteData(): SiteData {
  try {
    const fastData = getFastStorageData<SiteData>();
    if (fastData && typeof fastData === 'object' && fastData.rooms && Array.isArray(fastData.rooms) && fastData.rooms.length > 0) {
      return deepCleanAssetPaths(fastData);
    }

    const overrides = getFastMediaOverrides();
    if (overrides) {
      const merged: SiteData = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
      if (overrides.rooms && Array.isArray(overrides.rooms) && overrides.rooms.length > 0) {
        merged.rooms = merged.rooms.map(defRoom => {
          const match = overrides.rooms.find((o: any) => o.id === defRoom.id || o.name === defRoom.name);
          if (match) {
            return {
              ...defRoom,
              image: match.image || defRoom.image,
              images: (match.images && match.images.length > 0) ? match.images : defRoom.images
            };
          }
          return defRoom;
        });

        // Bidirectional sync: propagate custom room photos to extraImages and images
        const std = merged.rooms.find(r => r.id === 'standard');
        if (std && std.image) merged.extraImages.standardRoom = std.image;
        const lux = merged.rooms.find(r => r.id === 'lux');
        if (lux && lux.image) merged.images.suite = lux.image;
      }

      if (overrides.medicalPrograms && Array.isArray(overrides.medicalPrograms)) {
        merged.medicalPrograms = merged.medicalPrograms.map(defMed => {
          const match = overrides.medicalPrograms.find((o: any) => o.id === defMed.id);
          if (match && match.image) {
            return { ...defMed, image: match.image };
          }
          return defMed;
        });
      }

      if (overrides.images) {
        merged.images = { ...merged.images, ...overrides.images };
      }
      if (overrides.extraImages) {
        merged.extraImages = { ...merged.extraImages, ...overrides.extraImages };
      }
      if (overrides.hero) {
        if (Array.isArray(overrides.hero.slides)) {
          merged.hero.slides = overrides.hero.slides;
          const firstPhoto = overrides.hero.slides.find((s: any) => s.type === 'photo');
          if (firstPhoto?.url) {
            merged.images.hero = firstPhoto.url;
          } else if (overrides.hero.slides.length === 0 || !firstPhoto) {
            merged.images.hero = '';
          }
        }
        if (overrides.hero.defaultBackgroundMode) {
          merged.hero.defaultBackgroundMode = overrides.hero.defaultBackgroundMode;
        }
      }
      if (overrides.gallery && Array.isArray(overrides.gallery)) {
        merged.gallery = overrides.gallery;
      }
      if (overrides.news && Array.isArray(overrides.news) && overrides.news.length > 0) {
        merged.news = overrides.news;
      }
      return deepCleanAssetPaths(merged);
    }
  } catch (err) {
    console.warn('Initial synchronous data read error:', err);
  }
  return DEFAULT_SITE_DATA;
}

interface AdminDataContextProps {
  siteData: SiteData;
  isAdminMode: boolean;
  setIsAdminMode: (active: boolean) => void;
  updateSiteData: (newData: SiteData) => void;
  updateSection: <K extends keyof SiteData>(key: K, value: SiteData[K]) => void;
  updateSections: (updates: Partial<SiteData>) => void;
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
  // Synchronous initialization from fast cache eliminates the flash of default images on page reload
  const [siteData, setSiteData] = useState<SiteData>(getInitialSynchronousSiteData);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'documents' | 'news' | 'medical' | 'admin' | 'testimonials' | 'login'>('home');

  // Load from local storage and remote sources on mount
  useEffect(() => {
    let isCancelled = false;

    async function initializeData() {
      // 1. Immediately read persistent draft from high-capacity IndexedDB (fastest path to full fidelity)
      let savedData: SiteData | null = null;
      try {
        savedData = await getStorageData<SiteData>();
      } catch (err) {
        console.warn('IndexedDB read error:', err);
      }

      if (isCancelled) return;

      if (savedData) {
        try {
          const parsed = deepCleanAssetPaths(savedData);
          let morphed = false;

          // Gentle migration for images
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

          // Normalize room IDs without ever deleting custom rooms or photos
          if (parsed.rooms && Array.isArray(parsed.rooms) && parsed.rooms.length > 0) {
            parsed.rooms = parsed.rooms.map((r: any) => {
              let normalizedId = r.id;
              if (r.id === 'standard-improved') normalizedId = 'standard';
              if (r.id === 'suite-luxury' || r.id === 'junior-suite') normalizedId = 'lux';
              return {
                ...r,
                id: normalizedId
              };
            });

            // Bidirectional synchronization: ensure room photos and media tab images stay in sync
            const stdRoom = parsed.rooms.find((r: any) => r.id === 'standard');
            if (stdRoom && stdRoom.image && parsed.extraImages) {
              if (parsed.extraImages.standardRoom !== stdRoom.image) {
                parsed.extraImages.standardRoom = stdRoom.image;
                morphed = true;
              }
            }
            const luxRoom = parsed.rooms.find((r: any) => r.id === 'lux');
            if (luxRoom && luxRoom.image && parsed.images) {
              if (parsed.images.suite !== luxRoom.image) {
                parsed.images.suite = luxRoom.image;
                morphed = true;
              }
            }
          } else {
            parsed.rooms = [...ROOMS];
            morphed = true;
          }

          // Safeguard and normalize medical programs
          if (!parsed.medicalPrograms || !Array.isArray(parsed.medicalPrograms) || parsed.medicalPrograms.length === 0) {
            parsed.medicalPrograms = [...MEDICAL_PROGRAMS];
            morphed = true;
          } else {
            parsed.medicalPrograms = parsed.medicalPrograms.map((prog: any) => {
              const defaultImage = prog.id === 'respiratory' 
                ? '/images/pestovo_medical_1779777676990.png' 
                : prog.id === 'cardio' 
                ? '/images/pestovo_palace_1779780890544.png' 
                : (prog.id === 'antistress' || prog.id === 'nervous')
                ? '/images/pestovo_beach_1779780925661.png'
                : '/images/pestovo_block_1779780908700.png';

              const computedDuration = prog.duration || (prog.durationDays ? `от ${prog.durationDays} дней` : 'от 10 до 21 дня');
              const computedIcon = prog.icon || 'Lungs';
              const computedImage = prog.image || defaultImage;

              if (prog.duration !== computedDuration || !prog.icon || !prog.image) {
                morphed = true;
              }

              return {
                ...prog,
                duration: computedDuration,
                icon: computedIcon,
                image: computedImage
              };
            });
          }

          // Backfill and safeguard missing hero or hero properties
          if (!parsed.hero) {
            parsed.hero = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.hero));
            morphed = true;
          } else {
            const defaultHero = DEFAULT_SITE_DATA.hero;
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
            }
            if (!parsed.hero.ctaText) { parsed.hero.ctaText = defaultHero.ctaText; morphed = true; }
            if (!parsed.hero.defaultBackgroundMode || parsed.hero.defaultBackgroundMode === 'video_nature' || parsed.hero.defaultBackgroundMode === 'video_palace') {
              parsed.hero.defaultBackgroundMode = 'all';
              morphed = true;
            }
            
            if (!parsed.hero.stats || !Array.isArray(parsed.hero.stats) || parsed.hero.stats.length === 0) {
              parsed.hero.stats = JSON.parse(JSON.stringify(defaultHero.stats));
              morphed = true;
            }
            if (parsed.hero.showStats === undefined) {
              parsed.hero.showStats = true;
              morphed = true;
            }
            if (parsed.hero.slides === undefined || !Array.isArray(parsed.hero.slides)) {
              parsed.hero.slides = JSON.parse(JSON.stringify(defaultHero.slides));
              morphed = true;
            } else {
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
            parsed.news = [...DEFAULT_SITE_DATA.news];
            morphed = true;
          }

          // Backfill missing services
          if (!parsed.services || !Array.isArray(parsed.services)) {
            parsed.services = [...DEFAULT_SERVICES];
            morphed = true;
          }

          // Backfill missing gallery
          if (!parsed.gallery || !Array.isArray(parsed.gallery)) {
            parsed.gallery = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.gallery));
            morphed = true;
          }

          // Backfill missing galleryCategories
          if (!parsed.galleryCategories || !Array.isArray(parsed.galleryCategories)) {
            parsed.galleryCategories = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.galleryCategories));
            morphed = true;
          }

          // Backfill missing users
          if (!parsed.users || !Array.isArray(parsed.users)) {
            parsed.users = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.users || []));
            morphed = true;
          }

          // Backfill missing documents
          if (!parsed.documents || !Array.isArray(parsed.documents)) {
            parsed.documents = JSON.parse(JSON.stringify(INITIAL_DOCUMENTS));
            morphed = true;
          }

          // Keep fast cache up to date
          saveFastStorageData(parsed);

          if (!isCancelled) {
            setSiteData(parsed);
          }
        } catch (e) {
          console.error('Error parsing stored site data:', e);
        }
      }

      // 2. Non-blocking parallel network fetch for server updates (site-data.json & reviews.php)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const [siteDataRes, reviewsRes] = await Promise.allSettled([
          fetch('/site-data.json', { cache: 'no-store', signal: controller.signal }),
          fetch('/reviews.php', { cache: 'no-store', signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        if (isCancelled) return;

        // If no saved draft existed in IndexedDB, use published site-data.json
        if (!savedData && siteDataRes.status === 'fulfilled' && siteDataRes.value.ok) {
          const published = await siteDataRes.value.json().catch(() => null);
          if (published && typeof published === 'object') {
            const cleaned = deepCleanAssetPaths({ ...DEFAULT_SITE_DATA, ...published });
            saveFastStorageData(cleaned);
            setSiteData(cleaned);
            console.log('Applied published site-data.json from server');
          }
        }

        // Apply server reviews if available
        if (reviewsRes.status === 'fulfilled' && reviewsRes.value.ok) {
          const serverReviews = await reviewsRes.value.json().catch(() => null);
          if (Array.isArray(serverReviews) && serverReviews.length > 0) {
            setSiteData(prev => {
              const updated = { ...prev, testimonials: serverReviews };
              saveFastStorageData(updated);
              return updated;
            });
            console.log('Successfully updated testimonials from server reviews.php');
          }
        }
      } catch (networkErr) {
        console.log('Background network sync finished or timed out:', networkErr);
      }
    }

    initializeData();

    const savedAdminMode = localStorage.getItem(ADMIN_MODE_KEY);
    if (savedAdminMode === 'true') {
      setIsAdminMode(true);
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  const syncSettingsWithServer = async (data: SiteData) => {
    try {
      let username = 'admin';
      let password = '';
      const credsRaw = localStorage.getItem('pestovo_resort_admin_credentials');
      if (credsRaw) {
        try {
          const creds = JSON.parse(credsRaw);
          if (creds && creds.username) username = creds.username;
          if (creds && creds.password) password = creds.password;
        } catch {}
      }

      // Try /save_settings.php first
      const payload = {
        username,
        password,
        siteData: data
      };

      const response = await fetch('/save_settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resJson = await response.json().catch(() => ({}));
        console.log('Successfully saved settings to hosting server via save_settings.php:', resJson);
      } else {
        // Fallback to /api/save_settings
        const altResponse = await fetch('/api/save_settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => null);

        if (altResponse && altResponse.ok) {
          console.log('Successfully saved settings via /api/save_settings fallback');
        } else {
          console.warn('Server settings save returned non-OK status:', response.status);
        }
      }
    } catch (err) {
      console.log('Skipping real-time save_settings.php sync (offline or network error):', err);
    }
  };

  const updateSiteData = (newData: SiteData) => {
    // Ensure bidirectional synchronization between rooms and media images
    const synchronized = { ...newData };
    if (synchronized.rooms && Array.isArray(synchronized.rooms)) {
      const stdRoom = synchronized.rooms.find(r => r.id === 'standard');
      if (stdRoom && stdRoom.image) {
        synchronized.extraImages = { ...synchronized.extraImages, standardRoom: stdRoom.image };
      }
      const luxRoom = synchronized.rooms.find(r => r.id === 'lux');
      if (luxRoom && luxRoom.image) {
        synchronized.images = { ...synchronized.images, suite: luxRoom.image };
      }
    }

    setSiteData(synchronized);
    setStorageData(synchronized).catch(e => {
      console.error('Failed to save to storage:', e);
    });

    // Sync testimonials with PHP server if changed
    if (synchronized.testimonials) {
      fetch('/reviews.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'save_all',
          reviews: synchronized.testimonials
        })
      }).catch(err => {
        console.log('Skipping reviews.php sync in local development', err);
      });
    }

    // Securely sync all site settings to PHP server
    syncSettingsWithServer(synchronized);
  };

  const updateSections = (updates: Partial<SiteData>) => {
    setSiteData(prev => {
      const updated = { ...prev, ...updates };

      // Bidirectional sync
      if (updates.rooms && Array.isArray(updates.rooms)) {
        const stdRoom = updates.rooms.find(r => r.id === 'standard');
        if (stdRoom && stdRoom.image) {
          updated.extraImages = { ...updated.extraImages, standardRoom: stdRoom.image };
        }
        const luxRoom = updates.rooms.find(r => r.id === 'lux');
        if (luxRoom && luxRoom.image) {
          updated.images = { ...updated.images, suite: luxRoom.image };
        }
      } else {
        if (updates.extraImages?.standardRoom && updated.rooms) {
          updated.rooms = updated.rooms.map(r => r.id === 'standard' ? { ...r, image: updates.extraImages!.standardRoom } : r);
        }
        if (updates.images?.suite && updated.rooms) {
          updated.rooms = updated.rooms.map(r => r.id === 'lux' ? { ...r, image: updates.images!.suite } : r);
        }
      }

      // Hero slides & hero image bidirectional sync
      if (updates.hero?.slides && Array.isArray(updates.hero.slides)) {
        const firstPhoto = updates.hero.slides.find((s: any) => s.type === 'photo');
        if (firstPhoto) {
          updated.images = { ...updated.images, hero: firstPhoto.url };
        } else if (updates.hero.slides.length === 0 || !firstPhoto) {
          updated.images = { ...updated.images, hero: '' };
        }
      }

      setStorageData(updated).catch(e => {
        console.error('Failed to save to storage:', e);
      });
      syncSettingsWithServer(updated);
      return updated;
    });
  };

  const updateSection = <K extends keyof SiteData>(key: K, value: SiteData[K]) => {
    setSiteData(prev => {
      const updated = { ...prev, [key]: value };

      // Bidirectional sync between room cards and media images
      if (key === 'rooms' && Array.isArray(value)) {
        const stdRoom = (value as Room[]).find(r => r.id === 'standard');
        if (stdRoom && stdRoom.image) {
          updated.extraImages = { ...updated.extraImages, standardRoom: stdRoom.image };
        }
        const luxRoom = (value as Room[]).find(r => r.id === 'lux');
        if (luxRoom && luxRoom.image) {
          updated.images = { ...updated.images, suite: luxRoom.image };
        }
      } else if (key === 'extraImages' && (value as any)?.standardRoom && updated.rooms) {
        updated.rooms = updated.rooms.map(r => r.id === 'standard' ? { ...r, image: (value as any).standardRoom } : r);
      } else if (key === 'images' && (value as any)?.suite && updated.rooms) {
        updated.rooms = updated.rooms.map(r => r.id === 'lux' ? { ...r, image: (value as any).suite } : r);
      } else if (key === 'hero' && (value as any)?.slides && Array.isArray((value as any).slides)) {
        const firstPhoto = (value as any).slides.find((s: any) => s.type === 'photo');
        if (firstPhoto) {
          updated.images = { ...updated.images, hero: firstPhoto.url };
        } else {
          updated.images = { ...updated.images, hero: '' };
        }
      }
      
      setStorageData(updated).catch(e => {
        console.error('Failed to save to storage:', e);
      });
      
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

  const resetToDefault = async () => {
    if (window.confirm('Вы действительно хотите сбросить все внесенные изменения и вернуть исходное оформление сайта?')) {
      await clearStorageData();
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
      updateSections,
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
