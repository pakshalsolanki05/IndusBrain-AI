from fastapi import Response
from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from app.security.dependencies import (
    get_current_user,
)
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.repositories.user_repository import (
    create_user,
    get_user_by_email,
    update_user,
    update_password,
    delete_user,
)

from app.schemas.user_schema import (
    RegisterRequest,
    LoginRequest,
    UpdateProfileRequest,
    ChangePasswordRequest,
)

from app.schemas.user_schema import (
    RegisterRequest,
    LoginRequest,
)

from app.security.hash import (
    hash_password,
    verify_password,
)

from app.security.jwt import (
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):

    existing = get_user_by_email(
        db,
        request.email,
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    user = create_user(
        db,
        full_name=request.full_name,
        email=request.email,
        password_hash=hash_password(
            request.password
        ),
    )

    return {
        "message": "Registration successful.",
        "user_id": user.id,
    }


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):

    user = get_user_by_email(
        db,
        request.email,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials.",
        )

    if not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials.",
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
        }
    )

    response = JSONResponse(
        content={
            "message": "Login successful.",
            "user": {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
            },
        }
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        max_age=60 * 15,
    )

    return response

@router.post("/logout")
def logout():

    response = JSONResponse(
        content={
            "message": "Logged out successfully."
        }
    )

    response.delete_cookie(
        key="access_token",
        path="/",
    )

    return response

@router.get("/me")
def me(
    user=Depends(get_current_user),
):
    return user

@router.put("/profile")
def update_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = get_user_by_email(db, request.email)

    if existing and existing.id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Email already exists.",
        )

    user = update_user(
        db=db,
        user=current_user,
        full_name=request.full_name,
        email=request.email,
    )

    return {
        "message": "Profile updated successfully.",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
        },
    }

@router.put("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not verify_password(
        request.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect.",
        )

    update_password(
        db=db,
        user=current_user,
        password_hash=hash_password(
            request.new_password
        ),
    )

    return {
        "message": "Password updated successfully."
    }

@router.delete("/delete-account")
def remove_account(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    delete_user(
        db=db,
        user=current_user,
    )

    response = JSONResponse(
        content={
            "message": "Account deleted successfully."
        }
    )

    response.delete_cookie(
        key="access_token",
        path="/",
    )

    return response