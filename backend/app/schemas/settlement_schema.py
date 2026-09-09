from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field


class HazardDataSchema(BaseModel):
    id: str
    rainfall_mm: float
    slope_degrees: float
    elevation_m: float
    population_density: float
    recorded_at: datetime

    class Config:
        from_attributes = True


class HistoricalIncidentSchema(BaseModel):
    id: str
    hazard_type: str
    severity: float
    incident_date: Any

    class Config:
        from_attributes = True


class RiskAssessmentSummary(BaseModel):
    id: str
    risk_score: float
    risk_category: str
    factor_breakdown: List[dict]
    assessed_at: datetime

    class Config:
        from_attributes = True


class SettlementBase(BaseModel):
    name: str
    district: str
    state: str = "Uttar Pradesh"
    latitude: float
    longitude: float
    population: int
    households: int
    land_area_km2: float


class SettlementCreate(SettlementBase):
    pass


class SettlementListItem(BaseModel):
    id: str
    name: str
    district: str
    state: str
    latitude: float
    longitude: float
    population: int
    households: int
    land_area_km2: float
    risk_category: str
    risk_score: float
    critical_factors: Optional[List[str]] = []
    created_at: datetime

    class Config:
        from_attributes = True


class SettlementDetail(SettlementBase):
    id: str
    created_at: datetime
    latest_hazard: Optional[HazardDataSchema] = None
    latest_risk: Optional[RiskAssessmentSummary] = None
    historical_incidents: List[HistoricalIncidentSchema] = []
    explanation: Optional[str] = None

    class Config:
        from_attributes = True


class SettlementListResponse(BaseModel):
    count: int
    results: List[SettlementListItem]
