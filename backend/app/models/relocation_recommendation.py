import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class RelocationRecommendation(Base):
    __tablename__ = "relocation_recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_settlement_id = Column(String(36), ForeignKey("settlements.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_name = Column(String(255), nullable=False)
    candidate_latitude = Column(Float, nullable=False)
    candidate_longitude = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False, default=0.0)
    capacity_score = Column(Float, nullable=False)
    distance_score = Column(Float, nullable=False)
    accessibility_score = Column(Float, nullable=False)
    recommendation_score = Column(Float, nullable=False)
    status = Column(String(50), nullable=False, default="proposed")  # 'proposed', 'approved', 'in_progress', 'completed'
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    source_settlement = relationship("Settlement", back_populates="relocation_recommendations")
