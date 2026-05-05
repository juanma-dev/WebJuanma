'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Target, Sparkles, Lightbulb, HeadphonesIcon, Eye, Rocket, Shield, Heart, Users, MessageCircle } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import CTASection from '@/components/home/CTASection';
import styles from './AboutContent.module.css';

const whyCards = [
  { key: 'experience', icon: Target, color: 'orange' as const },
  { key: 'custom', icon: Sparkles, color: 'blue' as const },
  { key: 'innovation', icon: Lightbulb, color: 'green' as const },
  { key: 'support', icon: HeadphonesIcon, color: 'orange' as const },
];

const valuesIcons = [Lightbulb, Shield, Heart, Users, Sparkles];

export default function AboutContent() {
  const t = useTranslations('about');
  const locale = useLocale();

  const valuesItems: string[] = t.raw('values.items');

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            WebJuanma
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* About Story */}
      <section className="section">
        <div className="container">
          <motion.div
            className={styles.storyBlock}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className={styles.storyText}>{t('description')}</p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <SectionHeading title={t('whyTitle')} subtitle={t('whySubtitle')} />
          <div className={styles.whyGrid}>
            {whyCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.key}
                  className={`${styles.whyCard} ${styles[card.color]}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={styles.whyIcon}><Icon size={24} /></div>
                  <h3>{t(`${card.key}.title`)}</h3>
                  <p>{t(`${card.key}.description`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section">
        <div className="container">
          <div className={styles.mvvGrid}>
            {/* Mission */}
            <motion.div
              className={`${styles.mvvCard} ${styles.orange}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.mvvIcon}><Rocket size={28} /></div>
              <h3>{t('mission.title')}</h3>
              <p>{t('mission.description')}</p>
            </motion.div>

            {/* Vision */}
            <motion.div
              className={`${styles.mvvCard} ${styles.blue}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className={styles.mvvIcon}><Eye size={28} /></div>
              <h3>{t('vision.title')}</h3>
              <p>{t('vision.description')}</p>
            </motion.div>

            {/* Values */}
            <motion.div
              className={`${styles.mvvCard} ${styles.green} ${styles.valuesCard}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3>{t('values.title')}</h3>
              <div className={styles.valuesList}>
                {valuesItems.map((value: string, i: number) => {
                  const VIcon = valuesIcons[i];
                  return (
                    <div key={value} className={styles.valueItem}>
                      <VIcon size={16} />
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
