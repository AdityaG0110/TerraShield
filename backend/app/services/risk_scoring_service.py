from datetime import date, datetime
from typing import List, Dict, Any, Tuple
from app.models.hazard_data import HazardData
from app.models.historical_incident import HistoricalIncident


def calculate_risk_score(
    hazard: HazardData,
    incidents: List[HistoricalIncident]
) -> Tuple[float, str, List[Dict[str, Any]]]:
    """
    Computes composite risk score (0-100), risk category, and factor breakdown
    following the NDMA-grounded weighted formula from PRD Section 12.
    """
    factor_breakdown = []

    # 1. Slope (30% weight) - primary driver of landslide risk
    slope_raw = float(hazard.slope_degrees)
    slope_norm = min(max(slope_raw / 45.0, 0.0), 1.0)
    slope_weight = 0.30
    slope_points = round(slope_norm * slope_weight * 100.0, 2)
    factor_breakdown.append({
        "factor": "slope",
        "raw_value": round(slope_raw, 1),
        "normalized": round(slope_norm, 3),
        "weight": slope_weight,
        "points": slope_points,
        "description": f"Slope gradient {slope_raw:.1f}° contributes to terrain and landslide instability",
    })

    # 2. Rainfall (25% weight) - primary driver of flood risk
    rain_raw = float(hazard.rainfall_mm)
    rain_norm = min(max(rain_raw / 400.0, 0.0), 1.0)
    rain_weight = 0.25
    rain_points = round(rain_norm * rain_weight * 100.0, 2)
    factor_breakdown.append({
        "factor": "rainfall",
        "raw_value": round(rain_raw, 1),
        "normalized": round(rain_norm, 3),
        "weight": rain_weight,
        "points": rain_points,
        "description": f"Precipitation intensity {rain_raw:.1f}mm relative to 400mm saturation baseline",
    })

    # 3. Elevation (15% weight) - compounds flood exposure
    elev_raw = float(hazard.elevation_m)
    elev_norm = min(max(1.0 - (elev_raw / 100.0), 0.0), 1.0)
    elev_weight = 0.15
    elev_points = round(elev_norm * elev_weight * 100.0, 2)
    factor_breakdown.append({
        "factor": "elevation",
        "raw_value": round(elev_raw, 1),
        "normalized": round(elev_norm, 3),
        "weight": elev_weight,
        "points": elev_points,
        "description": f"Elevation {elev_raw:.1f}m above sea level (lower terrain has higher flood pooling)",
    })

    # 4. Population Density (15% weight) - consequence severity
    density_raw = float(hazard.population_density)
    density_norm = min(max(density_raw / 5000.0, 0.0), 1.0)
    density_weight = 0.15
    density_points = round(density_norm * density_weight * 100.0, 2)
    factor_breakdown.append({
        "factor": "population_density",
        "raw_value": round(density_raw, 1),
        "normalized": round(density_norm, 3),
        "weight": density_weight,
        "points": density_points,
        "description": f"Density {density_raw:.0f} people/km² elevates potential human exposure",
    })

    # 5. Historical Hazard Incidents (15% weight) - empirical validation
    incident_count = len(incidents)
    if incident_count > 0:
        current_year = 2026
        weighted_severity_sum = 0.0
        for inc in incidents:
            inc_year = inc.incident_date.year if isinstance(inc.incident_date, (date, datetime)) else 2024
            years_ago = max(0, current_year - inc_year)
            recency = 1.0 if years_ago <= 3 else (0.9 if years_ago <= 5 else 0.7)
            weighted_severity_sum += float(inc.severity) * recency

        incident_metric = weighted_severity_sum
        incident_norm = min(max(incident_metric / 10.0, 0.0), 1.0)
    else:
        incident_norm = 0.0

    incident_weight = 0.15
    incident_points = round(incident_norm * incident_weight * 100.0, 2)
    factor_breakdown.append({
        "factor": "historical_incidents",
        "raw_value": incident_count,
        "normalized": round(incident_norm, 3),
        "weight": incident_weight,
        "points": incident_points,
        "description": f"{incident_count} historical disaster incidents logged with recency and severity weighting",
    })

    composite_score = round(sum(f["points"] for f in factor_breakdown), 2)
    composite_score = min(max(composite_score, 0.0), 100.0)

    # Classification
    if composite_score >= 75.0:
        category = "critical"
    elif composite_score >= 50.0:
        category = "red_zone"
    elif composite_score >= 25.0:
        category = "watch"
    else:
        category = "safe"

    return composite_score, category, factor_breakdown
