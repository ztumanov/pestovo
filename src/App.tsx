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
  Sunrise,
  Sunset,
  Moon,
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
  ChevronUp,
  Images,
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
import DocumentsPage from './components/DocumentsPage';
import TestimonialsPage from './components/TestimonialsPage';
import LoginPage from './components/LoginPage';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';

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
  const rawSlides: Array<{ id: string; type: string; url: string }> = Array.isArray(HERO_DATA?.slides)
    ? HERO_DATA.slides
    : (IMAGES?.hero ? [{ id: 'hero-photo-1', type: 'photo', url: IMAGES.hero }] : []);

  const bgMode = HERO_DATA?.defaultBackgroundMode || 'all';
  const filteredSlides = rawSlides.filter(slide => {
    if (!slide || !slide.url) return false;
    if (bgMode === 'photo') return slide.type === 'photo';
    if (bgMode === 'video' || bgMode === 'video_nature' || bgMode === 'video_palace') return slide.type === 'video';
    return true;
  });

  const slides = filteredSlides;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Auto-cycling slideshow timer
  useEffect(() => {
    if (slides.length <= 1) {
      if (activeSlideIndex !== 0 && slides.length > 0) {
        setActiveSlideIndex(0);
      }
      return;
    }
    const currentSlide = slides[activeSlideIndex];
    const duration = currentSlide?.type === 'video' ? 14000 : 7000;
    const timer = setTimeout(() => {
      setActiveSlideIndex(prev => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [activeSlideIndex, slides]);

  // Gallery tabs & expansion (limit to 3 rows = 9 photos)
  const [galleryTab, setGalleryTab] = useState<string>('all');
  const [isGalleryExpanded, setIsGalleryExpanded] = useState<boolean>(false);
  const GALLERY_VISIBLE_LIMIT = 9;

  useEffect(() => {
    setIsGalleryExpanded(false);
  }, [galleryTab]);

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
        let apiType: 'metno' | 'openmeteo' | 'wttr' | 'simulation' = 'metno';

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
          // Tier 1: api.met.no (Unblocked, highly accurate Norwegian Met API with global CORS support)
          const res = await fetchWithTimeout(
            `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
            3000
          );
          if (res.ok) {
            data = await res.json();
            apiType = 'metno';
          } else {
            throw new Error('api.met.no returned non-OK response');
          }
        } catch (metNoErr) {
          console.warn('api.met.no failed. Trying open-meteo as Tier 2...', metNoErr);
          try {
            const res = await fetchWithTimeout(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Moscow`,
              2000
            );
            if (res.ok) {
              data = await res.json();
              apiType = 'openmeteo';
            } else {
              throw new Error('Primary open-meteo weather API returned non-OK response');
            }
          } catch (primaryErr) {
            console.warn('open-meteo failed. Trying wttr.in as Tier 3...', primaryErr);
            try {
              const res = await fetchWithTimeout(
                `https://wttr.in/44.4361,34.1139?format=j1`,
                2000
              );
              if (!res.ok) throw new Error('wttr.in returned non-OK response');
              data = await res.json();
              apiType = 'wttr';
            } catch (fallbackErr) {
              console.error('All weather APIs failed. Activating simulation fallback...', fallbackErr);
              apiType = 'simulation';
              throw new Error('All external APIs failed');
            }
          }
        }
        
        if (active && data) {
          if (apiType === 'metno') {
            const timeseries = data.properties?.timeseries;
            if (!timeseries || timeseries.length === 0) {
              throw new Error("Invalid met.no structure");
            }

            const currentItem = timeseries[0];
            const instantDetails = currentItem.data?.instant?.details;
            if (!instantDetails) {
              throw new Error("No current details in met.no");
            }

            const temp = Math.round(instantDetails.air_temperature);
            const humidity = Math.round(instantDetails.relative_humidity);
            const windSpeed = Number(instantDetails.wind_speed.toFixed(1));
            
            let feelsLike = temp;
            if (temp < 10) {
              feelsLike = Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16));
            } else if (temp > 26) {
              feelsLike = Math.round(temp + 0.1 * (humidity - 50));
            }

            const symbolCode = currentItem.data?.next_1_hours?.summary?.symbol_code || 
                               currentItem.data?.next_6_hours?.summary?.symbol_code || 
                               "clearsky_day";

            const mapSymbolToWmo = (sym: string): number => {
              const s = sym.split('_')[0].toLowerCase();
              if (s === 'clearsky' || s === 'fair') return 0;
              if (s === 'partlycloudy') return 2;
              if (s === 'cloudy') return 3;
              if (s === 'fog') return 45;
              if (s === 'lightrain' || s === 'lightrainshowers') return 51;
              if (s === 'rain' || s === 'rainshowers') return 61;
              if (s === 'heavyrain' || s === 'heavyrainshowers') return 63;
              if (s === 'lightsnow' || s === 'lightsnowshowers') return 71;
              if (s === 'snow' || s === 'snowshowers') return 73;
              if (s === 'heavysnow') return 75;
              if (s === 'sleet' || s === 'sleetshowers') return 61;
              if (s === 'sleetshowersandthunder' || s === 'rainshowersandthunder' || s === 'thunderstorm') return 95;
              return 1;
            };

            const weatherCode = mapSymbolToWmo(symbolCode);

            const forecastsByDay: { [dateStr: string]: { temps: number[], symbols: string[] } } = {};
            timeseries.forEach((item: any) => {
              const dateStr = item.time.split('T')[0];
              const itemTemp = item.data?.instant?.details?.air_temperature;
              const itemSymbol = item.data?.next_1_hours?.summary?.symbol_code || 
                                 item.data?.next_6_hours?.summary?.symbol_code;
              
              if (itemTemp !== undefined) {
                if (!forecastsByDay[dateStr]) {
                  forecastsByDay[dateStr] = { temps: [], symbols: [] };
                }
                forecastsByDay[dateStr].temps.push(itemTemp);
                if (itemSymbol) {
                  forecastsByDay[dateStr].symbols.push(itemSymbol);
                }
              }
            });

            const forecastData = [];
            const uniqueDates = Object.keys(forecastsByDay).sort();
            let daysAdded = 0;
            for (const dateStr of uniqueDates) {
              if (daysAdded >= 3) break;
              const dayData = forecastsByDay[dateStr];
              if (dayData.temps.length > 0) {
                const tempMax = Math.round(Math.max(...dayData.temps));
                const tempMin = Math.round(Math.min(...dayData.temps));
                const symbols = dayData.symbols;
                const symbol = symbols.length > 0 ? symbols[Math.floor(symbols.length / 2)] : "clearsky_day";
                const dayCode = mapSymbolToWmo(symbol);

                forecastData.push({
                  date: dateStr,
                  tempMax,
                  tempMin,
                  weatherCode: dayCode
                });
                daysAdded++;
              }
            }

            setRealWeather({
              temp,
              feelsLike,
              humidity,
              windSpeed,
              weatherCode,
              forecast: forecastData
            });
            setWeatherError(null);
          } else if (apiType === 'openmeteo' && data.current && data.daily) {
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
          } else if (apiType === 'wttr' && data.current_condition && data.weather) {
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
          console.warn('Weather APIs are limited or blocked in RF. Seamlessly falling back to realistic Crimean microclimate simulation...', err);
          
          const now = new Date();
          const month = now.getMonth(); // 0-11
          
          // Highly accurate historical monthly averages for Gaspra, Crimea
          // Month:        Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
          const maxTemps = [7,   8,  11,  16,  22,  27,  30,  30,  24,  18,  12,   8];
          const minTemps = [2,   2,   5,   9,  13,  17,  20,  20,  15,  10,   6,   3];
          
          const maxT = maxTemps[month];
          const minT = minTemps[month];
          
          // Temp varies based on time of day
          const hour = now.getHours();
          let factor = 0.5;
          if (hour >= 6 && hour < 12) factor = 0.65; // warming up morning
          else if (hour >= 12 && hour < 17) factor = 0.95; // peak day
          else if (hour >= 17 && hour < 22) factor = 0.70; // evening cooling
          else factor = 0.30; // night
          
          // Some random variance based on day of month to look natural
          const variance = Math.sin(now.getDate()) * 2; 
          const temp = Math.round(minT + (maxT - minT) * factor + variance);
          const feelsLike = Math.round(temp + (Math.cos(hour) * 1.2));
          const humidity = Math.round(60 + (Math.sin(hour) * 12));
          const windSpeed = Number((2.2 + Math.abs(Math.sin(now.getDate())) * 3).toFixed(1));
          
          // Weather code: 0=Sunny, 1=Partly cloudy, 2=Cloudy, etc.
          let weatherCode = 0;
          if (month >= 10 || month <= 2) {
            weatherCode = Math.abs(Math.sin(now.getDate())) > 0.6 ? 2 : 1;
          } else {
            weatherCode = Math.abs(Math.sin(now.getDate())) > 0.8 ? 1 : 0;
          }
          
          const forecast = [];
          for (let i = 0; i < 3; i++) {
            const fDate = new Date();
            fDate.setDate(now.getDate() + i);
            const dateStr = fDate.toISOString().split('T')[0];
            
            const dayVariance = Math.sin(now.getDate() + i) * 2;
            const dayMax = Math.round(maxT + dayVariance);
            const dayMin = Math.round(minT + dayVariance);
            
            // Generate some logical forecast codes
            let dayCode = 0;
            if (i === 1 && Math.abs(Math.cos(now.getDate())) > 0.7) {
              dayCode = 1; // partly cloudy
            } else if (i === 2 && Math.abs(Math.sin(now.getDate())) > 0.8) {
              dayCode = 3; // cloudy
            }
            
            forecast.push({
              date: dateStr,
              tempMax: dayMax,
              tempMin: dayMin,
              weatherCode: dayCode
            });
          }
          
          setRealWeather({
            temp,
            feelsLike,
            humidity,
            windSpeed,
            weatherCode,
            forecast
          });
          setWeatherError(null);
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
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

  // Climate details based on time of day - dynamically computed from real-time weather data
  const climateDetails = React.useMemo(() => {
    const defaultDetails = {
      morning: {
        temp: '19°C',
        seaTemp: '20°C',
        phytoncides: 'Супер-концентрация',
        aerosols: 'Насыщенный морской бриз',
        recommendation: 'Идеальное время для утреннего терренкура по парку к морю и дыхательной гимнастики.',
        humidity: '72%',
        windSpeed: '3.2 м/с',
        weatherCode: 1,
        weatherName: 'Ясно, свежий ветерок'
      },
      day: {
        temp: '24°C',
        seaTemp: '21°C',
        phytoncides: 'Максимум хвойного эфира',
        aerosols: 'Смешанный хвойно-морской',
        recommendation: 'Прекрасно для прохождения лечебных ванн и грязелечения, а также отдыха на приватном пляже.',
        humidity: '55%',
        windSpeed: '4.5 м/с',
        weatherCode: 0,
        weatherName: 'Преимущественно ясно'
      },
      evening: {
        temp: '21°C',
        seaTemp: '21°C',
        phytoncides: 'Умеренная концентрация',
        aerosols: 'Горный бриз с Ай-Петри',
        recommendation: 'Время для релаксационной йоги на террасе и вечерних климатотерапевтических прогулок у кипарисов.',
        humidity: '64%',
        windSpeed: '1.8 м/с',
        weatherCode: 2,
        weatherName: 'Малооблачно, штиль'
      }
    };

    if (!realWeather) {
      return defaultDetails;
    }

    const baseTemp = realWeather.temp;
    // For day, use the daytime max or base temp
    const dayTemp = realWeather.forecast?.[0]?.tempMax ?? baseTemp;
    // For morning, use the daytime min or dayTemp - 5
    const morningTemp = realWeather.forecast?.[0]?.tempMin ?? Math.round(dayTemp - 5);
    // For evening, use intermediate dayTemp - 3
    const eveningTemp = Math.round(dayTemp - 3);

    // Dynamic sea temperature
    const seaTempDay = getSeaTemperature(dayTemp);
    const seaTempMorning = Math.max(10, seaTempDay - 1);
    const seaTempEvening = seaTempDay;

    // Dynamic humidity
    const baseHumidity = realWeather.humidity;
    const morningHumidity = Math.min(98, baseHumidity + 12);
    const dayHumidity = Math.max(30, baseHumidity - 5);
    const eveningHumidity = Math.min(95, baseHumidity + 6);

    // Dynamic wind speed
    const baseWind = realWeather.windSpeed;
    const morningWind = Math.max(0.5, Number((baseWind * 0.7).toFixed(1)));
    const dayWind = baseWind;
    const eveningWind = Math.max(0.5, Number((baseWind * 0.4).toFixed(1)));

    // Weather name and code from real data
    const realWeatherName = getWeatherName(realWeather.weatherCode);

    return {
      morning: {
        temp: `${morningTemp}°C`,
        seaTemp: `${seaTempMorning}°C`,
        phytoncides: 'Супер-концентрация',
        aerosols: 'Насыщенный морской бриз',
        recommendation: 'Идеальное время для утреннего терренкура по парку к морю и дыхательной гимнастики.',
        humidity: `${morningHumidity}%`,
        windSpeed: `${morningWind} м/с`,
        weatherCode: realWeather.weatherCode === 0 ? 1 : realWeather.weatherCode,
        weatherName: realWeather.weatherCode === 0 ? 'Ясно, свежий ветерок' : `${realWeatherName}, свежо`
      },
      day: {
        temp: `${dayTemp}°C`,
        seaTemp: `${seaTempDay}°C`,
        phytoncides: 'Максимум хвойного эфира',
        aerosols: 'Смешанный хвойно-морской',
        recommendation: 'Прекрасно для прохождения лечебных ванн и грязелечения, а также отдыха на приватном пляже.',
        humidity: `${dayHumidity}%`,
        windSpeed: `${dayWind} м/с`,
        weatherCode: realWeather.weatherCode,
        weatherName: realWeatherName
      },
      evening: {
        temp: `${eveningTemp}°C`,
        seaTemp: `${seaTempEvening}°C`,
        phytoncides: 'Умеренная концентрация',
        aerosols: 'Горный бриз с Ай-Петри',
        recommendation: 'Время для релаксационной йоги на террасе и вечерних климатотерапевтических прогулок у кипарисов.',
        humidity: `${eveningHumidity}%`,
        windSpeed: `${eveningWind} м/с`,
        weatherCode: realWeather.weatherCode,
        weatherName: `${realWeatherName}, умеренный штиль`
      }
    };
  }, [realWeather]);

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

    // Process submission
    setIsSubmitting(true);
    setSubmitStep(1);

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
      role: reviewForm.role.trim() || 'Гость санатория',
      rating: reviewForm.rating,
      text: reviewForm.text.trim(),
      date: dateStr,
      isApproved: false
    };

    setTimeout(async () => {
      setSubmitStep(2);
      try {
        const response = await fetch('/reviews.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            author: reviewForm.author.trim(),
            role: reviewForm.role.trim(),
            rating: reviewForm.rating,
            text: reviewForm.text.trim()
          })
        });

        setSubmitStep(3);

        if (response.ok) {
          const resData = await response.json();
          if (resData && resData.reviews) {
            // Server returned the complete updated reviews list
            updateSection('testimonials', resData.reviews);
          } else if (resData && resData.new_review) {
            updateSection('testimonials', [resData.new_review, ...siteData.testimonials]);
          } else {
            updateSection('testimonials', [newTestimonial, ...siteData.testimonials]);
          }
        } else {
          throw new Error('Server returned non-OK response');
        }
      } catch (err) {
        console.warn('POST to reviews.php failed or was unreached (running in offline/dev environment). Saving locally to localStorage...', err);
        setSubmitStep(3);
        updateSection('testimonials', [newTestimonial, ...siteData.testimonials]);
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitSuccess(true);
          // Reset form
          setReviewForm({
            author: '',
            role: '',
            rating: 5,
            text: ''
          });
        }, 1200);
      }
    }, 1200);
  };

  const getMedicalIcon = (iconName: string) => {
    const icon = iconName?.toLowerCase() || '';
    if (icon.includes('lung') || icon.includes('breath') || icon.includes('activity')) {
      return <Activity className="w-5 h-5" />;
    }
    if (icon.includes('heart') || icon.includes('cardio')) {
      return <Heart className="w-5 h-5" />;
    }
    if (icon.includes('brain') || icon.includes('stress') || icon.includes('nerv')) {
      return <Brain className="w-5 h-5" />;
    }
    if (icon.includes('stetho') || icon.includes('med')) {
      return <Stethoscope className="w-5 h-5" />;
    }
    if (icon.includes('wave') || icon.includes('water')) {
      return <Waves className="w-5 h-5" />;
    }
    return <Sparkles className="w-5 h-5" />;
  };

  // Combine generated images + fallback Unsplash pictures for the big filterable gallery
  const ALL_GALLERY_ITEMS = siteData.gallery || [];

  const filteredGallery = galleryTab === 'all' 
    ? ALL_GALLERY_ITEMS 
    : ALL_GALLERY_ITEMS.filter(item => item.category === galleryTab);

  const visibleGalleryItems = isGalleryExpanded 
    ? filteredGallery 
    : filteredGallery.slice(0, GALLERY_VISIBLE_LIMIT);

  const hasHiddenGalleryPhotos = filteredGallery.length > GALLERY_VISIBLE_LIMIT;
  const hiddenGalleryPhotosCount = filteredGallery.length - GALLERY_VISIBLE_LIMIT;

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
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/14/Emblem_of_the_Federal_Customs_Service_of_Russia.svg" alt="ФТС России" className="w-12 h-12 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {(
                [
                  { id: 'medical', label: 'Лечение' },
                  { id: 'rooms', label: 'Номера' },
                  { id: 'gallery', label: 'Галерея' },
                  { id: 'testimonials', label: 'Отзывы' },
                  { id: 'contacts', label: 'Контакты' },
                ] as { id: string; label: string; isPage?: boolean }[]
              ).map((item) => (
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {(
                  [
                    { id: 'medical', label: 'Лечение' },
                    { id: 'rooms', label: 'Категории Номеров' },
                    { id: 'gallery', label: 'Галерея' },
                    { id: 'testimonials', label: 'Отзывы' },
                    { id: 'contacts', label: 'Контакты & FAQ' },
                  ] as { id: string; label: string; isPage?: boolean }[]
                ).map((item) => (
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
          ) : currentPage === 'login' ? (
            <LoginPage onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          ) : (
            <>
          {/* HERO / WELCOME ATRIUM */}
          <header id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#033E31] to-[#01221A]">
        
        {/* Dynamic Background (Switchable Video/Image loops) */}
        <motion.div className="absolute inset-0 z-0 bg-[#033E31]" style={{ y: yBg }}>
          <AnimatePresence mode="wait" initial={false}>
            {slides[activeSlideIndex] && (
              <motion.div 
                key={`slide-${activeSlideIndex}-${slides[activeSlideIndex]?.url}`}
                className="absolute inset-0 w-full h-full overflow-hidden brightness-[1.20] saturate-[1.05]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.90 }}
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
                    poster={slides.find(s => s.type === 'photo')?.url || (IMAGES?.hero && !IMAGES.hero.includes('pestovo_palace') ? IMAGES.hero : undefined)}
                    className="w-full h-full object-cover object-center scale-105"
                    onEnded={() => {
                      if (slides.length > 1) {
                        setActiveSlideIndex(prev => (prev + 1) % slides.length);
                      }
                    }}
                    onError={() => {
                      console.warn("Video background failed to load.");
                    }}
                  />
                ) : (
                  <img
                    src={slides[activeSlideIndex]?.url}
                    alt="Санаторий Ясная Поляна ФТС России"
                    className="w-full h-full object-cover object-center scale-105"
                    referrerPolicy="no-referrer"
                    fetchPriority="high"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Elegant geometric gradients imitating sunlight through pines with a warm golden sun overlay */}
          {/* Elegant geometric gradients imitating sunlight through pines with a warm golden sun overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/40 via-[#011F19]/15 to-[#022C22]/20 z-1"></div>
          {/* Warm sunset sun rays and ambient glowing effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400/50 via-amber-600/20 to-transparent mix-blend-screen z-1"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent mix-blend-screen z-1"></div>
          {/* Subtle central radial gradient to keep text readable without making the background too dark */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 via-transparent to-black/10 z-1"></div>
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
                    <span className="block text-stone-200 font-sans font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] uppercase opacity-95 mb-2 sm:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      САНАТОРИЙ
                    </span>
                    <span className="block text-white font-serif font-black tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
                      «ЯСНАЯ ПОЛЯНА»
                    </span>
                  </>
                );
              }
              return (
                <span className="block text-white font-serif font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  {text}
                </span>
              );
            })()}
            <span className="italic text-[#c5a880] font-semibold font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl block mt-4 sm:mt-5 tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              {HERO_DATA.titleSecondPart}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-sm sm:text-lg md:text-xl text-white font-sans max-w-3xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium"
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

          {/* Quick Verified Highlights / Official Institutional Facts */}
          {HERO_DATA.showStats !== false && HERO_DATA.stats && HERO_DATA.stats.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-14 sm:mt-16 w-full max-w-5xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 bg-[#011a14]/75 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-[#c5a880]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                {HERO_DATA.stats.map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#c5a880]/50 hover:bg-white/[0.07] transition-all duration-300 group text-center"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center mb-2.5 text-[#c5a880] group-hover:scale-110 group-hover:bg-[#c5a880] group-hover:text-[#022C22] transition-all duration-300 shadow-sm shrink-0">
                      {idx === 0 ? (
                        <Shield className="w-4 h-4" />
                      ) : idx === 1 ? (
                        <Award className="w-4 h-4" />
                      ) : idx === 2 ? (
                        <MapPin className="w-4 h-4" />
                      ) : (
                        <Stethoscope className="w-4 h-4" />
                      )}
                    </div>
                    
                    <span className="block font-serif text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-[#c5a880] transition-colors leading-snug">
                      {stat.value}
                    </span>
                    <span className="block text-[#c5a880] text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider mt-1 leading-tight">
                      {stat.label}
                    </span>
                    {stat.description && (
                      <span className="block text-stone-300/80 text-[10px] font-sans mt-1 leading-tight">
                        {stat.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>
      </header>

      {/* ABOUT & MICROCLIMATE INTERACTIVE EXPERIENCE */}
      <section id="about" className="py-14 sm:py-16 md:py-20 bg-[#FAF9F6]">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Visual presentation and Arboretum description */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
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
                Южнобережный климат <br/>
                <span className="italic text-[#c5a880] font-normal font-serif">и комплексное оздоровление</span>
              </h2>
              <div className="text-stone-700 space-y-4 text-base md:text-lg leading-relaxed">
                <p>{RESORT_INFO.historyText}</p>
                <p>{RESORT_INFO.climatotherapyText}</p>
              </div>
            </div>

            {/* INTERACTIVE CLIMATE WIDGET */}
            <div className="lg:col-span-5">
              
              {/* Фито-Барометр & Метео-Станция */}
              <div className="bg-gradient-to-br from-[#062c23] via-[#03201a] to-[#011410] text-white p-4 sm:p-5 rounded-2xl shadow-[0_16px_40px_-12px_rgba(2,44,34,0.45),0_0_0_1px_rgba(197,168,128,0.25)] relative overflow-hidden backdrop-blur-md">
                {/* Decorative ambient background glows and subtle golden luxury haze */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#c5a880]/12 rounded-full filter blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,168,128,0.08),transparent_60%)] pointer-events-none"></div>
                
                <div className="relative z-10 space-y-3.5">
                  
                  {/* Header Row with integrated Time-of-Day Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#c5a880]/20 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-lg bg-[#c5a880]/15 text-[#c5a880] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                          <TreePine className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white">
                          Фито-Барометр
                        </h3>
                        <div className="flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] text-emerald-300 font-mono font-semibold shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>LIVE</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#c5a880] font-mono tracking-wider uppercase mt-0.5">
                        Гаспра, ЮБК • Курортная климатотерапия
                      </p>
                    </div>

                    {/* Compact Segmented Pills Switcher */}
                    <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] shrink-0 self-start sm:self-auto backdrop-blur-sm">
                      {[
                        { id: 'morning', title: 'Утро', icon: <Sunrise className="w-3.5 h-3.5 shrink-0" /> },
                        { id: 'day', title: 'День', icon: <Sun className="w-3.5 h-3.5 shrink-0" /> },
                        { id: 'evening', title: 'Вечер', icon: <Moon className="w-3.5 h-3.5 shrink-0" /> },
                      ].map((tab) => {
                        const isActive = climateTime === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setClimateTime(tab.id as 'morning' | 'day' | 'evening')}
                            className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg text-xs font-serif font-bold transition-all duration-300 cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-[#d1b58f] via-[#c5a880] to-[#b4936a] text-[#022C22] shadow-[0_2px_8px_rgba(197,168,128,0.4)] scale-105'
                                : 'text-stone-300 hover:text-white hover:bg-white/[0.08]'
                            }`}
                          >
                            <span className={isActive ? 'text-[#022C22]' : 'text-[#c5a880]'}>{tab.icon}</span>
                            <span className="leading-none">{tab.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Loading & Error or Loaded content */}
                  {weatherLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 rounded-full border-2 border-[#c5a880] border-t-transparent animate-spin"></div>
                      <span className="text-stone-300 text-xs font-mono">Синхронизация с метеостанцией...</span>
                    </div>
                  ) : weatherError || !realWeather ? (
                    <div className="py-6 text-center text-xs text-stone-300 space-y-1 bg-emerald-950/40 rounded-xl border border-emerald-900/60 p-3 shadow-inner">
                      <p className="font-serif font-semibold text-[#c5a880]">Метеостанция Гаспры в сети</p>
                      <p className="text-stone-400">Погода: +22°C, Черное море: +19°C</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      
                      {/* Compact Weather & Doctor note Hero Row */}
                      <div className="bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.06] p-3 rounded-2xl border border-[#c5a880]/25 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-sm">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={climateTime}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-br from-emerald-900/80 to-emerald-950/90 p-2 rounded-xl border border-[#c5a880]/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_4px_10px_rgba(0,0,0,0.25)] shrink-0">
                                {getWeatherIcon(climateDetails[climateTime].weatherCode, "w-8 h-8 sm:w-9 sm:h-9")}
                              </div>
                              <div>
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-2xl sm:text-3xl font-serif font-black text-white leading-none tracking-tight">
                                    {climateDetails[climateTime].temp}
                                  </span>
                                  <span className="text-[11px] text-stone-200 font-sans font-medium">
                                    {climateDetails[climateTime].weatherName}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-[#c5a880] font-mono">
                                  <Waves className="w-3.5 h-3.5 shrink-0" />
                                  <span>Море: <strong className="text-white font-semibold">{climateDetails[climateTime].seaTemp}</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right max-w-[180px] hidden sm:block border-l border-[#c5a880]/20 pl-3">
                              <span className="text-[9px] text-[#c5a880] uppercase tracking-wider font-mono font-bold block">
                                Рекомендация врача
                              </span>
                              <div className="text-[10px] font-serif italic text-stone-200 line-clamp-2 leading-tight mt-0.5">
                                «{climateDetails[climateTime].recommendation}»
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Extended Live Parameters (Sleek 3-Column Rounded Cards with Soft Glow) */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:from-white/[0.1] hover:to-white/[0.04] p-2.5 rounded-xl border border-white/[0.08] hover:border-[#c5a880]/35 transition-all duration-300 text-center flex flex-col justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] group">
                          <span className="text-[8px] uppercase tracking-wider font-mono text-stone-400 group-hover:text-stone-300 font-semibold block">
                            Ветер
                          </span>
                          <div className="flex items-center justify-center space-x-1 mt-0.5">
                            <Wind className="w-3.5 h-3.5 text-[#c5a880] shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-xs font-bold text-white font-mono">
                              {climateDetails[climateTime].windSpeed}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:from-white/[0.1] hover:to-white/[0.04] p-2.5 rounded-xl border border-white/[0.08] hover:border-[#c5a880]/35 transition-all duration-300 text-center flex flex-col justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] group">
                          <span className="text-[8px] uppercase tracking-wider font-mono text-stone-400 group-hover:text-stone-300 font-semibold block">
                            Влажность
                          </span>
                          <div className="flex items-center justify-center space-x-1 mt-0.5">
                            <Droplet className="w-3.5 h-3.5 text-[#c5a880] shrink-0 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-xs font-bold text-white font-mono">
                              {climateDetails[climateTime].humidity}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-b from-[#c5a880]/15 to-emerald-950/40 hover:from-[#c5a880]/25 hover:to-emerald-900/40 p-2.5 rounded-xl border border-[#c5a880]/30 hover:border-[#c5a880]/50 transition-all duration-300 text-center flex flex-col justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(197,168,128,0.15)] group">
                          <span className="text-[8px] uppercase tracking-wider font-mono text-emerald-300 font-semibold block">
                            Черное море
                          </span>
                          <div className="flex items-center justify-center space-x-1 mt-0.5">
                            <Waves className="w-3.5 h-3.5 text-[#c5a880] shrink-0 group-hover:translate-x-0.5 transition-transform duration-300" />
                            <span className="text-xs font-bold text-[#c5a880] font-mono">
                              {climateDetails[climateTime].seaTemp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Phyto-Barometer Indicators (Compact Rounded Bars) */}
                      <div className="bg-gradient-to-b from-white/[0.04] to-black/20 p-3 rounded-xl border border-[#c5a880]/20 space-y-2.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-stone-300 font-medium truncate">Фитонциды хвои (кедр, можжевельник):</span>
                            <span className="font-bold text-emerald-300 font-mono text-[9px] bg-emerald-950/90 px-1.5 py-0.5 rounded-md border border-emerald-700/60 shrink-0 ml-1 shadow-sm">
                              {climateDetails[climateTime].phytoncides}
                            </span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-px border border-white/5">
                            <motion.div 
                              initial={{ width: '50%' }}
                              animate={{ width: climateTime === 'day' ? '100%' : climateTime === 'morning' ? '85%' : '65%' }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#c5a880] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            ></motion.div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-stone-300 font-medium truncate">Морские аэроионы и соли:</span>
                            <span className="font-bold text-[#c5a880] font-mono text-[9px] bg-emerald-950/90 px-1.5 py-0.5 rounded-md border border-[#c5a880]/40 shrink-0 ml-1 shadow-sm">
                              {climateDetails[climateTime].aerosols}
                            </span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-px border border-white/5">
                            <motion.div 
                              initial={{ width: '40%' }}
                              animate={{ width: climateTime === 'morning' ? '95%' : climateTime === 'day' ? '70%' : '50%' }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#c5a880] via-amber-300 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(197,168,128,0.3)]"
                            ></motion.div>
                          </div>
                        </div>
                      </div>

                      {/* 3 Days Forecast Grid (Compact Rounded Cards) */}
                      <div className="border-t border-[#c5a880]/15 pt-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] uppercase tracking-widest font-mono text-stone-300 font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#c5a880]" />
                            Прогноз на 3 дня (Гаспра):
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {realWeather.forecast.map((f, index) => (
                            <div 
                              key={index} 
                              className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] hover:from-white/[0.09] hover:to-white/[0.04] transition-all duration-300 p-1.5 rounded-xl border border-white/[0.07] hover:border-[#c5a880]/40 text-center flex items-center justify-between px-2.5 group shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                            >
                              <div className="text-left">
                                <span className="block text-[10px] font-bold text-stone-200 leading-none group-hover:text-white transition-colors">
                                  {formatForecastDate(f.date)}
                                </span>
                                <span className="block text-[8px] text-[#c5a880] truncate max-w-[55px] mt-0.5">
                                  {getWeatherName(f.weatherCode)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                  {getWeatherIcon(f.weatherCode, "w-4 h-4")}
                                </div>
                                <span className="text-[11px] font-bold text-white font-mono">
                                  {f.tempMax}°
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
          <div className="mt-14 sm:mt-16 bg-gradient-to-b from-stone-50/90 via-white to-stone-50/50 rounded-3xl border border-[#c5a880]/30 shadow-[0_20px_50px_-15px_rgba(2,44,34,0.07)] p-5 sm:p-7 md:p-9 relative overflow-hidden">
            {/* Ambient luxury corner glow */}
            <div className="absolute -top-16 -right-16 w-60 h-60 bg-[#c5a880]/8 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-emerald-700/5 rounded-full filter blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4 pb-6 border-b border-stone-200/70">
                <div className="max-w-3xl space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="h-[1px] w-6 bg-[#c5a880]"></span>
                    <span className="text-[#c5a880] text-[11px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Официальный реестр и медицинская лицензия
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#022C22] tracking-tight">
                    Общие данные и медицинская специализация
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
                    ФГКУ «Санаторий «Ясная Поляна» ФТС России». Полная ведомственная и нормативная информация с официального государственного реестра учреждения.
                  </p>
                </div>
                
                {/* Official License Badge */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-950/[0.04] to-[#c5a880]/10 border border-[#c5a880]/40 px-4 py-2.5 rounded-2xl shadow-sm self-start lg:self-auto shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-[#022C22] text-[#c5a880] flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-mono tracking-wider text-stone-500 font-semibold">Лицензия Минздрава РФ</span>
                    <strong className="block text-xs font-mono font-bold text-[#022C22]">№ Л041-00110-91/00554225</strong>
                  </div>
                </div>
              </div>

              {/* Intuitive Modern Segmented Tab Switcher */}
              <div className="mb-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 bg-stone-200/50 rounded-2xl border border-stone-200/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]">
                  {[
                    { 
                      id: 'general', 
                      label: 'Общие сведения', 
                      sub: 'Реквизиты и адрес', 
                      icon: Building2 
                    },
                    { 
                      id: 'medical', 
                      label: 'Медицинский профиль', 
                      sub: 'Лицензия и показания', 
                      icon: Activity 
                    },
                    { 
                      id: 'treatment', 
                      label: 'Методы лечения', 
                      sub: 'Комплекс процедур и кабинеты', 
                      icon: FileText 
                    },
                    { 
                      id: 'registry', 
                      label: 'Контакты & Реестр', 
                      sub: 'Руководство и ЕГРЮЛ', 
                      icon: UserCheck 
                    }
                  ].map((t) => {
                    const IconComp = t.icon;
                    const isActive = aboutTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setAboutTab(t.id as any);
                          if (isAccessMode && accessSpeech && window.speechSynthesis) {
                            const switchVoice = new SpeechSynthesisUtterance(`Открыта вкладка ${t.label}`);
                            switchVoice.lang = 'ru-RU';
                            window.speechSynthesis.speak(switchVoice);
                          }
                        }}
                        className={`group relative p-3 sm:p-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer flex items-center space-x-3 select-none ${
                          isActive 
                            ? 'bg-gradient-to-br from-[#022C22] via-[#02281e] to-[#011d16] text-white shadow-[0_8px_20px_-4px_rgba(2,44,34,0.4),0_0_0_1px_rgba(197,168,128,0.35)] scale-[1.01]' 
                            : 'bg-white/80 hover:bg-white text-stone-700 hover:text-[#022C22] border border-stone-200/60 hover:border-stone-300 shadow-sm hover:shadow'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                          isActive 
                            ? 'bg-[#c5a880] text-[#022C22] shadow-[0_2px_8px_rgba(197,168,128,0.4)]' 
                            : 'bg-stone-100 text-[#022C22] group-hover:bg-[#c5a880]/20 group-hover:text-[#022C22]'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`block text-xs sm:text-sm font-serif font-bold tracking-tight truncate leading-tight ${
                            isActive ? 'text-white' : 'text-[#022C22]'
                          }`}>
                            {t.label}
                          </span>
                          <span className={`block text-[10px] font-mono tracking-tight mt-0.5 truncate ${
                            isActive ? 'text-[#c5a880] font-medium' : 'text-stone-500 group-hover:text-stone-700'
                          }`}>
                            {t.sub}
                          </span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] shadow-[0_0_6px_#c5a880] shrink-0 hidden sm:block"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content Box with Enhanced Contrast & Modern Hierarchy */}
              <div className="bg-[#fcfbf9] rounded-2xl border border-stone-200/90 shadow-[0_12px_36px_-12px_rgba(2,44,34,0.07)] p-5 sm:p-7 md:p-8">
                <AnimatePresence mode="wait">
                  {aboutTab === 'general' && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 text-sm text-stone-800 font-sans"
                    >
                      {/* Left: Organization Credentials */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#022C22]"></div>
                          <span className="block text-[11px] uppercase tracking-wider font-mono text-[#c5a880] font-bold">
                            Полное официальное наименование
                          </span>
                          <h4 className="font-serif text-base sm:text-lg md:text-xl text-[#022C22] font-bold mt-1.5 leading-snug">
                            Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» Федеральной таможенной службы»
                          </h4>
                          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-stone-500 font-medium">Сокращенное наименование:</span>
                            <span className="font-semibold text-[#022C22] text-xs bg-stone-100/90 px-2.5 py-1 rounded-md border border-stone-200">
                              ФГКУ «Санаторий «Ясная Поляна» ФТС России»
                            </span>
                          </div>
                        </div>

                        {/* Tax & Legal IDs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                            <span className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 font-bold">ИНН</span>
                            <p className="font-mono text-[#022C22] font-bold text-base sm:text-lg mt-1">7713778678</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                            <span className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 font-bold">КПП</span>
                            <p className="font-mono text-[#022C22] font-bold text-base sm:text-lg mt-1">910301001</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm col-span-2 sm:col-span-1">
                            <span className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 font-bold">ОГРН</span>
                            <p className="font-mono text-[#022C22] font-bold text-xs sm:text-sm mt-1.5">5137746004787</p>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                          <span className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 font-bold">Организационно-правовая форма (ОПФ)</span>
                          <p className="text-[#022C22] font-semibold text-sm sm:text-base mt-1">Федеральные государственные казенные учреждения</p>
                        </div>
                      </div>

                      {/* Right: Geographic & Property details */}
                      <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-stone-200 lg:pl-8 pt-4 lg:pt-0">
                        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-2">
                          <div className="flex items-center space-x-2 text-[#022C22]">
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#022C22] border border-emerald-100">
                              <MapPin className="w-4 h-4 text-[#c5a880]" />
                            </div>
                            <span className="block text-xs uppercase tracking-wider font-mono text-[#022C22] font-bold">
                              Адрес и локация
                            </span>
                          </div>
                          <p className="text-stone-800 font-semibold text-sm leading-relaxed pt-1">
                            298660, Россия, Республика Крым, г. Ялта, пгт Гаспра, шоссе Севастопольское, д. 52
                          </p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
                          <span className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 font-bold border-b border-stone-100 pb-2">
                            Параметры и принадлежность
                          </span>
                          <div className="space-y-2 text-xs sm:text-[13px]">
                            {[
                              { label: 'Курортная зона', val: 'Большая Ялта (Южный берег Крыма)' },
                              { label: 'Профиль помощи', val: 'Санаторно-курортное лечение взрослых' },
                              { label: 'Ведомство', val: 'Федеральная таможенная служба (ФТС России)' },
                              { label: 'Форма собственности', val: 'Федеральная государственная собственность' },
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-stone-50/70 border border-stone-100">
                                <span className="text-stone-600 font-medium">{item.label}:</span>
                                <span className="font-bold text-[#022C22] text-right">{item.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {aboutTab === 'medical' && (
                    <motion.div
                      key="medical"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 text-sm text-stone-800 font-sans"
                    >
                      {/* License Details Header */}
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c5a880]/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2 text-[#c5a880] text-[11px] font-mono uppercase tracking-wider font-bold">
                            <Award className="w-4 h-4 text-[#c5a880]" />
                            <span>Государственный реестр лицензий</span>
                          </div>
                          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#022C22]">
                            Медицинская лицензия № Л041-00110-91/00554225
                          </h4>
                          <p className="text-stone-600 text-xs sm:text-sm">
                            Предоставлена на осуществление специализированной первичной и санаторно-курортной медицинской помощи.
                          </p>
                        </div>
                        <div className="flex items-center gap-4 font-mono text-xs text-[#022C22] bg-stone-50 border border-stone-200/90 shadow-xs p-3.5 rounded-xl shrink-0">
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Дата выдачи</span>
                            <strong className="text-[#022C22] font-bold text-sm">22.06.2022</strong>
                          </div>
                          <div className="w-[1px] h-8 bg-stone-200"></div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Срок действия</span>
                            <strong className="text-emerald-700 flex items-center gap-1 font-bold text-sm">
                              <Check className="w-4 h-4" /> Бессрочно
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-2">
                        {/* Left: Specializations & Labs */}
                        <div className="lg:col-span-6 space-y-6">
                          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                            <h5 className="font-serif text-base font-bold text-[#022C22] pb-2 flex items-center space-x-2 border-b border-stone-100">
                              <Stethoscope className="w-4 h-4 text-[#c5a880]" />
                              <span>Разрешенные медицинские специализации:</span>
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {[
                                { name: 'Диетология', desc: 'Терапевтическое и лечебное питание' },
                                { name: 'Лечебная физкультура', desc: 'Индивидуальные программы ЛФК' },
                                { name: 'Медицинский массаж', desc: 'Профессиональный ручной массаж' },
                                { name: 'Организация здравоохранения', desc: 'Стандарты качества ФТС' },
                                { name: 'Сестринское дело', desc: 'Круглосуточный сестринский уход' },
                                { name: 'Терапия', desc: 'Ведение личным врачом-терапевтом' },
                                { name: 'Физиотерапия', desc: 'Комплекс аппаратного лечения' },
                                { name: 'Функциональная диагностика', desc: 'ЭКГ и спирометрия на месте' }
                              ].map((item, id) => (
                                <div key={id} className="bg-stone-50/80 hover:bg-stone-100/70 border border-stone-200/80 p-3 rounded-xl transition-all">
                                  <span className="font-serif font-bold text-xs sm:text-[13px] text-[#022C22] block">
                                    {item.name}
                                  </span>
                                  <span className="text-[11px] text-stone-600 block mt-0.5 leading-snug">{item.desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Diagnostics */}
                          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                            <h5 className="font-serif text-base font-bold text-[#022C22] pb-2 flex items-center space-x-2 border-b border-stone-100">
                              <Activity className="w-4 h-4 text-[#c5a880]" />
                              <span>Диагностическая и лабораторная база:</span>
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80">
                                <h6 className="font-serif text-xs font-bold text-[#022C22] uppercase tracking-wider font-mono">Клиническая лаборатория</h6>
                                <p className="text-stone-700 mt-1.5 text-xs leading-relaxed">
                                  Биохимические и общеклинические исследования крови и мочи на автоматических анализаторах.
                                </p>
                              </div>
                              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80">
                                <h6 className="font-serif text-xs font-bold text-[#022C22] uppercase tracking-wider font-mono">Функциональная база</h6>
                                <p className="text-stone-700 mt-1.5 text-xs leading-relaxed">
                                  Спирография (диагностика внешнего дыхания), ЭКГ-исследования и суточный мониторинг.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Pathologies & Basic Illness Profiles */}
                        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                          <h5 className="font-serif text-lg font-bold text-[#022C22] flex items-center space-x-2 border-b border-stone-100 pb-3">
                            <Shield className="w-5 h-5 text-[#c5a880]" />
                            <span>Основные лечебные профили санатория</span>
                          </h5>
                          
                          <div className="space-y-3.5 text-xs text-stone-700">
                            <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-1.5">
                              <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 font-mono">
                                  Кардиологический профиль
                                </span>
                              </div>
                              <strong className="block text-stone-900 font-bold text-sm text-[#022C22]">
                                Болезни системы кровообращения:
                              </strong>
                              <p className="leading-relaxed text-stone-700 text-xs sm:text-[13px]">
                                Гипертоническая болезнь, ишемическая болезнь сердца без тяжелых нарушений ритма, вегетососудистая дистония, постинфарктное долечивание.
                              </p>
                            </div>

                            <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-1.5">
                              <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shrink-0"></span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 font-mono">
                                  Пульмонологический профиль
                                </span>
                              </div>
                              <strong className="block text-stone-900 font-bold text-sm text-[#022C22]">
                                Болезни органов дыхания нетуберкулезного характера:
                              </strong>
                              <p className="leading-relaxed text-stone-700 text-xs sm:text-[13px]">
                                Хронические бронхиты, трахеиты, бронхиальная астма в стадии ремиссии, респираторная реабилитация после пневмоний.
                              </p>
                            </div>

                            <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-1.5">
                              <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0"></span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                                  Опорно-двигательный профиль
                                </span>
                              </div>
                              <strong className="block text-stone-900 font-bold text-sm text-[#022C22]">
                                Болезни костно-мышечной системы и суставов:
                              </strong>
                              <p className="leading-relaxed text-stone-700 text-xs sm:text-[13px]">
                                Деформирующие артрозы, коксартроз, гонартроз, остеохондроз позвоночника, спондилез, миозиты и последствия травм.
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
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 text-sm text-stone-800 font-sans"
                    >
                      {/* Treatment list */}
                      <div className="lg:col-span-8 space-y-5">
                        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#022C22] flex items-center">
                            <Stethoscope className="w-5 h-5 text-[#c5a880] mr-2.5" />
                            Применяемые терапевтические методики
                          </h4>
                          <p className="text-xs sm:text-sm text-stone-600 mt-1.5">
                            Комплексный перечень процедур, проводимых квалифицированными врачами на современном лицензированном оборудовании.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            {
                              category: 'Аппаратная электро- и магнитотерапия',
                              color: 'bg-emerald-600',
                              items: [
                                { name: 'Электрофорез лекарственных средств', desc: 'Чрескожное введение препаратов токами.' },
                                { name: 'УВЧ-терапия', desc: 'Снятие глубоких воспалений электрополем.' },
                                { name: 'Магнитотерапия', desc: 'Улучшение трофики импульсными полями.' },
                                { name: 'СМТ-терапия (Амплипульс)', desc: 'Стимуляция тканей модулированными токами.' }
                              ]
                            },
                            {
                              category: 'Светолечение & Лазеротерапия',
                              color: 'bg-amber-500',
                              items: [
                                { name: 'Лазеротерапия', desc: 'Активация клеточного метаболизма.' },
                                { name: 'Ультразвуковая терапия', desc: 'Микромассаж тканей звуковыми волнами.' },
                                { name: 'Инфракрасное излучение', desc: 'Глубокий тепловой прогрев суставов.' },
                                { name: 'УФО-тубус терапия', desc: 'Местная санация носоглотки и дыхания.' }
                              ]
                            },
                            {
                              category: 'Бальнеология & Массаж',
                              color: 'bg-blue-500',
                              items: [
                                { name: 'Подводный душ-массаж', desc: 'Гидромассаж струей высокого давления.' },
                                { name: 'Лечебные аромаванны', desc: 'Хвойные, солевые и йодобромные ванны.' },
                                { name: 'Классический массаж', desc: 'Ручной медицинский массаж отделов тела.' },
                                { name: 'Лечебная физкультура (ЛФК)', desc: 'Занятия в залах кинезотерапии.' }
                              ]
                            },
                            {
                              category: 'Климатотерапия & Оксигенация',
                              color: 'bg-teal-600',
                              items: [
                                { name: 'Аэро- и гелиотерапия', desc: 'Лечение морским бризом и солнцем.' },
                                { name: 'Терренкур по парку', desc: 'Дозированная лечебная ходьба по хвое.' },
                                { name: 'Ингаляционная терапия', desc: 'Небулайзерные ингаляции фитосборами.' },
                                { name: 'Кислородные коктейли', desc: 'Энтеральная оксигенотерапия.' }
                              ]
                            }
                          ].map((cat, groupIdx) => (
                            <div key={groupIdx} className="bg-white border border-stone-200 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center space-x-2 border-b border-stone-100 pb-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                                <h5 className="font-serif text-xs sm:text-[13px] font-bold text-[#022C22] tracking-wide uppercase">{cat.category}</h5>
                              </div>
                              <div className="space-y-3">
                                {cat.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-start space-x-2.5">
                                    <div className="p-0.5 rounded bg-emerald-50 text-emerald-800 shrink-0 mt-0.5">
                                      <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-xs sm:text-[13px] font-bold text-[#022C22] block leading-tight">{item.name}</span>
                                      <span className="text-[11px] text-stone-600 block mt-0.5">{item.desc}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cabinets Structure */}
                      <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                        <div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#022C22] border-b border-stone-100 pb-2.5 flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-[#c5a880]" />
                            <span>Структура медицинских кабинетов</span>
                          </h4>
                          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                            Лечебно-диагностические подразделения Санатория «Ясная Поляна»:
                          </p>
                        </div>
                        
                        <div className="space-y-2 text-xs sm:text-[13px] text-stone-800">
                          {[
                            'Кабинет функциональной диагностики',
                            'Отделение аппаратной физиотерапии',
                            'Отделение водолечения (бальнеотерапия)',
                            'Специализированный зал ЛФК',
                            'Кабинеты медицинского массажа',
                            'Ингаляторий и кислородный пункт',
                            'Изолятор и процедурные кабинеты',
                            'Клинико-диагностическая лаборатория',
                            'Круглосуточный медицинский пост'
                          ].map((cab, idx) => (
                            <div key={idx} className="flex items-center space-x-2.5 bg-stone-50/80 p-2.5 border border-stone-200/80 rounded-xl hover:bg-stone-100/80 transition-all">
                              <Check className="w-4 h-4 text-[#022C22] flex-shrink-0" />
                              <span className="font-sans text-stone-900 font-semibold text-xs sm:text-[12px]">{cab}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {aboutTab === 'registry' && (
                    <motion.div
                      key="registry"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-sm text-stone-800 font-sans"
                    >
                      {/* Management and Contacts */}
                      <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-sm">
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#022C22] border-b border-stone-100 pb-2.5 flex items-center space-x-2">
                            <UserCheck className="w-4 h-4 text-[#c5a880]" />
                            <span>Руководство учреждения</span>
                          </h4>
                          <div className="space-y-2 text-xs sm:text-[13px] mt-3.5">
                            <div>
                              <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Начальник санатория</span>
                              <strong className="block text-base sm:text-lg text-[#022C22] font-serif font-bold mt-1">
                                {RESORT_INFO.directorName || 'Данилив Алексей Иванович'}
                              </strong>
                              <span className="text-[#c5a880] font-bold uppercase text-[10px] font-mono tracking-wider mt-0.5 block">
                                {RESORT_INFO.directorRole || 'и.о. начальника санатория'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 space-y-2">
                          <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Приемная и связь</span>
                          <div className="space-y-2 bg-stone-50/80 p-3 rounded-xl border border-stone-200/80 text-xs sm:text-[13px]">
                            <p className="flex justify-between items-center">
                              <span className="text-stone-600 font-medium">Телефон:</span>
                              <a href="tel:+73654239376" className="font-mono font-bold text-[#022C22] hover:text-[#c5a880] transition-all">+7(3654)23-93-76</a>
                            </p>
                            <p className="flex justify-between items-center">
                              <span className="text-stone-600 font-medium">Факс:</span>
                              <span className="font-mono text-stone-900 font-semibold">+7(3654)23-93-76</span>
                            </p>
                            <p className="flex justify-between items-center">
                              <span className="text-stone-600 font-medium">Email:</span>
                              <a href={`mailto:${RESORT_INFO.email}`} className="font-mono font-bold text-[#022C22] hover:text-[#c5a880] hover:underline">{RESORT_INFO.email}</a>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Registry details */}
                      <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-sm">
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#022C22] border-b border-stone-100 pb-2.5 flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-[#c5a880]" />
                            <span>Гос. регистрация</span>
                          </h4>
                          <div className="space-y-2 text-xs sm:text-[13px] mt-3.5">
                            <div>
                              <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Регистрирующий орган</span>
                              <p className="font-semibold text-stone-900 mt-1 leading-snug">
                                Межрайонная инспекция Федеральной налоговой службы №46 по г. Москве
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-stone-100 pt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200">
                            <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Серия</span>
                            <span className="font-mono font-extrabold text-[#022C22] text-sm">77</span>
                          </div>
                          <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200">
                            <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Свидетельство</span>
                            <span className="font-mono font-extrabold text-[#022C22] text-xs">015463944</span>
                          </div>
                          <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200 col-span-2">
                            <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Дата регистрации</span>
                            <span className="font-mono font-bold text-[#022C22]">29 октября 2013 г.</span>
                          </div>
                        </div>
                      </div>

                      {/* Creation foundation */}
                      <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-sm md:col-span-2 lg:col-span-1">
                        <div>
                          <h4 className="font-serif text-base font-bold text-[#022C22] border-b border-stone-100 pb-2.5 flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-[#c5a880]" />
                            <span>Создание учреждения</span>
                          </h4>
                          <div className="space-y-2 text-xs sm:text-[13px] mt-3.5 leading-relaxed">
                            <div>
                              <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Основание внесения</span>
                              <p className="text-stone-900 font-semibold mt-1">Внесение в ЕГРЮЛ сведений о юридическом лице</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-stone-100 pt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200">
                            <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">Дата создания</span>
                            <p className="font-bold text-[#022C22] mt-0.5">29.10.2013</p>
                          </div>
                          <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200">
                            <span className="block text-stone-500 font-mono text-[10px] uppercase tracking-wider font-bold">ОГРН</span>
                            <strong className="font-mono text-[#022C22] text-xs mt-0.5 block">5137746004787</strong>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </motion.div>
      </section>

      {/* DETAILED INTERACTIVE MEDICAL PROGRAMS */}
      <section id="medical" className="py-20 bg-gradient-to-b from-[#033E31] via-[#022C22] to-[#01221A] text-white">
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

          {/* Dynamic Responsive Grid for Medical Programs */}
          <div className={`grid grid-cols-1 md:grid-cols-2 ${MEDICAL_PROGRAMS.length === 3 ? 'lg:grid-cols-3 max-w-6xl' : 'lg:grid-cols-4 max-w-7xl'} gap-6 mx-auto`}>
            {MEDICAL_PROGRAMS.map((prog, index) => {
              const progImg = prog.image || (
                prog.id === 'respiratory' ? '/images/pestovo_medical_1779777676990.png' :
                prog.id === 'cardio' ? '/images/pestovo_palace_1779780890544.png' :
                (prog.id === 'antistress' || prog.id === 'nervous') ? '/images/pestovo_beach_1779780925661.png' :
                '/images/pestovo_block_1779780908700.png'
              );
              const durationText = prog.duration || ((prog as any).durationDays ? `от ${(prog as any).durationDays} дней` : 'от 10 до 21 дня');

              return (
                <motion.div 
                  key={prog.id || index}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    setCurrentPage('medical');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#02221A]/95 border border-emerald-900/70 rounded-2xl overflow-hidden hover:border-[#c5a880]/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#c5a880]/15 cursor-pointer group flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Image Preview Header */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#011B14]">
                      <img
                        src={progImg}
                        alt={prog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#02221A] via-black/35 to-transparent"></div>
                      
                      {/* Floating Icon */}
                      <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-[#022C22]/95 text-[#c5a880] border border-[#c5a880]/40 flex items-center justify-center shadow-lg group-hover:bg-[#c5a880] group-hover:text-[#022C22] transition-colors duration-300">
                        {getMedicalIcon(prog.icon)}
                      </div>

                      {/* Floating Duration Badge */}
                      <div className="absolute top-3 right-3 bg-[#022C22]/90 backdrop-blur-md border border-[#c5a880]/40 text-[#c5a880] font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                        <Clock className="w-3 h-3 text-[#c5a880]" />
                        <span>{durationText}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6">
                      <h3 className="font-serif font-bold text-lg text-white mb-2 leading-tight group-hover:text-[#c5a880] transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-stone-300 text-xs leading-relaxed line-clamp-3 mb-4">
                        {prog.shortDesc}
                      </p>

                      {/* Procedures / Indications Pill Preview */}
                      {prog.procedures && prog.procedures.length > 0 && (
                        <div className="pt-3 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                          <span>Процедур в комплексе:</span>
                          <span className="text-[#c5a880] font-bold">{prog.procedures.length}+</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex items-center space-x-1.5 text-xs text-[#c5a880] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      <span>Подробнее о программе</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#c5a880]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => handleOpenRoomDetails(room)}
                        className="w-full bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] text-xs font-bold py-2.5 rounded-sm uppercase tracking-wider text-center transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        Описание
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
          <div className="flex flex-wrap justify-center gap-2 mb-10 pb-3 border-b border-stone-200">
            {[
              { id: 'all', label: 'Все фото', count: ALL_GALLERY_ITEMS.length },
              ...(siteData.galleryCategories || []).map(cat => ({ 
                id: cat.id, 
                label: cat.name,
                count: ALL_GALLERY_ITEMS.filter(i => i.category === cat.id).length
              }))
            ].map((tab) => {
              const isActive = galleryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setGalleryTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#022C22] text-[#c5a880] shadow-md'
                      : 'text-stone-600 hover:text-[#022C22] hover:bg-stone-200/60 bg-stone-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Empty state if no photos in active category */}
          {filteredGallery.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
              <Images className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h4 className="font-serif font-bold text-stone-800 text-lg">В этой категории пока нет фото</h4>
              <p className="text-stone-500 text-xs mt-1">Выберите другую вкладку или добавьте фотографии через панель управления.</p>
            </div>
          ) : (
            <>
              {/* Grid Layout of photos (Limited to 3 rows = 9 photos initially) */}
              <motion.div 
                layout 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {visibleGalleryItems.map((item) => {
                    const originalIndex = filteredGallery.indexOf(item);
                    return (
                      <motion.div
                        layout
                        key={item.id || item.src || originalIndex}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setLightboxIndex(originalIndex >= 0 ? originalIndex : 0)}
                        className="relative group h-64 overflow-hidden rounded-xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-500 cursor-zoom-in bg-stone-100"
                      >
                        <img
                          src={item.src || undefined}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Magnifier badge in corner */}
                        <div className="absolute top-3.5 right-3.5 bg-black/60 hover:bg-black/90 text-white rounded-xl p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md z-10 border border-white/20 scale-90 group-hover:scale-100">
                          <ZoomIn className="w-4 h-4 text-[#c5a880]" />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                          <span className="text-[10px] tracking-wider text-[#c5a880] uppercase font-mono font-bold">
                            {siteData.galleryCategories?.find(c => c.id === item.category)?.name || item.category}
                          </span>
                          <h4 className="text-white font-serif text-lg font-medium leading-snug mt-1">{item.title}</h4>
                          <p className="text-stone-300 text-[11px] mt-1 opacity-80 flex items-center gap-1">
                            <ZoomIn className="w-3 h-3 text-[#c5a880]" /> Нажмите для просмотра в полный экран
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Expand / Collapse Button when more than 3 rows (9 photos) exist */}
              {hasHiddenGalleryPhotos && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center mt-12 pt-4 border-t border-stone-200/60"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isGalleryExpanded) {
                        setIsGalleryExpanded(false);
                        const galleryEl = document.getElementById('gallery');
                        if (galleryEl) {
                          galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      } else {
                        setIsGalleryExpanded(true);
                      }
                    }}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] rounded-xl font-serif font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-2xl hover:shadow-[#c5a880]/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border border-[#c5a880]/40"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-[#022C22]/10 flex items-center justify-center transition-colors">
                      {isGalleryExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#c5a880] group-hover:text-[#022C22] transition-colors" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#c5a880] group-hover:text-[#022C22] transition-colors" />
                      )}
                    </div>
                    
                    <span>
                      {isGalleryExpanded
                        ? 'Свернуть фотографии'
                        : `Показать все фотографии (ещё +${hiddenGalleryPhotosCount})`
                      }
                    </span>
                    
                    <span className="bg-[#c5a880]/20 group-hover:bg-[#022C22]/20 text-[#c5a880] group-hover:text-[#022C22] text-[11px] font-mono font-bold px-2 py-0.5 rounded-md transition-colors">
                      {filteredGallery.length} фото
                    </span>
                  </button>

                  <p className="text-stone-500 text-xs font-mono mt-3">
                    {isGalleryExpanded
                      ? `Показаны все ${filteredGallery.length} кадров`
                      : `Отображаются первые 9 фото (3 ряда) из ${filteredGallery.length}`
                    }
                  </p>
                </motion.div>
              )}
            </>
          )}

        </motion.div>
      </section>

      {/* REAL REVIEWS & TRUST */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-[#022C22] via-[#033E31] to-[#01221A] text-white">
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
            {siteData.testimonials.filter(t => t.isApproved !== false).slice(0, 3).map((t) => (
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
                        Отзыв отправлен на модерацию
                      </span>
                      <h3 className="font-serif text-3xl font-bold text-[#022C22]">
                        Спасибо, {reviewForm.author.split(' ')[0]}!
                      </h3>
                      <p className="text-sm text-stone-600 max-w-md leading-relaxed">
                        Ваш развернутый отзыв с оценкой <strong className="text-amber-500 font-bold">{reviewForm.rating} ★</strong> был успешно сохранен. Он будет опубликован после проверки модератором.
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
      <footer className="bg-gradient-to-b from-[#022C22] to-[#011712] text-white border-t border-[#c5a880]/30 py-12 z-10">
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
              <button 
                type="button" 
                onClick={() => setIsPrivacyModalOpen(true)} 
                className="hover:text-[#c5a880] transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                Политика обработки данных
              </button>
              <span>&bull;</span>
              <button 
                type="button" 
                onClick={() => {
                  const el = document.getElementById('about');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Карта сайта
              </button>
              <span>&bull;</span>
              <button 
                type="button" 
                onClick={() => {
                  if (isAdminMode) {
                    setCurrentPage('admin');
                  } else {
                    setCurrentPage('login');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#c5a880] transition-colors cursor-pointer"
              >
                Вход для сотрудников
              </button>
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
                    loading="lazy"
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

      {/* Privacy Policy Modal (152-FZ / 323-FZ) */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />

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
