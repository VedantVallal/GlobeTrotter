// Service interfaces — Firebase-ready contracts
// Currently backed by mock data. Replace implementations when Firebase is configured.
import { mockTrips, mockItinerary } from '@/lib/data/mockTrips';
import { mockCities } from '@/lib/data/mockCities';
import { mockActivities } from '@/lib/data/mockActivities';
import { mockBudgets } from '@/lib/data/mockBudgets';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile,
} from 'firebase/auth';

// Helper to load all trips from persistent storage (Clean slate: default to empty array)
function loadPersistedTrips() {
  if (typeof window !== 'undefined') {
    try {
      const cleanSlateApplied = localStorage.getItem('gt_clean_slate_v3');
      if (!cleanSlateApplied) {
        // Clear old mock trips and itineraries once for clean user experience
        localStorage.removeItem('gt_all_trips');
        localStorage.removeItem('gt_itinerary_store');
        localStorage.setItem('gt_clean_slate_v3', 'true');
        return [];
      }
      const stored = localStorage.getItem('gt_all_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { }
  }
  return [];
}

// Helper to save all trips to persistent storage
function savePersistedTrips(newTrips) {
  trips = newTrips;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gt_all_trips', JSON.stringify(newTrips));
    } catch (e) { }
  }
}

// Helper to load itinerary store (Clean slate: default to empty object)
function loadPersistedItinerary() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gt_itinerary_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) { }
  }
  return {};
}

// Helper to save itinerary store
function savePersistedItinerary(newItinerary) {
  itinerary = newItinerary;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gt_itinerary_store', JSON.stringify(newItinerary));
    } catch (e) { }
  }
}

// In-memory state initialized with clean persistent storage
let trips = loadPersistedTrips();
let itinerary = loadPersistedItinerary();

export const tripService = {
  async getAll(userId) {
    // Refresh trips from persistent storage if on client
    if (typeof window !== 'undefined') {
      trips = loadPersistedTrips();
    }
    if (userId) return trips.filter(t => t.userId === userId);
    return trips;
  },
  async getTrips(userId) {
    return this.getAll(userId);
  },
  async getById(tripId) {
    if (!tripId) return null;
    const all = await this.getAll();
    // 1. Direct match
    let found = all.find(t => t.id === tripId);
    if (found) return found;

    // 2. Normalized match (e.g. trip-1 vs trip-001)
    const norm = String(tripId).toLowerCase().replace(/-0+/, '-');
    found = all.find(t => String(t.id).toLowerCase().replace(/-0+/, '-') === norm);
    if (found) return found;

    return null;
  },
  async getTripById(tripId) {
    return this.getById(tripId);
  },
  async create(data) {
    let currentUserId = 'user-001';
    if (auth.currentUser) {
      currentUserId = auth.currentUser.uid;
    } else if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gt_active_user');
        if (stored) currentUserId = JSON.parse(stored).id;
      } catch (e) { }
    }

    const currentTrips = await this.getAll();
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId: currentUserId,
      status: 'planning',
      estimatedCost: data.budget || 1200,
      activitiesAdded: [],
      createdAt: new Date().toISOString().split('T')[0],
      stopsCount: data.destinations?.length || 3,
      destinations: data.destinations || ['Goa', 'Mumbai'],
      ...data,
    };

    savePersistedTrips([newTrip, ...currentTrips]);

    // Attempt Firestore persistence if online
    try {
      await setDoc(doc(db, 'trips', newTrip.id), newTrip, { merge: true });
    } catch (e) {
      // offline or security rules pending
    }

    return newTrip;
  },
  async createTrip(data) {
    return this.create(data);
  },
  async update(tripId, data) {
    const currentTrips = await this.getAll();
    const updated = currentTrips.map(t => {
      const match = t.id === tripId || String(t.id).toLowerCase().replace(/-0+/, '-') === String(tripId).toLowerCase().replace(/-0+/, '-');
      return match ? { ...t, ...data } : t;
    });
    savePersistedTrips(updated);

    // Attempt Firestore persistence
    try {
      await setDoc(doc(db, 'trips', tripId), data, { merge: true });
    } catch (e) { }

    return updated.find(t => t.id === tripId) || updated[0];
  },
  async updateTrip(tripId, data) {
    return this.update(tripId, data);
  },
  async delete(tripId) {
    const currentTrips = await this.getAll();
    const norm = String(tripId).toLowerCase().replace(/-0+/, '-');
    const remaining = currentTrips.filter(t => t.id !== tripId && String(t.id).toLowerCase().replace(/-0+/, '-') !== norm);
    savePersistedTrips(remaining);

    try {
      await deleteDoc(doc(db, 'trips', tripId));
    } catch (e) { }

    return true;
  },
  async deleteTrip(tripId) {
    return this.delete(tripId);
  },
  async duplicate(tripId) {
    const currentTrips = await this.getAll();
    const original = currentTrips.find(t => t.id === tripId || String(t.id).toLowerCase().replace(/-0+/, '-') === String(tripId).toLowerCase().replace(/-0+/, '-'));
    if (!original) return null;
    const copy = {
      ...original,
      id: `trip-${Date.now()}`,
      title: `Copy of ${original.title}`,
      status: 'planning',
      createdAt: new Date().toISOString().split('T')[0],
    };
    savePersistedTrips([copy, ...currentTrips]);

    try {
      await setDoc(doc(db, 'trips', copy.id), copy, { merge: true });
    } catch (e) { }

    return copy;
  },
  async duplicateTrip(tripId) {
    return this.duplicate(tripId);
  },
  async addStop(tripId, cityId) {
    const trip = await this.getById(tripId);
    if (!trip || (trip.stops && trip.stops.includes(cityId))) return trip;
    return this.update(tripId, { stops: [...(trip.stops || []), cityId] });
  },
  async removeStop(tripId, cityId) {
    const trip = await this.getById(tripId);
    if (!trip) return null;
    return this.update(tripId, { stops: (trip.stops || []).filter(s => s !== cityId) });
  },
};

