import os
import csv
import math
from datetime import date, datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.settlement import Settlement
from app.models.hazard_data import HazardData
from app.models.historical_incident import HistoricalIncident
from app.models.risk_assessment import RiskAssessment
from app.models.relocation_recommendation import RelocationRecommendation
from app.models.user import User
from app.services.explainability_service import generate_risk_explanation
from app.services.recommendation_service import generate_recommendations_for_settlement


DEFAULT_CSV_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "seed",
    "villages.csv"
)


def import_villages_from_csv(db: Session, csv_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Reads villages.csv and populates settlements, hazard telemetry, historical incidents,
    risk assessments, and relocation recommendations, completely replacing old mock data.
    """
    file_path = csv_path or DEFAULT_CSV_PATH
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found at {file_path}")

    print(f"Reading dataset from {file_path}...")

    with open(file_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        raise ValueError("The provided CSV file contains no data rows.")

    # 1. Clean existing settlements and cascaded children
    print("Clearing old settlement records and cascading dependencies...")
    db.query(RelocationRecommendation).delete()
    db.query(RiskAssessment).delete()
    db.query(HistoricalIncident).delete()
    db.query(HazardData).delete()
    db.query(Settlement).delete()
    db.commit()

    # 2. Ensure mock users exist with jurisdictions relevant to the dataset
    existing_users = db.query(User).count()
    if existing_users == 0:
        users = [
            User(
                name="Rajeshwar Verma, IAS",
                email="dm@bahraich.gov.in",
                password_hash="hashed_pw",
                role="dm",
                jurisdiction_district="Assam",
                jurisdiction_state="Assam"
            ),
            User(
                name="Dr. Ananya Sharma",
                email="dmo@gonda.gov.in",
                password_hash="hashed_pw",
                role="dmo",
                jurisdiction_district="Meghalaya",
                jurisdiction_state="Meghalaya"
            ),
            User(
                name="Vikramaditya Rao",
                email="state@disaster.up.gov.in",
                role="state_authority",
                jurisdiction_district=None,
                jurisdiction_state="Northeast Region"
            ),
            User(
                name="Commander S. K. Nair",
                email="relief@ndrf.gov.in",
                role="relief_team",
                jurisdiction_district=None,
                jurisdiction_state="Field Operations"
            ),
            User(
                name="System Administrator",
                email="admin@terrashield.gov.in",
                password_hash="hashed_pw",
                role="admin",
                jurisdiction_district=None,
                jurisdiction_state="National"
            )
        ]
        db.add_all(users)
        db.commit()

    created_settlements = []

    for row in rows:
        village_name = row["Village_Name"].strip()
        district = row["District"].strip()
        state = row["State"].strip()
        latitude = float(row["Latitude"])
        longitude = float(row["Longitude"])
        rainfall_mm = float(row["Rainfall_mm"])
        population = int(row["Population"])
        pop_density = float(row["Population_Density"])
        elevation_m = float(row["Elevation_m"])
        slope_degrees = float(row["Slope_Degree"])
        hazard_count = int(row.get("Historical_Hazard_Count", 10))
        csv_risk_score = float(row["Risk_Score"])
        csv_category = row.get("Risk_Category", "").strip()

        # Derive households and land area
        households = max(1, int(population / 4.8))
        land_area_km2 = round(max(0.1, population / max(pop_density, 1.0)), 2)

        # Create Settlement
        settlement = Settlement(
            name=village_name,
            district=district,
            state=state,
            latitude=latitude,
            longitude=longitude,
            population=population,
            households=households,
            land_area_km2=land_area_km2
        )
        db.add(settlement)
        db.flush()

        # Create Hazard Data
        hazard = HazardData(
            settlement_id=settlement.id,
            rainfall_mm=rainfall_mm,
            slope_degrees=slope_degrees,
            elevation_m=elevation_m,
            population_density=pop_density
        )
        db.add(hazard)
        db.flush()

        # Create Historical Incidents based on Historical_Hazard_Count
        incident_entries = []
        num_incidents_to_log = min(max(1, int(hazard_count / 8)), 5)

        for i in range(num_incidents_to_log):
            # Select disaster type based on geomorphology
            if slope_degrees > 30.0:
                htype = "landslide"
            elif rainfall_mm > 2200.0 or elevation_m < 50.0:
                htype = "flood"
            else:
                htype = "cyclone" if i % 2 == 0 else "flood"

            # Severity correlated to risk score
            severity = round(min(max(0.45, (csv_risk_score / 100.0) + (i * 0.03)), 0.98), 2)
            inc_date = date(2026 - (i + 1), 6 + (i % 4), 10 + (i * 3))

            inc = HistoricalIncident(
                settlement_id=settlement.id,
                hazard_type=htype,
                severity=severity,
                incident_date=inc_date
            )
            db.add(inc)
            incident_entries.append(inc)

        db.flush()

        # Map Risk Category
        norm_cat = csv_category.lower()
        if norm_cat == "red" or csv_risk_score >= 75.0:
            final_category = "critical"
        elif norm_cat == "orange" or csv_risk_score >= 50.0:
            final_category = "red_zone"
        elif norm_cat == "yellow" or csv_risk_score >= 25.0:
            final_category = "watch"
        else:
            final_category = "safe"

        # Generate Explainable Factor Breakdown whose sum matches csv_risk_score
        # Compute raw weights
        raw_slope_pts = min(slope_degrees / 50.0, 1.0) * 30.0
        raw_rain_pts = min(rainfall_mm / 3600.0, 1.0) * 25.0
        raw_elev_pts = max(0.0, 1.0 - (elevation_m / 800.0)) * 15.0
        raw_density_pts = min(pop_density / 1200.0, 1.0) * 15.0
        raw_incident_pts = min(hazard_count / 40.0, 1.0) * 15.0

        raw_sum = max(1.0, raw_slope_pts + raw_rain_pts + raw_elev_pts + raw_density_pts + raw_incident_pts)
        scale_factor = csv_risk_score / raw_sum

        slope_pts = round(raw_slope_pts * scale_factor, 2)
        rain_pts = round(raw_rain_pts * scale_factor, 2)
        elev_pts = round(raw_elev_pts * scale_factor, 2)
        density_pts = round(raw_density_pts * scale_factor, 2)
        incident_pts = round(csv_risk_score - (slope_pts + rain_pts + elev_pts + density_pts), 2)

        factor_breakdown = [
            {
                "factor": "slope",
                "raw_value": slope_degrees,
                "normalized": round(min(slope_degrees / 50.0, 1.0), 3),
                "weight": 0.30,
                "points": slope_pts,
                "description": f"Terrain slope gradient of {slope_degrees:.1f}° relative to threshold",
            },
            {
                "factor": "rainfall",
                "raw_value": rainfall_mm,
                "normalized": round(min(rainfall_mm / 3600.0, 1.0), 3),
                "weight": 0.25,
                "points": rain_pts,
                "description": f"Seasonal precipitation of {rainfall_mm:.0f}mm",
            },
            {
                "factor": "elevation",
                "raw_value": elevation_m,
                "normalized": round(max(0.0, 1.0 - (elevation_m / 800.0)), 3),
                "weight": 0.15,
                "points": elev_pts,
                "description": f"Elevation {elevation_m:.0f}m above sea level",
            },
            {
                "factor": "population_density",
                "raw_value": pop_density,
                "normalized": round(min(pop_density / 1200.0, 1.0), 3),
                "weight": 0.15,
                "points": density_pts,
                "description": f"Habitation density {pop_density:.1f}/km²",
            },
            {
                "factor": "historical_incidents",
                "raw_value": hazard_count,
                "normalized": round(min(hazard_count / 40.0, 1.0), 3),
                "weight": 0.15,
                "points": incident_pts,
                "description": f"{hazard_count} historical disaster records registered in SDMA catalog",
            },
        ]

        # Save Risk Assessment
        risk_assessment = RiskAssessment(
            settlement_id=settlement.id,
            hazard_data_id=hazard.id,
            risk_score=csv_risk_score,
            risk_category=final_category,
            factor_breakdown=factor_breakdown,
            assessed_at=datetime.utcnow()
        )
        db.add(risk_assessment)

        created_settlements.append((settlement, final_category, csv_risk_score))

    db.commit()
    print(f"Populated {len(created_settlements)} settlements with hazard data and risk assessments.")

    # 3. Populate Relocation Recommendations for High Risk and Critical Habitations
    print("Generating relocation recommendations based on carrying capacity and accessibility...")
    recs_count = 0
    for s, cat, score in created_settlements:
        if cat in ["critical", "red_zone"]:
            candidates = generate_recommendations_for_settlement(db, s)
            for c in candidates:
                rec = RelocationRecommendation(
                    source_settlement_id=s.id,
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
                recs_count += 1

    db.commit()
    print(f"Generated {recs_count} relocation recommendations for red and critical zones.")

    return {
        "status": "success",
        "total_settlements_imported": len(created_settlements),
        "total_recommendations_generated": recs_count,
        "message": f"Successfully imported {len(created_settlements)} habitations from {os.path.basename(file_path)}."
    }
