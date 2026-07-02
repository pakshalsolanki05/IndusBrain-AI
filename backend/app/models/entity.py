from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)

    document = Column(String, nullable=False)

    entity = Column(String, nullable=False)

    entity_type = Column(String, nullable=False)

    value = Column(String, nullable=True)