from textblob import TextBlob

# Finance-specific term overrides — domain-aware polarity adjustment
POSITIVE_TERMS = {
    "rally", "surge", "growth", "profit", "bullish", "gains", "boom",
    "record high", "outperform", "beat", "upgrade", "strong", "recovery",
    "expansion", "buy", "upside", "dividend", "breakout",
}

NEGATIVE_TERMS = {
    "crash", "recession", "default", "bearish", "loss", "layoffs", "plunge",
    "selloff", "downgrade", "miss", "weak", "decline", "bankruptcy", "bubble",
    "correction", "contraction", "sell", "downside", "warning", "risk",
}

BOOST = 0.3


def _finance_adjust(text: str, base_score: float) -> float:
    """Adjust base TextBlob polarity using finance-specific vocabulary."""
    lower = text.lower()
    adjustment = 0.0
    for term in POSITIVE_TERMS:
        if term in lower:
            adjustment += BOOST
    for term in NEGATIVE_TERMS:
        if term in lower:
            adjustment -= BOOST
    # Clamp to [-1, 1]
    return max(-1.0, min(1.0, base_score + adjustment))


def get_sentiment(headlines: list[str]) -> dict:
    if not headlines:
        return {"score": 0.0, "label": "Neutral", "headline_count": 0}

    scores = []
    for h in headlines:
        if not h:
            continue
        base = TextBlob(h).sentiment.polarity
        adjusted = _finance_adjust(h, base)
        scores.append(adjusted)

    if not scores:
        return {"score": 0.0, "label": "Neutral", "headline_count": 0}

    avg = sum(scores) / len(scores)

    # Tighter thresholds (±0.15) for financial sensitivity
    if avg > 0.15:
        label = "Bullish"
    elif avg < -0.15:
        label = "Bearish"
    else:
        label = "Neutral"

    return {
        "score": round(avg, 3),
        "label": label,
        "headline_count": len(scores),
    }