'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { SITE_CONFIG } from '@/lib/constants';

export default function HeroSection() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-luxury.png"
          alt="Luxury Eyewear"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/30 lg:from-black/40 lg:to-black/20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.5em] text-white/60 mb-8">
            {t.newCollection} 2024
          </span>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-10">
            {t.artOfSeeing.split(' ')[0]} <br /> {t.artOfSeeing.split(' ').slice(1).join(' ')}
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-12 max-w-2xl mx-auto font-light tracking-wide">
            {t.footerBrand.split('. ')[0]}. <br />
            {t.footerBrand.split('. ')[1]}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/catalog"
              className="group relative px-10 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold transition-all hover:bg-transparent hover:text-white border border-white"
            >
              {t.catalog}
            </Link>
            <Link
              href="/quiz"
              className="group relative px-10 py-4 border border-white/30 text-white text-[10px] uppercase tracking-[0.3em] font-bold transition-all hover:bg-white hover:text-black"
            >
              {t.aiQuiz}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-linear-to-b from-white to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
