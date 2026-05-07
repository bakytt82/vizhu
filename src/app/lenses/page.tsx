'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid, List as ListIcon, X } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';
import ProductCard from '@/components/shared/ProductCard';
import SectionHeader from '@/components/shared/SectionHeader';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function LensesPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const allProducts = await getProducts();
      // Filter for lenses category
      const lensProducts = allProducts.filter(p => p.category === 'lenses');
      setProducts(lensProducts);
      setFilteredProducts(lensProducts);
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title={t.lenses || 'Линзы'} 
          subtitle="Коллекция премиальных линз для вашего зрения: от классики до инновационных технологий"
        />

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-vizhu-purple transition-colors" size={18} />
            <input 
              type="text"
              placeholder={t.catalog_search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 outline-hidden focus:ring-2 focus:ring-vizhu-purple/20 transition-all text-sm font-medium shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border transition-all font-medium text-sm",
                isFilterOpen ? "bg-vizhu-purple text-white border-vizhu-purple shadow-lg shadow-vizhu-purple/20" : "bg-card border-border hover:border-vizhu-purple/50"
              )}
            >
              <SlidersHorizontal size={18} />
              <span>Фильтры</span>
            </button>
            <div className="hidden sm:flex bg-secondary p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-background shadow-sm text-vizhu-purple" : "text-muted-foreground")}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-background shadow-sm text-vizhu-purple" : "text-muted-foreground")}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="p-8 bg-card/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Бренды</h4>
                    <div className="flex flex-wrap gap-2">
                      {['ZEISS', 'ESSILOR'].map(brand => (
                        <button
                          key={brand}
                          onClick={() => {
                            const newSearch = searchQuery === brand ? '' : brand;
                            setSearchQuery(newSearch);
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                            searchQuery.toUpperCase() === brand 
                              ? "bg-vizhu-orange border-vizhu-orange text-white" 
                              : "bg-background/40 border-white/5 hover:border-vizhu-orange/30"
                          )}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Тип линз</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Однофокальные', 'Прогрессивные', 'Офисные'].map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            const newSearch = searchQuery === type ? '' : type;
                            setSearchQuery(newSearch);
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                            searchQuery === type 
                              ? "bg-vizhu-purple border-vizhu-purple text-white" 
                              : "bg-background/40 border-white/5 hover:border-vizhu-purple/30"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setIsFilterOpen(false);
                      }}
                      className="text-xs font-bold text-vizhu-orange hover:underline px-2 py-1"
                    >
                      {t.catalog_reset}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-4/5 rounded-3xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={cn(
            "grid gap-8",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/30 rounded-4xl border border-dashed border-border overflow-hidden">
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
              <X className="text-muted-foreground" size={24} />
            </div>
            <h3 className="text-xl font-medium mb-2">{t.catalog_empty}</h3>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm">{t.catalog_empty_desc}</p>
          </div>
        )}

        {/* Lens Tech Education */}
        <div className="mt-40 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-vizhu-purple font-bold tracking-[0.3em] text-[10px] uppercase mb-6 block drop-shadow-sm">Технологии зрения</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif mb-10 leading-[1.15]">Ваш взгляд на мир <br /> заслуживает <span className="text-vizhu-purple italic">лучшего</span></h2>
              <div className="space-y-10 group">
                <div className="flex gap-8 group/item">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-vizhu-purple/10 flex items-center justify-center text-vizhu-purple font-bold text-lg group-hover/item:bg-vizhu-purple group-hover/item:text-white transition-all duration-500">01</div>
                  <div>
                    <h4 className="font-bold mb-3 text-lg">Защита от синего света</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">Специальное многослойное покрытие Blue Control отсекает вредный спектр цифровых экранов, предотвращая усталость и сухость глаз при длительной работе.</p>
                  </div>
                </div>
                <div className="flex gap-8 group/item">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-vizhu-purple/10 flex items-center justify-center text-vizhu-purple font-bold text-lg group-hover/item:bg-vizhu-purple group-hover/item:text-white transition-all duration-500">02</div>
                  <div>
                    <h4 className="font-bold mb-3 text-lg">Ультра-тонкий дизайн</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">Высокий индекс преломления (1.67, 1.74) позволяет сделать линзы на 40% тоньше стандартных. Идеально для высоких диоптрий без эффекта «увеличения».</p>
                  </div>
                </div>
                <div className="flex gap-8 group/item">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-vizhu-purple/10 flex items-center justify-center text-vizhu-purple font-bold text-lg group-hover/item:bg-vizhu-purple group-hover/item:text-white transition-all duration-500">03</div>
                  <div>
                    <h4 className="font-bold mb-3 text-lg">Просветляющее покрытие</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">Премиальные антибликовые слои делают линзу почти невидимой, устраняя паразитные отражения и обеспечивая 99.8% светопропускания.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-4/5 rounded-[64px] overflow-hidden shadow-2xl rotate-3 scale-95 transition-transform hover:rotate-0 hover:scale-100 duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1000&auto=format&fit=crop" 
                  alt="Precision Optical Lens" 
                  className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-background/95 backdrop-blur-xl p-10 rounded-4xl shadow-3xl border border-white/10 max-w-xs hidden xl:block">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-vizhu-orange/10 flex items-center justify-center overflow-hidden border border-vizhu-orange/20">
                    <img src="/logo2.png" alt="" className="w-6 opacity-30 invert" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-vizhu-purple">Гарантия Zeiss</span>
                </div>
                <p className="text-sm font-serif italic text-muted-foreground leading-loose">
                  "В Оптике Вижу мы работаем только с линзами мировых лидеров — Zeiss и Essilor. Каждая линза устанавливается с лазерной точностью в нашей мастерской."
                </p>
                <div className="mt-8 pt-8 border-t border-border/50">
                   <div className="flex items-center justify-between group cursor-pointer">
                      <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">Записаться к мастеру</span>
                      <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-vizhu-purple group-hover:text-white group-hover:border-vizhu-purple transition-all italic text-xs">→</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
