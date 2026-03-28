from config import GROQ_API_KEY
import httpx

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

VALID_INTENTS = {"stock_analysis", "news", "portfolio", "general"}
INTENT_MODEL  = "llama-3.1-8b-instant"

SYSTEM_PROMPT = (
    "You are an intent classifier for a financial AI assistant. "
    "Classify the user's message into exactly one of these intents: "
    "stock_analysis, news, portfolio, general. "
    "Respond with only the intent label — no punctuation, no explanation."
)


def _keyword_intent(message: str) -> str:
    """Fast keyword fallback — zero latency, no API call."""
    msg = message.lower()
    if any(k in msg for k in ("stock", "price", "analyze", "share", "ticker", "equity", "aapl", "tsla")):
        return "stock_analysis"
    if any(k in msg for k in ("news", "headline", "rbi", "fed", "policy", "inflation", "rate")):
        return "news"
    if any(k in msg for k in ("portfolio", "invest", "allocat", "risk", "diversif", "allocation")):
        return "portfolio"
    return "general"


async def detect_intent(message: str, role: str = "user") -> str:
    """
    user role  → keyword-only (instant, saves ~1-2s).
    company role → LLM classification with fast 8b model for higher accuracy.
    """
    if role == "user":
        return _keyword_intent(message)

    # company: LLM-based with llama-3.1-8b-instant (fast + accurate)
    try:
        payload = {
            "model": INTENT_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": message},
            ],
            "temperature": 0.0,
            "max_tokens":  5,
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.post(GROQ_URL, headers=HEADERS, json=payload)
            res.raise_for_status()
            label = res.json()["choices"][0]["message"]["content"].strip().lower()

        if label in VALID_INTENTS:
            return label

    except Exception:
        pass

    return _keyword_intent(message)