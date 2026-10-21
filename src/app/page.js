'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  MapPin,
  ArrowRight,
  Compass,
  Layers,
  Calendar,
  DollarSign,
  Share2,
  Sparkles,
  Plane,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import styles from './page.module.css';

const PRESETS = [
  {
    id: 'amalfi',
    name: '01 Amalfi Coast Odyssey',
    region: 'Italy',
    duration: '6 Days • 5 Nights',
    budget: '$1,850',
    nodes: [
      {
        stop: 'Stop 01',
        city: 'Positano',
        country: 'Italy',
        dates: 'May 14 – 16',
        cost: '$240/day',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&fit=crop',
        activities: ['Cliffside Walk', 'Ferry to Capri', 'Lemon Grove Dining'],
      },
      {
        stop: 'Stop 02',
        city: 'Ravello',
        country: 'Italy',
        dates: 'May 16 – 18',
        cost: '$190/day',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&fit=crop',
        activities: ['Villa Rufolo Gardens', 'Chamber Music Festival'],
      },
      {
        stop: 'Stop 03',
        city: 'Amalfi Town',
        country: 'Italy',
        dates: 'May 18 – 20',
        cost: '$160/day',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&fit=crop',
        activities: ['Cathedral of St. Andrew', 'Paper Mill Museum', 'Limoncello Tasting'],
      },
    ],
  },
  {
    id: 'goa',
    name: '02 Golden Goa Coastline',
    region: 'India',
    duration: '7 Days • 6 Nights',
    budget: '$1,200',
    nodes: [
      {
        stop: 'Stop 01',
        city: 'Calangute',
        country: 'India',
        dates: 'Nov 10 – 12',
        cost: '$65/day',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&fit=crop',
        activities: ['Sunrise Beach Stroll', 'Water Scooter Tour', 'Seafood Shack'],
      },
      {
        stop: 'Stop 02',
        city: 'Old Goa',
        country: 'India',
        dates: 'Nov 12 – 14',
        cost: '$45/day',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&fit=crop',
        activities: ['Bom Jesus Basilica', 'Spice Plantation', 'Mandovi Cruise'],
      },
      {
        stop: 'Stop 03',
        city: 'Palolem',
        country: 'India',
        dates: 'Nov 14 – 17',
        cost: '$70/day',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&fit=crop',
        activities: ['Dolphin Spotting', 'Butterfly Beach Kayak', 'Silent Disco'],
      },
    ],
  },
  {
    id: 'kyoto',
    name: '03 Kyoto Cultural Drift',
    region: 'Japan',
    duration: '5 Days • 4 Nights',
    budget: '$1,600',
    nodes: [
      {
        stop: 'Stop 01',
        city: 'Gion',
        country: 'Japan',
        dates: 'Oct 04 – 06',
        cost: '$180/day',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&fit=crop',
        activities: ['Tea Ceremony', 'Traditional Ryokan', 'Lantern Alley Walk'],
      },
      {
        stop: 'Stop 02',
        city: 'Arashiyama',
        country: 'Japan',
        dates: 'Oct 06 – 07',
        cost: '$140/day',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&fit=crop',
        activities: ['Bamboo Grove Dawn Walk', 'Tenryu-ji Temple', 'Monkey Park'],
      },
      {
        stop: 'Stop 03',
        city: 'Fushimi',
        country: 'Japan',
        dates: 'Oct 07 – 09',
        cost: '$130/day',
        image: 'https://images.unsplash.com/photo-1478436127897-769e00d2c715?w=600&fit=crop',
        activities: ['10,000 Torii Gates Trail', 'Sake Brewery Tasting', 'Kiyomizu Sunset'],
      },
    ],
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [activePreset, setActivePreset] = useState(PRESETS[1]); // Default Goa
  const [fromLocation, setFromLocation] = useState('Mumbai, IN');
  const [toLocation, setToLocation] = useState('Goa, IN');

  const handleQuickLaunch = (e) => {
    e.preventDefault();
    const dest = toLocation.trim() || 'Goa';
    router.push(`/create-trip?destination=${encodeURIComponent(dest)}`);
  };

  return (
    <div className={styles.pageRoot}>
      {/* Subtle architectural contour and map grid */}
      <div className={styles.topoGrid} />
      <div className={styles.ambientSunGlow} />

      {/* Navigation Bar */}
      <header className={styles.navbar}>
        <Link href="/" className={styles.brandLink}>
          <div className={styles.brandSymbol}>
            <Globe size={18} color="#ffffff" />
          </div>
          <div>
            <span className={styles.brandWordmark}>GlobeTrotter</span>
            <span className={styles.brandTag}>Atelier</span>
          </div>
        </Link>

        <nav className={styles.navLinks}>
          <a href="#interactive-canvas" className={styles.navItem}>Interactive Canvas</a>
          <a href="#architecture" className={styles.navItem}>Features</a>
          <a href="#destinations" className={styles.navItem}>Curated Stops</a>
          <Link href="/trips" className={styles.navItem}>Browse Public Trips</Link>
        </nav>

        <div className={styles.navAuthGroup}>
          <Link href="/login" className={styles.signInBtn}>
            Sign in
          </Link>
          <Link href="/dashboard" className={styles.launchAppBtn}>
            <span>Open Studio</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.topPill}>
          <Compass size={14} />
          <span>Visual Journey Architecture • No Spreadsheets</span>
        </div>

        <h1 className={styles.heroHeading}>
          Travel isn’t a spreadsheet. <br />
          Design it as a <span className={styles.accentWord}>living canvas.</span>
        </h1>

        <p className={styles.heroSub}>
          GlobeTrotter turns multi-city expeditions into an interactive node graph.
          Connect your stops, simulate budgets in real time, and sequence activities with surgical precision.
        </p>

        {/* Quick Route Launcher */}
        <form onSubmit={handleQuickLaunch} className={styles.routeLauncher}>
          <div className={styles.launcherInputGroup}>
            <Plane size={16} color="#e55a38" />
            <input
              type="text"
              placeholder="From: Mumbai, London, NYC..."
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className={styles.launcherInput}
            />
          </div>

          <div className={styles.launcherDivider} />

          <div className={styles.launcherInputGroup}>
            <MapPin size={16} color="#3b82f6" />
            <input
              type="text"
              placeholder="To: Goa, Tokyo, Amalfi..."
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className={styles.launcherInput}
            />
          </div>

          <button type="submit" className={styles.launcherSubmitBtn}>
            <span>Craft Journey</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Micro Ticker */}
        <div className={styles.tickerRow}>
          <div className={styles.tickerItem}>
            <span>Route Optimization:</span>
            <strong>Zero Backtracking</strong>
          </div>
          <span>•</span>
          <div className={styles.tickerItem}>
            <span>Live Pacing:</span>
            <strong>Instant Daily Splits</strong>
          </div>
          <span>•</span>
          <div className={styles.tickerItem}>
            <span>Format:</span>
            <strong>Interactive Node Graph</strong>
          </div>
        </div>
      </section>

      {/* Interactive Canvas Workspace Showcase (Live demo toggleable) */}
      <section id="interactive-canvas" className={styles.canvasShowcaseWrapper}>
        {/* Preset Selector */}
        <div className={styles.presetBar}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={`${styles.presetTab} ${activePreset.id === preset.id ? styles.presetTabActive : ''}`}
              onClick={() => setActivePreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Canvas Terminal Window */}
        <div className={styles.canvasFrame}>
          <div className={styles.canvasTopBar}>
            <div className={styles.windowControls}>
              <div className={styles.windowDot} />
              <div className={styles.windowDot} />
              <div className={styles.windowDot} />
            </div>

            <div className={styles.canvasStatsMeta}>
              <span>Blueprint: <strong>{activePreset.name}</strong></span>
              <span>Duration: <strong>{activePreset.duration}</strong></span>
              <span>Estimated: <strong>{activePreset.budget}</strong></span>
            </div>

            <Link
              href="/playground/trip-001"
              style={{
                fontSize: 12,
                color: '#ff8469',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>Inspect in Studio</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className={styles.canvasBoard}>
            {/* Live Interactive Node Cards */}
            <div className={styles.nodeTrack}>
              {activePreset.nodes.map((node, index) => (
                <div key={node.city} className={styles.nodeCard}>
                  <div className={styles.nodeImageWrapper}>
                    <img src={node.image} alt={node.city} className={styles.nodeImage} />
                    <div className={styles.nodeBadgeStop}>{node.stop}</div>
                    <div className={styles.nodeCostTag}>{node.cost}</div>
                  </div>

                  <div className={styles.nodeBody}>
                    <div className={styles.nodeCityName}>
                      {node.city}, {node.country}
                    </div>
                    <div className={styles.nodeDates}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {node.dates}
                    </div>

                    <div className={styles.activityPills}>
                      {node.activities.map((act) => (
                        <span key={act} className={styles.activityPill}>
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Architecture */}
      <section id="architecture" className={styles.bentoSection}>
        <div className={styles.sectionHeadingBlock}>
          <div className={styles.sectionLabel}>The Architecture</div>
          <h2 className={styles.sectionMainTitle}>
            Built like professional design software. Tuned for wanderlust.
          </h2>
        </div>

        <div className={styles.bentoGrid}>
          {/* Bento Card 1: 3-Panel Visual Node Canvas */}
          <div className={`${styles.bentoCard} ${styles.bentoCardSpan8}`}>
            <div>
              <div className={styles.bentoIcon}>
                <Layers size={22} />
              </div>
              <h3 className={styles.bentoTitle}>Interactive 3-Panel Canvas</h3>
              <p className={styles.bentoDesc}>
                Reorder stops like nodes in an architectural graph. Connecting routes are calculated with Bézier curves,
                giving you an instant visual sense of geographic progression and transit overhead.
              </p>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: '16px 20px',
                background: '#0b0c0e',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: 13, color: '#c9cdd8' }}>Node graph reactive state active</span>
              </div>
              <Link
                href="/playground/trip-001"
                style={{ fontSize: 12, color: '#e55a38', fontWeight: 600, textDecoration: 'none' }}
              >
                Test Canvas Live →
              </Link>
            </div>
          </div>

          {/* Bento Card 2: Real-time Budget Pacing */}
          <div className={`${styles.bentoCard} ${styles.bentoCardSpan4}`}>
            <div>
              <div className={`${styles.bentoIcon} ${styles.bentoIconBlue}`}>
                <DollarSign size={22} />
              </div>
              <h3 className={styles.bentoTitle}>What-If Budgeting</h3>
              <p className={styles.bentoDesc}>
                Toggle activities on or off to simulate financial scenarios in real time without losing your baseline plan.
              </p>
            </div>

            <div className={styles.budgetSimBox}>
              <div className={styles.budgetSimRow}>
                <span style={{ color: '#8c909e' }}>Target: $1,200</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>$864 Allocated (72%)</span>
              </div>
              <div className={styles.budgetSimBar}>
                <div className={styles.budgetSimFill} />
              </div>
            </div>
          </div>

          {/* Bento Card 3: Day-by-Day Timeline */}
          <div className={`${styles.bentoCard} ${styles.bentoCardSpan6}`}>
            <div>
              <div className={styles.bentoIcon} style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.25)' }}>
                <Calendar size={22} />
              </div>
              <h3 className={styles.bentoTitle}>Chronological Timelines</h3>
              <p className={styles.bentoDesc}>
                Switch effortlessly from high-level multi-city maps to day-by-day morning, afternoon, and evening hourly agenda slots.
              </p>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              <span style={{ background: '#181b22', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#c9cdd8' }}>
                🌅 09:00 Beach Trail
              </span>
              <span style={{ background: '#181b22', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#c9cdd8' }}>
                ☕ 13:30 Coastal Feast
              </span>
            </div>
          </div>

          {/* Bento Card 4: 1-Click Story Sharing */}
          <div className={`${styles.bentoCard} ${styles.bentoCardSpan6}`}>
            <div>
              <div className={styles.bentoIcon} style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                <Share2 size={22} />
              </div>
              <h3 className={styles.bentoTitle}>Editorial Public Links</h3>
              <p className={styles.bentoDesc}>
                Generate read-only, beautifully formatted travel stories with zero clutter. Share links with travel companions or let others fork your route.
              </p>
            </div>

            <div style={{ marginTop: 20 }}>
              <Link
                href="/share/trip-001"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                <span>Preview Shared Travelogue Spread</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Strip */}
      <section id="destinations" className={styles.destinationStripSection}>
        <div className={styles.sectionHeadingBlock}>
          <div className={styles.sectionLabel}>Curated Destinations</div>
          <h2 className={styles.sectionMainTitle}>
            Start planning with pre-mapped nodes
          </h2>
        </div>

        <div className={styles.destGrid}>
          <Link href="/create-trip?destination=Tokyo" className={styles.destItemCard}>
            <img
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&fit=crop"
              alt="Tokyo"
              className={styles.destItemImage}
            />
            <div className={styles.destItemOverlay} />
            <div className={styles.destItemContent}>
              <div className={styles.destItemTitle}>Tokyo, Japan</div>
              <div className={styles.destItemSub}>Neon alleys & temple serenity</div>
            </div>
          </Link>

          <Link href="/create-trip?destination=Goa" className={styles.destItemCard}>
            <img
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&fit=crop"
              alt="Goa"
              className={styles.destItemImage}
            />
            <div className={styles.destItemOverlay} />
            <div className={styles.destItemContent}>
              <div className={styles.destItemTitle}>Goa, India</div>
              <div className={styles.destItemSub}>Golden beaches & heritage churches</div>
            </div>
          </Link>

          <Link href="/create-trip?destination=Amalfi" className={styles.destItemCard}>
            <img
              src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&fit=crop"
              alt="Amalfi"
              className={styles.destItemImage}
            />
            <div className={styles.destItemOverlay} />
            <div className={styles.destItemContent}>
              <div className={styles.destItemTitle}>Amalfi Coast, Italy</div>
              <div className={styles.destItemSub}>Cliffside pastel villas & turquoise waters</div>
            </div>
          </Link>

          <Link href="/create-trip?destination=Kyoto" className={styles.destItemCard}>
            <img
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&fit=crop"
              alt="Kyoto"
              className={styles.destItemImage}
            />
            <div className={styles.destItemOverlay} />
            <div className={styles.destItemContent}>
              <div className={styles.destItemTitle}>Kyoto, Japan</div>
              <div className={styles.destItemSub}>Ancient bamboo groves & wooden shrines</div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <h2 className={styles.ctaHeading}>Ready to design your next journey?</h2>
        <p className={styles.ctaText}>
          No signup required to test the canvas. Launch the studio, connect your nodes, and see your multi-stop route come alive.
        </p>
        <Link href="/dashboard" className={styles.launchAppBtn} style={{ padding: '14px 28px', fontSize: 15 }}>
          <span>Launch GlobeTrotter Studio</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Globe size={18} color="#e55a38" />
          <strong style={{ color: '#f7f6f2' }}>GlobeTrotter Atelier</strong>
          <span>— Build your journey, node by node.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/dashboard" style={{ color: '#8c909e', textDecoration: 'none' }}>Studio</Link>
          <Link href="/trips" style={{ color: '#8c909e', textDecoration: 'none' }}>Trips</Link>
          <Link href="/login" style={{ color: '#8c909e', textDecoration: 'none' }}>Account</Link>
        </div>
      </footer>
    </div>
  );
}
