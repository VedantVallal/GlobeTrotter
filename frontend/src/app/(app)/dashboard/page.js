'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe,
  DollarSign,
  Plus,
  Search,
  Layers,
  Bookmark,
  Share2,
  Sliders,
  Plane,
  Heart,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/Button';
import AtlasMap from '@/components/dashboard/AtlasMap';
import { tripService, cityService } from '@/lib/services';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';
import styles from './dashboard.module.css';

const TABS = [
  { id: 'trips', label: 'My Trips', icon: Compass },
  { id: 'vacay', label: 'Vacay', icon: Plane },
  { id: 'atlas', label: 'Atlas', icon: Globe },
  { id: 'collections', label: 'Collections', icon: Bookmark },
];

const CURATED_VACAY = [
  {
    id: 'vacay-1',
    title: 'Amalfi Cliffside & Capri Grottos',
    destination: 'Amalfi Coast, Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&fit=crop&q=80',
    days: 6,
    budget: 1850,
    tag: 'Coastal Bliss',
    tagColor: 'tagBlue',
  },
  {
    id: 'vacay-2',
    title: 'Kyoto Bamboo Trails & Teahouses',
    destination: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop&q=80',
    days: 8,
    budget: 2200,
    tag: 'Zen Heritage',
    tagColor: 'tagGreen',
  },
  {
    id: 'vacay-3',
    title: 'Swiss Alpine Glacier Express',
    destination: 'Zermatt, Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&fit=crop&q=80',
    days: 7,
    budget: 3100,
    tag: 'Snow & Peaks',
    tagColor: 'tagPurple',
  },
  {
    id: 'vacay-4',
    title: 'Santorini Sunset Caldera',
    destination: 'Oia, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&fit=crop&q=80',
    days: 5,
    budget: 1650,
    tag: 'Romantic Escape',
    tagColor: 'tagOrange',
  },
];

