'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  ChevronRight,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Check,
} from 'lucide-react';
import styles from './admin.module.css';

const BREADCRUMB_MAP = {
  '/admin': 'Overview',
  '/admin/users': 'User Management',
  '/admin/trips': 'Trip Moderation',
  '/admin/destinations': 'Destination Catalog',
  '/admin/activities': 'Activity Catalog',
  '/admin/analytics': 'Analytics & Growth',
  '/admin/settings': 'Platform Settings',
};

const SAMPLE_NOTIFICATIONS = [
  { id: 1, title: 'New Trip Created', text: 'Royal Rajasthan Heritage Circuit was saved by Priya.', time: '5m ago' },
  { id: 2, title: 'Milestone Reached', text: 'Catalog crossed 330+ verified global destinations.', time: '1h ago' },
  { id: 3, title: 'Role Access Verified', text: 'Super Admin permissions active for session.', time: '2h ago' },
];

export default function AdminHeader({ onOpenMobileMenu, onSignOut }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const currentPageTitle = BREADCRUMB_MAP[pathname] || 'Dashboard';

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className={styles.headerLeft}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={onOpenMobileMenu}
          aria-label="Open Sidebar Menu"
        >
          <Menu size={18} />
        </button>

        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
            Admin
          </Link>
          <ChevronRight size={13} style={{ opacity: 0.6 }} />
          <span className={styles.breadcrumbCurrent}>{currentPageTitle}</span>
        </nav>
      </div>

      {/* Right: Quick Search, Notifications, Public App link, Avatar */}
      <div className={styles.headerRight}>
        {/* Quick Search */}
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search records... (⌘K)"
            aria-label="Global Admin Search"
          />
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.headerIconBtn}
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setUnreadCount(0);
            }}
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && <span className={styles.notificationBadge} />}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 300,
                background: '#ffffff',
                border: '1px solid var(--gt-border, #e1e7ee)',
                borderRadius: 10,
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                zIndex: 60,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--gt-border, #e1e7ee)',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Recent Admin Alerts</span>
                <span style={{ fontSize: 10.5, color: 'var(--gt-blue, #4169d8)', fontWeight: 600 }}>Demo</span>
              </div>
              <div>
                {SAMPLE_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>{n.title}</div>
                    <div style={{ color: 'var(--gt-text-secondary, #647184)', fontSize: 11.5 }}>{n.text}</div>
                    <div style={{ color: 'var(--gt-text-muted, #8a96a6)', fontSize: 10 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Public App Button */}
        <Link href="/dashboard" className={styles.publicAppBtn} title="View Live Public Platform">
          <ExternalLink size={13} />
          <span>Live App</span>
        </Link>

        {/* Profile Avatar & Menu */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Admin Profile Menu"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
              alt="Aarav Mehta"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--gt-blue, #4169d8)',
              }}
            />
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 220,
                background: '#ffffff',
                border: '1px solid var(--gt-border, #e1e7ee)',
                borderRadius: 10,
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                zIndex: 60,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#182331' }}>Aarav Mehta</div>
                <div style={{ fontSize: 11, color: '#647184' }}>admin@globetrotter.travel</div>
                <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>
                  <ShieldCheck size={11} /> Super Admin
                </div>
              </div>

              <div style={{ padding: 4 }}>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#647184',
                    textDecoration: 'none',
                    borderRadius: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Settings size={14} />
                  <span>Platform Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onSignOut) onSignOut();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#dc2626',
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
