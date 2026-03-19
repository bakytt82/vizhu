'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';
import Link from 'next/link';
import { ShoppingBag, Star, ArrowRight, Eye } from 'lucide-react';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import { useLanguageStore } from '@/stores/languageStore';
import { useCartStore } from '@/stores/cartStore';
import { translations } from '@/lib/translations';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ProductWatermark from '@/components/shared/ProductWatermark';

export default function FeaturedProducts() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const addItem = useCartStore((s) => s.addItem);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((data) => {
      const bestsellers = data.filter((p) => p.isBestseller).slice(0, 4);
      setFeatured(bestsellers);
    });
  }, []);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-vizhu-orange font-display font-semibold uppercase tracking-[0.3em] text-[10px] mb-4">
              {t.bestsellers}
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif font-medium">
              {language === 'ru' ? 'Выбор наших ' : language === 'kg' ? 'Биздин кардарлардын ' : 'Our Customers\' '}
              <span className="gradient-text">
                {language === 'ru' ? 'клиентов' : language === 'kg' ? 'тандоосу' : 'Choice'}
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/catalog"
              className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold hover:text-vizhu-purple transition-colors"
            >
              {t.allModels}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/catalog/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-4/5 bg-secondary/50 rounded-4xl overflow-hidden mb-6 group-hover:shadow-2xl group-hover:shadow-vizhu-purple/10 transition-all">
                  <div className="w-full h-full relative">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                        {product.category === 'sunglasses' ? '🕶️' : '👓'}
                      </div>
                    )}
                  </div>
                  
                  <ProductWatermark size="md" className="top-4 left-4" />
                  
                  {product.isNew && (
                    <Badge variant="orange" className="absolute top-18 left-4 text-[10px] uppercase tracking-tighter font-bold px-3 py-1 z-10">
                      {t.catalog_new}
                    </Badge>
                  )}

                  {/* Quick Action Overlay (responsive visibility) */}
                  <div className="absolute inset-0 bg-vizhu-purple/20 backdrop-blur-[2px] lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItem(product, product.colors[0]);
                      }}
                      className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                    >
                      <ShoppingBag size={16} />
                      {t.addToCart}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 px-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-serif font-medium text-lg leading-tight group-hover:text-vizhu-purple transition-colors">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-vizhu-orange text-vizhu-orange" />
                    <span className="text-xs font-bold">{product.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviewCount} {t.reviewsCount})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xl font-display font-bold text-vizhu-orange">
                      {formatPrice(product.price, t.som)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through opacity-50">
                        {formatPrice(product.oldPrice, t.som)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
