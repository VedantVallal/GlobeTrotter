'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  MapPin,
  ExternalLink,
  Globe,
  Lock,
  DollarSign,
  Share2,
  Users,
} from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import DetailDrawer from '@/components/admin/DetailDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useAdmin } from '@/components/admin/AdminLayout';
import { adminService } from '@/lib/services';
import styles from '@/components/admin/admin.module.css';

export default function AdminTripsPage() {
  const { showToast } = useAdmin();
  const [trips, setTrips] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Drawer & Modal State
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToDelete, setTripToDelete] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getTrips({
        search,
        status: statusFilter,
        page,
        limit: 10,
      });
      setTrips(res.trips);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load trips', err);
      showToast('Error loading trips', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, showToast]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Handle visibility toggle
  const handleToggleVisibility = async (trip) => {
    const nextStatus = trip.status === 'Published' ? 'Draft' : 'Published';
    try {
      await adminService.updateTripStatus(trip.id, nextStatus);
      showToast(`Trip visibility updated to ${nextStatus}`);
      fetchTrips();
      if (selectedTrip?.id === trip.id) {
        setSelectedTrip({ ...selectedTrip, status: nextStatus, isPublic: nextStatus === 'Published' });
      }
    } catch (err) {
      showToast('Failed to update trip status', 'error');
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      await adminService.deleteTrip(tripToDelete.id);
      showToast(`Trip "${tripToDelete.title}" removed (Demo)`, 'info');
      setTripToDelete(null);
      if (selectedTrip?.id === tripToDelete.id) {
        setSelectedTrip(null);
      }
      fetchTrips();
    } catch (err) {
      showToast('Failed to delete trip', 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Trip Title & Route',
      render: (t) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--gt-text-primary, #182331)', fontSize: 13.5 }}>
            {t.title}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--gt-text-muted, #8a96a6)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <MapPin size={11} />
            <span>{t.destinations.join(' → ')}</span>
            <span style={{ margin: '0 4px' }}>•</span>
            <span>{t.stopsCount} Stops</span>
          </div>
        </div>
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (t) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--gt-text-primary, #182331)' }}>{t.owner.name}</div>
          <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)' }}>{t.owner.email}</div>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Dates & Duration',
      render: (t) => (
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--gt-text-primary, #182331)' }}>{t.duration}</div>
          <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)' }}>
            {t.startDate}
          </div>
        </div>
      ),
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (t) => (
        <span style={{ fontWeight: 600, color: 'var(--gt-blue, #4169d8)', fontSize: 13 }}>
          ₹{Number(t.budget).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'collaboration',
      label: 'Collaboration',
      render: (t) => {
        const count = t.collaborators?.length || (t.id === 'trip-001' || t.id === 'trip-004' ? 3 : 1);
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11.5,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 6,
              background: count > 1 ? '#eef2ff' : 'var(--gt-bg-alt, #f1f5f9)',
              color: count > 1 ? 'var(--gt-blue, #4169d8)' : 'var(--gt-text-secondary, #647184)',
            }}
          >
            <Users size={12} />
            {count > 1 ? `${count} Members` : 'Solo'}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Sharing Status',
      render: (t) => {
        const isPub = t.status === 'Published';
        return (
          <span className={`${styles.badge} ${isPub ? styles.badgePublished : styles.badgeDraft}`}>
            {isPub ? <Globe size={11} /> : <Lock size={11} />}
            {t.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (t) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
            onClick={() => setSelectedTrip(t)}
            title="Inspect Details"
          >
            <Eye size={12} />
            <span>Review</span>
          </button>

          <Link
            href={`/playground/${t.id}`}
            target="_blank"
            className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm} ${styles.btnIcon}`}
            title="Open in Playground Canvas"
          >
            <ExternalLink size={12} />
          </Link>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm} ${styles.btnIcon}`}
            onClick={() => setTripToDelete(t)}
            title="Moderate / Delete Trip"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--gt-text-primary, #182331)' }}>
            Trip Management
          </h1>
          <p style={{ margin: '3px 0 0 0', fontSize: 13, color: 'var(--gt-text-secondary, #647184)' }}>
            Inspect traveler workspaces, moderate public itineraries, and oversee sharing links.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox} style={{ display: 'block', width: 300 }}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by trip title, owner, or destination..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className={styles.filterGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={13} color="var(--gt-text-muted, #8a96a6)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gt-text-secondary, #647184)' }}>Visibility:</span>
          </div>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Visibility</option>
            <option value="Published">Published / Public</option>
            <option value="Draft">Private / Draft</option>
          </select>
        </div>
      </div>

      {/* Trips Data Table */}
      <DataTable
        columns={columns}
        data={trips}
        loading={loading}
        emptyTitle="No trips found"
        emptyMessage="No itineraries matched your search parameters."
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(p) => setPage(p)}
        onRowClick={(t) => setSelectedTrip(t)}
      />

      {/* Trip Detail Slide-over Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedTrip)}
        title={selectedTrip ? selectedTrip.title : 'Trip Details'}
        onClose={() => setSelectedTrip(null)}
        footer={
          selectedTrip && (
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => handleToggleVisibility(selectedTrip)}
              >
                {selectedTrip.status === 'Published' ? <Lock size={13} /> : <Globe size={13} />}
                <span>Make {selectedTrip.status === 'Published' ? 'Private' : 'Public'}</span>
              </button>

              <Link
                href={`/playground/${selectedTrip.id}`}
                target="_blank"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <Compass size={13} />
                <span>Open in Canvas</span>
              </Link>
            </div>
          )
        }
      >
        {selectedTrip && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Title & Route Card */}
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid var(--gt-border, #e1e7ee)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gt-text-primary, #182331)' }}>
                {selectedTrip.title}
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--gt-blue, #4169d8)', fontWeight: 600 }}>
                <MapPin size={13} />
                <span>{selectedTrip.startLocation} → {selectedTrip.destinations.join(' → ')}</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span className={`${styles.badge} ${selectedTrip.status === 'Published' ? styles.badgePublished : styles.badgeDraft}`}>
                  {selectedTrip.status}
                </span>
                <span className={styles.badge} style={{ background: '#f1f5f9', color: '#475569' }}>
                  {selectedTrip.stopsCount} Total Journey Stops
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: 12, background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', textTransform: 'uppercase' }}>Target Budget</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gt-blue, #4169d8)', marginTop: 2 }}>
                  ₹{Number(selectedTrip.budget).toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ padding: 12, background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', textTransform: 'uppercase' }}>Duration</span>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gt-text-primary, #182331)', marginTop: 4 }}>
                  {selectedTrip.duration} ({selectedTrip.startDate})
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div style={{ padding: 14, background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Trip Creator
              </span>
              <div style={{ fontWeight: 600, color: '#182331', fontSize: 13 }}>{selectedTrip.owner.name}</div>
              <div style={{ fontSize: 12, color: '#647184' }}>{selectedTrip.owner.email}</div>
            </div>

            {/* Collaborators List */}
            <div style={{ padding: 14, background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', textTransform: 'uppercase' }}>
                  Travel Companions & Collaborators
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gt-blue, #4169d8)', background: '#eef2ff', padding: '1px 6px', borderRadius: 4 }}>
                  {(selectedTrip.collaborators?.length || 3)} Members
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(selectedTrip.collaborators && selectedTrip.collaborators.length > 0
                  ? selectedTrip.collaborators
                  : [
                      { name: selectedTrip.owner.name, role: 'Owner', status: 'Online' },
                      { name: 'Priya Sharma', role: 'Editor', status: 'Online' },
                      { name: 'Devendra Patil', role: 'Viewer', status: 'Away' },
                    ]
                ).map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: 6, fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.status === 'Online' ? '#10b981' : '#94a3b8' }} />
                      <span style={{ fontWeight: 600, color: '#182331' }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: c.role === 'Owner' ? '#4169d8' : c.role === 'Editor' ? '#059669' : '#647184' }}>
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Link Share preview */}
            <div style={{ padding: 12, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#1e40af', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Share2 size={12} />
                <span>Public Share URL</span>
              </div>
              <code style={{ fontSize: 11, wordBreak: 'break-all', color: '#1d4ed8' }}>
                https://globetrotter.travel/share/{selectedTrip.id}
              </code>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Delete / Moderate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(tripToDelete)}
        title="Moderate / Remove Trip"
        message={`Are you sure you want to remove the trip "${tripToDelete?.title}" owned by ${tripToDelete?.owner.name}? It will be archived from public indexes.`}
        confirmText="Remove Trip"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTripToDelete(null)}
      />
    </div>
  );
}
