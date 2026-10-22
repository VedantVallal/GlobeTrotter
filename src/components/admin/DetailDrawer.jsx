'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './admin.module.css';

export default function DetailDrawer({
  isOpen = false,
  title = 'Record Details',
  onClose,
  children,
  footer,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.drawerBackdrop} onClick={onClose} aria-modal="true" role="dialog">
      <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>{title}</h3>
          <button
            type="button"
            className={styles.collapseToggleBtn}
            onClick={onClose}
            aria-label="Close Drawer"
          >
            <X size={15} />
          </button>
        </div>

        <div className={styles.drawerBody}>{children}</div>

        {footer && <div className={styles.drawerFooter}>{footer}</div>}
      </div>
    </div>
  );
}
