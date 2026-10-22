-- ============================================================================
-- itinere — Expanded Seed Catalog v2
-- File: supabase/seed/seed_catalog.sql
-- 30 global cities | 100+ activities | Accommodations | Attributed photos
-- ============================================================================

-- ============================================================================
-- CITIES (30 global destinations — India-heavy + major international hubs)
-- ============================================================================
INSERT INTO public.cities (id, name, country, country_code, region, timezone, lat, lng, cost_index, popularity_score, description, source_provider, source_record_id, source_url)
VALUES
-- INDIA — RAJASTHAN
('11111111-1111-4111-8111-111111111101', 'Jaipur', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 26.9124, 75.7873, 2, 94, 'The Pink City of Rajasthan, celebrated for hilltop Rajput forts, royal palaces, astronomical observatories, and vibrant bazaar crafts.', 'curated', 'Q11642', 'https://en.wikipedia.org/wiki/Jaipur'),
('11111111-1111-4111-8111-111111111102', 'Udaipur', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 24.5854, 73.7125, 2, 92, 'Historic City of Lakes surrounded by the Aravalli Hills, featuring marble lake palaces, Mewar heritage temples, and rooftop dining.', 'curated', 'Q171732', 'https://en.wikipedia.org/wiki/Udaipur'),
('11111111-1111-4111-8111-111111111113', 'Jodhpur', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 26.2389, 73.0243, 2, 88, 'The Blue City of Rajasthan dominated by the massive Mehrangarh Fort, with cobalt-painted havelis, spice markets, and desert cuisine.', 'curated', 'Q161097', 'https://en.wikipedia.org/wiki/Jodhpur'),
('11111111-1111-4111-8111-111111111114', 'Jaisalmer', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 26.9157, 70.9083, 2, 86, 'The Golden City rises from the Thar Desert — a living sandstone fortress with ornate havelis, camel safaris, and dune sunsets.', 'curated', 'Q191723', 'https://en.wikipedia.org/wiki/Jaisalmer'),
-- INDIA — GOA & KARNATAKA
('11111111-1111-4111-8111-111111111103', 'Goa (Panaji & North)', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 15.4909, 73.8278, 2, 95, 'Coastal paradise blending Indo-Portuguese heritage quarters in Fontainhas, palm-fringed Arabian Sea beaches, spice plantations, and seafood.', 'curated', 'Q1171', 'https://en.wikipedia.org/wiki/Goa'),
('11111111-1111-4111-8111-111111111115', 'Hampi', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 15.3350, 76.4600, 1, 82, 'UNESCO World Heritage Site — ruins of the Vijayanagara Empire scattered across a surreal boulder-strewn landscape along the Tungabhadra river.', 'curated', 'Q214703', 'https://en.wikipedia.org/wiki/Hampi'),
-- INDIA — KERALA & SOUTH
('11111111-1111-4111-8111-111111111104', 'Kochi & Munnar', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 9.9312, 76.2673, 2, 90, 'Historic spice-trade harbor with Chinese fishing nets, Mattancherry heritage synagogues, backwater canals, and misty Western Ghats tea estates.', 'curated', 'Q1800', 'https://en.wikipedia.org/wiki/Kochi'),
('11111111-1111-4111-8111-111111111116', 'Alleppey (Alappuzha)', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 9.4981, 76.3388, 1, 87, 'Venice of the East — a labyrinth of Kerala backwater canals navigated by rice-barge houseboats, coconut lagoons, and toddy shops.', 'curated', 'Q598459', 'https://en.wikipedia.org/wiki/Alappuzha'),
-- INDIA — NORTH & HIMALAYAS
('11111111-1111-4111-8111-111111111105', 'Manali', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 32.2432, 77.1892, 2, 89, 'High-altitude Himalayan resort town in the Beas River valley, offering cedar forests, alpine passes, hot springs, and mountain adventure.', 'curated', 'Q200019', 'https://en.wikipedia.org/wiki/Manali,_Himachal_Pradesh'),
('11111111-1111-4111-8111-111111111117', 'Rishikesh', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 30.0869, 78.2676, 1, 88, 'Yoga capital of the world on the banks of the Ganges — known for ashrams, white-water rafting on the Ganga, and the Beatles ashram.', 'curated', 'Q628779', 'https://en.wikipedia.org/wiki/Rishikesh'),
('11111111-1111-4111-8111-111111111118', 'Varanasi', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 25.3176, 82.9739, 1, 91, 'One of the world oldest continuously inhabited cities — dawn boat rides past 84 ghats, Ganga Aarti ceremony, and ancient Hindu temples.', 'curated', 'Q200168', 'https://en.wikipedia.org/wiki/Varanasi'),
('11111111-1111-4111-8111-111111111119', 'Agra', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 27.1767, 78.0081, 2, 93, 'Home of the iconic Taj Mahal — Mughal architectural masterpiece paired with Agra Fort and the ghost city of Fatehpur Sikri.', 'curated', 'Q26626', 'https://en.wikipedia.org/wiki/Agra'),
('11111111-1111-4111-8111-111111111120', 'Delhi', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 28.6139, 77.2090, 2, 92, 'Capital megacity where Mughal Old Delhi meets colonial New Delhi — Red Fort, Chandni Chowk, Qutb Minar, and India Gate.', 'curated', 'Q1353', 'https://en.wikipedia.org/wiki/Delhi'),
-- INDIA — NORTHEAST
('11111111-1111-4111-8111-111111111121', 'Darjeeling', 'India', 'IN', 'South Asia', 'Asia/Kolkata', 27.0410, 88.2663, 1, 83, 'Hill station at 2,000 m with panoramic views of Kanchenjunga, terraced tea gardens, a UNESCO toy train, and Buddhist monasteries.', 'curated', 'Q155030', 'https://en.wikipedia.org/wiki/Darjeeling'),
-- SOUTH / SOUTHEAST ASIA
('11111111-1111-4111-8111-111111111110', 'Ubud, Bali', 'Indonesia', 'ID', 'Southeast Asia', 'Asia/Makassar', -8.5069, 115.2625, 2, 93, 'Cultural uplands of Bali known for emerald terraced rice paddies, sacred water temples, artisan markets, and tropical rainforest waterfalls.', 'curated', 'Q323508', 'https://en.wikipedia.org/wiki/Ubud'),
('11111111-1111-4111-8111-111111111122', 'Bangkok', 'Thailand', 'TH', 'Southeast Asia', 'Asia/Bangkok', 13.7563, 100.5018, 2, 97, 'Frenetic Thai capital — gilded temples of Wat Phra Kaew, floating markets, rooftop bars, and some of the world best street food.', 'curated', 'Q1861', 'https://en.wikipedia.org/wiki/Bangkok'),
('11111111-1111-4111-8111-111111111123', 'Hoi An', 'Vietnam', 'VN', 'Southeast Asia', 'Asia/Ho_Chi_Minh', 15.8801, 108.3380, 1, 90, 'UNESCO-listed Ancient Town — lantern-lit merchant quarters, tailors, yellow-rendered heritage houses, and pristine An Bang beach.', 'curated', 'Q188351', 'https://en.wikipedia.org/wiki/H%E1%BB%99i_An'),
-- EAST ASIA
('11111111-1111-4111-8111-111111111106', 'Kyoto', 'Japan', 'JP', 'East Asia', 'Asia/Tokyo', 35.0116, 135.7681, 4, 97, 'Imperial capital of Japan home to Zen rock gardens, vermilion Shinto torii gates, bamboo groves, and traditional wooden machiya teahouses.', 'curated', 'Q34600', 'https://en.wikipedia.org/wiki/Kyoto'),
('11111111-1111-4111-8111-111111111107', 'Tokyo', 'Japan', 'JP', 'East Asia', 'Asia/Tokyo', 35.6762, 139.6503, 5, 98, 'Hyper-modern metropolis combining neon districts, historic Edo temples, Michelin street-food alleys, and world-class digital art museums.', 'curated', 'Q1490', 'https://en.wikipedia.org/wiki/Tokyo'),
('11111111-1111-4111-8111-111111111124', 'Seoul', 'South Korea', 'KR', 'East Asia', 'Asia/Seoul', 37.5665, 126.9780, 3, 94, 'Dynamic South Korean capital fusing 600-year-old royal palaces, K-pop cultural hubs, hypermodern districts, and world-class Korean BBQ.', 'curated', 'Q8684', 'https://en.wikipedia.org/wiki/Seoul'),
-- EUROPE
('11111111-1111-4111-8111-111111111108', 'Paris', 'France', 'FR', 'Western Europe', 'Europe/Paris', 48.8566, 2.3522, 4, 99, 'Global capital of art, architecture, and gastronomy along the Seine, featuring iconic museums, Gothic cathedrals, and boulevard cafes.', 'curated', 'Q90', 'https://en.wikipedia.org/wiki/Paris'),
('11111111-1111-4111-8111-111111111109', 'Rome', 'Italy', 'IT', 'Southern Europe', 'Europe/Rome', 41.9028, 12.4964, 4, 97, 'The Eternal City showcasing nearly three millennia of classical antiquity, Renaissance basilicas, piazzas, and Roman trattorias.', 'curated', 'Q220', 'https://en.wikipedia.org/wiki/Rome'),
('11111111-1111-4111-8111-111111111125', 'Barcelona', 'Spain', 'ES', 'Southern Europe', 'Europe/Madrid', 41.3851, 2.1734, 3, 96, 'Catalan capital fusing Gaudí modernist architecture, Gothic Quarter labyrinthine streets, Mediterranean beaches, and tapas culture.', 'curated', 'Q1492', 'https://en.wikipedia.org/wiki/Barcelona'),
('11111111-1111-4111-8111-111111111126', 'Amsterdam', 'Netherlands', 'NL', 'Western Europe', 'Europe/Amsterdam', 52.3676, 4.9041, 4, 93, 'City of canals — Golden Age merchant houses, world-class Rijksmuseum, Anne Frank House, and a cycling-first urban culture.', 'curated', 'Q727', 'https://en.wikipedia.org/wiki/Amsterdam'),
('11111111-1111-4111-8111-111111111127', 'Prague', 'Czech Republic', 'CZ', 'Central Europe', 'Europe/Prague', 50.0755, 14.4378, 2, 91, 'Fairy-tale medieval capital with Europe most intact Gothic city center, Baroque bridges, Bohemian beer halls, and castle districts.', 'curated', 'Q1085', 'https://en.wikipedia.org/wiki/Prague'),
-- MIDDLE EAST & AFRICA
('11111111-1111-4111-8111-111111111128', 'Dubai', 'UAE', 'AE', 'Middle East', 'Asia/Dubai', 25.2048, 55.2708, 5, 96, 'Futuristic Gulf megacity with the world tallest tower, indoor ski slopes in the desert, gold souks, and ultra-luxury experiences.', 'curated', 'Q612', 'https://en.wikipedia.org/wiki/Dubai'),
('11111111-1111-4111-8111-111111111129', 'Marrakech', 'Morocco', 'MA', 'North Africa', 'Africa/Casablanca', 31.6295, -7.9811, 2, 90, 'The Red City — ancient Medina souks, medieval mosques, Jardin Majorelle, and Berber cooking in a labyrinthine medieval quarter.', 'curated', 'Q101524', 'https://en.wikipedia.org/wiki/Marrakech'),
-- AMERICAS
('11111111-1111-4111-8111-111111111130', 'New York City', 'United States', 'US', 'North America', 'America/New_York', 40.7128, -74.0060, 5, 99, 'The Big Apple — Central Park, world-class museums, Broadway, global food, and an iconic skyline from Brooklyn Bridge.', 'curated', 'Q60', 'https://en.wikipedia.org/wiki/New_York_City'),
('11111111-1111-4111-8111-111111111131', 'Rio de Janeiro', 'Brazil', 'BR', 'South America', 'America/Sao_Paulo', -22.9068, -43.1729, 2, 94, 'Cidade Maravilhosa — iconic Copacabana and Ipanema beaches, Christ the Redeemer atop Corcovado, favela tours, and samba culture.', 'curated', 'Q8678', 'https://en.wikipedia.org/wiki/Rio_de_Janeiro'),
('11111111-1111-4111-8111-111111111132', 'Mexico City', 'Mexico', 'MX', 'North America', 'America/Mexico_City', 19.4326, -99.1332, 2, 93, 'CDMX — Aztec Templo Mayor beneath a colonial-era cathedral, world-class museums, Frida Kahlo Casa Azul, and unbeatable street tacos.', 'curated', 'Q1489', 'https://en.wikipedia.org/wiki/Mexico_City')
ON CONFLICT (source_provider, source_record_id) DO NOTHING;

