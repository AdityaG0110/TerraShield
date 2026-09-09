from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.settlement import Settlement
from app.models.risk_assessment import RiskAssessment
from app.models.relocation_recommendation import RelocationRecommendation
from app.schemas.recommendation_schema import (
    RecommendationResponse,
    CandidateSite,
    StatusUpdateRequest,
    StatusUpdateResponse,
)
from app.services.recommendation_service import generate_recommendations_for_settlement

router = APIRouter(prefix="/recommendations", tags=["Relocation Recommendations"])


@router.get("/{settlement_id}", response_model=RecommendationResponse)
def get_recommendations(settlement_id: str, db: Session = Depends(get_db)):
    settlement = db.query(Settlement).filter(Settlement.id == settlement_id).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")

    latest_risk = (
        db.query(RiskAssessment)
        .filter(RiskAssessment.settlement_id == settlement_id)
        .order_by(RiskAssessment.assessed_at.desc())
        .first()
    )

    risk_score = latest_risk.risk_score if latest_risk else 0.0
    risk_category = latest_risk.risk_category if latest_risk else "safe"

    # Check if we already have recommendations stored
    existing_recs = (
        db.query(RelocationRecommendation)
        .filter(RelocationRecommendation.source_settlement_id == settlement_id)
        .order_by(RelocationRecommendation.recommendation_score.desc())
        .all()
    )

    if not existing_recs:
        # Generate on the fly
        candidates_data = generate_recommendations_for_settlement(db, settlement)
        for c in candidates_data:
            rec = RelocationRecommendation(
                source_settlement_id=settlement.id,
                candidate_name=c["candidate_name"],
                candidate_latitude=c["candidate_latitude"],
                candidate_longitude=c["candidate_longitude"],
                distance_km=c["distance_km"],
                capacity_score=c["capacity_score"],
                distance_score=c["distance_score"],
                accessibility_score=c["accessibility_score"],
                recommendation_score=c["recommendation_score"],
                status="proposed"
            )
            db.add(rec)
        db.commit()

        existing_recs = (
            db.query(RelocationRecommendation)
            .filter(RelocationRecommendation.source_settlement_id == settlement_id)
            .order_by(RelocationRecommendation.recommendation_score.desc())
            .all()
        )

    candidates = [CandidateSite.model_validate(r) for r in existing_recs]

    return RecommendationResponse(
        source_settlement_id=settlement.id,
        source_settlement_name=settlement.name,
        source_district=settlement.district,
        source_population=settlement.population,
        source_risk_score=risk_score,
        source_risk_category=risk_category,
        candidates=candidates
    )


@router.put("/{id}/status", response_model=StatusUpdateResponse)
def update_recommendation_status(id: str, payload: StatusUpdateRequest, db: Session = Depends(get_db)):
    rec = db.query(RelocationRecommendation).filter(RelocationRecommendation.id == id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation record not found")

    valid_statuses = ["proposed", "approved", "in_progress", "completed"]
    if payload.status.lower() not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{payload.status}'. Must be one of {valid_statuses}"
        )

    rec.status = payload.status.lower()
    db.commit()

    return StatusUpdateResponse(
        id=rec.id,
        status=rec.status,
        message=f"Relocation plan for site '{rec.candidate_name}' transitioned to '{rec.status}'"
    )
