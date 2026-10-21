'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { tripService, cityService } from '@/lib/services';
import { useAuth } from '@/context/AuthContext';
import { mockUser } from '@/lib/data/mockUsers';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';
import styles from './dashboard.module.css';

const CATEGORIES = ['All', 'Beach', 'Adventure', 'Culture', 'Heritage', 'Nature'];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [heroSearch, setHeroSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTrips, loadedCities] = await Promise.all([
          tripService.getTrips(),
          cityService.getCities(),
        ]);
        setTrips(loadedTrips);
        setDestinations(loadedCities);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/trips?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push('/create-trip');
    }
  };

  const filteredDestinations = selectedCategory === 'All'
    ? destinations
    : destinations.filter((d) => d.tags?.includes(selectedCategory.toLowerCase()) || d.region === selectedCategory);

  const activeTripsCount = trips.filter((t) => t.status === 'planning' || t.status === 'upcoming').length;
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + (t.budget || 0), 0);

  return (
    <div className={styles.dashboard}>
      <Header breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]} />

      <PageContainer>
        {/* Hero Section */}
        <div className={styles.hero}>
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&fit=crop&q=80"
            alt="Travel inspiration"
            className={styles.heroBg}
          />
          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            <div className={styles.heroGreeting} suppressHydrationWarning>Good day, {user?.name || 'Explorer'} ✨</div>
            <h1 className={styles.heroTitle}>Where are you going next?</h1>

            <form onSubmit={handleHeroSearchSubmit} className={styles.heroSearchRow}>
              <div className={styles.searchPill}>
                <MapPin size={18} color="var(--gt-blue)" />
                <input
                  type="text"
                  placeholder="Search Tokyo, Amalfi, Goa..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                style={{ borderRadius: 'var(--gt-radius-full)', whiteSpace: 'nowrap' }}
              >
                <Plus size={16} />
                <span>Create New Trip</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Content Grid: Trips (60%) & Insights Sidebar (40%) */}
        <div className={styles.contentGrid}>
          {/* Left Column: Recent Trips */}
          <div>
            <SectionHeader
              title="Recent Trips"
              subtitle="Continue designing your custom itineraries"
              actions={
                <Link
                  href="/trips"
                  style={{
                    fontSize: 'var(--gt-text-sm)',
                    color: 'var(--gt-blue)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>View all ({trips.length})</span>
                  <ArrowRight size={14} />
                </Link>
              }
            />

            <div className={styles.tripsGrid}>
              {trips.map((trip) => (
                <div key={trip.id} className={styles.tripCard}>
                  <div className={styles.cardImageWrapper}>
                    <img src={trip.coverImage} alt={trip.title} className={styles.cardImage} />
                    <div className={styles.statusBadgeWrapper}>
                      <Badge status={trip.status} size="sm" />
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{trip.title}</h3>

                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}>
                        <MapPin size={13} />
                        <span>{trip.destinations?.join(' → ') || 'Multi-city'}</span>
                      </span>
                      <span className={styles.metaItem}>
                        <Calendar size={13} />
                        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                      </span>
                    </div>

                    <div className={styles.cardDivider} />

                    <div className={styles.cardStats}>
                      <span>
                        <strong className={styles.statHighlight}>{trip.stopsCount || 3}</strong> stops
                      </span>
                      <span>
                        <strong className={styles.statHighlight}>{formatCurrency(trip.budget)}</strong> budget
                      </span>
                      <span>
                        <strong className={styles.statHighlight}>{trip.travelers || 2}</strong> travelers
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--gt-space-2)', marginTop: 'auto' }}>
                      <Link href={`/playground/${trip.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                        <Button variant="outline" size="sm" style={{ width: '100%' }}>
                          Open Canvas
                        </Button>
                      </Link>
                      <Link href={`/itinerary/${trip.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="ghost" size="sm" title="View Day Plan">
                          <Calendar size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Travel Insights Sidebar */}
          <aside className={styles.sidebar}>
            {/* Widget 1: Next Trip Countdown */}
            <div className={styles.widget}>
              <div className={styles.widgetHeader}>
                <Clock size={16} color="var(--gt-blue)" />
                <span>Next Departure</span>
              </div>
              <div className={styles.countdownBox}>
                <div className={styles.countdownDays}>
                  <div className={styles.countdownNumber}>12</div>
                  <div className={styles.countdownLabel}>Days</div>
                </div>
                <div className={styles.countdownInfo}>
                  <div className={styles.countdownTripTitle}>Golden Goa Escape</div>
                  <div className={styles.countdownDestination}>Goa, India • Nov 10, 2026</div>
                  <div style={{ marginTop: 6 }}>
                    <Link
                      href="/playground/trip-001"
                      style={{ fontSize: 12, color: 'var(--gt-blue)', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Review stops & activities →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Budget Portfolio */}
            <div className={styles.widget}>
              <div className={styles.widgetHeader}>
                <TrendingUp size={16} color="var(--gt-teal)" />
                <span>Budget Portfolio</span>
              </div>
              <div className={styles.budgetWidgetAmount}>{formatCurrency(totalBudgetPlanned)}</div>
              <div className={styles.budgetSubtitle}>Across {activeTripsCount} active trip plans</div>

              <div className={styles.progressBarTrack}>
                <div className={styles.progressBarFill} style={{ width: '74%' }} />
              </div>
              <div className={styles.budgetLabels}>
                <span>Allocated: {formatCurrency(totalBudgetPlanned * 0.74)}</span>
                <span>Target: {formatCurrency(totalBudgetPlanned)}</span>
              </div>
            </div>

            {/* Widget 3: Quick AI Assistant Callout */}
            <div className={styles.widget} style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)' }}>
              <div className={styles.widgetHeader} style={{ color: 'var(--gt-blue)' }}>
                <Sparkles size={16} />
                <span>Smart Trip Optimizer</span>
              </div>
              <p style={{ fontSize: 'var(--gt-text-xs)', color: 'var(--gt-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                Found 2 potential flight savings between Calangute and Old Goa for your upcoming travel window.
              </p>
              <Link href="/budget/trip-001/compare" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                  Compare Route Options
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        {/* Recommended Destinations Section */}
        <div className={styles.exploreSection}>
          <SectionHeader
            title="Explore Destinations"
            subtitle="Curated locations with ready-to-use node templates and activities"
          />

          <div className={styles.filterChips}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterChip} ${selectedCategory === cat ? styles.filterChipActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.destinationsRow}>
            {filteredDestinations.map((city) => (
              <div
                key={city.id}
                className={styles.destCard}
                onClick={() => router.push(`/create-trip?destination=${encodeURIComponent(city.name)}`)}
              >
                <img src={city.image} alt={city.name} className={styles.destImg} />
                <div className={styles.destOverlay} />
                <div className={styles.destContent}>
                  <div className={styles.destName}>{city.name}</div>
                  <div className={styles.destCountry}>{city.country}</div>
                  <div className={styles.destFooter}>
                    <span className={styles.destCostBadge}>{city.costPerDay}/day</span>
                    <span style={{ fontSize: 11, color: '#93c5fd', fontWeight: 500 }}>Plan trip +</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
