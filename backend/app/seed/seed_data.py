import os
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.services.csv_import_service import import_villages_from_csv


def seed_database(db: Session, force_reload: bool = False):
    """
    Seeds database from the villages.csv dataset, populating settlements,
    hazard data, historical incidents, risk assessments, and relocation recommendations.
    """
    print("Beginning TerraShield database seeding from villages.csv...")
    Base.metadata.create_all(bind=engine)
    result = import_villages_from_csv(db)
    print(f"Seed completed: {result['message']}")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db, force_reload=True)
    finally:
        db.close()
