'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/lib/services';
import styles from './notifications.module.css';

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'collaboration' | 'trip' | 'ai' | 'budget'
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadNotifs = () => {
      const data = notificationService.getNotifications(user?.email);
      setItems(data);
    };
    loadNotifs();

    window.addEventListener('gt_new_notification', loadNotifs);
    window.addEventListener('gt_notifications_updated', loadNotifs);
    window.addEventListener('storage', loadNotifs);
    return () => {
      window.removeEventListener('gt_new_notification', loadNotifs);
      window.removeEventListener('gt_notifications_updated', loadNotifs);
      window.removeEventListener('storage', loadNotifs);
    };
  }, [user?.email]);

  const filteredItems = items.filter((item) => {
    if (filter === 'unread') return item.unread;
    if (filter === 'collaboration') return item.category === 'collaboration' || item.type === 'invite';
    if (filter === 'trip') return item.category === 'trip';
    if (filter === 'ai') return item.category === 'ai';
    if (filter === 'budget') return item.category === 'budget';
    return true;
  });

  const markAllRead = () => {
    notificationService.markAllAsRead(user?.email);
    setItems(items.map((i) => ({ ...i, unread: false })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const handleAcceptInvite = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    notificationService.acceptInvite(item.id, item.tripId);
    router.push(`/playground/${item.tripId}`);
  };

  const handleDeclineInvite = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    notificationService.declineInvite(item.id, item.tripId, user?.email);
  };

  const getIcon = (category) => {
    switch (category) {
      case 'collaboration':
        return <Users size={18} />;
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
      case 'collaboration':
        return styles.iconCircleTrip;
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
    <>
      <Header />

      <PageContainer>
        <SectionHeader
          title="Notifications & Activity Inbox"
          subtitle="Trip invitations from travel companions, AI route recommendations, and milestone alerts"
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              {items.some((i) => i.unread) && (
                <Button variant="secondary" size="sm" onClick={markAllRead}>
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
            className={`${styles.tabBtn} ${filter === 'collaboration' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('collaboration')}
          >
            Trip Invitations ({items.filter((i) => i.category === 'collaboration' || i.type === 'invite').length})
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
              You are all caught up! New alerts and invitations from fellow travelers will appear here.
            </p>
          </div>
        ) : (
          <div className={styles.notifCardList}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`${styles.card} ${item.unread ? styles.cardUnread : ''}`}
                onClick={() => {
                  setItems(
                    items.map((i) => (i.id === item.id ? { ...i, unread: false } : i))
                  );
                }}
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

                  {/* Actions Area */}
                  {item.category === 'collaboration' || item.type === 'invite' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={(e) => handleAcceptInvite(e, item)}
                        style={{
                          background: 'var(--gt-blue, #4169d8)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Accept & Open Canvas</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeclineInvite(e, item)}
                        style={{
                          background: 'var(--gt-bg-alt, #f1f5f9)',
                          color: 'var(--gt-text-secondary, #647184)',
                          border: '1px solid var(--gt-border, #e1e7ee)',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <Link href={item.href} className={styles.cardAction}>
                      <span>{item.actionText}</span>
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>

                {item.unread && <div className={styles.unreadDot} />}
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
