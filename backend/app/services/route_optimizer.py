import math
from typing import List, Tuple
from app.schemas.trip import RouteStopInput, OptimizeRouteResponse, OptimizedLeg


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Haversine great-circle distance between two GPS coordinates in km."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)


def calculate_route_distance(stops: List[RouteStopInput]) -> float:
    """Calculate total sequential distance of a stop sequence."""
    total = 0.0
    for i in range(len(stops) - 1):
        total += haversine_km(
            stops[i].lat, stops[i].lng, stops[i + 1].lat, stops[i + 1].lng
        )
    return round(total, 2)


def solve_2opt(stops: List[RouteStopInput]) -> List[RouteStopInput]:
    """
    2-Opt TSP Route Optimizer that strictly respects `is_locked` stops.
    Locked stops cannot be relocated from their fixed sequence position.
    """
    n = len(stops)
    if n <= 2:
        return list(stops)

    current_route = list(stops)
    best_distance = calculate_route_distance(current_route)
    improved = True
    iterations = 0
    max_iterations = 50

    while improved and iterations < max_iterations:
        improved = False
        iterations += 1

        for i in range(n - 1):
            for j in range(i + 1, n):
                # Do not move if either endpoint is locked
                if current_route[i].is_locked or current_route[j].is_locked:
                    continue

                # Check any locked nodes inside the reversal segment [i+1 : j]
                sub_segment = current_route[i : j + 1]
                has_locked_inside = any(s.is_locked for s in sub_segment)
                if has_locked_inside:
                    continue

                # Perform 2-opt reversal
                new_route = (
                    current_route[:i]
                    + list(reversed(current_route[i : j + 1]))
                    + current_route[j + 1 :]
                )
                new_distance = calculate_route_distance(new_route)

                if new_distance < best_distance - 0.05:
                    current_route = new_route
                    best_distance = new_distance
                    improved = True
                    break
            if improved:
                break

    return current_route


def optimize_trip_route(
    trip_id: str, stops: List[RouteStopInput]
) -> OptimizeRouteResponse:
    """
    Optimize stops using bounded 2-opt heuristic with Haversine distance matrix.
    Generates leg-by-leg metrics and estimated duration.
    """
    if not stops:
        return OptimizeRouteResponse(
            trip_id=trip_id,
            optimized_stop_ids=[],
            optimized_stops=[],
            legs=[],
            estimated_total_km=0.0,
            estimated_duration_mins=0,
            solver_used="empty-pass",
        )

    optimized_stops = solve_2opt(stops)
    legs: List[OptimizedLeg] = []
    total_km = 0.0
    total_mins = 0

    for i in range(len(optimized_stops) - 1):
        s1 = optimized_stops[i]
        s2 = optimized_stops[i + 1]
        dist = haversine_km(s1.lat, s1.lng, s2.lat, s2.lng)
        # Average ground transit speed: 65 km/h + 25 min boarding/terminal time
        dur = int(round((dist / 65.0) * 60.0 + 25.0)) if dist > 0 else 0
        legs.append(
            OptimizedLeg(
                from_stop_id=s1.id,
                to_stop_id=s2.id,
                distance_km=dist,
                duration_mins=dur,
            )
        )
        total_km += dist
        total_mins += dur

    return OptimizeRouteResponse(
        trip_id=trip_id,
        optimized_stop_ids=[s.id for s in optimized_stops],
        optimized_stops=optimized_stops,
        legs=legs,
        estimated_total_km=round(total_km, 2),
        estimated_duration_mins=total_mins,
        solver_used="2-opt-haversine-bounded",
    )
