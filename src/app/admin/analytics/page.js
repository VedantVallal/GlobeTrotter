'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Compass,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Share2,
  Clock,
  Wallet,
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { adminService } from '@/lib/services/adminService';
import { useAdminToast } from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import styles from '@/components/admin/admin.module.css';

const TIME_RANGES = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: '1y', label: 'This Year' },
];

const CATEGORY_COLORS = ['#4169D8', '#0D9488', '#7C6AF5', '#F59E42', '#25845A', '#E11D48'];

export default function AnalyticsAdminPage() {
  const { addToast } = useAdminToast();
  const [timeframe, setTimeframe] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [anData, stData] = await Promise.all([
          adminService.getAnalytics(timeframe),
          adminService.getDashboardStats(),
        ]);
        setAnalyticsData(anData);
        setStats(stData);
      } catch (err) {
        console.error(err);
        addToast('Failed to load analytics trends', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeframe]);

  const handleExportData = () => {
    addToast('Analytics report exported as CSV (Demo)', 'info');
  };

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Platform Analytics & Travel Intelligence</h1>
          <p className={styles.pageSubtitle}>
            Aggregate planning behavior, regional destination demand, and user acquisition metrics.
          </p>
        </div>
        <div className={styles.headerActions}>
          <div style={{ display: 'flex', background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8, padding: 3, gap: 2 }}>
            {TIME_RANGES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: timeframe === t.id ? 'var(--gt-blue, #4169d8)' : 'transparent',
                  color: timeframe === t.id ? '#ffffff' : 'var(--gt-text-secondary, #647184)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button className={styles.btnSecondary} onClick={handleExportData}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 8,
          marginBottom: 20,
          color: '#1e40af',
          fontSize: 12.5,
        }}
      >
        <Info size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Data:</strong> These analytics reflect simulated traveler activity across 330+ destinations. In production, this view hooks directly into Firestore aggregation queries and Google Analytics 4.
        </span>
      </div>

      {/* KPI Top Summary Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Registered Travelers"
          value={stats?.totalUsers?.value?.toLocaleString() || '14,820'}
          change={stats?.totalUsers?.change || '+12.4%'}
          period="vs prior 30d"
          isPositive={true}
          icon={Users}
          color="#4169D8"
        />
        <StatCard
          label="Total Trips Generated"
          value={stats?.totalTrips?.value?.toLocaleString() || '38,450'}
          change={stats?.totalTrips?.change || '+18.2%'}
          period="active sessions"
          isPositive={true}
          icon={Compass}
          color="#0D9488"
        />
        <StatCard
          label="Average Trip Duration"
          value="5.8 Days"
          change="+0.4 days"
          period="planning depth"
          isPositive={true}
          icon={Clock}
          color="#7C6AF5"
        />
        <StatCard
          label="Average Budget Allocated"
          value={stats?.avgTripBudget?.value || '₹64,500'}
          change="+8.1%"
          period="spending intent"
          isPositive={true}
          icon={Wallet}
          color="#F59E42"
        />
      </div>

      {/* Primary Charts Row: User Growth & Trip Volume */}
      <div className={styles.chartsGrid}>
        {/* User Acquisition & Planners */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Traveler Acquisition & Active Planners</h3>
              <p className={styles.chartSubtitle}>Daily new signups vs active visual canvas planners</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4169D8' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4169D8' }} /> New Signups
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0D9488' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0D9488' }} /> Active Planners
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            {hasMounted && analyticsData?.userGrowth ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4169D8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4169D8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="plannerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#647184' }} stroke="#e1e7ee" />
                  <YAxis tick={{ fontSize: 11, fill: '#647184' }} stroke="#e1e7ee" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      border: '1px solid #e1e7ee',
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                  />
                  <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#4169D8" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" />
                  <Area type="monotone" dataKey="activePlanners" name="Active Planners" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#plannerGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a96a6', fontSize: 13 }}>
                Loading visualization...
              </div>
            )}
          </div>
        </div>

        {/* Trips Created & Shared */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Trip Creation & Public Sharing Velocity</h3>
              <p className={styles.chartSubtitle}>Itineraries compiled vs published viral public trips</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#7C6AF5' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#7C6AF5' }} /> Total Created
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E42' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#F59E42' }} /> Shared Publicly
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            {hasMounted && analyticsData?.tripsCreated ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.tripsCreated} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#647184' }} stroke="#e1e7ee" />
                  <YAxis tick={{ fontSize: 11, fill: '#647184' }} stroke="#e1e7ee" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      border: '1px solid #e1e7ee',
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                  />
                  <Bar dataKey="trips" name="Created" fill="#7C6AF5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shared" name="Public Shares" fill="#F59E42" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a96a6', fontSize: 13 }}>
                Loading visualization...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Charts Row: Regional Share, Categories, Duration, Budget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginTop: 20 }}>
        {/* Activity Category Breakdown */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Popular Activity Categories</h3>
              <p className={styles.chartSubtitle}>Which travel experiences travelers book most</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            {hasMounted && analyticsData?.categoryBreakdown ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {analyticsData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} activities`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      border: '1px solid #e1e7ee',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 10 }}>
            {analyticsData?.categoryBreakdown?.map((cat, idx) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#647184' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Regional Destination Demand</h3>
              <p className={styles.chartSubtitle}>Geographic share of generated itineraries</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
            {analyticsData?.regionalDistribution?.map((reg) => (
              <div key={reg.region}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  <span style={{ color: 'var(--gt-text-primary, #182331)' }}>{reg.region}</span>
                  <span style={{ color: 'var(--gt-text-secondary, #647184)' }}>
                    {reg.trips.toLocaleString()} trips ({reg.percentage}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: 7, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${reg.percentage}%`,
                      height: '100%',
                      background: 'var(--gt-blue, #4169d8)',
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trip Duration Tiers */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Planned Trip Duration Tiers</h3>
              <p className={styles.chartSubtitle}>Distribution of getaway lengths</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            {hasMounted && analyticsData?.durationDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.durationDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="duration" tick={{ fontSize: 10, fill: '#647184' }} stroke="#e1e7ee" />
                  <YAxis tick={{ fontSize: 11, fill: '#647184' }} stroke="#e1e7ee" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      border: '1px solid #e1e7ee',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="trips" name="Trips" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Budget Allocation Tiers */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Travel Budget Distribution</h3>
              <p className={styles.chartSubtitle}>Traveler budget commitments in ₹</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            {hasMounted && analyticsData?.budgetTiers ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.budgetTiers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="tier" tick={{ fontSize: 11, fill: '#647184' }} stroke="#e1e7ee" />
                  <YAxis tick={{ fontSize: 11, fill: '#647184' }} stroke="#e1e7ee" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      border: '1px solid #e1e7ee',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" name="Trips in Tier" fill="#F59E42" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
