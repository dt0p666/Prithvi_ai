from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from app.core.config import settings
from app.api.routes import health, dataset

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PRITHVI Backend API - Urban Heat & Climate Vulnerability Intelligence"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(dataset.router, prefix="/api", tags=["dataset"])

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

@app.post("/api/contact", tags=["contact"])
def submit_contact(req: ContactRequest):
    return {
        "status": "received",
        "name": req.name,
        "email": req.email,
        "message_received": True,
        "timestamp": "2026-10-30T22:07:00Z"
    }

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "health_check": "/api/health",
        "docs": "/docs"
    }
