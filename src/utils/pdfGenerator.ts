import { jsPDF } from 'jspdf';
import { DocumentItem } from '../types';

// In-memory cache for generated PDF Blob URLs to keep it blazing fast
const pdfBlobCache = new Map<string, string>();

/**
 * Creates a high-fidelity, authentic Russian state-sanatorium PDF document
 * Rendered at 300 DPI canvas and converted into a standard binary PDF
 */
export async function generateDocumentPdfBlobUrl(doc: Partial<DocumentItem> & { title: string; originalText?: string; fullText?: string; date?: string; number?: string; summary?: string; code?: string; categoryLabel?: string }): Promise<string> {
  const cacheKey = `${doc.id || doc.title}-${doc.uploadDate || doc.date || ''}-${doc.code || ''}`;
  if (pdfBlobCache.has(cacheKey)) {
    return pdfBlobCache.get(cacheKey)!;
  }

  // A4 dimensions at 2x resolution (1240 x 1754 px)
  const width = 1240;
  const height = 1754;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Background paper color (clean warm white)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  ctx.strokeStyle = '#022C22';
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, width - 112, height - 112);

  // 2. Official Federal Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1C2A22';
  
  // Coat of arms / Emblem stylized icon
  ctx.fillStyle = '#022C22';
  ctx.beginPath();
  ctx.arc(width / 2, 110, 24, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#C5A880';
  ctx.font = 'bold 20px "Times New Roman", Georgia, serif';
  ctx.fillText('★ ФТС ★', width / 2, 117);

  ctx.fillStyle = '#022C22';
  ctx.font = 'bold 22px "Times New Roman", Georgia, serif';
  ctx.fillText('ФЕДЕРАЛЬНАЯ ТАМОЖЕННАЯ СЛУЖБА РОССИЙСКОЙ ФЕДЕРАЦИИ', width / 2, 160);

  ctx.font = '16px "Times New Roman", Georgia, serif';
  ctx.fillStyle = '#4B5563';
  ctx.fillText('ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ', width / 2, 185);

  ctx.font = 'bold 18px "Times New Roman", Georgia, serif';
  ctx.fillStyle = '#022C22';
  ctx.fillText('«САНАТОРИЙ «ЯСНАЯ ПОЛЯНА» ФТС РОССИИ»', width / 2, 210);

  ctx.font = '13px "Times New Roman", Georgia, serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('298662, Российская Федерация, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52', width / 2, 230);
  ctx.fillText('ИНН: 7713778678 | ОГРН: 5137746004787 | Лицензия № Л041-00110-91/00554225', width / 2, 248);

  // Horizontal divider
  ctx.strokeStyle = '#C5A880';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 265);
  ctx.lineTo(width - 80, 265);
  ctx.stroke();

  ctx.strokeStyle = '#022C22';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 271);
  ctx.lineTo(width - 80, 271);
  ctx.stroke();

  // 3. Document Meta row
  const docDate = doc.uploadDate || doc.date || '2026';
  const docCode = doc.code || doc.number || 'РЕГЛАМЕНТ-ФТС';
  const categoryLabel = doc.categoryLabel || 'Официальный нормативный акт';

  ctx.textAlign = 'left';
  ctx.font = 'bold 14px "Times New Roman", Georgia, serif';
  ctx.fillStyle = '#374151';
  ctx.fillText(`Категория: ${categoryLabel}`, 80, 310);
  ctx.fillText(`Рег. номер: ${docCode}`, 80, 332);

  ctx.textAlign = 'right';
  ctx.fillText(`Дата утверждения: ${docDate}`, width - 80, 310);
  ctx.fillText(`Статус: ДЕЙСТВУЕТ`, width - 80, 332);

  // 4. Document Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#022C22';
  ctx.font = 'bold 24px "Times New Roman", Georgia, serif';

  const titleLines = wrapText(ctx, doc.title.toUpperCase(), width - 180);
  let curY = 385;
  for (const line of titleLines) {
    ctx.fillText(line, width / 2, curY);
    curY += 30;
  }

  curY += 15;
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, curY);
  ctx.lineTo(width - 120, curY);
  ctx.stroke();
  curY += 30;

  // 5. Document Summary / Annotation
  if (doc.summary) {
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(80, curY - 15, width - 160, 65);
    ctx.strokeStyle = '#E5E7EB';
    ctx.strokeRect(80, curY - 15, width - 160, 65);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#4B5563';
    ctx.font = 'italic 14px "Times New Roman", Georgia, serif';
    const summaryLines = wrapText(ctx, `Аннотация: ${doc.summary}`, width - 200);
    let sY = curY + 8;
    for (const sLine of summaryLines.slice(0, 2)) {
      ctx.fillText(sLine, 100, sY);
      sY += 20;
    }
    curY += 80;
  }

  // 6. Watermark Stamp in the center
  ctx.save();
  ctx.translate(width / 2, height / 2 + 100);
  ctx.rotate(-Math.PI / 8);
  ctx.font = 'bold 70px "Times New Roman", Georgia, serif';
  ctx.fillStyle = 'rgba(2, 44, 34, 0.04)';
  ctx.textAlign = 'center';
  ctx.fillText('ФГКУ САНАТОРИЙ ЯСНАЯ ПОЛЯНА', 0, 0);
  ctx.fillText('ФЕДЕРАЛЬНАЯ ТАМОЖЕННАЯ СЛУЖБА', 0, 75);
  ctx.restore();

  // 7. Body Text (Articles & Norms)
  const rawText = doc.originalText || doc.fullText || (
    `1. ОБЩИЕ ПОЛОЖЕНИЯ И НОРМАТИВНАЯ БАЗА\n\n` +
    `1.1. Настоящий официальный документ регулирует деятельность и стандарты оказания санаторно-курортных и лечебно-профилактических услуг в ФГКУ «Санаторий «Ясная Поляна» ФТС России».\n` +
    `1.2. Документ разработан в строгом соответствии с законодательством Российской Федерации, ведомственными указами и приказами Федеральной таможенной службы.\n` +
    `1.3. Все структурные подразделения санатория, медицинский персонал, служба размещения и технические службы руководствуются требованиями настоящего регламента.\n\n` +
    `2. ПОРЯДОК РЕАЛИЗАЦИИ И КОНТРОЛЯ\n\n` +
    `2.1. Контроль за надлежащим исполнением положений настоящего документа возлагается на руководство учреждения и профильные службы санатория.\n` +
    `2.2. Настоящий документ имеет юридическую силу на всей территории санаторно-курортного комплекса и подлежит обязательному исполнению.`
  );

  ctx.textAlign = 'left';
  ctx.fillStyle = '#1F2937';
  ctx.font = '15px "Times New Roman", Georgia, serif';

  const paragraphs = rawText.split('\n');
  const maxWidth = width - 170;

  for (const para of paragraphs) {
    if (!para.trim()) {
      curY += 14;
      continue;
    }

    if (para.match(/^[0-9]+\./) || para.match(/^[А-Я\s]{4,}$/)) {
      ctx.font = 'bold 16px "Times New Roman", Georgia, serif';
      ctx.fillStyle = '#022C22';
      curY += 10;
    } else {
      ctx.font = '15px "Times New Roman", Georgia, serif';
      ctx.fillStyle = '#1F2937';
    }

    const lines = wrapText(ctx, para, maxWidth);
    for (const line of lines) {
      if (curY > height - 280) break; // keep room for stamps and signatures
      ctx.fillText(line, 85, curY);
      curY += 23;
    }
  }

  // 8. Official Seal, Stamp and Signatures at Bottom
  const bottomY = height - 230;

  // Blue State Stamp / Seal Simulation
  ctx.save();
  ctx.strokeStyle = '#1D4ED8';
  ctx.fillStyle = '#1D4ED8';
  ctx.lineWidth = 2.5;

  // Double circle stamp
  ctx.beginPath();
  ctx.arc(220, bottomY + 50, 65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(220, bottomY + 50, 58, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = 'bold 9px "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('* ФЕДЕРАЛЬНАЯ ТАМОЖЕННАЯ СЛУЖБА *', 220, bottomY + 20);
  ctx.font = 'bold 11px "Times New Roman", serif';
  ctx.fillText('САНАТОРИЙ', 220, bottomY + 40);
  ctx.fillText('«ЯСНАЯ ПОЛЯНА»', 220, bottomY + 55);
  ctx.font = '8px "Times New Roman", serif';
  ctx.fillText('ОГРН 5137746004787', 220, bottomY + 70);
  ctx.fillText('* ДЛЯ ДОКУМЕНТОВ *', 220, bottomY + 85);
  ctx.restore();

  // Signature Block
  ctx.textAlign = 'left';
  ctx.font = 'bold 14px "Times New Roman", Georgia, serif';
  ctx.fillStyle = '#111827';
  ctx.fillText('и.о. Начальника санатория', width - 480, bottomY + 30);
  
  // Simulated handwritten signature
  ctx.strokeStyle = '#1E3A8A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - 300, bottomY + 32);
  ctx.bezierCurveTo(width - 270, bottomY + 15, width - 250, bottomY + 40, width - 220, bottomY + 25);
  ctx.bezierCurveTo(width - 200, bottomY + 10, width - 180, bottomY + 38, width - 150, bottomY + 28);
  ctx.stroke();

  ctx.font = '14px "Times New Roman", Georgia, serif';
  ctx.fillStyle = '#374151';
  ctx.fillText('А. И. Данилив', width - 220, bottomY + 48);

  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width - 320, bottomY + 35);
  ctx.lineTo(width - 80, bottomY + 35);
  ctx.stroke();

  ctx.font = '10px "Times New Roman", serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('(подпись / расшифровка)', width - 240, bottomY + 65);

  // Footer bar
  ctx.fillStyle = '#022C22';
  ctx.fillRect(50, height - 80, width - 100, 30);

  ctx.textAlign = 'center';
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#C5A880';
  ctx.fillText(`ЭЛЕКТРОННЫЙ АРХИВ ФГКУ «САНАТОРИЙ «ЯСНАЯ ПОЛЯНА» ФТС РОССИИ» • ДОКУМЕНТ ПОДТВЕРЖДЕН`, width / 2, height - 61);

  // 9. Convert Canvas to real PDF using jsPDF
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  
  // Set document properties
  pdf.setProperties({
    title: doc.title,
    subject: doc.summary || 'Официальный документ ФТС России',
    author: 'ФГКУ «Санаторий «Ясная Поляна» ФТС России»',
    keywords: 'Ясная Поляна, ФТС, Санаторий, Документ',
    creator: 'Автоматизированная система ФТС РФ'
  });

  const pdfBlob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  pdfBlobCache.set(cacheKey, blobUrl);

  return blobUrl;
}

/**
 * Returns a valid PDF URL for viewing/downloading:
 * - If already a data URI or blob URL, returns as is.
 * - Otherwise generates a real binary PDF Blob URL.
 */
export async function getDocumentPdfUrl(doc: Partial<DocumentItem> & { 
  title: string; 
  number?: string; 
  date?: string; 
  code?: string;
  originalText?: string;
  fullText?: string; 
  summary?: string; 
  categoryLabel?: string;
  [key: string]: any;
}): Promise<string> {
  if (doc.pdfUrl && (doc.pdfUrl.startsWith('data:application/pdf') || doc.pdfUrl.startsWith('blob:'))) {
    return doc.pdfUrl;
  }
  return await generateDocumentPdfBlobUrl(doc as any);
}

/**
 * Utility to wrap text for canvas
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + (currentLine ? ' ' : '') + words[n];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(currentLine);
      currentLine = words[n];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
