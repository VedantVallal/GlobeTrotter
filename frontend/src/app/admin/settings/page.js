'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Settings,
  User,
  Shield,
  Globe,
  DollarSign,
  Bell,
  Sparkles,
  Database,
  RefreshCw,
  Trash2,
  Check,
  AlertTriangle,
  Lock,
  Server
} from 'lucide-react';
import { adminService } from '@/lib/services/adminService';
import { useAdminToast } from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import styles from '@/components/admin/admin.module.css';

export default function SettingsAdminPage() {
  const { addToast } = useAdminToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Dialog State
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [cacheDialogOpen, setCacheDialogOpen] = useState(false);

  // Form State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [allowPublicSharing, setAllowPublicSharing] = useState(true);
  const [aiItineraryGenerator, setAiItineraryGenerator] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [adminEmailAlerts, setAdminEmailAlerts] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const data = await adminService.getSettings();
        setSettings(data);
        setProfileName(data.adminUser?.name || 'Aarav Mehta');
        setProfileEmail(data.adminUser?.email || 'admin@globetrotter.travel');
        setDefaultCurrency(data.defaultCurrency || 'INR');
        setDefaultLanguage(data.defaultLanguage || 'en');
        setTimezone(data.timezone || 'Asia/Kolkata');
        setAllowPublicSharing(data.allowPublicSharing ?? true);
        setAiItineraryGenerator(data.aiItineraryGenerator ?? true);
        setMaintenanceMode(data.maintenanceMode ?? false);
        setAdminEmailAlerts(data.adminEmailAlerts ?? true);
      } catch (err) {
        console.error(err);
        addToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const patch = {
          defaultCurrency,
          defaultLanguage,
          timezone,
          allowPublicSharing,
          aiItineraryGenerator,
          maintenanceMode,
          adminEmailAlerts,
          adminUser: {
            ...settings?.adminUser,
            name: profileName,
            email: profileEmail,
          },
        };
        const updated = await adminService.updateSettings(patch);
        setSettings(updated);
        addToast('Platform configuration saved successfully', 'success');
      } catch (err) {
        console.error(err);
        addToast('Error saving settings', 'error');
      }
    });
  };

  const handleReindexCatalog = () => {
    addToast('Re-indexing destination catalog and search index...', 'info');
    setTimeout(() => {
      addToast('Search catalog index successfully rebuilt for 339 cities', 'success');
    }, 900);
  };

  const handleClearCacheConfirm = () => {
    setCacheDialogOpen(false);
    addToast('AI trip recommendations cache cleared', 'success');
  };

  const handleResetPrototypeConfirm = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gt_admin_users');
      localStorage.removeItem('gt_admin_trips');
      localStorage.removeItem('gt_admin_destinations');
      localStorage.removeItem('gt_admin_activities');
      localStorage.removeItem('gt_admin_settings');
    }
    setResetDialogOpen(false);
    addToast('Prototype state restored to clean initial mock dataset', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  if (loading) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Admin Settings</h1>
        </div>
        <div style={{ padding: 40, textAlign: 'center', color: '#8a96a6' }}>
          Loading platform configurations...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Platform Settings & Configuration</h1>
          <p className={styles.pageSubtitle}>
            Configure platform localization, AI itinerary generator controls, and administrative privileges.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSaveSettings}
            disabled={isPending}
          >
            <Check size={14} /> {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* Left Column: Admin Profile & Platform Preferences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: Admin Profile */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid var(--gt-border, #e1e7ee)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'rgba(65, 105, 216, 0.1)',
                  color: 'var(--gt-blue, #4169d8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--gt-text-primary, #182331)' }}>
                  Admin Profile
                </h3>
                <p style={{ fontSize: 12, color: 'var(--gt-text-secondary, #647184)', margin: 0 }}>
                  Active operator account credentials and security role
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--gt-bg-alt, #f1f5f9)', borderRadius: 10, marginBottom: 18 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--gt-blue, #4169d8)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                AM
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gt-text-primary, #182331)' }}>
                    {profileName}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: '#eff6ff',
                      color: 'var(--gt-blue, #4169d8)',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    Super Admin
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gt-text-secondary, #647184)' }}>
                  {profileEmail} · Last active today
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admin Full Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Operational Email</label>
                <input
                  type="email"
                  className={styles.formInput}
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Platform Localization & Regional Preferences */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid var(--gt-border, #e1e7ee)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'rgba(13, 148, 136, 0.1)',
                  color: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Globe size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--gt-text-primary, #182331)' }}>
                  Platform Preferences
                </h3>
                <p style={{ fontSize: 12, color: 'var(--gt-text-secondary, #647184)', margin: 0 }}>
                  Default currencies, languages, and scheduling timezones
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Platform Currency</label>
                <select
                  className={styles.formSelect}
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                >
                  <option value="INR">Indian Rupee (INR ₹)</option>
                  <option value="USD">US Dollar (USD $)</option>
                  <option value="EUR">Euro (EUR €)</option>
                  <option value="GBP">British Pound (GBP £)</option>
                  <option value="JPY">Japanese Yen (JPY ¥)</option>
                </select>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)' }}>
                  All itinerary budget inputs default to this currency denomination.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Interface Language</label>
                <select
                  className={styles.formSelect}
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                >
                  <option value="en">English (Default)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="fr">French (Français)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="ja">Japanese (日本語)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Operational Timezone</label>
                <select
                  className={styles.formSelect}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                  <option value="UTC">UTC (Universal Coordinated)</option>
                  <option value="America/New_York">America/New_York (EST -05:00)</option>
                  <option value="Europe/London">Europe/London (GMT +00:00)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST +09:00)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Toggles, Notifications & Catalog Maintenance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 3: AI & Operational Feature Toggles */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid var(--gt-border, #e1e7ee)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'rgba(124, 106, 245, 0.1)',
                  color: '#7c6af5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--gt-text-primary, #182331)' }}>
                  AI Itinerary & Sharing Controls
                </h3>
                <p style={{ fontSize: 12, color: 'var(--gt-text-secondary, #647184)', margin: 0 }}>
                  Manage algorithmic itinerary synthesis and traveler collaboration
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Toggle 1 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>
                    AI Auto-Itinerary Generator
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--gt-text-secondary, #647184)' }}>
                    Automatically create time-synchronized daily itineraries for multi-city trips.
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 18, height: 18, accentColor: 'var(--gt-blue, #4169d8)', cursor: 'pointer' }}
                  checked={aiItineraryGenerator}
                  onChange={(e) => setAiItineraryGenerator(e.target.checked)}
                />
              </div>

              {/* Toggle 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>
                    Public Trip Sharing
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--gt-text-secondary, #647184)' }}>
                    Allow users to generate read-only public links and share travel plans.
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 18, height: 18, accentColor: 'var(--gt-blue, #4169d8)', cursor: 'pointer' }}
                  checked={allowPublicSharing}
                  onChange={(e) => setAllowPublicSharing(e.target.checked)}
                />
              </div>

              {/* Toggle 3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>
                    Admin Security Alerts
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--gt-text-secondary, #647184)' }}>
                    Receive email digests for flagged accounts or elevated platform volume.
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 18, height: 18, accentColor: 'var(--gt-blue, #4169d8)', cursor: 'pointer' }}
                  checked={adminEmailAlerts}
                  onChange={(e) => setAdminEmailAlerts(e.target.checked)}
                />
              </div>

              {/* Toggle 4 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid #fee2e2', background: '#fff5f5', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#b91c1c' }}>
                    Maintenance Mode
                  </div>
                  <div style={{ fontSize: 11.5, color: '#7f1d1d' }}>
                    Restrict itinerary editing for non-admin users while migrations occur.
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 18, height: 18, accentColor: '#dc2626', cursor: 'pointer' }}
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Catalog Maintenance & Prototype Tools */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid var(--gt-border, #e1e7ee)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'rgba(245, 158, 66, 0.1)',
                  color: '#f59e42',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Server size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--gt-text-primary, #182331)' }}>
                  Catalog Maintenance & Cache
                </h3>
                <p style={{ fontSize: 12, color: 'var(--gt-text-secondary, #647184)', margin: 0 }}>
                  Maintenance tasks and local prototype state management
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--gt-bg-alt, #f1f5f9)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>
                    Re-index Search Catalog
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)' }}>
                    Synchronizes 339 global cities into instant-lookup trie
                  </div>
                </div>
                <button
                  className={styles.btnSecondary}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={handleReindexCatalog}
                >
                  <RefreshCw size={12} /> Re-index
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--gt-bg-alt, #f1f5f9)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>
                    Clear AI Itinerary Cache
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)' }}>
                    Flushes local itinerary recommendations cache
                  </div>
                </div>
                <button
                  className={styles.btnSecondary}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={() => setCacheDialogOpen(true)}
                >
                  Clear Cache
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e11d48' }}>
                    Reset Prototype State
                  </div>
                  <div style={{ fontSize: 11, color: '#9f1239' }}>
                    Restores mock users, trips, and catalog to default clean state
                  </div>
                </div>
                <button
                  className={styles.btnDanger}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={() => setResetDialogOpen(true)}
                >
                  <Trash2 size={12} /> Reset State
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cache Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cacheDialogOpen}
        title="Clear AI Recommendation Cache?"
        message="This will invalidate cached itinerary suggestions. Future trip creation calls will generate fresh itineraries from scratch."
        confirmText="Clear Cache"
        cancelText="Cancel"
        variant="warning"
        onConfirm={handleClearCacheConfirm}
        onCancel={() => setCacheDialogOpen(false)}
      />

      {/* Reset State Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        title="Reset Entire Prototype Dataset?"
        message="Are you sure you want to restore the default dataset? All local edits made to mock users, trips, destinations, and settings will be reset."
        confirmText="Reset All Data"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleResetPrototypeConfirm}
        onCancel={() => setResetDialogOpen(false)}
      />
    </div>
  );
}
