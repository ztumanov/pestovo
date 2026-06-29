import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileText, 
  Search, 
  Download, 
  Eye, 
  ChevronRight, 
  ArrowLeft,
  Check, 
  Printer, 
  Shield 
} from 'lucide-react';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocItem {
  id: string;
  title: string;
  number: string;
  date: string;
  category: 'constituent' | 'license' | 'rules';
  categoryLabel: string;
  summary: string;
  fullText: string;
}

const DOCUMENTS_REGISTRY: DocItem[] = [
  {
    id: 'charter',
    title: 'Устав ФГКУ «Санаторий «Ясная Поляна» ФТС России»',
    number: 'Приказ ФТС № 2011',
    date: '18.10.2013',
    category: 'constituent',
    categoryLabel: 'Учредительные документы',
    summary: 'Основной учредительный регламент, утвержденный Федеральной таможенной службой. Определяет цели деятельности, ведомственную подчиненность, имущественные права и порядок медицинского обеспечения сотрудников таможенных органов.',
    fullText: `ФЕДЕРАЛЬНАЯ ТАМОЖЕННАЯ СЛУЖБА РОССИЙСКОЙ ФЕДЕРАЦИИ
УСТАВ
Федерального государственного казенного учреждения
«Санаторий «Ясная Поляна» Федеральной таможенной службы»

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» ФТС России» (далее — Учреждение) создано в соответствии с решением Правительства Российской Федерации на базе имущественного комплекса санатория.
1.2. Учредителем и собственником имущества Учреждения является Российская Федерация. Полномочия учредителя осуществляет Федеральная таможенная служба (ФТС России).
1.3. Учреждение является некоммерческой организацией, созданной в форме казенного учреждения для осуществления оздоровительных, профилактических и лечебно-диагностических функций ведомственного характера.
1.4. Деятельность Учреждения строится на основе Конституции Российской Федерации, Федеральных законов и Приказов руководителя ФТС России.

2. ЦЕЛИ И ПРЕДМЕТ ДЕЯТЕЛЬНОСТИ
2.1. Главной целью Учреждения является предоставление качественной санаторно-курортной и медицинской помощи сотрудникам таможенных органов Российской Федерации, членам их семей, а также пенсионерам ведомства.
2.2. Задачи Учреждения включают:
- проведение климатолечения, бальнеотерапии и комплексной реабилитации;
- осуществление профилактики профессиональных патологий;
- проведение терапевтических, физиотерапевтических и ультразвуковых диагностических манипуляций.

3. ПОРЯДОК УПРАВЛЕНИЯ
3.1. Руководство Учреждением осуществляет Начальник Санатория, назначаемый на должность и освобождаемый от должности Приказом руководителя ФТС России.`
  },
  {
    id: 'med-license',
    title: 'Лицензия со спецификацией видов медицинской деятельности',
    number: 'Л041-00110-91/00554225',
    date: '22.06.2022',
    category: 'license',
    categoryLabel: 'Лицензии и Свидетельства',
    summary: 'Бессрочная медицинская лицензия государственного образца. Содержит перечень всех лечебно-профилактических процедур, разрешенных к осуществлению в санатории на Южном берегу Крыма.',
    fullText: `МИНИСТЕРСТВО ЗДРАВООХРАНЕНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ
ЛИЦЕНЗИЯ № Л041-00110-91/00554225
на осуществление медицинской деятельности

Выдана: Федеральному государственному казенному учреждению
«Санаторий «Ясная Поляна» ФТС России»
Место нахождения: 298660, Крым Респ, г Ялта, пгт Гаспра, ш Севастопольское, д. 52
Срок действия лицензии: Бессрочно.

Номенклатура разрешенных работ и услуг:
При оказании первичной, в том числе доврачебной, врачебной и специализированной, медико-санитарной помощи организуются и выполняются следующие работы (услуги):
1) При оказании первичной доврачебной медико-санитарной помощи в амбулаторных условиях по:
- диетологии;
- лечебной физкультуре;
- медицинскому массажу;
- сестринскому делу;
- физиотерапии;
- функциональной диагностике.`
  },
  {
    id: 'resort-rules',
    title: 'Правила проживания и внутреннего распорядка',
    number: 'Приказ № 112-ОД',
    date: '12.01.2026',
    category: 'rules',
    categoryLabel: 'Правила и регламенты',
    summary: 'Официальный свод правил внутреннего распорядка санатория. Регламентирует вопросы заезда/выезда, соблюдения тишины, пропускного режима ФТС и порядка сбережения парковой зоны.',
    fullText: `ПРАВИЛА ВНУТРЕННЕГО РАСПОРЯДКА И ПОВЕДЕНИЯ ОТДЫХАЮЩИХ
В ФГКУ «САНАТОРИЙ «ЯСНАЯ ПОЛЯНА» ФТС РОССИИ»

1. ПОРЯДОК ПРИБЫТИЯ И ОФОРМЛЕНИЯ
1.1. Заселение осуществляется строго по путевкам ведомственного распределения или коммерческим ваучерам.
1.2. При оформлении гость обязан предоставить:
- паспорт гражданина РФ;
- служебное удостоверение (для действующих сотрудников ФТС);
- санаторно-курортную карту установленного образца № 072/у;
- справку об эпидемиологическом окружении, выданную не ранее чем за 3 дня до заезда.

2. САНИТАРНО-ГИГИЕНИЧЕСКИЙ И САНАТОРНЫЙ РЕЖИМ
2.1. На территории санатория установлен следующий внутренний распорядок:
- 08:00 – 09:00 — Завтрак;
- 09:00 – 13:30 — Лечебные процедуры, физиотерапия, массаж;
- 13:30 – 14:30 — Обед;
- 14:30 – 16:00 — Тихий час (время обязательного покоя и отдыха);
- 16:05 – 18:30 — Климатотерапия, прогулки терренкурами;
- 19:00 – 20:00 — Ужин;
- 23:00 — Закрытие основных корпусов, отход ко сну.

3. ПРАВИЛА СОХРАНЕНИЯ ОСОБО ОХРАНЯЕМОЙ ЗОНЫ
3.1. Санаторий расположен в уникальной лесопарковой реликтовой зоне ЮБК. Мусорить, разводить открытый огонь или повреждать вечнозеленые насаждения строго воспрещено.`
  },
  {
    id: 'inn-kpp',
    title: 'Свидетельство о государственной регистрации (ИНН/КПП)',
    number: 'Серия 77 № 015463944',
    date: '29.10.2013',
    category: 'constituent',
    categoryLabel: 'Учредительные документы',
    summary: 'Официальный налоговый документ, выданный Федеральной налоговой службой Российской Федерации по случаю внесения учреждения в Единый государственный реестр юридических лиц (ЕГРЮЛ).',
    fullText: `СФЕРА ВЕДЕНИЯ ФЕДЕРАЛЬНОЙ НАЛОГОВОЙ СЛУЖБЫ
СВИДЕТЕЛЬСТВО
о постановке на учет российской организации в налоговом органе
по месту ее нахождения

Настоящим подтверждается, что российская организация:
Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» ФТС России»
ОГРН: 5137746004787

Регистрационный орган: Межрайонная инспекция Федеральной налоговой службы №46 по г. Москве
Дата внесения записи: 29 октября 2013 года

Поставлена на учет в соответствии с Налоговым кодексом Российской Федерации в налоговом органе по месту нахождения:
ИНН: 7713778678
КПП: 910301001

Свидетельство оформлено на бланке строгой отчетности, заверено гербовой печатью.`
  },
  {
    id: 'paid-services',
    title: 'Положение о порядке предоставления платных услуг',
    number: 'Приказ № 44-ОД',
    date: '04.02.2025',
    category: 'rules',
    categoryLabel: 'Правила и регламенты',
    summary: 'Регламент оказания дополнительных оздоровительных медицинских массажей, биохимических исследований крови и иных не входящих в базовое ведомственное обеспечение лицензированных услуг.',
    fullText: `ПОЛОЖЕНИЕ О ПОРЯДКЕ ПРЕДОСТАВЛЕНИЯ ПЛАТНЫХ ОСНОВНЫХ И
ДОПОЛНИТЕЛЬНЫХ МЕДИЦИНСКИХ УСЛУГ В САНАТОРИИ

1. ОСНОВАНИЯ ДЛЯ ОКАЗАНИЯ ПЛАТНЫХ УСЛУГ
1.1. Платные дополнительные медицинские и оздоровительные услуги предоставляются на добровольной основе по назначению врача санатория или по прямому запросу гостя.
1.2. Стоимость услуг рассчитывается и утверждается согласно официальному прейскуранту ФГКУ «Санаторий «Ясная Поляна» ФТС России».

2. ПЕРЕЧЕНЬ ДОПОЛНИТЕЛЬНЫХ МЕДИЦИНСКИХ ПРОГРАММ
2.1. К платным услугам относятся:
- расширенные биохимические исследования сыворотки крови;
- дополнительный точечный или ароматический массаж (сверх заложенного в государственное задание);
- специализированные сеансы прессотерапии;
- кислородные коктейли и фито-чаи по индивидуальному подбору.

3. ПОРЯДОК ОПЛАТЫ
3.1. Услуги оплачиваются в кассе медицинского административного корпуса безналичным расчетом с выдачей кассового чека и договора установленной формы.`
  }
];

