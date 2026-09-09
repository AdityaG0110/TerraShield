import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models import *  # Ensure all models registered
from app.routers import (
    settlements_router,
    risk_router,
    recommendations_router,
    dashboard_router,
    auth_router,
)
from app.seed.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and database is seeded
    print("TerraShield Backend initializing tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    print("TerraShield Backend shutdown.")


app = FastAPI(
    title="TerraShield API",
    description="AI-Powered Hazard Risk Intelligence and Relocation Decision Support Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(settlements_router, prefix="/api/v1")
app.include_router(risk_router, prefix="/api/v1")
app.include_router(recommendations_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "TerraShield Decision Intelligence API",
        "version": "1.0.0"
    }


@app.get("/")
def root():
    return {
        "message": "Welcome to TerraShield Hazard Risk Intelligence Platform API",
        "docs_url": "/docs",
        "version": "v1.0"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
