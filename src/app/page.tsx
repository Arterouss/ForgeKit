'use client';

import {
  AnimatedGrid,
  HeroSection,
  FeaturesSection,
  ToolPreviewSection,
  WorkspacePreview,
  ComparisonSection,
  StatsSection,
  OpenSourceSection,
  TestimonialsSection,
  FAQSection,
  Footer,
  EasterEggs,
} from '@/components/landing';

export default function LandingPage() {
  return (
    <>
      <AnimatedGrid />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ToolPreviewSection />
        <WorkspacePreview />
        <ComparisonSection />
        <StatsSection />
        <OpenSourceSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
      <EasterEggs />
    </>
  );
}
