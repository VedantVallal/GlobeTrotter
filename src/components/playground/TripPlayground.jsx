'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import PlaygroundHeader from './PlaygroundHeader';
import ExplorePanel from './ExplorePanel';
import TripCanvas from './TripCanvas';

// Dynamic SSR-safe TripGeoMap import
const TripGeoMap = dynamic(() => import('./TripGeoMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--gt-text-muted, #64748b)',
        fontSize: '13px',
        fontWeight: 500,
        background: '#f8fafc',
      }}
    >
      Loading Interactive Route Map...
    </div>
  ),
});
import NodeDetailsPanel from './NodeDetailsPanel';
import CopilotPanel from './CopilotPanel';
import ReplaceNodeDialog from './ReplaceNodeDialog';
import DeleteNodeDialog from './DeleteNodeDialog';
import AddNodeDialog from './AddNodeDialog';
import MobilePlaygroundNavigation from './MobilePlaygroundNavigation';
import ShareModal from '@/components/ui/ShareModal';
import {
  createDefaultHierarchicalNodes,
  calculateTripSummary,
  runAutoLayout,
} from './playgroundTypes';
import { playgroundService, tripService, itineraryService } from '@/lib/services';
import { generateSynchronizedTripPlan } from '@/lib/services/tripGenerator';
import styles from './playground.module.css';