const CURATED_COLLECTIONS = [
  {
    id: 'col-1',
    title: 'Rainy day, cozy indoors & bookstores',
    tag: 'Rainy day, indoors',
    tagClass: styles.tagBlue,
    count: '18 Spots',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop',
    icon: '🌧️',
  },
  {
    id: 'col-2',
    title: 'Coffee worth crossing the entire town for',
    tag: 'Coffee worth crossing town for',
    tagClass: styles.tagOrange,
    count: '24 Spots',
    author: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop',
    icon: '☕',
  },
  {
    id: 'col-3',
    title: 'Midnight ramen & hidden alleyway bars',
    tag: 'Midnight food',
    tagClass: styles.tagPurple,
    count: '31 Spots',
    author: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&fit=crop',
    icon: '🍜',
  },
  {
    id: 'col-4',
    title: 'Brutalist architecture & sacred brutal monuments',
    tag: 'Architectural gems',
    tagClass: styles.tagGreen,
    count: '15 Spots',
    author: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop',
    icon: '🏛️',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const loadedTrips = await tripService.getTrips();
        setTrips(loadedTrips || []);
      } catch (err) {
        console.error('Failed to load trips:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const handleCurrencyChange = () => setTrips((prev) => [...prev]);
    window.addEventListener('gt_currency_changed', handleCurrencyChange);
    return () => window.removeEventListener('gt_currency_changed', handleCurrencyChange);
  }, []);

  // Compute Bento Grid Stats
  const stats = useMemo(() => {
    const totalTrips = trips.length;
    // Calculate total days
    let totalDays = 0;
    const countriesSet = new Set();

    trips.forEach((t) => {
      if (t.startDate && t.endDate) {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        totalDays += diff;
      } else {
        totalDays += 7;
      }

      if (t.title?.toLowerCase().includes('goa') || t.title?.toLowerCase().includes('rajasthan')) {
        countriesSet.add('India');
      } else if (t.title?.toLowerCase().includes('japan') || t.title?.toLowerCase().includes('tokyo')) {
        countriesSet.add('Japan');
      } else if (t.title?.toLowerCase().includes('europe') || t.title?.toLowerCase().includes('paris')) {
        countriesSet.add('France');
        countriesSet.add('Greece');
      } else if (t.title?.toLowerCase().includes('alps')) {
        countriesSet.add('Switzerland');
      } else {
        countriesSet.add('Global');
      }
    });

    const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 1200), 0);

    return {
      totalTrips,
      totalDays: Math.max(totalDays, 42),
      countriesVisited: Math.max(countriesSet.size, 8),
      totalBudget,
    };
  }, [trips]);

  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return trips;
    const q = searchQuery.toLowerCase();
    return trips.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.destinations?.some((d) => d.toLowerCase().includes(q))
    );
  }, [trips, searchQuery]);

  return (
    <div className={styles.dashboardRoot}>
      <Header breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Atlas Dashboard' }]} />

      <PageContainer>
        {/* Liketrek Top Pill Navigation Bar */}
        <div className={styles.pillNavContainer}>
          <nav className={styles.pillNav} aria-label="Dashboard views">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.pillNavBtn} ${isActive ? styles.pillNavBtnActive : ''}`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bento Grid Stats Cards with Framer Motion spring physics */}
        <div className={styles.bentoGrid}>
          {/* Bento Card 1: Trips Total (Neon Cyan Glow) */}
          <motion.div
            className={`${styles.bentoCard} ${styles.bentoCardGlowCyan}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div>
              <div className={styles.bentoLabel}>
                <span>Trips Total</span>
                <Compass size={16} color="#06b6d4" />
              </div>
              <div className={styles.bentoValue}>{stats.totalTrips}</div>
            </div>
            <div className={styles.bentoSubtext}>
              <span style={{ color: '#06b6d4', fontWeight: 700 }}>+2 active</span> in planning cycle
            </div>
          </motion.div>

          {/* Bento Card 2: Days Traveled (Neon Purple Glow) */}
          <motion.div
            className={`${styles.bentoCard} ${styles.bentoCardGlowPurple}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div>
              <div className={styles.bentoLabel}>
                <span>Days Traveled</span>
                <Calendar size={16} color="#a855f7" />
              </div>
              <div className={styles.bentoValue}>{stats.totalDays}</div>
            </div>
            <div className={styles.bentoSubtext}>
              <span style={{ color: '#a855f7', fontWeight: 700 }}>100% on schedule</span> across 4 continents
            </div>
          </motion.div>

          {/* Bento Card 3: Countries Visited (Emerald Green Glow) */}
          <motion.div
            className={`${styles.bentoCard} ${styles.bentoCardGlowEmerald}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div>
              <div className={styles.bentoLabel}>
                <span>Countries Visited</span>
                <Globe size={16} color="#10b981" />
              </div>
              <div className={styles.bentoValue}>{stats.countriesVisited}</div>
            </div>
            <div className={styles.bentoSubtext}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>24 curated cities</span> and heritage ports
            </div>
          </motion.div>

          {/* Bento Card 4: Budget Planned (Deep Orange Glow) */}
          <motion.div
            className={`${styles.bentoCard} ${styles.bentoCardGlowOrange}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div>
              <div className={styles.bentoLabel}>
                <span>Budget Planned</span>
                <DollarSign size={16} color="#f97316" />
              </div>
              <div className={styles.bentoValue}>{formatCurrency(stats.totalBudget)}</div>
            </div>
            <div className={styles.bentoSubtext}>
              <span style={{ color: '#f97316', fontWeight: 700 }}>Multi-currency</span> ECB Frankfurter sync
            </div>
          </motion.div>
        </div>

        {/* Tab 1: Atlas Live World Map View */}
        {activeTab === 'atlas' && (
          <section className="mb-8">
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
                  Interactive Carto Dark Matter Atlas
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)' }}>
                  Visualizing flight routes, multi-city stops, and geo-nodes with high-contrast neon pins.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => router.push('/create-trip')}
                icon={<Plus size={15} />}
              >
                Plan New Route
              </Button>
            </div>
            <AtlasMap trips={trips} />
          </section>
        )}

        {/* Tab 2: My Trips (Liketrek Style Grid) */}
        {activeTab === 'trips' && (
          <section>
            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div style={{ position: 'relative', width: 320, maxWidth: '100%' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search journeys, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: 42,
                    background: '#141418',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '9999px',
                    paddingLeft: 40,
                    paddingRight: 16,
                    color: '#ffffff',
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Link
                  href="/community"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '9px 18px',
                    borderRadius: '9999px',
                    background: '#1a1a1f',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Bookmark size={15} color="#c084fc" />
                  <span>Collections Hub</span>
                </Link>

                <Button
                  variant="primary"
                  onClick={() => router.push('/create-trip')}
                  icon={<Plus size={16} />}
                >
                  Create Journey
                </Button>
              </div>
            </div>

            {/* Also preview Atlas Banner */}
            <div style={{ marginBottom: 28 }}>
              <AtlasMap trips={trips} />
            </div>

            {/* Liketrek Cards Grid */}
            <div className={styles.tripsGrid}>
              {filteredTrips.map((trip) => {
                const datesStr = trip.startDate && trip.endDate
                  ? formatDateRange(trip.startDate, trip.endDate)
                  : 'Flexible Dates';

                return (
                  <motion.div
                    key={trip.id}
                    className={styles.liketrekCard}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  >
                    <div className={styles.liketrekCardMedia}>
                      <img
                        src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&fit=crop'}
                        alt={trip.title}
                        className={styles.liketrekCardImg}
                      />
                      <div className={styles.liketrekOverlay} />
                      <div className={styles.liketrekBadge}>
                        {trip.status === 'upcoming' ? 'Upcoming' : 'Planning'}
                      </div>
                      <div className={styles.liketrekBudgetBadge}>
                        {formatCurrency(trip.budget || 1200)}
                      </div>
                    </div>

                    <div className={styles.liketrekCardBody}>
                      <h3 className={styles.liketrekCardTitle}>{trip.title}</h3>

                      <div className={styles.liketrekRoute}>
                        <MapPin size={13} color="#06b6d4" />
                        <span>{trip.destinations?.join(' → ') || 'Multi-stop Route'}</span>
                      </div>

                      <div className={styles.liketrekMetaRow}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Calendar size={13} />
                          <span>{datesStr}</span>
                        </span>
                        <span>{trip.travelers || 2} Travelers</span>
                      </div>

                      <div className={styles.liketrekActions}>
                        <Link
                          href={`/trips/${trip.id}/playground`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: '9px 14px',
                            background: '#6366f1',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: 12.5,
                            fontWeight: 700,
                            textDecoration: 'none',
                            boxShadow: '0 0 14px rgba(99, 102, 241, 0.35)',
                          }}
                        >
                          <Sparkles size={14} />
                          <span>Playground</span>
                        </Link>

                        <Link
                          href={`/trips/${trip.id}/budget`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: '9px 12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: 12.5,
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <DollarSign size={14} color="#34d399" />
                          <span>Budget</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tab 3: Vacay Inspiration & Quick Generator */}
        {activeTab === 'vacay' && (
          <section>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 6 }}>
                Curated Vacay Escapes
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)' }}>
                Hand-selected scenic retreats with optimal seasonal timing, verified benchmarks, and instant 1-click cloning.
              </p>
            </div>

            <div className={styles.tripsGrid}>
              {CURATED_VACAY.map((vacay) => (
                <motion.div
                  key={vacay.id}
                  className={styles.liketrekCard}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <div className={styles.liketrekCardMedia}>
                    <img src={vacay.image} alt={vacay.title} className={styles.liketrekCardImg} />
                    <div className={styles.liketrekOverlay} />
                    <div
                      className={styles.liketrekBadge}
                      style={{ color: '#f97316', borderColor: 'rgba(249, 115, 22, 0.4)' }}
                    >
                      {vacay.tag}
                    </div>
                    <div className={styles.liketrekBudgetBadge}>
                      {formatCurrency(vacay.budget)}
                    </div>
                  </div>

                  <div className={styles.liketrekCardBody}>
                    <h3 className={styles.liketrekCardTitle}>{vacay.title}</h3>
                    <div className={styles.liketrekRoute}>
                      <MapPin size={13} color="#06b6d4" />
                      <span>{vacay.destination}</span>
                    </div>

                    <div className={styles.liketrekMetaRow}>
                      <span>{vacay.days} Days Recommended</span>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>Benchmark Fit</span>
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        router.push(`/create-trip?destination=${encodeURIComponent(vacay.destination)}&budget=${vacay.budget}`);
                      }}
                      icon={<Sparkles size={14} />}
                    >
                      Plan This Vacay
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 4: Liketrek Collections Hub */}
        {activeTab === 'collections' && (
          <section>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: 6 }}>
                  Liketrek Curated Collections
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)' }}>
                  Specific, high-taste collections tagged with vibrant community labels.
                </p>
              </div>

              <Link
                href="/community"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  background: '#6366f1',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <span>Explore All Community Collections</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.collectionsGrid}>
              {CURATED_COLLECTIONS.map((col) => (
                <motion.div
                  key={col.id}
                  className={styles.collectionCard}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  onClick={() => router.push('/community')}
                >
                  <div style={{ fontSize: 32 }}>{col.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 6 }}>
                      <span className={`${styles.collectionTag} ${col.tagClass}`}>
                        {col.tag}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 6, lineHeight: 1.3 }}>
                      {col.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>
                      <img
                        src={col.avatar}
                        alt={col.author}
                        style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>{col.author}</span>
                      <span>•</span>
                      <span>{col.count}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}
