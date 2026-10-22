'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Plus, Move, Sparkles, Navigation, Layers } from 'lucide-react';
import TripNodeCard from './TripNodeCard';
import CanvasControls from './CanvasControls';
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
}) {
  const canvasRef = useRef(null);

  // Viewport transforms: pan and zoom
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

  // Fit View: calculates bounding box and fits canvas comfortably
  const handleFitView = useCallback(() => {
    if (nodes.length === 0 || !canvasRef.current) return;
    const padding = 80;
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) + 260; // approximate card width
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys) + 120; // approximate card height

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

    const targetX = selected.x + 130;
    const targetY = selected.y + 60;

    setPanOffset({
      x: containerWidth / 2 - targetX * zoomLevel,
      y: containerHeight / 2 - targetY * zoomLevel,
    });
  }, [nodes, selectedNodeId, zoomLevel]);

  // Pan Canvas Mouse Handlers
  const handleCanvasMouseDown = (e) => {
    // If clicking a node card or interactive control, do not start canvas pan
    if (e.target.closest(`.${styles.nodeCard}`) || e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    // Deselect if clicking on empty canvas
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
      const newX = Math.round(nodeDragStartRef.current.nodeX + dx);
      const newY = Math.round(nodeDragStartRef.current.nodeY + dy);
      onUpdateNodeCoordinates(draggingNodeId, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Node Drag Initiation
  const handleStartNodeDrag = (e, nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setDraggingNodeId(nodeId);
    nodeDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };
  };

  // Generate SVG Bezier Curves for Parent-Child Edges
  const edges = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const list = [];

    // Card dimensions
    const CARD_W = 260;
    const CARD_H_MID = 44;

    for (const node of nodes) {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parent = nodeMap.get(node.parentId);

        const startX = parent.x + CARD_W;
        const startY = parent.y + CARD_H_MID;
        const endX = node.x;
        const endY = node.y + CARD_H_MID;

        // Smooth cubic bezier curve
        const dx = Math.abs(endX - startX) * 0.5;
        const d = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

        list.push({
          id: `edge-${parent.id}-${node.id}`,
          d,
          isParentSelected: selectedNodeId === parent.id || selectedNodeId === node.id,
          sourceType: parent.type,
          targetType: node.type,
        });
      }
    }
    return list;
  }, [nodes, selectedNodeId]);

  // Overall bounds for SVG canvas
  const canvasBounds = useMemo(() => {
    if (nodes.length === 0) return { width: 1400, height: 900 };
    const maxX = Math.max(...nodes.map((n) => n.x)) + 500;
    const maxY = Math.max(...nodes.map((n) => n.y)) + 500;
    return {
      width: Math.max(1600, maxX),
      height: Math.max(1000, maxY),
    };
  }, [nodes]);

  return (
    <div
      ref={canvasRef}
      className={`${styles.tripCanvasRoot} ${isPanning ? styles.canvasPanning : ''}`}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      tabIndex={0}
      role="region"
      aria-label="Trip Interactive Canvas"
    >
      {/* Background Dot Grid Pattern */}
      <div className={styles.canvasBackgroundGrid} />

      {/* Pannable & Zoomable Transform Container */}
      <div
        className={styles.canvasTransformSurface}
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
          width: `${canvasBounds.width}px`,
          height: `${canvasBounds.height}px`,
        }}
      >
        {/* SVG Bezier Edges Overlay */}
        <svg
          className={styles.svgOverlay}
          width={canvasBounds.width}
          height={canvasBounds.height}
          viewBox={`0 0 ${canvasBounds.width} ${canvasBounds.height}`}
        >
          <defs>
            <linearGradient id="edge-grad-primary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="edge-grad-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
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
          />
        ))}

        {/* Empty Canvas State */}
        {nodes.length === 0 && (
          <div className={styles.canvasEmptyState}>
            <Layers size={36} color="var(--gt-text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gt-text-primary)', marginBottom: 6 }}>
              Your Journey Canvas is Empty
            </h3>
            <p style={{ fontSize: 13, color: 'var(--gt-text-secondary)', maxWidth: 360, margin: '0 auto 16px' }}>
              Add a starting destination from the Explore catalog on the left, or create a custom stop.
            </p>
            <Button variant="primary" onClick={() => onOpenAddModal()}>
              <Plus size={14} />
              <span>Add First Stop</span>
            </Button>
          </div>
        )}
      </div>

      {/* Floating Canvas Top Actions Bar */}
      <div className={styles.canvasTopToolbar}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onOpenAddModal()}
          style={{
            boxShadow: '0 4px 14px rgba(37,99,235,0.22)',
            borderRadius: 'var(--gt-radius-full)',
            fontWeight: 600,
          }}
        >
          <Plus size={14} />
          <span>Add Stop</span>
        </Button>

        <button
          type="button"
          className={styles.canvasHintPill}
          title="Drag anywhere to pan • Click node to edit"
        >
          <Move size={12} />
          <span>Pan canvas & drag stops</span>
        </button>
      </div>

      {/* Floating Canvas Viewport & Zoom Controls */}
      <CanvasControls
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitView={handleFitView}
        onAutoLayout={onAutoLayout}
        onCenterSelected={handleCenterSelected}
        hasSelection={Boolean(selectedNodeId)}
      />
    </div>
  );
}
