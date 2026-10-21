// Mock Activities — tied to cities via cityId
export const mockActivities = [
  // Goa
  {
    id: 'act-001', cityId: 'city-001', name: 'Calangute Beach Sunrise',
    category: 'Beach', duration: 90, estimatedCost: 0,
    description: 'Peaceful sunrise walk and swim at Goa\'s most popular beach.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format',
    tags: ['Beach', 'Free', 'Morning'],
  },
  {
    id: 'act-002', cityId: 'city-001', name: 'Spice Plantation Tour',
    category: 'Culture', duration: 180, estimatedCost: 25,
    description: 'Guided walk through fragrant spice farms with a traditional lunch.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop&auto=format',
    tags: ['Cultural', 'Nature', 'Lunch'],
  },
  {
    id: 'act-003', cityId: 'city-001', name: 'Old Goa Church Trail',
    category: 'History', duration: 120, estimatedCost: 5,
    description: 'UNESCO-listed Portuguese churches including Basilica of Bom Jesus.',
    image: 'https://images.unsplash.com/photo-1609349093779-c7e65f2e62b2?w=300&h=200&fit=crop&auto=format',
    tags: ['History', 'UNESCO', 'Architecture'],
  },
  {
    id: 'act-004', cityId: 'city-001', name: 'Sunset Cruise on Mandovi River',
    category: 'Relaxation', duration: 90, estimatedCost: 18,
    description: 'Scenic boat cruise with Konkani folk music and dance.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop&auto=format',
    tags: ['Relaxation', 'Scenic', 'Evening'],
  },
  // Paris
  {
    id: 'act-005', cityId: 'city-002', name: 'Eiffel Tower at Dusk',
    category: 'Sightseeing', duration: 120, estimatedCost: 28,
    description: 'Visit the iconic iron lattice tower and watch Paris light up.',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=300&h=200&fit=crop&auto=format',
    tags: ['Iconic', 'Evening', 'Photography'],
  },
  {
    id: 'act-006', cityId: 'city-002', name: 'Louvre Museum Morning',
    category: 'Culture', duration: 240, estimatedCost: 22,
    description: 'World\'s largest art museum housing the Mona Lisa and thousands of masterpieces.',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&h=200&fit=crop&auto=format',
    tags: ['Art', 'Culture', 'History'],
  },
  {
    id: 'act-007', cityId: 'city-002', name: 'Montmartre & Sacré-Cœur',
    category: 'Culture', duration: 150, estimatedCost: 0,
    description: 'Explore the artistic hilltop village and its stunning white basilica.',
    image: 'https://images.unsplash.com/photo-1551634979-2b11f8c946fe?w=300&h=200&fit=crop&auto=format',
    tags: ['Art', 'Architecture', 'Free'],
  },
  {
    id: 'act-008', cityId: 'city-002', name: 'Seine River Dinner Cruise',
    category: 'Food', duration: 120, estimatedCost: 95,
    description: 'Three-course French dinner while floating past illuminated monuments.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200&fit=crop&auto=format',
    tags: ['Dinner', 'Romantic', 'Evening'],
  },
  // Tokyo
  {
    id: 'act-009', cityId: 'city-003', name: 'Senso-ji Temple at Dawn',
    category: 'Culture', duration: 90, estimatedCost: 0,
    description: 'Tokyo\'s oldest temple — most serene before the crowds arrive.',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&h=200&fit=crop&auto=format',
    tags: ['Temple', 'Morning', 'Free'],
  },
  {
    id: 'act-010', cityId: 'city-003', name: 'Tsukiji Outer Market',
    category: 'Food', duration: 120, estimatedCost: 35,
    description: 'Fresh sushi breakfast and Japanese street food at the famous market.',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop&auto=format',
    tags: ['Food', 'Morning', 'Sushi'],
  },
  {
    id: 'act-011', cityId: 'city-003', name: 'Shibuya Crossing & Shopping',
    category: 'Shopping', duration: 180, estimatedCost: 50,
    description: 'Experience the world\'s busiest pedestrian crossing and explore Harajuku.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&auto=format',
    tags: ['Shopping', 'Urban', 'Photography'],
  },
  // Santorini
  {
    id: 'act-012', cityId: 'city-004', name: 'Oia Sunset View',
    category: 'Relaxation', duration: 60, estimatedCost: 0,
    description: 'World-renowned sunset from Oia\'s iconic blue-domed church overlook.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop&auto=format',
    tags: ['Sunset', 'Free', 'Romantic'],
  },
  {
    id: 'act-013', cityId: 'city-004', name: 'Caldera Boat Tour',
    category: 'Adventure', duration: 300, estimatedCost: 75,
    description: 'Full-day sailing around the volcanic caldera with hot springs stop.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop&auto=format',
    tags: ['Adventure', 'Scenic', 'Full-day'],
  },
];
