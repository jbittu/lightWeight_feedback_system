# app/main.py
from fastapi import FastAPI
from app.routes import auth, feedback
from app.database import create_db_and_tables

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])

@app.get("/")
def read_root():
    return {"msg": "Welcome to the Feedback System API"}
