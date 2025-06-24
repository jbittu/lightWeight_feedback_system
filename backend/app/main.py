from fastapi import FastAPI
from app.routes import auth, feedback  # Make sure these exist, or temporarily comment them

app = FastAPI()

@app.get("/")
def root():
    return {"msg": "Welcome to the Feedback System API"}

# Temporary: comment these out if routes don't exist yet
# app.include_router(auth.router, prefix="/auth", tags=["Auth"])
# app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])

