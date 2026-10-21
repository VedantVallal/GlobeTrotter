import styles from './PageContainer.module.css';

export default function PageContainer({ children, className = '', noPadding = false }) {
  return (
    <div className={`${styles.container} ${noPadding ? styles.noPadding : ''} ${className}`}>
      {children}
    </div>
  );
}
