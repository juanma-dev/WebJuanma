import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce a WebJuanma — equipo especializado en desarrollo y diseño web con más de 5 años de experiencia.',
};

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  return <AboutContent />;
}
