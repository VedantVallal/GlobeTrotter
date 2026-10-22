'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Compass,
  Share2,
  MapPin,
  Sparkles,
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatCard from '@/components/admin/StatCard';
import { adminService } from '@/lib/services';
import styles from '@/components/admin/admin.module.css';

const STATUS_PIE_COLORS = ['#4169D8', '#0D9488', '#F59E42'];

export default function AdminOverviewPage() {
  const [timeframe, setTimeframe] = useState('30d');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [popularDests, setPopularDests] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    async function loadData() {
      try {
        const [statsData, analyticsData, destsData, feedData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAnalytics(timeframe),
          adminService.getPopularDestinations(),
          adminService.getRecentActivityLog(),
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
        setPopularDests(destsData);
        setActivityFeed(feedData);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeframe]);

  const pieData = [
    { name: 'Published / Shared', value: 9120 },
    { name: 'Private / Active', value: 24830 },
    { name: 'Draft Workspaces', value: 4500 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome & Timeframe Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: 'var(--gt-surface, #ffffff)',
          padding: '20px 24px',
          borderRadius: 12,
          border: '1px solid var(--gt-border, #e1e7ee)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--gt-text-primary, #182331)' }}>
              Overview
            </h1>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                background: '#eff6ff',
                color: '#2563eb',
                padding: '2px 8px',
                borderRadius: 9999,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Demo Data Mode
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--gt-text-secondary, #647184)' }}>
            Monitor GlobeTrotter's platform activity, travel planning trends, and catalog operations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8fafc', padding: 3, borderRadius: 8, border: '1px solid var(--gt-border, #e1e7ee)' }}>
            <button
              type="button"
              className={`${styles.pageBtn} ${timeframe === '7d' ? styles.pageBtnActive : ''}`}
              onClick={() => setTimeframe('7d')}
            >
              7D
            </button>
            <button
              type="button"
              className={`${styles.pageBtn} ${timeframe === '30d' ? styles.pageBtnActive : ''}`}
              onClick={() => setTimeframe('30d')}
            >
              30D
            </button>
            <button
              type="button"
              className={`${styles.pageBtn} ${timeframe === '90d' ? styles.pageBtnActive : ''}`}
              onClick={() => setTimeframe('90d')}
            >
              90D
            </button>
            <button
              type="button"
              className={`${styles.pageBtn} ${timeframe === '1y' ? styles.pageBtnActive : ''}`}
              onClick={() => setTimeframe('1y')}
            >
              1Y
            </button>
          </div>

          <Link href="/admin/destinations" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={14} />
            <span>Add Destination</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        <StatCard
          label="Total Users"
          value={stats ? stats.totalUsers.value.toLocaleString() : '14,820'}
          change={stats?.totalUsers.change}
          period={stats?.totalUsers.period}
          icon={Users}
          iconBg="#eff6ff"
          iconColor="#2563eb"
        />
        <StatCard
          label="Total Trips Created"
          value={stats ? stats.totalTrips.value.toLocaleString() : '38,450'}
          change={stats?.totalTrips.change}
          period={stats?.totalTrips.period}
          icon={Compass}
          iconBg="#ecfdf5"
          iconColor="#059669"
        />
        <StatCard
          label="Shared Trips"
          value={stats ? stats.publicTrips.value.toLocaleString() : '9,120'}
          change={stats?.publicTrips.change}
          period={stats?.publicTrips.period}
          icon={Share2}
          iconBg="#faf5ff"
          iconColor="#9333ea"
        />
        <StatCard
          label="Catalog Destinations"
          value={stats ? stats.destinationsCount.value : '339'}
          change={stats?.destinationsCount.change}
          period={stats?.destinationsCount.period}
          icon={MapPin}
          iconBg="#f0fdfa"
          iconColor="#0d9488"
        />
        <StatCard
          label="Available Activities"
          value={stats ? stats.activitiesCount.value.toLocaleString() : '1,240'}
          change={stats?.activitiesCount.change}
          period={stats?.activitiesCount.period}
          icon={Sparkles}
          iconBg="#fffbeb"
          iconColor="#d97706"
        />
        <StatCard
          label="Average Trip Budget"
          value={stats ? stats.avgTripBudget.value : '₹64,500'}
          change={stats?.avgTripBudget.change}
          period={stats?.avgTripBudget.period}
          icon={DollarSign}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Left: Platform Growth (User Registrations & Trips Created) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Platform Growth & Travel Planning Activity</div>
              <div className={styles.cardSubtitle}>New user registrations and trips created over past 30 days</div>
            </div>
            <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', fontWeight: 500 }}>
              Updated Hourly
            </span>
          </div>
          <div className={styles.cardBody} style={{ height: 320 }}>
            {hasMounted && analytics?.userGrowth ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4169D8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4169D8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="activePlanners" name="Active Planners" stroke="#0D9488" strokeWidth={2} fill="url(#activeGrad)" />
                  <Area type="monotone" dataKey="newUsers" name="New Registrations" stroke="#4169D8" strokeWidth={2} fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                Loading visualization...
              </div>
            )}
          </div>
        </div>

        {/* Right: Trip Distribution by Status */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Trip Status Breakdown</div>
              <div className={styles.cardSubtitle}>Distribution across privacy and workspace states</div>
            </div>
          </div>
          <div className={styles.cardBody} style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_PIE_COLORS[index % STATUS_PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: '#94a3b8' }}>Loading status chart...</div>
            )}
          </div>
        </div>
      </div>

      {/* Split Section: Popular Destinations & Recent Activity Feed */}
      <div className={styles.splitSectionGrid}>
        {/* Popular Destinations Leaderboard */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Most Planned Destinations</div>
              <div className={styles.cardSubtitle}>Top destination stops chosen in user itineraries</div>
            </div>
            <Link href="/admin/destinations" className={styles.btnSecondary} style={{ fontSize: 11.5, padding: '3px 8px', height: 26, borderRadius: 6, textDecoration: 'none' }}>
              View All 339
            </Link>
          </div>
          <div style={{ padding: 0 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Country</th>
                  <th style={{ textAlign: 'right' }}>Trips Planned</th>
                  <th style={{ textAlign: 'right' }}>Growth Trend</th>
                </tr>
              </thead>
              <tbody>
                {popularDests.map((dest, i) => (
                  <tr key={dest.name}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gt-text-muted, #8a96a6)', width: 14 }}>
                          #{i + 1}
                        </span>
                        <img
                          src={dest.image}
                          alt={dest.name}
                          style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }}
                        />
                        <strong style={{ fontSize: 13, color: 'var(--gt-text-primary, #182331)' }}>
                          {dest.name}
                        </strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gt-text-secondary, #647184)' }}>{dest.country}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{dest.tripsCount.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ color: '#059669', fontWeight: 600, fontSize: 12 }}>
                        {dest.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit / Activity Log */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Live Activity Feed</div>
              <div className={styles.cardSubtitle}>Real-time system events and moderation actions</div>
            </div>
            <span style={{ fontSize: 11, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Live
            </span>
          </div>
          <div className={styles.cardBody} style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activityFeed.map((evt) => (
              <div
                key={evt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  paddingBottom: 12,
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px solid var(--gt-border, #e1e7ee)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gt-blue, #4169d8)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <CheckCircle2 size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>
                      {evt.title}
                    </span>
                    <span style={{ fontSize: 10.5, color: 'var(--gt-text-muted, #8a96a6)', whiteSpace: 'nowrap' }}>
                      {evt.time}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--gt-text-secondary, #647184)', lineHeight: 1.4 }}>
                    {evt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
