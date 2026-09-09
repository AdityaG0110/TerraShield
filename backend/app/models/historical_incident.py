import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class HistoricalIncident(Base):
    __tablename__ = "historical_incidents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    settlement_id = Column(String(36), ForeignKey("settlements.id", ondelete="CASCADE"), nullable=False, index=True)
    hazard_type = Column(String(50), nullable=False)  # 'flood', 'landslide', 'cyclone', 'earthquake'
    severity = Column(Float, nullable=False)  # 0.0 to 1.0
    incident_date = Column(Date, nullable=False)

    # Relationship
    settlement = relationship("Settlement", back_populates="historical_incidents")
