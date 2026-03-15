'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, ShoppingBag, Eye, ChevronLeft, Check, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { reviews } from '@/data/products';
import { getProductBySlug } from '@/lib/db';
import { Product } from '@/types';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import MobileProductDetailView from '@/components/shared/MobileProductDetailView';

export default function ProductPage() {
  const params = useParams();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

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
          <h1 className="text-2xl font-serif font-bold mb-2">Товар не найден</h1>
          <Link href="/catalog" className="text-vizhu-purple hover:underline">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, product.colors[selectedColor]);
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
            <Link href="/catalog" className="hover:text-vizhu-purple transition-colors flex items-center gap-1">
              <ChevronLeft size={16} />
              Каталог
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image gallery */}
            <div>
              <div className="bg-secondary/50 rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden p-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[10rem]">👓</div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discount && (
                    <Badge variant="destructive" className="px-3 py-1">
                      -{product.discount}%
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="orange" className="px-3 py-1">
                      {t.catalog_new}
                    </Badge>
                  )}
                </div>

                {/* Try-on button */}
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-vizhu-purple text-white rounded-xl font-medium hover:bg-vizhu-purple-dark transition-colors shadow-lg">
                  <Eye size={18} />
                  Примерить
                </button>
              </div>

              {/* Color swatches under image */}
              <div className="flex gap-3 mt-4 justify-center overflow-x-auto p-1">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    className={cn(
                      'w-20 h-20 rounded-xl bg-secondary/50 flex items-center justify-center border-2 transition-all overflow-hidden shrink-0',
                      i === 0 ? 'border-vizhu-purple' : 'border-transparent hover:border-border'
                    )}
                  >
                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
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
                {product.discount && (
                  <Badge variant="neutral" className="bg-destructive/10 text-destructive border-transparent">
                    {language === 'ru' ? 'Экономия' : language === 'kg' ? 'Арзандатуу' : 'Savings'} {formatPrice(product.oldPrice! - product.price, t.som)}
                  </Badge>
                )}
              </div>

              {/* Color selection */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">
                  Цвет: <span className="text-muted-foreground">{getLangText(product.colors[selectedColor].name as any, language)}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(i)}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center',
                        selectedColor === i ? 'border-vizhu-purple scale-110' : 'border-border hover:scale-105'
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={getLangText(color.name as any, language)}
                    >
                      {selectedColor === i && (
                        <Check size={16} className="text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground/80 leading-relaxed mb-6">{getLangText(product.description, language)}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.features.map((feature) => (
                  <span
                    key={getLangText(feature, language)}
                    className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium"
                  >
                    {getLangText(feature, language)}
                  </span>
                ))}
              </div>

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
                >
                  <Heart size={20} />
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                {[
                  { icon: Truck, text: 'Доставка по Караколу' },
                  { icon: Shield, text: 'Гарантия 1 год' },
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

          {/* Reviews section */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold mb-6">Отзывы покупателей</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.slice(0, 4).map((review) => (
                <div key={review.id} className="bg-card rounded-xl p-5 border border-border/50">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? 'fill-vizhu-orange text-vizhu-orange' : 'text-muted'} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 mb-3">&ldquo;{getLangText(review.text, language)}&rdquo;</p>
                  <p className="text-xs text-muted-foreground font-medium">{review.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <MobileProductDetailView
        product={product}
        onAddToCart={handleAddToCart}
        addedToCart={addedToCart}
      />
    </>
  );
}