// In-memory cache for dynamically AI-generated cities
const aiGeneratedCitiesCache = new Map();

export const cityService = {
  async getAll() {
    return [...mockCities, ...Array.from(aiGeneratedCitiesCache.values())];
  },
  async getCities() { return this.getAll(); },
  async getById(cityId) {
    if (!cityId) return null;
    const lower = String(cityId).toLowerCase();

    // 1. Direct or alias match in 276 famous cities dataset
    let found = mockCities.find(c =>
      c.id === cityId ||
      c.legacyId === cityId ||
      c.name.toLowerCase() === lower ||
      c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === lower
    );
    if (found) return found;

    // 2. Check dynamic AI cache
    if (aiGeneratedCitiesCache.has(lower)) {
      return aiGeneratedCitiesCache.get(lower);
    }

    // 3. AI Fallback: Generate city data dynamically on the fly
    return await aiService.generateCityData(cityId);
  },
  async getCityById(cityId) { return this.getById(cityId); },
  async search(query) {
    if (!query || !query.trim()) return mockCities;
    const q = query.trim().toLowerCase();

    const matches = mockCities.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      (c.region && c.region.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
    );

    if (matches.length > 0) return matches;

    // If query returned 0 matches, check cached AI cities
    for (const cached of aiGeneratedCitiesCache.values()) {
      if (cached.name.toLowerCase().includes(q)) {
        return [cached];
      }
    }

    // Trigger AI Fallback for unique searched destination
    if (q.length >= 3) {
      const generated = await aiService.generateCityData(query);
      return [generated];
    }

    return [];
  },
  async getByRegion(region) {
    const all = await this.getAll();
    return region === 'All' ? all : all.filter(c => c.region === region);
  },
};

