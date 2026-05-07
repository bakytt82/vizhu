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
import ProductCard from '@/components/shared/ProductCard';

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
      // Category filter
      if (category === 'all') {
        if (p.category === 'lenses') return false;
      } else {
        if (p.category !== category) return false;
      }

      // Search filter
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
            <ProductCard key={product.id} product={product} />
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
