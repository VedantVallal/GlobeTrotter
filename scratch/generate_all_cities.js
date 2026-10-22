// Comprehensive Dataset Generator with 150+ Indian Cities (50+ in Maharashtra) + 180+ Global Destinations
const fs = require('fs');
const path = require('path');

// -------------------------------------------------------------
// 1. MAHARASHTRA DESTINATIONS (54 CITIES & DESTINATIONS)
// -------------------------------------------------------------
const maharashtraCities = [
  ['Mumbai', 'India', 'Asia', 65, 18.9220, 72.8347, ['Gateway of India', 'Bollywood', 'Coast'], 'Commercial capital with colonial Victorian architecture, Bollywood glamour, and seaside promenades.'],
  ['Pune', 'India', 'Asia', 45, 18.5204, 73.8567, ['Shaniwar Wada', 'Youth', 'Maratha'], 'Cultural capital of Maharashtra with Shaniwar Wada, Aga Khan Palace, and lively student cafe culture.'],
  ['Nashik', 'India', 'Asia', 40, 19.9975, 73.7898, ['Vineyards', 'Wine', 'Godavari'], 'Wine Capital of India on the holy Godavari River with Sula Vineyards and Trimbakeshwar temple.'],
  ['Mahabaleshwar', 'India', 'Asia', 45, 17.9237, 73.6586, ['Strawberries', 'Valley', 'Viewpoints'], 'Lush Western Ghats hill retreat famed for strawberry farms, Venna Lake, and dramatic cliff drops.'],
  ['Panchgani', 'India', 'Asia', 42, 17.9244, 73.8016, ['Table Land', 'Boarding Schools', 'Hills'], 'Serene hill station famed for the volcanic Table Land plateau and strawberry orchards.'],
  ['Lonavala', 'India', 'Asia', 40, 18.7557, 73.4091, ['Chikki', 'Bhushi Dam', 'Waterfalls'], 'Monsoon weekend mountain getaway famous for Karla Caves, Tiger Point, and hot chikki sweets.'],
  ['Khandala', 'India', 'Asia', 40, 18.7619, 73.3762, ['Dukes Nose', 'Ghats', 'Waterfalls'], 'Western Ghats pass famous for mist-covered hiking trails and Dukes Nose cliff.'],
  ['Alibaug', 'India', 'Asia', 45, 18.6414, 72.8722, ['Kolaba Fort', 'Beaches', 'Seafood'], 'Coastal coastal haven with 17th-century island fort Kolaba and fresh Konkani surmai thali.'],
  ['Matheran', 'India', 'Asia', 38, 18.9866, 73.2680, ['Automobile Free', 'Toy Train', 'Red Soil'], "Asia's only automobile-free hill station with red soil trails and Charlotte Lake."],
  ['Shirdi', 'India', 'Asia', 35, 19.7667, 74.4764, ['Sai Baba', 'Spiritual', 'Temple'], 'World-renowned pilgrimage town and samadhi shrine of the venerated saint Sai Baba.'],
  ['Chhatrapati Sambhajinagar (Aurangabad)', 'India', 'Asia', 42, 19.8762, 75.3433, ['Bibi Ka Maqbara', 'Daulatabad', 'History'], 'Historic Mughal-Deccan city housing the Taj of the Deccan (Bibi Ka Maqbara) and Daulatabad Fort.'],
  ['Ajanta Caves', 'India', 'Asia', 40, 20.5519, 75.7033, ['UNESCO', 'Buddhist Frescoes', 'Ancient Art'], 'UNESCO horse-shoe cliff caves holding 2,000-year-old Buddhist murals and rock-cut shrines.'],
  ['Ellora Caves', 'India', 'Asia', 40, 20.0268, 75.1792, ['Kailasa Temple', 'UNESCO', 'Monolithic'], 'UNESCO world wonder featuring the monolithic multi-story Kailasa Temple carved from a single cliff.'],
  ['Kolhapur', 'India', 'Asia', 35, 16.7050, 74.2433, ['Mahalakshmi', 'Chappals', 'Tambda Pandhra Rassa'], 'Historic Maratha kingdom famed for the 7th-century Mahalakshmi Temple, wrestling, and spicy mutton rassa.'],
  ['Nagpur', 'India', 'Asia', 40, 21.1458, 79.0882, ['Oranges', 'Zero Mile', 'Tiger Gateway'], 'Orange City of India, Zero Mile stone, and central gateway to major tiger safari national parks.'],
  ['Solapur', 'India', 'Asia', 35, 17.6599, 75.9064, ['Siddheshwar', 'Textiles', 'Chadar'], 'Historic southern Maharashtra city famed for Siddheshwar lake temple and handloom jacquard chadar.'],
  ['Amravati', 'India', 'Asia', 35, 20.9320, 77.7523, ['Ambadevi', 'Vidarbha', 'Culture'], 'Cultural heart of Vidarbha featuring the historic Ambadevi temple and Chikhaldara foothills.'],
  ['Chikhaldara', 'India', 'Asia', 38, 21.4037, 77.3533, ['Melghat', 'Coffee', 'Hill Station'], 'Only hill station and coffee-growing region in Vidarbha, guarding the Melghat Tiger Reserve.'],
  ['Ratnagiri', 'India', 'Asia', 40, 16.9902, 73.3120, ['Alphonso Mango', 'Thiba Palace', 'Coast'], 'Coastal home of the world-famous Alphonso King of Mangoes and King Thibaw of Burmas palace.'],
  ['Ganpatipule', 'India', 'Asia', 40, 17.1472, 73.2678, ['Swayambhu Ganpati', 'White Beach', 'Coast'], 'Holy seaside temple village where a 400-year-old Ganpati shrine sits right on the Arabian Sea beach.'],
  ['Malvan & Tarkarli', 'India', 'Asia', 45, 16.0333, 73.4833, ['Scuba Diving', 'Sindhudurg', 'Seafood'], 'Konkan watersports paradise featuring coral scuba diving, dolphin safaris, and Sindhudurg fort.'],
  ['Sindhudurg', 'India', 'Asia', 42, 16.0392, 73.4658, ['Sea Fortress', 'Shivaji Maharaj', 'History'], 'Spectacular island fortress built by Chhatrapati Shivaji Maharaj in 1664 amid Arabian Sea waves.'],
  ['Vengurla', 'India', 'Asia', 38, 15.8611, 73.6339, ['Cashew', 'Mochemad', 'Dutch Factory'], 'Quiet southern Konkan coastal town with untouched golden beaches and heritage cashew groves.'],
  ['Dapoli', 'India', 'Asia', 38, 17.7617, 73.1842, ['Mini Mahabaleshwar', 'Dolphins', 'Coast'], 'Mini Mahabaleshwar of Konkan with Murud beach watersports and playful Arabian sea dolphins.'],
  ['Murud-Janjira', 'India', 'Asia', 42, 18.3007, 72.9644, ['Impregnable Sea Fort', 'Janjira', 'Islands'], 'Undefeated marine fortress built by the Siddis in the Arabian Sea with 500-year-old cannons.'],
  ['Harihareshwar', 'India', 'Asia', 36, 17.9947, 73.0232, ['Dakshin Kashi', 'Pradakshina', 'Beach'], 'Dakshin Kashi temple town surrounded by four holy hills and rocky sea pradakshina path.'],
  ['Shrivardhan', 'India', 'Asia', 36, 18.0463, 73.0180, ['Peshwa Heritage', 'Black Sand', 'Betel Nut'], 'Birthplace of the legendary Maratha Peshwas with tranquil black sand beaches and betel orchards.'],
  ['Diveagar', 'India', 'Asia', 38, 18.1725, 72.9936, ['Suvarna Ganesh', 'Quiet Beach', 'Water Sports'], 'Picturesque Konkan beach hamlet famous for white sands, clean waters, and water scooters.'],
  ['Kashid', 'India', 'Asia', 42, 18.4350, 72.9056, ['White Sand Beach', 'Surfing', 'Coast'], 'Popular white sand beach destination between Alibaug and Murud backed by casuarina trees.'],
  ['Satara', 'India', 'Asia', 38, 17.6805, 73.9984, ['Kaas Plateau', 'Ajinkyatara', 'History'], 'Historic Maratha capital nestled below Ajinkyatara Fort and gateway to the Kaas Flower Plateau.'],
  ['Kaas Plateau', 'India', 'Asia', 45, 17.7214, 73.8186, ['UNESCO Valley of Flowers', 'Endemic Flora', 'Wildflowers'], 'UNESCO World Natural Heritage plateau blooming with millions of endemic wildflowers in monsoon.'],
  ['Karad', 'India', 'Asia', 35, 17.2885, 74.1831, ['Preeti Sangam', 'Krishna Koyna', 'Heritage'], 'Historic town famous for the sacred Preeti Sangam confluence of Krishna and Koyna rivers.'],
  ['Sangli', 'India', 'Asia', 35, 16.8524, 74.5815, ['Turmeric City', 'Chandoli', 'Ganesh Temple'], 'Turmeric City of Maharashtra on Krishna river with Chandoli National Park and sugarcane fields.'],
  ['Nanded', 'India', 'Asia', 36, 19.1383, 77.3210, ['Hazur Sahib', 'Godavari', 'Sikh Takht'], 'Sacred Sikh destination housing Takht Sachkhand Sri Hazur Abchalnagar Sahib on Godavari river.'],
  ['Trimbakeshwar', 'India', 'Asia', 38, 19.9325, 73.5306, ['Jyotirlinga', 'Brahmagiri', 'Godavari Origin'], 'Sacred 12-Jyotirlinga temple town at the foot of Brahmagiri Mountain, origin of River Godavari.'],
  ['Bhimashankar', 'India', 'Asia', 40, 19.0722, 73.5358, ['Jyotirlinga', 'Giant Squirrel', 'Western Ghats'], 'Holy Jyotirlinga shrine in dense Sahyadri rainforests, sanctuary of the Indian Giant Squirrel.'],
  ['Grishneshwar', 'India', 'Asia', 35, 20.0239, 75.1706, ['12th Jyotirlinga', 'Red Stone', 'Ellora'], 'Ancient red stone temple housing the twelfth and final Jyotirlinga of Lord Shiva near Ellora.'],
  ['Parli Vaijnath', 'India', 'Asia', 32, 18.8475, 76.5381, ['Jyotirlinga', 'Beed', 'Pilgrimage'], 'One of the five revered Jyotirlingas of Maharashtra located in the Beed district.'],
  ['Aundha Nagnath', 'India', 'Asia', 32, 19.5367, 77.0417, ['First Jyotirlinga', 'Hingoli', 'Hemadpanthi'], 'Ancient 8th-century Hemadpanthi temple considered the eighth Jyotirlinga of Lord Shiva.'],
  ['Bhandardara', 'India', 'Asia', 42, 19.5333, 73.7667, ['Arthur Lake', 'Wilson Dam', 'Fireflies'], 'Pristine mountain resort on Arthur Lake famed for the annual pre-monsoon Fireflies Festival.'],
  ['Igatpuri', 'India', 'Asia', 40, 19.6975, 73.5583, ['Vipassana', 'Waterfalls', 'Western Ghats'], 'Mist-draped hill station famous for the global Vipassana Meditation Academy and Bhatsa valley.'],
  ['Kalsubai', 'India', 'Asia', 40, 19.6014, 73.7119, ['Everest of Maharashtra', 'Trek', 'Highest Peak'], 'Highest peak in Maharashtra (1,646 meters) with challenging iron ladder mountain treks.'],
  ['Lavasa', 'India', 'Asia', 55, 18.4093, 73.5074, ['Italian Architecture', 'Lake City', 'Promenade'], 'Planned Italian-style hill city set around the blue waters of Warasgaon Lake.'],
  ['Panvel & Karnala', 'India', 'Asia', 40, 18.9894, 73.1175, ['Bird Sanctuary', 'Karnala Fort', 'Trek'], 'Forest gateway to Konkan with Karnala Bird Sanctuary and thumb-shaped volcanic fort peak.'],
  ['Raigad', 'India', 'Asia', 40, 18.2346, 73.4428, ['Capital Fort', 'Shivaji Maharaj', 'Ropeway'], 'The Gibraltar of the East, royal capital fortress where Chhatrapati Shivaji Maharaj was crowned.'],
  ['Pratapgad', 'India', 'Asia', 40, 17.9300, 73.5800, ['Battle of Pratapgad', 'Afzal Khan', 'Mahabaleshwar'], 'Historic mountain fort 24 km from Mahabaleshwar where Shivaji Maharaj defeated Afzal Khan.'],
  ['Shivneri', 'India', 'Asia', 38, 19.1969, 73.8631, ['Birthplace of Shivaji', 'Junnar', 'Caves'], 'Sacred triangular hill fortress near Junnar where Chhatrapati Shivaji Maharaj was born in 1630.'],
  ['Sinhagad', 'India', 'Asia', 38, 18.3663, 73.7558, ['Lion Fort', 'Tanaji Malusare', 'Pithla Bhakri'], 'The Lion Fort perched 1,312 meters above Pune, legendary for Tanaji Malusares sacrifice.'],
  ['Tadoba-Andhari National Park', 'India', 'Asia', 70, 20.2520, 79.3134, ['Tiger Reserve', 'Chandrapur', 'Safari'], 'Oldest and largest national park in Maharashtra with one of Indias highest wild tiger densities.'],
  ['Pench (Maharashtra)', 'India', 'Asia', 65, 21.6425, 79.2272, ['Mowgli Land', 'Tiger Safari', 'Teak Forest'], 'The Maharashtra side of the real Jungle Book teak forests along the Pench River.'],
  ['Lonar Crater', 'India', 'Asia', 40, 19.9756, 76.5072, ['Meteorite Crater', 'Saline Lake', 'Geo Heritage'], 'World-famous 50,000-year-old hypervelocity meteorite impact crater lake with dual saline-alkaline water.'],
  ['Jalgaon', 'India', 'Asia', 35, 21.0077, 75.5626, ['Banana City', 'Gold', 'Gateway to Ajanta'], 'The Banana Capital of India and gold jewellery trading hub, closest city to Ajanta Caves.'],
  ['Dhule', 'India', 'Asia', 35, 20.9042, 74.7749, ['Khandesh', 'Laling Fort', 'History'], 'Historic junction city of Khandesh with ancient hilltop Laling Fort and Bhamer caves.'],
  ['Wardha & Sevagram', 'India', 'Asia', 35, 20.7453, 78.6022, ['Mahatma Gandhi', 'Sevagram Ashram', 'Vinoba Bhave'], 'Historic epicenter of the Indian freedom movement where Mahatma Gandhi established Sevagram Ashram.']
];

