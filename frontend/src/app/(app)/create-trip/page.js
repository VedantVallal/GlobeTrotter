'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Plus,
  X,
  Check,
  Sparkles,
  ArrowRight,
  Globe,
  Wand2,
  Edit3,
  Clock,
  Compass,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionHeader from '@/components/layout/SectionHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { mockCities } from '@/lib/data/mockCities';
import { tripService, playgroundService, itineraryService } from '@/lib/services';
import { generateSynchronizedTripPlan } from '@/lib/services/tripGenerator';
import { calculateDays } from '@/lib/utils/formatters';
import styles from './create-trip.module.css';

const PREFERENCE_OPTIONS = [
  'Beach', 'Adventure', 'Food',
  'Culture', 'Nature', 'Shopping',
  'History', 'Nightlife', 'Relaxation',
];

const POPULAR_DEPARTURE_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Kolkata', 'Hyderabad', 'Ahmedabad', 'Chennai',
];

const POPULAR_DESTINATIONS = [
  'Goa', 'Jaipur', 'Manali', 'Udaipur', 'Agra', 'Kerala', 'Varanasi', 'Dubai',
];

const QUICK_BUDGET_OPTIONS = [
  { label: '₹25,000', value: 25000, tag: 'Budget' },
  { label: '₹50,000', value: 50000, tag: 'Popular' },
  { label: '₹1,00,000', value: 100000, tag: 'Explorer' },
  { label: '₹2,50,000', value: 250000, tag: 'Luxury' },
];

