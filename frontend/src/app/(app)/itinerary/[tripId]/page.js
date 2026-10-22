'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Share2,
  DollarSign,
  Compass,
  CheckCircle2,
  X,
  ExternalLink,
  Download,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ShareModal from '@/components/ui/ShareModal';
import { tripService, itineraryService, exportOfflineTripPack } from '@/lib/services';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';
import styles from './itinerary.module.css';

const CATEGORY_COLORS = {
  Beach: '#38bdf8',
  Heritage: '#a855f7',
  Food: '#f97316',
  Adventure: '#10b981',
  Culture: '#6366f1',
  Transport: '#4169D8',
};

export default function ItineraryPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;

  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Optimize Modal
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [optimizedNotice, setOptimizedNotice] = useState(false);

  // Activity Details Modal
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTrip, loadedDays] = await Promise.all([
          tripService.getTripById(tripId),
          itineraryService.getItinerary(tripId),
        ]);
        setTrip(loadedTrip);

        // If itinerary days exist use them, otherwise mock a 5-day schedule
        if (loadedDays && loadedDays.length > 0) {
          setDays(loadedDays);
        } else {
          setDays([
            {
              day: 1,
              date: '2026-11-10',
              title: 'Arrival & North Goa Coastline',
              location: 'Calangute, Goa',
              activities: [
                { id: 'a1', time: '09:00', name: 'Check-in at Sea Breeze Resort', category: 'Transport', duration: 45, cost: 0, location: 'Calangute' },
                { id: 'a2', time: '11:00', name: 'Calangute Beach Sunrise & Stroll', category: 'Beach', duration: 90, cost: 0, location: 'Calangute Beach' },
                { id: 'a3', time: '13:30', name: 'Fresh Seafood Lunch at Britto’s', category: 'Food', duration: 75, cost: 35, location: 'Baga' },
                { id: 'a4', time: '16:00', name: 'Aguada Fort Sunset Walk', category: 'Heritage', duration: 120, cost: 10, location: 'Sinquerim' },
              ],
            },
            {
              day: 2,
              date: '2026-11-11',
              title: 'Watersports & Anjuna Flea Market',
              location: 'Anjuna, Goa',
              activities: [
                { id: 'a5', time: '10:00', name: 'Parasailing & Jet Skiing', category: 'Adventure', duration: 120, cost: 50, location: 'Baga Beach' },
                { id: 'a6', time: '14:00', name: 'Anjuna Curated Artisan Market', category: 'Culture', duration: 90, cost: 15, location: 'Anjuna' },
                { id: 'a7', time: '18:30', name: 'Curries & Live Jazz at Curlies', category: 'Food', duration: 110, cost: 40, location: 'South Anjuna' },
              ],
            },
            {
              day: 3,
              date: '2026-11-12',
              title: 'Old Goa Heritage Churches & Spice Plantation',
              location: 'Old Goa',
              activities: [
                { id: 'a8', time: '09:30', name: 'Basilica of Bom Jesus Guided Tour', category: 'Heritage', duration: 90, cost: 5, location: 'Old Goa' },
                { id: 'a9', time: '12:00', name: 'Sahakari Spice Farm Lunch Tour', category: 'Culture', duration: 150, cost: 30, location: 'Ponda' },
                { id: 'a10', time: '16:30', name: 'Mandovi River Sunset Cruise', category: 'Beach', duration: 60, cost: 20, location: 'Panaji Jetty' },
              ],
            },
            {
              day: 4,
              date: '2026-11-13',
              title: 'Latin Quarter of Fontainhas & Panaji',
              location: 'Panaji',
              activities: [
                { id: 'a11', time: '10:00', name: 'Fontainhas Architectural Photo Walk', category: 'Culture', duration: 120, cost: 0, location: 'Fontainhas' },
                { id: 'a12', time: '13:00', name: 'Traditional Goan Thali at Viva Panjim', category: 'Food', duration: 60, cost: 22, location: 'Altinho' },
                { id: 'a13', time: '15:30', name: 'Local Pottery & Handcraft Shopping', category: 'Heritage', duration: 90, cost: 40, location: 'Panaji Market' },
              ],
            },
            {
              day: 5,
              date: '2026-11-14',
              title: 'South Goa Palolem Beach & Return',
              location: 'Palolem',
              activities: [
                { id: 'a14', time: '09:00', name: 'Palolem Bay Kayaking to Butterfly Beach', category: 'Adventure', duration: 120, cost: 30, location: 'Palolem' },
                { id: 'a15', time: '13:00', name: 'Farewell Beachside Lunch', category: 'Food', duration: 90, cost: 35, location: 'Palolem Beach' },
                { id: 'a16', time: '16:00', name: 'Transfer to Dabolim Airport', category: 'Transport', duration: 90, cost: 25, location: 'Airport' },
              ],
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load itinerary', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripId]);

  const activeDay = days[selectedDayIndex] || days[0];

  const handleOptimizeConfirm = () => {
    setShowOptimizeModal(false);
    setOptimizedNotice(true);
    setTimeout(() => setOptimizedNotice(false), 4000);
  };

  if (loading || !trip) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--gt-bg)' }}>
        <p style={{ color: 'var(--gt-text-secondary)' }}>Loading daily itinerary...</p>
      </div>
    );
  }

  const activeDayCost = activeDay?.activities?.reduce((acc, a) => acc + (a.cost || 0), 0) || 0;

  return (
    <div className={styles.itineraryRoot}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'My Trips', href: '/trips' },
          { label: trip.title, href: `/playground/${trip.id}` },
          { label: 'Itinerary' },
        ]}
      />

      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href={`/playground/${trip.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
              <span>Canvas</span>
            </Button>
          </Link>
          <div>
            <div className={styles.tripHeading}>{trip.title} — Day Timeline</div>
            <div className={styles.tripSub}>
              {formatDateRange(trip.startDate, trip.endDate)} • {days.length} Total Days Scheduled
            </div>
          </div>
        </div>

        <div className={styles.topBarRight}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowOptimizeModal(true)}
          >
            <Sparkles size={14} color="var(--gt-blue)" />
            <span>AI Optimize Route</span>
          </Button>

          <Link href={`/budget/${trip.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm">
              <DollarSign size={14} />
              <span>Budget Breakdown</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportOfflineTripPack(trip, days)}
            title="Download standalone offline HTML guide with emergency checklist for remote/mountain travel"
          >
            <Download size={14} color="#10b981" />
            <span>Export Offline Pack</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 size={14} />
            <span>Share Itinerary</span>
          </Button>
        </div>
      </div>

      {optimizedNotice && (
        <div
          style={{
            background: 'var(--gt-success-bg)',
            color: 'var(--gt-success)',
            padding: '10px 20px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 600,
            borderBottom: '1px solid rgba(22, 163, 74, 0.2)',
          }}
        >
          ✨ Route & Activity order optimized for minimum travel duration! (Demo simulation)
        </div>
      )}

      {/* Day Navigation Bar */}
      <div className={styles.dayNavBar}>
        {days.map((d, index) => {
          const isActive = selectedDayIndex === index;
          return (
            <button
              key={d.day}
              className={`${styles.dayPill} ${isActive ? styles.dayPillActive : ''}`}
              onClick={() => setSelectedDayIndex(index)}
            >
              <span className={styles.dayTitle}>Day {d.day}</span>
              <span className={styles.dayDate}>{d.date}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Schedule (65%) & Day Mini-Map (35%) */}
      <div className={styles.mainLayout}>
        {/* Left Column: Day Schedule */}
        <div className={styles.scheduleCard}>
          <div className={styles.scheduleHeader}>
            <div>
              <h2 className={styles.scheduleTitle}>
                Day {activeDay?.day}: {activeDay?.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'var(--gt-text-muted)', marginTop: 4 }}>
                <MapPin size={13} />
                <span>{activeDay?.location}</span>
                <span>•</span>
                <span>Est. Day Spend: {formatCurrency(activeDayCost)}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newAct = {
                  id: `act-new-${Date.now()}`,
                  time: '19:00',
                  name: 'Evening Seaside Stroll',
                  category: 'Beach',
                  duration: 60,
                  cost: 0,
                  location: activeDay?.location || 'Goa',
                };
                const updated = [...days];
                updated[selectedDayIndex].activities.push(newAct);
                setDays(updated);
              }}
            >
              <Plus size={14} />
              <span>Add Activity</span>
            </Button>
          </div>

          {/* Agenda Activity List */}
          <div className={styles.agendaList}>
            {activeDay?.activities?.map((activity) => (
              <div
                key={activity.id}
                className={styles.agendaItem}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className={styles.timeSlot}>{activity.time}</div>
                <div
                  className={styles.itemDot}
                  style={{ backgroundColor: CATEGORY_COLORS[activity.category] || 'var(--gt-blue)' }}
                />
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{activity.name}</div>
                  <div className={styles.itemMeta}>
                    <span>{activity.location}</span>
                    <span>•</span>
                    <span>{activity.duration} mins</span>
                    <span>•</span>
                    <Badge size="sm" color="blue">{activity.category}</Badge>
                  </div>
                </div>
                <div className={styles.itemCost}>
                  {activity.cost > 0 ? formatCurrency(activity.cost) : 'Free'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mini Map & Day Stats */}
        <aside className={styles.miniMapCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gt-text-primary)' }}>
              Geographic Route
            </span>
            <span style={{ fontSize: '11px', color: 'var(--gt-text-muted)' }}>
              {activeDay?.activities?.length || 0} stops today
            </span>
          </div>

          <div className={styles.miniMapFrame}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path
                d="M 60 160 Q 140 60, 240 120 T 320 180"
                fill="none"
                stroke="var(--gt-blue)"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            </svg>

            <div className={styles.miniMapPin} style={{ left: '20%', top: '65%' }}>1</div>
            <div className={styles.miniMapPin} style={{ left: '45%', top: '25%' }}>2</div>
            <div className={styles.miniMapPin} style={{ left: '70%', top: '48%' }}>3</div>
          </div>

          <div style={{ background: 'var(--gt-bg-alt)', borderRadius: 'var(--gt-radius-lg)', padding: 'var(--gt-space-4)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gt-text-primary)', marginBottom: 4 }}>
              💡 Smart Transit Advisory
            </div>
            <p style={{ fontSize: '11px', color: 'var(--gt-text-secondary)', lineHeight: 1.5 }}>
              Average transit between activities is under 20 minutes by local scooter or taxi. Start early to avoid peak noon temperatures!
            </p>
          </div>
        </aside>
      </div>

      {/* Optimize Modal */}
      {showOptimizeModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gt-blue)', marginBottom: 12 }}>
              <Sparkles size={24} />
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>AI Itinerary Optimization</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--gt-text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
              Our AI engine will analyze geographic locations and open hours to sequence your activities for minimum travel time and optimal pacing.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="outline" size="md" onClick={() => setShowOptimizeModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleOptimizeConfirm}>
                Run Optimization
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedActivity.name}</h3>
                <span style={{ fontSize: 12, color: 'var(--gt-text-muted)' }}>{selectedActivity.location}</span>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gt-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: 'var(--gt-bg-alt)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted)', display: 'block' }}>Scheduled Time</span>
                <strong>{selectedActivity.time} ({selectedActivity.duration}m)</strong>
              </div>
              <div style={{ background: 'var(--gt-bg-alt)', padding: 12, borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted)', display: 'block' }}>Est. Cost</span>
                <strong>{selectedActivity.cost > 0 ? formatCurrency(selectedActivity.cost) : 'Complimentary'}</strong>
              </div>
            </div>

            <Button variant="primary" size="md" style={{ width: '100%' }} onClick={() => setSelectedActivity(null)}>
              Done
            </Button>
          </div>
        </div>
      )}

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
