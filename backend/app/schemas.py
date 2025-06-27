# app/schemas.py
from pydantic import BaseModel, EmailStr, UUID4
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    manager = "manager"
    employee = "employee"

class Sentiment(str, Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Role

class UserCreate(UserBase):
    password: str
    manager_id: Optional[UUID4] = None

class UserOut(UserBase):
    id: UUID4
    manager_id: Optional[UUID4]

    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[UUID4]
    role: Optional[Role]

# --- Feedback Schemas ---
class FeedbackBase(BaseModel):
    strengths: Optional[str]
    areas_to_improve: Optional[str]
    sentiment: Sentiment

class FeedbackCreate(FeedbackBase):
    employee_id: UUID4

class FeedbackOut(FeedbackBase):
    id: UUID4
    manager_id: UUID4
    employee_id: UUID4
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# --- Acknowledgement Schema ---
class AcknowledgementOut(BaseModel):
    id: UUID4
    feedback_id: UUID4
    employee_id: UUID4
    acknowledged_at: datetime

    class Config:
        from_attributes = True
