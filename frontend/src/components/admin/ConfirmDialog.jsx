'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from './admin.module.css';

export default function ConfirmDialog({
  isOpen = false,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This operation cannot be easily undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onCancel} role="dialog" aria-modal="true">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: isDanger ? '#fee2e2' : '#eff6ff',
                color: isDanger ? '#dc2626' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={15} />
            </div>
            <h3 className={styles.modalTitle}>{title}</h3>
          </div>
          <button
            type="button"
            className={styles.collapseToggleBtn}
            onClick={onCancel}
            aria-label="Close Dialog"
          >
            <X size={14} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p style={{ fontSize: 13, color: 'var(--gt-text-secondary, #647184)', lineHeight: 1.5, margin: 0 }}>
            {message}
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${isDanger ? styles.btnDanger : styles.btnPrimary}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
