'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  MapPin,
  Sparkles,
  Calendar,
  Users,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockUser } from '@/lib/data/mockUsers';
import { authService, notificationService } from '@/lib/services';
import styles from './Header.module.css';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n-1',
    title: 'Trip Starting Soon!',
    desc: 'Golden Goa Escape starts in 10 days. Review your day 1 schedule.',
    time: '15m ago',
    unread: true,
    href: '/itinerary/trip-001',
    type: 'trip',
  },
  {
    id: 'n-2',
    title: 'AI Route Optimized',
    desc: 'Copilot suggested 2 hidden beach sunset spots for your European Tour.',
    time: '2h ago',
    unread: true,
    href: '/playground/trip-002',
    type: 'ai',
  },
  {
    id: 'n-3',
    title: 'Budget Alert',
    desc: 'You saved $120 on accommodation estimates for Tokyo trip!',
    time: '1d ago',
    unread: false,
    href: '/budget/trip-003',
    type: 'budget',
  },
];

export default function Header({ breadcrumbs = [], onSearch }) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const loadNotifs = () => {
      const data = notificationService.getNotifications(user?.email);
      setNotifications(data);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    router.push('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    } else if (searchValue.trim()) {
      router.push(`/trips?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      {/* Left: Mobile Brand & Breadcrumbs */}
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.brandMobile}>
          <Globe size={20} />
          <span>GlobeTrotter</span>
        </Link>

        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--gt-space-2)' }}>
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className={styles.crumbLink}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={styles.crumbActive}>{crumb.label}</span>
                  )}
                  {!isLast && <span className={styles.crumbSeparator}>/</span>}
                </span>
              );
            })}
          </nav>
        )}
      </div>

      {/* Center: Global Search */}
      <div className={styles.center}>
        <form onSubmit={handleSearchSubmit}>
          <div className={styles.searchBar}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search trips, cities, activities..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </form>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className={styles.right}>
        {/* Notifications Popover */}
        <div className={styles.notifWrapper} ref={notifRef}>
          <button
            className={styles.iconBtn}
            aria-label="Notifications"
            title="Notifications"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={18} />
            {notifications.some((n) => n.unread) && (
              <span className={styles.notificationBadge} />
            )}
          </button>

          {notifOpen && (
            <div className={styles.notifPopover}>
              <div className={styles.notifHeader}>
                <span className={styles.notifTitle}>Notifications</span>
                {notifications.some((n) => n.unread) && (
                  <button
                    type="button"
                    className={styles.notifClearBtn}
                    onClick={() => {
                      notificationService.markAllAsRead(user?.email);
                      setNotifications(notifications.map((n) => ({ ...n, unread: false })));
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className={styles.notifList}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 12, color: 'var(--gt-text-muted)' }}>
                    No notifications right now
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.notifItem} ${item.unread ? styles.notifItemUnread : ''}`}
                      onClick={() => {
                        setNotifications(
                          notifications.map((n) =>
                            n.id === item.id ? { ...n, unread: false } : n
                          )
                        );
                        setNotifOpen(false);
                        router.push(item.href || `/playground/${item.tripId || 'trip-001'}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.notifIcon}>
                        {item.category === 'collaboration' || item.type === 'invite' ? (
                          <Users size={14} color="var(--gt-blue, #4169d8)" />
                        ) : item.type === 'ai' || item.category === 'ai' ? (
                          <Sparkles size={14} />
                        ) : item.type === 'trip' || item.category === 'trip' ? (
                          <Calendar size={14} />
                        ) : (
                          <MapPin size={14} />
                        )}
                      </div>
                      <div className={styles.notifContent}>
                        <div className={styles.notifItemTitle}>{item.title}</div>
                        <div className={styles.notifItemDesc}>{item.desc}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                          <span className={styles.notifItemTime}>{item.time}</span>
                          {(item.category === 'collaboration' || item.type === 'invite') && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                notificationService.acceptInvite(item.id, item.tripId);
                                setNotifOpen(false);
                                router.push(`/playground/${item.tripId}`);
                              }}
                              style={{
                                background: 'var(--gt-blue, #4169d8)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 4,
                                padding: '2px 8px',
                                fontSize: 10.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Open Canvas →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.notifFooter}>
                <Link
                  href="/notifications"
                  className={styles.notifViewAllLink}
                  onClick={() => setNotifOpen(false)}
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className={styles.userMenuWrapper} ref={dropdownRef}>
          <button
            className={styles.userBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <img
              src={user?.avatar || mockUser.avatar}
              alt="User avatar"
              className={styles.userAvatar}
              suppressHydrationWarning
            />
            <ChevronDown size={14} color="var(--gt-text-muted)" />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownUserHeader}>
                <div className={styles.userName} suppressHydrationWarning>{user?.name || 'Explorer'}</div>
                <div className={styles.userEmail} suppressHydrationWarning>{user?.email || 'Logged in'}</div>
              </div>

              <Link
                href="/profile"
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>

              <Link
                href="/settings"
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} />
                <span>Preferences</span>
              </Link>

              <div className={styles.divider} />

              <button
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                role="menuitem"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
