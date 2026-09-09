from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class CandidateSite(BaseModel):
    id: Optional[str] = None
    candidate_name: str
    candidate_latitude: float
    candidate_longitude: float
    distance_km: float
    capacity_score: float
    distance_score: float
    accessibility_score: float
    recommendation_score: float
    status: str = "proposed"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    source_settlement_id: str
    source_settlement_name: str
    source_district: str
    source_population: int
    source_risk_score: float
    source_risk_category: str
    candidates: List[CandidateSite]


class StatusUpdateRequest(BaseModel):
    status: str  # 'proposed', 'approved', 'in_progress', 'completed'


class StatusUpdateResponse(BaseModel):
    id: str
    status: str
    message: str
