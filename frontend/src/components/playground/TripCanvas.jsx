'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Plus, Move, Sparkles, Navigation, Layers, Workflow, Grid } from 'lucide-react';
import TripNodeCard from './TripNodeCard';
import CanvasControls from './CanvasControls';
import ObsidianMindMap from './ObsidianMindMap';
import Button from '@/components/ui/Button';
import styles from './playground.module.css';

export default function TripCanvas({
  nodes,
  selectedNodeId,
  onSelectNode,
  onUpdateNodeCoordinates,
  onOpenAddModal,
  onOpenReplaceModal,
  onDuplicateNode,
  onDeleteNode,
  onAddChildNode,
  onAutoLayout,
  onToggleLockNode,
  isMiniMapOpen = false,
  onToggleMiniMap,
  children,
}) {
  const canvasRef = useRef(null);

  // Engine Mode: 'obsidian' (xyflow + dagre) vs 'freeform'
  const [engineMode, setEngineMode] = useState('obsidian');

  // Viewport transforms: pan and zoom for freeform mode
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const nodeDragStartRef = useRef({ mouseX: 0, mouseY: 0, nodeX: 0, nodeY: 0 });

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.45));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Fit View
  const handleFitView = useCallback(() => {
    if (nodes.length === 0 || !canvasRef.current) return;
    const padding = 80;
    const xs = nodes.map((n) => n.x || 0);
    const ys = nodes.map((n) => n.y || 0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) + 260;
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys) + 120;

    const boxWidth = maxX - minX + padding * 2;
    const boxHeight = maxY - minY + padding * 2;

    const containerWidth = canvasRef.current.clientWidth || 900;
    const containerHeight = canvasRef.current.clientHeight || 600;

    const scaleX = containerWidth / boxWidth;
    const scaleY = containerHeight / boxHeight;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.5), 1.2);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoomLevel(newZoom);
    setPanOffset({
      x: containerWidth / 2 - centerX * newZoom,
      y: containerHeight / 2 - centerY * newZoom,
    });
  }, [nodes]);

  // Center Selected Node
  const handleCenterSelected = useCallback(() => {
    const selected = nodes.find((n) => n.id === selectedNodeId);
    if (!selected || !canvasRef.current) return;

    const containerWidth = canvasRef.current.clientWidth || 900;
    const containerHeight = canvasRef.current.clientHeight || 600;

    const targetX = (selected.x || 0) + 130;
    const targetY = (selected.y || 0) + 60;

    setPanOffset({
      x: containerWidth / 2 - targetX * zoomLevel,
      y: containerHeight / 2 - targetY * zoomLevel,
    });
  }, [nodes, selectedNodeId, zoomLevel]);

  // Freeform Pan Handlers
  const handleCanvasMouseDown = (e) => {
    if (e.target.closest(`.${styles.nodeCard}`) || e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    onSelectNode(null);
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panOffset.x,
      initialPanY: panOffset.y,
    };
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset({
        x: panStartRef.current.initialPanX + dx,
        y: panStartRef.current.initialPanY + dy,
      });
    } else if (draggingNodeId) {
      const dx = (e.clientX - nodeDragStartRef.current.mouseX) / zoomLevel;
      const dy = (e.clientY - nodeDragStartRef.current.mouseY) / zoomLevel;
      const nextX = Math.round(nodeDragStartRef.current.nodeX + dx);
      const nextY = Math.round(nodeDragStartRef.current.nodeY + dy);
      onUpdateNodeCoordinates(draggingNodeId, nextX, nextY);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleStartNodeDrag = (e, nodeId) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    onSelectNode(nodeId);
    setDraggingNodeId(nodeId);
    nodeDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      nodeX: node.x || 0,
      nodeY: node.y || 0,
    };
  };

  // Compute Connecting Edges for freeform mode
  const edges = useMemo(() => {
    if (engineMode !== 'freeform') return [];
    const result = [];
    nodes.forEach((node) => {
      if (!node.parentId) return;
      const parent = nodes.find((n) => n.id === node.parentId);
      if (!parent) return;

      const sourceX = (parent.x || 0) + 260;
      const sourceY = (parent.y || 0) + 50;
      const targetX = node.x || 0;
      const targetY = (node.y || 0) + 50;

      const dx = Math.abs(targetX - sourceX) * 0.5;
      const c1x = sourceX + Math.max(dx, 40);
      const c1y = sourceY;
      const c2x = targetX - Math.max(dx, 40);
      const c2y = targetY;

      result.push({
        id: `edge-${parent.id}-${node.id}`,
        d: `M ${sourceX} ${sourceY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${targetX} ${targetY}`,
        isParentSelected: selectedNodeId === parent.id || selectedNodeId === node.id,
      });
    });
    return result;
  }, [nodes, selectedNodeId, engineMode]);

  return (
    <div
      ref={canvasRef}
      className={styles.canvasContainer}
      onMouseDown={engineMode === 'freeform' ? handleCanvasMouseDown : undefined}
      onMouseMove={engineMode === 'freeform' ? handleMouseMove : undefined}
      onMouseUp={engineMode === 'freeform' ? handleMouseUp : undefined}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0a0a',
        cursor: isPanning ? 'grabbing' : 'default',
      }}
    >
      {/* Engine Switcher & Top Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(26, 26, 31, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 3,
            borderRadius: '9999px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          <button
            type="button"
            onClick={() => setEngineMode('obsidian')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: engineMode === 'obsidian' ? '#6366f1' : 'transparent',
              color: engineMode === 'obsidian' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
              boxShadow: engineMode === 'obsidian' ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Workflow size={13} />
            <span>Obsidian Mind-Map (@xyflow)</span>
          </button>

          <button
            type="button"
            onClick={() => setEngineMode('freeform')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: engineMode === 'freeform' ? '#6366f1' : 'transparent',
              color: engineMode === 'freeform' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
              boxShadow: engineMode === 'freeform' ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Grid size={13} />
            <span>Freeform Canvas</span>
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onOpenAddModal()}
          style={{
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            borderRadius: '9999px',
            fontWeight: 700,
            background: '#6366f1',
          }}
        >
          <Plus size={14} />
          <span>Add Stop</span>
        </Button>
      </div>

      {/* Mode 1: Obsidian Mind-Map (@xyflow/react + dagre) */}
      {engineMode === 'obsidian' && (
        <ObsidianMindMap
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onUpdateNodeCoordinates={onUpdateNodeCoordinates}
          onOpenAddModal={onOpenAddModal}
          onOpenReplaceModal={onOpenReplaceModal}
          onDuplicateNode={onDuplicateNode}
          onDeleteNode={onDeleteNode}
          onToggleLockNode={onToggleLockNode}
          onAutoLayout={onAutoLayout}
        />
      )}

      {/* Mode 2: Freeform SVG Canvas with custom transforms */}
      {engineMode === 'freeform' && (
        <div
          className={styles.canvasWorld}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Connecting SVG Edges */}
          <svg className={styles.canvasSvgLayer}>
            <defs>
              <linearGradient id="edge-grad-primary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="edge-grad-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
              </linearGradient>
            </defs>

            {edges.map((edge) => (
              <path
                key={edge.id}
                d={edge.d}
                fill="none"
                stroke={edge.isParentSelected ? 'url(#edge-grad-highlight)' : 'url(#edge-grad-primary)'}
                strokeWidth={edge.isParentSelected ? 3.5 : 2}
                strokeDasharray={edge.isParentSelected ? 'none' : '6 4'}
                className={styles.canvasSvgEdge}
              />
            ))}
          </svg>

          {/* Node Cards */}
          {nodes.map((node) => (
            <TripNodeCard
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={onSelectNode}
              onStartDrag={handleStartNodeDrag}
              onOpenReplace={onOpenReplaceModal}
              onDuplicate={onDuplicateNode}
              onDelete={onDeleteNode}
              onAddChild={onAddChildNode}
              onToggleLock={onToggleLockNode}
            />
          ))}

          {/* Empty Canvas State */}
          {nodes.length === 0 && (
            <div className={styles.canvasEmptyState}>
              <Layers size={36} color="var(--gt-text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                Your Journey Canvas is Empty
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)', maxWidth: 360, margin: '0 auto 16px' }}>
                Add a starting destination from the Explore catalog on the left, or create a custom stop.
              </p>
              <Button variant="primary" onClick={() => onOpenAddModal()}>
                <Plus size={14} />
                <span>Add First Stop</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Floating Mini-Map Slot */}
      {children}

      {/* Floating Canvas Viewport & Zoom Controls for Freeform mode */}
      {engineMode === 'freeform' && (
        <CanvasControls
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onFitView={handleFitView}
          onAutoLayout={onAutoLayout}
          onCenterSelected={handleCenterSelected}
          hasSelection={Boolean(selectedNodeId)}
          isMiniMapOpen={isMiniMapOpen}
          onToggleMiniMap={onToggleMiniMap}
        />
      )}
    </div>
  );
}
