from sqlalchemy.orm import Session
from app.models.user import User
from app.models.user import User


def get_user_by_email(
    db: Session,
    email: str,
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def create_user(
    db: Session,
    full_name: str,
    email: str,
    password_hash: str,
):

    user = User(
        full_name=full_name,
        email=email,
        password_hash=password_hash,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def update_user(
    db,
    user: User,
    full_name: str,
    email: str,
):
    user.full_name = full_name
    user.email = email

    db.commit()
    db.refresh(user)

    return user


def update_password(
    db,
    user: User,
    password_hash: str,
):
    user.password_hash = password_hash

    db.commit()
    db.refresh(user)

    return user


def delete_user(
    db,
    user: User,
):
    db.delete(user)
    db.commit()