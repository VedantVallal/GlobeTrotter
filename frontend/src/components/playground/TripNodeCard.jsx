'use client';

import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Trash2,
  RefreshCw,
  Copy,
  Plus,
  GripVertical,
  Compass,
  Layers,
  Sparkles,
  Globe,
  Bed,
  Plane,
  Receipt,
  Pin,
  PinOff,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from './playground.module.css';

const TYPE_CONFIG = {
  root: {
    label: 'Trip Root',
    badgeClass: styles.badgeRoot,
    icon: Globe,
    accent: '#7C3AED',
  },
  city: {
    label: 'City Stop',
    badgeClass: styles.badgeCity,
    icon: Compass,
    accent: '#2563EB',
  },
  area: {
    label: 'Area',
    badgeClass: styles.badgeArea,
    icon: Layers,
    accent: '#4F46E5',
  },
  destination: {
    label: 'Attraction',
    badgeClass: styles.badgeDestination,
    icon: MapPin,
    accent: '#0D9488',
  },
  activity: {
    label: 'Activity',
    badgeClass: styles.badgeActivity,
    icon: Sparkles,
    accent: '#EA580C',
  },
  stay: {
    label: 'Stay / Hotel',
    badgeClass: styles.badgeStay,
    icon: Bed,
    accent: '#059669',
  },
  transport: {
    label: 'Transport Leg',
    badgeClass: styles.badgeTransport,
    icon: Plane,
    accent: '#0284C7',
  },
  expense: {
    label: 'Expense Pill',
    badgeClass: styles.badgeExpense,
    icon: Receipt,
    accent: '#D97706',
  },
};

export default function TripNodeCard({
  node,
  isSelected,
  onSelect,
  onStartDrag,
  onOpenReplace,
  onDuplicate,
  onDelete,
  onAddChild,
  onToggleLock,
}) {
  const config = TYPE_CONFIG[node.type] || TYPE_CONFIG.destination;
  const IconComponent = config.icon;

  const handleMouseDown = (e) => {
    // Only drag when clicking the card header / handle, not buttons
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
      return;
    }
    onStartDrag(e, node.id);
  };

  const isLocked = Boolean(node.is_locked || node.isLocked);

  return (
    <div
      id={`node-${node.id}`}
      className={`${styles.nodeCard} ${isSelected ? styles.nodeCardSelected : ''} ${isLocked ? styles.nodeCardLocked : ''} ${styles[`nodeType_${node.type}`] || styles.nodeType_destination}`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onMouseDown={handleMouseDown}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(node.id);
        }
      }}
      aria-selected={isSelected}
      aria-label={`${node.title} (${config.label})`}
    >
      {/* Card Drag Affordance & Type Ribbon */}
      <div className={styles.nodeCardHeader}>
        <div className={styles.nodeHeaderLeft}>
          <div className={styles.nodeDragHandle} title="Drag to reposition">
            <GripVertical size={13} className={styles.gripIcon} />
          </div>

          <span className={`${styles.nodeTypeBadge} ${config.badgeClass}`}>
            <IconComponent size={10} style={{ marginRight: 3 }} />
            {config.label}
          </span>
        </div>

        <div className={styles.nodeHeaderRight}>
          {isLocked && (
            <span className={styles.nodeLockedBadge} title="Fixed/Pinned against AI optimization">
              <Pin size={9} />
              <span>Pinned</span>
            </span>
          )}

          {node.dayNumber && (
            <span className={styles.nodeDayBadge}>
              <Calendar size={10} style={{ marginRight: 2 }} />
              Day {node.dayNumber}
            </span>
          )}

          {/* Quick Context Action Icons */}
          <div className={styles.nodeQuickActions}>
            <button
              type="button"
              className={`${styles.nodeActionBtn} ${isLocked ? styles.nodeActionBtnLocked : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleLock) {
                  onToggleLock(node.id, !isLocked);
                }
              }}
              title={isLocked ? "Stop is Locked (Fixed against AI reordering)" : "Lock Stop (Pin fixed flights/hotels)"}
            >
              {isLocked ? <Pin size={11} color="var(--gt-blue, #2563EB)" /> : <PinOff size={11} />}
            </button>
            <button
              type="button"
              className={styles.nodeActionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node);
              }}
              title={`Add child under ${node.title}`}
            >
              <Plus size={11} />
            </button>
            <button
              type="button"
              className={styles.nodeActionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onOpenReplace(node);
              }}
              title="Replace with another place"
            >
              <RefreshCw size={11} />
            </button>
            <button
              type="button"
              className={styles.nodeActionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(node);
              }}
              title="Duplicate node"
            >
              <Copy size={11} />
            </button>
            <button
              type="button"
              className={`${styles.nodeActionBtn} ${styles.nodeActionBtnDelete}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node);
              }}
              title="Delete node"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className={styles.nodeCardBody}>
        {node.image && (
          <img
            src={node.image}
            alt={node.title}
            className={styles.nodeThumb}
            loading="lazy"
          />
        )}
        <div className={styles.nodeContent}>
          <div className={styles.nodeTitle} title={node.title}>
            {node.title}
          </div>

          <div className={styles.nodeMetaRow}>
            {node.time && (
              <span className={styles.nodeMetaPill} title={`Scheduled Time: ${node.time}`}>
                <Clock size={10} />
                <span>{node.time}</span>
              </span>
            )}

            {node.duration && !node.time && (
              <span className={styles.nodeMetaPill}>
                <Clock size={10} />
                <span>{node.duration}</span>
              </span>
            )}

            {node.estimatedCost !== undefined && node.estimatedCost !== null && (
              <span className={styles.nodeMetaPill}>
                <span>
                  {Number(node.estimatedCost) === 0 ? 'Free' : formatCurrency(node.estimatedCost, node.currency)}
                </span>
              </span>
            )}

            {node.category && (
              <span className={styles.nodeCategoryPill}>{node.category}</span>
            )}
          </div>

          {node.description && (
            <div className={styles.nodeDescription} title={node.description}>
              {node.description}
            </div>
          )}
        </div>
      </div>

      {/* Active Connect Points Anchor */}
      <div className={`${styles.nodePort} ${styles.nodePortIn}`} title="Parent Input" />
      <div className={`${styles.nodePort} ${styles.nodePortOut}`} title="Children Output" />
    </div>
  );
}
