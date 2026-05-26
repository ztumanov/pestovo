import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, MedicalProgram, Testimonial, FAQItem } from '../types';
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
  };
  hero: {
    badge: string;
    titleFirstPart: string;
    titleSecondPart: string;
    subtitle: string;
    ctaText: string;
    defaultBackgroundMode?: 'video_palace' | 'video_nature' | 'photo';
  };
  rooms: Room[];
  medicalPrograms: MedicalProgram[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
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
  },
  rooms: [...ROOMS],
  medicalPrograms: [...MEDICAL_PROGRAMS],
  testimonials: [...TESTIMONIALS],
  faqs: [...FAQS],
  images: { ...IMAGES },
  extraImages: { ...EXTRA_IMAGES },
  videos: { ...VIDEOS }
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
}

const AdminDataContext = createContext<AdminDataContextProps | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('hero');

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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  };

  const updateSection = <K extends keyof SiteData>(key: K, value: SiteData[K]) => {
    const updated = { ...siteData, [key]: value };
    setSiteData(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
      setShowAdminPanel
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
