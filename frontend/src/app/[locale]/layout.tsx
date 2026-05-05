import type { Metadata } from "next";
import "../../styles/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: "WebJuanma — Desarrollo & Diseño Web Profesional",
    template: "%s | WebJuanma"
  },
  description: "Impulsa tu negocio con WebJuanma. Especialistas en desarrollo y diseño web, creamos soluciones digitales que transforman tu presencia online.",
  keywords: ["desarrollo web", "diseño web", "aplicaciones web", "Colombia", "WebJuanma", "web development"],
  authors: [{ name: "Juan Ma" }],
  openGraph: {
    title: "WebJuanma — Desarrollo & Diseño Web Profesional",
    description: "Transformamos ideas en experiencias digitales excepcionales.",
    url: "https://webjuanma.com",
    siteName: "WebJuanma",
    locale: "es_CO",
    type: "website",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
