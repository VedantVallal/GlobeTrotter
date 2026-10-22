import clsx from 'clsx';
import styles from './Badge.module.css';

const STATUS_MAP = {
  planning:  { label: 'Planning',  cls: 'blue'    },
  upcoming:  { label: 'Upcoming',  cls: 'green'   },
  completed: { label: 'Completed', cls: 'gray'    },
  overbudget:{ label: 'Over Budget',cls: 'red'    },
};

export default function Badge({ variant = 'blue', children, status, size = 'md', dot = false, className }) {
  const resolved = status ? STATUS_MAP[status] : null;
  const finalVariant = resolved?.cls || variant;
  const finalLabel = resolved?.label || children;

  return (
    <span className={clsx(styles.badge, styles[`badge--${finalVariant}`], styles[`badge--${size}`], className)}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {finalLabel}
    </span>
  );
}
