'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe, Map, Compass, Settings, User, LogOut,
  Plus, Bell, ChevronDown, Shield, Calendar,
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import styles from './NavRail.module.css';

const NAV_ITEMS = [
  { href: '/dashboard', icon: Globe, label: 'Dashboard' },
  { href: '/trips', icon: Map, label: 'My Trips' },
  { href: '/itinerary', icon: Calendar, label: 'Itinerary' },
  { href: '/create-trip', icon: Plus, label: 'New Trip', accent: true },
];

const BOTTOM_ITEMS = [
  { href: '/admin', icon: Shield, label: 'Admin Portal' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function NavRail() {
  const pathname = usePathname();

  return (
    <nav className={styles.rail} aria-label="Primary navigation">
      {/* Logo */}
      <Link href="/dashboard" className={styles.logo} aria-label="GlobeTrotter home">
        <div className={styles.logoMark}>
          <Globe size={22} strokeWidth={1.8} />
        </div>
      </Link>

      {/* Main nav */}
      <ul className={styles.navList} role="list">
        {NAV_ITEMS.map(({ href, icon: Icon, label, accent }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(styles.navItem, active && styles.active, accent && styles.accent)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                <span className={styles.tooltip}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom nav */}
      <ul className={styles.navListBottom} role="list">
        {BOTTOM_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(styles.navItem, active && styles.active)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                <span className={styles.tooltip}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
