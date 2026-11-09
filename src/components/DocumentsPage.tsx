import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Upload, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Shield, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  HelpCircle,
  FileCheck,
  Briefcase,
  AlertCircle,
  Menu,
  X,
  Plus,
  Globe
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { DocumentItem } from '../types';
import { calculateStorageSize } from '../lib/storage';
import PdfViewer from './PdfViewer';
import { getDocumentPdfUrl } from '../utils/pdfGenerator';
import { INITIAL_DOCUMENTS } from '../data/documentsData';

export default function DocumentsPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { isAdminMode, siteData, updateSection, downloadSiteDataJson, saveToServer } = useAdminData();
  const documents = siteData.documents || INITIAL_DOCUMENTS;

  const customPdfsCount = documents.filter(d => d.pdfUrl && d.pdfUrl.startsWith('data:')).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [activePassportTab, setActivePassportTab] = useState<'general' | 'medical' | 'structure'>('general');

  // Admin dynamic upload state
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Lock body scroll when viewing document in fullscreen reader
  useEffect(() => {
    if (viewingDoc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewingDoc]);

  const saveToLocalStorage = (newDocs: DocumentItem[]) => {
    try {
      localStorage.setItem('pestovo_custom_documents', JSON.stringify(newDocs));
    } catch {}
    updateSection('documents', newDocs);
  };

  const handleDownloadPdf = async (doc: DocumentItem) => {
    try {
      const url = await getDocumentPdfUrl(doc);
      const a = document.createElement('a');
      a.href = url;
      const cleanTitle = (doc.title || 'document').replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_').slice(0, 50);
      a.download = `${cleanTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleSimulatedPdfUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Пожалуйста, выберите файл в формате PDF (.pdf)');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('Размер файла превышает 25 МБ. Для быстрого сохранения и экспорта в site-data.json рекомендуется использовать документы размером до 25 МБ.');
      return;
    }

    setUploadingDocId(docId);
    setUploadProgress(25);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadProgress(100);
      setTimeout(() => {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        const sizeKb = (file.size / 1024).toFixed(0);
        const formattedSize = file.size >= 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

        const updated = documents.map((doc) => {
          if (doc.id === docId) {
            return {
              ...doc,
              pdfUrl: dataUrl,
              fileSize: formattedSize,
              uploadDate: new Date().toLocaleDateString('ru-RU')
            };
          }
          return doc;
        });
        saveToLocalStorage(updated);
        setUploadingDocId(null);
        setFeedbackMsg(`✓ PDF «${file.name}» (${formattedSize}) успешно сохранен в базу и включен в структуру site-data.json!`);
        setTimeout(() => setFeedbackMsg(null), 5000);
      }, 300);
    };

    reader.onerror = () => {
      setUploadingDocId(null);
      setFeedbackMsg('Ошибка при чтении PDF файла.');
    };

    reader.readAsDataURL(file);
  };

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
      return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      doc.title.toLowerCase().includes(q) || 
      (doc.code && doc.code.toLowerCase().includes(q)) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.categoryLabel.toLowerCase().includes(q)
    );
  });

  // Format document titles into modern, beautiful, highly readable Title Case
  const formatDocTitle = (title: string): string => {
    if (!title) return '';
    const letters = title.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    const hasLower = /[a-zа-яё]/.test(title);
    
    // Only reformat if it's all uppercase or predominantly uppercase
    if (!hasLower && letters.length > 5) {
      const acronyms: Record<string, string> = {
        'ФТС': 'ФТС',
        'РФ': 'РФ',
        'ЕГРЮЛ': 'ЕГРЮЛ',
        'ГОСТ': 'ГОСТ',
        'ОГРН': 'ОГРН',
        'ИНН': 'ИНН',
        'КПП': 'КПП',
        'СНИЛС': 'СНИЛС',
        'МЗ': 'МЗ',
        'ОМС': 'ОМС',
        'ДМС': 'ДМС',
        'ЛФК': 'ЛФК',
        'УФК': 'УФК',
        'ЭКГ': 'ЭКГ',
        'ФВД': 'ФВД',
        'ЖНВЛП': 'ЖНВЛП',
        'УВЧ': 'УВЧ',
        'СМТ': 'СМТ',
        'PDF': 'PDF',
        'РОССИИ': 'России',
        'РОССИЯ': 'Россия',
        'РОССИЙСКОЙ': 'Российской',
        'ФЕДЕРАЦИИ': 'Федерации',
        'ФЕДЕРАЛЬНОЙ': 'Федеральной',
        'ФЕДЕРАЛЬНОГО': 'Федерального',
        'ФЕДЕРАЛЬНОЕ': 'Федеральное',
        'КАЗЕННОЕ': 'Казенное',
        'ГОСУДАРСТВЕННОЕ': 'Государственное',
        'УЧРЕЖДЕНИЕ': 'Учреждение',
        'САНАТОРИЙ': 'Санаторий',
        'ЯСНАЯ': 'Ясная',
        'ПОЛЯНА': 'Поляна',
        'КРЫМ': 'Крым',
        'ЯЛТА': 'Ялта',
        'ГАСПРА': 'Гаспра',
        'МИНЗДРАВА': 'Минздрава',
        'МИНЗДРАВ': 'Минздрав',
        'ТАМОЖЕННОЙ': 'Таможенной',
        'СЛУЖБЫ': 'Службы',
        'ТУРИЗМУ': 'Туризму',
        'ТУРИСТСКОЙ': 'Туристской',
        'ЕДИНОГО': 'Единого',
        'РЕЕСТРА': 'Реестра'
      };

      const words = title.split(' ');
      return words.map((word, index) => {
        const prefixMatch = word.match(/^([^a-zA-Zа-яА-ЯёЁ0-9]*)(.*)$/);
        const prefix = prefixMatch ? prefixMatch[1] : '';
        const rest = prefixMatch ? prefixMatch[2] : word;
        
        const suffixMatch = rest.match(/^(.*?)([^a-zA-Zа-яА-ЯёЁ0-9]*)$/);
        const coreWord = suffixMatch ? suffixMatch[1] : rest;
        const suffix = suffixMatch ? suffixMatch[2] : '';

        const upperCore = coreWord.toUpperCase();
        if (acronyms[upperCore]) {
          return prefix + acronyms[upperCore] + suffix;
        }

        const lower = coreWord.toLowerCase();
        if (index === 0 || prefix.includes('«') || prefix.includes('"')) {
          return prefix + (lower.charAt(0).toUpperCase() + lower.slice(1)) + suffix;
        }
        return prefix + lower + suffix;
      }).join(' ');
    }
    return title;
  };

  return (
    <div className="flex-1 bg-[#FAF9F6] text-[#1c2a22] font-sans">
      
      {/* Dynamic Visual Banner */}
      <div className="bg-[#022C22] text-white py-12 sm:py-16 px-4 relative overflow-hidden border-b border-[#c5a880]/30 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-sans uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
              <span>ФГКУ «Санаторий «Ясная Поляна» ФТС России»</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Официальный реестр документации
            </h1>
            <p className="text-stone-200 text-sm max-w-2xl leading-relaxed">
              Актуальные правовые регламенты, нормативные акты, лицензии, учредительные Уставы и образцы договоров ведомственного учреждения Федеральной таможенной службы.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-[#c5a880] text-[#022C22] hover:bg-[#FAF9F6] hover:text-[#022C22] px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transform transition-all duration-300 hover:-translate-x-1 cursor-pointer self-start md:self-auto shrink-0 shadow-md font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на главную</span>
          </button>
        </div>
      </div>

      {/* Alerts notification toast */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-950 border border-[#c5a880]/50 text-stone-100 text-xs sm:text-sm px-6 py-4 rounded-md shadow-2xl flex items-center space-x-3 font-semibold max-w-lg text-center"
          >
            <CheckCircle2 className="w-5 h-5 text-[#c5a880] flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main documents container - all documents on one page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Admin status box */}
        {isAdminMode && (
          <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3 text-amber-900">
              <Shield className="w-6 h-6 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-mono uppercase tracking-wider font-bold text-xs block">
                  Панель управления PDF документами (Администратор)
                </span>
                <p className="text-amber-800 text-xs mt-0.5">
                  Загруженные PDF документы автоматически сохраняются в базу и файл <code className="bg-amber-100/80 font-bold px-1 py-0.5 rounded font-mono text-[11px]">site-data.json</code> для переноса на хостинг.
                </p>
                {customPdfsCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold text-xs mt-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    <Check className="w-3 h-3 text-emerald-600" />
                    В базе сохранено PDF файлов пользователя: {customPdfsCount} шт.
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  downloadSiteDataJson();
                  setFeedbackMsg('Файл site-data.json с вашими PDF сформирован и скачан на компьютер!');
                  setTimeout(() => setFeedbackMsg(null), 5000);
                }}
                className="bg-[#022C22] hover:bg-[#c5a880] text-[#FAF9F6] hover:text-[#022C22] text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer flex-1 md:flex-initial"
                title="Скачать файл site-data.json со всеми вашими PDF для загрузки на хостинг"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Скачать site-data.json ({calculateStorageSize(siteData).formatted})</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await saveToServer();
                    setFeedbackMsg(res.message);
                    setTimeout(() => setFeedbackMsg(null), 5000);
                  } catch (err: any) {
                    alert(`Сохранение на сервер: ${err.message || 'Сервер PHP недоступен. Скачайте site-data.json и загрузите его на хостинг вручную.'}`);
                  }
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer flex-1 md:flex-initial"
                title="Мгновенно обновить файл site-data.json на сервере через PHP"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Сохранить на сервере</span>
              </button>
            </div>
          </div>
        )}

        {/* Search input & Total document counter */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Быстрый поиск по названию документа, номеру приказа, коду или ключевым словам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#022C22] font-sans placeholder:text-stone-400 text-stone-800 transition-colors"
            />
          </div>
          <div className="shrink-0 text-xs sm:text-sm font-sans font-bold text-stone-700 bg-stone-100 px-5 py-3 rounded-xl border border-stone-200 flex items-center gap-2.5">
            <span>Всего документов:</span>
            <span className="bg-[#022C22] text-[#c5a880] px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs sm:text-sm tabular-nums">
              {filteredDocs.length}
            </span>
          </div>
        </div>

        {/* Categories filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {[
            { id: 'all', label: 'Все документы' },
            { id: 'constituent', label: 'Учредительные и общие' },
            { id: 'medical', label: 'Лицензии и стандарты' },
            { id: 'law', label: 'Законы и правовые акты' },
            { id: 'reception', label: 'Лечебный режим и обращения' },
            { id: 'finance', label: 'Финансовые и классификация' },
            { id: 'modifications', label: 'Нормативы и изменения' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#022C22] text-[#c5a880] border-[#022C22] shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

            {/* OFFICIAL SANATORIUM PASSPORT */}
            <div className="bg-[#022C22] text-white rounded-2xl border border-[#c5a880]/30 shadow-lg overflow-hidden transition-all duration-300">
              <div 
                onClick={() => setIsPassportOpen(!isPassportOpen)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none bg-gradient-to-r from-[#022C22] to-[#011F18] border-b border-[#c5a880]/20"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="bg-white/10 text-[#c5a880] p-2.5 rounded-xl shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      <span className="text-xs uppercase tracking-wider text-[#c5a880] font-sans font-semibold bg-[#c5a880]/15 px-2.5 py-0.5 rounded-md">ГАС карточка ФТС России</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono font-bold text-emerald-300">АКТУАЛИЗИРОВАНО В 2026 ГОДУ</span>
                    </div>
                    <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-white mt-1">
                      Официальный паспорт и Государственные реквизиты учреждения
                    </h2>
                  </div>
                </div>
                <button className="text-[#c5a880] hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all font-sans text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-auto">
                  {isPassportOpen ? 'Свернуть [-]' : 'Развернуть [+]'}
                </button>
              </div>

              <AnimatePresence>
                {isPassportOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-[#FAF9F6] text-[#1c2a22]"
                  >
                    {/* Tab bars inside Passport */}
                    <div className="flex border-b border-stone-200 bg-stone-100 select-none">
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('general')}
                        className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-sans font-bold cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'general'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-600 hover:text-[#022C22] hover:bg-stone-200/60'
                        }`}
                      >
                        Общие данные и Руководство
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('medical')}
                        className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-sans font-bold cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'medical'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-600 hover:text-[#022C22] hover:bg-stone-200/60'
                        }`}
                      >
                        Специализация и Лицензия
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('structure')}
                        className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-sans font-bold cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'structure'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-600 hover:text-[#022C22] hover:bg-stone-200/60'
                        }`}
                      >
                        Структура и Профиль
                      </button>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6 font-sans">
                      {activePassportTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Column: Organization registration */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Общие реквизиты</h3>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Наименование полное:</span>
                                <span className="font-bold text-[#022C22] block mt-0.5 text-sm sm:text-base leading-snug">Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» Федеральной таможенной службы»</span>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Наименование сокращенное:</span>
                                <span className="font-semibold text-stone-800 block mt-0.5">ФГКУ «Санаторий «Ясная Поляна» ФТС России»</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-stone-200">
                                <div>
                                  <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">ИНН:</span>
                                  <code className="font-bold font-mono text-base text-[#022C22] tabular-nums">7713778678</code>
                                </div>
                                <div>
                                  <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">КПП:</span>
                                  <code className="font-bold font-mono text-base text-[#022C22] tabular-nums">910301001</code>
                                </div>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Организационно-правовая форма (ОПФ):</span>
                                <span className="font-medium text-stone-800 block mt-0.5">Федеральные государственные казенные учреждения</span>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Адрес юридический, фактический и почтовый:</span>
                                <span className="font-medium text-stone-800 block mt-0.5">298660, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                                  <span className="text-emerald-900 block text-xs font-bold uppercase tracking-wider">Ведомственная подчиненность:</span>
                                  <span className="font-bold text-[#022C22] text-sm block mt-0.5">Федеральная таможенная служба</span>
                                </div>
                                <div className="bg-stone-100 p-3 rounded-xl border border-stone-200">
                                  <span className="text-stone-600 block text-xs font-semibold uppercase tracking-wider">Форма собственности:</span>
                                  <span className="font-bold text-stone-800 text-sm block mt-0.5">Федеральная собственность</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Key managers & Registry dates */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Ответственные лица и Гос. регистрация</h3>
                            <div className="space-y-4 text-sm">
                              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5 shadow-xs">
                                <span className="text-[#9b7b51] block text-xs font-bold uppercase tracking-wider">Руководитель:</span>
                                <div>
                                  <p className="font-bold text-[#022C22] text-base sm:text-lg font-sans">{siteData?.resortInfo?.directorName || 'Шапортов Станислав Владимирович'}</p>
                                  <p className="text-xs text-stone-600 font-medium mt-0.5">{siteData?.resortInfo?.directorRole || 'Начальник санатория'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100 text-xs">
                                  <div>
                                    <span className="text-stone-500 block uppercase font-semibold">Телефон приемной:</span>
                                    <a href="tel:+73654239376" className="font-bold hover:underline text-[#022C22] font-mono tabular-nums text-sm block mt-0.5">+7(3654)23-93-76</a>
                                  </div>
                                  <div>
                                    <span className="text-stone-500 block uppercase font-semibold">Email:</span>
                                    <a href="mailto:sanatoriy@ya-polyana.ru" className="font-semibold hover:underline text-[#022C22] font-mono truncate block mt-0.5">sanatoriy@ya-polyana.ru</a>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                                <span className="text-stone-500 block text-xs font-bold uppercase tracking-wider">Государственная регистрация:</span>
                                <p className="text-[#022C22] font-bold text-sm">Федеральная налоговая служба Российской Федерации</p>
                                <p className="text-stone-600">Межрайонная инспекция ФНС №46 по г. Москве</p>
                                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 font-mono tabular-nums text-xs text-[#022C22] space-y-0.5">
                                  <div>ОГРН: <strong className="font-bold">5137746004787</strong></div>
                                  <div>Свидетельство: серия <strong className="font-bold">77</strong> № <strong className="font-bold">015463944</strong> от 29.10.2013</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePassportTab === 'medical' && (
                        <div className="space-y-6">
                          <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-emerald-700" />
                                <span className="font-sans font-bold text-[#022C22] text-xs uppercase tracking-wider">Государственная медицинская лицензия • 24 вида работ (услуг)</span>
                              </div>
                              <h4 className="font-sans text-base sm:text-lg font-bold text-[#022C22] mt-1 font-mono tabular-nums">№ Л041-00110-91/00554225</h4>
                              <p className="text-xs text-stone-600 font-sans mt-0.5">Дата выдачи: 22.06.2022 • Срок действия: Бессрочно • ИНН: 7713778678</p>
                            </div>
                            <span className="text-emerald-800 bg-emerald-50 font-sans font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg inline-block border border-emerald-200">
                              100% аккредитация штата (39 сотр.)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                            <div className="space-y-4">
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Номенклатура лицензированных работ и услуг (24 вида)</h5>
                              <div className="p-3 bg-white rounded-xl border border-stone-200 max-h-[260px] overflow-y-auto space-y-2 text-xs text-stone-800 scrollbar-thin">
                                <p className="font-bold text-[#022C22]">1000.1. Первичная доврачебная помощь (амбулаторно):</p>
                                <p className="pl-2 text-stone-700">1000.1.5 лабораторная диагностика; 1000.1.6 лечебная физкультура; 1000.1.7 лечебное дело; 1000.1.12 медицинский массаж; 1000.1.23 физиотерапия; 1000.1.24 функциональная диагностика.</p>
                                <p className="font-bold text-[#022C22] pt-1">1000.2. Первичная врачебная помощь (амбулаторно):</p>
                                <p className="pl-2 text-stone-700">1000.2.3 организация здравоохранения и общественное здоровье, эпидемиология; 1000.2.5 терапия.</p>
                                <p className="font-bold text-[#022C22] pt-1">1000.4. Первичная специализированная помощь (амбулаторно):</p>
                                <p className="pl-2 text-stone-700">1000.4.18 диетология; 1000.4.27 лечебная физкультура; 1000.4.36 организация здравоохранения и общественное здоровье, эпидемиология; 1000.4.67 физиотерапия; 1000.4.69 функциональная диагностика.</p>
                                <p className="font-bold text-[#022C22] pt-1">1040. Санаторно-курортное лечение:</p>
                                <p className="pl-2 text-stone-700">1040.11 диетология; 1040.16 лечебная физкультура; 1040.20 медицинский массаж; 1040.24 организация здравоохранения и общественное здоровье, эпидемиология; 1040.28 педиатрия; 1040.35 сестринское дело; 1040.44 терапия; 1040.46 ультразвуковая диагностика; 1040.48 физиотерапия; 1040.50 функциональная диагностика.</p>
                                <p className="font-bold text-[#022C22] pt-1">1070. Медицинские экспертизы:</p>
                                <p className="pl-2 text-stone-700">1070.8 экспертиза качества медицинской помощи.</p>
                              </div>
                              
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2 pt-2">Диагностическая база</h5>
                              <p className="text-xs sm:text-sm text-stone-800 font-sans leading-relaxed">
                                <strong className="text-[#022C22]">Ультразвуковая диагностика (с 2026 г.):</strong> отечественный аппарат экспертного класса «РуСкан» (УЗИ щитовидной железы, печени, желчного пузыря и протоков, почек, мочевого пузыря, простаты, эндокринной системы, сосудов головы, шеи и нижних конечностей).
                              </p>
                              <p className="text-xs sm:text-sm text-stone-800 font-sans leading-relaxed">
                                <strong className="text-[#022C22]">Функциональная диагностика и лаборатория:</strong> ЭКГ и диагностика функции внешнего дыхания (ФВД); клинические, биохимические и иммуноферментные (ИФА) анализы крови, определение специфических ферментов.
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Методы лечения и бальнеогрязелечения</h5>
                              <div className="p-3 bg-white rounded-xl border border-stone-200 max-h-[380px] overflow-y-auto space-y-2.5 text-sm text-stone-800 scrollbar-thin">
                                <p className="leading-relaxed">• <strong>Грязелечение:</strong> аппликации сульфидных иловых грязей Сакского озера при болезнях костно-мышечной системы и внутренних органов;</p>
                                <p className="leading-relaxed">• <strong>Бальнеологические ванны:</strong> хвойные, хвойно-жемчужные, йодобромные, лавандовые, ванны с раствором бишофита, с экстрактом пиявки, с крымскими эфирными маслами и морским коллагеном;</p>
                                <p className="leading-relaxed">• <strong>Сухие углекислые ванны</strong> и <strong>лечебные души</strong> (циркулярный, восходящий, подводный душ-массаж);</p>
                                <p className="leading-relaxed">• <strong>Аппаратная физиотерапия:</strong> гальванизация и лекарственный электрофорез, магнитотерапия, инфитатерапия, ультразвук и ультрафонофорез, дарсонвализация, лимфодренаж, диадинамотерапия, амплипульстерапия, УВЧ и СМВ-терапия;</p>
                                <p className="leading-relaxed">• <strong>Ингаляторий:</strong> лекарственные ингаляции в сочетании с бальнео- и электрофизиопроцедурами при бронхитах, бронхиальной астме и патологии ЛОР-органов;</p>
                                <p className="leading-relaxed">• <strong>ЛФК и механотерапия:</strong> зал кардиотренажеров, спортивная площадка, комплексы при болезнях сердца, легких, грыжах позвоночника, остеохондрозе и артрозах, вытяжение по программе «Детензор», 3 режима терренкура;</p>
                                <p className="leading-relaxed">• <strong>Массаж:</strong> классический медицинский, программный на кушетке «Ормед», гидромассаж, лимфодренажный и электростатический массаж;</p>
                                <p className="leading-relaxed">• <strong>Психоразгрузка и фитотерапия:</strong> аппарат «Сенсориум», инфракрасная сауна, фитобар с бюветом минеральных вод (кислородный коктейль и фитосборы);</p>
                                <p className="leading-relaxed">• <strong>Диетическое питание:</strong> заказная система по 22-дневному меню под курацией медицинской сестры диетической.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePassportTab === 'structure' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left column: medical profiles & staff */}
                          <div className="space-y-4">
                            <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Руководство медициной и профили лечения</h5>
                            <div className="space-y-3 text-sm text-stone-800">
                              <div className="bg-white p-3.5 rounded-xl border border-[#c5a880]/50">
                                <strong className="text-[#022C22] block text-sm font-bold">Кадровый состав (39 сотрудников, 100% аккредитация):</strong>
                                <p className="text-xs leading-relaxed mt-1 text-stone-700">
                                  С января 2025 г. медицину санатория возглавляет врач высшей категории, к.м.н., Заслуженный врач Республики Крым, доцент по специальности «Восстановительная медицина», ветеран боевых действий СВО <strong>Душкин Игорь Фёдорович</strong>. Прием ведут 5 опытных врачей (терапевты, физиотерапевт, педиатр, врач функциональной диагностики).
                                </p>
                              </div>
                              
                              <div className="space-y-3 pl-3 border-l-2 border-[#c5a880] text-stone-700">
                                <div className="bg-white p-3 rounded-xl border border-stone-200">
                                  <strong className="text-[#022C22] block text-sm font-bold">1. Органы дыхания и ЛОР-органы:</strong>
                                  <p className="text-xs leading-relaxed mt-1">Хронические и рецидивирующие бронхиты, бронхиальная астма с различными клинико-патогенетическими вариантами течения, патология ЛОР-органов.</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-stone-200">
                                  <strong className="text-[#022C22] block text-sm font-bold">2. Костно-мышечная система и позвоночник:</strong>
                                  <p className="text-xs leading-relaxed mt-1">Грыжи позвоночника, остеохондроз, артрозы крупных суставов (аппликации грязей Сакского озера, ЛФК, «Детензор», кушетка «Ормед»).</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-stone-200">
                                  <strong className="text-[#022C22] block text-sm font-bold">3. Сердце, сосуды и нервная система:</strong>
                                  <p className="text-xs leading-relaxed mt-1">Болезни сердца и кровообращения, психосоматические расстройства и стресс (сухие углекислые ванны, аппарат «Сенсориум», терренкур).</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right column: internal medical structure */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Кабинеты медицинского отделения</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1 text-stone-800">
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет грязелечения (Сакские грязи)</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Бальнеологический кабинет (ванны и души)</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет сухих углекислых ванн</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет физиотерапии и магнитотерапии</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинеты ручного массажа и «Ормед»</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет лимфодренажного и ЭС-массажа</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Зал ЛФК, тренажеров и «Детензор»</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет психоразгрузки «Сенсориум»</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Ингаляторий и инфракрасная сауна</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Фитобар с бюветом минеральных вод</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет УЗ-диагностики («РуСкан»)</span>
                                <span className="bg-white p-2.5 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет ФД (ЭКГ, ФВД) и Лаборатория</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 bg-emerald-50/90 p-4 rounded-xl border border-emerald-200 text-sm">
                              <strong className="text-emerald-950 font-sans block font-bold text-xs uppercase tracking-wider">Диетическое питание и круглогодичный режим:</strong>
                              <p className="text-emerald-900 leading-relaxed text-xs sm:text-sm mt-1">
                                Санаторий работает 12 месяцев в году. Столовая оснащена новым технологическим оборудованием; лечебное питание организовано по заказной системе на основании 22-дневного меню под курацией медицинской сестры диетической.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MAIN LIST OF DOCUMENT TILES */}
            <div className="space-y-5">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, idx) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="bg-white rounded-2xl border border-stone-200 hover:border-[#c5a880] p-6 sm:p-7 md:p-8 hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden group shadow-xs"
                      >
                        {/* Left accent bar on hover */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c5a880] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="space-y-4 flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] bg-[#c5a880]/15 border border-[#c5a880]/30 px-3 py-1 rounded-lg">
                              {doc.categoryLabel}
                            </span>
                            {doc.code && (
                              <span className="text-stone-800 text-xs sm:text-[13px] font-mono font-bold bg-stone-100 px-3 py-1 rounded-lg border border-stone-200 tabular-nums">
                                {doc.code}
                              </span>
                            )}
                            {doc.pdfUrl?.startsWith('data:') ? (
                              <span className="text-emerald-800 text-xs font-sans font-bold flex items-center space-x-1.5 border border-emerald-300 bg-emerald-100/80 px-3 py-1 rounded-lg shadow-2xs">
                                <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>ЗАГРУЖЕННЫЙ PDF В БАЗЕ</span>
                              </span>
                            ) : (
                              <span className="text-emerald-800 text-xs font-sans font-semibold flex items-center space-x-1.5 border border-emerald-200/60 bg-emerald-50 px-3 py-1 rounded-lg">
                                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>ОФИЦИАЛЬНЫЙ PDF</span>
                              </span>
                            )}
                          </div>

                          {/* Document Title with Icon */}
                          <div className="flex items-start gap-4 pt-0.5">
                            <div className="w-12 h-12 rounded-xl bg-[#022C22] text-[#c5a880] flex items-center justify-center shrink-0 shadow-sm mt-0.5 group-hover:scale-105 group-hover:bg-[#c5a880] group-hover:text-[#022C22] transition-all">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 
                                onClick={() => setViewingDoc(doc)}
                                className="font-sans text-xl sm:text-2xl font-bold text-[#022C22] tracking-tight group-hover:text-[#9b7b51] transition-colors leading-snug cursor-pointer select-none"
                                title={`Открыть «${doc.title}»`}
                              >
                                {formatDocTitle(doc.title)}
                              </h3>
                            </div>
                          </div>

                          {/* Summary / Description */}
                          <p className="text-base sm:text-[16px] text-stone-800 leading-relaxed font-sans sm:pl-16">
                            {doc.summary}
                          </p>

                          {/* Document Meta Info */}
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-stone-600 font-sans sm:pl-16 pt-3.5 border-t border-stone-100">
                            <span className="font-mono tabular-nums">Размер файла: <strong className="text-stone-900 font-semibold">{doc.fileSize || '1.2 MB'}</strong></span>
                            <span className="text-stone-300">•</span>
                            <span className="font-mono tabular-nums">Дата утверждения: <strong className="text-stone-900 font-semibold">{doc.uploadDate || '2026'}</strong></span>
                            <span className="text-stone-300">•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                              <Check className="w-4 h-4" /> Включен в государственный реестр
                            </span>
                          </div>
                        </div>

                        {/* Interactive actions block */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                          
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 cursor-pointer flex-1 lg:flex-initial justify-center shadow-md active:scale-95 font-sans"
                            title="Открыть и читать официальный PDF документ"
                          >
                            <Eye className="w-4 h-4 text-[#c5a880] group-hover:text-[#022C22]" />
                            <span>Читать документ</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(doc)}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-[#022C22] px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer border border-stone-300 flex-1 lg:flex-initial justify-center font-sans"
                            title="Скачать PDF файл на устройство"
                          >
                            <Download className="w-4 h-4 text-stone-600" />
                            <span>PDF</span>
                          </button>

                          {isAdminMode && (
                            <div className="flex-1 lg:flex-initial">
                              <label className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer justify-center font-sans">
                                {uploadingDocId === doc.id ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                                    <span>{uploadProgress}%</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4" />
                                    <span>{doc.pdfUrl?.startsWith('data:') ? 'Обновить PDF' : 'Загрузить PDF'}</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => handleSimulatedPdfUpload(doc.id, e)}
                                  disabled={uploadingDocId !== null}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
                      <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-600 text-base font-semibold">Документы по выбранным критериям не найдены.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }} 
                        className="mt-3 text-xs text-[#022C22] hover:text-[#c5a880] font-bold uppercase cursor-pointer underline"
                      >
                        Сбросить фильтры поиска
                      </button>
                    </div>
                  )}
            </div>

      </div>

      {/* Fullscreen Overlay Document Viewer */}
      <AnimatePresence>
        {viewingDoc && (
          <motion.div
            key={`fullscreen-viewer-${viewingDoc.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] w-screen h-screen flex flex-col overflow-hidden bg-stone-950"
          >
            <PdfViewer
              doc={viewingDoc}
              onBack={() => setViewingDoc(null)}
              isModalFullscreen={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
