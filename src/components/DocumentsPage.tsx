import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Upload, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Shield, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  HelpCircle,
  FileCheck,
  Briefcase,
  AlertCircle,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

interface DocumentItem {
  id: string;
  title: string;
  code?: string;
  category: 'constituent' | 'medical' | 'law' | 'reception' | 'finance' | 'modifications';
  categoryLabel: string;
  summary: string;
  pdfUrl: string | null;
  fileSize?: string;
  uploadDate?: string;
  originalText?: string;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'tourism-extract',
    title: 'ВЫПИСКА ИЗ ЕДИНОГО РЕЕСТРА КЛАССИФИКАЦИИ В СФЕРЕ ТУРИСТСКОЙ ИНДУСТРИИ',
    code: 'Рег. № 55001293',
    category: 'finance',
    categoryLabel: 'Финансовые и классификация',
    summary: 'Свидетельство о присвоении категории звездности санаторно-курортного учреждения согласно единым федеральным стандартам РФ.',
    pdfUrl: '/documents/tourism-extract.pdf',
    fileSize: '1.4 MB',
    uploadDate: '24.01.2025',
    originalText: 'ФЕДЕРАЛЬНОЕ АГЕНТСТВО ПО ТУРИЗМУ\n\nВыписка из единого государственного реестра аккредитованных объектов классификации санаторно-курортной сферы.\nСанаторий «Ясная Поляна» ФТС России квалифицирован по общенациональным стандартам туристской индустрии.'
  },
  {
    id: 'citizen-appeals',
    title: 'Обращения граждан',
    code: 'Инструкция ФТС',
    category: 'reception',
    categoryLabel: 'Лечебный regime и обращения',
    summary: 'Регламент и график личного приема граждан администрацией санатория, форма подачи предложений и рассмотрения жалоб.',
    pdfUrl: '/documents/citizen-appeals.pdf',
    fileSize: '840 KB',
    uploadDate: '12.02.2026',
    originalText: 'ПОРЯДОК РАССМОТРЕНИЯ ОБРАЩЕНИЙ ГРАЖДАН\n\nРассмотрение обращений граждан в ФГКУ «Санаторий «Ясная Поляна» ФТС России» осуществляется в строгом соответствии с Федеральным законом № 59-ФЗ «О порядке рассмотрения обращений граждан Российской Федерации».'
  },
  {
    id: 'sanatorium-info',
    title: 'Информация о санатории',
    code: 'Общие сведения',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Сводная нормативная карточка учреждения: уставные цели, профили лечения, паспорт безопасности ведомственного учреждения.',
    pdfUrl: '/documents/sanatorium-info.pdf',
    fileSize: '2.1 MB',
    uploadDate: '15.01.2026',
    originalText: 'ОФИЦИАЛЬНАЯ СПРАВКА ОБ УЧРЕЖДЕНИИ\n\nФедеральное государственное казенное учреждение «Санаторий «Ясная Поляна» ФТС России». Специализированное учреждение круглогодичного действия на 210 мест. Ключевые лечебные факторы: уникальный горно-морской микроклимат Гаспры.'
  },
  {
    id: 'minzdrav-956n',
    title: 'Приказ Минздрава РФ от 30.12.2014 N 956Н',
    code: 'Приказ № 956Н',
    category: 'medical',
    categoryLabel: 'Лицензии и стандарты',
    summary: 'Об утверждении информации, необходимой для проведения независимой оценки качества условий оказания услуг медицинскими организациями.',
    pdfUrl: null,
    originalText: 'МИНИСТЕРСТВО ЗДРАВООХРАНЕНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ\n\nПРИКАЗ от 30 декабря 2014 г. N 956н\n\nОб утверждении информации, предоставляемой медицинскими организациями, и порядка её размещения на официающих сайтах органов государственной власти и ведомственных информационных порталах.'
  },
  {
    id: 'egrul-2023',
    title: 'ЕГРЮЛ на 18.07.2023',
    code: 'ОГРН 5137746004787',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Официальная выписка из Единого государственного реестра юридических лиц по состоянию на 18 июля 2023 года.',
    pdfUrl: '/documents/egrul-2023.pdf',
    fileSize: '3.4 MB',
    uploadDate: '18.07.2023',
    originalText: 'ВЫПИСКА ИЗ ЕДИННОГО ГОСУДАРСТВЕННОГО РЕЕСТРА ЮРИДИЧЕСКИХ ЛИЦ\n\nДата формирования выписки: 18.07.2023\nНаименование: ФГКУ «Санаторий Ясная Поляна ФТС России»\nЮридический адрес: Респ Крым, г Ялта, пгт Гаспра, Севастопольское шоссе, д. 52.'
  },
  {
    id: 'payment-details',
    title: 'Реквизиты для оплаты',
    code: 'Лицевой счет № 04751А45010',
    category: 'finance',
    categoryLabel: 'Финансовые и классификация',
    summary: 'Государственные платежные реквизиты УФК для зачисления средств за платные оздоровительные процедуры и путевки.',
    pdfUrl: '/documents/payment-details.pdf',
    fileSize: '120 KB',
    uploadDate: '10.05.2026',
    originalText: 'РЕКВИЗИТЫ ДЛЯ ПЛАТЕЖЕЙ И БЕЗНАЛИЧНЫХ ПЕРЕВОДОВ\n\nПолучатель: УФК по Республике Крым (ФГКУ Санаторий Ясная Поляна ФТС России)\nИНН / КПП: 7713778678 / 910301001\nБанк получателя: ОТДЕЛЕНИЕ РЕСПУБЛИКА КРЫМ БАНКА РОССИИ // УФК по Республике Крым г. Симферополь\nБИК: 013510002\nНомер казначейского счета: 03211643000000017500'
  },
  {
    id: 'medical-care-types',
    title: 'Виды медицинской помощи',
    code: 'Медицинский паспорт',
    category: 'medical',
    categoryLabel: 'Лицензии и стандарты',
    summary: 'Номенклатура доврачебной, врачебной и специализированной санаторно-курортной помощи по терапии, физиотерапии, педиатрии и кардиологии.',
    pdfUrl: '/documents/medical-care-types.pdf',
    fileSize: '950 KB',
    uploadDate: '01.03.2026',
    originalText: 'ПЕРЕЧЕНЬ ВИДОВ ОКАЗЫВАЕМОЙ МЕДИЦИНСКОЙ ПОМОЩИ\n\nСанаторий Ясная Поляна оказывает первичную доврачебную и первичную специализированную медико-санитарную помощь на основании государственной медицинской лицензии. Виды деятельности: Физиотерапия, ЛФК, Диетология, Массаж, Функциональная диагностика, Климатолечение.'
  },
  {
    id: 'vital-drugs',
    title: 'Жизненно необходимые и важнейшие лекарственные препараты',
    code: 'ЖНВЛП 2026',
    category: 'medical',
    categoryLabel: 'Лицензии и стандарты',
    summary: 'Реестр лекарственных средств для неотложного клинического обеспечения и оказания скорой медицинской помощи в изоляторе санатория.',
    pdfUrl: null,
    originalText: 'УТВЕРЖДЕННЫЙ ПЕРЕЧЕНЬ ЖНВЛП (ЖИЗНЕННО НЕОБХОДИМЫХ ЛЕКАРСТВЕННЫХ ПРЕПАРАТОВ)\n\nРегламент оказания неотложной лекарственной поддержки отдыхающих в соответствии с актуальным перечнем Министерства здравоохранения Российской Федерации.'
  },
  {
    id: 'general-license',
    title: 'Лицензия',
    code: '№ Л041-00110-91/00554225',
    category: 'medical',
    categoryLabel: 'Лицензии и стандарты',
    summary: 'Государственная бессрочная медицинская лицензия со спецификацией всех видов сертифицированных работ.',
    pdfUrl: '/documents/general-license.pdf',
    fileSize: '1.8 MB',
    uploadDate: '22.06.2022',
    originalText: 'ГОСУДАРСТВЕННАЯ МЕДИЦИНСКАЯ ЛИЦЕНЗИЯ\nЛицензия предоставлена Министерством Здравоохранения Республики Крым.\nСрок действия: бессрочно.\nРегистрационный номер бланка: Л041-00110-91/00554225.'
  },
  {
    id: 'selection-procedure',
    title: 'Порядок отбора',
    code: 'Инструкция ФТС № 24-Р',
    category: 'reception',
    categoryLabel: 'Лечебный режим и обращения',
    summary: 'Порядок ведомственного отбора и направления больных на медико-психологическую реабилитацию в санаторно-курортные учреждения ФТС.',
    pdfUrl: null,
    originalText: 'ИНСТРУКЦИЯ О ПОРЯДКЕ ОТБОРА НА ОЗДОРОВЛЕНИЕ\n\nПриказ и методические указания по отбору кандидатов из числа действующих сотрудников ФТС России, нуждающихся в прохождении санаторной или восстановительной реабилитации.'
  },
  {
    id: 'minzdrav-956n-v2',
    title: 'Приказ МЗ РФ № 956Н',
    code: 'Дубликат / Архив',
    category: 'medical',
    categoryLabel: 'Лицензии и стандарты',
    summary: 'Архивная копия и методические указания по внедрению требований Приказа № 956Н в ведомственные информационные системы ФТС.',
    pdfUrl: null,
    originalText: 'ПРИКАЗ МИНИСТЕРСТВА ЗДРАВООХРАНЕНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ № 956Н\n\n(Информационная выписка по обеспечению доступности данных медицинского характера для граждан и инспектирующих органов).'
  },
  {
    id: 'fz-283',
    title: 'Федеральный Закон № 283',
    code: 'ФЗ № 283-ФЗ',
    category: 'law',
    categoryLabel: 'Нормативно-правовые акты',
    summary: 'О социальных гарантиях сотрудникам некоторых федеральных органов исполнительной власти и внесении изменений в отдельные законодательные акты.',
    pdfUrl: null,
    originalText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ. ФЕДЕРАЛЬНЫЙ ЗАКОН № 283-ФЗ\n\nОпределяет порядок обеспечения путевками на санаторно-курортное лечение сотрудников таможенных органов РФ и пенсионеров ФТС, а также компенсации транспортных расходов к месту оздоровления.'
  },
  {
    id: 'fz-323',
    title: 'Федеральный Закон № 323',
    code: 'ФЗ № 323-ФЗ',
    category: 'law',
    categoryLabel: 'Нормативно-правовые акты',
    summary: 'Об основах охраны здоровья граждан в Российской Федерации — фундаментальный закон здравоохранения РФ.',
    pdfUrl: null,
    originalText: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ. ФЕДЕРАЛЬНЫЙ ЗАКОН № 323-ФЗ\n\n«Об основах охраны здоровья граждан в Российской Федерации».\nГарантии прав граждан в сфере охраны здоровья, права пациентов при оказании медицинской и санаторной помощи.'
  },
  {
    id: 'egrul-record-address',
    title: 'Лист записи ЕГРЮЛ, адрес юридический',
    code: 'Рег. № 213774619028',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Документ, подтверждающий официальное изменение юридического адреса на фактический крымский реквизит в органах ФНС России.',
    pdfUrl: null,
    originalText: 'ЛИСТ ЗАПИСИ ЕДИНОГО ГОСУДАРСТВЕННОГО РЕЕСТРА ЮРИДИЧЕСКИХ ЛИЦ\n\nНастоящим подтверждается внесение изменений в учредительные ведомости ФГКУ «Санаторий Ясная Поляна» ФТС России касательно адреса постоянного юридического нахождения.'
  },
  {
    id: 'fns-crimea',
    title: 'свидетельство о поставке в ФНС РК',
    code: 'КПП 910301001',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Документ о постановке на учет российской организации в налоговом органе по новому месту нахождения на территории Республики Крым.',
    pdfUrl: null,
    originalText: 'МИНИСТЕРСТВО ПО НАЛОГАМ И СБОРАМ РОССИЙСКОЙ ФЕДЕРАЦИИ\n\nСвидетельство о постановке на учет юридического лица в налоговом органе по Республике Крым. Присвоен КПП Ялтинского региона.'
  },
  {
    id: 'fns-ogrn-cert',
    title: 'свидетельство ФНС ОГРН 015463944',
    code: 'ОГРН 5137746004787 / 77',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Бланк строгой отчетности ФНС РФ, заверяющий государственную регистрацию юридического лица при его создании.',
    pdfUrl: '/documents/fns-ogrn-cert.pdf',
    fileSize: '1.2 MB',
    uploadDate: '29.10.2013',
    originalText: 'СВИДЕТЕЛЬСТВО О ГОСУДАРСТВЕННОЙ РЕГИСТРАЦИИ\nСерия 77 № 015463944\n\nФедеральное государственное казенное учреждение «Санаторий «Ясная Поляна» Федеральной таможенной службы» зарегистрировано за основным государственным регистрационным номером 5137746004787.'
  },
  {
    id: 'charter-yasnayapolyana',
    title: 'Устав Ясной Поляны',
    code: 'Лицензионный устав ФТС',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Полная версия учредительного Устава со всеми изменениями и дополнениями Министерства Образования и ФТС.',
    pdfUrl: '/documents/charter-yasnayapolyana.pdf',
    fileSize: '4.6 MB',
    uploadDate: '18.10.2013',
    originalText: 'УСТАВ ФГКУ «САНАТОРИЙ «ЯСНАЯ ПОЛЯНА» ФТС РОССИИ»\n\nПолный текст регламента органов управления, финансово-хозяйственной деятельности ведомственного учреждения, а также режима оказания медицинской помощи сотрудникам таможни.'
  },
  {
    id: 'contract-sample',
    title: 'Образец договора оказания санаторно-курортных услуг',
    code: 'Типовой договор 2026',
    category: 'finance',
    categoryLabel: 'Финансовые и классификация',
    summary: 'Двусторонний договор на оказание дополнительных платных оздоровительных или основных коммерческих услуг размещения.',
    pdfUrl: null,
    originalText: 'ТИПОВОЙ ДОГОВОР\nна оказание санаторно-курортных услуг\n\nТекст договора регламентирует права, обязанности сторон, условия возврата средств, правила отмены бронирования и перечень заложенных в путевку доврачебных процедур.'
  },
  {
    id: 'incoming-memo',
    title: 'ПАМЯТКА К СВЕДЕНИЮ ПОСТУПАЮЩИХ В САНАТОРИЙ',
    code: 'Памятка гостю',
    category: 'reception',
    categoryLabel: 'Лечебный режим и обращения',
    summary: 'Необходимый перечень медицинских справок, документов для взрослых и детей, правила заселения и выселения.',
    pdfUrl: '/documents/incoming-memo.pdf',
    fileSize: '450 KB',
    uploadDate: '15.02.2026',
    originalText: 'ВАЖНАЯ ИНФОРМАЦИЯ ДЛЯ ПРИБЫВАЮЩИХ НА ЛЕЧЕНИЕ\n\nПри заезде обязательно предоставить паспорт, санаторно-курортную карту № 072/у (детям № 076/у), полис ОМС, а также справку об эпидокружении. Режим заезда: с 08:00.'
  },
  {
    id: 'sanatorium-rules',
    title: 'Правила с-к р',
    code: 'Санаторно-курортный режим',
    category: 'reception',
    categoryLabel: 'Лечебный режим и обращения',
    summary: 'Правила внутреннего распорядка, дисциплины отдыхающих, пользования климатотерапевтическим парком и пляжной инфраструктурой Гаспры.',
    pdfUrl: null,
    originalText: 'ПРАВИЛА И РЕЖИМ САНАТОРНОГО ПРЕБЫВАНИЯ\n\nСоблюдение распорядка дня обязательно для всех гостей. Время тихого часа: с 14:30 до 16:00. Разведение костров и несанкционированное использование беспилотных аппаратов строго запрещены.'
  },
  {
    id: 'privacy-policy',
    title: 'Политика об обработке персональных данных',
    code: 'ФЗ-152 Комитет Безопасности',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Основное ведомственное положение о защите конфиденциальных сведений, медицинских диагнозов и личных данных отдыхающих.',
    pdfUrl: null,
    originalText: 'ПОЛИТИКА В ОТНОШЕНИИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ\n\nРазработана в соответствии с Федеральным законом № 152-ФЗ. Регламентирует сбор, систематизацию, хранение и защиту паспортных, служебных и медицинских сведений гостей.'
  },
  {
    id: 'director-order',
    title: 'Приказ на и.о. начальника санатория',
    code: 'Приказ ФТС № 81-ЛС',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Выписка из приказа руководителя Федеральной таможенной службы России о возложении обязанностей начальника санатория на Данилива Алексея Ивановича.',
    pdfUrl: null,
    originalText: 'ПРИКАЗ РУКОВОДИТЕЛЯ ФЕДЕРАЛЬНОЙ ТАМОЖЕННОЙ СЛУЖБЫ РОССИЙСКОЙ ФЕДЕРАЦИИ\n\nО возложении временного исполнения обязанностей начальника Федерального государственного казенного учреждения «Санаторий «Ясная Поляна» ФТС России» на Данилива А.И.'
  },
  {
    id: 'structure-yasnayapolyana',
    title: 'Структура',
    code: 'Организационная блок-схема',
    category: 'medical',
    categoryLabel: 'Лицензии и стандарты',
    summary: 'Схема ведомственного подчинения: лечебные кабинеты, пищеблок, управление, отделение диагностики, хозяйственное снабжение.',
    pdfUrl: null,
    originalText: 'ОРГАНИЗАЦИОННАЯ СТРУКТУРА САНАТОРИЯ ЯСНАЯ ПОЛЯНА\n\nБлок-схема включает: Административно-управленческий аппарат, Клинико-диагностическое отделение, Отделение физиотерапии, Отделение водолечения, Службу питания, Службу эксплуатации номерного фонда.'
  },
  {
    id: 'medical-staff-list',
    title: 'Список работников медицинского отдела',
    code: 'Медицинский штат 2026',
    category: 'medical',
    categoryLabel: 'Лицензии и стандарты',
    summary: 'Официальный перечень врачебного и сестринского персонала с квалификационными категориями и датами сертификации.',
    pdfUrl: null,
    originalText: 'РЕЕСТР КВАЛИФИЦИРОВАННОГО МЕДИЦИНСКОГО ШТАТА\n\nСписок врачей-терапевтов, пульмонологов, кардиологов, медицинских физиотерапевтических сестер с указанием уровня образования, специализации и сроков действия сертификатов.'
  },
  {
    id: 'buildings-report',
    title: 'Здания Ясной Поляны на 1 июля',
    code: 'Инвентарный аудит',
    category: 'constituent',
    categoryLabel: 'Учредительные и общие',
    summary: 'Официальный реестр капитальных сооружений, лечебных корпусов и вилл санатория, находящихся в оперативном управлении ФТС.',
    pdfUrl: null,
    originalText: 'ИНВЕНТАРНАЯ КУРАТОРСКАЯ ВЕДОМОСТЬ КАПИТАЛЬНЫХ СТРОЕНИЙ\n\nПеречень зданий и сооружений ФГКУ «Санаторий «Ясная Поляна» на Южном берегу Крыма по состоянию на 1 июля. Основные корпуса, вспомогательные сооружения.'
  },
  {
    id: 'daily-schedule',
    title: 'Распорядок',
    code: 'Режим дня 2026',
    category: 'reception',
    categoryLabel: 'Лечебный режим и обращения',
    summary: 'Регламент работы клинических кабинетов, ингалятория, массажей и график дежурств врачей медицинской службы.',
    pdfUrl: null,
    originalText: 'РЕЖИМ РАБОТЫ МЕДИЦИНСКИХ КАБИНЕТОВ И САНАТОРНОГО КОРПУСА\n\nУтвержденный график отпуска физиопроцедур, работы ЛФК, грязелечебницы и дежурных медицинских постов.'
  },
  {
    id: 'modification-1',
    title: '1-изменение',
    code: 'Регламент изменений № 1',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Изменение в Положение о санаторно-курортном обеспечении в системе таможенных органов в части компенсационных выплат.',
    pdfUrl: null,
    originalText: 'УТВЕРЖДЕННЫЕ ИЗМЕНЕНИЯ В ВЕДОМСТВЕННЫЙ РЕГЛАМЕНТ ФТС (Лист Изменений № 1)\n\nРедактирование условий предоставления льгот для членов семей должностных лиц таможенных органов.'
  },
  {
    id: 'modification-3',
    title: '3-изменение',
    code: 'Регламент изменений № 3',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Правки в уставные цели учреждения касательно расширения перечня разрешенных видов медицинской реабилитации.',
    pdfUrl: null,
    originalText: 'ИЗМЕНЕНИЯ И ДОПОЛНЕНИЯ В УСТАВ УЧРЕЖДЕНИЯ (Лист Изменений № 3)\n\nВнесение дополнительных лицензируемых терапевтических услуг в структуру государственного казенного задания.'
  },
  {
    id: 'modification-4',
    title: '4-изменение',
    code: 'Регламент изменений № 4',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Официальные дополнения к регламенту дозирования процедур грязелечения и ванн в зависимости от кардиологического статуса.',
    pdfUrl: null,
    originalText: 'ИЗМЕНЕНИЯ В МЕДИЦИНСКИЙ ПРОТОКОЛ САНАТОРИЯ (Лист Изменений № 4)\n\nСпецификации контроля за противопоказаниями к синусоидальным модулированным токам (СМТ) и грязелечению.'
  },
  {
    id: 'dispensary-update',
    title: 'актуал перечень по дисп ИЗМЕНЕНИЕ',
    code: 'Мед-протокол Д',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Актуальный ведомственный перечень заболеваний для диспансерного наблюдения сотрудников таможенных органов в санатории.',
    pdfUrl: null,
    originalText: 'ОФИЦИАЛЬНОЕ ИЗМЕНЕНИЕ В СПИСОК ДИСПАНСЕРНОГО НАБЛЮДЕНИЯ\n\nКорректировка перечня терапевтических манипуляций и сроков реабилитации офицеров ФТС, находящихся под динамическим врачебным контролем.'
  },
  {
    id: 'bs-updating',
    title: 'БС изменение',
    code: 'Бюджетное соглашение ИЗМЕНЕНИЕ',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Изменение параметров финансирования и материального снабжения медицинских фондов казенного учреждения.',
    pdfUrl: null,
    originalText: 'ДОПОЛНИТЕЛЬНОЕ БЮДЖЕТНОЕ СОГЛАШЕНИЕ ФТС РОССИИ\n\nМодификация лимитов бюджетных обязательств на покупку расходных терапевтических средств на летний курортный сезон.'
  },
  {
    id: 'yasnayapolyana-modification',
    title: 'Ясная Поляна изменение',
    code: 'Уставной регламент «Ясная Поляна»',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Специальное локальное изменение в структуру штатных единиц и должностных регламентов медиков санатория Ясная Поляна.',
    pdfUrl: null,
    originalText: 'ЛОКАЛЬНЫЙ ПРИКАЗ САНАТОРИЯ «ЯСНАЯ ПОЛЯНА»\n\nКорректировка должностных инструкций дежурных медицинских сестер и графика уборки парковой курортной зоны.'
  },
  {
    id: 'pobeda-modification',
    title: 'Победа изменение',
    code: 'Ведомственное взаимодействие',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Изменение в регламент обмена отдыхающими и совместного использования лечебных баз с другими санаториями ФТС.',
    pdfUrl: null,
    originalText: 'КООРДИНАЦИОННОЕ СОГЛАШЕНИЕ ВНУТРИ ВЕДОМСТВА ФТС\n\nИзменение регламентов направления пациентов в филиалы и партнерские ведомственные клинические площадки.'
  },
  {
    id: 'cp-modification',
    title: 'ЦП изменение',
    code: 'Центральный пост ИЗМЕНЕНИЕ',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Изменение в режим охраны, контроля доступа и антитеррористического регламента центрального поста КПП санатория.',
    pdfUrl: null,
    originalText: 'ИНСТРУКЦИЯ ПО АНТИТЕРРОРИСТИЧЕСКОЙ ЗАЩИЩЕННОСТИ И ОХРАНЕ (ИЗМЕНЕНИЕ)\n\nРегламент взаимодействия службы ведомственной охраны и КПП №1 ФГКУ «Санаторий «Ясная Поляна» ФТС России».'
  }
];

