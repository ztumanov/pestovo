import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Upload, 
  Check, 
  Clipboard, 
  Plus, 
  FileText, 
  Eye, 
  AlertCircle,
  Table as TableIcon,
  Trash2,
  Columns,
  Rows
} from 'lucide-react';
import { 
  extractTablesFromDocx, 
  parsePastedTable, 
  createBlankTable, 
  buildHtmlTableMarkup, 
  buildMarkdownTableMarkup,
  ExtractedTable 
} from '../utils/docxTableExtractor';

interface NewsDocxTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (markup: string) => void;
  initialFile?: File | null;
  initialTab?: 'docx' | 'paste' | 'builder';
}

export default function NewsDocxTableModal({ 
  isOpen, 
  onClose, 
  onInsertTable,
  initialFile,
  initialTab
}: NewsDocxTableModalProps) {
  const [activeTab, setActiveTab] = useState<'docx' | 'paste' | 'builder'>(initialTab || 'docx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // DOCX tab state
  const [extractedTables, setExtractedTables] = useState<ExtractedTable[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fullDocHtml, setFullDocHtml] = useState<string | null>(null);
  const [selectedTableIndex, setSelectedTableIndex] = useState<number>(0);
  const [formatMode, setFormatMode] = useState<'html' | 'markdown'>('html');

  // Paste tab state
  const [pasteInput, setPasteInput] = useState('');
  const [parsedPasteTable, setParsedPasteTable] = useState<ExtractedTable | null>(null);

  // Builder tab state
  const [builderCols, setBuilderCols] = useState(3);
  const [builderRows, setBuilderRows] = useState(3);
  const [builderHeaders, setBuilderHeaders] = useState<string[]>(['Параметр / Услуга', 'Описание / Норма', 'Примечание']);
  const [builderData, setBuilderData] = useState<string[][]>([
    ['Лечебный бассейн', 'Температура +28°C, морская вода', 'Ежедневно'],
    ['Ингаляторий', 'Фитосборы, кислородные смеси', 'По назначению'],
    ['Терренкур №1', 'Протяженность 1200 м, хвойный парк', 'Утренние часы']
  ]);

  // Handle .docx file upload
  const handleDocxFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
      setErrorMsg('Пожалуйста, выберите файл в формате .docx (Microsoft Word)');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      setFileName(file.name);
      const result = await extractTablesFromDocx(file);
      setExtractedTables(result.tables);
      setFullDocHtml(result.fullCleanContent);
      setSelectedTableIndex(0);

      if (result.tables.length === 0) {
        setErrorMsg('В выбранном .docx документе не обнаружено таблиц. Вы можете вставить весь текст документа целиком.');
      }
    } catch (err: any) {
      console.error('Error parsing docx:', err);
      setErrorMsg('Ошибка при чтении .docx файла: ' + (err.message || 'Не удалось распознать структуру документа.'));
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialTab) setActiveTab(initialTab);
      if (initialFile) {
        setActiveTab('docx');
        handleDocxFile(initialFile);
      }
    }
  }, [isOpen, initialFile, initialTab]);

  if (!isOpen) return null;

  // Handle clipboard text analysis
  const handlePasteChange = (text: string) => {
    setPasteInput(text);
    if (!text.trim()) {
      setParsedPasteTable(null);
      return;
    }
    const table = parsePastedTable(text);
    setParsedPasteTable(table);
  };

  // Insert actions
  const handleInsertSelected = () => {
    if (activeTab === 'docx') {
      const table = extractedTables[selectedTableIndex];
      if (table) {
        onInsertTable(formatMode === 'html' ? table.html : table.markdown);
        onClose();
      }
    } else if (activeTab === 'paste') {
      if (parsedPasteTable) {
        onInsertTable(formatMode === 'html' ? parsedPasteTable.html : parsedPasteTable.markdown);
        onClose();
      }
    } else if (activeTab === 'builder') {
      const html = buildHtmlTableMarkup(builderHeaders, builderData);
      const md = buildMarkdownTableMarkup(builderHeaders, builderData);
      onInsertTable(formatMode === 'html' ? html : md);
      onClose();
    }
  };

  const handleInsertAllDocxTables = () => {
    if (extractedTables.length > 0) {
      const combined = extractedTables
        .map(t => (formatMode === 'html' ? t.html : t.markdown))
        .join('\n\n');
      onInsertTable(combined);
      onClose();
    }
  };

  const handleInsertFullDocx = () => {
    if (fullDocHtml) {
      onInsertTable(fullDocHtml);
      onClose();
    }
  };

  // Builder row/col adjust
  const handleUpdateBuilderCols = (newCols: number) => {
    const cols = Math.max(1, Math.min(8, newCols));
    setBuilderCols(cols);
    setBuilderHeaders(prev => {
      const next = [...prev];
      while (next.length < cols) next.push(`Колонка ${next.length + 1}`);
      return next.slice(0, cols);
    });
    setBuilderData(prev => 
      prev.map(row => {
        const next = [...row];
        while (next.length < cols) next.push('');
        return next.slice(0, cols);
      })
    );
  };

  const handleUpdateBuilderRows = (newRows: number) => {
    const rows = Math.max(1, Math.min(20, newRows));
    setBuilderRows(rows);
    setBuilderData(prev => {
      const next = [...prev];
      while (next.length < rows) next.push(Array(builderCols).fill(''));
      return next.slice(0, rows);
    });
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-sans">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#022C22] text-white px-6 py-4 flex items-center justify-between border-b border-[#c5a880]/30 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a880] text-[#022C22] flex items-center justify-center shrink-0 shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">Вставка таблицы в новость</h3>
              <p className="text-xs text-stone-300">Импорт таблиц из Microsoft Word (.docx), буфера обмена или визуальный конструктор</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('docx')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'docx'
                ? 'bg-white text-[#022C22] border-[#022C22] shadow-xs'
                : 'text-stone-600 hover:text-[#022C22] border-transparent hover:bg-stone-100'
            }`}
          >
            <FileText className="w-4 h-4 text-[#c5a880]" />
            <span>Файл Word (.DOCX)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-white text-[#022C22] border-[#022C22] shadow-xs'
                : 'text-stone-600 hover:text-[#022C22] border-transparent hover:bg-stone-100'
            }`}
          >
            <Clipboard className="w-4 h-4 text-[#c5a880]" />
            <span>Из буфера (Word / Excel)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-white text-[#022C22] border-[#022C22] shadow-xs'
                : 'text-stone-600 hover:text-[#022C22] border-transparent hover:bg-stone-100'
            }`}
          >
            <TableIcon className="w-4 h-4 text-[#c5a880]" />
            <span>Конструктор таблицы</span>
          </button>

          {/* Format mode selector on the right */}
          <div className="ml-auto hidden sm:flex items-center gap-1.5 pb-2 text-xs">
            <span className="text-stone-400 font-semibold">Формат:</span>
            <button
              type="button"
              onClick={() => setFormatMode('html')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                formatMode === 'html'
                  ? 'bg-[#022C22] text-[#c5a880]'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setFormatMode('markdown')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                formatMode === 'markdown'
                  ? 'bg-[#022C22] text-[#c5a880]'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              Markdown
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: DOCX Upload */}
          {activeTab === 'docx' && (
            <div className="space-y-6">
              {/* Dropzone */}
              <div className="border-2 border-dashed border-stone-300 hover:border-[#c5a880] rounded-2xl p-6 text-center transition-all bg-stone-50/60 hover:bg-amber-50/20 group">
                <input
                  type="file"
                  id="docx-file-input"
                  accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleDocxFile(e.target.files[0]);
                    }
                  }}
                />
                <label htmlFor="docx-file-input" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-[#c5a880] group-hover:scale-105 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-sm sm:text-base text-[#022C22] block">
                      Нажмите для выбора файла Word (.docx) или перетащите его сюда
                    </span>
                    <span className="text-xs text-stone-500 mt-1 block">
                      Система автоматически извлечет все таблицы со структурой, заголовками и форматированием
                    </span>
                  </div>
                </label>
              </div>

              {isProcessing && (
                <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-2">
                  <div className="w-8 h-8 border-3 border-[#022C22] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-[#022C22]">Анализ документа и извлечение таблиц...</p>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p>{errorMsg}</p>
                    {fullDocHtml && (
                      <button
                        type="button"
                        onClick={handleInsertFullDocx}
                        className="bg-[#022C22] text-[#c5a880] px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer"
                      >
                        Вставить весь текст документа
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Extracted Tables Display */}
              {extractedTables.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#022C22] flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Найдено таблиц в документе: {extractedTables.length}</span>
                        {fileName && <span className="text-stone-400 font-normal">({fileName})</span>}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {extractedTables.length > 1 && (
                        <button
                          type="button"
                          onClick={handleInsertAllDocxTables}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Вставить все {extractedTables.length} таблиц
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table Selector Pills */}
                  {extractedTables.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {extractedTables.map((t, idx) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTableIndex(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                            selectedTableIndex === idx
                              ? 'bg-[#022C22] text-[#c5a880] border-[#022C22]'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          Таблица #{idx + 1} ({t.rowCount} стр. × {t.colCount} кол.)
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Active Table Preview */}
                  {extractedTables[selectedTableIndex] && (
                    <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs bg-white">
                      <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 text-xs text-stone-600 flex justify-between items-center">
                        <span className="font-semibold">Предпросмотр таблицы #{selectedTableIndex + 1}</span>
                        <span className="font-mono text-[11px] text-stone-500">
                          {extractedTables[selectedTableIndex].rowCount} строк, {extractedTables[selectedTableIndex].colCount} колонок
                        </span>
                      </div>
                      <div 
                        className="p-4 max-h-72 overflow-auto"
                        dangerouslySetInnerHTML={{ __html: extractedTables[selectedTableIndex].html }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Paste from Word/Excel/Clipboard */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Вставьте скопированную таблицу (Ctrl + V):
                </label>
                <textarea
                  rows={6}
                  value={pasteInput}
                  onChange={(e) => handlePasteChange(e.target.value)}
                  placeholder="Выделите таблицу в Word или Excel, скопируйте (Ctrl+C) и вставьте сюда (Ctrl+V)..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Поддерживается вставка из Word (с форматированием), Excel (таблицы ячеек) и Google Docs.
                </p>
              </div>

              {parsedPasteTable ? (
                <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Таблица успешно распознана ({parsedPasteTable.rowCount} строк, {parsedPasteTable.colCount} колонок)
                    </span>
                  </div>
                  <div 
                    className="p-4 max-h-64 overflow-auto"
                    dangerouslySetInnerHTML={{ __html: parsedPasteTable.html }}
                  />
                </div>
              ) : pasteInput.trim() ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Не удалось распознать таблицу. Убедитесь, что вы скопировали таблицу с разделителями (табуляция или HTML).</span>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: Visual Table Builder */}
          {activeTab === 'builder' && (
            <div className="space-y-5">
              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex items-center space-x-3">
                  <Columns className="w-4 h-4 text-[#c5a880]" />
                  <label className="text-xs font-bold text-stone-700">Количество колонок:</label>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateBuilderCols(builderCols - 1)}
                      className="w-7 h-7 bg-white border border-stone-200 rounded-lg text-xs font-bold hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xs w-6 text-center">{builderCols}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateBuilderCols(builderCols + 1)}
                      className="w-7 h-7 bg-white border border-stone-200 rounded-lg text-xs font-bold hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Rows className="w-4 h-4 text-[#c5a880]" />
                  <label className="text-xs font-bold text-stone-700">Количество строк:</label>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateBuilderRows(builderRows - 1)}
                      className="w-7 h-7 bg-white border border-stone-200 rounded-lg text-xs font-bold hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xs w-6 text-center">{builderRows}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateBuilderRows(builderRows + 1)}
                      className="w-7 h-7 bg-white border border-stone-200 rounded-lg text-xs font-bold hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Editable Table Grid */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#022C22] text-[#c5a880]">
                        {builderHeaders.map((header, colIdx) => (
                          <th key={colIdx} className="p-2 border-r border-[#c5a880]/20 last:border-r-0">
                            <input
                              type="text"
                              value={header}
                              onChange={(e) => {
                                const next = [...builderHeaders];
                                next[colIdx] = e.target.value;
                                setBuilderHeaders(next);
                              }}
                              className="w-full bg-white/10 text-[#c5a880] px-2 py-1 rounded text-xs font-bold focus:outline-none focus:bg-white/20"
                              placeholder={`Заголовок ${colIdx + 1}`}
                            />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {builderData.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-stone-200 even:bg-stone-50/60">
                          {row.map((cell, colIdx) => (
                            <td key={colIdx} className="p-2 border-r border-stone-200 last:border-r-0">
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => {
                                  const next = [...builderData];
                                  next[rowIdx] = [...next[rowIdx]];
                                  next[rowIdx][colIdx] = e.target.value;
                                  setBuilderData(next);
                                }}
                                className="w-full bg-transparent px-2 py-1 rounded text-xs text-stone-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#c5a880]"
                                placeholder="Значение..."
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-stone-100 px-6 py-4 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
          >
            Отмена
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInsertSelected}
              disabled={
                (activeTab === 'docx' && extractedTables.length === 0) ||
                (activeTab === 'paste' && !parsedPasteTable)
              }
              className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-md active:scale-95"
            >
              <Check className="w-4 h-4 text-[#c5a880]" />
              <span>Вставить таблицу в новость</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
