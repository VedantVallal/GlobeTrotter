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
  LayoutGrid,
  Map,
  Users,
  UserPlus,
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
  viewMode = 'canvas',
  onToggleViewMode,
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
            title={`Estimated Cost: ${formatCurrency(summary.totalCost, trip.currency)} / Budget: ${formatCurrency(summary.tripBudget, trip.currency)}`}
          >
            <span>
              {formatCurrency(summary.totalCost, trip.currency)} / {formatCurrency(summary.tripBudget, trip.currency)}
            </span>
            {summary.isOverBudget && (
              <span className={styles.overBudgetTag}>
                <AlertCircle size={10} /> Over
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center Section: View Mode Switcher (Canvas ⇄ Map ⇄ Itinerary ⇄ Budget) */}
      <div className={styles.headerCenter}>
        <div className={styles.headerViewSwitcher} role="tablist" aria-label="Playground View Modes">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'canvas'}
            className={`${styles.viewSwitchBtn} ${viewMode === 'canvas' ? styles.viewSwitchBtnActive : ''}`}
            onClick={() => onToggleViewMode && onToggleViewMode('canvas')}
            title="Interactive Mind-Map DAG Canvas Workspace"
          >
            <LayoutGrid size={13} />
            <span>Mind-Map</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'map'}
            className={`${styles.viewSwitchBtn} ${viewMode === 'map' ? styles.viewSwitchBtnActive : ''}`}
            onClick={() => onToggleViewMode && onToggleViewMode('map')}
            title="Interactive Route & Geo Map"
          >
            <Map size={13} />
            <span>Geo Map</span>
          </button>
          <Link
            href={`/itinerary/${trip.id}`}
            className={styles.viewSwitchBtn}
            title="Chronological Itinerary & Calendar Timeline"
          >
            <Calendar size={13} />
            <span>Itinerary</span>
          </Link>
          <Link
            href={`/budget/${trip.id}`}
            className={styles.viewSwitchBtn}
            title="Budget Compare & Optimization"
          >
            <DollarSign size={13} />
            <span>Budget</span>
          </Link>
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

        {/* Live Collaborator Presence Stack */}
        <div
          onClick={onOpenShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '20px',
            transition: 'background 0.15s ease',
          }}
          title="Trip Collaborators (Click to Invite & Manage)"
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid #ffffff',
                background: '#4169d8',
                color: '#ffffff',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                alt="Aarav"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid #ffffff',
                background: '#0d9488',
                color: '#ffffff',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: -8,
                zIndex: 2,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="Priya"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '1.5px dashed var(--gt-border)',
                background: 'var(--gt-bg-alt)',
                color: 'var(--gt-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: -6,
                zIndex: 1,
              }}
            >
              <UserPlus size={10} />
            </div>
          </div>
        </div>

        {/* Collaborate & Share Button */}
        <button
          type="button"
          className={styles.headerOutlineBtn}
          onClick={onOpenShare}
          title="Collaborate with travel companions & share link"
        >
          <Users size={13} />
          <span className={styles.headerBtnText}>Collaborate</span>
        </button>
      </div>
    </header>
  );
}
