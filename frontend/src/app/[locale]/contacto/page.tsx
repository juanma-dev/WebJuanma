import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos para tu próximo proyecto web. Formulario de contacto, WhatsApp y más.',
};

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  return <ContactContent />;
}
