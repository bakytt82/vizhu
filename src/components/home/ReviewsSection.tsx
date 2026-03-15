'use client';

import { Star, Quote } from 'lucide-react';
import { reviews } from '@/data/products';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { getLangText } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ReviewsSection() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-border to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.6em] text-vizhu-purple font-bold mb-6 block"
          >
            {t.reviews}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-serif font-medium"
          >
            {language === 'ru' ? 'Мнения наших клиентов' : language === 'kg' ? 'Кардарларыбыздын пикирлери' : 'Client Feedback'}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card/30 backdrop-blur-md p-10 rounded-4xl border border-border/50 relative hover:border-vizhu-purple/30 transition-all group"
            >
              <Quote size={40} className="absolute top-10 right-10 text-vizhu-purple/5 group-hover:text-vizhu-purple/10 transition-colors" />
              
              {/* Stars */}
              <div className="flex gap-1.5 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      "transition-all",
                      i < review.rating
                        ? 'fill-vizhu-orange text-vizhu-orange'
                        : 'text-muted opacity-20'
                    )}
                  />
                ))}
              </div>

              <p className="text-lg leading-relaxed text-foreground/80 mb-8 font-light italic">
                &ldquo;{getLangText(review.text as any, language)}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-8 border-t border-border/50">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-vizhu-purple/10 text-vizhu-purple text-sm font-bold shadow-inner">
                  <span>
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="inline-block px-3 py-1 bg-vizhu-purple/5 rounded-full mb-1">
                    <p className="font-bold text-[11px] tracking-wide text-vizhu-purple">{review.author}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest block px-1 opacity-60">
                    {new Date(review.date).toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'kg' ? 'ky-KG' : 'en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Average rating */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-12 px-12 py-8 bg-card/50 rounded-[50px] border border-border/50 shadow-2xl shadow-black/5">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-vizhu-orange text-vizhu-orange" />
                ))}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">
                {language === 'ru' ? 'Средний рейтинг' : language === 'kg' ? 'Орточо рейтинг' : 'Average Rating'}
              </span>
            </div>
            
            <div className="h-12 w-px bg-border hidden sm:block" />

            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="text-4xl font-display font-bold">4.8 / 5</span>
              <span className="text-[10px] uppercase tracking-widest text-vizhu-purple font-bold">
                {language === 'ru' ? '500+ отзывов' : language === 'kg' ? '500+ пикирлер' : '500+ Reviews'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { cn } from '@/lib/utils';