export default function TripPlayground({ trip, initialNodes = null }) {
  const tripId = trip.id;

  // Nodes state
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');

  // Undo / Redo History Stack (bounded to 25 snapshots of { nodes, links })
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoActionRef = useRef(false);

  // Panels visibility
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState('journey'); // 'explore' | 'journey' | 'details' | 'copilot'

  // Workspace View Mode: 'canvas' | 'map'
  const [viewMode, setViewMode] = useState('canvas');
  const [isMiniMapOpen, setIsMiniMapOpen] = useState(false);

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [replaceTargetNode, setReplaceTargetNode] = useState(null);
  const [deleteTargetNode, setDeleteTargetNode] = useState(null);
  const [addModalConfig, setAddModalConfig] = useState({ isOpen: false, defaultParentId: null, defaultType: 'destination' });

  // Toast feedback
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, showUndo = false) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, showUndo });
    toastTimerRef.current = setTimeout(() => setToast(null), 4500);
  };

  // Initialize nodes and links: user-driven, clear canvas by default!
  useEffect(() => {
    async function init() {
      let loaded = initialNodes;
      if (!loaded || loaded.length === 0) {
        const stored = await playgroundService.getNodes(tripId);
        const isOldPredeterminedTemplate =
          stored &&
          stored.some(
            (n) => n.id === 'node-city-goa' || n.id === 'node-dest-baga' || n.id === 'node-city-1'
          );
        if (stored && Array.isArray(stored) && stored.length > 0 && !isOldPredeterminedTemplate) {
          loaded = stored;
        } else {
          // Keep playground clear and totally user-driven
          loaded = [];
          playgroundService.saveNodes(tripId, []);
        }
      }
      setNodes(loaded);

      // Load or discover connections/links
      let loadedLinks = await playgroundService.getLinks(tripId);
      if (!loadedLinks || loadedLinks.length === 0) {
        if (loaded && loaded.length > 0) {
          loadedLinks = loaded
            .filter((n) => n.parentId)
            .map((n) => ({
              id: `link-${n.parentId}-${n.id}`,
              source: n.parentId,
              target: n.id,
            }));
        } else {
          loadedLinks = [];
        }
      }
      setLinks(loadedLinks);
      setHistory([{ nodes: loaded, links: loadedLinks }]);
      setHistoryIndex(0);
      if (loaded.length > 0) {
        setSelectedNodeId(loaded[0].id);
      }
    }
    init();
  }, [tripId, initialNodes]);

  // Persist nodes helper with dynamic two-way sync to itineraryService
  const persistNodes = useCallback(
    (newNodes) => {
      setSaveStatus('Saving...');
      playgroundService.saveNodes(tripId, newNodes);
      tripService.updateTrip(tripId, {
        stopsCount: newNodes.length,
        destinations: Array.from(new Set(newNodes.filter((n) => n.type === 'city').map((n) => n.title))),
      });

      // Synchronize changes to day-by-day itinerary
      const daysMap = {};
      newNodes.forEach((node) => {
        if (node.type !== 'city') {
          const dayNum = node.dayNumber || 1;
          if (!daysMap[dayNum]) {
            daysMap[dayNum] = [];
          }
          daysMap[dayNum].push({
            id: node.id,
            name: node.title,
            category: node.category || 'Sightseeing',
            time: node.time || '10:00 AM',
            duration: parseInt(node.duration) || 60,
            cost: node.estimatedCost || 0,
            location: node.location || '',
            image: node.image || '',
            notes: node.notes || '',
          });
        }
      });

      itineraryService.getItinerary(tripId).then((existingDays) => {
        if (Array.isArray(existingDays) && existingDays.length > 0) {
          const updatedDays = existingDays.map((d) => ({
            ...d,
            activities: daysMap[d.day] || [],
          }));
          itineraryService.saveItinerary(tripId, updatedDays);
        }
      });

      setTimeout(() => setSaveStatus('Saved'), 400);
    },
    [tripId]
  );

  // Push to Undo/Redo history
  const pushHistory = useCallback(
    (newNodes, newLinks = links) => {
      if (isUndoRedoActionRef.current) {
        isUndoRedoActionRef.current = false;
        return;
      }
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        const updated = [...trimmed, { nodes: newNodes, links: newLinks }];
        if (updated.length > 25) updated.shift();
        return updated;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 24));
    },
    [historyIndex, links]
  );

  // Undo handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoActionRef.current = true;
      const targetIndex = historyIndex - 1;
      const snapshot = history[targetIndex];
      const prevNodes = snapshot?.nodes || snapshot || [];
      const prevLinks = snapshot?.links || [];
      setHistoryIndex(targetIndex);
      setNodes(prevNodes);
      setLinks(prevLinks);
      persistNodes(prevNodes);
      playgroundService.saveLinks(tripId, prevLinks);
      showToast('Changes undone');
    }
  }, [historyIndex, history, persistNodes, tripId]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoActionRef.current = true;
      const targetIndex = historyIndex + 1;
      const snapshot = history[targetIndex];
      const nextNodes = snapshot?.nodes || snapshot || [];
      const nextLinks = snapshot?.links || [];
      setHistoryIndex(targetIndex);
      setNodes(nextNodes);
      setLinks(nextLinks);
      persistNodes(nextNodes);
      playgroundService.saveLinks(tripId, nextLinks);
      showToast('Changes redone');
    }
  }, [historyIndex, history, persistNodes, tripId]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Shift+Z, Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept shortcuts if user is typing inside an input/textarea
      const tag = e.target.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl/Cmd + Shift + Z or Ctrl + Y
      else if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Delete selected node
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault();
          const target = nodes.find((n) => n.id === selectedNodeId);
          if (target) handleDeleteRequest(target);
        }
      }
      // Escape: deselect or close modals
      else if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setReplaceTargetNode(null);
        setDeleteTargetNode(null);
        setAddModalConfig({ isOpen: false, defaultParentId: null, defaultType: 'destination' });
      }
      // 'M' shortcut: toggle route mini-map or toggle canvas/map view
      else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (viewMode === 'map') {
          setViewMode('canvas');
        } else {
          setIsMiniMapOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedNodeId, nodes, viewMode]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (typeof document !== 'undefined' && document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Summary statistics (deterministic calculations)
  const summary = useMemo(() => {
    return calculateTripSummary(nodes, trip.budget || 1200);
  }, [nodes, trip.budget]);

  // Currently selected node
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Node Selection Handler
  const handleSelectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    if (nodeId && mobileTab === 'journey') {
      // On mobile, keep on journey but mark details available
    }
  };

  // Node Drag Updates
  const handleUpdateCoordinates = (nodeId, x, y) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
    );
  };

  // ADD NODE
  const handleAddNode = (nodeData) => {
    const parent = nodes.find((n) => n.id === nodeData.parentId);
    const siblings = nodes.filter((n) => n.parentId === (nodeData.parentId || null));

    // Calculate smart canvas position
    let newX = 80;
    let newY = 80;
    if (parent) {
      newX = parent.x + 320;
      newY = parent.y + siblings.length * 110;
    } else if (siblings.length > 0) {
      const col = siblings.length % 3;
      const row = Math.floor(siblings.length / 3);
      newX = 80 + col * 320;
      newY = 80 + row * 180;
    }

    const newNode = {
      id: `node-${nodeData.type}-${Date.now()}`,
      type: nodeData.type,
      parentId: nodeData.parentId || null,
      tripId,
      title: nodeData.title,
      description: nodeData.description || '',
      order: siblings.length + 1,
      dayNumber: nodeData.dayNumber || 1,
      duration: nodeData.duration || '2 hours',
      estimatedCost: nodeData.estimatedCost || 0,
      currency: 'USD',
      category: nodeData.category || 'Sightseeing',
      image: nodeData.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop',
      location: nodeData.location || '',
      notes: nodeData.notes || '',
      x: newX,
      y: newY,
    };

    const updated = [...nodes, newNode];
    let updatedLinks = links;

    // If added under a parent, create a link automatically
    if (newNode.parentId) {
      const autoLink = {
        id: `link-${newNode.parentId}-${newNode.id}-${Date.now()}`,
        source: newNode.parentId,
        target: newNode.id,
      };
      updatedLinks = [...links, autoLink];
      setLinks(updatedLinks);
      playgroundService.saveLinks(tripId, updatedLinks);
    }

    setNodes(updated);
    setSelectedNodeId(newNode.id);
    pushHistory(updated, updatedLinks);
    persistNodes(updated);
    showToast(`Added ${newNode.title} to journey`, true);
  };

  // EDIT NODE
  const handleUpdateNode = (nodeId, fields) => {
    const updated = nodes.map((n) => (n.id === nodeId ? { ...n, ...fields } : n));
    setNodes(updated);
    pushHistory(updated, links);
    persistNodes(updated);
    showToast(`Updated ${fields.title || 'stop'}`);
  };

  // CREATE LINK / CONNECTION BETWEEN ANY TWO NODES
  const handleCreateLink = useCallback(
    (sourceId, targetId) => {
      if (!sourceId || !targetId || sourceId === targetId) return;

      // Prevent duplicate links
      const alreadyExists = links.some(
        (l) =>
          (l.source === sourceId && l.target === targetId) ||
          (l.source === targetId && l.target === sourceId)
      );
      if (alreadyExists) {
        showToast('These stops are already connected');
        return;
      }

      const sourceNode = nodes.find((n) => n.id === sourceId);
      const targetNode = nodes.find((n) => n.id === targetId);

      const newLink = {
        id: `link-${sourceId}-${targetId}-${Date.now()}`,
        source: sourceId,
        target: targetId,
      };

      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      playgroundService.saveLinks(tripId, updatedLinks);

      // If target doesn't have parentId, assign source as parent to maintain hierarchical consistency
      let updatedNodes = nodes;
      if (targetNode && !targetNode.parentId) {
        updatedNodes = nodes.map((n) =>
          n.id === targetId ? { ...n, parentId: sourceId } : n
        );
        setNodes(updatedNodes);
        persistNodes(updatedNodes);
      }

      pushHistory(updatedNodes, updatedLinks);
      showToast(`Linked ${sourceNode?.title || 'Stop'} ➔ ${targetNode?.title || 'Stop'}`);
    },
    [links, nodes, tripId, persistNodes, pushHistory]
  );

  // DELETE LINK / CONNECTION
  const handleDeleteLink = useCallback(
    (linkId) => {
      const targetLink = links.find((l) => l.id === linkId);
      if (!targetLink) return;

      const updatedLinks = links.filter((l) => l.id !== linkId);
      setLinks(updatedLinks);
      playgroundService.saveLinks(tripId, updatedLinks);

      // If target node's parentId was source and no other link connects them, clear parentId
      const stillConnected = updatedLinks.some(
        (l) => l.source === targetLink.source && l.target === targetLink.target
      );
      let updatedNodes = nodes;
      if (!stillConnected) {
        updatedNodes = nodes.map((n) =>
          n.id === targetLink.target && n.parentId === targetLink.source
            ? { ...n, parentId: null }
            : n
        );
        setNodes(updatedNodes);
        persistNodes(updatedNodes);
      }

      pushHistory(updatedNodes, updatedLinks);
      showToast('Link removed', true);
    },
    [links, nodes, tripId, persistNodes, pushHistory]
  );

  // CLEAR CANVAS: RESET TO COMPLETELY USER-DRIVEN BLANK STATE
  const handleClearCanvas = useCallback(() => {
    if (nodes.length === 0) return;

    setNodes([]);
    setLinks([]);
    setSelectedNodeId(null);
    playgroundService.saveNodes(tripId, []);
    playgroundService.saveLinks(tripId, []);
    persistNodes([]);

    pushHistory([], []);
    showToast('Playground cleared. You can build from scratch or undo.', true);
  }, [nodes, tripId, persistNodes, pushHistory]);

  // Helper: Find all descendant IDs recursively
  const getDescendantIds = useCallback((targetId, nodeList) => {
    const descendants = [];
    const queue = [targetId];
    while (queue.length > 0) {
      const currentId = queue.shift();
      const children = nodeList.filter((n) => n.parentId === currentId);
      for (const child of children) {
        descendants.push(child.id);
        queue.push(child.id);
      }
    }
    return descendants;
  }, []);

  // Request Delete (opens confirm dialog if has descendants)
  const handleDeleteRequest = (targetNode) => {
    const descendantIds = getDescendantIds(targetNode.id, nodes);
    if (descendantIds.length > 0) {
      setDeleteTargetNode({ ...targetNode, descendantCount: descendantIds.length });
    } else {
      executeDelete(targetNode);
    }
  };

  // Execute Delete
  const executeDelete = (targetNode) => {
    const descendantIds = new Set([targetNode.id, ...getDescendantIds(targetNode.id, nodes)]);
    const updated = nodes.filter((n) => !descendantIds.has(n.id));
    const updatedLinks = links.filter(
      (l) => !descendantIds.has(l.source) && !descendantIds.has(l.target)
    );

    setNodes(updated);
    setLinks(updatedLinks);
    playgroundService.saveLinks(tripId, updatedLinks);

    if (selectedNodeId === targetNode.id) {
      setSelectedNodeId(updated[0]?.id || null);
    }
    pushHistory(updated, updatedLinks);
    persistNodes(updated);
    showToast(`Deleted ${targetNode.title}`, true);
  };

  // REPLACE NODE FLOW
  const handleConfirmReplace = (targetNode, replacement) => {
    const updated = nodes.map((n) => {
      if (n.id === targetNode.id) {
        return {
          ...n,
          title: replacement.title,
          description: replacement.description || n.description,
          duration: replacement.duration || n.duration,
          estimatedCost: replacement.estimatedCost !== undefined ? replacement.estimatedCost : n.estimatedCost,
          category: replacement.category || n.category,
          image: replacement.image || n.image,
          location: replacement.location || n.location,
        };
      }
      return n;
    });

    setNodes(updated);
    pushHistory(updated);
    persistNodes(updated);
    showToast(`Replaced ${targetNode.title} with ${replacement.title}`, true);
  };

  // DUPLICATE NODE
  const handleDuplicate = (targetNode) => {
    const newNode = {
      ...targetNode,
      id: `node-${targetNode.type}-${Date.now()}`,
      title: `Copy of ${targetNode.title}`,
      x: targetNode.x + 30,
      y: targetNode.y + 30,
    };

    const updated = [...nodes, newNode];
    setNodes(updated);
    setSelectedNodeId(newNode.id);
    pushHistory(updated);
    persistNodes(updated);
    showToast(`Duplicated ${targetNode.title}`, true);
  };

  // MOVE SIBLING ORDER (Earlier / Later)
  const handleMoveOrder = (nodeId, direction) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const siblings = nodes
      .filter((n) => n.parentId === node.parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const index = siblings.findIndex((n) => n.id === nodeId);
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const targetSibling = siblings[targetIndex];

    // Swap order and y position
    const updated = nodes.map((n) => {
      if (n.id === node.id) {
        return { ...n, order: targetSibling.order, y: targetSibling.y };
      }
      if (n.id === targetSibling.id) {
        return { ...n, order: node.order, y: node.y };
      }
      return n;
    });

    setNodes(updated);
    pushHistory(updated);
    persistNodes(updated);
    showToast(`Moved ${node.title} ${direction < 0 ? 'earlier' : 'later'}`);
  };

  // AUTO-LAYOUT
  const handleAutoLayout = () => {
    const laidOut = runAutoLayout(nodes);
    setNodes(laidOut);
    pushHistory(laidOut);
    persistNodes(laidOut);
    showToast('Auto-layout applied');
  };

  // Add Child trigger
  const handleAddChild = (parent) => {
    let nextType = 'destination';
    if (parent.type === 'city') nextType = 'area';
    else if (parent.type === 'area') nextType = 'destination';
    else if (parent.type === 'destination') nextType = 'activity';

    setAddModalConfig({
      isOpen: true,
      defaultParentId: parent.id,
      defaultType: nextType,
    });
  };

  return (
    <div className={`${styles.playgroundRoot} ${isFullscreen ? styles.fullscreenRoot : ''}`}>
      {/* 52px Compact Header */}
      <PlaygroundHeader
        trip={trip}
        summary={summary}
        saveStatus={saveStatus}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearCanvas={handleClearCanvas}
        hasNodes={nodes.length > 0}
        leftPanelOpen={leftPanelOpen}
        onToggleLeftPanel={() => setLeftPanelOpen((prev) => !prev)}
        rightPanelOpen={rightPanelOpen}
        onToggleRightPanel={() => setRightPanelOpen((prev) => !prev)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenShare={() => setShareModalOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* 3-Panel Responsive Workspace */}
      <main className={styles.workspace}>
        {/* Left Panel: Explore Catalog */}
        <div className={`${styles.leftPanelContainer} ${mobileTab === 'explore' ? '' : styles.panelHideOnMobile}`}>
          <ExplorePanel
            isOpen={leftPanelOpen}
            onClose={() => {
              setLeftPanelOpen(false);
              if (mobileTab === 'explore') setMobileTab('journey');
            }}
            existingNodes={nodes}
            onAddPlaceToTrip={handleAddNode}
            selectedNode={selectedNode}
          />
        </div>

        {/* Center Panel: Primary Interactive Canvas OR Full Route Map */}
        {viewMode === 'map' ? (
          <TripGeoMap
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            onOpenAddModal={(defaultParentId, defaultType) =>
              setAddModalConfig({
                isOpen: true,
                defaultParentId: defaultParentId || selectedNodeId || null,
                defaultType: defaultType || 'destination',
              })
            }
            isMiniMap={false}
          />
        ) : (
          <TripCanvas
            nodes={nodes}
            links={links}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            onUpdateNodeCoordinates={handleUpdateCoordinates}
            onOpenAddModal={(defaultParentId, defaultType) =>
              setAddModalConfig({
                isOpen: true,
                defaultParentId: defaultParentId || selectedNodeId || null,
                defaultType: defaultType || 'destination',
              })
            }
            onOpenReplaceModal={(node) => setReplaceTargetNode(node)}
            onDuplicateNode={handleDuplicate}
            onDeleteNode={handleDeleteRequest}
            onAddChildNode={handleAddChild}
            onAutoLayout={handleAutoLayout}
            onCreateLink={handleCreateLink}
            onDeleteLink={handleDeleteLink}
            onClearCanvas={handleClearCanvas}
            isMiniMapOpen={isMiniMapOpen}
            onToggleMiniMap={() => setIsMiniMapOpen((prev) => !prev)}
          >
            {/* Floating Mini-Map HUD on Canvas */}
            {isMiniMapOpen && (
              <div className={styles.canvasMiniMapFloating}>
                <TripGeoMap
                  nodes={nodes}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={handleSelectNode}
                  isMiniMap={true}
                  onToggleExpand={() => {
                    setIsMiniMapOpen(false);
                    setViewMode('map');
                  }}
                  onCloseMiniMap={() => setIsMiniMapOpen(false)}
                />
              </div>
            )}
          </TripCanvas>
        )}

        {/* Right Panel: Contextual Node Details OR AI Copilot */}
        <div className={`${styles.rightPanelContainer} ${mobileTab === 'details' || mobileTab === 'copilot' ? '' : styles.panelHideOnMobile}`}>
          {rightPanelOpen && (
            selectedNode ? (
              <NodeDetailsPanel
                selectedNode={selectedNode}
                allNodes={nodes}
                links={links}
                onCreateLink={handleCreateLink}
                onDeleteLink={handleDeleteLink}
                onClose={() => setSelectedNodeId(null)}
                onUpdateNode={handleUpdateNode}
                onOpenReplace={(node) => setReplaceTargetNode(node)}
                onDuplicate={handleDuplicate}
                onDelete={handleDeleteRequest}
                onAddChild={handleAddChild}
                onMoveOrder={handleMoveOrder}
                onOpenCopilot={() => {
                  setCopilotInitialPrompt(`What are the top insider tips, best timing to visit, and nearby recommendations for "${selectedNode.title}"?`);
                  setSelectedNodeId(null);
                }}
              />
            ) : (
              <CopilotPanel
                trip={trip}
                nodesCount={nodes.length}
                nodes={nodes}
                initialQuery={copilotInitialPrompt}
                onClose={() => {
                  setRightPanelOpen(false);
                  if (mobileTab === 'copilot') setMobileTab('journey');
                }}
                onAddSuggestedPlace={(place) =>
                  handleAddNode({
                    ...place,
                    parentId: null,
                  })
                }
              />
            )
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobilePlaygroundNavigation
        activeTab={mobileTab}
        onChangeTab={(tab) => {
          setMobileTab(tab);
          if (tab === 'explore') setLeftPanelOpen(true);
          if (tab === 'details' || tab === 'copilot') setRightPanelOpen(true);
        }}
        nodesCount={nodes.length}
        hasSelection={Boolean(selectedNodeId)}
      />

      {/* Modals & Dialogs */}
      <ReplaceNodeDialog
        isOpen={Boolean(replaceTargetNode)}
        targetNode={replaceTargetNode}
        onClose={() => setReplaceTargetNode(null)}
        onConfirmReplace={handleConfirmReplace}
      />

      <DeleteNodeDialog
        isOpen={Boolean(deleteTargetNode)}
        targetNode={deleteTargetNode}
        descendantCount={deleteTargetNode?.descendantCount || 0}
        onClose={() => setDeleteTargetNode(null)}
        onConfirmDelete={executeDelete}
      />

      <AddNodeDialog
        isOpen={addModalConfig.isOpen}
        nodes={nodes}
        defaultParentId={addModalConfig.defaultParentId}
        defaultType={addModalConfig.defaultType}
        onClose={() => setAddModalConfig({ isOpen: false, defaultParentId: null, defaultType: 'destination' })}
        onConfirmAdd={handleAddNode}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className={styles.toastBanner} role="status">
          <span>{toast.message}</span>
          {toast.showUndo && (
            <button
              type="button"
              className={styles.toastUndoBtn}
              onClick={handleUndo}
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
