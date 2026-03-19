'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, Mail, Instagram, MessageCircle } from 'lucide-react';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

export default function Footer() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <footer className="bg-brand-purple text-white border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/logo2.png"
                alt={SITE_CONFIG.name}
                width={160}
                height={58}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-[13px] leading-relaxed mb-6 font-light">
              {t.footerBrand}
            </p>
            <div className="flex gap-3">
              <a
                href={SITE_CONFIG.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} strokeWidth={1} />
              </a>
              <a
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} strokeWidth={1} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-medium mb-6 font-serif">{t.navigation}</h3>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/50 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-medium"
                >
                  {t[link.key as keyof typeof t] || link.label}
                </Link>
              ))}
              <Link href="/assistant" className="text-white/50 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-medium">
                {language === 'ru' ? 'ИИ-Ассистент' : language === 'kg' ? 'ИИ-Ассистент' : 'AI Assistant'}
              </Link>
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-lg font-medium mb-6 font-serif">{t.contacts}</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${SITE_CONFIG.phoneClean}`}
                  className="flex items-start gap-3 text-white/50 hover:text-white transition-colors group"
                >
                  <Phone size={14} className="mt-0.5 text-white/30" />
                  <span className="text-[11px]">{SITE_CONFIG.phone}</span>
                </a>
                <a
                  href={`tel:${SITE_CONFIG.phoneClean2}`}
                  className="flex items-start gap-3 text-white/50 hover:text-white transition-colors group"
                >
                  <div className="w-[14px] shrink-0" />
                  <span className="text-[11px]">{SITE_CONFIG.phone2}</span>
                </a>
              </div>
              <div className="flex items-start gap-3 text-white/50">
                <MapPin size={14} className="mt-0.5 text-white/30 shrink-0" />
                <span className="text-[11px]">{t.address_value}</span>
              </div>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-start gap-3 text-white/50 hover:text-white transition-colors"
              >
                <Mail size={14} className="mt-0.5 text-white/30" />
                <span className="text-[11px]">{SITE_CONFIG.email}</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-medium mb-6 font-serif">{t.hours}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-white/70">
                <Clock size={14} className="mt-0.5 text-white/30" />
                <div className="text-[11px] font-light">
                  <p className="mb-1 opacity-70">{t.monFri}: {SITE_CONFIG.workHours.weekdays}</p>
                  <p className="mb-1 opacity-70">{t.sat}: {SITE_CONFIG.workHours.saturday}</p>
                  <p className="opacity-70">{t.sun}: {t.day_off}</p>
                </div>
              </div>
            </div>

            {/* Mini map placeholder removed per request */}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50">
            <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. {t.allRightsReserved}.</p>
            <p className="text-[10px] tracking-wider opacity-60 uppercase">{t.madeWith}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
