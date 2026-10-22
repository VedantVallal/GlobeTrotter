import os
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        from pydantic import BaseModel

        class BaseSettings(BaseModel):
            def __init__(self, **kwargs):
                super().__init__(**kwargs)
                for field in self.model_fields if hasattr(self, 'model_fields') else self.__fields__:
                    env_val = os.getenv(field) or os.getenv(field.upper())
                    if env_val is not None:
                        setattr(self, field, env_val)


class Settings(BaseSettings):
    PROJECT_NAME: str = "itinere-compute-plane"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://192.168.101.1:3000"

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
