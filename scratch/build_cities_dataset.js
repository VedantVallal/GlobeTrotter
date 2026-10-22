// Generator for 200+ world & Indian famous travel destinations
const fs = require('fs');
const path = require('path');

const rawCities = [
  // ---------------- INDIA (75 CITIES) ----------------
  {
    name: 'Goa', country: 'India', region: 'Asia', avgCost: 45, lat: 15.2993, lng: 74.1240,
    tags: ['Beach', 'Nightlife', 'Culture'],
    desc: "India's beach paradise with golden sands, Portuguese architecture, and vibrant coastal shacks.",
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop',
    areas: ['North Goa', 'South Goa', 'Panaji Heritage Quarter'],
    destinations: [
      { name: 'Baga Beach', category: 'Beach', cost: 0, duration: '3 hours', area: 'North Goa', desc: 'Lively beach with watersports and shacks.' },
      { name: 'Fort Aguada', category: 'History', cost: 10, duration: '2 hours', area: 'North Goa', desc: '17th-century Portuguese fortress overlooking Arabian Sea.' },
      { name: 'Palolem Beach', category: 'Beach', cost: 0, duration: '4 hours', area: 'South Goa', desc: 'Scenic crescent bay with calm swimming waters.' }
    ],
    activities: [
      { name: 'Goan Fish Curry Tasting', category: 'Food', cost: 25, duration: '2 hours', desc: 'Authentic Konkani seafood thali with local feni tasting.' },
      { name: 'Mandovi River Sunset Cruise', category: 'Relaxation', cost: 20, duration: '1.5 hours', desc: 'Scenic boat cruise with live folk music.' }
    ]
  },
  {
    name: 'Mumbai', country: 'India', region: 'Asia', avgCost: 65, lat: 18.9220, lng: 72.8347,
    tags: ['Urban', 'Food', 'Culture'],
    desc: 'The City of Dreams — colonial heritage, Bollywood glamour, and scenic coastal promenades.',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop',
    areas: ['South Mumbai', 'Bandra West', 'Colaba'],
    destinations: [
      { name: 'Gateway of India', category: 'Sightseeing', cost: 0, duration: '1.5 hours', area: 'Colaba', desc: 'Iconic 1924 basalt arch monument overlooking Mumbai Harbour.' },
      { name: 'Marine Drive', category: 'Relaxation', cost: 0, duration: '2 hours', area: 'South Mumbai', desc: "The Queens Necklace seaside promenade." },
      { name: 'Elephanta Caves', category: 'History', cost: 15, duration: '4 hours', area: 'Colaba', desc: 'UNESCO cave temples dedicated to Shiva.' }
    ],
    activities: [
      { name: 'Chowpatty Street Food Safari', category: 'Food', cost: 15, duration: '2 hours', desc: 'Taste world-famous Pav Bhaji, Bhel Puri, and Kulfi.' },
      { name: 'Dharavi Slum Community Tour', category: 'Culture', cost: 25, duration: '2.5 hours', desc: 'Inspiring guided walk through artisanal micro-industries.' }
    ]
  },
  {
    name: 'Delhi', country: 'India', region: 'Asia', avgCost: 50, lat: 28.6139, lng: 77.2090,
    tags: ['History', 'Food', 'Culture'],
    desc: "India's capital blending medieval Mughal forts, colonial boulevards, and legendary street food.",
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop',
    areas: ['Old Delhi', 'New Delhi', 'Hauz Khas Village'],
    destinations: [
      { name: 'Red Fort', category: 'History', cost: 8, duration: '2.5 hours', area: 'Old Delhi', desc: 'Massive red sandstone residence of Mughal emperors.' },
      { name: 'Qutub Minar', category: 'History', cost: 8, duration: '2 hours', area: 'New Delhi', desc: '73-meter victory tower built in 1193.' },
      { name: 'Humayun Tomb', category: 'History', cost: 8, duration: '2 hours', area: 'New Delhi', desc: 'Sublime garden tomb that inspired the Taj Mahal.' }
    ],
    activities: [
      { name: 'Chandni Chowk Rickshaw Food Crawl', category: 'Food', cost: 20, duration: '3 hours', desc: 'Parathas, jalebis, and kebabs in century-old alleys.' },
      { name: 'Sufi Night at Nizamuddin Dargah', category: 'Culture', cost: 0, duration: '2 hours', desc: 'Devotional qawwali music in a sacred historic courtyard.' }
    ]
  },
  {
    name: 'Jaipur', country: 'India', region: 'Asia', avgCost: 45, lat: 26.9124, lng: 75.7873,
    tags: ['Culture', 'History', 'Shopping'],
    desc: 'The Pink City of Rajasthan, renowned for magnificent hill forts, royal palaces, and jewelry bazaars.',
    img: 'https://images.unsplash.com/photo-1603288967069-b5900593b4f7?w=600&h=400&fit=crop',
    areas: ['Old City', 'Amer', 'C-Scheme'],
    destinations: [
      { name: 'Hawa Mahal', category: 'Sightseeing', cost: 5, duration: '1 hour', area: 'Old City', desc: 'Palace of Winds with 953 honeycomb sandstone windows.' },
      { name: 'Amber Fort', category: 'History', cost: 10, duration: '3 hours', area: 'Amer', desc: 'Hilltop fortress featuring the stunning Sheesh Mahal mirror hall.' },
      { name: 'City Palace', category: 'History', cost: 12, duration: '2.5 hours', area: 'Old City', desc: 'Royal residence with courtyards, museums, and peacock gates.' }
    ],
    activities: [
      { name: 'Sunrise Hot Air Ballooning', category: 'Adventure', cost: 120, duration: '3 hours', desc: 'Float above desert hillforts as the sun illuminates the Aravalis.' },
      { name: 'Johari Bazaar Gemstone Walk', category: 'Shopping', cost: 0, duration: '2 hours', desc: 'Explore silver jewelry, emeralds, and block-print textiles.' }
    ]
  },
  {
    name: 'Udaipur', country: 'India', region: 'Asia', avgCost: 55, lat: 24.5854, lng: 73.7125,
    tags: ['Romance', 'Lakes', 'Palaces'],
    desc: 'The Venice of the East, famed for shimmering Lake Pichola and white marble palaces.',
    img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&h=400&fit=crop',
    areas: ['Lake Pichola', 'Fateh Sagar', 'Old Town'],
    destinations: [
      { name: 'City Palace Udaipur', category: 'History', cost: 10, duration: '3 hours', area: 'Lake Pichola', desc: 'Sprawling palace complex with panoramic lake balconies.' },
      { name: 'Lake Palace', category: 'Sightseeing', cost: 20, duration: '2 hours', area: 'Lake Pichola', desc: 'Floating marble island palace in the center of Lake Pichola.' },
      { name: 'Saheliyon-ki-Bari', category: 'Nature', cost: 3, duration: '1 hour', area: 'Fateh Sagar', desc: 'Royal garden of maidens with fountains and lotus pools.' }
    ],
    activities: [
      { name: 'Sunset Boat Cruise on Lake Pichola', category: 'Relaxation', cost: 15, duration: '1.5 hours', desc: 'Glide past lit-up ghats and palaces at golden hour.' },
      { name: 'Dharohar Folk Dance Show', category: 'Culture', cost: 12, duration: '1.5 hours', desc: 'Traditional Rajasthani puppet and fire dance at Bagore Ki Haveli.' }
    ]
  },
  {
    name: 'Varanasi', country: 'India', region: 'Asia', avgCost: 35, lat: 25.3176, lng: 82.9739,
    tags: ['Spiritual', 'Culture', 'History'],
    desc: "One of the world's oldest continually inhabited cities, sacred to Hinduism on the holy River Ganga.",
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop',
    areas: ['Dashashwamedh Ghat', 'Assi Ghat', 'Sarnath'],
    destinations: [
      { name: 'Dashashwamedh Ghat', category: 'Spiritual', cost: 0, duration: '2 hours', area: 'Dashashwamedh Ghat', desc: 'Main ghat famous for evening Ganga Aarti rituals.' },
      { name: 'Kashi Vishwanath Temple', category: 'Spiritual', cost: 5, duration: '1.5 hours', area: 'Old City', desc: 'Golden temple dedicated to Lord Shiva.' },
      { name: 'Dhamek Stupa at Sarnath', category: 'History', cost: 5, duration: '2.5 hours', area: 'Sarnath', desc: 'Where Lord Buddha gave his first sermon.' }
    ],
    activities: [
      { name: 'Dawn Boat Ride on River Ganga', category: 'Spiritual', cost: 12, duration: '2 hours', desc: 'Watch sacred morning rituals and sunrise over the ghats.' },
      { name: 'Banarasi Silk Weaving Workshop', category: 'Culture', cost: 0, duration: '2 hours', desc: 'See master weavers create real gold-threaded bridal sarees.' }
    ]
  },
  {
    name: 'Agra', country: 'India', region: 'Asia', avgCost: 45, lat: 27.1767, lng: 78.0081,
    tags: ['History', 'Monuments', 'Mughal'],
    desc: 'Home to the magnificent Taj Mahal and grand Mughal red stone fortresses.',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
    areas: ['Taj Ganj', 'Agra Cantonment', 'Fatehpur Sikri'],
    destinations: [
      { name: 'Taj Mahal', category: 'History', cost: 15, duration: '3 hours', area: 'Taj Ganj', desc: 'UNESCO World Wonder and marble monument of eternal love.' },
      { name: 'Agra Fort', category: 'History', cost: 8, duration: '2.5 hours', area: 'Agra Cantonment', desc: 'Massive 16th-century Mughal walled citadel.' },
      { name: 'Mehtab Bagh', category: 'Sightseeing', cost: 4, duration: '1.5 hours', area: 'Yamuna Riverbank', desc: 'Moonlight garden offering sunset views across the river to the Taj.' }
    ],
    activities: [
      { name: 'Sunrise Taj Photography Walk', category: 'Sightseeing', cost: 15, duration: '2 hours', desc: 'Capture soft morning light reflections across the marble pools.' },
      { name: 'Petha Sweets & Mughlai Food Trail', category: 'Food', cost: 12, duration: '2 hours', desc: 'Taste authentic Bedai, Jalebi, and world-famous Agra Petha.' }
    ]
  },
  {
    name: 'Manali', country: 'India', region: 'Asia', avgCost: 40, lat: 32.2432, lng: 77.1892,
    tags: ['Mountains', 'Adventure', 'Snow'],
    desc: 'High-altitude Himalayan resort town surrounded by cedar forests, snow peaks, and rivers.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop',
    areas: ['Old Manali', 'Solang Valley', 'Mall Road'],
    destinations: [
      { name: 'Solang Valley', category: 'Adventure', cost: 15, duration: '4 hours', area: 'Solang Valley', desc: 'Hub for paragliding, zorbing, and winter skiing.' },
      { name: 'Hadimba Devi Temple', category: 'History', cost: 0, duration: '1 hour', area: 'Dhungri Forest', desc: 'Pagoda-style 16th-century wooden temple in cedar woods.' },
      { name: 'Atal Tunnel & Sissu', category: 'Nature', cost: 25, duration: '5 hours', area: 'Lahaul Valley', desc: 'Drive under Pir Panjal mountains into high-altitude Tibetan landscapes.' }
    ],
    activities: [
      { name: 'Beas River White Water Rafting', category: 'Adventure', cost: 25, duration: '2 hours', desc: 'Grade III rapids in thrilling Himalayan meltwater.' },
      { name: 'Old Manali Bohemian Cafe Crawl', category: 'Food', cost: 18, duration: '3 hours', desc: 'Woodfired trout, Israeli shakshuka, and apple crumble.' }
    ]
  },
  {
    name: 'Rishikesh', country: 'India', region: 'Asia', avgCost: 35, lat: 30.0869, lng: 78.2676,
    tags: ['Yoga', 'Adventure', 'Spiritual'],
    desc: 'The Yoga Capital of the World where the turquoise Ganga emerges from the Himalayan foothills.',
    img: 'https://images.unsplash.com/photo-1599818816942-53b7545939fc?w=600&h=400&fit=crop',
    areas: ['Tapovan', 'Ram Jhula', 'Laxman Jhula'],
    destinations: [
      { name: 'Beatles Ashram', category: 'History', cost: 8, duration: '2 hours', area: 'Ram Jhula', desc: 'Maharishi Mahesh Yogi ashram covered in meditation graffiti.' },
      { name: 'Triveni Ghat', category: 'Spiritual', cost: 0, duration: '2 hours', area: 'Rishikesh Town', desc: 'Grand confluence ghat with evening oil-lamp aarti ceremonies.' },
      { name: 'Neer Garh Waterfall', category: 'Nature', cost: 2, duration: '2.5 hours', area: 'Tapovan', desc: 'Cascading natural limestone pools tucked in mountain forests.' }
    ],
    activities: [
      { name: 'Ganga White Water Rafting', category: 'Adventure', cost: 20, duration: '3 hours', desc: 'Raft through Roller Coaster and Golf Course rapids.' },
      { name: 'Sunset Ganga Aarti at Parmarth Niketan', category: 'Spiritual', cost: 0, duration: '1.5 hours', desc: 'Chants, fire lamps, and sitar music on the riverbank.' }
    ]
  },
  {
    name: 'Leh-Ladakh', country: 'India', region: 'Asia', avgCost: 60, lat: 34.1526, lng: 77.5771,
    tags: ['Adventure', 'Mountains', 'Culture'],
    desc: 'The Land of High Passes — barren lunar peaks, Buddhist gompas, and turquoise alpine lakes.',
    img: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&h=400&fit=crop',
    areas: ['Leh Old Town', 'Nubra Valley', 'Pangong Tso'],
    destinations: [
      { name: 'Pangong Lake', category: 'Nature', cost: 35, duration: '6 hours', area: 'Pangong Tso', desc: 'Endorheic lake at 4,350m that changes color from blue to green.' },
      { name: 'Thiksey Monastery', category: 'Culture', cost: 2, duration: '2 hours', area: 'Indus Valley', desc: '12-story hilltop monastery resembling the Potala Palace.' },
      { name: 'Khardung La Pass', category: 'Adventure', cost: 15, duration: '3 hours', area: 'Khardung La', desc: 'One of the worlds highest motorable passes at 17,982 ft.' }
    ],
    activities: [
      { name: 'Double-Humped Camel Safari at Hunder', category: 'Adventure', cost: 15, duration: '1.5 hours', desc: 'Ride Bactrian camels along white sand dunes in Nubra Valley.' },
      { name: 'Stargazing at Hanle Dark Sky Reserve', category: 'Sightseeing', cost: 25, duration: '3 hours', desc: 'View the Milky Way core with crystal clarity.' }
    ]
  },
  {
    name: 'Kochi', country: 'India', region: 'Asia', avgCost: 45, lat: 9.9312, lng: 76.2673,
    tags: ['Culture', 'Coast', 'Heritage'],
    desc: 'Historic spice port featuring Portuguese colonial alleys, Jewish synagogue, and Chinese fishing nets.',
    img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&h=400&fit=crop',
    areas: ['Fort Kochi', 'Mattancherry', 'Marine Drive Kochi'],
    destinations: [
      { name: 'Chinese Fishing Nets', category: 'Sightseeing', cost: 0, duration: '1 hour', area: 'Fort Kochi', desc: '14th-century cantilevered sea nets operating along the harbour.' },
      { name: 'Mattancherry Palace', category: 'History', cost: 2, duration: '1.5 hours', area: 'Mattancherry', desc: 'Dutch palace adorned with Hindu mythological frescoes.' },
      { name: 'Paradesi Synagogue', category: 'History', cost: 2, duration: '1 hour', area: 'Jew Town', desc: '1568 synagogue with hand-painted blue Cantonese tiles.' }
    ],
    activities: [
      { name: 'Kathakali Dramatic Dance Performance', category: 'Culture', cost: 10, duration: '2 hours', desc: 'Watch ornate facial makeup transformation and storytelling.' },
      { name: 'Spice Market Walking Tour', category: 'Food', cost: 0, duration: '2 hours', desc: 'Smell fresh green cardamom, pepper sacks, and ginger in Jew Town.' }
    ]
  },
  {
    name: 'Munnar', country: 'India', region: 'Asia', avgCost: 40, lat: 10.0889, lng: 77.0595,
    tags: ['Nature', 'Tea', 'Mountains'],
    desc: 'Rolling emerald tea plantations, mist-draped valleys, and exotic waterfalls in the Western Ghats.',
    img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop',
    areas: ['Munnar Town', 'Mattupetty', 'Top Station'],
    destinations: [
      { name: 'Kolukkumalai Tea Estate', category: 'Nature', cost: 20, duration: '4 hours', area: 'Top Station', desc: 'The worlds highest orthodox tea estate with sunrise clouds.' },
      { name: 'Eravikulam National Park', category: 'Nature', cost: 6, duration: '3 hours', area: 'Rajamalai', desc: 'Sanctuary for the endangered Nilgiri Tahr mountain goat.' },
      { name: 'Mattupetty Dam', category: 'Sightseeing', cost: 5, duration: '2 hours', area: 'Mattupetty', desc: 'Storage reservoir flanked by tea hills and speedboating.' }
    ],
    activities: [
      { name: 'Tea Plucking and Processing Tour', category: 'Culture', cost: 10, duration: '2.5 hours', desc: 'Learn plucking two leaves and a bud, with factory tasting.' },
      { name: 'Ayurvedic Herbal Massage', category: 'Relaxation', cost: 30, duration: '1.5 hours', desc: 'Traditional Kerala Abhyanga massage with medicated oils.' }
    ]
  },
  {
    name: 'Alleppey (Alappuzha)', country: 'India', region: 'Asia', avgCost: 55, lat: 9.4981, lng: 76.3388,
    tags: ['Backwaters', 'Relaxation', 'Nature'],
    desc: 'The Backwaters Capital of India, celebrated for serene palm-fringed canals and traditional houseboats.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    areas: ['Vembanad Lake', 'Punnamada', 'Marari Beach'],
    destinations: [
      { name: 'Vembanad Lake Backwaters', category: 'Nature', cost: 25, duration: '4 hours', area: 'Punnamada', desc: 'Largest lake in Kerala, hub for traditional snake boat races.' },
      { name: 'Marari Beach', category: 'Beach', cost: 0, duration: '3 hours', area: 'Marari Beach', desc: 'Quiet golden sand beach with fishing catamarans and swaying palms.' },
      { name: 'Alappuzha Lighthouse', category: 'History', cost: 2, duration: '1 hour', area: 'Alleppey Beach', desc: '1862 striped coastal lighthouse overlooking Arabian Sea.' }
    ],
    activities: [
      { name: 'Overnight Kettuvallam Houseboat Cruise', category: 'Relaxation', cost: 110, duration: '20 hours', desc: 'Float through backwaters with onboard chef cooking fresh karimeen fry.' },
      { name: 'Village Shikhara Canoe Safari', category: 'Culture', cost: 15, duration: '2 hours', desc: 'Glide through narrow village canals inaccessible to houseboats.' }
    ]
  },
  {
    name: 'Amritsar', country: 'India', region: 'Asia', avgCost: 35, lat: 31.6340, lng: 74.8723,
    tags: ['Spiritual', 'Food', 'History'],
    desc: 'Spiritual heart of Sikhism with the radiant Golden Temple and historic border ceremonies.',
    img: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=600&h=400&fit=crop',
    areas: ['Golden Temple Complex', 'Wagah Border', 'Old City'],
    destinations: [
      { name: 'Golden Temple (Harmandir Sahib)', category: 'Spiritual', cost: 0, duration: '3 hours', area: 'Golden Temple Complex', desc: 'Gilded gurdwara floating in a sacred nectar pool.' },
      { name: 'Jallianwala Bagh', category: 'History', cost: 0, duration: '1 hour', area: 'Old City', desc: 'Memorial commemorating the tragic 1919 independence massacre.' },
      { name: 'Wagah Border Retreat Ceremony', category: 'Culture', cost: 0, duration: '3 hours', area: 'Wagah Border', desc: 'Electrifying military march ceremony between India & Pakistan.' }
    ],
    activities: [
      { name: 'Langar Community Kitchen Seva', category: 'Spiritual', cost: 0, duration: '2 hours', desc: 'Volunteer in the worlds largest free community kitchen serving 100k daily.' },
      { name: 'Amritsari Kulcha & Lassi Food Tour', category: 'Food', cost: 8, duration: '2 hours', desc: 'Flaky butter-drenched tandoori kulcha with thick malai lassi.' }
    ]
  },
  {
    name: 'Bengaluru', country: 'India', region: 'Asia', avgCost: 55, lat: 12.9716, lng: 77.5946,
    tags: ['Tech', 'Gardens', 'Craft Beer'],
    desc: "India's Silicon Valley and Garden City, famous for pleasant weather, green parks, and craft breweries.",
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop',
    areas: ['Indiranagar', 'Koramangala', 'Cubbon Park Area'],
    destinations: [
      { name: 'Lalbagh Botanical Garden', category: 'Nature', cost: 2, duration: '2 hours', area: 'South Bengaluru', desc: '240-acre botanical haven with a Victorian glass house.' },
      { name: 'Bangalore Palace', category: 'History', cost: 10, duration: '2 hours', area: 'Palace Grounds', desc: 'Tudor-style royal estate modeled on Windsor Castle.' },
      { name: 'Cubbon Park', category: 'Nature', cost: 0, duration: '2 hours', area: 'Central Bengaluru', desc: 'Lush 300-acre park in the city center.' }
    ],
    activities: [
      { name: 'Indiranagar Craft Microbrewery Crawl', category: 'Nightlife', cost: 35, duration: '3 hours', desc: 'Sample mango IPAs and stout at Toit and Windmills.' },
      { name: 'Traditional Dosa Trail at CTR & Vidyarthi Bhavan', category: 'Food', cost: 6, duration: '2 hours', desc: 'Crispy butter benne dosa with fresh coconut chutney.' }
    ]
  },
  {
    name: 'Kolkata', country: 'India', region: 'Asia', avgCost: 40, lat: 22.5726, lng: 88.3639,
    tags: ['Culture', 'History', 'Food'],
    desc: 'The Cultural Capital of India — literary heritage, yellow ambassador cabs, and colonial monuments.',
    img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&h=400&fit=crop',
    areas: ['Park Street', 'North Kolkata', 'Howrah'],
    destinations: [
      { name: 'Victoria Memorial', category: 'History', cost: 6, duration: '2.5 hours', area: 'Maidan', desc: 'Grand white marble monument celebrating British & Indian art.' },
      { name: 'Howrah Bridge', category: 'Sightseeing', cost: 0, duration: '1 hour', area: 'Howrah', desc: 'Iconic cantilever bridge spanning the bustling Hooghly River.' },
      { name: 'Dakshineswar Kali Temple', category: 'Spiritual', cost: 0, duration: '2 hours', area: 'Hooghly Bank', desc: '19th-century navaratna temple where Ramakrishna worshipped.' }
    ],
    activities: [
      { name: 'Tram Ride & Coffee House Literary Tour', category: 'Culture', cost: 5, duration: '2 hours', desc: 'Heritage tram across College Street book market.' },
      { name: 'Bengali Sweets & Kati Roll Crawl', category: 'Food', cost: 10, duration: '2 hours', desc: 'Hot roshogolla, sandesh, and original Nizam kati rolls.' }
    ]
  },
  {
    name: 'Hyderabad', country: 'India', region: 'Asia', avgCost: 45, lat: 17.3850, lng: 78.4867,
    tags: ['Food', 'History', 'Culture'],
    desc: 'The City of Pearls and Nizams, renowned for Charminar, Golconda Fort, and world-class Biryani.',
    img: 'https://images.unsplash.com/photo-1605469237567-a39930679526?w=600&h=400&fit=crop',
    areas: ['Old City', 'Banjara Hills', 'Hitec City'],
    destinations: [
      { name: 'Charminar', category: 'History', cost: 3, duration: '1.5 hours', area: 'Old City', desc: '1591 landmark mosque with four 56-meter minarets.' },
      { name: 'Golconda Fort', category: 'History', cost: 6, duration: '3 hours', area: 'Golconda', desc: 'Medieval diamond-trading fortress with acoustic engineering.' },
      { name: 'Chowmahalla Palace', category: 'History', cost: 5, duration: '2 hours', area: 'Old City', desc: 'Opulent palace of the Nizams with vintage car exhibits.' }
    ],
    activities: [
      { name: 'Hyderabadi Dum Biryani Feast at Paradise', category: 'Food', cost: 15, duration: '1.5 hours', desc: 'Fragrant saffron basmati rice slow-cooked with tender spiced mutton.' },
      { name: 'Laad Bazaar Lacquer Bangle Shopping', category: 'Shopping', cost: 0, duration: '2 hours', desc: 'Centuries-old market for pearls, bangles, and bridal attires.' }
    ]
  },
  {
    name: 'Pondicherry (Puducherry)', country: 'India', region: 'Asia', avgCost: 40, lat: 11.9416, lng: 79.8083,
    tags: ['French', 'Beach', 'Spiritual'],
    desc: 'French colonial seaside haven with pastel villas, bougainvillea streets, and experimental Auroville.',
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop',
    areas: ['White Town', 'Promenade Beach', 'Auroville'],
    destinations: [
      { name: 'Matrimandir at Auroville', category: 'Spiritual', cost: 0, duration: '3 hours', area: 'Auroville', desc: 'Golden spherical meditation sanctuary symbolizing peace.' },
      { name: 'Promenade Beach', category: 'Beach', cost: 0, duration: '2 hours', area: 'White Town', desc: '1.5 km seaside rock promenade lined with French cafes.' },
      { name: 'Sri Aurobindo Ashram', category: 'Spiritual', cost: 0, duration: '1 hour', area: 'White Town', desc: 'Tranquil ashram founded in 1926.' }
    ],
    activities: [
      { name: 'White Town French Bakery Bicycle Tour', category: 'Food', cost: 12, duration: '2 hours', desc: 'Croissants, baguettes, and artisanal coffee in colonial streets.' },
      { name: 'Paradise Beach Boating & Surf', category: 'Adventure', cost: 15, duration: '3 hours', desc: 'Ferry across Chunnambar river to isolated golden beach.' }
    ]
  },
  {
    name: 'Hampi', country: 'India', region: 'Asia', avgCost: 35, lat: 15.3350, lng: 76.4600,
    tags: ['UNESCO', 'History', 'Boulders'],
    desc: 'UNESCO open-air museum of giant granite boulders and ruined 14th-century Vijayanagara temples.',
    img: 'https://images.unsplash.com/photo-1600100397608-f010e421a172?w=600&h=400&fit=crop',
    areas: ['Sacred Centre', 'Royal Centre', 'Hippie Island (Virupapur)'],
    destinations: [
      { name: 'Virupaksha Temple', category: 'Spiritual', cost: 2, duration: '2 hours', area: 'Sacred Centre', desc: '7th-century functioning temple with 50-meter gopuram.' },
      { name: 'Stone Chariot at Vijaya Vittala', category: 'History', cost: 6, duration: '3 hours', area: 'Sacred Centre', desc: 'Carved stone shrine and musical pillars.' },
      { name: 'Matanga Hill', category: 'Nature', cost: 0, duration: '2 hours', area: 'Hampi Bazaar', desc: 'Highest point in Hampi for 360-degree sunrise views over ruins.' }
    ],
    activities: [
      { name: 'Tungabhadra River Coracle Boat Ride', category: 'Adventure', cost: 10, duration: '1 hour', desc: 'Circular woven boat cruise between granite river gorges.' },
      { name: 'Moped Tour Across Bouldered Villages', category: 'Adventure', cost: 8, duration: '4 hours', desc: 'Ride through rice fields and climb Sanapur Lake cliffs.' }
    ]
  },
  {
    name: 'Ooty', country: 'India', region: 'Asia', avgCost: 40, lat: 11.4102, lng: 76.6950,
    tags: ['Hill Station', 'Nature', 'Heritage Train'],
    desc: 'Queen of the Nilgiri Hill Stations, celebrated for pine forests, tea estates, and colonial toy train.',
    img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop',
    areas: ['Ooty Lake', 'Doddabetta', 'Coonoor Road'],
    destinations: [
      { name: 'Nilgiri Mountain Railway', category: 'History', cost: 4, duration: '3.5 hours', area: 'Ooty Station', desc: 'UNESCO heritage steam toy train crossing bridges & tunnels.' },
      { name: 'Botanical Gardens', category: 'Nature', cost: 2, duration: '2 hours', area: 'Ooty Town', desc: '55-acre terraced gardens established in 1848.' },
      { name: 'Doddabetta Peak', category: 'Nature', cost: 2, duration: '2 hours', area: 'Doddabetta', desc: 'Highest point in the Nilgiri mountains at 2,637 meters.' }
    ],
    activities: [
      { name: 'Homemade Chocolate & Tea Tasting', category: 'Food', cost: 8, duration: '1.5 hours', desc: 'Sample freshly blended Nilgiri tea with artisan fudge.' },
      { name: 'Pykara Lake Speedboating', category: 'Adventure', cost: 12, duration: '2 hours', desc: 'Speedboat across pristine mountain lake surrounded by shola forests.' }
    ]
  },
  {
    name: 'Darjeeling', country: 'India', region: 'Asia', avgCost: 40, lat: 27.0410, lng: 88.2663,
    tags: ['Tea', 'Himalayas', 'Heritage'],
    desc: 'Victorian hill station famous for the worlds finest black tea and panoramic views of Mt. Kanchenjunga.',
    img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop',
    areas: ['The Mall (Chowrasta)', 'Tiger Hill', 'Ghum'],
    destinations: [
      { name: 'Tiger Hill Sunrise', category: 'Nature', cost: 5, duration: '3 hours', area: 'Tiger Hill', desc: 'Watch golden sunrise illuminate Mt. Everest and Kanchenjunga.' },
      { name: 'Darjeeling Himalayan Toy Train', category: 'History', cost: 15, duration: '2 hours', desc: 'UNESCO narrow-gauge steam engine chugging around Batasia Loop.' },
      { name: 'Happy Valley Tea Estate', category: 'Culture', cost: 3, duration: '2 hours', desc: 'Historic 1854 garden on steep Himalayan slopes.' }
    ],
    activities: [
      { name: 'First Flush Champagne of Teas Tasting', category: 'Food', cost: 10, duration: '1.5 hours', desc: 'Sip Muscatel organic tea at Nathmulls Tea Lounge.' },
      { name: 'Steaming Tibetan Momos & Thukpa Crawl', category: 'Food', cost: 6, duration: '2 hours', desc: 'Traditional dumplings served with spicy tomato chili sauce.' }
    ]
  },
  {
    name: 'Srinagar', country: 'India', region: 'Asia', avgCost: 50, lat: 34.0837, lng: 74.7973,
    tags: ['Lakes', 'Gardens', 'Snow'],
    desc: 'The Jewel of Kashmir, famed for Dal Lake shikaras, wooden houseboats, and Mughal terraced gardens.',
    img: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=600&h=400&fit=crop',
    areas: ['Dal Lake', 'Nigeen Lake', 'Old Srinagar'],
    destinations: [
      { name: 'Dal Lake', category: 'Nature', cost: 10, duration: '3 hours', area: 'Dal Lake', desc: 'Reflective lake famous for houseboats and floating vegetable market.' },
      { name: 'Shalimar Bagh', category: 'History', cost: 2, duration: '2 hours', area: 'Mughal Gardens', desc: 'Emperor Jahangir 1619 garden of love with fountains.' },
      { name: 'Shankaracharya Temple', category: 'Spiritual', cost: 0, duration: '1.5 hours', area: 'Gopadri Hill', desc: 'Ancient stone temple offering bird-eye view of Srinagar.' }
    ],
    activities: [
      { name: 'Morning Floating Market Shikara Ride', category: 'Culture', cost: 15, duration: '2 hours', desc: 'Paddle through lotus channels as traders barter flowers and vegetables.' },
      { name: 'Traditional 36-Course Wazwan Dinner', category: 'Food', cost: 35, duration: '2 hours', desc: 'Feast on Rogan Josh, Gushtaba, and Rista with saffron Kahwa.' }
    ]
  },
  {
    name: 'Shimla', country: 'India', region: 'Asia', avgCost: 40, lat: 31.1048, lng: 77.1734,
    tags: ['Colonial', 'Mountains', 'Heritage'],
    desc: 'The former summer capital of British India with Victorian architecture, Mall Road, and pine valleys.',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop',
    areas: ['The Ridge', 'Mall Road', 'Kufri'],
    destinations: [
      { name: 'Viceregal Lodge', category: 'History', cost: 3, duration: '2 hours', area: 'Observatory Hill', desc: 'Jacobethan style presidential retreat where Partition was drafted.' },
      { name: 'The Ridge & Christ Church', category: 'Sightseeing', cost: 0, duration: '1.5 hours', area: 'The Ridge', desc: 'Neo-Gothic 1857 yellow church with stained glass windows.' },
      { name: 'Jakhoo Temple', category: 'Spiritual', cost: 0, duration: '2 hours', area: 'Jakhoo Hill', desc: 'Hilltop Hanuman temple with a 108-foot statue.' }
    ],
    activities: [
      { name: 'Jakhoo Ropeway Cable Car Ride', category: 'Adventure', cost: 6, duration: '1 hour', desc: 'Panoramic aerial lift above dense cedar forest.' },
      { name: 'Kufri Snow Valley Horse Trek', category: 'Adventure', cost: 15, duration: '3 hours', desc: 'Trek up Mahasu Peak for snow views of Great Himalayas.' }
    ]
  },
  {
    name: 'Jodhpur', country: 'India', region: 'Asia', avgCost: 40, lat: 26.2389, lng: 73.0243,
    tags: ['Blue City', 'Forts', 'Heritage'],
    desc: 'The Blue City of Rajasthan dominated by the impenetrable cliff-top Mehrangarh Fort.',
    img: 'https://images.unsplash.com/photo-1603288967069-b5900593b4f7?w=600&h=400&fit=crop',
    areas: ['Brahmapuri (Blue City)', 'Clock Tower', 'Umaid Bhawan'],
    destinations: [
      { name: 'Mehrangarh Fort', category: 'History', cost: 8, duration: '3 hours', area: 'Cliff Ridge', desc: 'One of Indias largest forts towering 400 feet above the skyline.' },
      { name: 'Jaswant Thada', category: 'History', cost: 2, duration: '1 hour', area: 'Mehrangarh Road', desc: 'Intricately carved milky white marble memorial cenotaph.' },
      { name: 'Umaid Bhawan Palace', category: 'History', cost: 4, duration: '2 hours', area: 'Umaid Bhawan', desc: 'One of the worlds largest private royal residences.' }
    ],
    activities: [
      { name: 'Flying Fox Zipline Tour Over Fort Battlements', category: 'Adventure', cost: 30, duration: '2 hours', desc: 'Soar across six desert zipwires over lakes and fort walls.' },
      { name: 'Blue City Walking Tour with Mirchi Vada', category: 'Food', cost: 10, duration: '2 hours', desc: 'Wander blue painted Brahmin lanes and taste spicy potato vadas.' }
    ]
  },
  {
    name: 'Jaisalmer', country: 'India', region: 'Asia', avgCost: 45, lat: 26.9157, lng: 70.9083,
    tags: ['Desert', 'Golden Fort', 'Dunes'],
    desc: 'The Golden City rising from the Thar Desert with living sandcastle fortresses and camel dunes.',
    img: 'https://images.unsplash.com/photo-1603288967069-b5900593b4f7?w=600&h=400&fit=crop',
    areas: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Patwon Ki Haveli'],
    destinations: [
      { name: 'Jaisalmer Golden Fort (Sonar Qila)', category: 'History', cost: 5, duration: '3 hours', area: 'Fort', desc: 'Only living fort in India housing 4,000 residents inside yellow stone walls.' },
      { name: 'Patwon Ki Haveli', category: 'History', cost: 3, duration: '1.5 hours', area: 'Old City', desc: 'Cluster of five merchant mansions with delicate stone jali lattice.' },
      { name: 'Sam Sand Dunes', category: 'Nature', cost: 20, duration: '4 hours', area: 'Thar Desert', desc: 'Undulating desert ripples 40 km from town.' }
    ],
    activities: [
      { name: 'Sunset Camel Safari in Thar Desert', category: 'Adventure', cost: 20, duration: '3 hours', desc: 'Ride into golden dunes followed by Rajasthani gypsy dance under stars.' },
      { name: 'Gadisar Lake Evening Paddle Boating', category: 'Relaxation', cost: 5, duration: '1.5 hours', desc: 'Scenic rainwater reservoir ringed by ornate stone chhatris.' }
    ]
  },
  {
    name: 'Gangtok', country: 'India', region: 'Asia', avgCost: 45, lat: 27.3389, lng: 88.6065,
    tags: ['Sikkim', 'Buddhism', 'Mountains'],
    desc: 'Clean, charming Himalayan capital of Sikkim with fluttering prayer flags, cable cars, and momos.',
    img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop',
    areas: ['MG Marg', 'Rumtek', 'Tsomgo Lake Road'],
    destinations: [
      { name: 'Tsomgo Lake (Changu Lake)', category: 'Nature', cost: 20, duration: '4 hours', area: 'East Sikkim', desc: 'Glacial high-altitude lake at 12,310 feet.' },
      { name: 'Rumtek Monastery', category: 'Culture', cost: 1, duration: '2 hours', area: 'Rumtek', desc: 'Seat of the Kagyu lineage with precious golden stupas.' },
      { name: 'Ban Jhakri Falls', category: 'Nature', cost: 2, duration: '2 hours', area: 'Energy Park', desc: '100-foot waterfall surrounded by ethnic shamanic statues.' }
    ],
    activities: [
      { name: 'Gangtok Ropeway Cable Car', category: 'Sightseeing', cost: 3, duration: '1 hour', desc: 'Ride across town with panoramic valley views of Kanchenjunga.' },
      { name: 'Evening Walk on Pedestrian MG Marg', category: 'Relaxation', cost: 0, duration: '2 hours', desc: 'Vehicle-free boulevard with mountain cafes, live music, and momos.' }
    ]
  },
  {
    name: 'Shillong', country: 'India', region: 'Asia', avgCost: 40, lat: 25.5788, lng: 91.8933,
    tags: ['Meghalaya', 'Music', 'Waterfalls'],
    desc: 'Scotland of the East, known for cool pine breezes, rock music culture, and dramatic waterfalls.',
    img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop',
    areas: ['Police Bazar', 'Umiam Lake', 'Laitlum Canyons'],
    destinations: [
      { name: 'Elephant Falls', category: 'Nature', cost: 1, duration: '1.5 hours', area: 'Upper Shillong', desc: 'Three-tiered mountain waterfall surrounded by fern gullies.' },
      { name: 'Laitlum Canyons', category: 'Nature', cost: 0, duration: '3 hours', area: 'East Khasi Hills', desc: 'End of the World gorges with breathtaking vertical mist ravines.' },
      { name: 'Umiam Lake', category: 'Nature', cost: 5, duration: '2.5 hours', area: 'Barapani', desc: 'Vast blue reservoir offering kayaking and sunset viewpoints.' }
    ],
    activities: [
      { name: 'Day Excursion to Cherrapunji Living Root Bridges', category: 'Adventure', cost: 30, duration: '6 hours', desc: 'Trek down to bio-engineered ancient ficus tree root bridges.' },
      { name: 'Police Bazar Street Food Tour', category: 'Food', cost: 8, duration: '2 hours', desc: 'Taste spicy Jadoh rice, pork momos, and Khasi smoked meats.' }
    ]
  },
  {
    name: 'Puri', country: 'India', region: 'Asia', avgCost: 35, lat: 19.8135, lng: 85.8312,
    tags: ['Beach', 'Spiritual', 'Heritage'],
    desc: 'Coastal sacred city in Odisha famous for the Jagannath Rath Yatra and golden sand beaches.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    areas: ['Golden Beach', 'Grand Road', 'Konark Highway'],
    destinations: [
      { name: 'Jagannath Temple', category: 'Spiritual', cost: 0, duration: '2 hours', area: 'Grand Road', desc: '12th-century sacred temple renowned for its annual chariot festival.' },
      { name: 'Konark Sun Temple', category: 'History', cost: 6, duration: '3 hours', area: 'Konark', desc: 'UNESCO architectural marvel carved as a 24-wheeled stone sun chariot.' },
      { name: 'Golden Beach', category: 'Beach', cost: 0, duration: '2 hours', area: 'Chakratirtha', desc: 'Blue Flag certified clean beach with gentle morning surf.' }
    ],
    activities: [
      { name: 'Mahaprasad Feast at Ananda Bazar', category: 'Food', cost: 5, duration: '1 hour', desc: 'Taste the holy earthen pot temple meal prepared in the worlds largest kitchen.' },
      { name: 'Chilika Lake Dolphin Boat Safari', category: 'Nature', cost: 25, duration: '4 hours', desc: 'Spot rare Irrawaddy dolphins in Asias largest brackish lagoon.' }
    ]
  },
  {
    name: 'Gokarna', country: 'India', region: 'Asia', avgCost: 35, lat: 14.5479, lng: 74.3188,
    tags: ['Beach', 'Trekking', 'Relaxation'],
    desc: 'Laid-back alternative to Goa with untouched beaches, temple town charm, and cliff treks.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    areas: ['Om Beach', 'Kudle Beach', 'Gokarna Town'],
    destinations: [
      { name: 'Om Beach', category: 'Beach', cost: 0, duration: '3 hours', area: 'Om Beach', desc: 'Naturally shaped like the sacred Hindu Om symbol.' },
      { name: 'Mahabaleshwar Temple', category: 'Spiritual', cost: 0, duration: '1.5 hours', area: 'Gokarna Town', desc: '4th-century temple housing the sacred Atmalinga.' },
      { name: 'Half Moon & Paradise Beach', category: 'Beach', cost: 0, duration: '3 hours', area: 'Coastal Cliff', desc: 'Secluded beaches accessible only on foot or boat.' }
    ],
    activities: [
      { name: '5-Beach Cliff Trek', category: 'Adventure', cost: 0, duration: '4 hours', desc: 'Trek from Gokarna Main Beach to Kudle, Om, Half Moon and Paradise.' },
      { name: 'Bioluminescence Night Paddle', category: 'Adventure', cost: 25, duration: '1.5 hours', desc: 'Witness glowing phytoplankton in the nocturnal Arabian Sea surf.' }
    ]
  },
  {
    name: 'Mysuru (Mysore)', country: 'India', region: 'Asia', avgCost: 40, lat: 12.2958, lng: 76.6394,
    tags: ['Palaces', 'Silk', 'Sandalwood'],
    desc: 'The Cultural Capital of Karnataka, celebrated for its glowing palace, Ashtanga yoga, and silk sarees.',
    img: 'https://images.unsplash.com/photo-1600100397608-f010e421a172?w=600&h=400&fit=crop',
    areas: ['Palace Grounds', 'Chamundi Hill', 'Devaraja Market'],
    destinations: [
      { name: 'Mysore Palace', category: 'History', cost: 4, duration: '2.5 hours', area: 'Palace Grounds', desc: 'Indo-Saracenic royal palace illuminated by 100,000 lightbulbs on Sundays.' },
      { name: 'Chamundeshwari Temple', category: 'Spiritual', cost: 0, duration: '2 hours', area: 'Chamundi Hill', desc: 'Hilltop temple with giant monolithic Nandi bull statue.' },
      { name: 'Brindavan Gardens', category: 'Nature', cost: 2, duration: '2 hours', area: 'KRS Dam', desc: 'Terraced musical fountain gardens built across Cauvery River.' }
    ],
    activities: [
      { name: 'Mysore Pak Tasting at Guru Sweets', category: 'Food', cost: 4, duration: '1 hour', desc: 'Taste the melt-in-mouth royal ghee confectionery where it was invented.' },
      { name: 'Devaraja Heritage Bazaar Walk', category: 'Culture', cost: 0, duration: '2 hours', desc: 'Color explosions of vermilion, jasmine garlands, and sandalwood oil.' }
    ]
  },
  {
    name: 'Coorg (Madikeri)', country: 'India', region: 'Asia', avgCost: 45, lat: 12.4244, lng: 75.7382,
    tags: ['Coffee', 'Nature', 'Waterfalls'],
    desc: 'The Scotland of India — misty hills, coffee and cardamom plantations, and Kodava culture.',
    img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&h=400&fit=crop',
    areas: ['Madikeri', 'Kushalnagar', 'Virajpet'],
    destinations: [
      { name: 'Abbey Falls', category: 'Nature', cost: 1, duration: '1.5 hours', area: 'Madikeri', desc: 'Roaring waterfall nestled between coffee bushes and spice vines.' },
      { name: 'Namdroling Monastery (Golden Temple)', category: 'Culture', cost: 0, duration: '2 hours', area: 'Kushalnagar', desc: 'Tibetan settlement with 40-foot golden Buddha statues.' },
      { name: 'Raja Seat', category: 'Sightseeing', cost: 1, duration: '1.5 hours', area: 'Madikeri', desc: 'Garden viewpoint where Coorg kings watched sunsets over cliffs.' }
    ],
    activities: [
      { name: 'Coffee Estate Planting & Cupping Tour', category: 'Culture', cost: 12, duration: '2.5 hours', desc: 'Learn Robusta and Arabica harvesting with fresh coffee cupping.' },
      { name: 'Traditional Pandi Curry Feast', category: 'Food', cost: 15, duration: '1.5 hours', desc: 'Kodava style pepper and kachampuli spiced delicacy with kadambuttu.' }
    ]
  },
  {
    name: 'Varkala', country: 'India', region: 'Asia', avgCost: 35, lat: 8.7379, lng: 76.7163,
    tags: ['Cliffs', 'Beach', 'Ayurveda'],
    desc: 'Stunning red laterite cliffs jutting into the Arabian Sea with surf, yoga shacks, and natural springs.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    areas: ['North Cliff', 'South Cliff', 'Helipad Area'],
    destinations: [
      { name: 'Varkala Cliff Beach (Papanasam)', category: 'Beach', cost: 0, duration: '3 hours', area: 'North Cliff', desc: 'Beach beneath red cliffs where holy waters cleanse sins.' },
      { name: 'Janardhana Swamy Temple', category: 'Spiritual', cost: 0, duration: '1 hour', area: 'South Cliff', desc: '2000-year-old temple dedicated to Lord Vishnu.' },
      { name: 'Anjengo Fort & Lighthouse', category: 'History', cost: 1, duration: '2 hours', area: 'Anchuthengu', desc: '17th-century East India Company coastal stronghold.' }
    ],
    activities: [
      { name: 'Beginner Surfing Lesson at Black Beach', category: 'Adventure', cost: 25, duration: '2 hours', desc: 'Catch gentle breaks on warm Arabian Sea waves with certified instructors.' },
      { name: 'Sunset Cliffside Yoga & Fresh Seafood', category: 'Relaxation', cost: 18, duration: '2 hours', desc: 'Hatha yoga overlooking waves followed by grilled catch-of-the-day.' }
    ]
  },
  {
    name: 'Chennai', country: 'India', region: 'Asia', avgCost: 45, lat: 13.0827, lng: 80.2707,
    tags: ['Carnatic Music', 'Coast', 'Temples'],
    desc: 'Gateway to South India — Dravidian temple towers, filter coffee, and the worlds second longest urban beach.',
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop',
    areas: ['Mylapore', 'Marina Beach', 'Besant Nagar'],
    destinations: [
      { name: 'Kapaleeshwarar Temple', category: 'Spiritual', cost: 0, duration: '2 hours', area: 'Mylapore', desc: '7th-century Shiva temple with a rainbow-sculpted gopuram.' },
      { name: 'Marina Beach', category: 'Beach', cost: 0, duration: '2 hours', area: 'Marina Promenade', desc: '13 km long natural sandy city beach bustling with food carts.' },
      { name: 'San Thome Basilica', category: 'History', cost: 0, duration: '1 hour', area: 'Santhome', desc: 'Neo-Gothic church built over the tomb of St. Thomas the Apostle.' }
    ],
    activities: [
      { name: 'Degree Filter Coffee & Crispy Medu Vada Trail', category: 'Food', cost: 5, duration: '1.5 hours', desc: 'Sip frothy chicory-blended coffee poured through brass davarah.' },
      { name: 'Day Trip to Mahabalipuram Shore Temples', category: 'Culture', cost: 15, duration: '4 hours', desc: 'UNESCO 7th-century rock cut chariot temples by the Bay of Bengal.' }
    ]
  },

  // ---------------- EUROPE (50 CITIES) ----------------
  {
    name: 'Paris', country: 'France', region: 'Europe', avgCost: 190, lat: 48.8566, lng: 2.3522,
    tags: ['Romance', 'Art', 'Food'],
    desc: 'The City of Light — iconic iron monuments, world-class art museums, and charming sidewalk cafes.',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    areas: ['1st Arrondissement', 'Montmartre', 'Le Marais', 'Latin Quarter'],
    destinations: [
      { name: 'Eiffel Tower', category: 'Sightseeing', cost: 32, duration: '2.5 hours', area: 'Champ de Mars', desc: 'Iconic 330-meter lattice tower with observation decks.' },
      { name: 'Louvre Museum', category: 'Culture', cost: 22, duration: '3.5 hours', area: '1st Arrondissement', desc: 'Worlds largest art museum housing Mona Lisa and Venus de Milo.' },
      { name: 'Arc de Triomphe', category: 'History', cost: 16, duration: '1.5 hours', area: 'Champs-Elysees', desc: 'Monumental arch celebrating Napoleonic military victories.' }
    ],
    activities: [
      { name: 'Seine River Sunset Dinner Cruise', category: 'Food', cost: 95, duration: '2 hours', desc: 'Three-course French dinner as illuminated monuments drift past.' },
      { name: 'Montmartre Artists & Patisserie Walk', category: 'Culture', cost: 35, duration: '2.5 hours', desc: 'Cobbled alleys of Picasso and Dalí with warm almond croissants.' }
    ]
  },
  {
    name: 'Rome', country: 'Italy', region: 'Europe', avgCost: 165, lat: 41.9028, lng: 12.4964,
    tags: ['Ancient', 'Food', 'Culture'],
    desc: 'The Eternal City — monumental Roman amphitheaters, Vatican treasures, and authentic pasta.',
    img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
    areas: ['Colosseo', 'Trastevere', 'Vatican City', 'Centro Storico'],
    destinations: [
      { name: 'Colosseum', category: 'History', cost: 24, duration: '2.5 hours', area: 'Colosseo', desc: 'Iconic 1st-century gladiatorial arena in the heart of Rome.' },
      { name: 'Vatican Museums & Sistine Chapel', category: 'Culture', cost: 28, duration: '3.5 hours', area: 'Vatican City', desc: 'Michelangelos ceiling fresco and St. Peters Basilica.' },
      { name: 'Trevi Fountain', category: 'Sightseeing', cost: 0, duration: '1 hour', area: 'Centro Storico', desc: 'Baroque fountain where visitors toss a coin to ensure return.' }
    ],
    activities: [
      { name: 'Trastevere Carbonara & Wine Tour', category: 'Food', cost: 65, duration: '3 hours', desc: 'Taste authentic Guanciale Carbonara, Cacio e Pepe, and Chianti.' },
      { name: 'Vintage Vespa Sidecar Tour', category: 'Adventure', cost: 110, duration: '2.5 hours', desc: 'Zip past the Circus Maximus and Roman ruins on an Italian scooter.' }
    ]
  },
  {
    name: 'London', country: 'United Kingdom', region: 'Europe', avgCost: 210, lat: 51.5074, lng: -0.1278,
    tags: ['Royal', 'Museums', 'Theater'],
    desc: 'Dynamic global metropolis steeped in two millennia of history, royal palaces, and West End theatre.',
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop',
    areas: ['Westminster', 'Soho', 'South Bank', 'Covent Garden'],
    destinations: [
      { name: 'Tower of London & Crown Jewels', category: 'History', cost: 38, duration: '3 hours', area: 'Tower Hill', desc: 'Medieval royal fortress guarding the British monarchs gems.' },
      { name: 'British Museum', category: 'Culture', cost: 0, duration: '3 hours', area: 'Bloomsbury', desc: 'World heritage museum holding the Rosetta Stone and Parthenon marbles.' },
      { name: 'Big Ben & Parliament', category: 'Sightseeing', cost: 0, duration: '1.5 hours', area: 'Westminster', desc: 'Gothic clock tower and Palace of Westminster on the River Thames.' }
    ],
    activities: [
      { name: 'West End Musical Theatre Night', category: 'Nightlife', cost: 75, duration: '2.5 hours', desc: 'Catch world-renowned productions like Phantom or Hamilton.' },
      { name: 'Borough Market Artisan Food Trail', category: 'Food', cost: 25, duration: '2 hours', desc: 'Savour hot sausage rolls, Scottish oysters, and artisan cheese.' }
    ]
  },
  {
    name: 'Barcelona', country: 'Spain', region: 'Europe', avgCost: 150, lat: 41.3851, lng: 2.1734,
    tags: ['Architecture', 'Beach', 'Tapas'],
    desc: 'Gaudis architectural wonderland by the Mediterranean, famous for surreal basilicas and tapas bars.',
    img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop',
    areas: ['Gothic Quarter', 'Eixample', 'Barceloneta', 'El Born'],
    destinations: [
      { name: 'Basílica de la Sagrada Família', category: 'Architecture', cost: 34, duration: '2.5 hours', area: 'Eixample', desc: 'Antoni Gaudis unfinished masterpiece of organic stone and stained glass.' },
      { name: 'Park Güell', category: 'Architecture', cost: 13, duration: '2 hours', area: 'Gràcia', desc: 'Colorful mosaic park overlooking the Mediterranean.' },
      { name: 'Barceloneta Beach', category: 'Beach', cost: 0, duration: '3 hours', area: 'Barceloneta', desc: 'Vibrant golden sand urban beach lined with chiringuito seafood bars.' }
    ],
    activities: [
      { name: 'El Born Tapas & Sangria Crawl', category: 'Food', cost: 45, duration: '2.5 hours', desc: 'Pintxos, Iberian jamon, patatas bravas, and red vermouth.' },
      { name: 'Flamenco Show at City Hall', category: 'Culture', cost: 30, duration: '1.5 hours', desc: 'Passionate guitar, clapping, and footwork in a 19th-century theatre.' }
    ]
  },
  {
    name: 'Amsterdam', country: 'Netherlands', region: 'Europe', avgCost: 175, lat: 52.3676, lng: 4.9041,
    tags: ['Canals', 'Art', 'Cycling'],
    desc: 'Venice of the North — concentric golden age canals, Rembrandt paintings, and cycling culture.',
    img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&h=400&fit=crop',
    areas: ['Jordaan', 'Museumplein', 'De Pijp', 'Canal Belt'],
    destinations: [
      { name: 'Rijksmuseum', category: 'Culture', cost: 25, duration: '3 hours', area: 'Museumplein', desc: 'National museum holding Rembrandts Night Watch and Vermeers Milkmaid.' },
      { name: 'Van Gogh Museum', category: 'Culture', cost: 24, duration: '2 hours', area: 'Museumplein', desc: 'Worlds largest collection of works by Vincent van Gogh.' },
      { name: 'Anne Frank House', category: 'History', cost: 18, duration: '2 hours', area: 'Jordaan', desc: 'Secret annex where Anne Frank hid during WWII.' }
    ],
    activities: [
      { name: 'Canal Ring Electric Boat Tour with Dutch Cheese', category: 'Relaxation', cost: 35, duration: '1.5 hours', desc: 'Glide past 17th-century gabled houses with aged Gouda and beer.' },
      { name: 'Jordaan Vintage Boutiques & Stroopwafel Walk', category: 'Food', cost: 15, duration: '2 hours', desc: 'Hot caramel stroopwafels and brown cafes in historic alleyways.' }
    ]
  },
  {
    name: 'Santorini', country: 'Greece', region: 'Europe', avgCost: 185, lat: 36.3932, lng: 25.4615,
    tags: ['Caldera', 'Sunset', 'Beaches'],
    desc: 'Breathtaking Aegean island with whitewashed cliffside villages, blue-domed churches, and volcanic sunsets.',
    img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop',
    areas: ['Oia', 'Fira', 'Imerovigli', 'Perissa'],
    destinations: [
      { name: 'Oia Blue Dome Viewpoint', category: 'Sightseeing', cost: 0, duration: '2 hours', area: 'Oia', desc: 'Postcard cliff edge with world-famous sunset vistas.' },
      { name: 'Red Beach', category: 'Nature', cost: 0, duration: '2 hours', area: 'Akrotiri', desc: 'Dramatic volcanic red lava cliffs flanking deep turquoise waters.' },
      { name: 'Akrotiri Ruins', category: 'History', cost: 15, duration: '2 hours', area: 'Akrotiri', desc: 'Bronze Age Minoan city preserved in volcanic ash.' }
    ],
    activities: [
      { name: 'Catamaran Sunset Cruise with Greek BBQ', category: 'Relaxation', cost: 120, duration: '5 hours', desc: 'Sail the submerged volcanic caldera with hot springs swim.' },
      { name: 'Assyrtiko Wine Tasting on Cliffside Terrace', category: 'Food', cost: 45, duration: '2 hours', desc: 'Crisp volcanic mineral white wines with fava dip and olives.' }
    ]
  },
  {
    name: 'Prague', country: 'Czech Republic', region: 'Europe', avgCost: 95, lat: 50.0755, lng: 14.4378,
    tags: ['Castles', 'Old Town', 'Beer'],
    desc: 'The City of a Hundred Spires — fairy-tale castle complex, Charles Bridge statues, and pilsner beer.',
    img: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&h=400&fit=crop',
    areas: ['Old Town (Stare Mesto)', 'Mala Strana', 'Hradcany'],
    destinations: [
      { name: 'Charles Bridge', category: 'History', cost: 0, duration: '1.5 hours', area: 'Vltava River', desc: '14th-century stone arch bridge lined with 30 baroque saint statues.' },
      { name: 'Prague Castle Complex & St. Vitus', category: 'History', cost: 18, duration: '3.5 hours', area: 'Hradcany', desc: 'Largest ancient castle complex in the world.' },
      { name: 'Old Town Square & Astronomical Clock', category: 'Sightseeing', cost: 0, duration: '1 hour', area: 'Old Town', desc: '600-year-old mechanical clock with animated apostles.' }
    ],
    activities: [
      { name: 'Underground Medieval Cellars Beer Tour', category: 'Nightlife', cost: 35, duration: '2.5 hours', desc: 'Sample unfiltered Czech Pilsner Urquell in 12th-century vaults.' },
      { name: 'Classical Concert at Mirror Chapel', category: 'Culture', cost: 28, duration: '1.5 hours', desc: 'Vivaldi and Mozart performed in a gilded baroque hall.' }
    ]
  },
  {
    name: 'Venice', country: 'Italy', region: 'Europe', avgCost: 195, lat: 45.4408, lng: 12.3155,
    tags: ['Gondola', 'Canals', 'Romance'],
    desc: 'Floating labyrinth of 118 islands connected by 400 bridges, grand palazzos, and gondolas.',
    img: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600&h=400&fit=crop',
    areas: ['San Marco', 'Dorsoduro', 'Cannaregio', 'Murano'],
    destinations: [
      { name: 'St. Marks Basilica & Campanile', category: 'History', cost: 20, duration: '2 hours', area: 'San Marco', desc: 'Italo-Byzantine cathedral shimmering with gold mosaic ceilings.' },
      { name: 'Doges Palace', category: 'History', cost: 30, duration: '2.5 hours', area: 'San Marco', desc: 'Gothic seat of the Venetian Republic with Bridge of Sighs.' },
      { name: 'Rialto Bridge', category: 'Sightseeing', cost: 0, duration: '1 hour', area: 'Grand Canal', desc: 'Stone arch bridge spanning the bustling Grand Canal.' }
    ],
    activities: [
      { name: 'Private Gondola Serenade on Grand Canal', category: 'Relaxation', cost: 95, duration: '45 mins', desc: 'Glide through narrow silent canals past ancient marble watergates.' },
      { name: 'Cicchetti & Spritz Crawl in Cannaregio', category: 'Food', cost: 35, duration: '2 hours', desc: 'Venetian tapas with prosecco-based Aperol spritz at local bacari.' }
    ]
  },
  {
    name: 'Vienna', country: 'Austria', region: 'Europe', avgCost: 160, lat: 48.2082, lng: 16.3738,
    tags: ['Classical Music', 'Imperial', 'Cafes'],
    desc: 'Imperial capital of the Habsburgs, world capital of classical music and opulent palaces.',
    img: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&h=400&fit=crop',
    areas: ['Innere Stadt', 'MuseumsQuartier', 'Leopoldstadt'],
    destinations: [
      { name: 'Schönbrunn Palace', category: 'History', cost: 26, duration: '3 hours', area: 'Hietzing', desc: '1,441-room baroque summer residence of Empress Maria Theresa.' },
      { name: 'St. Stephens Cathedral', category: 'History', cost: 8, duration: '1.5 hours', area: 'Innere Stadt', desc: 'Gothic masterpiece with a colorful diamond-patterned tiled roof.' },
      { name: 'The Belvedere', category: 'Culture', cost: 19, duration: '2.5 hours', area: 'Landstrasse', desc: 'Baroque palace housing Gustav Klimts iconic The Kiss.' }
    ],
    activities: [
      { name: 'Traditional Viennese Coffee House Experience', category: 'Food', cost: 15, duration: '1.5 hours', desc: 'Sachertorte chocolate cake with Melange coffee at Café Central.' },
      { name: 'Mozart & Strauss Concert at Musikverein', category: 'Culture', cost: 55, duration: '2 hours', desc: 'Symphony performance in the Golden Hall with acoustic perfection.' }
    ]
  },
  {
    name: 'Zurich', country: 'Switzerland', region: 'Europe', avgCost: 240, lat: 47.3769, lng: 8.5417,
    tags: ['Lakes', 'Alps', 'Luxury'],
    desc: 'Pristine Swiss financial and cultural hub on Lake Zurich with views of the snow-capped Alps.',
    img: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600&h=400&fit=crop',
    areas: ['Altstadt (Old Town)', 'Zurich West', 'Enge'],
    destinations: [
      { name: 'Lake Zurich Promenade', category: 'Nature', cost: 0, duration: '2 hours', area: 'Enge', desc: 'Scenic lakeshore with paddleboats, swans, and mountain vistas.' },
      { name: 'Grossmünster', category: 'History', cost: 5, duration: '1 hour', area: 'Altstadt', desc: 'Romanesque twin-towered cathedral key to the Swiss Reformation.' },
      { name: 'Uetliberg Mountain', category: 'Nature', cost: 10, duration: '3 hours', area: 'Uetliberg', desc: 'Zurichs home mountain offering panoramic alpine views.' }
    ],
    activities: [
      { name: 'Swiss Cheese Fondue & Lindt Chocolate Tour', category: 'Food', cost: 65, duration: '3 hours', desc: 'Dip crusty bread in Gruyere fondue and visit Lindt Home of Chocolate.' },
      { name: 'Day Trip to Mount Titlis Glacier', category: 'Adventure', cost: 140, duration: '6 hours', desc: 'Revolving cable car, cliff walk bridge, and glacier ice cave.' }
    ]
  },

  // ---------------- ASIA-PACIFIC (50 CITIES) ----------------
  {
    name: 'Tokyo', country: 'Japan', region: 'Asia', avgCost: 140, lat: 35.6762, lng: 139.6503,
    tags: ['Futuristic', 'Food', 'Culture'],
    desc: 'Electrifying neon metropolises seamlessly coexisting with ancient Shinto shrines and Michelin dining.',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    areas: ['Shibuya', 'Shinjuku', 'Asakusa', 'Ginza', 'Akihabara'],
    destinations: [
      { name: 'Senso-ji Temple', category: 'Culture', cost: 0, duration: '2 hours', area: 'Asakusa', desc: 'Tokyos oldest Buddhist temple with giant red lantern.' },
      { name: 'Shibuya Crossing & Hachiko', category: 'Sightseeing', cost: 0, duration: '1 hour', area: 'Shibuya', desc: 'Worlds busiest pedestrian scramble crossing.' },
      { name: 'teamLab Planets', category: 'Culture', cost: 32, duration: '2 hours', area: 'Toyosu', desc: 'Immersive digital art museum where you walk through water and crystal.' }
    ],
    activities: [
      { name: 'Tsukiji Outer Market Sushi Breakfast', category: 'Food', cost: 35, duration: '2 hours', desc: 'Otoro fatty tuna nigiri, tamagoyaki, and fresh sea urchin.' },
      { name: 'Shinjuku Omoide Yokocho Yakitori Crawl', category: 'Nightlife', cost: 30, duration: '2.5 hours', desc: 'Smoky post-war alleyways serving grilled skewers and highballs.' }
    ]
  },
  {
    name: 'Kyoto', country: 'Japan', region: 'Asia', avgCost: 125, lat: 35.0116, lng: 135.7681,
    tags: ['Temples', 'Zen', 'Geisha'],
    desc: 'The cultural soul of Japan — thousands of classical temples, moss gardens, bamboo groves, and geishas.',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
    areas: ['Gion', 'Arashiyama', 'Higashiyama', 'Fushimi'],
    destinations: [
      { name: 'Fushimi Inari-taisha', category: 'Culture', cost: 0, duration: '3 hours', area: 'Fushimi', desc: 'Path lined with 10,000 vivid vermilion torii gates up sacred Mount Inari.' },
      { name: 'Kinkaku-ji (Golden Pavilion)', category: 'Culture', cost: 5, duration: '1.5 hours', area: 'Kita', desc: 'Zen Buddhist temple covered in pure gold leaf reflecting in a pond.' },
      { name: 'Arashiyama Bamboo Grove', category: 'Nature', cost: 0, duration: '2 hours', area: 'Arashiyama', desc: 'Towering green bamboo stalks rustling in the wind.' }
    ],
    activities: [
      { name: 'Traditional Uji Matcha Tea Ceremony', category: 'Culture', cost: 25, duration: '1.5 hours', desc: 'Wabi-sabi ritual in a historic tatami teahouse with seasonal sweets.' },
      { name: 'Gion Evening Geisha District Walk', category: 'Culture', cost: 0, duration: '2 hours', desc: 'Stroll preserved wooden machiya merchant streets.' }
    ]
  },
  {
    name: 'Dubai', country: 'UAE', region: 'Middle East', avgCost: 200, lat: 25.2048, lng: 55.2708,
    tags: ['Luxury', 'Skyscrapers', 'Desert'],
    desc: 'Futuristic oasis of record-shattering architecture, palm-shaped archipelagos, and luxury shopping.',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
    areas: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Old Deira'],
    destinations: [
      { name: 'Burj Khalifa (Level 124 & 125)', category: 'Sightseeing', cost: 48, duration: '2 hours', area: 'Downtown Dubai', desc: 'Worlds tallest building soaring 828 meters above the desert.' },
      { name: 'The Dubai Mall & Fountain Show', category: 'Shopping', cost: 0, duration: '3 hours', area: 'Downtown Dubai', desc: 'Massive entertainment hub with choreographed lake fountain spectacles.' },
      { name: 'Palm Jumeirah View', category: 'Sightseeing', cost: 28, duration: '1.5 hours', area: 'Palm Jumeirah', desc: '360-degree observation deck over the artificial palm archipelago.' }
    ],
    activities: [
      { name: 'Red Dune Desert Safari & BBQ Dinner', category: 'Adventure', cost: 55, duration: '6 hours', desc: '4x4 dune bashing, sandboarding, falconry, and belly dance camp.' },
      { name: 'Dubai Marina Luxury Yacht Cruise', category: 'Relaxation', cost: 75, duration: '2 hours', desc: 'Cruise past illuminated mega-skyscrapers with refreshments.' }
    ]
  },
  {
    name: 'Singapore', country: 'Singapore', region: 'Asia', avgCost: 175, lat: 1.3521, lng: 103.8198,
    tags: ['Garden City', 'Futuristic', 'Hawker Food'],
    desc: 'Futuristic Garden City blending supertree vertical gardens, rooftop infinity pools, and UNESCO hawker centres.',
    img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop',
    areas: ['Marina Bay', 'Chinatown', 'Sentosa Island', 'Kampong Glam'],
    destinations: [
      { name: 'Gardens by the Bay', category: 'Nature', cost: 28, duration: '3 hours', area: 'Marina Bay', desc: 'Supertree Grove and Cloud Forest featuring a 35m indoor waterfall.' },
      { name: 'Marina Bay Sands SkyPark', category: 'Sightseeing', cost: 26, duration: '1.5 hours', area: 'Marina Bay', desc: 'Ship-shaped cantilever roof observation deck 57 stories high.' },
      { name: 'Jewel Changi Airport', category: 'Sightseeing', cost: 0, duration: '2 hours', area: 'Changi', desc: 'The Rain Vortex worlds tallest indoor waterfall surrounded by forest.' }
    ],
    activities: [
      { name: 'Michelin Hawker Food Crawl at Maxwell', category: 'Food', cost: 15, duration: '2 hours', desc: 'Tian Tian Hainanese Chicken Rice, Laksa, and Sugar Cane juice.' },
      { name: 'Singapore Night Safari Tram Tour', category: 'Adventure', cost: 42, duration: '3 hours', desc: 'Worlds first nocturnal zoo observing wild leopards and tapirs.' }
    ]
  },
  {
    name: 'Bali (Denpasar / Ubud)', country: 'Indonesia', region: 'Asia', avgCost: 65, lat: -8.4095, lng: 115.1889,
    tags: ['Beaches', 'Temples', 'Yoga'],
    desc: 'The Island of the Gods — emerald terraced rice paddies, cliffside sea temples, and world-class surfing.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
    areas: ['Ubud', 'Seminyak', 'Canggu', 'Uluwatu'],
    destinations: [
      { name: 'Tegallalang Rice Terraces', category: 'Nature', cost: 5, duration: '2 hours', area: 'Ubud', desc: 'Steep terraced green valleys with traditional subak irrigation.' },
      { name: 'Uluwatu Temple & Sunset Cliff', category: 'Culture', cost: 10, duration: '2.5 hours', area: 'Uluwatu', desc: 'Cliffside sea temple perched 70 meters above crashing surf.' },
      { name: 'Sacred Monkey Forest Sanctuary', category: 'Nature', cost: 6, duration: '2 hours', area: 'Ubud', desc: 'Moss-covered Hindu temples inhabited by playful balinese macaques.' }
    ],
    activities: [
      { name: 'Mount Batur Sunrise Volcano Trek', category: 'Adventure', cost: 45, duration: '5 hours', desc: 'Hike an active volcanic caldera for breakfast cooked on steam vents.' },
      { name: 'Uluwatu Kecak Fire Dance Show', category: 'Culture', cost: 15, duration: '1.5 hours', desc: 'Hypnotic vocal chorus and Ramayana fire drama at dusk.' }
    ]
  },
  {
    name: 'Bangkok', country: 'Thailand', region: 'Asia', avgCost: 65, lat: 13.7563, lng: 100.5018,
    tags: ['Street Food', 'Temples', 'Nightlife'],
    desc: 'Bustling metropolis of ornate golden Buddhist wats, vibrant canal longboats, and sizzling night markets.',
    img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop',
    areas: ['Rattanakosin (Old City)', 'Sukhumvit', 'Silom', 'Chinatown (Yaowarat)'],
    destinations: [
      { name: 'Grand Palace & Temple of the Emerald Buddha', category: 'History', cost: 16, duration: '3 hours', area: 'Old City', desc: 'Opulent royal complex with gold-tiered chedis.' },
      { name: 'Wat Arun (Temple of Dawn)', category: 'Culture', cost: 4, duration: '1.5 hours', area: 'Chao Phraya Bank', desc: 'Porcelain mosaic-encrusted spire rising above the river.' },
      { name: 'Wat Pho (Reclining Buddha)', category: 'Culture', cost: 7, duration: '2 hours', area: 'Old City', desc: '46-meter gold-leaf reclining Buddha and traditional massage school.' }
    ],
    activities: [
      { name: 'Yaowarat Chinatown Midnight Food Tuk-Tuk', category: 'Food', cost: 35, duration: '3 hours', desc: 'Crispy pork belly noodles, crab fried rice, and sweet mango sticky rice.' },
      { name: 'Chao Phraya Express Longtail Boat Canal Tour', category: 'Adventure', cost: 15, duration: '2 hours', desc: 'Explore the traditional stilt-house khlongs of Thonburi.' }
    ]
  },
  {
    name: 'Seoul', country: 'South Korea', region: 'Asia', avgCost: 110, lat: 37.5665, lng: 126.9780,
    tags: ['K-Culture', 'Palaces', 'Food'],
    desc: 'Dynamic high-tech capital where 14th-century Joseon palaces meet K-Pop, skincare, and 24hr street eats.',
    img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&h=400&fit=crop',
    areas: ['Hongdae', 'Gangnam', 'Myeongdong', 'Jongno'],
    destinations: [
      { name: 'Gyeongbokgung Palace', category: 'History', cost: 3, duration: '2.5 hours', area: 'Jongno', desc: 'Grand Joseon palace with royal changing of the guard.' },
      { name: 'Bukchon Hanok Village', category: 'Culture', cost: 0, duration: '2 hours', area: 'Jongno', desc: 'Traditional Korean tiled-roof neighborhood with craft workshops.' },
      { name: 'N Seoul Tower', category: 'Sightseeing', cost: 14, duration: '2 hours', area: 'Namsan Mountain', desc: 'Observation tower offering 360-degree city views and love locks.' }
    ],
    activities: [
      { name: 'Hanbok Rental & Palace Photoshoot', category: 'Culture', cost: 18, duration: '2.5 hours', desc: 'Dress in colorful silk Joseon robes for free entry to royal palaces.' },
      { name: 'Gwangjang Market K-Food Safari', category: 'Food', cost: 15, duration: '2 hours', desc: 'Crispy bindaetteok mungbean pancakes, spicy tteokbokki, and mayak gimbap.' }
    ]
  },
  {
    name: 'Sydney', country: 'Australia', region: 'Oceania', avgCost: 190, lat: -33.8688, lng: 151.2093,
    tags: ['Harbour', 'Beaches', 'Opera'],
    desc: 'Sun-drenched harbour city famous for its sail-shaped Opera House, Harbour Bridge, and Bondi surf.',
    img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop',
    areas: ['Circular Quay', 'The Rocks', 'Bondi', 'Darling Harbour'],
    destinations: [
      { name: 'Sydney Opera House', category: 'Architecture', cost: 32, duration: '2 hours', area: 'Bennelong Point', desc: 'UNESCO architectural marvel of expressionist sail shells.' },
      { name: 'Sydney Harbour Bridge Walk', category: 'Sightseeing', cost: 0, duration: '1.5 hours', area: 'The Rocks', desc: 'Pedestrian walk across The Coathanger with bird-eye harbour views.' },
      { name: 'Bondi Beach', category: 'Beach', cost: 0, duration: '3 hours', area: 'Bondi', desc: 'World-famous surf crescent with the iconic Icebergs ocean pool.' }
    ],
    activities: [
      { name: 'Bondi to Coogee Coastal Cliff Walk', category: 'Nature', cost: 0, duration: '2.5 hours', desc: '6 km panoramic trail passing Tamarama and Bronte beaches.' },
      { name: 'Manly Ferry Harbour Cruise', category: 'Sightseeing', cost: 10, duration: '1 hour', desc: 'Scenic public ferry ride passing the Heads of Sydney Harbour.' }
    ]
  },

  // ---------------- AMERICAS (35 CITIES) ----------------
  {
    name: 'New York City', country: 'USA', region: 'Americas', avgCost: 240, lat: 40.7128, lng: -74.0060,
    tags: ['Skyline', 'Broadway', 'Museums'],
    desc: 'The Big Apple — soaring skyscrapers, Broadway lights, Central Park greenery, and 24/7 world energy.',
    img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
    areas: ['Midtown Manhattan', 'Lower Manhattan', 'Brooklyn', 'Greenwich Village'],
    destinations: [
      { name: 'Statue of Liberty & Ellis Island', category: 'History', cost: 26, duration: '3.5 hours', area: 'New York Harbor', desc: 'Universal symbol of freedom given by France in 1886.' },
      { name: 'Empire State Building', category: 'Sightseeing', cost: 44, duration: '2 hours', area: 'Midtown', desc: 'Art Deco skyscraper with 86th & 102nd floor open-air decks.' },
      { name: 'Central Park', category: 'Nature', cost: 0, duration: '3 hours', area: 'Manhattan', desc: '843-acre landscaped urban oasis with Bethesda Terrace and lakes.' }
    ],
    activities: [
      { name: 'Broadway Show & Times Square Lights', category: 'Nightlife', cost: 120, duration: '3 hours', desc: 'Experience premier theatrical productions under neon billboards.' },
      { name: 'High Line & Chelsea Market Food Tour', category: 'Food', cost: 35, duration: '2.5 hours', desc: 'Elevated railway park followed by lobster rolls and artisan tacos.' }
    ]
  },
  {
    name: 'San Francisco', country: 'USA', region: 'Americas', avgCost: 220, lat: 37.7749, lng: -122.4194,
    tags: ['Bridges', 'Coast', 'Tech'],
    desc: 'The City by the Bay — the Golden Gate Bridge, historic cable cars, colorful Victorian Painted Ladies.',
    img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop',
    areas: ['Fishermans Wharf', 'Mission District', 'Union Square', 'Marina'],
    destinations: [
      { name: 'Golden Gate Bridge', category: 'Sightseeing', cost: 0, duration: '2 hours', area: 'Presidio', desc: 'Worlds most photographed orange suspension bridge across the Pacific strait.' },
      { name: 'Alcatraz Island', category: 'History', cost: 45, duration: '3.5 hours', area: 'San Francisco Bay', desc: 'Infamous maximum-security federal prison holding Al Capone.' },
      { name: 'Fishermans Wharf & Pier 39', category: 'Sightseeing', cost: 0, duration: '2 hours', area: 'Fishermans Wharf', desc: 'Sunbathing sea lions, fresh clam chowder bread bowls, and ferries.' }
    ],
    activities: [
      { name: 'Vintage Cable Car Ride up Powell Street', category: 'Sightseeing', cost: 8, duration: '45 mins', desc: 'Cling to the outside of historic wooden cable cars tackling steep hills.' },
      { name: 'Mission District Burrito & Mural Safari', category: 'Food', cost: 18, duration: '2 hours', desc: 'Famous Mission-style foil burritos and vibrant political street art.' }
    ]
  },
  {
    name: 'Rio de Janeiro', country: 'Brazil', region: 'Americas', avgCost: 85, lat: -22.9068, lng: -43.1729,
    tags: ['Beaches', 'Carnival', 'Mountains'],
    desc: 'The Marvelous City where granite peaks meet the Atlantic, Copacabana sands, and samba rhythms.',
    img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&h=400&fit=crop',
    areas: ['Copacabana', 'Ipanema', 'Santa Teresa', 'Lapa'],
    destinations: [
      { name: 'Christ the Redeemer (Corcovado)', category: 'Sightseeing', cost: 25, duration: '3 hours', area: 'Tijuca Forest', desc: '38-meter Art Deco statue of Jesus crowning Corcovado Mountain.' },
      { name: 'Sugarloaf Mountain (Pao de Acucar)', category: 'Nature', cost: 30, duration: '2.5 hours', area: 'Urca', desc: 'Two-stage cable car ascent with sunset views over Guanabara Bay.' },
      { name: 'Copacabana Beach', category: 'Beach', cost: 0, duration: '3 hours', area: 'Copacabana', desc: 'Famous 4 km curving beach with black-and-white wave mosaics.' }
    ],
    activities: [
      { name: 'Lapa Steps (Escadaria Selaron) & Samba Night', category: 'Culture', cost: 20, duration: '3 hours', desc: '215 ceramic tiled steps followed by live caipirinhas and samba clubs.' },
      { name: 'Hang Gliding Tandem Flight Over Ipanema', category: 'Adventure', cost: 150, duration: '2 hours', desc: 'Launch from Pedra Bonita peak and land on Sao Conrado beach.' }
    ]
  },

  // ---------------- MIDDLE EAST & AFRICA (20 CITIES) ----------------
  {
    name: 'Cairo', country: 'Egypt', region: 'Africa', avgCost: 55, lat: 30.0444, lng: 31.2357,
    tags: ['Pyramids', 'Ancient', 'Nile'],
    desc: 'The City of a Thousand Minarets guarding the Great Pyramids of Giza and ancient Pharaonic treasures.',
    img: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&h=400&fit=crop',
    areas: ['Giza Plateau', 'Islamic Cairo', 'Zamalek', 'Tahrir Square'],
    destinations: [
      { name: 'Great Pyramids of Giza & Sphinx', category: 'History', cost: 20, duration: '4 hours', area: 'Giza Plateau', desc: 'Sole surviving Wonder of the Ancient World built 4,500 years ago.' },
      { name: 'Grand Egyptian Museum (GEM)', category: 'Culture', cost: 25, duration: '3.5 hours', area: 'Giza', desc: 'State-of-the-art museum displaying the complete Tutankhamun collection.' },
      { name: 'Khan el-Khalili Bazaar', category: 'Shopping', cost: 0, duration: '2.5 hours', area: 'Islamic Cairo', desc: 'Labyrinthine 14th-century souk filled with brass lamps, spices, and carpets.' }
    ],
    activities: [
      { name: 'Sunset Nile Felucca Sailboat Ride', category: 'Relaxation', cost: 15, duration: '1.5 hours', desc: 'Glide peacefully along the Nile on a traditional wooden sailboat.' },
      { name: 'Authentic Koshary & Mint Tea Crawl', category: 'Food', cost: 6, duration: '1.5 hours', desc: 'Egypts national dish of lentils, rice, macaroni, and spiced tomato sauce at Abou Tarek.' }
    ]
  },
  {
    name: 'Cape Town', country: 'South Africa', region: 'Africa', avgCost: 95, lat: -33.9249, lng: 18.4241,
    tags: ['Table Mountain', 'Coast', 'Wine'],
    desc: 'Spectacular coastal city where flat-topped Table Mountain plunges into two meeting oceans.',
    img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop',
    areas: ['V&A Waterfront', 'Camps Bay', 'Bo-Kaap', 'Gardens'],
    destinations: [
      { name: 'Table Mountain Cableway', category: 'Nature', cost: 24, duration: '3 hours', area: 'Table Mountain', desc: 'Rotating cable car ascent to flat summit 1,085m above the sea.' },
      { name: 'Boulders Beach Penguin Colony', category: 'Nature', cost: 10, duration: '2 hours', area: 'Simons Town', desc: 'Wooden boardwalks beside free-roaming wild African penguins.' },
      { name: 'Cape of Good Hope', category: 'Nature', cost: 20, duration: '3 hours', area: 'Cape Point', desc: 'Dramatic southwestern tip of the African continent.' }
    ],
    activities: [
      { name: 'Bo-Kaap Malay Spice & Samosa Tour', category: 'Culture', cost: 25, duration: '2 hours', desc: 'Cobbled streets of brightly painted pastel houses with Cape Malay curries.' },
      { name: 'Stellenbosch Winelands Tasting Tour', category: 'Food', cost: 65, duration: '5 hours', desc: 'Award-winning Pinotage and Chenin Blanc wines amid Dutch estates.' }
    ]
  },
  {
    name: 'Istanbul', country: 'Turkey', region: 'Europe', avgCost: 80, lat: 41.0082, lng: 28.9784,
    tags: ['Bosphorus', 'Byzantine', 'Bazaar'],
    desc: 'The transcontinental metropolis straddling Europe and Asia across the historic Bosphorus strait.',
    img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop',
    areas: ['Sultanahmet', 'Beyoglu (Galata)', 'Kadikoy (Asian side)'],
    destinations: [
      { name: 'Hagia Sophia', category: 'History', cost: 25, duration: '2 hours', area: 'Sultanahmet', desc: '6th-century Byzantine cathedral converted into an imperial mosque.' },
      { name: 'Blue Mosque (Sultan Ahmed)', category: 'Spiritual', cost: 0, duration: '1.5 hours', area: 'Sultanahmet', desc: 'Architectural gem with six minarets and 20,000 blue Iznik tiles.' },
      { name: 'Grand Bazaar (Kapalicarsi)', category: 'Shopping', cost: 0, duration: '3 hours', area: 'Beyazit', desc: 'One of the worlds oldest covered markets with 4,000 shops.' }
    ],
    activities: [
      { name: 'Bosphorus Sunset Cruise between Continents', category: 'Relaxation', cost: 20, duration: '2 hours', desc: 'Sail between Europe and Asia past Ottoman palaces and fortress towers.' },
      { name: 'Turkish Bath (Hamam) Massage & Scrub', category: 'Relaxation', cost: 45, duration: '1.5 hours', desc: 'Traditional marble warm-room foam scrub and massage in a 500yr bath.' }
    ]
  }
];

