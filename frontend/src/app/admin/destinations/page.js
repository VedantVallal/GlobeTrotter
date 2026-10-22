'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Globe2,
  DollarSign,
  Compass,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { adminService } from '@/lib/services/adminService';
import { useAdminToast } from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import DetailDrawer from '@/components/admin/DetailDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import styles from '@/components/admin/admin.module.css';

const REGIONS = ['All', 'Asia', 'Europe', 'Americas', 'Middle East', 'Oceania'];

export default function DestinationsAdminPage() {
  const { addToast } = useAdminToast();
  const [destinations, setDestinations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');

  // Modals & Drawers
  const [previewDest, setPreviewDest] = useState(null);
  const [editingDest, setEditingDest] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteDest, setDeleteDest] = useState(null);
  const [isPending, startTransition] = useTransition();

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    country: 'India',
    state: '',
    region: 'Asia',
    description: '',
    avgCostPerDay: 50,
    currency: 'INR',
    image: '',
    lat: 18.922,
    lng: 72.8347,
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDestinations({
        search,
        region,
        page,
        limit: 10,
      });
      setDestinations(res.destinations);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
      addToast('Failed to load destinations catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [search, region, page]);

  // Open Edit Form
  const handleOpenEdit = (dest) => {
    setEditingDest(dest);
    setFormData({
      name: dest.name || '',
      country: dest.country || '',
      state: dest.state || '',
      region: dest.region || 'Asia',
      description: dest.description || '',
      avgCostPerDay: dest.avgCostPerDay || 50,
      currency: dest.currency || 'INR',
      image: dest.image || '',
      lat: dest.coordinates?.lat || 18.922,
      lng: dest.coordinates?.lng || 72.8347,
    });
    setFormErrors({});
  };

  // Open Add Form
  const handleOpenAdd = () => {
    setIsAddOpen(true);
    setFormData({
      name: '',
      country: 'India',
      state: '',
      region: 'Asia',
      description: '',
      avgCostPerDay: 4500,
      currency: 'INR',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&fit=crop',
      lat: 18.922,
      lng: 72.8347,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Destination name is required';
    if (!formData.country.trim()) errs.country = 'Country is required';
    if (!formData.region) errs.region = 'Region is required';
    if (isNaN(Number(formData.avgCostPerDay)) || Number(formData.avgCostPerDay) <= 0) {
      errs.avgCostPerDay = 'Enter a valid positive cost';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        const payload = {
          name: formData.name.trim(),
          country: formData.country.trim(),
          state: formData.state.trim(),
          region: formData.region,
          description: formData.description.trim(),
          avgCostPerDay: Number(formData.avgCostPerDay),
          currency: formData.currency,
          image: formData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop',
          coordinates: { lat: Number(formData.lat) || 18.922, lng: Number(formData.lng) || 72.8347 },
        };

        if (editingDest) {
          await adminService.updateDestination(editingDest.id, payload);
          addToast(`Updated destination "${payload.name}" successfully`, 'success');
          setEditingDest(null);
        } else {
          await adminService.addDestination(payload);
          addToast(`Added "${payload.name}" to the global catalog`, 'success');
          setIsAddOpen(false);
        }
        fetchDestinations();
      } catch (err) {
        console.error(err);
        addToast('Error saving destination record', 'error');
      }
    });
  };

  // Archive / Delete Handler
  const handleArchiveConfirm = async () => {
    if (!deleteDest) return;
    try {
      await adminService.archiveDestination(deleteDest.id);
      addToast(`Archived destination "${deleteDest.name}"`, 'success');
      setDeleteDest(null);
      if (previewDest?.id === deleteDest.id) setPreviewDest(null);
      fetchDestinations();
    } catch (err) {
      console.error(err);
      addToast('Failed to archive destination', 'error');
    }
  };

  const columns = [
    {
      key: 'destination',
      title: 'Destination',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#e1e7ee',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--gt-bg-alt, #f1f5f9)',
                  color: 'var(--gt-text-muted, #8a96a6)',
                }}
              >
                <MapPin size={18} />
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--gt-text-primary, #182331)', fontSize: 13.5 }}>
              {row.name}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--gt-text-secondary, #647184)' }}>
              {row.state ? `${row.state}, ` : ''}{row.country}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'region',
      title: 'Region',
      render: (_, row) => (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'var(--gt-bg-alt, #f1f5f9)',
            color: 'var(--gt-text-primary, #182331)',
          }}
        >
          {row.region || 'Asia'}
        </span>
      ),
    },
    {
      key: 'coordinates',
      title: 'Coordinates',
      render: (_, row) => (
        <span style={{ fontSize: 11.5, color: 'var(--gt-text-muted, #8a96a6)', fontFamily: 'monospace' }}>
          {row.coordinates?.lat?.toFixed(2)}°, {row.coordinates?.lng?.toFixed(2)}°
        </span>
      ),
    },
    {
      key: 'areas',
      title: 'Areas / Stops',
      render: (_, row) => (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gt-ink, #172b3a)' }}>
          {row.areas?.length || 1} zones
        </span>
      ),
    },
    {
      key: 'cost',
      title: 'Avg. Cost/Day',
      render: (_, row) => (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0d9488' }}>
          {row.currency === 'INR' || !row.currency ? '₹' : '$'}
          {row.avgCostPerDay?.toLocaleString() || '1,500'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Catalog Status',
      render: () => (
        <span className={`${styles.statusBadge} ${styles.badgeActive}`}>
          <CheckCircle2 size={11} /> Verified
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          <button
            className={styles.actionBtn}
            title="Preview Destination"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewDest(row);
            }}
          >
            <Eye size={14} />
          </button>
          <button
            className={styles.actionBtn}
            title="Edit Destination"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(row);
            }}
          >
            <Edit2 size={14} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            title="Archive Destination"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDest(row);
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Destination Catalog</h1>
          <p className={styles.pageSubtitle}>
            Browse, inspect, and maintain the 330+ global destination nodes powering GlobeTrotter AI.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} onClick={handleOpenAdd}>
            <Plus size={15} /> Add Destination
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by city, country, or state..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className={styles.filterActions}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} color="var(--gt-text-muted, #8a96a6)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gt-text-secondary, #647184)' }}>Region:</span>
          </div>
          <select
            className={styles.filterSelect}
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1);
            }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Regions' : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Destination Data Table */}
      <DataTable
        columns={columns}
        data={destinations}
        keyField="id"
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onRowClick={(row) => setPreviewDest(row)}
        emptyMessage="No destinations match your search criteria."
      />

      {/* Preview Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(previewDest)}
        onClose={() => setPreviewDest(null)}
        title={previewDest ? `${previewDest.name}, ${previewDest.country}` : 'Destination Preview'}
        subtitle="Catalog Node & Metadata Inspection"
        footer={
          <>
            <button
              className={styles.btnSecondary}
              onClick={() => {
                const cur = previewDest;
                setPreviewDest(null);
                handleOpenEdit(cur);
              }}
            >
              <Edit2 size={13} /> Edit Node
            </button>
            <button
              className={styles.btnDanger}
              onClick={() => {
                const cur = previewDest;
                setPreviewDest(null);
                setDeleteDest(cur);
              }}
            >
              <Trash2 size={13} /> Archive
            </button>
          </>
        }
      >
        {previewDest && (
          <div style={{ display: 'flex', flexBreak: 'column', flexDirection: 'column', gap: 16 }}>
            {/* Hero Image */}
            <div
              style={{
                width: '100%',
                height: 180,
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#0f172a',
              }}
            >
              {previewDest.image ? (
                <img
                  src={previewDest.image}
                  alt={previewDest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 16,
                  color: '#ffffff',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{previewDest.name}</h3>
                  <p style={{ fontSize: 12, opacity: 0.85, margin: '2px 0 0 0' }}>
                    {previewDest.state ? `${previewDest.state}, ` : ''}{previewDest.country} · {previewDest.region || 'Asia'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: 12,
                  background: 'var(--gt-bg-alt, #f1f5f9)',
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', fontWeight: 600 }}>
                  AVERAGE DAILY BUDGET
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gt-ink, #172b3a)', marginTop: 2 }}>
                  {previewDest.currency === 'INR' || !previewDest.currency ? '₹' : '$'}
                  {previewDest.avgCostPerDay?.toLocaleString() || '2,500'}
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  background: 'var(--gt-bg-alt, #f1f5f9)',
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', fontWeight: 600 }}>
                  GEOGRAPHIC COORDS
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gt-text-primary, #182331)', marginTop: 3 }}>
                  {previewDest.coordinates?.lat?.toFixed(3)}°, {previewDest.coordinates?.lng?.toFixed(3)}°
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gt-text-secondary, #647184)', textTransform: 'uppercase', marginBottom: 6 }}>
                Overview Description
              </div>
              <p style={{ fontSize: 13, color: 'var(--gt-text-primary, #182331)', lineHeight: 1.5, margin: 0 }}>
                {previewDest.description || `Popular travel hub in ${previewDest.country} with world-class sights, cultural monuments, and activities.`}
              </p>
            </div>

            {/* Included Areas & Stops */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gt-text-secondary, #647184)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Verified Neighborhoods / Areas</span>
                <span style={{ fontSize: 11, color: 'var(--gt-blue, #4169d8)', fontWeight: 600 }}>
                  {previewDest.areas?.length || 1} mapped
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(previewDest.areas && previewDest.areas.length > 0) ? (
                  previewDest.areas.map((area, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 12,
                        padding: '4px 10px',
                        background: '#ffffff',
                        border: '1px solid var(--gt-border, #e1e7ee)',
                        borderRadius: 6,
                        color: 'var(--gt-text-primary, #182331)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <MapPin size={11} color="var(--gt-blue, #4169d8)" />
                      {area.name || area}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--gt-text-muted, #8a96a6)' }}>
                    Standard central hub zones applied.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Add / Edit Destination Modal */}
      {(isAddOpen || editingDest) && (
        <div className={styles.modalBackdrop} onClick={() => { setIsAddOpen(false); setEditingDest(null); }}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingDest ? `Edit Destination: ${editingDest.name}` : 'Add Destination to Catalog'}
              </h3>
              <button
                className={styles.actionBtn}
                onClick={() => { setIsAddOpen(false); setEditingDest(null); }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDestination}>
              <div className={styles.modalBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City / Destination Name *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Kyoto, Udaipur"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {formErrors.name && (
                      <span style={{ fontSize: 11, color: '#ef4444' }}>{formErrors.name}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Country *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Japan, India"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                    {formErrors.country && (
                      <span style={{ fontSize: 11, color: '#ef4444' }}>{formErrors.country}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>State / Province</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Kansai, Rajasthan"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Continent / Region *</label>
                    <select
                      className={styles.formSelect}
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    >
                      {REGIONS.filter((r) => r !== 'All').map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Avg Cost / Day (₹)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={formData.avgCostPerDay}
                      onChange={(e) => setFormData({ ...formData, avgCostPerDay: e.target.value })}
                    />
                    {formErrors.avgCostPerDay && (
                      <span style={{ fontSize: 11, color: '#ef4444' }}>{formErrors.avgCostPerDay}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cover Image URL</label>
                    <input
                      type="url"
                      className={styles.formInput}
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className={styles.formInput}
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className={styles.formInput}
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    rows={3}
                    className={styles.formTextarea}
                    placeholder="Brief highlights of this destination for AI trip planning..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => { setIsAddOpen(false); setEditingDest(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isPending}>
                  {isPending ? 'Saving...' : editingDest ? 'Update Destination' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive / Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteDest)}
        title={`Archive "${deleteDest?.name}"?`}
        message={`Are you sure you want to archive ${deleteDest?.name}? It will be removed from the active planner suggestions and AI destination catalog.`}
        confirmText="Archive Node"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleArchiveConfirm}
        onCancel={() => setDeleteDest(null)}
      />
    </div>
  );
}
