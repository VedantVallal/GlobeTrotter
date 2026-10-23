'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Plus,
  Check,
  Sparkles,
  ArrowRight,
  Globe,
  Clock,
  Compass,
  AlertCircle,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { mockCities } from '@/lib/data/mockCities';
import citiesData from '@/lib/data/citiesData.json';
import { tripService, playgroundService, itineraryService } from '@/lib/services';
import { generateBlankManualTripPlan } from '@/lib/services/tripGenerator';
import styles from './create-trip.module.css';

export default function CreateTripPage() {
  const router = useRouter();

  // Workflow Inputs matching PDF Page 1
  const [destination, setDestination] = useState('Pune');
  const [destinationInput, setDestinationInput] = useState('Pune');
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [startDate, setStartDate] = useState('2026-10-29');
  const [endDate, setEndDate] = useState('2026-11-03');
  const [travelers, setTravelers] = useState(2);
  const [friendsRole, setFriendsRole] = useState('Friends');

  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [tripmates, setTripmates] = useState(['You']);

  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState('');

  const destRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (destRef.current && !destRef.current.contains(e.target)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate total days & validate date order
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) {
      setDateError('');
      return 1;
    }
    const s = new Date(startDate);
    const e = new Date(endDate);

    if (e < s) {
      setDateError('End date cannot precede the start date.');
      return 0;
    }

    setDateError('');
    const diffTime = Math.abs(e - s);
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  // Autocomplete suggestions
  const destinationSuggestions = useMemo(() => {
    if (!destinationInput.trim() || destinationInput.length < 2) return [];
    const q = destinationInput.toLowerCase();
    const matches = citiesData
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 5);

    if (matches.length > 0) return matches;
    return mockCities
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 5);
  }, [destinationInput]);

  const handleSelectCity = (city) => {
    setDestination(city.name);
    setDestinationInput(city.name);
    setShowDestDropdown(false);
  };

  const handleAddInvite = (e) => {
    e.preventDefault();
    if (inviteEmail.trim() && !tripmates.includes(inviteEmail.trim())) {
      setTripmates([...tripmates, inviteEmail.trim()]);
      setInviteEmail('');
      setShowInviteInput(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (dateError || calculatedDays <= 0) return;

    const chosenDest = destination.trim() || 'Pune';
    setLoading(true);

    try {
      // Find destination details for rich cover image
      const matchedCity = citiesData.find((c) => c.name.toLowerCase() === chosenDest.toLowerCase());
      const coverImage = matchedCity?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&fit=crop';

      // 1. Create Trip Record
      const newTrip = await tripService.create({
        title: `Trip to ${chosenDest}`,
        destination: chosenDest,
        destinations: [chosenDest],
        startLocation: `${chosenDest}, India`,
        startDate,
        endDate,
        travelers: Number(travelers) || 2,
        budget: 50000,
        currency: 'INR',
        coverImage,
        tripmates,
      });

      // 2. Generate Structured Blank Itinerary Days & Base Canvas Nodes for Manual Planning
      const plan = generateBlankManualTripPlan({
        tripId: newTrip.id,
        startLocation: `${chosenDest}, India`,
        destinations: [chosenDest],
        budget: 50000,
        currency: 'INR',
        startDate,
        endDate,
        travelers: Number(travelers) || 2,
      });

      // 3. Persist Itinerary and Nodes
      await Promise.all([
        playgroundService.saveNodes(newTrip.id, plan.nodes),
        itineraryService.saveItinerary(newTrip.id, plan.itineraryDays),
      ]);

      // 4. Open Main Trip Planning Interface
      router.push(`/itinerary/${newTrip.id}`);
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
          { label: 'Plan a New Trip' },
        ]}
      />

      <main className={styles.planNewTripContainer}>
        <div className={styles.planNewTripCard}>
          <h1 className={styles.cardTitle}>Plan a new trip</h1>

          {/* Where to Input */}
          <div className={styles.fieldGroup} ref={destRef}>
            <label className={styles.fieldLabel} htmlFor="where-to-input">
              Where to?
            </label>
            <div className={styles.whereToInputBox}>
              <input
                id="where-to-input"
                type="text"
                className={styles.whereToInput}
                placeholder="Where to? (e.g. Pune, Goa, Tokyo)"
                value={destinationInput}
                onChange={(e) => {
                  setDestinationInput(e.target.value);
                  setDestination(e.target.value);
                  setShowDestDropdown(true);
                }}
                onFocus={() => setShowDestDropdown(true)}
              />
              <button
                type="button"
                className={styles.whereToAddBtn}
                onClick={() => setShowDestDropdown((prev) => !prev)}
                title="Browse popular cities"
              >
                <Plus size={18} />
              </button>

              {showDestDropdown && destinationSuggestions.length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {destinationSuggestions.map((city) => (
                    <div
                      key={city.id}
                      className={styles.autocompleteItem}
                      onClick={() => handleSelectCity(city)}
                    >
                      <strong>{city.name}</strong>
                      <span style={{ color: 'var(--gt-text-muted)', fontSize: 12 }}>
                        {city.state ? `${city.state}, ` : ''}{city.country}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dates Selection */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Dates (optional)</label>
            <div className={styles.datesRow}>
              <div className={styles.dateInputBox}>
                <Calendar size={16} color="#64748b" />
                <input
                  type="date"
                  className={styles.dateInput}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-label="Start date"
                />
              </div>

              <div className={styles.dateInputBox}>
                <Calendar size={16} color="#64748b" />
                <input
                  type="date"
                  className={styles.dateInput}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="End date"
                />
              </div>
            </div>

            {calculatedDays > 0 && !dateError && (
              <div className={styles.daysCountBadge}>
                <Clock size={12} />
                <span>{calculatedDays} days itinerary</span>
              </div>
            )}

            {dateError && (
              <div className={styles.dateErrorMessage}>
                <AlertCircle size={13} style={{ display: 'inline', marginRight: 4 }} />
                {dateError}
              </div>
            )}
          </div>

          {/* Invite Tripmates */}
          <div className={styles.tripmatesRow}>
            {!showInviteInput ? (
              <button
                type="button"
                className={styles.inviteBtn}
                onClick={() => setShowInviteInput(true)}
              >
                <Plus size={14} />
                <span>Invite tripmates</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddInvite}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
            )}

            <div className={styles.friendsSelectBox}>
              <Users size={14} color="#64748b" />
              <select
                className={styles.friendsSelect}
                value={friendsRole}
                onChange={(e) => setFriendsRole(e.target.value)}
              >
                <option value="Friends">Friends ▾</option>
                <option value="Family">Family ▾</option>
                <option value="Solo">Solo ▾</option>
                <option value="Colleagues">Colleagues ▾</option>
              </select>
            </div>
          </div>

          {/* Start Planning CTA */}
          <button
            type="button"
            className={styles.startPlanningBtn}
            onClick={handleSubmit}
            disabled={loading || !!dateError || calculatedDays <= 0}
          >
            {loading ? (
              <span>Preparing Itinerary...</span>
            ) : (
              <>
                <span>Start planning</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <Link href="/trips" className={styles.guideSublink}>
            Or write a new guide
          </Link>
        </div>
      </main>
    </div>
  );
}
