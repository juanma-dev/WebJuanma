'use client';

import { TECH_STACK } from '@/lib/constants';
import styles from './TechMarquee.module.css';

export default function TechMarquee() {
  // Duplicate for seamless loop
  const items = [...TECH_STACK, ...TECH_STACK];

  return (
    <section className={styles.section}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {items.map((tech, i) => (
            <span key={`${tech}-${i}`} className={styles.item}>
              {tech}
              <span className={styles.dot}>•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