// -------------------------------------------------------------
// 2. INDIA (OTHER 100+ CITIES ACROSS ALL REGIONS)
// -------------------------------------------------------------
const otherIndianCities = [
  // North
  ['Delhi', 'India', 'Asia', 50, 28.6139, 77.2090, ['History', 'Food', 'Culture'], "India's capital blending Mughal forts, colonial boulevards, and street food."],
  ['Agra', 'India', 'Asia', 45, 27.1767, 78.0081, ['Taj Mahal', 'Mughal', 'History'], 'Home to the magnificent Taj Mahal and grand Mughal red stone fortresses.'],
  ['Jaipur', 'India', 'Asia', 45, 26.9124, 75.7873, ['Pink City', 'Forts', 'Palaces'], 'The Pink City of Rajasthan, famous for Hawa Mahal, Amber Fort, and bazaars.'],
  ['Udaipur', 'India', 'Asia', 55, 24.5854, 73.7125, ['Lakes', 'Palaces', 'Romance'], 'The Venice of the East, famed for shimmering Lake Pichola and white marble palaces.'],
  ['Jodhpur', 'India', 'Asia', 40, 26.2389, 73.0243, ['Blue City', 'Mehrangarh', 'Forts'], 'The Blue City of Rajasthan dominated by the cliff-top Mehrangarh Fort.'],
  ['Jaisalmer', 'India', 'Asia', 45, 26.9157, 70.9083, ['Golden City', 'Desert', 'Dunes'], 'The Golden City rising from the Thar Desert with living sandcastle fortresses.'],
  ['Varanasi', 'India', 'Asia', 35, 25.3176, 82.9739, ['Spiritual', 'Ghats', 'Ganga'], "One of the world's oldest continually inhabited cities on the holy River Ganga."],
  ['Ayodhya', 'India', 'Asia', 35, 26.7922, 82.1998, ['Spiritual', 'Ram Mandir', 'Heritage'], 'Sacred birthplace of Lord Rama on the banks of holy Sarayu River.'],
  ['Mathura', 'India', 'Asia', 30, 27.4924, 77.6737, ['Krishna', 'Temples', 'Culture'], 'Holy birthplace of Lord Krishna with ancient Yamuna ghats and peda sweets.'],
  ['Vrindavan', 'India', 'Asia', 30, 27.5706, 77.6599, ['Bhakti', 'Temples', 'Holi'], 'Spiritual center of Krishna devotion, Bankey Bihari and Prem Mandir.'],
  ['Prayagraj (Allahabad)', 'India', 'Asia', 35, 25.4358, 81.8463, ['Sangam', 'Kumbh', 'History'], 'Sacred Triveni Sangam confluence of Ganga, Yamuna and Saraswati.'],
  ['Lucknow', 'India', 'Asia', 40, 26.8467, 80.9462, ['Nawabi', 'Kebabs', 'Chikankari'], 'City of Nawabs, celebrated for Bara Imambara and Galouti kebabs.'],
  ['Kanpur', 'India', 'Asia', 35, 26.4499, 80.3319, ['Leather', 'Ganga', 'History'], 'Industrial heritage city on the Ganga with Bithoor and Allen Forest.'],
  ['Rishikesh', 'India', 'Asia', 35, 30.0869, 78.2676, ['Yoga', 'Rafting', 'Ganga'], 'The Yoga Capital of the World where the turquoise Ganga emerges from Himalayas.'],
  ['Haridwar', 'India', 'Asia', 30, 29.9457, 78.1642, ['Ganga Aarti', 'Pilgrimage', 'Spiritual'], 'Gateway to Gods where Ganga enters the plains with Har Ki Pauri aarti.'],
  ['Dehradun', 'India', 'Asia', 40, 30.3165, 78.0322, ['Valley', 'Forest', 'Institutes'], 'Charming capital of Uttarakhand nestled between Ganga and Yamuna.'],
  ['Mussoorie', 'India', 'Asia', 42, 30.4598, 78.0644, ['Hill Station', 'Himalayas', 'Waterfalls'], 'Queen of the Hills overlooking the Doon Valley and snow peaks.'],
  ['Nainital', 'India', 'Asia', 40, 29.3919, 79.4542, ['Lakes', 'Boating', 'Hills'], 'Emerald eye-shaped lake surrounded by seven forested mountain peaks.'],
  ['Almora & Ranikhet', 'India', 'Asia', 38, 29.5971, 79.6591, ['Pine', 'Views', 'Heritage'], 'Quiet Kumaon Himalayan ridges with panoramic views of Trishul & Nanda Devi.'],
  ['Auli', 'India', 'Asia', 55, 30.5298, 79.5694, ['Ski Resort', 'Nanda Devi', 'Snow'], 'Himalayan ski meadow with 360-degree views of peak Nanda Devi.'],
  ['Badrinath & Kedarnath', 'India', 'Asia', 50, 30.7443, 79.4938, ['Char Dham', 'Shiva', 'High Himalayas'], 'Sacred Himalayan shrines of Char Dham set against snow-covered massifs.'],
  ['Shimla', 'India', 'Asia', 42, 31.1048, 77.1734, ['Colonial', 'Toy Train', 'Mall Road'], 'British summer capital with heritage toy train and pine ridge views.'],
  ['Manali', 'India', 'Asia', 40, 32.2432, 77.1892, ['Snow', 'Adventure', 'Solang'], 'Himalayan resort town surrounded by cedar forests, snow peaks, and Beas river.'],
  ['Dharamshala', 'India', 'Asia', 38, 32.2190, 76.3234, ['Dalai Lama', 'Tibet', 'Monasteries'], 'Home of the Tibetan government-in-exile overlooking Kangra Valley.'],
  ['McLeodGanj', 'India', 'Asia', 35, 32.2426, 76.3213, ['Cafes', 'Trekking', 'Culture'], 'Little Lhasa in India with vibrant cafes, momos, and Triund trek.'],
  ['Dalhousie', 'India', 'Asia', 38, 32.5387, 75.9710, ['Colonial', 'Khajjiar', 'Pines'], 'Colonial hill town and mini Switzerland of India at Khajjiar meadow.'],
  ['Kasol', 'India', 'Asia', 32, 32.0100, 77.3150, ['Parvati Valley', 'Backpacking', 'Nature'], 'Backpacker haven along Parvati River with trails to Tosh and Kheerganga.'],
  ['Spiti Valley (Kaza)', 'India', 'Asia', 55, 32.2276, 78.0710, ['Cold Desert', 'Monasteries', 'Stargazing'], 'High altitude cold desert with ancient Key Monastery and Pin Valley.'],
  ['Leh-Ladakh', 'India', 'Asia', 60, 34.1526, 77.5771, ['Pangong', 'Passes', 'Buddhism'], 'Land of High Passes — barren lunar peaks, Buddhist gompas, and alpine lakes.'],
  ['Srinagar', 'India', 'Asia', 50, 34.0837, 74.7973, ['Dal Lake', 'Houseboats', 'Gardens'], 'Paradise on Earth with Dal Lake shikaras and Mughal terraced gardens.'],
  ['Gulmarg', 'India', 'Asia', 65, 34.0484, 74.3805, ['Skiing', 'Gondola', 'Snow'], 'Premier ski destination with worlds second-highest operating cable car.'],
  ['Pahalgam', 'India', 'Asia', 50, 34.0163, 75.3150, ['Betaab Valley', 'Lidder River', 'Meadows'], 'Valley of Shepherds surrounded by alpine meadows and pine forests.'],
  ['Sonamarg', 'India', 'Asia', 50, 34.3000, 75.2900, ['Meadow of Gold', 'Glaciers', 'Trek'], 'Meadow of Gold and gateway to Thajiwas glacier and Ladakh.'],
  ['Amritsar', 'India', 'Asia', 35, 31.6340, 74.8723, ['Golden Temple', 'Food', 'Wagah Border'], 'Spiritual heart of Sikhism with the Golden Temple and langar.'],
  ['Chandigarh', 'India', 'Asia', 45, 30.7333, 76.7794, ['Le Corbusier', 'Rock Garden', 'Clean'], 'Planned city designed by Le Corbusier with famous Rock Garden.'],
  ['Patiala', 'India', 'Asia', 38, 30.3398, 76.3869, ['Qila Mubarak', 'Royal', 'Food'], 'Royal Punjabi city famous for Sheesh Mahal, juttis, and rich cuisine.'],
  ['Bikaner', 'India', 'Asia', 40, 28.0229, 73.3119, ['Junagarh', 'Sweets', 'Camel'], 'Desert kingdom with impregnable Junagarh Fort and famous bhujia.'],
  ['Pushkar', 'India', 'Asia', 35, 26.4897, 74.5511, ['Brahma Temple', 'Camel Fair', 'Lake'], 'Sacred desert lake town hosting the world-famous annual Camel Fair.'],
  ['Chittorgarh', 'India', 'Asia', 35, 24.8887, 74.6269, ['Rani Padmini', 'Victory Tower', 'History'], 'Indias largest fort complex symbol of Rajput valor and sacrifice.'],
  ['Mount Abu', 'India', 'Asia', 42, 24.5926, 72.7156, ['Dilwara Temples', 'Nakki Lake', 'Hill Station'], 'Only hill station in Rajasthan with world-renowned white marble Dilwara temples.'],
  ['Ranthambore (Sawai Madhopur)', 'India', 'Asia', 65, 26.0173, 76.5026, ['Royal Bengal Tiger', 'Fort', 'Safari'], 'Famous tiger reserve where wild tigers roam amid ancient banyan trees and fort ruins.'],

  // Gujarat & Goa
  ['Goa', 'India', 'Asia', 45, 15.2993, 74.1240, ['Beaches', 'Nightlife', 'Seafood'], 'Beaches, Portuguese churches, water sports, and sunset shacks.'],
  ['Ahmedabad', 'India', 'Asia', 40, 23.0225, 72.5714, ['UNESCO City', 'Gandhi Ashram', 'Food'], 'First UNESCO heritage city of India with Sabarmati Ashram.'],
  ['Rann of Kutch (Bhuj)', 'India', 'Asia', 65, 23.2420, 69.6669, ['White Desert', 'Salt', 'Rann Utsav'], 'Infinite white salt desert glowing under the desert full moon.'],
  ['Surat', 'India', 'Asia', 40, 21.1702, 72.8311, ['Diamonds', 'Textiles', 'Street Food'], 'Diamond polishing global hub renowned for Locho street food.'],
  ['Vadodara', 'India', 'Asia', 38, 22.3072, 73.1812, ['Laxmi Vilas', 'Garba', 'Palaces'], 'Cultural capital of Gujarat home to grand Laxmi Vilas Palace.'],
  ['Somnath & Dwarka', 'India', 'Asia', 35, 20.8880, 70.4012, ['Jyotirlinga', 'Krishna', 'Arabian Sea'], 'First Jyotirlinga shrine on the Arabian Sea and Lord Krishnas golden kingdom.'],
  ['Gir National Park', 'India', 'Asia', 60, 21.1241, 70.7947, ['Asiatic Lions', 'Safari', 'Wildlife'], 'Sole sanctuary of the Asiatic Lions in their natural dry deciduous forests.'],
  ['Daman & Diu', 'India', 'Asia', 40, 20.4283, 72.8397, ['Portuguese Forts', 'Beaches', 'Coast'], 'Coastal union territory with Portuguese fortresses and sea cliffs.'],

  // South India
  ['Bengaluru', 'India', 'Asia', 55, 12.9716, 77.5946, ['Silicon Valley', 'Breweries', 'Gardens'], 'Silicon Valley of India with lush Cubbon Park and craft beer scene.'],
  ['Mysuru', 'India', 'Asia', 40, 12.2958, 76.6394, ['Palace', 'Silk', 'Sandalwood'], 'Heritage city of illuminated royal palaces and Mysore Pak confection.'],
  ['Hampi', 'India', 'Asia', 35, 15.3350, 76.4600, ['Vijayanagara', 'Boulders', 'UNESCO'], 'UNESCO boulder city of ruined Vijayanagara temples and Tungabhadra river.'],
  ['Gokarna', 'India', 'Asia', 35, 14.5479, 74.3188, ['Om Beach', 'Trekking', 'Temples'], 'Laid-back beach haven with Om Beach and coastal cliff treks.'],
  ['Coorg', 'India', 'Asia', 45, 12.4244, 75.7382, ['Coffee', 'Waterfalls', 'Mountains'], 'Scotland of India with coffee plantations and misty waterfalls.'],
  ['Chikmagalur', 'India', 'Asia', 42, 13.3161, 75.7720, ['Coffee', 'Mullayanagiri', 'Trek'], 'Birthplace of Indian coffee below Karnatakas highest peaks.'],
  ['Dandeli', 'India', 'Asia', 42, 15.2361, 74.6173, ['Rafting', 'Kali River', 'Jungle'], 'Adventure and jungle rafting hub on the wild Kali River.'],
  ['Badami & Pattadakal', 'India', 'Asia', 38, 15.9189, 75.6775, ['Chalukya', 'Rock Cut', 'UNESCO'], 'Chalukyan red sandstone cave temples and UNESCO Pattadakal monuments.'],
  ['Mangalore & Udupi', 'India', 'Asia', 40, 12.9141, 74.8560, ['Krishna Temple', 'Ghee Roast', 'Beaches'], 'Coastal temple culinary hubs famous for Neer Dosa and Chicken Ghee Roast.'],
  ['Murudeshwar', 'India', 'Asia', 38, 14.0940, 74.4899, ['Shiva Statue', 'Coast', 'Netrani Scuba'], 'Worlds second tallest Shiva statue rising beside the Arabian Sea.'],
  ['Belur & Halebidu', 'India', 'Asia', 38, 13.1622, 75.8596, ['Hoysala', 'UNESCO', 'Stone Art'], 'UNESCO 12th-century Hoysala soapstone temples with intricate star plans.'],
  ['Kabini & Nagarhole', 'India', 'Asia', 70, 11.9542, 76.2878, ['Black Panther', 'Elephants', 'Safari'], 'Famous jungle river haven home to leopards, elephants, and black panthers.'],
  ['Kochi', 'India', 'Asia', 45, 9.9312, 76.2673, ['Chinese Nets', 'Spice', 'Fort Kochi'], 'Colonial spice port with Chinese fishing nets and art biennale.'],
  ['Munnar', 'India', 'Asia', 40, 10.0889, 77.0595, ['Tea Estates', 'Mist', 'Western Ghats'], 'Rolling tea plantations and misty Western Ghats viewpoints.'],
  ['Alleppey', 'India', 'Asia', 55, 9.4981, 76.3388, ['Houseboats', 'Backwaters', 'Canals'], 'Venice of the East with traditional Kettuvallam backwater houseboats.'],
  ['Varkala', 'India', 'Asia', 35, 8.7379, 76.7163, ['Cliffs', 'Beach', 'Ayurveda'], 'Dramatic red laterite cliffs towering above the Arabian Sea surf.'],
  ['Wayanad', 'India', 'Asia', 45, 11.6854, 76.1320, ['Caves', 'Spices', 'Treehouses'], 'Misty hills with prehistoric Edakkal caves and bamboo groves.'],
  ['Thekkady (Periyar)', 'India', 'Asia', 42, 9.6031, 77.1615, ['Elephants', 'Spice Gardens', 'Tiger Reserve'], 'Periyar lake wildlife boat safaris and fragrant spice tours.'],
  ['Kovalam', 'India', 'Asia', 42, 8.4004, 76.9787, ['Lighthouse Beach', 'Surf', 'Coast'], 'Crescent beach overlooked by a striped red-and-white lighthouse.'],
  ['Thiruvananthapuram', 'India', 'Asia', 40, 8.5241, 76.9366, ['Padmanabhaswamy', 'Heritage', 'Coast'], 'Royal capital with golden Padmanabhaswamy Temple treasure.'],
  ['Bekal', 'India', 'Asia', 45, 12.3924, 75.0336, ['Keyhole Fort', 'Beach', 'Coast'], 'Massive coastal keyhole-shaped fort overlooking the Arabian Sea.'],
  ['Kannur & Kozhikode', 'India', 'Asia', 40, 11.8745, 75.3704, ['Theyyam', 'Biryani', 'Coast'], 'Land of ritual Theyyam dances and Malabar culinary heritage.'],
  ['Chennai', 'India', 'Asia', 45, 13.0827, 80.2707, ['Marina Beach', 'Temples', 'Carnatic'], 'Cultural gateway of South India with Marina Beach and Mylapore.'],
  ['Mahabalipuram', 'India', 'Asia', 40, 12.6269, 80.1927, ['Shore Temple', 'UNESCO', 'Stone Carving'], 'UNESCO 7th-century rock cut chariot temples by the Bay of Bengal.'],
  ['Pondicherry', 'India', 'Asia', 40, 11.9416, 79.8083, ['White Town', 'French Cafes', 'Auroville'], 'French colonial seaside promenade with vibrant pastel quarters.'],
  ['Madurai', 'India', 'Asia', 35, 9.9252, 78.1198, ['Meenakshi Temple', 'Ancient', 'Culture'], 'Athens of the East dominated by towering sculpted Meenakshi gopurams.'],
  ['Rameswaram', 'India', 'Asia', 35, 9.2876, 79.3129, ['Pamban', 'Dhanushkodi', 'Ocean'], 'Island pilgrimage connected by Pamban Bridge overlooking Indian Ocean.'],
  ['Kanyakumari', 'India', 'Asia', 38, 8.0883, 77.5385, ['Tip of India', 'Sunrise', 'Vivekananda'], 'Southernmost tip where three seas meet with Vivekananda Rock memorial.'],
  ['Thanjavur (Tanjore)', 'India', 'Asia', 35, 10.7870, 79.1378, ['Brihadisvara', 'Chola', 'Paintings'], 'Great Living Chola temple with 1,000-year-old towering granite vimana.'],
  ['Ooty', 'India', 'Asia', 40, 11.4102, 76.6950, ['Nilgiris', 'Toy Train', 'Botanical'], 'Queen of Hill Stations with Nilgiri mountain railway and tea estates.'],
  ['Kodaikanal', 'India', 'Asia', 40, 10.2381, 77.4892, ['Kodai Lake', 'Pillars', 'Pine'], 'Princess of Hill Stations with star-shaped lake and pine forests.'],
  ['Coimbatore', 'India', 'Asia', 40, 11.0168, 76.9558, ['Adiyogi', 'Textiles', 'Western Ghats'], 'Manchester of South India housing the giant 112-foot Adiyogi Shiva bust.'],
  ['Tiruchirappalli (Trichy)', 'India', 'Asia', 36, 10.7905, 78.7047, ['Rockfort', 'Ranganathaswamy', 'Heritage'], 'Famous for the massive Srirangam temple complex and Rockfort temple.'],
  ['Yercaud', 'India', 'Asia', 38, 11.7753, 78.2093, ['Jewel of South', 'Orange Groves', 'Coffee'], 'Quiet hill station in Shevaroy Hills famous for coffee estates and lakes.'],
  ['Hyderabad', 'India', 'Asia', 45, 17.3850, 78.4867, ['Charminar', 'Biryani', 'Nizam'], 'City of Pearls and Nizams famed for Charminar and dum biryani.'],
  ['Warangal', 'India', 'Asia', 35, 17.9689, 79.5941, ['Kakatiya', 'Thousand Pillar', 'Ramappa'], 'Kakatiya dynasty capital with UNESCO Ramappa Temple and stone gateways.'],
  ['Visakhapatnam', 'India', 'Asia', 40, 17.6868, 83.2185, ['Submarine', 'Rishikonda', 'Coast'], 'Port city with submarine museum and scenic Araku coffee valley.'],
  ['Araku Valley', 'India', 'Asia', 38, 18.3273, 82.8775, ['Coffee', 'Borra Caves', 'Tribal'], 'Eastern Ghats valley famous for organic coffee and prehistoric Borra caves.'],
  ['Tirupati', 'India', 'Asia', 35, 13.6288, 79.4192, ['Tirumala', 'Venkateswara', 'Pilgrimage'], 'Worlds most visited temple town atop the sacred Seven Hills.'],
  ['Vijayawada', 'India', 'Asia', 36, 16.5062, 80.6480, ['Kanaka Durga', 'Krishna River', 'Caves'], 'Sacred city on the Krishna River famous for Kanaka Durga temple.'],

  // East & Central India
  ['Kolkata', 'India', 'Asia', 40, 22.5726, 88.3639, ['Victoria Memorial', 'Trams', 'Culture'], 'City of Joy with Howrah Bridge, colonial architecture and sweets.'],
  ['Darjeeling', 'India', 'Asia', 40, 27.0410, 88.2663, ['Tea', 'Kanchenjunga', 'Toy Train'], 'Champagne of Teas, Kanchenjunga sunrise from Tiger Hill.'],
  ['Kalimpong', 'India', 'Asia', 38, 27.0594, 88.4695, ['Orchids', 'Monasteries', 'Views'], 'Subtropical hill station overlooking the Teesta river valley.'],
  ['Sundarbans', 'India', 'Asia', 55, 21.9497, 89.1833, ['Mangroves', 'Royal Bengal Tiger', 'UNESCO'], 'Worlds largest mangrove delta forest and habitat of swimming tigers.'],
  ['Digha & Mandarmani', 'India', 'Asia', 35, 21.6266, 87.5074, ['Beaches', 'Seafood', 'Casuarina'], 'Popular seaside resort of West Bengal on the Bay of Bengal.'],
  ['Gangtok', 'India', 'Asia', 45, 27.3389, 88.6065, ['Sikkim', 'Tsomgo', 'Rumtek'], 'Capital of Sikkim with prayer flags, momos, and alpine lakes.'],
  ['Pelling', 'India', 'Asia', 42, 27.3188, 88.2433, ['Skywalk', 'Monasteries', 'Kanchenjunga'], 'Mountain town with glass skywalk and close-up views of Mount Kanchenjunga.'],
  ['Lachung & Yumthang Valley', 'India', 'Asia', 50, 27.6891, 88.7430, ['Valley of Flowers', 'Hot Springs', 'Snow'], 'Valley of Flowers of Sikkim with rhododendrons and hot sulphur springs.'],
  ['Shillong', 'India', 'Asia', 40, 25.5788, 91.8933, ['Scotland of East', 'Waterfalls', 'Rock'], 'Scotland of the East with pine breezes and rock music culture.'],
  ['Cherrapunji (Sohra)', 'India', 'Asia', 40, 25.2986, 91.7323, ['Living Root Bridge', 'Rain', 'Falls'], 'Wettest place on earth with double decker living root bridges.'],
  ['Dawki', 'India', 'Asia', 38, 25.1837, 92.0197, ['Umngot River', 'Crystal Waters', 'Boating'], 'Famed for crystal transparent Umngot River where boats look like they fly.'],
  ['Guwahati', 'India', 'Asia', 40, 26.1445, 91.7362, ['Kamakhya', 'Brahmaputra', 'River Island'], 'Gateway to the Northeast on the majestic Brahmaputra River.'],
  ['Kaziranga', 'India', 'Asia', 55, 26.5775, 93.1711, ['One-Horned Rhino', 'Safari', 'Wildlife'], 'UNESCO national park refuge of the worlds one-horned rhinos.'],
  ['Majuli', 'India', 'Asia', 35, 26.9532, 94.2185, ['River Island', 'Satras', 'Masks'], 'Worlds largest inhabited river island on the Brahmaputra.'],
  ['Tawang', 'India', 'Asia', 50, 27.5861, 91.8594, ['Monastery', 'Sela Pass', 'Arunachal'], 'Snowy Arunachal valley with 400-year-old Buddhist monastery.'],
  ['Ziro Valley', 'India', 'Asia', 42, 27.5450, 93.8196, ['Apatani Tribe', 'Music Fest', 'Paddies'], 'UNESCO cultural landscape famed for the Apatani tribe and annual music festival.'],
  ['Kohima', 'India', 'Asia', 40, 25.6701, 94.1077, ['Hornbill Festival', 'Naga Culture', 'Hills'], 'Land of festivals and the world-famous colorful Hornbill Festival in December.'],
  ['Imphal', 'India', 'Asia', 40, 24.8170, 93.9368, ['Loktak Lake', 'Keibul Lamjao', 'Floating Phumdis'], 'Manipur capital housing the only floating national park in the world on Loktak Lake.'],
  ['Puri', 'India', 'Asia', 35, 19.8135, 85.8312, ['Jagannath', 'Beach', 'Rath Yatra'], 'Sacred coastal city of Lord Jagannaths chariot festival.'],
  ['Bhubaneswar', 'India', 'Asia', 38, 20.2961, 85.8245, ['Temple City', 'Kalinga', 'Caves'], 'Temple City of India with Lingaraj Temple and Udayagiri caves.'],
  ['Konark', 'India', 'Asia', 38, 19.8876, 86.0945, ['Sun Temple', 'Chariot', 'UNESCO'], 'Magnificent 13th-century stone chariot dedicated to the Sun God.'],
  ['Bodh Gaya', 'India', 'Asia', 35, 24.6961, 84.9869, ['Buddha', 'Mahabodhi', 'Enlightenment'], 'Where Gautama Buddha attained enlightenment under the Bodhi tree.'],
  ['Patna & Nalanda', 'India', 'Asia', 35, 25.5941, 85.1376, ['Ancient University', 'Mauryan', 'Ganga'], 'Birthplace of ancient empires and worlds first residential international university.'],
  ['Ranchi & Netarhat', 'India', 'Asia', 35, 23.3441, 85.3096, ['Waterfalls', 'Sunset Point', 'Plateau'], 'City of waterfalls in Jharkhand with Hundru, Dassam falls and Queen of Chotanagpur.'],
  ['Bhopal', 'India', 'Asia', 38, 23.2599, 77.4126, ['Lakes', 'Sanchi', 'Mosques'], 'City of Lakes flanked by UNESCO Sanchi Stupa and Bhimbetka.'],
  ['Indore', 'India', 'Asia', 35, 22.7196, 75.8577, ['Sarafa Bazaar', 'Food', 'Cleanest'], 'Indias cleanest city and night street food haven at Sarafa.'],
  ['Ujjain', 'India', 'Asia', 32, 23.1765, 75.7885, ['Mahakaleshwar', 'Shipra', 'Jyotirlinga'], 'Ancient temple town with Mahakaleshwar Jyotirlinga and Kumbh Mela.'],
  ['Gwalior', 'India', 'Asia', 38, 26.2183, 78.1828, ['Hill Fort', 'Tansen', 'Palace'], 'Hilltop medieval fortress with blue tilework and Jai Vilas Palace.'],
  ['Khajuraho', 'India', 'Asia', 40, 24.8318, 79.9199, ['UNESCO Sculptures', 'Temples', 'Heritage'], 'UNESCO temples famous for intricate medieval nagara stone carvings.'],
  ['Orchha', 'India', 'Asia', 35, 25.3516, 78.6416, ['Chhatris', 'Betwa River', 'Bundela'], 'Frozen-in-time Bundela palace city on the boulder-strewn Betwa River.'],
  ['Jabalpur (Bhedaghat)', 'India', 'Asia', 38, 23.1815, 79.9864, ['Marble Rocks', 'Dhuandhar', 'Narmada'], 'Towering 100-foot white marble canyon carved by the Narmada River.'],
  ['Pachmarhi', 'India', 'Asia', 38, 22.4674, 78.4335, ['Queen of Satpura', 'Waterfalls', 'Caves'], 'Only hill station of Madhya Pradesh surrounded by waterfalls and sal forests.'],
  ['Kanha & Bandhavgarh', 'India', 'Asia', 65, 22.3345, 80.6115, ['Tigers', 'Jungle Book', 'Safari'], 'The real Jungle Book sal forests boasting the highest tiger densities.'],
  ['Raipur & Bastar', 'India', 'Asia', 38, 21.2514, 81.6296, ['Chitrakote Falls', 'Tribal Art', 'Caves'], 'Home to Chitrakote Falls, the Niagara of India, and bell-metal dokra craft.']
];

