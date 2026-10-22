'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  ExternalLink
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { adminService, ADMIN_CREDENTIALS } from '@/lib/services/adminService';
import styles from './admin.module.css';

const AdminContext = createContext({
  showToast: () => {},
  addToast: () => {},
  signOut: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function useAdminToast() {
  const { showToast, addToast } = useContext(AdminContext);
  return { showToast, addToast };
}

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const loggedIn = adminService.isAdminLoggedIn();
    setIsAuthenticated(loggedIn);
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = adminService.loginAdmin(loginEmail, loginPassword);
      if (res.success) {
        setIsAuthenticated(true);
        showToast(`Welcome back, ${res.user.name} (${res.user.role})`, 'success');
      } else {
        setLoginError(res.error || 'Invalid administrator credentials.');
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleQuickFill = () => {
    setLoginEmail(ADMIN_CREDENTIALS.email);
    setLoginPassword(ADMIN_CREDENTIALS.password);
    setLoginError('');
  };

  const handleSignOut = () => {
    adminService.logoutAdmin();
    setIsAuthenticated(false);
    setLoginPassword('');
    showToast('Signed out of Admin Console', 'info');
  };

  // Wait for client mount to avoid hydration flash
  if (!hasMounted) {
    return (
      <div className={styles.loginContainer}>
        <div style={{ color: 'var(--gt-text-secondary, #647184)', fontSize: 14 }}>
          Initializing GlobeTrotter Admin Console...
        </div>
      </div>
    );
  }

  // ── UNPROTECTED / UNAUTHENTICATED: SHOW ADMIN LOGIN GATE ──────────────────
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          {/* Header */}
          <div className={styles.loginHeader}>
            <div className={styles.loginLogoMark}>
              <ShieldCheck size={26} />
            </div>
            <h1 className={styles.loginTitle}>GlobeTrotter Admin</h1>
            <p className={styles.loginSubtitle}>
              Restricted portal. Sign in with administrator credentials to manage platform operations and catalog.
            </p>
          </div>

          {/* Demo Credentials Helper Box */}
          <div className={styles.credentialBadge}>
            <div className={styles.credentialHeader}>
              <span>Default Admin Credentials</span>
              <button
                type="button"
                className={styles.quickFillBtn}
                onClick={handleQuickFill}
                title="Fill credentials automatically"
              >
                Quick Fill
              </button>
            </div>
            <div className={styles.credentialRow}>
              <span>Email:</span>
              <span className={styles.credentialValue}>{ADMIN_CREDENTIALS.email}</span>
            </div>
            <div className={styles.credentialRow}>
              <span>Password:</span>
              <span className={styles.credentialValue}>{ADMIN_CREDENTIALS.password}</span>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className={styles.loginErrorBanner}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Admin Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="admin@globetrotter.travel"
                  className={styles.formInput}
                  style={{ paddingLeft: 36 }}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <Mail
                  size={15}
                  color="var(--gt-text-muted, #8a96a6)"
                  style={{ position: 'absolute', left: 12, top: 11, pointerEvents: 'none' }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Master Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className={styles.formInput}
                  style={{ paddingLeft: 36, paddingRight: 36 }}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Lock
                  size={15}
                  color="var(--gt-text-muted, #8a96a6)"
                  style={{ position: 'absolute', left: 12, top: 11, pointerEvents: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--gt-text-muted, #8a96a6)',
                    cursor: 'pointer',
                    padding: 2,
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.btnPrimary}
              style={{ width: '100%', padding: '11px 16px', justifyContent: 'center', marginTop: 6 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Admin Portal'}
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Footer Navigation */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--gt-border, #e1e7ee)', paddingTop: 14 }}>
            <Link
              href="/dashboard"
              style={{
                fontSize: 12,
                color: 'var(--gt-text-secondary, #647184)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <ExternalLink size={13} /> Return to Traveler Dashboard
            </Link>
          </div>
        </div>

        {/* Floating Toast in login view */}
        {toasts.length > 0 && (
          <div className={styles.toastContainer}>
            {toasts.map((toast) => (
              <div key={toast.id} className={`${styles.toast} ${styles.toastInfo}`}>
                <Info size={15} color="#3b82f6" />
                <span>{toast.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── AUTHENTICATED: RENDER FULL ADMIN PORTAL ──────────────────────────────
  return (
    <AdminContext.Provider value={{ showToast, addToast: showToast, signOut: handleSignOut }}>
      <div className={styles.adminShell}>
        {/* Left Sidebar */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          onSignOut={handleSignOut}
        />

        {/* Main Content Area */}
        <div className={styles.adminMainWrapper}>
          <AdminHeader
            onOpenMobileMenu={() => setIsMobileOpen(true)}
            onSignOut={handleSignOut}
          />

          <main className={styles.adminContentArea}>
            {children}
          </main>
        </div>

        {/* Floating Toast Notifications */}
        {toasts.length > 0 && (
          <div className={styles.toastContainer}>
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`${styles.toast} ${
                  toast.type === 'error'
                    ? styles.toastError
                    : toast.type === 'info'
                    ? styles.toastInfo
                    : toast.type === 'warning'
                    ? styles.toastWarning
                    : styles.toastSuccess
                }`}
              >
                {toast.type === 'error' ? (
                  <AlertCircle size={15} color="#ef4444" />
                ) : toast.type === 'info' ? (
                  <Info size={15} color="#3b82f6" />
                ) : (
                  <CheckCircle2 size={15} color="#10b981" />
                )}
                <span>{toast.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminContext.Provider>
  );
}
