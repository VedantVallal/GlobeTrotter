'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Link2,
  Image as ImageIcon,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { CATEGORIES, STOCK_TRAVEL_IMAGES } from './playgroundTypes';
import styles from './playground.module.css';

export default function NodeDetailsPanel({
  selectedNode,
  allNodes = [],
  links = [],
  onCreateLink,
  onDeleteLink,
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
  const [selectedImage, setSelectedImage] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageCategoryFilter, setImageCategoryFilter] = useState('All');
  const [connectTargetId, setConnectTargetId] = useState('');
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
      setSelectedImage(selectedNode.image || '');
      setShowImagePicker(false);
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

  // Connected links for this stop
  const connectedLinks = useMemo(() => {
    return (links || []).filter(
      (l) => l.source === selectedNode.id || l.target === selectedNode.id
    );
  }, [links, selectedNode.id]);

  // Candidates available to link with
  const availableToLink = useMemo(() => {
    return allNodes.filter((n) => {
      if (n.id === selectedNode.id) return false;
      const alreadyLinked = (links || []).some(
        (l) =>
          (l.source === selectedNode.id && l.target === n.id) ||
          (l.source === n.id && l.target === selectedNode.id)
      );
      return !alreadyLinked;
    });
  }, [allNodes, selectedNode.id, links]);

  // Filtered stock images
  const filteredStockImages = useMemo(() => {
    if (imageCategoryFilter === 'All') return STOCK_TRAVEL_IMAGES;
    return STOCK_TRAVEL_IMAGES.filter(
      (img) => img.category.toLowerCase() === imageCategoryFilter.toLowerCase()
    );
  }, [imageCategoryFilter]);

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
      image: selectedImage,
    });

    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 1500);
  };

  const handleCreateConnection = () => {
    if (!connectTargetId) return;
    onCreateLink?.(selectedNode.id, connectTargetId);
    setConnectTargetId('');
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
        {/* Cover Photo with Stock Photo Change Option */}
        <div className={styles.detailsImageWrapper} style={{ position: 'relative' }}>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={selectedNode.title}
              className={styles.detailsImage}
            />
          ) : (
            <div
              style={{
                height: 120,
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: 12,
              }}
            >
              No photo selected
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowImagePicker((prev) => !prev)}
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ImageIcon size={12} />
            <span>{showImagePicker ? 'Close Gallery' : 'Choose Stock Photo'}</span>
          </button>
        </div>

        {/* Stock Photo Gallery Selector */}
        {showImagePicker && (
          <div className={styles.stockImagePickerContainer}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Select Travel Stock Image
            </div>
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
                  onClick={() => {
                    setSelectedImage(img.url);
                    onUpdateNode(selectedNode.id, { image: img.url });
                  }}
                  title={img.title}
                >
                  <img src={img.thumbnail} alt={img.title} />
                  <span className={styles.stockImageLabel}>{img.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Connections / Linking Section */}
        <div style={{
          marginTop: 12,
          padding: 10,
          background: '#f8fafc',
          border: '1px solid var(--gt-border, #e2e8f0)',
          borderRadius: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Link2 size={13} color="#2563eb" />
              <span>Connected Stops ({connectedLinks.length})</span>
            </span>
          </div>

          {connectedLinks.length === 0 ? (
            <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginBottom: 8 }}>
              No stops linked yet. Connect from canvas ports or select a stop below.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
              {connectedLinks.map((link) => {
                const isSource = link.source === selectedNode.id;
                const otherId = isSource ? link.target : link.source;
                const otherNode = allNodes.find((n) => n.id === otherId);

                return (
                  <div
                    key={link.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                    }}
                  >
                    <span style={{ color: '#334155', fontWeight: 500 }}>
                      {isSource ? '➔ Leads to: ' : '⬅ Comes from: '}
                      <strong>{otherNode?.title || 'Unknown Stop'}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteLink?.(link.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: 11,
                        padding: '2px 4px',
                        fontWeight: 600,
                      }}
                      title="Unlink this connection"
                    >
                      ✕ Unlink
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick inline connector */}
          {availableToLink.length > 0 && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select
                className={styles.formSelect}
                value={connectTargetId}
                onChange={(e) => setConnectTargetId(e.target.value)}
                style={{ fontSize: 11, padding: '4px 8px', height: 28, flex: 1 }}
              >
                <option value="">+ Connect with another stop...</option>
                {availableToLink.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.title} ({target.type})
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCreateConnection}
                disabled={!connectTargetId}
                style={{ height: 28, fontSize: 11, padding: '0 8px' }}
              >
                Link
              </Button>
            </div>
          )}
        </div>

        {/* Modern Inspector Action Toolbar */}
        <div className={styles.inspectorActionsCard}>
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
