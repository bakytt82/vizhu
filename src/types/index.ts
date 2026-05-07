export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  description: string | { ru: string; kg: string; en: string };
  shortDescription: string | { ru: string; kg: string; en: string };
  category: 'eyeglasses' | 'sunglasses' | 'computer' | 'sports' | 'lenses';
  gender: 'men' | 'women' | 'unisex';
  material: 'metal' | 'acetate' | 'titanium' | 'combination' | 'TR90' | 'polycarbonate' | 'high-index' | 'other';
  shape: 'round' | 'square' | 'cat-eye' | 'aviator' | 'rectangle' | 'oval' | 'wrap' | 'other';
  colors: ProductColor[];
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  features: (string | { ru: string; kg: string; en: string })[];
  frame_type?: string;
  frameType?: string;
  quantity?: number;
}

export interface ProductColor {
  name: string | { ru: string; kg: string; en: string };
  hex: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
}

export interface QuizAnswers {
  faceWidth?: 'narrow' | 'medium' | 'wide';
  faceShape?: 'round' | 'oval' | 'heart' | 'triangle';
  style?: 'classic' | 'casual' | 'bold' | 'business';
  material?: 'metal' | 'acetate' | 'combination' | 'titanium';
  color?: 'neutral' | 'clear' | 'colorful' | 'tortoise';
  purpose?: 'vision' | 'sun' | 'computer' | 'sport';
}

export interface Service {
  id: string;
  icon: string;
  title: string | { ru: string; kg: string; en: string };
  description: string | { ru: string; kg: string; en: string };
  features: (string | { ru: string; kg: string; en: string })[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string | { ru: string; kg: string; en: string };
  date: string;
  productId?: string;
  avatar?: string;
}

export interface ChatAction {
  type: 'addToCart' | 'openLink';
  label: string;
  productId?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  actions?: ChatAction[];
}

export interface PrescriptionEye {
  sphere: string | null;
  cylinder: string | null;
  axis: string | null;
  add: string | null;
}

export interface Prescription {
  od: PrescriptionEye;
  os: PrescriptionEye;
  pd: string | null;
}
