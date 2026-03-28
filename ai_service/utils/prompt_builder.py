"""
prompt_builder.py — Multilingual, role-aware prompt construction.

Supported languages (auto-detected):
  • English  — Latin script only
  • Hinglish  — Mixed Hindi-English (Latin script, common Hindi words)
  • Hindi     — Devanagari script
  • Marathi   — Devanagari script (Marathi-specific vocabulary)

Detection strategy:
  1. Devanagari Unicode block → distinguish Hindi vs Marathi by vocabulary.
  2. Latin script with common Hinglish marker words → Hinglish.
  3. Otherwise → English (safe default).

The LLM is then instructed to respond in the SAME language/style — no translation.
"""

import json
import re

# ---------------------------------------------------------------------------
# JSON schemas (unchanged)
# ---------------------------------------------------------------------------

_USER_SCHEMA = (
    '{"insight":"...","risk":"Low|Medium|High — one reason",'
    '"suggestion":"one action","explanation":"2-3 short sentences"}'
)

_COMPANY_SCHEMA = """{
  "summary": "2-3 sentence executive overview",
  "financials": {"price": "...", "trend": "Uptrend|Downtrend|Sideways", "volatility": "Low|Medium|High"},
  "risk_analysis": {"level": "Low|Medium|High", "factors": ["...", "..."]},
  "sentiment": {"market_sentiment": "Bullish|Bearish|Neutral", "news_impact": "..."},
  "outlook": {"short_term": "...", "long_term": "..."},
  "recommendation": "Strong Buy|Buy|Hold|Sell|Strong Sell",
  "explanation": "3-5 sentence rationale citing the data"
}"""

# ---------------------------------------------------------------------------
# Language detection
# ---------------------------------------------------------------------------

# Marathi-specific common words (not shared with Hindi)
_MARATHI_MARKERS = {
    "आहे", "आहेत", "नाही", "काय", "कसे", "मला", "करा", "सांगा",
    "शेअर", "बाजार", "पैसे", "माझ्या", "तुमच्या", "आणि", "किंवा",
    "होते", "झाले", "येईल", "असेल",
}

# Hindi-specific common words
_HINDI_MARKERS = {
    "है", "हैं", "नहीं", "क्या", "कैसे", "मुझे", "करो", "बताओ",
    "शेयर", "बाजार", "पैसा", "मेरा", "तुम्हारा", "और", "या",
    "था", "थे", "होगा", "होगी", "रुपए", "रुपये", "कंपनी",
}

# Hinglish marker words (Hindi words written in Roman/Latin script)
_HINGLISH_MARKERS = {
    "kya", "hai", "hain", "nahi", "karo", "batao", "mujhe", "mera",
    "tumhara", "aur", "ya", "paisa", "share", "market", "bhai",
    "yaar", "matlab", "accha", "theek", "bilkul", "lagta", "chahiye",
    "kaisa", "kyun", "iska", "uska", "agar", "toh", "phir",
}

_DEVANAGARI_RE = re.compile(r'[\u0900-\u097F]')


def detect_language(text: str) -> str:
    """
    Returns one of: 'english', 'hindi', 'marathi', 'hinglish'
    """
    # 1. Check for Devanagari script
    if _DEVANAGARI_RE.search(text):
        words = set(text.split())
        marathi_score = len(words & _MARATHI_MARKERS)
        hindi_score   = len(words & _HINDI_MARKERS)
        return "marathi" if marathi_score >= hindi_score else "hindi"

    # 2. Check for Hinglish (Latin script with Hindi-origin words)
    lower_words = set(text.lower().split())
    hinglish_hits = len(lower_words & _HINGLISH_MARKERS)
    if hinglish_hits >= 1:          # even one marker → treat as Hinglish
        return "hinglish"

    # 3. Default → English
    return "english"


# ---------------------------------------------------------------------------
# Per-language instructions injected into prompts
# ---------------------------------------------------------------------------

_LANG_RULES = {
    "english": (
        "LANGUAGE: Respond in English only."
    ),
    "hindi": (
        "LANGUAGE: User ne Hindi mein poocha hai.\n"
        "- Poora jawab shuddh Hindi (Devanagari lipi) mein do.\n"
        "- Angreji mein BILKUL mat likhna, sirf financial technical terms\n"
        "  (P/E ratio, EBITDA, MACD, SIP, NAV, FD) English mein rakh sakte ho.\n"
        "- JSON keys English mein rahenge — sirf field VALUES Hindi mein likhna.\n"
        "- Tone: sahaj, spashtho, aur sahayak."
    ),
    "marathi": (
        "LANGUAGE: Koristakarte Marathi bhashet prashna vicharla ahe.\n"
        "- Sampurna uttar shuddha Marathit (Devanagari lipit) dya.\n"
        "- English madhe AJAKIBAT lihoo nakos, faqt financial technical terms\n"
        "  (P/E ratio, EBITDA, MACD, SIP, NAV) English madhe rahu shatat.\n"
        "- JSON keys English mein rahil — faqt field VALUES Marathit lihaa.\n"
        "- Swar: saral, spashta ani sahayak."
    ),
    "hinglish": (
        "LANGUAGE: User ne Hinglish mein poocha hai (Hindi aur English mix).\n"
        "- Roman script mein Hinglish mein jawab do (Devanagari mat use karna).\n"
        "- Natural Hinglish tone: jaise dost se baat kar rahe ho.\n"
        "- Financial terms (P/E, MACD, SIP, NAV) English mein rakh sakte ho.\n"
        "- JSON keys English mein rahenge — sirf field VALUES Hinglish mein likhna.\n"
        "- Example style: 'Yaar, is stock ka price abhi ₹450 ke aas-paas hai...'"
    ),
}


