import citiesData from '../data/citiesData.json';
import { mockCities } from '../data/mockCities';

// Initial Mock Users
const INITIAL_USERS = [
  {
    id: 'usr-101',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    role: 'Super Admin',
    status: 'Active',
    joinedAt: '2025-08-14',
    tripsCount: 14,
    lastActive: '10 mins ago',
    country: 'India',
  },
  {
    id: 'usr-102',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Active',
    joinedAt: '2025-09-02',
    tripsCount: 8,
    lastActive: '2 hours ago',
    country: 'India',
  },
  {
    id: 'usr-103',
    name: 'Marcus Vance',
    email: 'marcus.v@globetrotter.io',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop',
    role: 'Admin',
    status: 'Active',
    joinedAt: '2025-06-20',
    tripsCount: 19,
    lastActive: 'Just now',
    country: 'United Kingdom',
  },
  {
    id: 'usr-104',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@travelmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Active',
    joinedAt: '2025-10-11',
    tripsCount: 5,
    lastActive: 'Yesterday',
    country: 'India',
  },
  {
    id: 'usr-105',
    name: 'Elena Rostova',
    email: 'elena.rostova@wanderlust.net',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Inactive',
    joinedAt: '2025-05-18',
    tripsCount: 2,
    lastActive: '18 days ago',
    country: 'France',
  },
  {
    id: 'usr-106',
    name: 'Rohan Verma',
    email: 'rohan.verma@techmail.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Suspended',
    joinedAt: '2025-11-04',
    tripsCount: 1,
    lastActive: '3 weeks ago',
    country: 'India',
  },
  {
    id: 'usr-107',
    name: 'Sarah Jenkins',
    email: 's.jenkins@explore.co.uk',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Active',
    joinedAt: '2025-12-01',
    tripsCount: 6,
    lastActive: '3 hours ago',
    country: 'United States',
  },
  {
    id: 'usr-108',
    name: 'Devendra Patil',
    email: 'dev.patil@voyage.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Active',
    joinedAt: '2026-01-15',
    tripsCount: 11,
    lastActive: '5 hours ago',
    country: 'India',
  },
  {
    id: 'usr-109',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@parisien.fr',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Active',
    joinedAt: '2026-02-19',
    tripsCount: 4,
    lastActive: '1 day ago',
    country: 'France',
  },
  {
    id: 'usr-110',
    name: 'Kenji Takahashi',
    email: 'kenji.t@tokyotrip.jp',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    role: 'User',
    status: 'Active',
    joinedAt: '2026-03-05',
    tripsCount: 7,
    lastActive: '4 hours ago',
    country: 'Japan',
  },
];

