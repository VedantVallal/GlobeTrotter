'use client';

import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './playground.module.css';

export default function DeleteNodeDialog({
  isOpen,
  onClose,
  targetNode,
  descendantCount,
  onConfirmDelete,
}) {
  if (!isOpen || !targetNode) return null;

  const hasDescendants = descendantCount > 0;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitle} id="delete-dialog-title" style={{ color: 'var(--gt-error)' }}>
            <Trash2 size={18} />
            <span>Delete Stop: {targetNode.title}</span>
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

        {/* Warning Description */}
        <div className={styles.deleteDialogBody}>
          {hasDescendants ? (
            <div className={styles.deleteWarningBox}>
              <AlertTriangle size={20} className={styles.warningIcon} />
              <div>
                <p className={styles.warningTitle}>
                  Deleting <strong>{targetNode.title}</strong> will also remove{' '}
                  <span className={styles.highlightBadge}>
                    {descendantCount} connected sub-stop{descendantCount > 1 ? 's' : ''}
                  </span>
                  .
                </p>
                <p className={styles.warningSub}>
                  This includes child areas, destinations, and scheduled activities under this node.
                  You can undo this action immediately after deleting.
                </p>
              </div>
            </div>
          ) : (
            <p className={styles.modalSubtitle}>
              Are you sure you want to remove <strong>{targetNode.title}</strong> from your trip itinerary?
              You can undo this action at any time.
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirmDelete(targetNode);
              onClose();
            }}
          >
            {hasDescendants ? `Delete Stop & ${descendantCount} Sub-Stops` : 'Delete Stop'}
          </Button>
        </div>
      </div>
    </div>
  );
}
