import styles from './SectionHeader.module.css';

export default function SectionHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`${styles.sectionHeader} ${className}`}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
