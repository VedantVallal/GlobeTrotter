// Playground Data Model & Helper Utilities

export const NODE_TYPES = {
  TRIP: 'trip',
  CITY: 'city',
  AREA: 'area',
  DESTINATION: 'destination',
  ACTIVITY: 'activity',
};

export const CATEGORIES = [
  'Sightseeing',
  'Beach',
  'Culture',
  'Food',
  'History',
  'Nature',
  'Relaxation',
  'Shopping',
  'Adventure',
];

import citiesData from '@/lib/data/citiesData.json';

const initialCuratedPlaces = [
  {
    id: 'place-goa-baga',
    name: 'Baga Beach',
    cityName: 'Goa',
    areaName: 'North Goa',
    type: 'destination',
    category: 'Beach',
    duration: '3 hours',
    estimatedCost: 0,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop',
    description: 'Vibrant beach with water sports, beach shacks, and golden sands.',
  },
  {
    id: 'place-goa-aguada',
    name: 'Fort Aguada',
    cityName: 'Goa',
    areaName: 'North Goa',
    type: 'destination',
    category: 'History',
    duration: '2 hours',
    estimatedCost: 10,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=500&h=300&fit=crop',
    description: '17th-century Portuguese lighthouse and fortress with Arabian Sea views.',
  },
  {
    id: 'place-goa-palolem',
    name: 'Palolem Beach',
    cityName: 'Goa',
    areaName: 'South Goa',
    type: 'destination',
    category: 'Beach',
    duration: '4 hours',
    estimatedCost: 0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
    description: 'Crescent-shaped serene beach framed by coconut palms and beach huts.',
  },
  {
    id: 'place-goa-anjuna',
    name: 'Anjuna Flea Market',
    cityName: 'Goa',
    areaName: 'North Goa',
    type: 'destination',
    category: 'Shopping',
    duration: '2.5 hours',
    estimatedCost: 15,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=500&h=300&fit=crop',
    description: 'Iconic open-air market with handmade crafts, spices, and live music.',
  },
  {
    id: 'place-goa-dudhsagar',
    name: 'Dudhsagar Waterfalls',
    cityName: 'Goa',
    areaName: 'South Goa',
    type: 'destination',
    category: 'Nature',
    duration: '5 hours',
    estimatedCost: 35,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500&h=300&fit=crop',
    description: 'Four-tiered spectacular waterfall located on the Mandovi River.',
  },
  {
    id: 'place-mumbai-gateway',
    name: 'Gateway of India',
    cityName: 'Mumbai',
    areaName: 'Colaba',
    type: 'destination',
    category: 'Sightseeing',
    duration: '1.5 hours',
    estimatedCost: 0,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=300&fit=crop',
    description: 'Historic arch monument overlooking Mumbai Harbour built in 1924.',
  },
  {
    id: 'place-mumbai-marine',
    name: 'Marine Drive',
    cityName: 'Mumbai',
    areaName: 'South Mumbai',
    type: 'destination',
    category: 'Relaxation',
    duration: '2 hours',
    estimatedCost: 0,
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&h=300&fit=crop',
    description: 'The Queens Necklace promenade along the Arabian Sea coast.',
  },
  {
    id: 'place-mumbai-elephanta',
    name: 'Elephanta Caves',
    cityName: 'Mumbai',
    areaName: 'Colaba',
    type: 'destination',
    category: 'History',
    duration: '4 hours',
    estimatedCost: 20,
    image: 'https://images.unsplash.com/photo-1600100397608-f010e421a172?w=500&h=300&fit=crop',
    description: 'UNESCO World Heritage rock-cut cave temples dedicated to Lord Shiva.',
  },
  {
    id: 'place-paris-eiffel',
    name: 'Eiffel Tower',
    cityName: 'Paris',
    areaName: 'Champ de Mars',
    type: 'destination',
    category: 'Sightseeing',
    duration: '2.5 hours',
    estimatedCost: 32,
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&h=300&fit=crop',
    description: 'Iconic iron lattice tower with observation decks over Paris.',
  },
  {
    id: 'place-paris-louvre',
    name: 'Louvre Museum',
    cityName: 'Paris',
    areaName: '1st Arrondissement',
    type: 'destination',
    category: 'Culture',
    duration: '3.5 hours',
    estimatedCost: 22,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&h=300&fit=crop',
    description: 'World landmark art museum featuring the Mona Lisa and Winged Victory.',
  },
];

// Combine with destinations from all 276 cities in citiesData.json
const datasetDestinations = [];
for (const city of citiesData) {
  if (city.destinations && Array.isArray(city.destinations)) {
    for (const d of city.destinations) {
      datasetDestinations.push(d);
    }
  }
}

