import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.settlement import Settlement
from app.models.hazard_data import HazardData
from app.models.historical_incident import HistoricalIncident
from app.services.risk_scoring_service import calculate_risk_score

client = TestClient(app)

class TestTerraShieldBackend(unittest.TestCase):
    def test_health_check(self):
        response = client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_dashboard_endpoint(self):
        response = client.get("/api/v1/dashboard")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(data["total_settlements"], 0)
        self.assertIn("population_at_risk", data)
        self.assertIn("relocation_priority_queue", data)
        self.assertGreater(len(data["relocation_priority_queue"]), 0)

    def test_settlements_endpoint(self):
        response = client.get("/api/v1/settlements")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(data["count"], 0)
        first_settlement = data["results"][0]
        self.assertIn("risk_score", first_settlement)
        self.assertIn("risk_category", first_settlement)

    def test_rampur_basti_score_matches_prd_formula(self):
        # PRD Section 12 test case:
        # Slope 36 deg, Rainfall 280 mm, Elevation 12 m, Population density 3200
        # 3 historical incidents (floods)
        hazard = HazardData(
            rainfall_mm=280.0,
            slope_degrees=36.0,
            elevation_m=12.0,
            population_density=3200.0
        )
        from datetime import date
        incidents = [
            HistoricalIncident(hazard_type="flood", severity=0.7, incident_date=date(2023, 8, 14)),
            HistoricalIncident(hazard_type="flood", severity=0.6, incident_date=date(2021, 7, 30)),
            HistoricalIncident(hazard_type="flood", severity=0.8, incident_date=date(2019, 9, 2))
        ]
        score, category, breakdown = calculate_risk_score(hazard, incidents)
        # Expected from PRD Section 12: ~67.15 -> red_zone
        self.assertAlmostEqual(score, 67.15, delta=0.5)
        self.assertEqual(category, "red_zone")

    def test_auth_roles(self):
        response = client.get("/api/v1/auth/roles")
        self.assertEqual(response.status_code, 200)
        roles = response.json()
        self.assertGreaterEqual(len(roles), 4)

    def test_recommendations_endpoint(self):
        # Fetch one red_zone or critical settlement
        settlements_res = client.get("/api/v1/settlements?risk_category=red_zone")
        results = settlements_res.json()["results"]
        if results:
            sid = results[0]["id"]
            rec_res = client.get(f"/api/v1/recommendations/{sid}")
            self.assertEqual(rec_res.status_code, 200)
            data = rec_res.json()
            self.assertIn("candidates", data)
            self.assertGreater(len(data["candidates"]), 0)


if __name__ == "__main__":
    unittest.main()
