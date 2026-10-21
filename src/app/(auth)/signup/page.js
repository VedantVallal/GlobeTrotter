'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/services';
import styles from '../auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Calculate password strength (0-4)
  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Empty' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const textMap = ['Weak', 'Fair', 'Good', 'Strong'];
    return {
      score,
      text: textMap[Math.min(score - 1, 3)] || 'Weak',
    };
  };

  const strength = calculateStrength(password);

  const getStrengthBarColor = (index) => {
    if (index >= strength.score) return 'var(--gt-border)';
    if (strength.score === 1) return 'var(--gt-error)';
    if (strength.score === 2) return 'var(--gt-warning)';
    if (strength.score === 3) return '#eab308';
    return 'var(--gt-success)';
  };

  const validateField = (field, val) => {
    const newErrors = { ...errors };
    if (field === 'name') {
      if (!val || val.trim().length < 2) {
        newErrors.name = 'Full name must be at least 2 characters';
      } else {
        delete newErrors.name;
      }
    }
    if (field === 'email') {
      if (!val) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }
    if (field === 'password') {
      if (!val) {
        newErrors.password = 'Password is required';
      } else if (val.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else {
        delete newErrors.password;
      }
    }
    if (field === 'confirmPassword') {
      if (val !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    if (!name || name.trim().length < 2) newErrors.name = 'Full name must be at least 2 characters';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.terms = 'You must agree to the Terms & Privacy Policy';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.signUp({ email, password, name });
      if (res?.user) {
        setUser(res.user);
      }
      router.push('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authSplit}>
      {/* Left Visual Hero */}
      <div className={styles.visualSide}>
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop&q=80"
          alt="Scenic mountain road"
          className={styles.visualBg}
        />
        <div className={styles.visualOverlay} />

        <div className={styles.visualTop}>
          <div className={styles.brandPill}>
            <Globe size={18} color="#4169D8" />
            <span>GlobeTrotter</span>
          </div>
        </div>

        <div className={styles.visualBottom}>
          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>
              “Stop juggling twenty browser tabs and messy spreadsheets. GlobeTrotter turns multi-city route planning into visual art.”
            </p>
            <div className={styles.quoteAuthor}>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format"
                alt="Marcus Vance"
                className={styles.authorAvatar}
              />
              <div>
                <div className={styles.authorName}>Marcus Vance</div>
                <div className={styles.authorRole}>Solo Backpacker & Explorer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.mobileBrand}>
            <Globe size={24} />
            <span>GlobeTrotter</span>
          </div>

          <div className={styles.formHeader}>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>Join thousands of travelers crafting memorable journeys</p>
          </div>

          {serverError && (
            <div className={styles.alertBanner} role="alert" style={{ marginBottom: 'var(--gt-space-4)' }}>
              <AlertCircle size={18} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <Input
              id="signup-name"
              label="Full name"
              type="text"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => validateField('name', name)}
              error={errors.name}
              required
            />

            <Input
              id="signup-email"
              label="Email address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField('email', email)}
              error={errors.email}
              required
            />

            <div>
              <Input
                id="signup-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
                error={errors.password}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {password && (
                <div className={styles.strengthContainer} style={{ marginTop: 'var(--gt-space-2)' }}>
                  <div className={styles.strengthBars}>
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={styles.strengthBar}
                        style={{ backgroundColor: getStrengthBarColor(idx) }}
                      />
                    ))}
                  </div>
                  <span className={styles.strengthText}>Strength: {strength.text}</span>
                </div>
              )}
            </div>

            <Input
              id="signup-confirm-password"
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => validateField('confirmPassword', confirmPassword)}
              error={errors.confirmPassword}
              required
            />

            <div>
              <label className={styles.rememberMe} style={{ alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (e.target.checked) {
                      const nextErr = { ...errors };
                      delete nextErr.terms;
                      setErrors(nextErr);
                    }
                  }}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  I agree to GlobeTrotter's{' '}
                  <span style={{ color: 'var(--gt-blue)' }}>Terms of Service</span> and{' '}
                  <span style={{ color: 'var(--gt-blue)' }}>Privacy Policy</span>
                </span>
              </label>
              {errors.terms && (
                <span role="alert" style={{ color: 'var(--gt-error)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.terms}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              style={{ width: '100%', marginTop: 'var(--gt-space-2)' }}
            >
              Create Account
            </Button>
          </form>

          <p className={styles.footerText}>
            Already have an account?
            <Link href="/login" className={styles.footerLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
