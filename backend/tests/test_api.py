import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.route_optimizer import (
    haversine_km,
    solve_2opt,
    optimize_trip_route,
)
from app.schemas.trip import RouteStopInput

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "llm_providers" in data
    assert data["llm_providers"]["rule_based_catalog"] is True


def test_plan_trip_endpoint():
    payload = {
        "prompt": "7 days in Rajasthan exploring Jaipur and Udaipur palaces",
        "duration_days": 7,
        "budget_limit": 50000,
        "base_currency": "INR",
        "travel_style": "balanced",
    }
    response = client.post("/api/v1/plan-trip", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert len(data["suggested_cities"]) > 0
    assert data["base_currency"] == "INR"
    assert data["total_estimated_cost"] > 0
    assert data["suggested_cities"][0]["city_name"] == "Jaipur"


def test_haversine_distance():
    # Delhi (28.6139, 77.2090) to Jaipur (26.9124, 75.7873) is ~235-245 km
    dist = haversine_km(28.6139, 77.2090, 26.9124, 75.7873)
    assert 220 < dist < 260


def test_2opt_respects_is_locked():
    # 4 stops: A, B, C, D
    stops = [
        RouteStopInput(id="1", city_name="Delhi", lat=28.6139, lng=77.2090, is_locked=True),
        RouteStopInput(id="2", city_name="Udaipur", lat=24.5854, lng=73.7125, is_locked=False),
        RouteStopInput(id="3", city_name="Jaipur", lat=26.9124, lng=75.7873, is_locked=False),
        RouteStopInput(id="4", city_name="Jodhpur", lat=26.2389, lng=73.0243, is_locked=True),
    ]

    res = optimize_trip_route(trip_id="trip-123", stops=stops)
    assert res.trip_id == "trip-123"
    assert len(res.optimized_stops) == 4
    # Locked stops must stay at their pinned indices (index 0 and index 3)
    assert res.optimized_stops[0].id == "1"
    assert res.optimized_stops[3].id == "4"
    assert res.estimated_total_km > 0
    assert len(res.legs) == 3


def test_chat_endpoint():
    payload = {
        "messages": [{"role": "user", "content": "How many days should I stay in Jaipur?"}]
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["suggested_actions"]) > 0


def test_chaos_repair_endpoint():
    payload = {
        "trip_id": "trip-test",
        "issue_type": "rain_disruption",
        "stops": [],
    }
    response = client.post("/api/v1/chaos-repair", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["repaired"] is True
    assert len(data["applied_changes"]) > 0
