import uuid
from typing import Optional
from uuid import UUID

from fastapi_users import schemas
from pydantic import BaseModel


class UserRead(schemas.BaseUser[uuid.UUID]):
    pass


class UserCreate(schemas.BaseUserCreate):
    name: Optional[str] = ""
    phone: Optional[str] = ""
    avatar: Optional[str] = ""


class UserUpdate(schemas.BaseUserUpdate):
    pass


class ItemBase(BaseModel):
    name: str
    description: str | None = None
    quantity: int | None = None


class ItemCreate(ItemBase):
    pass


class ItemRead(ItemBase):
    id: UUID
    user_id: UUID

    model_config = {"from_attributes": True}
