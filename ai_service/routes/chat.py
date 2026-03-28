from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Literal

from services.intent_service import detect_intent
from services.stock_service import get_stock_data
from services.news_service import get_news
from services.sentiment_service import get_sentiment
from services.portfolio_service import build_portfolio
from services.grok_service import generate_response
from services.source_service import attach_sources
from models.chat_model import save_chat

router = APIRouter()


# ── Request Model ─────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message:   str                          = Field(..., min_length=1, max_length=2000)
    userMode:  Literal["user", "company"]   = Field("user")
    sessionId: str                          = Field(..., min_length=1)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "message":   "Analyze Apple stock and give me a risk assessment",
                    "userMode":  "user",
                    "sessionId": "session-abc-123",
                }
            ]
        }
    }


# ── Response Model ────────────────────────────────────────────────────────────
class ChatResponse(BaseModel):
    intent:   str
    response: dict[str, Any]   # flexible — agent output varies by intent

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "intent": "stock_analysis",
                    "response": {
                        "insight":    "Apple (AAPL) is currently trading at $189, up 0.5% today.",
                        "risk":       "Low — AAPL is a mega-cap with strong balance sheet.",
                        "suggestion": "Consider holding; no urgent action needed.",
                        "explanation": "Apple shows stable momentum with low volatility.",
                        "sources":    ["Finnhub"],
                    },
                }
            ]
        }
    }


# ── Route ─────────────────────────────────────────────────────────────────────
@router.post("/", response_model=ChatResponse, summary="Chat with Clarity AI")
async def chat(payload: ChatRequest):
    message    = payload.message.strip()
    role       = payload.userMode
    session_id = payload.sessionId

    # ── 1. Classify Intent (LLM-based) ──────────────────────────────────────
    intent = await detect_intent(message, role)

    # ── 2. Fetch Domain Data ─────────────────────────────────────────────────
    data = {}

    if intent == "stock_analysis":
        data = await get_stock_data(message)

    elif intent == "news":
        data = await get_news(message)
        data["sentiment"] = get_sentiment(data.get("headlines", []))

    elif intent == "portfolio":
        data = await build_portfolio(message, session_id)

    # ── 3. Generate AI Response ──────────────────────────────────────────────
    ai_response = await generate_response(message, intent, data, role)

    # ── 4. Attach Sources ────────────────────────────────────────────────────
    final_response = attach_sources(ai_response, data)

    # ── 5. Persist to MongoDB ────────────────────────────────────────────────
    try:
        await save_chat(session_id, message, final_response)
    except Exception:
        pass  # Don't fail the request on DB write errors

    return ChatResponse(intent=intent, response=final_response)