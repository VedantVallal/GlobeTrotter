from fastapi import APIRouter, HTTPException
from app.schemas.trip import (
    GenerateTripRequest,
    TripDraftResponse,
    ChatRequest,
    ChatResponse,
    ChaosRepairRequest,
    ChaosRepairResponse,
)
from app.services.llm_gateway import (
    plan_trip_orchestrator,
    chat_orchestrator,
    chaos_repair_orchestrator,
)

router = APIRouter()


@router.post("/generate-trip", response_model=TripDraftResponse)
@router.post("/plan-trip", response_model=TripDraftResponse)
async def plan_trip_endpoint(req: GenerateTripRequest):
    """
    Generate or orchestrate a multi-city travel itinerary.
    Uses Tiered LLM: Groq (Llama 3.3) -> Gemini 1.5 -> Deterministic Rule-Based Fallback.
    Always returns strict validated Pydantic JSON.
    """
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    return await plan_trip_orchestrator(req)


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """Conversational Copilot assisting with itinerary customization."""
    return await chat_orchestrator(req)


@router.post("/chaos-repair", response_model=ChaosRepairResponse)
async def chaos_repair_endpoint(req: ChaosRepairRequest):
    """Heuristic repair of schedule disruptions, weather conflicts, and delays."""
    return await chaos_repair_orchestrator(req)
