// Utility formatters — always use these, never inline formatting
import { format, formatDistance, differenceInDays, parseISO } from 'date-fns';

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  return format(parseISO(dateStr), fmt);
}

export function formatDateShort(dateStr) {
  return format(parseISO(dateStr), 'MMM d');
}

export function formatDateRange(startDate, endDate) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  }
  return `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
  return Math.max(days, 1);
}

export function tripDuration(startDate, endDate) {
  const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
  return `${days} day${days !== 1 ? 's' : ''}`;
}

export function timeAgo(dateStr) {
  return formatDistance(parseISO(dateStr), new Date(), { addSuffix: true });
}

export function formatTime(time) {
  // '09:00' → '9:00 AM'
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function budgetPercentage(estimated, total) {
  if (!total) return 0;
  return Math.round((estimated / total) * 100);
}

export function pluralize(n, singular, plural) {
  return `${n} ${n === 1 ? singular : (plural || singular + 's')}`;
}
