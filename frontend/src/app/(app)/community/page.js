'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Star,
  Copy,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Share2,
  Check,
  Plus,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/Button';
import { tripService, playgroundService } from '@/lib/services';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from './community.module.css';

const LIKETREK_COLLECTIONS = [
  { id: 'all', label: 'All Curated Routes', count: '48 Trips', icon: '✨', tagClass: styles.tagGradientBlue },
  { id: 'rainy', label: 'Rainy day, indoors', count: '18 Spots', icon: '🌧️', tagClass: styles.tagGradientBlue },
  { id: 'coffee', label: 'Coffee worth crossing town for', count: '24 Spots', icon: '☕', tagClass: styles.tagGradientOrange },
  { id: 'midnight', label: 'Midnight food & hidden alleys', count: '31 Spots', icon: '🍜', tagClass: styles.tagGradientPurple },
  { id: 'brutalist', label: 'Architectural gems & forts', count: '15 Spots', icon: '🏛️', tagClass: styles.tagGradientGreen },
];

const INITIAL_COMMUNITY_TRIPS = [
  {
    id: 'community-trip-1',
    title: 'Rainy Day Bookstores & Cozy Cafes in London',
    collectionId: 'rainy',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      role: 'Staff Explorer',
    },
    publishedDate: '2 days ago',
    coverImage: 'https://images.unsplash.com/photo-1507842229452-7b0f69f706fa?w=800&fit=crop',
    tag: 'Rainy day, indoors',
    tagClass: styles.tagGradientBlue,
    durationDays: 4,
    budget: 950,
    rating: 4.9,
    reviewsCount: 42,
    clonesCount: 312,
    stops: ['Daunt Books Marylebone', 'Word on the Water', 'Bar Italia Soho', 'British Museum Library'],
    description: 'When it pours, London comes alive with historic high-ceiling reading rooms, antique canal barges, and steaming flat whites.',
  },
  {
    id: 'community-trip-2',
    title: 'Coffee Worth Crossing the Entire City For',
    collectionId: 'coffee',
    author: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      role: 'Barista & Q-Grader',
    },
    publishedDate: '4 days ago',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&fit=crop',
    tag: 'Coffee worth crossing town for',
    tagClass: styles.tagGradientOrange,
    durationDays: 3,
    budget: 680,
    rating: 5.0,
    reviewsCount: 88,
    clonesCount: 520,
    stops: ['Fuglen Tokyo', 'About Life Coffee Brewers', 'Koffee Mameya Kakeru', 'Glitch Coffee Jinbocho'],
    description: 'A curated pilgrimage across Tokyo roasteries specializing in single-origin geisha pour-overs and siphon tastings.',
  },
  {
    id: 'community-trip-3',
    title: 'Midnight Ramen & Underground Izakaya Run',
    collectionId: 'midnight',
    author: {
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
      role: 'Night Crawler',
    },
    publishedDate: '1 week ago',
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&fit=crop',
    tag: 'Midnight food',
    tagClass: styles.tagGradientPurple,
    durationDays: 5,
    budget: 1100,
    rating: 4.8,
    reviewsCount: 76,
    clonesCount: 418,
    stops: ['Omoide Yokocho', 'Ichiran Shinjuku', 'Golden Gai Bar 5', 'Tsukiji Outer Market Dawn Run'],
    description: 'For night owls: charcoal yakitori smoke, rich 18-hour tonkotsu broths, and tiny 6-seater subterranean bars.',
  },
  {
    id: 'community-trip-4',
    title: 'Brutalist Forts & Royal Sandstone Palaces',
    collectionId: 'brutalist',
    author: {
      name: 'Aarav Mehta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      role: 'Architectural Historian',
    },
    publishedDate: '5 days ago',
    coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&fit=crop',
    tag: 'Architectural gems',
    tagClass: styles.tagGradientGreen,
    durationDays: 6,
    budget: 840,
    rating: 4.9,
    reviewsCount: 65,
    clonesCount: 284,
    stops: ['Chand Baori Stepwell', 'Mehrangarh Clifftop Fort', 'Jantar Mantar Observatories', 'Umaid Bhawan'],
    description: 'Dramatic geometry, monumental stone carvings, and gravity-defying fortress walls towering over Rajasthan.',
  },
  {
    id: 'community-trip-5',
    title: 'Secret North Goa & Coastal Backwaters',
    collectionId: 'all',
    author: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      role: 'Goa Resident',
    },
    publishedDate: '1 week ago',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&fit=crop',
    tag: 'Coastal Sanctuary',
    tagClass: styles.tagGradientBlue,
    durationDays: 6,
    budget: 780,
    rating: 4.8,
    reviewsCount: 54,
    clonesCount: 395,
    stops: ['Mandrem Beach', 'Morjim Olive Ridley Sanctuary', 'Fontainhas Heritage Quarter', 'Chapora Cliff Sunset'],
    description: 'Avoid tourist traps: tranquil cliffside beaches, Portuguese pastel streets, and authentic coastal thalis.',
  },
  {
    id: 'community-trip-6',
    title: 'Kyoto Zen Temples & Bamboo Forest Dawn Trail',
    collectionId: 'all',
    author: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      role: 'Slow Travel Curator',
    },
    publishedDate: '2 weeks ago',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&fit=crop',
    tag: 'Zen Heritage',
    tagClass: styles.tagGradientGreen,
    durationDays: 7,
    budget: 1350,
    rating: 5.0,
    reviewsCount: 92,
    clonesCount: 460,
    stops: ['Gion Machiya District', 'Fushimi Inari Torii Gates', 'Arashiyama Bamboo Grove', 'Kinkaku-ji'],
    description: 'Early morning tranquility before the city stirs: matcha tastings, silent zen moss gardens, and mountain views.',
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cloningId, setCloningId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const filteredTrips = useMemo(() => {
    return INITIAL_COMMUNITY_TRIPS.filter((trip) => {
      // Collection filter
      if (selectedCollection !== 'all' && trip.collectionId !== selectedCollection) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          trip.title.toLowerCase().includes(q) ||
          trip.description.toLowerCase().includes(q) ||
          trip.stops.some((s) => s.toLowerCase().includes(q)) ||
          trip.tag.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedCollection, searchQuery]);

  // Clone to My Playground action
  const handleCloneToPlayground = async (trip) => {
    try {
      setCloningId(trip.id);

      // Create new trip in user account
      const newTrip = await tripService.createTrip({
        title: `${trip.title} (Cloned)`,
        description: trip.description,
        coverImage: trip.coverImage,
        budget: trip.budget,
        currency: 'USD',
        startDate: '2026-11-15',
        endDate: '2026-11-22',
        destinations: trip.stops.slice(0, 3),
        travelers: 2,
        status: 'planning',
      });

      // Seed initial playground nodes for the cloned trip
      const rootId = `root-${newTrip.id}`;
      const clonedNodes = [
        {
          id: rootId,
          type: 'root',
          parentId: null,
          tripId: newTrip.id,
          title: newTrip.title,
          description: trip.description,
          duration: `${trip.durationDays} days`,
          estimatedCost: trip.budget,
          x: 100,
          y: 200,
        },
      ];

      trip.stops.forEach((stop, index) => {
        const stopId = `node-stop-${Date.now()}-${index}`;
        clonedNodes.push({
          id: stopId,
          type: index === 0 ? 'city' : 'destination',
          parentId: rootId,
          tripId: newTrip.id,
          title: stop,
          description: `Curated stop from ${trip.author.name}'s verified community collection`,
          dayNumber: Math.min(index + 1, trip.durationDays),
          duration: '3 hours',
          estimatedCost: Math.round(trip.budget / trip.stops.length),
          category: 'Sightseeing',
          x: 420 + (index % 2) * 40,
          y: 100 + index * 110,
        });
      });

      await playgroundService.saveNodes(newTrip.id, clonedNodes);

      setToastMessage(`Cloned "${trip.title}"! Launching Playground...`);

      setTimeout(() => {
        router.push(`/trips/${newTrip.id}/playground`);
      }, 900);
    } catch (err) {
      console.error('Failed to clone trip:', err);
      setToastMessage('Failed to clone trip. Please try again.');
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className={styles.communityRoot}>
      <Header breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Community Collections' }]} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <PageContainer>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            <Bookmark size={13} />
            <span>Liketrek Verified Community Collections</span>
          </div>

          <h1 className={styles.heroTitle}>Discover & Clone Community Itineraries</h1>
          <p className={styles.heroSubtitle}>
            Explore hyper-specific, high-taste travel collections curated by authentic travelers.
            One-click clone to your Obsidian Trip Playground to remix, budget, and optimize with AI.
          </p>

          <div className={styles.searchFilterBar}>
            <div className={styles.searchRow}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search collections, cafes, hidden viewpoints, ramen bars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 24px',
              background: '#1a1a1f',
              border: '1px solid #6366f1',
              borderRadius: '9999px',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <CheckCircle2 size={16} color="#34d399" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageContainer>
        <div className={styles.layoutContainer}>
          {/* Liketrek Left Collections Sidebar */}
          <aside className={styles.collectionsSidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarTitle}>
                <span>Collections Hub</span>
                <Bookmark size={14} color="#6366f1" />
              </div>

              <div className={styles.collectionList}>
                {LIKETREK_COLLECTIONS.map((col) => {
                  const isActive = selectedCollection === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedCollection(col.id)}
                      className={`${styles.collectionItem} ${isActive ? styles.collectionItemActive : ''}`}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{col.icon}</span>
                        <span>{col.label}</span>
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: isActive ? '#a5b4fc' : 'rgba(255, 255, 255, 0.4)',
                          fontWeight: 700,
                        }}
                      >
                        {col.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Community Stats Card */}
            <div className={styles.sidebarCard} style={{ background: '#141418' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Users size={16} color="#38bdf8" />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>Open Collaboration</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.45, marginBottom: 14 }}>
                All itineraries are CC-licensed. Cloned trips link directly to your offline IndexedDB cache and Supabase DB.
              </p>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>
                ✓ Zero-API-Cost Keyless Google Maps Ready
              </div>
            </div>
          </aside>

          {/* Right Main Grid */}
          <main>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>
                  {LIKETREK_COLLECTIONS.find((c) => c.id === selectedCollection)?.label || 'All Routes'}
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)' }}>
                  Showing {filteredTrips.length} itineraries with verified budgets and routes.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => router.push('/create-trip')}
                icon={<Plus size={15} />}
              >
                Publish Journey
              </Button>
            </div>

            <div className={styles.communityGrid}>
              {filteredTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  className={styles.tripCard}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <div className={styles.cardMedia}>
                    <img src={trip.coverImage} alt={trip.title} className={styles.cardImg} />
                    <div className={styles.cardOverlay} />
                    <div className={`${styles.vibeBadge} ${trip.tagClass}`}>
                      {trip.tag}
                    </div>
                    <div className={styles.budgetBadge}>
                      {formatCurrency(trip.budget)}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.authorRow}>
                      <img src={trip.author.avatar} alt={trip.author.name} className={styles.authorAvatar} />
                      <div>
                        <div className={styles.authorName}>{trip.author.name}</div>
                        <div className={styles.authorRole}>{trip.author.role} • {trip.publishedDate}</div>
                      </div>
                    </div>

                    <h3 className={styles.cardTitle}>{trip.title}</h3>
                    <p className={styles.cardDesc}>{trip.description}</p>

                    <div className={styles.stopsRow}>
                      <MapPin size={13} color="#06b6d4" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trip.stops.join(' → ')}
                      </span>
                    </div>

                    <div className={styles.metaRow}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} color="#fbbf24" fill="#fbbf24" />
                        <span style={{ fontWeight: 700, color: '#ffffff' }}>{trip.rating}</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>({trip.reviewsCount})</span>
                      </span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Copy size={12} color="#a855f7" />
                        <span>{trip.clonesCount} Clones</span>
                      </span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} />
                        <span>{trip.durationDays} Days</span>
                      </span>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        onClick={() => handleCloneToPlayground(trip)}
                        disabled={cloningId === trip.id}
                        className={styles.cloneBtn}
                        title="Clone entire node tree to your Playground"
                      >
                        <Sparkles size={14} />
                        <span>{cloningId === trip.id ? 'Cloning Tree...' : 'Clone to My Playground'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCloneToPlayground(trip)}
                        className={styles.viewDetailsBtn}
                      >
                        <ExternalLink size={13} />
                        <span>Remix</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </PageContainer>
    </div>
  );
}
