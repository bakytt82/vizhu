'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Heart, ShoppingBag, ChevronLeft, Check, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { getProductBySlug } from '@/lib/db';
import { Product } from '@/types';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import MobileProductDetailView from '@/components/shared/MobileProductDetailView';
import ProductWatermark from '@/components/shared/ProductWatermark';

export default function LensPage() {
  const params = useParams();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (params.slug) {
      getProductBySlug(params.slug as string).then((data) => {
        setProduct(data);
        setIsLoading(false);
      });
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-vizhu-purple" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center border-t border-border/10">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-serif font-bold mb-2">Линза не найдена</h1>
          <Link href="/lenses" className="text-vizhu-purple hover:underline">
            Вернуться в каталог линз
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const defaultColor = { name: { ru: 'Стандарт', kg: 'Стандарт', en: 'Standard' }, hex: '#000000' };
    const colorToUse = (product?.colors && product.colors.length > 0) ? product.colors[selectedColor] : defaultColor;
    
    addItem(product!, colorToUse);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/lenses" className="hover:text-vizhu-purple transition-colors flex items-center gap-1">
              <ChevronLeft size={16} />
              Линзы
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="bg-secondary/50 rounded-2xl aspect-square relative overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    {product.images?.[activeImageIndex] ? (
                      <Image 
                        src={product.images[activeImageIndex]} 
                        alt={product.name} 
                        fill
                        className="object-cover" 
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10rem]">🔬</div>
                    )}
                  </motion.div>
                </AnimatePresence>
                
                <ProductWatermark size="lg" className="top-6 left-6" />

                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40 z-20"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40 z-20"
                    >
                      <ChevronLeft size={24} className="rotate-180" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-24 left-6 flex flex-col gap-2 z-10">
                  {product.isNew && (
                    <Badge variant="orange" className="px-3 py-1">
                      Новое
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail gallery */}
              <div className="flex gap-3 mt-4 justify-center overflow-x-auto p-1">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={cn(
                      'w-20 h-20 rounded-xl bg-secondary/50 flex items-center justify-center border-2 transition-all overflow-hidden shrink-0',
                      i === activeImageIndex ? 'border-vizhu-purple scale-105 shadow-md' : 'border-transparent hover:border-border opacity-70 hover:opacity-100'
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${i}`} width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-vizhu-orange text-vizhu-orange'
                          : 'text-muted'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  · {product.reviewCount} отзывов
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-display font-bold">{formatPrice(product.price, t.som)}</span>
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.oldPrice, t.som)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-foreground/80 leading-relaxed mb-6">{getLangText(product.description, language)}</p>

              {/* Technical features / Characteristics */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 bg-secondary/30 rounded-2xl border border-border/10">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Материал</p>
                    <p className="font-bold text-sm">{product.material || 'Полимер'}</p>
                 </div>
                 <div className="p-4 bg-secondary/30 rounded-2xl border border-border/10">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Тип</p>
                    <p className="font-bold text-sm">{product.frame_type || 'Линза'}</p>
                 </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium"
                    >
                      {getLangText(feature as any, language)}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  className={cn(
                    'flex-1 py-6 text-lg font-display font-semibold rounded-xl transition-all',
                    addedToCart
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-vizhu-orange hover:bg-vizhu-orange-dark'
                  )}
                >
                  {addedToCart ? (
                    <><Check size={20} className="mr-2" /> Добавлено!</>
                  ) : (
                    <><ShoppingBag size={20} className="mr-2" /> В корзину</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-xl"
                  onClick={() => product && toggleWishlist(product)}
                >
                  <Heart size={20} className={cn(isInWishlist(product.id) && "fill-rose-500 text-rose-500")} />
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                {[
                  { icon: Truck, text: 'Доставка по Караколу' },
                  { icon: Shield, text: 'Гарантия качества' },
                  { icon: RotateCcw, text: 'Обмен 14 дней' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="text-center">
                    <Icon size={20} className="mx-auto mb-1 text-vizhu-purple" />
                    <p className="text-xs text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <MobileProductDetailView
        product={product}
        onAddToCart={handleAddToCart}
        addedToCart={addedToCart}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
    </>
  );
}