export default function CreateTripPage() {
  const router = useRouter();

  // 1. Departure City
  const [startLocation, setStartLocation] = useState('Mumbai, India');
  const [departureSearch, setDepartureSearch] = useState('Mumbai, India');
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);

  // 2. Destination Stops
  const [destinationInput, setDestinationInput] = useState('');
  const [destinations, setDestinations] = useState(['Goa']);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // 3. Trip Basics & Timing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&fit=crop'
  );

  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [travelers, setTravelers] = useState(2);

  // 4. Budget in Rupees (INR)
  const [budget, setBudget] = useState(50000);
  const [currency, setCurrency] = useState('INR');

  // 5. Itinerary Generation Mode
  const [itineraryMode, setItineraryMode] = useState('ai'); // 'ai' | 'custom'

  // Preferences
  const [selectedPreferences, setSelectedPreferences] = useState(['Beach', 'Relaxation']);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const departureRef = useRef(null);
  const destRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (departureRef.current && !departureRef.current.contains(e.target)) {
        setShowDepartureDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Duration in days
  const durationDays = useMemo(() => {
    return calculateDays(startDate, endDate) || 5;
  }, [startDate, endDate]);

  // Autocomplete suggestions for Departure City
  const departureSuggestions = useMemo(() => {
    if (!departureSearch.trim() || departureSearch.length < 2) return [];
    const q = departureSearch.toLowerCase();
    return mockCities
      .filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
      .slice(0, 5);
  }, [departureSearch]);

  // Autocomplete suggestions for Destination Stops
  const destinationSuggestions = useMemo(() => {
    if (!destinationInput.trim() || destinationInput.length < 2) return [];
    const q = destinationInput.toLowerCase();
    return mockCities
      .filter((c) => c.name.toLowerCase().includes(q) && !destinations.includes(c.name))
      .slice(0, 5);
  }, [destinationInput, destinations]);

  const handleSelectDeparture = (cityName, country = 'India') => {
    const formatted = `${cityName}, ${country}`;
    setStartLocation(formatted);
    setDepartureSearch(formatted);
    setShowDepartureDropdown(false);
  };

  const addDestination = (cityName) => {
    const trimmed = cityName.trim();
    if (trimmed && !destinations.includes(trimmed) && destinations.length < 10) {
      setDestinations([...destinations, trimmed]);
      setDestinationInput('');
      setShowDestDropdown(false);
    }
  };

  const removeDestination = (cityName) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((d) => d !== cityName));
    }
  };

  const togglePreference = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  // Form submission: Synchronizes Trip, Playground Nodes, and Itinerary
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!startLocation || startLocation.trim().length < 2) {
      newErrors.startLocation = 'Departure City is required';
    }
    if (destinations.length === 0) {
      newErrors.destinations = 'Please add at least one destination stop';
    }
    if (!startDate || !endDate) {
      newErrors.dates = 'Please select valid start and end dates';
    } else if (new Date(endDate) <= new Date(startDate)) {
      newErrors.dates = 'End date must be after start date';
    }
    if (!budget || Number(budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget in Rupees (₹)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const generatedTitle =
        title.trim() ||
        `${destinations.join(' & ')} Expedition from ${startLocation.split(',')[0]}`;

      // 1. Create Trip Record
      const newTrip = await tripService.createTrip({
        title: generatedTitle,
        startLocation,
        destinations,
        description,
        coverImage,
        startDate,
        endDate,
        travelers: Number(travelers) || 2,
        budget: Number(budget),
        currency: 'INR',
        preferences: selectedPreferences,
        itineraryMode,
      });

      // 2. Generate Fully Synchronized Payload (Nodes + Itinerary Schedule)
      if (itineraryMode === 'ai') {
        const plan = generateSynchronizedTripPlan({
          tripId: newTrip.id,
          startLocation,
          destinations,
          budget: Number(budget),
          currency: 'INR',
          startDate,
          endDate,
          travelers: Number(travelers) || 2,
          preferences: selectedPreferences,
        });

        // Synchronize both stores simultaneously
        await Promise.all([
          playgroundService.saveNodes(newTrip.id, plan.nodes),
          itineraryService.saveItinerary(newTrip.id, plan.itineraryDays),
        ]);
      } else {
        // Custom Mode: Minimal Departure + Destination Hierarchy for user manual building
        const minimalNodes = [
          {
            id: `node-dept-${newTrip.id}`,
            type: 'city',
            parentId: null,
            tripId: newTrip.id,
            title: `${startLocation.split(',')[0]} (Departure)`,
            description: `Departure point on ${startDate}.`,
            order: 0,
            dayNumber: 1,
            time: '08:00 AM',
            estimatedCost: 0,
            currency: 'INR',
            category: 'Transport',
            x: 100,
            y: 180,
          },
          ...destinations.map((dest, i) => ({
            id: `node-dest-${i}-${newTrip.id}`,
            type: 'city',
            parentId: `node-dept-${newTrip.id}`,
            tripId: newTrip.id,
            title: dest,
            description: `Destination stop ${i + 1}`,
            order: i + 1,
            dayNumber: 1,
            time: '11:00 AM',
            estimatedCost: Math.round(Number(budget) / destinations.length),
            currency: 'INR',
            category: 'Destination',
            x: 380,
            y: 180 + i * 180,
          })),
        ];

        const minimalItineraryDays = [
          {
            day: 1,
            date: startDate,
            title: `Day 1: Journey from ${startLocation.split(',')[0]} to ${destinations[0]}`,
            location: destinations[0],
            activities: [
              {
                id: `node-dept-${newTrip.id}`,
                time: '08:00 AM',
                name: `Departure from ${startLocation.split(',')[0]}`,
                category: 'Transport',
                duration: 180,
                cost: 0,
                location: startLocation,
              },
            ],
          },
        ];

        await Promise.all([
          playgroundService.saveNodes(newTrip.id, minimalNodes),
          itineraryService.saveItinerary(newTrip.id, minimalItineraryDays),
        ]);
      }

      // Seamless redirect to Interactive Playground
      router.push(`/playground/${newTrip.id}`);
    } catch (err) {
      console.error('Failed to create synchronized trip', err);
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
          subtitle="Configure your departure, destination stops, budget in Rupees, and synchronized AI itinerary"
        />

        <div className={styles.layoutSplit}>
          {/* Left Column: Form */}
          <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
            {/* Step 1: Route & Stops */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>1</div>
                <h2 className={styles.stepTitle}>Route & Destination Stops</h2>
              </div>

              {/* Departure City (Mandatory) */}
              <div ref={departureRef} style={{ position: 'relative' }}>
                <Input
                  id="trip-departure-city"
                  label="Departure City *"
                  placeholder="e.g. Mumbai, Delhi, Bengaluru..."
                  value={departureSearch}
                  onChange={(e) => {
                    setDepartureSearch(e.target.value);
                    setStartLocation(e.target.value);
                    setShowDepartureDropdown(true);
                  }}
                  onFocus={() => setShowDepartureDropdown(true)}
                  leftIcon={<MapPin size={16} color="var(--gt-blue, #2563eb)" />}
                  error={errors.startLocation}
                  required
                />

                {/* Autocomplete Dropdown for Departure */}
                {showDepartureDropdown && departureSuggestions.length > 0 && (
                  <div className={styles.autocompleteDropdown}>
                    {departureSuggestions.map((city) => (
                      <div
                        key={city.id}
                        className={styles.autocompleteItem}
                        onClick={() => handleSelectDeparture(city.name, city.country)}
                      >
                        <strong>{city.name}</strong>
                        <span style={{ color: 'var(--gt-text-muted)', fontSize: 12 }}>
                          {city.state ? `${city.state}, ` : ''}{city.country}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Departure City Pills */}
                <div className={styles.quickPillsRow}>
                  <span className={styles.quickPillLabel}>Popular Departures:</span>
                  {POPULAR_DEPARTURE_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={styles.quickCityPill}
                      onClick={() => handleSelectDeparture(c, 'India')}
                    >
                      <MapPin size={10} />
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Stops */}
              <div ref={destRef} style={{ position: 'relative', marginTop: 8 }}>
                <Input
                  id="trip-destination-input"
                  label="Add Destination Stops *"
                  placeholder="Search and add destination stops (e.g. Goa, Jaipur, Manali)..."
                  value={destinationInput}
                  onChange={(e) => {
                    setDestinationInput(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDestination(destinationInput);
                    }
                  }}
                  leftIcon={<Globe size={16} color="var(--gt-blue, #2563eb)" />}
                  error={errors.destinations}
                />

                {/* Autocomplete Dropdown for Destination */}
                {showDestDropdown && destinationSuggestions.length > 0 && (
                  <div className={styles.autocompleteDropdown}>
                    {destinationSuggestions.map((city) => (
                      <div
                        key={city.id}
                        className={styles.autocompleteItem}
                        onClick={() => addDestination(city.name)}
                      >
                        <div>
                          <strong>{city.name}</strong>
                          <span style={{ color: 'var(--gt-text-muted)', fontSize: 12, marginLeft: 8 }}>
                            {city.state ? `${city.state}, ` : ''}{city.country}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--gt-blue, #2563eb)', fontWeight: 600 }}>
                          + Add Stop
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Destination Pills */}
                <div className={styles.quickPillsRow}>
                  <span className={styles.quickPillLabel}>Quick Add:</span>
                  {POPULAR_DESTINATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={styles.quickCityPill}
                      onClick={() => addDestination(d)}
                    >
                      <Plus size={10} />
                      <span>{d}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Destination Tag Chips */}
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gt-text-secondary)', display: 'block', marginBottom: 4 }}>
                    Journey Sequence ({destinations.length} Stops):
                  </label>
                  <div className={styles.tagsWrapper}>
                    {destinations.map((dest, idx) => (
                      <span key={dest} className={styles.tagChip}>
                        <span style={{ opacity: 0.7, fontSize: 10 }}>Stop {idx + 1}:</span>
                        <strong>{dest}</strong>
                        <button
                          type="button"
                          onClick={() => removeDestination(dest)}
                          className={styles.tagRemoveBtn}
                          aria-label={`Remove ${dest}`}
                          title={destinations.length === 1 ? 'Minimum 1 destination required' : 'Remove stop'}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trip Title & Description (Optional) */}
              <div style={{ marginTop: 8 }}>
                <Input
                  id="trip-title"
                  label="Trip Title (Optional)"
                  placeholder={`e.g. ${destinations.join(' & ')} Expedition from ${startLocation.split(',')[0]}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                />
              </div>
            </div>

            {/* Step 2: Budget in Rupees (INR) */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>2</div>
                <h2 className={styles.stepTitle}>Budget in Rupees (₹ INR)</h2>
              </div>

              <div>
                <Input
                  id="trip-budget-rupees"
                  label="Target Trip Budget (in Rupees ₹) *"
                  type="number"
                  min="1000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  leftIcon={<span style={{ fontWeight: 700, fontSize: 16 }}>₹</span>}
                  error={errors.budget}
                  required
                />

                {/* Quick Rupee Budget Chips */}
                <div className={styles.budgetChipsRow}>
                  {QUICK_BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`${styles.budgetChip} ${budget === opt.value ? styles.budgetChipActive : ''}`}
                      onClick={() => setBudget(opt.value)}
                    >
                      <span>{opt.label}</span>
                      <span style={{ fontSize: 10, opacity: 0.7 }}>({opt.tag})</span>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gt-text-muted)' }}>
                  Selected Budget: <strong style={{ color: 'var(--gt-blue, #2563eb)' }}>₹{Number(budget).toLocaleString('en-IN')}</strong> (~₹{Math.round(Number(budget) / durationDays).toLocaleString('en-IN')} / day)
                </div>
              </div>
            </div>

            {/* Step 3: Itinerary Creation Mode */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>3</div>
                <h2 className={styles.stepTitle}>Itinerary Creation Mode</h2>
              </div>

              <div className={styles.itineraryChoiceGrid}>
                {/* AI Automatic Generation Card */}
                <div
                  className={`${styles.itineraryChoiceCard} ${itineraryMode === 'ai' ? styles.itineraryChoiceCardActive : ''}`}
                  onClick={() => setItineraryMode('ai')}
                >
                  <div className={styles.itineraryChoiceHeader}>
                    <div className={styles.itineraryChoiceIcon}>
                      <Wand2 size={18} />
                    </div>
                    <span className={styles.itineraryChoiceBadge}>Recommended</span>
                  </div>
                  <div className={styles.itineraryChoiceTitle}>
                    Automatic AI Itinerary Generation
                  </div>
                  <div className={styles.itineraryChoiceDesc}>
                    AI will automatically generate a synchronized day-by-day plan with departure timing, morning-to-night slots, attractions, dining, stays, and budget in ₹.
                  </div>
                </div>

                {/* Custom / Manual Itinerary Card */}
                <div
                  className={`${styles.itineraryChoiceCard} ${itineraryMode === 'custom' ? styles.itineraryChoiceCardActive : ''}`}
                  onClick={() => setItineraryMode('custom')}
                >
                  <div className={styles.itineraryChoiceHeader}>
                    <div className={styles.itineraryChoiceIcon} style={{ background: '#f1f5f9', color: '#475569' }}>
                      <Edit3 size={18} />
                    </div>
                  </div>
                  <div className={styles.itineraryChoiceTitle}>
                    Custom / Manual Workspace
                  </div>
                  <div className={styles.itineraryChoiceDesc}>
                    Start with an open canvas with your Departure City & Destination stops ready, allowing you to handcraft every node, time slot, and activity.
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Dates & Travelers */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>4</div>
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--gt-bg-alt, #f8fafc)', borderRadius: 'var(--gt-radius-md, 8px)' }}>
                <span style={{ fontSize: '13px', color: 'var(--gt-text-secondary)' }}>Duration:</span>
                <strong style={{ color: 'var(--gt-blue, #2563eb)', fontSize: '14px' }}>
                  {durationDays} Days ({durationDays > 1 ? durationDays - 1 : 0} Nights)
                </strong>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gt-text-primary)', display: 'block', marginBottom: 6 }}>
                  Number of Travelers:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    style={{ width: 36, height: 36, borderRadius: '8px', border: '1px solid var(--gt-border)', background: 'var(--gt-surface)', cursor: 'pointer', fontSize: 18 }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 600, fontSize: '16px', minWidth: 32, textAlign: 'center' }}>
                    {travelers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravelers(travelers + 1)}
                    style={{ width: 36, height: 36, borderRadius: '8px', border: '1px solid var(--gt-border)', background: 'var(--gt-surface)', cursor: 'pointer', fontSize: 18 }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '13px', color: 'var(--gt-text-muted)' }}>
                    {travelers === 1 ? 'Solo Adventurer' : `${travelers} Travelers`}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 5: Travel Preferences */}
            <div className={styles.stepGroup}>
              <div className={styles.stepHeader}>
                <div className={styles.stepCircle}>5</div>
                <h2 className={styles.stepTitle}>Travel Styles & Vibes</h2>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--gt-border)' }}>
              <Link href="/dashboard" style={{ fontSize: '14px', color: 'var(--gt-text-secondary)', textDecoration: 'none' }}>
                Cancel
              </Link>

              <Button type="submit" variant="primary" size="lg" loading={loading}>
                <Sparkles size={16} />
                <span>
                  {itineraryMode === 'ai' ? 'Create Trip & AI Itinerary' : 'Create Custom Workspace'}
                </span>
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
                  alt="Trip Preview"
                  className={styles.previewImage}
                />
                <div className={styles.previewBadge}>
                  {itineraryMode === 'ai' ? 'AI Sync Active' : 'Custom Canvas'}
                </div>
              </div>

              <div className={styles.previewBody}>
                <div className={styles.previewTripTitle}>
                  {title || `${destinations.join(' & ')} Expedition`}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: '11px', color: 'var(--gt-text-muted)', textTransform: 'uppercase' }}>
                    Route:
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gt-text-primary)' }}>
                    {startLocation} → {destinations.join(' → ')}
                  </div>
                </div>

                <div className={styles.previewStatsGrid}>
                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Budget</span>
                    <span className={styles.previewStatValue}>
                      ₹{Number(budget).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Duration</span>
                    <span className={styles.previewStatValue}>{durationDays} Days</span>
                  </div>

                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Mode</span>
                    <span className={styles.previewStatValue} style={{ fontSize: 13, color: 'var(--gt-blue, #2563eb)' }}>
                      {itineraryMode === 'ai' ? 'AI Generation' : 'Manual'}
                    </span>
                  </div>

                  <div className={styles.previewStatItem}>
                    <span className={styles.previewStatLabel}>Travelers</span>
                    <span className={styles.previewStatValue}>{travelers}</span>
                  </div>
                </div>

                <div className={styles.previewFootnote}>
                  {itineraryMode === 'ai'
                    ? 'All nodes, map pins, day numbers, and time slots will be automatically synchronized with your budget in Rupees (₹).'
                    : 'A clean canvas with your Departure City and Destinations will be prepared for you to add custom nodes.'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
