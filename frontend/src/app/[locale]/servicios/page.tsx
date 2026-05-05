import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ServicesContent from '@/components/services/ServicesContent';

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Servicios de desarrollo web, diseño gráfico, e-commerce, aplicaciones móviles y de escritorio. Soluciones digitales profesionales.',
};

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  return <ServicesContent />;
}
