'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, SkipForward, Check } from 'lucide-react';
import { useQuizStore } from '@/stores/quizStore';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language];
  const { currentStep, answers, setAnswer, nextStep, prevStep, skipStep } = useQuizStore();

  const quizSteps = useMemo(() => [
    {
      key: 'faceWidth' as const,
      question: language === 'ru' ? 'Какая у вас ширина лица?' : language === 'kg' ? 'Бетиңиздин туурасы кандай?' : 'What is your face width?',
      subtitle: language === 'ru' ? 'Это поможет подобрать оправу правильного размера' : language === 'kg' ? 'Бул туура өлчөмдөгү алкакты тандоого жардам берет' : 'This will help us pick the right frame size',
      options: [
        { value: 'narrow', label: language === 'ru' ? 'Узкое' : language === 'kg' ? 'Ичке' : 'Narrow', icon: '📏', desc: language === 'ru' ? 'Лоб и скулы уже среднего' : language === 'kg' ? 'Чеке жана бет сөөктөрү орточодон ичке' : 'Forehead and cheekbones are narrower than average' },
        { value: 'medium', label: language === 'ru' ? 'Среднее' : language === 'kg' ? 'Орточо' : 'Medium', icon: '📐', desc: language === 'ru' ? 'Стандартная ширина' : language === 'kg' ? 'Стандарттык туурасы' : 'Standard width' },
        { value: 'wide', label: language === 'ru' ? 'Широкое' : language === 'kg' ? 'Кенен' : 'Wide', icon: '📊', desc: language === 'ru' ? 'Лоб и скулы шире среднего' : language === 'kg' ? 'Чеке жана бет сөөктөрү орточодон кенен' : 'Forehead and cheekbones are wider than average' },
      ],
    },
    {
      key: 'faceShape' as const,
      question: language === 'ru' ? 'Какая у вас форма лица?' : language === 'kg' ? 'Бетиңиздин формасы кандай?' : 'What is your face shape?',
      subtitle: language === 'ru' ? 'Форма лица определяет, какая оправа будет смотреться лучше всего' : language === 'kg' ? 'Беттин формасы кайсы алкак жакшы көрүнөрүн аныктайт' : 'Face shape determines which frame will look best on you',
      options: [
        { value: 'round', label: language === 'ru' ? 'Круглое' : language === 'kg' ? 'Тоголок' : 'Round', icon: '⭕', desc: language === 'ru' ? 'Мягкие черты, одинаковая длина и ширина' : language === 'kg' ? 'Жумшак сызыктар, узундугу менен туурасы бирдей' : 'Soft features, equal length and width' },
        { value: 'oval', label: language === 'ru' ? 'Овальное' : language === 'kg' ? 'Овал' : 'Oval', icon: '🥚', desc: language === 'ru' ? 'Лоб чуть шире подбородка' : language === 'kg' ? 'Чекеси ээгинен бир аз кенен' : 'Forehead slightly wider than chin' },
        { value: 'heart', label: language === 'ru' ? 'Сердцевидное' : language === 'kg' ? 'Жүрөк сымал' : 'Heart', icon: '💜', desc: language === 'ru' ? 'Широкий лоб, узкий подбородок' : language === 'kg' ? 'Кенен чеке, ичке ээк' : 'Wide forehead, narrow chin' },
        { value: 'triangle', label: language === 'ru' ? 'Треугольное' : language === 'kg' ? 'Үч бурчтук' : 'Triangle', icon: '🔻', desc: language === 'ru' ? 'Узкий лоб, широкая челюсть' : language === 'kg' ? 'Ичке чеке, кенен жаак' : 'Narrow forehead, wide jaw' },
      ],
    },
    {
      key: 'style' as const,
      question: language === 'ru' ? 'Какой стиль вам ближе?' : language === 'kg' ? 'Сизге кайсы стиль жакыныраак?' : 'What is your preferred style?',
      subtitle: language === 'ru' ? 'Очки — это аксессуар, который подчёркивает ваш стиль' : language === 'kg' ? 'Көз айнек — бул сиздин стилиңизди баса белгилеген аксессуар' : 'Glasses are an accessory that defines your style',
      options: [
        { value: 'classic', label: language === 'ru' ? 'Классика' : language === 'kg' ? 'Классика' : 'Classic', icon: '🎩', desc: language === 'ru' ? 'Вечная элегантность' : language === 'kg' ? 'Түбөлүктүү элеганттуулук' : 'Timeless elegance' },
        { value: 'casual', label: language === 'ru' ? 'Casual' : language === 'kg' ? 'Casual' : 'Casual', icon: '👕', desc: language === 'ru' ? 'Расслабленный и комфортный' : language === 'kg' ? 'Эркин жана ыңгайлуу' : 'Relaxed and comfortable' },
        { value: 'bold', label: language === 'ru' ? 'Смелый' : language === 'kg' ? 'Тайманбас' : 'Bold', icon: '🔥', desc: language === 'ru' ? 'Яркий и заметный' : language === 'kg' ? 'Ачык жана байкаларлык' : 'Bright and noticeable' },
        { value: 'business', label: language === 'ru' ? 'Деловой' : language === 'kg' ? 'Иштиктүү' : 'Business', icon: '🏢', desc: language === 'ru' ? 'Строгий и профессиональный' : language === 'kg' ? 'Катуу жана профессионалдуу' : 'Strict and professional' },
      ],
    },
    {
      key: 'material' as const,
      question: language === 'ru' ? 'Какой материал оправы предпочитаете?' : language === 'kg' ? 'Алкактын кайсы материалын жактырасыз?' : 'Preferred frame material?',
      subtitle: language === 'ru' ? 'Материал влияет на вес, комфорт и внешний вид' : language === 'kg' ? 'Материал салмагына, ыңгайлуулугуна жана көрүнүшүнө таасир этет' : 'Material affects weight, comfort, and appearance',
      options: [
        { value: 'metal', label: language === 'ru' ? 'Металл' : language === 'kg' ? 'Металл' : 'Metal', icon: '🔗', desc: language === 'ru' ? 'Тонкий и лёгкий' : language === 'kg' ? 'Ичке жана жеңил' : 'Thin and light' },
        { value: 'acetate', label: language === 'ru' ? 'Ацетат' : language === 'kg' ? 'Ацетат' : 'Acetate', icon: '🎨', desc: language === 'ru' ? 'Яркий и прочный' : language === 'kg' ? 'Ачык жана бышык' : 'Colorful and durable' },
        { value: 'combination', label: language === 'ru' ? 'Комбинированный' : language === 'kg' ? 'Комбинацияланган' : 'Combination', icon: '🔀', desc: language === 'ru' ? 'Лучшее из двух миров' : language === 'kg' ? 'Эки дүйнөнүн эң жакшысы' : 'Best of both worlds' },
        { value: 'titanium', label: language === 'ru' ? 'Титан' : language === 'kg' ? 'Титан' : 'Titanium', icon: '🪶', desc: language === 'ru' ? 'Ультралёгкий и прочный' : language === 'kg' ? 'Өтө жеңил жана бышык' : 'Ultralight and durable' },
      ],
    },
    {
      key: 'color' as const,
      question: language === 'ru' ? 'Какой цвет оправы вам нравится?' : language === 'kg' ? 'Алкактын кайсы түсү сизге жагат?' : 'Which frame color do you like?',
      subtitle: language === 'ru' ? 'Цвет оправы должен гармонировать с вашим тоном кожи' : language === 'kg' ? 'Алкактын түсү териңиздин түсү менен айкалышышы керек' : 'Frame color should harmonize with your skin tone',
      options: [
        { value: 'neutral', label: language === 'ru' ? 'Нейтральный' : language === 'kg' ? 'Нейтралдуу' : 'Neutral', icon: '⚫', desc: language === 'ru' ? 'Чёрный, серый, графит' : language === 'kg' ? 'Кара, боз, графит' : 'Black, gray, graphite' },
        { value: 'clear', label: language === 'ru' ? 'Прозрачный' : language === 'kg' ? 'Тунук' : 'Clear', icon: '💎', desc: language === 'ru' ? 'Crystal, прозрачный пластик' : language === 'kg' ? 'Кристалл, тунук пластик' : 'Crystal, clear plastic' },
        { value: 'colorful', label: language === 'ru' ? 'Цветной' : language === 'kg' ? 'Түстүү' : 'Colorful', icon: '🌈', desc: language === 'ru' ? 'Синий, зелёный, красный' : language === 'kg' ? 'Көк, жашыл, кызыл' : 'Blue, green, red' },
        { value: 'tortoise', label: language === 'ru' ? 'Черепаховый' : language === 'kg' ? 'Таш бака өңү' : 'Tortoise', icon: '🐆', desc: language === 'ru' ? 'Havana, коричневые узоры' : language === 'kg' ? 'Havana, күрөң оймолор' : 'Havana, brown patterns' },
      ],
    },
    {
      key: 'purpose' as const,
      question: language === 'ru' ? 'Для чего вам нужны очки?' : language === 'kg' ? 'Көз айнек эмне үчүн керек?' : 'What do you need glasses for?',
      subtitle: language === 'ru' ? 'Это определит тип линз и покрытий' : language === 'kg' ? 'Бул линзалардын түрүн жана каптоолорун аныктайт' : 'This will determine the lens type and coatings',
      options: [
        { value: 'vision', label: language === 'ru' ? 'Для зрения' : language === 'kg' ? 'Көрүү үчүн' : 'Vision', icon: '👓', desc: language === 'ru' ? 'Коррекция близорукости/дальнозоркости' : language === 'kg' ? 'Алысты/жакынды көрүүнү оңдоо' : 'Nearsightedness/farsightedness correction' },
        { value: 'sun', label: language === 'ru' ? 'Солнцезащитные' : language === 'kg' ? 'Күндөн коргоочу' : 'Sunglasses', icon: '🕶️', desc: language === 'ru' ? 'Защита от UV и яркого света' : language === 'kg' ? 'Ультрафиолеттен жана ачык жарыктан коргоо' : 'UV and bright light protection' },
        { value: 'computer', label: language === 'ru' ? 'Компьютерные' : language === 'kg' ? 'Компьютердик' : 'Computer', icon: '💻', desc: language === 'ru' ? 'Защита от синего света' : language === 'kg' ? 'Синий жарыктан коргоо' : 'Blue light protection' },
        { value: 'sport', label: language === 'ru' ? 'Спортивные' : language === 'kg' ? 'Спорттук' : 'Sport', icon: '🏃', desc: language === 'ru' ? 'Для активного образа жизни' : language === 'kg' ? 'Активдүү жашоо образы үчүн' : 'For active lifestyle' },
      ],
    },
  ], [language]);

  const step = quizSteps[currentStep - 1];
  const selectedValue = answers[step.key];

  const handleNext = () => {
    if (currentStep >= 6) {
      router.push('/quiz/results');
    } else {
      nextStep();
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-display font-semibold text-vizhu-purple">
              {currentStep} {t.quiz_progress_of} 6
            </span>
            <span className="text-sm text-muted-foreground">
              {t.quizTitle}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-vizhu-purple to-vizhu-orange rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
              {step.question}
            </h1>
            <p className="text-muted-foreground mb-8">{step.subtitle}</p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {step.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnswer(step.key, option.value)}
                  className={cn(
                    'p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02]',
                    selectedValue === option.value
                      ? 'border-vizhu-orange bg-vizhu-orange/5 shadow-md'
                      : 'border-border hover:border-vizhu-purple/30 bg-card'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <p className={cn(
                        'font-semibold text-base',
                        selectedValue === option.value && 'text-vizhu-orange'
                      )}>
                        {option.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5 font-light">{option.desc}</p>
                    </div>
                  </div>
                  {selectedValue === option.value && (
                    <div className="mt-2 flex justify-end">
                      <div className="w-6 h-6 bg-vizhu-orange rounded-full flex items-center justify-center shadow-lg shadow-vizhu-orange/20 animate-in zoom-in-0 duration-300">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all',
              currentStep === 1
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-foreground hover:bg-muted'
            )}
          >
            <ArrowLeft size={18} />
            {t.back}
          </button>

          <button
            onClick={skipStep}
            className="flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-foreground rounded-xl font-medium transition-all"
          >
            {t.skip}
            <SkipForward size={18} />
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-vizhu-purple hover:bg-vizhu-purple-dark text-white rounded-xl font-display font-semibold transition-all hover:scale-105"
          >
            {currentStep >= 6 ? t.results : t.next}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
