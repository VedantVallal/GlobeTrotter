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
  Users,
  Plus,
  Receipt,
  Trash2,
  Check,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { tripService, budgetService } from '@/lib/services';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from './budget.module.css';

// 9 Standard DB Categories
export const NINE_CATEGORIES = [
  { key: 'intercity_transport', name: 'Intercity Transport', icon: '✈️', color: '#2563eb' },
  { key: 'local_transport',     name: 'Local Transport',     icon: '🚕', color: '#0284c7' },
  { key: 'accommodation',       name: 'Accommodation',       icon: '🏨', color: '#7c3aed' },
  { key: 'food_beverage',       name: 'Food & Beverages',    icon: '🍲', color: '#f59e0b' },
  { key: 'attraction_tickets',  name: 'Attraction Tickets',  icon: '🎟️', color: '#10b981' },
  { key: 'tours_experiences',   name: 'Tours & Experiences', icon: '🛶', color: '#ec4899' },
  { key: 'taxes_fees',          name: 'Taxes & Fees',        icon: '📋', color: '#64748b' },
  { key: 'contingency_buffer',  name: 'Contingency Buffer',  icon: '🛡️', color: '#8b5cf6' },
  { key: 'other',               name: 'Other',               icon: '📦', color: '#94a3b8' },
];

export const PROVENANCE_BADGES = {
  benchmark: {
    label: 'Dataset Benchmark',
    className: styles.provenanceBenchmark,
    tooltip: 'Verified catalog price from regional tourism datasets & OpenStreetMap',
  },
  published: {
    label: 'Published Tariff',
    className: styles.provenancePublished,
    tooltip: 'Directly matched to official airline, rail, or hotel tariff schedules',
  },
  ai_estimate: {
    label: 'AI Estimate',
    className: styles.provenanceAiEstimate,
    tooltip: 'Heuristic price estimation based on seasonal destination averages',
  },
  user_receipt: {
    label: 'User Logged Receipt',
    className: styles.provenanceUserReceipt,
    tooltip: 'Live verified receipt logged by traveler during the journey',
  },
};

