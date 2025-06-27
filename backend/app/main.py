# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ Add this
from app.routes import auth, feedback
from app.database import create_db_and_tables

app = FastAPI()

# ✅ CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])

@app.get("/")
def read_root():
    return {"msg": "Welcome to the Feedback System API"}
