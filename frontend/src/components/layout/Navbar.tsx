'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Globe } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/servicios`, label: t('services') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        {/* Logo */}
        <a href={`/${locale}`} className={styles.logo} aria-label="WebJuanma Home">
          <span className={styles.logoBrace}>{'{'}</span>
          <span className={styles.logoW}>w</span>
          <span className={styles.logoJ}>J</span>
          <span className={styles.logoBrace}>{'}'}</span>
        </a>

        {/* Desktop Links */}
        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  className={styles.activeIndicator}
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Right side: Lang + CTA */}
        <div className={styles.rightSection}>
          <button
            onClick={switchLocale}
            className={styles.langSwitch}
            aria-label="Switch language"
          >
            <Globe size={16} />
            <span>{locale === 'es' ? 'EN' : 'ES'}</span>
          </button>
          <a
            href="https://wa.me/573150533698"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <MessageCircle size={16} />
            <span>{t('cta')}</span>
          </a>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={`${styles.mobileLink} ${isActive(link.href) ? styles.active : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <div className={styles.mobileActions}>
              <button onClick={switchLocale} className={styles.langSwitchMobile}>
                <Globe size={16} />
                {locale === 'es' ? 'English' : 'Español'}
              </button>
              <a
                href="https://wa.me/573150533698"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaButtonMobile}
              >
                <MessageCircle size={16} />
                {t('cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
