'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Bell,
  Lock,
  Trash2,
  Download,
  Key,
  Check,
  AlertTriangle,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './settings.module.css';

export default function SettingsPage() {
  const router = useRouter();

  // Settings State
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [distanceUnit, setDistanceUnit] = useState('km');

  const [tripReminders, setTripReminders] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [publicByDefault, setPublicByDefault] = useState(false);
  const [allowSharing, setAllowSharing] = useState(true);

  // Modals & Feedback
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSavePreferences = () => {
    showToast('Preferences successfully saved!');
  };

  const handleDownloadData = () => {
    showToast('Data archive generated! Downloading globetrotter_backup.json');
  };

  const handleChangePassword = () => {
    showToast('Password reset link dispatched to demo@globetrotter.app');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toUpperCase() === 'DELETE') {
      setShowDeleteModal(false);
      showToast('Account erased. Redirecting...');
      setTimeout(() => router.push('/login'), 1200);
    }
  };

  return (
    <div className={styles.settingsRoot}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <PageContainer>
        <SectionHeader
          title="App Settings"
          subtitle="Configure your regional preferences, notification thresholds, and account security"
        />

        {toastMessage && (
          <div
            style={{
              maxWidth: 680,
              margin: '0 auto 20px',
              background: 'var(--gt-success-bg)',
              color: 'var(--gt-success)',
              border: '1px solid rgba(22, 163, 74, 0.2)',
              borderRadius: 'var(--gt-radius-lg)',
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className={styles.settingsCard}>
          {/* Section 1: Regional & Formatting Preferences */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Regional & Units</h2>
              <p className={styles.sectionDesc}>Customize how currency, units, and dates appear across trips</p>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Display Language</div>
                <div className={styles.settingSub}>Select your primary interface language</div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={styles.select}
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Default Currency</div>
                <div className={styles.settingSub}>Applied to new trips and budget estimates</div>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={styles.select}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Distance Metrics</div>
                <div className={styles.settingSub}>Used on canvas routes and maps</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="distance"
                    checked={distanceUnit === 'km'}
                    onChange={() => setDistanceUnit('km')}
                  />
                  <span>Kilometers</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="distance"
                    checked={distanceUnit === 'miles'}
                    onChange={() => setDistanceUnit('miles')}
                  />
                  <span>Miles</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="sm" onClick={handleSavePreferences}>
                Save Preferences
              </Button>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Notifications</h2>
              <p className={styles.sectionDesc}>Manage proactive alerts and AI reminders</p>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Trip Countdown Reminders</div>
                <div className={styles.settingSub}>Get reminders 14 days and 48 hours prior to departures</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={tripReminders}
                  onChange={(e) => setTripReminders(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Budget Overrun Alerts</div>
                <div className={styles.settingSub}>Notify when planned activities exceed 90% of budget limit</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={budgetAlerts}
                  onChange={(e) => setBudgetAlerts(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>AI Copilot Proactive Tips</div>
                <div className={styles.settingSub}>Receive route optimization suggestions in the workspace</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={aiSuggestions}
                  onChange={(e) => setAiSuggestions(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>
          </div>

          {/* Section 3: Privacy & Sharing */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Privacy & Sharing</h2>
              <p className={styles.sectionDesc}>Control read permissions on your generated links</p>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Public by Default</div>
                <div className={styles.settingSub}>Newly created trips will have viewable public share URLs</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={publicByDefault}
                  onChange={(e) => setPublicByDefault(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Allow Itinerary Duplication</div>
                <div className={styles.settingSub}>Let other travelers fork and customize your public trips</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={allowSharing}
                  onChange={(e) => setAllowSharing(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>
          </div>

          {/* Section 4: Account Actions */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Account & Data Management</h2>
              <p className={styles.sectionDesc}>Password recovery, data export, and account deletion</p>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Security Credentials</div>
                <div className={styles.settingSub}>Update password or security key</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleChangePassword}>
                <Key size={14} />
                <span>Change Password</span>
              </Button>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel}>Export Travel Data</div>
                <div className={styles.settingSub}>Download all your trips and nodes in JSON format</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadData}>
                <Download size={14} />
                <span>Export JSON</span>
              </Button>
            </div>

            <div className={styles.settingRow}>
              <div>
                <div className={styles.settingLabel} style={{ color: 'var(--gt-error)' }}>
                  Danger Zone
                </div>
                <div className={styles.settingSub}>Permanently delete your account and all trip workspaces</div>
              </div>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={14} />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gt-error)', marginBottom: 12 }}>
                <AlertTriangle size={24} />
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Delete Account Permanently?</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gt-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                This action is irreversible. All your multi-city journeys, canvas nodes, custom itineraries, and budget allocations will be permanently purged.
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Type <strong style={{ color: 'var(--gt-error)' }}>DELETE</strong> to confirm:
                </label>
                <Input
                  id="delete-confirmation-input"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button variant="outline" size="md" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                  onClick={handleDeleteAccount}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
