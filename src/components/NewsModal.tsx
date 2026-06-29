import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  User, 
  Newspaper,
  BookOpen,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'event' | 'equipment' | 'notice' | 'article';
  categoryLabel: string;
  author: string;
  readTime: string;
  summary: string;
  content: string[];
  image: string;
}

const NEWS_REGISTRY: NewsItem[] = [
  {
    id: 'summer-season-2026',
    title: 'Открытие летнего оздоровительного сезона на ЮБК',
    date: '24 мая 2026',
    category: 'event',
    categoryLabel: 'События',
    author: 'Ю. Б. Давыдова, зам. начальника по мед. части',
    readTime: '3 мин читать',
    summary: 'Санаторий «Ясная Поляна» ФТС России полностью подготовил лечебно-парковую инфраструктуру и обновил комплекс климатотерапевтических программ для летнего периода отдыхающих.',
    content: [
      'С наступлением климатического лета Южный берег Крыма расцвел во всем своем великолепии. Рады сообщить, что медицинская служба и парковый департамент ФГКУ Санаторий «Ясная Поляна» подошли к старту ключевого летнего сезона во всеоружии.',
      'В этом году мы значительно расширили арсенал климатолечебных методик. Запущены три новых кольцевых маршрута дозированной ходьбы по терренкурам парковой зоны санатория. Каждый маршрут разработан врачами-кардиологами и снабжен фитотерапевтическими павильонами для отдыха, где гости могут выпить свежеприготовленный кислородный коктейль или травяной сбор.',
      'Также полностью готовы теневой аэрарий санаторного пляжа в Гаспре и павильяны для круглосуточного вдыхания морского воздуха (последовательная галотерапия). Будем рады видеть офицеров ведомства и их семьи на оздоровлении!'
    ],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'diagnostics-modernization-2026',
    title: 'Запущено новейшее оборудование в кабинетах функциональной диагностики',
    date: '15 апреля 2026',
    category: 'equipment',
    categoryLabel: 'Оборудование',
    author: 'А. К. Шевцов, зав. диагностическим отделением',
    readTime: '4 мин читать',
    summary: 'Медицинское отделение санатория укомплектовано новыми микропроцессорными спирографами и системами холтеровского мониторирования ЭКГ последнего поколения.',
    content: [
      'В рамках масштабной программы модернизации материально-технической базы ведомственных лечебно-профилактических учреждений ФТС России, наше отделение получило медицинские диагностические комплексы экспертного класса.',
      'В эксплуатацию введены цифровые спирографы «Спиро-Спектр», предназначенные для высокоточного исследования функции внешнего дыхания (ФВД) у пациентов с хроническими бронхолегочными патологиями. Оборудование позволяет регистрировать до 25 показателей дыхательного цикла и мгновенно формирует карту динамического наблюдения.',
      'Для кардиологического профиля закуплены портативные холтеры с беспроводной передачей данных. Запись ЭКГ теперь происходит без стеснения движений пациента, что крайне важно при проведении климатологических нагрузок и терренкурного лечения.'
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tariffs-quotas-h2',
    title: 'Особенности распределения путевок на второе полугодие',
    date: '10 марта 2026',
    category: 'notice',
    categoryLabel: 'Объявления',
    author: 'Служба социально-бытового снабжения',
    readTime: '2 мин читать',
    summary: 'Разъяснения порядка квотирования мест для действующих сотрудников Федеральной таможенной службы и ветеранов ведомства согласно приказам социального департамента.',
    content: [
      'Стартовал плановый прием заявлений от региональных таможенных управлений (РТУ) и таможен непосредственного подчинения на распределение санаторно-курортного обеспечения в ФГКУ «Санаторий «Ясная Поляна» ФТС России» на II полугодие.',
      'Напоминаем, что подача рапортов сотрудниками осуществляется через личные кабинеты ЕИС ФТС в срок до 15 июня текущего года. Ветераны таможенной службы могут подать официальные заявления через советы ветеранов по месту пенсионного обеспечения.',
      'В приоритетном порядке путевки выделяются личному составу, задействованному на напряженных участках государственной границы, а также лицам, имеющим прямые показания к восстановительному лечению от ведомственной врачебной комиссии.'
    ],
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'climatotherapy-benefits-research',
    title: 'Влияние фитонцидов можжевеловых урочищ Гаспры на иммунитет',
    date: '28 января 2026',
    category: 'article',
    categoryLabel: 'Статьи',
    author: 'Д. М. Колесников, пульмонолог, к.м.н.',
    readTime: '5 мин читать',
    summary: 'Врачебная коллегия санатория опубликовала сводное медицинское исследование об эффективности сочетания морских солей и летучих веществ хвойный парков Ялты.',
    content: [
      'Благодаря уникальному расположению санатория «Ясная Поляна» на стыке лесистых отрогов горы Ай-Петри и теплой черноморской акватории, воздух Гаспры обладает уникальным лечебным составом.',
      'Наши специалисты провели 12-месячные клинические наблюдения за пациентами с астматическими синдромами и хроническим бронхитом. Было доказано, что ежедневное пребывание в парковых аллеях санатория, богатых вековыми кипарисами, кедрами и можжевельниками, снижает частоту использования ингаляционных препаратов в 2.4 раза.',
      'Морские аэроионы насыщают ткани кислородом и йодистыми соединениями, а фитонциды хвои подавляют патогенную флору в верхних дыхательных путях. Курортные факторы ЮБК являются полноценным естественным лекарственным средством, не имеющим побочных эффектов.'
    ],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  }
];

export default function NewsModal({ isOpen, onClose }: NewsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingArticle, setViewingArticle] = useState<NewsItem | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredNews = NEWS_REGISTRY.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden flex items-center justify-center font-sans">
      {/* Background close overlay */}
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
        {/* Header standard toolbar */}
        <div className="bg-[#022C22] text-white p-5 flex items-center justify-between border-b border-[#c5a880]/25 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-[#c5a880] p-1.5 rounded-sm text-[#022C22]">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#c5a880] font-bold">Официальный инфоканал</span>
              <h2 className="font-serif text-lg font-bold tracking-tight">Новости и публикации санатория</h2>
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

        {/* Dynamic Inner contents */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
          <AnimatePresence mode="wait">
            {!viewingArticle ? (
              // NEWS MAIN FEED List view
              <motion.div 
                key="list-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col overflow-hidden h-full p-6"
              >
                {/* Search / Filter widgets */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Поиск по новостям, авторам, ключевым словам..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 pl-10 pr-4 py-2.5 rounded-sm text-xs sm:text-sm focus:outline-none focus:border-[#022C22] font-sans placeholder-stone-400"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'Все новости' },
                      { id: 'event', label: 'События' },
                      { id: 'equipment', label: 'Оборудование' },
                      { id: 'notice', label: 'Объявления' },
                      { id: 'article', label: 'Статьи' }
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

                {/* News dynamic grid list scroller */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredNews.map((news) => (
                        <div 
                          key={news.id}
                          className="bg-stone-50 rounded-sm border border-stone-200/80 overflow-hidden hover:border-[#c5a880]/50 hover:shadow-md transition-all flex flex-col h-full"
                        >
                          {/* Card cover image */}
                          <div className="h-44 w-full overflow-hidden relative bg-stone-200 shrink-0">
                            <img 
                              src={news.image} 
                              alt={news.title} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-3 left-3 text-[10px] tracking-wider uppercase font-mono font-bold text-[#faf9f6] bg-[#022C22]/90 backdrop-blur-md px-2.5 py-1 rounded-sm border border-[#c5a880]/20">
                              {news.categoryLabel}
                            </span>
                          </div>

                          {/* Card body content with strict clamping */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center space-x-3 text-[10px] text-stone-400 font-mono font-semibold">
                                <span className="flex items-center">
                                  <Calendar className="w-3.5 h-3.5 mr-1 text-[#c5a880]" />
                                  {news.date}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3.5 h-3.5 mr-1 text-[#c5a880]" />
                                  {news.readTime}
                                </span>
                              </div>

                              <h3 className="font-serif text-sm sm:text-base font-extrabold text-[#022C22] leading-snug line-clamp-2">
                                {news.title}
                              </h3>

                              <p className="text-xs text-stone-500 leading-relaxed font-sans line-clamp-3">
                                {news.summary}
                              </p>
                            </div>

                            <button
                              onClick={() => setViewingArticle(news)}
                              className="w-full bg-[#022C22]/5 hover:bg-[#022C22] text-[#022C22] hover:text-[#c5a880] py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                            >
                              <span>Читать полностью</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-stone-50 rounded border border-stone-100">
                      <Newspaper className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500 text-sm font-semibold">Новости не найдены.</p>
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
              // FULL ARTICLE DETAILED VEIW PANE
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col overflow-hidden h-full"
              >
                {/* Navigator toolbar on top of standard article */}
                <div className="bg-stone-100 p-4 border-b border-stone-200 shrink-0 flex items-center justify-between">
                  <button
                    onClick={() => setViewingArticle(null)}
                    className="flex items-center space-x-2 text-stone-600 hover:text-[#022C22] text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Назад в ленту новостей</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleShare}
                      className="p-2 bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-[#022C22] rounded-sm transition-all cursor-pointer flex items-center space-x-1"
                      title="Скопировать ссылку"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs font-semibold hidden sm:inline">Поделиться</span>
                    </button>
                  </div>
                </div>

                {/* Share success popup notification dialog */}
                <AnimatePresence>
                  {shareSuccess && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="bg-emerald-50 text-emerald-800 text-xs py-2 px-6 border-b border-emerald-200 font-medium text-center flex items-center justify-center space-x-2"
                     >
                       <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                       <span>Ссылка скопирована в буфер обмена для отправки коллегам!</span>
                     </motion.div>
                  )}
                </AnimatePresence>

                {/* Actual typography reading layout */}
                <div className="flex-1 overflow-y-auto bg-stone-50">
                  {/* Hero banner section */}
                  <div className="w-full h-80 relative bg-stone-300">
                    <img 
                      src={viewingArticle.image} 
                      alt={viewingArticle.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 lg:left-12 lg:right-12 text-white max-w-4xl">
                      <span className="text-[10px] tracking-widest font-mono text-[#c5a880] uppercase font-bold bg-[#022C22] px-2.5 py-1 rounded border border-[#c5a880]/20 inline-block mb-3">
                        {viewingArticle.categoryLabel}
                      </span>
                      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                        {viewingArticle.title}
                      </h1>
                    </div>
                  </div>

                  {/* Body textual typography layout wrapper */}
                  <div className="max-w-3xl mx-auto px-6 py-10 font-sans text-stone-850 leading-relaxed space-y-6">
                    {/* Authors metadata card */}
                    <div className="flex flex-wrap items-center justify-between border-b pb-5 text-xs text-stone-400 font-mono gap-3 shrink-0">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-[#c5a880]" />
                        <span className="text-stone-700 font-semibold">{viewingArticle.author}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {viewingArticle.date}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="w-3.5 h-3.5 mr-1" />
                          {viewingArticle.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Leading highlight paragraph */}
                    <p className="text-base sm:text-lg font-serif font-semibold text-[#022C22] italic leading-relaxed border-l-4 border-[#c5a880] pl-4">
                      {viewingArticle.summary}
                    </p>

                    {/* Rest of full textual fragments of content */}
                    {viewingArticle.content.map((paragraph, idx) => (
                      <p key={idx} className="text-stone-700 text-sm sm:text-base leading-relaxed">
                        {paragraph}
                      </p>
                    ))}

                    {/* Disclaimer annotation footer */}
                    <div className="mt-10 p-5 bg-stone-100 rounded-sm border border-stone-200 text-xs text-stone-500 leading-relaxed font-sans">
                      <strong>Примечание администрации:</strong> Данная публикация носит официальный уведомительный характер. Любые медицинские оздоровительные процедуры проводятся строго по согласованию с лечащим терапевтом санатория на основании данных вашей санаторно-курортной карты.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom toolbar info bar */}
        <div className="p-4 bg-stone-100 border-t border-stone-200/80 shrink-0 text-center text-stone-400 font-mono text-[10px] uppercase tracking-wider flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Служба общественных связей ФГКУ «Санаторий «Ясная Поляна» ФТС РФ</span>
          <span className="text-[#c5a880] font-bold">Ялта • Гаспра • Крым</span>
        </div>
      </motion.div>
    </div>
  );
}
