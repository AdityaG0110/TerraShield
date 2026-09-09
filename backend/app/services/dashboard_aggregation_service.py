from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from app.models.settlement import Settlement
from app.models.risk_assessment import RiskAssessment
from app.models.relocation_recommendation import RelocationRecommendation


def get_dashboard_summary(db: Session, district: Optional[str] = None) -> Dict[str, Any]:
    """
    Computes real-time district/state aggregation for executive dashboard KPI cards,
    charts, and the relocation priority queue.
    """
    query = db.query(Settlement)
    if district and district.lower() not in ["all", "all districts"]:
        query = query.filter(Settlement.district.ilike(district.strip()))

    settlements = query.all()

    total_settlements = len(settlements)
    population_at_risk = 0
    red_zones = 0
    critical_zones = 0
    safe_zones = 0
    watch_zones = 0

    priority_items = []
    settlement_ids = [s.id for s in settlements]

    # Map of settlement_id to approved recommendation
    approved_recs = set(
        r[0] for r in db.query(RelocationRecommendation.source_settlement_id)
        .filter(
            RelocationRecommendation.source_settlement_id.in_(settlement_ids),
            RelocationRecommendation.status == "approved"
        ).all()
    )

    for s in settlements:
        latest_risk = (
            db.query(RiskAssessment)
            .filter(RiskAssessment.settlement_id == s.id)
            .order_by(RiskAssessment.assessed_at.desc())
            .first()
        )

        risk_score = latest_risk.risk_score if latest_risk else 0.0
        risk_category = latest_risk.risk_category if latest_risk else "safe"

        if risk_category == "critical":
            critical_zones += 1
            population_at_risk += s.population
        elif risk_category == "red_zone":
            red_zones += 1
            population_at_risk += s.population
        elif risk_category == "watch":
            watch_zones += 1
        else:
            safe_zones += 1

        reloc_status = "Approved" if s.id in approved_recs else "Pending Review"
        priority_items.append({
            "settlement_id": s.id,
            "name": s.name,
            "district": s.district,
            "risk_score": risk_score,
            "risk_category": risk_category,
            "population": s.population,
            "relocation_status": reloc_status,
        })

    # Sort priority queue: highest risk score first, then population
    priority_items.sort(key=lambda x: (x["risk_score"], x["population"]), reverse=True)
    for idx, item in enumerate(priority_items):
        item["priority_rank"] = idx + 1

    # District Breakdown
    all_districts = db.query(Settlement.district).distinct().all()
    district_summaries = []

    for (dist_name,) in all_districts:
        d_settlements = db.query(Settlement).filter(Settlement.district == dist_name).all()
        d_pop_at_risk = 0
        d_red = 0
        d_crit = 0
        d_scores = []

        for ds in d_settlements:
            lr = (
                db.query(RiskAssessment)
                .filter(RiskAssessment.settlement_id == ds.id)
                .order_by(RiskAssessment.assessed_at.desc())
                .first()
            )
            score = lr.risk_score if lr else 0.0
            cat = lr.risk_category if lr else "safe"
            d_scores.append(score)
            if cat in ["critical", "red_zone"]:
                d_pop_at_risk += ds.population
                if cat == "critical":
                    d_crit += 1
                else:
                    d_red += 1

        avg_score = round(sum(d_scores) / max(len(d_scores), 1), 1)
        district_summaries.append({
            "district": dist_name,
            "total_settlements": len(d_settlements),
            "red_zones": d_red,
            "critical_zones": d_crit,
            "population_at_risk": d_pop_at_risk,
            "average_risk_score": avg_score,
        })

    return {
        "total_settlements": total_settlements,
        "population_at_risk": population_at_risk,
        "red_zones": red_zones,
        "critical_zones": critical_zones,
        "safe_zones": safe_zones,
        "watch_zones": watch_zones,
        "active_district": district or "All Districts",
        "relocation_priority_queue": priority_items[:10],
        "district_summaries": district_summaries,
        "risk_category_distribution": {
            "safe": safe_zones,
            "watch": watch_zones,
            "red_zone": red_zones,
            "critical": critical_zones,
        }
    }
