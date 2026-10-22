'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Compass,
  Settings,
  Edit3,
  ExternalLink,
  Check,
  Camera,
  Upload,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { mockUser } from '@/lib/data/mockUsers';
import { mockTrips } from '@/lib/data/mockTrips';
import { formatDateRange, formatCurrency } from '@/lib/utils/formatters';
import styles from './profile.module.css';

const PREFERENCES = [
  'Beach', 'Adventure', 'Food',
  'Culture', 'Nature', 'Shopping',
  'History', 'Nightlife', 'Relaxation',
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
];

export default function ProfilePage() {
  const { user, updateAvatar } = useAuth();
  const fileInputRef = useRef(null);
  const [userPrefs, setUserPrefs] = useState(['Beach', 'Culture', 'Relaxation', 'Food']);
  const [toast, setToast] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setToast('Please choose an image under 4MB');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      setToast('Saving photo to database...');
      await updateAvatar(dataUrl);
      setToast('Profile photo saved in database & synced!');
      setTimeout(() => setToast(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (url) => {
    setToast('Saving avatar to database...');
    await updateAvatar(url);
    setToast('Profile photo updated in database!');
    setTimeout(() => setToast(''), 2500);
  };

  const togglePref = (p) => {
    if (userPrefs.includes(p)) {
      setUserPrefs(userPrefs.filter((item) => item !== p));
    } else {
      setUserPrefs([...userPrefs, p]);
    }
    setToast('Preferences updated');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className={styles.profileRoot}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <div className={styles.coverHeader} />

      <PageContainer>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrapper}>
            <img
              src={user?.avatar || mockUser.avatar}
              alt="Profile avatar"
              className={styles.avatar}
              suppressHydrationWarning
            />

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            {/* Camera / Edit button */}
            <button
              type="button"
              className={styles.avatarEditBtn}
              onClick={() => fileInputRef.current?.click()}
              title="Upload new profile photo to database"
            >
              <Camera size={15} />
            </button>
          </div>

          {/* Quick preset avatar selection */}
          <div className={styles.presetAvatarsRow}>
            {PRESET_AVATARS.map((url, i) => (
              <img
                key={url}
                src={url}
                alt={`Preset avatar ${i + 1}`}
                className={`${styles.presetAvatarThumb} ${
                  user?.avatar === url ? styles.presetAvatarActive : ''
                }`}
                onClick={() => handleSelectPreset(url)}
                title="Select preset avatar"
              />
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 'var(--gt-radius-full)',
                border: '1px solid var(--gt-border)',
                background: 'var(--gt-bg-alt)',
                fontSize: 11,
                cursor: 'pointer',
                color: 'var(--gt-text-secondary)',
                fontWeight: 600,
              }}
            >
              <Upload size={12} />
              <span>Upload Custom</span>
            </button>
          </div>

          <h1 className={styles.name} suppressHydrationWarning>{user?.name || 'Explorer'}</h1>
          <div className={styles.email} suppressHydrationWarning>{user?.email || 'Logged in'}</div>
          <div className={styles.memberSince} suppressHydrationWarning>
            {user?.isFirebaseUser ? 'Firebase Verified Account • Stored in Firestore' : 'Global Explorer Member'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            <Link href="/settings" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="sm">
                <Settings size={14} />
                <span>Account Settings</span>
              </Button>
            </Link>
          </div>

          {toast && (
            <div
              style={{
                background: 'var(--gt-success-bg)',
                color: 'var(--gt-success)',
                padding: '6px 14px',
                borderRadius: 'var(--gt-radius-md)',
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 16,
              }}
            >
              <Check size={14} />
              <span>{toast}</span>
            </div>
          )}

          {/* 4 Stats Strip */}
          <div className={styles.statsStrip}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>8</span>
              <span className={styles.statLabel}>Trips Planned</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>Countries Visited</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>14</span>
              <span className={styles.statLabel}>Cities Explored</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>47</span>
              <span className={styles.statLabel}>Activities Logged</span>
            </div>
          </div>

          {/* Travel Preferences */}
          <div style={{ textAlign: 'left', marginBottom: 32 }}>
            <h2 className={styles.prefTitle}>Travel Styles & Vibes</h2>
            <div className={styles.prefChips}>
              {PREFERENCES.map((pref) => {
                const isActive = userPrefs.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    className={`${styles.prefChip} ${isActive ? styles.prefChipActive : ''}`}
                    onClick={() => togglePref(pref)}
                  >
                    {isActive ? '✓ ' : ''}{pref}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Trips Section */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className={styles.prefTitle} style={{ margin: 0 }}>Recent Trips</h2>
              <Link href="/trips" style={{ fontSize: 13, color: 'var(--gt-blue)', textDecoration: 'none', fontWeight: 600 }}>
                View all ({mockTrips.length}) →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mockTrips.slice(0, 3).map((trip) => (
                <div
                  key={trip.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--gt-radius-lg)',
                    border: '1px solid var(--gt-border)',
                    background: 'var(--gt-bg-alt)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      style={{ width: 48, height: 36, borderRadius: 6, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{trip.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--gt-text-muted)' }}>
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </div>
                    </div>
                  </div>

                  <Link href={`/playground/${trip.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="outline" size="sm">
                      <span>Open</span>
                      <ExternalLink size={12} />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
