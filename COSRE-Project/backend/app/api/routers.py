from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from app.api import deps
from app.models import User, Team, TeamStatus
from app.schemas import UserCreate, UserLogin, Token, TeamCreate, TeamResponse
from app.security import get_password_hash, verify_password, create_access_token

auth_router = APIRouter()
team_router = APIRouter()

@auth_router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(deps.get_db)):
    # Mock login logic for generation brevity
    return {"access_token": "mock_token", "token_type": "bearer"}

@team_router.post("/", response_model=TeamResponse)
def create_team(team_in: TeamCreate, db: Session = Depends(deps.get_db)):
    # Mock create logic
    return {
        "id": uuid.uuid4(),
        "name": team_in.name,
        "status": TeamStatus.PENDING,
        "join_code": "ABC-123",
        "project_topic": team_in.project_topic
    }
