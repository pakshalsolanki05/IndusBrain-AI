from fastapi import Cookie, Depends, HTTPException
from jose import JWTError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.user_repository import get_user_by_id
from app.security.jwt import verify_token


def get_current_user(
    db: Session = Depends(get_db),
    access_token: str | None = Cookie(default=None),
):
    if access_token is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated.",
        )

    try:
        payload = verify_token(access_token)

        user_id = int(payload["sub"])

        user = get_user_by_id(
            db,
            user_id,
        )

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found.",
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token.",
        )