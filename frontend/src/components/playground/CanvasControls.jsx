'use client';

import React from 'react';
import {
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Workflow,
  Target,
  Map,
} from 'lucide-react';
import styles from './playground.module.css';

export default function CanvasControls({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitView,
  onAutoLayout,
  onCenterSelected,
  hasSelection,
  isMiniMapOpen,
  onToggleMiniMap,
}) {
  return (
    <aside className={styles.canvasControls} aria-label="Canvas Navigation and Layout Controls">
      <button
        type="button"
        className={styles.canvasControlBtn}
        onClick={onZoomIn}
        title="Zoom In (Ctrl + Plus)"
        aria-label="Zoom In"
      >
        <Plus size={15} />
      </button>

      <button
        type="button"
        className={styles.canvasControlBtn}
        onClick={onZoomOut}
        title="Zoom Out (Ctrl + Minus)"
        aria-label="Zoom Out"
      >
        <Minus size={15} />
      </button>

      <button
        type="button"
        className={styles.canvasControlBtn}
        onClick={onResetZoom}
        title={`Reset Zoom (${Math.round(zoomLevel * 100)}%)`}
        aria-label="Reset Zoom"
      >
        <RotateCcw size={14} />
      </button>

      <div className={styles.canvasControlDivider} />

      <button
        type="button"
        className={styles.canvasControlBtn}
        onClick={onFitView}
        title="Fit All Nodes in View"
        aria-label="Fit View"
      >
        <Maximize2 size={14} />
      </button>

      <button
        type="button"
        className={`${styles.canvasControlBtn} ${styles.canvasControlBtnAccent}`}
        onClick={onAutoLayout}
        title="Auto-Arrange Graph (Cleanly spaces nodes preserving chronological order)"
        aria-label="Auto-Arrange Graph"
      >
        <Workflow size={14} />
      </button>

      {hasSelection && (
        <button
          type="button"
          className={styles.canvasControlBtn}
          onClick={onCenterSelected}
          title="Center on Selected Node"
          aria-label="Center on Selected Node"
        >
          <Target size={14} />
        </button>
      )}

      {onToggleMiniMap && (
        <button
          type="button"
          className={`${styles.canvasControlBtn} ${isMiniMapOpen ? styles.canvasControlBtnActive : ''}`}
          onClick={onToggleMiniMap}
          title={isMiniMapOpen ? 'Hide Mini-Map (M)' : 'Show Route Mini-Map (M)'}
          aria-label="Toggle Route Mini-Map"
        >
          <Map size={14} />
        </button>
      )}
    </aside>
  );
}