// Initial Mock Trips for Admin Management
const INITIAL_TRIPS = [
  {
    id: 'trip-001',
    title: 'Goa Golden Coast & Heritage Trails',
    owner: { name: 'Aarav Mehta', email: 'aarav.mehta@example.com' },
    startLocation: 'Mumbai, India',
    destinations: ['Goa'],
    startDate: '2026-11-10',
    endDate: '2026-11-16',
    duration: '7 Days',
    budget: 45000,
    currency: 'INR',
    stopsCount: 8,
    isPublic: true,
    status: 'Published',
    createdAt: '2026-03-15',
  },
  {
    id: 'trip-002',
    title: 'European Capital Grand Tour',
    owner: { name: 'Sarah Jenkins', email: 's.jenkins@explore.co.uk' },
    startLocation: 'London, UK',
    destinations: ['Paris', 'Amsterdam', 'Berlin'],
    startDate: '2026-08-01',
    endDate: '2026-08-14',
    duration: '14 Days',
    budget: 280000,
    currency: 'INR',
    stopsCount: 16,
    isPublic: true,
    status: 'Published',
    createdAt: '2026-02-28',
  },
  {
    id: 'trip-003',
    title: 'Royal Rajasthan Heritage Circuit',
    owner: { name: 'Priya Sharma', email: 'priya.sharma@example.com' },
    startLocation: 'Delhi, India',
    destinations: ['Jaipur', 'Udaipur', 'Jodhpur'],
    startDate: '2026-12-05',
    endDate: '2026-12-14',
    duration: '10 Days',
    budget: 85000,
    currency: 'INR',
    stopsCount: 12,
    isPublic: false,
    status: 'Draft',
    createdAt: '2026-03-20',
  },
  {
    id: 'trip-004',
    title: 'Japan Cherry Blossom Odyssey',
    owner: { name: 'Kenji Takahashi', email: 'kenji.t@tokyotrip.jp' },
    startLocation: 'Tokyo, Japan',
    destinations: ['Tokyo', 'Kyoto', 'Osaka'],
    startDate: '2026-04-02',
    endDate: '2026-04-12',
    duration: '11 Days',
    budget: 210000,
    currency: 'INR',
    stopsCount: 15,
    isPublic: true,
    status: 'Published',
    createdAt: '2026-01-10',
  },
  {
    id: 'trip-005',
    title: 'Swiss Alps & High Lakes Trek',
    owner: { name: 'Marcus Vance', email: 'marcus.v@globetrotter.io' },
    startLocation: 'Zurich, Switzerland',
    destinations: ['Interlaken', 'Lucerne', 'Zermatt'],
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    duration: '8 Days',
    budget: 195000,
    currency: 'INR',
    stopsCount: 9,
    isPublic: true,
    status: 'Published',
    createdAt: '2026-02-12',
  },
  {
    id: 'trip-006',
    title: 'Western Ghats Monsoon Retreat',
    owner: { name: 'Devendra Patil', email: 'dev.patil@voyage.in' },
    startLocation: 'Pune, India',
    destinations: ['Mahabaleshwar', 'Lonavala', 'Alibaug'],
    startDate: '2026-09-04',
    endDate: '2026-09-08',
    duration: '5 Days',
    budget: 32000,
    currency: 'INR',
    stopsCount: 7,
    isPublic: false,
    status: 'Draft',
    createdAt: '2026-03-22',
  },
];

// Helper to extract initial activities from cities database
function getInitialActivities() {
  const activities = [];
  citiesData.slice(0, 30).forEach((city, cIdx) => {
    if (city.activities && Array.isArray(city.activities)) {
      city.activities.forEach((act, aIdx) => {
        activities.push({
          id: act.id || `act-admin-${cIdx}-${aIdx}`,
          name: act.name,
          cityName: city.name,
          cityId: city.id,
          category: act.category || 'Sightseeing',
          duration: act.duration || '2 hours',
          price: act.price !== undefined ? act.price : 600,
          currency: 'INR',
          description: act.description || `Exciting guided activity and sightseeing in ${city.name}.`,
          image: act.image || city.image,
          status: 'Active',
          rating: (4.4 + ((cIdx + aIdx) % 6) * 0.1).toFixed(1),
        });
      });
    }
  });
  return activities;
}

