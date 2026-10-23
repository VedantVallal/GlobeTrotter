'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Compass,
  DollarSign,
  Share2,
  ExternalLink,
  Search,
  ArrowRight,
  Layers,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ShareModal from '@/components/ui/ShareModal';
import { tripService, itineraryService } from '@/lib/services';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from './itineraryHub.module.css';

const CATEGORY_COLORS = {
  Beach: { bg: '#e0f2fe', text: '#0284c7' },
  Heritage: { bg: '#f3e8ff', text: '#7c3aed' },
  Food: { bg: '#ffedd5', text: '#ea580c' },
  Adventure: { bg: '#d1fae5', text: '#059669' },
  Culture: { bg: '#e0e7ff', text: '#4f46e5' },
  Transport: { bg: '#dbeafe', text: '#2563eb' },
};

export default function ItineraryHubPage() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Share modal state
  const [shareTrip, setShareTripTarget] = useState(null);

  // 1. Load all trips
  useEffect(() => {
    async function loadTrips() {
      try {
        const loaded = await tripService.getTrips();
        setTrips(loaded);
        if (loaded.length > 0 && !selectedTripId) {
          setSelectedTripId(loaded[0].id);
        }
      } catch (err) {
        console.error('Failed to load trips', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, [selectedTripId]);

  // 2. Load itinerary for the selected trip
  useEffect(() => {
    if (!selectedTripId) return;
    async function loadDays() {
      try {
        const days = await itineraryService.getItinerary(selectedTripId);
        if (days && days.length > 0) {
          setItineraryDays(days);
        } else {
          setItineraryDays([]);
        }
      } catch (err) {
        console.error('Failed to load itinerary', err);
      }
    }
    loadDays();
  }, [selectedTripId]);

  // Selected trip object
  const currentTrip = useMemo(() => {
    return trips.find((t) => t.id === selectedTripId) || trips[0] || null;
  }, [trips, selectedTripId]);

  // Calculations
  const totalDays = itineraryDays.length;
  const totalActivities = itineraryDays.reduce(
    (acc, d) => acc + (d.activities?.length || 0),
    0
  );
  const totalEstCost = itineraryDays.reduce(
    (acc, d) =>
      acc + (d.activities || []).reduce((sum, a) => sum + (Number(a.cost) || 0), 0),
    0
  );

  // Filtered days based on day pill & search query
  const displayedDays = useMemo(() => {
    let result = [...itineraryDays];

    if (selectedDayFilter !== 'all') {
      result = result.filter((d) => String(d.day) === String(selectedDayFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result
        .map((d) => {
          const matchingActs = (d.activities || []).filter(
            (a) =>
              a.name?.toLowerCase().includes(q) ||
              a.category?.toLowerCase().includes(q) ||
              a.location?.toLowerCase().includes(q)
          );
          if (
            d.title?.toLowerCase().includes(q) ||
            d.location?.toLowerCase().includes(q) ||
            matchingActs.length > 0
          ) {
            return {
              ...d,
              activities: matchingActs.length > 0 ? matchingActs : d.activities,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    return result;
  }, [itineraryDays, selectedDayFilter, searchQuery]);

  return (
    <div className={styles.pageWrapper}>
      {/* App Header with Notification sync */}
      <Header
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Itineraries', href: '/itinerary' },
        ]}
      />

      <main className={styles.content}>
        {/* Hero Section */}
        <div className={styles.heroHeader}>
          <div className={styles.titleArea}>
            <div className={styles.badge}>
              <Sparkles size={13} />
              <span>AI-Optimized Pacing & Schedule Engine</span>
            </div>
            <h1 className={styles.pageTitle}>Travel Itineraries & Schedules</h1>
            <p className={styles.pageSubtitle}>
              Explore day-by-day activity timelines, transit pacing, and scheduled experiences synced directly with your Visual Canvas.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link
              href="/create-trip"
              className={styles.btnPrimaryBanner}
              style={{ textDecoration: 'none' }}
            >
              <Plus size={16} />
              <span>New Journey</span>
            </Link>
          </div>
        </div>

        {trips.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '72px 24px',
              background: 'var(--gt-surface, #ffffff)',
              borderRadius: 'var(--gt-radius-2xl, 16px)',
              border: '1px solid var(--gt-border, #e2e8f0)',
              marginTop: 24,
            }}
          >
            <Calendar size={54} color="var(--gt-blue, #2563eb)" style={{ margin: '0 auto 16px', opacity: 0.9 }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 8, color: 'var(--gt-text-primary, #0f172a)' }}>
              No Itineraries Created Yet
            </h3>
            <p style={{ color: 'var(--gt-text-secondary, #64748b)', fontSize: '14px', maxWidth: 460, margin: '0 auto 24px' }}>
              All predefined sample itineraries have been removed. Plan a new trip to create your customized day-by-day travel itinerary from scratch.
            </p>
            <Link
              href="/create-trip"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--gt-blue, #2563eb)',
                color: '#ffffff',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Plus size={16} />
              <span>Plan a New Trip</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Metric Summary Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Active Trips</div>
                <div className={styles.statValue}>{trips.length}</div>
                <div className={styles.statSubtext}>
                  <CheckCircle2 size={12} color="#059669" /> All synced with Map & Canvas
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Days Scheduled</div>
                <div className={styles.statValue}>{totalDays} Days</div>
                <div className={styles.statSubtext}>
                  <Clock size={12} color="#2563eb" /> Day-by-day timed itineraries
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Activities Logged</div>
                <div className={styles.statValue}>{totalActivities}</div>
                <div className={styles.statSubtext}>
                  <MapPin size={12} color="#7c3aed" /> Sightseeing, food, transport
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Est. Itinerary Budget</div>
                <div className={styles.statValue}>
                  {currentTrip?.currency === 'INR' ? '₹' : '$'}
                  {(currentTrip?.budget || totalEstCost || 0).toLocaleString()}
                </div>
                <div className={styles.statSubtext}>
                  <DollarSign size={12} color="#ea580c" /> Auto-calculated from stops
                </div>
              </div>
            </div>

        {/* Trip Selector Bar & Search */}
        <div className={styles.selectorSection}>
          <div className={styles.tripChips}>
            {trips.map((trip) => {
              const active = trip.id === selectedTripId;
              return (
                <button
                  key={trip.id}
                  type="button"
                  className={`${styles.tripChip} ${active ? styles.tripChipActive : ''}`}
                  onClick={() => {
                    setSelectedTripId(trip.id);
                    setSelectedDayFilter('all');
                  }}
                >
                  <Compass size={14} />
                  <span>{trip.title}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.searchBox}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search activity, city or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Active Trip Banner with Actions */}
        {currentTrip && (
          <div className={styles.tripBanner}>
            <div className={styles.tripBannerDetails}>
              <h2 className={styles.bannerTitle}>
                {currentTrip.title}
              </h2>
              <div className={styles.bannerMeta}>
                <div className={styles.bannerMetaItem}>
                  <MapPin size={14} color="#60a5fa" />
                  <span>
                    {Array.isArray(currentTrip.destinations)
                      ? currentTrip.destinations.join(' → ')
                      : currentTrip.destination || 'Multi-Destination'}
                  </span>
                </div>
                <div className={styles.bannerMetaItem}>
                  <Calendar size={14} color="#60a5fa" />
                  <span>
                    {currentTrip.startDate && currentTrip.endDate
                      ? `${currentTrip.startDate} to ${currentTrip.endDate}`
                      : `${totalDays} Days Planned`}
                  </span>
                </div>
                <div className={styles.bannerMetaItem}>
                  <Clock size={14} color="#60a5fa" />
                  <span>{totalActivities} Scheduled Stops</span>
                </div>
              </div>
            </div>

            <div className={styles.bannerActions}>
              <Link
                href={`/playground/${currentTrip.id}`}
                className={styles.btnPrimaryBanner}
                title="View interactive nodes and map on canvas"
              >
                <Layers size={15} />
                <span>Visual Canvas</span>
              </Link>

              <Link
                href={`/itinerary/${currentTrip.id}`}
                className={styles.btnSecondaryBanner}
                title="Open detailed Day Planner editor"
              >
                <Clock size={15} />
                <span>Edit Schedule</span>
              </Link>

              <button
                type="button"
                className={styles.btnSecondaryBanner}
                onClick={() => setShareTripTarget(currentTrip)}
                title="Invite collaborators & friends"
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}

        {/* Day Pills Filter */}
        <div className={styles.dayPillsBar}>
          <button
            type="button"
            className={`${styles.dayPill} ${selectedDayFilter === 'all' ? styles.dayPillActive : ''}`}
            onClick={() => setSelectedDayFilter('all')}
          >
            All Days ({totalDays})
          </button>
          {itineraryDays.map((d, index) => {
            const dayNum = d.day || index + 1;
            const active = String(selectedDayFilter) === String(dayNum);
            return (
              <button
                key={dayNum}
                type="button"
                className={`${styles.dayPill} ${active ? styles.dayPillActive : ''}`}
                onClick={() => setSelectedDayFilter(dayNum)}
              >
                Day {dayNum}
              </button>
            );
          })}
        </div>

        {/* Day-by-Day Timeline List */}
        <div className={styles.timelineGrid}>
          {displayedDays.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                color: '#64748b',
              }}
            >
              No activities found matching your search.
            </div>
          ) : (
            displayedDays.map((dayItem, dIdx) => (
              <div key={dIdx} className={styles.daySectionCard}>
                <div className={styles.dayHeader}>
                  <div className={styles.dayTitleGroup}>
                    <span className={styles.dayBadge}>Day {dayItem.day || dIdx + 1}</span>
                    <h3 className={styles.dayTitle}>
                      {dayItem.title || `Day ${dayItem.day || dIdx + 1} Schedule`}
                    </h3>
                  </div>

                  <div className={styles.dayMeta}>
                    {dayItem.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} color="#64748b" /> {dayItem.location}
                      </span>
                    )}
                    <span>•</span>
                    <span>{(dayItem.activities || []).length} activities</span>
                  </div>
                </div>

                {/* Activities List */}
                <div className={styles.activitiesList}>
                  {(!dayItem.activities || dayItem.activities.length === 0) ? (
                    <div style={{ padding: '28px 16px', textAlign: 'center', color: '#64748b', fontSize: 13, background: '#f8fafc', borderRadius: 8, margin: '8px 0', border: '1px dashed #cbd5e1' }}>
                      <p style={{ margin: '0 0 10px', fontWeight: 500 }}>No activities planned for this day yet.</p>
                      <Link
                        href={`/itinerary/${currentTrip.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#2563eb',
                          textDecoration: 'none',
                          background: '#eff6ff',
                          padding: '6px 12px',
                          borderRadius: 6,
                        }}
                      >
                        <Plus size={14} /> Add places to Day {dayItem.day}
                      </Link>
                    </div>
                  ) : (
                    dayItem.activities.map((activity, aIdx) => {
                      const catStyle = CATEGORY_COLORS[activity.category] || {
                        bg: '#f1f5f9',
                        text: '#475569',
                      };
                      return (
                        <div key={activity.id || aIdx} className={styles.activityCard}>
                          <div className={styles.activityLeft}>
                            <div className={styles.activityTime}>
                              <Clock size={12} color="#64748b" />
                              <span>{activity.time || 'Flexible'}</span>
                            </div>
                            <div className={styles.activityDot} />
                            <div className={styles.activityInfo}>
                              <div className={styles.activityName}>{activity.name}</div>
                              {activity.location && (
                                <div className={styles.activityLocation}>
                                  <MapPin size={11} /> {activity.location}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className={styles.activityRight}>
                            {activity.category && (
                              <span
                                className={styles.categoryTag}
                                style={{ background: catStyle.bg, color: catStyle.text }}
                              >
                                {activity.category}
                              </span>
                            )}
                            {activity.duration && (
                              <div className={styles.activityDuration}>
                                <Clock size={12} /> {activity.duration} min
                              </div>
                            )}
                            {activity.cost !== undefined && (
                              <div className={styles.activityCost}>
                                {activity.cost === 0
                                  ? 'Free'
                                  : `${currentTrip?.currency === 'INR' ? '₹' : '$'}${activity.cost}`}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Other Journeys Quick Switcher */}
        {trips.length > 1 && (
          <div className={styles.otherTripsSection}>
            <div className={styles.sectionHeading}>
              <span>Other Travel Schedules</span>
              <Link
                href="/trips"
                style={{
                  fontSize: 13,
                  color: '#2563eb',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontWeight: 600,
                }}
              >
                <span>View all journeys</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className={styles.otherTripsGrid}>
              {trips
                .filter((t) => t.id !== selectedTripId)
                .slice(0, 3)
                .map((other) => (
                  <div
                    key={other.id}
                    className={styles.otherTripCard}
                    onClick={() => {
                      setSelectedTripId(other.id);
                      setSelectedDayFilter('all');
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                  >
                    <div className={styles.otherTripTop}>
                      <span className={styles.otherTripTitle}>{other.title}</span>
                      <ChevronRight size={16} color="#94a3b8" />
                    </div>
                    <div className={styles.otherTripDest}>
                      {Array.isArray(other.destinations)
                        ? other.destinations.join(' → ')
                        : other.destination || 'Multi-City'}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 4,
                        fontSize: 12,
                        color: '#64748b',
                      }}
                    >
                      <span>{other.status || 'Planning'}</span>
                      <span style={{ fontWeight: 600, color: '#2563eb' }}>Inspect Day Plan →</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Share Modal */}
      {shareTrip && (
        <ShareModal
          trip={shareTrip}
          onClose={() => setShareTripTarget(null)}
          onUpdateTrip={(updated) => {
            setTrips(trips.map((t) => (t.id === updated.id ? updated : t)));
          }}
        />
      )}
    </div>
  );
}