export default function DocumentsPage({ onBackToHome }: { onBackToHome: () => void }) {
  const { isAdminMode, siteData, updateSection } = useAdminData();
  const documents = siteData.documents || INITIAL_DOCUMENTS;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(true);
  const [activePassportTab, setActivePassportTab] = useState<'general' | 'medical' | 'structure'>('general');

  // Admin dynamic upload state
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const saveToLocalStorage = (newDocs: DocumentItem[]) => {
    localStorage.setItem('pestovo_custom_documents', JSON.stringify(newDocs));
    updateSection('documents', newDocs);
  };

  const handleSimulatedPdfUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocId(docId);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const updated = documents.map((doc) => {
              if (doc.id === docId) {
                return {
                  ...doc,
                  pdfUrl: `/documents/${file.name}`,
                  fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                  uploadDate: new Date().toLocaleDateString('ru-RU')
                };
              }
              return doc;
            });
            saveToLocalStorage(updated);
            setUploadingDocId(null);
            setFeedbackMsg(`Файл ${file.name} успешно загружен в систему и привязан к документу.`);
            setTimeout(() => setFeedbackMsg(null), 4000);
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.code && doc.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Все документы', icon: FileText },
    { id: 'constituent', label: 'Учредительные и общие', icon: Building2 },
    { id: 'medical', label: 'Лицензии и стандарты', icon: FileCheck },
    { id: 'reception', label: 'Режим и обращения', icon: UserCheck },
    { id: 'law', label: 'Нормативно-правовые акты', icon: Shield },
    { id: 'finance', label: 'Финансовые гарантии', icon: Briefcase },
    { id: 'modifications', label: 'Регламентные изменения', icon: Clock }
  ];

  return (
    <div className="flex-1 bg-[#FAF9F6] text-[#1c2a22] font-sans">
      
      {/* Dynamic Visual Banner */}
      <div className="bg-[#022C22] text-white py-16 px-4 relative overflow-hidden border-b border-[#c5a880]/30 shadow-inner">
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none text-white font-serif uppercase tracking-widest text-[160px] leading-none select-all-disabled whitespace-nowrap">
          FEDERAL CUSTOMS
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
              <span>ФГКУ «Санаторий «Ясная Поляна» ФТС России»</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Официальный реестр документации
            </h1>
            <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
              Актуальные правовые регламенты, нормативные акты, лицензии, учредительные Уставы и образцы договоров ведомственного учреждения Федеральной таможенной службы.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-[#c5a880] text-[#022C22] hover:bg-[#FAF9F6] hover:text-[#022C22] px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transform transition-all duration-300 hover:-translate-x-1 cursor-pointer self-start md:self-auto shrink-0 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на главную</span>
          </button>
        </div>
      </div>

      {/* Alerts notification toast */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-950 border border-[#c5a880]/50 text-stone-100 text-xs sm:text-sm px-6 py-4 rounded-md shadow-2xl flex items-center space-x-3 font-semibold max-w-lg text-center"
          >
            <CheckCircle2 className="w-5 h-5 text-[#c5a880] flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main documents columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation: Categories */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-5 rounded border border-stone-200 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[#c5a880] mb-4">Разделы реестра</h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const count = cat.id === 'all' 
                    ? documents.length 
                    : documents.filter((d) => d.category === cat.id).count || documents.filter((d) => d.category === cat.id).length;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setViewingDoc(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#022C22] text-[#c5a880] border-l-4 border-[#c5a880]'
                          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-left">
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${selectedCategory === cat.id ? 'bg-[#c5a880]/20 text-[#c5a880]' : 'bg-stone-100 text-stone-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin status box */}
            {isAdminMode && (
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-sm">
                <div className="flex items-center space-x-2 text-amber-800 mb-2">
                  <Shield className="w-4.5 h-4.5" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">Панель управления PDF</span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Вы зашли в режиме <strong>Администратора санатория</strong>. Возле каждого файла доступна кнопка загрузки PDF. Выберите и загрузите любой PDF-файл для активации полноэкранного режима чтения.
                </p>
              </div>
            )}
          </div>

          {/* Right Navigation: Search & Document Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Search inputs */}
            <div className="bg-white p-4 rounded border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Быстрый поиск по названию уставного акта, закону или приказу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 pl-10 pr-4 py-3 rounded text-sm focus:outline-none focus:border-[#022C22] font-sans placeholder-stone-400"
                />
              </div>
            </div>

            {/* OFFICIAL SANATORIUM PASSPORT */}
            <div className="bg-[#022C22] text-white rounded border border-[#c5a880]/30 shadow-lg overflow-hidden transition-all duration-300">
              <div 
                onClick={() => setIsPassportOpen(!isPassportOpen)}
                className="p-5 flex justify-between items-center cursor-pointer select-none bg-gradient-to-r from-[#022C22] to-[#011F18] border-b border-[#c5a880]/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 text-[#c5a880] p-2 rounded-lg shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider text-[#c5a880] font-mono font-bold bg-[#c5a880]/15 px-2 py-0.5 rounded">ГАС карточка ФТС России</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-emerald-400">АКТУАЛИЗИРОВАНО В 2026 ГОДУ</span>
                    </div>
                    <h2 className="font-serif text-sm sm:text-base font-bold tracking-tight text-white mt-1">
                      Официальный паспорт и Гос. реквизиты учреждения
                    </h2>
                  </div>
                </div>
                <button className="text-[#c5a885] hover:text-white p-1 rounded-full hover:bg-white/10 transition-all font-mono text-2xs font-extrabold uppercase shrink-0">
                  {isPassportOpen ? 'СВЕРНУТЬ [-]' : 'РАЗВЕРНУТЬ [+]'}
                </button>
              </div>

              <AnimatePresence>
                {isPassportOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-[#FAF9F6] text-[#1c2a22]"
                  >
                    {/* Tab bars inside Passport */}
                    <div className="flex border-b border-stone-200 bg-stone-50 select-none">
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('general')}
                        className={`flex-1 py-3 text-3xs sm:text-2xs uppercase tracking-widest font-black cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'general'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-500 hover:text-stone-850 hover:bg-stone-150'
                        }`}
                      >
                        Общие данные и Руководство
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('medical')}
                        className={`flex-1 py-3 text-3xs sm:text-2xs uppercase tracking-widest font-black cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'medical'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-500 hover:text-stone-850 hover:bg-stone-150'
                        }`}
                      >
                        Специализация и Лицензия
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('structure')}
                        className={`flex-1 py-3 text-3xs sm:text-2xs uppercase tracking-widest font-black cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'structure'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-500 hover:text-stone-850 hover:bg-stone-150'
                        }`}
                      >
                        Структура и Профиль
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      {activePassportTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column: Organization registration */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c5a880] border-b pb-1">Общие реквизиты</h3>
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-stone-400 block font-mono text-[9px] uppercase">Наименование полное:</span>
                                <span className="font-semibold text-[#022C22]">Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» ФТС России»</span>
                              </div>
                              <div>
                                <span className="text-stone-400 block font-mono text-[9px] uppercase">Наименование сокращенное:</span>
                                <span className="font-semibold text-stone-700">Санаторий «Ясная Поляна» ФТС России</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-stone-400 block font-mono text-[9px] uppercase">ИНН:</span>
                                  <code className="font-bold font-mono text-stone-800">7713778678</code>
                                </div>
                                <div>
                                  <span className="text-stone-400 block font-mono text-[9px] uppercase">КПП:</span>
                                  <code className="font-bold font-mono text-stone-800">910301001</code>
                                </div>
                              </div>
                              <div>
                                <span className="text-stone-400 block font-mono text-[9px] uppercase">Организационно-правовая форма (ОПФ):</span>
                                <span className="font-medium text-stone-700">Федеральные государственные казенные учреждения</span>
                              </div>
                              <div>
                                <span className="text-stone-400 block font-mono text-[9px] uppercase">Адрес юридический, фактический и почтовый:</span>
                                <span className="font-medium text-stone-705">298660, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-stone-400 block font-mono text-[9px] uppercase">Ведомственная подчиненность:</span>
                                  <span className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded inline-block text-[11px]">Федеральная таможенная служба</span>
                                </div>
                                <div>
                                  <span className="text-stone-400 block font-mono text-[9px] uppercase">Форма собственности:</span>
                                  <span className="font-medium text-stone-700">Федеральная собственность</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Key managers & Registry dates */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#c5a880] border-b pb-1">Ответственные лица и Гос. регистрация</h3>
                            <div className="space-y-3.5 text-xs">
                              <div className="bg-stone-50 p-3 rounded border border-stone-200 space-y-1.5 shadow-xs">
                                <span className="text-[#c5a880] block font-mono text-[9px] uppercase font-bold">Руководитель:</span>
                                <div>
                                  <p className="font-extrabold text-[#022C22] text-sm font-serif">{siteData?.resortInfo?.directorName || 'Данилив Алексей Иванович'}</p>
                                  <p className="text-[10px] text-stone-500 font-mono">{siteData?.resortInfo?.directorRole || 'исполняющий обязанности начальника санатория'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200 text-[11px]">
                                  <div>
                                    <span className="text-stone-400 block text-[8px] uppercase font-mono">Телефон:</span>
                                    <a href="tel:+73654239376" className="font-bold hover:underline text-emerald-850">+7(3654)23-93-76</a>
                                  </div>
                                  <div>
                                    <span className="text-stone-400 block text-[8px] uppercase font-mono">Email приемной:</span>
                                    <a href="mailto:priemnaya.yasnayapolyana@yandex.ru" className="font-semibold hover:underline text-emerald-850 truncate block">priemnaya.yasnayapolyana@yandex.ru</a>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-stone-400 block text-[8px] uppercase font-mono">Факс:</span>
                                  <span className="font-mono text-stone-600">+73654239376</span>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-stone-400 block font-mono text-[9px] uppercase">Гос. регистрация и создание:</span>
                                <div className="text-2xs sm:text-xs text-stone-650">
                                  <p className="text-[#022C22] font-semibold">Федеральная налоговая служба РФ</p>
                                  <p className="text-stone-500 text-[11px]">Межрайонная инспекция ФНС №46 по г. Москве</p>
                                  <p className="font-mono text-[11px] text-[#022C22] mt-0.5">
                                    Серия: <span className="font-bold">77</span> | Номер: <span className="font-bold">015463944</span> | Дата: <span className="font-bold">2013-10-29</span>
                                  </p>
                                  <p className="text-stone-406 font-mono text-[10px]">Дата создания: 2013-10-29 (ЕГРЮЛ: 5137746004787)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePassportTab === 'medical' && (
                        <div className="space-y-4">
                          <div className="bg-stone-50 p-4 rounded border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Shield className="w-4.5 h-4.5 text-emerald-700" />
                                <span className="font-mono font-bold text-[#022C22] text-xs">ГОСУДАРСТВЕННАЯ МЕДИЦИНСКАЯ ЛИЦЕНЗИЯ</span>
                              </div>
                              <h4 className="font-serif text-sm font-black text-[#022C22] mt-1">Рег. № Л041-00110-91/00554225</h4>
                              <p className="text-[10px] text-stone-400 font-mono">Дата выдачи и начала действия: 2022-06-22 • Бессрочная</p>
                            </div>
                            <span className="text-emerald-800 bg-emerald-100/60 font-mono font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded inline-block border border-emerald-250">
                              Лицензированный статус
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-3">
                              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c5a880] border-b pb-1">Виды лицензированной деятельности</h5>
                              <ul className="space-y-1.5 text-xs text-stone-700">
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Диетология</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Лечебная физкультура (ЛФК)</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Медицинский массаж</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Организация здравоохранения и общественного здоровья</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Сестринское дело</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Терапия и восстановительное лечение</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Физиотерапия</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Функциональная диагностика</span>
                                </li>
                              </ul>
                              
                              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c5a880] border-b pb-1 pt-2">Методы диагностики</h5>
                              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                                <strong>Функциональная диагностика:</strong> Спирография (спирометрия); Электрокардиография.
                              </p>
                              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                                <strong>Лабораторная база:</strong> Биохимические исследования; Общеклинические исследования.
                              </p>
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c5a880] border-b pb-1">Методы лечения и бальнеотерапии</h5>
                              <div className="p-1 max-h-[250px] overflow-y-auto space-y-2 text-xs text-stone-650 scrollbar-thin">
                                <p className="leading-relaxed">• Методы электромагнитного лечебного воздействия на органы и ткани;</p>
                                <p className="leading-relaxed">• Электрофорез лекарственных средств по органам и системам;</p>
                                <p className="leading-relaxed">• Воздействие электрическим полем УВЧ (э.п. УВЧ);</p>
                                <p className="leading-relaxed">• Воздействие магнитными полями (магнитотерапия);</p>
                                <p className="leading-relaxed">• Воздействие синусоидальными модулярными токами (СМТ);</p>
                                <p className="leading-relaxed">• Лечение с помощью лучевого (звукового, светового, лазерного) воздействия;</p>
                                <p className="leading-relaxed">• Воздействие низкоинтенсивным лазерным излучением;</p>
                                <p className="leading-relaxed">• Воздействие ультразвуком;</p>
                                <p className="leading-relaxed">• Воздействие инфракрасным излучением;</p>
                                <p className="leading-relaxed">• Лечебная физкультура;</p>
                                <p className="leading-relaxed">• Лечение климатическими и природными факторами;</p>
                                <p className="leading-relaxed">• Террентное лечение (лечение ходьбой);</p>
                                <p className="leading-relaxed">• Подводный душ массаж;</p>
                                <p className="leading-relaxed">• Воздействие климатом;</p>
                                <p className="leading-relaxed">• Ванны ароматические;</p>
                                <p className="leading-relaxed">• Медицинский массаж при различных заболеваниях;</p>
                                <p className="leading-relaxed">• Ингаляторные введения лекарственных средств и кислорода.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePassportTab === 'structure' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left column: medical profiles */}
                          <div className="space-y-3">
                            <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c5a880] border-b pb-1">Профиль и Нозологическая классификация</h5>
                            <div className="space-y-2 text-xs text-stone-750">
                              <p className="font-semibold text-[#022C22]">Основные заболевания лечебного профиля:</p>
                              
                              <div className="space-y-2.5 pl-2 border-l-2 border-[#c5a880] text-stone-650">
                                <div>
                                  <strong className="text-stone-850">Болезни системы кровообращения:</strong>
                                  <p className="text-[11px] leading-relaxed">Болезни, характеризующиеся повышенным кровяным давлением; Гипертензивная болезнь сердца; Гипертензивная болезнь с преимущественным поражением сердца с застойной сердечной недостаточностью.</p>
                                </div>
                                <div className="pt-1">
                                  <strong className="text-stone-850">Болезни органов дыхания:</strong>
                                  <p className="text-[11px] leading-relaxed">Хронические болезни нижних дыхательных путей; Хронический бронхит неуточненный.</p>
                                </div>
                                <div className="pt-1">
                                  <strong className="text-stone-850">Болезни костно-мышечной системы:</strong>
                                  <p className="text-[11px] leading-relaxed">Артрозы; Коксартроз [артроз тазобедренного сустава] (первичный двусторонний, другой первичный, неуточненный); Гонартроз [артроз коленного сустава] (первичный двусторонний, неуточненный); Первичный артроз других суставов; Артроз неуточненный.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right column: internal medical structure */}
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c5a880] border-b pb-1">Структурные лечебные кабинеты</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 text-stone-750">
                                <span className="bg-stone-100 p-2 rounded text-[11px] font-medium border border-stone-200">Изолятор</span>
                                <span className="bg-stone-100 p-2 rounded text-[11px] font-medium border border-stone-200">Клинико-диагностическая лаборатория</span>
                                <span className="bg-stone-101 p-2 rounded text-[11px] font-medium border border-stone-200">Кабинет среднего персонала</span>
                                <span className="bg-stone-101 p-2 rounded text-[11px] font-medium border border-stone-200">Кабинет функциональной диагностики</span>
                                <span className="bg-stone-101 p-2 rounded text-[11px] font-medium border border-stone-200">Отделение (кабинет) физиотерапии</span>
                                <span className="bg-stone-101 p-2 rounded text-[11px] font-medium border border-stone-200">Отделение (кабинет) водолечения</span>
                                <span className="bg-stone-101 p-2 rounded text-[11px] font-medium border border-stone-200">Зал (кабинет) ЛФК</span>
                                <span className="bg-stone-101 p-2 rounded text-[11px] font-medium border border-stone-200">Кабинет массажа с комнатой для персонала</span>
                              </div>
                              <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase text-right">Вспомогательные лечебные помещения</p>
                            </div>

                            <div className="space-y-1 bg-emerald-50 p-2.5 rounded border border-emerald-100 text-xs">
                              <strong className="text-emerald-950 font-sans block text-[11px]">Круглогодичный график функционирования:</strong>
                              <p className="text-emerald-900 leading-relaxed text-[11px]">
                                Санаторий полностью работоспособен круглый год: Январь, Февраль, Март, Апрель, Май, Июнь, Июль, Август, Сентябрь, Октябрь, Ноябрь, Декабрь.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Split screen reader view OR the grid directory */}
            <AnimatePresence mode="wait">
              {viewingDoc ? (
                
                // IMMERSIVE PDF / DOCUMENT READER SIMULATION VIEW
                <motion.div
                  key="reader-pane"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded border border-stone-200 shadow-md overflow-hidden flex flex-col h-[75vh]"
                >
                  <div className="bg-stone-100 p-4 border-b border-stone-200 shrink-0 flex flex-wrap gap-4 items-center justify-between">
                    <button
                      onClick={() => setViewingDoc(null)}
                      className="flex items-center space-x-1.5 text-stone-600 hover:text-[#022C22] text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Назад к перечню актов</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-stone-400 font-bold bg-white px-2.5 py-1 rounded border border-stone-200/50">
                        {viewingDoc.code || 'Официальный регламент'}
                      </span>
                      {viewingDoc.pdfUrl && (
                        <a
                          href={viewingDoc.pdfUrl}
                          download
                          className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide flex items-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Скачать PDF</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Built-in high-fidelity styled document sheet */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-stone-100/40">
                    <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-stone-250/80 shadow-lg rounded-sm font-sans text-stone-850 relative">
                      
                      {/* Technical seal decoration */}
                      <div className="absolute right-12 top-12 opacity-[0.05] pointer-events-none select-none">
                        <Shield className="w-40 h-40 text-[#022C22]" />
                      </div>

                      <div className="text-center border-b border-stone-200 pb-6 mb-8 text-stone-500 font-mono text-xs uppercase tracking-widest font-bold">
                        <p>Федеральная таможенная служба России</p>
                        <p className="text-[10px] text-stone-400 mt-1">ФГКУ «Санаторий «Ясная Поляна» ФТС России»</p>
                      </div>

                      <div className="flex justify-between items-start mb-6 text-xs text-stone-400 font-mono">
                        <div>
                          <span>Медицинский реестр</span>
                          <p className="font-semibold text-stone-800 mt-0.5">Дата заведения: {viewingDoc.uploadDate || '29.10.2013'}</p>
                        </div>
                        <div className="text-right">
                          <span>Код лицензиата</span>
                          <p className="font-semibold text-stone-800 mt-0.5">{viewingDoc.code || 'Л041-00110-91'}</p>
                        </div>
                      </div>

                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#022C22] border-b pb-4 mb-6 leading-snug">
                        {viewingDoc.title}
                      </h2>

                      {/* Doc textual rendering or fallback */}
                      <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans whitespace-pre-wrap">
                        {viewingDoc.originalText || `ДАННЫЕ ДОКУМЕНТА НА СТЕКЕ PDF ЗАГРУЗКИ\n\nЭтот правовой документ (${viewingDoc.title}) в данный момент зарегистрирован в государственном архиве ФГКУ «Санаторий «Ясная Поляна».\n\nКоллегия ветеринарных врачей, кардиологов и правовых инспекторов санатория подтверждает соответствие данного положения всем текущим нормативным законам РФ.\n\nДля ознакомления вы можете прочитать оригинальный PDF-файл, загруженный в систему.`}
                      </div>

                      {/* Official Signature simulation at bottom */}
                      <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-4">
                        <div>
                          <span className="block text-stone-400 uppercase tracking-widest font-mono text-[9px]">Статус правообладания</span>
                          <p className="font-bold text-[#022C22] mt-0.5">Лицензионный архив санатория</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-stone-50 px-4 py-2 rounded border border-stone-200">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <div className="text-[10px] font-mono leading-tight">
                            <span className="block font-bold text-emerald-800 font-semibold font-sans">ГОСУДАРСТВЕННЫЙ КОНТРОЛЬ</span>
                            <span className="text-stone-405 block font-serif">Данилив А. И. (и.о. Начальника)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 flex justify-between items-center text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                    <span>Режим просмотра регламентов ФТС России</span>
                    <span className="text-emerald-700 font-bold">Санаторий Ясная Поляна</span>
                  </div>
                </motion.div>

              ) : (

                // MAIN LIST OF DOCUMENT TILES
                <motion.div
                  key="list-pane"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc, idx) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="bg-white rounded border border-stone-200 p-5 sm:p-6 hover:shadow-md hover:border-[#c5a880]/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
                      >
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#c5a880] bg-[#022C22]/5 px-2.5 py-0.5 rounded-full font-mono">
                              {doc.categoryLabel}
                            </span>
                            {doc.code && (
                              <span className="text-stone-400 text-xs font-semibold font-mono">
                                • {doc.code}
                              </span>
                            )}
                            {doc.pdfUrl ? (
                              <span className="text-emerald-700 text-[10px] font-mono font-bold flex items-center space-x-1 border border-emerald-200/50 bg-emerald-50 px-2 py-0.5 rounded">
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>PDF ДОСТУПЕН</span>
                              </span>
                            ) : (
                              <span className="text-stone-500 text-[10px] font-mono font-bold flex items-center space-x-1 border border-stone-200 bg-stone-100 px-2 py-0.5 rounded">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>БЕЗ ФАЙЛА PDF</span>
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-sm sm:text-base font-extrabold text-[#022C22] tracking-tight hover:text-[#c5a880] transition-colors leading-snug">
                            {doc.title}
                          </h3>

                          <p className="text-xs text-stone-500 leading-relaxed font-sans mt-1">
                            {doc.summary}
                          </p>

                          {doc.pdfUrl && doc.fileSize && (
                            <div className="flex items-center space-x-3 text-[10px] text-stone-400 font-mono mt-2">
                              <span>Размер: {doc.fileSize}</span>
                              <span>•</span>
                              <span>Обновлен: {doc.uploadDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Interactive actions block */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-stone-100">
                          
                          <button
                            onClick={() => setViewingDoc(doc)}
                            className="bg-[#022C22] hover:bg-[#c5a880] text-stone-100 hover:text-[#022C22] px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer flex-1 md:flex-initial justify-center"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Читать</span>
                          </button>

                          {doc.pdfUrl ? (
                            <a
                              href={doc.pdfUrl}
                              download
                              className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer border border-stone-250 flex-1 md:flex-initial justify-center"
                              title="Альтернативная загрузка"
                            >
                              <Download className="w-3.5 h-3.5 text-stone-500" />
                              <span>PDF</span>
                            </a>
                          ) : (
                            isAdminMode ? (
                              <div className="flex-1 md:flex-initial">
                                <label className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer justify-center">
                                  {uploadingDocId === doc.id ? (
                                    <>
                                      <span className="w-3 h-3 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                                      <span>{uploadProgress}%</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Загрузить</span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleSimulatedPdfUpload(doc.id, e)}
                                    disabled={uploadingDocId !== null}
                                  />
                                </label>
                              </div>
                            ) : (
                              <div className="text-zinc-400 text-[11px] font-mono text-center md:text-right px-2">
                                Ожидает PDF
                              </div>
                            )
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded border border-stone-250">
                      <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500 text-sm font-semibold">Акты или федеральные законы не найдены.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                        className="mt-3 text-xs text-[#022C22] hover:text-[#c5a880] font-bold uppercase"
                      >
                        Сбросить фильтры поиска
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </div>
  );
}
