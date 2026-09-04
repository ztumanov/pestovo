import React, { useState, useEffect } from 'react';
import { useAdminData, SiteData, deepCleanAssetPaths } from '../context/AdminDataContext';
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
  FileText,
  Newspaper,
  Check,
  Edit2,
  Users,
  Shield,
  Key,
  UserCheck,
  Globe,
  Loader2,
  HardDrive,
  RefreshCw,
  Download,
  Upload,
  UploadCloud,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, MedicalProgram, Testimonial, FAQItem, NewsArticle, ServiceItem, GalleryItem, GalleryCategory, AdminUser, DocumentItem } from '../types';
import { calculateStorageSize, clearStorageData, compressImageFile } from '../lib/storage';

/**
 * High-efficiency compression utility that downscales and optimizes images
 * to prevent memory overflow and guarantee smooth hosting synchronization
 */
function compressImage(file: File, maxDim: number, quality: number, callback: (base64: string) => void) {
  // Use adaptive dimension (default max 1280px) and quality 0.78 for optimal crispness + minimal KB
  const targetDim = Math.min(maxDim || 1280, 1280);
  const targetQuality = Math.min(quality || 0.78, 0.82);
  
  compressImageFile(file, targetDim, targetQuality)
    .then((result) => {
      callback(result);
    })
    .catch(() => {
      const reader = new FileReader();
      reader.onload = (e) => callback((e.target?.result as string) || '');
      reader.readAsDataURL(file);
    });
}

