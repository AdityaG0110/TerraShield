from typing import Optional, List
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = "password"


class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    role_label: str
    jurisdiction_district: Optional[str] = None
    jurisdiction_state: str
    permissions: List[str]

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    success: bool
    user: UserProfile
    message: str
