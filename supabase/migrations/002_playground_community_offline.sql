-- ============================================================================
-- itinere — Upgrade Migration: Playground Graph, 9-Category Budget Provenance,
-- Split Expenses, Nearby Accommodations, Community Ratings & Offline Support
-- File: supabase/migrations/002_playground_community_offline.sql
-- ============================================================================

-- 1. Add Playground Canvas Coordinates (Decoupled from chronological order!)
ALTER TABLE public.trip_stops
    ADD COLUMN IF NOT EXISTS canvas_x DOUBLE PRECISION DEFAULT 0,
    ADD COLUMN IF NOT EXISTS canvas_y DOUBLE PRECISION DEFAULT 0;

ALTER TABLE public.itinerary_activities
    ADD COLUMN IF NOT EXISTS canvas_x DOUBLE PRECISION DEFAULT 0,
    ADD COLUMN IF NOT EXISTS canvas_y DOUBLE PRECISION DEFAULT 0;

-- 2. Upgrade Canonical Cost Ledger to 9 Categories + Provenance + Group Expense Splitting
ALTER TABLE public.trip_cost_items DROP CONSTRAINT IF EXISTS trip_cost_items_category_check;
ALTER TABLE public.trip_cost_items
    ADD CONSTRAINT trip_cost_items_category_check CHECK (
        category IN (
            'intercity_transport', 'local_transport', 'accommodation',
            'food_beverage', 'activity_tickets', 'tours_experiences',
            'taxes_fees', 'contingency', 'other',
            'transport', 'activity', 'meal' -- backwards-compatible aliases
        )
    );

ALTER TABLE public.trip_cost_items
    ADD COLUMN IF NOT EXISTS provenance_type VARCHAR(30) NOT NULL DEFAULT 'dataset_derived'
        CHECK (provenance_type IN ('official_quoted', 'published_price', 'dataset_derived', 'community_reported', 'ai_estimated', 'user_entered')),
    ADD COLUMN IF NOT EXISTS confidence_level VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (confidence_level IN ('high', 'medium', 'low')),
    ADD COLUMN IF NOT EXISTS paid_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS split_among_user_ids UUID[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- 3. Nearby Accommodations / Stays Catalog (Secondary Explorer Section)
CREATE TABLE IF NOT EXISTS public.accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(180) NOT NULL,
    stay_type VARCHAR(40) NOT NULL DEFAULT 'hotel' CHECK (stay_type IN ('hotel', 'hostel', 'resort', 'homestay', 'guesthouse', 'camp')),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    est_nightly_min NUMERIC(10, 2) NOT NULL CHECK (est_nightly_min >= 0),
    est_nightly_max NUMERIC(10, 2) NOT NULL CHECK (est_nightly_max >= est_nightly_min),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    price_provenance VARCHAR(30) NOT NULL DEFAULT 'dataset_derived',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    google_maps_url TEXT NOT NULL,
    official_or_osm_url TEXT,
    source_provider VARCHAR(40) NOT NULL DEFAULT 'curated_osm',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Community Itinerary Ratings, Comments & Clones (Separated from Google Place Ratings)
ALTER TABLE public.shared_trips
    ADD COLUMN IF NOT EXISTS travel_style VARCHAR(40) DEFAULT 'balanced',
    ADD COLUMN IF NOT EXISTS indicative_budget NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS currency CHAR(3) DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS clone_count INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS upvote_count INT NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.community_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shared_trip_id UUID NOT NULL REFERENCES public.shared_trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (shared_trip_id, user_id)
);

-- 5. Reference Currency Exchange Rates Table (Fallback for Offline / Frankfurter API)
CREATE TABLE IF NOT EXISTS public.currency_rates (
    base_currency CHAR(3) NOT NULL,
    target_currency CHAR(3) NOT NULL,
    rate NUMERIC(14, 6) NOT NULL CHECK (rate > 0),
    rate_source VARCHAR(60) NOT NULL DEFAULT 'Frankfurter ECB Reference',
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (base_currency, target_currency)
);

INSERT INTO public.currency_rates (base_currency, target_currency, rate, rate_source) VALUES
('INR', 'USD', 0.011900, 'Stored ECB Reference Fallback'),
('USD', 'INR', 84.030000, 'Stored ECB Reference Fallback'),
('INR', 'EUR', 0.011000, 'Stored ECB Reference Fallback'),
('EUR', 'INR', 90.900000, 'Stored ECB Reference Fallback'),
('INR', 'JPY', 1.820000, 'Stored ECB Reference Fallback'),
('JPY', 'INR', 0.549000, 'Stored ECB Reference Fallback')
ON CONFLICT (base_currency, target_currency) DO NOTHING;

-- 6. Seed Sample Nearby Stays with Real Google Maps Deep Links
INSERT INTO public.accommodations (city_id, name, stay_type, lat, lng, est_nightly_min, est_nightly_max, currency, amenities, google_maps_url) VALUES
('11111111-1111-4111-8111-111111111101', 'Zostel Jaipur (MI Road Heritage Hostel)', 'hostel', 26.9196, 75.8235, 700, 1500, 'INR', ARRAY['Wi-Fi','Rooftop Cafe','Backpacker Lounge'], 'https://www.google.com/maps/search/?api=1&query=Zostel+Jaipur+Rajasthan'),
('11111111-1111-4111-8111-111111111101', 'Pearl Palace Heritage Boutique Stay', 'guesthouse', 26.9152, 75.7928, 2800, 4500, 'INR', ARRAY['Heritage Decor','Restaurant','Courtyard'], 'https://www.google.com/maps/search/?api=1&query=Pearl+Palace+Heritage+Jaipur'),
('11111111-1111-4111-8111-111111111102', 'Jagat Niwas Palace Hotel (Lake Pichola)', 'hotel', 24.5775, 73.6811, 4500, 8000, 'INR', ARRAY['Lake View','Haveli Architecture','Rooftop Dining'], 'https://www.google.com/maps/search/?api=1&query=Jagat+Niwas+Palace+Hotel+Udaipur'),
('11111111-1111-4111-8111-111111111105', 'Old Manali Cedar Alpine Homestay & Camp', 'homestay', 32.2568, 77.1752, 1200, 2600, 'INR', ARRAY['Mountain View','Heater','Bonfire','Offline Backup Power'], 'https://www.google.com/maps/search/?api=1&query=Old+Manali+Homestay+Himachal+Pradesh');

-- Enable RLS on new tables
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read accommodations" ON public.accommodations FOR SELECT USING (TRUE);
CREATE POLICY "Public read currency_rates" ON public.currency_rates FOR SELECT USING (TRUE);
CREATE POLICY "Public read community_reviews" ON public.community_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users post community_reviews" ON public.community_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);