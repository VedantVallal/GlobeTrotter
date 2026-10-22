'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Compass,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  Tag,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminService } from '@/lib/services/adminService';
import { useAdminToast } from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import DetailDrawer from '@/components/admin/DetailDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import styles from '@/components/admin/admin.module.css';

const CATEGORIES = [
  'All',
  'Sightseeing',
  'Heritage & Culture',
  'Beach & Coast',
  'Food & Dining',
  'Adventure & Trekking',
  'Relaxation & Spa',
];

export default function ActivitiesAdminPage() {
  const { addToast } = useAdminToast();
  const [activities, setActivities] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modals & Drawers
  const [previewAct, setPreviewAct] = useState(null);
  const [editingAct, setEditingAct] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteAct, setDeleteAct] = useState(null);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cityName: 'Goa',
    category: 'Sightseeing',
    duration: '2-3 hours',
    price: 800,
    currency: 'INR',
    description: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await adminService.getActivities({
        search,
        category,
        page,
        limit: 10,
      });
      setActivities(res.activities);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
      addToast('Failed to load activities catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [search, category, page]);

  // Open Edit Form
  const handleOpenEdit = (act) => {
    setEditingAct(act);
    setFormData({
      name: act.name || '',
      cityName: act.cityName || '',
      category: act.category || 'Sightseeing',
      duration: act.duration || '2 hours',
      price: act.price || 500,
      currency: act.currency || 'INR',
      description: act.description || '',
      image: act.image || '',
    });
    setFormErrors({});
  };

  // Open Add Form
  const handleOpenAdd = () => {
    setIsAddOpen(true);
    setFormData({
      name: '',
      cityName: 'Mumbai',
      category: 'Sightseeing',
      duration: '2 hours',
      price: 1200,
      currency: 'INR',
      description: '',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&fit=crop',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Activity title is required';
    if (!formData.cityName.trim()) errs.cityName = 'Destination city is required';
    if (!formData.category) errs.category = 'Category is required';
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errs.price = 'Enter a valid price amount';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        const payload = {
          name: formData.name.trim(),
          cityName: formData.cityName.trim(),
          category: formData.category,
          duration: formData.duration || '2 hours',
          price: Number(formData.price),
          currency: formData.currency || 'INR',
          description: formData.description.trim(),
          image: formData.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&fit=crop',
        };

        if (editingAct) {
          await adminService.updateActivity(editingAct.id, payload);
          addToast(`Updated activity "${payload.name}" successfully`, 'success');
          setEditingAct(null);
        } else {
          await adminService.addActivity(payload);
          addToast(`Added "${payload.name}" to the experience catalog`, 'success');
          setIsAddOpen(false);
        }
        fetchActivities();
      } catch (err) {
        console.error(err);
        addToast('Error saving activity record', 'error');
      }
    });
  };

  // Archive Handler
  const handleArchiveConfirm = async () => {
    if (!deleteAct) return;
    try {
      await adminService.archiveActivity(deleteAct.id);
      addToast(`Archived activity "${deleteAct.name}"`, 'success');
      setDeleteAct(null);
      if (previewAct?.id === deleteAct.id) setPreviewAct(null);
      fetchActivities();
    } catch (err) {
      console.error(err);
      addToast('Failed to archive activity', 'error');
    }
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case 'Sightseeing':
        return { bg: '#eef2ff', text: '#4169d8', border: '#c7d2fe' };
      case 'Heritage & Culture':
        return { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' };
      case 'Beach & Coast':
        return { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' };
      case 'Food & Dining':
        return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
      case 'Adventure & Trekking':
        return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
    }
  };

  const columns = [
    {
      key: 'activity',
      title: 'Activity & Experience',
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
                <Compass size={18} />
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--gt-text-primary, #182331)', fontSize: 13.5 }}>
              {row.name}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--gt-text-secondary, #647184)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} color="var(--gt-blue, #4169d8)" /> {row.cityName}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      render: (_, row) => {
        const badge = getCategoryBadgeColor(row.category);
        return (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 6,
              background: badge.bg,
              color: badge.text,
              border: `1px solid ${badge.border}`,
            }}
          >
            {row.category}
          </span>
        );
      },
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (_, row) => (
        <span style={{ fontSize: 12, color: 'var(--gt-text-secondary, #647184)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} /> {row.duration || '2 hours'}
        </span>
      ),
    },
    {
      key: 'price',
      title: 'Est. Price',
      render: (_, row) => (
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gt-ink, #172b3a)' }}>
          {row.currency === 'INR' || !row.currency ? '₹' : '$'}
          {row.price?.toLocaleString() || '600'}
        </span>
      ),
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>
          <Star size={13} fill="#f59e0b" /> {row.rating || '4.8'}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: () => (
        <span className={`${styles.statusBadge} ${styles.badgeActive}`}>
          <CheckCircle2 size={11} /> Published
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
            title="Preview Activity"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewAct(row);
            }}
          >
            <Eye size={14} />
          </button>
          <button
            className={styles.actionBtn}
            title="Edit Activity"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(row);
            }}
          >
            <Edit2 size={14} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            title="Archive Activity"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteAct(row);
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
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Activity & Experience Catalog</h1>
          <p className={styles.pageSubtitle}>
            Manage curated sightseeing, heritage tours, and travel experiences used in auto-itineraries.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} onClick={handleOpenAdd}>
            <Plus size={15} /> Add Activity
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
            placeholder="Search by activity name or destination..."
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
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gt-text-secondary, #647184)' }}>Category:</span>
          </div>
          <select
            className={styles.filterSelect}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={activities}
        keyField="id"
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onRowClick={(row) => setPreviewAct(row)}
        emptyMessage="No activities match your search or filter criteria."
      />

      {/* Preview Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(previewAct)}
        onClose={() => setPreviewAct(null)}
        title={previewAct ? previewAct.name : 'Activity Preview'}
        subtitle={previewAct ? `${previewAct.cityName} · ${previewAct.category}` : ''}
        footer={
          <>
            <button
              className={styles.btnSecondary}
              onClick={() => {
                const cur = previewAct;
                setPreviewAct(null);
                handleOpenEdit(cur);
              }}
            >
              <Edit2 size={13} /> Edit Activity
            </button>
            <button
              className={styles.btnDanger}
              onClick={() => {
                const cur = previewAct;
                setPreviewAct(null);
                setDeleteAct(cur);
              }}
            >
              <Trash2 size={13} /> Archive
            </button>
          </>
        }
      >
        {previewAct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              {previewAct.image ? (
                <img
                  src={previewAct.image}
                  alt={previewAct.name}
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
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{previewAct.name}</h3>
                  <p style={{ fontSize: 12, opacity: 0.85, margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={11} /> {previewAct.cityName}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: 12, background: 'var(--gt-bg-alt, #f1f5f9)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', fontWeight: 600 }}>ESTIMATED TICKET</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gt-ink, #172b3a)', marginTop: 2 }}>
                  {previewAct.currency === 'INR' || !previewAct.currency ? '₹' : '$'}
                  {previewAct.price?.toLocaleString()}
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--gt-bg-alt, #f1f5f9)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', fontWeight: 600 }}>TYPICAL DURATION</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gt-text-primary, #182331)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={13} color="var(--gt-blue, #4169d8)" /> {previewAct.duration}
                </div>
              </div>
            </div>

            {/* Category & Rating */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', display: 'block' }}>Category</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>{previewAct.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>
                <Star size={14} fill="#f59e0b" /> {previewAct.rating || '4.8'} / 5.0
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gt-text-secondary, #647184)', textTransform: 'uppercase', marginBottom: 6 }}>
                Activity Overview
              </div>
              <p style={{ fontSize: 13, color: 'var(--gt-text-primary, #182331)', lineHeight: 1.5, margin: 0 }}>
                {previewAct.description || `Signature travel experience in ${previewAct.cityName}. Ideal for travelers exploring culture, iconic viewpoints, and local authentic experiences.`}
              </p>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Add / Edit Activity Modal */}
      {(isAddOpen || editingAct) && (
        <div className={styles.modalBackdrop} onClick={() => { setIsAddOpen(false); setEditingAct(null); }}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingAct ? `Edit Activity: ${editingAct.name}` : 'Add Experience to Catalog'}
              </h3>
              <button
                className={styles.actionBtn}
                onClick={() => { setIsAddOpen(false); setEditingAct(null); }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Activity Title *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. Sunset Boat Cruise, Taj Mahal Sunrise Tour"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && (
                    <span style={{ fontSize: 11, color: '#ef4444' }}>{formErrors.name}</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Destination City *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Goa, Paris, Jaipur"
                      value={formData.cityName}
                      onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                    />
                    {formErrors.cityName && (
                      <span style={{ fontSize: 11, color: '#ef4444' }}>{formErrors.cityName}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Category *</label>
                    <select
                      className={styles.formSelect}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Duration</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. 2 hours, Half Day"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Estimated Price (₹)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    {formErrors.price && (
                      <span style={{ fontSize: 11, color: '#ef4444' }}>{formErrors.price}</span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Image URL</label>
                  <input
                    type="url"
                    className={styles.formInput}
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Activity Description</label>
                  <textarea
                    rows={3}
                    className={styles.formTextarea}
                    placeholder="Detailed description of what travelers do on this activity..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => { setIsAddOpen(false); setEditingAct(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isPending}>
                  {isPending ? 'Saving...' : editingAct ? 'Update Activity' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteAct)}
        title={`Archive "${deleteAct?.name}"?`}
        message={`Are you sure you want to archive "${deleteAct?.name}" in ${deleteAct?.cityName}? It will no longer be suggested during AI itinerary assembly.`}
        confirmText="Archive Activity"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleArchiveConfirm}
        onCancel={() => setDeleteAct(null)}
      />
    </div>
  );
}
