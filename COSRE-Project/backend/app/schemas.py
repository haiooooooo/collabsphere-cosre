from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from app.models import UserRole, TeamStatus

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: UserRole = UserRole.STUDENT

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TeamCreate(BaseModel):
    name: str
    project_topic: str

class TeamResponse(BaseModel):
    id: UUID
    name: str
    status: TeamStatus
    join_code: str
