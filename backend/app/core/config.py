from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "IndusBrain AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        env_file = ".env"


settings = Settings()