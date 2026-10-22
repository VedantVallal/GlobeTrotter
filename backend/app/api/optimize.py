from fastapi import APIRouter
from app.schemas.trip import (
    OptimizeRouteRequest,
    OptimizeRouteResponse,
    RouteStopInput,
)
from app.services.route_optimizer import optimize_trip_route

router = APIRouter()


@router.post("", response_model=OptimizeRouteResponse)
@router.post("/", response_model=OptimizeRouteResponse)
@router.post("/route", response_model=OptimizeRouteResponse)
async def optimize_route_endpoint(req: OptimizeRouteRequest):
    """
    Route matrix optimization endpoint using 2-opt heuristic & Haversine distance.
    Respects `is_locked` constraint on pinned stops.
    """
    stops = req.stops
    # Backwards compatibility: If only stop_ids was provided without coordinates
    if not stops and req.stop_ids:
        stops = [
            RouteStopInput(
                id=s_id,
                city_name=f"Stop {idx + 1}",
                lat=26.9124 + (idx * 0.5),
                lng=75.7873 + (idx * 0.5),
                is_locked=False,
            )
            for idx, s_id in enumerate(req.stop_ids)
        ]

    return optimize_trip_route(trip_id=req.trip_id, stops=stops)
