'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Copy,
  Share2,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ShareModal from '@/components/ui/ShareModal';
import { tripService, itineraryService } from '@/lib/services';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';
import styles from './share.module.css';

export default function SharedTripPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;

  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTrip, loadedDays] = await Promise.all([
          tripService.getTripById(tripId),
          itineraryService.getItinerary(tripId),
        ]);
        setTrip(loadedTrip);
        setDays(loadedDays || []);
      } catch (err) {
        console.error('Failed to load shared trip', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: trip?.title || 'GlobeTrotter Journey',
          text: `Check out this journey on GlobeTrotter: ${trip?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        setShareModalOpen(true);
      }
    } else {
      setShareModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--gt-bg)' }}>
        <p style={{ color: 'var(--gt-text-secondary)' }}>Loading published travelogue...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--gt-bg)', gap: 16, textAlign: 'center', padding: 20 }}>
        <Globe size={48} color="var(--gt-blue)" />
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gt-text-primary)' }}>Trip Plan Not Found</h2>
        <p style={{ color: 'var(--gt-text-secondary)', maxWidth: 400 }}>The trip link you visited might be private or no longer available.</p>
        <Link href="/trips" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Explore My Trips</Button>
        </Link>
      </div>
    );
  }

  const stops = (trip.destinations && trip.destinations.length > 0)
    ? trip.destinations
    : ['Calangute', 'Old Goa', 'Palolem'];

  return (
    <div className={styles.shareRoot}>
      {/* Minimal Public Navigation */}
      <header className={styles.publicNav}>
        <Link href="/" className={styles.brand}>
          <Globe size={22} />
          <span>GlobeTrotter</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" style={{ fontSize: 13, color: 'var(--gt-text-secondary)', textDecoration: 'none' }}>
            Sign in
          </Link>
          <Link href="/create-trip" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm">
              Build Your Own Trip
            </Button>
          </Link>
        </div>
      </header>

      {/* Demo Simulation Notice */}
      <div className={styles.demoBanner}>
        🌍 Public Read-Only Travel Story • Shared via GlobeTrotter Node Architecture
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <img src={trip.coverImage} alt={trip.title} className={styles.heroImg} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <Badge status="upcoming" size="md" style={{ marginBottom: 12 }} />
          <h1 className={styles.heroTitle}>{trip.title}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaItem}>
              <MapPin size={15} />
              <span>{stops.join(' → ')}</span>
            </span>
            <span>•</span>
            <span className={styles.heroMetaItem}>
              <Calendar size={15} />
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </span>
            <span>•</span>
            <span className={styles.heroMetaItem}>
              <Users size={15} />
              <span>{trip.travelers || 2} Explorers</span>
            </span>
          </div>
        </div>
      </section>

      {/* Trip Metric Strip */}
      <div className={styles.summaryBar}>
        <div className={styles.summaryBarInner}>
          <div className={styles.summaryMetric}>
            <MapPin size={16} color="var(--gt-blue)" />
            <span><strong>{stops.length}</strong> Destination Stops</span>
          </div>
          <div className={styles.summaryMetric}>
            <Calendar size={16} color="var(--gt-blue)" />
            <span><strong>{days.length || 5}</strong> Scheduled Days</span>
          </div>
          <div className={styles.summaryMetric}>
            <DollarSign size={16} color="var(--gt-teal)" />
            <span>Target Budget: <strong>{formatCurrency(trip.budget)}</strong></span>
          </div>
          <div className={styles.summaryMetric}>
            <Sparkles size={16} color="var(--gt-coral)" />
            <span>Vibe: <strong>Coastal & Heritage</strong></span>
          </div>
        </div>
      </div>

      {/* Editorial Story Body */}
      <main className={styles.editorialBody}>
        {/* Visual Route Representation */}
        <div className={styles.routeVisualCard}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--gt-text-muted)', marginBottom: 8 }}>
            Route Progression
          </div>

          <div className={styles.routeNodesRow}>
            {stops.map((stop, idx) => (
              <div key={stop} className={styles.routeStop}>
                <div className={styles.stopCircle}>{idx + 1}</div>
                <div className={styles.stopName}>{stop}</div>
                <div className={styles.stopDates}>Stop 0{idx + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-Day Agenda */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Complete Daily Itinerary</h2>
          <p style={{ fontSize: 14, color: 'var(--gt-text-secondary)' }}>
            Follow the chronological stops, times, and activities planned for this journey.
          </p>
        </div>

        {days.map((day) => (
          <div key={day.day} className={styles.dayBlock}>
            <div className={styles.dayBlockHeader}>
              <div className={styles.dayNumber}>Day {day.day}: {day.title}</div>
              <div className={styles.dayDateLabel}>{day.date} • {day.location}</div>
            </div>

            <div className={styles.dayActivitiesList}>
              {day.activities?.map((act) => (
                <div key={act.id} className={styles.dayActItem}>
                  <div className={styles.actTime}>{act.time}</div>
                  <div className={styles.actDetails}>
                    <div className={styles.actTitle}>{act.name}</div>
                    <div className={styles.actSub}>
                      {act.location} • {act.duration} mins • {act.cost > 0 ? formatCurrency(act.cost) : 'Free'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Sticky Bottom Sharing Bar */}
      <div className={styles.stickyBottomBar}>
        <div className={styles.stickyLeft}>
          Like this plan? Save or duplicate it to customize your own stops.
        </div>

        <div className={styles.stickyRight}>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            {copied ? <Check size={14} color="var(--gt-success)" /> : <Copy size={14} />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={handleNativeShare}>
            <Share2 size={14} />
            <span>Share</span>
          </Button>

          <Link href={`/playground/${trip.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm">
              <span>Open in Canvas</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
