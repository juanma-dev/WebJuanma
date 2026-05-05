'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles, Briefcase, FolderCheck, Layers } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/constants';
import styles from './Hero.module.css';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className={styles.hero}>
      {/* Animated background */}
      <div className={styles.bgWrapper}>
        <div className="grid-bg" />
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>

      <div className={`container ${styles.content}`}>
        {/* Badge */}
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Sparkles size={14} />
          <span>{t('badge')}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('title1')}
          <br />
          <span className={styles.gradientText}>{t('title2')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
          >
            <MessageCircle size={18} />
            {t('cta1')}
          </a>
          <a href={`/${locale}/servicios`} className={styles.ctaSecondary}>
            {t('cta2')}
            <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Stats — single card with 3 items inside */}
        <motion.div
          className={styles.statsCard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className={styles.stat}>
            <div className={`${styles.statIcon} ${styles.orange}`}>
              <Briefcase size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>5+</span>
              <span className={styles.statLabel}>
                {locale === 'es' ? 'Años de experiencia' : 'Years of experience'}
              </span>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.stat}>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <FolderCheck size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>
                {locale === 'es' ? 'Proyectos completados' : 'Completed projects'}
              </span>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.stat}>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <Layers size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>
                {locale === 'es' ? 'Servicios disponibles' : 'Available services'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