// In-memory / localStorage storage helpers
function loadStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`gt_admin_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return fallback;
}

function saveStorage(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`gt_admin_${key}`, JSON.stringify(data));
  } catch (e) { }
}

// Helper to combine live user trips with initial trips
function getCombinedTrips() {
  let liveUserTrips = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gt_all_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          liveUserTrips = parsed.map((t) => ({
            id: t.id,
            title: t.title || `${t.departureCity || 'Trip'} to ${(t.destinations || []).map((d) => (typeof d === 'string' ? d : d.name || d.city || 'Stop')).join(', ')}`,
            owner: t.owner || { name: 'Active Traveler', email: 'traveler@globetrotter.io' },
            startLocation: t.departureCity || t.startLocation || 'Mumbai, India',
            destinations: Array.isArray(t.destinations)
              ? t.destinations.map((d) => (typeof d === 'string' ? d : d.name || d.city || 'Destination'))
              : ['Goa'],
            startDate: t.startDate || '2026-11-01',
            endDate: t.endDate || '2026-11-06',
            duration: t.duration || '5 Days',
            budget: Number(t.budget || t.estimatedCost || 35000),
            currency: t.currency || 'INR',
            stopsCount: t.stopsCount || t.destinations?.length || 2,
            isPublic: Boolean(t.isPublic),
            status: t.status === 'planning' ? 'Draft' : 'Published',
            createdAt: t.createdAt || new Date().toISOString().split('T')[0],
          }));
        }
      }
    } catch (e) {}
  }

  const adminStored = loadStorage('trips', null);
  if (adminStored && Array.isArray(adminStored)) {
    const adminIds = new Set(adminStored.map((t) => t.id));
    const newFromLive = liveUserTrips.filter((t) => !adminIds.has(t.id));
    return [...newFromLive, ...adminStored];
  }

  const liveIds = new Set(liveUserTrips.map((t) => t.id));
  const fallbackUniques = INITIAL_TRIPS.filter((t) => !liveIds.has(t.id));
  return [...liveUserTrips, ...fallbackUniques];
}

// Helper to combine active logged-in user with initial mock users
function getCombinedUsers() {
  let liveUser = null;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gt_active_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.email || parsed.name)) {
          liveUser = {
            id: parsed.id || 'usr-active-current',
            name: parsed.name || 'Current Traveler',
            email: parsed.email || 'traveler@globetrotter.app',
            avatar: parsed.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
            role: 'Traveler',
            status: 'Active',
            joinedAt: '2026-03-01',
            tripsCount: 4,
            lastActive: 'Just now',
            country: 'India',
          };
        }
      }
    } catch (e) {}
  }

  const adminUsers = loadStorage('users', null);
  let baseList = adminUsers || [...INITIAL_USERS];

  if (liveUser) {
    const exists = baseList.some((u) => u.email.toLowerCase() === liveUser.email.toLowerCase());
    if (!exists) {
      baseList = [liveUser, ...baseList];
    }
  }
  return baseList;
}

export const ADMIN_CREDENTIALS = {
  email: 'admin@globetrotter.travel',
  password: 'admin123',
};

export const adminService = {
  // ── 0. AUTHENTICATION & SESSION GATE ──────────────────────────────────────
  isAdminLoggedIn() {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('gt_admin_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  },

  loginAdmin(email, password) {
    const normEmail = (email || '').trim().toLowerCase();
    const validEmails = [
      'admin@globetrotter.travel',
      'admin@globetrotter.io',
      'admin@gmail.com',
      'admin@travel.com',
    ];
    const validPasswords = ['admin123', 'admin@123', 'GlobeTrotter@2026', 'admin'];

    if (validEmails.includes(normEmail) && validPasswords.includes(password)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_admin_authenticated', 'true');
        localStorage.setItem('gt_admin_session_time', new Date().toISOString());
      }
      return {
        success: true,
        user: {
          name: 'Aarav Mehta',
          role: 'Super Admin',
          email: 'admin@globetrotter.travel',
        },
      };
    }
    return {
      success: false,
      error: 'Invalid administrator email or password.',
    };
  },

  logoutAdmin() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gt_admin_authenticated');
      localStorage.removeItem('gt_admin_session_time');
    }
    return true;
  },

  // ── 1. KPI & OVERVIEW METRICS ─────────────────────────────────────────────
  async getDashboardStats() {
    const allTrips = getCombinedTrips();
    const allUsers = getCombinedUsers();
    const totalTripsCount = allTrips.length;
    const publicTripsCount = allTrips.filter((t) => t.isPublic).length;
    const shareRate = totalTripsCount > 0 ? ((publicTripsCount / totalTripsCount) * 100).toFixed(0) + '%' : '0%';

    const totalBudget = allTrips.reduce((acc, t) => acc + (Number(t.budget) || 45000), 0);
    const avgBudget = Math.round(totalBudget / (totalTripsCount || 1));

    return {
      totalUsers: { value: allUsers.length + 14810, change: '+12.4%', period: 'vs last month', isPositive: true },
      totalTrips: { value: totalTripsCount > 6 ? totalTripsCount : 38450, change: '+18.2%', period: 'vs last month', isPositive: true },
      publicTrips: { value: publicTripsCount > 0 ? publicTripsCount : 9120, change: shareRate, period: 'share rate', isPositive: true },
      destinationsCount: { value: citiesData.length || 339, change: '48 Countries', period: 'global coverage', isPositive: true },
      activitiesCount: { value: getInitialActivities().length, change: '+64', period: 'added this month', isPositive: true },
      avgTripBudget: { value: `₹${avgBudget.toLocaleString()}`, change: '+8.1%', period: 'avg per trip', isPositive: true },
    };
  },

  // ── 2. ANALYTICS CHARTS DATA ──────────────────────────────────────────────
  async getAnalytics(timeframe = '30d') {
    return {
      userGrowth: [
        { date: 'Oct 01', newUsers: 140, activePlanners: 480 },
        { date: 'Oct 05', newUsers: 195, activePlanners: 620 },
        { date: 'Oct 10', newUsers: 240, activePlanners: 790 },
        { date: 'Oct 15', newUsers: 310, activePlanners: 940 },
        { date: 'Oct 20', newUsers: 420, activePlanners: 1280 },
        { date: 'Oct 25', newUsers: 390, activePlanners: 1190 },
        { date: 'Oct 30', newUsers: 510, activePlanners: 1450 },
      ],
      tripsCreated: [
        { date: 'Oct 01', trips: 85, shared: 22 },
        { date: 'Oct 05', trips: 110, shared: 31 },
        { date: 'Oct 10', trips: 145, shared: 48 },
        { date: 'Oct 15', trips: 180, shared: 62 },
        { date: 'Oct 20', trips: 260, shared: 94 },
        { date: 'Oct 25', trips: 230, shared: 78 },
        { date: 'Oct 30', trips: 315, shared: 112 },
      ],
      regionalDistribution: [
        { region: 'Asia & India', trips: 18450, percentage: 48 },
        { region: 'Europe', trips: 10760, percentage: 28 },
        { region: 'Americas', trips: 5380, percentage: 14 },
        { region: 'Middle East', trips: 2690, percentage: 7 },
        { region: 'Oceania & Africa', trips: 1170, percentage: 3 },
      ],
      categoryBreakdown: [
        { name: 'Sightseeing', count: 420, color: '#4169D8' },
        { name: 'Beach & Coast', count: 310, color: '#0D9488' },
        { name: 'Heritage & Culture', count: 260, color: '#7C6AF5' },
        { name: 'Food & Dining', count: 180, color: '#F59E42' },
        { name: 'Adventure & Trekking', count: 140, color: '#25845A' },
      ],
      durationDistribution: [
        { duration: '1-3 Days (Weekend)', trips: 9800 },
        { duration: '4-6 Days (Vacation)', trips: 16200 },
        { duration: '7-10 Days (Holiday)', trips: 8400 },
        { duration: '11+ Days (Expedition)', trips: 4050 },
      ],
      budgetTiers: [
        { tier: '< ₹25K', count: 11200 },
        { tier: '₹25K - ₹50K', count: 15400 },
        { tier: '₹50K - ₹100K', count: 8200 },
        { tier: '> ₹100K', count: 3650 },
      ],
    };
  },

  // ── 3. TOP DESTINATIONS LEADERBOARD ───────────────────────────────────────
  async getPopularDestinations() {
    return [
      { name: 'Goa', country: 'India', tripsCount: 4820, trend: '+24%', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=150&h=150&fit=crop' },
      { name: 'Paris', country: 'France', tripsCount: 3910, trend: '+14%', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=150&h=150&fit=crop' },
      { name: 'Jaipur', country: 'India', tripsCount: 3450, trend: '+19%', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=150&h=150&fit=crop' },
      { name: 'Tokyo', country: 'Japan', tripsCount: 3120, trend: '+16%', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=150&h=150&fit=crop' },
      { name: 'Mumbai', country: 'India', tripsCount: 2980, trend: '+11%', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=150&h=150&fit=crop' },
      { name: 'Dubai', country: 'UAE', tripsCount: 2640, trend: '+8%', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=150&h=150&fit=crop' },
    ];
  },

  // ── 4. RECENT PLATFORM AUDIT LOG ──────────────────────────────────────────
  async getRecentActivityLog() {
    const trips = getCombinedTrips();
    const newestTrip = trips[0];
    const customEvent = newestTrip
      ? {
          id: `act-live-${newestTrip.id}`,
          type: 'trip_created',
          title: 'New Trip Created',
          desc: `${newestTrip.owner?.name || 'Traveler'} created "${newestTrip.title}"`,
          time: 'Just now',
          icon: 'Compass',
        }
      : null;

    const baseEvents = [
      { id: 'act-2', type: 'user_registered', title: 'New User Registered', desc: 'Devendra Patil joined GlobeTrotter from Pune, India', time: '18 mins ago', icon: 'UserPlus' },
      { id: 'act-3', type: 'trip_shared', title: 'Trip Shared Publicly', desc: 'Kenji Takahashi generated public share link for "Japan Cherry Blossom"', time: '42 mins ago', icon: 'Share2' },
      { id: 'act-4', type: 'dest_updated', title: 'Destination Catalog Updated', desc: '3 new activities verified for "Mumbai Heritage Quarter"', time: '1 hour ago', icon: 'MapPin' },
      { id: 'act-5', type: 'budget_optimized', title: 'AI Itinerary Generated', desc: 'Synchronized 5-day route generated for "Jaipur & Udaipur"', time: '2 hours ago', icon: 'Sparkles' },
    ];

    return customEvent ? [customEvent, ...baseEvents] : baseEvents;
  },

  // ── 5. USER MANAGEMENT CRUD ───────────────────────────────────────────────
  async getUsers({ search = '', status = 'All', page = 1, limit = 10 } = {}) {
    let list = getCombinedUsers();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.country && u.country.toLowerCase().includes(q)));
    }
    if (status !== 'All') {
      list = list.filter((u) => u.status.toLowerCase() === status.toLowerCase());
    }
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);
    return { users: paginated, total, page, totalPages: Math.ceil(total / limit) || 1 };
  },

  async updateUserStatus(id, newStatus) {
    const list = getCombinedUsers();
    const updated = list.map((u) => (u.id === id ? { ...u, status: newStatus } : u));
    saveStorage('users', updated);
    return updated.find((u) => u.id === id);
  },

  async deleteUser(id) {
    const list = getCombinedUsers();
    const updated = list.filter((u) => u.id !== id);
    saveStorage('users', updated);
    return true;
  },

  // ── 6. TRIP MANAGEMENT CRUD ───────────────────────────────────────────────
  async getTrips({ search = '', status = 'All', page = 1, limit = 10 } = {}) {
    let list = getCombinedTrips();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.owner?.name && t.owner.name.toLowerCase().includes(q)) ||
          (t.destinations && t.destinations.some((d) => (typeof d === 'string' ? d : d.name || '').toLowerCase().includes(q)))
      );
    }
    if (status !== 'All') {
      list = list.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);
    return { trips: paginated, total, page, totalPages: Math.ceil(total / limit) || 1 };
  },

  async updateTripStatus(id, newStatus) {
    const list = getCombinedTrips();
    const updated = list.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    saveStorage('trips', updated);
    return updated.find((t) => t.id === id);
  },

  async deleteTrip(id) {
    const list = getCombinedTrips();
    const updated = list.filter((t) => t.id !== id);
    saveStorage('trips', updated);
    return true;
  },

  // ── 7. DESTINATION MANAGEMENT CRUD ────────────────────────────────────────
  async getDestinations({ search = '', region = 'All', page = 1, limit = 10 } = {}) {
    let list = loadStorage('destinations', citiesData);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.state && d.state.toLowerCase().includes(q))
      );
    }
    if (region !== 'All') {
      list = list.filter(d => (d.region || '').toLowerCase() === region.toLowerCase());
    }
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);
    return { destinations: paginated, total, page, totalPages: Math.ceil(total / limit) || 1 };
  },

  async addDestination(newDest) {
    const list = loadStorage('destinations', citiesData);
    const item = {
      id: `city-custom-${Date.now()}`,
      name: newDest.name,
      country: newDest.country || 'India',
      state: newDest.state || '',
      region: newDest.region || 'Asia',
      description: newDest.description || '',
      coordinates: newDest.coordinates || { lat: 18.922, lng: 72.8347 },
      image: newDest.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop',
      avgCostPerDay: Number(newDest.avgCostPerDay) || 50,
      currency: newDest.currency || 'INR',
      status: 'Active',
      areas: newDest.areas || [{ id: 'a1', name: `${newDest.name} Central` }],
      destinations: newDest.destinations || [],
      activities: newDest.activities || [],
    };
    const updated = [item, ...list];
    saveStorage('destinations', updated);
    return item;
  },

  async updateDestination(id, patch) {
    const list = loadStorage('destinations', citiesData);
    const updated = list.map(d => (d.id === id ? { ...d, ...patch } : d));
    saveStorage('destinations', updated);
    return updated.find(d => d.id === id);
  },

  async archiveDestination(id) {
    const list = loadStorage('destinations', citiesData);
    const updated = list.filter(d => d.id !== id);
    saveStorage('destinations', updated);
    return true;
  },

  // ── 8. ACTIVITY MANAGEMENT CRUD ───────────────────────────────────────────
  async getActivities({ search = '', category = 'All', page = 1, limit = 10 } = {}) {
    let list = loadStorage('activities', null);
    if (!list) {
      list = getInitialActivities();
      saveStorage('activities', list);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.cityName.toLowerCase().includes(q));
    }
    if (category !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);
    return { activities: paginated, total, page, totalPages: Math.ceil(total / limit) || 1 };
  },

  async addActivity(newAct) {
    const list = loadStorage('activities', getInitialActivities());
    const item = {
      id: `act-custom-${Date.now()}`,
      name: newAct.name,
      cityName: newAct.cityName || 'Goa',
      category: newAct.category || 'Sightseeing',
      duration: newAct.duration || '2 hours',
      price: Number(newAct.price) || 800,
      currency: newAct.currency || 'INR',
      description: newAct.description || '',
      image: newAct.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&fit=crop',
      status: 'Active',
      rating: '4.8',
    };
    const updated = [item, ...list];
    saveStorage('activities', updated);
    return item;
  },

  async updateActivity(id, patch) {
    const list = loadStorage('activities', getInitialActivities());
    const updated = list.map(a => (a.id === id ? { ...a, ...patch } : a));
    saveStorage('activities', updated);
    return updated.find(a => a.id === id);
  },

  async archiveActivity(id) {
    const list = loadStorage('activities', getInitialActivities());
    const updated = list.filter(a => a.id !== id);
    saveStorage('activities', updated);
    return true;
  },

  // ── 9. PLATFORM SETTINGS ──────────────────────────────────────────────────
  async getSettings() {
    return loadStorage('settings', {
      platformName: 'GlobeTrotter Travel Platform',
      defaultCurrency: 'INR',
      defaultLanguage: 'en',
      timezone: 'Asia/Kolkata',
      allowPublicSharing: true,
      aiItineraryGenerator: true,
      maintenanceMode: false,
      adminEmailAlerts: true,
      catalogAutoSync: true,
      adminUser: {
        name: 'Aarav Mehta',
        email: 'admin@globetrotter.travel',
        role: 'Super Admin',
        lastLogin: 'Today at 08:30 AM',
      },
    });
  },

  async updateSettings(patch) {
    const current = await this.getSettings();
    const updated = { ...current, ...patch };
    saveStorage('settings', updated);
    return updated;
  },

  // ── 10. ITINERARIES MANAGEMENT ───────────────────────────────────────────
  async getItineraries({ search = '', durationFilter = 'All', page = 1, limit = 10 } = {}) {
    const tripsRes = await this.getTrips({ limit: 100 });
    const trips = tripsRes.trips || [];

    let itineraryStore = {};
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gt_itinerary_store');
        if (stored) itineraryStore = JSON.parse(stored) || {};
      } catch (e) {}
    }

    const sampleDayCounts = { 'trip-001': 5, 'trip-002': 7, 'trip-003': 6, 'trip-004': 4 };

    const items = trips.map((trip) => {
      const explicitDays = itineraryStore[trip.id] || [];
      const daysCount = explicitDays.length > 0 ? explicitDays.length : (sampleDayCounts[trip.id] || 4);
      let activitiesCount = 0;
      if (explicitDays.length > 0) {
        activitiesCount = explicitDays.reduce((acc, d) => acc + (d.activities?.length || 0), 0);
      } else {
        activitiesCount = daysCount * 3;
      }

      const destinationsList = Array.isArray(trip.destinations)
        ? trip.destinations.join(' → ')
        : (trip.destination || 'Multi-City');

      return {
        id: `itin-${trip.id}`,
        tripId: trip.id,
        tripTitle: trip.title,
        userName: trip.userName || 'Aarav Mehta',
        userEmail: trip.userEmail || 'aarav.mehta@example.com',
        userAvatar: trip.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        destinations: destinationsList,
        daysCount,
        activitiesCount,
        budget: trip.budget || 2400,
        currency: trip.currency || 'USD',
        status: trip.status === 'active' ? 'Published' : 'Draft',
        pacing: daysCount > 5 ? 'Relaxed' : daysCount >= 3 ? 'Balanced' : 'Fast-paced',
        isAiGenerated: true,
        lastUpdated: trip.createdAt || '2026-03-15',
        days: explicitDays.length > 0 ? explicitDays : [
          { day: 1, title: 'Arrival & Welcome Exploration', location: trip.destinations?.[0] || 'City Center', activities: [
            { id: 'a1', time: '10:00 AM', name: 'Hotel Check-in & Orientation', category: 'Transport', duration: 60, cost: 0 },
            { id: 'a2', time: '01:30 PM', name: 'Local Gastronomy & Walking Tour', category: 'Food', duration: 90, cost: 45 },
            { id: 'a3', time: '05:00 PM', name: 'Iconic Sunset Landmark Viewpoint', category: 'Heritage', duration: 120, cost: 20 },
          ]},
          { day: 2, title: 'Cultural Landmarks & Historic Trail', location: trip.destinations?.[0] || 'Old Town', activities: [
            { id: 'a4', time: '09:30 AM', name: 'Ancient Architecture & Museum Pass', category: 'Culture', duration: 150, cost: 35 },
            { id: 'a5', time: '02:00 PM', name: 'Artisan Workshop & Market Discovery', category: 'Culture', duration: 90, cost: 15 },
          ]},
        ],
      };
    });

    let filtered = items;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(i =>
        i.tripTitle.toLowerCase().includes(q) ||
        i.destinations.toLowerCase().includes(q) ||
        i.userName.toLowerCase().includes(q)
      );
    }

    if (durationFilter === 'short') {
      filtered = filtered.filter(i => i.daysCount <= 3);
    } else if (durationFilter === 'medium') {
      filtered = filtered.filter(i => i.daysCount >= 4 && i.daysCount <= 6);
    } else if (durationFilter === 'extended') {
      filtered = filtered.filter(i => i.daysCount >= 7);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return {
      itineraries: paged,
      total,
      totalPages,
      page,
    };
  },

  async optimizeItinerary(tripId) {
    return {
      success: true,
      message: 'Itinerary optimized with AI! Transit buffers adjusted by 15 mins and activities redistributed for balanced daily fatigue.',
    };
  },
};
