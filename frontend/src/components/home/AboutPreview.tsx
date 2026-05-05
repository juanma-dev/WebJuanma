'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './AboutPreview.module.css';

export default function AboutPreview() {
  const t = useTranslations('about');
  const locale = useLocale();

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <motion.div
          className={styles.textSide}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.label}>WebJuanma</span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.description}>{t('description')}</p>
          <a href={`/${locale}/nosotros`} className={styles.link}>
            {locale === 'es' ? 'Conocer más' : 'Learn more'}
            <ArrowRight size={16} />
          </a>
        </motion.div>

        <motion.div
          className={styles.visualSide}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Abstract visual element */}
          <div className={styles.visualGrid}>
            <div className={`${styles.visualCard} ${styles.v1}`}>
              <span className={styles.vNumber}>5+</span>
              <span className={styles.vLabel}>{locale === 'es' ? 'Años' : 'Years'}</span>
            </div>
            <div className={`${styles.visualCard} ${styles.v2}`}>
              <span className={styles.vNumber}>50+</span>
              <span className={styles.vLabel}>{locale === 'es' ? 'Proyectos' : 'Projects'}</span>
            </div>
            <div className={`${styles.visualCard} ${styles.v3}`}>
              <span className={styles.vNumber}>100%</span>
              <span className={styles.vLabel}>{locale === 'es' ? 'Compromiso' : 'Commitment'}</span>
            </div>
            <div className={`${styles.visualCard} ${styles.v4}`}>
              <span className={styles.vNumber}>24/7</span>
              <span className={styles.vLabel}>{locale === 'es' ? 'Soporte' : 'Support'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
