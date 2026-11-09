import mammoth from 'mammoth';

export interface ExtractedTable {
  id: string;
  headers: string[];
  rows: string[][];
  rowCount: number;
  colCount: number;
  html: string;
  markdown: string;
}

/**
 * Clean cell text removing extraneous whitespace and standardizing quotes
 */
function cleanCellText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate responsive and styled HTML table markup
 */
export function buildHtmlTableMarkup(headers: string[], rows: string[][], title?: string): string {
  if (headers.length === 0 && rows.length === 0) return '';

  const titleHtml = title 
    ? `<div class="bg-stone-100 px-4 py-2.5 border-b border-stone-200 text-xs font-bold font-sans uppercase tracking-wider text-[#022C22]">${title}</div>`
    : '';

  const theadHtml = headers.length > 0 
    ? `<thead>
        <tr class="bg-[#022C22] text-[#c5a880] border-b border-[#c5a880]/30">
          ${headers.map(h => `<th class="px-4 py-3 text-left font-bold font-sans text-xs sm:text-sm uppercase tracking-wider border-r border-[#c5a880]/20 last:border-r-0">${h || '&nbsp;'}</th>`).join('')}
        </tr>
      </thead>`
    : '';

  const tbodyHtml = `<tbody>
    ${rows.map((row, rIdx) => `
      <tr class="${rIdx % 2 === 1 ? 'bg-stone-50/70' : 'bg-white'} hover:bg-amber-50/50 transition-colors border-b border-stone-200/80 last:border-b-0">
        ${row.map(cell => `<td class="px-4 py-3 text-stone-800 font-sans text-xs sm:text-sm leading-relaxed border-r border-stone-200/60 last:border-r-0">${cell || '&nbsp;'}</td>`).join('')}
      </tr>
    `).join('')}
  </tbody>`;

  return `<div class="overflow-x-auto my-6 rounded-xl border border-stone-200 shadow-sm bg-white font-sans max-w-full">
  ${titleHtml}
  <table class="w-full text-left border-collapse text-sm">
    ${theadHtml}
    ${tbodyHtml}
  </table>
</div>`;
}

/**
 * Generate markdown table string
 */
export function buildMarkdownTableMarkup(headers: string[], rows: string[][]): string {
  if (headers.length === 0 && rows.length === 0) return '';
  const colCount = Math.max(headers.length, ...rows.map(r => r.length));
  
  const padHeaders = [...headers];
  while (padHeaders.length < colCount) {
    padHeaders.push(`Колонка ${padHeaders.length + 1}`);
  }

  const headerLine = `| ${padHeaders.map(h => h.replace(/\|/g, '\\|') || ' ').join(' | ')} |`;
  const separatorLine = `| ${padHeaders.map(() => '---').join(' | ')} |`;
  
  const rowsLines = rows.map(row => {
    const padRow = [...row];
    while (padRow.length < colCount) {
      padRow.push('');
    }
    return `| ${padRow.map(c => c.replace(/\|/g, '\\|') || ' ').join(' | ')} |`;
  });

  return [headerLine, separatorLine, ...rowsLines].join('\n');
}

/**
 * Extract all tables from a .docx file using Mammoth
 */
export async function extractTablesFromDocx(file: File): Promise<{
  tables: ExtractedTable[];
  rawHtml: string;
  fullCleanContent: string;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const rawHtml = result.value || '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  const tableElements = Array.from(doc.querySelectorAll('table'));

  const tables: ExtractedTable[] = [];

  tableElements.forEach((tableEl, index) => {
    const trElements = Array.from(tableEl.querySelectorAll('tr'));
    if (trElements.length === 0) return;

    let headers: string[] = [];
    let rows: string[][] = [];

    // Check if first row contains <th> or acts as header
    const firstTr = trElements[0];
    const ths = Array.from(firstTr.querySelectorAll('th'));
    
    if (ths.length > 0) {
      headers = ths.map(th => cleanCellText(th.textContent || ''));
      rows = trElements.slice(1).map(tr => 
        Array.from(tr.querySelectorAll('td, th')).map(td => cleanCellText(td.textContent || ''))
      );
    } else {
      // First row has <td> - check if we should treat row 0 as header
      const firstRowCells = Array.from(firstTr.querySelectorAll('td')).map(td => cleanCellText(td.textContent || ''));
      if (trElements.length > 1) {
        headers = firstRowCells;
        rows = trElements.slice(1).map(tr => 
          Array.from(tr.querySelectorAll('td')).map(td => cleanCellText(td.textContent || ''))
        );
      } else {
        headers = firstRowCells.map((_, i) => `Колонка ${i + 1}`);
        rows = [firstRowCells];
      }
    }

    // Determine max column count
    const colCount = Math.max(headers.length, ...rows.map(r => r.length), 1);
    
    // Normalize row lengths
    rows = rows.map(r => {
      const normalized = [...r];
      while (normalized.length < colCount) normalized.push('');
      return normalized;
    });

    while (headers.length < colCount) {
      headers.push(`Колонка ${headers.length + 1}`);
    }

    const htmlMarkup = buildHtmlTableMarkup(headers, rows, `Таблица ${index + 1} из документа: ${file.name}`);
    const markdownMarkup = buildMarkdownTableMarkup(headers, rows);

    tables.push({
      id: `table-${Date.now()}-${index}`,
      headers,
      rows,
      rowCount: rows.length,
      colCount,
      html: htmlMarkup,
      markdown: markdownMarkup
    });
  });

  // Also construct full clean content from the document (paragraphs, headings, and clean tables)
  // Replace original table tags with styled responsive tables
  tableElements.forEach((origTable, idx) => {
    if (tables[idx]) {
      const tempDiv = doc.createElement('div');
      tempDiv.innerHTML = tables[idx].html;
      origTable.parentNode?.replaceChild(tempDiv, origTable);
    }
  });

  const fullCleanContent = doc.body.innerHTML;

  return {
    tables,
    rawHtml,
    fullCleanContent
  };
}

