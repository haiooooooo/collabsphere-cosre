import uuid
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.types import TypeDecorator, CHAR

Base = declarative_base()

# Helper for SQLite compatibility (SQLite doesn't support UUID natively)
class GUID(TypeDecorator):
    impl = CHAR
    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(UUID())
        else:
            return dialect.type_descriptor(CHAR(36))
    def process_bind_param(self, value, dialect):
        if value is None: return value
        return str(value)
    def process_result_value(self, value, dialect):
        if value is None: return value
        return uuid.UUID(value)

class UserRole(str, PyEnum):
    ADMIN = "ADMIN"
    STAFF = "STAFF"
    HEAD = "HEAD"
    LECTURER = "LECTURER"
    STUDENT = "STUDENT"

class TeamStatus(str, PyEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class TaskStatus(str, PyEnum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    REVIEW = "REVIEW"
    DONE = "DONE"

class User(Base):
    __tablename__ = "users"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    
class Team(Base):
    __tablename__ = "teams"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    project_topic = Column(String, nullable=False)
    status = Column(Enum(TeamStatus), default=TeamStatus.PENDING)
    join_code = Column(String, unique=True)