-- ============================================================================
-- ACTIVITIES (100+ across all seeded cities)
-- ============================================================================
INSERT INTO public.activities (id, city_id, name, category, tags, lat, lng, duration_mins, estimated_cost, currency, cost_status, is_indoor, description, source_provider, source_record_id, source_url)
VALUES
-- ═══════════════════════════════════════════════════════════════════
-- JAIPUR (11101)
-- ═══════════════════════════════════════════════════════════════════
('22222222-2222-4222-8222-222222222101', '11111111-1111-4111-8111-111111111101', 'Amber Fort & Sheesh Mahal', 'culture', ARRAY['history','fort','architecture','unesco'], 26.9855, 75.8513, 180, 500, 'INR', 'estimated', FALSE, 'Majestic 16th-century hilltop fort overlooking Maota Lake with intricate mirror-work halls.', 'curated', 'Q456701', 'https://en.wikipedia.org/wiki/Amber_Fort'),
('22222222-2222-4222-8222-222222222102', '11111111-1111-4111-8111-111111111101', 'Hawa Mahal (Palace of Winds)', 'sightseeing', ARRAY['palace','photography','heritage'], 26.9239, 75.8267, 90, 200, 'INR', 'estimated', FALSE, 'Five-story pink sandstone honeycomb facade built in 1799 with 953 latticed jharokha windows.', 'curated', 'Q212650', 'https://en.wikipedia.org/wiki/Hawa_Mahal'),
('22222222-2222-4222-8222-222222222103', '11111111-1111-4111-8111-111111111101', 'Albert Hall State Museum', 'culture', ARRAY['museum','indoor','art','history'], 26.9116, 75.8195, 120, 300, 'INR', 'estimated', TRUE, 'Indo-Saracenic museum in Ram Niwas Garden housing miniature paintings, textiles, and antiquities.', 'curated', 'Q3630106', 'https://en.wikipedia.org/wiki/Albert_Hall_Museum'),
('22222222-2222-4222-8222-222222222104', '11111111-1111-4111-8111-111111111101', 'Johari Bazaar & Lassiwala Food Walk', 'food', ARRAY['local_food','street_food','shopping'], 26.9210, 75.8278, 120, 600, 'INR', 'estimated', FALSE, 'Guided tasting of Rajasthani pyaaz kachori, kulhad lassi, ghewar, and traditional block-print bazaars.', 'curated', 'JAIPUR_FOOD_01', 'https://en.wikipedia.org/wiki/Jaipur'),
('22222222-2222-4222-8222-222222222105', '11111111-1111-4111-8111-111111111101', 'City Palace Royal Textile & Armory Galleries', 'culture', ARRAY['museum','indoor','royalty','architecture'], 26.9258, 75.8237, 150, 700, 'INR', 'estimated', TRUE, 'Covered royal courtyards and indoor museum halls displaying Maharaja garments and historic manuscripts.', 'curated', 'Q1094093', 'https://en.wikipedia.org/wiki/City_Palace,_Jaipur'),
('22222222-2222-4222-8222-222222222106', '11111111-1111-4111-8111-111111111101', 'Nahargarh Fort Sunset Walk', 'sightseeing', ARRAY['fort','sunset','panorama','photography'], 26.9435, 75.8088, 120, 100, 'INR', 'estimated', FALSE, 'Hilltop Mughal-Rajput fort with panoramic night views over the illuminated Pink City.', 'curated', 'Q1394024', 'https://en.wikipedia.org/wiki/Nahargarh_Fort'),
-- UDAIPUR (11102)
('22222222-2222-4222-8222-222222222201', '11111111-1111-4111-8111-111111111102', 'Udaipur City Palace Museum', 'culture', ARRAY['palace','indoor','history','museum'], 24.5764, 73.6835, 180, 400, 'INR', 'estimated', TRUE, 'Sprawling granite and marble palace complex overlooking Lake Pichola with crystal and miniature galleries.', 'curated', 'Q2573175', 'https://en.wikipedia.org/wiki/City_Palace,_Udaipur'),
('22222222-2222-4222-8222-222222222202', '11111111-1111-4111-8111-111111111102', 'Lake Pichola Sunset Boat Cruise', 'relaxation', ARRAY['lake','scenic','sunset','boat'], 24.5720, 73.6790, 90, 800, 'INR', 'estimated', FALSE, 'Scenic wooden boat ride past Jag Mandir island palace and the historic ghats of Old Udaipur.', 'curated', 'Q1800988', 'https://en.wikipedia.org/wiki/Lake_Pichola'),
('22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111102', 'Bagore Ki Haveli Dharohar Folk Dance Show', 'culture', ARRAY['dance','indoor','evening','music'], 24.5796, 73.6806, 90, 250, 'INR', 'estimated', TRUE, '18th-century waterfront mansion hosting traditional Rajasthani Ghoomar and puppet performances.', 'curated', 'Q4842094', 'https://en.wikipedia.org/wiki/Bagore-ki-Haveli'),
('22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111102', 'Saheliyon Ki Bari Garden', 'relaxation', ARRAY['garden','outdoor','fountain','heritage'], 24.5924, 73.6799, 60, 100, 'INR', 'estimated', FALSE, 'Ornate royal garden of the Handmaidens with marble fountains, kiosks, and a lotus pool.', 'curated', 'Q7395060', 'https://en.wikipedia.org/wiki/Saheliyon-ki-Bari'),
-- JODHPUR (11113)
('22222222-2222-4222-8222-222222222301', '11111111-1111-4111-8111-111111111113', 'Mehrangarh Fort & Zenana Deodi', 'culture', ARRAY['fort','history','architecture','museum'], 26.2980, 73.0188, 180, 600, 'INR', 'estimated', FALSE, 'Towering 15th-century sandstone citadel with outstanding museum of Mughal palanquins and Rajput weapons.', 'curated', 'Q1137635', 'https://en.wikipedia.org/wiki/Mehrangarh'),
('22222222-2222-4222-8222-222222222302', '11111111-1111-4111-8111-111111111113', 'Blue City Rooftop Walk & Spice Market', 'sightseeing', ARRAY['walking','local_food','photography','heritage'], 26.2961, 73.0267, 120, 400, 'INR', 'estimated', FALSE, 'Wander cobalt-blue lanes of Brahmpuri, spice bazaars, and the Clock Tower market below Mehrangarh.', 'curated', 'JODHPUR_WALK_01', 'https://en.wikipedia.org/wiki/Jodhpur'),
-- JAISALMER (11114)
('22222222-2222-4222-8222-222222222401', '11111111-1111-4111-8111-111111111114', 'Jaisalmer Fort Jain Temples & Patwon Ki Haveli', 'culture', ARRAY['fort','jain','architecture','indoor'], 26.9124, 70.9083, 180, 500, 'INR', 'estimated', TRUE, 'Living golden sandstone fort with intricate Jain temples and ornate havelis open to the public.', 'curated', 'Q1491766', 'https://en.wikipedia.org/wiki/Jaisalmer_Fort'),
('22222222-2222-4222-8222-222222222402', '11111111-1111-4111-8111-111111111114', 'Sam Sand Dunes Camel Safari & Sunset', 'adventure', ARRAY['desert','camel','sunset','camping'], 26.8614, 70.5447, 180, 1500, 'INR', 'estimated', FALSE, 'Overnight dune camping or sunset camel ride in the Great Thar Desert, 42 km from Jaisalmer.', 'curated', 'JAISALMER_DUNE_01', 'https://en.wikipedia.org/wiki/Jaisalmer'),
-- GOA (11103)
('22222222-2222-4222-8222-222222222501', '11111111-1111-4111-8111-111111111103', 'Fontainhas Latin Quarter Heritage Walk', 'culture', ARRAY['architecture','walking','heritage','photography'], 15.4958, 73.8315, 120, 400, 'INR', 'estimated', FALSE, 'Stroll through colorful Portuguese villas, azulejo tile plaques, and historic bakeries in Panaji.', 'curated', 'Q5465115', 'https://en.wikipedia.org/wiki/Fontainhas'),
('22222222-2222-4222-8222-222222222502', '11111111-1111-4111-8111-111111111103', 'Basilica of Bom Jesus & Museum of Christian Art', 'culture', ARRAY['unesco','indoor','history','architecture'], 15.5009, 73.9116, 120, 150, 'INR', 'estimated', TRUE, 'UNESCO World Heritage baroque basilica in Old Goa paired with indoor sacred art galleries.', 'curated', 'Q738041', 'https://en.wikipedia.org/wiki/Basilica_of_Bom_Jesus'),
('22222222-2222-4222-8222-222222222503', '11111111-1111-4111-8111-111111111103', 'Aguada Fort & Candolim Coastal Sunset', 'sightseeing', ARRAY['beach','fort','sunset','nature'], 15.4924, 73.7737, 150, 100, 'INR', 'free', FALSE, '17th-century Portuguese lighthouse fort overlooking the confluence of the Mandovi River and Arabian Sea.', 'curated', 'Q3524322', 'https://en.wikipedia.org/wiki/Fort_Aguada'),
('22222222-2222-4222-8222-222222222504', '11111111-1111-4111-8111-111111111103', 'Goa Spice Plantation Tour & Kerala Lunch', 'food', ARRAY['plantation','nature','local_food','cultural'], 15.5135, 73.9740, 240, 1200, 'INR', 'estimated', FALSE, 'Guided tour of a working spice plantation in Ponda with demonstration lunch of Goan-Kerala cuisine.', 'curated', 'GOA_SPICE_01', 'https://en.wikipedia.org/wiki/Goa'),
-- HAMPI (11115)
('22222222-2222-4222-8222-222222222601', '11111111-1111-4111-8111-111111111115', 'Virupaksha Temple & Hemakuta Hill Sunrise', 'sightseeing', ARRAY['temple','ruins','sunrise','history'], 15.3350, 76.4619, 180, 100, 'INR', 'estimated', FALSE, 'Living Dravidian temple dedicated to Shiva dating to 7th century, with Hemakuta hilltop for sunrise ruins views.', 'curated', 'Q2076609', 'https://en.wikipedia.org/wiki/Virupaksha_Temple,_Hampi'),
('22222222-2222-4222-8222-222222222602', '11111111-1111-4111-8111-111111111115', 'Royal Enclosure & Elephant Stables Cycle Tour', 'adventure', ARRAY['cycling','history','ruins','outdoor'], 15.3327, 76.4640, 180, 300, 'INR', 'estimated', FALSE, 'Cycle through the UNESCO Hampi ruins — Lotus Mahal, Elephant Stables, Queens Bath, and Zenana Enclosure.', 'curated', 'HAMPI_CYCLE_01', 'https://en.wikipedia.org/wiki/Hampi'),
-- KOCHI & MUNNAR (11104)
('22222222-2222-4222-8222-222222222701', '11111111-1111-4111-8111-111111111104', 'Fort Kochi Chinese Fishing Nets & Spice Walk', 'culture', ARRAY['heritage','fishing','local_food','photography'], 9.9667, 76.2430, 120, 300, 'INR', 'estimated', FALSE, 'Watch centuries-old cantilevered Chinese fishing nets in action, then explore the spice market alleys of Fort Kochi.', 'curated', 'Q2085956', 'https://en.wikipedia.org/wiki/Chinese_fishing_nets,_Kochi'),
('22222222-2222-4222-8222-222222222702', '11111111-1111-4111-8111-111111111104', 'Munnar Tea Estate Sunrise Hike & Tasting', 'nature', ARRAY['tea','hiking','nature','panorama'], 10.0889, 77.0595, 240, 800, 'INR', 'estimated', FALSE, 'Pre-dawn drive up to rolling KDHP tea estates at Munnar — guided plucking demonstration and tasting session.', 'curated', 'MUNNAR_TEA_01', 'https://en.wikipedia.org/wiki/Munnar'),
-- ALLEPPEY (11116)
('22222222-2222-4222-8222-222222222801', '11111111-1111-4111-8111-111111111116', 'Kerala Houseboat Backwater Overnight', 'relaxation', ARRAY['boat','backwater','nature','sunset'], 9.4981, 76.3388, 1440, 8000, 'INR', 'estimated', FALSE, 'Overnight stay on a traditional rice-barge houseboat cruising Vembanad Lake and Kerala palm-lined backwater canals.', 'curated', 'ALLEPPEY_HB_01', 'https://en.wikipedia.org/wiki/Alappuzha'),
('22222222-2222-4222-8222-222222222802', '11111111-1111-4111-8111-111111111116', 'Alleppey Beach & Coir Village Tour', 'nature', ARRAY['beach','local_culture','craft','outdoor'], 9.4829, 76.3387, 180, 400, 'INR', 'estimated', FALSE, 'Explore the legendary coir-weaving village of Pathiramanal Island and sunset beach walk at Alleppey.', 'curated', 'ALLEPPEY_BEACH_01', 'https://en.wikipedia.org/wiki/Alappuzha'),
-- MANALI (11105)
('22222222-2222-4222-8222-222222222901', '11111111-1111-4111-8111-111111111105', 'Rohtang Pass Snow Trek (Seasonal)', 'adventure', ARRAY['snow','mountain','trekking','scenic'], 32.3706, 77.2392, 480, 2000, 'INR', 'estimated', FALSE, 'Permit-required high-altitude mountain pass at 3,978 m with snow year-round — spectacular Himalayan views.', 'curated', 'Q2078028', 'https://en.wikipedia.org/wiki/Rohtang_Pass'),
('22222222-2222-4222-8222-222222222902', '11111111-1111-4111-8111-111111111105', 'Hadimba Devi Temple & Vashisht Hot Springs', 'culture', ARRAY['temple','forest','hot_springs','culture'], 32.2366, 77.1803, 150, 150, 'INR', 'estimated', FALSE, 'Ancient cedar-wood temple dedicated to Pandava queen Hidimba, then sulfur hot springs bath at Vashisht.', 'curated', 'Q1587093', 'https://en.wikipedia.org/wiki/Hadimba_Temple'),
-- RISHIKESH (11117)
('22222222-2222-4222-8222-222222222a01', '11111111-1111-4111-8111-111111111117', 'Ganga Whitewater Rafting (16 km)', 'adventure', ARRAY['rafting','river','outdoor','sports'], 30.1186, 78.2993, 240, 1200, 'INR', 'estimated', FALSE, 'Grade III–IV rapids on the sacred Ganga river between Shivpuri and Laxman Jhula — run by certified outfitters.', 'curated', 'RISHIKESH_RAFT_01', 'https://en.wikipedia.org/wiki/Rishikesh'),
('22222222-2222-4222-8222-222222222a02', '11111111-1111-4111-8111-111111111117', 'Parmarth Niketan Ganga Aarti Ceremony', 'culture', ARRAY['spiritual','ceremony','evening','culture'], 30.1127, 78.3192, 90, 0, 'INR', 'free', FALSE, 'Daily sunset fire ceremony on the banks of the Ganges — chanting, lamps, and bells at Parmarth Ghat.', 'curated', 'RISHIKESH_AARTI_01', 'https://en.wikipedia.org/wiki/Parmarth_Niketan'),
-- VARANASI (11118)
('22222222-2222-4222-8222-222222222b01', '11111111-1111-4111-8111-111111111118', 'Dashashwamedh Ghat Dawn Boat Ride', 'culture', ARRAY['ghat','boat','sunrise','spiritual'], 25.3073, 83.0107, 120, 800, 'INR', 'estimated', FALSE, 'Pre-dawn row boat past 84 ghats watching pilgrims bathe, cremation pyres, and the ancient city awaken.', 'curated', 'VARANASI_BOAT_01', 'https://en.wikipedia.org/wiki/Dashashwamedh_Ghat'),
('22222222-2222-4222-8222-222222222b02', '11111111-1111-4111-8111-111111111118', 'Sarnath Buddhist Deer Park & Dhamek Stupa', 'culture', ARRAY['buddhist','history','heritage','walking'], 25.3803, 83.0237, 150, 200, 'INR', 'estimated', FALSE, 'Deer park where the Buddha gave his first teaching — Dhamek Stupa, Ashoka Pillar, and Sarnath museum.', 'curated', 'Q1074064', 'https://en.wikipedia.org/wiki/Sarnath'),
-- AGRA (11119)
('22222222-2222-4222-8222-222222222c01', '11111111-1111-4111-8111-111111111119', 'Taj Mahal Sunrise & Gardens Tour', 'culture', ARRAY['unesco','marble','sunrise','history'], 27.1751, 78.0421, 180, 1300, 'INR', 'official', FALSE, 'UNESCO-listed Mughal marble mausoleum — best viewed at sunrise from the Eastern Gate with the misty reflection pool.', 'curated', 'Q9202', 'https://en.wikipedia.org/wiki/Taj_Mahal'),
('22222222-2222-4222-8222-222222222c02', '11111111-1111-4111-8111-111111111119', 'Agra Fort & Diwan-i-Am', 'culture', ARRAY['fort','mughal','history','architecture'], 27.1795, 78.0211, 150, 650, 'INR', 'official', FALSE, 'UNESCO-listed 16th-century Mughal red sandstone fort where Shah Jahan was imprisoned with a view of the Taj.', 'curated', 'Q110832', 'https://en.wikipedia.org/wiki/Agra_Fort'),
-- DELHI (11120)
('22222222-2222-4222-8222-222222222d01', '11111111-1111-4111-8111-111111111120', 'Red Fort & Sound & Light Show', 'culture', ARRAY['fort','mughal','history','evening'], 28.6562, 77.2410, 180, 600, 'INR', 'official', FALSE, 'UNESCO Mughal red sandstone fort — Diwan-i-Khas, Rang Mahal — followed by the Illuminations sound-and-light show.', 'curated', 'Q160236', 'https://en.wikipedia.org/wiki/Red_Fort'),
('22222222-2222-4222-8222-222222222d02', '11111111-1111-4111-8111-111111111120', 'Chandni Chowk Street Food Trail', 'food', ARRAY['street_food','local_culture','walking','historical'], 28.6514, 77.2305, 180, 800, 'INR', 'estimated', FALSE, 'Legendary Old Delhi food walk — Paranthe Wali Gali, Jalebi Wala, Natraj Dahi Bhalle, and spice market.', 'curated', 'DELHI_FOOD_01', 'https://en.wikipedia.org/wiki/Chandni_Chowk'),
('22222222-2222-4222-8222-222222222d03', '11111111-1111-4111-8111-111111111120', 'Qutb Minar & Iron Pillar', 'culture', ARRAY['unesco','history','architecture','outdoor'], 28.5245, 77.1855, 120, 600, 'INR', 'official', FALSE, 'UNESCO-listed 73 m 12th-century minaret — world earliest minaret in brick, paired with the 1,600-year rust-free Iron Pillar.', 'curated', 'Q1134093', 'https://en.wikipedia.org/wiki/Qutb_Minar'),
-- DARJEELING (11121)
('22222222-2222-4222-8222-222222222e01', '11111111-1111-4111-8111-111111111121', 'Tiger Hill Sunrise & Kanchenjunga View', 'nature', ARRAY['sunrise','mountain','panorama','nature'], 27.0201, 88.2858, 120, 200, 'INR', 'estimated', FALSE, 'Pre-dawn jeep to Tiger Hill at 2,590 m for a spectacular Himalayan sunrise over Kanchenjunga, Everest, and Makalu.', 'curated', 'DARJ_TIGER_01', 'https://en.wikipedia.org/wiki/Tiger_Hill,_Darjeeling'),
('22222222-2222-4222-8222-222222222e02', '11111111-1111-4111-8111-111111111121', 'Darjeeling Himalayan Railway Toy Train Ride', 'culture', ARRAY['train','heritage','unesco','scenic'], 27.0410, 88.2663, 180, 1500, 'INR', 'official', FALSE, 'UNESCO World Heritage narrow-gauge toy train — joyride through tea estate loops with Himalayan views.', 'curated', 'Q1200220', 'https://en.wikipedia.org/wiki/Darjeeling_Himalayan_Railway'),
-- UBUD (11110)
('22222222-2222-4222-8222-222222222f01', '11111111-1111-4111-8111-111111111110', 'Tegalalang Rice Terrace Sunrise Trek', 'nature', ARRAY['rice_terrace','sunrise','nature','photography'], -8.4348, 115.2779, 150, 400, 'INR', 'estimated', FALSE, 'Walk the iconic UNESCO-listed emerald Subak terraces at Tegalalang in the pre-dawn mist.', 'curated', 'Q5421076', 'https://en.wikipedia.org/wiki/Tegalalang_Rice_Terrace'),
('22222222-2222-4222-8222-222222222f02', '11111111-1111-4111-8111-111111111110', 'Sacred Monkey Forest Sanctuary & Pura Dalem', 'nature', ARRAY['wildlife','temple','forest','nature'], -8.5188, 115.2594, 90, 600, 'INR', 'estimated', FALSE, 'Ancient Balinese temple complex within a verdant forest inhabited by over 1,000 long-tailed macaques.', 'curated', 'Q327386', 'https://en.wikipedia.org/wiki/Sacred_Monkey_Forest_Sanctuary'),
-- BANGKOK (11122)
('22222222-2222-4222-8222-222222222g01', '11111111-1111-4111-8111-111111111122', 'Grand Palace & Wat Phra Kaew', 'culture', ARRAY['temple','palace','history','indoor'], 13.7500, 100.4913, 240, 1100, 'INR', 'official', FALSE, 'Thailand holiest temple — ornate Emerald Buddha shrine complex within the vast Grand Palace compound.', 'curated', 'Q841281', 'https://en.wikipedia.org/wiki/Grand_Palace'),
('22222222-2222-4222-8222-222222222g02', '11111111-1111-4111-8111-111111111122', 'Chatuchak Weekend Market', 'food', ARRAY['market','shopping','local_culture','outdoor'], 13.8000, 100.5500, 240, 1500, 'INR', 'estimated', FALSE, 'Worlds largest weekend market — 8,000 stalls of street food, vintage clothes, art, plants, and souvenirs.', 'curated', 'Q1068680', 'https://en.wikipedia.org/wiki/Chatuchak_Weekend_Market'),
-- HOI AN (11123)
('22222222-2222-4222-8222-222222222h01', '11111111-1111-4111-8111-111111111123', 'Hoi An Ancient Town Lantern Festival Walk', 'culture', ARRAY['heritage','lanterns','photography','walking'], 15.8777, 108.3260, 120, 200, 'INR', 'estimated', FALSE, 'UNESCO-listed Ancient Town glowing with hundreds of silk lanterns reflected in the Thu Bon River at dusk.', 'curated', 'Q188351', 'https://en.wikipedia.org/wiki/H%E1%BB%99i_An'),
('22222222-2222-4222-8222-222222222h02', '11111111-1111-4111-8111-111111111123', 'Cooking Class: Cao Lau & White Rose Dumplings', 'food', ARRAY['cooking_class','local_food','indoor','cultural'], 15.8793, 108.3303, 180, 1500, 'INR', 'estimated', TRUE, 'Market visit followed by hands-on class making Cao Lau noodles and Hoi An white rose dumplings.', 'curated', 'HOI_AN_COOK_01', 'https://en.wikipedia.org/wiki/H%E1%BB%99i_An'),
-- KYOTO (11106)
('22222222-2222-4222-8222-222222222i01', '11111111-1111-4111-8111-111111111106', 'Fushimi Inari Taisha Torii Trail', 'sightseeing', ARRAY['shrine','walking','nature','culture'], 34.9671, 135.7727, 150, 0, 'INR', 'free', FALSE, 'Iconic mountain trail winding through thousands of vermilion torii gates in southern Kyoto.', 'curated', 'Q328062', 'https://en.wikipedia.org/wiki/Fushimi_Inari-taisha'),
('22222222-2222-4222-8222-222222222i02', '11111111-1111-4111-8111-111111111106', 'Nishiki Market & Kyoto Manga Museum', 'food', ARRAY['indoor','local_food','culture','museum'], 35.0050, 135.7649, 150, 1800, 'INR', 'estimated', TRUE, 'All-weather covered culinary arcade known as Kyoto Kitchen, paired with the indoor Manga Museum.', 'curated', 'Q1196215', 'https://en.wikipedia.org/wiki/Nishiki_Market'),
('22222222-2222-4222-8222-222222222i03', '11111111-1111-4111-8111-111111111106', 'Arashiyama Bamboo Grove & Tenryu-ji Garden', 'nature', ARRAY['bamboo','garden','zen','nature'], 35.0094, 135.6690, 120, 1200, 'INR', 'estimated', FALSE, 'Walk the towering bamboo path at Sagano, then explore the UNESCO-listed Zen garden of Tenryu-ji temple.', 'curated', 'Q1094025', 'https://en.wikipedia.org/wiki/Arashiyama'),
-- TOKYO (11107)
('22222222-2222-4222-8222-222222222j01', '11111111-1111-4111-8111-111111111107', 'teamLab Borderless Digital Art Museum', 'culture', ARRAY['art','indoor','technology','museum'], 35.6248, 139.7749, 180, 5000, 'INR', 'official', TRUE, 'Immersive 10,000 m² digital art experience with infinite spatial projection environments — book in advance.', 'curated', 'Q55661849', 'https://en.wikipedia.org/wiki/TeamLab'),
('22222222-2222-4222-8222-222222222j02', '11111111-1111-4111-8111-111111111107', 'Tsukiji Outer Market Morning Food Walk', 'food', ARRAY['seafood','street_food','local_culture','morning'], 35.6654, 139.7706, 120, 3000, 'INR', 'estimated', FALSE, 'Sunrise tasting tour of the Tsukiji Outer Market — fresh sushi, uni, tamagoyaki, and Japanese street snacks.', 'curated', 'TOKYO_TSUKIJI_01', 'https://en.wikipedia.org/wiki/Tsukiji_market'),
-- PARIS (11108)
('22222222-2222-4222-8222-222222222k01', '11111111-1111-4111-8111-111111111108', 'Musée du Louvre Masterpieces Tour', 'culture', ARRAY['museum','indoor','art','history'], 48.8606, 2.3376, 210, 2000, 'INR', 'estimated', TRUE, 'World-renowned indoor art museum inside the Louvre Palace featuring classical and Renaissance masterpieces.', 'curated', 'Q19675', 'https://en.wikipedia.org/wiki/Louvre'),
('22222222-2222-4222-8222-222222222k02', '11111111-1111-4111-8111-111111111108', 'Eiffel Tower & Champ de Mars Promenade', 'sightseeing', ARRAY['landmark','architecture','scenic'], 48.8584, 2.2945, 150, 2600, 'INR', 'estimated', FALSE, 'Ascend Gustave Eiffel wrought-iron lattice tower for panoramic views across Paris.', 'curated', 'Q243', 'https://en.wikipedia.org/wiki/Eiffel_Tower'),
('22222222-2222-4222-8222-222222222k03', '11111111-1111-4111-8111-111111111108', 'Montmartre & Sacré-Cœur Hilltop Walk', 'culture', ARRAY['walking','art','history','hilltop'], 48.8867, 2.3431, 150, 500, 'INR', 'estimated', FALSE, 'Bohemian artist quarter atop Butte Montmartre — Sacré-Cœur basilica, Place du Tertre, and Moulin Rouge.', 'curated', 'Q230143', 'https://en.wikipedia.org/wiki/Montmartre'),
-- ROME (11109)
('22222222-2222-4222-8222-222222222l01', '11111111-1111-4111-8111-111111111109', 'Colosseum & Roman Forum Guided Tour', 'culture', ARRAY['history','ruins','UNESCO','indoor'], 41.8902, 12.4922, 240, 3200, 'INR', 'official', FALSE, 'UNESCO Flavian Amphitheatre — guided skip-the-line tour through the arena and ancient Roman Forum ruins.', 'curated', 'Q10285', 'https://en.wikipedia.org/wiki/Colosseum'),
('22222222-2222-4222-8222-222222222l02', '11111111-1111-4111-8111-111111111109', 'Vatican Museums & Sistine Chapel', 'culture', ARRAY['museum','indoor','art','history'], 41.9065, 12.4536, 210, 4200, 'INR', 'official', TRUE, 'World largest art collection inside Vatican City — Michelangelo Sistine Chapel, Raphael Rooms.', 'curated', 'Q182955', 'https://en.wikipedia.org/wiki/Vatican_Museums'),
-- BARCELONA (11125)
('22222222-2222-4222-8222-222222222m01', '11111111-1111-4111-8111-111111111125', 'Sagrada Familia Cathedral', 'culture', ARRAY['architecture','indoor','gaudi','art'], 41.4036, 2.1744, 120, 3500, 'INR', 'official', TRUE, 'Gaudí UNESCO-listed basilica under continuous construction since 1882 — breathtaking organic stonework.', 'curated', 'Q20086', 'https://en.wikipedia.org/wiki/Sagrada_Fam%C3%ADlia'),
('22222222-2222-4222-8222-222222222m02', '11111111-1111-4111-8111-111111111125', 'La Boqueria Market & Gothic Quarter Walk', 'food', ARRAY['market','local_food','walking','heritage'], 41.3817, 2.1723, 150, 1500, 'INR', 'estimated', FALSE, 'Vibrant covered produce market on Las Ramblas, then cobblestone lanes of the 2,000-year-old Barri Gòtic.', 'curated', 'Q1434536', 'https://en.wikipedia.org/wiki/La_Boqueria'),
-- DUBAI (11128)
('22222222-2222-4222-8222-222222222n01', '11111111-1111-4111-8111-111111111128', 'Burj Khalifa At The Top Observation Deck', 'sightseeing', ARRAY['tower','panorama','indoor','modern'], 25.1972, 55.2744, 120, 7500, 'INR', 'official', TRUE, 'Rise 555 m to the At The Top observation deck of the worlds tallest building for a 360° desert-to-sea panorama.', 'curated', 'Q201012', 'https://en.wikipedia.org/wiki/Burj_Khalifa'),
('22222222-2222-4222-8222-222222222n02', '11111111-1111-4111-8111-111111111128', 'Dubai Creek Gold Souk & Spice Souk Walk', 'culture', ARRAY['souk','shopping','heritage','local_culture'], 25.2638, 55.2980, 120, 500, 'INR', 'estimated', FALSE, 'Traditional covered souk markets — Gold Souk with 300+ jewelry traders, and pungent Spice Souk across the creek.', 'curated', 'Q3087895', 'https://en.wikipedia.org/wiki/Dubai_Gold_Souk'),
-- NEW YORK CITY (11130)
('22222222-2222-4222-8222-222222222o01', '11111111-1111-4111-8111-111111111130', 'Metropolitan Museum of Art (The Met)', 'culture', ARRAY['museum','indoor','art','history'], 40.7794, -73.9632, 240, 7000, 'INR', 'estimated', TRUE, 'One of world largest art museums — 5,000 years of Egyptian, European, American, and Asian masterpieces.', 'curated', 'Q160236', 'https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art'),
('22222222-2222-4222-8222-222222222o02', '11111111-1111-4111-8111-111111111130', 'Brooklyn Bridge Walk & DUMBO View', 'sightseeing', ARRAY['bridge','walking','skyline','photography'], 40.7057, -73.9964, 90, 0, 'INR', 'free', FALSE, 'Walk the iconic 1883 cable-stayed bridge for Manhattan skyline views, then explore the DUMBO arts district.', 'curated', 'Q138678', 'https://en.wikipedia.org/wiki/Brooklyn_Bridge'),
-- MARRAKECH (11129)
('22222222-2222-4222-8222-222222222p01', '11111111-1111-4111-8111-111111111129', 'Djemaa el-Fna Square & Medina Souk', 'culture', ARRAY['market','local_culture','outdoor','food'], 31.6252, -7.9892, 180, 1000, 'INR', 'estimated', FALSE, 'UNESCO-listed square transforming from acrobats and storytellers by day to outdoor restaurants and music by night.', 'curated', 'Q193381', 'https://en.wikipedia.org/wiki/Djemaa_el-Fna'),
('22222222-2222-4222-8222-222222222p02', '11111111-1111-4111-8111-111111111129', 'Jardin Majorelle & Yves Saint Laurent Museum', 'culture', ARRAY['garden','art','outdoor','indoor'], 31.6407, -8.0034, 120, 3000, 'INR', 'official', FALSE, 'Cobalt-blue villa in a lush cactus garden — YSL restored it as both a living museum and botanical sanctuary.', 'curated', 'Q1637', 'https://en.wikipedia.org/wiki/Jardin_Majorelle'),
-- SEOUL (11124)
('22222222-2222-4222-8222-222222222q01', '11111111-1111-4111-8111-111111111124', 'Gyeongbokgung Palace & Changing of the Guard', 'culture', ARRAY['palace','history','architecture','outdoor'], 37.5796, 126.9770, 150, 1500, 'INR', 'official', FALSE, 'Korea grandest Joseon dynasty palace — free guided tours in 10 languages + elaborate ceremonial guard change.', 'curated', 'Q4523028', 'https://en.wikipedia.org/wiki/Gyeongbokgung'),
('22222222-2222-4222-8222-222222222q02', '11111111-1111-4111-8111-111111111124', 'Myeongdong Street Food & K-Beauty Walk', 'food', ARRAY['street_food','shopping','k-pop','local_culture'], 37.5637, 126.9839, 150, 2000, 'INR', 'estimated', FALSE, 'Neon-lit shopping street overflowing with tteokbokki, egg bread, Korean fried chicken, and K-beauty shops.', 'curated', 'SEOUL_MYEONG_01', 'https://en.wikipedia.org/wiki/Myeongdong')
ON CONFLICT (source_provider, source_record_id) DO NOTHING;

