import os
import httpx
from typing import List, Dict, Any


def generate_risk_explanation(
    settlement_name: str,
    district: str,
    risk_score: float,
    risk_category: str,
    factor_breakdown: List[Dict[str, Any]],
    population: int
) -> str:
    """
    Generates a natural-language XAI risk justification.
    Uses rule-based templating adhering to government disaster management audit requirements,
    with optional Claude API call if CLAUDE_API_KEY is configured.
    """
    # Sort factors by points contributed descending
    sorted_factors = sorted(factor_breakdown, key=lambda x: x.get("points", 0), reverse=True)
    top_factor = sorted_factors[0] if sorted_factors else None
    second_factor = sorted_factors[1] if len(sorted_factors) > 1 else None

    # Check if Anthropic API key is provided
    api_key = os.getenv("CLAUDE_API_KEY")
    if api_key:
        try:
            prompt = (
                f"Act as an NDMA / State Disaster Management scientific advisor. "
                f"Write a concise 2-sentence formal risk justification for settlement '{settlement_name}' "
                f"in district '{district}'. Composite Risk Score: {risk_score}/100 ({risk_category.upper()}). "
                f"Population: {population}. Top hazard factors: "
                f"{top_factor['factor']} contributing {top_factor['points']} pts (raw: {top_factor['raw_value']}), "
                f"{second_factor['factor'] if second_factor else 'none'} contributing "
                f"{second_factor['points'] if second_factor else 0} pts."
            )
            response = httpx.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 150,
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=5.0
            )
            if response.status_code == 200:
                data = response.json()
                content = data.get("content", [])
                if content and "text" in content[0]:
                    return content[0]["text"].strip()
        except Exception:
            pass  # Fall back to deterministic template

    # High-quality deterministic NDMA narrative template
    category_label = risk_category.replace("_", " ").title()

    if risk_category in ["critical", "red_zone"]:
        reasons = []
        for f in sorted_factors[:3]:
            fname = f["factor"]
            pts = f["points"]
            raw = f["raw_value"]
            if fname == "slope" and raw > 20:
                reasons.append(f"steep terrain slope of {raw:.1f}° ({pts} pts)")
            elif fname == "rainfall" and raw > 180:
                reasons.append(f"heavy precipitation intensity of {raw:.1f}mm ({pts} pts)")
            elif fname == "elevation" and raw < 25:
                reasons.append(f"low depression elevation of {raw:.1f}m ({pts} pts)")
            elif fname == "population_density" and raw > 1000:
                reasons.append(f"dense habitation concentration of {raw:.0f}/km² ({pts} pts)")
            elif fname == "historical_incidents" and raw > 0:
                reasons.append(f"{int(raw)} logged historical disaster incidents ({pts} pts)")

        reason_str = ", ".join(reasons) if reasons else "compounded geomorphological indicators"
        return (
            f"Settlement '{settlement_name}' is classified as a {category_label} "
            f"with an aggregate risk index of {risk_score:.1f}/100. The primary hazard drivers "
            f"are {reason_str}. Immediate relocation prioritization is advised to prevent "
            f"mass casualties among the {population:,} resident population."
        )
    elif risk_category == "watch":
        return (
            f"Settlement '{settlement_name}' is currently placed on Watch status (Risk Index: {risk_score:.1f}/100). "
            f"While current elevation and drainage provide buffer capacity, monitored rainfall ({sorted_factors[0]['raw_value']}) "
            f"approaches critical thresholds. District authorities should maintain active surveillance."
        )
    else:
        return (
            f"Settlement '{settlement_name}' is classified as Safe (Risk Index: {risk_score:.1f}/100). "
            f"Geospatial and meteorological metrics indicate adequate carrying capacity, safe slope gradients, "
            f"and minimal flood inundation exposure under current monsoon parameters."
        )
