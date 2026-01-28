import {
  AboutSection,
  AppPromoSection,
  ExclusiveDeals,
  Footer,
  Header,
  HeroSection,
  NewsletterSection,
  PartnerSection,
  PopularCategories,
  PopularRestaurants,
  TestimonialsSection,
} from "@/components/home";

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <main>
        <HeroSection />
        <ExclusiveDeals />
        <PopularCategories />
        <PopularRestaurants />
        <AppPromoSection />
        <PartnerSection />
        <TestimonialsSection />
        <AboutSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
