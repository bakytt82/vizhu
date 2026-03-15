'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

export default function CTABanner() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <section className="py-32 bg-brand-purple relative overflow-hidden text-white">
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-8 block">
          {language === 'ru' ? 'Бесплатный осмотр' : language === 'kg' ? 'Акысыз текшерүү' : 'Free Examination'}
        </span>
        <h2 className="text-4xl sm:text-6xl font-serif mb-8">
          {language === 'ru' ? 'Профессиональная проверка зрения' : language === 'kg' ? 'Көз карашты профессионалдуу текшерүү' : 'Professional Eye Exam'}
        </h2>
        <p className="text-base sm:text-lg text-white/50 mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {t.footerBrand}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href={`tel:${SITE_CONFIG.phoneClean}`}
            className="px-12 py-5 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold border border-white hover:bg-transparent hover:text-white transition-all"
          >
            {t.callUs}
          </a>
          <Link
            href="/contacts"
            className="px-12 py-5 border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all"
          >
            {t.address}
          </Link>
        </div>
      </div>
    </section>
  );
}
