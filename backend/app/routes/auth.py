
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app import models, schemas
from app.database import get_db
from app.utils.auth_utils import hash_password, verify_password, create_access_token, get_current_user, manager_required
from uuid import uuid4
from typing import List 
from app.models import User  
router = APIRouter()

# User Registration
@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    
    if user.role == schemas.Role.employee:
        if not user.manager_id:
            raise HTTPException(status_code=422, detail="Employee must have a manager_id")
        manager = db.query(models.User).filter(models.User.id == user.manager_id, models.User.role == schemas.Role.manager).first()
        if not manager:
            raise HTTPException(status_code=400, detail="Provided manager_id does not refer to a valid manager")
    else:
        if user.manager_id is not None:
            raise HTTPException(status_code=400, detail="Managers should not have a manager_id")

    hashed_pwd = hash_password(user.password)

    new_user = models.User(
        id=uuid4(),
        name=user.name,
        email=user.email,
        password=hashed_pwd,
        role=user.role,
        manager_id=user.manager_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("/employees", response_model=list[schemas.UserOut])
def get_employees_by_manager(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(manager_required)
):
    employees = db.query(models.User).filter(
        models.User.manager_id == current_user.id,
        models.User.role == schemas.Role.employee
    ).all()
    return employees


@router.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    
    if (current_user.id != user.id and 
        current_user.role == schemas.Role.employee and 
        user.manager_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
    
    return user

@router.get("/managers", response_model=List[schemas.UserOut])
def get_managers(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == schemas.Role.manager).all()
