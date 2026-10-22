-- ============================================================================
-- itinere (GlobeTrotter) — Complete Relational Schema, RLS, Views & Atomic RPCs
-- File: supabase/migrations/001_init.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. CORE TABLES
-- ============================================================================

-- 1.1 PROFILES (Linked 1:1 with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.2 USER PREFERENCES (1:1 with profiles)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    interests TEXT[] NOT NULL DEFAULT '{}',
    pace VARCHAR(20) NOT NULL DEFAULT 'moderate' CHECK (pace IN ('relaxed', 'moderate', 'fast')),
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    preferred_currency CHAR(3) NOT NULL DEFAULT 'INR',
    crowd_preference VARCHAR(20) NOT NULL DEFAULT 'balanced' CHECK (crowd_preference IN ('avoid_crowds', 'balanced', 'popular_first')),
    privacy_level VARCHAR(20) NOT NULL DEFAULT 'private' CHECK (privacy_level IN ('private', 'friends', 'public')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.3 CITIES CATALOG
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL,
    region VARCHAR(100) NOT NULL,
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    lat DOUBLE PRECISION NOT NULL CHECK (lat BETWEEN -90 AND 90),
    lng DOUBLE PRECISION NOT NULL CHECK (lng BETWEEN -180 AND 180),
    cost_index INT NOT NULL CHECK (cost_index BETWEEN 1 AND 5),
    popularity_score INT NOT NULL DEFAULT 50 CHECK (popularity_score BETWEEN 0 AND 100),
    description TEXT NOT NULL,
    source_provider VARCHAR(40) NOT NULL DEFAULT 'curated',
    source_record_id VARCHAR(120),
    source_url TEXT,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (source_provider, source_record_id)
);

-- 1.4 ACTIVITIES / PLACES CATALOG
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(180) NOT NULL,
    category VARCHAR(40) NOT NULL CHECK (category IN ('sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'nightlife', 'nature', 'custom')),
    tags TEXT[] NOT NULL DEFAULT '{}',
    lat DOUBLE PRECISION NOT NULL CHECK (lat BETWEEN -90 AND 90),
    lng DOUBLE PRECISION NOT NULL CHECK (lng BETWEEN -180 AND 180),
    duration_mins INT NOT NULL DEFAULT 90 CHECK (duration_mins > 0),
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (estimated_cost >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    cost_status VARCHAR(20) NOT NULL DEFAULT 'estimated' CHECK (cost_status IN ('official', 'estimated', 'free', 'unknown')),
    is_indoor BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL,
    source_provider VARCHAR(40) NOT NULL DEFAULT 'curated',
    source_record_id VARCHAR(120),
    source_url TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (source_provider, source_record_id)
);

-- 1.5 PLACE IMAGES (Wikimedia Commons & Licensed Attribution Metadata)
CREATE TABLE IF NOT EXISTS public.place_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    source_page_url TEXT NOT NULL,
    creator_name VARCHAR(150) NOT NULL,
    licence_label VARCHAR(80) NOT NULL,
    licence_url TEXT,
    attribution_text TEXT NOT NULL,
    provider VARCHAR(40) NOT NULL DEFAULT 'wikimedia_commons',
    match_method VARCHAR(40) NOT NULL DEFAULT 'curated_qid',
    match_confidence NUMERIC(3, 2) NOT NULL DEFAULT 0.95 CHECK (match_confidence BETWEEN 0 AND 1),
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_place_image_single_target CHECK (
        (city_id IS NOT NULL AND activity_id IS NULL) OR
        (city_id IS NULL AND activity_id IS NOT NULL)
    )
);

-- 1.6 TRIPS ROOT
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed', 'archived')),
    base_currency CHAR(3) NOT NULL DEFAULT 'INR',
    version INT NOT NULL DEFAULT 1 CHECK (version >= 1),
    cover_photo_url TEXT,
    copied_from_trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_valid_trip_dates CHECK (end_date >= start_date)
);

-- 1.7 TRIP STOPS (Ordered Multi-City Sequence)
CREATE TABLE IF NOT EXISTS public.trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT,
    position INT NOT NULL CHECK (position >= 1),
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (trip_id, position)
);

-- 1.8 TRAVEL DATES (1:1 per Trip Stop)
CREATE TABLE IF NOT EXISTS public.travel_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id UUID UNIQUE NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    travel_mode_notes VARCHAR(150),
    CONSTRAINT chk_valid_stop_dates CHECK (departure_date >= arrival_date)
);