export const mockCuratedPlaces = [...initialCuratedPlaces, ...datasetDestinations];

// Generates the illustrative hierarchy specified in the prompt
export function createDefaultHierarchicalNodes(tripId = 'trip-001') {
  const nodes = [
    // CITY 1: GOA
    {
      id: 'node-city-goa',
      type: 'city',
      parentId: null,
      tripId,
      title: 'Goa',
      description: 'Sun-kissed beaches, coastal cuisine, and Portuguese heritage.',
      order: 1,
      dayNumber: 1,
      duration: '4 days',
      estimatedCost: 220,
      currency: 'USD',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop',
      location: 'India',
      notes: 'Rent a scooter for easy transit between North and South.',
      x: 100,
      y: 180,
    },
    // AREA 1.1: NORTH GOA
    {
      id: 'node-area-north-goa',
      type: 'area',
      parentId: 'node-city-goa',
      tripId,
      title: 'North Goa',
      description: 'Bustling beach towns, lively cafes, water sports, and nightlife.',
      order: 1,
      dayNumber: 1,
      duration: '2 days',
      estimatedCost: 75,
      currency: 'USD',
      category: 'Sightseeing',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      location: 'Goa, India',
      notes: 'Base around Calangute or Candolim.',
      x: 360,
      y: 100,
    },
    // DESTINATION 1.1.1: BAGA BEACH
    {
      id: 'node-dest-baga',
      type: 'destination',
      parentId: 'node-area-north-goa',
      tripId,
      title: 'Baga Beach',
      description: 'Popular beach with water sports, beach shacks, and energetic vibe.',
      order: 1,
      dayNumber: 1,
      duration: '3 hours',
      estimatedCost: 0,
      currency: 'USD',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop',
      location: 'North Goa',
      notes: 'Great for afternoon parasailing and sunset shacks.',
      x: 640,
      y: 40,
    },
    // DESTINATION 1.1.2: FORT AGUADA
    {
      id: 'node-dest-aguada',
      type: 'destination',
      parentId: 'node-area-north-goa',
      tripId,
      title: 'Fort Aguada',
      description: '17th-century Portuguese fortress and lighthouse guarding Sinquerim.',
      order: 2,
      dayNumber: 1,
      duration: '2 hours',
      estimatedCost: 10,
      currency: 'USD',
      category: 'History',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=500&h=300&fit=crop',
      location: 'Sinquerim, North Goa',
      notes: 'Arrive early to avoid midday heat.',
      x: 640,
      y: 130,
    },
    // ACTIVITY 1.1.3: FOOD EXPERIENCE
    {
      id: 'node-act-food-exp',
      type: 'activity',
      parentId: 'node-area-north-goa',
      tripId,
      title: 'Food Experience',
      description: 'Traditional Goan fish curry, prawn balchão, and bebinca dessert tasting.',
      order: 3,
      dayNumber: 2,
      duration: '2 hours',
      estimatedCost: 35,
      currency: 'USD',
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=300&fit=crop',
      location: 'Anjuna, North Goa',
      notes: 'Try fisherman thali at Vinayak Family Restaurant.',
      x: 640,
      y: 220,
    },
    // AREA 1.2: SOUTH GOA
    {
      id: 'node-area-south-goa',
      type: 'area',
      parentId: 'node-city-goa',
      tripId,
      title: 'South Goa',
      description: 'Tranquil coastal villages, scenic palm-lined roads, and calm waters.',
      order: 2,
      dayNumber: 3,
      duration: '2 days',
      estimatedCost: 65,
      currency: 'USD',
      category: 'Relaxation',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
      location: 'Goa, India',
      notes: 'Much quieter atmosphere than the north.',
      x: 360,
      y: 330,
    },
    // DESTINATION 1.2.1: PALOLEM BEACH
    {
      id: 'node-dest-palolem',
      type: 'destination',
      parentId: 'node-area-south-goa',
      tripId,
      title: 'Palolem Beach',
      description: 'Crescent bay with calm waters, kayak rentals, and dolphin spotting.',
      order: 1,
      dayNumber: 3,
      duration: '4 hours',
      estimatedCost: 0,
      currency: 'USD',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
      location: 'Canacona, South Goa',
      notes: 'Rent a transparent kayak around Monkey Island.',
      x: 640,
      y: 320,
    },
    // DESTINATION/ACTIVITY 1.2.2: LOCAL MARKET
    {
      id: 'node-act-local-market',
      type: 'destination',
      parentId: 'node-area-south-goa',
      tripId,
      title: 'Local Market',
      description: 'Madgaon heritage market filled with cashew nuts, spices, and souvenirs.',
      order: 2,
      dayNumber: 4,
      duration: '2.5 hours',
      estimatedCost: 20,
      currency: 'USD',
      category: 'Shopping',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=500&h=300&fit=crop',
      location: 'Margao, South Goa',
      notes: 'Bring cash for artisanal stalls and fresh spices.',
      x: 640,
      y: 410,
    },
    // CITY 2: MUMBAI
    {
      id: 'node-city-mumbai',
      type: 'city',
      parentId: null,
      tripId,
      title: 'Mumbai',
      description: 'The City of Dreams — colonial architecture, Bollywood, and coastal promenades.',
      order: 2,
      dayNumber: 5,
      duration: '3 days',
      estimatedCost: 195,
      currency: 'USD',
      category: 'Sightseeing',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=300&fit=crop',
      location: 'India',
      notes: 'Use local taxis or cabs for city transit.',
      x: 100,
      y: 560,
    },
    // DESTINATION 2.1: GATEWAY OF INDIA
    {
      id: 'node-dest-gateway',
      type: 'destination',
      parentId: 'node-city-mumbai',
      tripId,
      title: 'Gateway of India',
      description: 'Grand 20th-century arch overlooking the Arabian Sea by the Taj Mahal Palace.',
      order: 1,
      dayNumber: 5,
      duration: '2 hours',
      estimatedCost: 5,
      currency: 'USD',
      category: 'Sightseeing',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=300&fit=crop',
      location: 'Colaba, Mumbai',
      notes: 'Ferry to Elephanta leaves directly from here.',
      x: 360,
      y: 520,
    },
    // DESTINATION 2.2: MARINE DRIVE
    {
      id: 'node-dest-marine-drive',
      type: 'destination',
      parentId: 'node-city-mumbai',
      tripId,
      title: 'Marine Drive',
      description: 'Iconic curved seaside promenade famous for evening breeze and street snacks.',
      order: 2,
      dayNumber: 6,
      duration: '2.5 hours',
      estimatedCost: 0,
      currency: 'USD',
      category: 'Relaxation',
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&h=300&fit=crop',
      location: 'South Mumbai',
      notes: 'Best experienced during sunset or late evening.',
      x: 360,
      y: 610,
    },
  ];
  return runAutoLayout(nodes);
}

