'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import TripPlayground from '@/components/playground/TripPlayground';
import { tripService } from '@/lib/services';

export default function TripPlaygroundRoutePage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTrip() {
      try {
        setLoading(true);
        let loaded = await tripService.getTripById(tripId);
        if (!loaded) {
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0a0a',
          color: '#ffffff',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }}>Loading Trip Playground...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0a0a',
          color: '#ffffff',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 440,
            textAlign: 'center',
            padding: 32,
            background: '#1a1a1f',
            borderRadius: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Trip Not Found</h2>
          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)', marginBottom: 20 }}>
            {error || 'Unable to locate this trip.'}
          </p>
          <Link href="/dashboard">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <TripPlayground trip={trip} />;
}
