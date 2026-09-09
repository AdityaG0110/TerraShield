from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.settlement import Settlement
from app.models.hazard_data import HazardData
from app.models.historical_incident import HistoricalIncident
from app.models.risk_assessment import RiskAssessment
from app.schemas.settlement_schema import (
    SettlementCreate,
    SettlementListItem,
    SettlementDetail,
    SettlementListResponse,
    HazardDataSchema,
    HistoricalIncidentSchema,
    RiskAssessmentSummary,
)
from app.services.explainability_service import generate_risk_explanation
from app.services.risk_scoring_service import calculate_risk_score

router = APIRouter(prefix="/settlements", tags=["Settlements"])


@router.get("", response_model=SettlementListResponse)
def list_settlements(
    district: Optional[str] = Query(None, description="Filter by district name"),
    risk_category: Optional[str] = Query(None, description="Filter by risk category: safe, watch, red_zone, critical"),
    search: Optional[str] = Query(None, description="Search settlement by name"),
    db: Session = Depends(get_db)
):
    query = db.query(Settlement)

    if district and district.lower() not in ["all", "all districts"]:
        query = query.filter(Settlement.district.ilike(district.strip()))

    if search:
        query = query.filter(Settlement.name.ilike(f"%{search.strip()}%"))

    settlements = query.all()
    results: List[SettlementListItem] = []

    for s in settlements:
        latest_risk = (
            db.query(RiskAssessment)
            .filter(RiskAssessment.settlement_id == s.id)
            .order_by(RiskAssessment.assessed_at.desc())
            .first()
        )

        cat = latest_risk.risk_category if latest_risk else "safe"
        score = latest_risk.risk_score if latest_risk else 0.0

        if risk_category and risk_category.lower() != "all":
            if cat != risk_category.lower():
                continue

        critical_factors = []
        if latest_risk and latest_risk.factor_breakdown:
            for f in sorted(latest_risk.factor_breakdown, key=lambda x: x.get("points", 0), reverse=True)[:2]:
                if f.get("points", 0) > 12.0:
                    critical_factors.append(f.get("factor", "").replace("_", " ").title())

        results.append(
            SettlementListItem(
                id=s.id,
                name=s.name,
                district=s.district,
                state=s.state,
                latitude=s.latitude,
                longitude=s.longitude,
                population=s.population,
                households=s.households,
                land_area_km2=s.land_area_km2,
                risk_category=cat,
                risk_score=score,
                critical_factors=critical_factors,
                created_at=s.created_at,
            )
        )

    # Sort results by risk_score descending
    results.sort(key=lambda x: x.risk_score, reverse=True)

    return SettlementListResponse(count=len(results), results=results)


@router.get("/{id}", response_model=SettlementDetail)
def get_settlement_detail(id: str, db: Session = Depends(get_db)):
    settlement = db.query(Settlement).filter(Settlement.id == id).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")

    latest_hazard = (
        db.query(HazardData)
        .filter(HazardData.settlement_id == id)
        .order_by(HazardData.recorded_at.desc())
        .first()
    )

    latest_risk = (
        db.query(RiskAssessment)
        .filter(RiskAssessment.settlement_id == id)
        .order_by(RiskAssessment.assessed_at.desc())
        .first()
    )

    incidents = (
        db.query(HistoricalIncident)
        .filter(HistoricalIncident.settlement_id == id)
        .order_by(HistoricalIncident.incident_date.desc())
        .all()
    )

    explanation = None
    if latest_risk and latest_risk.factor_breakdown:
        explanation = generate_risk_explanation(
            settlement_name=settlement.name,
            district=settlement.district,
            risk_score=latest_risk.risk_score,
            risk_category=latest_risk.risk_category,
            factor_breakdown=latest_risk.factor_breakdown,
            population=settlement.population
        )

    return SettlementDetail(
        id=settlement.id,
        name=settlement.name,
        district=settlement.district,
        state=settlement.state,
        latitude=settlement.latitude,
        longitude=settlement.longitude,
        population=settlement.population,
        households=settlement.households,
        land_area_km2=settlement.land_area_km2,
        created_at=settlement.created_at,
        latest_hazard=HazardDataSchema.model_validate(latest_hazard) if latest_hazard else None,
        latest_risk=RiskAssessmentSummary.model_validate(latest_risk) if latest_risk else None,
        historical_incidents=[HistoricalIncidentSchema.model_validate(inc) for inc in incidents],
        explanation=explanation
    )


@router.post("", response_model=SettlementDetail)
def create_settlement(payload: SettlementCreate, db: Session = Depends(get_db)):
    settlement = Settlement(
        name=payload.name,
        district=payload.district,
        state=payload.state,
        latitude=payload.latitude,
        longitude=payload.longitude,
        population=payload.population,
        households=payload.households,
        land_area_km2=payload.land_area_km2
    )
    db.add(settlement)
    db.flush()

    # Initial baseline hazard record
    density = round(payload.population / max(payload.land_area_km2, 0.1), 1)
    hazard = HazardData(
        settlement_id=settlement.id,
        rainfall_mm=120.0,
        slope_degrees=10.0,
        elevation_m=50.0,
        population_density=density
    )
    db.add(hazard)
    db.flush()

    score, cat, breakdown = calculate_risk_score(hazard, [])
    risk = RiskAssessment(
        settlement_id=settlement.id,
        hazard_data_id=hazard.id,
        risk_score=score,
        risk_category=cat,
        factor_breakdown=breakdown
    )
    db.add(risk)
    db.commit()

    return get_settlement_detail(settlement.id, db)
