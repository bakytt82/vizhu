'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, RotateCcw, Star } from 'lucide-react';
import { useQuizStore } from '@/stores/quizStore';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { getProducts } from '@/lib/db';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import ProductWatermark from '@/components/shared/ProductWatermark';

export default function QuizResultsPage() {
  const { answers, reset } = useQuizStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Filter products based on quiz answers
  const recommended = allProducts.filter((p) => {
    let score = 0;
    if (answers.material && p.material === answers.material) score += 2;
    if (answers.purpose && p.category === (answers.purpose === 'vision' ? 'eyeglasses' : answers.purpose === 'sun' ? 'sunglasses' : answers.purpose === 'computer' ? 'computer' : 'sports')) score += 3;
    if (answers.style === 'classic' && (p.shape === 'rectangle' || p.shape === 'oval')) score += 1;
    if (answers.style === 'bold' && (p.shape === 'cat-eye' || p.shape === 'round')) score += 1;
    return score > 0;
  }).slice(0, 4);

  const displayProducts = recommended.length > 0 ? recommended : allProducts.slice(0, 4);

  useEffect(() => {
    // Fetch products and AI recommendations
    const fetchData = async () => {
      try {
        const prodData = await getProducts();
        setAllProducts(prodData);

        const res = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...answers, lang: language }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiRecommendation(data.recommendation);
        }
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [answers, language]);

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vizhu-orange/10 text-vizhu-orange text-sm font-medium mb-4">
            <Sparkles size={16} />
            {t.quiz_ai_rec}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            {t.quiz_results_title}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.quiz_results_desc}
          </p>
        </div>

        {/* AI Recommendation */}
        {aiRecommendation && (
          <div className="bg-linear-to-r from-vizhu-purple/5 to-vizhu-orange/5 rounded-2xl p-6 mb-8 border border-vizhu-purple/10">
            <div className="flex items-start gap-3 mb-3">
              <Sparkles size={20} className="text-vizhu-purple mt-0.5" />
              <h3 className="font-serif font-semibold text-lg">{t.quiz_ai_stylist}</h3>
            </div>
            <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line pl-8">
              {aiRecommendation}
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-muted rounded-2xl p-6 mb-8 animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="text-vizhu-purple animate-spin" />
              <span className="text-sm text-muted-foreground">{t.quiz_ai_analyzing}</span>
            </div>
          </div>
        )}

        {/* Recommended products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {displayProducts.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/${product.slug}`}
              className="group card-hover"
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-vizhu-purple/30 transition-all">
                <div className="relative aspect-square bg-secondary/50 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {product.images?.[1] ? ( // Changed to check for second image for hover effect or just use first
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-7xl">👓</div>
                  )}
                  <ProductWatermark size="sm" className="top-2 left-2" />
                  
                  {product.discount && (
                    <Badge className="absolute top-12 left-2 bg-destructive text-white text-xs z-10">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{product.brand}</p>
                  <h3 className="font-medium text-sm mb-1 group-hover:text-vizhu-purple transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={10} className="fill-vizhu-orange text-vizhu-orange" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                  <p className="font-display font-bold text-sm text-vizhu-orange">{formatPrice(product.price, t.som)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-vizhu-orange hover:bg-vizhu-orange-dark text-white font-display font-semibold rounded-xl transition-all hover:scale-105 text-lg"
          >
            {t.quiz_see_catalog}
            <ArrowRight size={20} />
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-muted hover:bg-muted/80 font-display font-semibold rounded-xl transition-all"
          >
            <RotateCcw size={20} />
            {t.quiz_retake}
          </button>
        </div>
      </div>
    </div>
  );
}