# ---------------------------------------------------------------------------
# Public API — unchanged signature
# ---------------------------------------------------------------------------

def build_prompt(message: str, intent: str, data: dict, role: str) -> str:
    data_str  = json.dumps(data, indent=2)
    lang      = detect_language(message)
    lang_rule = _LANG_RULES.get(lang, _LANG_RULES["english"])

    # ── Branch 1: File upload — message itself is the content ──────────────────
    if intent == "file_analysis":
        file_type = "CSV dataset" if "📊" in message else "PDF document"
        schema = _USER_SCHEMA if role == "user" else _COMPANY_SCHEMA
        return (
            f"ROLE: Expert data analyst and financial advisor.\n"
            f"\n{lang_rule}\n\n"
            f"TASK: The user has uploaded a {file_type}. Analyze its content thoroughly.\n"
            f"RULES:\n"
            f"- Read and understand the actual data/text provided below.\n"
            f"- For CSV: identify columns, trends, key statistics, outliers, and actionable insights.\n"
            f"- For PDF: summarize key points, extract important information, identify financial data.\n"
            f"- Do NOT make up data — only use what is explicitly present in the file content.\n"
            f"- Financial terms (P/E, SIP, NAV etc.) may stay in English in any language mode.\n"
            f"- CRITICAL: Respond in the language specified in the LANGUAGE rule above.\n\n"
            f"FILE CONTENT TO ANALYZE:\n{message}\n\n"
            f"Return ONLY this JSON schema filled in:\n{schema}"
        )

    # ── Branch 2: Company / institutional role ──────────────────────────────────
    if role == "company":
        return (
            f"ROLE: Institutional analyst for a professional trading desk.\n"
            f"\n{lang_rule}\n\n"
            f"RULES:\n"
            f"- Use professional finance language (P/E, beta, MACD, ATR, EBITDA).\n"
            f"- Every field MUST contain substantive natural-language text. Do NOT simplify.\n"
            f"- Field values MUST be plain strings. Do NOT use JSON syntax, brackets, or braces inside any field value.\n"
            f"- 'financials.price' must look like: '₹1,250 (up 0.16% today)' — NOT a raw number.\n"
            f"- 'risk_analysis.factors' must be a JSON array of plain strings.\n"
            f"- Do NOT copy or echo raw data object keys/values into field values.\n"
            f"- CRITICAL: Respond in the language specified above. Do NOT override with English.\n\n"
            f"QUERY: {message}\n"
            f"INTENT: {intent}\n"
            f"DATA (use to inform analysis, do NOT quote verbatim):\n{data_str}\n\n"
            f"Return ONLY this JSON schema filled in completely:\n{_COMPANY_SCHEMA}"
        )

    # ── Branch 3: User / retail role (default) ─────────────────────────────────
    return (
        f"ROLE: Friendly assistant for a beginner retail investor.\n"
        f"\n{lang_rule}\n\n"
        f"RULES:\n"
        f"- Write in plain, simple sentences — no technical jargon.\n"
        f"- Max 4 short sentences total across ALL fields combined.\n"
        f"- Do NOT copy, paste, or echo any raw numbers, brackets, braces, or JSON syntax into field values.\n"
        f"- 'insight' must be a single natural sentence, e.g. 'Apple stock abhi ₹189 ke aas-paas hai, aaj thoda upar hai.'\n"
        f"- 'risk' must be: Low, Medium, or High — followed by one short reason.\n"
        f"- 'suggestion' must be one clear action sentence a beginner would understand.\n"
        f"- 'explanation' must be 1-2 friendly sentences with no raw numbers from data.\n"
        f"- CRITICAL: Respond in the language specified above. Do NOT override with English.\n\n"
        f"QUERY: {message}\n"
        f"DATA (use this to inform your answer, do NOT quote it verbatim):\n{data_str}\n\n"
        f"Return ONLY this JSON schema filled in:\n{_USER_SCHEMA}"
    )