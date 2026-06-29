from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def root():
    return {
        "message": "Welcome to IndusBrain AI 🚀"
    }


@router.get("/health")
async def health():
    return {
        "status": "healthy"
    }