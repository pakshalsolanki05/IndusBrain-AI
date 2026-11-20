from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.security.dependencies import get_current_user
from app.services.billing_service import get_balance

router = APIRouter(prefix="/credits", tags=["Credits"])

@router.get("/")
def credit_balance(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return {"balance": get_balance(db, user.id), "expires": False}
