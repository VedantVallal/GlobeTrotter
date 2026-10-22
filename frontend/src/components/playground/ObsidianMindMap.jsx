'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Trash2,
  RefreshCw,
  Copy,
  Plus,
  Compass,
  Layers,
  Sparkles,
  Globe,
  Bed,
  Plane,
  Receipt,
  Pin,
  PinOff,
  Maximize2,
  Workflow,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

const TYPE_CONFIG = {
  root: { label: 'Trip Root', icon: Globe, color: '#a855f7', glow: 'rgba(168, 85, 247, 0.35)' },
  trip: { label: 'Trip Root', icon: Globe, color: '#a855f7', glow: 'rgba(168, 85, 247, 0.35)' },
  city: { label: 'City Stop', icon: Compass, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.35)' },
  area: { label: 'Area / District', icon: Layers, color: '#818cf8', glow: 'rgba(129, 140, 248, 0.35)' },
  destination: { label: 'Attraction', icon: MapPin, color: '#34d399', glow: 'rgba(52, 211, 153, 0.35)' },
  activity: { label: 'Activity', icon: Sparkles, color: '#fb923c', glow: 'rgba(251, 146, 60, 0.35)' },
  stay: { label: 'Stay / Lodging', icon: Bed, color: '#c084fc', glow: 'rgba(192, 132, 252, 0.35)' },
  transport: { label: 'Transit Leg', icon: Plane, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)' },
  expense: { label: 'Expense Pill', icon: Receipt, color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.35)' },
};

// Custom Liketrek Card Node
function LiketrekNodeComponent({ id, data, selected }) {
  const node = data;
  const config = TYPE_CONFIG[node.type] || TYPE_CONFIG.destination;
  const IconComponent = config.icon;
  const isLocked = Boolean(node.is_locked || node.isLocked);

  return (
    <div
      onClick={() => data.onSelectNode && data.onSelectNode(id)}
      style={{
        width: 270,
        background: '#1a1a1f',
        borderRadius: '1.25rem',
        border: selected
          ? `2px solid ${config.color}`
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: selected
          ? `0 0 24px ${config.glow}, 0 8px 32px rgba(0,0,0,0.6)`
          : '0 4px 20px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        color: '#ffffff',
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
    >
      {/* Target handle on Left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: config.color,
          width: 10,
          height: 10,
          border: '2px solid #0a0a0a',
        }}
      />

      {/* Top Banner with Type Icon, Tag & Lock Pin */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: '6px',
              background: `${config.color}20`,
              color: config.color,
            }}
          >
            <IconComponent size={13} />
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: config.color,
            }}
          >
            {config.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Lock Pin Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (data.onToggleLockNode) data.onToggleLockNode(id);
            }}
            style={{
              background: isLocked ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              border: isLocked ? '1px solid rgba(245, 158, 11, 0.4)' : 'none',
              borderRadius: '6px',
              padding: '3px 5px',
              color: isLocked ? '#fbbf24' : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
            }}
            title={isLocked ? 'Stop is locked from AI auto-optimization' : 'Lock stop to prevent auto-optimization'}
          >
            {isLocked ? <Pin size={12} /> : <PinOff size={12} />}
          </button>

          {/* Add Child Node Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (data.onOpenAddModal) data.onOpenAddModal(id, 'destination');
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '6px',
              padding: '3px 6px',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
            }}
            title="Add child stop or activity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '12px 14px' }}>
        <h4
          style={{
            fontSize: 14.5,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            color: '#ffffff',
            marginBottom: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.title}
        </h4>

        {node.description && (
          <p
            style={{
              fontSize: 11.5,
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: 1.35,
              marginBottom: 10,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {node.description}
          </p>
        )}

        {/* Metadata Pill Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'rgba(255, 255, 255, 0.6)',
            paddingTop: 8,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {node.duration ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} color="rgba(255,255,255,0.4)" />
              <span>{node.duration}</span>
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} color="rgba(255,255,255,0.4)" />
              <span>Day {node.dayNumber || 1}</span>
            </span>
          )}

          {typeof node.estimatedCost === 'number' && (
            <span
              style={{
                fontWeight: 700,
                color: node.estimatedCost === 0 ? '#34d399' : '#ffffff',
              }}
            >
              {node.estimatedCost === 0 ? 'Free' : formatCurrency(node.estimatedCost)}
            </span>
          )}
        </div>
      </div>

      {/* Source handle on Right */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: config.color,
          width: 10,
          height: 10,
          border: '2px solid #0a0a0a',
        }}
      />
    </div>
  );
}

const nodeTypes = {
  liketrekNode: LiketrekNodeComponent,
};