-- ============================================================================
-- PLACE IMAGES (Attributed Wikimedia Commons)
-- ============================================================================
INSERT INTO public.place_images (city_id, activity_id, image_url, thumbnail_url, source_page_url, creator_name, licence_label, licence_url, attribution_text, provider, match_method)
VALUES
-- Jaipur (city)
('11111111-1111-4111-8111-111111111101', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/800px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
 'https://commons.wikimedia.org/wiki/File:East_facade_Hawa_Mahal_Jaipur_from_ground_level_(July_2022)_-_img_01.jpg',
 'Chainwit.', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/',
 'Photo by Chainwit. / Wikimedia Commons (CC BY-SA 4.0)', 'wikimedia_commons', 'curated_qid'),
-- Udaipur (city)
('11111111-1111-4111-8111-111111111102', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Udaipur_City_Palace.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Udaipur_City_Palace.jpg/800px-Udaipur_City_Palace.jpg',
 'https://commons.wikimedia.org/wiki/File:Udaipur_City_Palace.jpg',
 'Flicka', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by Flicka / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid'),
-- Kyoto (city)
('11111111-1111-4111-8111-111111111106', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Kinkaku-ji_the_Golden_Temple_in_Kyoto_overlooking_the_lake_-_high_rez.JPG',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Kinkaku-ji_the_Golden_Temple_in_Kyoto_overlooking_the_lake_-_high_rez.JPG/800px-Kinkaku-ji_the_Golden_Temple_in_Kyoto_overlooking_the_lake_-_high_rez.JPG',
 'https://commons.wikimedia.org/wiki/File:Kinkaku-ji_the_Golden_Temple_in_Kyoto_overlooking_the_lake_-_high_rez.JPG',
 'chensiyuan', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/',
 'Photo by chensiyuan / Wikimedia Commons (CC BY-SA 4.0)', 'wikimedia_commons', 'curated_qid'),
-- Paris (city)
('11111111-1111-4111-8111-111111111108', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/800px-Tour_Eiffel_Wikimedia_Commons.jpg',
 'https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons.jpg',
 'Benh LIEU SONG', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by Benh LIEU SONG / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid'),
-- Goa (city)
('11111111-1111-4111-8111-111111111103', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/9/93/Calangute_Beach_Goa_India.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Calangute_Beach_Goa_India.jpg/800px-Calangute_Beach_Goa_India.jpg',
 'https://commons.wikimedia.org/wiki/File:Calangute_Beach_Goa_India.jpg',
 'Rahul Zota', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/',
 'Photo by Rahul Zota / Wikimedia Commons (CC BY-SA 4.0)', 'wikimedia_commons', 'curated_qid'),
-- Manali (city)
('11111111-1111-4111-8111-111111111105', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Hadimba_temple_in_manali.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Hadimba_temple_in_manali.jpg/800px-Hadimba_temple_in_manali.jpg',
 'https://commons.wikimedia.org/wiki/File:Hadimba_temple_in_manali.jpg',
 'Varun Shiv Kapur', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/',
 'Photo by Varun Shiv Kapur / Wikimedia Commons (CC BY 2.0)', 'wikimedia_commons', 'curated_qid'),
-- Varanasi (city)
('11111111-1111-4111-8111-111111111118', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Varanasi_ghats.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Varanasi_ghats.jpg/800px-Varanasi_ghats.jpg',
 'https://commons.wikimedia.org/wiki/File:Varanasi_ghats.jpg',
 'Amitabha Gupta', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by Amitabha Gupta / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid'),
-- Agra / Taj Mahal (activity)
(NULL, '22222222-2222-4222-8222-222222222c01',
 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
 'https://commons.wikimedia.org/wiki/File:Taj_Mahal,_Agra,_India_edit3.jpg',
 'Yann Forget', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by Yann Forget / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid'),
-- Fushimi Inari (activity)
(NULL, '22222222-2222-4222-8222-222222222i01',
 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Fushimi_inari_taisha_1.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Fushimi_inari_taisha_1.jpg/800px-Fushimi_inari_taisha_1.jpg',
 'https://commons.wikimedia.org/wiki/File:Fushimi_inari_taisha_1.jpg',
 'Cquest', 'CC BY-SA 2.5', 'https://creativecommons.org/licenses/by-sa/2.5/',
 'Photo by Cquest / Wikimedia Commons (CC BY-SA 2.5)', 'wikimedia_commons', 'curated_qid'),
-- Colosseum (activity)
(NULL, '22222222-2222-4222-8222-222222222l01',
 'https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg',
 'https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg',
 'Francois Philipp', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/',
 'Photo by Francois Philipp / Wikimedia Commons (CC BY 2.0)', 'wikimedia_commons', 'curated_qid'),
-- Sagrada Familia (activity)
(NULL, '22222222-2222-4222-8222-222222222m01',
 'https://upload.wikimedia.org/wikipedia/commons/9/93/Sagrada_Familia_01.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Sagrada_Familia_01.jpg/800px-Sagrada_Familia_01.jpg',
 'https://commons.wikimedia.org/wiki/File:Sagrada_Familia_01.jpg',
 'Canaan', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by Canaan / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid'),
-- Ubud Tegalalang (activity)
(NULL, '22222222-2222-4222-8222-222222222f01',
 'https://upload.wikimedia.org/wikipedia/commons/5/54/Bali_-_Tegalalang_rice_terrace.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bali_-_Tegalalang_rice_terrace.jpg/800px-Bali_-_Tegalalang_rice_terrace.jpg',
 'https://commons.wikimedia.org/wiki/File:Bali_-_Tegalalang_rice_terrace.jpg',
 'Gunawan Kartapranata', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by Gunawan Kartapranata / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid'),
-- Delhi Red Fort (activity)
(NULL, '22222222-2222-4222-8222-222222222d01',
 'https://upload.wikimedia.org/wikipedia/commons/0/04/Red_Fort_in_New_Delhi_03-2016_img3.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Red_Fort_in_New_Delhi_03-2016_img3.jpg/800px-Red_Fort_in_New_Delhi_03-2016_img3.jpg',
 'https://commons.wikimedia.org/wiki/File:Red_Fort_in_New_Delhi_03-2016_img3.jpg',
 'CEphoto Uwe Aranas', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by CEphoto Uwe Aranas / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid'),
-- Hoi An (city)
('11111111-1111-4111-8111-111111111123', NULL,
 'https://upload.wikimedia.org/wikipedia/commons/6/69/Hoi_An_reflected_in_the_Thu_Bon_river.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Hoi_An_reflected_in_the_Thu_Bon_river.jpg/800px-Hoi_An_reflected_in_the_Thu_Bon_river.jpg',
 'https://commons.wikimedia.org/wiki/File:Hoi_An_reflected_in_the_Thu_Bon_river.jpg',
 'Axel Drainville', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/',
 'Photo by Axel Drainville / Wikimedia Commons (CC BY 2.0)', 'wikimedia_commons', 'curated_qid'),
-- Bangkok Grand Palace (activity)
(NULL, '22222222-2222-4222-8222-222222222g01',
 'https://upload.wikimedia.org/wikipedia/commons/6/67/The_Grand_Palace_Temple_of_the_Emerald_Buddha_Bangkok_Thailand.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/The_Grand_Palace_Temple_of_the_Emerald_Buddha_Bangkok_Thailand.jpg/800px-The_Grand_Palace_Temple_of_the_Emerald_Buddha_Bangkok_Thailand.jpg',
 'https://commons.wikimedia.org/wiki/File:The_Grand_Palace_Temple_of_the_Emerald_Buddha_Bangkok_Thailand.jpg',
 'Jpatokal', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/',
 'Photo by Jpatokal / Wikimedia Commons (CC BY-SA 3.0)', 'wikimedia_commons', 'curated_qid');

-- ============================================================================
-- SEED ACCOMMODATIONS (Nearby Stays Panel)
-- ============================================================================
INSERT INTO public.accommodations (city_id, name, accommodation_type, lat, lng, est_nightly_min, est_nightly_max, currency, amenities, star_rating, description, google_maps_url, provenance_type, source_provider, source_record_id)
VALUES
('11111111-1111-4111-8111-111111111101', 'Pearl Palace Heritage Hotel', 'hotel', 26.9218, 75.8204, 1500, 3500, 'INR', ARRAY['wifi','ac','breakfast','heritage'], 3.5, 'Boutique heritage hotel in the Pink City with traditional Rajasthani decor.', 'https://www.google.com/maps/search/?api=1&query=Pearl+Palace+Heritage+Hotel+Jaipur', 'dataset_derived', 'curated', 'JAI_ACC_01'),
('11111111-1111-4111-8111-111111111101', 'Zostel Jaipur', 'hostel', 26.9150, 75.8223, 400, 900, 'INR', ARRAY['wifi','common_kitchen','social_spaces','dorm','lockers'], 3.0, 'Popular backpacker hostel near Ajmeri Gate with rooftop terrace and social events.', 'https://www.google.com/maps/search/?api=1&query=Zostel+Jaipur', 'dataset_derived', 'curated', 'JAI_ACC_02'),
('11111111-1111-4111-8111-111111111102', 'Amet Haveli Udaipur', 'hotel', 24.5787, 73.6820, 3500, 8000, 'INR', ARRAY['wifi','pool','lake_view','heritage','restaurant'], 4.0, 'Heritage lakeside haveli with stunning Lake Pichola views and traditional rooms.', 'https://www.google.com/maps/search/?api=1&query=Amet+Haveli+Udaipur', 'dataset_derived', 'curated', 'UDI_ACC_01'),
('11111111-1111-4111-8111-111111111103', 'Casa Bhagava Fontainhas', 'homestay', 15.4953, 73.8320, 1800, 3500, 'INR', ARRAY['wifi','heritage_decor','breakfast','balcony'], 3.5, 'Restored Portuguese-era villa in the Fontainhas Latin Quarter with period furnishings.', 'https://www.google.com/maps/search/?api=1&query=Casa+Bhagava+Fontainhas+Goa', 'dataset_derived', 'curated', 'GOA_ACC_01'),
('11111111-1111-4111-8111-111111111105', 'Apple Country Resort Manali', 'resort', 32.2384, 77.1866, 2500, 6000, 'INR', ARRAY['wifi','mountain_view','bonfire','restaurant','ac'], 3.5, 'Nestled among apple orchards in Old Manali with valley views and cozy cottages.', 'https://www.google.com/maps/search/?api=1&query=Apple+Country+Resort+Manali', 'dataset_derived', 'curated', 'MAN_ACC_01'),
('11111111-1111-4111-8111-111111111106', 'Hostel Piece Kyoto', 'hostel', 35.0080, 135.7698, 2500, 5000, 'INR', ARRAY['wifi','lounge','lockers','bike_rental'], 3.0, 'Centrally located Kyoto hostel near Gion with Japanese-inspired communal spaces.', 'https://www.google.com/maps/search/?api=1&query=Hostel+Piece+Kyoto', 'dataset_derived', 'curated', 'KYO_ACC_01'),
('11111111-1111-4111-8111-111111111108', 'Generator Paris', 'hostel', 48.8730, 2.3760, 4000, 9000, 'INR', ARRAY['wifi','bar','lounge','dorm','private'], 3.5, 'Design hostel near Canal Saint-Martin — part of the Generator boutique hostel chain.', 'https://www.google.com/maps/search/?api=1&query=Generator+Hostel+Paris', 'dataset_derived', 'curated', 'PAR_ACC_01'),
('11111111-1111-4111-8111-111111111110', 'Alaya Ubud Resort', 'resort', -8.5063, 115.2617, 12000, 28000, 'INR', ARRAY['wifi','infinity_pool','spa','jungle_view','breakfast'], 5.0, 'Luxury cliff-edge resort in Ubud with private pool villas overlooking the Ayung River gorge.', 'https://www.google.com/maps/search/?api=1&query=Alaya+Ubud+Resort', 'dataset_derived', 'curated', 'UBD_ACC_01');