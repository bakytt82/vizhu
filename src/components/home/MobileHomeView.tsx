'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import ProductWatermark from '@/components/shared/ProductWatermark';

export default function MobileHomeView() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((data) => {
      const bestsellers = data.filter((p) => p.isBestseller).slice(0, 4);
      setFeatured(bestsellers);
    });
  }, []);

  return (
    <div className="bg-background min-h-screen pb-32 lg:hidden">
      {/* Hero Section */}
      <div className="relative aspect-4/5 bg-secondary overflow-hidden flex items-center justify-center p-12 text-center text-white">
        <Image
           src="/hero-luxury.png"
           alt="Hero"
           fill
           className="object-cover"
           priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <span className="block text-[10px] uppercase tracking-[0.5em] mb-6 opacity-80 font-bold">{t.newCollection}</span>
          <h1 className="text-4xl font-serif mb-8 leading-tight">{t.artOfSeeing}</h1>
          <Link href="/catalog" className="inline-block px-10 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold rounded-2xl shadow-2xl active:scale-95 transition-transform">
            {t.watch}
          </Link>
        </motion.div>
      </div>

      {/* Featured Bestsellers */}
      <div className="px-6 py-16">
        <div className="flex justify-between items-end mb-10">
           <div>
             <span className="text-[10px] uppercase tracking-[0.3em] text-vizhu-purple font-bold mb-2 block">{t.popular}</span>
             <h2 className="text-3xl font-serif">{t.bestsellers}</h2>
           </div>
           <Link href="/catalog" className="text-[10px] uppercase tracking-[0.2em] border-b-2 border-vizhu-purple font-bold pb-1">{t.allModels}</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {featured.map((product, idx) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card group"
            >
              <Link href={`/catalog/${product.slug}`} className="block">
                <div className="aspect-square bg-secondary/50 rounded-[32px] flex items-center justify-center mb-4 relative overflow-hidden p-0">
                  <ProductWatermark size="sm" className="top-3 left-3" />
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl grayscale opacity-40">
                        {product.category === 'sunglasses' ? '🕶️' : '👓'}
                      </div>
                    )}
                  </div>
                  {product.isNew && (
                    <div className="absolute top-12 left-3 bg-vizhu-orange text-white text-[8px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider z-10">{t.catalog_new}</div>
                  )}
                </div>
                <div className="px-2">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1 opacity-60">{product.brand}</p>
                  <h3 className="font-serif text-base mb-2 group-hover:text-vizhu-purple transition-colors truncate">{product.name}</h3>
                  <span className="text-sm font-display font-bold text-vizhu-orange">{formatPrice(product.price, t.som)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Quiz Promo */}
      <div className="mx-6 py-12 px-8 bg-linear-to-br from-vizhu-purple to-indigo-900 rounded-4xl text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <span className="text-2xl">🪄</span>
          </div>
          <h2 className="text-3xl font-serif mb-4">{t.aiQuiz}</h2>
          <p className="text-xs font-light leading-relaxed mb-8 opacity-70 italic max-w-xs mx-auto">
            {t.aiQuizDesc}
          </p>
          <Link href="/quiz" className="inline-block px-10 py-4 bg-white text-vizhu-purple text-[10px] uppercase tracking-[0.3em] font-bold rounded-2xl shadow-xl active:scale-95 transition-transform">
            {t.startTest}
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <div className="px-6 py-20">
        <div className="bg-card rounded-4xl p-10 border border-border/50 text-center shadow-sm">
            <h3 className="text-xl font-serif mb-4">{t.subscribe}</h3>
            <p className="text-xs font-light mb-8 opacity-60 italic">{t.subscribeDesc}</p>
            <div className="flex bg-secondary/30 rounded-2xl p-2">
              <input type="email" placeholder="Email" className="bg-transparent flex-1 py-3 px-4 text-xs focus:outline-none placeholder:opacity-40" />
              <button className="bg-foreground text-background px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold active:scale-95 transition-transform">
                {t.ok}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
