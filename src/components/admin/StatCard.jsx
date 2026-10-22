'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './admin.module.css';

export default function StatCard({
  label,
  value,
  change,
  period,
  icon: Icon,
  isPositive = true,
  iconBg = '#eff6ff',
  iconColor = '#2563eb',
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statCardHeader}>
        <span className={styles.statLabel}>{label}</span>
        {Icon && (
          <div className={styles.statIconBox} style={{ background: iconBg, color: iconColor }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className={styles.statValue}>{value}</div>

      {(change || period) && (
        <div className={styles.statFooter}>
          {change && (
            <span className={isPositive ? styles.statTrendPositive : styles.statTrendNeutral}>
              {isPositive && <ArrowUpRight size={13} />}
              {change}
            </span>
          )}
          {period && <span className={styles.statPeriod}>{period}</span>}
        </div>
      )}
    </div>
  );
}
