from fastapi import APIRouter
from app.api.relationship import router as relationship_router
from app.api.dashboard import router as dashboard_router
from app.api.upload import router as upload_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router
from app.api.entity import router as entity_router
from app.api.document_messages import router as document_messages_router
from app.api.document_chat import router as document_chat_router
from app.api.document_summary import router as document_summary_router
from app.api.search import router as search_router
from app.api.auth import router as auth_router
from app.api.knowledge_graph import router as knowledge_graph_router
from app.api.copilot import router as copilot_router

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


router.include_router(auth_router)

router.include_router(dashboard_router)

router.include_router(upload_router)

router.include_router(documents_router)

router.include_router(chat_router)

router.include_router(entity_router)

router.include_router(document_chat_router)

router.include_router(document_summary_router)

router.include_router(document_messages_router)

router.include_router(search_router)

router.include_router(knowledge_graph_router)

router.include_router(relationship_router)

router.include_router(copilot_router)