// Calculate deterministic budget and summary statistics
export function calculateTripSummary(nodes, tripBudget = 1200) {
  let destinationCount = 0;
  let activityCount = 0;
  let cityCount = 0;
  let areaCount = 0;
  let totalCost = 0;
  let maxDay = 1;

  for (const node of nodes) {
    if (node.type === 'city') cityCount++;
    else if (node.type === 'area') areaCount++;
    else if (node.type === 'destination') destinationCount++;
    else if (node.type === 'activity') activityCount++;

    if (typeof node.estimatedCost === 'number' && !isNaN(node.estimatedCost)) {
      totalCost += node.estimatedCost;
    }
    if (node.dayNumber && Number(node.dayNumber) > maxDay) {
      maxDay = Number(node.dayNumber);
    }
  }

  const remainingBudget = tripBudget - totalCost;
  const isOverBudget = remainingBudget < 0;

  return {
    cityCount,
    areaCount,
    destinationCount,
    activityCount,
    totalStops: destinationCount + activityCount,
    totalCost,
    tripBudget,
    remainingBudget,
    isOverBudget,
    plannedDays: maxDay,
  };
}

// Hierarchical Auto-Layout Engine
// Places nodes cleanly in columns by hierarchy depth:
// Level 0: Cities (x ~ 100)
// Level 1: Areas (x ~ 360)
// Level 2: Destinations & Activities (x ~ 640)
// Level 3: Nested Activities (x ~ 920)
export function runAutoLayout(nodes) {
  if (!nodes || nodes.length === 0) return [];

  const updatedNodes = nodes.map((n) => ({ ...n }));
  const childrenMap = new Map();
  const rootNodes = [];

  // Group by parent
  for (const node of updatedNodes) {
    if (!node.parentId) {
      rootNodes.push(node);
    } else {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, []);
      }
      childrenMap.get(node.parentId).push(node);
    }
  }

  // Sort siblings by dayNumber first, then order (Strictly preserving chronological itinerary order)
  const sortChronological = (a, b) => {
    const dayA = Number(a.dayNumber) || 1;
    const dayB = Number(b.dayNumber) || 1;
    if (dayA !== dayB) return dayA - dayB;
    return (a.order || 0) - (b.order || 0);
  };

  rootNodes.sort(sortChronological);
  childrenMap.forEach((children) => {
    children.sort(sortChronological);
  });

  let currentGlobalY = 60;
  const X_STEP = 330;
  const NODE_VERTICAL_GAP = 160;

  function layoutSubtree(node, depth = 0) {
    const children = childrenMap.get(node.id) || [];
    node.x = 80 + depth * X_STEP;

    if (children.length === 0) {
      node.y = currentGlobalY;
      currentGlobalY += NODE_VERTICAL_GAP;
      return node.y;
    }

    const childYPositions = [];
    for (const child of children) {
      const childY = layoutSubtree(child, depth + 1);
      childYPositions.push(childY);
    }

    // Center parent relative to its children
    const minY = Math.min(...childYPositions);
    const maxY = Math.max(...childYPositions);
    node.y = Math.round((minY + maxY) / 2);
    return node.y;
  }

  for (const root of rootNodes) {
    layoutSubtree(root, 0);
    currentGlobalY += 40; // spacing between major city clusters
  }

  return updatedNodes;
}

