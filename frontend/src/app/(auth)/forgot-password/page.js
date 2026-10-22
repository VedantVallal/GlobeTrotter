'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowLeft, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authService } from '@/lib/services';
import styles from '../auth.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendPasswordReset(email);
      setSubmittedEmail(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.centeredCardWrapper}>
      <div className={styles.centeredCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gt-space-2)', marginBottom: 'var(--gt-space-6)', color: 'var(--gt-blue)' }}>
          <Globe size={24} />
          <span style={{ fontWeight: 700, fontSize: '18px' }}>GlobeTrotter</span>
        </div>

        {!isSubmitted ? (
          <div>
            <h1 className={styles.title} style={{ fontSize: 'var(--gt-text-xl)', marginBottom: 'var(--gt-space-2)' }}>
              Forgot your password?
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: 'var(--gt-space-6)' }}>
              No worries! Enter your email and we'll send you instructions to reset it.
            </p>

            {error && (
              <div className={styles.alertBanner} role="alert" style={{ marginBottom: 'var(--gt-space-4)' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <Input
                id="reset-email"
                label="Email address"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                leftIcon={<Mail size={16} />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                style={{ width: '100%', marginTop: 'var(--gt-space-2)' }}
              >
                Send Reset Link
              </Button>
            </form>

            <div style={{ marginTop: 'var(--gt-space-6)', textAlign: 'center' }}>
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--gt-space-2)',
                  fontSize: 'var(--gt-text-sm)',
                  color: 'var(--gt-text-secondary)',
                  fontWeight: 'var(--gt-font-medium)',
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to login</span>
              </Link>
            </div>

            <div className={styles.demoNote}>
              <strong>Demo notice:</strong> In prototype mode, any valid email triggers the success confirmation.
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--gt-success-bg)',
                color: 'var(--gt-success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--gt-space-4)',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h1 className={styles.title} style={{ fontSize: 'var(--gt-text-xl)', marginBottom: 'var(--gt-space-2)' }}>
              Check your inbox
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: 'var(--gt-space-6)' }}>
              We've dispatched password reset instructions to{' '}
              <strong style={{ color: 'var(--gt-text-primary)' }}>{submittedEmail}</strong>.
            </p>

            <Button
              variant="outline"
              size="md"
              style={{ width: '100%', marginBottom: 'var(--gt-space-4)' }}
              onClick={() => setIsSubmitted(false)}
            >
              Resend email
            </Button>

            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--gt-space-2)',
                fontSize: 'var(--gt-text-sm)',
                color: 'var(--gt-blue)',
                fontWeight: 'var(--gt-font-semibold)',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to sign in</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
