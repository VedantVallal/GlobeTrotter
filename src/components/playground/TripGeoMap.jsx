'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Compass,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Plus,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Route,
  Calendar,
  X,
} from 'lucide-react';
import { resolveNodeGeo } from './playgroundTypes';
import styles from './playground.module.css';

// Free high-performance basemap styles (No API key needed)
const MAP_STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
};

// Safe dynamic loader for MapLibre GL across ESM/bundler environments
async function loadMapLibre() {
  const mod = await import('maplibre-gl');
  try {
    await import('maplibre-gl/dist/maplibre-gl.css');
  } catch (e) {
    // Ignore CSS import errors if already loaded
  }
  const lib = mod.Map ? mod : (mod.default || mod);

  // Configure local Web Worker for Turbopack & Next.js compatibility
  if (typeof window !== 'undefined' && typeof lib.setWorkerUrl === 'function') {
    const workerPath = `${window.location.origin}/maplibre-gl-worker.mjs`;
    lib.setWorkerUrl(workerPath);
  }

  return lib;
}

// Haversine distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Bearing angle in degrees between two coordinates (for directional arrow orientation)
function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(radLat2);
  const x =
    Math.cos(radLat1) * Math.sin(radLat2) -
    Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(dLon);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export default function TripGeoMap({
  nodes = [],
  selectedNodeId = null,
  onSelectNode,
  onOpenAddModal,
  isMiniMap = false,
  onToggleExpand,
  onCloseMiniMap,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const arrowMarkersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeStyle, setActiveStyle] = useState('light');
  const [showRouteLine, setShowRouteLine] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');

  // Compute resolved geo-coordinates dynamically for all nodes in playground
  const geoNodes = useMemo(() => {
    return (nodes || [])
      .map((node) => {
        const coords = resolveNodeGeo(node, nodes);
        return {
          ...node,
          coords, // { lat, lng }
        };
      })
      .filter((n) => n.coords && typeof n.coords.lat === 'number' && typeof n.coords.lng === 'number');
  }, [nodes]);

  // Chronologically ordered stops for route calculation
  const routeStops = useMemo(() => {
    return [...geoNodes].sort((a, b) => {
      const dayA = a.dayNumber || 1;
      const dayB = b.dayNumber || 1;
      if (dayA !== dayB) return dayA - dayB;
      return (a.order || 0) - (b.order || 0);
    });
  }, [geoNodes]);

  // Extract available day numbers for interactive day selector
  const availableDays = useMemo(() => {
    const daysSet = new Set();
    geoNodes.forEach((n) => {
      if (n.dayNumber) daysSet.add(Number(n.dayNumber));
    });
    return Array.from(daysSet).sort((a, b) => a - b);
  }, [geoNodes]);

  // Filtered route stops according to selected day (enables "route of the day")
  const activeRouteStops = useMemo(() => {
    if (selectedDay === 'all') return routeStops;
    return routeStops.filter((s) => Number(s.dayNumber || 1) === Number(selectedDay));
  }, [routeStops, selectedDay]);

  // Distance calculation for active route
  const totalRouteStats = useMemo(() => {
    let dist = 0;
    for (let i = 0; i < activeRouteStops.length - 1; i++) {
      const c1 = activeRouteStops[i].coords;
      const c2 = activeRouteStops[i + 1].coords;
      dist += calculateDistanceKm(c1.lat, c1.lng, c2.lat, c2.lng);
    }
    return {
      distanceKm: dist,
      stopsCount: activeRouteStops.length,
    };
  }, [activeRouteStops]);

  // Initialize MapLibre GL
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const maplibregl = await loadMapLibre();

      if (isCancelled || mapInstanceRef.current) return;

      // Determine initial center and bounds
      const firstCoords = geoNodes[0]?.coords || { lat: 18.5204, lng: 73.8567 };

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLES[activeStyle] || MAP_STYLES.light,
        center: [firstCoords.lng, firstCoords.lat],
        zoom: isMiniMap ? 7 : 9,
        attributionControl: false,
      });

      if (!isMiniMap) {
        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
      }

      // ResizeObserver to smoothly resize map when panels open/close
      const ro = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.resize();
        }
      });
      if (mapContainerRef.current) {
        ro.observe(mapContainerRef.current);
      }

      map.on('error', (e) => {
        console.debug('MapLibre notice:', e?.error?.message || e);
      });

      map.on('load', () => {
        if (!isCancelled) {
          mapInstanceRef.current = map;
          setMapLoaded(true);
          map.resize();
        }
      });

      return () => {
        isCancelled = true;
        ro.disconnect();
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }

    const cleanupPromise = initMap();

    return () => {
      isCancelled = true;
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, [isMiniMap]);

  // Update Route Polyline Layer on Map
  const updateRouteLayer = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const coordinates = activeRouteStops.map((s) => [s.coords.lng, s.coords.lat]);
    const hasEnoughCoords = coordinates.length >= 2;

    const geojsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: hasEnoughCoords ? coordinates : [],
      },
    };

    if (map.getSource('route-line-source')) {
      map.getSource('route-line-source').setData(geojsonData);
    } else {
      map.addSource('route-line-source', {
        type: 'geojson',
        data: geojsonData,
      });

      map.addLayer({
        id: 'route-line-glow',
        type: 'line',
        source: 'route-line-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#93c5fd',
          'line-width': isMiniMap ? 3 : 6,
          'line-opacity': 0.6,
        },
      });

      map.addLayer({
        id: 'route-line-core',
        type: 'line',
        source: 'route-line-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': isMiniMap ? 2.5 : 3.5,
          'line-dasharray': [2, 1],
        },
      });
    }

    // Toggle layer visibility
    if (map.getLayer('route-line-core')) {
      map.setLayoutProperty('route-line-core', 'visibility', showRouteLine && hasEnoughCoords ? 'visible' : 'none');
    }
    if (map.getLayer('route-line-glow')) {
      map.setLayoutProperty('route-line-glow', 'visibility', showRouteLine && hasEnoughCoords ? 'visible' : 'none');
    }
  }, [mapLoaded, activeRouteStops, showRouteLine, isMiniMap]);

  // Render & Update HTML Stop Markers and Directional Route Arrows
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    async function syncMarkers() {
      const maplibregl = await loadMapLibre();

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Clear existing arrow markers
      arrowMarkersRef.current.forEach((m) => m.remove());
      arrowMarkersRef.current = [];

      // 1. Render Stop Markers with Step Numbers
      geoNodes.forEach((node) => {
        const isSelected = node.id === selectedNodeId;
        const isCurrentDay = selectedDay === 'all' || Number(node.dayNumber || 1) === Number(selectedDay);

        // Find step index in activeRouteStops
        const stepIndex = activeRouteStops.findIndex((s) => s.id === node.id);
        const stepBadgeNumber = stepIndex >= 0 ? stepIndex + 1 : (node.dayNumber ? `D${node.dayNumber}` : '');

        // Create custom HTML element for marker
        const el = document.createElement('div');
        el.className = `${styles.mapMarker} ${isSelected ? styles.mapMarkerSelected : ''} ${!isCurrentDay ? styles.mapMarkerDimmed : ''} ${styles[`mapMarker_${node.type}`] || ''}`;
        el.setAttribute('title', `${node.title} (${node.type || 'place'})`);

        // Badge content
        const dayLabel = node.dayNumber ? `Day ${node.dayNumber}` : '';
        const timeLabel = node.time ? `${node.time}` : '';
        const priceLabel = node.estimatedCost
          ? (node.currency === 'INR' || (!node.currency && Number(node.estimatedCost) > 500)
              ? `₹${Number(node.estimatedCost).toLocaleString('en-IN')}`
              : `$${node.estimatedCost}`)
          : '';

        const subParts = [dayLabel, timeLabel, priceLabel].filter(Boolean).join(' • ');

        el.innerHTML = `
          <div class="${styles.mapMarkerPin}">
            ${stepBadgeNumber ? `<span class="${styles.mapMarkerStepBadge}">${stepBadgeNumber}</span>` : ''}
            <span class="${styles.mapMarkerDot}"></span>
            <div class="${styles.mapMarkerPopup}">
              <span class="${styles.mapMarkerTitle}">${node.title}</span>
              ${subParts ? `<span class="${styles.mapMarkerSub}">${subParts}</span>` : ''}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectNode?.(node.id);
        });

        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat([node.coords.lng, node.coords.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // 2. Render Directional Route Arrows along consecutive stops for clear route flow
      if (showRouteLine && activeRouteStops.length >= 2) {
        for (let i = 0; i < activeRouteStops.length - 1; i++) {
          const s1 = activeRouteStops[i];
          const s2 = activeRouteStops[i + 1];

          // Midpoint of segment
          const midLng = (s1.coords.lng + s2.coords.lng) / 2;
          const midLat = (s1.coords.lat + s2.coords.lat) / 2;

          // Bearing angle
          const bearing = calculateBearing(s1.coords.lat, s1.coords.lng, s2.coords.lat, s2.coords.lng);

          const arrowEl = document.createElement('div');
          arrowEl.className = styles.routeArrowMarker;
          arrowEl.setAttribute('title', `Route: ${s1.title} → ${s2.title}`);

          arrowEl.innerHTML = `
            <div class="${styles.routeArrowBadge}" style="transform: rotate(${Math.round(bearing)}deg)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          `;

          const arrowMarker = new maplibregl.Marker({
            element: arrowEl,
            anchor: 'center',
          })
            .setLngLat([midLng, midLat])
            .addTo(map);

          arrowMarkersRef.current.push(arrowMarker);
        }
      }

      // Update route line
      updateRouteLayer();
    }

    syncMarkers();
  }, [mapLoaded, geoNodes, activeRouteStops, selectedNodeId, selectedDay, showRouteLine, onSelectNode, updateRouteLayer]);

  // Pan / Fly-to when selected node changes in playground
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !selectedNodeId) return;

    const selected = geoNodes.find((n) => n.id === selectedNodeId);
    if (selected && selected.coords) {
      map.flyTo({
        center: [selected.coords.lng, selected.coords.lat],
        zoom: Math.max(map.getZoom(), isMiniMap ? 8 : 11),
        duration: 800,
        essential: true,
      });
    }
  }, [selectedNodeId, geoNodes, mapLoaded, isMiniMap]);

  // Handle Day Switch & Smooth zoom to Day stops
  const handleSelectDay = (day) => {
    setSelectedDay(day);
    if (!mapInstanceRef.current || !mapLoaded) return;

    const stopsForDay = day === 'all'
      ? geoNodes
      : geoNodes.filter((n) => Number(n.dayNumber || 1) === Number(day));

    if (stopsForDay.length > 0) {
      async function fitDay() {
        const maplibregl = await loadMapLibre();
        const bounds = new maplibregl.LngLatBounds();
        stopsForDay.forEach((n) => bounds.extend([n.coords.lng, n.coords.lat]));
        mapInstanceRef.current.fitBounds(bounds, {
          padding: isMiniMap ? 25 : 90,
          maxZoom: 13.5,
          duration: 800,
        });
      }
      fitDay();
    }
  };

  // Fit bounds helper
  const handleFitAllStops = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || geoNodes.length === 0) return;

    async function fit() {
      const maplibregl = await loadMapLibre();
      const bounds = new maplibregl.LngLatBounds();
      geoNodes.forEach((n) => bounds.extend([n.coords.lng, n.coords.lat]));
      map.fitBounds(bounds, {
        padding: isMiniMap ? 30 : 80,
        maxZoom: 13,
        duration: 1000,
      });
    }
    fit();
  }, [mapLoaded, geoNodes, isMiniMap]);

  // Auto-fit on initial load
  useEffect(() => {
    if (mapLoaded && geoNodes.length > 0) {
      handleFitAllStops();
    }
  }, [mapLoaded, handleFitAllStops]);

  return (
    <div
      className={`${styles.geoMapRoot} ${isMiniMap ? styles.geoMapMini : styles.geoMapFull}`}
      aria-label="Interactive Geographic Route Map"
    >
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className={styles.geoMapContainer} />

      {/* Interactive Route of the Day Selector Bar */}
      {!isMiniMap && availableDays.length > 0 && (
        <div className={styles.mapDayFilterBar}>
          <button
            type="button"
            className={`${styles.mapDayFilterBtn} ${selectedDay === 'all' ? styles.mapDayFilterBtnActive : ''}`}
            onClick={() => handleSelectDay('all')}
          >
            All Route ({routeStops.length})
          </button>
          {availableDays.map((d) => {
            const count = geoNodes.filter((n) => Number(n.dayNumber || 1) === d).length;
            return (
              <button
                key={d}
                type="button"
                className={`${styles.mapDayFilterBtn} ${selectedDay === d ? styles.mapDayFilterBtnActive : ''}`}
                onClick={() => handleSelectDay(d)}
              >
                Day {d} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* Mini-Map Header & Expand Controls */}
      {isMiniMap ? (
        <div className={styles.miniMapHeader}>
          <div className={styles.miniMapTitle}>
            <Compass size={13} color="var(--gt-blue, #2563eb)" />
            <span>Route Map</span>
          </div>
          <div className={styles.miniMapActions}>
            <button
              type="button"
              className={styles.miniMapHeaderBtn}
              onClick={onToggleExpand}
              title="Expand to Full Map View"
            >
              <Maximize2 size={12} />
            </button>
            {onCloseMiniMap && (
              <button
                type="button"
                className={styles.miniMapHeaderBtn}
                onClick={onCloseMiniMap}
                title="Close Mini-Map"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Full Map Mode HUD Floating Controls */
        <>
          {/* Top Route Stats Pill */}
          <div className={styles.mapRouteStatsPill}>
            <div className={styles.mapRouteStatsIcon}>
              <Route size={14} />
            </div>
            <div className={styles.mapRouteStatsText}>
              <span>
                <strong>{totalRouteStats.stopsCount} Stops</strong> {selectedDay === 'all' ? 'across journey' : `on Day ${selectedDay}`}
              </span>
              {totalRouteStats.distanceKm > 0 && (
                <span className={styles.mapRouteDistance}>
                  • ~{totalRouteStats.distanceKm} km route
                </span>
              )}
            </div>
          </div>

          {/* Map Controls Toolbar */}
          <div className={styles.mapControlsToolbar}>
            <button
              type="button"
              className={styles.mapControlBtn}
              onClick={handleFitAllStops}
              title="Fit All Journey Stops in View"
            >
              <Maximize2 size={14} />
            </button>

            <button
              type="button"
              className={`${styles.mapControlBtn} ${showRouteLine ? styles.mapControlBtnActive : ''}`}
              onClick={() => setShowRouteLine((prev) => !prev)}
              title={showRouteLine ? 'Hide Route Line' : 'Show Route Line'}
            >
              <Navigation size={14} />
            </button>

            <button
              type="button"
              className={`${styles.mapControlBtn} ${activeStyle === 'voyager' ? styles.mapControlBtnActive : ''}`}
              onClick={() => {
                const next = activeStyle === 'light' ? 'voyager' : 'light';
                setActiveStyle(next);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setStyle(MAP_STYLES[next]);
                }
              }}
              title="Toggle Map Visual Style"
            >
              <Layers size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