export const activityService = {
  async getByCity(cityId) {
    const lower = String(cityId).toLowerCase();
    const city = await cityService.getById(cityId);
    if (city && city.activities && city.activities.length > 0) {
      return city.activities;
    }
    return mockActivities.filter(a =>
      a.cityId?.toLowerCase() === lower ||
      a.cityName?.toLowerCase() === lower ||
      a.cityName?.toLowerCase().includes(lower)
    );
  },
  async getActivities() { return mockActivities; },
  async getById(actId) { return mockActivities.find(a => a.id === actId) || null; },
  async search(query, cityId) {
    const q = query.toLowerCase();
    return mockActivities.filter(a =>
      (!cityId || a.cityId === cityId) &&
      (a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
    );
  },
};

export const itineraryService = {
  async getByTrip(tripId) {
    if (typeof window !== 'undefined') {
      itinerary = loadPersistedItinerary();
    }
    if (!tripId) return [];
    if (itinerary[tripId] && itinerary[tripId].length > 0) return itinerary[tripId];

    const norm = String(tripId).toLowerCase().replace(/-0+/, '-');
    const matchedKey = Object.keys(itinerary).find(
      k => String(k).toLowerCase().replace(/-0+/, '-') === norm
    );
    if (matchedKey && itinerary[matchedKey]) return itinerary[matchedKey];

    return [];
  },
  async getItinerary(tripId) { return this.getByTrip(tripId); },
  async addItem(tripId, item) {
    if (typeof window !== 'undefined') {
      itinerary = loadPersistedItinerary();
    }
    const newItem = { id: `itin-${Date.now()}`, tripId, ...item };
    const currentList = itinerary[tripId] || [];
    const updatedStore = { ...itinerary, [tripId]: [...currentList, newItem] };
    savePersistedItinerary(updatedStore);

    try {
      await setDoc(doc(db, 'itineraries', tripId), { items: updatedStore[tripId] }, { merge: true });
    } catch (e) { }

    return newItem;
  },
  async removeItem(tripId, itemId) {
    if (typeof window !== 'undefined') {
      itinerary = loadPersistedItinerary();
    }
    const updatedStore = {
      ...itinerary,
      [tripId]: (itinerary[tripId] || []).filter(i => i.id !== itemId),
    };
    savePersistedItinerary(updatedStore);

    try {
      await setDoc(doc(db, 'itineraries', tripId), { items: updatedStore[tripId] }, { merge: true });
    } catch (e) { }

    return true;
  },
  async saveItinerary(tripId, days) {
    if (typeof window !== 'undefined') {
      itinerary = loadPersistedItinerary();
    }
    const updatedStore = { ...itinerary, [tripId]: days };
    savePersistedItinerary(updatedStore);

    try {
      await setDoc(doc(db, 'itineraries', tripId), { items: days }, { merge: true });
    } catch (e) { }

    return days;
  },
};

export const playgroundService = {
  async getNodes(tripId) {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`gt_nodes_${tripId}`);
        if (stored) return JSON.parse(stored);
      } catch (e) { }
    }
    return null;
  },
  async saveNodes(tripId, nodes) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gt_nodes_${tripId}`, JSON.stringify(nodes));
      } catch (e) { }
    }
    try {
      await setDoc(doc(db, 'playground_nodes', tripId), { nodes }, { merge: true });
    } catch (e) { }
    return nodes;
  },
};

export const budgetService = {
  async getByTrip(tripId) {
    if (!tripId) return null;
    if (typeof window !== 'undefined') {
      try {
        const customBudget = localStorage.getItem(`gt_budget_${tripId}`);
        if (customBudget) return JSON.parse(customBudget);
      } catch (e) { }
    }

    const trip = await tripService.getById(tripId);
    if (!trip) return null;

    let recordedExpenses = [];
    if (typeof window !== 'undefined') {
      try {
        const storedExp = localStorage.getItem(`gt_expenses_${tripId}`);
        if (storedExp) recordedExpenses = JSON.parse(storedExp);
      } catch (e) { }
    }

    const expensesSum = recordedExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const categoryMap = {};
    recordedExpenses.forEach((exp) => {
      const cat = exp.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(exp.amount) || 0);
    });

    // Also derive daily spending schedule from user's actual itinerary days
    const itinData = await itineraryService.getByTrip(tripId);
    let daily = [];
    let activitiesCostSum = 0;

    if (Array.isArray(itinData) && itinData.length > 0) {
      daily = itinData.map((d, idx) => {
        const acts = (d.activities || []).map((a, aIdx) => ({
          id: a.id || `day-${d.day || idx + 1}-${aIdx}`,
          name: a.title || a.name || 'Activity',
          cost: Number(a.cost) || 0,
          category: a.category || 'Sightseeing',
        }));
        const dayCost = acts.reduce((s, a) => s + a.cost, 0);
        activitiesCostSum += dayCost;

        acts.forEach((a) => {
          if (a.cost > 0) {
            categoryMap[a.category] = (categoryMap[a.category] || 0) + a.cost;
          }
        });

        return {
          day: d.day || idx + 1,
          date: d.date || `Day ${d.day || idx + 1}`,
          estimated: dayCost,
          activities: acts.map((a) => a.name).join(', ') || 'No activities added',
          activitiesList: acts,
        };
      });
    }

    const estimated = expensesSum + activitiesCostSum;

    const categoryColors = {
      Flight: '#4169D8',
      Hotel: '#7C6AF5',
      Food: '#F59E42',
      Activities: '#25845A',
      Transport: '#E05C5C',
      Sightseeing: '#2563eb',
      Other: '#8A96A6',
    };

    const categories = Object.entries(categoryMap).map(([name, amount]) => ({
      name,
      amount,
      color: categoryColors[name] || '#8A96A6',
    }));

    return {
      tripId,
      total: trip.budget || 0,
      currency: trip.currency || 'USD',
      estimated,
      categories,
      daily,
    };
  },
  async getBudget(tripId) {
    return this.getByTrip(tripId);
  },
};

export const sharingService = {
  async getSharedTrip(tripId) {
    const trip = await tripService.getById(tripId);
    if (!trip) return null;
    const stops = await Promise.all((trip.stops || []).map(id => cityService.getById(id)));
    const items = await itineraryService.getByTrip(tripId);
    return { trip, stops, items };
  },
  generateShareUrl(tripId) {
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${tripId}`;
  },
};

