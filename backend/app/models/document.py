from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Document(Base):

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String, nullable=False)

    file_type = Column(String)

    size_kb = Column(String)

    pages = Column(Integer)

    words = Column(Integer)

    characters = Column(Integer)

    preview = Column(String)