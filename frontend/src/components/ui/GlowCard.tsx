'use client';

import { motion } from 'framer-motion';
import styles from './GlowCard.module.css';

interface GlowCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  index?: number;
  color?: 'orange' | 'blue' | 'green';
  children?: React.ReactNode;
}

export default function GlowCard({ icon: Icon, title, description, index = 0, color = 'blue', children }: GlowCardProps) {
  return (
    <motion.div
      className={`${styles.card} ${styles[color]}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <div className={styles.iconWrapper}>
        <Icon size={24} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {children}
      <div className={styles.glowEffect} />
    </motion.div>
  );
}
