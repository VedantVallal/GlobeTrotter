'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Calendar,
  DollarSign,
  Route as RouteIcon,
} from 'lucide-react';
import { getCity } from '@/lib/data/mockCities';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';

const CARTO_DARK_MATTER = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Safe dynamic loader for MapLibre GL
async function loadMapLibre() {
  const mod = await import('maplibre-gl');
  try {
    await import('maplibre-gl/dist/maplibre-gl.css');
  } catch (e) {}
  const lib = mod.Map ? mod : (mod.default || mod);
  if (typeof window !== 'undefined' && typeof lib.setWorkerUrl === 'function') {
    lib.setWorkerUrl(`${window.location.origin}/maplibre-gl-worker.mjs`);
  }
  return lib;
}

export default function AtlasMap({ trips = [], onSelectTrip }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedPinTrip, setSelectedPinTrip] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Derive all geographic points from trips
  const tripPoints = useMemo(() => {
    const points = [];
    trips.forEach((trip, index) => {
      // Gather cities from stops or destinations
      const cityList = trip.stops && trip.stops.length > 0
        ? trip.stops.map(s => getCity(s)).filter(Boolean)
        : (trip.destinations || []).map(d => getCity(d)).filter(Boolean);

      // If no cities matched from names, extract fallback coords based on title/dest
      if (cityList.length === 0) {
        if (trip.title?.toLowerCase().includes('goa')) {
          cityList.push({ name: 'Goa', coordinates: { lat: 15.2993, lng: 74.124 } });
        } else if (trip.title?.toLowerCase().includes('paris') || trip.title?.toLowerCase().includes('europe')) {
          cityList.push({ name: 'Paris', coordinates: { lat: 48.8566, lng: 2.3522 } });
        } else if (trip.title?.toLowerCase().includes('tokyo') || trip.title?.toLowerCase().includes('japan')) {
          cityList.push({ name: 'Tokyo', coordinates: { lat: 35.6762, lng: 139.6503 } });
        } else if (trip.title?.toLowerCase().includes('rajasthan')) {
          cityList.push({ name: 'Jaipur', coordinates: { lat: 26.9124, lng: 75.7873 } });
        }
      }

      cityList.forEach((city, cIndex) => {
        if (city?.coordinates?.lat && city?.coordinates?.lng) {
          const colors = [
            { pin: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', name: 'cyan' },
            { pin: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', name: 'purple' },
            { pin: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', name: 'emerald' },
            { pin: '#f97316', glow: 'rgba(249, 115, 22, 0.45)', name: 'orange' },
          ];
          const colorTheme = colors[(index + cIndex) % colors.length];

          points.push({
            tripId: trip.id,
            tripTitle: trip.title,
            tripCover: trip.coverImage,
            tripDates: trip.startDate && trip.endDate ? formatDateRange(trip.startDate, trip.endDate) : 'Upcoming',
            budget: trip.budget || 1200,
            cityName: city.name,
            lat: city.coordinates.lat,
            lng: city.coordinates.lng,
            color: colorTheme.pin,
            glow: colorTheme.glow,
            status: trip.status || 'planning',
          });
        }
      });
    });
    return points;
  }, [trips]);

  // Initialize MapLibre
  useEffect(() => {
    let isMounted = true;
    let map = null;

    async function initMap() {
      if (!mapContainerRef.current) return;
      try {
        const maplibregl = await loadMapLibre();
        if (!isMounted || !mapContainerRef.current) return;

        map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: CARTO_DARK_MATTER,
          center: [25.0, 28.0],
          zoom: 2.1,
          pitch: 18,
          bearing: 0,
          attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

        map.on('load', () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;
          setMapLoaded(true);

          // Render Neon Connecting Flight Routes
          renderFlightRoutes(map, tripPoints);
        });
      } catch (err) {
        console.error('Failed to init Atlas Dark Matter map:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (map) map.remove();
    };
  }, []);

  // Draw connecting neon arc routes between stops of each trip
  function renderFlightRoutes(map, points) {
    if (!map || points.length < 2) return;

    // Group points by tripId
    const tripGroups = {};
    points.forEach((p) => {
      if (!tripGroups[p.tripId]) tripGroups[p.tripId] = [];
      tripGroups[p.tripId].push(p);
    });

    const features = [];
    Object.values(tripGroups).forEach((group) => {
      if (group.length >= 2) {
        const coords = group.map((p) => [p.lng, p.lat]);
        features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coords,
          },
          properties: {
            tripId: group[0].tripId,
            color: group[0].color,
          },
        });
      }
    });

    if (features.length === 0) return;

    if (map.getSource('trip-routes')) {
      map.getSource('trip-routes').setData({
        type: 'FeatureCollection',
        features,
      });
      return;
    }

    map.addSource('trip-routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    });

    // Glowing wider blur line
    map.addLayer({
      id: 'trip-routes-glow',
      type: 'line',
      source: 'trip-routes',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#06b6d4',
        'line-width': 4,
        'line-opacity': 0.35,
        'line-blur': 3,
      },
    });

    // Sharp dotted flight line
    map.addLayer({
      id: 'trip-routes-line',
      type: 'line',
      source: 'trip-routes',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#38bdf8',
        'line-width': 2,
        'line-dasharray': [2, 2],
        'line-opacity': 0.85,
      },
    });
  }

  // Render Vibrant Custom Neon Markers
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    import('maplibre-gl').then((mod) => {
      const maplibregl = mod.Map ? mod : (mod.default || mod);

      tripPoints.forEach((point) => {
        const el = document.createElement('div');
        el.className = 'atlas-neon-marker';
        el.style.width = '34px';
        el.style.height = '34px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.borderRadius = '50%';
        el.style.background = '#0a0a0a';
        el.style.border = `2.5px solid ${point.color}`;
        el.style.boxShadow = `0 0 16px ${point.glow}, 0 0 32px ${point.color}40`;
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = 'translate3d(0,0,0)';

        el.innerHTML = `
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${point.color};
            box-shadow: 0 0 8px ${point.color};
          "></div>
        `;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.25) translateY(-4px)';
          el.style.boxShadow = `0 0 24px ${point.color}, 0 0 40px ${point.color}80`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1) translateY(0)';
          el.style.boxShadow = `0 0 16px ${point.glow}, 0 0 32px ${point.color}40`;
        });

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedPinTrip(point);
          map.flyTo({
            center: [point.lng, point.lat],
            zoom: Math.max(map.getZoom(), 4.5),
            duration: 1200,
            essential: true,
          });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([point.lng, point.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    });
  }, [mapLoaded, tripPoints]);

  const handleFitWorld = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [25.0, 25.0],
      zoom: 2.1,
      duration: 1200,
    });
    setSelectedPinTrip(null);
  };

  const handleFocusPoint = (pt) => {
    if (!mapInstanceRef.current) return;
    setSelectedPinTrip(pt);
    mapInstanceRef.current.flyTo({
      center: [pt.lng, pt.lat],
      zoom: 5,
      duration: 1400,
      essential: true,
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? 'calc(100vh - 80px)' : '480px',
        borderRadius: isFullscreen ? '0' : '1.5rem',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#0a0a0a',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        transition: 'height 0.3s ease',
      }}
    >
      {/* Top Map Control Bar */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Left Badge */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            background: 'rgba(26, 26, 31, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#06b6d4',
              boxShadow: '0 0 10px #06b6d4',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Atlas Live World Map
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            {tripPoints.length} Pinned Stops
          </span>
        </div>

        {/* Right Actions */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handleFitWorld}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              background: 'rgba(26, 26, 31, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Compass size={14} color="#06b6d4" />
            <span>Reset View</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              background: 'rgba(26, 26, 31, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Map Container Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Quick Select Bottom Pill Carousel */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          pointerEvents: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {tripPoints.slice(0, 6).map((pt, idx) => (
          <button
            key={`${pt.tripId}-${pt.cityName}-${idx}`}
            type="button"
            onClick={() => handleFocusPoint(pt)}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              background: selectedPinTrip?.tripId === pt.tripId && selectedPinTrip?.cityName === pt.cityName
                ? '#1e1e24'
                : 'rgba(26, 26, 31, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '9999px',
              border: selectedPinTrip?.tripId === pt.tripId && selectedPinTrip?.cityName === pt.cityName
                ? `1px solid ${pt.color}`
                : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: pt.color,
                boxShadow: `0 0 8px ${pt.color}`,
              }}
            />
            <span>{pt.cityName}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>({pt.tripTitle})</span>
          </button>
        ))}
      </div>

      {/* Selected Trip Popup Card */}
      {selectedPinTrip && (
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: 16,
            zIndex: 20,
            width: '320px',
            background: '#1a1a1f',
            border: `1px solid ${selectedPinTrip.color}40`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: `0 16px 36px rgba(0, 0, 0, 0.6), 0 0 24px ${selectedPinTrip.glow}`,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {selectedPinTrip.tripCover && (
            <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
              <img
                src={selectedPinTrip.tripCover}
                alt={selectedPinTrip.tripTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, #1a1a1f 100%)',
                }}
              />
              <button
                type="button"
                onClick={() => setSelectedPinTrip(null)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MapPin size={13} color={selectedPinTrip.color} />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: selectedPinTrip.color }}>
                {selectedPinTrip.cityName}
              </span>
            </div>

            <h4
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: 6,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              {selectedPinTrip.tripTitle}
            </h4>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 12,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} /> {selectedPinTrip.tripDates}
              </span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>
                {formatCurrency(selectedPinTrip.budget)}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Link
                href={`/trips/${selectedPinTrip.tripId}/playground`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: '#6366f1',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Sparkles size={13} />
                <span>Playground</span>
              </Link>

              <Link
                href={`/trips/${selectedPinTrip.tripId}/budget`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <DollarSign size={13} />
                <span>Budget</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
