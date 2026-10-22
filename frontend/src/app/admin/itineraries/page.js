'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Clock,
  Search,
  Filter,
  Eye,
  Sparkles,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  Activity,
  CheckCircle2,
  DollarSign,
  Compass,
} from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import DetailDrawer from '@/components/admin/DetailDrawer';
import { useAdmin } from '@/components/admin/AdminLayout';
import { adminService } from '@/lib/services';
import styles from '@/components/admin/admin.module.css';

const CATEGORY_COLORS = {
  Beach: '#0284c7',
  Heritage: '#7c3aed',
  Food: '#ea580c',
  Adventure: '#059669',
  Culture: '#4f46e5',
  Transport: '#2563eb',
};

export default function AdminItinerariesPage() {
  const { showToast } = useAdmin();
  const [itineraries, setItineraries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [durationFilter, setDurationFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Drawer state
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [optimizingId, setOptimizingId] = useState(null);

  const fetchItineraries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getItineraries({
        search,
        durationFilter,
        page,
        limit: 10,
      });
      setItineraries(res.itineraries);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load itineraries', err);
      showToast('Error loading itineraries', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, durationFilter, page, showToast]);

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  const handleOptimize = async (itin) => {
    setOptimizingId(itin.id);
    try {
      const res = await adminService.optimizeItinerary(itin.tripId);
      showToast(`AI Pacing Optimized for "${itin.tripTitle}"!`, 'success');
      fetchItineraries();
    } catch (e) {
      showToast('Optimization failed', 'error');
    } finally {
      setOptimizingId(null);
    }
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'tripTitle',
      header: 'Trip & Schedule',
      sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--gt-admin-text-main, #0f172a)' }}>
              {row.tripTitle}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gt-admin-text-muted, #64748b)' }}>
              {row.destinations}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'daysCount',
      header: 'Duration',
      sortable: true,
      render: (val) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 6,
            background: '#f1f5f9',
            fontSize: 12,
            fontWeight: 600,
            color: '#334155',
          }}
        >
          <Calendar size={12} /> {val} Days
        </span>
      ),
    },
    {
      key: 'activitiesCount',
      header: 'Activities Logged',
      sortable: true,
      render: (val) => (
        <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
          {val} activities
        </span>
      ),
    },
    {
      key: 'pacing',
      header: 'Pacing Health',
      render: (val) => {
        const bg = val === 'Relaxed' ? '#ecfdf5' : val === 'Balanced' ? '#eff6ff' : '#fff7ed';
        const color = val === 'Relaxed' ? '#059669' : val === 'Balanced' ? '#2563eb' : '#d97706';
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 12,
              background: bg,
              color,
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            <Sparkles size={11} /> {val}
          </span>
        );
      },
    },
    {
      key: 'traveler',
      header: 'Traveler',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src={row.userAvatar}
            alt={row.userName}
            style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: 12.5, color: '#334155' }}>{row.userName}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span
          className={`${styles.statusBadge} ${
            val === 'Published' ? styles.statusActive : styles.statusPending
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            className={styles.actionBtn}
            title="Inspect Daily Timeline"
            onClick={() => setSelectedItinerary(row)}
            style={{ color: '#2563eb' }}
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            title="Run AI Pacing Optimization"
            onClick={() => handleOptimize(row)}
            disabled={optimizingId === row.id}
            style={{ color: '#7c3aed' }}
          >
            <Sparkles size={15} />
          </button>
          <Link
            href={`/itinerary/${row.tripId}`}
            target="_blank"
            className={styles.actionBtn}
            title="Open Live Traveler Day Planner"
            style={{ color: '#64748b' }}
          >
            <ExternalLink size={15} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Itineraries & Day Schedules</h1>
          <p className={styles.pageSubtitle}>
            Audit traveler schedules, review daily activity sequencing, and run AI route optimizations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/create-trip"
            target="_blank"
            className={styles.btnPrimary}
            style={{ textDecoration: 'none' }}
          >
            <Sparkles size={16} />
            <span>Generate New AI Itinerary</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Active Itineraries</div>
          <div className={styles.statValue}>{totalCount}</div>
          <div className={styles.statPeriod}>Synced with live trip canvas</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg Duration per Trip</div>
          <div className={styles.statValue}>5.4 Days</div>
          <div className={styles.statPeriod}>Across global multi-city routes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>AI Pacing Health</div>
          <div className={styles.statValue} style={{ color: '#059669' }}>
            98.2%
          </div>
          <div className={styles.statPeriod}>Optimal rest buffer between stops</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Day Planner Synced</div>
          <div className={styles.statValue} style={{ color: '#2563eb' }}>
            100%
          </div>
          <div className={styles.statPeriod}>Real-time Firestore & LocalStorage</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by trip, destination, or traveler..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={15} color="#64748b" />
            <span style={{ fontSize: 13, color: '#64748b' }}>Duration:</span>
          </div>
          {['All', 'short', 'medium', 'extended'].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`${styles.filterPill} ${durationFilter === filter ? styles.filterPillActive : ''}`}
              onClick={() => {
                setDurationFilter(filter);
                setPage(1);
              }}
            >
              {filter === 'All'
                ? 'All Durations'
                : filter === 'short'
                ? '1-3 Days'
                : filter === 'medium'
                ? '4-6 Days'
                : '7+ Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={itineraries}
        loading={loading}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="No itineraries found matching search filter."
      />

      {/* Detail Drawer for Inspecting Daily Timeline */}
      <DetailDrawer
        isOpen={!!selectedItinerary}
        onClose={() => setSelectedItinerary(null)}
        title={selectedItinerary?.tripTitle || 'Itinerary Schedule'}
        subtitle={`Day-by-Day Plan (${selectedItinerary?.daysCount || 0} Days) • ${selectedItinerary?.destinations || ''}`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Link
              href={`/itinerary/${selectedItinerary?.tripId}`}
              target="_blank"
              className={styles.btnSecondary}
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={15} /> Open Traveler Day Planner
            </Link>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                handleOptimize(selectedItinerary);
                setSelectedItinerary(null);
              }}
            >
              <Sparkles size={15} /> Run AI Optimization
            </button>
          </div>
        }
      >
        {selectedItinerary && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Meta bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Traveler</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
                  {selectedItinerary.userName}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Pacing</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', marginTop: 2 }}>
                  {selectedItinerary.pacing}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Total Days</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
                  {selectedItinerary.daysCount} Days Planned
                </div>
              </div>
            </div>

            {/* Days Timeline Accordion */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                Day-by-Day Schedule Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedItinerary.days.map((dayItem, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: 14,
                      background: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            background: '#2563eb',
                            color: '#ffffff',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          Day {dayItem.day || idx + 1}
                        </span>
                        <strong style={{ fontSize: 13, color: '#0f172a' }}>
                          {dayItem.title || `Day ${idx + 1} Schedule`}
                        </strong>
                      </div>
                      {dayItem.location && (
                        <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} /> {dayItem.location}
                        </span>
                      )}
                    </div>

                    {/* Activities List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(dayItem.activities || []).map((act, aIdx) => (
                        <div
                          key={aIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            background: '#f8fafc',
                            borderRadius: 6,
                            fontSize: 12.5,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontWeight: 600, color: '#64748b', minWidth: 65, fontSize: 12 }}>
                              {act.time}
                            </span>
                            <span style={{ fontWeight: 500, color: '#1e293b' }}>{act.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {act.category && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: `${CATEGORY_COLORS[act.category] || '#2563eb'}18`,
                                  color: CATEGORY_COLORS[act.category] || '#2563eb',
                                }}
                              >
                                {act.category}
                              </span>
                            )}
                            <span style={{ fontSize: 11.5, color: '#64748b' }}>{act.duration}m</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
