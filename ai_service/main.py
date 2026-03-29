import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router

app = FastAPI(title="Clarity AI", version="2.0.0")

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:3000")
allowed_origins = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/chat")


@app.get("/")
def home():
    return {"status": "ok", "service": "Clarity AI", "version": "2.0.0"}


@app.get("/api/health")
def health():
    return {"status": "ok", "services": {"llm": "Grok-2", "stocks": "Finnhub", "news": "NewsAPI"}}