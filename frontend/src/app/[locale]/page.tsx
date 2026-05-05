import { unstable_setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import ServicesGrid from '@/components/home/ServicesGrid';
import AboutPreview from '@/components/home/AboutPreview';
import TechMarquee from '@/components/home/TechMarquee';
import CTASection from '@/components/home/CTASection';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServicesGrid />
      <AboutPreview />
      <TechMarquee />
      <CTASection />
    </>
  );
}
