'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Map, Plus, User } from 'lucide-react';
import clsx from 'clsx';
import styles from './MobileNav.module.css';

const TABS = [
  { href: '/dashboard', icon: Globe, label: 'Home' },
  { href: '/trips',     icon: Map,   label: 'Trips' },
  { href: '/create-trip', icon: Plus, label: 'New',   accent: true },
  { href: '/profile',   icon: User,  label: 'Profile' },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      {TABS.map(({ href, icon: Icon, label, accent }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={clsx(styles.tab, active && styles.active, accent && styles.accent)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span className={styles.label}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
