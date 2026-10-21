'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plus,
  X,
  Check,
  Sparkles,
  ArrowRight,
  Globe,
  Camera,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { mockCities } from '@/lib/data/mockCities';
import { tripService } from '@/lib/services';
import { formatCurrency, calculateDays } from '@/lib/utils/formatters';
import styles from './create-trip.module.css';

const PREFERENCE_OPTIONS = [
  'Beach', 'Adventure', 'Food',
  'Culture', 'Nature', 'Shopping',
  'History', 'Nightlife', 'Relaxation',
];

export default function CreateTripPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [startLocation, setStartLocation] = useState('Mumbai, India');
  const [destinationInput, setDestinationInput] = useState('');
  const [destinations, setDestinations] = useState(['Goa']);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&fit=crop'
  );

  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-17');
  const [travelers, setTravelers] = useState(2);

  const [budget, setBudget] = useState(1200);
  const [currency, setCurrency] = useState('USD');
  const [selectedPreferences, setSelectedPreferences] = useState(['Beach', 'Relaxation']);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Duration in days
  const durationDays = useMemo(() => {
    return calculateDays(startDate, endDate);
  }, [startDate, endDate]);

  // Autocomplete suggestions
  const citySuggestions = useMemo(() => {
    if (!destinationInput.trim()) return [];
    return mockCities
      .filter((c) => c.name.toLowerCase().includes(destinationInput.toLowerCase()) && !destinations.includes(c.name))
      .slice(0, 4);
  }, [destinationInput, destinations]);

  const addDestination = (cityName) => {
    if (!destinations.includes(cityName) && destinations.length < 10) {
      setDestinations([...destinations, cityName]);
      setDestinationInput('');
    }
  };

  const removeDestination = (cityName) => {
    setDestinations(destinations.filter((d) => d !== cityName));
  };

  const togglePreference = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title || title.trim().length < 3) {
      newErrors.title = 'Trip title must be at least 3 characters';
    }
    if (destinations.length === 0) {
      newErrors.destinations = 'Please add at least one destination';
    }
    if (!startDate || !endDate) {
      newErrors.dates = 'Please select valid start and end dates';
    } else if (new Date(endDate) <= new Date(startDate)) {
      newErrors.dates = 'End date must be after start date';
    }
    if (!budget || budget <= 0) {
      newErrors.budget = 'Please enter a valid budget';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const newTrip = await tripService.createTrip({
        title,
        startLocation,
        destinations,
        description,
        coverImage,
        startDate,
        endDate,
        travelers,
        budget: Number(budget),
        currency,
        preferences: selectedPreferences,
      });

      router.push(`/playground/${newTrip.id}`);
    } catch (err) {
      console.error('Failed to create trip', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'My Trips', href: '/trips' },
          { label: 'Create Trip' },
        ]}
      />

      <PageContainer>
        <SectionHeader
          title="Create New Trip"
          subtitle="Design your multi-city route, estimate expenses, and prepare the node canvas"
        />

        <div className={styles.layoutSplit}>
          {/* Left Column: Multi-step Form */}
          <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
            {/* Step 1: Trip Basics */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>1</div>
                <h2 className={styles.stepTitle}>Trip Basics</h2>
              </div>

              <Input
                id="trip-title"
                label="Trip Title"
                placeholder="e.g. Golden Goa Escape or Swiss Alps Expedition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                required
              />

              <div className={styles.twoColRow}>
                <Input
                  id="trip-start-location"
                  label="Departure City"
                  placeholder="e.g. Mumbai, New York, London"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  leftIcon={<MapPin size={16} />}
                  required
                />

                <div>
                  <Input
                    id="trip-destination-input"
                    label="Add Destination Stops"
                    placeholder="Type city name..."
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    leftIcon={<Globe size={16} />}
                  />

                  {/* Autocomplete dropdown */}
                  {citySuggestions.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        zIndex: 10,
                        background: 'var(--gt-surface)',
                        border: '1px solid var(--gt-border)',
                        borderRadius: 'var(--gt-radius-md)',
                        boxShadow: 'var(--gt-shadow-md)',
                        marginTop: 4,
                        width: '260px',
                      }}
                    >
                      {citySuggestions.map((city) => (
                        <div
                          key={city.id}
                          onClick={() => addDestination(city.name)}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <strong>{city.name}</strong>
                          <span style={{ color: 'var(--gt-text-muted)' }}>{city.country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Destination Tag Chips */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gt-text-primary)' }}>
                  Selected Stops ({destinations.length}):
                </label>
                <div className={styles.tagsWrapper}>
                  {destinations.map((dest) => (
                    <span key={dest} className={styles.tagChip}>
                      <span>{dest}</span>
                      <button
                        type="button"
                        onClick={() => removeDestination(dest)}
                        className={styles.tagRemoveBtn}
                        aria-label={`Remove ${dest}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.destinations && (
                  <span style={{ color: 'var(--gt-error)', fontSize: '12px', marginTop: 4, display: 'block' }}>
                    {errors.destinations}
                  </span>
                )}
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gt-text-primary)', display: 'block', marginBottom: 4 }}>
                  Trip Notes / Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes about highlights, travel buddies, or flights..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'var(--gt-space-3)',
                    borderRadius: 'var(--gt-radius-md)',
                    border: '1px solid var(--gt-border)',
                    fontFamily: 'inherit',
                    fontSize: 'var(--gt-text-sm)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Step 2: Dates & Travelers */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>2</div>
                <h2 className={styles.stepTitle}>Dates & Travelers</h2>
              </div>

              <div className={styles.twoColRow}>
                <Input
                  id="trip-start-date"
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  error={errors.dates}
                  required
                />

                <Input
                  id="trip-end-date"
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--gt-bg-alt)', borderRadius: 'var(--gt-radius-md)' }}>
                <span style={{ fontSize: '13px', color: 'var(--gt-text-secondary)' }}>Calculated Duration:</span>
                <strong style={{ color: 'var(--gt-blue)', fontSize: '14px' }}>{durationDays} Days ({durationDays > 0 ? durationDays - 1 : 0} Nights)</strong>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gt-text-primary)', display: 'block', marginBottom: 6 }}>
                  Number of Travelers:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gt-space-3)' }}>
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    style={{ width: 36, height: 36, borderRadius: 'var(--gt-radius-md)', border: '1px solid var(--gt-border)', background: 'var(--gt-surface)', cursor: 'pointer', fontSize: 18 }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 600, fontSize: '16px', minWidth: 32, textAlign: 'center' }}>
                    {travelers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravelers(travelers + 1)}
                    style={{ width: 36, height: 36, borderRadius: 'var(--gt-radius-md)', border: '1px solid var(--gt-border)', background: 'var(--gt-surface)', cursor: 'pointer', fontSize: 18 }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '13px', color: 'var(--gt-text-muted)' }}>
                    {travelers === 1 ? 'Solo Adventurer' : `${travelers} Adventurers`}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Budget & Currency */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>3</div>
                <h2 className={styles.stepTitle}>Budget Target</h2>
              </div>

              <div className={styles.twoColRow}>
                <Input
                  id="trip-budget"
                  label="Target Total Budget"
                  type="number"
                  min="0"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  leftIcon={<DollarSign size={16} />}
                  error={errors.budget}
                  required
                />

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gt-text-primary)', display: 'block', marginBottom: 4 }}>
                    Base Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--gt-radius-md)',
                      border: '1px solid var(--gt-border)',
                      background: 'var(--gt-surface)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="AED">AED (د.إ - UAE Dirham)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Travel Preferences */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>4</div>
                <h2 className={styles.stepTitle}>Travel Styles & Preferences</h2>
              </div>

              <div className={styles.prefGrid}>
                {PREFERENCE_OPTIONS.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      className={`${styles.prefChip} ${isSelected ? styles.prefChipActive : ''}`}
                      onClick={() => togglePreference(pref)}
                    >
                      {isSelected ? <Check size={14} /> : null}
                      <span>{pref}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--gt-space-4)', borderTop: '1px solid var(--gt-border)' }}>
              <Link href="/dashboard" style={{ fontSize: '14px', color: 'var(--gt-text-secondary)', textDecoration: 'none' }}>
                Cancel
              </Link>

              <Button type="submit" variant="primary" size="lg" loading={loading}>
                <span>Generate Workspace & Canvas</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>

          {/* Right Column: Live Summary Preview */}
          <aside className={styles.previewSidebar}>
            <div className={styles.previewCard}>
              <div className={styles.previewImageWrapper}>
                <img
                  src={coverImage}
                  alt={title || 'Trip Preview'}
                  className={styles.previewImage}
                />
                <div className={styles.previewBadge}>Live Node Blueprint</div>
              </div>

              <div className={styles.previewBody}>
                <div className={styles.previewTripTitle}>{title || 'Your Trip Title'}</div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--gt-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                    Planned Stops:
                  </div>
                  <div className={styles.previewStops}>
                    {destinations.length > 0 ? (
                      destinations.map((d, i) => (
                        <span key={d} className={styles.previewStopTag}>
                          {i + 1}. {d}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--gt-text-muted)' }}>No stops added yet</span>
                    )}
                  </div>
                </div>

                <div className={styles.previewStatsGrid}>
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Duration</span>
                    <span className={styles.previewStatValue}>{durationDays} Days</span>
                  </div>
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Travelers</span>
                    <span className={styles.previewStatValue}>{travelers}</span>
                  </div>
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Budget Goal</span>
                    <span className={styles.previewStatValue}>{formatCurrency(budget, currency)}</span>
                  </div>
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Pacing</span>
                    <span className={styles.previewStatValue}>
                      {durationDays > 0 ? formatCurrency(budget / durationDays, currency) : '$0'}/day
                    </span>
                  </div>
                </div>

                <div className={styles.previewFootnote}>
                  💡 Submitting creates a customizable 3-panel interactive playground with draggable destination nodes and activity library.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
