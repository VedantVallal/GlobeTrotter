'use client';
import clsx from 'clsx';
import styles from './Button.module.css';

/**
 * Button — primary UI primitive
 * variants: primary | secondary | outline | ghost | danger
 * sizes: sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        styles.btn,
        styles[`btn--${variant}`],
        styles[`btn--${size}`],
        fullWidth && styles['btn--full'],
        loading && styles['btn--loading'],
        className
      )}
      {...props}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {!loading && leftIcon && (
        <span className={styles.icon} aria-hidden="true">{leftIcon}</span>
      )}
      <span className={loading ? styles.loadingText : ''}>{children}</span>
      {!loading && rightIcon && (
        <span className={styles.icon} aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
}
