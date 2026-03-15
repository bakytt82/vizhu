'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Sun, Moon, MessageCircle, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useThemeStore } from '@/stores/themeStore';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/stores/languageStore';
import { translations, Language } from '@/lib/translations';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled || pathname !== '/'
            ? 'glass shadow-lg py-2 text-white'
            : 'bg-transparent py-4 text-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-2 group p-2 transition-colors relative z-50"
                aria-label={t.menu}
              >
                <div className="p-1">
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </div>
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-medium group-hover:opacity-60 transition-opacity">
                  {t.menu}
                </span>
              </button>

              {/* Language Switcher */}
              <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border-l border-white/20 pl-4">
                {(['ru', 'kg', 'en'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "hover:opacity-100 transition-opacity",
                      language === lang ? "opacity-100" : "opacity-30"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <Link href="/" className="group">
                <Image
                  src="/logo2.png"
                  alt={SITE_CONFIG.name}
                  width={180}
                  height={66}
                  className={cn(
                    "h-12 sm:h-16 w-auto object-contain transition-all duration-300",
                    "brightness-0 invert"
                  )}
                  priority
                />
              </Link>
            </div>

            {/* Right - Actions */}
            <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2">
              {isMounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 w-9 h-9 rounded-xl border border-white/20 hover:border-white/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 bg-white/5 backdrop-blur-sm shadow-sm"
                  aria-label="Тема"
                >
                  {theme === 'light' ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
                </button>
              )}
              
              <Link
                href="/catalog"
                className="p-2 hover:opacity-60 transition-opacity hidden sm:block"
                aria-label="Поиск"
              >
                <Search size={20} strokeWidth={1.5} />
              </Link>

              <Link href="/wishlist" className="relative p-2 hover:opacity-60 transition-opacity">
                <Heart size={20} strokeWidth={1.5} />
                {isMounted && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-vizhu-purple text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 hover:opacity-60 transition-opacity">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-foreground text-background text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Overlay (Desktop & Mobile) */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-all duration-500 backdrop-blur-md',
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/50 transition-opacity',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            'absolute top-0 left-0 bottom-0 w-full sm:w-96 bg-brand-purple text-white shadow-2xl transition-all duration-500 pt-32 px-12 flex flex-col',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'py-4 border-b border-white/10 text-xs uppercase tracking-[0.4em] font-medium transition-all hover:pl-4',
                  pathname === link.href ? 'text-white opacity-100' : 'text-white/40 hover:text-white hover:opacity-100'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t[link.key as keyof typeof t] || link.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden flex items-center gap-4 mt-8 pb-4">
             {(['ru', 'kg', 'en'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "text-[10px] uppercase tracking-widest font-bold transition-opacity",
                      language === lang ? "opacity-100" : "opacity-30"
                    )}
                  >
                    {lang}
                  </button>
                ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <a
              href={SITE_CONFIG.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-4 px-6 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-transparent hover:text-white border border-white transition-all"
            >
              <MessageCircle size={16} strokeWidth={1} />
              WhatsApp
            </a>
            <p className="mt-8 text-[11px] text-white/40 uppercase tracking-widest px-1">
              {SITE_CONFIG.phone}
            </p>
            <p className="text-[11px] text-white/40 uppercase tracking-widest px-1 mt-2">
              {SITE_CONFIG.address}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
