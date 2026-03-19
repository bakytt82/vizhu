import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import ChatWidget from "@/components/shared/ChatWidget";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Оптика Вижу — Премиальный салон оптики в Караколе",
    template: "%s | Оптика Вижу",
  },
  description:
    "Премиальный салон оптики в Караколе — очки на заказ за 60 минут, бесплатная проверка зрения, индивидуальный подбор оправ. ул. Токтогула 259/8",
  keywords: [
    "оптика Каракол",
    "очки на заказ",
    "проверка зрения бесплатно",
    "подбор оправ",
    "изготовление очков за 60 минут",
    "купить очки Каракол",
    "солнцезащитные очки",
    "компьютерные очки",
    "оптика Вижу",
  ],
  authors: [{ name: "Оптика Вижу" }],
  openGraph: {
    type: "website",
    locale: "ru_KG",
    siteName: "Оптика Вижу",
    title: "Оптика Вижу — Премиальный салон оптики в Караколе",
    description:
      "Очки на заказ за 60 минут. Бесплатная проверка зрения. Индивидуальный подбор оправ.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${outfit.variable} font-sans antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const manual = localStorage.getItem('vizhu-theme-manual');
                  let theme = '';
                  if (manual === 'true') {
                    const stored = localStorage.getItem('vizhu-theme');
                    if (stored) {
                      theme = JSON.parse(stored).state.theme;
                    }
                  }
                  if (!theme) {
                    const hour = new Date().getHours();
                    theme = (hour >= 7 && hour < 19) ? 'light' : 'dark';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Header />
        <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <ChatWidget />
      </body>
    </html>
  );
}