// Combine all India destinations
const totalIndianCities = [...maharashtraCities, ...otherIndianCities];

// -------------------------------------------------------------
// 3. GLOBAL DESTINATIONS (189 CITIES ACROSS ALL CONTINENTS)
// -------------------------------------------------------------
// Load the existing global cities from earlier script or run_all
const prevDatasetPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'citiesData.json');
let globalCities = [];
if (fs.existsSync(prevDatasetPath)) {
  try {
    const rawPrev = JSON.parse(fs.readFileSync(prevDatasetPath, 'utf8'));
    // Filter out previous Indian cities so we replace them cleanly
    globalCities = rawPrev.filter(c => c.country !== 'India');
  } catch(e) {}
}

console.log(`Maharashtra cities: ${maharashtraCities.length}`);
console.log(`Other Indian cities: ${otherIndianCities.length}`);
console.log(`Total Indian cities: ${totalIndianCities.length}`);
console.log(`Existing global cities preserved: ${globalCities.length}`);

// Visual photo map for high quality Unsplash travel images
const photoMap = {
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
  snow: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
  city: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
  temple: 'https://images.unsplash.com/photo-1600100397608-f010e421a172?w=600&h=400&fit=crop',
  castle: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&h=400&fit=crop',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
  nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
  fort: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&h=400&fit=crop',
  ghats: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop'
};

