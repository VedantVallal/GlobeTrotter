// Utility formatters — always use these, never inline formatting
import { format, formatDistance, differenceInDays, parseISO } from 'date-fns';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateFromUSD: 1.0, flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateFromUSD: 86.5, flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', name: 'Euro', rateFromUSD: 0.92, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateFromUSD: 0.79, flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateFromUSD: 152.0, flag: '🇯🇵' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateFromUSD: 1.38, flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateFromUSD: 1.52, flag: '🇦🇺' },
];

export function convertCurrency(amount, fromCurrency = 'USD', toCurrency = 'USD') {
  if (amount === undefined || amount === null || isNaN(amount)) return 0;
  if (fromCurrency === toCurrency) return Number(amount);

  const fromRate = CURRENCIES.find((c) => c.code === fromCurrency)?.rateFromUSD || 1.0;
  const toRate = CURRENCIES.find((c) => c.code === toCurrency)?.rateFromUSD || 1.0;

  // Convert from source to USD, then from USD to target
  const inUSD = Number(amount) / fromRate;
  const converted = inUSD * toRate;

  return toCurrency === 'JPY' ? Math.round(converted) : Math.round(converted * 100) / 100;
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  const localeMap = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    CAD: 'en-CA',
    AUD: 'en-AU',
  };
  const locale = localeMap[currency] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 0,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
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
