'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  Sparkles,
  DollarSign,
  MapPin,
  Check,
  Trash2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './notifications.module.css';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'trip',
    title: 'Trip Starting Soon!',
    desc: 'Golden Goa Escape starts in 10 days! All stops, hotel coordinates, and beach itineraries are ready for departure.',
    time: '15 minutes ago',
    unread: true,
    href: '/itinerary/trip-001',
    actionText: 'View Day-by-Day Plan',
  },
  {
    id: 'notif-2',
    category: 'ai',
    title: 'AI Route Pacing Optimized',
    desc: 'GlobeTrotter AI analyzed transit times between Paris and Santorini and recommends departing via evening direct flight to save 4 hours.',
    time: '2 hours ago',
    unread: true,
    href: '/playground/trip-002',
    actionText: 'Inspect Canvas Nodes',
  },
  {
    id: 'notif-3',
    category: 'budget',
    title: 'Budget Alert & Savings Milestone',
    desc: 'You saved $120 on accommodation estimates for your Tokyo & Kyoto Discovery trip compared to the target benchmark.',
    time: 'Yesterday',
    unread: false,
    href: '/budget/trip-003',
    actionText: 'Check Budget Breakdown',
  },
  {
    id: 'notif-4',
    category: 'system',
    title: 'Cloud Workspace Synced',
    desc: 'Your recent stop additions and playground nodes have been persisted and synchronized with your account profile.',
    time: '2 days ago',
    unread: false,
    href: '/trips',
    actionText: 'View All Trips',
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'trip' | 'ai' | 'budget'
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);

  const filteredItems = items.filter((item) => {
    if (filter === 'unread') return item.unread;
    if (filter === 'trip') return item.category === 'trip';
    if (filter === 'ai') return item.category === 'ai';
    if (filter === 'budget') return item.category === 'budget';
    return true;
  });

  const markAllRead = () => {
    setItems(items.map((i) => ({ ...i, unread: false })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const getIcon = (category) => {
    switch (category) {
      case 'trip':
        return <Calendar size={18} />;
      case 'ai':
        return <Sparkles size={18} />;
      case 'budget':
        return <DollarSign size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const getCircleClass = (category) => {
    switch (category) {
      case 'trip':
        return styles.iconCircleTrip;
      case 'ai':
        return styles.iconCircleAi;
      case 'budget':
        return styles.iconCircleBudget;
      default:
        return '';
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Notifications' },
        ]}
      />

      <PageContainer>
        <SectionHeader
          title="Notifications & Alerts"
          subtitle="Stay updated with journey milestones, AI schedule recommendations, and budget alerts"
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              {items.some((i) => i.unread) && (
                <Button variant="outline" size="sm" onClick={markAllRead}>
                  <Check size={14} />
                  <span>Mark All as Read</span>
                </Button>
              )}
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          }
        />

        {/* Filter Tabs */}
        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === 'unread' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({items.filter((i) => i.unread).length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === 'trip' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('trip')}
          >
            Trip Alerts
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === 'ai' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('ai')}
          >
            AI Suggestions
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === 'budget' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('budget')}
          >
            Budget & Costs
          </button>
        </div>

        {/* Notifications List */}
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--gt-text-primary)' }}>
              No notifications here
            </h3>
            <p style={{ fontSize: 13 }}>
              You are all caught up! New alerts about your trips and AI suggestions will appear here.
            </p>
          </div>
        ) : (
          <div className={styles.notifCardList}>
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.card} ${item.unread ? styles.cardUnread : ''}`}
                onClick={() =>
                  setItems(
                    items.map((i) => (i.id === item.id ? { ...i, unread: false } : i))
                  )
                }
              >
                <div className={`${styles.iconCircle} ${getCircleClass(item.category)}`}>
                  {getIcon(item.category)}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{item.title}</div>
                    <div className={styles.cardTime}>{item.time}</div>
                  </div>

                  <div className={styles.cardDesc}>{item.desc}</div>

                  <div className={styles.cardAction}>
                    <span>{item.actionText}</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
