'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, ShoppingBag, MapPin } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

const navItems = [
  { href: '/', key: 'home', icon: Home },
  { href: '/catalog', key: 'catalog', icon: Search },
  { href: '/quiz', key: 'quiz', icon: Sparkles },
  { href: '/cart', key: 'cart', icon: ShoppingBag },
  { href: '/contacts', key: 'contacts', icon: MapPin },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isMounted, setIsMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-2xl border-t border-border/40 flex items-center justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] h-16">
      <div className="flex justify-between items-center w-full px-6 h-full">
        {navItems.map(({ href, key, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center transition-all relative py-2 rounded-2xl active:scale-75 h-full flex-1',
                isActive ? 'text-vizhu-purple' : 'text-muted-foreground/40'
              )}
            >
              <div className="relative flex items-center justify-center h-full w-full">
                <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className={cn("transition-all", isActive && "scale-110")} />
                {key === 'cart' && isMounted && itemCount > 0 && (
                  <span className="absolute top-1/2 left-1/2 -translate-y-[18px] translate-x-[8px] bg-vizhu-orange text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-background shadow-lg z-10">
                    {itemCount}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-1">
                    <MotionDot />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function MotionDot() {
  return (
    <div className="w-1 h-1 bg-vizhu-purple rounded-full" />
  );
}
