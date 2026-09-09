import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class Settlement(Base):
    __tablename__ = "settlements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    district = Column(String(255), nullable=False, index=True)
    state = Column(String(255), nullable=False, default="Uttar Pradesh")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    population = Column(Integer, nullable=False)
    households = Column(Integer, nullable=False)
    land_area_km2 = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    hazard_data = relationship("HazardData", back_populates="settlement", cascade="all, delete-orphan", order_by="desc(HazardData.recorded_at)")
    historical_incidents = relationship("HistoricalIncident", back_populates="settlement", cascade="all, delete-orphan", order_by="desc(HistoricalIncident.incident_date)")
    risk_assessments = relationship("RiskAssessment", back_populates="settlement", cascade="all, delete-orphan", order_by="desc(RiskAssessment.assessed_at)")
    relocation_recommendations = relationship("RelocationRecommendation", back_populates="source_settlement", cascade="all, delete-orphan")
