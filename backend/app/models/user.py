import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # 'dm', 'dmo', 'state_authority', 'relief_team', 'admin'
    jurisdiction_district = Column(String(255), nullable=True)
    jurisdiction_state = Column(String(255), nullable=False, default="Uttar Pradesh")
    created_at = Column(DateTime, default=datetime.utcnow)
