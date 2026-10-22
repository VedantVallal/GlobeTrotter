'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import TripPlayground from '@/components/playground/TripPlayground';
import { tripService } from '@/lib/services';
import styles from '@/components/playground/playground.module.css';

export default function PlaygroundPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTrip() {
      try {
        setLoading(true);
        let loaded = await tripService.getTripById(tripId);
        if (!loaded) {
          // Fallback if tripId isn't found in mock store
          loaded = {
            id: tripId,
            title: 'Golden Goa Escape',
            description: "A 7-day journey through Goa's beaches, heritage churches, and vibrant markets.",
            startDate: '2025-12-01',
            endDate: '2025-12-07',
            budget: 1200,
            currency: 'USD',
            travelers: 2,
            destinations: ['Goa', 'Mumbai'],
          };
        }
        setTrip(loaded);
      } catch (err) {
        console.error('Failed to load trip for playground:', err);
        setError('Could not load trip data. Please return to trips.');
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--gt-bg, #f8fafc)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles
            size={32}
            color="#2563eb"
            className={styles.spinningIcon}
            style={{ margin: '0 auto 12px' }}
          />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gt-text-primary, #0f172a)' }}>
            Loading Visual Playground...
          </h3>
          <p style={{ fontSize: 13, color: 'var(--gt-text-secondary, #64748b)', marginTop: 4 }}>
            Preparing canvas, itinerary tree, and AI copilot workspace
          </p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--gt-bg, #f8fafc)',
        padding: 20,
      }}>
        <div style={{
          maxWidth: 400,
          textAlign: 'center',
          background: '#ffffff',
          padding: 24,
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}>
          <AlertCircle size={32} color="#dc2626" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            Trip Workspace Error
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 16px' }}>
            {error || 'Unable to locate requested trip.'}
          </p>
          <Link href="/trips" style={{ textDecoration: 'none' }}>
            <Button variant="primary">
              <ArrowLeft size={14} />
              <span>Back to My Trips</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <TripPlayground trip={trip} />;
}