/**
 * Parse clipboard content (HTML or TSV from Word/Excel/Google Docs) into an ExtractedTable
 */
export function parsePastedTable(input: string): ExtractedTable | null {
  if (!input || !input.trim()) return null;

  const trimmed = input.trim();

  // 1. Try HTML Table parsing
  if (trimmed.includes('<table') || trimmed.includes('<tr')) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(trimmed, 'text/html');
      const tableEl = doc.querySelector('table');
      if (tableEl) {
        const trElements = Array.from(tableEl.querySelectorAll('tr'));
        if (trElements.length > 0) {
          const firstTr = trElements[0];
          const ths = Array.from(firstTr.querySelectorAll('th'));
          let headers: string[] = [];
          let rows: string[][] = [];

          if (ths.length > 0) {
            headers = ths.map(th => cleanCellText(th.textContent || ''));
            rows = trElements.slice(1).map(tr =>
              Array.from(tr.querySelectorAll('td, th')).map(td => cleanCellText(td.textContent || ''))
            );
          } else {
            const firstRowCells = Array.from(firstTr.querySelectorAll('td')).map(td => cleanCellText(td.textContent || ''));
            if (trElements.length > 1) {
              headers = firstRowCells;
              rows = trElements.slice(1).map(tr =>
                Array.from(tr.querySelectorAll('td')).map(td => cleanCellText(td.textContent || ''))
              );
            } else {
              headers = firstRowCells.map((_, i) => `Колонка ${i + 1}`);
              rows = [firstRowCells];
            }
          }

          const colCount = Math.max(headers.length, ...rows.map(r => r.length), 1);
          rows = rows.map(r => {
            const norm = [...r];
            while (norm.length < colCount) norm.push('');
            return norm;
          });
          while (headers.length < colCount) {
            headers.push(`Колонка ${headers.length + 1}`);
          }

          return {
            id: `pasted-table-${Date.now()}`,
            headers,
            rows,
            rowCount: rows.length,
            colCount,
            html: buildHtmlTableMarkup(headers, rows),
            markdown: buildMarkdownTableMarkup(headers, rows)
          };
        }
      }
    } catch (e) {
      console.warn('Failed HTML table parsing, falling back to TSV:', e);
    }
  }

  // 2. Try Tab-Separated Values (TSV) from Excel or Word table copy
  if (trimmed.includes('\t')) {
    const lines = trimmed.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      const parsedLines = lines.map(line => line.split('\t').map(cleanCellText));
      const colCount = Math.max(...parsedLines.map(l => l.length), 1);

      let headers: string[] = [];
      let rows: string[][] = [];

      if (parsedLines.length > 1) {
        headers = parsedLines[0];
        rows = parsedLines.slice(1);
      } else {
        headers = parsedLines[0].map((_, i) => `Колонка ${i + 1}`);
        rows = [parsedLines[0]];
      }

      rows = rows.map(r => {
        const norm = [...r];
        while (norm.length < colCount) norm.push('');
        return norm;
      });
      while (headers.length < colCount) {
        headers.push(`Колонка ${headers.length + 1}`);
      }

      return {
        id: `tsv-table-${Date.now()}`,
        headers,
        rows,
        rowCount: rows.length,
        colCount,
        html: buildHtmlTableMarkup(headers, rows),
        markdown: buildMarkdownTableMarkup(headers, rows)
      };
    }
  }

  // 3. Try CSV (comma-separated or semicolon-separated)
  if (trimmed.includes(';') || (trimmed.includes(',') && trimmed.includes('\n'))) {
    const delimiter = trimmed.includes(';') ? ';' : ',';
    const lines = trimmed.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length > 1) {
      const parsedLines = lines.map(line => line.split(delimiter).map(cleanCellText));
      const colCount = Math.max(...parsedLines.map(l => l.length), 1);
      const headers = parsedLines[0];
      const rows = parsedLines.slice(1).map(r => {
        const norm = [...r];
        while (norm.length < colCount) norm.push('');
        return norm;
      });
      while (headers.length < colCount) {
        headers.push(`Колонка ${headers.length + 1}`);
      }

      return {
        id: `csv-table-${Date.now()}`,
        headers,
        rows,
        rowCount: rows.length,
        colCount,
        html: buildHtmlTableMarkup(headers, rows),
        markdown: buildMarkdownTableMarkup(headers, rows)
      };
    }
  }

  return null;
}

/**
 * Generate a blank template table for manual editing
 */
export function createBlankTable(cols: number = 3, rows: number = 3): ExtractedTable {
  const headers = Array.from({ length: cols }, (_, i) => `Заголовок ${i + 1}`);
  const dataRows = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => '')
  );

  return {
    id: `blank-table-${Date.now()}`,
    headers,
    rows: dataRows,
    rowCount: rows,
    colCount: cols,
    html: buildHtmlTableMarkup(headers, dataRows),
    markdown: buildMarkdownTableMarkup(headers, dataRows)
  };
}
