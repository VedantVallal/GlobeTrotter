'use client';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

const Input = forwardRef(function Input(
  { label, id, error, hint, leftIcon, rightIcon, size = 'md', className, wrapperClassName, required, ...props },
  ref
) {
  return (
    <div className={clsx(styles.field, wrapperClassName)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={clsx(styles.inputWrap, leftIcon && styles.hasLeft, rightIcon && styles.hasRight, error && styles.inputWrapError)}>
        {leftIcon && <span className={styles.leftIcon} aria-hidden="true">{leftIcon}</span>}
        <input
          ref={ref}
          id={id}
          className={clsx(styles.input, styles[`input--${size}`], className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          required={required}
          {...props}
        />
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </div>
      {error && <span id={`${id}-error`} className={styles.error} role="alert">{error}</span>}
      {!error && hint && <span id={`${id}-hint`} className={styles.hint}>{hint}</span>}
    </div>
  );
});

export default Input;
