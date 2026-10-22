'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Compass,
  MapPin,
  Sparkles,
  Plus,
  X,
  Check,
  Layers,
  Globe,
  Bed,
  ExternalLink,
  Navigation,
  Hotel,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { mockCities } from '@/lib/data/mockCities';
import { mockActivities } from '@/lib/data/mockActivities';
import { mockCuratedPlaces, CATEGORIES } from './playgroundTypes';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from './playground.module.css';

function getNearbyStays(cityName = 'Destination') {
  const cleanCity = cityName || 'Goa';
  const staysCatalog = {
    Goa: [
      { id: 'stay-goa-1', name: 'Taj Holiday Village Resort & Spa', type: 'Luxury Resort', minPrice: 8500, maxPrice: 16000, amenities: ['Beachfront', 'Pool', 'Free WiFi', 'Breakfast Included'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop' },
      { id: 'stay-goa-2', name: 'Zostel Goa Morjim Backpackers', type: 'Hostel', minPrice: 1200, maxPrice: 2800, amenities: ['Near Beach', 'Dorm & Private', 'Free WiFi', 'Cafe'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop' },
      { id: 'stay-goa-3', name: 'Alila Diwa Coastal Sanctuary', type: 'Boutique Hotel', minPrice: 6500, maxPrice: 12000, amenities: ['Infinity Pool', 'Paddy Views', 'Spa', 'AC'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop' },
      { id: 'stay-goa-4', name: 'Fontainhas Heritage Portuguese Homestay', type: 'Homestay', minPrice: 2400, maxPrice: 4200, amenities: ['Historic Quarter', 'Balcony', 'Breakfast Included'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop' },
    ],
    Jaipur: [
      { id: 'stay-jpr-1', name: 'Rambagh Palace Heritage Suite', type: 'Heritage Palace', minPrice: 14000, maxPrice: 32000, amenities: ['Royal Grounds', 'Peacocks', 'Butler', 'Spa'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop' },
      { id: 'stay-jpr-2', name: 'Moustache Jaipur Cultural Hostel', type: 'Hostel', minPrice: 900, maxPrice: 1800, amenities: ['Rooftop Cafe', 'Hawa Mahal View', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop' },
      { id: 'stay-jpr-3', name: 'Samode Haveli Boutique Residence', type: 'Boutique Hotel', minPrice: 5800, maxPrice: 11000, amenities: ['Mughal Pool', 'Courtyard Dining', 'AC'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop' },
      { id: 'stay-jpr-4', name: 'Pink City Traditional Homestay', type: 'Homestay', minPrice: 1800, maxPrice: 3200, amenities: ['Family Cooked Meals', 'Terrace', 'Near Transit'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop' },
    ],
    Tokyo: [
      { id: 'stay-tky-1', name: 'Park Hyatt Shinjuku Skyline', type: 'Luxury Hotel', minPrice: 24000, maxPrice: 48000, amenities: ['Mt Fuji View', 'Indoor Pool', 'Bar', 'Metro Access'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop' },
      { id: 'stay-tky-2', name: 'Nui. Hostel & Bar Lounge Asakusa', type: 'Hostel', minPrice: 3200, maxPrice: 6500, amenities: ['Riverside', 'Craft Beer Bar', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop' },
      { id: 'stay-tky-3', name: 'Shibuya Stream Excel Hotel Tokyu', type: 'Boutique Hotel', minPrice: 12000, maxPrice: 22000, amenities: ['Direct Shibuya Access', 'Modern Suites', 'AC'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop' },
      { id: 'stay-tky-4', name: 'Asakusa Ryokan Traditional Homestay', type: 'Ryokan / Homestay', minPrice: 5500, maxPrice: 9500, amenities: ['Tatami Mats', 'Onsen Bath', 'Green Tea Service'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop' },
    ],
  };

  for (const [key, stays] of Object.entries(staysCatalog)) {
    if (cleanCity.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanCity.toLowerCase())) {
      return stays;
    }
  }

  return [
    {
      id: `stay-${cleanCity.toLowerCase().replace(/\s+/g, '-')}-1`,
      name: `${cleanCity} Grand Heritage Resort & Suites`,
      type: 'Boutique Resort',
      minPrice: 3500,
      maxPrice: 7500,
      amenities: ['Panoramic View', 'Pool', 'Breakfast Included', 'Free WiFi'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    },
    {
      id: `stay-${cleanCity.toLowerCase().replace(/\s+/g, '-')}-2`,
      name: `Zostel & Nomad Hostel ${cleanCity}`,
      type: 'Hostel',
      minPrice: 1200,
      maxPrice: 2500,
      amenities: ['Co-Working Lounge', 'Shared Dorms', 'Free WiFi', 'Cafe'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop',
    },
    {
      id: `stay-${cleanCity.toLowerCase().replace(/\s+/g, '-')}-3`,
      name: `${cleanCity} Central City Hotel & Spa`,
      type: 'Hotel',
      minPrice: 2800,
      maxPrice: 5200,
      amenities: ['Near Transit', 'Breakfast Included', 'Gym', 'AC'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    },
    {
      id: `stay-${cleanCity.toLowerCase().replace(/\s+/g, '-')}-4`,
      name: `${cleanCity} Alpine / Valley Eco Homestay`,
      type: 'Homestay',
      minPrice: 1800,
      maxPrice: 3600,
      amenities: ['Home Cooked Meals', 'Scenic Balcony', 'Garden', 'Free Parking'],
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop',
    },
  ];
}

export default function ExplorePanel({
  isOpen,
  onClose,
  existingNodes,
  onAddPlaceToTrip,
  selectedNode,
}) {
  const [activeTab, setActiveTab] = useState('places'); // 'places' | 'stays' | 'activities' | 'cities'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterByContext, setFilterByContext] = useState(true);
  const [manualCityFilter, setManualCityFilter] = useState(null);

  // Auto-enable context filtering when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setFilterByContext(true);
      setManualCityFilter(null);
    }
  }, [selectedNode?.id]);

  // Set of existing titles to show "Added" badge
  const existingTitles = useMemo(() => {
    return new Set(existingNodes.map((n) => n.title.toLowerCase()));
  }, [existingNodes]);

  // Resolve Active Context (City, Area, Trip Cities)
  const activeContext = useMemo(() => {
    const tripCityNodes = existingNodes.filter((n) => n.type === 'city');
    const tripCities = tripCityNodes.map((n) => n.title);

    let cityName = manualCityFilter;
    let areaName = null;
    let nodeTitle = null;
    let nodeType = null;

    if (selectedNode) {
      nodeTitle = selectedNode.title;
      nodeType = selectedNode.type;

      if (selectedNode.type === 'city') {
        cityName = selectedNode.title;
      } else if (selectedNode.type === 'area') {
        areaName = selectedNode.title;
        const parent = existingNodes.find((n) => n.id === selectedNode.parentId);
        cityName = parent?.title || null;
      } else {
        // destination or activity
        const parent = existingNodes.find((n) => n.id === selectedNode.parentId);
        if (parent) {
          if (parent.type === 'area') {
            areaName = parent.title;
            const grandParent = existingNodes.find((n) => n.id === parent.parentId);
            cityName = grandParent?.title || null;
          } else if (parent.type === 'city') {
            cityName = parent.title;
          }
        }
      }

      // Fallback location check
      if (!cityName && selectedNode.location) {
        for (const c of mockCities) {
          if (selectedNode.location.toLowerCase().includes(c.name.toLowerCase())) {
            cityName = c.name;
            break;
          }
        }
      }
    }

    // Default to first city in trip if still null
    if (!cityName && !manualCityFilter && tripCities.length > 0) {
      cityName = tripCities[0];
    }

    return {
      hasSelection: Boolean(selectedNode),
      cityName,
      areaName,
      nodeTitle,
      nodeType,
      tripCities,
    };
  }, [selectedNode, existingNodes, manualCityFilter]);

  // Find rich city data object if current city is known
  const selectedCityData = useMemo(() => {
    if (!activeContext.cityName) return null;
    const lower = activeContext.cityName.toLowerCase();
    return mockCities.find(
      (c) =>
        c.name.toLowerCase() === lower ||
        c.name.toLowerCase().includes(lower) ||
        lower.includes(c.name.toLowerCase())
    ) || null;
  }, [activeContext.cityName]);

  // 1. FILTERED PLACES (Prioritizes selected city & area)
  const { recommendedPlaces, otherPlaces } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const targetCity = activeContext.cityName ? activeContext.cityName.toLowerCase() : null;
    const targetArea = activeContext.areaName ? activeContext.areaName.toLowerCase() : null;

    const matched = mockCuratedPlaces.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.cityName && p.cityName.toLowerCase().includes(q)) ||
        (p.areaName && p.areaName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'All' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });

    if (!targetCity) {
      return { recommendedPlaces: matched, otherPlaces: [] };
    }

    const rec = [];
    const oth = [];

    for (const p of matched) {
      const pCity = (p.cityName || '').toLowerCase();
      const pArea = (p.areaName || '').toLowerCase();

      const isAreaMatch = targetArea && (pArea.includes(targetArea) || targetArea.includes(pArea));
      const isCityMatch = pCity === targetCity || pCity.includes(targetCity) || targetCity.includes(pCity);

      if (isAreaMatch) {
        rec.unshift(p); // exact area match at very top!
      } else if (isCityMatch) {
        rec.push(p);
      } else {
        oth.push(p);
      }
    }

    return { recommendedPlaces: rec, otherPlaces: oth };
  }, [searchQuery, selectedCategory, activeContext]);

  // 2. FILTERED ACTIVITIES (Prioritizes selected city)
  const { recommendedActivities, otherActivities } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const targetCity = activeContext.cityName ? activeContext.cityName.toLowerCase() : null;

    const matched = mockActivities.filter((a) => {
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.cityName && a.cityName.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCategory =
        selectedCategory === 'All' ||
        (a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });

    if (!targetCity) {
      return { recommendedActivities: matched, otherActivities: [] };
    }

    const rec = [];
    const oth = [];

    for (const a of matched) {
      const aCity = (a.cityName || '').toLowerCase();
      const aDesc = (a.description || '').toLowerCase();
      const aName = (a.name || '').toLowerCase();

      const isCityMatch =
        aCity === targetCity ||
        aCity.includes(targetCity) ||
        targetCity.includes(aCity) ||
        aDesc.includes(targetCity) ||
        aName.includes(targetCity);

      if (isCityMatch) {
        rec.push(a);
      } else {
        oth.push(a);
      }
    }

    return { recommendedActivities: rec, otherActivities: oth };
  }, [searchQuery, selectedCategory, activeContext]);

  // 3. FILTERED CITIES & SUB-AREAS
  const { cityAreas, nearbyCities, otherCities } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const targetCity = activeContext.cityName ? activeContext.cityName.toLowerCase() : null;

    const matchedCities = mockCities.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        (c.state && c.state.toLowerCase().includes(q)) ||
        (c.region && c.region.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCategory =
        selectedCategory === 'All' ||
        (c.tags && c.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    });

    // Sub-areas from selected city
    const areas = selectedCityData?.areas || [];

    if (!targetCity) {
      return { cityAreas: [], nearbyCities: [], otherCities: matchedCities };
    }

    const nearby = [];
    const others = [];
    const currentRegion = selectedCityData?.state || selectedCityData?.region || null;

    for (const c of matchedCities) {
      const isCurrent = c.name.toLowerCase() === targetCity;
      if (isCurrent) continue;

      const isSameStateOrRegion =
        currentRegion &&
        (c.state?.toLowerCase() === currentRegion.toLowerCase() ||
          c.region?.toLowerCase() === currentRegion.toLowerCase());

      if (isSameStateOrRegion) {
        nearby.push(c);
      } else {
        others.push(c);
      }
    }

    return { cityAreas: areas, nearbyCities: nearby, otherCities: others };
  }, [searchQuery, selectedCategory, activeContext, selectedCityData]);

  // 4. FILTERED NEARBY STAYS & HOTELS
  const nearbyStays = useMemo(() => {
    const stays = getNearbyStays(activeContext.cityName || 'Goa');
    if (!searchQuery) return stays;
    const q = searchQuery.toLowerCase().trim();
    return stays.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.amenities.some((a) => a.toLowerCase().includes(q))
    );
  }, [activeContext.cityName, searchQuery]);

  // SMART ADD HANDLER: Attach directly to active branch of the visual journey tree
  const handleAddWithSmartParent = (itemData) => {
    let parentId = null;

    if (selectedNode) {
      if (itemData.type === 'activity') {
        if (selectedNode.type === 'destination' || selectedNode.type === 'area') {
          parentId = selectedNode.id;
        } else if (selectedNode.type === 'city') {
          parentId = selectedNode.id;
        }
      } else if (itemData.type === 'stay') {
        if (selectedNode.type === 'city') {
          parentId = selectedNode.id;
        } else {
          const parentCity =
            existingNodes.find((n) => n.id === selectedNode.parentId && n.type === 'city') ||
            existingNodes.find((n) => n.type === 'city');
          parentId = parentCity?.id || selectedNode.id;
        }
      } else if (itemData.type === 'destination') {
        if (selectedNode.type === 'area') {
          parentId = selectedNode.id;
        } else if (selectedNode.type === 'city') {
          // Check if an area under this city matches
          if (itemData.areaName) {
            const matchingArea = existingNodes.find(
              (n) =>
                n.parentId === selectedNode.id &&
                n.type === 'area' &&
                n.title.toLowerCase().includes(itemData.areaName.toLowerCase())
            );
            parentId = matchingArea ? matchingArea.id : selectedNode.id;
          } else {
            parentId = selectedNode.id;
          }
        } else if (selectedNode.type === 'destination') {
          parentId = selectedNode.parentId;
        }
      } else if (itemData.type === 'area') {
        if (selectedNode.type === 'city') {
          parentId = selectedNode.id;
        } else {
          const rootCity = existingNodes.find((n) => n.type === 'city');
          parentId = rootCity?.id || null;
        }
      }
    } else {
      // No selection: attach destination or stay under first area or first city
      if (itemData.type === 'destination') {
        const firstArea = existingNodes.find((n) => n.type === 'area');
        const firstCity = existingNodes.find((n) => n.type === 'city');
        parentId = firstArea?.id || firstCity?.id || null;
      } else if (itemData.type === 'stay') {
        const firstCity = existingNodes.find((n) => n.type === 'city');
        parentId = firstCity?.id || null;
      }
    }

    onAddPlaceToTrip({
      ...itemData,
      parentId,
    });
  };

  return (
    <aside
      className={`${styles.explorePanel} ${!isOpen ? styles.panelClosed : ''}`}
      aria-label="Explore Destinations and Activities"
    >
      {/* Panel Header */}
      <div className={styles.exploreHeader}>
        <div className={styles.exploreHeaderTitleRow}>
          <div className={styles.exploreTitle}>
            <Compass size={16} color="var(--gt-blue)" />
            <span>Explore Catalog</span>
          </div>
          <button
            type="button"
            className={styles.panelCloseBtn}
            onClick={onClose}
            title="Collapse Explore Panel"
          >
            <X size={15} />
          </button>
        </div>

        {/* Dynamic Context Banner when Node is Selected */}
        {activeContext.hasSelection && activeContext.cityName && (
          <div className={styles.exploreContextBanner}>
            <div className={styles.exploreContextLeft}>
              <span className={styles.exploreContextDot} />
              <div className={styles.exploreContextInfo}>
                <span className={styles.exploreContextLabel}>MATCHING SELECTION</span>
                <span className={styles.exploreContextTarget} title={activeContext.nodeTitle}>
                  {activeContext.areaName || activeContext.nodeTitle}
                  {activeContext.areaName && activeContext.cityName !== activeContext.areaName
                    ? ` • ${activeContext.cityName}`
                    : ''}
                </span>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.exploreContextToggle} ${
                !filterByContext ? styles.exploreContextToggleInactive : ''
              }`}
              onClick={() => setFilterByContext((prev) => !prev)}
              title={
                filterByContext
                  ? 'Switch to browse all global destinations'
                  : `Filter strictly for ${activeContext.cityName}`
              }
            >
              {filterByContext ? 'Show All' : 'Filter by Selection'}
            </button>
          </div>
        )}

        {/* Quick Trip Cities Filter Chips when No Node is Selected */}
        {!activeContext.hasSelection && activeContext.tripCities.length > 0 && (
          <div className={styles.tripCitiesFilterRow}>
            <button
              type="button"
              className={`${styles.tripCityChip} ${!manualCityFilter ? styles.tripCityChipActive : ''}`}
              onClick={() => setManualCityFilter(null)}
            >
              All Destinations
            </button>
            {activeContext.tripCities.map((cityName) => (
              <button
                key={cityName}
                type="button"
                className={`${styles.tripCityChip} ${
                  manualCityFilter === cityName ? styles.tripCityChipActive : ''
                }`}
                onClick={() => setManualCityFilter(cityName)}
              >
                {cityName}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className={styles.exploreSearchWrapper}>
          <Search size={14} color="var(--gt-text-muted)" />
          <input
            type="text"
            placeholder={
              activeContext.cityName && filterByContext
                ? `Search in ${activeContext.cityName}...`
                : 'Search stops, beaches, temples...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.exploreSearchInput}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.searchClearBtn}
              onClick={() => setSearchQuery('')}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Underline Tabs */}
        <div className={styles.exploreTabs}>
          <button
            type="button"
            className={`${styles.exploreTabBtn} ${activeTab === 'places' ? styles.exploreTabBtnActive : ''}`}
            onClick={() => setActiveTab('places')}
          >
            Places
            {filterByContext && recommendedPlaces.length > 0
              ? ` (${recommendedPlaces.length})`
              : ''}
          </button>
          <button
            type="button"
            className={`${styles.exploreTabBtn} ${activeTab === 'stays' ? styles.exploreTabBtnActive : ''}`}
            onClick={() => setActiveTab('stays')}
          >
            Stays & Hotels
            {nearbyStays.length > 0 ? ` (${nearbyStays.length})` : ''}
          </button>
          <button
            type="button"
            className={`${styles.exploreTabBtn} ${activeTab === 'activities' ? styles.exploreTabBtnActive : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            Activities
            {filterByContext && recommendedActivities.length > 0
              ? ` (${recommendedActivities.length})`
              : ''}
          </button>
          <button
            type="button"
            className={`${styles.exploreTabBtn} ${activeTab === 'cities' ? styles.exploreTabBtnActive : ''}`}
            onClick={() => setActiveTab('cities')}
          >
            Cities & Areas
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className={styles.categoryChips}>
          {['All', 'Beach', 'Culture', 'Food', 'History', 'Sightseeing'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.categoryChip} ${
                selectedCategory === cat ? styles.categoryChipActive : ''
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Item Results Area */}
      <div className={styles.exploreList}>
        {/* ==================================================================
            TAB 1: PLACES / DESTINATIONS
            ================================================================== */}
        {activeTab === 'places' && (
          <>
            {/* Recommended Places for Selected Destination */}
            {recommendedPlaces.length > 0 && (
              <>
                <div className={styles.exploreSectionHeader}>
                  <span className={styles.exploreSectionTitle}>
                    {activeContext.areaName || activeContext.cityName
                      ? `Places in ${activeContext.areaName || activeContext.cityName}`
                      : 'Recommended Places'}
                  </span>
                  <span className={styles.exploreSectionBadge}>
                    {recommendedPlaces.length}
                  </span>
                </div>

                {recommendedPlaces.map((place) => {
                  const isAdded = existingTitles.has(place.name.toLowerCase());
                  return (
                    <div key={place.id} className={styles.exploreItemCard}>
                      {place.image && (
                        <img src={place.image} alt={place.name} className={styles.exploreThumb} />
                      )}
                      <div className={styles.exploreItemDetails}>
                        <div className={styles.exploreItemTitleRow}>
                          <span className={styles.exploreItemTitle}>{place.name}</span>
                          <span className={styles.exploreItemCost}>
                            {place.estimatedCost ? `$${place.estimatedCost}` : 'Free'}
                          </span>
                        </div>
                        <div className={styles.exploreItemMeta}>
                          <span>{place.areaName ? `${place.areaName}, ` : ''}{place.cityName}</span>
                          <span>• {place.category}</span>
                          {place.duration && <span>• {place.duration}</span>}
                        </div>
                      </div>

                      <div className={styles.exploreItemAction}>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            place.name + ' ' + (place.cityName || activeContext.cityName || '')
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.exploreGmapsLink}
                          title="View on Google Maps & Reviews"
                        >
                          <ExternalLink size={12} />
                        </a>
                        {isAdded ? (
                          <span className={styles.addedBadge}>
                            <Check size={12} />
                            <span>Added</span>
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() =>
                              handleAddWithSmartParent({
                                title: place.name,
                                type: 'destination',
                                category: place.category,
                                duration: place.duration,
                                estimatedCost: place.estimatedCost,
                                image: place.image,
                                description: place.description,
                                location: `${place.areaName || ''}, ${place.cityName}`,
                                areaName: place.areaName,
                              })
                            }
                            title={
                              selectedNode
                                ? `Add directly under ${selectedNode.title}`
                                : 'Add stop to trip canvas'
                            }
                          >
                            <Plus size={12} />
                            <span>Add</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Other Global Places (if not strictly filtered or user clicks Show All) */}
            {(!filterByContext || recommendedPlaces.length === 0) &&
              otherPlaces.length > 0 && (
                <>
                  {recommendedPlaces.length > 0 && (
                    <div className={styles.exploreSectionHeader} style={{ marginTop: 12 }}>
                      <span className={styles.exploreSectionTitle}>Other Destinations</span>
                      <span className={styles.exploreSectionBadge}>{otherPlaces.length}</span>
                    </div>
                  )}

                  {otherPlaces.slice(0, 50).map((place) => {
                    const isAdded = existingTitles.has(place.name.toLowerCase());
                    return (
                      <div key={place.id} className={styles.exploreItemCard}>
                        {place.image && (
                          <img src={place.image} alt={place.name} className={styles.exploreThumb} />
                        )}
                        <div className={styles.exploreItemDetails}>
                          <div className={styles.exploreItemTitleRow}>
                            <span className={styles.exploreItemTitle}>{place.name}</span>
                            <span className={styles.exploreItemCost}>
                              {place.estimatedCost ? `$${place.estimatedCost}` : 'Free'}
                            </span>
                          </div>
                          <div className={styles.exploreItemMeta}>
                            <span>{place.areaName ? `${place.areaName}, ` : ''}{place.cityName}</span>
                            <span>• {place.category}</span>
                          </div>
                        </div>

                        <div className={styles.exploreItemAction}>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              place.name + ' ' + (place.cityName || activeContext.cityName || '')
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.exploreGmapsLink}
                            title="View on Google Maps & Reviews"
                          >
                            <ExternalLink size={12} />
                          </a>
                          {isAdded ? (
                            <span className={styles.addedBadge}>
                              <Check size={12} />
                              <span>Added</span>
                            </span>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              style={{ fontSize: 11, padding: '4px 8px' }}
                              onClick={() =>
                                handleAddWithSmartParent({
                                  title: place.name,
                                  type: 'destination',
                                  category: place.category,
                                  duration: place.duration,
                                  estimatedCost: place.estimatedCost,
                                  image: place.image,
                                  description: place.description,
                                  location: `${place.areaName || ''}, ${place.cityName}`,
                                  areaName: place.areaName,
                                })
                              }
                            >
                              <Plus size={12} />
                              <span>Add</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

            {recommendedPlaces.length === 0 && otherPlaces.length === 0 && (
              <div className={styles.exploreEmpty}>
                No places match your search query. Try switching to &quot;Show All&quot;.
              </div>
            )}
          </>
        )}

        {/* ==================================================================
            TAB: NEARBY STAYS & HOTELS
            ================================================================== */}
        {activeTab === 'stays' && (
          <>
            <div className={styles.exploreSectionHeader}>
              <span className={styles.exploreSectionTitle}>
                {activeContext.cityName
                  ? `Stays & Accommodations in ${activeContext.cityName}`
                  : 'Curated Stays & Hotels'}
              </span>
              <span className={styles.exploreSectionBadge}>
                {nearbyStays.length} Stays
              </span>
            </div>

            {nearbyStays.map((stay) => {
              const isAdded = existingTitles.has(stay.name.toLowerCase());
              const gmapsReviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                stay.name + ' ' + (activeContext.cityName || '')
              )}`;

              return (
                <div key={stay.id} className={styles.stayCard}>
                  {stay.image && (
                    <img src={stay.image} alt={stay.name} className={styles.stayThumb} />
                  )}
                  <div className={styles.stayDetails}>
                    <div className={styles.stayTitleRow}>
                      <span className={styles.stayTitle}>{stay.name}</span>
                      <span className={styles.stayTypeBadge}>{stay.type}</span>
                    </div>

                    <div className={styles.stayPriceRow}>
                      <span className={styles.stayPriceRange}>
                        {formatCurrency(stay.minPrice)} – {formatCurrency(stay.maxPrice)}
                      </span>
                      <span className={styles.stayNightLabel}>/night</span>
                    </div>

                    <div className={styles.stayAmenitiesRow}>
                      {stay.amenities.map((amenity, idx) => (
                        <span key={idx} className={styles.stayAmenityPill}>
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className={styles.stayActionButtonsRow}>
                      {isAdded ? (
                        <span className={styles.addedBadge}>
                          <Check size={12} />
                          <span>Added to Trip</span>
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          style={{ fontSize: 11, padding: '4px 10px', height: 28 }}
                          onClick={() =>
                            handleAddWithSmartParent({
                              title: stay.name,
                              type: 'stay',
                              category: stay.type,
                              cost: stay.minPrice,
                              estimatedCost: stay.minPrice,
                              image: stay.image,
                              description: `${stay.type} in ${activeContext.cityName || 'City'}. Amenities: ${stay.amenities.join(', ')}.`,
                              location: activeContext.cityName || 'Destination',
                              amenities: stay.amenities,
                            })
                          }
                          title={`Add ${stay.name} to canvas`}
                        >
                          <Plus size={12} />
                          <span>Add Stay Node</span>
                        </Button>
                      )}

                      <a
                        href={gmapsReviewsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.stayGmapsLink}
                        title="View on Google Maps & Read Verified Guest Reviews"
                      >
                        <ExternalLink size={12} />
                        <span>Google Reviews</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ==================================================================
            TAB 2: ACTIVITIES / EXPERIENCES
            ================================================================== */}
        {activeTab === 'activities' && (
          <>
            {/* Recommended Activities for Selected City */}
            {recommendedActivities.length > 0 && (
              <>
                <div className={styles.exploreSectionHeader}>
                  <span className={styles.exploreSectionTitle}>
                    {activeContext.cityName
                      ? `Experiences in ${activeContext.cityName}`
                      : 'Recommended Activities'}
                  </span>
                  <span className={styles.exploreSectionBadge}>
                    {recommendedActivities.length}
                  </span>
                </div>

                {recommendedActivities.map((act) => {
                  const isAdded = existingTitles.has(act.name.toLowerCase());
                  return (
                    <div key={act.id} className={styles.exploreItemCard}>
                      {act.image && (
                        <img src={act.image} alt={act.name} className={styles.exploreThumb} />
                      )}
                      <div className={styles.exploreItemDetails}>
                        <div className={styles.exploreItemTitleRow}>
                          <span className={styles.exploreItemTitle}>{act.name}</span>
                          <span className={styles.exploreItemCost}>
                            {act.estimatedCost ? `$${act.estimatedCost}` : 'Free'}
                          </span>
                        </div>
                        <div className={styles.exploreItemMeta}>
                          <span>{act.cityName || activeContext.cityName}</span>
                          <span>• {act.category}</span>
                          {act.duration && (
                            <span>
                              • {typeof act.duration === 'string' ? act.duration : `${Math.round(act.duration / 60)} hrs`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.exploreItemAction}>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            act.name + ' ' + (act.cityName || activeContext.cityName || '')
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.exploreGmapsLink}
                          title="View on Google Maps & Reviews"
                        >
                          <ExternalLink size={12} />
                        </a>
                        {isAdded ? (
                          <span className={styles.addedBadge}>
                            <Check size={12} />
                            <span>Added</span>
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() =>
                              handleAddWithSmartParent({
                                title: act.name,
                                type: 'activity',
                                category: act.category,
                                duration: typeof act.duration === 'string' ? act.duration : `${Math.round(act.duration / 60)} hours`,
                                estimatedCost: act.estimatedCost,
                                image: act.image,
                                description: act.description,
                                location: act.cityName || activeContext.cityName,
                              })
                            }
                            title={
                              selectedNode
                                ? `Add activity under ${selectedNode.title}`
                                : 'Add activity to trip'
                            }
                          >
                            <Plus size={12} />
                            <span>Add</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Other Activities */}
            {(!filterByContext || recommendedActivities.length === 0) &&
              otherActivities.length > 0 && (
                <>
                  {recommendedActivities.length > 0 && (
                    <div className={styles.exploreSectionHeader} style={{ marginTop: 12 }}>
                      <span className={styles.exploreSectionTitle}>More Activities</span>
                      <span className={styles.exploreSectionBadge}>{otherActivities.length}</span>
                    </div>
                  )}

                  {otherActivities.slice(0, 40).map((act) => {
                    const isAdded = existingTitles.has(act.name.toLowerCase());
                    return (
                      <div key={act.id} className={styles.exploreItemCard}>
                        {act.image && (
                          <img src={act.image} alt={act.name} className={styles.exploreThumb} />
                        )}
                        <div className={styles.exploreItemDetails}>
                          <div className={styles.exploreItemTitleRow}>
                            <span className={styles.exploreItemTitle}>{act.name}</span>
                            <span className={styles.exploreItemCost}>
                              {act.estimatedCost ? `$${act.estimatedCost}` : 'Free'}
                            </span>
                          </div>
                          <div className={styles.exploreItemMeta}>
                            <span>{act.cityName || 'Global'}</span>
                            <span>• {act.category}</span>
                          </div>
                        </div>

                        <div className={styles.exploreItemAction}>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              act.name + ' ' + (act.cityName || activeContext.cityName || '')
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.exploreGmapsLink}
                            title="View on Google Maps & Reviews"
                          >
                            <ExternalLink size={12} />
                          </a>
                          {isAdded ? (
                            <span className={styles.addedBadge}>
                              <Check size={12} />
                              <span>Added</span>
                            </span>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              style={{ fontSize: 11, padding: '4px 8px' }}
                              onClick={() =>
                                handleAddWithSmartParent({
                                  title: act.name,
                                  type: 'activity',
                                  category: act.category,
                                  duration: typeof act.duration === 'string' ? act.duration : `${Math.round(act.duration / 60)} hours`,
                                  estimatedCost: act.estimatedCost,
                                  image: act.image,
                                  description: act.description,
                                })
                              }
                            >
                              <Plus size={12} />
                              <span>Add</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

            {recommendedActivities.length === 0 && otherActivities.length === 0 && (
              <div className={styles.exploreEmpty}>
                No activities match your query. Try clicking &quot;Show All&quot;.
              </div>
            )}
          </>
        )}

        {/* ==================================================================
            TAB 3: CITIES & SUB-AREAS
            ================================================================== */}
        {activeTab === 'cities' && (
          <>
            {/* 1. Sub-areas of the selected city */}
            {cityAreas.length > 0 && (
              <>
                <div className={styles.exploreSectionHeader}>
                  <span className={styles.exploreSectionTitle}>
                    Areas in {activeContext.cityName}
                  </span>
                  <span className={styles.exploreSectionBadge}>
                    {cityAreas.length} Areas
                  </span>
                </div>

                {cityAreas.map((area) => {
                  const isAdded = existingTitles.has(area.name.toLowerCase());
                  return (
                    <div key={area.id} className={styles.exploreItemCard}>
                      <div className={styles.exploreItemDetails}>
                        <div className={styles.exploreItemTitleRow}>
                          <span className={styles.exploreItemTitle}>
                            {area.name}
                            <span className={styles.areaItemBadge}>AREA</span>
                          </span>
                        </div>
                        <div className={styles.exploreItemMeta}>
                          <span>Neighborhood / District in {activeContext.cityName}</span>
                        </div>
                      </div>

                      <div className={styles.exploreItemAction}>
                        {isAdded ? (
                          <span className={styles.addedBadge}>
                            <Check size={12} />
                            <span>Added</span>
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() =>
                              handleAddWithSmartParent({
                                title: area.name,
                                type: 'area',
                                category: 'Neighborhood',
                                duration: '1 day',
                                estimatedCost: 40,
                                image: selectedCityData?.image,
                                description: `Explore ${area.name} district in ${activeContext.cityName}`,
                                location: `${area.name}, ${activeContext.cityName}`,
                              })
                            }
                            title={`Add ${area.name} area under ${activeContext.cityName}`}
                          >
                            <Plus size={12} />
                            <span>Add Area</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* 2. Nearby / Regional Cities (Same State / Region) */}
            {nearbyCities.length > 0 && (
              <>
                <div className={styles.exploreSectionHeader} style={{ marginTop: 12 }}>
                  <span className={styles.exploreSectionTitle}>
                    Nearby in {selectedCityData?.state || selectedCityData?.region || 'Region'}
                  </span>
                  <span className={styles.exploreSectionBadge}>{nearbyCities.length}</span>
                </div>

                {nearbyCities.map((city) => {
                  const isAdded = existingTitles.has(city.name.toLowerCase());
                  return (
                    <div key={city.id} className={styles.exploreItemCard}>
                      <img src={city.image} alt={city.name} className={styles.exploreThumb} />
                      <div className={styles.exploreItemDetails}>
                        <div className={styles.exploreItemTitleRow}>
                          <span className={styles.exploreItemTitle}>{city.name}</span>
                          <span className={styles.exploreItemCost}>${city.avgCostPerDay}/day</span>
                        </div>
                        <div className={styles.exploreItemMeta}>
                          <span>{city.state ? `${city.state}, ` : ''}{city.country}</span>
                          <span>• {city.tags?.[0] || 'Travel'}</span>
                        </div>
                      </div>

                      <div className={styles.exploreItemAction}>
                        {isAdded ? (
                          <span className={styles.addedBadge}>
                            <Check size={12} />
                            <span>Added</span>
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() =>
                              onAddPlaceToTrip({
                                title: city.name,
                                type: 'city',
                                category: city.tags?.[0] || 'Sightseeing',
                                duration: '3 days',
                                estimatedCost: city.avgCostPerDay * 3,
                                image: city.image,
                                description: city.description,
                                location: city.country,
                                parentId: null,
                              })
                            }
                          >
                            <Plus size={12} />
                            <span>Add City</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* 3. All Other Global Cities */}
            {otherCities.length > 0 && (
              <>
                {(cityAreas.length > 0 || nearbyCities.length > 0) && (
                  <div className={styles.exploreSectionHeader} style={{ marginTop: 12 }}>
                    <span className={styles.exploreSectionTitle}>All Destinations</span>
                    <span className={styles.exploreSectionBadge}>{otherCities.length}</span>
                  </div>
                )}

                {otherCities.slice(0, 50).map((city) => {
                  const isAdded = existingTitles.has(city.name.toLowerCase());
                  return (
                    <div key={city.id} className={styles.exploreItemCard}>
                      <img src={city.image} alt={city.name} className={styles.exploreThumb} />
                      <div className={styles.exploreItemDetails}>
                        <div className={styles.exploreItemTitleRow}>
                          <span className={styles.exploreItemTitle}>{city.name}</span>
                          <span className={styles.exploreItemCost}>${city.avgCostPerDay}/day</span>
                        </div>
                        <div className={styles.exploreItemMeta}>
                          <span>{city.state ? `${city.state}, ` : ''}{city.country}</span>
                          <span>• {city.tags?.[0] || 'Travel'}</span>
                        </div>
                      </div>

                      <div className={styles.exploreItemAction}>
                        {isAdded ? (
                          <span className={styles.addedBadge}>
                            <Check size={12} />
                            <span>Added</span>
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                            onClick={() =>
                              onAddPlaceToTrip({
                                title: city.name,
                                type: 'city',
                                category: city.tags?.[0] || 'Sightseeing',
                                duration: '3 days',
                                estimatedCost: city.avgCostPerDay * 3,
                                image: city.image,
                                description: city.description,
                                location: city.country,
                                parentId: null,
                              })
                            }
                          >
                            <Plus size={12} />
                            <span>Add City</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
