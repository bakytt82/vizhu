'use client';

import { Phone, MapPin, Clock, Mail, MessageCircle, Send } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

export default function ContactsPage() {
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-vizhu-orange font-display font-semibold uppercase tracking-wider text-sm mb-2">
            {t.contact_title}
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
            {t.contact_subtitle}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.contact_desc}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact info */}
          <div className="space-y-6">
            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="bg-card rounded-2xl p-6 border card-hover group relative"
              >
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-vizhu-purple/20 to-transparent pointer-events-none" />
                <div className="w-12 h-12 bg-vizhu-purple/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-vizhu-purple group-hover:text-white transition-all">
                  <Phone size={22} className="text-vizhu-purple group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold mb-1">{t.contact_phone}</h3>
                <p className="text-vizhu-purple font-medium">{SITE_CONFIG.phone}</p>
              </a>

              <a
                href={SITE_CONFIG.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card rounded-2xl p-6 border card-hover group"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-all">
                  <MessageCircle size={22} className="text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold mb-1">{t.contact_whatsapp}</h3>
                <p className="text-green-600 font-medium">{t.contact_write}</p>
              </a>

              <div className="bg-card rounded-2xl p-6 border group">
                <div className="w-12 h-12 bg-vizhu-orange/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-vizhu-orange group-hover:text-white transition-all">
                  <MapPin size={22} className="text-vizhu-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold mb-1">{t.contact_address}</h3>
                <p className="text-sm text-muted-foreground">{t.address_value}</p>
              </div>

              <div className="bg-card rounded-2xl p-6 border group">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Clock size={22} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold mb-1">{t.contact_hours}</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{t.monFri}: {SITE_CONFIG.workHours.weekdays}</p>
                  <p>{t.sat}: {SITE_CONFIG.workHours.saturday}</p>
                  <p>{t.sun}: {t.day_off}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border h-80 bg-muted relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2942.014897330503!2d78.3904314755711!3d42.49123592680488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38865bbbe3759e47%3A0xb6610d9f27948491!2sOptika%20%22Vizhu%22!5e0!3m2!1sen!2skg!4v1773500996399!5m2!1sen!2skg"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 border">
            <h2 className="text-xl font-serif font-semibold mb-6">{t.contact_form_title}</h2>
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-serif font-bold mb-2">{t.contact_form_sent}</h3>
                <p className="text-muted-foreground">{t.contact_form_sent_desc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">{t.contact_form_name}</Label>
                  <Input id="contact-name" required placeholder={t.contact_form_placeholder_name} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="contact-phone">{t.contact_form_phone}</Label>
                  <Input id="contact-phone" required type="tel" placeholder="+996 ___  __-__-__" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="contact-email">{t.contact_form_email}</Label>
                  <Input id="contact-email" type="email" placeholder="email@example.com" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="contact-message">{t.contact_form_message}</Label>
                  <Textarea
                    id="contact-message"
                    required
                    placeholder={t.contact_form_placeholder_message}
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-vizhu-purple hover:bg-vizhu-purple-dark text-white font-display font-semibold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {t.contact_form_submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
