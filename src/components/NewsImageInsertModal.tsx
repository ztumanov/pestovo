import React, { useState, useEffect } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Link as LinkIcon, 
  AlignCenter, 
  AlignLeft, 
  AlignRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { compressImage } from '../lib/storage';

interface NewsImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (markup: string) => void;
  initialFile?: File | null;
}

export default function NewsImageInsertModal({ 
  isOpen, 
  onClose, 
  onInsertImage,
  initialFile
}: NewsImageInsertModalProps) {
  const [sourceType, setSourceType] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [alignment, setAlignment] = useState<'center' | 'left' | 'right'>('center');
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения (JPEG, PNG, WebP).');
      return;
    }
    setIsCompressing(true);
    compressImage(file, 1200, 0.82, (base64) => {
      setImageUrl(base64);
      setIsCompressing(false);
      if (!altText) {
        setAltText(file.name.replace(/\.[^/.]+$/, ''));
      }
    });
  };

  useEffect(() => {
    if (isOpen && initialFile) {
      setSourceType('upload');
      handleFile(initialFile);
    }
  }, [isOpen, initialFile]);

  if (!isOpen) return null;

  const handleInsert = () => {
    if (!imageUrl.trim()) {
      alert('Пожалуйста, выберите или укажите изображение.');
      return;
    }

    const cleanAlt = altText.trim() || caption.trim() || 'Иллюстрация к новости';
    const cleanCaption = caption.trim();

    let markup = '';

    if (alignment === 'center') {
      markup = `
<figure class="my-6 rounded-xl overflow-hidden bg-stone-50 border border-stone-200/90 shadow-md text-center max-w-3xl mx-auto group">
  <img src="${imageUrl}" alt="${cleanAlt}" class="w-full max-h-[520px] object-cover rounded-t-xl" />
  ${cleanCaption ? `<figcaption class="py-2.5 px-4 text-xs font-sans text-stone-600 bg-stone-50 border-t border-stone-200/70 italic text-center">${cleanCaption}</figcaption>` : ''}
</figure>
`;
    } else if (alignment === 'left') {
      markup = `
<figure class="my-4 md:float-left md:mr-6 max-w-sm rounded-xl overflow-hidden bg-stone-50 border border-stone-200/90 shadow-md group">
  <img src="${imageUrl}" alt="${cleanAlt}" class="w-full object-cover rounded-t-xl max-h-72" />
  ${cleanCaption ? `<figcaption class="py-2 px-3 text-xs font-sans text-stone-600 bg-stone-50 border-t border-stone-200/70 italic text-center">${cleanCaption}</figcaption>` : ''}
</figure>
`;
    } else if (alignment === 'right') {
      markup = `
<figure class="my-4 md:float-right md:ml-6 max-w-sm rounded-xl overflow-hidden bg-stone-50 border border-stone-200/90 shadow-md group">
  <img src="${imageUrl}" alt="${cleanAlt}" class="w-full object-cover rounded-t-xl max-h-72" />
  ${cleanCaption ? `<figcaption class="py-2 px-3 text-xs font-sans text-stone-600 bg-stone-50 border-t border-stone-200/70 italic text-center">${cleanCaption}</figcaption>` : ''}
</figure>
`;
    }

    onInsertImage(markup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-sans">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#022C22] text-white px-6 py-4 flex items-center justify-between border-b border-[#c5a880]/30 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a880] text-[#022C22] flex items-center justify-center shrink-0 shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">Вставка изображения в текст</h3>
              <p className="text-xs text-stone-300">Добавление фотографий, схем или иллюстраций в тело статьи</p>
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

        {/* Source switchers */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSourceType('upload')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              sourceType === 'upload'
                ? 'bg-white text-[#022C22] border-[#022C22] shadow-xs'
                : 'text-stone-600 hover:text-[#022C22] border-transparent hover:bg-stone-100'
            }`}
          >
            <Upload className="w-4 h-4 text-[#c5a880]" />
            <span>Загрузить с устройства</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType('url')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
              sourceType === 'url'
                ? 'bg-white text-[#022C22] border-[#022C22] shadow-xs'
                : 'text-stone-600 hover:text-[#022C22] border-transparent hover:bg-stone-100'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-[#c5a880]" />
            <span>Указать URL ссылку</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {sourceType === 'upload' ? (
            <div>
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive ? 'border-[#c5a880] bg-[#FAF9F6]' : 'border-stone-300 bg-stone-50/70 hover:bg-amber-50/20'
                }`}
              >
                <input
                  type="file"
                  id="intext-img-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
                <label htmlFor="intext-img-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-[#c5a880]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-[#022C22]">Нажмите для выбора фотографии или перетащите файл</span>
                  <span className="text-xs text-stone-400">Форматы: JPG, PNG, WEBP. Изображение будет оптимизировано автоматически</span>
                </label>
              </div>

              {isCompressing && (
                <div className="p-3 text-center text-xs font-bold text-[#022C22]">
                  Оптимизация и сжатие изображения...
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Прямая ссылка на изображение:
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... или /images/..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          )}

          {/* Image Preview */}
          {imageUrl && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-4">
              <img 
                src={imageUrl} 
                alt="Предпросмотр" 
                className="w-24 h-16 object-cover rounded-lg border border-stone-300 shadow-xs" 
              />
              <div className="text-xs text-stone-600 flex-1 min-w-0">
                <span className="font-bold text-emerald-700 block">✓ Изображение готово к вставке</span>
                <span className="text-[11px] text-stone-400 truncate block mt-0.5">{imageUrl.slice(0, 60)}...</span>
              </div>
            </div>
          )}

          {/* Caption & Alt */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Подпись к фотографии (отображается под фото):
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Например: Процедурный кабинет физиотерапии в корпусе №1"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Описание для поисковиков (alt-текст):
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Краткое описание того, что изображено на фото"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>

          {/* Alignment Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Расположение в тексте:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAlignment('center')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  alignment === 'center'
                    ? 'border-[#022C22] bg-[#022C22]/5 text-[#022C22] font-bold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <AlignCenter className="w-5 h-5 text-[#c5a880]" />
                <span className="text-xs">По центру</span>
                <span className="text-[10px] text-stone-400">На всю ширину</span>
              </button>

              <button
                type="button"
                onClick={() => setAlignment('left')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  alignment === 'left'
                    ? 'border-[#022C22] bg-[#022C22]/5 text-[#022C22] font-bold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <AlignLeft className="w-5 h-5 text-[#c5a880]" />
                <span className="text-xs">Слева</span>
                <span className="text-[10px] text-stone-400">С обтеканием</span>
              </button>

              <button
                type="button"
                onClick={() => setAlignment('right')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  alignment === 'right'
                    ? 'border-[#022C22] bg-[#022C22]/5 text-[#022C22] font-bold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <AlignRight className="w-5 h-5 text-[#c5a880]" />
                <span className="text-xs">Справа</span>
                <span className="text-[10px] text-stone-400">С обтеканием</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-4 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleInsert}
            disabled={!imageUrl}
            className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-md active:scale-95"
          >
            <Check className="w-4 h-4 text-[#c5a880]" />
            <span>Вставить фото в текст</span>
          </button>
        </div>
      </div>
    </div>
  );
}
