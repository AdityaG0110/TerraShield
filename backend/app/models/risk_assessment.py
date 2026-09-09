import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    settlement_id = Column(String(36), ForeignKey("settlements.id", ondelete="CASCADE"), nullable=False, index=True)
    hazard_data_id = Column(String(36), ForeignKey("hazard_data.id", ondelete="SET NULL"), nullable=True)
    risk_score = Column(Float, nullable=False)  # 0 to 100
    risk_category = Column(String(50), nullable=False)  # 'safe', 'watch', 'red_zone', 'critical'
    factor_breakdown = Column(JSON, nullable=False)  # list of factor contribution dicts
    assessed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    settlement = relationship("Settlement", back_populates="risk_assessments")
