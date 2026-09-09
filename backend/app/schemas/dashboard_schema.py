from typing import List, Optional, Dict
from pydantic import BaseModel


class PriorityQueueItem(BaseModel):
    settlement_id: str
    name: str
    district: str
    priority_rank: int
    risk_score: float
    risk_category: str
    population: int
    relocation_status: str = "pending"


class DistrictRiskStat(BaseModel):
    district: str
    total_settlements: int
    red_zones: int
    critical_zones: int
    population_at_risk: int
    average_risk_score: float


class DashboardResponse(BaseModel):
    total_settlements: int
    population_at_risk: int
    red_zones: int
    critical_zones: int
    safe_zones: int
    watch_zones: int
    active_district: Optional[str] = "All Districts"
    relocation_priority_queue: List[PriorityQueueItem]
    district_summaries: List[DistrictRiskStat]
    risk_category_distribution: Dict[str, int]
