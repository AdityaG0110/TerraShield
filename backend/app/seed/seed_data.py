import random
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.settlement import Settlement
from app.models.hazard_data import HazardData
from app.models.historical_incident import HistoricalIncident
from app.models.risk_assessment import RiskAssessment
from app.models.relocation_recommendation import RelocationRecommendation
from app.services.risk_scoring_service import calculate_risk_score
from app.services.recommendation_service import generate_recommendations_for_settlement


PRIMARY_SEEDS = [
    {
        "name": "Rampur Basti", "district": "Bahraich", "state": "Uttar Pradesh",
        "latitude": 27.57, "longitude": 81.59, "population": 2100, "households": 410, "land_area_km2": 1.2,
        "hazard": { "rainfall_mm": 280.0, "slope_degrees": 36.0, "elevation_m": 12.0, "population_density": 3200.0 },
        "incidents": [
            { "hazard_type": "flood", "severity": 0.7, "incident_date": date(2023, 8, 14) },
            { "hazard_type": "flood", "severity": 0.6, "incident_date": date(2021, 7, 30) },
            { "hazard_type": "flood", "severity": 0.8, "incident_date": date(2019, 9, 2) }
        ]
    },
    {
        "name": "Uparhaar Ridge", "district": "Bahraich", "state": "Uttar Pradesh",
        "latitude": 27.63, "longitude": 81.52, "population": 850, "households": 160, "land_area_km2": 2.5,
        "hazard": { "rainfall_mm": 140.0, "slope_degrees": 8.0, "elevation_m": 68.0, "population_density": 340.0 },
        "incidents": []
    },
    {
        "name": "Devipur Nagla", "district": "Gonda", "state": "Uttar Pradesh",
        "latitude": 27.13, "longitude": 81.96, "population": 3400, "households": 620, "land_area_km2": 1.8,
        "hazard": { "rainfall_mm": 310.0, "slope_degrees": 22.0, "elevation_m": 9.0, "population_density": 1889.0 },
        "incidents": [
            { "hazard_type": "flood", "severity": 0.9, "incident_date": date(2022, 8, 20) },
            { "hazard_type": "landslide", "severity": 0.5, "incident_date": date(2020, 7, 11) }
        ]
    },
    {
        "name": "Khairatipur", "district": "Gonda", "state": "Uttar Pradesh",
        "latitude": 27.05, "longitude": 82.02, "population": 1200, "households": 230, "land_area_km2": 3.1,
        "hazard": { "rainfall_mm": 95.0, "slope_degrees": 4.0, "elevation_m": 85.0, "population_density": 387.0 },
        "incidents": []
    }
]

