from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.settlement import Settlement
from app.models.hazard_data import HazardData
from app.models.historical_incident import HistoricalIncident
from app.models.risk_assessment import RiskAssessment
from app.schemas.risk_schema import (
    RiskAssessmentResponse,
    RecomputeResponse,
    BatchRecomputeResponse,
    FactorContribution,
)
from app.services.risk_scoring_service import calculate_risk_score
from app.services.explainability_service import generate_risk_explanation

router = APIRouter(prefix="/risk", tags=["Risk Assessment"])


@router.get("/{settlement_id}", response_model=RiskAssessmentResponse)
def get_risk_assessment(settlement_id: str, db: Session = Depends(get_db)):
    settlement = db.query(Settlement).filter(Settlement.id == settlement_id).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")

    latest_risk = (
        db.query(RiskAssessment)
        .filter(RiskAssessment.settlement_id == settlement_id)
        .order_by(RiskAssessment.assessed_at.desc())
        .first()
    )

    if not latest_risk:
        raise HTTPException(status_code=404, detail="Risk assessment not found for this settlement")

    explanation = generate_risk_explanation(
        settlement_name=settlement.name,
        district=settlement.district,
        risk_score=latest_risk.risk_score,
        risk_category=latest_risk.risk_category,
        factor_breakdown=latest_risk.factor_breakdown,
        population=settlement.population
    )

    raw_breakdown = latest_risk.factor_breakdown or []
    breakdown = [
        FactorContribution.model_validate(f)
        for f in (raw_breakdown if isinstance(raw_breakdown, list) else [])
    ]

    return RiskAssessmentResponse(
        id=latest_risk.id,
        settlement_id=settlement.id,
        settlement_name=settlement.name,
        district=settlement.district,
        risk_score=latest_risk.risk_score,
        risk_category=latest_risk.risk_category,
        factor_breakdown=breakdown,
        explanation=explanation,
        assessed_at=latest_risk.assessed_at
    )


@router.post("/{settlement_id}/recompute", response_model=RecomputeResponse)
def recompute_settlement_risk(settlement_id: str, db: Session = Depends(get_db)):
    settlement = db.query(Settlement).filter(Settlement.id == settlement_id).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")

    latest_hazard = (
        db.query(HazardData)
        .filter(HazardData.settlement_id == settlement_id)
        .order_by(HazardData.recorded_at.desc())
        .first()
    )

    if not latest_hazard:
        raise HTTPException(status_code=400, detail="No hazard data found to recompute risk")

    incidents = (
        db.query(HistoricalIncident)
        .filter(HistoricalIncident.settlement_id == settlement_id)
        .all()
    )

    score, category, breakdown = calculate_risk_score(latest_hazard, incidents)

    new_assessment = RiskAssessment(
        settlement_id=settlement.id,
        hazard_data_id=latest_hazard.id,
        risk_score=score,
        risk_category=category,
        factor_breakdown=breakdown,
        assessed_at=datetime.utcnow()
    )
    db.add(new_assessment)
    db.commit()

    explanation = generate_risk_explanation(
        settlement_name=settlement.name,
        district=settlement.district,
        risk_score=score,
        risk_category=category,
        factor_breakdown=breakdown,
        population=settlement.population
    )

    breakdown_models = [FactorContribution.model_validate(f) for f in breakdown]

    assessment_resp = RiskAssessmentResponse(
        id=new_assessment.id,
        settlement_id=settlement.id,
        settlement_name=settlement.name,
        district=settlement.district,
        risk_score=score,
        risk_category=category,
        factor_breakdown=breakdown_models,
        explanation=explanation,
        assessed_at=new_assessment.assessed_at
    )

    return RecomputeResponse(
        message=f"Risk recomputed successfully for {settlement.name}. New score: {score} ({category.upper()})",
        assessment=assessment_resp
    )


@router.post("/recompute-all", response_model=BatchRecomputeResponse)
def recompute_all_risks(db: Session = Depends(get_db)):
    settlements = db.query(Settlement).all()
    count = 0

    for s in settlements:
        latest_hazard = (
            db.query(HazardData)
            .filter(HazardData.settlement_id == s.id)
            .order_by(HazardData.recorded_at.desc())
            .first()
        )
        if not latest_hazard:
            continue

        incidents = (
            db.query(HistoricalIncident)
            .filter(HistoricalIncident.settlement_id == s.id)
            .all()
        )

        score, category, breakdown = calculate_risk_score(latest_hazard, incidents)
        new_assessment = RiskAssessment(
            settlement_id=s.id,
            hazard_data_id=latest_hazard.id,
            risk_score=score,
            risk_category=category,
            factor_breakdown=breakdown,
            assessed_at=datetime.utcnow()
        )
        db.add(new_assessment)
        count += 1

    db.commit()
    return BatchRecomputeResponse(
        message=f"Successfully recomputed risk assessments across all habitations.",
        total_recomputed=count
    )
