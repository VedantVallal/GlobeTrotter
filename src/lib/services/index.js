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

// Helper to load all trips from persistent storage or default to mockTrips
function loadPersistedTrips() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gt_all_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  return [...mockTrips];
}

// Helper to save all trips to persistent storage
function savePersistedTrips(newTrips) {
  trips = newTrips;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gt_all_trips', JSON.stringify(newTrips));
    } catch (e) {}
  }
}

// Helper to load itinerary store
function loadPersistedItinerary() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gt_itinerary_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
  }
  return { ...mockItinerary };
}

// Helper to save itinerary store
function savePersistedItinerary(newItinerary) {
  itinerary = newItinerary;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gt_itinerary_store', JSON.stringify(newItinerary));
    } catch (e) {}
  }
}

// In-memory state initialized with persistent storage
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
    if (!tripId) return trips[0] || null;
    const all = await this.getAll();
    // 1. Direct match
    let found = all.find(t => t.id === tripId);
    if (found) return found;

    // 2. Normalized match (e.g. trip-1 vs trip-001)
    const norm = String(tripId).toLowerCase().replace(/-0+/, '-');
    found = all.find(t => String(t.id).toLowerCase().replace(/-0+/, '-') === norm);
    if (found) return found;

    // 3. Fallback to first trip so pages don't hang indefinitely
    return all[0] || trips[0] || null;
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
      } catch (e) {}
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
    } catch (e) {}

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
    } catch (e) {}

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
    } catch (e) {}

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

export const cityService = {
  async getAll() { return mockCities; },
  async getCities() { return this.getAll(); },
  async getById(cityId) { return mockCities.find(c => c.id === cityId) || null; },
  async getCityById(cityId) { return this.getById(cityId); },
  async search(query) {
    const q = query.toLowerCase();
    return mockCities.filter(c =>
      c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  },
  async getByRegion(region) {
    return region === 'All' ? mockCities : mockCities.filter(c => c.region === region);
  },
};

export const activityService = {
  async getByCity(cityId) { return mockActivities.filter(a => a.cityId === cityId); },
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
    if (!tripId) return itinerary['trip-002'] || [];
    if (itinerary[tripId] && itinerary[tripId].length > 0) return itinerary[tripId];

    const norm = String(tripId).toLowerCase().replace(/-0+/, '-');
    const matchedKey = Object.keys(itinerary).find(
      k => String(k).toLowerCase().replace(/-0+/, '-') === norm
    );
    if (matchedKey && itinerary[matchedKey]) return itinerary[matchedKey];

    // Fallback to sample itinerary days so schedule is never completely empty
    return itinerary['trip-002'] || [];
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
    } catch (e) {}

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
    } catch (e) {}

    return true;
  },
};

export const playgroundService = {
  async getNodes(tripId) {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`gt_nodes_${tripId}`);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return null;
  },
  async saveNodes(tripId, nodes) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gt_nodes_${tripId}`, JSON.stringify(nodes));
      } catch (e) {}
    }
    try {
      await setDoc(doc(db, 'playground_nodes', tripId), { nodes }, { merge: true });
    } catch (e) {}
    return nodes;
  },
};

export const budgetService = {
  async getByTrip(tripId) {
    return mockBudgets[tripId] || mockBudgets['trip-001'] || null;
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

// AI Service — interface ready for real LLM integration
export const aiService = {
  async chat(messages, tripContext) {
    await new Promise(r => setTimeout(r, 1000));
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

    if (lastMsg.includes('budget') || lastMsg.includes('cost')) {
      return {
        role: 'assistant',
        content: `Based on your budget, I'd suggest allocating roughly 35% to accommodation, 25% to food, 20% to transport, and 20% to activities. For your stops, that keeps daily pacing comfortable and flexible.`,
      };
    }
    if (lastMsg.includes('itinerary') || lastMsg.includes('plan')) {
      return {
        role: 'assistant',
        content: `Here's an optimal flow:\n\n• Days 1–2: Coastal highlights & sunset viewpoints\n• Days 3–4: Cultural heritage, churches & spice estates\n• Day 5: Relaxed beaches & farewell seafood dinner\n\nAll stops are arranged to minimize travel time!`,
      };
    }
    return {
      role: 'assistant',
      content: `I've analyzed your itinerary. Adding local spice plantation tours or seaside cafes during twilight will give you the best mix of culture and relaxation!`,
    };
  },

  async generateSuggestions({ prompt, tripContext, stops }) {
    await new Promise(r => setTimeout(r, 1200));
    const p = prompt.toLowerCase();
    if (p.includes('food') || p.includes('eat') || p.includes('gem')) {
      return {
        text: `Here are 3 handpicked culinary gems for ${stops?.join(' and ') || 'your stops'}:\n\n1. Fisherman's Wharf (Fresh crab masala by the river)\n2. Mum's Kitchen (Authentic homestyle Goan vindaloo)\n3. Martin's Corner (Legendary seafood & coastal vibes)\n\nWould you like me to assign one of these to your evening slot?`,
      };
    }
    if (p.includes('route') || p.includes('pacing') || p.includes('optimize')) {
      return {
        text: `To optimize transit between ${stops?.join(' → ') || 'stops'}:\n\n• Cluster Northern beach excursions in the morning before midday peak.\n• Schedule heritage trails in Old Goa for afternoon.\n• Keep South Goa for the final relaxing stretch.\n\nThis saves roughly 2.5 hours of transit time across your trip!`,
      };
    }
    return {
      text: `For ${stops?.join(', ') || 'your destination'}, the golden hour along the coastline offers perfect conditions for kayaking and seaside dining. Let me know if you want budget recommendations or hotel comparisons!`,
    };
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