-- 1.9 TRIP LEGS (Inter-City Transit)
CREATE TABLE IF NOT EXISTS public.trip_legs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    from_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
    to_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
    mode VARCHAR(30) NOT NULL DEFAULT 'train' CHECK (mode IN ('flight', 'train', 'bus', 'car', 'ferry', 'other')),
    distance_km NUMERIC(8, 2) CHECK (distance_km >= 0),
    duration_mins INT CHECK (duration_mins >= 0),
    is_estimated BOOLEAN NOT NULL DEFAULT TRUE,
    source VARCHAR(50) NOT NULL DEFAULT 'manual_estimate',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE
);

-- 1.10 ITINERARY ACTIVITIES (Scheduled Occurrences inside a Stop)
CREATE TABLE IF NOT EXISTS public.itinerary_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    custom_title VARCHAR(180),
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    position INT NOT NULL CHECK (position >= 1),
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    assigned_member_ids UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_valid_activity_window CHECK (end_time > start_time)
);

-- 1.11 BUDGETS (1:1 with Trips)
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID UNIQUE NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    budget_limit NUMERIC(12, 2) NOT NULL CHECK (budget_limit >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    daily_target NUMERIC(10, 2) CHECK (daily_target >= 0),
    alert_preference BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.12 TRIP COST ITEMS (Canonical Cost Ledger — Replaces duplicate expense columns)
CREATE TABLE IF NOT EXISTS public.trip_cost_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    stop_id UUID REFERENCES public.trip_stops(id) ON DELETE CASCADE,
    itinerary_activity_id UUID UNIQUE REFERENCES public.itinerary_activities(id) ON DELETE CASCADE,
    trip_leg_id UUID REFERENCES public.trip_legs(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL CHECK (category IN ('transport', 'accommodation', 'activity', 'meal', 'other')),
    kind VARCHAR(20) NOT NULL DEFAULT 'estimate' CHECK (kind IN ('estimate', 'actual')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    normalized_amount NUMERIC(10, 2) CHECK (normalized_amount >= 0),
    fx_rate NUMERIC(12, 6) DEFAULT 1.0,
    fx_as_of_date DATE,
    fx_source VARCHAR(40) DEFAULT 'native',
    incurred_date DATE NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.13 SAVED DESTINATIONS (User Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, city_id)
);

-- 1.14 TRIP COLLABORATORS (Group Membership)
CREATE TABLE IF NOT EXISTS public.trip_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('editor', 'viewer')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (trip_id, user_id)
);

-- 1.15 SHARED TRIPS (Revocable Public Links with SHA-256 Token Hashes)
CREATE TABLE IF NOT EXISTS public.shared_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    public_slug VARCHAR(64) UNIQUE NOT NULL,
    token_hash VARCHAR(128) UNIQUE NOT NULL,
    allow_copy BOOLEAN NOT NULL DEFAULT TRUE,
    view_count INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.16 AI CONVERSATIONS (Contextual Chat Memory)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.17 AI ACTION AUDIT (Proposal Lifecycle & Diff Gate)
CREATE TABLE IF NOT EXISTS public.ai_action_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proposal_type VARCHAR(40) NOT NULL CHECK (proposal_type IN ('initial_draft', 'route_optimization', 'budget_rebalance', 'chaos_replan', 'chat_action')),
    trip_version INT NOT NULL,
    structured_diff JSONB NOT NULL,
    explanation TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'rejected', 'expired', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.18 PROVIDER CACHE (Optional JIT Response Cache)
CREATE TABLE IF NOT EXISTS public.provider_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(40) NOT NULL,
    query_key VARCHAR(255) NOT NULL,
    response_json JSONB NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ok',
    UNIQUE (provider, query_key)
);

