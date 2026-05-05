'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, MapPin, Clock, ChevronDown, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/lib/api';
import { WHATSAPP_URL, CONTACT_EMAIL } from '@/lib/constants';
import styles from './ContactContent.module.css';

export default function ContactContent() {
  const t = useTranslations('contact');
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await submitContactForm(form);
      if (res.success) {
        setStatus('success');
        setForm({ name: '', phone: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
  ];

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

      {/* Contact Section */}
      <section className="section">
        <div className={`container ${styles.contactGrid}`}>
          {/* Info Side */}
          <motion.div
            className={styles.infoSide}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.green}`}>
                <MessageCircle size={22} />
              </div>
              <div>
                <h4>{t('info.whatsapp')}</h4>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  315-053-3698
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.blue}`}>
                <Mail size={22} />
              </div>
              <div>
                <h4>{t('info.email')}</h4>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.orange}`}>
                <MapPin size={22} />
              </div>
              <div>
                <h4>{t('info.location')}</h4>
                <span>{t('info.locationValue')} 🇨🇴</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={`${styles.infoIcon} ${styles.blue}`}>
                <Clock size={22} />
              </div>
              <div>
                <h4>{t('info.schedule')}</h4>
                <span>{t('info.scheduleValue')}</span>
              </div>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBig}
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
          </motion.div>

          {/* Form Side */}
          <motion.form
            className={styles.formSide}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.fieldGroup}>
              <label htmlFor="contact-name">{t('form.name')}</label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="contact-phone">{t('form.phone')}</label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="contact-email">{t('form.email')}</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="contact-message">{t('form.message')}</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={styles.textarea}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>{t('form.sending')}</>
              ) : (
                <>
                  <Send size={16} />
                  {t('form.submit')}
                </>
              )}
            </button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  className={`${styles.statusMsg} ${styles.success}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle size={16} />
                  {t('form.success')}
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  className={`${styles.statusMsg} ${styles.error}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AlertCircle size={16} />
                  {t('form.error')}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <h2 className={styles.faqTitle}>{t('faq.title')}</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`${styles.faqItem} ${openFaq === i ? styles.open : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={styles.faqChevron} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
