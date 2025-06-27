from sqlalchemy import Column, String, Integer, Enum, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import enum
import uuid

class UserRole(str, enum.Enum):
    manager = "manager"
    employee = "employee"

class Sentiment(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  
    role = Column(Enum(UserRole), nullable=False)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Relationships
    manager = relationship("User", remote_side=[id])
    feedbacks_given = relationship("Feedback", back_populates="manager", foreign_keys='Feedback.manager_id')
    feedbacks_received = relationship("Feedback", back_populates="employee", foreign_keys='Feedback.employee_id')

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    strengths = Column(Text, nullable=True)
    areas_to_improve = Column(Text, nullable=True)
    sentiment = Column(Enum(Sentiment), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    employee = relationship("User", foreign_keys=[employee_id], back_populates="feedbacks_received")
    manager = relationship("User", foreign_keys=[manager_id], back_populates="feedbacks_given")

class Acknowledgement(Base):
    __tablename__ = "acknowledgements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    feedback_id = Column(UUID(as_uuid=True), ForeignKey("feedback.id"), nullable=False)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    acknowledged_at = Column(DateTime(timezone=True), server_default=func.now())
