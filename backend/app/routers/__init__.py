from app.routers.settlements_router import router as settlements_router
from app.routers.risk_router import router as risk_router
from app.routers.recommendations_router import router as recommendations_router
from app.routers.dashboard_router import router as dashboard_router
from app.routers.auth_router import router as auth_router

__all__ = [
    "settlements_router",
    "risk_router",
    "recommendations_router",
    "dashboard_router",
    "auth_router",
]
