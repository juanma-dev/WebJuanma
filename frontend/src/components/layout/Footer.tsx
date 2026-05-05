'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/nosotros`, label: tNav('about') },
    { href: `/${locale}/servicios`, label: tNav('services') },
    { href: `/${locale}/contacto`, label: tNav('contact') },
  ];

  const serviceLinks = [
    locale === 'es' ? 'Diseño Web' : 'Web Design',
    locale === 'es' ? 'E-Commerce' : 'E-Commerce',
    locale === 'es' ? 'Aplicaciones Web' : 'Web Applications',
    locale === 'es' ? 'Apps Móviles' : 'Mobile Apps',
    locale === 'es' ? 'Apps de Escritorio' : 'Desktop Apps',
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.gradientLine} />
      <div className={`container ${styles.content}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <a href={`/${locale}`} className={styles.logo}>
              <span className={styles.logoBrace}>{'{'}</span>
              <span className={styles.logoW}>w</span>
              <span className={styles.logoJ}>J</span>
              <span className={styles.logoBrace}>{'}'}</span>
              <span className={styles.logoText}>WebJuanma</span>
            </a>
            <p className={styles.description}>{t('description')}</p>
            <a
              href="https://wa.me/573150533698"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsapp}
            >
              <MessageCircle size={18} />
              <span>315-053-3698</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{t('quickLinks')}</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.footerLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{t('services')}</h4>
            <ul className={styles.linkList}>
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a href={`/${locale}/servicios`} className={styles.footerLink}>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{t('contact')}</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="mailto:websjuanma@gmail.com" className={styles.footerLink}>
                  websjuanma@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/573150533698" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
                  +57 315-053-3698
                </a>
              </li>
              <li>
                <span className={styles.footerLink}>Colombia 🇨🇴</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>© {year} WebJuanma. {t('rights')}</p>
          <p>{t('madeBy')} <span className={styles.madeByName}>Juan Ma</span></p>
        </div>
      </div>
    </footer>
  );
}
