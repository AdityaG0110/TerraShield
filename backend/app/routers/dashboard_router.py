from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.dashboard_schema import DashboardResponse
from app.services.dashboard_aggregation_service import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    district: Optional[str] = Query(None, description="Filter dashboard by district"),
    db: Session = Depends(get_db)
):
    summary = get_dashboard_summary(db, district=district)
    return DashboardResponse(**summary)
