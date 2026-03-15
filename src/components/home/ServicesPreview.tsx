'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { services } from '@/data/products';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { getLangText } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap: Record<string, string> = {
  'eye-check': '👁️',
  'optometrist': '🩺',
  'lens-fitting': '🔧',
  'fast-glasses': '⚡',
  'restoration': '✨',
};

export default function ServicesPreview() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase tracking-[0.4em] text-vizhu-purple font-bold mb-4 block"
            >
              {t.services}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-6xl font-serif mb-8"
            >
              {t.impeccableService.split(' ')[0]} <span className="gradient-text">{t.impeccableService.split(' ')[1]}</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed text-lg"
            >
              {t.footerBrand}
            </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm rounded-4xl p-10 border border-border/50 hover:border-vizhu-purple/30 transition-all group relative overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-vizhu-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-vizhu-orange/5 transition-colors" />
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 inline-block">
                {iconMap[service.id] || '📋'}
              </div>
              <h3 className="text-2xl font-serif font-medium mb-4 group-hover:text-vizhu-purple transition-colors">
                {getLangText(service.title, language)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-light italic opacity-80">
                {getLangText(service.description, language)}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-[11px] text-muted-foreground flex items-center gap-3 uppercase tracking-wider font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-vizhu-orange shrink-0 shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
                    {getLangText(feature, language)}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* AI CTA Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-foreground text-background rounded-4xl p-10 flex flex-col justify-between group relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-vizhu-purple/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                <Sparkles size={32} className="text-vizhu-orange" />
              </div>
              <h3 className="text-3xl font-serif font-medium mb-4">
                {t.aiQuiz}
              </h3>
              <p className="text-background/60 text-base leading-relaxed mb-8 font-light">
                {t.aiQuizDesc}
              </p>
            </div>
            <Link
              href="/quiz"
              className="relative z-10 inline-flex items-center justify-center gap-3 px-8 py-4 bg-vizhu-orange text-white text-[11px] uppercase tracking-[0.2em] font-bold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-vizhu-orange/20"
            >
              {t.startTest}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
