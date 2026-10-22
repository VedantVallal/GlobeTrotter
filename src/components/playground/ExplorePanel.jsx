'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Compass,
  MapPin,
  Sparkles,
  Plus,
  X,
  Check,
  Filter,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { mockCities } from '@/lib/data/mockCities';
import { mockActivities } from '@/lib/data/mockActivities';
import { mockCuratedPlaces, CATEGORIES } from './playgroundTypes';
import styles from './playground.module.css';

export default function ExplorePanel({
  isOpen,
  onClose,
  existingNodes,
  onAddPlaceToTrip,
  selectedNode,
}) {
  const [activeTab, setActiveTab] = useState('places'); // 'cities' | 'places' | 'activities'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Existing titles for quick checking
  const existingTitles = useMemo(() => {
    return new Set(existingNodes.map((n) => n.title.toLowerCase()));
  }, [existingNodes]);

  // Filtered Cities
  const filteredCities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mockCities.filter((c) => {
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
  }, [searchQuery, selectedCategory]);

  // Filtered Places / Destinations
  const filteredPlaces = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mockCuratedPlaces.filter((p) => {
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
  }, [searchQuery, selectedCategory]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mockActivities.filter((a) => {
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
  }, [searchQuery, selectedCategory]);

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

        {/* Search Bar */}
        <div className={styles.exploreSearchWrapper}>
          <Search size={14} color="var(--gt-text-muted)" />
          <input
            type="text"
            placeholder="Search stops, beaches, temples..."
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
            Places ({mockCuratedPlaces.length})
          </button>
          <button
            type="button"
            className={`${styles.exploreTabBtn} ${activeTab === 'cities' ? styles.exploreTabBtnActive : ''}`}
            onClick={() => setActiveTab('cities')}
          >
            Cities ({mockCities.length})
          </button>
          <button
            type="button"
            className={`${styles.exploreTabBtn} ${activeTab === 'activities' ? styles.exploreTabBtnActive : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            Activities ({mockActivities.length})
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className={styles.categoryChips}>
          {['All', 'Beach', 'Culture', 'Food', 'History', 'Sightseeing'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.categoryChip} ${selectedCategory === cat ? styles.categoryChipActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Item Results Area */}
      <div className={styles.exploreList}>
        {/* TAB 1: PLACES */}
        {activeTab === 'places' &&
          (filteredPlaces.length === 0 ? (
            <div className={styles.exploreEmpty}>No places match your search query.</div>
          ) : (
            filteredPlaces.map((place) => {
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
                      <span>• {place.duration}</span>
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
                            title: place.name,
                            type: 'destination',
                            category: place.category,
                            duration: place.duration,
                            estimatedCost: place.estimatedCost,
                            image: place.image,
                            description: place.description,
                            location: `${place.areaName || ''}, ${place.cityName}`,
                            parentId: selectedNode?.id || null,
                          })
                        }
                        title={
                          selectedNode
                            ? `Add under ${selectedNode.title}`
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
            })))}

        {/* TAB 2: CITIES */}
        {activeTab === 'cities' &&
          (filteredCities.length === 0 ? (
            <div className={styles.exploreEmpty}>No cities match your search.</div>
          ) : (
            filteredCities.map((city) => {
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
                      <span>{city.country}</span>
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
            })))}

        {/* TAB 3: ACTIVITIES */}
        {activeTab === 'activities' &&
          (filteredActivities.length === 0 ? (
            <div className={styles.exploreEmpty}>No activities match your query.</div>
          ) : (
            filteredActivities.map((act) => {
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
                      <span>{act.category}</span>
                      <span>• {Math.round(act.duration / 60)} hrs</span>
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
                            title: act.name,
                            type: 'activity',
                            category: act.category,
                            duration: `${Math.round(act.duration / 60)} hours`,
                            estimatedCost: act.estimatedCost,
                            image: act.image,
                            description: act.description,
                            parentId: selectedNode?.id || null,
                          })
                        }
                        title={
                          selectedNode
                            ? `Add under ${selectedNode.title}`
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
            })))}
      </div>
    </aside>
  );
}
