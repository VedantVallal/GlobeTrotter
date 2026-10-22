'use client';
import { Suspense } from 'react';
import NavRail from './NavRail';
import MobileNav from './MobileNav';
import FloatingChatbot from '@/components/chatbot/FloatingChatbot';
import styles from './AppShell.module.css';

export default function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <Suspense fallback={<div style={{ width: 64 }} />}>
        <NavRail />
        <MobileNav />
      </Suspense>
      <main className={styles.main}>
        {children}
      </main>
      <FloatingChatbot />
    </div>
  );
}
