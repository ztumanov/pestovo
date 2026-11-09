import React, { useState } from 'react';
import { X, ZoomIn, FileSpreadsheet, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsArticleContentProps {
  content: string;
  className?: string;
}

/**
 * Parses markdown table text into structured columns and rows
 */
function parseMarkdownTable(text: string): { headers: string[]; rows: string[][] } | null {
  const lines = text.trim().split('\n').map(l => l.trim());
  if (lines.length < 2) return null;

  // Header line
  if (!lines[0].startsWith('|') || !lines[0].endsWith('|')) return null;
  // Separator line
  if (!lines[1].includes('---') || !lines[1].startsWith('|')) return null;

  const parseCells = (line: string) => 
    line
      .slice(1, -1)
      .split('|')
      .map(c => c.trim());

  const headers = parseCells(lines[0]);
  const rows: string[][] = [];

  for (let i = 2; i < lines.length; i++) {
    if (lines[i].startsWith('|') && lines[i].endsWith('|')) {
      rows.push(parseCells(lines[i]));
    }
  }

  return { headers, rows };
}

/**
 * Component to display rich news content supporting:
 * - HTML Tables & Markdown Tables (with responsive scroll & resort styling)
 * - In-text Embedded Images (with alignment, captions, & click-to-enlarge Lightbox)
 * - Headings (H2, H3), Quotes, Lists, and formatted paragraphs
 */
export default function NewsArticleContent({ content, className = '' }: NewsArticleContentProps) {
  const [zoomImage, setZoomImage] = useState<{ src: string; caption?: string } | null>(null);

  if (!content || !content.trim()) {
    return <p className="text-stone-400 italic font-sans text-sm">Текст статьи отсутствует.</p>;
  }

  // Pre-process content:
  // Normalize markdown images ![caption](url) to HTML figures with click handler
  let processedContent = content;

  // Convert markdown images: ![caption](url) -> <figure class="news-embedded-img news-img-center" data-src="url" data-caption="caption"><img src="url" alt="caption" /><figcaption>caption</figcaption></figure>
  processedContent = processedContent.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (_, caption, url) => `
      <figure class="my-6 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-md text-center max-w-3xl mx-auto group cursor-pointer" onclick="window.dispatchNewsImgZoom && window.dispatchNewsImgZoom('${encodeURIComponent(url)}', '${encodeURIComponent(caption || '')}')">
        <img src="${url}" alt="${caption || 'Изображение в новости'}" class="w-full max-h-[520px] object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
        ${caption ? `<figcaption class="py-2.5 px-4 text-xs font-sans text-stone-600 bg-stone-50 border-t border-stone-200/60 italic">${caption}</figcaption>` : ''}
      </figure>
    `
  );

  // Convert markdown tables into styled HTML tables
  const markdownTableRegex = /((?:^|\n)\|[^\n]+\|\n\|(?:\s*[-:]+[-| :]*)\|\n(?:\|[^\n]+\|\n?)+)/g;
  processedContent = processedContent.replace(markdownTableRegex, (match) => {
    const parsed = parseMarkdownTable(match);
    if (!parsed) return match;

    const thead = parsed.headers.map(h => `<th class="px-4 py-3 text-left font-bold font-sans text-xs sm:text-sm uppercase tracking-wider border-r border-[#c5a880]/20 last:border-r-0">${h}</th>`).join('');
    const tbody = parsed.rows.map((row, rIdx) => `
      <tr class="${rIdx % 2 === 1 ? 'bg-stone-50/70' : 'bg-white'} hover:bg-amber-50/40 transition-colors border-b border-stone-200/80 last:border-b-0">
        ${row.map(cell => `<td class="px-4 py-3 text-stone-800 font-sans text-xs sm:text-sm leading-relaxed border-r border-stone-200/60 last:border-r-0">${cell}</td>`).join('')}
      </tr>
    `).join('');

    return `
      <div class="overflow-x-auto my-6 rounded-xl border border-stone-200 shadow-sm bg-white font-sans max-w-full">
        <table class="w-full text-left border-collapse text-sm">
          <thead><tr class="bg-[#022C22] text-[#c5a880] border-b border-[#c5a880]/30">${thead}</tr></thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
    `;
  });

  // Ensure plain HTML tables are wrapped in responsive horizontal scroll containers if not already wrapped
  if (processedContent.includes('<table') && !processedContent.includes('overflow-x-auto')) {
    processedContent = processedContent.replace(
      /(<table[\s\S]*?<\/table>)/gi,
      '<div class="overflow-x-auto my-6 rounded-xl border border-stone-200 shadow-sm bg-white font-sans max-w-full">$1</div>'
    );
  }

  // Convert markdown headings:
  processedContent = processedContent
    .replace(/^### (.*$)/gim, '<h3 class="font-serif font-bold text-xl sm:text-2xl text-[#022C22] mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-serif font-bold text-2xl sm:text-3xl text-[#022C22] mt-8 mb-4 border-b border-stone-200 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h2 class="font-serif font-bold text-2xl sm:text-3xl text-[#022C22] mt-8 mb-4 border-b border-stone-200 pb-2">$1</h2>');

  // Convert markdown bold and italic:
  processedContent = processedContent
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#022C22]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Convert blockquotes:
  processedContent = processedContent.replace(
    /^> (.*$)/gim,
    '<blockquote class="border-l-4 border-[#c5a880] pl-4 py-1 my-4 text-stone-700 font-serif text-base bg-amber-50/40 rounded-r-lg">$1</blockquote>'
  );

  // Convert horizontal rules:
  processedContent = processedContent.replace(/^---$/gim, '<hr class="my-6 border-stone-200" />');

  // Handle image clicks inside rendered HTML
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'img') {
      const img = target as HTMLImageElement;
      const figure = img.closest('figure');
      const caption = figure?.querySelector('figcaption')?.textContent || img.alt || '';
      setZoomImage({ src: img.src, caption });
    }
  };

  // Check if processed content contains HTML tags
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(processedContent);

  return (
    <div className={`news-article-content ${className}`}>
      {hasHtml ? (
        <div 
          onClick={handleContainerClick}
          dangerouslySetInnerHTML={{ __html: processedContent }}
          className="prose prose-stone max-w-none text-stone-800 leading-relaxed font-sans
            prose-headings:font-serif prose-headings:text-[#022C22] prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
            prose-h2:text-2xl sm:prose-h2:text-3xl
            prose-h3:text-xl sm:prose-h3:text-2xl
            prose-p:mb-4 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-[16px]
            prose-blockquote:border-l-4 prose-blockquote:border-[#c5a880] prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:text-stone-700
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-li:my-1.5
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
            prose-a:text-[#c5a880] prose-a:font-semibold hover:prose-a:underline
            [&_figure]:my-6 [&_figure]:rounded-xl [&_figure]:overflow-hidden [&_figure]:bg-stone-50 [&_figure]:border [&_figure]:border-stone-200 [&_figure]:shadow-md
            [&_figure_img]:rounded-lg [&_figure_img]:w-full [&_figure_img]:max-h-[540px] [&_figure_img]:object-cover [&_figure_img]:cursor-zoom-in
            [&_figcaption]:text-center [&_figcaption]:py-2.5 [&_figcaption]:px-4 [&_figcaption]:text-xs [&_figcaption]:text-stone-600 [&_figcaption]:italic [&_figcaption]:font-sans
            [&_table]:w-full [&_table]:border-collapse
            [&_th]:bg-[#022C22] [&_th]:text-[#c5a880] [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:sm:text-sm [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-wider
            [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-stone-200/80 [&_td]:text-xs [&_td]:sm:text-sm [&_td]:text-stone-800
            [&_tbody_tr:nth-child(even)]:bg-stone-50/70 [&_tbody_tr:hover]:bg-amber-50/40
          "
        />
      ) : (
        <div className="space-y-4 text-stone-800 font-sans leading-relaxed text-base sm:text-[16px]">
          {processedContent.split('\n\n').map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;
            return <p key={idx} className="leading-relaxed">{trimmed}</p>;
          })}
        </div>
      )}

      {/* Lightbox Modal for Embedded Images */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out select-none"
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg"
              title="Закрыть (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[85vh] flex flex-col items-center cursor-default"
            >
              <img
                src={zoomImage.src}
                alt={zoomImage.caption || 'Изображение'}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
              {zoomImage.caption && (
                <div className="mt-3 text-center px-4 py-2 bg-stone-900/80 rounded-lg text-stone-200 text-sm font-sans max-w-2xl border border-white/10 backdrop-blur-sm">
                  {zoomImage.caption}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
