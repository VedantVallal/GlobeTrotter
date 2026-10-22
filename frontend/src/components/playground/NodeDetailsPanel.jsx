'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Trash2,
  RefreshCw,
  Copy,
  Plus,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Pin,
  PinOff,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { CATEGORIES } from './playgroundTypes';
import styles from './playground.module.css';

export default function NodeDetailsPanel({
  selectedNode,
  allNodes,
  onClose,
  onUpdateNode,
  onOpenReplace,
  onDuplicate,
  onDelete,
  onAddChild,
  onMoveOrder,
  onOpenCopilot,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [duration, setDuration] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Sync form state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.title || '');
      setDescription(selectedNode.description || '');
      setDayNumber(selectedNode.dayNumber || 1);
      setDuration(selectedNode.duration || '');
      setEstimatedCost(selectedNode.estimatedCost || 0);
      setCategory(selectedNode.category || 'Sightseeing');
      setNotes(selectedNode.notes || '');
      setIsSavedRecently(false);
    }
  }, [selectedNode?.id]);

  if (!selectedNode) return null;

  // Find parent breadcrumb
  const parentNode = allNodes.find((n) => n.id === selectedNode.parentId);
  const grandParentNode = parentNode ? allNodes.find((n) => n.id === parentNode.parentId) : null;

  const breadcrumb = [
    grandParentNode?.title,
    parentNode?.title,
    selectedNode.title,
  ].filter(Boolean).join(' › ');

  // Sibling count to enable/disable move earlier/later
  const siblings = allNodes.filter((n) => n.parentId === selectedNode.parentId);
  const siblingIndex = siblings.findIndex((n) => n.id === selectedNode.id);
  const canMoveEarlier = siblingIndex > 0;
  const canMoveLater = siblingIndex < siblings.length - 1;

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onUpdateNode(selectedNode.id, {
      title: title.trim(),
      description: description.trim(),
      dayNumber: Number(dayNumber) || 1,
      duration: duration.trim(),
      estimatedCost: Number(estimatedCost) || 0,
      category,
      notes: notes.trim(),
    });

    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 1500);
  };

  return (
    <aside className={styles.detailsPanel} aria-label="Selected Stop Details and Editor">
      {/* Panel Header */}
      <div className={styles.detailsHeader}>
        <div className={styles.detailsHeaderLeft}>
          <div className={styles.breadcrumbText}>{breadcrumb || 'Trip Root'}</div>
          <div className={styles.detailsHeaderTitleRow}>
            <span className={`${styles.nodeTypeBadge} ${styles[`badge_${selectedNode.type}`]}`}>
              {selectedNode.type?.toUpperCase()}
            </span>
            <h3 className={styles.detailsHeaderTitle}>{selectedNode.title}</h3>
          </div>
        </div>

        <div className={styles.detailsHeaderActions}>
          <button
            type="button"
            className={styles.copilotShortcutBtn}
            onClick={onOpenCopilot}
            title="Ask AI Copilot about this stop"
          >
            <Sparkles size={14} color="var(--gt-blue)" />
            <span>AI Tips</span>
          </button>
          <button
            type="button"
            className={styles.panelCloseBtn}
            onClick={onClose}
            title="Deselect Stop"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className={styles.detailsBody}>
        {/* Cover Photo */}
        {selectedNode.image && (
          <div className={styles.detailsImageWrapper}>
            <img
              src={selectedNode.image}
              alt={selectedNode.title}
              className={styles.detailsImage}
            />
          </div>
        )}

        {/* Modern Inspector Action Toolbar */}
        <div className={styles.inspectorToolbar}>
          {/* Pin / Lock Stop Button */}
          <button
            type="button"
            className={styles.inspectorSecondaryBtn}
            onClick={() => onUpdateNode(selectedNode.id, { is_locked: !selectedNode.is_locked, isLocked: !selectedNode.is_locked })}
            title={selectedNode.is_locked ? "Stop is Locked (Fixed against AI reordering)" : "Lock stop to preserve flight/stay during AI optimization"}
            style={{
              width: '100%',
              marginBottom: 6,
              background: selectedNode.is_locked ? '#eff6ff' : 'transparent',
              color: selectedNode.is_locked ? '#2563eb' : 'inherit',
              borderColor: selectedNode.is_locked ? '#93c5fd' : 'var(--gt-border, #e2e8f0)',
              fontWeight: selectedNode.is_locked ? 600 : 500,
            }}
          >
            {selectedNode.is_locked ? <Pin size={13} color="#2563eb" /> : <PinOff size={13} />}
            <span>{selectedNode.is_locked ? 'Pinned & Locked (Fixed against AI)' : 'Lock / Pin Stop'}</span>
          </button>

          {/* Primary Action: Add Child */}
          <button
            type="button"
            className={styles.inspectorPrimaryBtn}
            onClick={() => onAddChild(selectedNode)}
            title={`Add a new stop or activity directly under ${selectedNode.title}`}
          >
            <Plus size={14} />
            <span>Add Child Stop</span>
          </button>

          {/* Quick Actions: Replace & Duplicate */}
          <div className={styles.inspectorActionsRow}>
            <button
              type="button"
              className={styles.inspectorSecondaryBtn}
              onClick={() => onOpenReplace(selectedNode)}
              title="Replace with another destination"
            >
              <RefreshCw size={13} />
              <span>Replace</span>
            </button>

            <button
              type="button"
              className={styles.inspectorSecondaryBtn}
              onClick={() => onDuplicate(selectedNode)}
              title="Duplicate this stop"
            >
              <Copy size={13} />
              <span>Duplicate</span>
            </button>
          </div>

          {/* Utility Row: Move Sequence & Delete */}
          <div className={styles.inspectorActionsRow}>
            <div className={styles.inspectorOrderGroup}>
              <button
                type="button"
                className={styles.inspectorOrderBtn}
                onClick={() => onMoveOrder(selectedNode.id, -1)}
                disabled={!canMoveEarlier}
                title="Move earlier in journey sequence"
              >
                <ArrowUp size={13} />
                <span>Earlier</span>
              </button>
              <button
                type="button"
                className={styles.inspectorOrderBtn}
                onClick={() => onMoveOrder(selectedNode.id, 1)}
                disabled={!canMoveLater}
                title="Move later in journey sequence"
              >
                <ArrowDown size={13} />
                <span>Later</span>
              </button>
            </div>

            <button
              type="button"
              className={styles.inspectorDeleteBtn}
              onClick={() => onDelete(selectedNode)}
              title="Delete this stop and any nested children"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Google Maps Official Reviews & Turn-by-Turn Directions (Zero-Cost Keyless) */}
        <div
          style={{
            margin: '12px 0 16px',
            padding: '14px',
            background: '#141418',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 10,
              fontSize: 11,
              fontWeight: 800,
              color: '#38bdf8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <MapPin size={13} color="#38bdf8" />
            <span>Official Google Maps Intelligence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedNode.title} ${parentNode?.title || ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '0.75rem',
                color: '#38bdf8',
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 14px rgba(6, 182, 212, 0.2)',
                transition: 'all 0.2s ease',
              }}
              title="Open authentic ratings, opening hours, photos, and reviews on Google Maps"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ExternalLink size={14} />
                <span>Google Maps Ratings & Reviews</span>
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8' }}>Search →</span>
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(parentNode?.title || 'Current Location')}&destination=${encodeURIComponent(`${selectedNode.title} ${parentNode?.title || ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                borderRadius: '0.75rem',
                color: '#34d399',
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 14px rgba(52, 211, 153, 0.2)',
                transition: 'all 0.2s ease',
              }}
              title="Launch official turn-by-turn driving, transit, or walking directions"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Navigation size={14} />
                <span>Turn-by-Turn Directions</span>
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>Route →</span>
            </a>
          </div>
        </div>

        {/* Editable Form Fields */}
        <form onSubmit={handleSave} className={styles.detailsForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Stop Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>

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
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={styles.formInput}
                placeholder="e.g. 2 hours"
              />
            </div>
          </div>

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

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.formTextarea}
              placeholder="Highlight of this stop..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Travel Notes</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.formTextarea}
              placeholder="Tips, packing, timing, reservations..."
            />
          </div>

          <div className={styles.detailsFormFooter}>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              {isSavedRecently ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Changes Saved</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Apply Node Updates</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </aside>
  );
}
