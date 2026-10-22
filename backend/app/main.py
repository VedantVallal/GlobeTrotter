from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.health import router as health_router
from app.api.ai import router as ai_router
from app.api.optimize import router as optimize_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="itinere compute & AI orchestration service — Groq, Gemini & 2-Opt TSP engine",
    version="0.2.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if settings.cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers under /api/v1
app.include_router(health_router, prefix="/api/v1", tags=["Health"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(ai_router, prefix="/api/v1", tags=["AI Direct"])
app.include_router(optimize_router, prefix="/api/v1/optimize", tags=["Optimization"])


@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "docs": "/docs",
        "health": "/api/v1/health",
        "endpoints": [
            "/api/v1/plan-trip",
            "/api/v1/ai/generate-trip",
            "/api/v1/optimize",
            "/api/v1/optimize/route",
            "/api/v1/chat",
            "/api/v1/chaos-repair",
        ],
    }
