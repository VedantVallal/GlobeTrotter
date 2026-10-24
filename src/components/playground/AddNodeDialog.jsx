'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CATEGORIES, STOCK_TRAVEL_IMAGES } from './playgroundTypes';
import styles from './playground.module.css';

export default function AddNodeDialog({
  isOpen,
  onClose,
  nodes = [],
  defaultParentId = null,
  defaultType = 'destination',
  onConfirmAdd,
}) {
  const [nodeType, setNodeType] = useState(defaultType);
  const [parentId, setParentId] = useState(defaultParentId || '');
  const [title, setTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [duration, setDuration] = useState('2 hours');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [category, setCategory] = useState('Sightseeing');
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState(STOCK_TRAVEL_IMAGES[0]?.url || '');
  const [imageCategoryFilter, setImageCategoryFilter] = useState('All');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Filtered stock images
  const filteredStockImages = useMemo(() => {
    if (imageCategoryFilter === 'All') return STOCK_TRAVEL_IMAGES;
    return STOCK_TRAVEL_IMAGES.filter(
      (img) => img.category.toLowerCase() === imageCategoryFilter.toLowerCase()
    );
  }, [imageCategoryFilter]);

  if (!isOpen) return null;

  // Available parents if user wants to attach under an existing node
  const availableParents = nodes.filter((n) => {
    if (nodeType === 'city') return false;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a valid stop name or title.');
      return;
    }

    onConfirmAdd({
      type: nodeType,
      parentId: parentId || null,
      title: title.trim(),
      dayNumber: Number(dayNumber) || 1,
      duration: duration.trim() || '2 hours',
      estimatedCost: Number(estimatedCost) || 0,
      category,
      notes: notes.trim(),
      image: selectedImage || STOCK_TRAVEL_IMAGES[0]?.url,
    });

    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-dialog-title"
    >
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitle} id="add-dialog-title">
            <Plus size={18} color="var(--gt-blue)" />
            <span>Add Journey Stop</span>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Node Type Selector */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Stop Type</label>
            <div className={styles.typeSelectorRow}>
              {['city', 'area', 'destination', 'activity'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.typeSelectBtn} ${nodeType === t ? styles.typeSelectBtnActive : ''}`}
                  onClick={() => {
                    setNodeType(t);
                    setErrorMsg(null);
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name / Title *</label>
            <input
              type="text"
              placeholder="e.g. Sunset Point, Old Town Walking Tour..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.formInput}
              autoFocus
              required
            />
          </div>

          {/* Parent Selection (Optional - user driven) */}
          {availableParents.length > 0 && nodeType !== 'city' && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Attach Under (Optional - can link later)</label>
              <select
                className={styles.formSelect}
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">None (Independent stop — connect freely)</option>
                {availableParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    [{parent.type.toUpperCase()}] {parent.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Stock Image Selection */}
          <div className={styles.formGroup}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <label className={styles.formLabel} style={{ marginBottom: 0 }}>Stock Travel Photo</label>
              <button
                type="button"
                onClick={() => setShowImagePicker((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <ImageIcon size={12} />
                <span>{showImagePicker ? 'Hide Gallery' : 'Browse Stock Photos'}</span>
              </button>
            </div>

            {selectedImage && (
              <div style={{
                position: 'relative',
                height: 80,
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                marginBottom: 6,
              }}>
                <img src={selectedImage} alt="Selected stock" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 6,
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 4,
                }}>
                  Selected Photo
                </span>
              </div>
            )}

            {showImagePicker && (
              <div className={styles.stockImagePickerContainer} style={{ marginTop: 4 }}>
                <div className={styles.stockImageCategoryTabs}>
                  {['All', 'Beach', 'Heritage', 'Nature', 'Food', 'City', 'Adventure'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`${styles.stockCategoryTab} ${imageCategoryFilter === cat ? styles.stockCategoryTabActive : ''}`}
                      onClick={() => setImageCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className={styles.stockImageGrid}>
                  {filteredStockImages.map((img) => (
                    <div
                      key={img.id}
                      className={`${styles.stockImageCard} ${selectedImage === img.url ? styles.stockImageCardActive : ''}`}
                      onClick={() => setSelectedImage(img.url)}
                      title={img.title}
                    >
                      <img src={img.thumbnail} alt={img.title} />
                      <span className={styles.stockImageLabel}>{img.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Day & Duration Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Scheduled Day</label>
              <input
                type="number"
                min="1"
                max="30"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Duration</label>
              <input
                type="text"
                placeholder="e.g. 2 hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>

          {/* Cost & Category Row */}
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Estimated Cost ($)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Category</label>
              <select
                className={styles.formSelect}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Travel Notes (Optional)</label>
            <textarea
              rows="2"
              placeholder="Tips, reservations, gear notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.formTextarea}
            />
          </div>

          {errorMsg && (
            <div className={styles.modalError}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer */}
          <div className={styles.modalFooter}>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Stop to Canvas
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
