'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/services';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, loginDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validateField = (field, val) => {
    const newErrors = { ...errors };
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
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Trigger validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email address';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.signIn(email, password);
      if (res?.user) {
        setUser(res.user);
        router.push('/dashboard');
      }
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Try demo credentials below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoExplorer = async () => {
    setIsLoading(true);
    setServerError('');
    try {
      if (typeof loginDemoUser === 'function') {
        loginDemoUser();
      } else {
        const res = await authService.login('demo@globetrotter.app', 'password123');
        if (res?.user) {
          setUser(res.user);
        }
      }
      router.push('/dashboard');
    } catch (err) {
      console.error('Instant Demo Explorer error:', err);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@globetrotter.app');
    setPassword('password123');
    setErrors({});
    setServerError('');
  };

  return (
    <div className={styles.authSplit}>
      {/* Left Visual Hero */}
      <div className={styles.visualSide}>
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80"
          alt="Tropical paradise"
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
              “GlobeTrotter completely changed how I plan expeditions. Connecting stops node-by-node keeps every budget and flight crystal clear.”
            </p>
            <div className={styles.quoteAuthor}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format"
                alt="Elena Rostova"
                className={styles.authorAvatar}
              />
              <div>
                <div className={styles.authorName}>Elena Rostova</div>
                <div className={styles.authorRole}>Nomadic Travel Photographer</div>
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
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Enter your credentials to continue your journey</p>
          </div>

          {serverError && (
            <div className={styles.alertBanner} role="alert" style={{ marginBottom: 'var(--gt-space-4)' }}>
              <AlertCircle size={18} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField('email', email)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div>
              <Input
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
                error={errors.password}
                required
                autoComplete="current-password"
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
            </div>

            <div className={styles.formRow}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              style={{ width: '100%', marginTop: 'var(--gt-space-2)' }}
            >
              Sign in to GlobeTrotter
            </Button>

            <div className={styles.divider}>or</div>

            <button
              type="button"
              className={styles.demoExplorerBtn}
              onClick={handleInstantDemoExplorer}
              disabled={isLoading}
            >
              <Sparkles size={16} color="var(--gt-blue)" />
              <span>⚡ Instant Demo Explorer (1-Click)</span>
            </button>

            <button
              type="button"
              className={styles.socialBtn}
              onClick={fillDemoCredentials}
              style={{ marginTop: 'var(--gt-space-2)', fontSize: 'var(--gt-text-xs)' }}
            >
              <span>Auto-Fill Credentials (demo@globetrotter.app)</span>
            </button>
          </form>

          <p className={styles.footerText}>
            Don't have an account yet?
            <Link href="/signup" className={styles.footerLink}>
              Sign up
            </Link>
          </p>

          <div className={styles.demoNote}>
            <strong>Demo tip:</strong> You can test with <code>demo@globetrotter.app</code> and <code>password123</code> or any email with 8+ character password.
          </div>
        </div>
      </div>
    </div>
  );
}
