import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ServicesPreview from '@/components/home/ServicesPreview';
import CTABanner from '@/components/home/CTABanner';
import ReviewsSection from '@/components/home/ReviewsSection';

import MobileHomeView from '@/components/home/MobileHomeView';

export default function HomePage() {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <HeroSection />
        <FeaturedProducts />
        <ServicesPreview />
        <ReviewsSection />
        <CTABanner />
      </div>

      {/* Mobile View */}
      <MobileHomeView />
    </>
  );
}
