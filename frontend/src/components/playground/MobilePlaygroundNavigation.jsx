'use client';

import React from 'react';
import { Compass, Layers, Sparkles, Sliders } from 'lucide-react';
import styles from './playground.module.css';

export default function MobilePlaygroundNavigation({
  activeTab,
  onChangeTab,
  nodesCount,
  hasSelection,
}) {
  return (
    <nav className={styles.mobileNavWrapper} aria-label="Mobile Playground Navigation">
      <button
        type="button"
        className={`${styles.mobileTabButton} ${activeTab === 'explore' ? styles.mobileTabButtonActive : ''}`}
        onClick={() => onChangeTab('explore')}
      >
        <Compass size={18} />
        <span className={styles.mobileTabLabel}>Explore</span>
      </button>

      <button
        type="button"
        className={`${styles.mobileTabButton} ${activeTab === 'journey' ? styles.mobileTabButtonActive : ''}`}
        onClick={() => onChangeTab('journey')}
      >
        <Layers size={18} />
        <span className={styles.mobileTabLabel}>
          Journey ({nodesCount})
        </span>
      </button>

      <button
        type="button"
        className={`${styles.mobileTabButton} ${activeTab === 'details' || activeTab === 'copilot' ? styles.mobileTabButtonActive : ''}`}
        onClick={() => onChangeTab(hasSelection ? 'details' : 'copilot')}
      >
        {hasSelection ? <Sliders size={18} /> : <Sparkles size={18} />}
        <span className={styles.mobileTabLabel}>
          {hasSelection ? 'Stop Details' : 'AI Copilot'}
        </span>
        {hasSelection && <span className={styles.mobileActiveDot} />}
      </button>
    </nav>
  );
}
