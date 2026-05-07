export const SITE_CONFIG = {
  name: 'Оптика Вижу',
  tagline: 'Премиальный салон оптики',
  description: 'Премиальный салон оптики в Караколе — очки на заказ за 60 минут, бесплатная проверка зрения, виртуальная примерочная с ИИ',
  url: 'https://optika-vizhu.kg',
  phone: '+996 772 18-88-02',
  phone2: '+996 500 18-88-02',
  phoneClean: '+996772188802',
  phoneClean2: '+996500188802',
  whatsapp: 'https://wa.me/996772188802',
  address: 'г. Каракол, ул. Токтогула, 259/8',
  city: 'Каракол',
  region: 'Иссык-Кульская область',
  country: 'Кыргызстан',
  email: 'info@optikavizhu.com',
  instagram: 'https://instagram.com/optika_karakol',
  workHours: {
    weekdays: '09:00 — 19:00',
    saturday: '09:00 — 16:00',
    sunday: '', // Handled by translation
  },
  coordinates: {
    lat: 42.491409,
    lng: 78.393071,
  },
};

export const NAV_LINKS = [
  { href: '/', label: 'Главная', key: 'home' },
  { href: '/catalog', label: 'Каталог', key: 'catalog' },
  { href: '/lenses', label: 'Линзы', key: 'lenses' },
  { href: '/quiz', label: 'Найти свою оправу', key: 'quiz' },
  { href: '/services', label: 'Услуги', key: 'services' },
  { href: '/about', label: 'О нас', key: 'about' },
  { href: '/contacts', label: 'Контакты', key: 'contacts' },
];

export const CATEGORIES = [
  { 
    slug: 'eyeglasses', 
    label: { ru: 'Для зрения', kg: 'Көрүү үчүн', en: 'Eyeglasses' }, 
    icon: '👓' 
  },
  { 
    slug: 'sunglasses', 
    label: { ru: 'Солнцезащитные', kg: 'Күндөн коргоочу', en: 'Sunglasses' }, 
    icon: '🕶️' 
  },
  { 
    slug: 'computer', 
    label: { ru: 'Компьютерные', kg: 'Компьютердик', en: 'Computer' }, 
    icon: '💻' 
  },
  { 
    slug: 'sports', 
    label: { ru: 'Спортивные', kg: 'Спортук', en: 'Sports' }, 
    icon: '🏃' 
  },
  { 
    slug: 'lenses', 
    label: { ru: 'Линзы', kg: 'Линзалар', en: 'Lenses' }, 
    icon: '🔍' 
  },
];

export const CURRENCY = {
  code: 'KGS',
  symbol: 'сом',
  format: (price: number) => `${price.toLocaleString('ru-RU')} сом`,
};