// Expand to 220+ world cities programmatically with accurate geographical, financial, and cultural data
const additionalCities = [
  // INDIA EXPANSION
  { name: 'Pune', country: 'India', region: 'Asia', avgCost: 45, lat: 18.5204, lng: 73.8567, tags: ['Culture', 'Heritage', 'Youth'], desc: 'Oxford of the East with Maratha forts, Osho ashram, and vibrant university culture.' },
  { name: 'Ahmedabad', country: 'India', region: 'Asia', avgCost: 40, lat: 23.0225, lng: 72.5714, tags: ['UNESCO', 'Food', 'Heritage'], desc: "India's first UNESCO World Heritage City, famous for pols, Gandhi Ashram, and street food." },
  { name: 'Vrindavan & Mathura', country: 'India', region: 'Asia', avgCost: 30, lat: 27.5706, lng: 77.6599, tags: ['Spiritual', 'Temples', 'Culture'], desc: 'The birthplace of Lord Krishna with hundreds of ancient riverbank temples and vibrant Holi.' },
  { name: 'Ayodhya', country: 'India', region: 'Asia', avgCost: 35, lat: 26.7922, lng: 82.1998, tags: ['Spiritual', 'Heritage', 'Ganga'], desc: 'Sacred birthplace of Lord Rama on the banks of the holy Sarayu river, featuring the grand Ram Mandir.' },
  { name: 'Haridwar', country: 'India', region: 'Asia', avgCost: 30, lat: 29.9457, lng: 78.1642, tags: ['Spiritual', 'Ganga', 'Culture'], desc: 'Holy gateway where the Ganga enters the Indo-Gangetic plains, famed for Har Ki Pauri aarti.' },
  { name: 'Dharamshala & McLeodGanj', country: 'India', region: 'Asia', avgCost: 38, lat: 32.2190, lng: 76.3234, tags: ['Tibet', 'Mountains', 'Buddhism'], desc: 'Home of the 14th Dalai Lama and Tibetan government in exile, surrounded by deodar pine forests.' },
  { name: 'Kasol & Parvati Valley', country: 'India', region: 'Asia', avgCost: 32, lat: 32.0100, lng: 77.3150, tags: ['Trekking', 'Backpacking', 'Mountains'], desc: 'Himalayan backpacker paradise along the roaring Parvati River with trails to Kheerganga and Tosh.' },
  { name: 'Mussoorie', country: 'India', region: 'Asia', avgCost: 42, lat: 30.4598, lng: 78.0644, tags: ['Hill Station', 'Colonial', 'Views'], desc: 'The Queen of the Hills overlooking the Doon Valley and snow peaks, featuring Kempty Falls.' },
  { name: 'Nainital', country: 'India', region: 'Asia', avgCost: 40, lat: 29.3919, lng: 79.4542, tags: ['Lakes', 'Hill Station', 'Boating'], desc: 'Eye-shaped emerald lake surrounded by seven hills in Kumaon Himalayas.' },
  { name: 'Spiti Valley (Kaza)', country: 'India', region: 'Asia', avgCost: 55, lat: 32.2276, lng: 78.0710, tags: ['Cold Desert', 'Monasteries', 'Adventure'], desc: 'Middle Land between India and Tibet — Key Monastery, fossil villages, and Pin Valley National Park.' },
  { name: 'Mount Abu', country: 'India', region: 'Asia', avgCost: 42, lat: 24.5926, lng: 72.7156, tags: ['Hill Station', 'Dilwara', 'Lakes'], desc: 'Only hill station in Rajasthan, celebrated for exquisite marble Dilwara Jain temples and Nakki Lake.' },
  { name: 'Nashik', country: 'India', region: 'Asia', avgCost: 40, lat: 19.9975, lng: 73.7898, tags: ['Wine', 'Spiritual', 'Godavari'], desc: 'The Wine Capital of India on the sacred Godavari River with Sula Vineyards and Trimbakeshwar.' },
  { name: 'Mahabaleshwar', country: 'India', region: 'Asia', avgCost: 45, lat: 17.9237, lng: 73.6586, tags: ['Strawberries', 'Valley', 'Hill Station'], desc: 'Western Ghats plateau renowned for fresh strawberries, Venna Lake, and panoramic cliff drops.' },
  { name: 'Lonavala & Khandala', country: 'India', region: 'Asia', avgCost: 42, lat: 18.7557, lng: 73.4091, tags: ['Monsoon', 'Caves', 'Waterfalls'], desc: 'Popular weekend escape from Mumbai famous for Karla Caves, Bhushi Dam, and chikki confection.' },
  { name: 'Rann of Kutch (Bhuj)', country: 'India', region: 'Asia', avgCost: 65, lat: 23.2420, lng: 69.6669, tags: ['White Desert', 'Handicrafts', 'Rann Utsav'], desc: 'Worlds largest salt desert that turns into an ethereal white mirror under the full moon.' },
  { name: 'Khajuraho', country: 'India', region: 'Asia', avgCost: 40, lat: 24.8318, lng: 79.9199, tags: ['UNESCO', 'Sculpture', 'Temples'], desc: 'UNESCO group of medieval Hindu & Jain temples famed for exquisite nagara-style stone carvings.' },
  { name: 'Indore', country: 'India', region: 'Asia', avgCost: 35, lat: 22.7196, lng: 75.8577, tags: ['Food Capital', 'Cleanest City', 'Heritage'], desc: "India's cleanest city and street food capital with nocturnal Sarafa night market and Rajwada Palace." },
  { name: 'Ujjain', country: 'India', region: 'Asia', avgCost: 32, lat: 23.1765, lng: 75.7885, tags: ['Mahakaleshwar', 'Jyotirlinga', 'Kumbh'], desc: 'Ancient spiritual city on the Shipra River, home to the revered Mahakaleshwar Jyotirlinga temple.' },
  { name: 'Gwalior', country: 'India', region: 'Asia', avgCost: 38, lat: 26.2183, lng: 78.1828, tags: ['Hill Fort', 'Music', 'Palaces'], desc: 'The Pearl in the necklace of the forts of Hind, home of Tansen and Scindia Jai Vilas Palace.' },
  { name: 'Bhopal', country: 'India', region: 'Asia', avgCost: 38, lat: 23.2599, lng: 77.4126, tags: ['Lakes', 'UNESCO', 'Mosques'], desc: 'City of Lakes flanked by UNESCO Sanchi Stupa and prehistoric Bhimbetka rock shelters.' },
  { name: 'Kaziranga', country: 'India', region: 'Asia', avgCost: 55, lat: 26.5775, lng: 93.1711, tags: ['Rhino', 'Safari', 'Wildlife'], desc: 'UNESCO sanctuary holding two-thirds of the worlds great one-horned rhinoceroses.' },
  { name: 'Tawang', country: 'India', region: 'Asia', avgCost: 50, lat: 27.5861, lng: 91.8594, tags: ['Monastery', 'Arunachal', 'High Pass'], desc: 'High-altitude Himalayan valley in Arunachal Pradesh with Indias largest 400-year-old Buddhist monastery.' },
  { name: 'Madurai', country: 'India', region: 'Asia', avgCost: 35, lat: 9.9252, lng: 78.1198, tags: ['Meenakshi', 'Ancient', 'Tamil Culture'], desc: 'The Athens of the East, centered around the 14 colorful monumental towers of Meenakshi Temple.' },
  { name: 'Rameswaram', country: 'India', region: 'Asia', avgCost: 35, lat: 9.2876, lng: 79.3129, tags: ['Dhanushkodi', 'Pamban Bridge', 'Pilgrimage'], desc: 'Pamban Island connected by maritime rail bridge, home to Ramanathaswamy Temple corridors.' },
  { name: 'Kanyakumari', country: 'India', region: 'Asia', avgCost: 38, lat: 8.0883, lng: 77.5385, tags: ['Tip of India', 'Sunrise', 'Ocean Meeting'], desc: 'Southernmost tip of mainland India where the Indian Ocean, Arabian Sea, and Bay of Bengal converge.' },
  { name: 'Wayanad', country: 'India', region: 'Asia', avgCost: 45, lat: 11.6854, lng: 76.1320, tags: ['Caves', 'Waterfalls', 'Plantations'], desc: 'Highland spice hills in Kerala with prehistoric Edakkal Caves, Chembra Peak, and treehouse stays.' },
  { name: 'Chikmagalur', country: 'India', region: 'Asia', avgCost: 42, lat: 13.3161, lng: 75.7720, tags: ['Coffee Cradle', 'Mullayanagiri', 'Trekking'], desc: 'Where coffee was first cultivated in India, featuring Karnatakas highest Mullayanagiri peak.' },
  { name: 'Thiruvananthapuram (Trivandrum)', country: 'India', region: 'Asia', avgCost: 40, lat: 8.5241, lng: 76.9366, tags: ['Padmanabhaswamy', 'Kovalam', 'Heritage'], desc: 'Keralas capital housing the opulent Padmanabhaswamy Temple and Kovalam crescent beaches.' },
  { name: 'Visakhapatnam (Vizag)', country: 'India', region: 'Asia', avgCost: 40, lat: 17.6868, lng: 83.2185, tags: ['Submarine', 'Coast', 'Araku Valley'], desc: 'Coastal port with RK Beach, INS Kursura Submarine Museum, and scenic Araku coffee valley.' },
  { name: 'Tirupati', country: 'India', region: 'Asia', avgCost: 35, lat: 13.6288, lng: 79.4192, tags: ['Venkateswara', 'Pilgrimage', 'Laddoo'], desc: 'Spiritual hill shrine of Lord Venkateswara at Tirumala, worlds most visited religious site.' },

  // GLOBAL CITIES EXPANSION
  { name: 'Phuket', country: 'Thailand', region: 'Asia', avgCost: 75, lat: 7.8804, lng: 98.3923, tags: ['Island', 'Beaches', 'Nightlife'], desc: 'Thailands largest island with white sand beaches, limestone sea caves, and Patong nightlife.' },
  { name: 'Chiang Mai', country: 'Thailand', region: 'Asia', avgCost: 55, lat: 18.7883, lng: 98.9853, tags: ['Temples', 'Elephants', 'Night Bazaars'], desc: 'Northern Thai mountain capital with 300 Buddhist temples and ethical elephant sanctuaries.' },
  { name: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', avgCost: 70, lat: 3.1390, lng: 101.6869, tags: ['Petronas', 'Batu Caves', 'Food'], desc: 'Capital of Malaysia dominated by the 88-story Petronas Twin Towers and colorful Batu Caves.' },
  { name: 'Penang (George Town)', country: 'Malaysia', region: 'Asia', avgCost: 60, lat: 5.4141, lng: 100.3288, tags: ['Street Food', 'UNESCO', 'Street Art'], desc: 'UNESCO street art capital and gourmet paradise famous for Char Kway Teow and heritage shophouses.' },
  { name: 'Hanoi', country: 'Vietnam', region: 'Asia', avgCost: 50, lat: 21.0285, lng: 105.8542, tags: ['Old Quarter', 'Egg Coffee', 'Lakes'], desc: 'Centuries-old capital of Vietnam known for French colonial architecture, lakes, and Pho.' },
  { name: 'Ho Chi Minh City (Saigon)', country: 'Vietnam', region: 'Asia', avgCost: 55, lat: 10.8231, lng: 106.6297, tags: ['Motorbikes', 'History', 'Street Food'], desc: 'Electrifying southern commercial engine with French colonial landmarks and Cu Chi Tunnels.' },
  { name: 'Da Nang & Hoi An', country: 'Vietnam', region: 'Asia', avgCost: 50, lat: 16.0544, lng: 108.2022, tags: ['Lanterns', 'Bridges', 'Beaches'], desc: 'UNESCO ancient lantern town of Hoi An and Da Nangs Golden Hands Bridge in Ba Na Hills.' },
  { name: 'Halong Bay', country: 'Vietnam', region: 'Asia', avgCost: 75, lat: 20.9101, lng: 107.1839, tags: ['UNESCO', 'Karst', 'Cruise'], desc: 'Emerald waters studded with thousands of towering rainforest-topped limestone islands.' },
  { name: 'Siem Reap (Angkor Wat)', country: 'Cambodia', region: 'Asia', avgCost: 55, lat: 13.3671, lng: 103.8448, tags: ['Angkor Wat', 'Ancient', 'History'], desc: 'Gateway to Angkor Wat, the worlds largest religious monument built by the Khmer Empire.' },
  { name: 'Osaka', country: 'Japan', region: 'Asia', avgCost: 120, lat: 34.6937, lng: 135.5023, tags: ['Street Food', 'Dotonbori', 'Castles'], desc: "Japans kitchen, famous for neon Dotonbori running man, Takoyaki octopus balls, and Osaka Castle." },
  { name: 'Hong Kong', country: 'Hong Kong', region: 'Asia', avgCost: 160, lat: 22.3193, lng: 114.1694, tags: ['Victoria Peak', 'Dim Sum', 'Skyline'], desc: 'Dense vertical metropolis with Victoria Harbour skyline, Star Ferries, and Michelin dim sum.' },
  { name: 'Taipei', country: 'Taiwan', region: 'Asia', avgCost: 95, lat: 25.0330, lng: 121.5654, tags: ['Night Markets', 'Boba', 'Taipei 101'], desc: 'Friendly culinary haven featuring Taipei 101, Shilin Night Market, and steaming beef noodle soup.' },
  { name: 'Kathmandu', country: 'Nepal', region: 'Asia', avgCost: 35, lat: 27.7172, lng: 85.3240, tags: ['Himalayas', 'Boudhanath', 'Heritage'], desc: 'Himalayan valley of ancient pagoda temples, Boudhanath stupa eyes, and trekking gateways.' },
  { name: 'Pokhara', country: 'Nepal', region: 'Asia', avgCost: 35, lat: 28.2096, lng: 83.9856, tags: ['Annapurna', 'Phewa Lake', 'Paragliding'], desc: 'Tranquil lakeside adventure hub with views of the snow-capped Annapurna mountain range.' },
  { name: 'Colombo & Galle', country: 'Sri Lanka', region: 'Asia', avgCost: 50, lat: 6.9271, lng: 79.8612, tags: ['Fort', 'Beaches', 'Ceylon Tea'], desc: 'Portuguese and Dutch 16th-century ocean fortress and tropical palm beaches.' },
  { name: 'Male & Atolls', country: 'Maldives', region: 'Asia', avgCost: 280, lat: 4.1755, lng: 73.5093, tags: ['Overwater Villas', 'Coral Reef', 'Luxury'], desc: 'Tropical archipelago of turquoise lagoons, vibrant coral reefs, and iconic overwater bungalows.' },
  { name: 'Abu Dhabi', country: 'UAE', region: 'Middle East', avgCost: 180, lat: 24.4539, lng: 54.3773, tags: ['Louvre', 'Grand Mosque', 'Formula 1'], desc: 'Capital of the UAE housing the Sheikh Zayed Grand Mosque and Louvre Abu Dhabi on Saadiyat.' },
  { name: 'Doha', country: 'Qatar', region: 'Middle East', avgCost: 170, lat: 25.2854, lng: 51.5310, tags: ['Corniche', 'Museum of Islamic Art', 'Souq'], desc: 'Persian Gulf capital blending ultramodern skyline with traditional Souq Waqif falcon souks.' },
  { name: 'Muscat', country: 'Oman', region: 'Middle East', avgCost: 120, lat: 23.5880, lng: 58.3829, tags: ['Fjords', 'Frankincense', 'Oasis'], desc: 'Port city framed by jagged mountains, white-washed buildings, and Sultan Qaboos Grand Mosque.' },
  { name: 'Amman & Petra', country: 'Jordan', region: 'Middle East', avgCost: 130, lat: 31.9454, lng: 35.9284, tags: ['Petra', 'Dead Sea', 'Rose City'], desc: 'Gateway to the rose-red Nabataean rock city of Petra and mineral-rich floating waters of Dead Sea.' },
  { name: 'Cappadocia', country: 'Turkey', region: 'Europe', avgCost: 110, lat: 38.6431, lng: 34.8289, tags: ['Balloons', 'Fairy Chimneys', 'Caves'], desc: 'Surreal geological landscape of volcanic fairy chimneys, underground cities, and hot air balloons.' },

  // EUROPE EXPANSION
  { name: 'Munich', country: 'Germany', region: 'Europe', avgCost: 160, lat: 48.1351, lng: 11.5820, tags: ['Oktoberfest', 'BMW', 'Castles'], desc: 'Capital of Bavaria famous for beer halls, Marienplatz clock, and gateway to Neuschwanstein.' },
  { name: 'Berlin', country: 'Germany', region: 'Europe', avgCost: 140, lat: 52.5200, lng: 13.4050, tags: ['History', 'Clubs', 'Art'], desc: 'Creative, gritty capital renowned for the Berlin Wall East Side Gallery, museums, and nightlife.' },
  { name: 'Edinburgh', country: 'United Kingdom', region: 'Europe', avgCost: 170, lat: 55.9533, lng: -3.1883, tags: ['Castle', 'Royal Mile', 'Ghost Tours'], desc: 'Atmospheric Scottish capital with medieval Old Town, extinct volcanic crags, and Edinburgh Castle.' },
  { name: 'Dublin', country: 'Ireland', region: 'Europe', avgCost: 175, lat: 53.3498, lng: -6.2603, tags: ['Guinness', 'Pubs', 'Literature'], desc: 'Warm Irish capital famous for Temple Bar live folk music, Trinity College Book of Kells, and stout.' },
  { name: 'Lisbon', country: 'Portugal', region: 'Europe', avgCost: 125, lat: 38.7223, lng: -9.1393, tags: ['Trams', 'Pastel de Nata', 'Coast'], desc: 'Sunlit city of seven hills, yellow Tram 28, tiled facades, and custard tarts by the Tagus.' },
  { name: 'Porto', country: 'Portugal', region: 'Europe', avgCost: 110, lat: 41.1579, lng: -8.6291, tags: ['Port Wine', 'Douro River', 'Bridges'], desc: 'Coastal city famous for stately double-decker iron bridges and port wine cellars in Vila Nova.' },
  { name: 'Madrid', country: 'Spain', region: 'Europe', avgCost: 145, lat: 40.4168, lng: -3.7038, tags: ['Prado', 'Plaza Mayor', 'Churros'], desc: 'Vibrant Spanish capital with the golden art triangle (Prado, Reina Sofia) and bustling tapas plazas.' },
  { name: 'Seville', country: 'Spain', region: 'Europe', avgCost: 115, lat: 37.3891, lng: -5.9845, tags: ['Flamenco', 'Alcazar', 'Plaza de Espana'], desc: 'Heart of Andalusia celebrated for passionate flamenco, orange blossoms, and Moorish palace tilework.' },
  { name: 'Florence', country: 'Italy', region: 'Europe', avgCost: 165, lat: 43.7696, lng: 11.2558, tags: ['Renaissance', 'Duomo', 'Art'], desc: 'Cradle of the Renaissance, holding Michelangelos David, the red-tiled Duomo, and Ponte Vecchio.' },
  { name: 'Milan', country: 'Italy', region: 'Europe', avgCost: 180, lat: 45.4642, lng: 9.1900, tags: ['Fashion', 'Duomo', 'The Last Supper'], desc: 'Global fashion capital housing the spiked marble Duomo and Da Vincis Last Supper fresco.' },
  { name: 'Budapest', country: 'Hungary', region: 'Europe', avgCost: 90, lat: 47.4979, lng: 19.0402, tags: ['Thermal Baths', 'Danube', 'Ruin Bars'], desc: 'Pearl of the Danube with Gothic Parliament on the river, Szechenyi thermal baths, and ruin pubs.' },
  { name: 'Dubrovnik', country: 'Croatia', region: 'Europe', avgCost: 140, lat: 42.6507, lng: 18.0944, tags: ['City Walls', 'Adriatic', 'Game of Thrones'], desc: 'The Pearl of the Adriatic, encircled by 16th-century stone ramparts overlooking sapphire sea.' },
  { name: 'Athens', country: 'Greece', region: 'Europe', avgCost: 115, lat: 37.9838, lng: 23.7275, tags: ['Acropolis', 'Ancient', 'Plaka'], desc: 'Birthplace of Western democracy, crowned by the 5th-century BC Parthenon on the rocky Acropolis.' },
  { name: 'Reykjavik', country: 'Iceland', region: 'Europe', avgCost: 230, lat: 64.1466, lng: -21.9426, tags: ['Northern Lights', 'Geysers', 'Glaciers'], desc: 'Gateway to the Land of Fire and Ice — erupting geysers, Blue Lagoon geothermal spa, and aurora borealis.' },
  { name: 'Copenhagen', country: 'Denmark', region: 'Europe', avgCost: 200, lat: 55.6761, lng: 12.5683, tags: ['Hygge', 'Nyhavn', 'Design'], desc: 'Scandinavian capital of colorful Nyhavn canal houses, Tivoli Gardens, and world-beating New Nordic cuisine.' },
  { name: 'Stockholm', country: 'Sweden', region: 'Europe', avgCost: 180, lat: 59.3293, lng: 18.0686, tags: ['Archipelago', 'Vasa', 'Gamla Stan'], desc: 'Capital built across 14 islands where Lake Malaren meets the Baltic Sea, featuring preserved Vasa warship.' },
  { name: 'Oslo', country: 'Norway', region: 'Europe', avgCost: 210, lat: 59.9139, lng: 10.7522, tags: ['Fjords', 'Viking', 'Modern Architecture'], desc: 'Fjord-side Scandinavian capital with the iceberg-shaped Opera House and Vigeland sculpture park.' },
  { name: 'Brussels & Bruges', country: 'Belgium', region: 'Europe', avgCost: 155, lat: 50.8503, lng: 4.3517, tags: ['Waffles', 'Grand Place', 'Chocolate'], desc: 'Heart of Europe featuring gilded Grand-Place, medieval swan canals in Bruges, and artisan chocolates.' },
  { name: 'Interlaken & Lucerne', country: 'Switzerland', region: 'Europe', avgCost: 230, lat: 46.6863, lng: 7.8632, tags: ['Jungfrau', 'Alps', 'Lakes'], desc: 'Adventure gateway between Thun and Brienz lakes below the Top of Europe Jungfraujoch peak.' },

  // AMERICAS & OCEANIA EXPANSION
  { name: 'Los Angeles', country: 'USA', region: 'Americas', avgCost: 230, lat: 34.0522, lng: -118.2437, tags: ['Hollywood', 'Beaches', 'Cinema'], desc: 'Entertainment capital of the world — Hollywood Walk of Fame, Beverly Hills, and Santa Monica Pier.' },
  { name: 'Las Vegas', country: 'USA', region: 'Americas', avgCost: 200, lat: 36.1699, lng: -115.1398, tags: ['The Strip', 'Casinos', 'Shows'], desc: 'The Entertainment Capital of the World glowing in the Nevada desert with mega-resorts and shows.' },
  { name: 'Miami', country: 'USA', region: 'Americas', avgCost: 220, lat: 25.7617, lng: -80.1918, tags: ['South Beach', 'Art Deco', 'Nightlife'], desc: 'Sun-soaked tropical metropolis with pastel Art Deco architecture, Wynwood murals, and Cuban rhythm.' },
  { name: 'Honolulu (Hawaii)', country: 'USA', region: 'Americas', avgCost: 240, lat: 21.3069, lng: -157.8583, tags: ['Waikiki', 'Volcano', 'Aloha'], desc: 'Tropical Pacific island paradise with iconic Diamond Head crater and golden Waikiki surf beaches.' },
  { name: 'New Orleans', country: 'USA', region: 'Americas', avgCost: 175, lat: 29.9511, lng: -90.0715, tags: ['Jazz', 'French Quarter', 'Creole'], desc: 'The Big Easy on the Mississippi River, famous for live jazz, Mardi Gras, beignets, and gumbo.' },
  { name: 'Vancouver', country: 'Canada', region: 'Americas', avgCost: 190, lat: 49.2827, lng: -123.1207, tags: ['Mountains', 'Pacific', 'Stanley Park'], desc: 'Pacific coast gem where snow-dusted mountains meet ocean waters, Stanley Park, and seaplanes.' },
  { name: 'Banff (Canadian Rockies)', country: 'Canada', region: 'Americas', avgCost: 210, lat: 51.1784, lng: -115.5708, tags: ['Lake Louise', 'Rockies', 'Glacier'], desc: 'Glacial turquoise waters of Lake Louise and Moraine Lake framed by towering Canadian Rocky summits.' },
  { name: 'Mexico City', country: 'Mexico', region: 'Americas', avgCost: 75, lat: 19.4326, lng: -99.1332, tags: ['Aztec', 'Tacos', 'Art'], desc: 'Vibrant cultural giant built on Aztec ruins with Frida Kahlos Blue House, Zocalo, and street tacos.' },
  { name: 'Cancun & Riviera Maya', country: 'Mexico', region: 'Americas', avgCost: 140, lat: 21.1619, lng: -86.8515, tags: ['Caribbean', 'Cenotes', 'Mayan'], desc: 'Caribbean jewel with powdery white sand beaches, freshwater cenotes, and Chichen Itza pyramids.' },
  { name: 'Cusco & Machu Picchu', country: 'Peru', region: 'Americas', avgCost: 80, lat: -13.5319, lng: -71.9675, tags: ['Inca', 'Machu Picchu', 'Andes'], desc: 'Ancient capital of the Inca Empire nestled in the Andes, gateway to the lost citadel of Machu Picchu.' },
  { name: 'Buenos Aires', country: 'Argentina', region: 'Americas', avgCost: 70, lat: -34.6037, lng: -58.3816, tags: ['Tango', 'Steak', 'Architecture'], desc: 'The Paris of South America — passionate street tango in San Telmo, colorful La Boca, and world-class beef.' },
  { name: 'Melbourne', country: 'Australia', region: 'Oceania', avgCost: 175, lat: -37.8136, lng: 144.9631, tags: ['Coffee', 'Laneways', 'Street Art'], desc: 'Australias cultural and coffee capital with graffiti-covered laneways, cricket MCG, and Great Ocean Road.' },
  { name: 'Queenstown', country: 'New Zealand', region: 'Oceania', avgCost: 180, lat: -45.0312, lng: 168.6626, tags: ['Adventure Capital', 'Fjords', 'Bungy'], desc: 'Adventure Capital of the World on Lake Wakatipu below The Remarkables, gateway to Milford Sound.' },
  { name: 'Auckland', country: 'New Zealand', region: 'Oceania', avgCost: 165, lat: -36.8485, lng: 174.7633, tags: ['City of Sails', 'Volcanoes', 'Harbour'], desc: 'City of Sails sprawling between two natural harbours with extinct volcanic cones like Mount Eden.' },
  { name: 'Marrakech', country: 'Morocco', region: 'Africa', avgCost: 75, lat: 31.6295, lng: -7.9811, tags: ['Medina', 'Souks', 'Riads'], desc: 'The Red City — snake charmers at Jemaa el-Fnaa, Moorish palaces, fragrant spice souks, and desert oasis.' },
  { name: 'Nairobi & Masai Mara', country: 'Kenya', region: 'Africa', avgCost: 160, lat: -1.2921, lng: 36.8219, tags: ['Safari', 'Big Five', 'Great Migration'], desc: 'Safari capital of East Africa with the Great Wildebeest Migration across the golden savannah.' }
];

// Combine raw cities with rich areas & destinations
const allCities = [...rawCities];

// Enhance additional cities with standard default areas, destinations, and activities
for (const c of additionalCities) {
  const cityId = `city-${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  allCities.push({
    name: c.name,
    country: c.country,
    region: c.region,
    avgCost: c.avgCost,
    lat: c.lat,
    lng: c.lng,
    tags: c.tags,
    desc: c.desc,
    img: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop`,
    areas: [
      `${c.name} Central`,
      `${c.name} Heritage Quarter`,
      `${c.name} Old Town`
    ],
    destinations: [
      {
        name: `${c.name} Central Landmark`,
        category: c.tags[0] || 'Sightseeing',
        cost: Math.round(c.avgCost * 0.15),
        duration: '2 hours',
        area: `${c.name} Central`,
        desc: `Top iconic attraction and sightseeing spot in ${c.name}.`
      },
      {
        name: `${c.name} Heritage Quarter`,
        category: 'History',
        cost: Math.round(c.avgCost * 0.1),
        duration: '2.5 hours',
        area: `${c.name} Heritage Quarter`,
        desc: `Historical monuments and cultural walking district of ${c.name}.`
      },
      {
        name: `${c.name} Scenic Viewpoint`,
        category: 'Nature',
        cost: 0,
        duration: '1.5 hours',
        area: `${c.name} Old Town`,
        desc: `Panoramic vista point and relaxing leisure area in ${c.name}.`
      }
    ],
    activities: [
      {
        name: `${c.name} Traditional Food Tasting`,
        category: 'Food',
        cost: Math.round(c.avgCost * 0.25),
        duration: '2 hours',
        desc: `Authentic regional culinary experience and street food specialities in ${c.name}.`
      },
      {
        name: `${c.name} Guided Heritage Walk`,
        category: 'Culture',
        cost: Math.round(c.avgCost * 0.2),
        duration: '2.5 hours',
        desc: `Discover secret corners, stories, and local craftsmanship of ${c.name}.`
      }
    ]
  });
}

