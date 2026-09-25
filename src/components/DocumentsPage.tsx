import React, { useState, useEffect } from 'react';
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
  Plus,
  Globe
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { DocumentItem } from '../types';
import { calculateStorageSize } from '../lib/storage';
import PdfViewer from './PdfViewer';
import { getDocumentPdfUrl } from '../utils/pdfGenerator';

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
    title: 'Политика в отношении обработки и защиты персональных данных',
    code: 'ФЗ-152 / Регламент ФТС России',
    category: 'modifications',
    categoryLabel: 'Нормативы и изменения',
    summary: 'Официальное ведомственное положение о порядке сбора, обработки, локализации и защиты персональных данных и врачебной тайны отдыхающих и сотрудников в соответствии с Федеральными законами № 152-ФЗ и № 323-ФЗ.',
    pdfUrl: null,
    originalText: `ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ КАЗЕННОЕ УЧРЕЖДЕНИЕ «САНАТОРИЙ «ЯСНАЯ ПОЛЯНА» ФЕДЕРАЛЬНОЙ ТАМОЖЕННОЙ СЛУЖБЫ»
(ФГКУ «Санаторий «Ясная Поляна» ФТС России»)

ПОЛИТИКА В ОТНОШЕНИИ ОБРАБОТКИ И ЗАЩИТЫ ПЕРСОНАЛЬНЫХ ДАННЫХ

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Настоящая Политика определяет порядок обработки и защиты персональных данных в ФГКУ «Санаторий «Ясная Поляна» ФТС России» (ИНН 7713778678, КПП 910301001, ОГРН 1147746900407, Лицензия Минздрава РФ № Л041-00110-91/00554225).
1.2. Документ разработан на основании Конституции РФ, Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», Федерального закона от 21.11.2011 № 323-ФЗ «Об основах охраны здоровья граждан в РФ», законодательства РФ о государственной тайне и защите информации.

2. ПРАВОВЫЕ ОСНОВАНИЯ И ЦЕЛИ ОБРАБОТКИ
2.1. Обработка персональных данных осуществляется в целях:
- обеспечения санаторно-курортного лечения, оздоровления и реабилитации сотрудников, пенсионеров ФТС России, членов их семей и иных граждан;
- оказания медицинских и диагностических услуг;
- обработки обращений граждан и бронирования путевок;
- обеспечения пропускного и внутриобъектового режима на закрытой территории учреждения;
- исполнения требований миграционного и регистрационного учета граждан.

3. ПРИНЦИПЫ И ПОРЯДОК ОБРАБОТКИ
3.1. Сбор, систематизация, накопление и хранение персональных данных граждан РФ осуществляются исключительно с использованием баз данных, находящихся на территории Российской Федерации (ч. 5 ст. 18 152-ФЗ).
3.2. Трансграничная передача персональных данных не осуществляется.
3.3. Медицинские сведения (диагнозы, анамнез, назначенные процедуры) составляют охраняемую законом врачебную тайну (ст. 13 323-ФЗ) и обрабатываются уполномоченным медицинским персоналом со строгим соблюдением конфиденциальности.

4. МЕРЫ ПО ЗАЩИТЕ И ПРАВА СУБЪЕКТОВ
4.1. В Учреждении внедрен сертифицированный комплекс организационно-технических мер защиты ИСПДн в соответствии с требованиями ФСТЭК России и ФСБ России.
4.2. Субъект персональных данных имеет право на получение сведений об обработке его данных, уточнение, блокирование или уничтожение неправомерно полученных сведений, а также на отзыв согласия путем направления официального заявления на адрес: 298660, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52, либо на email: sanatoriy@ya-polyana.ru.`
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
  const { isAdminMode, siteData, updateSection, downloadSiteDataJson, saveToServer } = useAdminData();
  const documents = siteData.documents || INITIAL_DOCUMENTS;

  const customPdfsCount = documents.filter(d => d.pdfUrl && d.pdfUrl.startsWith('data:')).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [activePassportTab, setActivePassportTab] = useState<'general' | 'medical' | 'structure'>('general');

  // Admin dynamic upload state
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Lock body scroll when viewing document in fullscreen reader
  useEffect(() => {
    if (viewingDoc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewingDoc]);

  const saveToLocalStorage = (newDocs: DocumentItem[]) => {
    try {
      localStorage.setItem('pestovo_custom_documents', JSON.stringify(newDocs));
    } catch {}
    updateSection('documents', newDocs);
  };

  const handleDownloadPdf = async (doc: DocumentItem) => {
    try {
      const url = await getDocumentPdfUrl(doc);
      const a = document.createElement('a');
      a.href = url;
      const cleanTitle = (doc.title || 'document').replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_').slice(0, 50);
      a.download = `${cleanTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handleSimulatedPdfUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Пожалуйста, выберите файл в формате PDF (.pdf)');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('Размер файла превышает 25 МБ. Для быстрого сохранения и экспорта в site-data.json рекомендуется использовать документы размером до 25 МБ.');
      return;
    }

    setUploadingDocId(docId);
    setUploadProgress(25);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadProgress(100);
      setTimeout(() => {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        const sizeKb = (file.size / 1024).toFixed(0);
        const formattedSize = file.size >= 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

        const updated = documents.map((doc) => {
          if (doc.id === docId) {
            return {
              ...doc,
              pdfUrl: dataUrl,
              fileSize: formattedSize,
              uploadDate: new Date().toLocaleDateString('ru-RU')
            };
          }
          return doc;
        });
        saveToLocalStorage(updated);
        setUploadingDocId(null);
        setFeedbackMsg(`✓ PDF «${file.name}» (${formattedSize}) успешно сохранен в базу и включен в структуру site-data.json!`);
        setTimeout(() => setFeedbackMsg(null), 5000);
      }, 300);
    };

    reader.onerror = () => {
      setUploadingDocId(null);
      setFeedbackMsg('Ошибка при чтении PDF файла.');
    };

    reader.readAsDataURL(file);
  };

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
      return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      doc.title.toLowerCase().includes(q) || 
      (doc.code && doc.code.toLowerCase().includes(q)) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.categoryLabel.toLowerCase().includes(q)
    );
  });

  // Format document titles into modern, beautiful, highly readable Title Case
  const formatDocTitle = (title: string): string => {
    if (!title) return '';
    const letters = title.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
    const hasLower = /[a-zа-яё]/.test(title);
    
    // Only reformat if it's all uppercase or predominantly uppercase
    if (!hasLower && letters.length > 5) {
      const acronyms: Record<string, string> = {
        'ФТС': 'ФТС',
        'РФ': 'РФ',
        'ЕГРЮЛ': 'ЕГРЮЛ',
        'ГОСТ': 'ГОСТ',
        'ОГРН': 'ОГРН',
        'ИНН': 'ИНН',
        'КПП': 'КПП',
        'СНИЛС': 'СНИЛС',
        'МЗ': 'МЗ',
        'ОМС': 'ОМС',
        'ДМС': 'ДМС',
        'ЛФК': 'ЛФК',
        'УФК': 'УФК',
        'ЭКГ': 'ЭКГ',
        'ФВД': 'ФВД',
        'ЖНВЛП': 'ЖНВЛП',
        'УВЧ': 'УВЧ',
        'СМТ': 'СМТ',
        'PDF': 'PDF',
        'РОССИИ': 'России',
        'РОССИЯ': 'Россия',
        'РОССИЙСКОЙ': 'Российской',
        'ФЕДЕРАЦИИ': 'Федерации',
        'ФЕДЕРАЛЬНОЙ': 'Федеральной',
        'ФЕДЕРАЛЬНОГО': 'Федерального',
        'ФЕДЕРАЛЬНОЕ': 'Федеральное',
        'КАЗЕННОЕ': 'Казенное',
        'ГОСУДАРСТВЕННОЕ': 'Государственное',
        'УЧРЕЖДЕНИЕ': 'Учреждение',
        'САНАТОРИЙ': 'Санаторий',
        'ЯСНАЯ': 'Ясная',
        'ПОЛЯНА': 'Поляна',
        'КРЫМ': 'Крым',
        'ЯЛТА': 'Ялта',
        'ГАСПРА': 'Гаспра',
        'МИНЗДРАВА': 'Минздрава',
        'МИНЗДРАВ': 'Минздрав',
        'ТАМОЖЕННОЙ': 'Таможенной',
        'СЛУЖБЫ': 'Службы',
        'ТУРИЗМУ': 'Туризму',
        'ТУРИСТСКОЙ': 'Туристской',
        'ЕДИНОГО': 'Единого',
        'РЕЕСТРА': 'Реестра'
      };

      const words = title.split(' ');
      return words.map((word, index) => {
        const prefixMatch = word.match(/^([^a-zA-Zа-яА-ЯёЁ0-9]*)(.*)$/);
        const prefix = prefixMatch ? prefixMatch[1] : '';
        const rest = prefixMatch ? prefixMatch[2] : word;
        
        const suffixMatch = rest.match(/^(.*?)([^a-zA-Zа-яА-ЯёЁ0-9]*)$/);
        const coreWord = suffixMatch ? suffixMatch[1] : rest;
        const suffix = suffixMatch ? suffixMatch[2] : '';

        const upperCore = coreWord.toUpperCase();
        if (acronyms[upperCore]) {
          return prefix + acronyms[upperCore] + suffix;
        }

        const lower = coreWord.toLowerCase();
        if (index === 0 || prefix.includes('«') || prefix.includes('"')) {
          return prefix + (lower.charAt(0).toUpperCase() + lower.slice(1)) + suffix;
        }
        return prefix + lower + suffix;
      }).join(' ');
    }
    return title;
  };

  return (
    <div className="flex-1 bg-[#FAF9F6] text-[#1c2a22] font-sans">
      
      {/* Dynamic Visual Banner */}
      <div className="bg-[#022C22] text-white py-14 px-4 relative overflow-hidden border-b border-[#c5a880]/30 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-sans uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
              <span>ФГКУ «Санаторий «Ясная Поляна» ФТС России»</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Официальный реестр документации
            </h1>
            <p className="text-stone-200 text-sm max-w-2xl leading-relaxed">
              Актуальные правовые регламенты, нормативные акты, лицензии, учредительные Уставы и образцы договоров ведомственного учреждения Федеральной таможенной службы.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 bg-[#c5a880] text-[#022C22] hover:bg-[#FAF9F6] hover:text-[#022C22] px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transform transition-all duration-300 hover:-translate-x-1 cursor-pointer self-start md:self-auto shrink-0 shadow-md font-sans"
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

      {/* Main documents container - all documents on one page */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Admin status box */}
        {isAdminMode && (
          <div className="bg-amber-50 border border-amber-250 p-4 sm:p-5 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3 text-amber-900">
              <Shield className="w-6 h-6 text-amber-750 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-mono uppercase tracking-wider font-bold text-xs block">
                  Панель управления PDF документами (Администратор)
                </span>
                <p className="text-amber-800 text-xs mt-0.5">
                  Загруженные PDF документы автоматически сохраняются в базу и файл <code className="bg-amber-100/80 font-bold px-1 py-0.5 rounded font-mono text-[11px]">site-data.json</code> для переноса на хостинг.
                </p>
                {customPdfsCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold text-xs mt-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    <Check className="w-3 h-3 text-emerald-600" />
                    В базе сохранено PDF файлов пользователя: {customPdfsCount} шт.
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  downloadSiteDataJson();
                  setFeedbackMsg('Файл site-data.json с вашими PDF сформирован и скачан на компьютер!');
                  setTimeout(() => setFeedbackMsg(null), 5000);
                }}
                className="bg-[#022C22] hover:bg-[#c5a880] text-[#FAF9F6] hover:text-[#022C22] text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer flex-1 md:flex-initial"
                title="Скачать файл site-data.json со всеми вашими PDF для загрузки на хостинг"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Скачать site-data.json ({calculateStorageSize(siteData).formatted})</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await saveToServer();
                    setFeedbackMsg(res.message);
                    setTimeout(() => setFeedbackMsg(null), 5000);
                  } catch (err: any) {
                    alert(`Сохранение на сервер: ${err.message || 'Сервер PHP недоступен. Скачайте site-data.json и загрузите его на хостинг вручную.'}`);
                  }
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer flex-1 md:flex-initial"
                title="Мгновенно обновить файл site-data.json на сервере через PHP"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Сохранить на сервере</span>
              </button>
            </div>
          </div>
        )}

        {/* Search input & Total document counter */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Быстрый поиск по названию документа, номеру приказа, коду или ключевым словам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#022C22] font-sans placeholder:text-stone-400 text-stone-850 transition-colors"
            />
          </div>
          <div className="shrink-0 text-xs sm:text-sm font-sans font-bold text-stone-700 bg-stone-100 px-5 py-3 rounded-xl border border-stone-200 flex items-center gap-2.5">
            <span>Всего документов:</span>
            <span className="bg-[#022C22] text-[#c5a880] px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs sm:text-sm tabular-nums">
              {filteredDocs.length}
            </span>
          </div>
        </div>

        {/* Categories filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {[
            { id: 'all', label: 'Все документы' },
            { id: 'constituent', label: 'Учредительные и общие' },
            { id: 'medical', label: 'Лицензии и стандарты' },
            { id: 'law', label: 'Законы и правовые акты' },
            { id: 'reception', label: 'Лечебный режим и обращения' },
            { id: 'finance', label: 'Финансовые и классификация' },
            { id: 'modifications', label: 'Нормативы и изменения' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#022C22] text-[#c5a880] border-[#022C22] shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

            {/* OFFICIAL SANATORIUM PASSPORT */}
            <div className="bg-[#022C22] text-white rounded-2xl border border-[#c5a880]/30 shadow-lg overflow-hidden transition-all duration-300">
              <div 
                onClick={() => setIsPassportOpen(!isPassportOpen)}
                className="p-5 sm:p-6 flex justify-between items-center cursor-pointer select-none bg-gradient-to-r from-[#022C22] to-[#011F18] border-b border-[#c5a880]/20"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="bg-white/10 text-[#c5a880] p-2.5 rounded-xl shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      <span className="text-xs uppercase tracking-wider text-[#c5a880] font-sans font-semibold bg-[#c5a880]/15 px-2.5 py-0.5 rounded-md">ГАС карточка ФТС России</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-emerald-300">АКТУАЛИЗИРОВАНО В 2026 ГОДУ</span>
                    </div>
                    <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-white mt-1">
                      Официальный паспорт и Государственные реквизиты учреждения
                    </h2>
                  </div>
                </div>
                <button className="text-[#c5a885] hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all font-sans text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer">
                  {isPassportOpen ? 'Свернуть [-]' : 'Развернуть [+]'}
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
                    <div className="flex border-b border-stone-200 bg-stone-100 select-none">
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('general')}
                        className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-sans font-bold cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'general'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-600 hover:text-[#022C22] hover:bg-stone-200/60'
                        }`}
                      >
                        Общие данные и Руководство
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('medical')}
                        className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-sans font-bold cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'medical'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-600 hover:text-[#022C22] hover:bg-stone-200/60'
                        }`}
                      >
                        Специализация и Лицензия
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePassportTab('structure')}
                        className={`flex-1 py-3.5 px-3 text-xs sm:text-sm font-sans font-bold cursor-pointer border-b-2 transition-all ${
                          activePassportTab === 'structure'
                            ? 'border-[#022C22] text-[#022C22] bg-[#FAF9F6]'
                            : 'border-transparent text-stone-600 hover:text-[#022C22] hover:bg-stone-200/60'
                        }`}
                      >
                        Структура и Профиль
                      </button>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6 font-sans">
                      {activePassportTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Column: Organization registration */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Общие реквизиты</h3>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Наименование полное:</span>
                                <span className="font-bold text-[#022C22] block mt-0.5 text-sm sm:text-base leading-snug">Федеральное государственное казенное учреждение «Санаторий «Ясная Поляна» Федеральной таможенной службы»</span>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Наименование сокращенное:</span>
                                <span className="font-semibold text-stone-800 block mt-0.5">ФГКУ «Санаторий «Ясная Поляна» ФТС России»</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-stone-200">
                                <div>
                                  <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">ИНН:</span>
                                  <code className="font-bold font-mono text-base text-[#022C22] tabular-nums">7713778678</code>
                                </div>
                                <div>
                                  <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">КПП:</span>
                                  <code className="font-bold font-mono text-base text-[#022C22] tabular-nums">910301001</code>
                                </div>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Организационно-правовая форма (ОПФ):</span>
                                <span className="font-medium text-stone-800 block mt-0.5">Федеральные государственные казенные учреждения</span>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-xs font-semibold uppercase tracking-wider">Адрес юридический, фактический и почтовый:</span>
                                <span className="font-medium text-stone-800 block mt-0.5">298660, Республика Крым, г. Ялта, пгт. Гаспра, Севастопольское шоссе, д. 52</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                                  <span className="text-emerald-900 block text-xs font-bold uppercase tracking-wider">Ведомственная подчиненность:</span>
                                  <span className="font-bold text-[#022C22] text-sm block mt-0.5">Федеральная таможенная служба</span>
                                </div>
                                <div className="bg-stone-100 p-3 rounded-xl border border-stone-200">
                                  <span className="text-stone-600 block text-xs font-semibold uppercase tracking-wider">Форма собственности:</span>
                                  <span className="font-bold text-stone-800 text-sm block mt-0.5">Федеральная собственность</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Key managers & Registry dates */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Ответственные лица и Гос. регистрация</h3>
                            <div className="space-y-4 text-sm">
                              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5 shadow-xs">
                                <span className="text-[#9b7b51] block text-xs font-bold uppercase tracking-wider">Руководитель:</span>
                                <div>
                                  <p className="font-bold text-[#022C22] text-base sm:text-lg font-sans">{siteData?.resortInfo?.directorName || 'Данилив Алексей Иванович'}</p>
                                  <p className="text-xs text-stone-600 font-medium mt-0.5">{siteData?.resortInfo?.directorRole || 'исполняющий обязанности начальника санатория'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100 text-xs">
                                  <div>
                                    <span className="text-stone-500 block uppercase font-semibold">Телефон приемной:</span>
                                    <a href="tel:+73654239376" className="font-bold hover:underline text-[#022C22] font-mono tabular-nums text-sm block mt-0.5">+7(3654)23-93-76</a>
                                  </div>
                                  <div>
                                    <span className="text-stone-500 block uppercase font-semibold">Email:</span>
                                    <a href="mailto:sanatoriy@ya-polyana.ru" className="font-semibold hover:underline text-[#022C22] font-mono truncate block mt-0.5">sanatoriy@ya-polyana.ru</a>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                                <span className="text-stone-500 block text-xs font-bold uppercase tracking-wider">Государственная регистрация:</span>
                                <p className="text-[#022C22] font-bold text-sm">Федеральная налоговая служба Российской Федерации</p>
                                <p className="text-stone-600">Межрайонная инспекция ФНС №46 по г. Москве</p>
                                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 font-mono tabular-nums text-xs text-[#022C22] space-y-0.5">
                                  <div>ОГРН: <strong className="font-bold">5137746004787</strong></div>
                                  <div>Свидетельство: серия <strong className="font-bold">77</strong> № <strong className="font-bold">015463944</strong> от 29.10.2013</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePassportTab === 'medical' && (
                        <div className="space-y-6">
                          <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-emerald-700" />
                                <span className="font-sans font-bold text-[#022C22] text-xs uppercase tracking-wider">Государственная медицинская лицензия</span>
                              </div>
                              <h4 className="font-sans text-base sm:text-lg font-bold text-[#022C22] mt-1 font-mono tabular-nums">№ Л041-00110-91/00554225</h4>
                              <p className="text-xs text-stone-600 font-sans mt-0.5">Дата выдачи: 22.06.2022 • Срок действия: Бессрочно</p>
                            </div>
                            <span className="text-emerald-800 bg-emerald-50 font-sans font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-lg inline-block border border-emerald-200">
                              Лицензированный статус
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                            <div className="space-y-4">
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Виды лицензированной деятельности</h5>
                              <ul className="space-y-2 text-sm text-stone-800">
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Диетология</span>
                                </li>
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Лечебная физкультура (ЛФК)</span>
                                </li>
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Медицинский массаж</span>
                                </li>
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Организация здравоохранения и общественного здоровья</span>
                                </li>
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Сестринское дело</span>
                                </li>
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Терапия и восстановительное лечение</span>
                                </li>
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Физиотерапия</span>
                                </li>
                                <li className="flex items-center space-x-2.5">
                                  <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  <span>Функциональная диагностика</span>
                                </li>
                              </ul>
                              
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2 pt-2">Методы диагностики</h5>
                              <p className="text-sm text-stone-800 font-sans leading-relaxed">
                                <strong className="text-[#022C22]">Функциональная диагностика:</strong> Спирография (исследование функции внешнего дыхания); Электрокардиография (ЭКГ).
                              </p>
                              <p className="text-sm text-stone-800 font-sans leading-relaxed">
                                <strong className="text-[#022C22]">Лабораторная база:</strong> Биохимические и общеклинические исследования крови и мочи.
                              </p>
                            </div>

                            <div className="space-y-4">
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Методы лечения и бальнеотерапии</h5>
                              <div className="p-3 bg-white rounded-xl border border-stone-200 max-h-[340px] overflow-y-auto space-y-2.5 text-sm text-stone-800 scrollbar-thin">
                                <p className="leading-relaxed">• Методы электромагнитного лечебного воздействия на органы и ткани;</p>
                                <p className="leading-relaxed">• Электрофорез лекарственных средств по органам и системам;</p>
                                <p className="leading-relaxed">• Воздействие электрическим полем УВЧ (э.п. УВЧ);</p>
                                <p className="leading-relaxed">• Воздействие импульсными магнитными полями (магнитотерапия);</p>
                                <p className="leading-relaxed">• Воздействие синусоидальными модулярными токами (СМТ-терапия);</p>
                                <p className="leading-relaxed">• Лечение с помощью светового, звукового и лазерного воздействия;</p>
                                <p className="leading-relaxed">• Воздействие низкоинтенсивным лазерным излучением;</p>
                                <p className="leading-relaxed">• Ультразвуковая терапия и фонофорез;</p>
                                <p className="leading-relaxed">• Глубокий тепловой прогрев инфракрасным излучением;</p>
                                <p className="leading-relaxed">• Занятия кинезотерапией и лечебной физкультурой (ЛФК);</p>
                                <p className="leading-relaxed">• Лечение природными климатическими факторами;</p>
                                <p className="leading-relaxed">• Терренкур (дозированная лечебная ходьба по хвойному парку);</p>
                                <p className="leading-relaxed">• Подводный душ-массаж струей высокого давления;</p>
                                <p className="leading-relaxed">• Ароматические ванны (хвойные, солевые, шалфейные);</p>
                                <p className="leading-relaxed">• Ручной медицинский массаж при профильных заболеваниях;</p>
                                <p className="leading-relaxed">• Ингаляционная небулайзерная терапия с фитосборами и кислородом.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activePassportTab === 'structure' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left column: medical profiles */}
                          <div className="space-y-4">
                            <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Лечебный профиль и патологии</h5>
                            <div className="space-y-3 text-sm text-stone-800">
                              <p className="font-bold text-[#022C22] text-base">Ключевые нозологические группы:</p>
                              
                              <div className="space-y-3.5 pl-3 border-l-2 border-[#c5a880] text-stone-700">
                                <div className="bg-white p-3 rounded-xl border border-stone-200">
                                  <strong className="text-[#022C22] block text-sm font-bold">1. Болезни системы кровообращения:</strong>
                                  <p className="text-xs sm:text-sm leading-relaxed mt-1">Гипертоническая болезнь сердца, ишемическая болезнь сердца без тяжелых нарушений ритма, вегетососудистая дистония.</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-stone-200">
                                  <strong className="text-[#022C22] block text-sm font-bold">2. Болезни органов дыхания:</strong>
                                  <p className="text-xs sm:text-sm leading-relaxed mt-1">Хронические бронхиты, трахеиты, бронхиальная астма в стадии ремиссии, реконвалесценты после пневмоний.</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-stone-200">
                                  <strong className="text-[#022C22] block text-sm font-bold">3. Болезни костно-мышечной системы:</strong>
                                  <p className="text-xs sm:text-sm leading-relaxed mt-1">Деформирующие артрозы, коксартроз, гонартроз, остеохондроз позвоночника, последствия травм суставов.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right column: internal medical structure */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h5 className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] border-b border-stone-200 pb-2">Лечебные отделения и кабинеты</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1 text-stone-800">
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Изолятор</span>
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Клинико-диагностическая лаборатория</span>
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет дежурного медперсонала</span>
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет функциональной диагностики</span>
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Отделение физиотерапии</span>
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Отделение бальнеологии и водолечения</span>
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Зал кинезотерапии и ЛФК</span>
                                <span className="bg-white p-3 rounded-xl font-semibold border border-stone-200 shadow-2xs">Кабинет ручного массажа</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 bg-emerald-50/90 p-4 rounded-xl border border-emerald-200 text-sm">
                              <strong className="text-emerald-950 font-sans block font-bold text-xs uppercase tracking-wider">Круглогодичный график функционирования:</strong>
                              <p className="text-emerald-900 leading-relaxed text-xs sm:text-sm mt-1">
                                Санаторий полностью работоспособен 12 месяцев в году: Январь, Февраль, Март, Апрель, Май, Июнь, Июль, Август, Сентябрь, Октябрь, Ноябрь, Декабрь.
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

            {/* MAIN LIST OF DOCUMENT TILES */}
            <div className="space-y-5">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, idx) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="bg-white rounded-2xl border border-stone-200 hover:border-[#c5a880] p-6 sm:p-7 md:p-8 hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden group shadow-xs"
                      >
                        {/* Left accent bar on hover */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c5a880] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="space-y-4 flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#9b7b51] bg-[#c5a880]/15 border border-[#c5a880]/30 px-3 py-1 rounded-lg">
                              {doc.categoryLabel}
                            </span>
                            {doc.code && (
                              <span className="text-stone-800 text-xs sm:text-[13px] font-mono font-bold bg-stone-100 px-3 py-1 rounded-lg border border-stone-200 tabular-nums">
                                {doc.code}
                              </span>
                            )}
                            {doc.pdfUrl?.startsWith('data:') ? (
                              <span className="text-emerald-800 text-xs font-sans font-bold flex items-center space-x-1.5 border border-emerald-300 bg-emerald-100/80 px-3 py-1 rounded-lg shadow-2xs">
                                <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>ЗАГРУЖЕННЫЙ PDF В БАЗЕ</span>
                              </span>
                            ) : (
                              <span className="text-emerald-800 text-xs font-sans font-semibold flex items-center space-x-1.5 border border-emerald-200/60 bg-emerald-50 px-3 py-1 rounded-lg">
                                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>ОФИЦИАЛЬНЫЙ PDF</span>
                              </span>
                            )}
                          </div>

                          {/* Document Title with Icon */}
                          <div className="flex items-start gap-4 pt-0.5">
                            <div className="w-12 h-12 rounded-xl bg-[#022C22] text-[#c5a880] flex items-center justify-center shrink-0 shadow-sm mt-0.5 group-hover:scale-105 group-hover:bg-[#c5a880] group-hover:text-[#022C22] transition-all">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 
                                onClick={() => setViewingDoc(doc)}
                                className="font-sans text-xl sm:text-2xl font-bold text-[#022C22] tracking-tight group-hover:text-[#9b7b51] transition-colors leading-snug cursor-pointer select-none"
                                title={`Открыть «${doc.title}»`}
                              >
                                {formatDocTitle(doc.title)}
                              </h3>
                            </div>
                          </div>

                          {/* Summary / Description */}
                          <p className="text-base sm:text-[16px] text-stone-800 leading-relaxed font-sans sm:pl-16">
                            {doc.summary}
                          </p>

                          {/* Document Meta Info */}
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-stone-600 font-sans sm:pl-16 pt-3.5 border-t border-stone-100">
                            <span className="font-mono tabular-nums">Размер файла: <strong className="text-stone-900 font-semibold">{doc.fileSize || '1.2 MB'}</strong></span>
                            <span className="text-stone-300">•</span>
                            <span className="font-mono tabular-nums">Дата утверждения: <strong className="text-stone-900 font-semibold">{doc.uploadDate || '2026'}</strong></span>
                            <span className="text-stone-300">•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                              <Check className="w-4 h-4" /> Включен в государственный реестр
                            </span>
                          </div>
                        </div>

                        {/* Interactive actions block */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                          
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="bg-[#022C22] hover:bg-[#c5a880] text-white hover:text-[#022C22] px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 cursor-pointer flex-1 lg:flex-initial justify-center shadow-md active:scale-95 font-sans"
                            title="Открыть и читать официальный PDF документ"
                          >
                            <Eye className="w-4 h-4 text-[#c5a880] group-hover:text-[#022C22]" />
                            <span>Читать документ</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(doc)}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-[#022C22] px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer border border-stone-300 flex-1 lg:flex-initial justify-center font-sans"
                            title="Скачать PDF файл на устройство"
                          >
                            <Download className="w-4 h-4 text-stone-600" />
                            <span>PDF</span>
                          </button>

                          {isAdminMode && (
                            <div className="flex-1 lg:flex-initial">
                              <label className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer justify-center font-sans">
                                {uploadingDocId === doc.id ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                                    <span>{uploadProgress}%</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4" />
                                    <span>{doc.pdfUrl?.startsWith('data:') ? 'Обновить PDF' : 'Загрузить PDF'}</span>
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
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
                      <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-600 text-base font-semibold">Документы по выбранным критериям не найдены.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }} 
                        className="mt-3 text-xs text-[#022C22] hover:text-[#c5a880] font-bold uppercase cursor-pointer underline"
                      >
                        Сбросить фильтры поиска
                      </button>
                    </div>
                  )}
            </div>

      </div>

      {/* Fullscreen Overlay Document Viewer */}
      <AnimatePresence>
        {viewingDoc && (
          <motion.div
            key={`fullscreen-viewer-${viewingDoc.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] w-screen h-screen flex flex-col overflow-hidden bg-stone-950"
          >
            <PdfViewer
              doc={viewingDoc}
              onBack={() => setViewingDoc(null)}
              isModalFullscreen={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
