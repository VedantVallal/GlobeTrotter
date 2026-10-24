'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo, use, useCallback } from 'react';
import dynamicImport from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Share2,
  DollarSign,
  Compass,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit2,
  Layers,
  HelpCircle,
  Menu,
  Search,
  Check,
} from 'lucide-react';
import ShareModal from '@/components/ui/ShareModal';
import { tripService, itineraryService, playgroundService, budgetService } from '@/lib/services';
import { generateSynchronizedTripPlan, generateMindMapFromItinerary, generateBlankManualTripPlan } from '@/lib/services/tripGenerator';
import { formatCurrency, formatDateRange, formatDate, CURRENCIES, convertCurrency } from '@/lib/utils/formatters';
import citiesData from '@/lib/data/citiesData.json';
import styles from './itinerary.module.css';

// Dynamic SSR-safe TripGeoMap
const TripGeoMap = dynamicImport(() => import('@/components/playground/TripGeoMap'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: 13, background: '#f8fafc' }}>
      Loading Interactive Map...
    </div>
  ),
});

// Dynamic SSR-safe TripCanvas for Embedded Mind Map
const TripCanvas = dynamicImport(() => import('@/components/playground/TripCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: 13, background: '#f8fafc' }}>
      Loading Mind Map Playground...
    </div>
  ),
});

// Category color badges
const CATEGORY_COLORS = {
  Sightseeing: '#2563eb',
  Beach: '#0284c7',
  Heritage: '#7c3aed',
  Food: '#ea580c',
  Adventure: '#059669',
  Culture: '#4f46e5',
  Transport: '#475569',
  Stay: '#d97706',
};

