'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  ShieldCheck,
  X,
  Clock,
} from 'lucide-react';
import styles from './admin.module.css';

const NAV_ITEMS_MAIN = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Trips', href: '/admin/trips', icon: Calendar },
  { label: 'Itineraries', href: '/admin/itineraries', icon: Clock },
  { label: 'Destinations', href: '/admin/destinations', icon: MapPin },
  { label: 'Activities', href: '/admin/activities', icon: Sparkles },
];

const NAV_ITEMS_SYSTEM = [
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  onSignOut,
}) {
  const pathname = usePathname();

  const isLinkActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className={styles.mobileDrawerOverlay}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''} ${isMobileOpen ? styles.sidebarMobileOpen : ''}`}
        aria-label="Admin Navigation Sidebar"
      >
        {/* Brand Header */}
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.brandGroup} title="GlobeTrotter Admin">
            <div className={styles.brandLogo}>
              <Compass size={18} />
            </div>
            {!isCollapsed && (
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>GlobeTrotter</span>
                <span className={styles.brandBadge}>Admin Ops</span>
              </div>
            )}
          </Link>

          {/* Mobile close button / Desktop collapse toggle */}
          {isMobileOpen ? (
            <button
              type="button"
              className={styles.collapseToggleBtn}
              onClick={onCloseMobile}
              aria-label="Close Mobile Menu"
            >
              <X size={15} />
            </button>
          ) : (
            <button
              type="button"
              className={styles.collapseToggleBtn}
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle Sidebar"
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <div className={styles.sidebarNav}>
          <div className={styles.navSection}>
            {!isCollapsed && <span className={styles.navSectionTitle}>Management</span>}
            {NAV_ITEMS_MAIN.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                  title={isCollapsed ? item.label : undefined}
                  onClick={onCloseMobile}
                >
                  <span className={styles.navItemIcon}>
                    <Icon size={17} />
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          <div className={styles.navSection}>
            {!isCollapsed && <span className={styles.navSectionTitle}>Platform Insights</span>}
            {NAV_ITEMS_SYSTEM.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                  title={isCollapsed ? item.label : undefined}
                  onClick={onCloseMobile}
                >
                  <span className={styles.navItemIcon}>
                    <Icon size={17} />
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer with Admin Profile & Quick Links */}
        <div className={styles.sidebarFooter}>
          <div className={styles.adminProfileCard}>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
              alt="Admin Profile"
              className={styles.adminAvatar}
            />
            {!isCollapsed && (
              <div className={styles.adminInfo}>
                <span className={styles.adminName}>Aarav Mehta</span>
                <span className={styles.adminRole}>
                  <ShieldCheck size={11} /> Super Admin
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className={styles.sidebarActionsRow}>
              <Link href="/dashboard" className={styles.sidebarActionBtn} title="Return to Public Workspace">
                <ExternalLink size={12} />
                <span>App</span>
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                className={styles.sidebarActionBtn}
                title="Sign Out of Admin Console"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <LogOut size={12} />
                <span>Exit</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
