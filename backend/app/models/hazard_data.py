import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class HazardData(Base):
    __tablename__ = "hazard_data"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    settlement_id = Column(String(36), ForeignKey("settlements.id", ondelete="CASCADE"), nullable=False, index=True)
    rainfall_mm = Column(Float, nullable=False)
    slope_degrees = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=False)
    population_density = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    settlement = relationship("Settlement", back_populates="hazard_data")
