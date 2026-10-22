from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date


class ActivityDraft(BaseModel):
    name: str = Field(..., description="Name of attraction or experience")
    category: str = Field(default="sightseeing", description="Category: sightseeing, food, adventure, culture, relaxation")
    duration_mins: int = Field(default=90, description="Estimated duration in minutes")
    estimated_cost: float = Field(default=0.0, description="Estimated expense in local currency")
    currency: str = Field(default="INR")
    start_time: str = Field(default="10:00")
    end_time: str = Field(default="12:00")
    is_indoor: bool = Field(default=False)
    notes: Optional[str] = None


class CityStopDraft(BaseModel):
    city_name: str
    country: str
    lat: float
    lng: float
    arrival_day: int = Field(default=1, description="1-indexed day of arrival in trip")
    nights: int = Field(default=2, description="Number of nights staying")
    highlights: List[str] = []
    activities: List[ActivityDraft] = []
    estimated_lodging_per_night: float = 2500.0


class GenerateTripRequest(BaseModel):
    prompt: str = Field(..., min_length=3, description="Traveler prompt or brief")
    duration_days: Optional[int] = Field(default=7, ge=1, le=30)
    budget_limit: Optional[float] = Field(default=50000.0, ge=0)
    base_currency: Optional[str] = Field(default="INR")
    travel_style: Optional[str] = Field(default="balanced", description="budget, balanced, luxury, adventure, cultural")
    user_id: Optional[str] = None


class TripDraftResponse(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: str
    end_date: str
    base_currency: str = "INR"
    total_estimated_cost: float = 0.0
    suggested_cities: List[CityStopDraft] = []
    provenance: str = "ai_estimated"


class RouteStopInput(BaseModel):
    id: str
    city_name: str
    lat: float
    lng: float
    is_locked: bool = Field(default=False, description="Whether stop position is pinned and immutable")
    position: Optional[int] = None


class OptimizeRouteRequest(BaseModel):
    trip_id: str
    expected_version: Optional[int] = 1
    stops: List[RouteStopInput] = []
    # Backwards compatibility with stop_ids list
    stop_ids: Optional[List[str]] = None


class OptimizedLeg(BaseModel):
    from_stop_id: str
    to_stop_id: str
    distance_km: float
    duration_mins: int


class OptimizeRouteResponse(BaseModel):
    trip_id: str
    optimized_stop_ids: List[str]
    optimized_stops: List[RouteStopInput] = []
    legs: List[OptimizedLeg] = []
    estimated_total_km: float = 0.0
    estimated_duration_mins: int = 0
    solver_used: str = "2-opt-haversine"


class ChatMessage(BaseModel):
    role: str = Field(..., description="user or assistant")
    content: str


class ChatRequest(BaseModel):
    trip_id: Optional[str] = None
    messages: List[ChatMessage]
    trip_context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []


class ChaosRepairRequest(BaseModel):
    trip_id: str
    issue_type: str = Field(..., description="rain_disruption, activity_conflict, transport_delay")
    affected_date: Optional[str] = None
    stops: List[Dict[str, Any]] = []


class ChaosRepairResponse(BaseModel):
    trip_id: str
    repaired: bool = True
    summary: str
    applied_changes: List[str] = []
    repaired_stops: List[Dict[str, Any]] = []


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "itinere-compute-plane"
    version: str = "0.2.0"
    llm_providers: Dict[str, bool]