export default function TripPlanningInterface({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.tripId;

  // Active View Tab: 'overview' | 'itinerary' | 'budget'
  const [activeTab, setActiveTab] = useState('overview');

  // Sidebar toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Core Data
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & UI States
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPlaceForAdd, setSelectedPlaceForAdd] = useState(null);
  const [exploreFilter, setExploreFilter] = useState('All');
  const [itinerarySearch, setItinerarySearch] = useState('');

  // Mind Map Generated State
  const [mindMapGenerated, setMindMapGenerated] = useState(false);
  const [mindMapNodes, setMindMapNodes] = useState([]);

  // Budget State with Multiple Currency Options (Clean slate: empty by default)
  const [expenses, setExpenses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [budgetSort, setBudgetSort] = useState('low-to-high');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editedBudgetAmount, setEditedBudgetAmount] = useState(50000);

  // Manual Add Place / Activity Modal for User Planning
  const [manualPlaceModal, setManualPlaceModal] = useState({
    isOpen: false,
    targetDay: 1,
  });
  const [manualPlaceForm, setManualPlaceForm] = useState({
    name: '',
    category: 'Sightseeing',
    time: '10:00 AM',
    duration: 90,
    cost: '',
    location: '',
  });

  // Add Expense & Select Item Modals
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [selectItemModalOpen, setSelectItemModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'Flight',
    icon: '✈️',
    amount: '',
    paidBy: 'You (the globe trotter)',
    split: "Don't split",
    date: '',
  });

  // AI assistant chat state
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your Travel Assistant for this journey. How can I assist you with sights, food, or pacing?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // 1. Initial Load of Trip & Itinerary
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let loadedTrip = await tripService.getTripById(tripId);
        let loadedDays = await itineraryService.getItinerary(tripId);
        let loadedNodes = await playgroundService.getNodes(tripId);

        // Fallback default if new trip
        if (!loadedTrip) {
          loadedTrip = {
            id: tripId,
            title: 'Trip to Pune',
            destination: 'Pune',
            destinations: ['Pune'],
            startDate: '2026-10-29',
            endDate: '2026-11-03',
            budget: 50000,
            currency: 'INR',
            travelers: 2,
            coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop',
          };
        }

        // Load custom expenses from storage (Clean slate)
        try {
          const storedExp = localStorage.getItem(`gt_expenses_${tripId}`);
          if (storedExp) {
            setExpenses(JSON.parse(storedExp));
          } else {
            setExpenses([]);
          }
        } catch (e) {
          setExpenses([]);
        }

        // Load preferred currency for budget
        try {
          const prefCurr = localStorage.getItem(`gt_pref_curr_${tripId}`);
          if (prefCurr) {
            setSelectedCurrency(prefCurr);
          } else if (loadedTrip.currency) {
            setSelectedCurrency(loadedTrip.currency);
          }
        } catch (e) { }

        // If itinerary days missing, generate structured blank days for user manual planning
        if (!loadedDays || loadedDays.length === 0) {
          const dest = loadedTrip.destinations?.[0] || loadedTrip.destination || 'Pune';
          const plan = generateBlankManualTripPlan({
            tripId,
            startLocation: `${dest}, India`,
            destinations: [dest],
            budget: loadedTrip.budget || 50000,
            currency: loadedTrip.currency || 'INR',
            startDate: loadedTrip.startDate || '2026-10-29',
            endDate: loadedTrip.endDate || '2026-11-03',
            travelers: loadedTrip.travelers || 2,
          });
          loadedDays = plan.itineraryDays;
          loadedNodes = plan.nodes;
          itineraryService.saveItinerary(tripId, loadedDays);
          playgroundService.saveNodes(tripId, loadedNodes);
        }

        setTrip(loadedTrip);
        setDays(loadedDays);
        setNodes(loadedNodes || []);
        setEditedBudgetAmount(loadedTrip.budget || 50000);
      } catch (err) {
        console.error('Failed to load trip planning data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tripId]);

  // Destination info from dataset
  const currentCityInfo = useMemo(() => {
    const dest = trip?.destinations?.[0] || trip?.destination || 'Pune';
    return (
      citiesData.find((c) => c.name.toLowerCase() === dest.toLowerCase()) || {
        name: dest,
        country: 'India',
        image: trip?.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop',
        description: 'Vibrant cultural destination featuring rich heritage, historic sights, and local dining.',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        destinations: [
          { name: 'Historic Shaniwar Wada', category: 'Heritage', price: 100 },
          { name: 'Aga Khan Palace & Memorial', category: 'Culture', price: 150 },
          { name: 'Sinhagad Fort Mountain Vista', category: 'Adventure', price: 200 },
        ],
        food: [
          { name: 'Authentic Maharashtrian Thali', category: 'Food', price: 450 },
          { name: 'Heritage Bakery & Chai Tasting', category: 'Food', price: 200 },
        ],
        stays: [
          { name: 'Heritage Boutique Stay', category: 'Stay', price: 3500 },
        ],
      }
    );
  }, [trip]);

  // Synchronize map nodes with current day-wise itinerary changes
  const synchronizedMapNodes = useMemo(() => {
    if (!days || days.length === 0) return nodes;

    const mapNodes = [];
    const dest = trip?.destinations?.[0] || trip?.destination || 'Pune';
    const cityCoords = currentCityInfo?.coordinates || { lat: 18.5204, lng: 73.8567 };

    // City root node
    mapNodes.push({
      id: `node-city-${tripId}`,
      type: 'city',
      title: dest,
      category: 'Sightseeing',
      dayNumber: 1,
      order: 0,
      coordinates: cityCoords,
    });

    // Activities as map pins
    days.forEach((dayItem, dIdx) => {
      (dayItem.activities || []).forEach((act, aIdx) => {
        // Deterministic offset around city center for accurate visual clustering
        const angle = (dIdx * 60 + aIdx * 45) * (Math.PI / 180);
        const radius = 0.02 + (aIdx * 0.012);
        const lat = cityCoords.lat + Math.sin(angle) * radius;
        const lng = cityCoords.lng + Math.cos(angle) * radius;

        mapNodes.push({
          id: act.id || `node-act-${dayItem.day}-${aIdx}`,
          type: act.category === 'Food' ? 'food' : 'destination',
          title: act.name,
          category: act.category || 'Sightseeing',
          dayNumber: dayItem.day,
          order: aIdx + 1,
          time: act.time || '10:00 AM',
          estimatedCost: act.cost || 0,
          coordinates: { lat, lng },
        });
      });
    });

    return mapNodes;
  }, [days, nodes, trip, currentCityInfo, tripId]);

  // Synchronize Itinerary days changes back to Playground nodes and map
  const syncDaysToPlayground = useCallback(
    (updatedDays) => {
      const dest = trip?.destinations?.[0] || trip?.destination || 'Pune';
      const cityCoords = currentCityInfo?.coordinates || { lat: 18.5204, lng: 73.8567 };

      const newNodes = [
        {
          id: `node-city-${tripId}`,
          type: 'city',
          parentId: null,
          tripId,
          title: dest,
          description: `Primary destination for your trip.`,
          order: 0,
          dayNumber: 1,
          currency: trip?.currency || 'USD',
          category: 'Sightseeing',
          coordinates: cityCoords,
          x: 100,
          y: 120,
        },
      ];

      updatedDays.forEach((dayItem, dIdx) => {
        (dayItem.activities || []).forEach((act, aIdx) => {
          const angle = (dIdx * 60 + aIdx * 45) * (Math.PI / 180);
          const radius = 0.02 + aIdx * 0.012;
          const lat = cityCoords.lat + Math.sin(angle) * radius;
          const lng = cityCoords.lng + Math.cos(angle) * radius;

          newNodes.push({
            id: act.id || `node-act-${dayItem.day}-${aIdx}`,
            type: act.category === 'Food' ? 'food' : 'destination',
            parentId: `node-city-${tripId}`,
            tripId,
            title: act.name,
            category: act.category || 'Sightseeing',
            dayNumber: dayItem.day,
            order: aIdx + 1,
            time: act.time || '10:00 AM',
            duration: `${act.duration || 60} min`,
            estimatedCost: act.cost || 0,
            currency: trip?.currency || 'USD',
            location: act.location || dest,
            coordinates: { lat, lng },
            x: 250 + dIdx * 180,
            y: 80 + aIdx * 120,
          });
        });
      });

      setNodes(newNodes);
      playgroundService.saveNodes(tripId, newNodes);
    },
    [trip, currentCityInfo, tripId]
  );

  // ADD PLACE TO SPECIFIC DAY
  const handleAddPlaceToDay = (place, targetDayNum = 1) => {
    const newAct = {
      id: `act-${Date.now()}`,
      time: '02:00 PM',
      name: place.name || 'New Selected Spot',
      category: place.category || 'Sightseeing',
      duration: 90,
      cost: place.price || 0,
      location: currentCityInfo.name,
      image: place.image || currentCityInfo.image,
    };

    const updated = days.map((d) => {
      if (d.day === targetDayNum) {
        return {
          ...d,
          activities: [...(d.activities || []), newAct],
        };
      }
      return d;
    });

    setDays(updated);
    itineraryService.saveItinerary(tripId, updated);
    syncDaysToPlayground(updated);
  };

  // CONFIRM CUSTOM MANUAL PLACE
  const handleConfirmManualPlace = (e) => {
    if (e) e.preventDefault();
    if (!manualPlaceForm.name.trim()) return;

    const newAct = {
      id: `act-${Date.now()}`,
      time: manualPlaceForm.time || '10:00 AM',
      name: manualPlaceForm.name.trim(),
      category: manualPlaceForm.category || 'Sightseeing',
      duration: Number(manualPlaceForm.duration) || 60,
      cost: Number(manualPlaceForm.cost) || 0,
      location: manualPlaceForm.location.trim() || currentCityInfo.name,
      image: currentCityInfo.image,
    };

    const updated = days.map((d) => {
      if (d.day === manualPlaceModal.targetDay) {
        return {
          ...d,
          activities: [...(d.activities || []), newAct],
        };
      }
      return d;
    });

    setDays(updated);
    itineraryService.saveItinerary(tripId, updated);
    syncDaysToPlayground(updated);

    setManualPlaceForm({
      name: '',
      category: 'Sightseeing',
      time: '10:00 AM',
      duration: 90,
      cost: '',
      location: '',
    });
    setManualPlaceModal({ isOpen: false, targetDay: 1 });
  };

  // REMOVE ACTIVITY
  const handleRemoveActivity = (dayNum, actId) => {
    const updated = days.map((d) => {
      if (d.day === dayNum) {
        return {
          ...d,
          activities: (d.activities || []).filter((a) => a.id !== actId),
        };
      }
      return d;
    });
    setDays(updated);
    itineraryService.saveItinerary(tripId, updated);
    syncDaysToPlayground(updated);
  };

  // REORDER ACTIVITIES (Up / Down)
  const handleMoveActivity = (dayNum, actIndex, direction) => {
    const updated = days.map((d) => {
      if (d.day === dayNum) {
        const acts = [...(d.activities || [])];
        const targetIndex = actIndex + direction;
        if (targetIndex >= 0 && targetIndex < acts.length) {
          const temp = acts[actIndex];
          acts[actIndex] = acts[targetIndex];
          acts[targetIndex] = temp;
        }
        return { ...d, activities: acts };
      }
      return d;
    });
    setDays(updated);
    itineraryService.saveItinerary(tripId, updated);
    syncDaysToPlayground(updated);
  };

  // CREATE MIND MAP TRIGGER
  const handleCreateMindMap = () => {
    const generated = generateMindMapFromItinerary(trip, days);
    setMindMapNodes(generated);
    setMindMapGenerated(true);
    playgroundService.saveNodes(tripId, generated);
  };

  // SAVE EDITED BUDGET
  const handleSaveBudget = () => {
    setIsEditingBudget(false);
    if (trip) {
      const baseCurrency = trip?.currency || 'USD';
      // If user edited budget while in another currency, convert back to base
      const budgetInBase = convertCurrency(Number(editedBudgetAmount), selectedCurrency, baseCurrency);
      tripService.update(tripId, { budget: Math.round(budgetInBase) });
      setTrip({ ...trip, budget: Math.round(budgetInBase) });
    }
  };

  // CURRENCY SWITCHER HANDLER
  const handleCurrencyChange = (newCurr) => {
    setSelectedCurrency(newCurr);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gt_pref_curr_${tripId}`, newCurr);
      } catch (e) { }
    }
  };

  // DYNAMIC MULTI-CURRENCY TOTALS
  const baseCurrency = trip?.currency || 'USD';
  const convertedBudget = convertCurrency(trip?.budget || 50000, baseCurrency, selectedCurrency);
  const totalExpensesSum = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const convertedExpensesSum = convertCurrency(totalExpensesSum, baseCurrency, selectedCurrency);
  const convertedRemaining = convertedBudget - convertedExpensesSum;

  // ADD EXPENSE
  const handleSaveNewExpense = (e) => {
    if (e) e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    // Convert new expense amount back to base trip currency for consistent internal math
    const inputAmount = Number(newExpense.amount);
    const amountInBase = convertCurrency(inputAmount, selectedCurrency, baseCurrency);

    const expenseItem = {
      id: `exp-${Date.now()}`,
      title: newExpense.title,
      category: newExpense.category,
      icon: newExpense.icon || '💳',
      amount: amountInBase,
      currency: baseCurrency,
      originalAmount: inputAmount,
      originalCurrency: selectedCurrency,
      paidBy: newExpense.paidBy,
      split: newExpense.split,
      date: newExpense.date || trip?.startDate || '2026-10-29',
    };

    const updatedExpenses = [expenseItem, ...expenses];
    setExpenses(updatedExpenses);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gt_expenses_${tripId}`, JSON.stringify(updatedExpenses));
      } catch (e) { }
    }

    setAddExpenseModalOpen(false);
    setNewExpense({
      title: '',
      category: 'Flight',
      icon: '✈️',
      amount: '',
      paidBy: 'You (the globe trotter)',
      split: "Don't split",
      date: '',
    });
  };

  // DELETE EXPENSE
  const handleDeleteExpense = (expId) => {
    const updated = expenses.filter((e) => e.id !== expId);
    setExpenses(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gt_expenses_${tripId}`, JSON.stringify(updated));
      } catch (e) { }
    }
  };

  // Sorted Expenses
  const sortedExpenses = useMemo(() => {
    const list = [...expenses];
    if (budgetSort === 'low-to-high') {
      list.sort((a, b) => a.amount - b.amount);
    } else {
      list.sort((a, b) => b.amount - a.amount);
    }
    return list;
  }, [expenses, budgetSort]);

  // AI Assistant Chat Send
  const handleSendChat = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    // Contextual intelligent response
    setTimeout(() => {
      let reply = `For your trip to ${trip?.destinations?.[0] || 'Pune'}, I recommend pacing your activities between 09:30 AM and 04:30 PM. Would you like me to optimize transit routes or add local food stops?`;
      if (userText.toLowerCase().includes('food') || userText.toLowerCase().includes('eat')) {
        reply = `Top dining recommendation: Try local authentic specialties and popular bakeries in ${trip?.destinations?.[0] || 'Pune'}. You can add them with one click from the Overview tab!`;
      } else if (userText.toLowerCase().includes('map') || userText.toLowerCase().includes('mind map')) {
        reply = `Your mind map visually branches each day and its stops directly from your itinerary. Click 'Create Mind Map' in the Itinerary tab to generate it!`;
      }
      setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 600);
  };

  if (loading || !trip) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <p style={{ color: '#64748b', fontSize: 15, fontWeight: 600 }}>Loading travel workspace...</p>
      </div>
    );
  }

  const destinationName = trip.destinations?.[0] || trip.destination || 'Pune';

  return (
    <div className={styles.itineraryRoot}>
      {/* Top Application Bar */}
      <header className={styles.topNav}>
        <div className={styles.topNavLeft}>
          <Link href="/trips" className={styles.backBtn}>
            <ArrowLeft size={16} />
            <span>My Trips</span>
          </Link>
          <div className={styles.topNavTitle}>{trip.title}</div>
        </div>

        <div className={styles.topNavRight}>
          <Link href={`/playground/${trip.id}`} style={{ textDecoration: 'none' }}>
            <button type="button" className={styles.topActionBtn}>
              <Layers size={14} color="#2563eb" />
              <span>Trip Canvas</span>
            </button>
          </Link>

          <button type="button" className={styles.topActionBtn} onClick={() => setShareModalOpen(true)}>
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* 3-Column Planning Workspace */}
      <div className={styles.workspaceLayout}>
        {/* 1. Left Sidebar Navigation */}
        <aside className={`${styles.leftSidebar} ${sidebarCollapsed ? styles.leftSidebarCollapsed : ''}`}>
          <div className={styles.sidebarTopSection}>
            {/* AI Assistant Button */}
            <button
              type="button"
              className={styles.aiAssistantBtn}
              onClick={() => setAiAssistantOpen((prev) => !prev)}
              title="Open AI Travel Assistant"
            >
              <Sparkles size={16} />
              {!sidebarCollapsed && <span>AI Assistant</span>}
            </button>

            {/* Sidebar Navigation Items */}
            <nav className={styles.sidebarNavList}>
              <button
                type="button"
                className={`${styles.sidebarNavItem} ${activeTab === 'overview' ? styles.sidebarNavItemActive : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span className={styles.sidebarNavIcon}>&gt;</span>
                {!sidebarCollapsed && <span>Overview</span>}
              </button>

              <button
                type="button"
                className={`${styles.sidebarNavItem} ${activeTab === 'itinerary' ? styles.sidebarNavItemActive : ''}`}
                onClick={() => setActiveTab('itinerary')}
              >
                <span className={styles.sidebarNavIcon}>&gt;</span>
                {!sidebarCollapsed && <span>Itinerary</span>}
              </button>

              <button
                type="button"
                className={`${styles.sidebarNavItem} ${activeTab === 'budget' ? styles.sidebarNavItemActive : ''}`}
                onClick={() => setActiveTab('budget')}
              >
                <span className={styles.sidebarNavIcon}>&gt;</span>
                {!sidebarCollapsed && <span>Budget</span>}
              </button>
            </nav>
          </div>

          <div className={styles.sidebarBottomSection}>
            <button
              type="button"
              className={styles.sidebarFooterBtn}
              onClick={() => alert('GlobeTrotter Support: Reach out at support@globetrotter.travel for assistance.')}
            >
              <HelpCircle size={14} />
              {!sidebarCollapsed && <span>Support</span>}
            </button>

            <button
              type="button"
              className={styles.sidebarFooterBtn}
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              <Menu size={14} />
              {!sidebarCollapsed && <span>Hide sidebar</span>}
            </button>
          </div>
        </aside>

        {/* AI Assistant Slideout Drawer */}
        {aiAssistantOpen && (
          <div className={styles.aiCopilotDrawer}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                <Sparkles size={16} color="#f95c47" />
                <span>AI Travel Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setAiAssistantOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
                    color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontSize: 13,
                    maxWidth: '85%',
                    lineHeight: 1.45,
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} style={{ padding: 12, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Ask advice, route questions..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, outline: 'none' }}
              />
              <button
                type="submit"
                style={{ background: '#f95c47', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* 2. Center Content Column */}
        <main className={styles.centerContentArea}>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              {/* Trip Hero Banner Card */}
              <div className={styles.overviewHeroCard}>
                <img
                  src={currentCityInfo.image}
                  alt={trip.title}
                  className={styles.heroImageBanner}
                />
                <div className={styles.heroContentOverlay}>
                  <h1 className={styles.heroTripTitle}>{trip.title}</h1>
                  <div className={styles.heroTripMeta}>
                    <span className={styles.heroMetaBadge}>
                      <Calendar size={14} color="#f95c47" />
                      <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                    </span>
                    <span>•</span>
                    <span className={styles.heroMetaBadge}>
                      <Clock size={14} color="#2563eb" />
                      <span>{days.length} days planned</span>
                    </span>
                    <span>•</span>
                    <span className={styles.heroMetaBadge}>
                      <DollarSign size={14} color="#059669" />
                      <span>Budget: {formatCurrency(trip.budget)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Explore Section */}
              <h2 className={styles.exploreSectionTitle}>Explore</h2>

              {/* Filter category pills */}
              <div className={styles.exploreFilterPills}>
                {['All', 'Attractions', 'Food', 'Culture'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.filterPill} ${exploreFilter === cat ? styles.filterPillActive : ''}`}
                    onClick={() => setExploreFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 3 Highlighted Cards matching PDF Page 1 */}
              <div className={styles.exploreCardsRow}>
                {/* 1. Best attractions */}
                <div className={styles.exploreCuratedCard}>
                  <img
                    src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=500&fit=crop"
                    alt="Best attractions"
                    className={styles.exploreCuratedCardImg}
                  />
                  <div className={styles.exploreCuratedCardBody}>
                    <span className={styles.exploreCardTag}>Most often seen on the web</span>
                    <div className={styles.exploreCardTitle}>Best attractions in {destinationName}</div>
                    <button
                      type="button"
                      className={styles.exploreCardBtn}
                      onClick={() => handleAddPlaceToDay({ name: `Iconic Landmark in ${destinationName}`, category: 'Heritage', price: 200 }, 1)}
                    >
                      <Plus size={13} />
                      <span>Add to Day 1</span>
                    </button>
                  </div>
                </div>

                {/* 2. Best restaurants */}
                <div className={styles.exploreCuratedCard}>
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&fit=crop"
                    alt="Best restaurants"
                    className={styles.exploreCuratedCardImg}
                  />
                  <div className={styles.exploreCuratedCardBody}>
                    <span className={styles.exploreCardTag}>Most often seen on the web</span>
                    <div className={styles.exploreCardTitle}>Best restaurants in {destinationName}</div>
                    <button
                      type="button"
                      className={styles.exploreCardBtn}
                      onClick={() => handleAddPlaceToDay({ name: `Traditional Regional Kitchen`, category: 'Food', price: 500 }, 1)}
                    >
                      <Plus size={13} />
                      <span>Add to Day 1</span>
                    </button>
                  </div>
                </div>

                {/* 3. Scenic Viewpoints & Experiences */}
                <div className={styles.exploreCuratedCard}>
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&fit=crop"
                    alt="Scenic Viewpoints"
                    className={styles.exploreCuratedCardImg}
                  />
                  <div className={styles.exploreCuratedCardBody}>
                    <span className={styles.exploreCardTag}>Scenic & Nature</span>
                    <div className={styles.exploreCardTitle}>Panoramic viewpoints & sunset spots in {destinationName}</div>
                    <button
                      type="button"
                      className={styles.exploreCardBtn}
                      onClick={() => handleAddPlaceToDay({ name: `Sunset Panoramic Lookout in ${destinationName}`, category: 'Sightseeing', price: 150 }, 1)}
                    >
                      <Plus size={13} />
                      <span>Add to Day 1</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Famous Places & Spots in Destination */}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                Popular Places & Experiences in {destinationName}
              </h3>
              <div className={styles.placesListContainer}>
                {(currentCityInfo.destinations || []).slice(0, 4).map((p, idx) => (
                  <div key={idx} className={styles.placeRowItem}>
                    <div className={styles.placeInfo}>
                      <img
                        src={p.image || currentCityInfo.image}
                        alt={p.name}
                        className={styles.placeThumb}
                      />
                      <div>
                        <div className={styles.placeTitle}>{p.name}</div>
                        <div className={styles.placeCategory}>{p.category} • Est. {formatCurrency(p.price || 200)}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.exploreCardBtn}
                      onClick={() => handleAddPlaceToDay(p, 1)}
                    >
                      <Plus size={13} />
                      <span>Add to Itinerary</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ITINERARY TAB */}
          {activeTab === 'itinerary' && (
            <div>
              {/* Add a place search bar */}
              <div className={styles.itineraryHeaderSearch}>
                <Plus size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="+ Add a place to itinerary..."
                  value={itinerarySearch}
                  onChange={(e) => setItinerarySearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && itinerarySearch.trim()) {
                      handleAddPlaceToDay({ name: itinerarySearch.trim(), category: 'Sightseeing', price: 200 }, 1);
                      setItinerarySearch('');
                    }
                  }}
                  className={styles.itinerarySearchInput}
                />
              </div>

              {/* Day-by-Day Sections matching actual travel dates */}
              {days.map((dayItem, dIdx) => (
                <div key={dayItem.day} className={styles.daySectionCard}>
                  {/* Day Header */}
                  <div className={styles.daySectionHeader}>
                    <div>
                      <h3 className={styles.daySectionTitle}>
                        {formatDate(dayItem.date, 'EEEE, MMMM do')}
                      </h3>
                      <div className={styles.dayHeadingSubtext}>
                        {dayItem.title || 'Add a heading'}
                      </div>
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: 6 }}>
                      Day {dayItem.day}
                    </span>
                  </div>

                  {/* Activities List */}
                  <div className={styles.dayActivitiesList}>
                    {(dayItem.activities || []).map((act, actIdx) => (
                      <div key={act.id || actIdx} className={styles.activityCardRow}>
                        <div className={styles.activityCardLeft}>
                          <span className={styles.activityTimeBadge}>{act.time || '10:00 AM'}</span>
                          <span
                            className={styles.activityCategoryDot}
                            style={{ backgroundColor: CATEGORY_COLORS[act.category] || '#2563eb' }}
                          />
                          <span className={styles.activityCardName}>{act.name}</span>
                        </div>

                        <div className={styles.activityCardRight}>
                          <span style={{ fontSize: 12, color: '#64748b' }}>
                            {act.cost > 0 ? formatCurrency(act.cost) : 'Free'}
                          </span>

                          <div className={styles.activityActions}>
                            <button
                              type="button"
                              className={styles.iconSmallBtn}
                              title="Move earlier"
                              onClick={() => handleMoveActivity(dayItem.day, actIdx, -1)}
                            >
                              <ChevronUp size={15} />
                            </button>
                            <button
                              type="button"
                              className={styles.iconSmallBtn}
                              title="Move later"
                              onClick={() => handleMoveActivity(dayItem.day, actIdx, 1)}
                            >
                              <ChevronDown size={15} />
                            </button>
                            <button
                              type="button"
                              className={styles.iconSmallBtn}
                              title="Remove stop"
                              onClick={() => handleRemoveActivity(dayItem.day, act.id)}
                            >
                              <Trash2 size={14} color="#ef4444" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(!dayItem.activities || dayItem.activities.length === 0) && (
                    <div style={{ padding: '24px 16px', textAlign: 'center', background: '#f8fafc', borderRadius: 8, margin: '8px 0', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: 13 }}>
                      No places planned for Day {dayItem.day} yet. Click below to add your first stop!
                    </div>
                  )}

                  {/* + Add a place button for this specific day */}
                  <button
                    type="button"
                    className={styles.addPlaceDayBtn}
                    onClick={() => setManualPlaceModal({ isOpen: true, targetDay: dayItem.day })}
                  >
                    <Plus size={14} />
                    <span>Add a place to Day {dayItem.day}</span>
                  </button>
                </div>
              ))}

              {/* CREATE MIND MAP BUTTON at end of all dates */}
              <div className={styles.createMindMapBanner}>
                <div>
                  <div className={styles.createMindMapTitle}>Generate Visual Mind Map</div>
                  <div className={styles.createMindMapDesc}>
                    Organize all {days.length} days, locations, and scheduled activities into an interactive visual mind map with branching nodes.
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.createMindMapBtn}
                  onClick={handleCreateMindMap}
                >
                  <Layers size={16} />
                  <span>Create Mind Map</span>
                </button>
              </div>

              {/* Embedded Mind Map Section (Displayed below Itinerary) */}
              {mindMapGenerated && (
                <div className={styles.embeddedMindMapSection}>
                  <div className={styles.embeddedMindMapHeader}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Layers size={16} color="#f95c47" />
                      <span>Generated Mind Map Canvas</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/playground/${trip.id}`} style={{ textDecoration: 'none' }}>
                        <button type="button" className={styles.topActionBtn}>
                          <ExternalLink size={13} />
                          <span>Open Full Playground</span>
                        </button>
                      </Link>
                      <button type="button" className={styles.topActionBtn} onClick={() => setShareModalOpen(true)}>
                        <Share2 size={13} />
                        <span>Share Mind Map</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.embeddedMindMapFrame}>
                    <TripCanvas
                      nodes={mindMapNodes}
                      selectedNodeId={null}
                      onSelectNode={() => {}}
                      onUpdateNodeCoordinates={() => {}}
                      onOpenAddModal={() => {}}
                      onOpenReplaceModal={() => {}}
                      onDuplicateNode={() => {}}
                      onDeleteNode={() => {}}
                      onAddChildNode={() => {}}
                      onAutoLayout={() => {}}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <div>
              {/* Budget Total Card */}
              <div className={styles.budgetHeaderSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div className={styles.budgetingTitle}>Budgeting</div>
                    <div className={styles.budgetTotalRow}>
                      {!isEditingBudget ? (
                        <>
                          <div className={styles.budgetTotalAmount}>
                            {formatCurrency(convertedBudget, selectedCurrency)}
                          </div>
                          <button
                            type="button"
                            className={styles.budgetEditIconBtn}
                            onClick={() => {
                              setEditedBudgetAmount(Math.round(convertedBudget));
                              setIsEditingBudget(true);
                            }}
                            title="Edit Target Budget"
                          >
                            <Edit2 size={18} />
                          </button>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="number"
                            value={editedBudgetAmount}
                            onChange={(e) => setEditedBudgetAmount(e.target.value)}
                            style={{ fontSize: 24, fontWeight: 700, padding: '4px 10px', borderRadius: 8, border: '1px solid #2563eb', width: 160 }}
                          />
                          <button
                            type="button"
                            onClick={handleSaveBudget}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multi-Currency Options Pill Bar */}
                  <div className={styles.currencySelectorRow} style={{ marginTop: 0 }}>
                    <span className={styles.currencyLabel}>Currency:</span>
                    <div className={styles.currencyChips}>
                      {CURRENCIES.map((curr) => {
                        const active = selectedCurrency === curr.code;
                        return (
                          <button
                            key={curr.code}
                            type="button"
                            className={`${styles.currencyChip} ${active ? styles.currencyChipActive : ''}`}
                            onClick={() => handleCurrencyChange(curr.code)}
                            title={`${curr.name} (${curr.symbol})`}
                          >
                            <span>{curr.flag}</span>
                            <span>{curr.code}</span>
                            <span style={{ opacity: 0.8 }}>({curr.symbol})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
                  Total Expenses Logged: <strong style={{ color: '#0f172a' }}>{formatCurrency(convertedExpensesSum, selectedCurrency)}</strong> • Remaining: <strong style={{ color: convertedRemaining >= 0 ? '#16a34a' : '#dc2626' }}>{formatCurrency(convertedRemaining, selectedCurrency)}</strong>
                </div>
              </div>

              {/* Expenses List Header */}
              <div className={styles.budgetExpensesHeader}>
                <h3 className={styles.expensesTitle}>Expenses ({expenses.length})</h3>
                <select
                  className={styles.sortSelect}
                  value={budgetSort}
                  onChange={(e) => setBudgetSort(e.target.value)}
                >
                  <option value="low-to-high">Sort: Amount (low to high)</option>
                  <option value="high-to-low">Sort: Amount (high to low)</option>
                </select>
              </div>

              {/* Expenses List */}
              <div className={styles.expensesList}>
                {sortedExpenses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: '#ffffff', borderRadius: 12, border: '1px dashed #cbd5e1', color: '#64748b' }}>
                    <p style={{ margin: '0 0 12px', fontSize: 14 }}>No expenses logged yet for this trip.</p>
                    <button
                      type="button"
                      className={styles.addExpenseMainBtn}
                      onClick={() => setAddExpenseModalOpen(true)}
                    >
                      <Plus size={15} />
                      <span>Log First Expense</span>
                    </button>
                  </div>
                ) : (
                  sortedExpenses.map((exp) => {
                    const displayAmt = convertCurrency(exp.amount, exp.currency || baseCurrency, selectedCurrency);
                    return (
                      <div key={exp.id} className={styles.expenseItemRow}>
                        <div className={styles.expenseItemLeft}>
                          <span className={styles.expenseCategoryIcon}>{exp.icon || '💳'}</span>
                          <div>
                            <div className={styles.expenseTitle}>{exp.title}</div>
                            <div className={styles.expenseSubmeta}>
                              Paid by {exp.paidBy} • {exp.split} • {exp.date}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span className={styles.expenseAmount}>{formatCurrency(displayAmt, selectedCurrency)}</span>
                          <button
                            type="button"
                            className={styles.iconSmallBtn}
                            onClick={() => handleDeleteExpense(exp.id)}
                            title="Delete expense"
                          >
                            <Trash2 size={15} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Expense Main Button */}
              {sortedExpenses.length > 0 && (
                <button
                  type="button"
                  className={styles.addExpenseMainBtn}
                  onClick={() => setAddExpenseModalOpen(true)}
                >
                  <Plus size={15} />
                  <span>Add expense</span>
                </button>
              )}
            </div>
          )}
        </main>

        {/* 3. Right Interactive Map Column (Always synchronized!) */}
        <div className={styles.rightMapColumn}>
          <TripGeoMap
            nodes={synchronizedMapNodes}
            selectedNodeId={null}
            onSelectNode={() => {}}
            isMiniMap={false}
          />
        </div>
      </div>

      {/* MODAL 1: Add Expense Modal (Matching PDF Page 4 Top) */}
      {addExpenseModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add expense</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setAddExpenseModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewExpense} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Amount */}
              <div className={styles.modalFieldGroup}>
                <label className={styles.modalFieldLabel}>Amount ({selectedCurrency})</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginRight: 6 }}>
                    {CURRENCIES.find((c) => c.code === selectedCurrency)?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    required
                    style={{ border: 'none', outline: 'none', fontSize: 16, fontWeight: 600, width: '100%' }}
                  />
                </div>
              </div>

              {/* Touch/Select item */}
              <div className={styles.modalFieldGroup}>
                <label className={styles.modalFieldLabel}>Item</label>
                <div
                  className={styles.modalSelectTrigger}
                  onClick={() => setSelectItemModalOpen(true)}
                >
                  <span>{newExpense.title ? `${newExpense.icon} ${newExpense.title}` : 'Touch/Select item'}</span>
                  <ChevronRight size={16} color="#64748b" />
                </div>
              </div>

              {/* Paid By */}
              <div className={styles.modalFieldGroup}>
                <label className={styles.modalFieldLabel}>Paid by</label>
                <select
                  value={newExpense.paidBy}
                  onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                  style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, background: '#fff' }}
                >
                  <option value="You (the globe trotter)">You (the globe trotter)</option>
                  <option value="Trip Mate 1">Trip Mate 1</option>
                  <option value="Trip Mate 2">Trip Mate 2</option>
                </select>
              </div>

              {/* Split */}
              <div className={styles.modalFieldGroup}>
                <label className={styles.modalFieldLabel}>Split</label>
                <select
                  value={newExpense.split}
                  onChange={(e) => setNewExpense({ ...newExpense, split: e.target.value })}
                  style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13, background: '#fff' }}
                >
                  <option value="Don't split">Don't split</option>
                  <option value="Split equally">Split equally</option>
                  <option value="Split by percentage">Split by percentage</option>
                </select>
              </div>

              {/* Date */}
              <div className={styles.modalFieldGroup}>
                <label className={styles.modalFieldLabel}>Date (Optional)</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 13 }}
                />
              </div>

              <button type="submit" className={styles.saveExpenseSubmitBtn}>
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Select Item Modal (Matching PDF Page 4 Middle) */}
      {selectItemModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard} style={{ maxWidth: 440 }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Select item</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectItemModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Select from your trip plan */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                Select from your trip plan
              </div>
              <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {days.flatMap((d) => d.activities || []).map((act, i) => (
                  <button
                    key={act.id || i}
                    type="button"
                    onClick={() => {
                      setNewExpense({ ...newExpense, title: act.name, category: act.category, icon: '📍', amount: act.cost ? String(act.cost) : newExpense.amount });
                      setSelectItemModalOpen(false);
                    }}
                    style={{ textAlign: 'left', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', fontSize: 13, cursor: 'pointer' }}
                  >
                    {act.name} ({act.category})
                  </button>
                ))}
              </div>
            </div>

            {/* Or select from a category */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                Or select from a category
              </div>
              <div className={styles.categoryGrid}>
                {[
                  { name: 'Flight', icon: '✈️' },
                  { name: 'Hotel', icon: '🏨' },
                  { name: 'Rental car', icon: '🚗' },
                  { name: 'Transit', icon: '🚆' },
                  { name: 'Food', icon: '🍽️' },
                  { name: 'Drinks', icon: '🍸' },
                  { name: 'Sightseeing', icon: '🏛️' },
                  { name: 'Activities', icon: '🎟️' },
                  { name: 'Shopping', icon: '🛍️' },
                ].map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    className={styles.categoryGridBtn}
                    onClick={() => {
                      setNewExpense({ ...newExpense, title: cat.name, category: cat.name, icon: cat.icon });
                      setSelectItemModalOpen(false);
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Manual Add Place / Activity Modal */}
      {manualPlaceModal.isOpen && (
        <div className={styles.modalBackdrop} onClick={() => setManualPlaceModal({ isOpen: false, targetDay: 1 })}>
          <div className={`${styles.modalCard} ${styles.manualPlaceModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Place to Day {manualPlaceModal.targetDay}</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setManualPlaceModal({ isOpen: false, targetDay: 1 })}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmManualPlace} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className={styles.modalFieldGroup}>
                <label className={styles.modalFieldLabel}>Place / Activity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shaniwar Wada Fort, Seaside Sunset Cafe..."
                  value={manualPlaceForm.name}
                  onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, name: e.target.value })}
                  className={styles.manualInput}
                  autoFocus
                />
              </div>

              <div className={styles.manualFieldRow}>
                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>Category</label>
                  <select
                    value={manualPlaceForm.category}
                    onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, category: e.target.value })}
                    className={styles.manualSelect}
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Culture">Culture</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Beach">Beach & Coastal</option>
                    <option value="Adventure">Adventure & Trek</option>
                    <option value="Shopping">Shopping & Market</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="Transport">Transport</option>
                    <option value="Stay">Stay / Hotel</option>
                  </select>
                </div>

                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>Scheduled Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM, 02:30 PM"
                    value={manualPlaceForm.time}
                    onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, time: e.target.value })}
                    className={styles.manualInput}
                  />
                </div>
              </div>

              <div className={styles.manualFieldRow}>
                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>Duration (minutes)</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    placeholder="90"
                    value={manualPlaceForm.duration}
                    onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, duration: e.target.value })}
                    className={styles.manualInput}
                  />
                </div>

                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>Estimated Cost ({selectedCurrency})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={manualPlaceForm.cost}
                    onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, cost: e.target.value })}
                    className={styles.manualInput}
                  />
                </div>
              </div>

              <div className={styles.modalFieldGroup}>
                <label className={styles.modalFieldLabel}>Location / Landmark</label>
                <input
                  type="text"
                  placeholder={`e.g. ${currentCityInfo.name} Center`}
                  value={manualPlaceForm.location}
                  onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, location: e.target.value })}
                  className={styles.manualInput}
                />
              </div>

              <button type="submit" className={styles.manualSubmitBtn}>
                <Plus size={16} />
                <span>Add Place to Day {manualPlaceModal.targetDay}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <ShareModal
          trip={trip}
          onClose={() => setShareModalOpen(false)}
          onUpdateTrip={(updated) => setTrip(updated)}
        />
      )}
    </div>
  );
}