export default function DocumentsModal({ isOpen, onClose }: DocumentsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<DocItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [printSuccess, setPrintSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter lists
  const filteredDocs = DOCUMENTS_REGISTRY.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Action simulate download
  const handleDownload = (doc: DocItem) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      setDownloadingId(null);
      // Simulate real download by opening a print window / text generator
      const element = document.createElement("a");
      const file = new Blob([doc.fullText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${doc.id}_document.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden flex items-center justify-center font-sans">
      {/* Background black dim overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-stone-50 border border-stone-200 w-full max-w-5xl h-[85vh] rounded-sm shadow-2xl relative z-10 flex flex-col overflow-hidden"
      >
        {/* Header toolbar */}
        <div className="bg-[#022C22] text-white p-5 flex items-center justify-between border-b border-[#c5a880]/25 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-[#c5a880] p-1.5 rounded-sm text-[#022C22]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#c5a880] font-bold">Официальные сведения</span>
              <h2 className="font-serif text-lg font-bold tracking-tight">Документы и нормативные регламенты</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Закрыть (Esc)"
          >
            <X className="w-5 h-5 text-stone-200 hover:text-white" />
          </button>
        </div>

        {/* Outer Split screen layout: Grid based */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
          <AnimatePresence mode="wait">
            {!viewingDoc ? (
              // MAIN DOCUMENTS VIEW
              <motion.div 
                key="list-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col overflow-hidden h-full p-6"
              >
                {/* Search & filters inside list view */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Поиск по названию, регламенту, номеру лицензии..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 pl-10 pr-4 py-2.5 rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#022C22] font-sans placeholder-stone-400"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'Все категории' },
                      { id: 'constituent', label: 'Учредительные' },
                      { id: 'license', label: 'Лицензии' },
                      { id: 'rules', label: 'Правила' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                          selectedCategory === cat.id 
                            ? 'bg-[#022C22] border-[#022C22] text-[#c5a880]' 
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scroller list columns */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                      <div 
                        key={doc.id}
                        className="bg-stone-50 rounded-sm border border-stone-200/80 p-5 hover:border-[#c5a880]/50 hover:bg-[#022C22]/[0.01] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-[#c5a880] bg-[#022C22]/5 px-2 py-0.5 rounded">
                              {doc.categoryLabel}
                            </span>
                            <span className="text-stone-400 text-xs font-semibold font-mono">
                              от {doc.date} | Рег. № {doc.number}
                            </span>
                          </div>
                          
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#022C22]">
                            {doc.title}
                          </h4>
                          
                          <p className="text-xs text-stone-500 leading-relaxed font-sans">
                            {doc.summary}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-stone-100">
                          <button
                            onClick={() => setViewingDoc(doc)}
                            className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer flex-1 md:flex-initial justify-center"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Читать</span>
                          </button>
                          
                          <button
                            onClick={() => handleDownload(doc)}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer flex-1 md:flex-initial justify-center border border-stone-200/50"
                            disabled={downloadingId === doc.id}
                          >
                            <Download className={`w-4 h-4 ${downloadingId === doc.id ? 'animate-bounce' : ''}`} />
                            <span>{downloadingId === doc.id ? 'Загрузка...' : 'TXT'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-stone-50 rounded border border-stone-100">
                      <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500 text-sm font-semibold">Документы, удовлетворяющие запросу, не найдены.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                        className="mt-3 text-xs text-[#022C22] hover:text-[#c5a880] font-bold uppercase"
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              // READ MODE SCREEN overlay splitting text & print styles
              <motion.div
                key="read-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col overflow-hidden h-full"
              >
                {/* Back bar */}
                <div className="bg-stone-100 p-4 border-b border-stone-200 shrink-0 flex items-center justify-between">
                  <button
                    onClick={() => setViewingDoc(null)}
                    className="flex items-center space-x-2 text-stone-600 hover:text-[#022C22] text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Назад к списку документов</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrint}
                      className="p-2 bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-[#022C22] rounded-sm transition-all cursor-pointer flex items-center space-x-1"
                      title="Симулировать печать"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="text-xs font-semibold hidden sm:inline">Распечатать</span>
                    </button>
                    <button
                      onClick={() => handleDownload(viewingDoc)}
                      className="p-2 bg-[#022C22] text-white hover:bg-amber-600 rounded-sm transition-all cursor-pointer flex items-center space-x-2"
                      title="Скачать документ как текстовый файл"
                    >
                      <Download className="w-4 h-4 text-[#c5a880]" />
                      <span className="text-xs font-bold uppercase tracking-wide hidden sm:inline">Скачать TXT</span>
                    </button>
                  </div>
                </div>

                {/* Print success banner */}
                <AnimatePresence>
                  {printSuccess && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-emerald-50 text-emerald-800 text-xs py-2 px-6 border-b border-emerald-200 font-medium text-center flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Имитация печати запущена. Документ экспортирован в буфер печати ведомственной службы ФТС.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Document Main page style reading container */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-stone-100/50">
                  <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-stone-250/70 shadow-lg rounded-sm font-sans text-stone-850 relative">
                    {/* Visual Stamp accent */}
                    <div className="absolute right-12 top-12 opacity-[0.06] pointer-events-none select-none select-all-disabled">
                      <Shield className="w-40 h-40 text-[#022C22]" />
                    </div>

                    {/* Emblem text */}
                    <div className="text-center border-b border-stone-200 pb-6 mb-8 text-stone-500 font-mono text-xs uppercase tracking-widest font-bold">
                      <p>Федеральная Таможенная Служба России</p>
                      <p className="text-[10px] text-stone-400 mt-1">ФГКУ «Санаторий «Ясная Поляна» ФТС России»</p>
                    </div>

                    {/* Meta info tags */}
                    <div className="flex justify-between items-start mb-6 text-xs text-stone-400 font-mono">
                      <div>
                        <span>Документ зарегистрирован</span>
                        <p className="font-semibold text-stone-800 mt-0.5">Дата: {viewingDoc.date}</p>
                      </div>
                      <div className="text-right">
                        <span>Идентификатор</span>
                        <p className="font-semibold text-stone-800 mt-0.5">{viewingDoc.number}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#022C22] border-b pb-4 mb-6 leading-snug">
                      {viewingDoc.title}
                    </h1>

                    {/* Body content */}
                    <pre className="font-sans text-xs sm:text-sm text-stone-700 whitespace-pre-wrap leading-relaxed space-y-4">
                      {viewingDoc.fullText}
                    </pre>

                    {/* Official Signature simulation at bottom */}
                    <div className="mt-12 pt-8 border-t border-stone-250/50 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-4">
                      <div>
                        <span className="block text-stone-400 uppercase tracking-widest font-mono text-[9px]">Экспертиза</span>
                        <p className="font-bold text-[#022C22] mt-0.5">Юридический отдел санатория</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-stone-50 px-4 py-2 rounded border border-stone-200">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div className="text-[10px] font-mono leading-tight">
                          <span className="block font-bold text-emerald-800">ПОДПИСАНО ЭЦП</span>
                          <span className="text-stone-405 block">Логачёв В. А. (Начальник)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="p-4 bg-stone-100 border-t border-stone-200/80 shrink-0 text-center text-stone-400 font-mono text-[10px] uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Реестр официальной документации ФГКУ «Санаторий «Ясная Поляна»</span>
          <span className="text-[#c5a880] font-bold">Лицензия № Л041-00110-91/00554225</span>
        </div>
      </motion.div>
    </div>
  );
}