// Geo-coordinates lookup map from citiesData.json
const cityCoordsMap = new Map();
for (const city of citiesData) {
  if (city.coordinates) {
    cityCoordsMap.set(city.name.toLowerCase(), city.coordinates);
    if (city.id) cityCoordsMap.set(city.id.toLowerCase(), city.coordinates);
  }
}

// Famous destination specific coordinates for high accuracy
const PLACE_COORDINATES = {
  'baga beach': { lat: 15.5553, lng: 73.7517 },
  'fort aguada': { lat: 15.4924, lng: 73.7737 },
  'palolem beach': { lat: 15.01, lng: 74.0232 },
  'anjuna flea market': { lat: 15.58, lng: 73.743 },
  'dudhsagar waterfalls': { lat: 15.3144, lng: 74.3143 },
  'gateway of india': { lat: 18.922, lng: 72.8347 },
  'marine drive': { lat: 18.9432, lng: 72.823 },
  'elephanta caves': { lat: 18.9633, lng: 72.9315 },
  'eiffel tower': { lat: 48.8584, lng: 2.2945 },
  'louvre museum': { lat: 48.8606, lng: 2.3376 },
};

function hashString(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

export function resolveNodeGeo(node, allNodes = []) {
  if (!node) return null;

  // 1. Direct coordinates check
  if (
    node.coordinates &&
    typeof node.coordinates.lat === 'number' &&
    typeof node.coordinates.lng === 'number'
  ) {
    return { lat: node.coordinates.lat, lng: node.coordinates.lng };
  }
  if (typeof node.lat === 'number' && typeof node.lng === 'number') {
    return { lat: node.lat, lng: node.lng };
  }

  const titleLower = (node.title || '').toLowerCase().trim();

  // 2. Famous place coordinates lookup
  if (PLACE_COORDINATES[titleLower]) {
    return PLACE_COORDINATES[titleLower];
  }

  // 3. City direct lookup
  if (cityCoordsMap.has(titleLower)) {
    return cityCoordsMap.get(titleLower);
  }

  // 4. Trace parent hierarchy
  let current = node;
  while (current.parentId) {
    const parent = allNodes.find((n) => n.id === current.parentId);
    if (!parent) break;
    const parentTitle = (parent.title || '').toLowerCase().trim();
    if (cityCoordsMap.has(parentTitle)) {
      const base = cityCoordsMap.get(parentTitle);
      const hash = Math.abs(hashString(node.id || node.title));
      const latOffset = ((hash % 100) - 50) * 0.0007;
      const lngOffset = (((hash / 100) % 100) - 50) * 0.0007;
      return { lat: base.lat + latOffset, lng: base.lng + lngOffset };
    }
    current = parent;
  }

  // 5. Check location field e.g. "Colaba, Mumbai"
  if (node.location) {
    const parts = node.location
      .toLowerCase()
      .split(',')
      .map((s) => s.trim());
    for (const part of parts) {
      if (cityCoordsMap.has(part)) {
        const base = cityCoordsMap.get(part);
        const hash = Math.abs(hashString(node.id || node.title));
        const latOffset = ((hash % 100) - 50) * 0.0007;
        const lngOffset = (((hash / 100) % 100) - 50) * 0.0007;
        return { lat: base.lat + latOffset, lng: base.lng + lngOffset };
      }
    }
  }

  // Default fallback (center of India)
  return { lat: 18.922, lng: 72.8347 };
}

