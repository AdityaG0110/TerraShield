from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class FactorContribution(BaseModel):
    factor: str
    raw_value: float
    normalized: float
    weight: float
    points: float
    description: Optional[str] = None


class RiskAssessmentResponse(BaseModel):
    id: Optional[str] = None
    settlement_id: str
    settlement_name: Optional[str] = None
    district: Optional[str] = None
    risk_score: float
    risk_category: str
    factor_breakdown: List[FactorContribution]
    explanation: Optional[str] = None
    assessed_at: datetime

    class Config:
        from_attributes = True


class RecomputeResponse(BaseModel):
    message: str
    assessment: RiskAssessmentResponse


class BatchRecomputeResponse(BaseModel):
    message: str
    total_recomputed: int