SETTLEMENT_NAMES_POOL = [
    ("Mahadeva Purwa", "Bahraich", 27.58, 81.65, "critical"),
    ("Chilwariya Ghat", "Bahraich", 27.52, 81.63, "red_zone"),
    ("Nanpara Taluka", "Bahraich", 27.86, 81.50, "watch"),
    ("Jarwal Kasba", "Bahraich", 27.17, 81.54, "safe"),
    ("Fakharpur Dih", "Bahraich", 27.42, 81.51, "red_zone"),
    ("Mihinpurwa Forest Edge", "Bahraich", 28.02, 81.33, "critical"),
    ("Kaisarganj Diara", "Bahraich", 27.25, 81.55, "red_zone"),
    ("Payagpur Khas", "Bahraich", 27.40, 81.80, "watch"),
    ("Huzoorpur Khurd", "Bahraich", 27.35, 81.72, "safe"),
    ("Risia Bazar Ward 4", "Bahraich", 27.70, 81.60, "watch"),
    ("Karnailganj Tal", "Gonda", 27.05, 81.70, "critical"),
    ("Tarabganj Kachhar", "Gonda", 26.90, 82.00, "critical"),
    ("Mankapur Purwa", "Gonda", 27.03, 82.23, "watch"),
    ("Colonelganj Riverbank", "Gonda", 27.12, 81.72, "red_zone"),
    ("Wazirganj Gaon", "Gonda", 26.98, 82.15, "safe"),
    ("Nawabganj Tola", "Gonda", 26.87, 82.14, "red_zone"),
    ("Paraspur Diara", "Gonda", 27.01, 81.82, "critical"),
    ("Itiyathok Elevated", "Gonda", 27.30, 82.05, "safe"),
    ("Katra Bazar Khas", "Gonda", 27.20, 81.85, "watch"),
    ("Belsar Habitation", "Gonda", 26.92, 81.90, "watch"),
    ("Bhinga Lowland", "Shravasti", 27.72, 81.93, "critical"),
    ("Ikauna Floodplain", "Shravasti", 27.53, 81.97, "red_zone"),
    ("Gilaula Gaon", "Shravasti", 27.60, 81.84, "watch"),
    ("Sirsiya Hillside", "Shravasti", 27.85, 82.05, "critical"),
    ("Hariharpur Rani", "Shravasti", 27.65, 81.89, "safe"),
    ("Jamunaha Basin", "Shravasti", 27.78, 81.65, "red_zone"),
    ("Malhipur Ridge", "Shravasti", 27.82, 81.72, "safe"),
    ("Chaudhari Purwa", "Shravasti", 27.69, 81.99, "watch"),
    ("Durgapur Basti", "Bahraich", 27.48, 81.68, "watch"),
    ("Shivpur Colony", "Bahraich", 27.68, 81.45, "safe"),
    ("Rampur Kalan", "Gonda", 27.18, 81.92, "watch"),
    ("Bishnoor Ghat", "Gonda", 27.08, 81.79, "red_zone"),
    ("Kalyanpur Tanda", "Shravasti", 27.57, 82.02, "safe"),
    ("Sundarnagar Habitat", "Shravasti", 27.75, 81.80, "watch"),
    ("Lakshmanpur Dera", "Bahraich", 27.60, 81.56, "critical"),
    ("Bikrampur Settlement", "Gonda", 27.15, 82.10, "safe")
]


