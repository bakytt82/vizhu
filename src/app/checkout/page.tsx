'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, QrCode, ChevronLeft, Shield, Lock } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isMounted, setIsMounted] = useState(false);
  const [payment, setPayment] = useState('card');
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    { id: 'card', label: 'Visa / Mastercard', icon: CreditCard, desc: language === 'ru' ? 'Банковская карта' : language === 'kg' ? 'Банк картасы' : 'Bank Card' },
    { id: 'elsom', label: 'Элсом', icon: Smartphone, desc: language === 'ru' ? 'Электронный кошелёк' : language === 'kg' ? 'Электрондук капчык' : 'E-wallet' },
    { id: 'qr', label: 'QR-оплата', icon: QrCode, desc: 'MBank, О!Деньги' },
  ];

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 mb-12">
          <Link href="/cart" className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl hover:bg-muted transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-4xl font-serif font-medium">{t.checkout_title}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact info */}
              <div className="bg-card rounded-4xl p-10 border border-border/50 shadow-sm">
                <h2 className="text-2xl font-serif font-medium mb-8">{t.checkout_contact}</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">{t.checkout_name} *</Label>
                    <Input id="name" required placeholder={t.checkout_name} className="h-14 rounded-2xl bg-secondary/30 border-none px-6 focus:ring-2 focus:ring-vizhu-purple/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">{t.checkout_phone} *</Label>
                    <Input id="phone" required type="tel" placeholder="+996 ___  __-__-__" className="h-14 rounded-2xl bg-secondary/30 border-none px-6 focus:ring-2 focus:ring-vizhu-purple/20 transition-all" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">{t.checkout_email}</Label>
                    <Input id="email" type="email" placeholder="email@example.com" className="h-14 rounded-2xl bg-secondary/30 border-none px-6 focus:ring-2 focus:ring-vizhu-purple/20 transition-all" />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-card rounded-4xl p-10 border border-border/50 shadow-sm">
                <h2 className="text-2xl font-serif font-medium mb-8">{t.checkout_shipping}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: 'pickup', label: t.checkout_pickup, desc: t.checkout_pickup_desc },
                    { id: 'delivery', label: t.checkout_delivery, desc: t.checkout_delivery_desc },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="group relative flex flex-col p-6 rounded-3xl border-2 border-border/50 cursor-pointer hover:border-vizhu-purple/30 transition-all bg-secondary/10"
                    >
                      <input type="radio" name="delivery" value={opt.id} defaultChecked={opt.id === 'pickup'} className="absolute top-6 right-6 accent-vizhu-purple w-5 h-5" />
                      <p className="font-bold text-sm uppercase tracking-wider mb-1">{opt.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card rounded-4xl p-10 border border-border/50 shadow-sm">
                <h2 className="text-2xl font-serif font-medium mb-8">{t.checkout_payment}</h2>
                <div className="space-y-4">
                  {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
                    <label
                      key={id}
                      className={cn(
                        'flex items-center gap-6 p-6 rounded-3xl border-2 cursor-pointer transition-all active:scale-[0.98]',
                        payment === id ? 'border-vizhu-purple bg-vizhu-purple/5' : 'border-border/50 hover:border-vizhu-purple/20'
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={payment === id}
                        onChange={(e) => setPayment(e.target.value)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                        payment === id ? "bg-vizhu-purple text-white" : "bg-secondary text-muted-foreground"
                      )}>
                        <Icon size={28} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm uppercase tracking-widest">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        payment === id ? "border-vizhu-purple bg-vizhu-purple" : "border-border"
                      )}>
                        {payment === id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="sticky top-32">
              <div className="bg-card rounded-4xl p-8 border border-border/50 shadow-2xl shadow-black/5">
                <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-8">
                  {language === 'ru' ? 'ВАШ ЗАКАЗ' : language === 'kg' ? 'СИЗДИН ЗАКАЗ' : 'YOUR ORDER'}
                </h2>
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2 leading-snug">{item.product.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">x{item.quantity} · {getLangText(item.selectedColor.name as any, language)}</p>
                      </div>
                      <span className="font-display font-bold text-sm whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity, t.som)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6 opacity-30" />
                
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{t.cart_summary}</span>
                      <span className="font-bold">{formatPrice(getTotal(), t.som)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm text-green-500 font-medium">
                      <span>{language === 'ru' ? 'Доставка' : language === 'kg' ? 'Жеткирүү' : 'Shipping'}</span>
                      <span>{language === 'ru' ? 'Бесплатно' : language === 'kg' ? 'Акысыз' : 'Free'}</span>
                   </div>
                </div>

                <div className="border-t border-border pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{language === 'ru' ? 'ИТОГО К ОПЛАТЕ' : language === 'kg' ? 'ЖАЛПЫ ТӨЛӨМ' : 'TOTAL TO PAY'}</span>
                    <span className="text-3xl font-display font-bold text-vizhu-orange">{formatPrice(getTotal(), t.som)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    'w-full py-6 rounded-[32px] font-display font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-[0.98]',
                    submitting
                      ? 'bg-muted text-muted-foreground cursor-wait'
                      : 'bg-vizhu-orange hover:bg-vizhu-orange-dark text-white shadow-vizhu-orange/20'
                  )}
                >
                  {submitting ? (
                    <div className="flex items-center gap-3">
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       {t.checkout_processing}
                    </div>
                  ) : (
                    <>
                      <Lock size={20} />
                      {t.checkout_pay} {formatPrice(getTotal(), t.som)}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
                  <Shield size={14} />
                  {t.checkout_safe}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
