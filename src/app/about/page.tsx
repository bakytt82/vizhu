'use client';

import { Eye, Award, Users, Clock } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const { language } = useLanguageStore();
  const t = translations[language];

  const stats = [
    { icon: Eye, value: '15+', label: t.about_stats_years },
    { icon: Users, value: '10,000+', label: t.about_stats_clients },
    { icon: Award, value: '2,000+', label: t.about_stats_frames },
    { icon: Clock, value: '60', label: t.about_stats_minutes },
  ];

  const team = [
    { 
      name: language === 'ru' ? 'Доктор Айбек' : language === 'kg' ? 'Доктор Айбек' : 'Dr. Aybek', 
      role: language === 'ru' ? 'Главный окулист' : language === 'kg' ? 'Башкы окулист' : 'Chief Optometrist', 
      emoji: '👨‍⚕️', 
      desc: language === 'ru' ? 'Опыт 15+ лет. Специализация: подбор коррекции, детская офтальмология.' : language === 'kg' ? '15 жылдык тажрыйба. Көрүүнү оңдоо, балдар офтальмологиясы.' : '15+ years experience. Specialization: correction selection, pediatric ophthalmology.'
    },
    { 
      name: language === 'ru' ? 'Мастер Талант' : language === 'kg' ? 'Мастер Талант' : 'Master Talant', 
      role: language === 'ru' ? 'Мастер по линзам' : language === 'kg' ? 'Линза боюнча мастер' : 'Lens Specialist', 
      emoji: '🔧', 
      desc: language === 'ru' ? 'Эксперт по установке и обработке линз. Работает с ZEISS, Essilor, Hoya.' : language === 'kg' ? 'Линзаларды орнотуу жана иштетүү боюнча эксперт. ZEISS, Essilor, Hoya менен иштейт.' : 'Expert in lens installation and processing. Works with ZEISS, Essilor, Hoya.'
    },
    { 
      name: language === 'ru' ? 'Консультант Айгуль' : language === 'kg' ? 'Консультант Айгүл' : 'Consultant Aigul', 
      role: language === 'ru' ? 'Стилист-консультант' : language === 'kg' ? 'Стилист-консультант' : 'Stylist Consultant', 
      emoji: '👩‍💼', 
      desc: language === 'ru' ? 'Поможет подобрать оправу, которая идеально подчеркнёт ваш стиль.' : language === 'kg' ? 'Сиздин стилиңизди идеалдуу баса белгилеген алкакты тандоого жардам берет.' : 'Will help you choose a frame that perfectly highlights your style.'
    },
  ];

  const values = [
    { emoji: '🎯', title: language === 'ru' ? 'Точность' : language === 'kg' ? 'Тактык' : 'Precision', desc: language === 'ru' ? 'Современное оборудование для диагностики и обработки линз' : language === 'kg' ? 'Диагностика жана линзаларды иштетүү үчүн заманбап жабдуулар' : 'Modern equipment for diagnostics and lens processing' },
    { emoji: '⚡', title: language === 'ru' ? 'Скорость' : language === 'kg' ? 'Ылдамдык' : 'Speed', desc: language === 'ru' ? 'Изготовление очков от 60 минут — не нужно ждать дни' : language === 'kg' ? 'Көз айнек 60 мүнөттө жасалат — күндөп күтүүнүн кереги жок' : 'Glasses made in 60 minutes — no need to wait for days' },
    { emoji: '💎', title: language === 'ru' ? 'Качество' : language === 'kg' ? 'Сапат' : 'Quality', desc: language === 'ru' ? 'Работаем с ZEISS, Essilor, Hoya — мировые лидеры оптики' : language === 'kg' ? 'ZEISS, Essilor, Hoya — дүйнөлүк лидерлер менен иштейбиз' : 'We work with ZEISS, Essilor, Hoya — global optics leaders' },
    { emoji: '👨‍⚕️', title: language === 'ru' ? 'Профессионализм' : language === 'kg' ? 'Профессионализм' : 'Professionalism', desc: language === 'ru' ? 'Окулист с 15-летним опытом — на месте каждый день' : language === 'kg' ? '15 жылдык тажрыйбасы бар окулист — күн сайын ордунда' : 'Optometrist with 15 years of experience — on-site every day' },
    { emoji: '🤖', title: language === 'ru' ? 'Инновации' : language === 'kg' ? 'Инновациялар' : 'Innovations', desc: language === 'ru' ? 'ИИ-подбор оправы и персональный сервис' : language === 'kg' ? 'ИИ менен алкак тандоо жана жеке сервис' : 'AI frame matching and personalized service' },
    { emoji: '❤️', title: language === 'ru' ? 'Забота' : language === 'kg' ? 'Кам көрүү' : 'Care', desc: language === 'ru' ? 'Индивидуальный подход и гарантия на все работы' : language === 'kg' ? 'Жеке мамиле жана бардык иштерге кепилдик' : 'Individual approach and warranty on all work' },
  ];

  return (
    <div className="pt-24 pb-12 min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-vizhu-orange font-display font-semibold uppercase tracking-[0.3em] text-[10px] mb-4">
            {t.about_hero_tag}
          </p>
          <h1 className="text-4xl sm:text-6xl font-serif font-medium mb-8">
            {t.about_hero_title.split('—')[0]} <span className="gradient-text">— {t.about_hero_title.split('—')[1]}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            {t.about_hero_desc}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={label} 
              className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 text-center hover:border-vizhu-purple/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-vizhu-purple/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-vizhu-purple" />
              </div>
              <p className="text-4xl font-serif font-bold text-vizhu-orange mb-2">{value}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <div className="bg-brand-purple/5 rounded-4xl p-8 sm:p-16 mb-24 border border-vizhu-purple/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vizhu-purple/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl font-serif font-medium mb-10 text-foreground">{t.about_story_title}</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-lg">
              <p>{t.about_story_p1}</p>
              <p>{t.about_story_p2}</p>
              <p>{t.about_story_p3}</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <h2 className="text-3xl font-serif font-medium text-center mb-16">
            {t.about_team_title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={member.name} 
                className="bg-card/30 backdrop-blur-md rounded-[32px] p-8 border border-border/50 text-center hover:border-vizhu-orange/30 transition-all"
              >
                <div className="w-24 h-24 bg-vizhu-purple/10 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                  {member.emoji}
                </div>
                <h3 className="text-xl font-serif font-medium mb-2">{member.name}</h3>
                <p className="text-vizhu-purple text-[10px] uppercase tracking-widest font-bold mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-brand-purple text-white rounded-4xl p-10 sm:p-20 relative overflow-hidden shadow-2xl shadow-brand-purple/20">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          <h2 className="text-4xl font-serif font-medium text-center mb-16 relative z-10">{t.about_why_title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
            {values.map((value, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={value.title} 
                className="flex gap-6"
              >
                <span className="text-4xl shrink-0 filter-white">{value.emoji}</span>
                <div>
                  <h3 className="font-medium text-xl mb-2">{value.title}</h3>
                  <p className="text-white/60 text-sm font-light leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
