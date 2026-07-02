from fastapi import APIRouter
from app.api.dashboard import router as dashboard_router
from app.api.upload import router as upload_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router
from app.api.entity import router as entity_router

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

router.include_router(dashboard_router)
router.include_router(upload_router)
router.include_router(documents_router)
router.include_router(chat_router)
router.include_router(entity_router)