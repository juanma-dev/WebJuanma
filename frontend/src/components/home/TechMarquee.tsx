'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { TECH_STACK, type TechItem } from '@/lib/constants';
import styles from './TechMarquee.module.css';

const SPEED_PX_PER_SEC = 32;
const DRAG_THRESHOLD_PX = 4;
const FLICK_VELOCITY_CAP = 2200;

const wrapValue = (min: number, max: number, v: number): number => {
  const range = max - min;
  if (range <= 0) return min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function TechMarquee() {
  const baseX = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const halfWidth = useRef(0);

  const dragging = useRef(false);
  const dragStart = useRef({ pointerX: 0, baseX: 0 });
  const lastSample = useRef({ time: 0, x: 0 });
  const velocity = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  // Wrap baseX to a smooth, infinitely-cycling translateX
  const x = useTransform(baseX, (v) => {
    const w = halfWidth.current;
    if (!w) return '0px';
    return `${wrapValue(-w, 0, v)}px`;
  });

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        halfWidth.current = trackRef.current.scrollWidth / 2;
      }
    };
    measure();
    // Re-measure after fonts and remote logos resolve
    const t1 = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 600);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Auto-scroll left at constant speed; flick momentum decays
  useAnimationFrame((_t, delta) => {
    if (dragging.current) return;
    const dt = delta / 1000;

    let move = -SPEED_PX_PER_SEC * dt;
    if (Math.abs(velocity.current) > 1) {
      move += velocity.current * dt;
      velocity.current *= 0.92;
    }
    baseX.set(baseX.get() + move);
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    velocity.current = 0;
    dragStart.current = { pointerX: e.clientX, baseX: baseX.get() };
    lastSample.current = { time: performance.now(), x: e.clientX };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.pointerX;

    if (!isDragging && Math.abs(dx) > DRAG_THRESHOLD_PX) setIsDragging(true);

    baseX.set(dragStart.current.baseX + dx);

    const now = performance.now();
    const dt = now - lastSample.current.time;
    if (dt > 0) {
      const raw = ((e.clientX - lastSample.current.x) / dt) * 1000;
      velocity.current = Math.max(-FLICK_VELOCITY_CAP, Math.min(FLICK_VELOCITY_CAP, raw));
    }
    lastSample.current = { time: now, x: e.clientX };
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  // Two copies for seamless wrap
  const items = [...TECH_STACK, ...TECH_STACK];

  return (
    <section className={styles.section}>
      <div
        className={`${styles.marqueeWrapper} ${isDragging ? styles.grabbing : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        role="region"
        aria-label="Stack tecnológico"
      >
        <motion.div ref={trackRef} className={styles.marqueeTrack} style={{ x }}>
          {items.map((tech, i) => (
            <TechCard key={`${tech.name}-${i}`} tech={tech} disabled={isDragging} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TechCard({ tech, disabled }: { tech: TechItem; disabled: boolean }) {
  const [spinning, setSpinning] = useState(false);

  const handleEnter = () => {
    if (disabled || spinning) return;
    setSpinning(true);
  };

  return (
    <div
      className={`${styles.item} ${disabled ? styles.itemNoHover : ''}`}
      onMouseEnter={handleEnter}
    >
      <motion.div
        className={styles.iconWrap}
        animate={{ rotate: spinning ? -720 : 0 }}
        transition={
          spinning
            ? { duration: 1, ease: [0.65, 0, 0.35, 1] }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (spinning) setSpinning(false);
        }}
      >
        <TechLogo tech={tech} />
      </motion.div>
      <span className={styles.name}>{tech.name}</span>
    </div>
  );
}

function TechLogo({ tech }: { tech: TechItem }) {
  if (tech.slug === 'custom:axum') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.icon}
        role="img"
        aria-label="Axum"
      >
        <path d="M12 2.2 21.5 7.6 V16.4 L12 21.8 L2.5 16.4 V7.6 Z" />
        <path d="M7.6 16.6 L12 7.4 L16.4 16.6" strokeWidth={2} />
        <path d="M9.2 13.4 H14.8" strokeWidth={2} />
      </svg>
    );
  }

  if (tech.slug.startsWith('local:')) {
    const file = tech.slug.split(':')[1];
    // Recolor a local SVG via mask-image so we can match brand color cleanly
    return (
      <span
        className={`${styles.icon} ${styles.maskedIcon}`}
        role="img"
        aria-label={tech.name}
        style={{
          backgroundColor: `#${tech.color}`,
          WebkitMaskImage: `url(/tech/${file}.svg)`,
          maskImage: `url(/tech/${file}.svg)`,
        }}
      />
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
      alt={`${tech.name} logo`}
      className={styles.icon}
      draggable={false}
      width={48}
      height={48}
      loading="lazy"
    />
  );
}
