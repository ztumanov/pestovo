import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Shield, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Search, 
  Lock, 
  Building, 
  UserCheck, 
  Calendar, 
  Mail, 
  MapPin, 
  Phone,
  Scale
} from 'lucide-react';
import { getDocumentPdfUrl } from '../utils/pdfGenerator';
import { RESORT_INFO } from '../data/resortData';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PRIVACY_SECTIONS = [
  {
    id: 'general',
    number: '1',
    title: 'Общие положения и статус Оператора',
    content: `1.1. Настоящая Политика обработки и защиты персональных данных (далее — Политика) определяет порядок сбора, систематизации, накопления, хранения, уточнения, использования, передачи, блокирования и уничтожения персональных данных в Федеральном государственном казенном учреждении «Санаторий «Ясная Поляна» Федеральной таможенной службы» (ФГКУ «Санаторий «Ясная Поляна» ФТС России», далее — Оператор, Санаторий, Учреждение).

1.2. Политика разработана в строгом соответствии с требованиями законодательства Российской Федерации:
• Конституции Российской Федерации (ст. 23, 24);
• Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»;
• Федерального закона от 21.11.2011 № 323-ФЗ «Об основах охраны здоровья граждан в Российской Федерации»;
• Федерального закона от 27.07.2006 № 149-ФЗ «Об информации, информационных технологиях и о защите информации»;
• Требований к защите персональных данных при их обработке в информационных системах персональных данных, утвержденных Постановлением Правительства РФ от 01.11.2012 № 1119;
• Нормативных правовых актов Федеральной таможенной службы (ФТС России) и Устава Учреждения.

1.3. Настоящая Политика является общедоступным документом и размещается в свободном доступе в сети Интернет на официальном сайте Оператора https://ya-polyana.ru, а также на информационных стендах в приемном отделении санатория.`
  },
  {
    id: 'legal-basis',
    number: '2',
    title: 'Правовые основания обработки персональных данных',
    content: `2.1. Правовыми основаниями обработки персональных данных Оператором являются:
• осуществление возложенных законодательством РФ на ФГКУ «Санаторий «Ясная Поляна» ФТС России» функций, полномочий и обязанностей по санаторно-курортному лечению, оздоровлению и реабилитации сотрудников, пенсионеров таможенных органов РФ и членов их семей, а также иных граждан;
• Лицензия на осуществление медицинской деятельности № Л041-00110-91/00554225 от 29.10.2013 г.;
• договоры на оказание санаторно-курортных, гостиничных и медицинских услуг, заключаемые между Оператором и субъектом персональных данных;
• согласие субъекта персональных данных на обработку его персональных данных, оформленное в письменной форме либо путем совершения конклюдентных действий при направлении электронных заявок через официальный сайт;
• законодательство РФ о миграционном и регистрационном учете граждан по месту пребывания (Закон РФ от 25.06.1993 № 5242-1).`
  },
  {
    id: 'categories-scope',
    number: '3',
    title: 'Категории субъектов и состав обрабатываемых данных',
    content: `3.1. Оператор осуществляет обработку персональных данных следующих категорий субъектов:
• Пользователи официального сайта: лица, направляющие обращения, заявки на бронирование, запросы на расчет стоимости путевки через интерактивные формы сайта;
• Отдыхающие и пациенты: граждане, прибывшие на санаторно-курортное лечение, оздоровительный отдых или амбулаторные консультации;
• Сотрудники, государственные служащие и кандидаты на замещение вакантных должностей;
• Контрагенты и представители юридических лиц по гражданско-правовым договорам.

3.2. Состав обрабатываемых персональных данных:
• Общие данные: фамилия, имя, отчество; дата и место рождения; паспортные данные (серия, номер, кем и когда выдан, код подразделения); адрес регистрации и фактического проживания; контактный номер телефона; адрес электронной почты (e-mail); СНИЛС; реквизиты полиса ОМС/ДМС;
• Специальные категории персональных данных (сведения о состоянии здоровья): диагнозы, данные санаторно-курортной карты (форма 072/у или 076/у), анамнез, результаты лабораторных и инструментальных исследований, сведения о противопоказаниях к бальнео- и физиотерапевтическим процедурам;
• Технические данные (при использовании сайта): файлы cookie, IP-адрес, тип и версия операционной системы и браузера, источник перехода на сайт, сведения о действиях на страницах ресурса.`
  },
  {
    id: 'purposes',
    number: '4',
    title: 'Цели сбора и обработки персональных данных',
    content: `4.1. Персональные данные обрабатываются Оператором исключительно в законных целях:
• Прием, регистрация и рассмотрение электронных заявок и обращений граждан на бронирование санаторно-курортных путевок и проживания;
• Расчет стоимости санаторно-курортных программ, предоставление справочной и консультационной информации;
• Заключение, исполнение и прекращение договоров на оказание санаторно-курортных, оздоровительных и медицинских услуг;
• Оказание квалифицированной медицинской помощи, назначение лечебных и профилактических процедур (климатотерапия, бальнеология, физиотерапия, массаж, ингаляции и др.);
• Ведение первичной медицинской документации в соответствии с приказами Минздрава России;
• Обеспечение пропускного и внутриобъектового режима на закрытой ведомственной территории санатория ФТС России;
• Осуществление регистрационного учета граждан РФ и миграционного учета иностранных граждан по месту временного пребывания;
• Исполнение требований налогового, бухгалтерского, пенсионного и архивного законодательства РФ.`
  },
  {
    id: 'medical-confidentiality',
    number: '5',
    title: 'Особенности обработки медицинских данных и врачебная тайна',
    content: `5.1. Обработка специальных категорий персональных данных, касающихся состояния здоровья, осуществляется Оператором в строгом соответствии с п. 4 ч. 2 ст. 10 Федерального закона № 152-ФЗ в медико-профилактических целях, в целях установления медицинского диагноза, оказания медицинской и медико-социальной помощи лицами, профессионально занимающимися медицинской деятельностью и обязанными сохранять врачебную тайну.

5.2. В соответствии со ст. 13 Федерального закона от 21.11.2011 № 323-ФЗ «Об основах охраны здоровья граждан в РФ» сведения о факте обращения за медицинской помощью, состоянии здоровья гражданина, диагнозе его заболевания и иные сведения, полученные при его обследовании и лечении, составляют врачебную тайну.

5.3. Передача сведений, составляющих врачебную тайну, другим гражданам и организациям допускается исключительно с письменного согласия гражданина или его законного представителя, за исключением установленных федеральным законом случаев (по запросам органов следствия, суда, прокуратуры и т.д.).`
  },
  {
    id: 'processing-localization',
    number: '6',
    title: 'Порядок обработки и локализация баз данных в РФ',
    content: `6.1. Сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение персональных данных граждан Российской Федерации осуществляются Оператором с использованием баз данных, находящихся исключительно на территории Российской Федерации (ч. 5 ст. 18 Федерального закона № 152-ФЗ).

6.2. Обработка персональных данных осуществляется как автоматизированным способом (в защищенных информационных системах персональных данных Учреждения), так и без использования средств автоматизации (на бумажных носителях) с соблюдением требований Положения, утвержденного Постановлением Правительства РФ от 15.09.2008 № 687.

6.3. Трансграничная передача персональных данных Оператором НЕ осуществляется.

6.4. Оператор не раскрывает третьим лицам и не распространяет персональные данные без согласия субъекта персональных данных, если иное не предусмотрено федеральным законом.`
  },
  {
    id: 'security-measures',
    number: '7',
    title: 'Меры по обеспечению безопасности персональных данных',
    content: `7.1. ФГКУ «Санаторий «Ясная Поляна» ФТС России» реализует комплекс правовых, организационных и технических мер по защите персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, в соответствии со статьями 18.1 и 19 Федерального закона № 152-ФЗ:
• Назначено должностное лицо, ответственное за организацию обработки и защиты персональных данных в Учреждении;
• Изданы локальные акты по вопросам обработки персональных данных, регламенты доступа к информационным системам;
• Применяются сертифицированные средства защиты информации, прошедшие установленную процедуру оценки соответствия (ФСТЭК России, ФСБ России);
• Осуществляется учет машинных носителей персональных данных, ведется резервное копирование;
• Установлены правила доступа к персональным данным, обрабатываемым в ИСПДн, регистрируются и протоколируются все действия пользователей;
• Доступ в помещения, где размещены серверные мощности и архивы медицинских карт, строго ограничен и находится под круглосуточной охраной;
• При передаче данных через официальный сайт используется протокол защищенного SSL/TLS-шифрования.`
  },
  {
    id: 'storage-retention',
    number: '8',
    title: 'Сроки обработки и условия прекращения хранения',
    content: `8.1. Сроки обработки и хранения персональных данных определяются в соответствии со сроком действия договора с субъектом, согласия субъекта на обработку, а также сроками архивного хранения документов, установленными законодательством РФ и приказами Минздрава России:
• Медицинская документация (медицинские карты пациентов, истории болезни, журналы процедур) хранится в ведомственном архиве санатория не менее 25 лет (в соответствии с Приказом Минздрава РФ);
• Электронные обращения и заявки с сайта хранятся до завершения обработки и оказания консультации, но не более срока, необходимого для исполнения обязательств;
• Бухгалтерские и финансовые документы хранятся в течение 5 лет после окончания отчетного года.

8.2. Условием прекращения обработки персональных данных является достижение целей обработки, истечение срока действия согласия, отзыв согласия субъектом персональных данных, либо выявление неправомерной обработки данных.`
  },
  {
    id: 'subject-rights',
    number: '9',
    title: 'Права субъекта персональных данных и порядок отзыва согласия',
    content: `9.1. Субъект персональных данных имеет право:
• Получать полную информацию, касающуюся обработки его персональных данных Учреждением (правовые основания, цели, способы, сроки обработки и хранения);
• Требовать от Оператора уточнения своих персональных данных, их блокирования или уничтожения в случае, если данные являются неполными, устаревшими, неточными, незаконно полученными;
• Отозвать данное ранее согласие на обработку персональных данных в любой момент;
• Обжаловать неправомерные действия или бездействие Оператора в уполномоченный орган по защите прав субъектов персональных данных (Роскомнадзор) либо в судебном порядке.

9.2. Порядок отзыва согласия и направления обращений:
Для отзыва согласия на обработку персональных данных либо для реализации иных законных прав субъект направляет официальное письменное заявление:
• Почтовым отправлением по адресу: 298660, Российская Федерация, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52, ФГКУ «Санаторий «Ясная Поляна» ФТС России»;
• В форме электронного документа, подписанного электронной подписью, на официальный адрес электронной почты: sanatoriy@ya-polyana.ru.
Запрос рассматривается Оператором в установленный ст. 14 и ст. 21 152-ФЗ срок (не более 10 рабочих дней с момента получения).`
  },
  {
    id: 'cookies',
    number: '10',
    title: 'Использование файлов Cookie и веб-аналитики',
    content: `10.1. Официальный сайт https://ya-polyana.ru использует файлы cookie (куки) и аналогичные технологии для обеспечения стабильной работы веб-интерфейса, сохранения настроек доступности (включая режим для слабовидящих), а также сбора обезличенных статистических показателей посещаемости.

10.2. Пользователь вправе в любое время отключить сохранение файлов cookie в настройках своего интернет-браузера. Отключение некоторых функциональных cookie может ограничить доступ к отдельным интерактивным сервисам сайта (калькулятор, онлайн-бронирование).`
  },
  {
    id: 'contacts-requisites',
    number: '11',
    title: 'Реквизиты и контактные данные Оператора',
    content: `Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» Федеральной таможенной службы»
(ФГКУ «Санаторий «Ясная Поляна» ФТС России»)

• ИНН: 7713778678
• КПП: 910301001
• ОГРН: 1147746900407
• Лицензия Минздрава РФ: № Л041-00110-91/00554225 от 29.10.2013 г.
• Юридический и почтовый адрес: 298660, Российская Федерация, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52
• Телефон приемной / факс: +7 (3654) 23-93-76
• Официальный адрес электронной почты: sanatoriy@ya-polyana.ru
• И.о. Начальника санатория: Данилив Алексей Иванович`
  }
];

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Filter sections by search query if present
  const filteredSections = searchQuery.trim() === ''
    ? PRIVACY_SECTIONS
    : PRIVACY_SECTIONS.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(`privacy-sec-${id}`);
    if (element && contentRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const fullLegalDocumentText = PRIVACY_SECTIONS.map(s => `РАЗДЕЛ ${s.number}. ${s.title.toUpperCase()}\n\n${s.content}`).join('\n\n------------------------------------------------------------\n\n');
      
      const pdfBlobUrl = await getDocumentPdfUrl({
        title: 'Политика в отношении обработки и защиты персональных данных',
        code: '152-ФЗ / Регламент ФТС России',
        number: '152-ФЗ/ПД-2026',
        date: 'Утверждено 2026 г.',
        categoryLabel: 'Нормативно-правовые акты',
        summary: 'Официальное положение ФГКУ «Санаторий «Ясная Поляна» ФТС России» об обработке и защите персональных данных и врачебной тайны.',
        originalText: fullLegalDocumentText,
        fullText: fullLegalDocumentText
      });

      const a = document.createElement('a');
      a.href = pdfBlobUrl;
      a.download = 'Politika_obrabotki_personalnyh_dannyh_Yasnaya_Polyana_FTS.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Failed to generate Privacy Policy PDF:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl h-[92vh] max-h-[900px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-stone-200"
      >
        {/* Top Header Bar */}
        <div className="bg-[#022C22] text-white px-5 py-4 shrink-0 flex items-center justify-between border-b border-[#c5a880]/30 shadow-sm">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-mono text-[#c5a880] uppercase tracking-wider block font-semibold">
                Официальный регламент ФГКУ «Санаторий «Ясная Поляна» ФТС России»
              </span>
              <h2 className="text-sm sm:text-base md:text-lg font-serif font-bold text-white tracking-tight truncate">
                Политика обработки и защиты персональных данных (152-ФЗ)
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:flex items-center space-x-1.5 text-xs font-semibold"
              title="Распечатать политику"
            >
              <Printer className="w-4 h-4 text-[#c5a880]" />
              <span className="hidden md:inline">Печать</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-[#c5a880] hover:bg-[#b0936b] text-[#022C22] font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Скачать официальный PDF документ"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isDownloading ? 'Формирование...' : 'Скачать PDF'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
              title="Закрыть окно"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subheader info strip */}
        <div className="bg-[#FAF9F6] border-b border-stone-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 shrink-0">
          <div className="flex items-center space-x-4 flex-wrap gap-y-1">
            <span className="flex items-center space-x-1.5 text-emerald-800 font-semibold font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Соответствует 152-ФЗ и 323-ФЗ РФ</span>
            </span>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <span className="text-stone-500 font-mono text-[11px]">
              Рег. № Л041-00110-91/00554225
            </span>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <span className="text-stone-500 font-mono text-[11px]">
              г. Ялта, пгт. Гаспра
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по статьям политики..."
              className="w-full pl-8 pr-3 py-1 bg-white border border-stone-300 rounded-md text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#022C22] transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area (Sidebar Navigation + Scrollable Document Sheet) */}
        <div className="flex-1 flex overflow-hidden bg-stone-100">
          {/* Navigation Sidebar (Desktop) */}
          <div className="w-72 shrink-0 bg-white border-r border-stone-200 overflow-y-auto hidden lg:block p-4 space-y-1">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mb-2 px-2">
              Оглавление документа
            </span>
            {PRIVACY_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-start space-x-2.5 cursor-pointer ${
                  activeSectionId === sec.id
                    ? 'bg-[#022C22] text-white font-bold shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-[#022C22]'
                }`}
              >
                <span className={`font-mono font-bold text-[11px] shrink-0 mt-0.5 ${
                  activeSectionId === sec.id ? 'text-[#c5a880]' : 'text-stone-400'
                }`}>
                  {sec.number}.
                </span>
                <span className="line-clamp-2 leading-snug">{sec.title}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-stone-200 px-2 space-y-2">
              <div className="bg-[#FAF9F6] p-3 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-[#022C22]">
                  <Scale className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Ведомственный орган:</span>
                </div>
                <p className="leading-tight text-stone-500">
                  Федеральная таможенная служба Российской Федерации (ФТС России)
                </p>
                <p className="font-mono text-[10px] text-stone-400 pt-1">
                  Email: {RESORT_INFO.email}
                </p>
              </div>
            </div>
          </div>

          {/* Document Reader Sheet */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 md:p-12 rounded-xl border border-stone-200 shadow-sm relative text-stone-850 font-sans">
              
              {/* Document Official Heading */}
              <div className="text-center border-b border-stone-200 pb-6 mb-8">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-[#022C22] mb-3">
                  <Building className="w-6 h-6 text-[#022C22]" />
                </div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                  Федеральная таможенная служба Российской Федерации
                </p>
                <p className="text-xs font-serif font-bold text-[#022C22] mt-1">
                  ФГКУ «Санаторий «Ясная Поляна» ФТС России»
                </p>
                <h1 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#022C22] mt-4 leading-snug">
                  ПОЛИТИКА В ОТНОШЕНИИ ОБРАБОТКИ И ЗАЩИТЫ ПЕРСОНАЛЬНЫХ ДАННЫХ
                </h1>
                <p className="text-xs text-stone-400 font-mono mt-2">
                  г. Ялта, пгт. Гаспра • Введена в действие приказом начальника санатория
                </p>
              </div>

              {/* Notice Banner */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-lg mb-8 text-xs text-emerald-950 flex items-start space-x-3">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block text-emerald-900">Государственный стандарт безопасности данных:</span>
                  Обработка персональных данных гостей, пациентов и пользователей сайта осуществляется с использованием сертифицированных средств криптографической защиты информации на защищенных серверах, физически размещенных на территории Российской Федерации.
                </div>
              </div>

              {/* Sections list */}
              <div className="space-y-8">
                {filteredSections.map((sec) => (
                  <section 
                    key={sec.id} 
                    id={`privacy-sec-${sec.id}`}
                    className="scroll-mt-6 border-b border-stone-100 pb-6 last:border-0"
                  >
                    <div className="flex items-center space-x-2.5 mb-3">
                      <span className="w-6 h-6 rounded bg-[#022C22] text-[#c5a880] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {sec.number}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#022C22]">
                        {sec.title}
                      </h3>
                    </div>
                    
                    <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans whitespace-pre-line pl-8">
                      {sec.content}
                    </div>
                  </section>
                ))}

                {filteredSections.length === 0 && (
                  <div className="text-center py-12 text-stone-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">По запросу «{searchQuery}» ничего не найдено</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#022C22] font-bold underline mt-2"
                    >
                      Сбросить поиск
                    </button>
                  </div>
                )}
              </div>

              {/* Official Seal / Signature Simulation Box */}
              <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 p-5 rounded-lg border">
                <div>
                  <span className="block text-stone-400 uppercase tracking-widest font-mono text-[9px]">
                    Оператор персональных данных
                  </span>
                  <p className="font-serif font-bold text-[#022C22] text-sm mt-0.5">
                    ФГКУ «Санаторий «Ясная Поляна» ФТС России»
                  </p>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                    ИНН 7713778678 • Лицензия № Л041-00110-91/00554225
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-lg border border-stone-200 shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-[10px] font-mono leading-tight">
                    <span className="block font-bold text-emerald-800 font-sans">ЭЛЕКТРОННАЯ ПОДПИСЬ УЧРЕЖДЕНИЯ</span>
                    <span className="text-stone-500 block font-serif">Данилив А. И. (и.о. Начальника)</span>
                    <span className="text-stone-400 text-[9px] block">Сертификат ФТС России активен</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-[#FAF9F6] border-t border-stone-200 px-5 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500 font-mono">
          <span>По вопросам обработки ПДн: <a href={`mailto:${RESORT_INFO.email}`} className="text-[#022C22] font-bold hover:underline">{RESORT_INFO.email}</a></span>
          <button 
            onClick={onClose}
            className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] text-xs font-bold px-4 py-1.5 rounded-md transition-colors cursor-pointer font-sans"
          >
            Закрыть окно
          </button>
        </div>
      </motion.div>
    </div>
  );
}
