export interface Room {
  id: string;
  name: string;
  category: string;
  area: number; // in sq. meters
  capacity: string;
  beds: string;
  view: string;
  price: number; // in rub
  description: string;
  amenities: string[];
  image: string;
  images?: string[];
}

export interface MedicalProgram {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  indications: string[];
  procedures: string[];
  duration: string;
  icon: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  isApproved?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  image: string;
  content: string;
  excerpt?: string;
}

export interface ServiceItem {
  id: string;
  category: 'methods' | 'diagnostics' | 'laboratory' | 'infrastructure';
  title: string;
  benefit: string;
  method: string;
  indications: string[];
  duration?: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  category: string;
  title: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  role?: string;
  lastLogin?: string;
}

export interface DocumentItem {
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




