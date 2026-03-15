'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Star, Heart, Eye, Loader2 } from 'lucide-react';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/lib/constants';
import { useLanguageStore } from '@/stores/languageStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { translations } from '@/lib/translations';
import ProductWatermark from '@/components/shared/ProductWatermark';

export default function CatalogPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = products
    .filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && 
          !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return b.reviewCount - a.reviewCount;
      }
    });

  return (
    <div className="pt-24 pb-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">{t.catalog_title}</h1>
          <p className="text-muted-foreground">
            {t.catalog_subtitle}
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.catalog_search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-vizhu-purple/20 transition-all outline-hidden"
          >
            <option value="popular">{t.catalog_sort_popular}</option>
            <option value="price-asc">{t.catalog_sort_price_asc}</option>
            <option value="price-desc">{t.catalog_sort_price_desc}</option>
            <option value="rating">{t.catalog_sort_rating}</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setCategory('all')}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all',
              category === 'all'
                ? 'bg-vizhu-purple text-white shadow-lg shadow-vizhu-purple/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {t.catalog_all}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5',
                category === cat.slug
                  ? 'bg-vizhu-purple text-white shadow-lg shadow-vizhu-purple/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <span>{cat.icon}</span>
              {cat.label[language as keyof typeof cat.label] || cat.label['ru']}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm font-medium text-muted-foreground mb-6">
          {t.catalog_found}: {filtered.length} {t.catalog_items}
        </p>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/${product.slug}`}
              className="group card-hover"
            >
              <div className="bg-card rounded-[32px] overflow-hidden border border-border/50 hover:border-vizhu-purple/30 transition-all">
                <div className="relative aspect-square bg-secondary/50 overflow-hidden">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-7xl">👓</div>
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

                  {/* Actions (always visible on small screens, on hover for desktop) */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-y-2 lg:group-hover:translate-y-0 z-20">
                    <button
                      onClick={(e) => { e.preventDefault(); }}
                      className="flex-1 py-2.5 bg-vizhu-purple text-white text-[10px] uppercase tracking-widest font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-vizhu-purple-dark transition-colors shadow-lg shadow-vizhu-purple/20"
                    >
                      <Eye size={14} />
                      {t.catalog_try_on}
                    </button>
                    <button
                       onClick={(e) => { 
                         e.preventDefault(); 
                         toggleWishlist(product);
                       }}
                       className="w-10 h-10 bg-white dark:bg-card/80 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-border"
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
            </Link>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-vizhu-purple mb-4" size={40} />
            <p className="text-muted-foreground">{t.ai_thinking}...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-4xl border border-dashed border-border mt-8">
            <div className="text-6xl mb-6 grayscale opacity-30">🔍</div>
            <h3 className="text-2xl font-serif font-bold mb-2">{t.catalog_empty}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">{t.catalog_empty_desc}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
