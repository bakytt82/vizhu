'use client';

import { ChevronLeft, ShoppingBag, Trash2, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { useCartStore } from '@/stores/cartStore';

interface MobileWishlistViewProps {
  items: Product[];
  removeItem: (id: string) => void;
}

export default function MobileWishlistView({
  items,
  removeItem,
}: MobileWishlistViewProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-background min-h-screen pb-32 lg:hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Link href="/catalog" className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl active:scale-95 transition-transform">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-serif font-medium">
             {language === 'ru' ? 'Избранное' : language === 'kg' ? 'Тандалган' : 'Wishlist'} 
             <span className="text-muted-foreground font-light text-base ml-2 opacity-50">{items.length}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl">
             <ShoppingBag size={20} />
          </Link>
        </div>
      </header>

      {/* Wishlist Items */}
      <div className="px-6 py-8 space-y-6">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 grayscale opacity-30">❤️</div>
            <h3 className="text-2xl font-serif font-bold mb-2">
               {language === 'ru' ? 'В избранном пока пусто' : language === 'kg' ? 'Тандалган бөлүм бош' : 'Wishlist is empty'}
            </h3>
            <p className="text-muted-foreground mb-10 text-sm">
               {language === 'ru' ? 'Добавляйте товары в избранное, чтобы не потерять их' : 
                language === 'kg' ? 'Товарларды жоготуп албоо үчүн тандалганга кошуңуз' : 
                'Add items to your wishlist so you don\'t lose them'}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-3 px-10 py-5 bg-vizhu-purple text-white rounded-2xl font-display font-bold transition-all shadow-xl shadow-vizhu-purple/20"
            >
              {t.cart_go_to_catalog}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((product) => (
              <div key={product.id} className="bg-card rounded-4xl p-4 flex gap-4 border border-border/50 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
                <Link href={`/catalog/${product.slug}`} className="w-24 h-24 bg-secondary/50 rounded-3xl flex items-center justify-center p-3 shrink-0 relative">
                   {product.images?.[0] ? (
                     <Image src={product.images[0]} alt={product.name} fill className="object-cover rounded-xl" />
                   ) : (
                     <div className="text-4xl">👓</div>
                   )}
                </Link>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                   <div>
                      <div className="flex justify-between items-start">
                         <h3 className="font-serif font-medium text-base leading-tight line-clamp-1">{product.name}</h3>
                         <button 
                          onClick={() => removeItem(product.id)}
                          className="text-muted-foreground hover:text-destructive active:scale-90 transition-all p-1"
                         >
                            <Trash2 size={16} className="opacity-40" />
                         </button>
                      </div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mt-1">{product.brand}</p>
                   </div>
                   
                   <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-display font-bold text-vizhu-orange">{formatPrice(product.price, t.som)}</span>
                      <button 
                        onClick={() => {
                          const defaultColor = { name: { ru: 'Стандарт', kg: 'Стандарт', en: 'Standard' }, hex: '#000000' };
                          const colorToUse = (product.colors && product.colors.length > 0) ? product.colors[0] : defaultColor;
                          addItem(product, colorToUse);
                        }}
                        className="w-10 h-10 bg-vizhu-purple text-white rounded-xl flex items-center justify-center shadow-lg shadow-vizhu-purple/20 active:scale-90 transition-transform"
                      >
                         <ShoppingCart size={18} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