def seed_database(db: Session):
    print("Beginning TerraShield database seeding...")
    Base.metadata.create_all(bind=engine)

    # 1. Check if database already seeded
    existing_settlements = db.query(Settlement).count()
    if existing_settlements > 0:
        print(f"Database already contains {existing_settlements} settlements. Skipping seed.")
        return

    # 2. Seed Users for Mock Roles
    users = [
        User(
            name="Rajeshwar Verma, IAS",
            email="dm@bahraich.gov.in",
            password_hash="hashed_pw",
            role="dm",
            jurisdiction_district="Bahraich",
            jurisdiction_state="Uttar Pradesh"
        ),
        User(
            name="Dr. Ananya Sharma",
            email="dmo@gonda.gov.in",
            password_hash="hashed_pw",
            role="dmo",
            jurisdiction_district="Gonda",
            jurisdiction_state="Uttar Pradesh"
        ),
        User(
            name="Vikramaditya Rao",
            email="state@disaster.up.gov.in",
            password_hash="hashed_pw",
            role="state_authority",
            jurisdiction_district=None,
            jurisdiction_state="Uttar Pradesh"
        ),
        User(
            name="Commander S. K. Nair",
            email="relief@ndrf.gov.in",
            password_hash="hashed_pw",
            role="relief_team",
            jurisdiction_district=None,
            jurisdiction_state="Uttar Pradesh"
        ),
        User(
            name="System Administrator",
            email="admin@terrashield.gov.in",
            password_hash="hashed_pw",
            role="admin",
            jurisdiction_district=None,
            jurisdiction_state="Uttar Pradesh"
        )
    ]
    db.add_all(users)
    db.commit()
    print("Mock users seeded successfully.")

    # 3. Seed Primary Explicit Settlements
    all_created_settlements = []

    for item in PRIMARY_SEEDS:
        settlement = Settlement(
            name=item["name"],
            district=item["district"],
            state=item["state"],
            latitude=item["latitude"],
            longitude=item["longitude"],
            population=item["population"],
            households=item["households"],
            land_area_km2=item["land_area_km2"]
        )
        db.add(settlement)
        db.flush()

        hazard = HazardData(
            settlement_id=settlement.id,
            rainfall_mm=item["hazard"]["rainfall_mm"],
            slope_degrees=item["hazard"]["slope_degrees"],
            elevation_m=item["hazard"]["elevation_m"],
            population_density=item["hazard"]["population_density"]
        )
        db.add(hazard)
        db.flush()

        incidents = []
        for inc in item["incidents"]:
            incident = HistoricalIncident(
                settlement_id=settlement.id,
                hazard_type=inc["hazard_type"],
                severity=inc["severity"],
                incident_date=inc["incident_date"]
            )
            db.add(incident)
            incidents.append(incident)
        db.flush()

        score, category, breakdown = calculate_risk_score(hazard, incidents)
        risk_assessment = RiskAssessment(
            settlement_id=settlement.id,
            hazard_data_id=hazard.id,
            risk_score=score,
            risk_category=category,
            factor_breakdown=breakdown
        )
        db.add(risk_assessment)
        all_created_settlements.append((settlement, category, score))

    db.commit()

    # 4. Seed Programmatic Pool Settlements (36 rows)
    random.seed(42)  # Deterministic seed for reproducible testing

    for name, district, lat, lon, target_cat in SETTLEMENT_NAMES_POOL:
        pop = random.randint(600, 4800)
        households = int(pop / random.uniform(4.5, 5.5))
        land_area = round(random.uniform(0.8, 4.5), 2)
        density = round(pop / land_area, 1)

        # Generate hazard metrics targeted to achieve specific risk category
        if target_cat == "critical":
            slope = random.uniform(32.0, 44.0)
            rainfall = random.uniform(310.0, 395.0)
            elevation = random.uniform(6.0, 15.0)
            incident_count = random.randint(2, 4)
        elif target_cat == "red_zone":
            slope = random.uniform(22.0, 35.0)
            rainfall = random.uniform(240.0, 320.0)
            elevation = random.uniform(12.0, 28.0)
            incident_count = random.randint(1, 3)
        elif target_cat == "watch":
            slope = random.uniform(10.0, 20.0)
            rainfall = random.uniform(150.0, 230.0)
            elevation = random.uniform(30.0, 60.0)
            incident_count = random.randint(0, 1)
        else:  # safe
            slope = random.uniform(2.0, 9.0)
            rainfall = random.uniform(60.0, 130.0)
            elevation = random.uniform(65.0, 95.0)
            incident_count = 0

        settlement = Settlement(
            name=name,
            district=district,
            state="Uttar Pradesh",
            latitude=lat,
            longitude=lon,
            population=pop,
            households=households,
            land_area_km2=land_area
        )
        db.add(settlement)
        db.flush()

        hazard = HazardData(
            settlement_id=settlement.id,
            rainfall_mm=round(rainfall, 1),
            slope_degrees=round(slope, 1),
            elevation_m=round(elevation, 1),
            population_density=density
        )
        db.add(hazard)
        db.flush()

        incidents = []
        for i in range(incident_count):
            htype = random.choice(["flood", "flood", "landslide"])
            sev = round(random.uniform(0.55, 0.95), 2)
            y_offset = random.randint(1, 5)
            inc_date = date(2026 - y_offset, random.randint(6, 9), random.randint(1, 28))
            incident = HistoricalIncident(
                settlement_id=settlement.id,
                hazard_type=htype,
                severity=sev,
                incident_date=inc_date
            )
            db.add(incident)
            incidents.append(incident)
        db.flush()

        score, category, breakdown = calculate_risk_score(hazard, incidents)
        risk_assessment = RiskAssessment(
            settlement_id=settlement.id,
            hazard_data_id=hazard.id,
            risk_score=score,
            risk_category=category,
            factor_breakdown=breakdown
        )
        db.add(risk_assessment)
        all_created_settlements.append((settlement, category, score))

    db.commit()

    # 5. Generate Relocation Recommendations for Red Zones and Critical settlements
    print("Computing baseline relocation recommendations...")
    for s, cat, score in all_created_settlements:
        if cat in ["red_zone", "critical"]:
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
    db.commit()

    total_count = db.query(Settlement).count()
    print(f"TerraShield database successfully seeded with {total_count} habitations across Bahraich, Gonda, and Shravasti.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
