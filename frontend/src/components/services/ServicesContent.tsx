'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, PenTool, Globe, Search, Target, HeadphonesIcon } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { SERVICE_ICONS, SERVICE_KEYS, WHATSAPP_URL } from '@/lib/constants';
import CTASection from '@/components/home/CTASection';
import styles from './ServicesContent.module.css';

const COLORS: ('orange' | 'blue' | 'green')[] = ['orange', 'blue', 'green'];

const processSteps = [
  { key: 'consult', icon: MessageSquare },
  { key: 'design', icon: PenTool },
  { key: 'develop', icon: Globe },
  { key: 'test', icon: Search },
  { key: 'launch', icon: Target },
  { key: 'support', icon: HeadphonesIcon },
];

export default function ServicesContent() {
  const t = useTranslations('services');
  const tProcess = useTranslations('process');
  const locale = useLocale();

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
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

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className={styles.servicesGrid}>
            {SERVICE_KEYS.map((key, i) => {
              const Icon = SERVICE_ICONS[key];
              const color = COLORS[i % 3];
              const isPerYear = key === 'maintenance';

              return (
                <motion.div
                  key={key}
                  className={`${styles.serviceCard} ${styles[color]}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.iconWrapper}>
                      <Icon size={24} />
                    </div>
                    <h3 className={styles.serviceName}>{t(`items.${key}.name`)}</h3>
                  </div>
                  <p className={styles.serviceDesc}>{t(`items.${key}.description`)}</p>
                  <div className={styles.priceRow}>
                    <div className={styles.prices}>
                      <span className={styles.from}>{t('from')}</span>
                      <span className={styles.priceCOP}>{t(`items.${key}.priceCOP`)}</span>
                      <span className={styles.priceUSD}>{t(`items.${key}.priceUSD`)}</span>
                      {isPerYear && <span className={styles.perYear}>{t('perYear')}</span>}
                    </div>
                  </div>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.serviceBtn}
                  >
                    {t('cta')}
                    <ArrowRight size={14} />
                  </a>
                  <div className={styles.glowEffect} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <SectionHeading title={tProcess('title')} subtitle={tProcess('subtitle')} />
          <div className={styles.processGrid}>
            {processSteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  className={styles.processStep}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className={styles.processNumber}>{String(i + 1).padStart(2, '0')}</div>
                  <div className={styles.processIcon}>
                    <StepIcon size={22} />
                  </div>
                  <h4>{tProcess(`steps.${step.key}.title`)}</h4>
                  <p>{tProcess(`steps.${step.key}.description`)}</p>
                  {i < processSteps.length - 1 && <div className={styles.processLine} />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