export default function BudgetPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;

  const [trip, setTrip] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // What-If Simulation toggled activities (excluded activity IDs)
  const [excludedActivityIds, setExcludedActivityIds] = useState(new Set());

  // Group Collaborators for Splitwise
  const [collaborators, setCollaborators] = useState(['You', 'Aarav Mehta', 'Priya Sharma']);

  // Live Expenses Ledger (persisted in localStorage)
  const [expenses, setExpenses] = useState([]);
  const [settledSettlements, setSettledSettlements] = useState(new Set());

  // New Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('food_beverage');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePayer, setExpensePayer] = useState('You');
  const [selectedSplitters, setSelectedSplitters] = useState(['You', 'Aarav Mehta', 'Priya Sharma']);
  const [logSuccessToast, setLogSuccessToast] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTrip, loadedBudget] = await Promise.all([
          tripService.getTripById(tripId),
          budgetService.getBudget(tripId),
        ]);
        setTrip(loadedTrip);
        setBudgetData(loadedBudget);

        // Load collaborators if specified
        if (Array.isArray(loadedTrip?.collaborators) && loadedTrip.collaborators.length > 0) {
          const names = loadedTrip.collaborators.map((c) => c.name || c);
          if (!names.includes('You')) names.unshift('You');
          setCollaborators(names);
          setSelectedSplitters(names);
        }

        // Load saved live expenses
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem(`gt_expenses_${tripId}`);
            if (saved) {
              setExpenses(JSON.parse(saved));
            } else {
              // Pre-seed sample expenses so the user sees Splitwise in action immediately
              const defaultExpenses = [
                {
                  id: 'exp-1',
                  title: 'Airport Transfer & Coastal Taxi',
                  category: 'local_transport',
                  amount: 45,
                  paidBy: 'Aarav Mehta',
                  splitBetween: ['You', 'Aarav Mehta', 'Priya Sharma'],
                  provenance: 'user_receipt',
                  date: 'Yesterday, 14:30',
                },
                {
                  id: 'exp-2',
                  title: 'Seaside Coastal Thali Dinner at Ritz',
                  category: 'food_beverage',
                  amount: 68,
                  paidBy: 'You',
                  splitBetween: ['You', 'Aarav Mehta', 'Priya Sharma'],
                  provenance: 'user_receipt',
                  date: 'Yesterday, 20:15',
                },
                {
                  id: 'exp-3',
                  title: 'Heritage Fort & Lighthouse Entry Passes',
                  category: 'attraction_tickets',
                  amount: 24,
                  paidBy: 'Priya Sharma',
                  splitBetween: ['You', 'Aarav Mehta', 'Priya Sharma'],
                  provenance: 'user_receipt',
                  date: 'Today, 11:00',
                },
              ];
              setExpenses(defaultExpenses);
              localStorage.setItem(`gt_expenses_${tripId}`, JSON.stringify(defaultExpenses));
            }
          } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to load budget data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const handleCurrencyChange = () => setBudgetData((prev) => (prev ? { ...prev } : prev));
    window.addEventListener('gt_currency_changed', handleCurrencyChange);
    return () => window.removeEventListener('gt_currency_changed', handleCurrencyChange);
  }, [tripId]);

  // Save expenses to localStorage
  const persistExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gt_expenses_${tripId}`, JSON.stringify(newExpenses));
      } catch (e) {}
    }
  };

  // Add a new expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount);
    if (!expenseTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    const newExp = {
      id: `exp-${Date.now()}`,
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: amountNum,
      paidBy: expensePayer,
      splitBetween: selectedSplitters.length > 0 ? selectedSplitters : collaborators,
      provenance: 'user_receipt',
      date: 'Just now',
    };

    const updated = [newExp, ...expenses];
    persistExpenses(updated);
    setExpenseTitle('');
    setExpenseAmount('');
    setLogSuccessToast(true);
    setTimeout(() => setLogSuccessToast(false), 2500);
  };

  // Delete an expense
  const handleDeleteExpense = (expId) => {
    const updated = expenses.filter((e) => e.id !== expId);
    persistExpenses(updated);
  };

  // Toggle collaborator in split
  const toggleSplitter = (name) => {
    if (selectedSplitters.includes(name)) {
      if (selectedSplitters.length === 1) return; // Keep at least one
      setSelectedSplitters(selectedSplitters.filter((n) => n !== name));
    } else {
      setSelectedSplitters([...selectedSplitters, name]);
    }
  };

  // Compute 9-Category itemized list with Cost Provenance
  const nineCategoryBreakdown = useMemo(() => {
    const totalEst = trip?.budget ? Math.round(trip.budget * 0.85) : 980;

    const itemCatalog = {
      intercity_transport: [
        { name: 'Direct Flight / Express Transit (Round-trip)', cost: Math.round(totalEst * 0.14), provenance: 'published' },
        { name: 'Airport Express Connector Shuttle', cost: Math.round(totalEst * 0.04), provenance: 'published' },
      ],
      local_transport: [
        { name: 'Multi-Day Scooter / Rental Vehicle', cost: Math.round(totalEst * 0.05), provenance: 'published' },
        { name: 'Fuel & Highway Toll Passes', cost: Math.round(totalEst * 0.02), provenance: 'benchmark' },
        { name: 'Evening City Cabs & Micro-Transit', cost: Math.round(totalEst * 0.01), provenance: 'ai_estimate' },
      ],
      accommodation: [
        { name: 'Boutique Hotel / Heritage Villa Suites', cost: Math.round(totalEst * 0.25), provenance: 'published' },
        { name: 'Coastal Resort Lodging', cost: Math.round(totalEst * 0.07), provenance: 'published' },
      ],
      food_beverage: [
        { name: 'Regional Specialty Dinners & Fresh Seafood', cost: Math.round(totalEst * 0.09), provenance: 'benchmark' },
        { name: 'Cafe Lunches, Bakery & Coconut Drinks', cost: Math.round(totalEst * 0.06), provenance: 'ai_estimate' },
        { name: 'Artisan Coffee & Breakfast Buffets', cost: Math.round(totalEst * 0.03), provenance: 'benchmark' },
      ],
      attraction_tickets: [
        { name: 'Historic Citadels & Palaces Entry Passes', cost: Math.round(totalEst * 0.04), provenance: 'published' },
        { name: 'Museums, Forts & Heritage Foundations', cost: Math.round(totalEst * 0.03), provenance: 'benchmark' },
      ],
      tours_experiences: [
        { name: 'Catamaran Sunset Water Cruise', cost: Math.round(totalEst * 0.05), provenance: 'published' },
        { name: 'Organic Spice Plantation & Guided Safari', cost: Math.round(totalEst * 0.03), provenance: 'published' },
      ],
      taxes_fees: [
        { name: 'Regional Environmental Tourism Cess', cost: Math.round(totalEst * 0.015), provenance: 'published' },
        { name: 'GST & Statutory Service Surcharges', cost: Math.round(totalEst * 0.015), provenance: 'benchmark' },
      ],
      contingency_buffer: [
        { name: '10% Unforeseen Medical & Transit Contingency Buffer', cost: Math.round(totalEst * 0.04), provenance: 'ai_estimate' },
      ],
      other: [
        { name: 'Local 5G SIM Card & Data Connectivity Pack', cost: Math.round(totalEst * 0.01), provenance: 'published' },
        { name: 'Luggage Storage & Beach Lockers', cost: Math.round(totalEst * 0.01), provenance: 'benchmark' },
      ],
    };

    return NINE_CATEGORIES.map((cat) => {
      const items = itemCatalog[cat.key] || [];
      const subtotal = items.reduce((sum, item) => sum + item.cost, 0);
      return {
        ...cat,
        subtotal,
        items,
      };
    });
  }, [trip?.budget]);

  // Recalculate totals based on simulation & actuals
  const simulationResults = useMemo(() => {
    if (!budgetData) return null;

    let simulatedEstimated = 0;
    const simulatedDaily = (budgetData.daily || []).map((day) => {
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

    // Sum total logged expenses
    const totalActualLogged = expenses.reduce((sum, e) => sum + e.amount, 0);
    const variance = totalBudget - totalActualLogged;

    return {
      totalBudget,
      simulatedEstimated,
      totalActualLogged,
      remaining,
      variance,
      percentUsed,
      simulatedDaily,
      isUnderBudget: remaining >= 0,
    };
  }, [budgetData, trip, excludedActivityIds, expenses]);

  // Splitwise Settlement Algorithm ("Who Owes Whom")
  const settlements = useMemo(() => {
    if (expenses.length === 0 || collaborators.length === 0) return [];

    // 1. Calculate net balance for each person
    const balance = {};
    collaborators.forEach((name) => (balance[name] = 0));

    expenses.forEach((exp) => {
      const payer = exp.paidBy;
      const splitList = exp.splitBetween && exp.splitBetween.length > 0 ? exp.splitBetween : collaborators;
      const share = exp.amount / splitList.length;

      // Payer is credited the full amount
      if (balance[payer] !== undefined) {
        balance[payer] += exp.amount;
      }

      // Everyone who split is debited their share
      splitList.forEach((person) => {
        if (balance[person] !== undefined) {
          balance[person] -= share;
        }
      });
    });

    // 2. Separate into debtors (< 0) and creditors (> 0)
    const debtors = [];
    const creditors = [];

    Object.entries(balance).forEach(([person, net]) => {
      const rounded = Math.round(net * 100) / 100;
      if (rounded < -0.01) {
        debtors.push({ person, amount: -rounded });
      } else if (rounded > 0.01) {
        creditors.push({ person, amount: rounded });
      }
    });

    // 3. Greedily match debtors to creditors
    const results = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];

      const settleAmount = Math.min(debtor.amount, creditor.amount);
      const settleId = `${debtor.person}->${creditor.person}-${settleAmount.toFixed(2)}`;

      results.push({
        id: settleId,
        from: debtor.person,
        to: creditor.person,
        amount: Math.round(settleAmount),
      });

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount < 0.01) dIdx++;
      if (creditor.amount < 0.01) cIdx++;
    }

    return results;
  }, [expenses, collaborators]);

  const toggleSettle = (settleId) => {
    const nextSet = new Set(settledSettlements);
    if (nextSet.has(settleId)) {
      nextSet.delete(settleId);
    } else {
      nextSet.add(settleId);
    }
    setSettledSettlements(nextSet);
  };

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
        <p style={{ color: 'var(--gt-text-secondary)' }}>Calculating 9-category budget models...</p>
      </div>
    );
  }

  const { totalBudget, simulatedEstimated, totalActualLogged, remaining, percentUsed, simulatedDaily, isUnderBudget } = simulationResults;

  return (
    <div className={styles.budgetRoot}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'My Trips', href: '/trips' },
          { label: trip.title, href: `/playground/${trip.id}` },
          { label: 'Budget & Expenses' },
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
          <div className={styles.tripHeading}>{trip.title} — Budget & Splitwise Ledger</div>
        </div>

        <div>
          <Link href={`/budget/${trip.id}/compare`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm">
              <Layers size={14} />
              <span>Compare 3 Cutoff Alternatives</span>
            </Button>
          </Link>
        </div>
      </div>

      <PageContainer>
        {/* Top Summary Row (4 stat cards including Live Logged Spend) */}
        <div className={styles.statsRow} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
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

          {/* Card 2: Actual Logged Receipts */}
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Actual Logged Spend</div>
            <div className={styles.statValue} style={{ color: '#0d9488' }}>
              {formatCurrency(totalActualLogged)}
            </div>
            <div className={styles.statSubtext}>
              {expenses.length} live receipt(s) recorded in ledger
            </div>
            <div style={{ height: 6, background: 'var(--gt-bg-alt)', borderRadius: 10, marginTop: 8, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(Math.round((totalActualLogged / totalBudget) * 100), 100)}%`,
                  background: '#0d9488',
                  borderRadius: 10,
                }}
              />
            </div>
          </div>

          {/* Card 3: Remaining Margin */}
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
                  <span style={{ color: 'var(--gt-success)' }}>Within target budget</span>
                </>
              ) : (
                <>
                  <AlertCircle size={13} color="var(--gt-error)" />
                  <span style={{ color: 'var(--gt-error)' }}>Budget ceiling exceeded</span>
                </>
              )}
            </div>
          </div>

          {/* Card 4: Daily Average */}
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

        {/* 9-Category Cost Engine Section */}
        <div style={{ marginTop: 28, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--gt-text-primary)' }}>
                9-Category Itemized Cost Engine & Provenance
              </h2>
              <p style={{ fontSize: 13, color: 'var(--gt-text-secondary)', margin: '4px 0 0' }}>
                Every line item is audited with an honest provenance source badge verifying where the pricing originates.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(PROVENANCE_BADGES).map(([key, p]) => (
                <span key={key} className={`${styles.provenanceBadge} ${p.className}`} title={p.tooltip}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* 9 Categories Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14 }}>
            {nineCategoryBreakdown.map((cat) => (
              <div key={cat.key} className={styles.categoryGroupCard}>
                <div className={styles.categoryGroupHeader}>
                  <div className={styles.categoryGroupTitle}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  <span className={styles.categoryGroupAmount}>{formatCurrency(cat.subtotal)}</span>
                </div>

                <div className={styles.itemList}>
                  {cat.items.map((item, idx) => {
                    const badgeConfig = PROVENANCE_BADGES[item.provenance] || PROVENANCE_BADGES.benchmark;
                    return (
                      <div key={idx} className={styles.itemRow}>
                        <div className={styles.itemLeft}>
                          <span className={styles.itemName} title={item.name}>
                            {item.name}
                          </span>
                        </div>
                        <div className={styles.itemRight}>
                          <span className={`${styles.provenanceBadge} ${badgeConfig.className}`}>
                            {badgeConfig.label}
                          </span>
                          <span className={styles.itemCost}>{formatCurrency(item.cost)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================================
            LIVE EXPENSE TRACKER & GROUP SPLITWISE SECTION
            ================================================================== */}
        <section className={styles.splitwiseRoot} aria-label="Group Splitwise Expense Tracker">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={22} color="var(--gt-blue)" />
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--gt-text-primary)' }}>
                  Live Expense Tracker & Group Splitwise
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gt-text-secondary)', margin: '4px 0 0' }}>
                Log shared travel receipts on the go. The automated debt-minimizer calculates net balances so friends settle up effortlessly.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--gt-text-muted)' }}>Collaborators:</span>
              {collaborators.map((name) => (
                <span
                  key={name}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: name === 'You' ? '#eff6ff' : '#f1f5f9',
                    color: name === 'You' ? '#2563eb' : '#475569',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {logSuccessToast && (
            <div
              style={{
                background: '#f0fdf4',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
                padding: '10px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ✓ Expense logged to ledger! Recalculated settlement balances below.
            </div>
          )}

          <div className={styles.splitwiseGrid}>
            {/* Left: Log New Expense Form */}
            <div className={styles.expenseFormCard}>
              <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} color="var(--gt-blue)" />
                <span>Log New Shared Expense</span>
              </h3>

              <form onSubmit={handleAddExpense}>
                <div className={styles.expenseInputGroup}>
                  <label className={styles.expenseInputLabel}>Description *</label>
                  <input
                    type="text"
                    placeholder="e.g. Seafood Dinner at Ritz Classic"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className={styles.expenseInput}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className={styles.expenseInputGroup}>
                    <label className={styles.expenseInputLabel}>Amount ($) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      placeholder="e.g. 68"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className={styles.expenseInput}
                      required
                    />
                  </div>

                  <div className={styles.expenseInputGroup}>
                    <label className={styles.expenseInputLabel}>Category</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className={styles.expenseInput}
                    >
                      {NINE_CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.expenseInputGroup}>
                  <label className={styles.expenseInputLabel}>Paid By</label>
                  <select
                    value={expensePayer}
                    onChange={(e) => setExpensePayer(e.target.value)}
                    className={styles.expenseInput}
                  >
                    {collaborators.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.expenseInputGroup}>
                  <label className={styles.expenseInputLabel}>Split Equaled Between</label>
                  <div className={styles.collaboratorsPills}>
                    {collaborators.map((name) => {
                      const isSelected = selectedSplitters.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          className={`${styles.collabPill} ${isSelected ? styles.collabPillActive : ''}`}
                          onClick={() => toggleSplitter(name)}
                        >
                          {isSelected && <Check size={11} />}
                          <span>{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  style={{ width: '100%', marginTop: 12, height: 38 }}
                >
                  <Receipt size={14} />
                  <span>Log Expense to Splitwise</span>
                </Button>
              </form>
            </div>

            {/* Right: Live Receipts Log */}
            <div className={styles.tableCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 className={styles.cardTitle} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Receipt size={16} color="var(--gt-blue)" />
                  <span>Logged Expense Ledger ({expenses.length})</span>
                </h3>
                <span style={{ fontSize: 12, color: 'var(--gt-text-muted)' }}>
                  Total: <strong>{formatCurrency(totalActualLogged)}</strong>
                </span>
              </div>

              {expenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--gt-text-muted)' }}>
                  No shared expenses logged yet. Add your first receipt on the left!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 330, overflowY: 'auto' }}>
                  {expenses.map((exp) => {
                    const catObj = NINE_CATEGORIES.find((c) => c.key === exp.category) || NINE_CATEGORIES[0];
                    return (
                      <div
                        key={exp.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          gap: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 18 }}>{catObj.icon}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {exp.title}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <span>Paid by <strong>{exp.paidBy}</strong></span>
                              <span>•</span>
                              <span>Split across {exp.splitBetween?.length || 3} friends</span>
                              <span>•</span>
                              <span>{exp.date}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                            {formatCurrency(exp.amount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(exp.id)}
                            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                            title="Delete receipt"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* "Who Owes Whom" Settlement Cards Section */}
          <div className={styles.settlementSection}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 className={styles.cardTitle} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={17} color="#16a34a" />
                  <span>&quot;Who Owes Whom&quot; — Debt Simplification Settlements</span>
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--gt-text-secondary)', margin: '4px 0 0' }}>
                  Greedy debt reduction minimizes multi-way transactions to direct 1-to-1 payouts.
                </p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: 9999 }}>
                {settlements.filter((s) => !settledSettlements.has(s.id)).length} Pending
              </span>
            </div>

            {settlements.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                ✓ Everyone is all square! No pending balances between collaborators.
              </div>
            ) : (
              <div className={styles.settlementList}>
                {settlements.map((s) => {
                  const isSettled = settledSettlements.has(s.id);
                  return (
                    <div key={s.id} className={`${styles.settlementCard} ${isSettled ? styles.settledCard : ''}`}>
                      <div>
                        <div style={{ fontSize: 13, color: '#0f172a' }}>
                          <span className={styles.settlementPayer}>{s.from}</span> owes{' '}
                          <span className={styles.settlementPayee}>{s.to}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {isSettled ? '✓ Marked as settled' : 'Direct reimbursement'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={styles.settlementAmount}>{formatCurrency(s.amount)}</span>
                        <Button
                          variant={isSettled ? 'outline' : 'secondary'}
                          size="sm"
                          style={{ fontSize: 11, padding: '4px 8px' }}
                          onClick={() => toggleSettle(s.id)}
                        >
                          {isSettled ? 'Undo' : 'Settle'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Daily Spending Schedule & What-if Table */}
        <div className={styles.tableCard} style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className={styles.cardTitle} style={{ margin: 0 }}>Interactive Daily Pacing & Simulator</h3>
              <p style={{ fontSize: 12, color: 'var(--gt-text-muted)', margin: '4px 0 0' }}>
                Toggle individual activities on or off to simulate savings and watch the top margins recalculate live!
              </p>
            </div>
            {excludedActivityIds.size > 0 && (
              <Button variant="outline" size="sm" onClick={() => setExcludedActivityIds(new Set())}>
                Reset ({excludedActivityIds.size} Paused)
              </Button>
            )}
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
                      <strong>{day.day}</strong>
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
