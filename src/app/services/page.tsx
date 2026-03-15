'use client';

import { services } from '@/data/products';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
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

export default function ServicesPage() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="pt-24 pb-12 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-vizhu-orange font-display font-semibold uppercase tracking-[0.3em] text-[10px] mb-4">
            {t.services.toUpperCase()}
          </p>
          <h1 className="text-4xl sm:text-6xl font-serif font-medium mb-8">
            {language === 'ru' ? (
              <>Полный спектр услуг для <span className="gradient-text">вашего зрения</span></>
            ) : language === 'kg' ? (
              <>Сиздин көрүүңүз үчүн <span className="gradient-text">кызматтардын толук спектри</span></>
            ) : (
              <>Full range of services for <span className="gradient-text">your vision</span></>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            {language === 'ru' ? 
              'В салоне «Оптика Вижу» вы получите профессиональную помощь на каждом этапе — от диагностики зрения до изготовления очков' :
              language === 'kg' ?
              '«Оптика Вижу» салонунда сиз ар бир этапта профессионалдык жардам аласыз — көрүүнү диагностикалоодон баштап көз айнек жасоого чейин' :
              'In the "Optika Vizhu" salon, you will receive professional help at every stage — from vision diagnostics to the manufacture of glasses'
            }
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={service.id}
              className="bg-card/30 backdrop-blur-md rounded-4xl p-10 border border-border/50 hover:border-vizhu-purple/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-vizhu-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-vizhu-orange/5 transition-colors" />
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform inline-block">
                {iconMap[service.id]}
              </div>
              <h2 className="text-2xl font-serif font-medium mb-4 group-hover:text-vizhu-purple transition-colors">
                {getLangText(service.title, language)}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 font-light italic">
                {getLangText(service.description, language)}
              </p>
              <ul className="space-y-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-vizhu-orange shrink-0 shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
                    {getLangText(feature, language)}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-linear-to-r from-vizhu-purple to-vizhu-purple-dark rounded-[50px] p-8 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-vizhu-purple/20 border border-white/10"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-serif font-medium mb-6">
              {language === 'ru' ? 'Запишитесь на бесплатную проверку зрения' : 
               language === 'kg' ? 'Көрүүнү акысыз текшерүүгө жазылыңыз' : 
               'Book a Free Eye Exam'}
            </h2>
            <p className="text-white/70 mb-12 max-w-2xl mx-auto font-light text-lg italic">
              {language === 'ru' ? 'Без записи — просто приходите в удобное время. Наш окулист примет вас в течение 15 минут.' : 
               language === 'kg' ? 'Жазылуусуз — жөн гана сизге ыңгайлуу убакта келиңиз. Биздин окулист сизди 15 мүнөттүн ичинде кабыл алат.' : 
               'No appointment needed — just visit at your convenience. Our optometrist will see you within 15 minutes.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-vizhu-orange hover:bg-vizhu-orange-dark text-white font-display font-bold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-vizhu-orange/30 group border border-vizhu-orange/20"
              >
                <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                {SITE_CONFIG.phone}
              </a>
              <a
                href={SITE_CONFIG.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-display font-bold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-green-500/30 group"
              >
                <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                {language === 'ru' ? 'WhatsApp' : language === 'kg' ? 'WhatsApp' : 'WhatsApp'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
