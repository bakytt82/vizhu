'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ChevronLeft, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import MobileWishlistView from '@/components/shared/MobileWishlistView';

export default function WishlistPage() {
  const { items, removeItem, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <>
        <div className="hidden lg:flex pt-32 pb-24 min-h-screen items-center justify-center bg-background">
          <div className="text-center px-4">
            <div className="text-8xl mb-8 grayscale opacity-30">❤️</div>
            <h1 className="text-4xl font-serif font-bold mb-4">
              {language === 'ru' ? 'В избранном пока пусто' : language === 'kg' ? 'Тандалган бөлүм бош' : 'Wishlist is empty'}
            </h1>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
              {language === 'ru' ? 'Добавляйте товары в избранное, чтобы не потерять их и вернуться к покупкам позже' : 
               language === 'kg' ? 'Товарларды жоготуп албоо үчүн жана кийинчерээк сатып алуу үчүн тандалганга кошуңуз' : 
               'Add items to your wishlist to keep track of them and return to shop later'}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-3 px-10 py-5 bg-vizhu-purple hover:bg-vizhu-purple-dark text-white rounded-2xl font-display font-bold transition-all shadow-xl shadow-vizhu-purple/20 hover:scale-105"
            >
              <ShoppingBag size={20} />
              {t.cart_go_to_catalog}
            </Link>
          </div>
        </div>
        <MobileWishlistView 
          items={items} 
          removeItem={removeItem} 
          toggleWishlist={toggleWishlist} 
        />
      </>
    );
  }

  return (
    <>
      <div className="hidden lg:block pt-32 pb-24 bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <Link href="/catalog" className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl hover:bg-muted transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-4xl font-serif font-medium">
              {language === 'ru' ? 'Избранное' : language === 'kg' ? 'Тандалган' : 'Wishlist'} 
              <span className="text-muted-foreground text-xl font-light ml-4 opacity-50">{items.length} товара</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-[32px] border border-border/50 overflow-hidden hover:border-vizhu-purple/30 transition-all shadow-sm hover:shadow-xl hover:shadow-black/5"
              >
                <div className="relative aspect-square bg-secondary/50 overflow-hidden">
                   {product.images?.[0] ? (
                     <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-7xl">👓</div>
                   )}
                   <button 
                     onClick={() => removeItem(product.id)}
                     className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>

                <div className="p-6">
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{product.brand}</p>
                   <Link href={`/catalog/${product.slug}`} className="block font-serif font-medium text-xl mb-4 hover:text-vizhu-purple transition-colors line-clamp-1">
                      {product.name}
                   </Link>
                   
                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div>
                         <span className="text-2xl font-display font-bold text-vizhu-orange">{formatPrice(product.price, t.som)}</span>
                         {product.oldPrice && (
                           <span className="text-sm text-muted-foreground line-through ml-2 opacity-50">{formatPrice(product.oldPrice, t.som)}</span>
                         )}
                      </div>
                      <button 
                        onClick={() => {
                          if (product.colors && product.colors.length > 0) {
                            addItem(product, product.colors[0]);
                          }
                        }}
                        className="w-12 h-12 bg-vizhu-purple text-white rounded-2xl flex items-center justify-center shadow-lg shadow-vizhu-purple/20 hover:bg-vizhu-purple-dark hover:scale-110 active:scale-95 transition-all"
                      >
                         <ShoppingCart size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <MobileWishlistView 
        items={items} 
        removeItem={removeItem} 
        toggleWishlist={toggleWishlist} 
      />
    </>
  );
}
