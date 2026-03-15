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
    "Премиальный магазин оптики в Караколе — очки на заказ за 60 минут, бесплатная проверка зрения, виртуальная примерочная с ИИ, подбор оправ. ул. Токтогула 259/8",
  keywords: [
    "оптика Каракол",
    "очки на заказ",
    "проверка зрения бесплатно",
    "виртуальная примерочная",
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
      "Очки на заказ за 60 минут. Бесплатная проверка зрения. Виртуальная примерочная с ИИ.",
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
        <Header />
        <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <ChatWidget />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
