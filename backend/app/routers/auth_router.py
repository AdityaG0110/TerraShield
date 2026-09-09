from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth_schema import LoginRequest, LoginResponse, UserProfile

router = APIRouter(prefix="/auth", tags=["Authentication"])

ROLE_METADATA = {
    "dm": {
        "label": "District Magistrate",
        "description": "District Executive authority for signing relocation orders and allocating emergency relief funds",
        "permissions": ["view_dashboard", "approve_relocation", "trigger_recompute", "export_reports"]
    },
    "dmo": {
        "label": "Disaster Management Officer",
        "description": "Field operations and continuous monitoring of hazard sensors and red-zone habitations",
        "permissions": ["view_dashboard", "trigger_recompute", "manage_settlements", "view_map"]
    },
    "state_authority": {
        "label": "State Planning Authority",
        "description": "State-level rehabilitation policymaker and cross-district budget planning",
        "permissions": ["view_dashboard", "cross_district_analytics", "export_reports", "view_map"]
    },
    "relief_team": {
        "label": "Relief & Rehabilitation Lead",
        "description": "Ground execution of evacuation logistics, carrying capacity audit, and shelter staging",
        "permissions": ["view_dashboard", "view_recommendations", "execute_relocation", "view_map"]
    },
    "admin": {
        "label": "System Administrator",
        "description": "Superuser with complete platform and data source oversight",
        "permissions": ["all"]
    }
}


@router.get("/roles")
def list_available_roles(db: Session = Depends(get_db)):
    """Returns available mock personas for seamless 1-click login and testing."""
    users = db.query(User).all()
    roles = []
    for u in users:
        meta = ROLE_METADATA.get(u.role, {"label": u.role.title(), "description": "", "permissions": []})
        roles.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "role_label": meta["label"],
            "description": meta["description"],
            "jurisdiction_district": u.jurisdiction_district,
            "jurisdiction_state": u.jurisdiction_state,
            "permissions": meta["permissions"]
        })
    return roles


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Mocked role-based login matching email with active personas."""
    user = db.query(User).filter(User.email.ilike(payload.email.strip())).first()

    # Fallback to first user matching role or default
    if not user:
        user = db.query(User).first()

    if not user:
        raise HTTPException(status_code=404, detail="No system users found. Please seed the database.")

    meta = ROLE_METADATA.get(user.role, {"label": user.role.title(), "description": "", "permissions": []})

    user_profile = UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        role_label=meta["label"],
        jurisdiction_district=user.jurisdiction_district,
        jurisdiction_state=user.jurisdiction_state,
        permissions=meta["permissions"]
    )

    return LoginResponse(
        success=True,
        user=user_profile,
        message=f"Logged in successfully as {user.name} ({meta['label']})"
    )
