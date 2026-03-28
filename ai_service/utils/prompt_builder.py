import json

_USER_SCHEMA = '{"insight":"...","risk":"Low|Medium|High — one reason","suggestion":"one action","explanation":"2-3 short sentences"}'

_COMPANY_SCHEMA = """{
  "summary": "2-3 sentence executive overview",
  "financials": {"price": "...", "trend": "Uptrend|Downtrend|Sideways", "volatility": "Low|Medium|High"},
  "risk_analysis": {"level": "Low|Medium|High", "factors": ["...", "..."]},
  "sentiment": {"market_sentiment": "Bullish|Bearish|Neutral", "news_impact": "..."},
  "outlook": {"short_term": "...", "long_term": "..."},
  "recommendation": "Strong Buy|Buy|Hold|Sell|Strong Sell",
  "explanation": "3-5 sentence rationale citing the data"
}"""


def build_prompt(message: str, intent: str, data: dict, role: str) -> str:
    data_str = json.dumps(data, indent=2)

    if role == "company":
        return (
            f"ROLE: Institutional analyst for a professional trading desk.\n"
            f"RULES:\n"
            f"- Use professional finance language (P/E, beta, MACD, ATR, EBITDA).\n"
            f"- Every field MUST contain substantive natural-language text. Do NOT simplify.\n"
            f"- Field values MUST be plain strings. Do NOT use JSON syntax, brackets, or braces inside any field value.\n"
            f"- 'financials.price' must look like: '₹1,250 (up 0.16% today)' — NOT a raw number.\n"
            f"- 'risk_analysis.factors' must be a JSON array of plain English strings.\n"
            f"- Do NOT copy or echo raw data object keys/values into field values.\n\n"
            f"QUERY: {message}\n"
            f"INTENT: {intent}\n"
            f"DATA (use to inform analysis, do NOT quote verbatim):\n{data_str}\n\n"
            f"Return ONLY this JSON schema filled in completely:\n{_COMPANY_SCHEMA}"
        )

    return (
        f"ROLE: Friendly assistant for a beginner retail investor.\n"
        f"RULES:\n"
        f"- Write in plain English sentences ONLY. Absolutely no technical jargon.\n"
        f"- Max 4 short sentences total across ALL fields combined.\n"
        f"- Do NOT copy, paste, or echo any raw numbers, brackets, braces, or JSON syntax into field values.\n"
        f"- 'insight' must be a single natural English sentence like 'Apple stock is currently trading at around $189, which is slightly up today.'\n"
        f"- 'risk' must be: Low, Medium, or High — followed by one short reason in plain English.\n"
        f"- 'suggestion' must be one clear action sentence a beginner would understand.\n"
        f"- 'explanation' must be 1-2 friendly sentences with no numbers copied from data.\n\n"
        f"QUERY: {message}\n"
        f"DATA (use this to inform your answer, do NOT quote it verbatim):\n{data_str}\n\n"
        f"Return ONLY this JSON schema filled in:\n{_USER_SCHEMA}"
    )