-- ============================================================================
-- 2. INDEXES FOR FAST SEARCH & JOINS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cities_name_trgm ON public.cities USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cities_country ON public.cities(country_code, region);
CREATE INDEX IF NOT EXISTS idx_activities_city_cat ON public.activities(city_id, category);
CREATE INDEX IF NOT EXISTS idx_activities_name_trgm ON public.activities USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_trips_owner ON public.trips(owner_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip ON public.trip_stops(trip_id, position);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_stop_date ON public.itinerary_activities(stop_id, scheduled_date, position);
CREATE INDEX IF NOT EXISTS idx_trip_cost_items_trip_date ON public.trip_cost_items(trip_id, incurred_date, category);

-- ============================================================================
-- 3. AUTH TRIGGER: AUTO-CREATE PROFILE & PREFERENCES ON SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. CANONICAL BUDGET VIEWS (Single Source of Truth for Budget & Dashboard)
-- ============================================================================

CREATE OR REPLACE VIEW public.v_trip_budget_breakdown AS
SELECT
    t.id AS trip_id,
    t.owner_id,
    t.title AS trip_title,
    t.base_currency,
    (t.end_date - t.start_date + 1) AS inclusive_trip_days,
    COALESCE(b.budget_limit, 0) AS budget_limit,
    COALESCE(b.daily_target, CASE WHEN (t.end_date - t.start_date + 1) > 0 THEN ROUND(COALESCE(b.budget_limit, 0) / (t.end_date - t.start_date + 1), 2) ELSE 0 END) AS daily_budget_target,
    COALESCE(SUM(CASE WHEN c.kind = 'estimate' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS planned_total,
    COALESCE(SUM(CASE WHEN c.kind = 'actual' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS actual_total,
    COALESCE(SUM(CASE WHEN c.category = 'transport' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS transport_total,
    COALESCE(SUM(CASE WHEN c.category = 'accommodation' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS accommodation_total,
    COALESCE(SUM(CASE WHEN c.category = 'activity' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS activity_total,
    COALESCE(SUM(CASE WHEN c.category = 'meal' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS meal_total,
    COALESCE(SUM(CASE WHEN c.category = 'other' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS other_total,
    ROUND(
        COALESCE(SUM(CASE WHEN c.kind = 'estimate' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0)
        / GREATEST((t.end_date - t.start_date + 1), 1),
        2
    ) AS avg_planned_cost_per_day,
    COALESCE(b.budget_limit, 0) - COALESCE(SUM(CASE WHEN c.kind = 'estimate' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS remaining_budget,
    CASE
        WHEN COALESCE(b.budget_limit, 0) > 0 AND COALESCE(SUM(CASE WHEN c.kind = 'estimate' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) > b.budget_limit
        THEN TRUE
        ELSE FALSE
    END AS is_over_budget,
    COUNT(CASE WHEN c.currency <> t.base_currency AND c.normalized_amount IS NULL THEN 1 END) AS unconverted_item_count
FROM public.trips t
LEFT JOIN public.budgets b ON b.trip_id = t.id
LEFT JOIN public.trip_cost_items c ON c.trip_id = t.id
GROUP BY t.id, b.budget_limit, b.daily_target;

CREATE OR REPLACE VIEW public.v_trip_daily_budget AS
SELECT
    c.trip_id,
    c.incurred_date,
    t.base_currency,
    COALESCE(SUM(CASE WHEN c.kind = 'estimate' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS planned_day_total,
    COALESCE(SUM(CASE WHEN c.kind = 'actual' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0) AS actual_day_total,
    COALESCE(b.daily_target, ROUND(COALESCE(b.budget_limit, 0) / GREATEST((t.end_date - t.start_date + 1), 1), 2)) AS daily_limit,
    CASE
        WHEN COALESCE(b.budget_limit, 0) > 0
             AND COALESCE(SUM(CASE WHEN c.kind = 'estimate' THEN COALESCE(c.normalized_amount, c.amount) ELSE 0 END), 0)
                 > COALESCE(b.daily_target, ROUND(COALESCE(b.budget_limit, 0) / GREATEST((t.end_date - t.start_date + 1), 1), 2))
        THEN TRUE
        ELSE FALSE
    END AS is_day_over_budget
FROM public.trip_cost_items c
JOIN public.trips t ON t.id = c.trip_id
LEFT JOIN public.budgets b ON b.trip_id = t.id
GROUP BY c.trip_id, c.incurred_date, t.base_currency, t.start_date, t.end_date, b.budget_limit, b.daily_target;

-- ============================================================================
-- 5. ATOMIC POSTGRESQL RPC FUNCTIONS
-- ============================================================================

-- 5.1 Helper: Check if current user can edit a trip
CREATE OR REPLACE FUNCTION public.can_edit_trip(p_trip_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.trips WHERE id = p_trip_id AND owner_id = p_user_id
        UNION ALL
        SELECT 1 FROM public.trip_collaborators WHERE trip_id = p_trip_id AND user_id = p_user_id AND role = 'editor'
    );
$$;

-- 5.2 Helper: Check if current user can view a trip
CREATE OR REPLACE FUNCTION public.can_view_trip(p_trip_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.trips WHERE id = p_trip_id AND owner_id = p_user_id
        UNION ALL
        SELECT 1 FROM public.trip_collaborators WHERE trip_id = p_trip_id AND user_id = p_user_id
    );
$$;

-- 5.3 RPC: Atomic Stop Reordering with Optimistic Concurrency Check
CREATE OR REPLACE FUNCTION public.reorder_trip_stops(
    p_trip_id UUID,
    p_expected_version INT,
    p_ordered_stop_ids UUID[]
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_version INT;
    v_new_version INT;
    v_idx INT;
BEGIN
    IF NOT public.can_edit_trip(p_trip_id, auth.uid()) THEN
        RAISE EXCEPTION 'FORBIDDEN: User is not authorized to edit this trip.';
    END IF;

    SELECT version INTO v_current_version FROM public.trips WHERE id = p_trip_id FOR UPDATE;
    IF v_current_version IS NULL THEN
        RAISE EXCEPTION 'NOT_FOUND: Trip does not exist.';
    END IF;

    IF v_current_version <> p_expected_version THEN
        RAISE EXCEPTION 'VERSION_CONFLICT: Expected version %, but current version is %.', p_expected_version, v_current_version;
    END IF;

    -- Phase 1: Shift positions to temporary offset to avoid unique constraint collisions
    UPDATE public.trip_stops
    SET position = position + 10000
    WHERE trip_id = p_trip_id;

    -- Phase 2: Assign new sequential positions
    FOR v_idx IN 1..array_length(p_ordered_stop_ids, 1) LOOP
        UPDATE public.trip_stops
        SET position = v_idx
        WHERE id = p_ordered_stop_ids[v_idx] AND trip_id = p_trip_id;
    END LOOP;

    v_new_version := v_current_version + 1;
    UPDATE public.trips
    SET version = v_new_version, updated_at = NOW()
    WHERE id = p_trip_id;

    RETURN v_new_version;
END;
$$;

-- 5.4 RPC: Fork / Copy a Shared Trip (Off-Page Connector [5])
CREATE OR REPLACE FUNCTION public.fork_trip(
    p_raw_share_token TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_hash VARCHAR(128);
    v_source_trip_id UUID;
    v_new_trip_id UUID;
    v_stop_record RECORD;
    v_new_stop_id UUID;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'UNAUTHENTICATED: Must be signed in to copy a trip.';
    END IF;

    v_token_hash := encode(digest(p_raw_share_token, 'sha256'), 'hex');

    SELECT trip_id INTO v_source_trip_id
    FROM public.shared_trips
    WHERE (token_hash = v_token_hash OR public_slug = p_raw_share_token)
      AND revoked_at IS NULL
      AND allow_copy = TRUE
      AND (expires_at IS NULL OR expires_at > NOW())
    LIMIT 1;

    IF v_source_trip_id IS NULL THEN
        RAISE EXCEPTION 'NOT_FOUND: Share link is invalid, expired, or does not permit copying.';
    END IF;

    -- 1. Clone Trip Root
    INSERT INTO public.trips (owner_id, title, description, start_date, end_date, status, base_currency, cover_photo_url, copied_from_trip_id)
    SELECT auth.uid(), title || ' (Copy)', description, start_date, end_date, 'planning', base_currency, cover_photo_url, id
    FROM public.trips
    WHERE id = v_source_trip_id
    RETURNING id INTO v_new_trip_id;

    -- 2. Clone Budget Configuration
    INSERT INTO public.budgets (trip_id, budget_limit, currency, daily_target, alert_preference)
    SELECT v_new_trip_id, budget_limit, currency, daily_target, alert_preference
    FROM public.budgets
    WHERE trip_id = v_source_trip_id;

    -- 3. Clone Stops, Travel Dates, Scheduled Activities & Planned Estimate Costs
    FOR v_stop_record IN
        SELECT * FROM public.trip_stops WHERE trip_id = v_source_trip_id ORDER BY position ASC
    LOOP
        INSERT INTO public.trip_stops (trip_id, city_id, position, is_locked, notes)
        VALUES (v_new_trip_id, v_stop_record.city_id, v_stop_record.position, FALSE, v_stop_record.notes)
        RETURNING id INTO v_new_stop_id;

        INSERT INTO public.travel_dates (stop_id, arrival_date, departure_date, timezone, travel_mode_notes)
        SELECT v_new_stop_id, arrival_date, departure_date, timezone, travel_mode_notes
        FROM public.travel_dates
        WHERE stop_id = v_stop_record.id;

        INSERT INTO public.itinerary_activities (stop_id, activity_id, custom_title, scheduled_date, start_time, end_time, position, timezone, is_locked, notes)
        SELECT v_new_stop_id, activity_id, custom_title, scheduled_date, start_time, end_time, position, timezone, FALSE, notes
        FROM public.itinerary_activities
        WHERE stop_id = v_stop_record.id;
    END LOOP;

    -- 4. Clone Estimate Cost Items Only (Never copy private actual expenses)
    INSERT INTO public.trip_cost_items (trip_id, category, kind, amount, currency, normalized_amount, incurred_date, description)
    SELECT v_new_trip_id, category, 'estimate', amount, currency, normalized_amount, incurred_date, description
    FROM public.trip_cost_items
    WHERE trip_id = v_source_trip_id AND kind = 'estimate';

    RETURN v_new_trip_id;
END;
$$;

-- ============================================================================
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_legs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_action_audit ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Catalog Tables
CREATE POLICY "Public catalog cities readable by all" ON public.cities FOR SELECT USING (TRUE);
CREATE POLICY "Public catalog activities readable by all" ON public.activities FOR SELECT USING (TRUE);
CREATE POLICY "Public catalog place_images readable by all" ON public.place_images FOR SELECT USING (TRUE);

-- Profile & Preferences Policies
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saved destinations" ON public.saved_destinations FOR ALL USING (auth.uid() = user_id);

-- Trip & Child Table Policies
CREATE POLICY "Users view accessible trips" ON public.trips FOR SELECT USING (public.can_view_trip(id, auth.uid()));
CREATE POLICY "Users insert own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners and editors update trips" ON public.trips FOR UPDATE USING (public.can_edit_trip(id, auth.uid()));
CREATE POLICY "Owners delete own trips" ON public.trips FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "View trip stops" ON public.trip_stops FOR SELECT USING (public.can_view_trip(trip_id, auth.uid()));
CREATE POLICY "Edit trip stops" ON public.trip_stops FOR ALL USING (public.can_edit_trip(trip_id, auth.uid()));

CREATE POLICY "View travel dates" ON public.travel_dates FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trip_stops s WHERE s.id = stop_id AND public.can_view_trip(s.trip_id, auth.uid()))
);
CREATE POLICY "Edit travel dates" ON public.travel_dates FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trip_stops s WHERE s.id = stop_id AND public.can_edit_trip(s.trip_id, auth.uid()))
);

CREATE POLICY "View itinerary activities" ON public.itinerary_activities FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trip_stops s WHERE s.id = stop_id AND public.can_view_trip(s.trip_id, auth.uid()))
);
CREATE POLICY "Edit itinerary activities" ON public.itinerary_activities FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trip_stops s WHERE s.id = stop_id AND public.can_edit_trip(s.trip_id, auth.uid()))
);

CREATE POLICY "View budgets" ON public.budgets FOR SELECT USING (public.can_view_trip(trip_id, auth.uid()));
CREATE POLICY "Edit budgets" ON public.budgets FOR ALL USING (public.can_edit_trip(trip_id, auth.uid()));

CREATE POLICY "View cost items" ON public.trip_cost_items FOR SELECT USING (public.can_view_trip(trip_id, auth.uid()));
CREATE POLICY "Edit cost items" ON public.trip_cost_items FOR ALL USING (public.can_edit_trip(trip_id, auth.uid()));

CREATE POLICY "View AI conversations" ON public.ai_conversations FOR SELECT USING (public.can_view_trip(trip_id, auth.uid()));
CREATE POLICY "Edit AI conversations" ON public.ai_conversations FOR ALL USING (public.can_edit_trip(trip_id, auth.uid()));

CREATE POLICY "View AI action audit" ON public.ai_action_audit FOR SELECT USING (public.can_view_trip(trip_id, auth.uid()));
CREATE POLICY "Edit AI action audit" ON public.ai_action_audit FOR ALL USING (public.can_edit_trip(trip_id, auth.uid()));