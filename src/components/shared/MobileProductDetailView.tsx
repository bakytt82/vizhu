'use client';

import { ChevronLeft, ShoppingBag, Share2, Eye, Heart, Star, MessageSquare } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

interface MobileProductDetailViewProps {
  product: Product;
  onAddToCart: () => void;
  addedToCart: boolean;
}

export default function MobileProductDetailView({
  product,
  onAddToCart,
  addedToCart,
}: MobileProductDetailViewProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedLens, setSelectedLens] = useState('Neutral');

  const lensOptions = [
    { value: 'Neutral', label: t.lensesNeutral },
    { value: 'Polarized', label: t.lensesPolarized },
    { value: 'Blue Light', label: t.lensesBlueLight },
    { value: 'Prescription', label: t.lensesPrescription },
  ];

  return (
    <div className="bg-background min-h-screen pb-32 lg:hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <Link href="/catalog" className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full">
          <ChevronLeft size={20} />
        </Link>
        <div className="font-bold tracking-widest text-[10px] uppercase opacity-60">{product.brand}</div>
        <div className="flex items-center gap-4">
          <div className="relative">
             <ShoppingBag size={20} />
          </div>
          <Share2 size={20} />
        </div>
      </header>

      {/* Main Image & Try-on */}
      <div className="px-6 mb-4">
        <div className="aspect-square bg-secondary rounded-4xl flex items-center justify-center relative overflow-hidden group">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
          <button className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest shadow-2xl active:scale-95 transition-transform">
             <Eye size={18} /> {t.seeItOnYou}
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="px-6 flex gap-3 mb-8 overflow-x-auto no-scrollbar">
        {product.images.map((img, i) => (
          <div key={i} className={cn(
            "w-20 h-16 rounded-2xl shrink-0 flex items-center justify-center border transition-all",
            i === 0 ? "bg-secondary border-vizhu-purple/30" : "bg-transparent border-border/50"
          )}>
            <img src={img} alt="" className="w-12 h-12 object-contain mix-blend-multiply opacity-60" />
          </div>
        ))}
      </div>

      {/* Product Info */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-serif font-medium mb-1">{product.name}</h1>
            <div className="flex items-center gap-3">
               <span className="text-2xl font-display font-bold text-vizhu-orange">{formatPrice(product.price, t.som)}</span>
               {product.oldPrice && (
                 <span className="text-sm text-muted-foreground line-through opacity-50">{formatPrice(product.oldPrice, t.som)}</span>
               )}
            </div>
            <p className="text-muted-foreground text-[10px] mt-2 font-medium uppercase tracking-wider">{t.withNaturalLenses}</p>
          </div>
          <button className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl text-muted-foreground hover:text-rose-500 transition-colors">
             <Heart size={20} />
          </button>
        </div>

        <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-lg">-{product.discount || 15}%</span>
          </div>
          <div className="flex items-center gap-1">
             <Star size={14} className="fill-vizhu-orange text-vizhu-orange" />
             <span className="text-foreground">{product.rating}</span>
             <span className="text-muted-foreground font-medium lowercase">({product.reviewCount} {t.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
             <MessageSquare size={14} />
             <span>{t.discussion}</span>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="px-6 mb-10 grid grid-cols-2 gap-6">
        <div>
           <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4 block">{t.colors}</label>
           <div className="flex gap-3">
             {product.colors.map((color, i) => (
               <button
                 key={i}
                 onClick={() => setSelectedColor(i)}
                 className={cn(
                   "w-8 h-8 rounded-full border-2 transition-all p-0.5",
                   selectedColor === i ? "border-vizhu-purple" : "border-transparent"
                 )}
                 title={getLangText(color.name, language)}
               >
                 <div className="w-full h-full rounded-full border border-black/5" style={{ backgroundColor: color.hex }} />
               </button>
             ))}
           </div>
        </div>
        <div>
           <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4 block">{t.lensType}</label>
           <div className="relative">
             <select 
               className="w-full bg-card border border-border rounded-xl py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider appearance-none focus:ring-2 focus:ring-vizhu-purple/20 transition-all outline-hidden"
               value={selectedLens}
               onChange={(e) => setSelectedLens(e.target.value)}
             >
               {lensOptions.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
             </select>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
               <ChevronLeft size={16} className="-rotate-90" />
             </div>
           </div>
        </div>
      </div>

      {/* Tabs / Content */}
      <div className="px-6 mb-10">
        <div className="flex gap-8 border-b border-border/50 mb-8 overflow-x-auto no-scrollbar pb-0.5">
           {[t.aboutTab, t.overviewTab, t.shippingTab].map((tab, i) => (
             <button key={tab} className={cn(
               "pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
               i === 0 ? "text-vizhu-purple" : "text-muted-foreground opacity-50 hover:opacity-100"
             )}>
               {tab}
               {i === 0 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vizhu-purple" />}
             </button>
           ))}
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed font-light">
             {getLangText(product.description, language)}
          </p>
          <ul className="grid grid-cols-2 gap-3">
             {product.features.map((feature, i) => (
               <li key={i} className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                 <span className="w-1 h-1 bg-vizhu-orange rounded-full" />
                 {getLangText(feature, language)}
               </li>
             ))}
          </ul>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-2xl border-t border-border z-40">
        <div className="flex gap-4">
          <button className="w-16 h-16 flex items-center justify-center bg-card border border-border rounded-2xl active:scale-95 transition-transform group">
             <div className="w-6 h-6 border-2 border-muted-foreground/30 rounded-lg flex items-center justify-center group-hover:border-vizhu-purple transition-colors">
               <div className="w-1 h-1 bg-muted-foreground/30 rounded-full group-hover:bg-vizhu-purple transition-colors" />
             </div>
          </button>
          <button
            onClick={onAddToCart}
            className={cn(
              "flex-1 h-16 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl shadow-black/5",
              addedToCart 
                ? "bg-green-500 text-white shadow-green-500/20" 
                : "bg-vizhu-purple text-white shadow-vizhu-purple/20"
            )}
          >
            {addedToCart ? t.productAdded : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
