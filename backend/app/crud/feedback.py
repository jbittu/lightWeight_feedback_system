# app/crud/feedback.py
from sqlalchemy.orm import Session
from app import models, schemas
from uuid import UUID
from datetime import datetime

# Create new feedback
def create_feedback(db: Session, feedback_data: schemas.FeedbackCreate, manager_id: UUID):
    feedback = models.Feedback(
        employee_id=feedback_data.employee_id,
        manager_id=manager_id,
        strengths=feedback_data.strengths,
        areas_to_improve=feedback_data.areas_to_improve,
        sentiment=feedback_data.sentiment,
        created_at=datetime.utcnow()
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

# Get all feedbacks for a specific employee with acknowledgement info
def get_feedback_for_employee(db: Session, employee_id: UUID):
    feedbacks = db.query(models.Feedback).filter(
        models.Feedback.employee_id == employee_id
    ).order_by(models.Feedback.created_at.desc()).all()
    
    # Add acknowledgement information to each feedback
    for feedback in feedbacks:
        acknowledgement = db.query(models.Acknowledgement).filter(
            models.Acknowledgement.feedback_id == feedback.id,
            models.Acknowledgement.employee_id == employee_id
        ).first()
        feedback.acknowledgement = acknowledgement
    
    return feedbacks

# Manager can edit/update their own feedback
def update_feedback(db: Session, feedback_id: UUID, updated_data: schemas.FeedbackBase, manager_id: UUID):
    feedback = db.query(models.Feedback).filter(
        models.Feedback.id == feedback_id,
        models.Feedback.manager_id == manager_id
    ).first()

    if feedback:
        feedback.strengths = updated_data.strengths
        feedback.areas_to_improve = updated_data.areas_to_improve
        feedback.sentiment = updated_data.sentiment
        feedback.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(feedback)
    return feedback

# Acknowledge feedback
def acknowledge_feedback(db: Session, feedback_id: UUID, employee_id: UUID):
    # Check if already acknowledged
    existing = db.query(models.Acknowledgement).filter(
        models.Acknowledgement.feedback_id == feedback_id,
        models.Acknowledgement.employee_id == employee_id
    ).first()
    
    if existing:
        return existing
    
    acknowledgment = models.Acknowledgement(
        feedback_id=feedback_id,
        employee_id=employee_id
    )
    db.add(acknowledgment)
    db.commit()
    db.refresh(acknowledgment)
    return acknowledgment

# Get all acknowledgements for a given employee
def get_acknowledgements(db: Session, employee_id: UUID):
    return db.query(models.Acknowledgement).filter(
        models.Acknowledgement.employee_id == employee_id
    ).all()
