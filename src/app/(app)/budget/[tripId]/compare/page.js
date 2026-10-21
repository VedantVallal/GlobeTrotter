'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Sparkles,
  Layers,
  Compass,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { tripService } from '@/lib/services';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from '../budget.module.css';

export default function ComparePlansPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;
  const router = useRouter();

  const [trip, setTrip] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('balanced');
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      const t = await tripService.getTripById(tripId);
      setTrip(t);
    }
    loadTrip();
  }, [tripId]);

  const handleSelectPlan = (planKey) => {
    setSelectedPlan(planKey);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      router.push(`/playground/${tripId}`);
    }, 1500);
  };

  const PLANS = [
    {
      key: 'budget',
      name: 'Essential Backpacker',
      cost: 780,
      stops: 2,
      activities: 6,
      intensity: 'Relaxed & Self-Paced',
      budgetFit: '65% of target',
      description: 'Prioritizes free beaches, walking heritage trails, and local street cuisine.',
      highlights: [
        'Affordable beachside huts & guesthouses',
        'Self-guided heritage church visits',
        'Scooter rental instead of private cabs',
        'Zero booking fee activities',
      ],
    },
    {
      key: 'balanced',
      name: 'Curated Explorer',
      recommended: true,
      cost: 1180,
      stops: 3,
      activities: 12,
      intensity: 'Moderate & Well-Rounded',
      budgetFit: '98% of target',
      description: 'The golden balance between scenic exploration, guided adventures, and comfort.',
      highlights: [
        'Boutique beachfront resorts with breakfast',
        'Watersports bundle (parasailing & jet ski)',
        'Guided spice plantation & river cruise',
        'Combination of street food & renowned seaside cafes',
      ],
    },
    {
      key: 'experience',
      name: 'Luxury Discovery',
      cost: 1850,
      stops: 4,
      activities: 18,
      intensity: 'Packed & Premium',
      budgetFit: '154% of target',
      description: 'Private chauffeur transfers, 5-star heritage retreats, and private yacht charters.',
      highlights: [
        '5-Star luxury heritage resort stay',
        'Private chartered catamaran sunset cruise',
        'Fine-dining chef tastings with wine pairing',
        'Private air-conditioned chauffeur throughout',
      ],
    },
  ];

  return (
    <div className={styles.budgetRoot}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Budget', href: `/budget/${tripId}` },
          { label: 'Compare Scenario Plans' },
        ]}
      />

      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href={`/budget/${tripId}`} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
              <span>Back to Budget</span>
            </Button>
          </Link>
          <div className={styles.tripHeading}>{trip?.title || 'Trip'} — Scenario Plan Comparison</div>
        </div>
      </div>

      {successToast && (
        <div
          style={{
            background: 'var(--gt-success-bg)',
            color: 'var(--gt-success)',
            padding: '12px 20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          ✓ Plan selected! Updating your workspace node schedule...
        </div>
      )}

      <PageContainer>
        <SectionHeader
          title="Compare Route & Budget Scenarios"
          subtitle="Explore 3 pre-calculated variations tailored to your destination stops and traveler group"
        />

        <div className={styles.compareGrid}>
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`${styles.planCard} ${plan.recommended ? styles.planCardRecommended : ''}`}
            >
              {plan.recommended && <div className={styles.ribbon}>Recommended</div>}

              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gt-text-primary)', marginBottom: 4 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--gt-text-secondary)', lineHeight: 1.4 }}>
                  {plan.description}
                </p>
              </div>

              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--gt-border)' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gt-text-primary)' }}>
                  {formatCurrency(plan.cost)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gt-text-muted)' }}>
                  Fit: <strong>{plan.budgetFit}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, fontSize: 12 }}>
                <div style={{ background: 'var(--gt-bg-alt)', padding: 10, borderRadius: 8 }}>
                  <span style={{ color: 'var(--gt-text-muted)', display: 'block' }}>Stops</span>
                  <strong>{plan.stops} Cities</strong>
                </div>
                <div style={{ background: 'var(--gt-bg-alt)', padding: 10, borderRadius: 8 }}>
                  <span style={{ color: 'var(--gt-text-muted)', display: 'block' }}>Activities</span>
                  <strong>{plan.activities} Total</strong>
                </div>
              </div>

              <div style={{ marginBottom: 24, flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gt-text-primary)', marginBottom: 8 }}>
                  Plan Inclusions:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--gt-text-secondary)' }}>
                      <Check size={14} color="var(--gt-blue)" style={{ marginTop: 3, flexShrink: 0 }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={plan.recommended ? 'primary' : 'outline'}
                size="md"
                style={{ width: '100%' }}
                onClick={() => handleSelectPlan(plan.key)}
              >
                {selectedPlan === plan.key ? 'Current Active Plan' : 'Select This Plan'}
              </Button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: 'var(--gt-text-muted)' }}>
          * Scenario plans are estimates calculated based on local average seasonal pricing and itinerary density.
        </div>
      </PageContainer>
    </div>
  );
}
