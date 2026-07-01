import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Waves, 
  TreePine, 
  ArrowRight, 
  Clock, 
  Menu, 
  X, 
  Utensils, 
  Compass, 
  Tv, 
  Coffee, 
  Droplet, 
  Sparkles, 
  ShieldAlert, 
  ThumbsUp,
  Award,
  BookOpen,
  Send,
  Video,
  Image,
  Lock,
  Edit,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Thermometer,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Type,
  ImageOff,
  Accessibility,
  FileText,
  Building2,
  Shield,
  UserCheck,
  ChevronDown,
  ArrowUp,
  Download,
  Newspaper,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Room, MedicalProgram } from './types';
import { useAdminData } from './context/AdminDataContext';
import AdminPage from './components/AdminPage';
import AdminFloatBar from './components/AdminFloatBar';
import DocumentsModal from './components/DocumentsModal';
import NewsPage from './components/NewsPage';
import MedicalPage from './components/MedicalPage';
import ServicesPage from './components/ServicesPage';
import DocumentsPage from './components/DocumentsPage';
import TestimonialsPage from './components/TestimonialsPage';

export default function App() {
  const { 
    siteData, 
    isAdminMode, 
    setActiveSettingsTab, 
    updateSection,
    currentPage,
    setCurrentPage
  } = useAdminData();
  const { 
    resortInfo: RESORT_INFO = {}, 
    hero: HERO_DATA = {
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
    rooms: ROOMS = [], 
    medicalPrograms: MEDICAL_PROGRAMS = [], 
    testimonials: TESTIMONIALS = [], 
    faqs: FAQS = [], 
    images: IMAGES = {}, 
    extraImages: EXTRA_IMAGES = {}, 
    videos: VIDEOS = {} 
  } = siteData || {};

  // Navigation states
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll parallax values for Hero block with smooth physics spring
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 85,
    damping: 24,
    mass: 0.2
  });
  const yBg = useTransform(smoothScrollY, [0, 800], [0, 180]);
  const yHeroText = useTransform(smoothScrollY, [0, 800], [0, -90]);
  const opacityHeroText = useTransform(smoothScrollY, [0, 800], [1, 0]);
  
  // Slideshow state for automatic background rotation
  const rawSlides = (HERO_DATA && HERO_DATA.slides && HERO_DATA.slides.length > 0)
    ? HERO_DATA.slides
    : [
        { id: '1', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41851-large.mp4' },
        { id: '2', type: 'photo', url: '/src/assets/images/pestovo_palace_1779780890544.png' },
        { id: '3', type: 'photo', url: '/src/assets/images/pestovo_beach_1779780925661.png' }
      ];

  const bgMode = HERO_DATA?.defaultBackgroundMode || 'all';
  const filteredSlides = rawSlides.filter(slide => {
    if (bgMode === 'photo') return slide.type === 'photo';
    if (bgMode === 'video' || bgMode === 'video_nature' || bgMode === 'video_palace') return slide.type === 'video';
    return true;
  });

  const slides = filteredSlides.length > 0 ? filteredSlides : rawSlides;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Auto-cycling slideshow timer
  useEffect(() => {
    if (slides.length <= 1) return;
    const currentSlide = slides[activeSlideIndex];
    const duration = currentSlide?.type === 'video' ? 14000 : 7000;
    const timer = setTimeout(() => {
      setActiveSlideIndex(prev => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [activeSlideIndex, slides]);

  // Gallery tabs
  const [galleryTab, setGalleryTab] = useState<'all' | 'rooms' | 'nature' | 'medical' | 'infrastructure'>('all');

  // About Sanatorium interactive tabs
  const [aboutTab, setAboutTab] = useState<'general' | 'medical' | 'treatment' | 'registry'>('general');

  // Interactive review states
  const [reviewForm, setReviewForm] = useState({
    author: '',
    role: '',
    rating: 5,
    text: '',
  });
  
  // Interactive weather/microclimate state
  const [climateTime, setClimateTime] = useState<'morning' | 'day' | 'evening'>('day');

  // Medical program interactive state
  const [activeMedProgram, setActiveMedProgram] = useState<string>('respiratory');

  // Real weather forecast state and effect for Gaspra
  const [realWeather, setRealWeather] = useState<{
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    forecast: Array<{
      date: string;
      tempMax: number;
      tempMin: number;
      weatherCode: number;
    }>;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        // Gaspra, Crimea coordinates
        const lat = 44.4361;
        const lon = 34.1139;
        
        let data: any = null;
        let isFallback = false;

        const fetchWithTimeout = async (url: string, ms = 4000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), ms);
          try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            return response;
          } catch (e) {
            clearTimeout(id);
            throw e;
          }
        };

        try {
          const res = await fetchWithTimeout(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Moscow`,
            4000
          );
          if (res.ok) {
            data = await res.json();
          } else {
            throw new Error('Primary weather API returned non-OK response');
          }
        } catch (primaryErr) {
          console.warn('Primary weather API failed or timed out. Falling back to wttr.in...', primaryErr);
          isFallback = true;
          try {
            const res = await fetchWithTimeout(
              `https://wttr.in/44.4361,34.1139?format=j1`,
              5000
            );
            if (!res.ok) throw new Error('Fallback weather API returned non-OK response');
            data = await res.json();
          } catch (fallbackErr) {
            console.error('Fallback weather API also failed:', fallbackErr);
            throw new Error('Both weather APIs failed');
          }
        }
        
        if (active && data) {
          if (!isFallback && data.current && data.daily) {
            const forecastData = [];
            for (let i = 0; i < 3; i++) {
              if (data.daily.time[i]) {
                forecastData.push({
                  date: data.daily.time[i],
                  tempMax: Math.round(data.daily.temperature_2m_max[i]),
                  tempMin: Math.round(data.daily.temperature_2m_min[i]),
                  weatherCode: data.daily.weather_code[i]
                });
              }
            }
            
            setRealWeather({
              temp: Math.round(data.current.temperature_2m),
              feelsLike: Math.round(data.current.apparent_temperature),
              humidity: data.current.relative_humidity_2m,
              windSpeed: Number(data.current.wind_speed_10m.toFixed(1)),
              weatherCode: data.current.weather_code,
              forecast: forecastData
            });
            setWeatherError(null);
          } else if (isFallback && data.current_condition && data.weather) {
            const current = data.current_condition[0];
            
            const mapWwoToWmo = (wwoCode: string | number): number => {
              const code = Number(wwoCode);
              if (code === 113) return 0; // Sunny
              if ([116].includes(code)) return 1; // Partly Cloudy
              if ([119, 122].includes(code)) return 3; // Cloudy/Overcast
              if ([143, 248, 260].includes(code)) return 45; // Fog
              if ([263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359].includes(code)) return 61; // Rain
              if ([179, 227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 395].includes(code)) return 71; // Snow
              if ([200, 386, 389, 392].includes(code)) return 95; // Thunderstorm
              return 2; // Default Cloudy
            };

            const forecastData = [];
            for (let i = 0; i < 3; i++) {
              const day = data.weather[i];
              if (day) {
                const dayCode = mapWwoToWmo(day.hourly?.[4]?.weatherCode || day.hourly?.[0]?.weatherCode || 113);
                forecastData.push({
                  date: day.date,
                  tempMax: Math.round(Number(day.maxtempC)),
                  tempMin: Math.round(Number(day.mintempC)),
                  weatherCode: dayCode
                });
              }
            }

            const currentCode = mapWwoToWmo(current.weatherCode || 113);
            const windKmph = Number(current.windspeedKmph) || 0;
            const windMs = Number((windKmph / 3.6).toFixed(1));

            setRealWeather({
              temp: Math.round(Number(current.temp_C)),
              feelsLike: Math.round(Number(current.FeelsLikeC || current.temp_C)),
              humidity: Number(current.humidity) || 60,
              windSpeed: windMs,
              weatherCode: currentCode,
              forecast: forecastData
            });
            setWeatherError(null);
          }
        }
      } catch (err: any) {
        if (active) {
          setWeatherError('Временно недоступно');
        }
      } finally {
        if (active) {
          setWeatherLoading(false);
        }
      }
    };

    fetchWeather();
    return () => {
      active = false;
    };
  }, []);

  const formatForecastDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        
        const todayObj = new Date();
        const isToday = dateObj.getDate() === todayObj.getDate() && dateObj.getMonth() === todayObj.getMonth();
        const tomorrowObj = new Date();
        tomorrowObj.setDate(todayObj.getDate() + 1);
        const isTomorrow = dateObj.getDate() === tomorrowObj.getDate() && dateObj.getMonth() === tomorrowObj.getMonth();
        
        if (isToday) return 'Сегодня';
        if (isTomorrow) return 'Завтра';
        
        return `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
      }
    } catch (e) {}
    return dateStr;
  };

  const getWeatherName = (code: number) => {
    if (code === 0) return 'Ясно';
    if ([1, 2].includes(code)) return 'Малооблачно';
    if (code === 3) return 'Пасмурно';
    if ([45, 48].includes(code)) return 'Туман';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Морось';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Дождь';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Снег';
    if ([95, 96, 99].includes(code)) return 'Гроза';
    return 'Облачно';
  };

  const getWeatherIcon = (code: number, className = "w-6 h-6") => {
    if (code === 0) return <Sun className={`${className} text-amber-500`} />;
    if ([1, 2].includes(code)) return <Cloud className={`${className} text-amber-300`} />;
    if (code === 3) return <Cloud className={`${className} text-stone-400`} />;
    if ([45, 48].includes(code)) return <CloudFog className={`${className} text-stone-300`} />;
    if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle className={`${className} text-sky-400`} />;
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain className={`${className} text-sky-500`} />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className={`${className} text-blue-200`} />;
    if ([95, 96, 99].includes(code)) return <CloudLightning className={`${className} text-amber-500`} />;
    return <Sun className={`${className} text-amber-500`} />;
  };

  const getSeaTemperature = (airTemp: number) => {
    const today = new Date();
    const month = today.getMonth(); // 0-indexed, 4 = May
    let baseSeaTemp = 18;
    if (month === 4) { // May
      baseSeaTemp = 16.5 + (today.getDate() / 31) * 3; // 16.5 to 19.5
    } else if (month === 5) { // June
      baseSeaTemp = 19.5 + (today.getDate() / 30) * 3.5; // 19.5 to 23
    } else if (month === 6 || month === 7) { // July, August
      baseSeaTemp = 23 + Math.sin(today.getDate()) * 1.5; // 21.5 to 24.5
    } else if (month === 8) { // September
      baseSeaTemp = 21.5 - (today.getDate() / 30) * 3; 
    } else if (month >= 9 || month <= 2) { // October to March
      baseSeaTemp = 9 + Math.abs(airTemp - 9) * 0.15;
    } else { // April
      baseSeaTemp = 12.5 + (today.getDate() / 30) * 3;
    }
    return Math.round(baseSeaTemp);
  };

  // Room details modal
  const [roomModal, setRoomModal] = useState<Room | null>(null);
  const [activeRoomImageIndex, setActiveRoomImageIndex] = useState(0);

  useEffect(() => {
    setActiveRoomImageIndex(0);
  }, [roomModal?.id]);

  // Lightbox index for full screen gallery images
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // About dropdown and active subpages (Documents / News) states
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState<'documents' | 'news' | null>(null);

  // VISUALLY IMPAIRED / ACCESSIBILITY MODE STATE
  const [isAccessMode, setIsAccessMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('access_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [accessFontSize, setAccessFontSize] = useState<'normal' | 'large' | 'extra-large' | 'huge'>(() => {
    try {
      return (localStorage.getItem('access_font_size') as any) || 'large';
    } catch {
      return 'large';
    }
  });

  const [accessContrast, setAccessContrast] = useState<'normal' | 'bw' | 'wb' | 'yb' | 'bc'>(() => {
    try {
      return (localStorage.getItem('access_contrast') as any) || 'bw';
    } catch {
      return 'bw';
    }
  });

  const [accessSpacing, setAccessSpacing] = useState<'normal' | 'wide' | 'extra-wide'>(() => {
    try {
      return (localStorage.getItem('access_spacing') as any) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [accessShowImages, setAccessShowImages] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('access_show_images');
      return stored === null ? true : stored === 'true';
    } catch {
      return true;
    }
  });

  const [accessSpeech, setAccessSpeech] = useState<boolean>(() => {
    try {
      return localStorage.getItem('access_speech') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('access_mode', String(isAccessMode));
      localStorage.setItem('access_font_size', accessFontSize);
      localStorage.setItem('access_contrast', accessContrast);
      localStorage.setItem('access_spacing', accessSpacing);
      localStorage.setItem('access_show_images', String(accessShowImages));
      localStorage.setItem('access_speech', String(accessSpeech));
    } catch (e) {}
  }, [isAccessMode, accessFontSize, accessContrast, accessSpacing, accessShowImages, accessSpeech]);

  useEffect(() => {
    if (isAccessMode) {
      document.body.classList.add('accessibility-on');
    } else {
      document.body.classList.remove('accessibility-on');
    }
    return () => {
      document.body.classList.remove('accessibility-on');
    };
  }, [isAccessMode]);

  useEffect(() => {
    if (!isAccessMode || !accessSpeech) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const readable = target.closest('p, h1, h2, h3, h4, h5, h6, li, span, button, a');
      if (readable) {
        // Skip clicking accessibility bar itself
        if (target.closest('.accessibility-on-bar')) return;
        
        const text = readable.textContent?.trim() || '';
        if (text) {
          window.speechSynthesis?.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'ru-RU';
          const voices = window.speechSynthesis.getVoices();
          const ruVoice = voices.find(v => v.lang.startsWith('ru'));
          if (ruVoice) {
            utterance.voice = ruVoice;
          }
          window.speechSynthesis?.speak(utterance);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isAccessMode, accessSpeech]);

  const getAccessibilityStyleString = () => {
    if (!isAccessMode) return '';

    let styles = '';

    if (accessFontSize === 'large') {
      styles += `
        .accessibility-on, .accessibility-on * {
          font-size: 19px !important;
          line-height: 1.62 !important;
        }
        .accessibility-on h1, .accessibility-on h2, .accessibility-on h3, .accessibility-on h4, .accessibility-on h5 {
          line-height: 1.35 !important;
        }
        .accessibility-on h1 { font-size: 34px !important; }
        .accessibility-on h2 { font-size: 28px !important; }
        .accessibility-on h3 { font-size: 24px !important; }
        .accessibility-on h4 { font-size: 21px !important; }
        .accessibility-on svg { width: 28px !important; height: 28px !important; }
      `;
    } else if (accessFontSize === 'extra-large') {
      styles += `
        .accessibility-on, .accessibility-on * {
          font-size: 22px !important;
          line-height: 1.75 !important;
        }
        .accessibility-on h1, .accessibility-on h2, .accessibility-on h3, .accessibility-on h4, .accessibility-on h5 {
          line-height: 1.4 !important;
        }
        .accessibility-on h1 { font-size: 42px !important; }
        .accessibility-on h2 { font-size: 36px !important; }
        .accessibility-on h3 { font-size: 30px !important; }
        .accessibility-on h4 { font-size: 26px !important; }
        .accessibility-on svg { width: 34px !important; height: 34px !important; }
      `;
    } else if (accessFontSize === 'huge') {
      styles += `
        .accessibility-on, .accessibility-on * {
          font-size: 26px !important;
          line-height: 1.9 !important;
        }
        .accessibility-on h1, .accessibility-on h2, .accessibility-on h3, .accessibility-on h4, .accessibility-on h5 {
          line-height: 1.45 !important;
        }
        .accessibility-on h1 { font-size: 50px !important; }
        .accessibility-on h2 { font-size: 44px !important; }
        .accessibility-on h3 { font-size: 38px !important; }
        .accessibility-on h4 { font-size: 32px !important; }
        .accessibility-on svg { width: 40px !important; height: 40px !important; }
      `;
    }

    if (accessSpacing === 'wide') {
      styles += `
        .accessibility-on, .accessibility-on * {
          letter-spacing: 0.1em !important;
        }
      `;
    } else if (accessSpacing === 'extra-wide') {
      styles += `
        .accessibility-on, .accessibility-on * {
          letter-spacing: 0.18em !important;
        }
      `;
    }

    if (accessContrast === 'bw') {
      styles += `
        .accessibility-on {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        .accessibility-on, .accessibility-on * {
          background-color: #ffffff !important;
          background-image: none !important;
          color: #000000 !important;
          border-color: #000000 !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }
        .accessibility-on input, .accessibility-on textarea, .accessibility-on select, .accessibility-on button, .accessibility-on a {
          border: 2px solid #000000 !important;
          border-radius: 4px !important;
          font-weight: 700 !important;
          background: #ffffff !important;
          color: #000000 !important;
        }
        .accessibility-on button:hover, .accessibility-on a:hover {
          background: #000000 !important;
          color: #ffffff !important;
        }
      `;
    } else if (accessContrast === 'wb') {
      styles += `
        .accessibility-on {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        .accessibility-on, .accessibility-on * {
          background-color: #000000 !important;
          background-image: none !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }
        .accessibility-on input, .accessibility-on textarea, .accessibility-on select, .accessibility-on button, .accessibility-on a {
          border: 2px solid #ffffff !important;
          border-radius: 4px !important;
          font-weight: 700 !important;
          background: #000000 !important;
          color: #ffffff !important;
        }
        .accessibility-on button:hover, .accessibility-on a:hover {
          background: #ffffff !important;
          color: #000000 !important;
        }
      `;
    } else if (accessContrast === 'yb') {
      styles += `
        .accessibility-on {
          background-color: #000000 !important;
          color: #ffff00 !important;
        }
        .accessibility-on, .accessibility-on * {
          background-color: #000000 !important;
          background-image: none !important;
          color: #ffff00 !important;
          border-color: #ffff00 !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }
        .accessibility-on input, .accessibility-on textarea, .accessibility-on select, .accessibility-on button, .accessibility-on a {
          border: 2px solid #ffff00 !important;
          border-radius: 4px !important;
          font-weight: 700 !important;
          background: #000000 !important;
          color: #ffff00 !important;
        }
        .accessibility-on button:hover, .accessibility-on a:hover {
          background: #ffff00 !important;
          color: #000000 !important;
        }
      `;
    } else if (accessContrast === 'bc') {
      styles += `
        .accessibility-on {
          background-color: #e0f7fa !important;
          color: #002d62 !important;
        }
        .accessibility-on, .accessibility-on * {
          background-color: #e0f7fa !important;
          background-image: none !important;
          color: #002d62 !important;
          border-color: #002d62 !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }
        .accessibility-on input, .accessibility-on textarea, .accessibility-on select, .accessibility-on button, .accessibility-on a {
          border: 2px solid #002d62 !important;
          border-radius: 4px !important;
          font-weight: 700 !important;
          background: #e0f7fa !important;
          color: #002d62 !important;
        }
        .accessibility-on button:hover, .accessibility-on a:hover {
          background: #002d62 !important;
          color: #e0f7fa !important;
        }
      `;
    }

    if (!accessShowImages) {
      styles += `
        .accessibility-on img,
        .accessibility-on video,
        .accessibility-on iframe,
        .accessibility-on [style*="background-image"],
        .accessibility-on .hero-bg,
        .accessibility-on .bg-cover {
          display: none !important;
        }
      `;
    }

    styles += `
      .accessibility-on * {
        font-family: Arial, "Helvetica Neue", sans-serif !important;
      }
      .accessibility-on-bar * {
        font-family: inherit !important;
      }
    `;

    return styles;
  };

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Monitor scrolling to highlight section links
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'medical', 'rooms', 'gallery', 'testimonials', 'contacts'];
      const scrollPosition = window.scrollY + 200;
      
      setShowScrollTop(window.scrollY > 400);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Handle room details click
  const handleOpenRoomDetails = (room: Room) => {
    setRoomModal(room);
  };

  // Prefill booking or direct to contacts section
  const handleBookRoom = (roomName: string) => {
    setRoomModal(null);
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Climate details based on time of day
  const climateDetails = {
    morning: {
      temp: '19°C',
      seaTemp: '20°C',
      phytoncides: 'Супер-концентрация',
      aerosols: 'Насыщенный морской бриз',
      recommendation: 'Идеальное время для утреннего терренкура по парку к морю и дыхательной гимнастики.',
      humidity: '72%'
    },
    day: {
      temp: '24°C',
      seaTemp: '21°C',
      phytoncides: 'Максимум хвойного эфира',
      aerosols: 'Смешанный хвойно-морской',
      recommendation: 'Прекрасно для прохождения лечебных ванн и грязелечения, а также отдыха на приватном пляже.',
      humidity: '55%'
    },
    evening: {
      temp: '21°C',
      seaTemp: '21°C',
      phytoncides: 'Умеренная концентрация',
      aerosols: 'Горный бриз с Ай-Петри',
      recommendation: 'Время для релаксационной йоги на террасе и вечерних климатотерапевтических прогулок у кипарисов.',
      humidity: '64%'
    }
  };

  // Form inputs validation and handler for reviews
  const handleReviewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateReviewForm = () => {
    const errors: Record<string, string> = {};
    if (!reviewForm.author.trim()) {
      errors.author = 'Пожалуйста, введите ваше имя или ФИО';
    } else if (reviewForm.author.trim().length < 3) {
      errors.author = 'Имя должно содержать не менее 3 символов';
    }

    if (!reviewForm.role.trim()) {
      errors.role = 'Пожалуйста, укажите ваш статус (например, Сотрудник ФТС, г. Москва)';
    }

    if (!reviewForm.text.trim()) {
      errors.text = 'Пожалуйста, напишите текст вашего отзыва';
    } else if (reviewForm.text.trim().length < 10) {
      errors.text = 'Отзыв должен содержать не менее 10 символов';
    }

    return errors;
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateReviewForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(`review-${firstErrorField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Process submission simulation
    setIsSubmitting(true);
    setSubmitStep(1);

    setTimeout(() => {
      setSubmitStep(2);
      setTimeout(() => {
        setSubmitStep(3);
        setTimeout(() => {
          // Format current date in Russian
          const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
          ];
          const today = new Date();
          const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

          // Create new testimonial item
          const newTestimonial = {
            id: `test-user-${Date.now()}`,
            author: reviewForm.author.trim(),
            role: reviewForm.role.trim(),
            rating: reviewForm.rating,
            text: reviewForm.text.trim(),
            date: dateStr
          };

          // Save to siteData testimonials
          const updatedTestimonials = [newTestimonial, ...TESTIMONIALS];
          updateSection('testimonials', updatedTestimonials);

          setIsSubmitting(false);
          setSubmitSuccess(true);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const getMedicalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lungs': return <Activity className="w-6 h-6 text-[#c5a880]" />;
      case 'Heart': return <Heart className="w-6 h-6 text-[#c5a880]" />;
      case 'Brain': return <Brain className="w-6 h-6 text-[#c5a880]" />;
      case 'Activity': return <Waves className="w-6 h-6 text-[#c5a880]" />;
      default: return <Sparkles className="w-6 h-6 text-[#c5a880]" />;
    }
  };

  // Combine generated images + fallback Unsplash pictures for the big filterable gallery
  const ALL_GALLERY_ITEMS = siteData.gallery || [];

  const filteredGallery = galleryTab === 'all' 
    ? ALL_GALLERY_ITEMS 
    : ALL_GALLERY_ITEMS.filter(item => item.category === galleryTab);

  // Keyboard navigation and key listeners for image lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredGallery]);

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isAccessMode ? 'accessibility-on' : 'bg-[#FAF9F6] text-[#1c2a22]'}`}>
      
      {/* Dynamic injection of generated styles */}
      {isAccessMode && (
        <style dangerouslySetInnerHTML={{ __html: getAccessibilityStyleString() }} />
      )}

      {/* TOP NOTIFICATION / ACCESSIBILITY PRE-HEADER BAR */}
      {!isAccessMode ? (
        <div className="bg-[#021f18] text-stone-300 text-[10px] sm:text-xs py-2 border-b border-emerald-950 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]"></span>
              <span className="font-mono tracking-wider font-semibold uppercase text-stone-400 text-center sm:text-left">
                Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» ФТС России»
              </span>
            </div>
            <button 
              onClick={() => {
                setIsAccessMode(true);
                if (window.speechSynthesis) {
                  const welcome = new SpeechSynthesisUtterance("Включена версия для слабовидящих. Вы можете настроить шрифт и контраст в появившейся панели сверху.");
                  welcome.lang = "ru-RU";
                  window.speechSynthesis.speak(welcome);
                }
              }}
              className="flex items-center space-x-1.5 text-stone-300 hover:text-white transition-colors bg-emerald-950 hover:bg-emerald-900 border border-[#c5a880]/20 rounded px-2.5 py-0.5 text-[10px] sm:text-[11px] select-none cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
              <span className="font-medium">Версия для слабовидящих</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACCESSIBILITY SETTINGS PANEL */
        <div className="accessibility-on-bar bg-white text-black border-b-4 border-black p-3 sm:p-4 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
              <div className="flex items-center space-x-2 font-bold text-sm sm:text-base select-none">
                <Accessibility className="w-5 h-5 text-black" />
                <span>Панель доступности (А)</span>
              </div>
              <button
                onClick={() => {
                  setIsAccessMode(false);
                  window.speechSynthesis?.cancel();
                }}
                className="bg-black text-white hover:bg-neutral-800 font-bold px-3 py-1 rounded text-[11px] uppercase tracking-wider"
              >
                Обычная версия сайта (Вернуться)
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
              
              {/* Size control */}
              <div className="space-y-1">
                <span className="block font-bold">Размер шрифта:</span>
                <div className="flex space-x-0.5">
                  {(['normal', 'large', 'extra-large', 'huge'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setAccessFontSize(s)}
                      className={`px-2 py-1 border font-bold text-xs rounded ${
                        accessFontSize === s ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-400 hover:bg-neutral-100'
                      }`}
                    >
                      {s === 'normal' ? 'А' : s === 'large' ? 'А+' : s === 'extra-large' ? 'А++' : 'А+++'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast control */}
              <div className="space-y-1">
                <span className="block font-bold">Цветовая схема (Контраст):</span>
                <div className="flex flex-wrap gap-0.5">
                  {[
                    { id: 'bw', label: 'Ч/Б', desc: 'Черным по белому' },
                    { id: 'wb', label: 'Б/Ч', desc: 'Белым по черному' },
                    { id: 'yb', label: 'Ж/Ч', desc: 'Желтым по черному' },
                    { id: 'bc', label: 'С/Г', desc: 'Синим по голубому' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAccessContrast(c.id as any)}
                      title={c.desc}
                      className={`px-2 py-1 border font-bold rounded text-xs ${
                        accessContrast === c.id ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-400 hover:bg-neutral-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-1">
                <span className="block font-bold">Интервал текста (Кернинг):</span>
                <div className="flex space-x-0.5">
                  {(['normal', 'wide', 'extra-wide'] as const).map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setAccessSpacing(sp)}
                      className={`px-2 py-1 border font-bold rounded text-[11px] ${
                        accessSpacing === sp ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-400 hover:bg-neutral-100'
                      }`}
                    >
                      {sp === 'normal' ? 'Обыч.' : sp === 'wide' ? 'Шир.' : 'Очень шир.'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images Visibility */}
              <div className="space-y-1">
                <span className="block font-bold">Отображать картинки:</span>
                <div className="flex space-x-0.5">
                  {[
                    { val: true, label: 'Да' },
                    { val: false, label: 'Нет (Скрыть)' },
                  ].map((im) => (
                    <button
                      key={String(im.val)}
                      onClick={() => setAccessShowImages(im.val)}
                      className={`px-2.5 py-1 border font-bold rounded text-xs ${
                        accessShowImages === im.val ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-400 hover:bg-neutral-100'
                      }`}
                    >
                      {im.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Reader */}
              <div className="space-y-1 w-full">
                <span className="block font-bold">Чтение голосом (Синтезатор):</span>
                <div className="flex space-x-0.5">
                  {[
                    { val: true, label: 'ВКЛ 🔊' },
                    { val: false, label: 'ВЫКЛ' },
                  ].map((sp) => (
                    <button
                      key={String(sp.val)}
                      onClick={() => {
                        setAccessSpeech(sp.val);
                        if (!sp.val) {
                          window.speechSynthesis?.cancel();
                        } else if (sp.val && window.speechSynthesis) {
                          const soundCheck = new SpeechSynthesisUtterance("Синтезатор включён. Кликните на абзац или надпись, чтобы её прослушать.");
                          soundCheck.lang = "ru-RU";
                          window.speechSynthesis.speak(soundCheck);
                        }
                      }}
                      className={`px-2.5 py-1 border font-bold rounded text-xs ${
                        accessSpeech === sp.val ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-400 hover:bg-neutral-100'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Instruction Banner if synth is active */}
            {accessSpeech && (
              <div className="bg-amber-50 text-amber-950 px-3 py-1 rounded text-[11px] font-bold border border-amber-300 flex items-center space-x-1 animate-pulse">
                <span>🔊</span>
                <span>Режим чтения: Кликните мышью по любому слову или абзацу на сайте для голосового озвучивания.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXQUISITE HEADER */}
      <nav className="sticky top-0 z-50 bg-[#022C22]/95 backdrop-blur-md border-b border-[#c5a880]/20 text-white shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              {/* Gold/Emerald High-Fidelity Vector Russian FTS Emblem */}
              <div className="w-14 h-14 bg-gradient-to-br from-[#c5a880]/30 to-[#9a7d56]/10 rounded-full p-1 shadow-inner flex items-center justify-center relative overflow-visible select-none">
                <svg className="w-12 h-12 block select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Eagle Wings & Tail (Elegant Antique Gold) */}
                  <path d="M 50 42 C 43 30, 26 18, 12 28 C 15 38, 20 48, 30 58 C 24 61, 20 66, 16 73 C 24 71, 32 66, 38 60 C 34 69, 30 78, 22 85 C 32 81, 40 73, 44 63 L 44 48 C 45 44, 46 43, 46 42 Z" fill="#D4AF37" opacity="0.95" />
                  <path d="M 50 42 C 57 30, 74 18, 88 28 C 85 38, 80 48, 70 58 C 76 61, 80 66, 84 73 C 76 71, 68 66, 62 60 C 66 69, 70 78, 78 85 C 68 81, 60 73, 56 63 L 56 48 C 55 44, 54 43, 54 42 Z" fill="#D4AF37" opacity="0.95" />
                  
                  {/* Eagle Heads */}
                  <path d="M 45 37 C 42 37, 39 34, 39 31 C 39 28, 42 24, 45 24 C 48 24, 49 28, 48 30 C 47 33, 47 37, 45 37 Z" fill="#D4AF37" />
                  <path d="M 39 29 L 34 27 L 38 31 Z" fill="#D6B85C" />
                  
                  <path d="M 55 37 C 58 37, 61 34, 61 31 C 61 28, 58 24, 55 24 C 52 24, 51 28, 52 30 C 53 33, 53 37, 55 37 Z" fill="#D4AF37" />
                  <path d="M 61 29 L 66 27 L 62 31 Z" fill="#D6B85C" />

                  {/* Imperial Crowns */}
                  <path d="M 42 20 C 42 18, 44 17, 45 17 C 46 17, 48 18, 48 20 H 42 Z" fill="#F3E5AB" stroke="#9A7D56" strokeWidth="0.5" />
                  <path d="M 52 20 C 52 18, 54 17, 55 17 C 56 17, 58 18, 58 20 H 52 Z" fill="#F3E5AB" stroke="#9A7D56" strokeWidth="0.5" />
                  <g transform="translate(0, -1)">
                    <path d="M 46 15 C 46 11, 48 10, 50 10 C 52 10, 54 11, 54 15" stroke="#F3E5AB" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 44 16 C 44 14, 47 13, 50 13 C 53 13, 56 14, 56 16 C 55 18, 45 18, 44 16 Z" fill="#F3E5AB" stroke="#9A7D56" strokeWidth="0.5" />
                    <circle cx="50" cy="9" r="1" fill="#F3E5AB" />
                  </g>

                  {/* Green Heraldic Shield with Golden Border */}
                  <g transform="translate(0, 3)">
                    <path d="M 33 37 C 33 55, 35 70, 50 78 C 65 70, 67 55, 67 37 Z" fill="#D4AF37" stroke="#9A7D56" strokeWidth="0.5" />
                    <path d="M 35 39 C 35 53, 37 67, 50 75 C 63 67, 65 53, 65 39 Z" fill="#006A2E" />
                    
                    {/* Crossed Torch & Caduceus */}
                    <g transform="translate(50, 54) scale(0.65)">
                      {/* Flamming Torch */}
                      <path d="M 12 -18 C 15 -25, 10 -28, 13 -33 C 8 -29, 6 -24, 7 -21 C 9 -21, 11 -20, 12 -18 Z" fill="#FF4500" />
                      <line x1="-15" y1="15" x2="11" y2="-11" stroke="#F3E5AB" strokeWidth="2.5" strokeLinecap="round" />
                      <polygon points="6,-11 13,-18 11,-19 4,-12" fill="#F3E5AB" />
                      
                      {/* Caduceus */}
                      <g transform="rotate(-90)">
                        <line x1="-15" y1="15" x2="11" y2="-11" stroke="#F3E5AB" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="12" cy="-12" r="3" fill="#F3E5AB" />
                        {/* Wings on the rod */}
                        <path d="M 8 -16 C 11 -13, 14 -16, 14 -16 C 14 -16, 11 -19, 8 -16 Z" fill="#F3E5AB" />
                        <path d="M 16 -8 C 13 -11, 16 -14, 16 -14 C 16 -14, 19 -11, 16 -8 Z" fill="#F3E5AB" />
                        {/* Double Snakes winding */}
                        <path d="M -11 11 Q -6 9 -4 4 Q -2 0 -3 -4 Q -4 -8 0 -9 Q 4 -10 7 -6" stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        <path d="M -9 13 Q -11 7 -7 4 Q -4 1 -5 -4 Q -6 -9 -1 -10 Q 4 -11 6 -7" stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col items-start justify-center pl-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-bold text-lg md:text-xl tracking-tight text-[#FAF9F6]">САНАТОРИЙ</span>
                  <span className="font-serif font-bold text-[#c5a880] text-lg md:text-xl tracking-tight">«ЯСНАЯ ПОЛЯНА»</span>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center flex-grow mx-10 xl:mx-16 justify-between">
              {/* Dropdown for About Sanatorium */}
              <div 
                className="relative"
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-1 text-sm font-medium tracking-wide transition-colors relative py-2 cursor-pointer ${
                    activeSection === 'about' ? 'text-[#c5a880]' : 'text-stone-200 hover:text-[#c5a880]'
                  }`}
                >
                  <span>О санатории</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAboutDropdownOpen ? 'rotate-180 text-[#c5a880]' : 'opacity-70'}`} />
                  {activeSection === 'about' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
                <AnimatePresence>
                  {isAboutDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-1 w-56 bg-[#022C22] border border-[#c5a880]/30 rounded shadow-xl py-2 z-50 text-left font-sans text-stone-100"
                    >
                      <a
                        href="#about"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs hover:bg-[#034434] hover:text-[#c5a880] transition-colors"
                        onClick={() => {
                          setIsAboutDropdownOpen(false);
                          setCurrentPage('home');
                        }}
                      >
                        <Building2 className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                        <span>Основная информация</span>
                      </a>
                      <button
                        onClick={() => {
                          setCurrentPage('documents');
                          setIsAboutDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs hover:bg-[#034434] hover:text-[#c5a880] transition-colors text-left cursor-pointer text-stone-100"
                      >
                        <FileText className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                        <span>Официальные документы</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('news');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setIsAboutDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs hover:bg-[#034434] hover:text-[#c5a880] transition-colors text-left cursor-pointer text-stone-100"
                      >
                        <Newspaper className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                        <span>Новости санатория</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('services');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setIsAboutDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs hover:bg-[#034434] hover:text-[#c5a880] transition-colors text-left cursor-pointer text-stone-100"
                      >
                        <Compass className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                        <span className="font-semibold text-[#c5a880]">Услуги и Сервисы</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { id: 'services', label: 'Услуги', isPage: true },
                { id: 'medical', label: 'Лечение' },
                { id: 'rooms', label: 'Номера' },
                { id: 'gallery', label: 'Галерея' },
                { id: 'testimonials', label: 'Отзывы' },
                { id: 'contacts', label: 'Контакты' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={item.isPage ? '#' : `#${item.id}`}
                  onClick={() => {
                    if (item.isPage) {
                      setCurrentPage(item.id as any);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      setCurrentPage('home');
                    }
                  }}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                    (item.isPage ? currentPage === item.id : currentPage === 'home' && activeSection === item.id) ? 'text-[#c5a880]' : 'text-stone-200 hover:text-[#c5a880]'
                  }`}
                >
                  {item.label}
                  {(item.isPage ? currentPage === item.id : currentPage === 'home' && activeSection === item.id) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a880]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Action buttons Desktop */}
            <div className="hidden lg:flex items-center">
              <a href="tel:88005503240" className="flex items-center text-sm font-medium hover:text-[#c5a880] transition-colors py-1">
                <Phone className="w-4 h-4 mr-2 text-[#c5a880]" />
                <span>8 (800) 550-32-40</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-200 hover:text-[#c5a880] focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-[#022C22] border-t border-[#c5a880]/15 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile About Accordion */}
                <div>
                  <button
                    onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                    className="w-full flex items-center justify-between font-medium py-2 text-stone-200 border-b border-white/5 hover:text-[#c5a880] text-left cursor-pointer"
                  >
                    <span>О санатории</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180 text-[#c5a880]' : 'text-stone-305'}`} />
                  </button>
                  <AnimatePresence>
                    {isAboutDropdownOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 bg-emerald-950/40 rounded border-l-2 border-[#c5a880]/30 my-1 space-y-1 py-1"
                      >
                        <a
                          href="#about"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsAboutDropdownOpen(false);
                            setCurrentPage('home');
                          }}
                          className="block py-2 text-xs font-semibold text-stone-300 hover:text-white"
                        >
                          • Общее описание
                        </a>
                        <button
                          onClick={() => {
                            setCurrentPage('documents');
                            setIsMobileMenuOpen(false);
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left block py-2 text-xs font-semibold text-stone-300 hover:text-white cursor-pointer"
                        >
                          • Официальные документы
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage('news');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setIsMobileMenuOpen(false);
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left block py-2 text-xs font-semibold text-stone-300 hover:text-white cursor-pointer"
                        >
                          • Новости санатория
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage('services');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setIsMobileMenuOpen(false);
                            setIsAboutDropdownOpen(false);
                          }}
                          className="w-full text-left block py-2 text-xs font-semibold text-[#c5a880] hover:text-white cursor-pointer font-bold"
                        >
                          • Услуги и Сервисы
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {[
                  { id: 'services', label: 'Услуги и Сервисы', isPage: true },
                  { id: 'medical', label: 'Лечение' },
                  { id: 'rooms', label: 'Категории Номеров' },
                  { id: 'gallery', label: 'Галерея' },
                  { id: 'testimonials', label: 'Отзывы' },
                  { id: 'contacts', label: 'Контакты & FAQ' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={item.isPage ? '#' : `#${item.id}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item.isPage) {
                        setCurrentPage(item.id as any);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setCurrentPage('home');
                      }
                    }}
                    className="block font-medium py-2 text-stone-200 border-b border-white/5 hover:text-[#c5a880]"
                  >
                    {item.label}
                  </a>
                ))}
                
                <div className="pt-4 flex flex-col space-y-3">
                  <a href="tel:88005503240" className="flex items-center font-medium text-stone-200">
                    <Phone className="w-4.5 h-4.5 mr-3 text-[#c5a880]" />
                    8 (800) 550-32-40
                  </a>
                  <a
                    href="#booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center bg-[#c5a880] text-[#022C22] py-3 rounded-sm font-bold uppercase tracking-wider text-sm"
                  >
                    Забронировать путевку
                  </a>
                  <button
                    onClick={() => {
                      setIsAccessMode(!isAccessMode);
                      setIsMobileMenuOpen(false);
                      if (!isAccessMode && window.speechSynthesis) {
                        const welcome = new SpeechSynthesisUtterance("Включена версия для слабовидящих");
                        welcome.lang = "ru-RU";
                        window.speechSynthesis.speak(welcome);
                      }
                    }}
                    className="flex items-center justify-center space-x-2 border border-[#c5a880]/40 text-stone-200 py-3 rounded-sm font-bold text-sm w-full bg-emerald-950 hover:bg-emerald-900 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#c5a880]" />
                    <span>{isAccessMode ? 'Обычный вид сайта' : 'Версия для слабовидящих'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-grow w-full flex flex-col"
        >
          {currentPage === 'documents' ? (
            <DocumentsPage onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          ) : currentPage === 'news' ? (
            <NewsPage onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          ) : currentPage === 'medical' ? (
            <MedicalPage onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          ) : currentPage === 'services' ? (
            <ServicesPage onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          ) : currentPage === 'admin' ? (
            <AdminPage onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          ) : currentPage === 'testimonials' ? (
            <TestimonialsPage onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          ) : (
            <>
          {/* HERO / WELCOME ATRIUM */}
          <header id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#022C22]">
        
        {/* Dynamic Background (Switchable Video/Image loops) */}
        <motion.div className="absolute inset-0 z-0 bg-[#022C22]" style={{ y: yBg }}>
          <AnimatePresence mode="wait">
            {slides[activeSlideIndex] && (
              <motion.div 
                key={`slide-${activeSlideIndex}-${slides[activeSlideIndex]?.url}`}
                className="absolute inset-0 w-full h-full overflow-hidden brightness-[1.15]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.65 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0 }}
              >
                {slides[activeSlideIndex]?.type === 'video' ? (
                  <video
                    src={slides[activeSlideIndex]?.url}
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="auto"
                    poster="/src/assets/images/pestovo_palace_1779780890544.png"
                    className="w-full h-full object-cover object-center scale-105"
                    onEnded={() => {
                      setActiveSlideIndex(prev => (prev + 1) % slides.length);
                    }}
                    onError={() => {
                      console.warn("Video background failed to load, displaying poster fallback.");
                    }}
                  />
                ) : (
                  <img
                    src={slides[activeSlideIndex]?.url}
                    alt="Санаторий Ясная Поляна ФТС России"
                    className="w-full h-full object-cover object-center scale-105"
                    referrerPolicy="no-referrer"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Elegant geometric gradients imitating sunlight through pines */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22] via-[#022C22]/60 to-transparent z-1"></div>
          <div className="absolute inset-l-0 inset-r-0 bottom-0 h-48 bg-gradient-to-t from-[#FAF9F6] to-transparent z-2"></div>
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white flex flex-col items-center"
          style={{ y: yHeroText, opacity: opacityHeroText }}
        >
          
          {isAdminMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4"
            >
              <button 
                onClick={() => { setActiveSettingsTab('hero'); setCurrentPage('admin'); }}
                className="bg-amber-500 hover:bg-amber-600 font-bold text-stone-900 border border-amber-300 text-xs px-4 py-2 rounded-full cursor-pointer shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105"
              >
                <Edit className="w-4 h-4" /> Редактировать первый экран
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-emerald-900/80 backdrop-blur-md border border-[#c5a880]/30 px-4 py-2 rounded-full mb-6"
          >
            <TreePine className="w-4 h-4 text-[#c5a880]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FAF9F6]">{HERO_DATA.badge}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif leading-none max-w-5xl text-center"
          >
            {(() => {
              const text = HERO_DATA.titleFirstPart || 'САНАТОРИЙ «ЯСНАЯ ПОЛЯНА»';
              if (text.toUpperCase().includes('САНАТОРИЙ') && (text.toUpperCase().includes('ЯСНАЯ ПОЛЯНА') || text.toUpperCase().includes('«ЯСНАЯ ПОЛЯНА»'))) {
                return (
                  <>
                    <span className="block text-stone-300 font-sans font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] uppercase opacity-90 mb-2 sm:mb-3">
                      САНАТОРИЙ
                    </span>
                    <span className="block text-white font-serif font-black tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-md leading-tight">
                      «ЯСНАЯ ПОЛЯНА»
                    </span>
                  </>
                );
              }
              return (
                <span className="block text-white font-serif font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  {text}
                </span>
              );
            })()}
            <span className="italic text-[#c5a880] font-normal font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl block mt-4 sm:mt-5 tracking-wide">
              {HERO_DATA.titleSecondPart}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-sm sm:text-lg md:text-xl text-stone-200 font-sans max-w-3xl leading-relaxed"
          >
            {HERO_DATA.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="#about"
              className="w-full sm:w-auto bg-[#c5a880] hover:bg-[#bca075] text-[#022C22] px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-widest text-center transition-all duration-300 shadow-xl hover:-translate-y-0.5"
            >
              Узнать о санатории
            </a>
          </motion.div>

          {/* Quick Stats Grid */}
          {HERO_DATA.stats && HERO_DATA.stats.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-20 w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-[#022C22]/80 backdrop-blur-md p-6 sm:p-8 rounded-sm border border-[#c5a880]/20 shadow-2xl"
            >
              {HERO_DATA.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="text-center border-r border-white/10 last:border-r-0 pe-2"
                >
                  <span className="block font-serif text-3xl sm:text-4xl font-semibold text-[#c5a880]">{stat.value}</span>
                  <span className="block text-stone-300 text-[11px] tracking-wider uppercase font-mono mt-2 leading-none">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          )}

        </motion.div>
      </header>

      {/* ABOUT & MICROCLIMATE INTERACTIVE EXPERIENCE */}
      <section id="about" className="py-24 bg-[#FAF9F6]">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual presentation and Arboretum description */}
            <div className="lg:col-span-7 space-y-6">
              {isAdminMode && (
                <div className="mb-2">
                  <button 
                    onClick={() => { setActiveSettingsTab('general'); setCurrentPage('admin'); }}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-300 font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow hover:scale-105"
                  >
                    <Edit className="w-3.5 h-3.5" /> Редактировать инфо и историю
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="h-[1px] w-8 bg-[#c5a880]"></span>
                <span className="text-[11px] tracking-widest font-mono uppercase text-[#c5a880] font-bold">Оазис Здоровья в Гаспре</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#022C22] tracking-tight">
                Уникальный парк-арборетум <br/>
                <span className="italic text-[#c5a880] font-normal font-serif">и целебный климат</span>
              </h2>
              <div className="text-stone-700 space-y-4 text-base md:text-lg leading-relaxed">
                <p>{RESORT_INFO.historyText}</p>
                <p>{RESORT_INFO.climatotherapyText}</p>
              </div>

              {/* Grid of details with icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-sm border-l-4 border-[#022C22] shadow-sm">
                  <div className="bg-[#FAF9F6] p-2 rounded-sm text-[#c5a880]">
                    <Clock className="w-5 h-5 text-[#c5a880]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#022C22]">Отдых 365 дней</h4>
                    <p className="text-xs text-stone-500 mt-1">Климатотерапия эффективна круглосуточно в любой сезон.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-sm border-l-4 border-[#c5a880] shadow-sm">
                  <div className="bg-[#FAF9F6] p-2 rounded-sm text-[#c5a880]">
                    <Compass className="w-5 h-5 text-[#c5a880]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#022C22]">Лифт к морю</h4>
                    <p className="text-xs text-stone-500 mt-1">Комфортный спуск в скале к собственному мелкогалечному пляжу.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE CLIMATE WIDGET */}
            <div className="lg:col-span-5 h-full">
              
              {/* Фито-Барометр & Метео-Станция */}
              <div className="bg-[#022C22] text-white p-5 sm:p-6 rounded-sm shadow-2xl relative overflow-hidden border border-[#c5a880]/30 h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-950/45 rounded-full filter blur-2xl"></div>
                
                <div className="relative z-10 space-y-4 flex-grow flex flex-col justify-between">
                  
                  {/* Header Row */}
                  <div className="flex justify-between items-center border-b border-[#c5a880]/25 pb-3.5">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-white">Фито-Барометр & Погода</h3>
                      <p className="text-[10px] text-[#c5a880] font-mono tracking-widest uppercase mt-0.5">Климатотерапия • Гаспра Live</p>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-full text-[10px] text-emerald-300 font-medium font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>LIVE</span>
                    </div>
                  </div>

                  {/* Loading & Error or Loaded content */}
                  {weatherLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-3">
                      <div className="w-7 h-7 rounded-full border-2 border-[#c5a880] border-t-transparent animate-spin"></div>
                      <span className="text-stone-300 text-xs font-mono">Синхронизация...</span>
                    </div>
                  ) : weatherError || !realWeather ? (
                    <div className="py-12 text-center text-sm text-stone-300 space-y-2 bg-emerald-950/40 rounded-sm border border-emerald-900">
                      <p className="font-serif font-semibold text-[#c5a880]">Связь с метеостанцией ограничена</p>
                      <p className="text-xs text-stone-400">Погода в Гаспре: +22°C, море: +19°C</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      {/* Big Weather Panel */}
                      <div className="bg-emerald-950/50 p-4 rounded-sm border border-emerald-900/40 min-h-[110px] flex items-center justify-between relative overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={climateTime}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="flex items-center justify-between w-full"
                          >
                            <div className="flex items-center space-x-3.5">
                              <div className="bg-emerald-950/60 p-2.5 rounded border border-[#c5a880]/20">
                                {getWeatherIcon(climateTime === 'day' ? 0 : climateTime === 'morning' ? 1 : 2, "w-11 h-11")}
                              </div>
                              <div>
                                <span className="text-[9px] text-[#c5a880] uppercase tracking-widest font-mono block">
                                  {climateTime === 'morning' ? 'Утро на курорте' : climateTime === 'day' ? 'День на курорте' : 'Вечер на курорте'}
                                </span>
                                <div className="text-3xl font-serif font-extrabold text-[#FAF9F6] leading-none mt-1">
                                  {climateDetails[climateTime].temp}
                                </div>
                                <span className="text-xs text-stone-300 font-sans font-semibold block mt-1.5">
                                  {climateTime === 'morning' ? 'Ясно, свежий ветерок' : climateTime === 'day' ? 'Преимущественно ясно' : 'Малооблачно, штиль'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right space-y-0.5 max-w-[150px] hidden sm:block">
                              <span className="text-[9px] text-[#c5a880] uppercase tracking-wider font-mono block mb-1">Показание климата</span>
                              <div className="text-[10px] sm:text-xs font-serif italic text-stone-200 leading-tight">
                                "{climateDetails[climateTime].recommendation}"
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Extended Live Parameters (Sleek 3-Column Layout with Black Sea Temperature) */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-950/30 p-2.5 rounded-sm border border-emerald-900/35 flex flex-col justify-between overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider font-mono text-stone-400 block mb-1">Ветер в Гаспре</span>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={climateTime}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center space-x-1"
                            >
                              <Wind className="w-4 h-4 text-[#c5a880] shrink-0" />
                              <span className="text-xs font-extrabold text-[#FAF9F6] font-mono">
                                {climateTime === 'morning' ? '3.2' : climateTime === 'day' ? '4.5' : '1.8'} м/с
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <div className="bg-emerald-950/30 p-2.5 rounded-sm border border-emerald-900/35 flex flex-col justify-between overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider font-mono text-stone-400 block mb-1">Влажность</span>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={climateTime}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center space-x-1"
                            >
                              <Droplet className="w-4 h-4 text-[#c5a880] shrink-0" />
                              <span className="text-xs font-extrabold text-[#FAF9F6] font-mono">
                                {climateDetails[climateTime].humidity}
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <div className="bg-emerald-920/10 hover:bg-[#023a2d]/40 transition bg-emerald-950/20 p-2.5 rounded-sm border border-[#c5a880]/20 flex flex-col justify-between overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider font-mono text-emerald-300 block mb-1">Черное море t°</span>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={climateTime}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center space-x-1"
                            >
                              <Waves className="w-4 h-4 text-[#c5a880] shrink-0" />
                              <span className="text-xs font-extrabold text-white font-mono">
                                {climateDetails[climateTime].seaTemp}
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Therapeutic Climate details (Time of day indicator) */}
                      <div className="bg-emerald-950/70 p-4 rounded-sm border border-[#c5a880]/15 space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-serif font-bold text-[#c5a880] block">Аэроионы и фитонциды</span>
                            <span className="text-[9px] text-stone-400 font-mono uppercase mt-0.5 block">Биоклим. фактор суток:</span>
                          </div>
                          <div className="flex space-x-1 bg-emerald-900/30 p-0.5 rounded border border-emerald-800 font-mono">
                            {(['morning', 'day', 'evening'] as const).map((t) => (
                              <button
                                key={t}
                                onClick={() => setClimateTime(t)}
                                className={`px-2 py-0.5 text-[9px] font-bold rounded-sm transition-all uppercase tracking-wider ${
                                  climateTime === t 
                                    ? 'bg-[#c5a880] text-[#022C22]' 
                                    : 'hover:bg-emerald-900/35 text-stone-300'
                                }`}
                              >
                                {t === 'morning' ? 'Утро' : t === 'day' ? 'День' : 'Веч'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Animated bars and metrics */}
                        <div className="space-y-2 pt-0.5">
                          <div className="space-y-0.5">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-stone-300">Фитонциды хвои (кипарис, кедр):</span>
                              <span className="font-semibold text-emerald-300 font-mono text-[10px] bg-emerald-950/90 px-1.5 py-0.2 rounded">{climateDetails[climateTime].phytoncides}</span>
                            </div>
                            <div className="h-1 bg-emerald-900 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: '50%' }}
                                animate={{ width: climateTime === 'day' ? '100%' : climateTime === 'morning' ? '85%' : '65%' }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-[#c5a880]"
                              ></motion.div>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-stone-300">Фитоаэрозоли морской соли:</span>
                              <span className="font-semibold text-[#c5a880] font-mono text-[10px] bg-emerald-950/90 px-1.5 py-0.2 rounded">{climateDetails[climateTime].aerosols}</span>
                            </div>
                            <div className="h-1 bg-emerald-900 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: '40%' }}
                                animate={{ width: climateTime === 'morning' ? '95%' : climateTime === 'day' ? '70%' : '50%' }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-[#c5a880] to-emerald-400"
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3 Days Forecast Grid */}
                      <div className="border-t border-[#c5a880]/15 pt-3">
                        <span className="block text-[9px] uppercase tracking-widest font-mono text-stone-300 mb-2 font-semibold">Прогноз на 3 дня (Гаспра, Крым):</span>
                        <div className="grid grid-cols-3 gap-2.5">
                          {realWeather.forecast.map((f, index) => (
                            <div 
                              key={index} 
                              className="bg-emerald-950/45 hover:bg-emerald-950/80 hover:border-[#c5a880]/20 transition-all p-2.5 rounded-sm border border-emerald-900/80 text-center flex flex-col justify-between space-y-1"
                            >
                              <span className="block text-[10px] font-bold text-stone-300 leading-none">{formatForecastDate(f.date)}</span>
                              <div className="my-1 flex justify-center">
                                {getWeatherIcon(f.weatherCode, "w-6 h-6")}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center justify-center space-x-1 text-xs">
                                  <span className="font-bold text-white">{f.tempMax}°</span>
                                  <span className="text-stone-400 text-[10px]">/ {f.tempMin}°</span>
                                </div>
                                <span className="block text-[8px] text-[#c5a880] truncate font-medium">
                                  {getWeatherName(f.weatherCode)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>

          {/* OFFICIAL DETAILED INFORMATION REGISTRY */}
          <div className="mt-20 border-t border-stone-200/80 pt-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div className="max-w-3xl">
                <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">Официальный реестр и медицинская лицензия</span>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#022C22] tracking-tight mt-1">
                  Общие данные и медицинская специализация санатория
                </h3>
                <p className="text-stone-500 text-sm mt-3 leading-relaxed">
                  Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» ФТС России». Полная ведомственная и нормативная информация с официального реестра учреждения.
                </p>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-stone-500 font-mono bg-stone-100 px-3 py-1.5 rounded border border-stone-250/20">
                <Shield className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                <span>Лицензия № Л041-00110-91/00554225</span>
              </div>
            </div>

            {/* Tab switch bar */}
            <div className="flex flex-wrap border-b border-stone-200 mb-6 gap-1">
              {[
                { id: 'general', label: 'Общие сведения', icon: Building2 },
                { id: 'medical', label: 'Медицинский профиль', icon: Activity },
                { id: 'treatment', label: 'Методы лечения и структура', icon: FileText },
                { id: 'registry', label: 'Контакты и гос. регистрация', icon: UserCheck }
              ].map((t) => {
                const IconComp = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setAboutTab(t.id as any);
                      if (isAccessMode && accessSpeech && window.speechSynthesis) {
                        const switchVoice = new SpeechSynthesisUtterance(`Открыта вкладка ${t.label}`);
                        switchVoice.lang = 'ru-RU';
                        window.speechSynthesis.speak(switchVoice);
                      }
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
                      aboutTab === t.id 
                        ? 'border-[#022C22] text-[#022C22] font-bold bg-[#022C22]/5 rounded-t' 
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Cards */}
            <div className="bg-white rounded-sm border border-stone-200 shadow-md p-6 md:p-8">
              <AnimatePresence mode="wait">
                {aboutTab === 'general' && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-stone-700 font-sans"
                  >
                    <div className="space-y-4">
                      <div>
                        <span className="block text-xs uppercase tracking-widest font-mono text-stone-400">Полное наименование организации</span>
                        <p className="font-serif text-base sm:text-lg text-[#022C22] font-semibold mt-1 leading-snug">
                          Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» ФТС России»
                        </p>
                      </div>

                      <div>
                        <span className="block text-xs uppercase tracking-widest font-mono text-stone-400">Сокращенное наименование</span>
                        <p className="font-semibold text-stone-800 mt-1">Санаторий «Ясная Поляна» ФТС России</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <span className="block text-xs uppercase tracking-widest font-mono text-stone-400">ИНН</span>
                          <p className="font-mono text-stone-900 font-bold mt-0.5">7713778678</p>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-widest font-mono text-stone-400">КПП</span>
                          <p className="font-mono text-stone-900 font-bold mt-0.5">910301001</p>
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs uppercase tracking-widest font-mono text-stone-400">Организационно-правовая форма (ОПФ)</span>
                        <p className="text-stone-800 mt-1">Федеральные государственные казенные учреждения</p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-stone-200/80 md:pl-8 pt-4 md:pt-0">
                      <div>
                        <span className="block text-xs uppercase tracking-widest font-mono text-stone-400">Юридический, фактический & почтовый адрес</span>
                        <p className="text-stone-800 font-medium mt-1">
                          298660, Крым Респ, г Ялта, пгт Гаспра, ш Севастопольское, д. 52
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="block text-xs uppercase tracking-widest font-mono text-stone-400">Характеристики санатория</span>
                        <ul className="mt-1.5 space-y-2">
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] flex-shrink-0"></span>
                            <span><strong>Курортная зона:</strong> Ялта (Южный берег Крыма)</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] flex-shrink-0"></span>
                            <span><strong>Медицинская помощь:</strong> Санаторно-курортное лечение</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] flex-shrink-0"></span>
                            <span><strong>Тип организации:</strong> Санаторий для взрослых</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] flex-shrink-0"></span>
                            <span><strong>Ведомственная принадлежность:</strong> Федеральная таможенная служба (ФТС РФ)</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] flex-shrink-0"></span>
                            <span><strong>Форма собственности:</strong> Федеральная собственность</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {aboutTab === 'medical' && (
                  <motion.div
                    key="medical"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 text-sm text-stone-700 font-sans"
                  >
                    {/* License Details Header */}
                    <div className="bg-emerald-950/[0.03] p-5 rounded-xl border border-[#c5a880]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-2 text-[#c5a880] text-[10px] font-mono uppercase tracking-widest font-bold">
                          <Award className="w-3.5 h-3.5" />
                          <span>Государственный Медицинский Стандарт</span>
                        </div>
                        <h4 className="font-serif text-xl font-extrabold text-[#022C22] mt-1">Лицензия № Л041-00110-91/00554225</h4>
                        <p className="text-stone-500 text-xs mt-1">
                          Выдана лицензирующим органом на осуществление высокотехнологичного санаторно-курортного лечения.
                        </p>
                      </div>
                      <div className="flex flex-col text-right font-mono text-xs text-[#022C22] bg-white border border-stone-200 shadow-sm p-3 rounded-lg md:self-center shrink-0">
                        <div><span className="text-stone-400">Дата выдачи:</span> <strong>2022-06-22</strong></div>
                        <div className="border-t border-stone-100 mt-1 pt-1"><span className="text-stone-400">Срок действия:</span> <strong className="text-emerald-700">Бессрочно</strong></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                      {/* Left: Specializations */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-3">
                          <h5 className="font-serif text-base font-bold text-[#022C22] border-b border-stone-200 pb-2 flex items-center space-x-2">
                            <Stethoscope className="w-4 h-4 text-[#c5a880]" />
                            <span>Разрешенная профессиональная специализация:</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                            {[
                              { name: 'диетология', desc: 'Терапевтическое и лечебное питание' },
                              { name: 'лечебная физкультура', desc: 'Индивидуальные программы ЛФК' },
                              { name: 'медицинский массаж', desc: 'Профессиональный ручной массаж' },
                              { name: 'организация здравоохранения', desc: 'Высшие ведомственные стандарты ФТС' },
                              { name: 'сестринское дело', desc: 'Круглосуточный квалифицированный уход' },
                              { name: 'терапия', desc: 'Индивидуальное ведение лечащим врачом' },
                              { name: 'физиотерапия', desc: 'Полный комплекс аппаратного лечения' },
                              { name: 'функциональная диагностика', desc: 'ЭКГ и спирометрия на месте' }
                            ].map((item, id) => (
                              <div key={id} className="bg-stone-50 hover:bg-stone-100/50 border border-stone-200/60 p-2.5 rounded-lg transition-all">
                                <span className="font-bold text-[13px] text-[#022C22] block capitalize">{item.name}</span>
                                <span className="text-[11px] text-stone-500 block">{item.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Diagnostics & Labs */}
                        <div className="pt-2 space-y-3">
                          <h5 className="font-serif text-base font-bold text-[#022C22] border-b border-stone-200 pb-2 flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-[#c5a880]" />
                            <span>Медицинская диагностика и клиническая лаборатория:</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                              <h6 className="font-serif text-xs font-bold text-[#022C22] uppercase tracking-wider font-mono">Лабораторная база</h6>
                              <p className="text-stone-600 mt-1 text-xs leading-relaxed">
                                • Биохимические исследования крови и мочи<br />
                                • Общеклинические исследования на высокоточном оборудовании
                              </p>
                            </div>
                            <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                              <h6 className="font-serif text-xs font-bold text-[#022C22] uppercase tracking-wider font-mono">Функциональная диагностика</h6>
                              <p className="text-stone-600 mt-1 text-xs leading-relaxed">
                                • Спирография (диагностика функции дыхания)<br />
                                • Электрокардиография (ЭКГ-исследования сердца)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Pathologies & Basic Illness Profiles */}
                      <div className="lg:col-span-6 bg-[#022C22]/[0.02] p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                        <h5 className="font-serif text-lg font-bold text-[#022C22] flex items-center space-x-2 border-b border-stone-200 pb-2 select-none">
                          <Shield className="w-5 h-5 text-[#c5a880]" />
                          <span>Медицинские показания (Лечебные профили)</span>
                        </h5>
                        
                        <div className="space-y-4 divide-y divide-stone-200/50 text-xs text-stone-700">
                          <div className="pt-0 pb-2">
                            <span className="inline-block bg-red-50 text-red-800 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1">Рекомендовано</span>
                            <strong className="block text-stone-850 font-bold text-sm text-[#022C22] mb-1">Болезни системы кровообращения:</strong>
                            <p className="leading-relaxed text-stone-600">
                              Болезни, характеризующиеся повышенным кровяным давлением; Гипертензивная болезнь сердца [гипертоническая болезнь с преимущественным поражением сердца]; Гипертензивная [гипертоническая] болезнь с преимущественным поражением сердца с застойной сердечной недостаточностью.
                            </p>
                          </div>

                          <div className="pt-3 pb-2">
                            <span className="inline-block bg-sky-50 text-sky-800 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1">Рекомендовано</span>
                            <strong className="block text-stone-850 font-bold text-sm text-[#022C22] mb-1">Болезни органов дыхания:</strong>
                            <p className="leading-relaxed text-stone-600">
                              Хронические болезни нижних дыхательных путей; Хронический бронхит неуточненный; Оздоровление после респираторных вирусных заболеваний.
                            </p>
                          </div>

                          <div className="pt-3">
                            <span className="inline-block bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1">Рекомендовано</span>
                            <strong className="block text-stone-850 font-bold text-sm text-[#022C22] mb-1">Болезни костно-мышечной системы и суставов:</strong>
                            <p className="leading-relaxed text-stone-600">
                              Артрозы; Коксартроз [артроз тазобедренного сустава] (первичный, двусторонний); Гонартроз [артроз коленного сустава] (первичный коленного сустава, двусторонний); Другие виды артрозов; Артроз неуточненный.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {aboutTab === 'treatment' && (
                  <motion.div
                    key="treatment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-sm text-stone-700 font-sans"
                  >
                    {/* Treatment list */}
                    <div className="lg:col-span-8 space-y-6">
                      <div>
                        <h4 className="font-serif text-xl font-bold text-[#022C22] flex items-center">
                          <Stethoscope className="w-5 h-5 text-[#c5a880] mr-2" />
                          Применяемые высокотехнологичные методы лечения
                        </h4>
                        <p className="text-xs text-stone-500 mt-1">
                          Комплексный перечень терапевтических процедур, проводимых квалифицированными специалистами на современном лицензированном оборудовании.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          {
                            category: 'Аппаратная электро- и магнитотерапия',
                            items: [
                              { name: 'Электромагнитное воздействие', desc: 'Воздействие электромагнитным лечебным полем на органы и ткани.' },
                              { name: 'Электрофорез лекарственных средств', desc: 'Чрескожное введение медицинских препаратов с помощью токов по органам и системам.' },
                              { name: 'УВЧ-терапия (э.п. УВЧ)', desc: 'Воздействие электрическим полем ультравысокой частоты для снятия воспалений.' },
                              { name: 'Магнитотерапия', desc: 'Регенерация и улучшение трофики тканей благодаря импульсным магнитным полям.' },
                              { name: 'СМТ-терапия', desc: 'Амплипульстерапия синусоидальными модулированными токами для стимуляции.' }
                            ]
                          },
                          {
                            category: 'Светолечение & Стимуляция',
                            items: [
                              { name: 'Лучевое лечение', desc: 'Различные методики светового, ультрафиолетового, звукового и лазерного воздействия.' },
                              { name: 'Лазеротерапия', desc: 'Воздействие низкоинтенсивным лазерным излучением для активации обмена веществ.' },
                              { name: 'Ультразвуковая терапия', desc: 'Микрозональное массажное действие на ткани с помощью звуковых колебаний.' },
                              { name: 'Инфракрасное (ИК) излучение', desc: 'Глубокий тепловой прогрев суставов и мышечной системы человека.' }
                            ]
                          },
                          {
                            category: 'Бальнеология & Массаж',
                            items: [
                              { name: 'Подводный душ-массаж', desc: 'Интенсивный массаж струей воды под давлением в гидромассажной ванне.' },
                              { name: 'Аромаванны лечебные', desc: 'Расслабляющие ванны с хвойными, солевыми и ароматными эссенциями.' },
                              { name: 'Медицинский и сегментарный массаж', desc: 'Прогрессивное ручное разминание мышц при различных заболеваниях.' },
                              { name: 'Лечебная физкультура (ЛФК)', desc: 'Дозированные физические упражнения в залах кинезотерапии под наблюдением врача.' }
                            ]
                          },
                          {
                            category: 'Климатотерапия & Оксигенация',
                            items: [
                              { name: 'Климатотерапия', desc: 'Лечение климатическими и целебными природными факторами ЮБК.' },
                              { name: 'Воздействие климатом', desc: 'Аэротерапия, гелиотерапия и прогулки в парковой реликтовой зоне.' },
                              { name: 'Терренкур (лечебная ходьба)', desc: 'Дозированное террентное лечение по специально проложенным маршрутам.' },
                              { name: 'Ингаляционная терапия', desc: 'Ингаляторное введение противовоспалительных лекарств и растворов.' },
                              { name: 'Кислородная терапия', desc: 'Введение чистого медицинского кислорода для компенсации гипоксии.' }
                            ]
                          }
                        ].map((cat, groupIdx) => (
                          <div key={groupIdx} className="bg-stone-50 border border-stone-200/85 p-4 rounded-xl space-y-3 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center space-x-2 border-b border-stone-200/60 pb-2">
                              <span className={`w-2 h-2 rounded-full ${
                                groupIdx === 0 ? 'bg-emerald-600' :
                                groupIdx === 1 ? 'bg-amber-500' :
                                groupIdx === 2 ? 'bg-blue-500' : 'bg-teal-600'
                              }`} />
                              <h5 className="font-serif text-xs font-bold text-[#022C22] tracking-wide uppercase">{cat.category}</h5>
                            </div>
                            <div className="space-y-3">
                              {cat.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="group/item">
                                  <div className="flex items-start space-x-1.5">
                                    <Check className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 shrink-0" />
                                    <div>
                                      <span className="text-[12px] font-bold text-stone-850 block leading-tight text-[#022C22]">{item.name}</span>
                                      <span className="text-[10px] text-stone-500 block leading-normal mt-0.5">{item.desc}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Structure / Chambers */}
                    <div className="lg:col-span-4 bg-[#022C22]/[0.02] p-5 rounded-xl border border-stone-200/85 space-y-4">
                      <h4 className="font-serif text-base font-bold text-[#022C22] border-b border-stone-200 pb-2 flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-[#c5a880]" />
                        <span>Структура медицинских кабинетов</span>
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Внутреннее устройство лечебно-диагностического подразделения Санатория:
                      </p>
                      
                      <div className="space-y-1.5 text-xs font-semibold text-stone-700">
                        {[
                          'Кабинет функциональной диагностики',
                          'Отделение аппаратной физиотерапии',
                          'Отделение водолечения (бальнеотерапия)',
                          'Специализированный зал ЛФК',
                          'Кабинеты медицинского массажа',
                          'Ингаляторий и кислородный пункт',
                          'Изолятор и процедурные кабинеты',
                          'Клинико-диагностическая лаборатория',
                          'Комната дежурного медицинского персонала'
                        ].map((cab, idx) => (
                          <div key={idx} className="flex items-center space-x-2 bg-white p-2 border border-stone-200/80 rounded-lg shadow-sm hover:border-[#c5a880]/30 transition-all">
                            <Check className="w-3.5 h-3.5 text-[#022C22] flex-shrink-0" />
                            <span className="font-sans text-stone-750 font-medium">{cab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {aboutTab === 'registry' && (
                  <motion.div
                    key="registry"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-stone-700 font-sans"
                  >
                    {/* Management and Contacts */}
                    <div className="space-y-4 bg-stone-50 p-5 rounded border border-stone-200/90 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#022C22] border-b pb-1.5 flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-[#c5a880]" />
                          <span>Начальник & Руководство</span>
                        </h4>
                        <div className="space-y-3 text-xs mt-3">
                          <div>
                            <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Руководитель (ФИО)</span>
                            <strong className="block text-sm text-stone-800 mt-0.5">{RESORT_INFO.directorName || 'Данилив Алексей Иванович'}</strong>
                            <span className="text-[#c5a880] font-bold uppercase text-[9px] font-mono tracking-widest mt-0.5 block">{RESORT_INFO.directorRole || 'исполняющий обязанности начальника санатория'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-200/50 mt-4 space-y-1">
                        <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Приемная и связь</span>
                        <div className="space-y-1 bg-white p-2 rounded justify-between border border-stone-200 text-xs">
                          <p className="flex justify-between">
                            <span className="text-stone-500">Телефон:</span>
                            <a href="tel:+73654239376" className="font-mono font-bold text-stone-900 hover:text-[#c5a880] transition-all">+7(3654)23-93-76</a>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-stone-500">Факс:</span>
                            <span className="font-mono text-stone-800">+73654239376</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-stone-500">Email:</span>
                            <a href="mailto:priemnaya.yasnayapolyana@yandex.ru" className="font-mono font-bold text-[#022C22] hover:text-[#c5a880] hover:underline">priemnaya.yasnayapolyana@yandex.ru</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Registry details */}
                    <div className="space-y-4 bg-stone-100/50 p-5 rounded border border-stone-200/90 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#022C22] border-b pb-1.5 flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#c5a880]" />
                          <span>Гос. регистрация</span>
                        </h4>
                        <div className="space-y-3.5 text-xs mt-3">
                          <div>
                            <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Наименование регоргана</span>
                            <p className="font-medium text-stone-850 mt-0.5">Межрайонная инспекция Федеральной налоговой службы №46 по г. Москве</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-stone-200/60 pt-3 flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
                        <div>
                          <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Серия</span>
                          <span className="font-mono font-extrabold text-stone-900">77</span>
                        </div>
                        <div>
                          <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Номер свидетельства</span>
                          <span className="font-mono font-extrabold text-stone-900">015463944</span>
                        </div>
                        <div>
                          <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Дата регистрации</span>
                          <span className="font-mono font-semibold text-stone-800">2013-10-29</span>
                        </div>
                      </div>
                    </div>

                    {/* Creation foundation */}
                    <div className="space-y-4 bg-stone-100/50 p-5 rounded border border-stone-200/90 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#022C22] border-b pb-1.5 flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-[#c5a880]" />
                          <span>Создание учреждения</span>
                        </h4>
                        <div className="space-y-3 text-xs mt-3 leading-relaxed">
                          <div>
                            <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Основание</span>
                            <p className="text-stone-750 font-medium">Наименование документа: ЕГРЮЛ</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-stone-200/60 pt-3 flex flex-wrap gap-4 mt-4 text-xs">
                        <div>
                          <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Дата создания</span>
                          <p className="font-semibold text-stone-800">2013-10-29</p>
                        </div>
                        <div>
                          <span className="block text-stone-400 font-mono text-[9px] uppercase tracking-wider">Номер ОГРН</span>
                          <strong className="font-mono text-[#022C22]">5137746004787</strong>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      </section>

      {/* DETAILED INTERACTIVE MEDICAL PROGRAMS */}
      <section id="medical" className="py-20 bg-[#022C22] text-white">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            {isAdminMode && (
              <div className="mb-4">
                <button 
                  onClick={() => { setActiveSettingsTab('medical'); setCurrentPage('admin'); }}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-all shadow hover:scale-105"
                >
                  <Edit className="w-3.5 h-3.5" /> Управление программами лечения
                </button>
              </div>
            )}
            <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">Высокие стандарты ведомственного оздоровления</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3">
              Лечебная база и оздоровление
            </h2>
            <div className="h-1 w-20 bg-[#c5a880] mx-auto mt-6"></div>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mt-4">
              Санаторий «Ясная Поляна» имеет высшую медицинскую категорию и предлагает комплексные программы оздоровления с использованием современного оборудования и целительных природных факторов.
            </p>
          </div>

          {/* Compact 4-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEDICAL_PROGRAMS.map((prog, index) => (
              <motion.div 
                key={prog.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  setCurrentPage('medical');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-emerald-950/45 border border-emerald-900/60 p-6 rounded-xl hover:border-[#c5a880]/50 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#c5a880]/10 block cursor-pointer group flex flex-col justify-between h-full hover:bg-emerald-950"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/40 flex items-center justify-center mb-4 text-[#c5a880] border border-emerald-800/20 group-hover:bg-[#c5a880] group-hover:text-[#022C22] transition-colors duration-300">
                    {getMedicalIcon(prog.icon)}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2 leading-tight group-hover:text-[#c5a880] transition-colors">
                    {prog.title}
                  </h3>
                  <span className="inline-block font-mono text-[10px] uppercase text-[#c5a880] tracking-wider mb-3">
                    Срок: {prog.duration}
                  </span>
                  <p className="text-stone-300 text-xs leading-relaxed line-clamp-3">
                    {prog.shortDesc}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center space-x-1.5 text-xs text-[#c5a880] font-bold uppercase tracking-wider border-b border-transparent group-hover:border-[#c5a880] w-max pb-0.5 transition-all">
                  <span>Подробнее</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button 
              onClick={() => {
                setCurrentPage('medical');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#c5a880] text-[#022C22] hover:bg-white hover:text-[#022C22] border border-[#c5a880] px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-xl hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Все программы и процедуры в деталях</span>
            </button>
          </div>

        </motion.div>
      </section>

      {/* EXQUISITE ROOMS GALLERY */}
      <section id="rooms" className="py-24 bg-[#FAF9F6]">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              {isAdminMode && (
                <div className="mb-4">
                  <button 
                    onClick={() => { setActiveSettingsTab('rooms'); setCurrentPage('admin'); }}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow hover:scale-105"
                  >
                    <Edit className="w-3.5 h-3.5" /> Управление номерами
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="h-[1px] w-8 bg-[#c5a880]"></span>
                <span className="text-[11px] tracking-widest font-mono uppercase text-[#c5a880] font-bold">Отражение крымского комфорта</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3 text-[#022C22]">
                Уютные видовые номера
              </h2>
            </div>
            <p className="text-stone-600 text-sm md:text-base max-w-md mt-4 md:mt-0 leading-relaxed">
              Все жилые номера санатория оборудованы кондиционерами, современными санузлами и балконами с потрясающим видом на Черное море или вечнозеленый реликтовый парк.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-center">
            {ROOMS.map((room, index) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-sm border border-stone-200/60 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group justify-between"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden h-56 shrink-0 border-b border-stone-100">
                  <img
                    src={room.image || undefined}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#022C22] border border-[#c5a880]/30 text-white font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm">
                    {room.area} м²
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="block text-[11px] font-mono tracking-widest text-stone-200 uppercase leading-none">{room.category}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#022C22] mb-2 leading-snug group-hover:text-[#c5a880] transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {room.description}
                    </p>

                    {/* Short highlights */}
                    <div className="space-y-1.5 border-t border-b border-stone-100 py-3 mb-4 text-xs text-stone-700">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Вид из окон:</span>
                        <span className="font-medium text-[#022C22] truncate max-w-[150px]">{room.view}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Размещение:</span>
                        <span className="font-medium text-[#022C22] truncate max-w-[150px]">{room.capacity}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-[10px] tracking-wider font-mono text-stone-400 uppercase">Стоимость сутки</span>
                      <div className="text-[#022C22]">
                        {(!room.price || room.price <= 0) ? (
                          <span className="text-xs font-semibold text-[#c5a880] uppercase tracking-wide">Уточняйте у менеджера!</span>
                        ) : (
                          <>от <span className="text-xl font-serif font-bold text-[#c5a880]">{room.price.toLocaleString('ru-RU')} ₽</span></>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenRoomDetails(room)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2.5 rounded-sm uppercase tracking-wider text-center transition-colors"
                      >
                        Описание
                      </button>
                      <button
                        onClick={() => handleBookRoom(room.name)}
                        className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] text-xs font-bold py-2.5 rounded-sm uppercase tracking-wider text-center transition-all duration-300"
                      >
                        Забронировать
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Quick Notice under Rooms */}
          <div className="mt-8 bg-emerald-950/5 border border-[#c5a880]/30 p-5 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-sm text-stone-700">
              <ShieldAlert className="w-5 h-5 text-[#c5a880] shrink-0" />
              <span>Действуют специальные корпоративные тарифы для сотрудников ФТС России и членов их семей.</span>
            </div>
            <a href="tel:88005503240" className="text-[#c5a880] font-bold text-xs uppercase tracking-widest hover:underline flex items-center shrink-0">
              Уточнить льготы
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>
          </div>

        </motion.div>
      </section>

      {/* FILTERABLE MEDIA PHOTO GALLERY */}
      <section id="gallery" className="py-24 bg-[#FAF9F6] border-t border-stone-200/40">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            {isAdminMode && (
              <div className="mb-4">
                <button 
                  onClick={() => { setActiveSettingsTab('media'); setCurrentPage('admin'); }}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-all shadow hover:scale-105"
                >
                  <Edit className="w-3.5 h-3.5" /> Настроить медиа-архив и фоны
                </button>
              </div>
            )}
            <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">фотогалерея санатория</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#022C22] mt-3">
              Виды и инфраструктура санатория
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-3">
              Окунитесь в атмосферу целительного отдыха. Снято на территории санатория, в нашем парке и медицинских кабинетах.
            </p>
          </div>

          {/* Tab Filter Controls */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-10 pb-2 border-b border-stone-200">
            {[
              { id: 'all', label: 'Все фото' },
              ...(siteData.galleryCategories || []).map(cat => ({ id: cat.id, label: cat.name }))
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGalleryTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                  galleryTab === tab.id
                    ? 'bg-[#022C22] text-[#c5a880]'
                    : 'text-stone-500 hover:text-[#022C22] hover:bg-stone-150'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid Layout of photos */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, index) => (
                <motion.div
                  layout
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setLightboxIndex(index)}
                  className="relative group h-64 overflow-hidden rounded-sm border border-stone-200 shadow-sm cursor-zoom-in"
                >
                  <img
                    src={item.src || undefined}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Magnifier badge in corner */}
                  <div className="absolute top-4 right-4 bg-black/60 hover:bg-black/95 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-10">
                    <ZoomIn className="w-4 h-4 text-[#c5a880]" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <span className="text-[10px] tracking-wider text-[#c5a880] uppercase font-mono">
                      {siteData.galleryCategories?.find(c => c.id === item.category)?.name || item.category}
                    </span>
                    <h4 className="text-white font-serif text-lg font-medium leading-snug mt-1">{item.title}</h4>
                    <p className="text-stone-300 text-[10px] sm:text-xs mt-1 opacity-75">Посмотреть в полный экран</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </motion.div>
      </section>

      {/* REAL REVIEWS & TRUST */}
      <section id="testimonials" className="py-24 bg-[#022C22] text-white">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            {isAdminMode && (
              <div className="mb-4">
                <button 
                  onClick={() => { setActiveSettingsTab('testimonials'); setCurrentPage('admin'); }}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-all shadow hover:scale-105"
                >
                  <Edit className="w-3.5 h-3.5" /> Управление отзывами
                </button>
              </div>
            )}
            <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">обратная связь от наших гостей</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
              Отзывы отдыхающих
            </h2>
            <div className="h-1 w-20 bg-[#c5a880] mx-auto mt-5"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div 
                key={t.id} 
                className="bg-emerald-950 border border-[#c5a880]/20 p-6 sm:p-8 rounded-sm relative flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Visual stars and absolute quote symbol */}
                  <span className="absolute top-6 right-8 font-serif text-6xl text-emerald-900 leading-none select-none">“</span>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-200 text-xs sm:text-sm leading-relaxed italic mb-6">
                    «{t.text}»
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 mt-auto">
                  <h4 className="font-serif font-semibold text-sm text-white">{t.text.length > 200 ? `${t.author}` : t.author}</h4>
                  <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono tracking-wider mt-1.5 uppercase">
                    <span>{t.role}</span>
                    <span>{t.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                setCurrentPage('testimonials');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#c5a880] hover:bg-[#FAF9F6] text-[#022C22] font-black text-xs px-6 py-3.5 rounded-sm uppercase tracking-widest transition-all shadow-sm cursor-pointer active:scale-95"
            >
              Посмотреть все отзывы
            </button>
            <a 
              href="#booking"
              className="inline-block bg-transparent hover:bg-white/5 text-[#c5a880] border border-[#c5a880]/30 hover:border-[#c5a880] px-6 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-all"
            >
              Написать отзыв
            </a>
          </div>

        </motion.div>
      </section>

      {/* COMPREHENSIVE INTERACTIVE REVIEW FORM */}
      <section id="booking" className="py-24 bg-[#FAF9F6]">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          <div className="bg-white rounded-sm border border-stone-200/80 shadow-2xl overflow-hidden">
            
            {/* Header / Intro banner for the callback form */}
            <div className="bg-[#022C22] text-white p-6 sm:p-8 border-b border-[#c5a880]/30 text-center relative">
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              <span className="relative z-10 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">обратная связь отдыхающих</span>
              <h2 className="relative z-10 font-serif text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                Поделитесь своими впечатлениями
              </h2>
              <p className="relative z-10 text-stone-300 text-xs mt-3 leading-relaxed max-w-2xl mx-auto">
                Ваше честное мнение помогает нам улучшать медицинские программы, сервис, развивать парк-арборетум и делать проживание в санатории ФТС России «Ясная Поляна» совершенным.
              </p>
            </div>

            {/* Form & Actions */}
            <div className="p-6 sm:p-10">
              
              <AnimatePresence mode="wait">
                {!isSubmitting && !submitSuccess && (
                  <motion.form 
                    onSubmit={handleReviewSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    
                    {/* Star Rating Selector */}
                    <div className="space-y-2 bg-[#FAF9F6] p-4 sm:p-5 rounded border border-stone-200/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#022C22]">
                        Ваша оценка пребывания в санатории <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] text-stone-500 leading-normal mb-3">Оцените в комплексе проживание, лечение, питание и атмосферу курорта.</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                              className="text-amber-400 hover:scale-115 transition-transform duration-100 focus:outline-none cursor-pointer p-0.5"
                              title={`Оценка ${star}`}
                            >
                              <Star 
                                className={`w-8 h-8 transition-all ${
                                  star <= reviewForm.rating 
                                    ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_1px_2px_rgba(245,158,11,0.2)]' 
                                    : 'text-stone-300 hover:text-amber-200'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-serif font-bold italic text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-sm">
                          {reviewForm.rating === 5 && 'Идеально — Превзошло ожидания!'}
                          {reviewForm.rating === 4 && 'Очень хорошо — Качественный отдых'}
                          {reviewForm.rating === 3 && 'Удовлетворительно — Есть над чем поработать'}
                          {reviewForm.rating === 2 && 'Не совсем понравилось — Ожидали большего'}
                          {reviewForm.rating === 1 && 'Плохо — Неудовлетворительный опыт'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5" htmlFor="review-author">
                          Ваше ФИО / Имя <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="review-author"
                          name="author"
                          value={reviewForm.author}
                          onChange={handleReviewInputChange}
                          className={`w-full px-4 py-3 rounded-sm border focus:outline-none focus:ring-1 text-sm ${
                            formErrors.author 
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500' 
                              : 'border-stone-300 focus:border-[#022C22] focus:ring-[#022C22]'
                          }`}
                          placeholder="Например: Смирнова Ольга Петровна"
                        />
                        {formErrors.author && (
                          <span className="text-red-500 text-xs mt-1 block font-medium">{formErrors.author}</span>
                        )}
                      </div>

                      {/* Role/Status input */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5" htmlFor="review-role">
                          Статус / Роль или Город <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="review-role"
                          name="role"
                          value={reviewForm.role}
                          onChange={handleReviewInputChange}
                          className={`w-full px-4 py-3 rounded-sm border focus:outline-none focus:ring-1 text-sm ${
                            formErrors.role 
                              ? 'border-red-500 bg-red-50/20 focus:ring-red-500' 
                              : 'border-stone-300 focus:border-[#022C22] focus:ring-[#022C22]'
                          }`}
                          placeholder="Например: Сотрудник ФТС России, г. Москва"
                        />
                        {formErrors.role && (
                          <span className="text-red-500 text-xs mt-1 block font-medium">{formErrors.role}</span>
                        )}
                      </div>

                    </div>

                    {/* Detailed feedback message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5" htmlFor="review-text">
                        Текст вашего отзыва <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="review-text"
                        name="text"
                        rows={5}
                        value={reviewForm.text}
                        onChange={handleReviewInputChange}
                        className={`w-full px-4 py-3 rounded-sm border focus:outline-none focus:ring-1 text-sm ${
                          formErrors.text 
                            ? 'border-red-500 bg-red-50/20 focus:ring-red-500' 
                            : 'border-stone-300 focus:border-[#022C22] focus:ring-[#022C22]'
                        }`}
                        placeholder="Пожалуйста, опишите ваши впечатления о процедурах, питании, медицинском корпусе, персонале санатория ФТС и вековом парке..."
                      ></textarea>
                      {formErrors.text && (
                        <span className="text-red-500 text-xs mt-1 block font-medium">{formErrors.text}</span>
                      )}
                    </div>

                    {/* Personal data agreement note */}
                    <div className="text-xs text-stone-500 flex items-start space-x-3">
                      <input
                        type="checkbox"
                        required
                        defaultChecked
                        id="privacy-reviews"
                        className="w-4 h-4 rounded text-[#022C22] focus:ring-[#022C22] mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="privacy-reviews" className="cursor-pointer select-none">
                        Я подтверждаю подлинность оставленного отзыва и разрешаю публикацию моего отклика на официальном сайте {RESORT_INFO.name} ФТС России в рамках Общественного контроля за качеством услуг ведомственных здравниц.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Опубликовать мой отзыв</span>
                    </button>

                  </motion.form>
                )}

                {/* Animated submission overlay */}
                {isSubmitting && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16 flex flex-col items-center justify-center text-center space-y-6"
                    key="submitting-state"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-[#c5a880]/20 border-t-[#022C22] rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-[#c5a880] font-bold text-xs">
                        {submitStep * 33}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-medium text-[#022C22]">
                        {submitStep === 1 && 'Анализ текста отзыва на спам-фильтры...'}
                        {submitStep === 2 && 'Проверка подлинности ведомственного ранга...'}
                        {submitStep === 3 && 'Интеграция с базой отзывов реальных гостей...'}
                      </h3>
                      <p className="text-xs text-stone-500 max-w-sm">
                        Ваш отклик бережно обрабатывается и шифруется. Пожалуйста, не закрывайте вкладку.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Absolute submission success screen */}
                {submitSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 px-4 flex flex-col items-center text-center space-y-6"
                    key="success-state"
                  >
                    <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-[#022C22] rounded-full p-1 flex items-center justify-center shadow-lg">
                      <ThumbsUp className="w-8 h-8" />
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] tracking-widest font-mono uppercase bg-[#c5a880] text-[#022C22] px-3 py-1 font-bold rounded-full">
                        Публикация завершена
                      </span>
                      <h3 className="font-serif text-3xl font-bold text-[#022C22]">
                        Спасибо, {reviewForm.author.split(' ')[0]}!
                      </h3>
                      <p className="text-sm text-stone-600 max-w-md leading-relaxed">
                        Ваш развернутый отзыв с оценкой <strong className="text-amber-500 font-bold">{reviewForm.rating} ★</strong> был успешно сохранен и добавлен в общую карусель отзывов выше!
                      </p>
                    </div>

                    <div className="bg-stone-50 p-5 rounded-sm border border-stone-200 text-xs text-stone-600 space-y-2 max-w-md">
                      <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
                        <Check className="w-4 h-4" />
                        <span>Общественный контроль ФТС России</span>
                      </div>
                      <p className="leading-relaxed text-left">
                        Каждый опубликованный отзыв напрямую отправляется в департамент социального обеспечения Федеральной таможенной службы для учета обратной связи и составления рейтинга санаторно-курортного комплекса.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setReviewForm({
                          author: '',
                          role: '',
                          rating: 5,
                          text: ''
                        });
                        setSubmitSuccess(false);
                      }}
                      className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                    >
                      Написать еще один отзыв
                    </button>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </motion.div>
      </section>

      {/* DETAILED FAQ SEGMENT */}
      <section className="py-20 bg-white border-t border-b border-stone-200/60">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          
          <div className="text-center mb-12">
            {isAdminMode && (
              <div className="mb-4">
                <button 
                  onClick={() => { setActiveSettingsTab('faq'); setCurrentPage('admin'); }}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-900 border border-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-all shadow hover:scale-105"
                >
                  <Edit className="w-3.5 h-3.5" /> Редактировать FAQ вопросы
                </button>
              </div>
            )}
            <span className="text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">информационный гид</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#022C22] mt-2">
              Ответы на популярные вопросы
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details 
                key={faq.id} 
                className="group border border-stone-200/80 rounded-sm bg-[#FAF9F6] p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-stone-300"
              >
                <summary className="flex items-center justify-between font-serif font-semibold text-[#022C22] text-sm sm:text-base selection:bg-transparent">
                  <span>{faq.question}</span>
                  <span className="transition duration-300 group-open:-rotate-180 text-[#c5a880]">
                    <ChevronLeft className="w-5 h-5 -rotate-90" />
                  </span>
                </summary>
                <div className="mt-4 pt-3 border-t border-stone-200/50 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

        </motion.div>
      </section>

      {/* CONTACTS, DIRECTIONS & EMBEDDED DYNAMIC MAP INFO */}
      <section id="contacts" className="py-24 bg-[#FAF9F6]">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Direct Contact Details */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="h-[1px] w-8 bg-[#c5a880]"></span>
                  <span className="text-[11px] tracking-widest font-mono uppercase text-[#c5a880] font-bold">Контакты и адрес</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#022C22] mt-3">
                  Связаться с нами
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
                  Будем рады подробно ответить на любые ваши вопросы касательно стоимости, оформления документов, бронирования, трансфера и медицинского профиля.
                </p>
              </div>

              <div className="space-y-6">
                
                {/* MapPin / Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="bg-[#022C22] text-[#c5a880] p-2.5 rounded-sm mt-1 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Адрес санатория:</span>
                    <p className="text-sm font-semibold text-[#022C22] mt-0.5 leading-relaxed">
                      {RESORT_INFO.address}
                    </p>
                  </div>
                </div>

                {/* Phone detail */}
                <div className="flex items-start space-x-3.5">
                  <div className="bg-[#022C22] text-[#c5a880] p-2.5 rounded-sm mt-1 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Телефоны отдела бронирования:</span>
                    <p className="text-sm font-semibold text-[#022C22] mt-0.5 flex flex-col sm:flex-row sm:space-x-4">
                      <a href={`tel:${RESORT_INFO.phone}`} className="hover:text-[#c5a880]">Тел: {RESORT_INFO.phone}</a>
                      {RESORT_INFO.fax && <a href={`tel:${RESORT_INFO.fax}`} className="hover:text-[#c5a880]">Факс: {RESORT_INFO.fax}</a>}
                    </p>
                  </div>
                </div>

                {/* Email detail */}
                <div className="flex items-start space-x-3.5">
                  <div className="bg-[#022C22] text-[#c5a880] p-2.5 rounded-sm mt-1 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Электронная почта:</span>
                    <p className="text-sm font-semibold text-[#022C22] mt-0.5">
                      <a href={`mailto:${RESORT_INFO.email}`} className="hover:text-[#c5a880] underline">{RESORT_INFO.email}</a>
                    </p>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="bg-[#022C22] text-[#c5a880] p-2.5 rounded-sm mt-1 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Часы приема граждан:</span>
                    <p className="text-sm text-stone-700 mt-0.5">
                      {RESORT_INFO.workingHours}
                    </p>
                  </div>
                </div>

              </div>

              <div className="bg-stone-100 p-4 rounded-sm border-l-4 border-[#022C22] text-xs text-stone-600">
                <strong>Важное уведомление:</strong> На территории санатория действует пропускной режим. При посещении лечебного корпуса или заселении обязательно предъявление удостоверения личности (паспорта/служебного).
              </div>

            </div>

            {/* Real Interactive Yandex Map */}
            <div className="lg:col-span-7 min-h-[450px] bg-[#022C22] text-white rounded-sm border border-[#c5a880]/20 flex flex-col justify-between overflow-hidden relative shadow-2xl">
              
              <div className="w-full h-[280px] sm:h-[320px] lg:h-[350px] relative z-10 border-b border-[#c5a880]/20 bg-emerald-950/40">
                <iframe 
                  src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent("298660, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52")}&z=16`}
                  width="100%" 
                  height="100%" 
                  className="w-full h-full"
                  frameBorder="0" 
                  allowFullScreen
                  title="Yandex Map"
                ></iframe>
              </div>

              <div className="p-6 space-y-4 bg-gradient-to-b from-[#022C22] to-[#011B15] relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-widest font-mono text-emerald-400 uppercase font-bold">Гео-модуль «Ясная Поляна»</span>
                    <h3 className="font-serif text-lg font-semibold tracking-wide mt-0.5">Размещение на Черноморском побережье</h3>
                    <p className="text-stone-300 text-xs mt-1.5 leading-relaxed">
                      Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52. Расположен посреди реликтовой парковой зоны Харакс.
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex flex-col items-start sm:items-end gap-1">
                    <span className="text-[10px] text-stone-400 font-mono uppercase">Координаты GPS</span>
                    <span className="text-xs font-mono font-bold text-[#c5a880]">44.4308° N, 34.1256° E</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-3.5 text-xs text-stone-300">
                  <div>
                    <strong className="text-xs font-bold text-[#c5a880] uppercase tracking-wide block mb-1">Рядом с нами:</strong>
                    • Дворец «Харакс» — 600 м <br/>
                    • Ласточкино Гнездо — 1.8 км
                  </div>
                  <div className="flex flex-col justify-between items-stretch">
                    <div>
                      <strong className="text-xs font-bold text-[#c5a880] uppercase tracking-wide block mb-1">До центра Ялты:</strong>
                      • Расстояние — 11 км • 15 минут езды
                    </div>
                    <div className="pt-2 sm:pt-0 self-end w-full">
                      <a 
                        href={`https://yandex.ru/maps/?text=${encodeURIComponent("298660, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#c5a880] hover:bg-[#bca075] text-[#022C22] px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 justify-center w-full"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Открыть на Яндекс.Картах</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-[#022C22] text-white border-t border-[#c5a880]/30 py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Branding column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-semibold text-lg text-white">Санаторий «Ясная Поляна»</span>
                <span className="text-[#c5a880] text-lg font-serif italic">ФТС РФ</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Высокоэффективное санаторно-курортное лечение в уникальном оазисе крымской природы под патронатом Федеральной Таможенной Службы Российской Федерации.
              </p>
              <div className="text-[10px] text-stone-400 font-mono tracking-wide uppercase">
                Лицензия на осуществление медицинской деятельности ЛО-82-01-001240
              </div>
            </div>

            {/* Quick links columns */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase mb-4 border-b border-white/5 pb-1 select-none">Лечебный профиль</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>Органы дыхания</li>
                <li>Сердечно-сосудистая система</li>
                <li>Нервная система</li>
                <li>Опорно-двигательный аппарат</li>
                <li>Климатотерапия и грязелечение</li>
              </ul>
            </div>

            {/* Quick links columns */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase mb-4 border-b border-white/5 pb-1 select-none font-bold text-[#c5a880]">Размещение</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li><a href="#rooms" className="hover:text-[#c5a880]">Стандарт Улучшенный</a></li>
                <li><a href="#rooms" className="hover:text-[#c5a880]">Полулюкс Комфорт</a></li>
                <li><a href="#rooms" className="hover:text-[#c5a880]">Двухкомнатный Люкс</a></li>
                <li><a href="#rooms" className="hover:text-[#c5a880]">VIP Апартаменты ФТС</a></li>
                <li><a href="#booking" className="hover:text-[#c5a880]">Акции & Скидки</a></li>
              </ul>
            </div>

            {/* Contacts column */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase mb-4 border-b border-white/5 pb-1 select-none text-stone-200">Бронирование</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>Телефон: <a href={`tel:${RESORT_INFO.phone}`} className="hover:underline">{RESORT_INFO.phone}</a></li>
                {RESORT_INFO.fax && <li>Факс: <a href={`tel:${RESORT_INFO.fax}`} className="hover:underline">{RESORT_INFO.fax}</a></li>}
                <li>Приемная: <a href={`mailto:${RESORT_INFO.email}`} className="hover:underline">{RESORT_INFO.email}</a></li>
                <li>Адрес: {RESORT_INFO.address}</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 text-center md:flex md:items-center md:justify-between text-xs text-stone-400">
            <p>
              &copy; {new Date().getFullYear()} Санаторий «Ясная Поляна» ФТС России. Официальное представительство. Все права защищены.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 justify-center items-center">
              <button type="button" className="hover:text-white">Политика обработки данных</button>
              <span>&bull;</span>
              <button type="button" className="hover:text-white">Карта сайта</button>

            </div>
          </div>

        </div>
      </footer>

      {/* DETAILED ROOM MODAL SIDE PANEL */}
      <AnimatePresence>
        {roomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop slide blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRoomModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-sm max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              
              {/* Header Visual */}
              {(() => {
                const roomImages = roomModal.images && roomModal.images.length > 0 ? roomModal.images : [roomModal.image];
                return (
                  <div className="relative h-64 shrink-0 border-b border-stone-100 group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={roomImages[activeRoomImageIndex] || 'default'}
                        src={roomImages[activeRoomImageIndex] || roomModal.image}
                        alt={roomModal.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </AnimatePresence>
                    <button
                      onClick={() => setRoomModal(null)}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors z-20 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    {roomImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRoomImageIndex(prev => (prev - 1 + roomImages.length) % roomImages.length);
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-md z-10 cursor-pointer flex items-center justify-center"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRoomImageIndex(prev => (prev + 1) % roomImages.length);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-md z-10 cursor-pointer flex items-center justify-center"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Pagination indicator dots */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/35 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {roomImages.map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRoomImageIndex(i);
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                i === activeRoomImageIndex ? 'bg-[#c5a880] scale-125' : 'bg-white/60 hover:bg-white'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white z-10">
                      <span className="text-[10px] tracking-widest font-mono text-[#c5a880] uppercase font-bold">{roomModal.category}</span>
                      <h3 className="font-serif text-2xl font-semibold mt-1 tracking-tight">{roomModal.name}</h3>
                    </div>
                  </div>
                );
              })()}

              {/* Scrollable contents inside modal */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Description and area grid */}
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-stone-800 text-sm uppercase tracking-wide">Описание номера</h4>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{roomModal.description}</p>
                </div>

                {/* Key specifics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#FAF9F6] p-4 rounded-sm border border-stone-100">
                  <div className="text-center md:border-r border-stone-200 last:border-0 p-1">
                    <span className="block text-[10px] font-mono tracking-wider text-stone-400 uppercase">Площадь</span>
                    <strong className="block text-sm text-[#022C22] mt-1 pr-1">{roomModal.area} м²</strong>
                  </div>
                  <div className="text-center md:border-r border-stone-200 last:border-0 p-1">
                    <span className="block text-[10px] font-mono tracking-wider text-stone-400 uppercase">Вместимость</span>
                    <strong className="block text-sm text-[#022C22] mt-1 pr-1">{roomModal.capacity.split('(')[0]}</strong>
                  </div>
                  <div className="text-center md:border-r border-stone-200 last:border-0 p-1">
                    <span className="block text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold text-[#c5a880]">Кровати</span>
                    <strong className="block text-xs text-[#022C22] mt-1 truncate pr-1" title={roomModal.beds}>{roomModal.beds.split(',')[0]}</strong>
                  </div>
                  <div className="text-center last:border-0 p-1">
                    <span className="block text-[10px] font-mono tracking-wider text-stone-400 uppercase">Вид из окон</span>
                    <strong className="block text-xs text-[#022C22] mt-1 truncate pr-1" title={roomModal.view}>{roomModal.view}</strong>
                  </div>
                </div>

                {/* Full amenities checklist list */}
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-stone-800 text-sm uppercase tracking-wide">Удобства в номере:</h4>
                  <div className="grid grid-cols-2 gap-2.5 text-stone-700">
                    {roomModal.amenities.map((amen, idx) => (
                      <div key={idx} className="flex items-center text-xs">
                        <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                        <span>{amen}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important notices */}
                <div className="bg-amber-50 rounded-sm border-l-4 border-[#c5a880] p-4 text-xs text-stone-600 leading-relaxed">
                  <strong>Информация о заезде:</strong> Расчетный час — 12:00 (заезд с 14:00, выезд до 12:00 на следующий день). В стоимость включено полноценное медицинское или оздоровительное сопровождение.
                </div>

              </div>

              {/* Bottom bar */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] tracking-wider text-stone-400 uppercase font-mono block">Цена за сутки</span>
                  {(!roomModal.price || roomModal.price <= 0) ? (
                    <span className="text-sm font-bold text-[#c5a880] uppercase tracking-wide">Уточняйте у менеджера!</span>
                  ) : (
                    <span className="text-lg font-bold text-[#022C22]">от <span className="text-xl font-serif font-bold text-[#c5a880]">{roomModal.price.toLocaleString('ru')} ₽</span></span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setRoomModal(null)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Закрыть
                  </button>
                  <button
                    onClick={() => handleBookRoom(roomModal.name)}
                    className="px-5 py-2 bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-300"
                  >
                    Выбрать этот номер
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GALLERY IMAGE LIGHTBOX / ZOOM MODE */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-between p-4 sm:p-6 bg-black/95 backdrop-blur-md select-none overflow-hidden">
            {/* Background close click */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setLightboxIndex(null)}
            />

            {/* Top info bar */}
            <div className="relative z-10 w-full flex items-center justify-between text-white max-w-7xl mx-auto py-2">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-[10px] tracking-widest font-mono text-[#c5a880] uppercase font-bold">
                  Санаторий «Ясная Поляна» • {filteredGallery[lightboxIndex].category}
                </span>
                <h3 className="font-serif text-sm sm:text-lg font-medium text-stone-100 truncate">
                  {filteredGallery[lightboxIndex].title}
                </h3>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="flex items-center space-x-1.5 p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-white rounded transition-all cursor-pointer"
                title="Закрыть (Esc)"
              >
                <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-mono text-zinc-400">Esc</span>
                <X className="w-4 h-4 text-[#c5a880]" />
              </button>
            </div>

            {/* Main Stage: Prev - Image - Next */}
            <div className="relative z-10 flex-1 flex items-center justify-between max-w-7xl w-full mx-auto my-4">
              
              {/* Prev Button */}
              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1))}
                className="p-3 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-650 hover:bg-[#022C22] text-[#c5a880] hover:text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a880]/50 select-none cursor-pointer hidden md:flex"
                title="Предыдущее фото (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image Container with framer motion animations */}
              <div className="flex-1 flex items-center justify-center relative px-2 sm:px-4 md:px-8 h-full max-h-[75vh]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={lightboxIndex}
                    src={filteredGallery[lightboxIndex]?.src || undefined}
                    alt={filteredGallery[lightboxIndex]?.title || ''}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="max-w-full max-h-full object-contain rounded border border-zinc-800 shadow-2xl select-none"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0))}
                className="p-3 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-650 hover:bg-[#022C22] text-[#c5a880] hover:text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a880]/50 select-none cursor-pointer hidden md:flex"
                title="Следующее фото (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

            </div>

            {/* Bottom info: Counter & mobile navigator dots */}
            <div className="relative z-10 text-center text-white py-2 max-w-xl mx-auto space-y-3">
              <div className="flex justify-center items-center space-x-4">
                {/* Mobile version simple buttons when screen is small or touch */}
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1))}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#c5a880] rounded transition-all md:hidden cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-3 py-1 bg-zinc-900/60 border border-zinc-800 rounded font-mono text-[11px] sm:text-xs tracking-wider text-[#c5a880] select-none">
                  {lightboxIndex + 1} / {filteredGallery.length}
                </div>

                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0))}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#c5a880] rounded transition-all md:hidden cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Instruction Tip */}
              <p className="hidden md:block text-[10px] text-zinc-500 uppercase tracking-widest font-mono select-none">
                Используйте клавиши <span className="text-zinc-400 font-sans">←</span> и <span className="text-zinc-400 font-sans">→</span> на клавиатуре для перелистывания
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Admin Overlay Controllers */}
      <AdminFloatBar />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-6 right-6 z-[60] p-3 rounded-full shadow-xl border cursor-pointer flex items-center justify-center transition-all ${
              isAccessMode 
                ? 'bg-black text-white hover:bg-gray-800 border-white'
                : 'bg-[#022C22] text-[#c5a880] border-[#c5a880]/30 hover:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/50'
            }`}
            title="Наверх"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
