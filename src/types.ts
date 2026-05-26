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
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
