'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Mail, MapPin, Clock, ChevronDown, Send,
  CheckCircle, AlertCircle, Info, Loader2,
} from 'lucide-react';
import { submitContactForm, type ContactErrorCode, type ContactSuccessCode } from '@/lib/api';
import { WHATSAPP_URL, CONTACT_EMAIL } from '@/lib/constants';
import styles from './ContactContent.module.css';

type FormState = { name: string; phone: string; email: string; message: string };

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; code: ContactSuccessCode }
  | { kind: 'error'; code: ContactErrorCode };

const MESSAGE_MAX = 2000;

const FIELD_ERROR_KEYS: Record<string, string> = {
  name_required: 'name_required',
  phone_invalid: 'phone_invalid',
  email_invalid: 'email_invalid',
  message_required: 'message_required',
};

export default function ContactContent() {
  const t = useTranslations('contact');
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);

  // Scroll status banner into view when it appears (success or error)
  useEffect(() => {
    if (status.kind === 'success' || status.kind === 'error') {
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [status]);

  // Clear a field's error as the user edits it
  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (status.kind === 'error' || status.kind === 'success') {
      setStatus({ kind: 'idle' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: 'sending' });
    setFieldErrors({});

    const result = await submitContactForm({ ...form, website: honeypot });

    if (result.ok) {
      setStatus({ kind: 'success', code: result.code });
      setForm({ name: '', phone: '', email: '', message: '' });
      setHoneypot('');
      return;
    }

    if (result.code === 'validation' && result.fieldErrors) {
      const mapped: Record<string, string> = {};
      for (const [field, code] of Object.entries(result.fieldErrors)) {
        mapped[field] = FIELD_ERROR_KEYS[code] ?? code;
      }
      setFieldErrors(mapped);
      // Focus first invalid field (preserve tab order)
      const order: (keyof FormState)[] = ['name', 'phone', 'email', 'message'];
      const first = order.find((f) => mapped[f]);
      if (first) {
        requestAnimationFrame(() => {
          document.getElementById(`contact-${first}`)?.focus();
        });
      }
    }
    setStatus({ kind: 'error', code: result.code });
  };

  const fieldErrorKey = (field: keyof FormState) => fieldErrors[field];

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
  ];

  return (
    <>
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

      <section className="section">
        <div className={`container ${styles.contactGrid}`}>
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

          <motion.form
            className={styles.formSide}
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Honeypot — hidden from real users, harvested by bots */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <Field
              id="contact-name"
              label={t('form.name')}
              required
              errorKey={fieldErrorKey('name')}
              t={t}
            >
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                aria-invalid={!!fieldErrorKey('name')}
                aria-required="true"
                className={`${styles.input} ${fieldErrorKey('name') ? styles.inputError : ''}`}
                autoComplete="name"
              />
            </Field>

            <div className={styles.fieldRow}>
              <Field
                id="contact-phone"
                label={t('form.phone')}
                required
                errorKey={fieldErrorKey('phone')}
                t={t}
              >
                <input
                  id="contact-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  aria-invalid={!!fieldErrorKey('phone')}
                  aria-required="true"
                  className={`${styles.input} ${fieldErrorKey('phone') ? styles.inputError : ''}`}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </Field>

              <Field
                id="contact-email"
                label={t('form.email')}
                required
                errorKey={fieldErrorKey('email')}
                t={t}
              >
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  aria-invalid={!!fieldErrorKey('email')}
                  aria-required="true"
                  className={`${styles.input} ${fieldErrorKey('email') ? styles.inputError : ''}`}
                  autoComplete="email"
                  inputMode="email"
                />
              </Field>
            </div>

            <Field
              id="contact-message"
              label={t('form.message')}
              required
              errorKey={fieldErrorKey('message')}
              t={t}
              hint={
                <span className={styles.charCounter}>
                  {form.message.length}/{MESSAGE_MAX}
                </span>
              }
            >
              <textarea
                id="contact-message"
                rows={5}
                value={form.message}
                maxLength={MESSAGE_MAX}
                onChange={(e) => updateField('message', e.target.value)}
                aria-invalid={!!fieldErrorKey('message')}
                aria-required="true"
                className={`${styles.textarea} ${fieldErrorKey('message') ? styles.inputError : ''}`}
              />
            </Field>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status.kind === 'sending'}
            >
              {status.kind === 'sending' ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  {t('form.sending')}
                </>
              ) : (
                <>
                  <Send size={16} />
                  {t('form.submit')}
                </>
              )}
            </button>

            <div ref={statusRef}>
              <AnimatePresence mode="wait">
                {status.kind === 'success' && (
                  <StatusBanner
                    key={`success-${status.code}`}
                    variant={status.code === 'savedPending' ? 'info' : 'success'}
                    title={t(`form.status.success.${status.code}.title`)}
                    body={t(`form.status.success.${status.code}.body`)}
                  />
                )}
                {status.kind === 'error' && (
                  <StatusBanner
                    key={`error-${status.code}`}
                    variant="error"
                    title={t(`form.status.error.${status.code}.title`)}
                    body={t(`form.status.error.${status.code}.body`)}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </section>

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
                  type="button"
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

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  errorKey?: string;
  hint?: React.ReactNode;
  t: ReturnType<typeof useTranslations>;
  children: React.ReactNode;
}

function Field({ id, label, required, errorKey, hint, t, children }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.labelRow}>
        <label htmlFor={id}>
          {label}
          {required && <span className={styles.requiredMark} aria-hidden="true">*</span>}
        </label>
        {hint}
      </div>
      {children}
      {errorKey && (
        <span className={styles.fieldError} role="alert">
          <AlertCircle size={13} />
          {t(`form.fieldErrors.${errorKey}`)}
        </span>
      )}
    </div>
  );
}

function StatusBanner({
  variant,
  title,
  body,
}: {
  variant: 'success' | 'info' | 'error';
  title: string;
  body: string;
}) {
  const Icon = variant === 'success' ? CheckCircle : variant === 'info' ? Info : AlertCircle;
  return (
    <motion.div
      className={`${styles.statusMsg} ${styles[variant]}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon size={20} className={styles.statusIcon} />
      <div className={styles.statusBody}>
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
    </motion.div>
  );
}
