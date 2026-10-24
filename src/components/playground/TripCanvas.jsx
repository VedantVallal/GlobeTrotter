'use client';

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Plus, Move, Sparkles, Navigation, Layers, Link2, Trash2, X } from 'lucide-react';
import TripNodeCard from './TripNodeCard';
import CanvasControls from './CanvasControls';
import Button from '@/components/ui/Button';
import styles from './playground.module.css';

export default function TripCanvas({
  nodes = [],
  links = [],
  selectedNodeId,
  onSelectNode,
  onUpdateNodeCoordinates,
  onOpenAddModal,
  onOpenReplaceModal,
  onDuplicateNode,
  onDeleteNode,
  onAddChildNode,
  onAutoLayout,
  onCreateLink,
  onDeleteLink,
  onClearCanvas,
  isMiniMapOpen = false,
  onToggleMiniMap,
  children,
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

  // Interactive Linking State
  const [linkingSourceId, setLinkingSourceId] = useState(null);
  const [mouseCanvasPos, setMouseCanvasPos] = useState({ x: 0, y: 0 });
  const [hoveredTargetNodeId, setHoveredTargetNodeId] = useState(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState(null);
  const [isLinkToolActive, setIsLinkToolActive] = useState(false);

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
    const maxX = Math.max(...xs) + 260; // card width
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys) + 120; // card height

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

  // Linking handlers
  const handleStartLink = useCallback((nodeId) => {
    setLinkingSourceId(nodeId);
    setIsLinkToolActive(true);
    const source = nodes.find((n) => n.id === nodeId);
    if (source) {
      setMouseCanvasPos({ x: source.x + 260 + 30, y: source.y + 44 });
    }
  }, [nodes]);

  const handleCompleteLink = useCallback((targetId) => {
    if (linkingSourceId && targetId && linkingSourceId !== targetId) {
      onCreateLink?.(linkingSourceId, targetId);
    }
    setLinkingSourceId(null);
    setHoveredTargetNodeId(null);
    setIsLinkToolActive(false);
  }, [linkingSourceId, onCreateLink]);

  const handleCancelLink = useCallback(() => {
    setLinkingSourceId(null);
    setHoveredTargetNodeId(null);
    setIsLinkToolActive(false);
  }, []);

  // Keyboard shortcut: Escape cancels linking mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (linkingSourceId || isLinkToolActive)) {
        handleCancelLink();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [linkingSourceId, isLinkToolActive, handleCancelLink]);

  // Pan Canvas Mouse Handlers
  const handleCanvasMouseDown = (e) => {
    // If clicking a node card, button, or port, do not start canvas pan
    if (
      e.target.closest(`.${styles.nodeCard}`) ||
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest(`.${styles.edgeMidpointForeign}`)
    ) {
      return;
    }

    // If linking mode is active and user clicks empty canvas, cancel linking
    if (linkingSourceId) {
      handleCancelLink();
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
    if (!canvasRef.current) return;

    // Update mouse canvas position for live linking curve
    if (linkingSourceId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const canvasY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
      setMouseCanvasPos({ x: Math.round(canvasX), y: Math.round(canvasY) });

      // Check hovered node target
      const cardEl = e.target.closest('[id^="node-"]');
      if (cardEl) {
        const targetId = cardEl.id.replace('node-', '');
        if (targetId !== linkingSourceId) {
          setHoveredTargetNodeId(targetId);
        } else {
          setHoveredTargetNodeId(null);
        }
      } else {
        setHoveredTargetNodeId(null);
      }
    }

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
    // If linking is active, clicking node completes link instead
    if (linkingSourceId) {
      if (nodeId !== linkingSourceId) {
        handleCompleteLink(nodeId);
      }
      return;
    }

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

  // Generate SVG Bezier Curves for All Links & Parent-Child Edges
  const edges = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const list = [];
    const CARD_W = 260;
    const CARD_H_MID = 44;

    // Combine explicit links and any node.parentId edges (deduplicated)
    const allLinks = [...(links || [])];

    for (const node of nodes) {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const alreadyLinked = allLinks.some(
          (l) => l.source === node.parentId && l.target === node.id
        );
        if (!alreadyLinked) {
          allLinks.push({
            id: `link-${node.parentId}-${node.id}`,
            source: node.parentId,
            target: node.id,
          });
        }
      }
    }

    for (const link of allLinks) {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target) continue;

      const isLeftChild = target.x < source.x;
      const startX = isLeftChild ? source.x : source.x + CARD_W;
      const startY = source.y + CARD_H_MID;
      const endX = isLeftChild ? target.x + CARD_W : target.x;
      const endY = target.y + CARD_H_MID;

      // Smooth cubic bezier curve
      const dx = Math.max(40, Math.abs(endX - startX) * 0.5);
      const control1X = isLeftChild ? startX - dx : startX + dx;
      const control2X = isLeftChild ? endX + dx : endX - dx;
      const d = `M ${startX} ${startY} C ${control1X} ${startY}, ${control2X} ${endY}, ${endX} ${endY}`;

      // Midpoint along the curve
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      list.push({
        id: link.id,
        sourceId: source.id,
        targetId: target.id,
        sourceTitle: source.title,
        targetTitle: target.title,
        d,
        startX,
        startY,
        endX,
        endY,
        midX,
        midY,
        isParentSelected: selectedNodeId === source.id || selectedNodeId === target.id,
      });
    }
    return list;
  }, [nodes, links, selectedNodeId]);

  // Rubberband link in progress curve
  const linkingCurve = useMemo(() => {
    if (!linkingSourceId) return null;
    const source = nodes.find((n) => n.id === linkingSourceId);
    if (!source) return null;

    const CARD_W = 260;
    const CARD_H_MID = 44;

    let targetX = mouseCanvasPos.x;
    let targetY = mouseCanvasPos.y;

    if (hoveredTargetNodeId) {
      const hoveredTarget = nodes.find((n) => n.id === hoveredTargetNodeId);
      if (hoveredTarget) {
        targetX = hoveredTarget.x;
        targetY = hoveredTarget.y + CARD_H_MID;
      }
    }

    const isLeftChild = targetX < source.x;
    const startX = isLeftChild ? source.x : source.x + CARD_W;
    const startY = source.y + CARD_H_MID;

    const dx = Math.max(40, Math.abs(targetX - startX) * 0.5);
    const control1X = isLeftChild ? startX - dx : startX + dx;
    const control2X = isLeftChild ? targetX + dx : targetX - dx;
    const d = `M ${startX} ${startY} C ${control1X} ${startY}, ${control2X} ${targetY}, ${targetX} ${targetY}`;

    return { d, startX, startY, endX: targetX, endY: targetY };
  }, [linkingSourceId, mouseCanvasPos, hoveredTargetNodeId, nodes]);

  // Overall bounds for SVG canvas
  const canvasBounds = useMemo(() => {
    if (nodes.length === 0) return { width: 2400, height: 1400 };
    const minX = Math.min(0, ...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x)) + 600;
    const minY = Math.min(0, ...nodes.map((n) => n.y));
    const maxY = Math.max(...nodes.map((n) => n.y)) + 600;
    return {
      width: Math.max(2600, maxX - minX + 800),
      height: Math.max(1600, maxY - minY + 800),
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
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="edge-grad-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
            </linearGradient>

            <marker
              id="edge-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#0D9488" />
            </marker>

            <marker
              id="edge-arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#10B981" />
            </marker>
          </defs>

          {/* Render All Established Edges */}
          {edges.map((edge) => {
            const isHovered = hoveredEdgeId === edge.id;
            const isHighlighted = edge.isParentSelected || isHovered;

            return (
              <g
                key={edge.id}
                onMouseEnter={() => setHoveredEdgeId(edge.id)}
                onMouseLeave={() => setHoveredEdgeId(null)}
              >
                {/* Thick invisible hit path */}
                <path
                  d={edge.d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={22}
                  style={{ cursor: 'pointer' }}
                />

                {/* Visible styled path */}
                <path
                  d={edge.d}
                  fill="none"
                  stroke={isHighlighted ? 'url(#edge-grad-highlight)' : 'url(#edge-grad-primary)'}
                  strokeWidth={isHighlighted ? 3.5 : 2.2}
                  strokeDasharray={isHighlighted ? 'none' : '6 4'}
                  markerEnd={isHighlighted ? 'url(#edge-arrow-active)' : 'url(#edge-arrow)'}
                  className={styles.canvasSvgEdge}
                />

                {/* Interactive Midpoint Pill Badge (Shows on hover or parent selection) */}
                {(isHovered || isHighlighted) && (
                  <foreignObject
                    x={edge.midX - 70}
                    y={edge.midY - 14}
                    width={140}
                    height={28}
                    className={styles.edgeMidpointForeign}
                  >
                    <div
                      className={styles.edgeMidpointPill}
                      title={`Connection: ${edge.sourceTitle} ➔ ${edge.targetTitle}`}
                    >
                      <span>
                        {edge.sourceTitle?.slice(0, 8)} ➔ {edge.targetTitle?.slice(0, 8)}
                      </span>
                      <button
                        type="button"
                        className={styles.edgeDeleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLink?.(edge.id);
                        }}
                        title="Remove link between stops"
                      >
                        ✕
                      </button>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Render Rubberband Link in Progress */}
          {linkingSourceId && linkingCurve && (
            <g>
              <path
                d={linkingCurve.d}
                fill="none"
                stroke="#2563eb"
                strokeWidth={3}
                className={styles.rubberbandEdge}
              />
              <circle
                cx={linkingCurve.endX}
                cy={linkingCurve.endY}
                r={6}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {/* Node Cards */}
        {nodes.map((node) => {
          const isSource = linkingSourceId === node.id;
          const isCandidate = Boolean(linkingSourceId && node.id !== linkingSourceId);
          const isHovered = hoveredTargetNodeId === node.id;

          return (
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
              isLinkingSource={isSource}
              isLinkingCandidate={isCandidate}
              isHoveredLinkTarget={isHovered}
              onStartLink={handleStartLink}
              onCompleteLink={handleCompleteLink}
            />
          );
        })}

        {/* Empty Canvas State — Inspiring, Clean, User-Driven */}
        {nodes.length === 0 && (
          <div className={styles.canvasEmptyState}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background:
                  'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(16, 185, 129, 0.16))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1px solid rgba(37, 99, 235, 0.2)',
              }}
            >
              <Sparkles size={28} color="#2563eb" />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--gt-text-primary, #0f172a)',
                marginBottom: 8,
              }}
            >
              Your Journey Canvas is Clear
            </h3>
            <p
              style={{
                fontSize: 13,
                color: 'var(--gt-text-secondary, #64748b)',
                maxWidth: 400,
                margin: '0 auto 20px',
                lineHeight: 1.5,
              }}
            >
              Build your customized trip route from scratch. Add stops from the Explore catalog on
              the left, create custom stops, and link them together into a personalized route.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Button
                variant="primary"
                onClick={() => onOpenAddModal()}
                style={{
                  boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                  fontWeight: 600,
                }}
              >
                <Plus size={15} />
                <span>Add First Stop</span>
              </Button>
            </div>
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

        {nodes.length >= 2 && (
          <Button
            variant={isLinkToolActive ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              if (isLinkToolActive) {
                handleCancelLink();
              } else {
                setIsLinkToolActive(true);
                if (selectedNodeId) {
                  handleStartLink(selectedNodeId);
                }
              }
            }}
            style={{
              borderRadius: 'var(--gt-radius-full)',
              fontWeight: 600,
              background: isLinkToolActive ? '#10b981' : undefined,
              borderColor: isLinkToolActive ? '#059669' : undefined,
            }}
            title="Connect stops with interactive links"
          >
            <Link2 size={14} />
            <span>{isLinkToolActive ? 'Cancel Link' : 'Connect Stops'}</span>
          </Button>
        )}

        {nodes.length > 0 && onClearCanvas && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCanvas}
            style={{
              borderRadius: 'var(--gt-radius-full)',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 600,
            }}
            title="Clear canvas to start completely clean"
          >
            <Trash2 size={13} />
            <span>Clear Canvas</span>
          </Button>
        )}

        <button
          type="button"
          className={styles.canvasHintPill}
          title="Drag anywhere to pan • Click ports or 🔗 to connect stops"
        >
          <Move size={12} />
          <span>Pan canvas • Click 🔗 to link stops</span>
        </button>
      </div>

      {/* Floating Active Linking Banner */}
      {linkingSourceId && (
        <div className={styles.linkingBanner}>
          <Link2 size={14} color="#38bdf8" />
          <span>
            Linking from <strong>{nodes.find((n) => n.id === linkingSourceId)?.title || 'Stop'}</strong> — Click any destination stop to connect
          </span>
          <button type="button" className={styles.linkingCancelBtn} onClick={handleCancelLink}>
            Cancel (Esc)
          </button>
        </div>
      )}

      {/* Floating Mini-Map Slot */}
      {children}

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
        isMiniMapOpen={isMiniMapOpen}
        onToggleMiniMap={onToggleMiniMap}
      />
    </div>
  );
}
