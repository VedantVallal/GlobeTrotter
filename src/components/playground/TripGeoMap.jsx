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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeStyle, setActiveStyle] = useState('light');
  const [showRouteLine, setShowRouteLine] = useState(true);

  // Compute resolved geo-coordinates for all nodes
  const geoNodes = useMemo(() => {
    return nodes
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

  // Total distance calculation
  const totalRouteStats = useMemo(() => {
    let dist = 0;
    for (let i = 0; i < routeStops.length - 1; i++) {
      const c1 = routeStops[i].coords;
      const c2 = routeStops[i + 1].coords;
      dist += calculateDistanceKm(c1.lat, c1.lng, c2.lat, c2.lng);
    }
    return {
      distanceKm: dist,
      stopsCount: routeStops.length,
    };
  }, [routeStops]);

  // Initialize MapLibre
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const maplibregl = await loadMapLibre();

      if (isCancelled || mapInstanceRef.current) return;

      // Determine initial center and bounds
      const firstCoords = geoNodes[0]?.coords || { lat: 15.2993, lng: 74.124 };

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
        // Prevent unhandled map tile or network notices from breaking the component
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

  // Update Route Polyline Layer
  const updateRouteLayer = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || routeStops.length < 2) return;

    const coordinates = routeStops.map((s) => [s.coords.lng, s.coords.lat]);

    const geojsonData = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
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
          'line-opacity': 0.5,
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
          'line-width': isMiniMap ? 2 : 3,
          'line-dasharray': [2, 1.5],
        },
      });
    }

    // Toggle layer visibility
    if (map.getLayer('route-line-core')) {
      map.setLayoutProperty('route-line-core', 'visibility', showRouteLine ? 'visible' : 'none');
    }
    if (map.getLayer('route-line-glow')) {
      map.setLayoutProperty('route-line-glow', 'visibility', showRouteLine ? 'visible' : 'none');
    }
  }, [mapLoaded, routeStops, showRouteLine, isMiniMap]);

  // Render & Update HTML Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    async function syncMarkers() {
      const maplibregl = await loadMapLibre();

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      geoNodes.forEach((node) => {
        const isSelected = node.id === selectedNodeId;
        const isCity = node.type === 'city';

        // Create custom HTML element for marker
        const el = document.createElement('div');
        el.className = `${styles.mapMarker} ${isSelected ? styles.mapMarkerSelected : ''} ${styles[`mapMarker_${node.type}`]}`;
        el.setAttribute('title', `${node.title} (${node.type})`);

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
            <span class="${styles.mapMarkerDot}"></span>
            <div class="${styles.mapMarkerPopup}">
              <span class="${styles.mapMarkerTitle}">${node.title}</span>
              ${subParts ? `<span class="${styles.mapMarkerSub}">${subParts}</span>` : ''}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectNode(node.id);
        });

        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat([node.coords.lng, node.coords.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Update route line
      updateRouteLayer();
    }

    syncMarkers();
  }, [mapLoaded, geoNodes, selectedNodeId, onSelectNode, updateRouteLayer]);

  // Pan / Fly-to when selected node changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !selectedNodeId) return;

    const selected = geoNodes.find((n) => n.id === selectedNodeId);
    if (selected && selected.coords) {
      map.flyTo({
        center: [selected.coords.lng, selected.coords.lat],
        zoom: Math.max(map.getZoom(), isMiniMap ? 8 : 11),
        duration: 900,
        essential: true,
      });
    }
  }, [selectedNodeId, geoNodes, mapLoaded, isMiniMap]);

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
                <strong>{totalRouteStats.stopsCount} Stops</strong> across journey
              </span>
              {totalRouteStats.distanceKm > 0 && (
                <span className={styles.mapRouteDistance}>
                  • ~{totalRouteStats.distanceKm} km total route
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
