'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Inbox, ArrowUpDown } from 'lucide-react';
import styles from './admin.module.css';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyMessage = 'Try adjusting your search filters to find what you are looking for.',
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onRowClick,
  sortField,
  sortOrder,
  onSort,
}) {
  const startRecord = totalCount === 0 ? 0 : (page - 1) * 10 + 1;
  const endRecord = Math.min(page * 10, totalCount);

  return (
    <div className={styles.card}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    cursor: col.sortable ? 'pointer' : 'default',
                    textAlign: col.align || 'left',
                  }}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>{col.label}</span>
                    {col.sortable && (
                      <ArrowUpDown size={11} style={{ opacity: sortField === col.key ? 1 : 0.4 }} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skel-${rIdx}`}>
                  {columns.map((col, cIdx) => (
                    <td key={`skel-c-${cIdx}`}>
                      <div
                        style={{
                          height: 14,
                          background: '#f1f5f9',
                          borderRadius: 4,
                          width: `${50 + ((cIdx + rIdx) % 4) * 12}%`,
                          animation: 'pulse 1.5s infinite',
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State Row
              <tr>
                <td colSpan={columns.length}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIconBox}>
                      <Inbox size={22} />
                    </div>
                    <div className={styles.emptyTitle}>{emptyTitle}</div>
                    <div className={styles.emptyDesc}>{emptyMessage}</div>
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              data.map((item, rowIdx) => (
                <tr
                  key={item.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(item)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                      {col.render ? col.render(item, rowIdx) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && totalCount > 0 && onPageChange && (
        <div className={styles.pagination}>
          <div>
            Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of{' '}
            <strong>{totalCount}</strong> entries
          </div>

          <div className={styles.paginationControls}>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous Page"
            >
              <ChevronLeft size={13} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Sliding window for page numbers
              let p = i + 1;
              if (totalPages > 5 && page > 3) {
                p = Math.min(page - 2 + i, totalPages - (4 - i));
              }
              return (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next Page"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
