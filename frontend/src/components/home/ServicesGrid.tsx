'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { SERVICE_ICONS, SERVICE_KEYS } from '@/lib/constants';
import styles from './ServicesGrid.module.css';

const COLORS: ('orange' | 'blue' | 'green')[] = ['orange', 'blue', 'green'];

export default function ServicesGrid() {
  const t = useTranslations('services');

  // Show only first 8 on homepage
  const homeServices = SERVICE_KEYS.slice(0, 8);

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />

        <div className={styles.grid}>
          {homeServices.map((key, i) => {
            const Icon = SERVICE_ICONS[key];
            const color = COLORS[i % 3];

            return (
              <motion.div
                key={key}
                className={`${styles.card} ${styles[color]}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={22} />
                </div>
                <h3 className={styles.cardTitle}>{t(`items.${key}.name`)}</h3>
                <p className={styles.cardDesc}>{t(`items.${key}.description`)}</p>
                <div className={styles.glowEffect} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
