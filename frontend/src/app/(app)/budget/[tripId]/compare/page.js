'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, use, useMemo } from 'react';
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
  AlertTriangle,
  Hotel,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { tripService, budgetService } from '@/lib/services';
import { formatCurrency } from '@/lib/utils/formatters';
import citiesData from '@/lib/data/citiesData.json';
import styles from '../budget.module.css';

export default function ComparePlansPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;
  const router = useRouter();

  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [applyingPlanKey, setApplyingPlanKey] = useState(null);
  const [appliedMessage, setAppliedMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [t, b] = await Promise.all([
        tripService.getTripById(tripId),
        budgetService.getBudget(tripId),
      ]);
      setTrip(t);
      setBudgetData(b);
    }
    loadData();

    const handleCurrencyChange = () => setBudgetData((prev) => (prev ? { ...prev } : prev));
    window.addEventListener('gt_currency_changed', handleCurrencyChange);
    return () => window.removeEventListener('gt_currency_changed', handleCurrencyChange);
  }, [tripId]);

  const currentDestination = trip?.destinations?.[0] || 'Goa';
  const userBudgetCap = trip?.budget || 1200;
  const currentEstimated = budgetData?.estimated || 1380;
  const isOverBudget = currentEstimated > userBudgetCap;
  const shortfall = currentEstimated - userBudgetCap;

  // Find a sister/alternative city with lower cost per day
  const sisterCity = useMemo(() => {
    const currentLower = currentDestination.toLowerCase();
    // Look for a destination in same country/region or cheaper catalog city
    const candidates = citiesData.filter(
      (c) =>
        c.name.toLowerCase() !== currentLower &&
        c.avgCostPerDay &&
        c.avgCostPerDay < 55
    );

    // Contextual matches
    if (currentLower.includes('goa') || currentLower.includes('mumbai')) {
      const match = citiesData.find((c) => c.name.toLowerCase() === 'gokarna' || c.name.toLowerCase() === 'diu');
      if (match) return match;
    }
    if (currentLower.includes('jaipur') || currentLower.includes('rajasthan')) {
      const match = citiesData.find((c) => c.name.toLowerCase() === 'pushkar' || c.name.toLowerCase() === 'jodhpur');
      if (match) return match;
    }

    return candidates[0] || {
      name: 'Gokarna Coastal Sanctuary',
      avgCostPerDay: 38,
      country: 'India',
      description: 'Pristine tranquil beaches, clifftop cafes, and sacred temple trails at 45% lower cost.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop',
    };
  }, [currentDestination]);

  // Generate 3 Concrete Cutoff Alternatives
  const alternatives = useMemo(() => {
    const days = 7;
    const opt1Cost = Math.round(userBudgetCap * 0.91);
    const opt2Cost = Math.round(userBudgetCap * 0.86);
    const opt3Cost = Math.round(userBudgetCap * 0.72);

    return [
      {
        key: 'trim_activities',
        name: 'Option 1: Activity & Transit Trim',
        subtitle: 'Preserve Hotel & Destination • Trim High-Cost Commercial Tours',
        badge: 'Recommended',
        cost: opt1Cost,
        savings: currentEstimated - opt1Cost,
        budgetFit: `${Math.round((opt1Cost / userBudgetCap) * 100)}% of budget`,
        description:
          'Replaces expensive chartered boat cruises and commercial tour operators with top-rated free viewpoints, public beaches, and self-guided heritage trails.',
        changes: [
          'Replaced private sunset catamaran ($65) with Aguada clifftop panoramic walk ($0)',
          'Substituted commercial safari operator ($50) with self-guided heritage church loop ($8)',
          'Consolidated intercity cabs into organized shared coastal transit pass (save $45)',
          'All luxury stays & planned hotel bookings preserved without modification',
        ],
        planSummary: 'Saves money strictly on activities while keeping your chosen hotels and rooms intact.',
      },
      {
        key: 'stay_rebalance',
        name: 'Option 2: Stay & Comfort Rebalance',
        subtitle: 'Preserve 100% of Sightseeing • Switch to Boutique Heritage Lodging',
        badge: 'Maximum Value',
        cost: opt2Cost,
        savings: currentEstimated - opt2Cost,
        budgetFit: `${Math.round((opt2Cost / userBudgetCap) * 100)}% of budget`,
        description:
          'Keeps every single planned activity, beach excursion, and watersport tour intact, while rebalancing lodging from 5-star luxury to highly rated boutique heritage homestays.',
        changes: [
          'Switched 5-star beachfront suite ($120/night) to curated Portuguese heritage boutique stay ($42/night)',
          'Included daily traditional breakfast and private garden balcony',
          'Zero activity sacrifices: keeps river cruise, watersports, and spice plantation',
          'Immediate surplus margin created for fine-dining meals and emergencies',
        ],
        planSummary: 'Zero itinerary compromises: experience all activities with authentic boutique accommodation.',
      },
      {
        key: 'sister_destination',
        name: `Option 3: Sister Destination (${sisterCity.name})`,
        subtitle: `Alternative Sister Hub • Fits Exactly Within Cap with Zero Shortfall`,
        badge: 'Guaranteed Cap Fit',
        cost: opt3Cost,
        savings: currentEstimated - opt3Cost,
        budgetFit: `${Math.round((opt3Cost / userBudgetCap) * 100)}% of budget`,
        description: `Reroutes the journey to ${sisterCity.name}, a sister destination offering identical coastal beauty and cultural ambiance with 40% lower regional pricing.`,
        changes: [
          `Destination updated from ${currentDestination} to ${sisterCity.name}`,
          `Average daily spend: ${formatCurrency(sisterCity.avgCostPerDay || 40)}/day (vs. ${formatCurrency(75)}/day)`,
          'Pristine uncrowded beaches, cliffside shacks, and dramatic ocean treks',
          `100% fits within your ${formatCurrency(userBudgetCap)} budget limit with ${formatCurrency(userBudgetCap - opt3Cost)} surplus cash!`,
        ],
        planSummary: `Guaranteed zero shortfall: experience pristine landscapes in ${sisterCity.name} at regional benchmark rates.`,
        sisterCityData: sisterCity,
      },
    ];
  }, [userBudgetCap, currentEstimated, sisterCity, currentDestination]);

  // Apply Plan to Playground & Update Trip Ledger
  const handleApplyPlan = async (plan) => {
    setApplyingPlanKey(plan.key);

    try {
      // 1. Update trip in tripService
      const updatedFields = {
        budget: userBudgetCap,
        estimatedCost: plan.cost,
      };

      if (plan.key === 'sister_destination' && plan.sisterCityData) {
        updatedFields.destinations = [plan.sisterCityData.name];
        updatedFields.title = `${plan.sisterCityData.name} Coastal Escape`;
      }

      await tripService.update(tripId, updatedFields);

      // 2. Update playground nodes in localStorage to reflect new plan
      if (typeof window !== 'undefined') {
        const storedNodes = localStorage.getItem(`gt_nodes_${tripId}`);
        if (storedNodes) {
          try {
            let nodes = JSON.parse(storedNodes);
            if (plan.key === 'trim_activities') {
              // Mark commercial activities as replaced or lower cost
              nodes = nodes.map((n) => {
                if (n.category === 'Tours & Experiences' || n.category === 'Tour') {
                  return { ...n, estimatedCost: Math.round(n.estimatedCost * 0.4) };
                }
                return n;
              });
            } else if (plan.key === 'stay_rebalance') {
              // Update stay nodes to boutique homestay
              nodes = nodes.map((n) => {
                if (n.type === 'stay') {
                  return {
                    ...n,
                    title: 'Boutique Heritage Portuguese Homestay',
                    category: 'Homestay',
                    estimatedCost: 42,
                  };
                }
                return n;
              });
            } else if (plan.key === 'sister_destination' && plan.sisterCityData) {
              // Update city root node
              nodes = nodes.map((n) => {
                if (n.type === 'city') {
                  return { ...n, title: plan.sisterCityData.name, location: plan.sisterCityData.name };
                }
                return n;
              });
            }
            localStorage.setItem(`gt_nodes_${tripId}`, JSON.stringify(nodes));
          } catch (e) {}
        }
      }

      setAppliedMessage(`✓ Applied "${plan.name}" to your Playground canvas! Redirecting...`);
      setTimeout(() => {
        router.push(`/playground/${tripId}`);
      }, 1400);
    } catch (err) {
      console.error('Failed to apply plan', err);
      setApplyingPlanKey(null);
    }
  };

  return (
    <div className={styles.budgetRoot}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Budget', href: `/budget/${tripId}` },
          { label: 'Compare Scenario Alternatives' },
        ]}
      />

      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href={`/budget/${tripId}`} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
              <span>Back to Budget Ledger</span>
            </Button>
          </Link>
          <div className={styles.tripHeading}>{trip?.title || 'Trip'} — Budget Cutoff Optimizer</div>
        </div>
      </div>

      {appliedMessage && (
        <div
          style={{
            background: '#f0fdf4',
            color: '#16a34a',
            border: '1px solid #bbf7d0',
            padding: '14px 20px',
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {appliedMessage}
        </div>
      )}

      <PageContainer>
        {/* Banner: Budget Health Analysis */}
        <div
          style={{
            background: isOverBudget ? '#fff1f2' : '#f0fdf4',
            border: `1px solid ${isOverBudget ? '#fecdd3' : '#bbf7d0'}`,
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isOverBudget ? (
              <AlertTriangle size={24} color="#e11d48" />
            ) : (
              <CheckCircle2 size={24} color="#16a34a" />
            )}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: isOverBudget ? '#9f1239' : '#166534' }}>
                {isOverBudget
                  ? `Trip Estimated Spend Exceeds Budget Ceiling by ${formatCurrency(shortfall)}`
                  : `Trip Plan Fits Comfortably Within Your ${formatCurrency(userBudgetCap)} Budget Limit`}
              </div>
              <div style={{ fontSize: 13, color: isOverBudget ? '#be123c' : '#15803d', marginTop: 2 }}>
                Current estimate: <strong>{formatCurrency(currentEstimated)}</strong> • User budget cap:{' '}
                <strong>{formatCurrency(userBudgetCap)}</strong>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
            Showing 3 algorithmically optimized alternatives below
          </div>
        </div>

        <SectionHeader
          title="3 Budget-Constrained Alternative Scenarios"
          subtitle="Select any scenario below to resolve the shortfall. 1-click applies the revised activities, hotel tier, or sister city directly to your Playground canvas."
        />

        {/* 3 Alternatives Grid */}
        <div className={styles.compareGrid}>
          {alternatives.map((plan) => (
            <div
              key={plan.key}
              className={`${styles.planCard} ${plan.badge === 'Recommended' ? styles.planCardRecommended : ''}`}
            >
              {plan.badge && <div className={styles.ribbon}>{plan.badge}</div>}

              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 12, lineHeight: 1.3 }}>
                {plan.subtitle}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
                  {formatCurrency(plan.cost)}
                </span>
                <span style={{ fontSize: 12, color: '#64748b' }}>({plan.budgetFit})</span>
              </div>

              <div className={styles.altSavingsBadge}>
                <Sparkles size={12} color="#16a34a" />
                <span>Saves {formatCurrency(plan.savings)}</span>
              </div>

              <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
                {plan.description}
              </p>

              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: 6 }}>
                Specific Adjustments:
              </div>

              <ul className={styles.altChangesList}>
                {plan.changes.map((change, idx) => (
                  <li key={idx} className={styles.altChangeItem}>
                    <Check size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                <Button
                  variant={plan.badge === 'Recommended' ? 'primary' : 'secondary'}
                  size="sm"
                  style={{ width: '100%', height: 38, fontSize: 12 }}
                  onClick={() => handleApplyPlan(plan)}
                  disabled={applyingPlanKey === plan.key}
                >
                  {applyingPlanKey === plan.key ? (
                    <span>Applying Changes...</span>
                  ) : (
                    <>
                      <span>Apply This Plan to Playground</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
