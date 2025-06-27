
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app import models, schemas, crud
from app.database import get_db
from app.utils.auth_utils import get_current_user, manager_required, employee_required
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.post("/", response_model=schemas.FeedbackOut)
def submit_feedback(
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(manager_required)
):
    return crud.feedback.create_feedback(db, feedback, manager_id=current_user.id)



@router.get("/employee/{employee_id}", response_model=list[schemas.FeedbackOut])
def get_employee_feedback(
    employee_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role == "employee" and current_user.id != employee_id:
        raise HTTPException(status_code=403, detail="Not allowed to view others' feedback")
    return crud.feedback.get_feedback_for_employee(db, employee_id)



@router.patch("/{feedback_id}", response_model=schemas.FeedbackOut)
def update_feedback(
    feedback_id: UUID,
    update_data: schemas.FeedbackBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(manager_required)
):
    updated = crud.feedback.update_feedback(db, feedback_id, update_data, current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Feedback not found or not yours")
    return updated



@router.patch("/{feedback_id}/acknowledge", response_model=schemas.AcknowledgementOut)
def acknowledge_feedback(
    feedback_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(employee_required)
):
    return crud.feedback.acknowledge_feedback(db, feedback_id, current_user.id)


@router.get("/manager/all", response_model=list[schemas.FeedbackOut])
def get_feedbacks_by_manager(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(manager_required)
):
    return db.query(models.Feedback).options(
        joinedload(models.Feedback.employee)  
    ).filter(
        models.Feedback.manager_id == current_user.id
    ).order_by(models.Feedback.created_at.desc()).all()

@router.get("/single/{feedback_id}", response_model=schemas.FeedbackOut)
def get_feedback_by_id(
    feedback_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(manager_required)
):
    feedback = db.query(models.Feedback).options(
        joinedload(models.Feedback.employee)
    ).filter(
        models.Feedback.id == feedback_id,
        models.Feedback.manager_id == current_user.id
    ).first()

    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    return feedback
