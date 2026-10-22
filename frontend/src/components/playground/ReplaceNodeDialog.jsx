'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  ArrowRight,
  Check,
  RefreshCw,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { mockCuratedPlaces } from './playgroundTypes';
import { mockCities } from '@/lib/data/mockCities';
import { mockActivities } from '@/lib/data/mockActivities';
import styles from './playground.module.css';

export default function ReplaceNodeDialog({
  isOpen,
  onClose,
  targetNode,
  onConfirmReplace,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Generate candidates compatible with targetNode's type
  const candidates = useMemo(() => {
    if (!targetNode) return [];

    let list = [];
    if (targetNode.type === 'city') {
      list = mockCities.map((c) => ({
        id: c.id,
        title: c.name,
        type: 'city',
        category: c.tags?.[0] || 'Sightseeing',
        duration: '3 days',
        estimatedCost: c.avgCostPerDay * 3,
        image: c.image,
        description: c.description,
        location: c.country,
      }));
    } else if (targetNode.type === 'activity') {
      list = mockActivities.map((a) => ({
        id: a.id,
        title: a.name,
        type: 'activity',
        category: a.category,
        duration: `${Math.round(a.duration / 60)} hours`,
        estimatedCost: a.estimatedCost,
        image: a.image,
        description: a.description,
        location: a.tags?.[0] || 'Nearby',
      }));
    } else {
      // Area or Destination
      const places = mockCuratedPlaces.map((p) => ({
        id: p.id,
        title: p.name,
        type: p.type,
        category: p.category,
        duration: p.duration,
        estimatedCost: p.estimatedCost,
        image: p.image,
        description: p.description,
        location: `${p.areaName || ''}, ${p.cityName}`,
      }));

      // Also allow selecting from activities if destination
      const activities = mockActivities.map((a) => ({
        id: a.id,
        title: a.name,
        type: 'destination',
        category: a.category,
        duration: `${Math.round(a.duration / 60)} hours`,
        estimatedCost: a.estimatedCost,
        image: a.image,
        description: a.description,
        location: a.tags?.[0] || 'Sightseeing',
      }));

      list = [...places, ...activities];
    }

    // Exclude the current node itself
    return list.filter((item) =>
      item.title.toLowerCase() !== targetNode.title.toLowerCase()
    );
  }, [targetNode]);

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates;
    const q = searchQuery.toLowerCase();
    return candidates.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q))
    );
  }, [candidates, searchQuery]);

  if (!isOpen || !targetNode) return null;

  const handleApply = () => {
    if (!selectedCandidate) {
      setErrorMsg('Please select a replacement candidate from the list.');
      return;
    }

    // Validate compatibility: cannot replace a city with an activity
    if (targetNode.type === 'city' && selectedCandidate.type !== 'city') {
      setErrorMsg('Cannot replace a City with an Activity or Area.');
      return;
    }

    onConfirmReplace(targetNode, selectedCandidate);
    onClose();
  };

  const costDelta = selectedCandidate
    ? (selectedCandidate.estimatedCost || 0) - (targetNode.estimatedCost || 0)
    : 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="replace-dialog-title">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitle} id="replace-dialog-title">
            <RefreshCw size={18} color="var(--gt-blue)" />
            <span>Replace Stop: {targetNode.title}</span>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Explanation */}
        <p className={styles.modalSubtitle}>
          Swap <strong>{targetNode.title}</strong> with an alternative destination while preserving its exact itinerary position, date, and connected stops.
        </p>

        {/* Side-by-Side Comparison Preview */}
        <div className={styles.replacePreviewGrid}>
          {/* Current Node */}
          <div className={styles.replacePreviewCard}>
            <div className={styles.previewTag}>Current Stop</div>
            <div className={styles.previewContent}>
              {targetNode.image && (
                <img
                  src={targetNode.image}
                  alt={targetNode.title}
                  className={styles.previewThumb}
                />
              )}
              <div>
                <h4 className={styles.previewTitle}>{targetNode.title}</h4>
                <div className={styles.previewMeta}>
                  <span>{targetNode.category || 'Sightseeing'}</span>
                  <span>•</span>
                  <span>{targetNode.estimatedCost ? `$${targetNode.estimatedCost}` : 'Free'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.replaceArrowWrapper}>
            <ArrowRight size={20} color="var(--gt-text-muted)" />
          </div>

          {/* New Node Candidate Preview */}
          <div className={`${styles.replacePreviewCard} ${selectedCandidate ? styles.previewCardActive : styles.previewCardEmpty}`}>
            <div className={styles.previewTag}>New Replacement</div>
            {selectedCandidate ? (
              <div className={styles.previewContent}>
                {selectedCandidate.image && (
                  <img
                    src={selectedCandidate.image}
                    alt={selectedCandidate.title}
                    className={styles.previewThumb}
                  />
                )}
                <div>
                  <h4 className={styles.previewTitle}>{selectedCandidate.title}</h4>
                  <div className={styles.previewMeta}>
                    <span>{selectedCandidate.category}</span>
                    <span>•</span>
                    <span>{selectedCandidate.estimatedCost ? `$${selectedCandidate.estimatedCost}` : 'Free'}</span>
                  </div>
                  {costDelta !== 0 && (
                    <span className={costDelta > 0 ? styles.costDeltaUp : styles.costDeltaDown}>
                      {costDelta > 0 ? `+$${costDelta}` : `-$${Math.abs(costDelta)}`} difference
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.previewPlaceholder}>
                Select an alternative below
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.modalSearchWrapper}>
          <Search size={15} color="var(--gt-text-muted)" />
          <input
            type="text"
            placeholder={`Search alternative ${targetNode.type}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.modalSearchInput}
            autoFocus
          />
        </div>

        {/* Candidate List */}
        <div className={styles.candidateList}>
          {filteredCandidates.length === 0 ? (
            <div className={styles.emptyCandidates}>
              No matching alternatives found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredCandidates.map((candidate) => {
              const isCandidateSelected = selectedCandidate?.id === candidate.id;
              return (
                <div
                  key={candidate.id}
                  className={`${styles.candidateItem} ${isCandidateSelected ? styles.candidateItemSelected : ''}`}
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setErrorMsg(null);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSelectedCandidate(candidate);
                  }}
                >
                  {candidate.image && (
                    <img
                      src={candidate.image}
                      alt={candidate.title}
                      className={styles.candidateThumb}
                    />
                  )}
                  <div className={styles.candidateInfo}>
                    <div className={styles.candidateTitleRow}>
                      <span className={styles.candidateTitle}>{candidate.title}</span>
                      <span className={styles.candidateCost}>
                        {candidate.estimatedCost ? `$${candidate.estimatedCost}` : 'Free'}
                      </span>
                    </div>
                    <div className={styles.candidateSub}>
                      <span>{candidate.location}</span>
                      {candidate.duration && <span>• {candidate.duration}</span>}
                      {candidate.category && <span>• {candidate.category}</span>}
                    </div>
                  </div>
                  {isCandidateSelected && (
                    <div className={styles.candidateCheck}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {errorMsg && (
          <div className={styles.modalError}>
            <AlertTriangle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!selectedCandidate}
          >
            Confirm & Swap Stop
          </Button>
        </div>
      </div>
    </div>
  );
}
