import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models import Base
from app.db.base import engine
from app.api.routers import auth_router, team_router

# Create tables if not exist
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"DB Connection Warning: {e}. Running without DB for now.")

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[])
socket_app = socketio.ASGIApp(sio, app)

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(team_router, prefix=f"{settings.API_V1_STR}/teams", tags=["teams"])

@app.get("/")
def root():
    return {"message": "Welcome to COSRE API", "docs": "/docs"}
