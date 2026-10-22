'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Share2,
  CheckCircle2,
  Clock,
  Undo2,
  Redo2,
  Compass,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers,
  AlertCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';
import styles from './playground.module.css';

export default function PlaygroundHeader({
  trip,
  summary,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  leftPanelOpen,
  onToggleLeftPanel,
  rightPanelOpen,
  onToggleRightPanel,
  isFullscreen,
  onToggleFullscreen,
  onOpenShare,
}) {
  return (
    <header className={styles.header}>
      {/* Left Section: Back, Title, Summary */}
      <div className={styles.headerLeft}>
        <Link href="/trips" className={styles.backBtn} title="Back to All Trips">
          <ArrowLeft size={16} />
        </Link>

        <div className={styles.headerTitleGroup}>
          <h1 className={styles.tripTitle} title={trip.title}>
            {trip.title}
          </h1>

          {/* Quick Stats Pill */}
          <div className={styles.headerStatsPill}>
            <span>{summary.cityCount} Cities</span>
            <span className={styles.dotSeparator}>•</span>
            <span>{summary.destinationCount} Places</span>
            <span className={styles.dotSeparator}>•</span>
            <span>{summary.activityCount} Activities</span>
          </div>
        </div>

        {/* Date & Budget Badges (Desktop) */}
        <div className={styles.headerMeta}>
          {trip.startDate && (
            <div className={styles.headerMetaItem}>
              <Calendar size={13} color="var(--gt-text-muted)" />
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </div>
          )}

          {/* Deterministic Budget Pill */}
          <div
            className={`${styles.headerBudgetPill} ${summary.isOverBudget ? styles.headerBudgetOver : ''}`}
            title={`Estimated Cost: $${summary.totalCost} / Budget: $${summary.tripBudget}`}
          >
            <DollarSign size={12} />
            <span>
              ${summary.totalCost} / ${summary.tripBudget}
            </span>
            {summary.isOverBudget && (
              <span className={styles.overBudgetTag}>
                <AlertCircle size={10} /> Over
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: Status, Undo/Redo, Toggles, Share */}
      <div className={styles.headerRight}>
        {/* Save Status Indicator */}
        <div className={styles.saveStatus}>
          {saveStatus === 'Saving...' ? (
            <Clock size={13} className={styles.spinningIcon} />
          ) : (
            <CheckCircle2 size={13} color="var(--gt-success, #10B981)" />
          )}
          <span>{saveStatus}</span>
        </div>

        {/* Undo / Redo Controls */}
        <div className={styles.headerUndoRedoGroup}>
          <button
            type="button"
            className={styles.headerIconBtn}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            className={styles.headerIconBtn}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* Side Panel Toggle Buttons */}
        <div className={styles.headerPanelToggles}>
          <button
            type="button"
            className={`${styles.panelToggleBtn} ${leftPanelOpen ? styles.panelToggleBtnActive : ''}`}
            onClick={onToggleLeftPanel}
            title={leftPanelOpen ? 'Hide Explore Panel' : 'Show Explore Panel'}
          >
            <Compass size={14} />
            <span className={styles.headerBtnText}>Explore</span>
          </button>

          <button
            type="button"
            className={`${styles.panelToggleBtn} ${rightPanelOpen ? styles.panelToggleBtnActive : ''}`}
            onClick={onToggleRightPanel}
            title={rightPanelOpen ? 'Hide Inspector / Copilot' : 'Show Inspector / Copilot'}
          >
            <Sparkles size={14} />
            <span className={styles.headerBtnText}>Copilot</span>
          </button>
        </div>

        {/* Fullscreen Studio Toggle */}
        <button
          type="button"
          className={`${styles.headerIconBtn} ${isFullscreen ? styles.headerIconBtnActive : ''}`}
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Studio Mode'}
          aria-label="Fullscreen Studio"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>

        {/* Itinerary Link */}
        <Link href={`/trips/${trip.id}/builder`} style={{ textDecoration: 'none' }}>
          <button
            type="button"
            className={styles.headerGhostBtn}
            title="Open 9-Step Timeline Builder"
          >
            <Layers size={14} />
            <span className={styles.headerBtnText}>Builder</span>
          </button>
        </Link>

        {/* Share Button */}
        <button
          type="button"
          className={styles.headerOutlineBtn}
          onClick={onOpenShare}
          title="Share Trip Link"
        >
          <Share2 size={13} />
          <span className={styles.headerBtnText}>Share</span>
        </button>
      </div>
    </header>
  );
}