export default function AdminPage({ onBackToHome }: { onBackToHome: () => void }) {
  const {
    siteData,
    updateSiteData,
    updateSection,
    updateSections,
    resetToDefault,
    isAdminMode,
    setIsAdminMode,
    activeSettingsTab,
    setActiveSettingsTab,
    currentPage,
    setCurrentPage
  } = useAdminData();

  // Temporary local states for editing
  const [localResortInfo, setLocalResortInfo] = useState({ ...(siteData?.resortInfo || {}) });
  const [localHero, setLocalHero] = useState({ ...(siteData?.hero || {}) });
  const [localImages, setLocalImages] = useState({ ...(siteData?.images || {}) });
  const [localVideos, setLocalVideos] = useState({ ...(siteData?.videos || {}) });
  const [localExtraImages, setLocalExtraImages] = useState({ ...(siteData?.extraImages || {}) });

  // For managing lists
  const [rooms, setRooms] = useState<Room[]>([...(siteData?.rooms || [])]);
  const [medPrograms, setMedPrograms] = useState<MedicalProgram[]>([...(siteData?.medicalPrograms || [])]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([...(siteData?.testimonials || [])]);
  const [faqs, setFaqs] = useState<FAQItem[]>([...(siteData?.faqs || [])]);
  const [news, setNews] = useState<NewsArticle[]>([...(siteData?.news || [])]);
  const [services, setServices] = useState<ServiceItem[]>([...(siteData?.services || [])]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([...(siteData?.gallery || [])]);
  const [galleryCats, setGalleryCats] = useState<GalleryCategory[]>([...(siteData?.galleryCategories || [])]);
  const [usersList, setUsersList] = useState<AdminUser[]>([...(siteData?.users || [])]);
  const [documents, setDocuments] = useState<DocumentItem[]>([...(siteData?.documents || [])]);

  // Selected sub-items being edited in forms
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // States for adding new items
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);

  // User form state
  const [userForm, setUserForm] = useState<Omit<AdminUser, 'id'>>({
    username: '',
    password: '',
    role: 'Редактор'
  });

  // State to show save indicator
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [slidesDragActive, setSlidesDragActive] = useState(false);
  const [slidesUploadError, setSlidesUploadError] = useState<string | null>(null);

  // Gallery Item states
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<string>('');
  const [newItemSrc, setNewItemSrc] = useState('');
  const [newImageError, setNewImageError] = useState<string | null>(null);
  const [newDragActive, setNewDragActive] = useState(false);

  // Gallery Category form states
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatValue, setEditingCatValue] = useState('');
  const [catError, setCatError] = useState<string | null>(null);

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
    if (!siteData) return;
    setLocalResortInfo({ ...(siteData.resortInfo || {}) });
    setLocalHero({ ...(siteData.hero || {}) });
    setLocalImages({ ...(siteData.images || {}) });
    setLocalVideos({ ...(siteData.videos || {}) });
    setLocalExtraImages({ ...(siteData.extraImages || {}) });
    setRooms([...(siteData.rooms || [])]);
    setMedPrograms([...(siteData.medicalPrograms || [])]);
    setTestimonials([...(siteData.testimonials || [])]);
    setFaqs([...(siteData.faqs || [])]);
    setNews([...(siteData.news || [])]);
    setServices([...(siteData.services || [])]);
    setGalleryItems([...(siteData.gallery || [])]);
    setGalleryCats([...(siteData.galleryCategories || [])]);
    setDocuments([...(siteData.documents || [])]);
    setUsersList([...(siteData.users || [])]);
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
            Для управления содержимым санатория «Ясная Поляна» необходимо войти с правами администратора.
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
    updateSections({
      hero: localHero,
      images: localImages,
      videos: localVideos
    });
    triggerSuccess();
  };

  const handleSaveMedia = () => {
    updateSections({
      hero: localHero,
      images: localImages,
      videos: localVideos,
      extraImages: localExtraImages,
      gallery: galleryItems,
      galleryCategories: galleryCats
    });
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getConsolidatedSiteData = (): SiteData => {
    return deepCleanAssetPaths({
      ...siteData,
      resortInfo: localResortInfo,
      hero: localHero,
      images: localImages,
      videos: localVideos,
      extraImages: localExtraImages,
      rooms,
      medicalPrograms: medPrograms,
      testimonials,
      faqs,
      news,
      documents,
      gallery: galleryItems,
      galleryCategories: galleryCats,
      users: usersList,
      services
    });
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

  // GALLERY HANDLERS
  const handleUpdateGalleryItem = (itemId: string, updatedItem: GalleryItem) => {
    const nextGallery = galleryItems.map(g => g.id === itemId ? updatedItem : g);
    setGalleryItems(nextGallery);
    updateSection('gallery', nextGallery);
    triggerSuccess();
  };

  const handleDeleteGalleryItem = (itemId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить фотографию из галереи?',
      message: 'Вы уверены, что хотите навсегда удалить эту фотографию из галереи внизу главной страницы?',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextGallery = galleryItems.filter(g => g.id !== itemId);
        setGalleryItems(nextGallery);
        updateSection('gallery', nextGallery);
        triggerSuccess();
      }
    });
  };

  const handleAddGalleryItem = (newItem: Omit<GalleryItem, 'id'>) => {
    const created: GalleryItem = {
      ...newItem,
      id: `gal-${Date.now()}`
    };
    const nextGallery = [...galleryItems, created];
    setGalleryItems(nextGallery);
    updateSection('gallery', nextGallery);
    triggerSuccess();
  };

  // GALLERY CATEGORIES HANDLERS
  const handleAddCategory = () => {
    if (!newCatId.trim() || !newCatName.trim()) {
      setCatError('Заполните латинский ID и русское название категории');
      return;
    }
    const cleanId = newCatId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanId) {
      setCatError('ID категории должен содержать латинские буквы или цифры');
      return;
    }
    if (galleryCats.some(c => c.id === cleanId)) {
      setCatError('Категория с таким ID уже существует');
      return;
    }
    const created = { id: cleanId, name: newCatName.trim() };
    const nextCats = [...galleryCats, created];
    setGalleryCats(nextCats);
    updateSection('galleryCategories', nextCats);
    setNewCatId('');
    setNewCatName('');
    setCatError(null);
    triggerSuccess();
  };

  const handleUpdateCategory = (catId: string, newName: string) => {
    if (!newName.trim()) return;
    const nextCats = galleryCats.map(c => c.id === catId ? { ...c, name: newName.trim() } : c);
    setGalleryCats(nextCats);
    updateSection('galleryCategories', nextCats);
    setEditingCatId(null);
    triggerSuccess();
  };

  const handleDeleteCategory = (catId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить категорию?',
      message: 'Вы уверены, что хотите удалить эту категорию? Все фотографии, привязанные к ней, останутся в галерее, но их категория сбросится.',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextCats = galleryCats.filter(c => c.id !== catId);
        setGalleryCats(nextCats);
        updateSection('galleryCategories', nextCats);
        
        // Update gallery item category if it was deleted
        const nextGallery = galleryItems.map(g => g.category === catId ? { ...g, category: nextCats[0]?.id || '' } : g);
        setGalleryItems(nextGallery);
        updateSection('gallery', nextGallery);

        triggerSuccess();
      }
    });
  };

  // USERS HANDLERS
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.username.trim() || !userForm.password?.trim()) {
      alert('Заполните логин и пароль пользователя');
      return;
    }
    
    const nextUsername = userForm.username.trim();
    // Check if user already exists
    if (usersList.some(u => u.username.toLowerCase() === nextUsername.toLowerCase())) {
      alert('Пользователь с таким логином уже существует в системе');
      return;
    }

    const created: AdminUser = {
      id: `user-${Date.now()}`,
      username: nextUsername,
      password: userForm.password,
      role: userForm.role || 'Редактор'
    };

    const nextUsers = [...usersList, created];
    setUsersList(nextUsers);
    updateSection('users', nextUsers);
    setShowAddUser(false);
    setUserForm({ username: '', password: '', role: 'Редактор' });
    triggerSuccess();
  };

  const handleUpdateUser = (userId: string, updatedUser: AdminUser) => {
    const nextUsers = usersList.map(u => u.id === userId ? updatedUser : u);
    setUsersList(nextUsers);
    updateSection('users', nextUsers);
    setEditingUserId(null);
    triggerSuccess();
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = usersList.find(u => u.id === userId);
    if (!userToDelete) return;

    if (userToDelete.username === 'admin') {
      alert('Вы не можете удалить главного системного пользователя admin для предотвращения блокировки панели!');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Удалить пользователя?',
      message: `Вы действительно хотите навсегда аннулировать учетную запись сотрудника «${userToDelete.username}»? Он потеряет доступ к панели управления.`,
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextUsers = usersList.filter(u => u.id !== userId);
        setUsersList(nextUsers);
        updateSection('users', nextUsers);
        triggerSuccess();
      }
    });
  };

  // NEWS HANDLERS
  const handleUpdateNews = (newsId: string, updatedNews: NewsArticle) => {
    const nextNews = news.map(n => n.id === newsId ? updatedNews : n);
    setNews(nextNews);
    updateSection('news', nextNews);
    setEditingNewsId(null);
    triggerSuccess();
  };

  const handleDeleteNews = (newsId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить новость?',
      message: 'Вы уверены, что хотите удалить эту новость?',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextNews = news.filter(n => n.id !== newsId);
        setNews(nextNews);
        updateSection('news', nextNews);
        triggerSuccess();
      }
    });
  };

  const handleAddNews = (newArticle: Omit<NewsArticle, 'id'>) => {
    const created: NewsArticle = {
      ...newArticle,
      id: `news-${Date.now()}`
    };
    const nextNews = [created, ...news];
    setNews(nextNews);
    updateSection('news', nextNews);
    setShowAddNews(false);
    triggerSuccess();
  };

  // SERVICES HANDLERS
  const handleUpdateService = (serviceId: string, updatedService: ServiceItem) => {
    const nextServices = services.map(s => s.id === serviceId ? updatedService : s);
    setServices(nextServices);
    updateSection('services', nextServices);
    setEditingServiceId(null);
    triggerSuccess();
  };

  const handleDeleteService = (serviceId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить услугу?',
      message: 'Вы уверены, что хотите окончательно удалить эту услугу из каталога?',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextServices = services.filter(s => s.id !== serviceId);
        setServices(nextServices);
        updateSection('services', nextServices);
        triggerSuccess();
      }
    });
  };

  const handleAddService = (newService: Omit<ServiceItem, 'id'>) => {
    const created: ServiceItem = {
      ...newService,
      id: `service-${Date.now()}`
    };
    const nextServices = [...services, created];
    setServices(nextServices);
    updateSection('services', nextServices);
    setShowAddService(false);
    triggerSuccess();
  };

  // DOCUMENTS HANDLERS
  const handleUpdateDocument = (docId: string, updatedDoc: DocumentItem) => {
    const nextDocs = documents.map(d => d.id === docId ? updatedDoc : d);
    setDocuments(nextDocs);
    updateSection('documents', nextDocs);
    setEditingDocId(null);
    triggerSuccess();
  };

  const handleDeleteDocument = (docId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Удалить официальный документ?',
      message: 'Вы уверены, что хотите навсегда убрать этот документ? Его нельзя будет восстановить, и он исчезнет из общего перечня на сайте.',
      confirmText: 'Да, удалить',
      confirmClass: 'bg-red-600 hover:bg-red-750 text-white',
      onConfirm: () => {
        const nextDocs = documents.filter(d => d.id !== docId);
        setDocuments(nextDocs);
        updateSection('documents', nextDocs);
        triggerSuccess();
      }
    });
  };

  const handleAddDocument = (newDoc: Omit<DocumentItem, 'id'>) => {
    const created: DocumentItem = {
      ...newDoc,
      id: `doc-${Date.now()}`
    };
    const nextDocs = [...documents, created];
    setDocuments(nextDocs);
    updateSection('documents', nextDocs);
    setShowAddDoc(false);
    triggerSuccess();
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Пожалуйста, выберите файл изображения (png, jpg, jpeg, webp).');
      return;
    }

    setUploadError(null);
    compressImage(file, 1200, 0.8, (base64) => {
      setLocalImages(prev => ({ ...prev, hero: base64 }));
      setLocalHero(prev => ({ ...prev, defaultBackgroundMode: 'photo' }));
    });
  };

  const handleVideoFile = (file: File) => {
    // Both .mov and .mp4 are supported
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mov') || file.name.endsWith('.MOV') || file.name.endsWith('.mp4') || file.name.endsWith('.MP4');
    if (!isVideo) {
      setVideoUploadError('Пожалуйста, выберите файл видео (.mp4 или .mov).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setVideoUploadError('Файл слишком большой. Для бесперебойной интеграции в браузере рекомендуется использовать сжатые ролики до 15 МБ.');
      return;
    }

    setVideoUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const resultStr = e.target.result;
        setLocalVideos(prev => ({ ...prev, coastalNatureDirect: resultStr }));
        setLocalHero(prev => ({ ...prev, defaultBackgroundMode: 'video_nature' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSlidesUpload = (file: File) => {
    const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov') || file.name.toLowerCase().endsWith('.mp4');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setSlidesUploadError('Пожалуйста, выберите корректное изображение или видеофайл (.MOV, .MP4, .JPG, .PNG, .WEBP).');
      return;
    }

    const maxSize = isVideo ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    const maxSizeMB = isVideo ? '20 МБ' : '10 МБ';

    if (file.size > maxSize) {
      setSlidesUploadError(`Файл слишком большой. Для фоновых слайдов лимит размера составляет ${maxSizeMB}.`);
      return;
    }

    setSlidesUploadError(null);

    const onMediaLoaded = (base64Data: string) => {
      const currentSlides = (localHero as any).slides || [];
      const newSlide = {
        id: `slide-${Date.now()}`,
        type: isVideo ? 'video' : 'photo',
        url: base64Data
      };
      const nextSlides = [...currentSlides, newSlide];
      const updatedHero = {
        ...localHero,
        slides: nextSlides,
        defaultBackgroundMode: (localHero.defaultBackgroundMode === 'video' && !isVideo) ? 'all' : (localHero.defaultBackgroundMode || 'all')
      };
      setLocalHero(updatedHero);
      
      let nextImages = localImages;
      if (!isVideo) {
        nextImages = { ...localImages, hero: base64Data };
        setLocalImages(nextImages);
      }

      updateSections({
        hero: updatedHero,
        images: nextImages
      });
      triggerSuccess();
    };

    if (isImage) {
      compressImage(file, 1200, 0.8, onMediaLoaded);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          onMediaLoaded(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'hero', name: 'Главная', icon: Home },
    { id: 'general', name: 'Контакты & Инфо', icon: Phone },
    { id: 'rooms', name: 'Каталог Номеров', icon: Building, badge: rooms?.length || 0 },
    { id: 'medical', name: 'Программы Лечения', icon: HeartHandshake, badge: medPrograms?.length || 0 },
    { id: 'testimonials', name: 'Отзывы Гостей', icon: MessageSquare, badge: testimonials?.length || 0 },
    { id: 'faq', name: 'Вопросы & Ответы', icon: HelpCircle, badge: faqs?.length || 0 },
    { id: 'news', name: 'Новости', icon: Newspaper, badge: news?.length || 0 },
    { id: 'documents', name: 'Реестр Документов', icon: FileText, badge: documents?.length || 0 },
    { id: 'media', name: 'Медиа & Ссылки', icon: Folder, badge: galleryItems?.length || 0 },
    { id: 'users', name: 'Пользователи', icon: Users, badge: usersList?.length || 0 },
    { id: 'publish', name: 'Сохранить на хостинг', icon: Database },
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
                  setEditingServiceId(null);
                  setEditingUserId(null);
                  setShowAddRoom(false);
                  setShowAddMed(false);
                  setShowAddTest(false);
                  setShowAddFaq(false);
                  setShowAddService(false);
                  setShowAddUser(false);
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Категорий Номеров</span>
                <span className="text-lg font-black block font-mono text-stone-800">{rooms?.length || 0}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Программ Лечения</span>
                <span className="text-lg font-black block font-mono text-stone-800">{medPrograms?.length || 0}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Отзывов Гостей</span>
                <span className="text-lg font-black block font-mono text-stone-800">{testimonials?.length || 0}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Частых Вопросов</span>
                <span className="text-lg font-black block font-mono text-stone-800">{faqs?.length || 0}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-stone-200/60 rounded-xl p-4 flex items-center space-x-3.5 shadow-sm">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase">Реестр Документов</span>
                <span className="text-lg font-black block font-mono text-stone-800">{documents?.length || 0}</span>
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

                {/* HERO HIGHLIGHTS / STATS CONFIGURATION SECTION */}
                <div className="border-t border-stone-100 pt-6 mt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#c5a880]" />
                        Блок официальных ориентиров / Статуса (4 карточки)
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed mt-0.5">
                        Официальные ведомственные ориентиры и лицензии санатория под главным заголовком. Вы можете изменить их или полностью скрыть.
                      </p>
                    </div>

                    {/* Toggle show/hide block switch */}
                    <label className="inline-flex items-center gap-2.5 cursor-pointer bg-stone-50 hover:bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200 shrink-0 select-none">
                      <input 
                        type="checkbox"
                        checked={localHero.showStats !== false}
                        onChange={e => setLocalHero({ ...localHero, showStats: e.target.checked })}
                        className="w-4 h-4 text-[#022C22] rounded focus:ring-[#c5a880] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#022C22]">Отображать на сайте</span>
                    </label>
                  </div>

                  {localHero.showStats !== false && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                      {(localHero.stats || [
                        { value: 'ФТС России', label: 'Ведомственный статус', description: 'Федеральное государственное казенное учреждение' },
                        { value: '№ Л041-00110-91', label: 'Лицензия Минздрава РФ', description: 'Официальный медицинский реестр' },
                        { value: 'Гаспра • ЮБК', label: 'Южный берег Крыма', description: 'Севастопольское шоссе, 52' },
                        { value: 'Климатотерапия', label: 'Профиль оздоровления', description: 'Терапия, реабилитация и ЛФК' }
                      ]).map((stat, idx) => (
                        <div key={idx} className="bg-[#FAF9F6] border border-stone-200 p-4 rounded-xl space-y-2 shadow-sm">
                          <span className="block text-[10px] font-black uppercase text-[#022C22]/60 tracking-wider">Карточка {idx + 1}</span>
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Заголовок / Статус</label>
                            <input 
                              type="text"
                              value={stat.value}
                              onChange={e => {
                                const defaultStats = [
                                  { value: 'ФТС России', label: 'Ведомственный статус', description: 'Федеральное государственное казенное учреждение' },
                                  { value: '№ Л041-00110-91', label: 'Лицензия Минздрава РФ', description: 'Официальный медицинский реестр' },
                                  { value: 'Гаспра • ЮБК', label: 'Южный берег Крыма', description: 'Севастопольское шоссе, 52' },
                                  { value: 'Климатотерапия', label: 'Профиль оздоровления', description: 'Терапия, реабилитация и ЛФК' }
                                ];
                                const statsArray = localHero.stats && localHero.stats.length > 0 ? localHero.stats : defaultStats;
                                const newStats = [...statsArray];
                                if (newStats[idx]) {
                                  newStats[idx] = { ...newStats[idx], value: e.target.value };
                                  setLocalHero({ ...localHero, stats: newStats });
                                }
                              }}
                              placeholder="Например: ФТС России"
                              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-bold font-sans text-stone-800 focus:outline-none focus:border-[#c5a880]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Подзаголовок</label>
                            <input 
                              type="text"
                              value={stat.label}
                              onChange={e => {
                                const defaultStats = [
                                  { value: 'ФТС России', label: 'Ведомственный статус', description: 'Федеральное государственное казенное учреждение' },
                                  { value: '№ Л041-00110-91', label: 'Лицензия Минздрава РФ', description: 'Официальный медицинский реестр' },
                                  { value: 'Гаспра • ЮБК', label: 'Южный берег Крыма', description: 'Севастопольское шоссе, 52' },
                                  { value: 'Климатотерапия', label: 'Профиль оздоровления', description: 'Терапия, реабилитация и ЛФК' }
                                ];
                                const statsArray = localHero.stats && localHero.stats.length > 0 ? localHero.stats : defaultStats;
                                const newStats = [...statsArray];
                                if (newStats[idx]) {
                                  newStats[idx] = { ...newStats[idx], label: e.target.value };
                                  setLocalHero({ ...localHero, stats: newStats });
                                }
                              }}
                              placeholder="Например: Ведомственный статус"
                              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 font-medium focus:outline-none focus:border-[#c5a880]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Краткое пояснение</label>
                            <input 
                              type="text"
                              value={(stat as any).description || ''}
                              onChange={e => {
                                const defaultStats = [
                                  { value: 'ФТС России', label: 'Ведомственный статус', description: 'Федеральное государственное казенное учреждение' },
                                  { value: '№ Л041-00110-91', label: 'Лицензия Минздрава РФ', description: 'Официальный медицинский реестр' },
                                  { value: 'Гаспра • ЮБК', label: 'Южный берег Крыма', description: 'Севастопольское шоссе, 52' },
                                  { value: 'Климатотерапия', label: 'Профиль оздоровления', description: 'Терапия, реабилитация и ЛФК' }
                                ];
                                const statsArray = localHero.stats && localHero.stats.length > 0 ? localHero.stats : defaultStats;
                                const newStats = [...statsArray];
                                if (newStats[idx]) {
                                  newStats[idx] = { ...newStats[idx], description: e.target.value };
                                  setLocalHero({ ...localHero, stats: newStats });
                                }
                              }}
                              placeholder="Необязательно"
                              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-[11px] text-stone-600 focus:outline-none focus:border-[#c5a880]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* BACKGROUND IMAGE/VIDEO SLIDES CONFIGURATION SECTION */}
                <div className="border-t border-stone-100 pt-6 mt-6 space-y-4">
                  <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#c5a880]" />
                    Фоновое оформление главного экрана (Слайд-шоу)
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Настройте автоматическое слайд-шоу для фона главной страницы. Вы можете загружать как <strong>фотографии</strong> (JPG, PNG, WEBP), так и <strong>короткие видеоролики</strong> (в формате .MOV или .MP4). Они будут сменять друг друга с мягким эффектом затухания.
                  </p>

                  {/* Background Display Mode Switcher */}
                  <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200/80 space-y-3">
                    <label className="block text-xs font-bold text-[#022C22] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#c5a880]" />
                      Режим отображения медиафайлов на первом экране
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updatedHero = { ...localHero, defaultBackgroundMode: 'all' as const };
                          setLocalHero(updatedHero);
                          updateSection('hero', updatedHero);
                          triggerSuccess();
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          (!localHero.defaultBackgroundMode || localHero.defaultBackgroundMode === 'all')
                            ? 'bg-[#022C22] border-transparent text-[#FAF9F6] shadow-sm'
                            : 'bg-white border-stone-200 text-stone-600 hover:text-[#022C22] hover:bg-stone-50'
                        }`}
                      >
                        Все слайды (Фото + Видео)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedHero = { ...localHero, defaultBackgroundMode: 'photo' as const };
                          setLocalHero(updatedHero);
                          updateSection('hero', updatedHero);
                          triggerSuccess();
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          localHero.defaultBackgroundMode === 'photo'
                            ? 'bg-[#022C22] border-transparent text-[#FAF9F6] shadow-sm'
                            : 'bg-white border-stone-200 text-stone-600 hover:text-[#022C22] hover:bg-stone-50'
                        }`}
                      >
                        Только фотографии
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedHero = { ...localHero, defaultBackgroundMode: 'video' as const };
                          setLocalHero(updatedHero);
                          updateSection('hero', updatedHero);
                          triggerSuccess();
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                          (localHero.defaultBackgroundMode === 'video' || localHero.defaultBackgroundMode === 'video_nature' || localHero.defaultBackgroundMode === 'video_palace')
                            ? 'bg-[#022C22] border-transparent text-[#FAF9F6] shadow-sm'
                            : 'bg-white border-stone-200 text-stone-600 hover:text-[#022C22] hover:bg-stone-50'
                        }`}
                      >
                        Только видеоролики
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-400 italic">
                      💡 При переключении сайт мгновенно подстроится: в ротации главного экрана будут прокручиваться только выбранные типы файлов.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Current Slides Grid */}
                    <div>
                      <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Активные слайды в ротации:</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {((localHero as any).slides || []).map((slide: any, index: number) => (
                          <div key={slide.id || index} className="relative border border-stone-200 rounded-xl bg-stone-50 overflow-hidden shadow-sm group">
                            <div className="aspect-video w-full relative bg-stone-100 flex items-center justify-center">
                              {slide.type === 'video' ? (
                                <video 
                                  src={slide.url}
                                  className="w-full h-full object-cover"
                                  controls={false}
                                  muted
                                  playsInline
                                />
                              ) : (
                                <img 
                                  src={slide.url} 
                                  alt={`Slide ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              )}

                              <div className="absolute top-2 left-2 bg-black/60 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                                #{index + 1}
                              </div>

                              <div className="absolute top-2 right-2 bg-[#FAF9F6] border border-stone-200 text-[#022C22] font-mono text-[9px] uppercase px-2 py-0.5 rounded-full font-semibold">
                                {slide.type === 'video' ? 'Видео' : 'Фото'}
                              </div>
                            </div>

                            <div className="p-3 bg-white border-t border-stone-100 flex items-center justify-between">
                              <span className="text-[10px] text-stone-400 font-mono truncate max-w-[150px]" title={slide.url}>
                                {slide.url.startsWith('data:') ? 'Пользовательский файл' : 'Встроенный файл'}
                              </span>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const currentSlides = (localHero as any).slides || [];
                                  const nextSlides = currentSlides.filter((s: any) => s.id !== slide.id);
                                  const remainingPhotos = nextSlides.filter((s: any) => s.type === 'photo');
                                  const newHeroPhoto = remainingPhotos.length > 0 ? remainingPhotos[0].url : '';
                                  
                                  const updatedHero = {
                                    ...localHero,
                                    slides: nextSlides
                                  };
                                  setLocalHero(updatedHero);
                                  
                                  let nextImages = localImages;
                                  if (localImages.hero === slide.url || !remainingPhotos.some((p: any) => p.url === localImages.hero)) {
                                    nextImages = { ...localImages, hero: newHeroPhoto };
                                    setLocalImages(nextImages);
                                  }

                                  updateSections({
                                    hero: updatedHero,
                                    images: nextImages
                                  });
                                  triggerSuccess();
                                }}
                                className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1 px-2.5 rounded-lg transition-all font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Удалить
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Drag and Drop Slide Uploader */}
                    <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#022C22] flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-serif text-[#022C22]">
                            <Plus className="w-4 h-4 text-[#c5a880]" /> Загрузить новый слайд (Фото или .MOV/.MP4 Видео)
                          </span>
                        </label>
                        <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                          Загрузите медиафайл. Система автоматически определит тип (фото или видео) и добавит его в автоматическое слайд-шоу. Видео воспроизводится в тихом режиме без звука.
                        </p>
                      </div>

                      <div 
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          slidesDragActive 
                            ? 'border-[#c5a880] bg-[#c5a880]/15 scale-[0.99]' 
                            : 'border-stone-300 hover:border-[#c5a880] hover:bg-stone-50 bg-white'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setSlidesDragActive(true);
                        }}
                        onDragLeave={() => setSlidesDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setSlidesDragActive(false);
                          if (e.dataTransfer.files?.[0]) {
                            handleSlidesUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => {
                          document.getElementById('slides-bg-file-upload-page')?.click();
                        }}
                      >
                        <input 
                          type="file" 
                          id="slides-bg-file-upload-page" 
                          accept="image/*,video/mp4,video/quicktime,video/mov,video/x-m4v" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleSlidesUpload(e.target.files[0]);
                            }
                          }}
                        />
                        <Sparkles className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                        <span className="text-xs block text-stone-600 font-bold">Выберите файл или перетащите его сюда</span>
                        <span className="text-[10px] text-stone-400 block mt-1">Поддерживаемые форматы: JPG, PNG, WEBP, MP4, MOV (рекомендуется до 15 МБ)</span>
                      </div>

                      {slidesUploadError && (
                        <p className="text-xs text-red-600 font-bold tracking-wide mt-1">{slidesUploadError}</p>
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
                          {test.isApproved === false ? (
                            <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                              ОЖИДАЕТ МОДЕРАЦИИ
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                              ОПУБЛИКОВАН
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono mt-1">{test.role || (test as any).city || 'Отдыхающий'} • {test.date || ''}</p>
                        <p className="text-xs text-stone-600 mt-2.5 italic leading-relaxed">"{test.text || (test as any).content || ''}"</p>
                      </div>
                      <div className="flex items-center space-x-2 self-end md:self-center">
                        {test.isApproved === false && (
                          <button 
                            onClick={() => handleUpdateTest(test.id, { ...test, isApproved: true })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            Одобрить
                          </button>
                        )}
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

          {/* TAB 7: NEWS */}
          {activeSettingsTab === 'news' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#022C22]">Новости и события</h3>
                  <p className="text-xs text-stone-400 mt-1">Публикация новостей, акций и важных событий санатория.</p>
                </div>
                {!showAddNews && (
                  <button 
                    onClick={() => setShowAddNews(true)}
                    className="bg-[#022C22] text-[#FAF9F6] border border-stone-900 px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider hover:bg-[#c5a880] hover:text-[#022C22] hover:border-transparent transition-all flex items-center space-x-2 shrink-0 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Добавить новость</span>
                  </button>
                )}
              </div>

              {/* NEWS LIST */}
              {!showAddNews && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(news?.length || 0) === 0 && (
                    <div className="col-span-full py-8 text-center bg-white rounded-xl border border-dashed border-stone-300 text-stone-500 font-serif">
                      Новостей пока нет
                    </div>
                  )}
                  {news.map(n => (
                    <div key={n.id} className="bg-white rounded-xl p-0 overflow-hidden shadow-sm border border-stone-200 flex flex-col relative group">
                      {editingNewsId === n.id ? (
                        <div className="p-1 border-b-4 border-amber-500">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-2 mb-2 rounded-md flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            ⚙️ Редактирование новости:
                          </h4>
                          <NewsForm 
                            initialData={n}
                            onCancel={() => setEditingNewsId(null)}
                            onSave={(data) => handleUpdateNews(n.id, { ...data, id: n.id })}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col h-full">
                          <div className="h-40 bg-stone-100 relative">
                            <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-mono backdrop-blur-sm">
                              {n.date}
                            </div>
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h4 className="font-serif font-bold text-[#022C22] text-sm mb-1 leading-snug line-clamp-2">{n.title}</h4>
                            <p className="text-xs text-stone-500 leading-relaxed line-clamp-3 mb-4">{n.excerpt || n.content}</p>
                            <div className="mt-auto flex justify-end gap-2 pt-2 border-t border-stone-100">
                              <button 
                                onClick={() => setEditingNewsId(n.id)}
                                className="p-1.5 text-stone-400 hover:text-[#022C22] hover:bg-stone-100 rounded transition-colors bg-white outline outline-1 outline-stone-200"
                                title="Редактировать"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteNews(n.id)}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors bg-white outline outline-1 outline-stone-200"
                                title="Удалить"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ADD NEWS FORM */}
              {showAddNews && (
                <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-2 border-l-4 border-l-[#022C22]">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#022C22] bg-[#022C22]/5 px-4 py-3 mb-2 rounded-md flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#022C22]" />
                    Создание новой записи
                  </h4>
                  <NewsForm 
                    initialData={{
                      title: '',
                      date: new Date().toLocaleDateString('ru-RU'),
                      image: '',
                      excerpt: '',
                      content: ''
                    }}
                    onCancel={() => setShowAddNews(false)}
                    onSave={handleAddNews}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 8: MEDIA & LINKS */}
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
                    {/* Hero image */}
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-stone-700">Фон заставки Welcome (Фото-обои)</label>
                        <div className="flex items-center gap-2">
                          {localImages.hero && (
                            <button
                              type="button"
                              onClick={() => {
                                const oldHero = localImages.hero;
                                const nextImages = { ...localImages, hero: '' };
                                setLocalImages(nextImages);
                                const currentSlides = (localHero as any).slides || [];
                                const nextSlides = currentSlides.filter((s: any) => s.url !== oldHero && s.type !== 'photo');
                                const nextHero = { ...localHero, slides: nextSlides };
                                setLocalHero(nextHero);
                                updateSections({
                                  images: nextImages,
                                  hero: nextHero
                                });
                                triggerSuccess();
                              }}
                              className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1 px-2 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" /> Очистить
                            </button>
                          )}
                          <label className="bg-white hover:bg-stone-50 text-[#022C22] border border-stone-300 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm transition-all">
                            <UploadCloud className="w-3 h-3 text-[#c5a880]" /> Выбрать файл
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={e => {
                                if (e.target.files?.[0]) {
                                  compressImage(e.target.files[0], 1400, 0.8, (b64) => {
                                    const nextImages = { ...localImages, hero: b64 };
                                    setLocalImages(nextImages);
                                    const currentSlides = (localHero as any).slides || [];
                                    const nonPhotoSlides = currentSlides.filter((s: any) => s.type !== 'photo');
                                    const nextHero = {
                                      ...localHero,
                                      slides: [...nonPhotoSlides, { id: `photo-${Date.now()}`, type: 'photo', url: b64 }]
                                    };
                                    setLocalHero(nextHero);
                                    updateSections({
                                      images: nextImages,
                                      hero: nextHero
                                    });
                                    triggerSuccess();
                                  });
                                }
                              }} 
                            />
                          </label>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={localImages.hero} 
                        onChange={e => {
                          const val = e.target.value;
                          const nextImages = { ...localImages, hero: val };
                          setLocalImages(nextImages);
                          const currentSlides = (localHero as any).slides || [];
                          const nonPhotoSlides = currentSlides.filter((s: any) => s.type !== 'photo');
                          const nextHero = val ? {
                            ...localHero,
                            slides: [...nonPhotoSlides, { id: `photo-${Date.now()}`, type: 'photo', url: val }]
                          } : {
                            ...localHero,
                            slides: nonPhotoSlides
                          };
                          setLocalHero(nextHero);
                          updateSections({
                            images: nextImages,
                            hero: nextHero
                          });
                        }}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 font-mono"
                        placeholder="URL или загрузите файл выше"
                      />
                      {localImages.hero && (
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-stone-200 shadow-inner group">
                          <img src={localImages.hero} alt="hero preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">Текущий фон</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suite image */}
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-stone-700">Номер Люкс (Раздел проживания)</label>
                        <label className="bg-white hover:bg-stone-50 text-[#022C22] border border-stone-300 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm transition-all">
                          <UploadCloud className="w-3 h-3 text-[#c5a880]" /> Выбрать файл
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={e => {
                              if (e.target.files?.[0]) {
                                compressImage(e.target.files[0], 1200, 0.8, (b64) => {
                                  const nextImages = { ...localImages, suite: b64 };
                                  setLocalImages(nextImages);
                                  updateSections({ images: nextImages });
                                  triggerSuccess();
                                });
                              }
                            }} 
                          />
                        </label>
                      </div>
                      <input 
                        type="text" 
                        value={localImages.suite} 
                        onChange={e => {
                          const nextImages = { ...localImages, suite: e.target.value };
                          setLocalImages(nextImages);
                          updateSections({ images: nextImages });
                        }}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 font-mono"
                        placeholder="URL или загрузите файл выше"
                      />
                      {localImages.suite && (
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-stone-200 shadow-inner group">
                          <img src={localImages.suite} alt="suite preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">Фото номера</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Medical image */}
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-stone-700">Кабинет физиотерапии (Медицина)</label>
                        <label className="bg-white hover:bg-stone-50 text-[#022C22] border border-stone-300 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm transition-all">
                          <UploadCloud className="w-3 h-3 text-[#c5a880]" /> Выбрать файл
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={e => {
                              if (e.target.files?.[0]) {
                                compressImage(e.target.files[0], 1200, 0.8, (b64) => {
                                  const nextImages = { ...localImages, medical: b64 };
                                  setLocalImages(nextImages);
                                  updateSections({ images: nextImages });
                                  triggerSuccess();
                                });
                              }
                            }} 
                          />
                        </label>
                      </div>
                      <input 
                        type="text" 
                        value={localImages.medical} 
                        onChange={e => {
                          const nextImages = { ...localImages, medical: e.target.value };
                          setLocalImages(nextImages);
                          updateSections({ images: nextImages });
                        }}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 font-mono"
                        placeholder="URL или загрузите файл выше"
                      />
                      {localImages.medical && (
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-stone-200 shadow-inner group">
                          <img src={localImages.medical} alt="medical preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">Фото медицины</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Nature image */}
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-stone-700">Терренкур и природа Гаспры</label>
                        <label className="bg-white hover:bg-stone-50 text-[#022C22] border border-stone-300 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 shadow-sm transition-all">
                          <UploadCloud className="w-3 h-3 text-[#c5a880]" /> Выбрать файл
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={e => {
                              if (e.target.files?.[0]) {
                                compressImage(e.target.files[0], 1200, 0.8, (b64) => {
                                  const nextImages = { ...localImages, nature: b64 };
                                  setLocalImages(nextImages);
                                  updateSections({ images: nextImages });
                                  triggerSuccess();
                                });
                              }
                            }} 
                          />
                        </label>
                      </div>
                      <input 
                        type="text" 
                        value={localImages.nature} 
                        onChange={e => {
                          const nextImages = { ...localImages, nature: e.target.value };
                          setLocalImages(nextImages);
                          updateSections({ images: nextImages });
                        }}
                        className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c5a880]/80 font-mono"
                        placeholder="URL или загрузите файл выше"
                      />
                      {localImages.nature && (
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-stone-200 shadow-inner group">
                          <img src={localImages.nature} alt="nature preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">Фото природы</span>
                          </div>
                        </div>
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
                            src={localExtraImages[imageKey] || undefined} 
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

              {/* GALLERY MANAGER CARD */}
              <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm mt-6">
                <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#c5a880]" />
                      Управление нижней фотогалереей
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">Добавляйте, загружайте и редактируйте фотографии на главной странице внизу.</p>
                  </div>
                  <span className="text-xs bg-[#FAF9F6] border border-stone-200 text-[#022C22] font-mono px-3 py-1 rounded-full font-bold">
                    Всего кадров: {galleryItems?.length || 0}
                  </span>
                </div>

                {/* ADD NEW PHOTO BLOCK */}
                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200/60 shadow-inner space-y-4">
                  <h5 className="font-bold text-xs text-[#022C22] uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Добавить новую фотографию в галерею
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-500 mb-1">Название кадра (описание):</label>
                        <input 
                          type="text" 
                          placeholder="Например: Роскошный вид на море с террасы"
                          value={newItemTitle}
                          onChange={e => setNewItemTitle(e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#c5a880] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-500 mb-1">Категория (вкладка на главной):</label>
                        <select 
                          value={newItemCategory || (galleryCats[0]?.id || '')}
                          onChange={e => setNewItemCategory(e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3.5 py-2 text-xs bg-white focus:ring-1 focus:ring-[#c5a880] focus:outline-none cursor-pointer"
                        >
                          {galleryCats.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name} ({cat.id})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Drag-and-drop & Upload file field */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-stone-500">Загрузить файл изображения:</label>
                      
                      <div 
                        onDragEnter={(e) => { e.preventDefault(); setNewDragActive(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setNewDragActive(false); }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          setNewDragActive(false);
                          if (e.dataTransfer.files?.[0]) {
                            const file = e.dataTransfer.files[0];
                            if (!file.type.startsWith('image/')) {
                              setNewImageError('Только файлы изображений!');
                              return;
                            }
                            compressImage(file, 1000, 0.75, (b64) => {
                              setNewItemSrc(b64);
                              setNewImageError(null);
                            });
                          }
                        }}
                        onClick={() => document.getElementById('gallery-new-file-input')?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col justify-center items-center h-28 relative ${
                          newDragActive 
                            ? 'border-[#c5a880] bg-white' 
                            : newItemSrc 
                              ? 'border-emerald-200 bg-emerald-50/20' 
                              : 'border-stone-200 hover:border-[#c5a880]/60 bg-white hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <input 
                          type="file" 
                          id="gallery-new-file-input"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const file = e.target.files[0];
                              compressImage(file, 1000, 0.75, (b64) => {
                                newItemSrc ? null : null; // side effect
                                setNewItemSrc(b64);
                                setNewImageError(null);
                              });
                            }
                          }}
                        />
                        {newItemSrc ? (
                          <div className="flex items-center gap-3 w-full h-full justify-center">
                            <img src={newItemSrc} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />
                            <div className="text-left">
                              <span className="text-[10px] text-emerald-600 font-bold block">✓ Фотография готова к загрузке</span>
                              <span className="text-[9px] text-stone-400 block max-w-[150px] truncate font-mono">Размер оптимизирован</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-stone-400 mb-1" />
                            <span className="text-[11px] font-bold text-stone-600">Нажмите для выбора или перетащите фото</span>
                            <span className="text-[9px] text-stone-400 uppercase tracking-wider block mt-0.5">JPG, PNG, WEBP</span>
                          </>
                        )}
                      </div>
                      
                      {newImageError && (
                        <p className="text-[10px] text-red-600 font-bold mt-1">{newImageError}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => {
                        if (!newItemSrc) {
                          setNewImageError('Пожалуйста, выберите или перетащите изображение');
                          return;
                        }
                        if (!newItemTitle.trim()) {
                          setNewImageError('Пожалуйста, укажите название или описание фотографии');
                          return;
                        }
                        handleAddGalleryItem({
                          title: newItemTitle,
                          category: newItemCategory || (galleryCats[0]?.id || 'nature'),
                          src: newItemSrc
                        });
                        setNewItemTitle('');
                        setNewItemSrc('');
                        setNewImageError(null);
                      }}
                      disabled={!newItemSrc || !newItemTitle.trim()}
                      className="bg-[#022C22] hover:bg-[#c5a880] text-[#FAF9F6] hover:text-[#022C22] disabled:opacity-50 disabled:bg-stone-200 disabled:text-stone-400 font-bold text-xs py-2 px-5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Добавить в галерею
                    </button>
                  </div>
                </div>

                {/* CATEGORIES / SECTIONS MANAGER */}
                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200/60 shadow-inner space-y-4 my-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-200/50 pb-2">
                    <h5 className="font-bold text-xs text-[#022C22] uppercase tracking-wider flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-[#c5a880]" /> Редактирование разделов (вкладок) галереи
                    </h5>
                    <span className="text-[10px] bg-stone-200 border border-stone-300 text-stone-600 font-mono px-2 py-0.5 rounded-full font-bold">
                      Вкладок: {galleryCats?.length || 0}
                    </span>
                  </div>

                  {/* Add category form */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Создать новый раздел</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">ID (латиница/код):</label>
                        <input 
                          type="text" 
                          placeholder="Например: beach"
                          value={newCatId}
                          onChange={e => setNewCatId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                          className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#c5a880] focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Название (показано на сайте):</label>
                        <input 
                          type="text" 
                          placeholder="Например: Собственный пляж"
                          value={newCatName}
                          onChange={e => setNewCatName(e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#c5a880] focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={handleAddCategory}
                          className="w-full bg-[#022C22] hover:bg-[#c5a880] text-[#FAF9F6] hover:text-[#022C22] font-semibold text-xs py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[34px]"
                        >
                          <Plus className="w-3.5 h-3.5" /> Создать раздел
                        </button>
                      </div>
                    </div>
                    {catError && (
                      <p className="text-[10px] text-red-600 font-bold mt-1">{catError}</p>
                    )}
                  </div>

                  {/* Categories list wrapper */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Существующие разделы</span>
                    
                    {(galleryCats?.length || 0) === 0 ? (
                      <p className="text-xs text-stone-400 italic">Нет разделов. Пожалуйста, создайте хотя бы один.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {galleryCats.map((cat) => (
                          <div 
                            key={cat.id} 
                            className="bg-white border border-stone-200/80 rounded-xl p-3 flex items-center justify-between shadow-sm"
                          >
                            {editingCatId === cat.id ? (
                              <div className="flex items-center gap-2 w-full">
                                <input 
                                  type="text" 
                                  value={editingCatValue}
                                  onChange={e => setEditingCatValue(e.target.value)}
                                  className="flex-1 border border-stone-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-[#c5a880] focus:outline-none"
                                />
                                <button 
                                  onClick={() => handleUpdateCategory(cat.id, editingCatValue)}
                                  className="p-1 text-emerald-600 hover:text-emerald-750 bg-emerald-50 rounded cursor-pointer flex items-center justify-center"
                                  title="Сохранить"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => setEditingCatId(null)}
                                  className="p-1 text-stone-400 hover:text-stone-600 bg-stone-50 rounded cursor-pointer flex items-center justify-center"
                                  title="Отмена"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded border border-stone-200">
                                    {cat.id}
                                  </span>
                                  <span className="text-xs font-semibold text-stone-700 font-serif">
                                    {cat.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <button 
                                    onClick={() => {
                                      setEditingCatId(cat.id);
                                      setEditingCatValue(cat.name);
                                    }}
                                    className="p-1 px-2 border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-[#022C22] rounded-lg text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                                    title="Переименовать"
                                  >
                                    <Edit2 className="w-2.5 h-2.5" /> Изменить
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer flex items-center justify-center"
                                    title="Удалить раздел"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CURRENT GALLERY LIST IN GRID & EDITABLE */}
                <div className="space-y-4">
                  <h5 className="font-bold text-xs text-[#022C22] uppercase tracking-wider">Текущие фотографии в галерее ({galleryItems?.length || 0})</h5>

                  {(galleryItems?.length || 0) === 0 ? (
                    <div className="p-8 text-center border border-dashed border-stone-200 rounded-xl bg-[#FAF9F6]">
                      <ImageIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-xs text-stone-400 font-medium">Нет загруженных фотографий в галерее</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {galleryItems.map((item, index) => (
                        <div key={item.id || index} className="bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-sm hover:border-slate-350 transition-all flex flex-col group relative">
                          
                          {/* Image preview & delete tag */}
                          <div className="h-32 bg-stone-100 relative overflow-hidden">
                            <img 
                              src={item.src} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 right-2 flex gap-1 items-center z-10">
                              <button 
                                onClick={() => handleDeleteGalleryItem(item.id)}
                                className="p-1.5 bg-red-50 hover:bg-red-150 border border-red-250 text-red-600 rounded-lg shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                title="Удалить снимок"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="absolute bottom-2 left-2 z-10">
                              <span className="text-[9px] font-bold tracking-widest text-[#FAF9F6] bg-stone-900/75 border border-stone-600/30 px-2 py-0.5 rounded uppercase">
                                {galleryCats.find(c => c.id === item.category)?.name || item.category}
                              </span>
                            </div>
                          </div>

                          {/* Editable title & category */}
                          <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">Название / Описание:</label>
                                <input 
                                  type="text" 
                                  value={item.title}
                                  onChange={(e) => {
                                    const nextItems = [...galleryItems];
                                    nextItems[index] = { ...item, title: e.target.value };
                                    setGalleryItems(nextItems);
                                  }}
                                  className="w-full border-b border-stone-200 focus:border-[#c5a880] text-[11px] font-sans pb-0.5 focus:outline-none focus:ring-0 mt-0.5 text-stone-700"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">Категория:</label>
                                <select 
                                  value={item.category}
                                  onChange={(e) => {
                                    const nextItems = [...galleryItems];
                                    nextItems[index] = { ...item, category: e.target.value };
                                    setGalleryItems(nextItems);
                                    handleUpdateGalleryItem(item.id, { ...item, category: e.target.value });
                                  }}
                                  className="w-full text-[10px] font-semibold text-stone-600 bg-transparent border-0 focus:ring-0 cursor-pointer p-0 mt-0.5"
                                >
                                  {galleryCats.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.id})</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Mini action to save edit changes inside item */}
                            <div className="pt-2 flex justify-between items-center border-t border-stone-100 mt-2">
                              <span className="text-[9px] text-stone-400 font-mono">#{index + 1}</span>
                              <button 
                                onClick={() => handleUpdateGalleryItem(item.id, item)}
                                className="text-[9px] font-bold uppercase tracking-wider text-[#022C22] hover:text-[#c5a880] flex items-center gap-0.5 cursor-pointer bg-stone-100 hover:bg-[#022C22]/5 px-2 py-0.5 rounded transition-all"
                              >
                                <Save className="w-2.5 h-2.5" /> Сохранить
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SAVE BUTTON FOR BATCH GALLERY CHANGES */}
                <div className="pt-5 flex justify-end border-t border-stone-100 gap-3">
                  <button 
                    onClick={() => {
                      updateSection('gallery', galleryItems);
                      triggerSuccess();
                    }}
                    className="bg-gradient-to-r from-emerald-800 to-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-3 px-8 rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить всю фотогалерею ({galleryItems?.length || 0} картинок)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'documents' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif font-black text-2xl text-[#022C22] tracking-tight">Реестр Официальных Документов</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Создание, редактирование, удаление и загрузка PDF-файлов (лицензии, приказы, уставные документы).
                  </p>
                </div>
                {!showAddDoc && !editingDocId && (
                  <button
                    onClick={() => setShowAddDoc(true)}
                    className="self-start sm:self-auto bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 border border-transparent shadow cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Добавить документ
                  </button>
                )}
              </div>

              {/* ADD DOCUMENT FORM */}
              {showAddDoc && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-stone-600 mb-1">
                    <FileText className="w-4 h-4 text-[#c5a880]" />
                    <span className="text-sm font-bold uppercase tracking-wider">Новый документ</span>
                  </div>
                  <DocumentForm
                    initialData={{
                      title: '',
                      category: 'constituent',
                      categoryLabel: 'Учредительные и общие',
                      summary: '',
                      pdfUrl: null,
                      fileSize: '',
                      uploadDate: new Date().toLocaleDateString('ru-RU'),
                      originalText: ''
                    }}
                    onCancel={() => setShowAddDoc(false)}
                    onSave={handleAddDocument}
                  />
                </div>
              )}

              {/* EDIT DOCUMENT FORM */}
              {editingDocId && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-stone-600 mb-1">
                    <Edit2 className="w-4 h-4 text-[#c5a880]" />
                    <span className="text-sm font-bold uppercase tracking-wider">Редактирование документа</span>
                  </div>
                  {(() => {
                    const doc = documents.find(d => d.id === editingDocId);
                    if (!doc) return <p className="text-sm text-red-500">Документ не найден</p>;
                    return (
                      <DocumentForm
                        initialData={doc}
                        onCancel={() => setEditingDocId(null)}
                        onSave={(data) => handleUpdateDocument(editingDocId, { ...data, id: editingDocId })}
                      />
                    );
                  })()}
                </div>
              )}

              {/* LIST OF DOCUMENTS */}
              {!showAddDoc && !editingDocId && (
                <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-stone-100 bg-[#FAF9F6] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#022C22] block font-mono">
                      Список документов ({documents?.length || 0})
                    </span>
                    <p className="text-[11px] text-stone-400">
                      Изменения вступают в силу после нажатия кнопки «Опубликовать» во вкладке сохранения.
                    </p>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {documents.map((doc, idx) => (
                      <div key={doc.id || idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200/50">
                              {doc.categoryLabel || doc.category}
                            </span>
                            {doc.code && (
                              <span className="text-[10px] font-mono font-bold text-[#c5a880] bg-[#c5a880]/5 px-2 py-0.5 rounded border border-[#c5a880]/15">
                                {doc.code}
                              </span>
                            )}
                            {doc.pdfUrl ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                📎 PDF ({doc.fileSize || 'Загружен'})
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-stone-400 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded">
                                Без PDF (только текст)
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif font-bold text-[#022C22] text-sm leading-tight uppercase tracking-tight">
                            {doc.title}
                          </h3>
                          <p className="text-xs text-stone-600 line-clamp-2 max-w-3xl leading-relaxed">
                            {doc.summary}
                          </p>
                          {doc.uploadDate && (
                            <span className="text-[10px] text-stone-400 block font-mono">
                              Загружен: {doc.uploadDate}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                          <button
                            onClick={() => setEditingDocId(doc.id)}
                            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {(documents?.length || 0) === 0 && (
                      <div className="p-10 text-center text-stone-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                        <span className="text-xs">В реестре еще нет ни одного документа. Создайте первый!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSettingsTab === 'users' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#022C22]">Управление пользователями системы</h3>
                  <p className="text-xs text-stone-400 mt-1 font-medium">Добавление, редактирование и удаление аккаунтов сотрудников с доступом к редактору сайта.</p>
                </div>
                {!showAddUser && (
                  <button
                    onClick={() => {
                      setShowAddUser(true);
                      setEditingUserId(null);
                      setUserForm({ username: '', password: '', role: 'Редактор' });
                    }}
                    className="bg-[#022C22] hover:bg-[#034D3C] text-white font-semibold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 shadow self-start cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#c5a880]" /> Добавить сотрудника
                  </button>
                )}
              </div>

              {/* ADD USER FORM */}
              <AnimatePresence>
                {showAddUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleAddUser} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 max-w-2xl">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h4 className="font-serif font-bold text-sm text-[#022C22] uppercase tracking-wider flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#c5a880]" /> Создать учетную запись сотрудника
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowAddUser(false)}
                          className="text-stone-400 hover:text-stone-600 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Username */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Логин для входа</label>
                          <input
                            type="text"
                            required
                            placeholder="Например, director"
                            value={userForm.username}
                            onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880] focus:bg-white"
                          />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Пароль</label>
                          <input
                            type="text"
                            required
                            placeholder="Минимум 4 символа"
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880] focus:bg-white font-mono"
                          />
                        </div>

                        {/* Role */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Должность / Роль</label>
                          <select
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880] focus:bg-white cursor-pointer"
                          >
                            <option value="Редактор">Редактор</option>
                            <option value="Администратор">Администратор</option>
                            <option value="и.о. Начальника санатория">и.о. Начальника санатория</option>
                            <option value="Начальник отдела">Начальник отдела</option>
                            <option value="Сотрудник ФТС">Сотрудник ФТС</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddUser(false)}
                          className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-700 bg-stone-100 rounded-lg cursor-pointer"
                        >
                          Отмена
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-semibold text-[#022C22] bg-[#c5a880] hover:bg-[#b59770] rounded-lg cursor-pointer uppercase tracking-wider"
                        >
                          Сохранить пользователя
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* USERS CARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersList.map((usr) => {
                  const isEditing = editingUserId === usr.id;
                  return (
                    <motion.div
                      key={usr.id}
                      layout
                      className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#c5a880]/40 transition-all relative overflow-hidden"
                    >
                      {/* Role decorative badge in corner */}
                      <div className="absolute top-0 right-0 h-2 w-full bg-[#022C22]/10"></div>
                      
                      {isEditing ? (
                        <div className="space-y-3 pt-2">
                          <h4 className="font-mono text-[9px] uppercase tracking-wider text-[#c5a880] font-bold">Редактирование сотрудника</h4>
                          
                          {/* Edit Login */}
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold text-stone-400 uppercase">Логин</label>
                            <input
                              type="text"
                              required
                              value={usr.username}
                              onChange={(e) => {
                                const updated = { ...usr, username: e.target.value };
                                setUsersList(usersList.map(u => u.id === usr.id ? updated : u));
                              }}
                              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-bold"
                            />
                          </div>

                          {/* Edit Password */}
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold text-stone-400 uppercase">Пароль</label>
                            <input
                              type="text"
                              required
                              value={usr.password || ''}
                              onChange={(e) => {
                                const updated = { ...usr, password: e.target.value };
                                setUsersList(usersList.map(u => u.id === usr.id ? updated : u));
                              }}
                              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-mono"
                            />
                          </div>

                          {/* Edit Role */}
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold text-stone-400 uppercase">Роль/Должность</label>
                            <select
                              value={usr.role || 'Редактор'}
                              onChange={(e) => {
                                const updated = { ...usr, role: e.target.value };
                                setUsersList(usersList.map(u => u.id === usr.id ? updated : u));
                              }}
                              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs"
                            >
                              <option value="Редактор">Редактор</option>
                              <option value="Администратор">Администратор</option>
                              <option value="и.о. Начальника санатория">и.о. Начальника санатория</option>
                              <option value="Начальник отдела">Начальник отдела</option>
                              <option value="Сотрудник ФТС">Сотрудник ФТС</option>
                            </select>
                          </div>

                          <div className="pt-2 flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingUserId(null);
                                setUsersList([...(siteData.users || [])]); // rollback
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-stone-500 bg-stone-100 rounded hover:bg-stone-200 uppercase"
                            >
                              Отмена
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateUser(usr.id, usr)}
                              className="px-3 py-1 text-[10px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded flex items-center gap-1 uppercase"
                            >
                              <Check className="w-3 h-3" /> Сохранить
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#022C22]/5 border border-[#022C22]/10 rounded-xl flex items-center justify-center text-[#022C22]">
                                <UserCheck className="w-5 h-5 text-[#c5a880]" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-stone-800 flex items-center gap-1.5">
                                  {usr.username}
                                </h4>
                                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-[#022C22]/10 text-[#022C22] font-semibold uppercase tracking-wider mt-0.5">
                                  {usr.role || 'Редактор'}
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-stone-100 pt-3 space-y-1.5 text-xs text-stone-600 font-mono">
                              <p className="flex justify-between">
                                <span className="text-stone-400">Пароль:</span>
                                <span className="text-stone-800 select-all font-bold">●●●●●● ({usr.password})</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-stone-400">Последний вход:</span>
                                <span className="text-stone-800 text-[10px]">{usr.lastLogin || 'Не входил в сессию'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                            <span className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">
                              ID: {usr.id.slice(0, 8)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingUserId(usr.id);
                                  setShowAddUser(false);
                                }}
                                className="p-1.5 text-stone-500 hover:text-[#022C22] hover:bg-stone-100 rounded transition-all cursor-pointer"
                                title="Редактировать учетную запись"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {usr.username !== 'admin' ? (
                                <button
                                  onClick={() => handleDeleteUser(usr.id)}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                                  title="Удалить сотрудника"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="p-1.5 text-stone-300 cursor-not-allowed" title="Главного системного администратора нельзя удалить">
                                  🔒
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSettingsTab === 'publish' && (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#022C22]">Публикация изменений и Память сайта</h3>
                  <p className="text-xs text-stone-400 mt-1 font-medium">Управление базой данных, выгрузка на хостинг и синхронизация.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Объём данных: <strong>{calculateStorageSize(siteData).formatted}</strong> (IndexedDB &gt;500 МБ)</span>
                </div>
              </div>

              {/* Informational banner about modern database storage */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="p-3 bg-emerald-100/90 rounded-xl text-emerald-800 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    <span>Безлимитное хранилище данных активировано</span>
                    <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold">IndexedDB 2026</span>
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Все правки, фотографии и тексты сохраняются в расширенную клиентскую базу данных <strong>IndexedDB</strong> без ограничений по памяти браузера. Вы можете безопасно загружать любые объёмы материалов и скачивать готовый <code className="bg-emerald-150/70 font-bold px-1 rounded font-mono">site-data.json</code> для хостинга.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Export & Import Actions */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider border-b border-stone-100 pb-2 mb-4">
                      Инструменты управления
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed mb-6">
                      Используйте эти кнопки для скачивания файла настроек или переноса данных на другие устройства.
                    </p>

                    <div className="space-y-4">
                      {/* Publish via PHP Button */}
                      <button
                        onClick={async () => {
                          setIsPublishing(true);
                          setPublishError('');
                          try {
                            const credsRaw = localStorage.getItem('pestovo_resort_admin_credentials');
                            if (!credsRaw) {
                              throw new Error('Учётные данные администратора не найдены. Пожалуйста, перезайдите в панель.');
                            }
                            const creds = JSON.parse(credsRaw);
                            if (!creds || !creds.username || !creds.password) {
                              throw new Error('Некорректные учётные данные. Пожалуйста, выйдите из панели и войдите заново.');
                            }
                            
                            const baseData = getConsolidatedSiteData();
                            const fullData = {
                              ...baseData,
                              _metadata: {
                                updatedAt: new Date().toISOString(),
                                version: Date.now(),
                                source: 'admin-save'
                              }
                            };
                            updateSiteData(fullData);
                            try {
                              localStorage.setItem('yasnaya_server_data_fingerprint', String(fullData._metadata.updatedAt));
                            } catch {}

                            const response = await fetch('/save_settings.php', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                username: creds.username,
                                password: creds.password,
                                siteData: fullData
                              })
                            });

                            if (response.ok) {
                              await response.json().catch(() => ({}));
                              alert('Успешно! Все настройки, тексты и медиа-файлы сохранены на сервере в файле site-data.json.');
                              triggerSuccess();
                            } else {
                              const resJSON = await response.json().catch(() => ({}));
                              throw new Error(resJSON.error || `Ошибка сервера: ${response.status}`);
                            }
                          } catch (err: any) {
                            console.error(err);
                            setPublishError(err.message || 'Не удалось подключиться к серверу PHP');
                            alert(`Ошибка публикации: ${err.message || 'Проверьте соединение'}`);
                          } finally {
                            setIsPublishing(false);
                          }
                        }}
                        disabled={isPublishing}
                        className={`w-full font-semibold text-xs py-3.5 px-4 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 border shadow cursor-pointer ${
                          isPublishing 
                            ? 'bg-stone-300 text-stone-500 border-transparent cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                        }`}
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Сохранение...
                          </>
                        ) : (
                          <>
                            <Globe className="w-4 h-4" />
                            Сохранить на сервере (PHP)
                          </>
                        )}
                      </button>

                      {publishError && (
                        <div className="bg-red-50 text-red-700 p-2.5 rounded-lg text-[10px] leading-relaxed border border-red-100 font-mono text-center">
                          {publishError}
                        </div>
                      )}

                      {/* Download JSON Button with File Size */}
                      <button
                        onClick={() => {
                          const baseData = getConsolidatedSiteData();
                          const fullData = {
                            ...baseData,
                            _metadata: {
                              updatedAt: new Date().toISOString(),
                              version: Date.now(),
                              source: 'admin-export'
                            }
                          };
                          updateSiteData(fullData);
                          try {
                            localStorage.setItem('yasnaya_server_data_fingerprint', String(fullData._metadata.updatedAt));
                          } catch {}
                          const jsonString = JSON.stringify(fullData, null, 2);
                          const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
                          const blobUrl = URL.createObjectURL(blob);
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.href = blobUrl;
                          downloadAnchor.download = 'site-data.json';
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                          triggerSuccess();
                        }}
                        className="w-full bg-[#022C22] hover:bg-[#c5a880] text-[#FAF9F6] hover:text-[#022C22] font-semibold text-xs py-3.5 px-4 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 border border-transparent shadow cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Скачать site-data.json ({calculateStorageSize(getConsolidatedSiteData()).formatted})</span>
                      </button>

                      {/* Import JSON file input and label */}
                      <div className="pt-2">
                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 text-center">
                          Резервная копия / Перенос данных
                        </label>
                        <label className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs py-3 px-4 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 border border-stone-300 border-dashed cursor-pointer text-center">
                          <UploadCloud className="w-4 h-4 text-stone-500" />
                          <span>Загрузить из JSON</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                              const fileReader = new FileReader();
                              const file = e.target.files?.[0];
                              if (!file) return;
                              fileReader.onload = (event) => {
                                try {
                                  const raw = event.target?.result as string;
                                  const parsed = JSON.parse(raw);
                                  if (parsed && typeof parsed === 'object') {
                                    const cleaned = deepCleanAssetPaths(parsed);
                                    updateSiteData(cleaned);
                                    alert('Конфигурация успешно импортирована! Страница будет обновлена.');
                                    window.location.reload();
                                  } else {
                                    alert('Неверный формат файла!');
                                  }
                                } catch (err) {
                                  alert('Ошибка при чтении файла конфигурации!');
                                }
                              };
                              fileReader.readAsText(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Clear Cache / Memory Button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Очистить кэш памяти?',
                              message: 'Вы хотите очистить локальный черновик в памяти браузера? Если вы сохранили файл на сервере или скачали JSON, данные не потеряются.',
                              confirmText: 'Да, очистить',
                              confirmClass: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
                              onConfirm: async () => {
                                await clearStorageData();
                                localStorage.removeItem('pestovo_resort_editable_data');
                                window.location.reload();
                              }
                            });
                          }}
                          className="w-full bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-red-700 font-medium text-[11px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-stone-200 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Очистить память браузера (кэш)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <span className="text-[10px] font-mono text-stone-400 block text-center uppercase tracking-wider">
                      Конфигурация содержит:
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-center">
                      <div className="bg-white p-2 rounded border border-stone-100 text-xs">
                        <strong className="text-emerald-700 block text-sm">{siteData.rooms?.length || 0}</strong>
                        <span className="text-[10px] text-stone-400">Номера</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-stone-100 text-xs">
                        <strong className="text-emerald-700 block text-sm">{siteData.services?.length || 0}</strong>
                        <span className="text-[10px] text-stone-400">Услуги</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Hosting Publication Guide */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-5">
                  <h4 className="font-bold font-serif text-[#022C22] text-sm uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#c5a880]" />
                    Интеграция с хостингом (PHP авто-синхронизация)
                  </h4>
                  
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Мы настроили ваш сайт так, что он <strong>полностью автоматически сохраняет и считывает настройки</strong> напрямую на вашем хостинге (ISPmanager / cPanel) через PHP-скрипты. Больше нет необходимости вручную скачивать и закачивать файлы настроек!
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                        1
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-800 text-xs">Автоматическое сохранение при редактировании</h5>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          Каждый раз, когда вы вносите изменения (редактируете номера, услуги, контакты, галерею или новости) и нажимаете кнопку «Сохранить», сайт отправляет защищённый запрос на ваш сервер. Изменения мгновенно перезаписывают файл <code className="bg-stone-100 px-1 py-0.5 rounded text-xs font-mono">site-data.json</code> в папке вашего сайта.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-stone-100 pt-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                        2
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-800 text-xs">Ручное принудительное сохранение</h5>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          Для вашего спокойствия, на панели слева мы добавили большую зеленую кнопку <strong>«Сохранить на сервере (PHP)»</strong>. Вы можете нажать её в любой момент, чтобы принудительно синхронизировать текущую конфигурацию с сервером.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-stone-100 pt-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                        3
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-800 text-xs">Резервное копирование и оффлайн-режим</h5>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          Если вы работаете локально на компьютере без интернета или ваш сервер временно недоступен, сайт сохранит все изменения в памяти текущего браузера. Вы всегда можете скачать файл <code className="bg-stone-100 px-1 py-0.5 rounded text-xs font-mono">site-data.json</code> на диск как резервную копию и восстановить настройки на любом другом устройстве через кнопку «Загрузить из JSON».
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mt-4">
                    <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Синхронизация полностью активна!
                    </span>
                    <p className="text-[11px] text-emerald-800 leading-relaxed mt-1">
                      Все ваши изменения мгновенно видны на мобильных телефонах отдыхающих и компьютерах без дополнительных действий. Права на запись файлов настраиваются веб-сервером автоматически.
                    </p>
                  </div>
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
  const [images, setImages] = useState<string[]>(() => {
    if (initialData.images && initialData.images.length > 0) {
      return [...initialData.images];
    }
    return initialData.image ? [initialData.image] : [];
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleRoomImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Пожалуйста, выберите файл изображения (png, jpg, jpeg, webp).');
      return;
    }
    setUploadError(null);
    compressImage(file, 1000, 0.75, (base64) => {
      setImages(prev => {
        if (prev.includes(base64)) return prev;
        return [...prev, base64];
      });
    });
  };

  const handleRoomMultipleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      handleRoomImageFile(file);
    });
  };
  
  const [newAmenity, setNewAmenity] = useState('');
  const [amenities, setAmenities] = useState<string[]>([...(initialData?.amenities || [])]);

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
      image: images[0] || '',
      images: images
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
      </div>

      <div className="border-t border-stone-100 pt-5 space-y-4">
        <label className="block text-xs font-black uppercase tracking-wider text-[#022C22]">Фотографии номера (можно загрузить несколько)</label>

        {images.length > 0 && (
          <div className="bg-stone-50 border border-stone-100 p-4 rounded-xl space-y-2">
            <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide">Загруженные фотографии:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((imgSrc, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 group bg-white shadow-xs">
                  <img 
                    src={imgSrc} 
                    alt={`Room photo ${idx + 1}`} 
                    className="w-full h-full object-cover animate-fade-in" 
                    referrerPolicy="no-referrer"
                  />
                  
                  {idx === 0 && (
                    <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow">
                      Главное
                    </span>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5 gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setImages(prev => {
                            const updated = [...prev];
                            const [moved] = updated.splice(idx, 1);
                            return [moved, ...updated];
                          });
                        }}
                        className="w-full bg-white hover:bg-[#c5a880] hover:text-white text-[8px] font-bold text-stone-800 py-1 rounded transition-colors cursor-pointer"
                      >
                        Сделать главным
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setImages(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-[8px] font-bold text-white py-1 rounded transition-colors cursor-pointer"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-stone-400">Наведите курсор на фото, чтобы выбрать его главным или удалить.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Controls column */}
          <div className="md:col-span-7 space-y-3">
            <div>
              <span className="block text-[11px] font-bold text-stone-500 mb-1">Добавить фото по интернет-ссылке (URL)</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  id="room-url-input"
                  placeholder="https://images.unsplash.com/... или base64"
                  className="w-full border border-stone-300 rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]" 
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('room-url-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      const url = input.value.trim();
                      setImages(prev => {
                        if (prev.includes(url)) return prev;
                        return [...prev, url];
                      });
                      input.value = '';
                    }
                  }}
                  className="bg-[#022C22] text-white text-xs font-bold px-4 rounded-xl hover:bg-[#c5a880] hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Добавить
                </button>
              </div>
            </div>

            {/* Drag & Drop */}
            <div 
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-[#c5a880] bg-[#c5a880]/10' 
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
                if (e.dataTransfer.files) {
                  handleRoomMultipleFiles(e.dataTransfer.files);
                }
              }}
              onClick={() => {
                document.getElementById(`room-file-upload-${initialData.id || 'new'}`)?.click();
              }}
            >
              <input 
                type="file" 
                id={`room-file-upload-${initialData.id || 'new'}`} 
                accept="image/*" 
                multiple
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) {
                    handleRoomMultipleFiles(e.target.files);
                  }
                }}
              />
              <span className="text-[11px] font-semibold text-stone-600 block">Загрузить файлы с компьютера</span>
              <span className="text-[9px] text-stone-400 block mt-0.5">Перетащите одну или несколько картинок сюда или нажмите</span>
            </div>
            {uploadError && (
              <p className="text-[10px] text-red-500 font-medium">{uploadError}</p>
            )}

            {/* Presets */}
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Пресеты Ясной Поляны (кликните, чтобы добавить):</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const preset = '/images/pestovo_block_1779780908700.png';
                    setImages(prev => prev.includes(preset) ? prev : [...prev, preset]);
                  }}
                  className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-left text-[10px] truncate cursor-pointer text-stone-700"
                >
                  🏥 Стандарт Эконом
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const preset = '/images/pestovo_suite_1779777660563.png';
                    setImages(prev => prev.includes(preset) ? prev : [...prev, preset]);
                  }}
                  className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-left text-[10px] truncate cursor-pointer text-stone-700"
                >
                  🛋️ Вилла Полулюкс
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const preset = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
                    setImages(prev => prev.includes(preset) ? prev : [...prev, preset]);
                  }}
                  className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-left text-[10px] truncate cursor-pointer text-stone-700"
                >
                  🛏️ Семейный Люкс
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const preset = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
                    setImages(prev => prev.includes(preset) ? prev : [...prev, preset]);
                  }}
                  className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-left text-[10px] truncate cursor-pointer text-stone-700"
                >
                  👑 Президент Люкс
                </button>
              </div>
            </div>
          </div>

          {/* Preview column */}
          <div className="md:col-span-5 flex flex-col justify-center bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase mb-1.5 text-center">Вид карточки номера (главное фото)</span>
            {images.length > 0 ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 bg-stone-200 shadow-sm">
                <img 
                  src={images[0]} 
                  alt="Room prew" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 bg-[#022C22] text-[#FAF9F6] text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold">
                  {price || 0} ₽
                </span>
              </div>
            ) : (
              <div className="aspect-video bg-white border border-stone-200 rounded-lg flex flex-col items-center justify-center p-3 text-center">
                <span className="text-2xs text-stone-400 animate-pulse">Изображения не загружены</span>
              </div>
            )}
          </div>
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
          {(amenities?.length || 0) === 0 && <span className="text-xs text-stone-400 p-1">Список удобств пуст.</span>}
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
  const [image, setImage] = useState(initialData.image || '');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleMedImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Пожалуйста, выберите файл изображения (png, jpg, jpeg, webp).');
      return;
    }
    setUploadError(null);
    compressImage(file, 1000, 0.75, (base64) => {
      setImage(base64);
    });
  };

  const [newIndication, setNewIndication] = useState('');
  const [indications, setIndications] = useState<string[]>([...(initialData?.indications || [])]);

  const [newProcedure, setNewProcedure] = useState('');
  const [procedures, setProcedures] = useState<string[]>([...(initialData?.procedures || [])]);

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
      icon,
      image
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

      <div className="border-t border-stone-100 pt-5 space-y-4">
        <label className="block text-xs font-black uppercase tracking-wider text-[#022C22]">Фотография программы лечения</label>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Controls column */}
          <div className="md:col-span-7 space-y-3">
            <div>
              <span className="block text-[11px] font-bold text-stone-500 mb-1">Ссылка на фото (URL)</span>
              <input 
                type="text" 
                value={image} 
                onChange={e => setImage(e.target.value)} 
                className="w-full border border-stone-300 rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]" 
                placeholder="https://images.unsplash.com/... или base64 (по умолчанию кабинет физиотерапии)"
              />
            </div>

            {/* Drag & Drop */}
            <div 
              className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-[#c5a880] bg-[#c5a880]/10' 
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
                  handleMedImageFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => {
                document.getElementById(`med-file-upload-${initialData.id || 'new'}`)?.click();
              }}
            >
              <input 
                type="file" 
                id={`med-file-upload-${initialData.id || 'new'}`} 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleMedImageFile(e.target.files[0]);
                  }
                }}
              />
              <span className="text-[11px] font-semibold text-stone-600 block">Загрузить файл с компьютера</span>
              <span className="text-[9px] text-stone-400 block mt-0.5">Перетащите картинку сюда или нажмите</span>
            </div>
            {uploadError && (
              <p className="text-[10px] text-red-500 font-medium">{uploadError}</p>
            )}

            {/* Presets */}
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Медицинские пресеты:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setImage('/images/pestovo_medical_1779777676990.png')}
                  className={`px-2 py-1.5 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                    image === '/images/pestovo_medical_1779777676990.png'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-955'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                  }`}
                >
                  🩺 Бальнеотерапия
                </button>
                <button
                  type="button"
                  onClick={() => setImage('/images/pestovo_beach_1779780925661.png')}
                  className={`px-2 py-1.5 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                    image === '/images/pestovo_beach_1779780925661.png'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-955'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                  }`}
                >
                  🌲 Климатолечение / Пляж
                </button>
                <button
                  type="button"
                  onClick={() => setImage('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80')}
                  className={`px-2 py-1.5 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                    image === 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-955'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                  }`}
                >
                  🏊‍♂️ Лечебный Бассейн
                </button>
                <button
                  type="button"
                  onClick={() => setImage('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80')}
                  className={`px-2 py-1.5 text-[10px] rounded-lg text-left truncate transition-all border cursor-pointer ${
                    image === 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-955'
                      : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                  }`}
                >
                  🏥 Медицинский Центр
                </button>
              </div>
            </div>
          </div>

          {/* Preview column */}
          <div className="md:col-span-5 flex flex-col justify-center bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase mb-1.5 text-center">Вид карточки программы</span>
            {image ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 bg-stone-200 shadow-sm">
                <img 
                  src={image} 
                  alt="Medical program prew" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 bg-stone-200 shadow-sm">
                <img 
                  src="/images/pestovo_medical_1779777676990.png" 
                  alt="Default medical program prew" 
                  className="w-full h-full object-cover brightness-90" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-3 text-center">
                  <span className="text-white text-[11px] font-bold drop-shadow-md">Будет использован стандартный кабинет физиотерапии</span>
                </div>
              </div>
            )}
          </div>
        </div>
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
            {(indications?.length || 0) === 0 && <span className="text-[11px] text-stone-400 p-1 block">Добавьте хотя бы одно показание.</span>}
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
            {(procedures?.length || 0) === 0 && <span className="text-[11px] text-stone-400 p-1 block">Добавьте хотя бы одну процедуру.</span>}
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
  const [author, setAuthor] = useState(initialData?.author || '');
  const [role, setRole] = useState(initialData?.role || (initialData as any)?.city || 'Гость');
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [text, setText] = useState(initialData?.text || (initialData as any)?.content || '');
  const [date, setDate] = useState(initialData?.date || '');

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

interface NewsFormProps {
  initialData: Omit<NewsArticle, 'id'> & { id?: string };
  onCancel: () => void;
  onSave: (data: Omit<NewsArticle, 'id'>) => void;
}

function NewsForm({ initialData, onCancel, onSave }: NewsFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [date, setDate] = useState(initialData.date);
  const [image, setImage] = useState(initialData.image);
  const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
  const [content, setContent] = useState(initialData.content);
  const [dragActive, setDragActive] = useState(false);

  const handleNewsImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения (png, jpg, jpeg, webp).');
      return;
    }
    compressImage(file, 1200, 0.78, (base64) => {
      setImage(base64);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !image || !content) {
      alert("Пожалуйста, заполните основные поля (заголовок, дата, картинка, текст).");
      return;
    }
    onSave({ title, date, image, excerpt, content });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Заголовок новости</label>
        <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 font-serif text-[#022C22] focus:outline-none focus:border-[#c5a880]" placeholder="Например: Открытие нового корпуса" />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Дата публикации</label>
        <input required type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm text-[#022C22] focus:outline-none focus:border-[#c5a880]" placeholder="Например: 10.05.2026" />
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Изображение к новости</label>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input required type="text" value={image} onChange={e => setImage(e.target.value)} className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 font-mono text-xs text-[#022C22] focus:outline-none focus:border-[#c5a880]" placeholder="https://... или загрузите файл" />
          
          <label className="cursor-pointer bg-white hover:bg-stone-50 border border-[#c5a880] text-[#022C22] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Загрузить фото</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleNewsImageFile(e.target.files[0]);
                }
              }} 
            />
          </label>
        </div>

        {/* Drag and Drop Zone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              handleNewsImageFile(e.dataTransfer.files[0]);
            }
          }}
          className={`mt-2 border-2 border-dashed rounded-xl p-3 text-center transition-colors ${dragActive ? 'border-[#c5a880] bg-[#FAF9F6]' : 'border-stone-200 bg-stone-50/50'}`}
        >
          {image ? (
            <div className="flex items-center justify-center gap-3">
              <img src={image} alt="preview" className="w-16 h-12 object-cover rounded-lg border border-stone-200 shadow-sm" referrerPolicy="no-referrer" />
              <span className="text-[11px] font-bold text-emerald-700">✓ Фотография успешно установлена</span>
            </div>
          ) : (
            <span className="text-xs text-stone-500">Перетащите сюда фото или нажмите кнопку выше</span>
          )}
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Краткий анонс (опционально)</label>
        <textarea rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:outline-none focus:border-[#c5a880]" placeholder="Текст для предпросмотра на карточке" />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Полный текст новости</label>
        <textarea required rows={6} value={content} onChange={e => setContent(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:outline-none focus:border-[#c5a880] leading-relaxed" placeholder="Текст новости..." />
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all">
          Сохранить новость
        </button>
      </div>
    </form>
  );
}

// 6. SERVICE FORM
interface ServiceFormProps {
  initialData: Omit<ServiceItem, 'id'> & { id?: string };
  onCancel: () => void;
  onSave: (data: Omit<ServiceItem, 'id'>) => void;
}

function ServiceForm({ initialData, onCancel, onSave }: ServiceFormProps) {
  const [category, setCategory] = useState<ServiceItem['category']>(initialData.category || 'methods');
  const [title, setTitle] = useState(initialData.title || '');
  const [benefit, setBenefit] = useState(initialData.benefit || '');
  const [method, setMethod] = useState(initialData.method || '');
  const [duration, setDuration] = useState(initialData.duration || '');
  const [iconName, setIconName] = useState(initialData.iconName || 'Sparkles');
  const [indications, setIndications] = useState<string[]>(initialData.indications || []);
  const [newIndication, setNewIndication] = useState('');

  const handleAddIndication = () => {
    if (newIndication.trim()) {
      setIndications([...indications, newIndication.trim()]);
      setNewIndication('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !benefit.trim() || !method.trim()) {
      alert('Пожалуйста, заполните основные поля: Название, Польза и Метод!');
      return;
    }
    onSave({ category, title, benefit, method, duration, iconName, indications });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Категория услуги</label>
          <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880] bg-white">
            <option value="methods">Методы лечения</option>
            <option value="diagnostics">Функциональная диагностика</option>
            <option value="laboratory">Лабораторная база</option>
            <option value="infrastructure">Инфраструктура и сервис</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Иконка</label>
          <select value={iconName} onChange={e => setIconName(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880] bg-white">
            <option value="Activity">Волна / Пульс (Activity)</option>
            <option value="Heart">Сердце (Heart)</option>
            <option value="Flame">Огонь (Flame)</option>
            <option value="Waves">Волны воды (Waves)</option>
            <option value="Wind">Ветер / Кислород (Wind)</option>
            <option value="Compass">Компас / Терренкур (Compass)</option>
            <option value="Droplet">Капля (Droplet)</option>
            <option value="Stethoscope">Стетоскоп (Stethoscope)</option>
            <option value="Sparkles">Искры / Сервис (Sparkles)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-500 mb-1">Название услуги</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" placeholder="Например: Аэроионотерапия" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Польза / Эффект</label>
          <textarea rows={3} value={benefit} onChange={e => setBenefit(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" placeholder="Какую пользу приносит процедура отдыхающему..." />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Методология / Описание</label>
          <textarea rows={3} value={method} onChange={e => setMethod(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" placeholder="Как именно проводится лечебное мероприятие..." />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Продолжительность (например: 15–20 мин)</label>
          <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" placeholder="например: 15–20 мин" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1.5">Показания к применению (список причин)</label>
        <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {indications.map((ind, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-stone-700 bg-white border border-stone-200 p-2 rounded-lg pr-1.5 shadow-sm">
                <span className="truncate">{ind}</span>
                <button type="button" onClick={() => setIndications(indications.filter((_, i) => i !== idx))} className="text-red-500 font-bold px-1.5 hover:text-red-700">×</button>
              </div>
            ))}
            {(indications?.length || 0) === 0 && <span className="text-[11px] text-stone-400 p-1 block">Добавьте показания ниже</span>}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Новое показание..." value={newIndication} onChange={e => setNewIndication(e.target.value)} className="border border-stone-300 rounded-xl px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-[#c5a880]" />
            <button type="button" onClick={handleAddIndication} className="bg-[#022C22] hover:bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-xl font-bold">Добавить</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all">
          Сохранить услугу
        </button>
      </div>
    </form>
  );
}

// 7. DOCUMENT FORM
interface DocumentFormProps {
  initialData: Omit<DocumentItem, 'id'> & { id?: string };
  onCancel: () => void;
  onSave: (data: Omit<DocumentItem, 'id'>) => void;
}

const DOCUMENT_CATEGORIES = [
  { id: 'constituent', name: 'Учредительные и общие' },
  { id: 'medical', name: 'Лицензии и стандарты' },
  { id: 'law', name: 'Законодательство и права' },
  { id: 'reception', name: 'Лечебный regime и обращения' },
  { id: 'finance', name: 'Финансовые и классификация' },
  { id: 'modifications', name: 'Изменения реквизитов' }
] as const;

function DocumentForm({ initialData, onCancel, onSave }: DocumentFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [code, setCode] = useState(initialData.code || '');
  const [category, setCategory] = useState<DocumentItem['category']>(initialData.category || 'constituent');
  const [summary, setSummary] = useState(initialData.summary || '');
  const [pdfUrl, setPdfUrl] = useState<string | null>(initialData.pdfUrl || null);
  const [fileSize, setFileSize] = useState(initialData.fileSize || '');
  const [uploadDate, setUploadDate] = useState(initialData.uploadDate || '');
  const [originalText, setOriginalText] = useState(initialData.originalText || '');

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handlePdfFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Пожалуйста, выберите файл в формате PDF (.pdf)');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    const reader = new FileReader();
    reader.onload = (e) => {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setPdfUrl(e.target.result);
          // Auto-set file size
          const sizeKb = (file.size / 1024).toFixed(0);
          if (Number(sizeKb) > 1024) {
            setFileSize(`${(Number(sizeKb) / 1024).toFixed(1)} MB`);
          } else {
            setFileSize(`${sizeKb} KB`);
          }
          // Auto-set upload date
          setUploadDate(new Date().toLocaleDateString('ru-RU'));
        }
        setUploading(false);
        setUploadProgress(0);
      }, 400);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      alert('Пожалуйста, заполните обязательные поля: Название документа и Краткое резюме!');
      return;
    }
    const catObj = DOCUMENT_CATEGORIES.find(c => c.id === category);
    const categoryLabel = catObj ? catObj.name : 'Документы';

    onSave({
      title: title.trim(),
      code: code.trim() || undefined,
      category,
      categoryLabel,
      summary: summary.trim(),
      pdfUrl,
      fileSize: fileSize.trim() || undefined,
      uploadDate: uploadDate.trim() || undefined,
      originalText: originalText.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-sm animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-500 mb-1">Официальное название документа (заглавными буквами)</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" placeholder="Например: ПРИКАЗ МИНЗДРАВА РФ ОБ АККРЕДИТАЦИИ САНАТОРИЕВ" />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Регистрационный номер / Код</label>
          <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" placeholder="Например: Рег. № 10328" />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Раздел классификации</label>
          <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880] bg-white">
            {DOCUMENT_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-500 mb-1">Краткое описание / Аннотация (будет отображаться на карточке)</label>
          <textarea required rows={3} value={summary} onChange={e => setSummary(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a880]" placeholder="Опишите, о чем этот документ..." />
        </div>

        <div className="md:col-span-2 border-t border-stone-100 pt-4 space-y-4">
          <span className="block text-xs font-black uppercase tracking-wider text-[#022C22]">PDF Файл документа</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div 
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col justify-center items-center h-32 relative ${
                  dragActive 
                    ? 'border-[#c5a880] bg-[#c5a880]/5' 
                    : 'border-stone-300 hover:border-[#c5a880] bg-white'
                }`}
                onDragOver={e => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files?.[0]) {
                    handlePdfFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => document.getElementById('pdf-upload-input')?.click()}
              >
                <input 
                  type="file" 
                  id="pdf-upload-input" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      handlePdfFile(e.target.files[0]);
                    }
                  }}
                />
                
                {uploading ? (
                  <div className="space-y-2 w-full max-w-xs">
                    <span className="text-xs font-semibold text-[#022C22] block">Загрузка PDF документа...</span>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                      <div className="bg-[#c5a880] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                ) : pdfUrl ? (
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-600 block flex items-center gap-1 justify-center">
                      ✓ PDF документ успешно загружен
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block max-w-sm truncate">
                      {pdfUrl.startsWith('data:') ? 'Локальный файл Base64' : pdfUrl}
                    </span>
                    <button 
                      type="button" 
                      onClick={e => {
                        e.stopPropagation();
                        setPdfUrl(null);
                        setFileSize('');
                      }} 
                      className="text-[10px] text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded transition-colors mt-2"
                    >
                      Очистить файл
                    </button>
                  </div>
                ) : (
                  <>
                    <FileText className="w-6 h-6 text-stone-400 mb-1" />
                    <span className="text-xs font-bold text-stone-600">Нажмите для выбора PDF файла или перетащите его сюда</span>
                    <span className="text-[9px] text-stone-400 block mt-0.5">Лимит файла: до 20 МБ</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Ссылка на PDF (URL)</label>
                <input 
                  type="text" 
                  value={pdfUrl || ''} 
                  onChange={e => setPdfUrl(e.target.value || null)} 
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#c5a880]" 
                  placeholder="https://... или base64"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Размер</label>
                  <input 
                    type="text" 
                    value={fileSize} 
                    onChange={e => setFileSize(e.target.value)} 
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880]" 
                    placeholder="840 KB"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Дата</label>
                  <input 
                    type="text" 
                    value={uploadDate} 
                    onChange={e => setUploadDate(e.target.value)} 
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880]" 
                    placeholder="24.01.2025"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t border-stone-100 pt-4">
          <label className="block text-xs font-bold text-stone-500 mb-1">Текстовое содержание документа (для встроенного поиска на сайте)</label>
          <textarea rows={6} value={originalText} onChange={e => setOriginalText(e.target.value)} className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c5a880] leading-relaxed font-sans" placeholder="Полный официальный текст или выписка..." />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
        <button type="button" onClick={onCancel} className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 px-5 rounded-xl transition-all">
          Отмена
        </button>
        <button type="submit" className="bg-[#022C22] text-[#FAF9F6] hover:bg-[#c5a880] hover:text-[#022C22] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all uppercase tracking-wider font-bold">
          Сохранить документ
        </button>
      </div>
    </form>
  );
}
