// Utility formatters & Global Multi-Currency Engine
import { format, formatDistance, differenceInDays, parseISO } from 'date-fns';

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)', flag: '🇺🇸', locale: 'en-US' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)', flag: '🇮🇳', locale: 'en-IN' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)', flag: '🇯🇵', locale: 'ja-JP' },
];

export const FALLBACK_RATES = {
  USD: 1.0,
  INR: 86.60,
  EUR: 0.925,
  GBP: 0.792,
  JPY: 153.20,
};

let cachedRates = { ...FALLBACK_RATES };
let lastRatesTimestamp = null;
let isLiveRates = false;

// Initialize rates from cache or fetch
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('gt_fx_rates');
    const storedTs = localStorage.getItem('gt_fx_timestamp');
    if (stored) {
      cachedRates = { ...FALLBACK_RATES, ...JSON.parse(stored) };
      lastRatesTimestamp = storedTs || new Date().toISOString();
    }
  } catch (e) {}

  // Fetch fresh Frankfurter ECB rates in background
  fetchLiveRates();
}

export async function fetchLiveRates() {
  if (typeof window === 'undefined') return cachedRates;
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR,EUR,GBP,JPY', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.rates) {
        cachedRates = {
          USD: 1.0,
          INR: data.rates.INR || FALLBACK_RATES.INR,
          EUR: data.rates.EUR || FALLBACK_RATES.EUR,
          GBP: data.rates.GBP || FALLBACK_RATES.GBP,
          JPY: data.rates.JPY || FALLBACK_RATES.JPY,
        };
        lastRatesTimestamp = new Date().toISOString();
        isLiveRates = true;
        try {
          localStorage.setItem('gt_fx_rates', JSON.stringify(cachedRates));
          localStorage.setItem('gt_fx_timestamp', lastRatesTimestamp);
        } catch (e) {}
      }
    }
  } catch (err) {
    // Graceful offline fallback
    isLiveRates = false;
  }
  return cachedRates;
}

export function getActiveCurrency() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gt_active_currency');
      if (stored && SUPPORTED_CURRENCIES.some(c => c.code === stored)) {
        return stored;
      }
    } catch (e) {}
  }
  return 'USD';
}

export function setActiveCurrency(currencyCode) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gt_active_currency', currencyCode);
      window.dispatchEvent(
        new CustomEvent('gt_currency_changed', {
          detail: { currency: currencyCode },
        })
      );
    } catch (e) {}
  }
}

export function convertCurrency(amount, fromCode = 'USD', toCode = null) {
  if (amount === null || amount === undefined || isNaN(amount)) return 0;
  const target = toCode || getActiveCurrency();
  const from = (fromCode || 'USD').toUpperCase();
  const to = target.toUpperCase();

  if (from === to) return Number(amount);

  const rateFrom = cachedRates[from] || FALLBACK_RATES[from] || 1.0;
  const rateTo = cachedRates[to] || FALLBACK_RATES[to] || 1.0;

  // Convert to USD base, then to target
  const amountInUSD = Number(amount) / rateFrom;
  const converted = amountInUSD * rateTo;
  return converted;
}

export function formatCurrency(amount, currency = null, autoConvert = true) {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';

  const activeCur = getActiveCurrency();
  let valueToFormat = Number(amount);
  let displayCurrency = activeCur;

  if (autoConvert) {
    const fromCur = currency || 'USD';
    valueToFormat = convertCurrency(amount, fromCur, activeCur);
    displayCurrency = activeCur;
  } else {
    displayCurrency = currency || activeCur;
  }

  const curObj = SUPPORTED_CURRENCIES.find(c => c.code === displayCurrency) || SUPPORTED_CURRENCIES[0];

  return new Intl.NumberFormat(curObj.locale, {
    style: 'currency',
    currency: curObj.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valueToFormat);
}

export function getRateInfo() {
  return {
    rates: cachedRates,
    timestamp: lastRatesTimestamp || new Date().toISOString(),
    isLive: isLiveRates,
  };
}

export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr) {
  try {
    return format(parseISO(dateStr), 'MMM d');
  } catch {
    return dateStr;
  }
}

export function formatDateRange(startDate, endDate) {
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (start.getFullYear() === end.getFullYear()) {
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
    }
    return `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`;
  } catch {
    return `${startDate} – ${endDate}`;
  }
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  try {
    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    return Math.max(days, 1);
  } catch {
    return 1;
  }
}

export function tripDuration(startDate, endDate) {
  const days = calculateDays(startDate, endDate);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

export function timeAgo(dateStr) {
  try {
    return formatDistance(parseISO(dateStr), new Date(), { addSuffix: true });
  } catch {
    return 'recently';
  }
}

export function formatTime(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m || 0).padStart(2, '0')} ${ampm}`;
}

export function budgetPercentage(estimated, total) {
  if (!total) return 0;
  return Math.round((estimated / total) * 100);
}

export function pluralize(n, singular, plural) {
  return `${n} ${n === 1 ? singular : (plural || singular + 's')}`;
}
