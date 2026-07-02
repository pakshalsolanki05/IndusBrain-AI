from pydantic import BaseModel


class EntityResponse(BaseModel):
    id: int
    document: str
    entity: str
    entity_type: str
    value: str | None = None

    class Config:
        from_attributes = True