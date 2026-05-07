'use client';

import { Heart, Star, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import ProductWatermark from '@/components/shared/ProductWatermark';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language];
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const handleCardClick = () => {
    router.push(`/catalog/${product.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group card-hover cursor-pointer"
    >
      <div className="bg-card rounded-[32px] overflow-hidden border border-border/50 hover:border-vizhu-purple/30 transition-all">
        <div className="relative aspect-square bg-secondary/50 overflow-hidden">
          {product.images?.[0] ? (
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-7xl bg-muted/50">👓</div>
          )}
          
          <ProductWatermark size="sm" className="top-3 left-3" />
          
          <div className="absolute top-14 left-3 flex flex-col gap-1.5 z-10">
            {product.discount && (
              <Badge variant="destructive" className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                -{product.discount}%
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="orange" className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                {t.catalog_new}
              </Badge>
            )}
            {product.isBestseller && (
              <Badge variant="purple" className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                {t.catalog_hit}
              </Badge>
            )}
          </div>

          {product.category !== 'lenses' && (
            <div className="absolute bottom-4 left-4 z-20 transition-all lg:translate-y-2 lg:group-hover:translate-y-0 lg:opacity-0 lg:group-hover:opacity-100">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/try-on?productId=${product.id}`);
                }}
                className="px-3 py-1.5 bg-amber-500 text-purple-950 text-[10px] font-bold rounded-full flex items-center gap-1.5 shadow-lg hover:bg-amber-400 transition-colors"
                title="ПРИМЕРИТЬ"
              >
                <Sparkles size={12} fill="currentColor" />
                ПРИМЕРИТЬ
              </button>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-y-2 lg:group-hover:translate-y-0 z-20">
            <button
               onClick={(e) => { 
                 e.preventDefault(); 
                 toggleWishlist(product);
               }}
               className="w-10 h-10 bg-white dark:bg-card/80 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-border shadow-lg"
             >
               <Heart 
                 size={16} 
                 className={cn(
                   "transition-colors",
                   isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"
                 )} 
               />
             </button>
          </div>
        </div>

        <div className="p-5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
            {product.brand}
          </p>
          <h3 className="font-medium text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-vizhu-purple transition-colors h-10 sm:h-12">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-vizhu-orange text-vizhu-orange" />
            <span className="text-xs font-bold">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              · {product.reviewCount} {t.reviewsCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-vizhu-orange">
              {formatPrice(product.price, t.som)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through opacity-60">
                {formatPrice(product.oldPrice, t.som)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
