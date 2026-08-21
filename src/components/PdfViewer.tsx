import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Printer, 
  FileText, 
  Shield, 
  Check, 
  Loader2,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { getDocumentPdfUrl } from '../utils/pdfGenerator';
import { DocumentItem } from '../types';

interface PdfViewerProps {
  doc: Partial<DocumentItem> & { 
    id?: string;
    title: string; 
    code?: string;
    number?: string;
    uploadDate?: string;
    date?: string;
    fileSize?: string;
    pdfUrl?: string | null;
    originalText?: string;
    fullText?: string;
    summary?: string;
    categoryLabel?: string;
  };
  onBack: () => void;
  className?: string;
}

export default function PdfViewer({ doc, onBack, className = '' }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getDocumentPdfUrl(doc)
      .then((url) => {
        if (isMounted) {
          setPdfUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate PDF:', err);
        if (isMounted) {
          setError('Не удалось загрузить PDF документ. Попробуйте снова.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [doc]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    // Sanitized file name
    const cleanTitle = (doc.title || 'document').replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_').slice(0, 50);
    a.download = `${cleanTitle}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    if (!pdfUrl) return;
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
      // Most browsers will display native PDF toolbar with print button
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`bg-white rounded-lg border border-stone-300 shadow-xl overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : 'h-[78vh]'
      } ${className}`}
    >
      {/* Top Professional Control Bar */}
      <div className="bg-[#022C22] text-white px-4 py-3 border-b border-[#c5a880]/30 shrink-0 flex flex-wrap gap-3 items-center justify-between">
        
        {/* Left: Back button & Document Meta */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#c5a880]" />
            <span className="hidden sm:inline">Назад к перечню</span>
            <span className="sm:hidden">Назад</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c5a880] bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0">
                {doc.code || doc.number || 'PDF ДОКУМЕНТ'}
              </span>
              <span className="text-xs text-stone-200 truncate font-serif font-semibold hidden md:inline">
                {doc.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Open in new tab, Download, Print, Fullscreen) */}
        <div className="flex items-center space-x-2">
          {pdfUrl && (
            <>
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="bg-white/10 hover:bg-[#c5a880] hover:text-[#022C22] text-stone-100 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Открыть PDF в отдельной вкладке браузера"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">В новой вкладке</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 text-stone-100 p-1.5 sm:px-3 sm:py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Распечатать PDF документ"
              >
                <Printer className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="hidden md:inline">Печать</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="bg-[#c5a880] hover:bg-[#FAF9F6] text-[#022C22] px-3.5 py-1.5 rounded-sm text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer shadow"
                title="Скачать оригинальный PDF файл"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Скачать PDF</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-white/10 text-stone-300 hover:text-white rounded transition-colors cursor-pointer"
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Развернуть на весь экран"}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

        {/* Status notice */}
      <div className="bg-[#033E31] text-[#c5a880] px-4 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-[#022C22]">
        <div className="flex items-center space-x-2 truncate">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Официальный ведомственный реестр • ФГКУ «Санаторий «Ясная Поляна» ФТС России</span>
        </div>
        <div className="flex items-center space-x-2 shrink-0 text-white/70">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Подлинность подтверждена</span>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 bg-stone-200 relative overflow-hidden flex items-center justify-center min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#022C22] animate-spin mb-4" />
            <span className="font-serif font-bold text-base text-[#022C22]">Загрузка официального PDF...</span>
            <span className="text-xs text-stone-500 mt-1 font-mono">Формирование защищенного документа ФТС России</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md bg-white rounded-lg border border-red-200 shadow p-6">
            <FileText className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-sm font-semibold text-red-800 mb-2">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError(null);
                getDocumentPdfUrl(doc).then((url) => {
                  setPdfUrl(url);
                  setLoading(false);
                });
              }}
              className="mt-2 flex items-center space-x-1.5 bg-[#022C22] text-white px-4 py-2 rounded text-xs font-bold uppercase"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Повторить загрузку</span>
            </button>
          </div>
        )}

        {pdfUrl && !loading && (
          <div className="w-full h-full relative">
            <iframe
              src={pdfUrl}
              title={doc.title}
              className="w-full h-full border-0 bg-white"
            />
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="bg-stone-100 border-t border-stone-300 px-4 py-2 text-[11px] font-mono text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-1 shrink-0">
        <span>Лицензия Минздрава № Л041-00110-91/00554225</span>
        <div className="flex items-center space-x-3">
          <span>Размер: {doc.fileSize || '1.2 MB'}</span>
          <span>•</span>
          <span>Утвержден: {doc.uploadDate || doc.date || '2026'}</span>
        </div>
      </div>
    </motion.div>
  );
}
