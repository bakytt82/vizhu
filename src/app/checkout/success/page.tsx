import Link from 'next/link';
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-serif font-bold mb-3">
          Заказ принят!
        </h1>
        <p className="text-muted-foreground mb-2">
          Спасибо за покупку! Ваш заказ успешно оформлен.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Номер заказа: <span className="font-mono font-bold text-foreground">#VZ-{Math.floor(Math.random() * 9000 + 1000)}</span>
        </p>

        <div className="bg-card rounded-2xl p-6 border mb-8 text-left">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package size={18} className="text-vizhu-purple" />
            Что дальше?
          </h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-vizhu-purple text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              Мы свяжемся с вами по телефону в течение 30 минут для подтверждения заказа.
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-vizhu-purple text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              Приготовим ваши очки в нашей мастерской (обычно 60 минут).
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-vizhu-purple text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              Сообщим о готовности — можно забрать или мы доставим.
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-vizhu-purple hover:bg-vizhu-purple-dark text-white rounded-xl font-display font-semibold transition-all"
          >
            <Home size={18} />
            На главную
          </Link>
          <Link
            href="/catalog"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl font-display font-semibold transition-all"
          >
            Каталог
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
