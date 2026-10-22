from fastapi import APIRouter
from app.schemas.trip import HealthResponse
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        service="itinere-compute-plane",
        version="0.2.0",
        llm_providers={
            "groq": bool(settings.GROQ_API_KEY),
            "gemini": bool(settings.GEMINI_API_KEY),
            "rule_based_catalog": True,
        },
    )
