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
  AlertCircle
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
}

export default function PdfViewer({ doc, onBack, className = '' }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // PDF.js Page Navigation & Zoom State
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [rotation, setRotation] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'canvas' | 'embed'>('canvas');
  const [pageRendering, setPageRendering] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

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

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.6));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-stone-900 rounded-2xl border border-stone-700 shadow-2xl overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : 'h-[82vh]'
      } ${className}`}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <div className="bg-[#022C22] text-white px-4 py-3 border-b border-[#c5a880]/30 shrink-0 flex flex-wrap gap-3 items-center justify-between z-10">
        
        {/* Left: Back button & Document Meta */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-[#c5a880] hover:text-[#022C22] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">К списку документов</span>
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

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {pdfUrl && (
            <>
              {/* Toggle Canvas / Native Embed Mode */}
              <button
                type="button"
                onClick={() => setRenderMode(prev => prev === 'canvas' ? 'embed' : 'canvas')}
                className="bg-white/10 hover:bg-white/20 text-stone-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer hidden lg:inline-flex"
                title="Переключить режим отображения"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{renderMode === 'canvas' ? 'Встроенный PDF' : 'Интерактивный просмотр'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenNewTab}
                className="bg-white/10 hover:bg-[#c5a880] hover:text-[#022C22] text-stone-100 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Открыть PDF в отдельной вкладке"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Во весь экран</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 text-stone-100 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Распечатать PDF документ"
              >
                <Printer className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="hidden md:inline">Печать</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="bg-[#c5a880] hover:bg-[#FAF9F6] text-[#022C22] px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer shadow"
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
            className="p-1.5 hover:bg-white/10 text-stone-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Развернуть во весь экран"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. SUB-TOOLBAR: Navigation & Zoom Controls */}
      {renderMode === 'canvas' && numPages > 0 && !loading && (
        <div className="bg-stone-800 text-stone-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-stone-700 select-none shrink-0">
          {/* Page Selector */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Предыдущая страница"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-bold text-[#c5a880] px-2 py-0.5 bg-stone-900 rounded border border-stone-700">
              Страница {currentPage} из {numPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
              className="p-1 rounded bg-stone-700 hover:bg-stone-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Следующая страница"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom & Rotation Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded bg-stone-700 hover:bg-stone-600 cursor-pointer transition-colors"
              title="Уменьшить масштаб"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold text-stone-300 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded bg-stone-700 hover:bg-stone-600 cursor-pointer transition-colors"
              title="Увеличить масштаб"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-stone-600 mx-1"></div>
            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 rounded bg-stone-700 hover:bg-stone-600 cursor-pointer transition-colors flex items-center space-x-1"
              title="Повернуть на 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Document Status */}
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-emerald-400 font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Официальный ведомственный документ ФТС РФ</span>
          </div>
        </div>
      )}

      {/* 3. MAIN PDF VIEWPORT */}
      <div className="flex-1 bg-stone-900 relative overflow-auto flex items-center justify-center p-4 min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-stone-800/80 rounded-2xl border border-stone-700 backdrop-blur-sm shadow-xl">
            <Loader2 className="w-10 h-10 text-[#c5a880] animate-spin mb-4" />
            <span className="font-serif font-bold text-base text-stone-100">Загрузка и расшифровка PDF...</span>
            <span className="text-xs text-stone-400 mt-1 font-mono">Формирование страниц документа высокой чёткости</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md bg-stone-800 rounded-2xl border border-red-500/40 shadow-xl">
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

        {/* MODE A: High-Definition Canvas Rendering */}
        {renderMode === 'canvas' && !loading && !error && (
          <div className="flex flex-col items-center justify-center my-auto min-h-full transition-all">
            <div className="relative shadow-2xl rounded bg-white overflow-hidden border border-stone-700">
              {pageRendering && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-[#022C22] animate-spin" />
                </div>
              )}
              <canvas ref={canvasRef} className="block max-w-full" />
            </div>
          </div>
        )}

        {/* MODE B: Native PDF Object / Embed */}
        {renderMode === 'embed' && pdfUrl && !loading && !error && (
          <div className="w-full h-full relative bg-white rounded-xl overflow-hidden shadow-2xl">
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
      <div className="bg-stone-950 border-t border-stone-800 px-4 py-2.5 text-[11px] font-mono text-stone-400 flex flex-col sm:flex-row justify-between items-center gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>ФГКУ «Санаторий «Ясная Поляна» ФТС России» • Лицензия № Л041-00110-91/00554225</span>
        </div>
        <div className="flex items-center space-x-3 text-stone-300">
          <span>Размер: {doc.fileSize || '1.2 MB'}</span>
          <span>•</span>
          <span>Утвержден: {doc.uploadDate || doc.date || '2026'}</span>
        </div>
      </div>
    </motion.div>
  );
}
