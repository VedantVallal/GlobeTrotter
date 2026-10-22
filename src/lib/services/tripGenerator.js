import { getCity, mockCities } from '@/lib/data/mockCities';
import citiesData from '@/lib/data/citiesData.json';

// Helper to format date YYYY-MM-DD to +N days
function addDays(startDateStr, daysToAdd) {
  const date = new Date(startDateStr || '2026-11-10');
  if (isNaN(date.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + daysToAdd);
    return fallback.toISOString().split('T')[0];
  }
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

// Helper to lookup city data with rich fallbacks
function findCityInfo(nameOrQuery) {
  if (!nameOrQuery) return null;
  const q = String(nameOrQuery).trim().toLowerCase();

  // 1. Exact match from mockCities / citiesData
  let found = citiesData.find((c) => c.name.toLowerCase() === q);
  if (!found) {
    found = citiesData.find(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        q.includes(c.name.toLowerCase()) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }
  if (found) return found;

  // 2. Fallback city construct
  return {
    id: `city-custom-${q.replace(/\s+/g, '-').slice(0, 15)}`,
    name: nameOrQuery.split(',')[0].trim(),
    country: nameOrQuery.includes(',') ? nameOrQuery.split(',')[1].trim() : 'India',
    description: `Iconic travel destination with culture, scenic landscapes, and local heritage.`,
    coordinates: { lat: 18.922, lng: 72.8347 },
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop',
    areas: [
      { id: 'area-1', name: `${nameOrQuery.split(',')[0]} Central` },
      { id: 'area-2', name: `${nameOrQuery.split(',')[0]} Heritage Quarter` },
    ],
    destinations: [
      { id: 'dest-1', name: 'Historic Promenade & Landmark', category: 'Heritage', price: 200 },
      { id: 'dest-2', name: 'Scenic Viewpoint & Gardens', category: 'Sightseeing', price: 100 },
    ],
    activities: [
      { id: 'act-1', name: 'Guided Cultural Heritage Walk', category: 'Culture', price: 500 },
      { id: 'act-2', name: 'Sunset Boat Cruise / Panorama', category: 'Adventure', price: 800 },
    ],
    food: [
      { id: 'food-1', name: 'Traditional Culinary Tasting', category: 'Food', price: 600 },
      { id: 'food-2', name: 'Iconic Local Cafe Experience', category: 'Food', price: 400 },
    ],
    stays: [
      { id: 'stay-1', name: 'Heritage Boutique Stay', category: 'Stay', price: 3500 },
    ],
  };
}

/**
 * Generate fully synchronized trip plan:
 * 1. nodes for TripPlayground (Canvas & Map)
 * 2. itineraryDays for ItineraryPage & Timeline Builder
 * Both share the same IDs, day numbers, times, categories, and INR costs.
 */
export function generateSynchronizedTripPlan({
  tripId,
  startLocation = 'Mumbai, India',
  destinations = ['Goa'],
  budget = 50000,
  currency = 'INR',
  startDate = '2026-11-10',
  endDate = '2026-11-15',
  travelers = 2,
  preferences = ['Beach', 'Culture'],
}) {
  // Calculate total days
  const start = new Date(startDate);
  const end = new Date(endDate);
  let totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
  if (isNaN(totalDays) || totalDays < 1) totalDays = 5;

  const originName = startLocation.split(',')[0].trim();
  const originInfo = findCityInfo(originName);

  const destInfos = destinations.map((d) => findCityInfo(d)).filter(Boolean);
  if (destInfos.length === 0) {
    destInfos.push(findCityInfo('Goa'));
  }

  // Budget allocations
  const numericBudget = Number(budget) || 50000;
  const costPerDay = Math.max(1000, Math.round(numericBudget / totalDays));

  const nodes = [];
  const itineraryDays = [];

  let currentY = 120;
  let activityIdCounter = 1;

  // 1. DEPARTURE ORIGIN NODE
  const deptNodeId = `node-dept-${tripId}`;
  nodes.push({
    id: deptNodeId,
    type: 'city',
    parentId: null,
    tripId,
    title: `${originName} (Departure)`,
    description: `Origin departure city for the journey. Departure scheduled on Day 1 at 08:00 AM.`,
    order: 0,
    dayNumber: 1,
    time: '08:00 AM',
    duration: '2 hours transit',
    estimatedCost: Math.round(numericBudget * 0.08),
    currency,
    category: 'Transport',
    image: originInfo?.image || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&fit=crop',
    location: startLocation,
    notes: `Board flight / train from ${originName}. Keep tickets and ID handy.`,
    x: 80,
    y: currentY,
  });

  // Layout positions for destination cities
  let cityX = 360;

  // Distribute days across destinations
  const destDaysMap = [];
  const daysPerDest = Math.max(1, Math.floor(totalDays / destInfos.length));
  let remainingDays = totalDays;

  destInfos.forEach((dest, idx) => {
    const isLast = idx === destInfos.length - 1;
    const daysForThis = isLast ? remainingDays : Math.min(remainingDays, daysPerDest);
    destDaysMap.push({ dest, daysCount: daysForThis });
    remainingDays -= daysForThis;
  });

  let currentDayCounter = 1;

  destDaysMap.forEach(({ dest, daysCount }, destIdx) => {
    const destCityNodeId = `node-city-${dest.name.toLowerCase().replace(/\s+/g, '-')}-${tripId}`;
    const cityStartY = currentY + (destIdx * 280);

    // DESTINATION CITY NODE
    nodes.push({
      id: destCityNodeId,
      type: 'city',
      parentId: deptNodeId,
      tripId,
      title: dest.name,
      description: dest.description || `Explore the beauty, architecture, and cuisine of ${dest.name}.`,
      order: destIdx + 1,
      dayNumber: currentDayCounter,
      time: currentDayCounter === 1 ? '11:30 AM' : '09:00 AM',
      duration: `${daysCount} days`,
      estimatedCost: Math.round(costPerDay * daysCount * 0.9),
      currency,
      category: dest.tags?.[0] || 'Destination',
      image: dest.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&fit=crop',
      location: `${dest.name}, ${dest.country}`,
      notes: `Primary destination stop. Stays and local areas centered around ${dest.name}.`,
      x: cityX,
      y: cityStartY,
    });

    // Create 1-2 Area nodes under this city
    const areasList = dest.areas && dest.areas.length > 0
      ? dest.areas
      : [
          { id: `area-${destIdx}-1`, name: `${dest.name} North / Central` },
          { id: `area-${destIdx}-2`, name: `${dest.name} South / Heritage` },
        ];

    const areaNodes = [];
    areasList.slice(0, 2).forEach((area, areaIdx) => {
      const areaNodeId = `node-area-${dest.name.toLowerCase()}-${areaIdx}-${tripId}`;
      const areaNode = {
        id: areaNodeId,
        type: 'area',
        parentId: destCityNodeId,
        tripId,
        title: area.name,
        description: `District hub for local sightseeing, cafes, and excursions.`,
        order: areaIdx + 1,
        dayNumber: currentDayCounter + areaIdx,
        time: '10:00 AM',
        duration: '1-2 days',
        estimatedCost: Math.round(costPerDay * 0.4),
        currency,
        category: 'Area',
        image: dest.image,
        location: `${area.name}, ${dest.name}`,
        x: cityX + 260,
        y: cityStartY + (areaIdx * 160) - 40,
      };
      nodes.push(areaNode);
      areaNodes.push(areaNode);
    });

    // Populate day by day for this destination
    for (let d = 0; d < daysCount; d++) {
      const dayNum = currentDayCounter;
      const dayDate = addDays(startDate, dayNum - 1);
      const chosenArea = areaNodes[d % areaNodes.length] || areaNodes[0];

      const dayActivities = [];

      // Day 1: Arrival & Evening Exploration
      if (dayNum === 1) {
        // Activity 1: Departure Transit
        const act1Id = `node-act-${activityIdCounter++}`;
        const act1 = {
          id: act1Id,
          type: 'activity',
          parentId: deptNodeId,
          tripId,
          title: `Departure from ${originName}`,
          description: `Morning departure flight / scenic train transit towards ${dest.name}.`,
          order: 1,
          dayNumber: 1,
          time: '08:00 AM',
          duration: '3 hours',
          estimatedCost: Math.round(costPerDay * 0.35),
          currency,
          category: 'Transport',
          location: `${originName} Airport / Station`,
          image: originInfo?.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&fit=crop',
          x: cityX + 540,
          y: cityStartY - 50,
        };
        nodes.push(act1);
        dayActivities.push({
          id: act1.id,
          time: act1.time,
          name: act1.title,
          description: act1.description,
          category: act1.category,
          duration: 180,
          cost: act1.estimatedCost,
          location: act1.location,
          image: act1.image,
        });

        // Activity 2: Hotel / Resort Check-in
        const stayItem = dest.stays?.[0] || { name: `${dest.name} Heritage Resort`, price: Math.round(costPerDay * 0.5) };
        const act2Id = `node-act-${activityIdCounter++}`;
        const act2 = {
          id: act2Id,
          type: 'stay',
          parentId: chosenArea.id,
          tripId,
          title: `Check-in: ${stayItem.name}`,
          description: `Check into resort, freshen up, and unpack for the trip.`,
          order: 2,
          dayNumber: 1,
          time: '12:00 PM',
          duration: '1 hour',
          estimatedCost: Number(stayItem.price) || Math.round(costPerDay * 0.5),
          currency,
          category: 'Stay',
          location: `${chosenArea.title}, ${dest.name}`,
          image: stayItem.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&fit=crop',
          x: cityX + 540,
          y: cityStartY + 30,
        };
        nodes.push(act2);
        dayActivities.push({
          id: act2.id,
          time: act2.time,
          name: act2.title,
          description: act2.description,
          category: act2.category,
          duration: 60,
          cost: act2.estimatedCost,
          location: act2.location,
          image: act2.image,
        });

        // Activity 3: Local Iconic Lunch
        const foodItem1 = dest.food?.[0] || { name: `${dest.name} Coastal Feast`, price: 650 };
        const act3Id = `node-act-${activityIdCounter++}`;
        const act3 = {
          id: act3Id,
          type: 'food',
          parentId: chosenArea.id,
          tripId,
          title: foodItem1.name,
          description: `Enjoy authentic local cuisine and seasonal specialties.`,
          order: 3,
          dayNumber: 1,
          time: '01:30 PM',
          duration: '90 mins',
          estimatedCost: Number(foodItem1.price) || 600,
          currency,
          category: 'Food',
          location: `${chosenArea.title}`,
          image: foodItem1.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&fit=crop',
          x: cityX + 540,
          y: cityStartY + 110,
        };
        nodes.push(act3);
        dayActivities.push({
          id: act3.id,
          time: act3.time,
          name: act3.title,
          description: act3.description,
          category: act3.category,
          duration: 90,
          cost: act3.estimatedCost,
          location: act3.location,
          image: act3.image,
        });

        // Activity 4: Sunset Beach / Landmark Stroll
        const destItem1 = dest.destinations?.[0] || { name: `${dest.name} Sunset Promenade`, price: 0 };
        const act4Id = `node-act-${activityIdCounter++}`;
        const act4 = {
          id: act4Id,
          type: 'destination',
          parentId: chosenArea.id,
          tripId,
          title: destItem1.name,
          description: `Golden hour stroll, ocean views, and panoramic photography.`,
          order: 4,
          dayNumber: 1,
          time: '05:30 PM',
          duration: '2 hours',
          estimatedCost: Number(destItem1.price) || 200,
          currency,
          category: destItem1.category || 'Sightseeing',
          location: `${dest.name}`,
          image: destItem1.image || dest.image,
          x: cityX + 540,
          y: cityStartY + 190,
        };
        nodes.push(act4);
        dayActivities.push({
          id: act4.id,
          time: act4.time,
          name: act4.title,
          description: act4.description,
          category: act4.category,
          duration: 120,
          cost: act4.estimatedCost,
          location: act4.location,
          image: act4.image,
        });

        itineraryDays.push({
          day: dayNum,
          date: dayDate,
          title: `Day 1: Arrival & Welcome to ${dest.name}`,
          location: `${dest.name}, ${dest.country}`,
          activities: dayActivities,
        });
      }
      // Middle Days: Sightseeing, Adventure, Food, Culture
      else if (dayNum < totalDays) {
        const destItem = dest.destinations?.[d % (dest.destinations?.length || 1)] || { name: `${dest.name} Famous Landmark`, price: 250 };
        const actItem = dest.activities?.[d % (dest.activities?.length || 1)] || { name: `Guided Tour & Adventure`, price: 800 };
        const foodItem = dest.food?.[(d + 1) % (dest.food?.length || 1)] || { name: `Fine Dining Experience`, price: 900 };

        // Morning Attraction
        const a1Id = `node-act-${activityIdCounter++}`;
        const a1 = {
          id: a1Id,
          type: 'destination',
          parentId: chosenArea.id,
          tripId,
          title: destItem.name,
          description: `Morning exploration of top-rated landmarks and cultural sights.`,
          order: 1,
          dayNumber: dayNum,
          time: '09:30 AM',
          duration: '2.5 hours',
          estimatedCost: Number(destItem.price) || 300,
          currency,
          category: destItem.category || 'Sightseeing',
          location: `${chosenArea.title}`,
          image: destItem.image || dest.image,
          x: cityX + 540,
          y: cityStartY + (d * 80) + 20,
        };
        nodes.push(a1);
        dayActivities.push({
          id: a1.id,
          time: a1.time,
          name: a1.title,
          description: a1.description,
          category: a1.category,
          duration: 150,
          cost: a1.estimatedCost,
          location: a1.location,
          image: a1.image,
        });

        // Lunch
        const a2Id = `node-act-${activityIdCounter++}`;
        const a2 = {
          id: a2Id,
          type: 'food',
          parentId: chosenArea.id,
          tripId,
          title: foodItem.name,
          description: `Midday curated dining featuring local flavors and refreshing drinks.`,
          order: 2,
          dayNumber: dayNum,
          time: '01:30 PM',
          duration: '1 hour',
          estimatedCost: Number(foodItem.price) || 750,
          currency,
          category: 'Food',
          location: `${dest.name}`,
          image: foodItem.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&fit=crop',
          x: cityX + 540,
          y: cityStartY + (d * 80) + 80,
        };
        nodes.push(a2);
        dayActivities.push({
          id: a2.id,
          time: a2.time,
          name: a2.title,
          description: a2.description,
          category: a2.category,
          duration: 60,
          cost: a2.estimatedCost,
          location: a2.location,
          image: a2.image,
        });

        // Afternoon Experience / Activity
        const a3Id = `node-act-${activityIdCounter++}`;
        const a3 = {
          id: a3Id,
          type: 'activity',
          parentId: chosenArea.id,
          tripId,
          title: actItem.name,
          description: `Handcrafted immersive experience showcasing local traditions or thrill.`,
          order: 3,
          dayNumber: dayNum,
          time: '04:00 PM',
          duration: '2 hours',
          estimatedCost: Number(actItem.price) || 1200,
          currency,
          category: actItem.category || 'Adventure',
          location: `${dest.name}`,
          image: actItem.image || dest.image,
          x: cityX + 540,
          y: cityStartY + (d * 80) + 140,
        };
        nodes.push(a3);
        dayActivities.push({
          id: a3.id,
          time: a3.time,
          name: a3.title,
          description: a3.description,
          category: a3.category,
          duration: 120,
          cost: a3.estimatedCost,
          location: a3.location,
          image: a3.image,
        });

        itineraryDays.push({
          day: dayNum,
          date: dayDate,
          title: `Day ${dayNum}: ${dest.name} Highlights & Exploration`,
          location: `${dest.name}, ${dest.country}`,
          activities: dayActivities,
        });
      }
      // Final Day: Souvenirs & Return Departure
      else {
        // Morning Bazaar / Shopping
        const f1Id = `node-act-${activityIdCounter++}`;
        const f1 = {
          id: f1Id,
          type: 'destination',
          parentId: chosenArea.id,
          tripId,
          title: `${dest.name} Artisanal Flea & Spice Market`,
          description: `Pick up authentic handcrafted souvenirs, spices, and local sweets.`,
          order: 1,
          dayNumber: dayNum,
          time: '10:00 AM',
          duration: '2 hours',
          estimatedCost: 1500,
          currency,
          category: 'Culture',
          location: `${dest.name} Central Market`,
          image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&fit=crop',
          x: cityX + 540,
          y: cityStartY + (d * 80) + 20,
        };
        nodes.push(f1);
        dayActivities.push({
          id: f1.id,
          time: f1.time,
          name: f1.title,
          description: f1.description,
          category: f1.category,
          duration: 120,
          cost: f1.estimatedCost,
          location: f1.location,
          image: f1.image,
        });

        // Farewell Lunch
        const f2Id = `node-act-${activityIdCounter++}`;
        const f2 = {
          id: f2Id,
          type: 'food',
          parentId: chosenArea.id,
          tripId,
          title: 'Farewell Tasting Lunch',
          description: `Relaxed rooftop or seaside lunch before airport / station departure.`,
          order: 2,
          dayNumber: dayNum,
          time: '01:00 PM',
          duration: '90 mins',
          estimatedCost: 800,
          currency,
          category: 'Food',
          location: `${chosenArea.title}`,
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&fit=crop',
          x: cityX + 540,
          y: cityStartY + (d * 80) + 80,
        };
        nodes.push(f2);
        dayActivities.push({
          id: f2.id,
          time: f2.time,
          name: f2.title,
          description: f2.description,
          category: f2.category,
          duration: 90,
          cost: f2.estimatedCost,
          location: f2.location,
          image: f2.image,
        });

        // Return Transit
        const f3Id = `node-act-${activityIdCounter++}`;
        const f3 = {
          id: f3Id,
          type: 'activity',
          parentId: deptNodeId,
          tripId,
          title: `Return Transit to ${originName}`,
          description: `Homeward bound flight / train journey back to ${originName}.`,
          order: 3,
          dayNumber: dayNum,
          time: '05:00 PM',
          duration: '3 hours',
          estimatedCost: Math.round(numericBudget * 0.08),
          currency,
          category: 'Transport',
          location: `${dest.name} Transit Station`,
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&fit=crop',
          x: cityX + 540,
          y: cityStartY + (d * 80) + 140,
        };
        nodes.push(f3);
        dayActivities.push({
          id: f3.id,
          time: f3.time,
          name: f3.title,
          description: f3.description,
          category: f3.category,
          duration: 180,
          cost: f3.estimatedCost,
          location: f3.location,
          image: f3.image,
        });

        itineraryDays.push({
          day: dayNum,
          date: dayDate,
          title: `Day ${dayNum}: Souvenirs & Farewell Return to ${originName}`,
          location: `${dest.name} → ${originName}`,
          activities: dayActivities,
        });
      }

      currentDayCounter++;
    }
  });

  return {
    nodes,
    itineraryDays,
  };
}