// AI Service — connected to Next.js /api/chat (Gemini API with offline intelligence fallback)
export const aiService = {
  async chat(messages, tripContext) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: (messages || []).map(m => ({
            role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
            content: m.text || m.content || '',
          })),
          tripContext: tripContext || {},
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: status ${res.status}`);
      }

      const data = await res.json();
      return {
        role: 'assistant',
        content: data.content || '',
        text: data.content || '',
        suggestedStop: data.suggestedStop || null,
        provider: data.provider || 'gemini',
      };
    } catch (err) {
      console.warn('aiService.chat fallback due to network/client error:', err);
      // Safe client-side fallback if fetch fails
      const lastMsg = (messages[messages.length - 1]?.text || messages[messages.length - 1]?.content || '').toLowerCase();
      let fallbackText = "I've reviewed your itinerary structure and have tailored this suggestion:";
      let suggestedStop = null;

      if (lastMsg.includes('food') || lastMsg.includes('eat') || lastMsg.includes('restaurant')) {
        fallbackText = "Here are top culinary highlights: Seek authentic local eateries and coastal seafood thalis for the truest regional flavors.";
        suggestedStop = {
          title: 'Authentic Local Culinary Hub',
          type: 'food',
          category: 'Food',
          duration: '1.5 hours',
          estimatedCost: 25,
          description: 'Famous local kitchen serving regional specialties and freshly caught seafood.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop',
        };
      } else if (lastMsg.includes('sunset') || lastMsg.includes('view') || lastMsg.includes('beach')) {
        fallbackText = "Panoramic coastal vantage points offer stunning golden hour views. Highly recommended on your afternoon schedule.";
        suggestedStop = {
          title: 'Scenic Sunset Lookout',
          type: 'destination',
          category: 'Sightseeing',
          duration: '2 hours',
          estimatedCost: 0,
          description: 'Dramatic coastal ruins with 360-degree ocean and river views.',
          image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=500&h=300&fit=crop',
        };
      } else if (lastMsg.includes('budget') || lastMsg.includes('cost')) {
        fallbackText = "Budget Breakdown: 35% Accommodation, 25% Food & Dining, 20% Transport, and 20% Activities ensures a flexible and enjoyable trip.";
      } else {
        fallbackText = "Based on your journey pace, clustering geographically nearby stops and keeping 90-minute buffers between activities keeps your itinerary relaxed and memorable.";
      }

      return {
        role: 'assistant',
        content: fallbackText,
        text: fallbackText,
        suggestedStop,
        provider: 'offline-fallback',
      };
    }
  },

  async generateSuggestions({ prompt, tripContext, stops }) {
    const res = await this.chat(
      [{ role: 'user', content: prompt }],
      { ...tripContext, stops }
    );
    return {
      text: res.content,
      suggestedStop: res.suggestedStop,
    };
  },

  // AI Fallback: Generate full city structure on-the-fly for any unlisted city
  async generateCityData(cityName) {
    const rawName = String(cityName || '').replace(/^city-(?:ai-)?/i, '').replace(/-/g, ' ').trim();
    const cleanName = rawName
      ? rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      : 'Unknown Destination';
    const citySlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cityId = `city-ai-${citySlug}`;

    const areas = [
      { id: `area-ai-${citySlug}-1`, name: `${cleanName} Central`, cityId, cityName: cleanName },
      { id: `area-ai-${citySlug}-2`, name: `${cleanName} Historic Old Quarter`, cityId, cityName: cleanName },
      { id: `area-ai-${citySlug}-3`, name: `${cleanName} Waterfront & Promenade`, cityId, cityName: cleanName },
    ];

    const destinations = [
      {
        id: `dest-ai-${citySlug}-1`,
        cityId,
        cityName: cleanName,
        areaName: areas[0].name,
        name: `${cleanName} Main Square & Landmark`,
        type: 'destination',
        category: 'Sightseeing',
        duration: '2 hours',
        estimatedCost: 10,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
        description: `Iconic focal point and central architectural landmark of ${cleanName}.`,
      },
      {
        id: `dest-ai-${citySlug}-2`,
        cityId,
        cityName: cleanName,
        areaName: areas[1].name,
        name: `${cleanName} Heritage Museum & Citadel`,
        type: 'destination',
        category: 'History',
        duration: '2.5 hours',
        estimatedCost: 8,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&h=400&fit=crop',
        description: `Preserved ancient walls, cultural museum exhibits, and historic quarters of ${cleanName}.`,
      },
      {
        id: `dest-ai-${citySlug}-3`,
        cityId,
        cityName: cleanName,
        areaName: areas[2].name,
        name: `${cleanName} Scenic Panorama Point`,
        type: 'destination',
        category: 'Nature',
        duration: '1.5 hours',
        estimatedCost: 0,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
        description: `Panoramic elevated lookout offering sunset vistas over ${cleanName}.`,
      },
    ];

    const activities = [
      {
        id: `act-ai-${citySlug}-1`,
        cityId,
        cityName: cleanName,
        name: `${cleanName} Traditional Street Food & Market Tour`,
        type: 'activity',
        category: 'Food',
        duration: '2 hours',
        estimatedCost: 18,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
        description: `Taste signature regional delicacies, street bites, and pastries in ${cleanName}.`,
      },
      {
        id: `act-ai-${citySlug}-2`,
        cityId,
        cityName: cleanName,
        name: `${cleanName} Guided Artisanal Heritage Walk`,
        type: 'activity',
        category: 'Culture',
        duration: '2 hours',
        estimatedCost: 15,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
        description: `Wander ancient alleyways and meet local artisans, weavers, and craftspeople in ${cleanName}.`,
      },
    ];

    const cityData = {
      id: cityId,
      name: cleanName,
      country: 'Global Destination',
      region: 'Global',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
      description: `AI-Synthesized Destination: Explore the landmarks, cultural districts, and culinary heritage of ${cleanName}.`,
      avgCostPerDay: 75,
      currency: 'USD',
      timezone: 'UTC',
      tags: ['AI Generated', 'Sightseeing', 'Culture'],
      coordinates: { lat: 20.0, lng: 77.0 },
      areas,
      destinations,
      activities,
      isAiGenerated: true,
    };

    aiGeneratedCitiesCache.set(cleanName.toLowerCase(), cityData);
    aiGeneratedCitiesCache.set(cityId, cityData);
    aiGeneratedCitiesCache.set(citySlug, cityData);

    return cityData;
  },
};

// Auth Service — live Firebase Auth with demo fallback & user persistence
export const authService = {
  async login(email, password) {
    // Quick demo account bypass for testing
    if (email === 'demo@globetrotter.app' && password === 'password123') {
      const { mockUser } = await import('@/lib/data/mockUsers');
      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_active_user', JSON.stringify(mockUser));
      }
      return { user: mockUser, token: 'mock-token-001' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const activeUser = {
        id: fbUser.uid,
        name: fbUser.displayName || email.split('@')[0],
        email: fbUser.email,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
        isFirebaseUser: true,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_active_user', JSON.stringify(activeUser));
        notificationService.registerUserLocally(activeUser);
      }

      return {
        user: activeUser,
        token: await fbUser.getIdToken(),
      };
    } catch (fbErr) {
      if (fbErr.code === 'auth/operation-not-allowed') {
        throw new Error("Firebase Setup Required: Please go to Firebase Console > Build > Authentication > Sign-in method and enable 'Email/Password'.");
      }
      if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Try demo: demo@globetrotter.app / password123');
      }
      throw new Error(fbErr.message || 'Firebase login failed.');
    }
  },
  async signIn(email, password) {
    return this.login(email, password);
  },

  async signup(dataOrName, maybeEmail, maybePassword) {
    let name, email, password;
    if (typeof dataOrName === 'object') {
      name = dataOrName.name;
      email = dataOrName.email;
      password = dataOrName.password;
    } else {
      name = dataOrName;
      email = maybeEmail;
      password = maybePassword;
    }

    if (email === 'demo@globetrotter.app') {
      throw new Error('Email is already registered. Please sign in instead.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      if (name) {
        await updateProfile(fbUser, { displayName: name });
      }

      // Save to Firestore 'users' collection
      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          id: fbUser.uid,
          name: name || fbUser.email.split('@')[0],
          email: fbUser.email,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        // Firestore may require rules activation
      }

      const activeUser = {
        id: fbUser.uid,
        name: name || fbUser.displayName || email.split('@')[0],
        email: fbUser.email,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        isFirebaseUser: true,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_active_user', JSON.stringify(activeUser));
        notificationService.registerUserLocally(activeUser);
      }

      return {
        user: activeUser,
        token: await fbUser.getIdToken(),
      };
    } catch (fbErr) {
      if (fbErr.code === 'auth/operation-not-allowed') {
        throw new Error("Firebase Setup Required: Please go to Firebase Console > Authentication > Sign-in method, click 'Email/Password' and enable it.");
      }
      if (fbErr.code === 'auth/email-already-in-use') {
        throw new Error("This email is already registered in Firebase. Please sign in instead.");
      }
      if (fbErr.code === 'auth/weak-password') {
        throw new Error("Password must be at least 6 characters.");
      }
      if (fbErr.code === 'auth/invalid-email') {
        throw new Error("Please enter a valid email address.");
      }
      throw new Error(fbErr.message || 'Firebase account creation failed.');
    }
  },
  async signUp(data) {
    return this.signup(data);
  },

  async sendResetEmail(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        throw new Error("No account found with this email.");
      }
      return { success: true };
    }
  },
  async sendPasswordReset(email) {
    return this.sendResetEmail(email);
  },

  async logout() {
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gt_active_user');
    }
    return true;
  },
  async signOut() {
    return this.logout();
  },
};

export { generateSynchronizedTripPlan } from './tripGenerator';
export { adminService } from './adminService';
export { notificationService } from './notificationService';

