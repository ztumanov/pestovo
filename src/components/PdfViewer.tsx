import React, { useState, useEffect, useRef } from 'react';
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
  Minimize2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  LayoutGrid,
  FileCheck,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';
import { getDocumentPdfUrl } from '../utils/pdfGenerator';
import { DocumentItem } from '../types';

// Setup pdfjs worker from reliable CDN to guarantee fast bundling without worker path issues
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('pdfjs worker configuration warning:', e);
}

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
  isModalFullscreen?: boolean;
}

export default function PdfViewer({ doc, onBack, className = '', isModalFullscreen = false }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(isModalFullscreen);
  
  // PDF.js Page Navigation & Zoom State
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'canvas' | 'embed'>('canvas');
  const [pageRendering, setPageRendering] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const initialPageDim = useRef<{ width: number; height: number } | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Keyboard navigation & Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage(p => Math.max(p - 1, 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPage(p => (numPages > 0 ? Math.min(p + 1, numPages) : p));
      } else if (e.key === '+' || e.key === '=') {
        setScale(prev => Math.min(prev + 0.15, 3.0));
      } else if (e.key === '-') {
        setScale(prev => Math.max(prev - 0.15, 0.4));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, numPages]);

  // 1. Resolve and get the valid Blob PDF URL
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setCurrentPage(1);

    getDocumentPdfUrl(doc)
      .then((url) => {
        if (isMounted) {
          setPdfUrl(url);
          loadPdfDocument(url);
        }
      })
      .catch((err) => {
        console.error('Failed to get document PDF URL:', err);
        if (isMounted) {
          setError('Не удалось сформировать или прочитать PDF файл.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [doc]);

  // 2. Load PDF document via pdfjsLib for direct canvas rendering
  const loadPdfDocument = async (url: string) => {
    try {
      setLoading(true);
      setError(null);

      const loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
        cMapPacked: true,
      });

      const loadedPdf = await loadingTask.promise;
      setPdfDoc(loadedPdf);
      setNumPages(loadedPdf.numPages);
      setCurrentPage(1);

      // Measure page 1 unscaled dimensions and auto-scale for perfect proportions
      try {
        const page1 = await loadedPdf.getPage(1);
        const unscaledViewport = page1.getViewport({ scale: 1.0 });
        initialPageDim.current = {
          width: unscaledViewport.width,
          height: unscaledViewport.height
        };

        const container = viewportRef.current;
        const cWidth = container?.clientWidth || window.innerWidth;
        const cHeight = container?.clientHeight || (window.innerHeight - 130);

        if (cWidth < 768) {
          // Mobile: fit full width with comfortable padding
          const s = (cWidth - 24) / unscaledViewport.width;
          setScale(Math.min(Math.max(s, 0.5), 1.4));
        } else {
          // Desktop: fit whole page height into screen with comfortable margins
          const s = (cHeight - 48) / unscaledViewport.height;
          setScale(Math.min(Math.max(s, 0.65), 1.5));
        }
      } catch (measureErr) {
        console.warn('Could not measure initial page dimensions:', measureErr);
      }

      setLoading(false);
    } catch (err) {
      console.warn('PDF.js canvas engine fallback to standard embed:', err);
      // If pdfjs fails to parse (e.g. CORS on external link), seamlessly fallback to Embed mode
      setRenderMode('embed');
      setLoading(false);
    }
  };

  // 3. Render current page to canvas with high DPI sharpness
  useEffect(() => {
    if (!pdfDoc || renderMode !== 'canvas') return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        setPageRendering(true);
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Cancel previous render task if any
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
        }

        const viewport = page.getViewport({ scale, rotation });
        const pixelRatio = window.devicePixelRatio || 1.5;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const transform = pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : undefined;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          transform: transform as any
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (!isCancelled) {
          setPageRendering(false);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
        }
        if (!isCancelled) {
          setPageRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, currentPage, scale, rotation, renderMode]);

  // Handlers
  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    const cleanTitle = (doc.title || 'document').replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_').slice(0, 60);
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
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.15, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.4));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleFitPage = () => {
    if (!initialPageDim.current) {
      setScale(0.95);
      return;
    }
    const container = viewportRef.current;
    const cHeight = container?.clientHeight || (window.innerHeight - 130);
    const s = (cHeight - 48) / initialPageDim.current.height;
    setScale(Math.min(Math.max(s, 0.4), 2.0));
  };

  const handleFitWidth = () => {
    if (!initialPageDim.current) {
      setScale(1.2);
      return;
    }
    const container = viewportRef.current;
    const cWidth = container?.clientWidth || window.innerWidth;
    const padding = cWidth < 640 ? 20 : 48;
    const s = (cWidth - padding) / initialPageDim.current.width;
    setScale(Math.min(Math.max(s, 0.4), 2.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  return (
    <div
      className={`w-full h-full flex flex-col bg-stone-950 select-none overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : ''
      } ${className}`}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <div className="bg-[#022C22] text-white px-4 sm:px-6 py-3 border-b border-[#c5a880]/30 shrink-0 flex items-center justify-between z-10 shadow-md">
        
        {/* Left: Back/Close button & Document Title */}
        <div className="flex items-center space-x-3.5 min-w-0 flex-1 mr-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 bg-white/10 hover:bg-[#c5a880] hover:text-[#022C22] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
            title="Закрыть просмотр документа (Escape)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">К списку документов (Esc)</span>
            <span className="sm:hidden">Назад</span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#c5a880] bg-white/10 px-2.5 py-0.5 rounded border border-white/15 shrink-0">
                {doc.code || doc.number || 'PDF ДОКУМЕНТ'}
              </span>
              <h3 className="text-xs sm:text-sm text-stone-100 font-sans font-bold truncate max-w-xl hidden md:block">
                {doc.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Right: Actions & Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {pdfUrl && (
            <>
              {/* Toggle Canvas / Native Embed Mode */}
              <button
                type="button"
                onClick={() => setRenderMode(prev => prev === 'canvas' ? 'embed' : 'canvas')}
                className="bg-white/10 hover:bg-white/20 text-stone-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer hidden lg:inline-flex"
                title="Переключить режим отображения"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{renderMode === 'canvas' ? 'Встроенный PDF' : 'Интерактивный просмотр'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 text-stone-100 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer font-sans"
                title="Распечатать PDF документ"
              >
                <Printer className="w-4 h-4 text-[#c5a880]" />
                <span className="hidden md:inline">Печать</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="bg-[#c5a880] hover:bg-[#FAF9F6] text-[#022C22] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer shadow-md font-sans active:scale-95"
                title="Скачать оригинальный PDF файл"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Скачать PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-white/10 text-stone-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Закрыть документ (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. SUB-TOOLBAR: Navigation & Smart Zoom Controls */}
      {renderMode === 'canvas' && numPages > 0 && !loading && (
        <div className="bg-stone-900/95 text-stone-200 px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 select-none shrink-0 backdrop-blur-sm">
          {/* Page Selector */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border border-stone-700"
              title="Предыдущая страница (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-bold text-[#c5a880] px-3 py-1 bg-stone-950 rounded-lg border border-stone-800">
              Страница {currentPage} из {numPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border border-stone-700"
              title="Следующая страница (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Smart Zoom & Proportion Controls */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 cursor-pointer transition-colors text-stone-200 border border-stone-700"
              title="Уменьшить масштаб (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            
            <button
              type="button"
              onClick={handleResetZoom}
              className="font-mono text-xs font-bold text-stone-200 px-2.5 py-1 bg-stone-950 hover:bg-stone-800 rounded-lg border border-stone-700 transition-colors cursor-pointer"
              title="Сбросить на 100%"
            >
              {Math.round(scale * 100)}%
            </button>
            
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 cursor-pointer transition-colors text-stone-200 border border-stone-700"
              title="Увеличить масштаб (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-stone-700 mx-1"></div>

            <button
              type="button"
              onClick={handleFitPage}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors border border-stone-700 hidden sm:inline-flex items-center gap-1"
              title="Подогнать страницу целиком по высоте (стандарт А4)"
            >
              <span>Целиком (А4)</span>
            </button>

            <button
              type="button"
              onClick={handleFitWidth}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors border border-stone-700 hidden sm:inline-flex items-center gap-1"
              title="Подогнать под ширину экрана для чтения"
            >
              <span>По ширине</span>
            </button>

            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 cursor-pointer transition-colors text-stone-200 border border-stone-700"
              title="Повернуть на 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Document Status */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-emerald-400 font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Официальный ведомственный документ ФТС России</span>
          </div>
        </div>
      )}

      {/* 3. MAIN PDF VIEWPORT (Scrollable, centered with standard document margins) */}
      <div 
        ref={viewportRef}
        className="flex-1 bg-stone-950 relative overflow-auto flex flex-col items-center p-4 sm:p-6 md:p-8 min-h-0"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-stone-900/90 rounded-2xl border border-stone-800 backdrop-blur-sm shadow-xl font-sans my-auto">
            <Loader2 className="w-10 h-10 text-[#c5a880] animate-spin mb-4" />
            <span className="font-sans font-bold text-base text-stone-100">Загрузка и расшифровка PDF...</span>
            <span className="text-xs text-stone-400 mt-1 font-mono">Формирование страниц документа высокой чёткости</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md bg-stone-900 rounded-2xl border border-red-500/40 shadow-xl my-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-sm font-semibold text-stone-100 mb-2">{error}</p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  getDocumentPdfUrl(doc).then((url) => {
                    setPdfUrl(url);
                    loadPdfDocument(url);
                  });
                }}
                className="flex items-center space-x-1.5 bg-[#022C22] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-[#c5a880] hover:text-[#022C22] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Повторить</span>
              </button>
              {pdfUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center space-x-1.5 bg-[#c5a880] text-[#022C22] px-4 py-2 rounded-xl text-xs font-bold uppercase"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Скачать файл</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODE A: High-Definition Canvas Rendering in standard natural A4 paper proportions */}
        {renderMode === 'canvas' && !loading && !error && (
          <div className="my-auto transition-all duration-150 py-2">
            <div className="relative shadow-[0_25px_60px_rgba(0,0,0,0.7)] rounded-sm bg-white overflow-hidden border border-stone-700/60 ring-1 ring-white/10">
              {pageRendering && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-[#022C22] animate-spin" />
                </div>
              )}
              <canvas ref={canvasRef} className="block" />
            </div>
          </div>
        )}

        {/* MODE B: Native PDF Object / Embed */}
        {renderMode === 'embed' && pdfUrl && !loading && !error && (
          <div className="w-full h-full max-w-6xl mx-auto relative bg-white rounded-xl overflow-hidden shadow-2xl">
            <object
              data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full"
            >
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                title={doc.title}
                className="w-full h-full border-0"
              >
                <div className="p-8 text-center bg-stone-100 flex flex-col items-center justify-center h-full space-y-4">
                  <FileText className="w-12 h-12 text-[#022C22]" />
                  <p className="text-sm font-bold text-stone-800">
                    Ваш браузер не поддерживает встроенный просмотр PDF.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="bg-[#022C22] text-[#FAF9F6] font-semibold text-xs py-3 px-6 rounded-xl uppercase tracking-wider flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Скачать PDF документ ({doc.fileSize || '1.2 MB'})
                  </button>
                </div>
              </iframe>
            </object>
          </div>
        )}
      </div>

      {/* 4. BOTTOM FOOTER BAR */}
      <div className="bg-stone-950 border-t border-stone-800/80 px-4 sm:px-6 py-2.5 text-xs font-mono text-stone-400 flex flex-col sm:flex-row justify-between items-center gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>ФГКУ «Санаторий «Ясная Поляна» ФТС России» • Реестр официальной документации</span>
        </div>
        <div className="flex items-center space-x-3 text-stone-300">
          <span>Размер: {doc.fileSize || '1.2 MB'}</span>
          <span>•</span>
          <span>Дата: {doc.uploadDate || doc.date || '2026'}</span>
        </div>
      </div>
    </div>
  );
}
