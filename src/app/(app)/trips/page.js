'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  MoreVertical,
  MapPin,
  Calendar,
  Copy,
  Trash2,
  ExternalLink,
  Compass,
  DollarSign,
  Share2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ShareModal from '@/components/ui/ShareModal';
import { tripService } from '@/lib/services';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';
import styles from './trips.module.css';

const STATUS_FILTERS = ['All', 'planning', 'upcoming', 'completed'];

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Delete modal state
  const [deleteTripTarget, setDeleteTripTarget] = useState(null);

  // Share modal state
  const [shareTripTarget, setShareTripTarget] = useState(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        const loaded = await tripService.getTrips();
        setTrips(loaded);
      } catch (err) {
        console.error('Failed to load trips', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  // Filter & Sort
  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((t) => t.status === selectedStatus);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destinations?.some((d) => d.toLowerCase().includes(q)) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate);
      if (sortBy === 'oldest') return new Date(a.createdAt || a.startDate) - new Date(b.createdAt || b.startDate);
      if (sortBy === 'destination') {
        const destA = a.destinations?.[0] || '';
        const destB = b.destinations?.[0] || '';
        return destA.localeCompare(destB);
      }
      if (sortBy === 'startDate') return new Date(a.startDate) - new Date(b.startDate);
      return 0;
    });

    return result;
  }, [trips, selectedStatus, searchQuery, sortBy]);

  // Actions
  const handleDuplicate = (trip) => {
    const duplicated = {
      ...trip,
      id: `trip-copy-${Date.now()}`,
      title: `Copy of ${trip.title}`,
      createdAt: new Date().toISOString(),
    };
    setTrips([duplicated, ...trips]);
    setActiveMenuId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTripTarget) return;
    try {
      await tripService.deleteTrip(deleteTripTarget.id);
      setTrips(trips.filter((t) => t.id !== deleteTripTarget.id));
      setDeleteTripTarget(null);
      setActiveMenuId(null);
    } catch (err) {
      console.error('Failed to delete trip', err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'My Trips' }]} />

      <PageContainer>
        <SectionHeader
          title="My Trips"
          subtitle={`Organizing ${trips.length} travel adventures and custom itineraries`}
          actions={
            <Link href="/create-trip" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">
                <Plus size={16} />
                <span>Create New Trip</span>
              </Button>
            </Link>
          }
        />

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            {/* Search */}
            <div className={styles.searchBox}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--gt-surface)',
                  border: '1px solid var(--gt-border)',
                  borderRadius: 'var(--gt-radius-full)',
                  padding: '6px 14px',
                }}
              >
                <Search size={15} color="var(--gt-text-muted)" />
                <input
                  type="text"
                  placeholder="Search trips or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Filter chips */}
            <div className={styles.filterChips}>
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  className={`${styles.filterChip} ${selectedStatus === s ? styles.filterChipActive : ''}`}
                  onClick={() => setSelectedStatus(s)}
                >
                  {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.toolbarRight}>
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="destination">By destination (A-Z)</option>
              <option value="startDate">By departure date</option>
            </select>

            {/* View Mode Toggle */}
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Empty States */}
        {filteredTrips.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--gt-surface)',
              borderRadius: 'var(--gt-radius-2xl)',
              border: '1px solid var(--gt-border)',
            }}
          >
            <Compass size={48} color="var(--gt-blue)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: 8 }}>
              {searchQuery ? `No trips found matching "${searchQuery}"` : 'No trips in this view'}
            </h3>
            <p style={{ color: 'var(--gt-text-secondary)', fontSize: '14px', marginBottom: 20 }}>
              {searchQuery ? 'Try clearing filters or searching for another destination' : 'Ready to begin planning your next destination?'}
            </p>
            {searchQuery ? (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </Button>
            ) : (
              <Link href="/create-trip" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md">
                  <Plus size={16} />
                  <span>Start a New Trip</span>
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredTrips.length > 0 && (
          <div className={styles.tripsGrid}>
            {filteredTrips.map((trip) => (
              <div key={trip.id} className={styles.tripCard}>
                <div className={styles.cardImageWrapper}>
                  <img src={trip.coverImage} alt={trip.title} className={styles.cardImage} />

                  <div className={styles.cardTopActions}>
                    <Badge status={trip.status} size="sm" />

                    <div style={{ position: 'relative' }}>
                      <button
                        className={styles.threeDotBtn}
                        onClick={() => setActiveMenuId(activeMenuId === trip.id ? null : trip.id)}
                        aria-label="Trip actions"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {activeMenuId === trip.id && (
                        <div className={styles.cardDropdown}>
                          <button
                            className={styles.cardDropdownItem}
                            onClick={() => router.push(`/playground/${trip.id}`)}
                          >
                            <ExternalLink size={14} />
                            <span>Open Canvas</span>
                          </button>
                          <button
                            className={styles.cardDropdownItem}
                            onClick={() => {
                              setShareTripTarget(trip);
                              setActiveMenuId(null);
                            }}
                          >
                            <Share2 size={14} />
                            <span>Share Trip</span>
                          </button>
                          <button
                            className={styles.cardDropdownItem}
                            onClick={() => handleDuplicate(trip)}
                          >
                            <Copy size={14} />
                            <span>Duplicate</span>
                          </button>
                          <button
                            className={`${styles.cardDropdownItem} ${styles.cardDropdownItemDanger}`}
                            onClick={() => {
                              setDeleteTripTarget(trip);
                              setActiveMenuId(null);
                            }}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
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
                      <Button variant="primary" size="sm" style={{ width: '100%' }}>
                        Launch Workspace
                      </Button>
                    </Link>
                    <Link href={`/itinerary/${trip.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="outline" size="sm" title="Itinerary Calendar">
                        <Calendar size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredTrips.length > 0 && (
          <div className={styles.tripsList}>
            {filteredTrips.map((trip) => (
              <div key={trip.id} className={styles.listRow}>
                <img src={trip.coverImage} alt={trip.title} className={styles.listThumb} />

                <div className={styles.listInfo}>
                  <div className={styles.listTitle}>{trip.title}</div>
                  <div className={styles.listMeta}>
                    {trip.destinations?.join(', ')} • {formatDateRange(trip.startDate, trip.endDate)}
                  </div>
                </div>

                <div className={styles.listStats}>
                  <span>{trip.stopsCount || 3} stops</span>
                  <strong>{formatCurrency(trip.budget)}</strong>
                  <Badge status={trip.status} size="sm" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Link href={`/playground/${trip.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="outline" size="sm">
                      Open Canvas
                    </Button>
                  </Link>

                  <button
                    className={styles.threeDotBtn}
                    style={{ background: 'var(--gt-bg-alt)', color: 'var(--gt-text-primary)' }}
                    onClick={() => {
                      setDeleteTripTarget(trip);
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTripTarget && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalBox}>
              <h3 className={styles.modalTitle}>Delete Trip?</h3>
              <p className={styles.modalDesc}>
                Are you sure you want to permanently delete <strong>{deleteTripTarget.title}</strong>? All associated
                itinerary nodes and budgets will be erased.
              </p>
              <div className={styles.modalActions}>
                <Button variant="outline" size="md" onClick={() => setDeleteTripTarget(null)}>
                  Cancel
                </Button>
                <Button variant="danger" size="md" onClick={confirmDelete}>
                  Yes, Delete Trip
                </Button>
              </div>
            </div>
          </div>
        )}

        <ShareModal
          isOpen={!!shareTripTarget}
          onClose={() => setShareTripTarget(null)}
          trip={shareTripTarget}
        />
      </PageContainer>
    </div>
  );
}