// Process Indian Cities into finalized format
const processedIndian = totalIndianCities.map(([name, country, region, avgCost, lat, lng, tags, desc], index) => {
  const citySlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const cityId = `city-in-${String(index + 1).padStart(3, '0')}-${citySlug}`;

  let cityImg = photoMap.city;
  const tagStr = tags.join(' ').toLowerCase();
  if (tagStr.includes('beach') || tagStr.includes('coast') || tagStr.includes('sea')) cityImg = photoMap.beach;
  else if (tagStr.includes('snow') || tagStr.includes('ski')) cityImg = photoMap.snow;
  else if (tagStr.includes('mountain') || tagStr.includes('trek') || tagStr.includes('himalaya') || tagStr.includes('ghats')) cityImg = photoMap.mountain;
  else if (tagStr.includes('temple') || tagStr.includes('spiritual') || tagStr.includes('jyotirlinga') || tagStr.includes('shrine')) cityImg = photoMap.temple;
  else if (tagStr.includes('fort') || tagStr.includes('palace') || tagStr.includes('unesco')) cityImg = photoMap.fort;
  else if (tagStr.includes('nature') || tagStr.includes('lake') || tagStr.includes('falls')) cityImg = photoMap.nature;

  const isMaharashtra = maharashtraCities.some(m => m[0] === name);

  const areas = [
    { id: `area-${citySlug}-1`, name: `${name} Central`, cityId, cityName: name },
    { id: `area-${citySlug}-2`, name: `${name} Heritage Quarter`, cityId, cityName: name },
    { id: `area-${citySlug}-3`, name: `${name} Scenic Viewpoint`, cityId, cityName: name }
  ];

  const destinations = [
    {
      id: `dest-${citySlug}-1`,
      cityId,
      cityName: name,
      areaName: areas[0].name,
      name: `${name} Historic Center`,
      type: 'destination',
      category: tags[0] || 'Sightseeing',
      duration: '2 hours',
      estimatedCost: Math.round(avgCost * 0.1),
      currency: 'USD',
      image: cityImg,
      description: `Primary iconic attraction and historic sightseeing spot in ${name}.`
    },
    {
      id: `dest-${citySlug}-2`,
      cityId,
      cityName: name,
      areaName: areas[1].name,
      name: `${name} Heritage Monument`,
      type: 'destination',
      category: 'History',
      duration: '2.5 hours',
      estimatedCost: Math.round(avgCost * 0.08),
      currency: 'USD',
      image: photoMap.temple,
      description: `Ancient architecture, sacred courtyards, and cultural heritage of ${name}.`
    },
    {
      id: `dest-${citySlug}-3`,
      cityId,
      cityName: name,
      areaName: areas[2].name,
      name: `${name} Nature Panorama`,
      type: 'destination',
      category: 'Nature',
      duration: '2 hours',
      estimatedCost: 0,
      currency: 'USD',
      image: photoMap.nature,
      description: `Scenic viewpoints and relaxed nature park overlooking ${name}.`
    }
  ];

  const activities = [
    {
      id: `act-${citySlug}-1`,
      cityId,
      cityName: name,
      name: `${name} Authentic Culinary Tasting`,
      type: 'activity',
      category: 'Food',
      duration: '2 hours',
      estimatedCost: Math.round(avgCost * 0.2),
      currency: 'USD',
      image: photoMap.food,
      description: `Sample signature regional delicacies and street specialities in ${name}.`
    },
    {
      id: `act-${citySlug}-2`,
      cityId,
      cityName: name,
      name: `${name} Guided Heritage Walk`,
      type: 'activity',
      category: 'Culture',
      duration: '2.5 hours',
      estimatedCost: Math.round(avgCost * 0.15),
      currency: 'USD',
      image: cityImg,
      description: `Experience the living heritage, local bazaars, and folklore of ${name}.`
    }
  ];

  return {
    id: cityId,
    name,
    country: 'India',
    state: isMaharashtra ? 'Maharashtra' : 'India',
    region: 'Asia',
    image: cityImg,
    description: desc,
    avgCostPerDay: avgCost,
    currency: 'USD',
    timezone: 'Asia/Kolkata',
    tags: isMaharashtra ? ['Maharashtra', ...tags] : tags,
    coordinates: { lat, lng },
    areas,
    destinations,
    activities
  };
});

// Final combination: All India (with 54 Maharashtra) + All Global Cities
const combinedAll = [...processedIndian, ...globalCities];

console.log(`Total final cities dataset: ${combinedAll.length}`);

// Write to citiesData.json
fs.writeFileSync(prevDatasetPath, JSON.stringify(combinedAll, null, 2), 'utf8');
console.log(`Dataset successfully written to ${prevDatasetPath}`);
