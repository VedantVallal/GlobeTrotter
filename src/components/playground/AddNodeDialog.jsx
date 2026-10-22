'use client';

import React, { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CATEGORIES } from './playgroundTypes';
import styles from './playground.module.css';

export default function AddNodeDialog({
  isOpen,
  onClose,
  nodes,
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
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  // Filter available parents based on nodeType:
  // - City: parentId is null
  // - Area: parent must be City
  // - Destination: parent can be Area or City
  // - Activity: parent can be Destination or Area
  const availableParents = nodes.filter((n) => {
    if (nodeType === 'city') return false;
    if (nodeType === 'area') return n.type === 'city';
    if (nodeType === 'destination') return n.type === 'area' || n.type === 'city';
    if (nodeType === 'activity') return n.type === 'destination' || n.type === 'area';
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a valid stop name or title.');
      return;
    }

    if (nodeType !== 'city' && availableParents.length > 0 && !parentId) {
      setErrorMsg(`Please select a parent ${nodeType === 'area' ? 'City' : 'Destination/Area'} for this stop.`);
      return;
    }

    onConfirmAdd({
      type: nodeType,
      parentId: nodeType === 'city' ? null : (parentId || null),
      title: title.trim(),
      dayNumber: Number(dayNumber) || 1,
      duration: duration.trim() || '2 hours',
      estimatedCost: Number(estimatedCost) || 0,
      category,
      notes: notes.trim(),
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
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitle} id="add-dialog-title">
            <Plus size={18} color="var(--gt-blue)" />
            <span>Add New Journey Stop</span>
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

          {/* Parent Selection (if not top-level City) */}
          {nodeType !== 'city' && (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Attach Under (Parent)</label>
              <select
                className={styles.formSelect}
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">Select parent stop...</option>
                {availableParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    [{parent.type.toUpperCase()}] {parent.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name / Title *</label>
            <input
              type="text"
              placeholder="e.g. Anjuna Beach, Local Market..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.formInput}
              autoFocus
              required
            />
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
