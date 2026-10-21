'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { tripService, budgetService } from '@/lib/services';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from './budget.module.css';

export default function BudgetPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;

  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // What-If Simulation toggled activities (excluded activity IDs)
  const [excludedActivityIds, setExcludedActivityIds] = useState(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTrip, loadedBudget] = await Promise.all([
          tripService.getTripById(tripId),
          budgetService.getBudget(tripId),
        ]);
        setTrip(loadedTrip);
        setBudgetData(loadedBudget);
      } catch (err) {
        console.error('Failed to load budget data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripId]);

  // Recalculate totals based on simulation
  const simulationResults = useMemo(() => {
    if (!budgetData) return null;

    let simulatedEstimated = 0;
    const simulatedDaily = budgetData.daily.map((day) => {
      // Sum only activities not excluded
      const dayActivities = day.activitiesList || [
        { id: `${day.day}-1`, name: day.activities, cost: day.estimated },
      ];

      const activeCost = dayActivities
        .filter((act) => !excludedActivityIds.has(act.id))
        .reduce((sum, act) => sum + act.cost, 0);

      simulatedEstimated += activeCost;
      return {
        ...day,
        activeCost,
        dayActivities,
      };
    });

    const totalBudget = trip?.budget || budgetData.total || 1200;
    const remaining = totalBudget - simulatedEstimated;
    const percentUsed = Math.min(Math.round((simulatedEstimated / totalBudget) * 100), 100);

    return {
      totalBudget,
      simulatedEstimated,
      remaining,
      percentUsed,
      simulatedDaily,
      isUnderBudget: remaining >= 0,
    };
  }, [budgetData, trip, excludedActivityIds]);

  const toggleExcludeActivity = (actId) => {
    const nextSet = new Set(excludedActivityIds);
    if (nextSet.has(actId)) {
      nextSet.delete(actId);
    } else {
      nextSet.add(actId);
    }
    setExcludedActivityIds(nextSet);
  };

  if (loading || !trip || !budgetData || !simulationResults) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--gt-bg)' }}>
        <p style={{ color: 'var(--gt-text-secondary)' }}>Calculating budget models...</p>
      </div>
    );
  }

  const { totalBudget, simulatedEstimated, remaining, percentUsed, simulatedDaily, isUnderBudget } = simulationResults;

  return (
    <div className={styles.budgetRoot}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'My Trips', href: '/trips' },
          { label: trip.title, href: `/playground/${trip.id}` },
          { label: 'Budget Dashboard' },
        ]}
      />

      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href={`/playground/${trip.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
              <span>Back to Canvas</span>
            </Button>
          </Link>
          <div className={styles.tripHeading}>{trip.title} — Budget Dashboard</div>
        </div>

        <div>
          <Link href={`/budget/${trip.id}/compare`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm">
              <Layers size={14} />
              <span>Compare 3 Tiered Plans</span>
            </Button>
          </Link>
        </div>
      </div>

      <PageContainer>
        {/* Top Summary Row (3 stat cards) */}
        <div className={styles.statsRow}>
          {/* Card 1: Estimated Spend */}
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Estimated Spend</div>
            <div className={styles.statValue}>{formatCurrency(simulatedEstimated)}</div>
            <div className={styles.statSubtext}>of {formatCurrency(totalBudget)} total budget ({percentUsed}%)</div>
            <div style={{ height: 6, background: 'var(--gt-bg-alt)', borderRadius: 10, marginTop: 8, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${percentUsed}%`,
                  background: isUnderBudget ? 'var(--gt-blue)' : 'var(--gt-error)',
                  borderRadius: 10,
                }}
              />
            </div>
          </div>

          {/* Card 2: Remaining Margin */}
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Remaining Margin</div>
            <div
              className={styles.statValue}
              style={{ color: isUnderBudget ? 'var(--gt-success)' : 'var(--gt-error)' }}
            >
              {isUnderBudget ? formatCurrency(remaining) : `-${formatCurrency(Math.abs(remaining))}`}
            </div>
            <div className={styles.statSubtext} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {isUnderBudget ? (
                <>
                  <CheckCircle2 size={13} color="var(--gt-success)" />
                  <span style={{ color: 'var(--gt-success)' }}>Within target range</span>
                </>
              ) : (
                <>
                  <AlertCircle size={13} color="var(--gt-error)" />
                  <span style={{ color: 'var(--gt-error)' }}>Budget ceiling exceeded</span>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Daily Average */}
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Daily Pacing</div>
            <div className={styles.statValue}>
              {formatCurrency(simulatedEstimated / Math.max(simulatedDaily.length, 1))}
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gt-text-muted)' }}>/day</span>
            </div>
            <div className={styles.statSubtext}>
              Across {simulatedDaily.length} itinerary days
            </div>
          </div>
        </div>

        {/* Charts & Categorization Grid */}
        <div className={styles.chartsGrid}>
          {/* Category Breakdown */}
          <div className={styles.chartCard}>
            <h3 className={styles.cardTitle}>Category Spending Breakdown</h3>
            <div className={styles.catList}>
              {budgetData.categories.map((cat) => {
                const percent = Math.round((cat.amount / budgetData.estimated) * 100);
                return (
                  <div key={cat.name} className={styles.catRow}>
                    <div className={styles.catMeta}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }}
                        />
                        <strong>{cat.name}</strong>
                      </span>
                      <span>
                        <strong>{formatCurrency(cat.amount)}</strong>{' '}
                        <span style={{ color: 'var(--gt-text-muted)', fontSize: 12 }}>({percent}%)</span>
                      </span>
                    </div>
                    <div className={styles.catBarTrack}>
                      <div
                        className={styles.catBarFill}
                        style={{ width: `${percent}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What-If Simulation Helper Note */}
          <div className={styles.chartCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gt-blue)', marginBottom: 8 }}>
                <Sparkles size={18} />
                <h3 className={styles.cardTitle} style={{ margin: 0 }}>Interactive What-If Simulator</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gt-text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Simulate different scenarios by toggling individual activities on or off in the daily schedule below.
                Watch the remaining budget update live!
              </p>

              {excludedActivityIds.size > 0 && (
                <div
                  style={{
                    background: 'var(--gt-blue-light)',
                    padding: '12px 16px',
                    borderRadius: 'var(--gt-radius-lg)',
                    fontSize: 13,
                    color: 'var(--gt-blue)',
                    marginBottom: 16,
                  }}
                >
                  <strong>{excludedActivityIds.size} activities currently paused.</strong>
                  <br />
                  Estimated savings:{' '}
                  {formatCurrency(budgetData.estimated - simulatedEstimated)}
                </div>
              )}
            </div>

            {excludedActivityIds.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExcludedActivityIds(new Set())}
              >
                Reset All Activities to Active
              </Button>
            )}
          </div>
        </div>

        {/* Daily Spending Schedule & What-if Table */}
        <div className={styles.tableCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className={styles.cardTitle} style={{ margin: 0 }}>Daily Cost Schedule</h3>
            <span style={{ fontSize: 12, color: 'var(--gt-text-muted)' }}>
              Check/uncheck activities to simulate budget impact
            </span>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Timeline</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Included Activities</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {simulatedDaily.map((day) => {
                const isOverDailyLimit = day.activeCost > 180;
                return (
                  <tr key={day.day} className={isOverDailyLimit ? styles.rowAlert : ''}>
                    <td className={styles.td}>
                      <strong>Day {day.day}</strong>
                    </td>
                    <td className={styles.td}>{day.date}</td>
                    <td className={styles.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {day.dayActivities.map((act) => {
                          const isExcluded = excludedActivityIds.has(act.id);
                          return (
                            <label
                              key={act.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                textDecoration: isExcluded ? 'line-through' : 'none',
                                color: isExcluded ? 'var(--gt-text-muted)' : 'inherit',
                                fontSize: 13,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={!isExcluded}
                                onChange={() => toggleExcludeActivity(act.id)}
                                style={{ accentColor: 'var(--gt-blue)' }}
                              />
                              <span>{act.name}</span>
                              <span style={{ color: 'var(--gt-text-muted)', fontSize: 11 }}>
                                ({formatCurrency(act.cost)})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdCost}`} style={{ textAlign: 'right' }}>
                      {formatCurrency(day.activeCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </div>
  );
}
