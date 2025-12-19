from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Use SQLite for local dev if Postgres is not available, or handle error gracefully
try:
    engine = create_engine(settings.get_database_url())
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except:
    # Fallback to SQLite for easy local testing without docker
    engine = create_engine("sqlite:///./sql_app.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