// Dagre Layout Algorithm
function layoutGraphWithDagre(rawNodes, rawEdges, direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 45,
    ranksep: 90,
    marginx: 40,
    marginy: 40,
  });

  rawNodes.forEach((n) => {
    dagreGraph.setNode(n.id, { width: 280, height: 140 });
  });

  rawEdges.forEach((e) => {
    dagreGraph.setEdge(e.source, e.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = rawNodes.map((n) => {
    const nodeWithPos = dagreGraph.node(n.id);
    return {
      ...n,
      position: {
        x: nodeWithPos ? nodeWithPos.x - 140 : n.position.x,
        y: nodeWithPos ? nodeWithPos.y - 70 : n.position.y,
      },
    };
  });

  return { layoutedNodes, layoutedEdges: rawEdges };
}

export default function ObsidianMindMap({
  nodes = [],
  selectedNodeId,
  onSelectNode,
  onUpdateNodeCoordinates,
  onOpenAddModal,
  onOpenReplaceModal,
  onDuplicateNode,
  onDeleteNode,
  onToggleLockNode,
  onAutoLayout,
}) {
  // Convert domain nodes to React Flow nodes and edges
  const { flowNodes, flowEdges } = useMemo(() => {
    // Find or create root id
    const rootNode = nodes.find((n) => n.type === 'root' || n.type === 'trip') || nodes[0];
    const rootId = rootNode?.id;

    const rfNodes = nodes.map((n) => ({
      id: n.id,
      type: 'liketrekNode',
      position: { x: n.x || 0, y: n.y || 0 },
      data: {
        ...n,
        onSelectNode,
        onOpenAddModal,
        onOpenReplaceModal,
        onDuplicateNode,
        onDeleteNode,
        onToggleLockNode,
      },
      selected: n.id === selectedNodeId,
    }));

    const rfEdges = [];
    nodes.forEach((n) => {
      let parent = n.parentId;
      if (!parent && rootId && n.id !== rootId) {
        // Connect to root if no parent
        parent = rootId;
      }

      if (parent) {
        rfEdges.push({
          id: `edge-${parent}-${n.id}`,
          source: parent,
          target: n.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2, opacity: 0.8 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
            width: 14,
            height: 14,
          },
        });
      }
    });

    return { flowNodes: rfNodes, flowEdges: rfEdges };
  }, [nodes, selectedNodeId, onSelectNode, onOpenAddModal, onOpenReplaceModal, onDuplicateNode, onDeleteNode, onToggleLockNode]);

  const [rfNodesState, setNodesState, onNodesChange] = useNodesState(flowNodes);
  const [rfEdgesState, setEdgesState, onEdgesChange] = useEdgesState(flowEdges);

  // Sync when prop nodes update
  useEffect(() => {
    setNodesState(flowNodes);
    setEdgesState(flowEdges);
  }, [flowNodes, flowEdges, setNodesState, setEdgesState]);

  // Handle Drag Position Updates
  const handleNodeDragStop = useCallback(
    (event, node) => {
      if (onUpdateNodeCoordinates) {
        onUpdateNodeCoordinates(node.id, Math.round(node.position.x), Math.round(node.position.y));
      }
    },
    [onUpdateNodeCoordinates]
  );

  // Trigger Dagre Auto-Arrange
  const handleDagreAutoLayout = useCallback(() => {
    const { layoutedNodes, layoutedEdges } = layoutGraphWithDagre(rfNodesState, rfEdgesState, 'LR');
    setNodesState([...layoutedNodes]);
    setEdgesState([...layoutedEdges]);

    // Persist new coordinates back to parent store
    layoutedNodes.forEach((ln) => {
      if (onUpdateNodeCoordinates) {
        onUpdateNodeCoordinates(ln.id, Math.round(ln.position.x), Math.round(ln.position.y));
      }
    });

    if (onAutoLayout) onAutoLayout();
  }, [rfNodesState, rfEdgesState, onUpdateNodeCoordinates, onAutoLayout, setNodesState, setEdgesState]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0a0a0a' }}>
      {/* Dagre Auto-Arrange Overlay Button */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={handleDagreAutoLayout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'rgba(26, 26, 31, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          <Workflow size={14} color="#6366f1" />
          <span>Auto-Arrange Graph (Dagre)</span>
        </button>
      </div>

      <ReactFlow
        nodes={rfNodesState}
        edges={rfEdgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1f1f28" gap={24} size={1} />
        <Controls
          style={{
            background: '#1a1a1f',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        />
        <MiniMap
          nodeColor={(n) => {
            const cfg = TYPE_CONFIG[n.data?.type] || TYPE_CONFIG.destination;
            return cfg.color;
          }}
          maskColor="rgba(10, 10, 10, 0.75)"
          style={{
            background: '#141418',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </ReactFlow>
    </div>
  );
}