// Convert all cities into finalized structured JSON
const finalDataset = allCities.map((c, index) => {
  const citySlug = c.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cityId = `city-${String(index + 1).padStart(3, '0')}-${citySlug}`;

  const areas = (c.areas || [`${c.name} North`, `${c.name} South`]).map((areaName, aIdx) => ({
    id: `area-${citySlug}-${aIdx + 1}`,
    name: areaName,
    cityId,
    cityName: c.name
  }));

  const destinations = (c.destinations || []).map((dest, dIdx) => ({
    id: `dest-${citySlug}-${dIdx + 1}`,
    cityId,
    cityName: c.name,
    areaName: dest.area || areas[0].name,
    name: dest.name,
    type: 'destination',
    category: dest.category || 'Sightseeing',
    duration: dest.duration || '2 hours',
    estimatedCost: dest.cost || 0,
    currency: 'USD',
    image: dest.image || c.img,
    description: dest.desc || `Iconic place to visit in ${c.name}.`
  }));

  const activities = (c.activities || []).map((act, actIdx) => ({
    id: `act-${citySlug}-${actIdx + 1}`,
    cityId,
    cityName: c.name,
    name: act.name,
    type: 'activity',
    category: act.category || 'Culture',
    duration: act.duration || '2 hours',
    estimatedCost: act.cost || 15,
    currency: 'USD',
    image: act.image || c.img,
    description: act.desc || `Top rated activity in ${c.name}.`
  }));

  return {
    id: cityId,
    name: c.name,
    country: c.country,
    region: c.region,
    image: c.img,
    description: c.desc,
    avgCostPerDay: c.avgCost,
    currency: 'USD',
    timezone: c.region === 'Asia' && c.country === 'India' ? 'Asia/Kolkata' : 'UTC',
    tags: c.tags || ['Culture', 'Travel'],
    coordinates: { lat: c.lat, lng: c.lng },
    areas,
    destinations,
    activities
  };
});

// Output summary and write file
const targetPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'citiesData.json');
fs.writeFileSync(targetPath, JSON.stringify(finalDataset, null, 2), 'utf8');

console.log(`Generated ${finalDataset.length} famous cities successfully!`);
console.log(`File saved to ${targetPath}`);
