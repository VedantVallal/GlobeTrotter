'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Share2,
  Settings,
  Search,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Send,
  Trash2,
  CheckCircle2,
  Compass,
  MapPin,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Move,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ShareModal from '@/components/ui/ShareModal';
import { tripService, cityService, activityService, aiService, playgroundService } from '@/lib/services';
import { mockCities } from '@/lib/data/mockCities';
import { mockActivities } from '@/lib/data/mockActivities';
import { formatCurrency, formatDateRange } from '@/lib/utils/formatters';
import styles from './playground.module.css';

export default function PlaygroundPage({ params }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;
  const router = useRouter();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('Saved');

  // Left Panel State
  const [exploreTab, setExploreTab] = useState('cities'); // 'cities' | 'places' | 'activities'
  const [exploreQuery, setExploreQuery] = useState('');

  // Center Canvas State
  const [nodes, setNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Right Panel AI State
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello Alex! I'm your GlobeTrotter AI Copilot. I've analyzed your stops and can suggest optimized timing, budget stays, or hidden gems. How can I help?",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Mobile Active Tab
  const [mobileTab, setMobileTab] = useState('journey'); // 'explore' | 'journey' | 'copilot'
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Load trip and initialize canvas nodes
  useEffect(() => {
    async function loadTripData() {
      try {
        const loadedTrip = await tripService.getTripById(tripId);
        if (loadedTrip) {
          setTrip(loadedTrip);

          // Check for previously saved persistent nodes
          const savedNodes = await playgroundService.getNodes(tripId);
          if (savedNodes && Array.isArray(savedNodes) && savedNodes.length > 0) {
            setNodes(savedNodes);
            setSelectedNodeId(savedNodes[0].id);
            return;
          }

          // Build canvas nodes based on trip stops or default cities
          const initialNodes = (loadedTrip.destinations || ['Goa', 'Mumbai']).map((city, idx) => {
            const cityData = mockCities.find((c) => c.name.toLowerCase() === city.toLowerCase()) || {
              id: `node-${idx}`,
              name: city,
              country: 'India',
              image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&fit=crop',
              costPerDay: '$65',
            };

            // Calculated visual positioning on canvas
            const step = 260;
            return {
              id: `node-${city}-${idx}`,
              name: cityData.name,
              country: cityData.country,
              image: cityData.image,
              costPerDay: cityData.costPerDay,
              x: 180 + idx * step,
              y: 220 + (idx % 2 === 0 ? -40 : 50),
              activitiesCount: 2 + idx,
              stayDays: 2,
            };
          });

          setNodes(initialNodes);
          if (initialNodes.length > 0) {
            setSelectedNodeId(initialNodes[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load playground trip', err);
      } finally {
        setLoading(false);
      }
    }
    loadTripData();
  }, [tripId]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0] || null;
  }, [nodes, selectedNodeId]);

  // Node Manipulation
  const handleAddStop = (cityName) => {
    if (nodes.some((n) => n.name.toLowerCase() === cityName.toLowerCase())) return;

    setSaveStatus('Saving...');
    const cityData = mockCities.find((c) => c.name.toLowerCase() === cityName.toLowerCase()) || {
      name: cityName,
      country: 'Travel Stop',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&fit=crop',
      costPerDay: '$75',
    };

    const newNode = {
      id: `node-${cityName}-${Date.now()}`,
      name: cityData.name,
      country: cityData.country,
      image: cityData.image,
      costPerDay: cityData.costPerDay,
      x: 180 + nodes.length * 240,
      y: 220 + (nodes.length % 2 === 0 ? -40 : 40),
      activitiesCount: 1,
      stayDays: 2,
    };

    const updated = [...nodes, newNode];
    setNodes(updated);
    setSelectedNodeId(newNode.id);
    playgroundService.saveNodes(tripId, updated);
    tripService.updateTrip(tripId, {
      stopsCount: updated.length,
      destinations: updated.map((n) => n.name),
    });
    setTimeout(() => setSaveStatus('Saved'), 600);
  };

  const handleRemoveStop = (nodeId) => {
    if (nodes.length <= 1) return;
    setSaveStatus('Saving...');
    const updated = nodes.filter((n) => n.id !== nodeId);
    setNodes(updated);
    setSelectedNodeId(updated[0]?.id || null);
    playgroundService.saveNodes(tripId, updated);
    tripService.updateTrip(tripId, {
      stopsCount: updated.length,
      destinations: updated.map((n) => n.name),
    });
    setTimeout(() => setSaveStatus('Saved'), 600);
  };

  // AI Chat Handlers
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim() || isAiTyping) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);

    try {
      const response = await aiService.generateSuggestions({
        prompt: query,
        tripContext: trip,
        stops: nodes.map((n) => n.name),
      });

      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text || "I've tailored a custom recommendation based on your travel nodes. You can apply these activities directly.",
        suggestionAction: response.suggestedActivity || null,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Filtered Explore List
  const filteredCities = useMemo(() => {
    return mockCities.filter((c) =>
      c.name.toLowerCase().includes(exploreQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(exploreQuery.toLowerCase())
    );
  }, [exploreQuery]);

  const filteredActivities = useMemo(() => {
    return mockActivities.filter((a) =>
      a.name.toLowerCase().includes(exploreQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(exploreQuery.toLowerCase())
    );
  }, [exploreQuery]);

  // Generate SVG curve points between nodes
  const svgPathData = useMemo(() => {
    if (nodes.length < 2) return '';
    let path = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 0; i < nodes.length - 1; i++) {
      const curr = nodes[i];
      const next = nodes[i + 1];
      const midX = (curr.x + next.x) / 2;
      path += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  }, [nodes]);

  // Canvas Scrolling & Mouse Pan Handlers
  const canvasScrollRef = useRef(null);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const canvasWidth = useMemo(() => Math.max(1200, (nodes.length + 1) * 280), [nodes.length]);
  const canvasHeight = 650;

  const handleCanvasMouseDown = (e) => {
    if (e.target.closest(`.${styles.nodeMarker}`) || e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    setIsPanning(true);
    const container = canvasScrollRef.current;
    if (container) {
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
      };
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isPanning || !canvasScrollRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    canvasScrollRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
    canvasScrollRef.current.scrollTop = panStartRef.current.scrollTop - dy;
  };

  // Dynamic Collapsible Panels (Desktop & Tablet) & Fullscreen Studio
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
      setIsFullscreen(true);
    } else {
      if (typeof document !== 'undefined' && document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  if (loading || !trip) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--gt-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={32} color="var(--gt-blue)" className={styles.typingDot} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--gt-text-secondary)', fontSize: 14 }}>Loading visual workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.playgroundRoot} ${isFullscreen ? styles.fullscreenRoot : ''}`}>
      {/* 52px Compact Playground Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/trips" className={styles.backBtn} title="Back to My Trips">
            <ArrowLeft size={16} />
          </Link>

          <div className={styles.tripTitle} title={trip.title}>
            {trip.title}
          </div>

          <div className={styles.headerMeta}>
            <span className={styles.headerMetaItem}>
              <Calendar size={13} />
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </span>

            <span className={styles.headerMetaItem}>
              <Users size={13} />
              <span>{trip.travelers || 2} Travelers</span>
            </span>

            <span
              style={{
                background: 'var(--gt-blue-light)',
                color: 'var(--gt-blue)',
                padding: '2px 8px',
                borderRadius: 'var(--gt-radius-full)',
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              {formatCurrency(trip.budget)} Budget
            </span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.saveStatus}>
            <CheckCircle2 size={13} />
            <span>{saveStatus}</span>
          </div>

          {/* Dynamic Studio Panel Toggles (Desktop & Tablet) */}
          <div className={styles.headerPanelToggles}>
            <button
              type="button"
              className={`${styles.panelToggleBtn} ${leftPanelOpen ? styles.panelToggleBtnActive : ''}`}
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              title={leftPanelOpen ? "Close Locations Window" : "Open Locations Window"}
            >
              <Compass size={14} />
              <span className={styles.headerBtnText}>Locations</span>
            </button>

            <button
              type="button"
              className={`${styles.panelToggleBtn} ${rightPanelOpen ? styles.panelToggleBtnActive : ''}`}
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              title={rightPanelOpen ? "Close AI Copilot Window" : "Open AI Copilot Window"}
            >
              <Sparkles size={14} />
              <span className={styles.headerBtnText}>AI Copilot</span>
            </button>
          </div>

          {/* Fullscreen Studio Mode Toggle */}
          <button
            type="button"
            className={`${styles.headerIconBtn} ${isFullscreen ? styles.headerIconBtnActive : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen Studio" : "Full Screen Studio Mode"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <Link href={`/itinerary/${trip.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" title="View Itinerary">
              <Calendar size={14} />
              <span className={styles.headerBtnText}>Itinerary</span>
            </Button>
          </Link>

          <Link href={`/budget/${trip.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" title="View Budget">
              <DollarSign size={14} />
              <span className={styles.headerBtnText}>Budget</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            title="Share Trip"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 size={14} />
            <span className={styles.headerBtnText}>Share</span>
          </Button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className={styles.mobileTabs}>
        <button
          className={`${styles.mobileTabBtn} ${mobileTab === 'explore' ? styles.mobileTabBtnActive : ''}`}
          onClick={() => setMobileTab('explore')}
        >
          Explore ({mockCities.length})
        </button>
        <button
          className={`${styles.mobileTabBtn} ${mobileTab === 'journey' ? styles.mobileTabBtnActive : ''}`}
          onClick={() => setMobileTab('journey')}
        >
          Journey Canvas ({nodes.length} stops)
        </button>
        <button
          className={`${styles.mobileTabBtn} ${mobileTab === 'copilot' ? styles.mobileTabBtnActive : ''}`}
          onClick={() => setMobileTab('copilot')}
        >
          AI Copilot ✨
        </button>
      </div>

      {/* 3-Panel Workspace */}
      <div className={styles.workspace}>
        {/* Left Panel: Explore Library */}
        <div
          className={`${styles.leftPanel} ${mobileTab === 'explore' ? styles.panelActive : ''} ${!leftPanelOpen ? styles.panelClosed : ''
            }`}
        >
          <div className={styles.panelHeader}>
            <div className={styles.panelHeaderTitleRow}>
              <div className={styles.panelHeaderTitle}>
                <Compass size={15} color="var(--gt-blue)" />
                <span>Locations & Activities</span>
              </div>
              <button
                type="button"
                className={styles.panelCloseBtn}
                onClick={() => {
                  setLeftPanelOpen(false);
                  if (mobileTab === 'explore') setMobileTab('journey');
                }}
                title="Close Locations Window"
              >
                <X size={14} />
              </button>
            </div>

            <div className={styles.searchWrapper}>
              <Search size={14} color="var(--gt-text-muted)" />
              <input
                type="text"
                placeholder="Search destinations & activities..."
                value={exploreQuery}
                onChange={(e) => setExploreQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.underlineTabs}>
            <button
              className={`${styles.underlineTab} ${exploreTab === 'cities' ? styles.underlineTabActive : ''}`}
              onClick={() => setExploreTab('cities')}
            >
              Destinations
            </button>
            <button
              className={`${styles.underlineTab} ${exploreTab === 'activities' ? styles.underlineTabActive : ''}`}
              onClick={() => setExploreTab('activities')}
            >
              Activities
            </button>
          </div>

          <div className={styles.exploreScrollArea}>
            {exploreTab === 'cities' &&
              filteredCities.map((city) => {
                const isAdded = nodes.some((n) => n.name.toLowerCase() === city.name.toLowerCase());
                return (
                  <div key={city.id} className={styles.exploreItem}>
                    <img src={city.image} alt={city.name} className={styles.exploreThumb} />
                    <div className={styles.exploreInfo}>
                      <div className={styles.exploreName}>{city.name}</div>
                      <div className={styles.exploreSub}>{city.country}</div>
                      <div className={styles.exploreCost}>{city.costPerDay}/day</div>
                    </div>
                    {isAdded ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ color: 'var(--gt-error)', fontSize: 11 }}
                        onClick={() => {
                          const targetNode = nodes.find((n) => n.name.toLowerCase() === city.name.toLowerCase());
                          if (targetNode) handleRemoveStop(targetNode.id);
                        }}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        style={{ fontSize: 11 }}
                        onClick={() => handleAddStop(city.name)}
                      >
                        <Plus size={13} />
                        <span>Add</span>
                      </Button>
                    )}
                  </div>
                );
              })}

            {exploreTab === 'activities' &&
              filteredActivities.map((act) => (
                <div key={act.id} className={styles.exploreItem}>
                  <div className={styles.exploreInfo}>
                    <div className={styles.exploreName}>{act.name}</div>
                    <div className={styles.exploreSub}>
                      {act.category} • {act.duration} mins
                    </div>
                    <div className={styles.exploreCost}>{formatCurrency(act.estimatedCost)}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ fontSize: 11 }}
                    onClick={() => {
                      if (selectedNode) {
                        setSaveStatus('Saving...');
                        setTimeout(() => setSaveStatus('Saved'), 500);
                      }
                    }}
                  >
                    + Assign
                  </Button>
                </div>
              ))}
          </div>
        </div>

        {/* Center Panel: Journey Canvas */}
        <div className={`${styles.canvasPanel} ${mobileTab === 'journey' ? styles.panelActive : ''}`}>
          {/* Dock Reopen Pills for Collapsed Left & Right Panels */}
          {!leftPanelOpen && (
            <button
              type="button"
              className={styles.dockReopenLeft}
              onClick={() => setLeftPanelOpen(true)}
              title="Open Locations Window"
            >
              <Compass size={14} />
              <span>Locations</span>
              <ChevronRight size={13} />
            </button>
          )}

          {!rightPanelOpen && (
            <button
              type="button"
              className={styles.dockReopenRight}
              onClick={() => setRightPanelOpen(true)}
              title="Open AI Copilot Window"
            >
              <ChevronLeft size={13} />
              <Sparkles size={14} />
              <span>AI Copilot</span>
            </button>
          )}

          {/* Scrollable & pannable canvas viewport */}
          <div
            ref={canvasScrollRef}
            className={`${styles.canvasScrollArea} ${isPanning ? styles.isPanning : ''}`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            <div
              className={styles.canvasInner}
              style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                minWidth: `${canvasWidth}px`,
                minHeight: `${canvasHeight}px`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: '0 0',
              }}
            >
              {/* SVG Connecting Route Line */}
              <svg
                className={styles.canvasSvgOverlay}
                width={canvasWidth}
                height={canvasHeight}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              >
                <defs>
                  <linearGradient id="route-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4169D8" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {svgPathData && (
                  <path
                    d={svgPathData}
                    fill="none"
                    stroke="url(#route-line-grad)"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                  />
                )}
              </svg>

              {/* Destination Stops Visual Nodes */}
              {nodes.map((node, index) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    className={styles.nodeMarker}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <div className={`${styles.nodePin} ${isSelected ? styles.nodePinSelected : ''}`}>
                      {index + 1}
                    </div>
                    <div className={styles.nodeLabel}>{node.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas guidance badge */}
          <div className={styles.canvasHint}>
            <Move size={12} />
            <span>Drag or scroll to explore stops</span>
          </div>

          {/* Floating Canvas Controls (Pinned Top-Right) */}
          <div className={styles.canvasControls}>
            <button
              className={styles.canvasControlBtn}
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.6))}
              title="Zoom In"
            >
              <Plus size={16} />
            </button>
            <button
              className={styles.canvasControlBtn}
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.6))}
              title="Zoom Out"
            >
              <Minus size={16} />
            </button>
            <button
              className={styles.canvasControlBtn}
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Selected Node Inspector Card (Pinned Bottom-Center) */}
          {selectedNode && (
            <div className={styles.inspectorCard}>
              <img src={selectedNode.image} alt={selectedNode.name} className={styles.inspectorThumb} />
              <div className={styles.inspectorInfo}>
                <div className={styles.inspectorTitle}>
                  {selectedNode.name}, {selectedNode.country}
                </div>
                <div className={styles.inspectorSubtitle}>
                  Est. {selectedNode.costPerDay}/day • {selectedNode.activitiesCount} activities scheduled
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <Link href={`/itinerary/${trip.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm">
                    Schedule
                  </Button>
                </Link>
                {nodes.length > 1 && (
                  <button
                    className={styles.canvasControlBtn}
                    style={{ width: 32, height: 32, color: 'var(--gt-error)' }}
                    onClick={() => handleRemoveStop(selectedNode.id)}
                    title="Remove stop"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: AI Copilot */}
        <div
          className={`${styles.rightPanel} ${mobileTab === 'copilot' ? styles.panelActive : ''} ${!rightPanelOpen ? styles.panelClosed : ''
            }`}
        >
          <div className={styles.copilotHeader}>
            <div className={styles.copilotTitle}>
              <Sparkles size={16} />
              <span>AI Copilot</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 11,
                  color: 'var(--gt-text-muted)',
                }}
                onClick={() => setMessages([messages[0]])}
              >
                Clear
              </button>
              <button
                type="button"
                className={styles.panelCloseBtn}
                onClick={() => {
                  setRightPanelOpen(false);
                  if (mobileTab === 'copilot') setMobileTab('journey');
                }}
                title="Close AI Copilot Window"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className={styles.chatHistory}>
            {/* Quick Prompt Pills */}
            <div className={styles.promptChips}>
              <div
                className={styles.promptChip}
                onClick={() => handleSendMessage('Suggest 3 hidden food gems in Goa')}
              >
                🍲 Find hidden local foodie spots
              </div>
              <div
                className={styles.promptChip}
                onClick={() => handleSendMessage('How can I optimize route pacing between stops?')}
              >
                ⚡ Optimize stop pacing & transit
              </div>
              <div
                className={styles.promptChip}
                onClick={() => handleSendMessage('Recommend beach sunset spots for evening')}
              >
                🌅 Best sunset viewpoints
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.msgBubble} ${m.sender === 'user' ? styles.userMsg : styles.aiMsg}`}
              >
                {m.text}
              </div>
            ))}

            {isAiTyping && (
              <div className={`${styles.msgBubble} ${styles.aiMsg} ${styles.typingIndicator}`}>
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={styles.chatInputWrapper}
          >
            <input
              type="text"
              placeholder="Ask Copilot for tips or stops..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className={styles.chatInput}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!chatInput.trim() || isAiTyping}
              style={{ borderRadius: 'var(--gt-radius-full)', padding: '6px 12px' }}
            >
              <Send size={13} />
            </Button>
          </form>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
