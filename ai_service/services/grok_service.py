import httpx
import json
from config import GROQ_API_KEY

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

# user  → fast 8b model, short output, ≤5s total
# company → 70b model, richer output, ≤15s total
_MODELS = {
    "user":    ("llama-3.1-8b-instant",    400),
    "company": ("llama-3.3-70b-versatile", 1600),
}

SYSTEM_PROMPT = (
    "You are a financial AI. "
    "Output a single raw JSON object. "
    "Rules: No markdown. No code fences. No text before or after the JSON. "
    "Start your response with { and end it with }. Nothing else."
)

_REQUIRED_KEYS = {
    "user":    {"insight", "risk", "suggestion", "explanation"},
    "company": {"summary", "financials", "risk_analysis", "sentiment", "outlook", "recommendation", "explanation"},
}


def _extract_json(text: str) -> str:
    """
    Robustly extract the outermost JSON object from a string.
    Handles: code fences, preamble text, postamble text, nested braces.
    Uses brace-counting to find the true end of the JSON object.
    """
    text = text.strip()

    # Step 1 — strip code fences if present
    if text.startswith("```"):
        lines = text.splitlines()
        end = -1 if lines[-1].strip() == "```" else len(lines)
        text = "\n".join(lines[1:end]).strip()

    # Step 2 — find start of JSON object
    start = text.find('{')
    if start == -1:
        return text  # No JSON object, let caller handle

    # Step 3 — brace-counting to find the true closing }
    depth     = 0
    in_string = False
    escape    = False

    for i, ch in enumerate(text[start:], start):
        if escape:
            escape = False
            continue
        if ch == '\\' and in_string:
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
        if not in_string:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return text[start:i + 1]

    # Incomplete JSON — return from start to end (best-effort)
    return text[start:]


async def _call_groq(messages: list[dict], model: str, max_tokens: int) -> str:
    payload = {
        "model":       model,
        "messages":    messages,
        "temperature": 0.2,
        "max_tokens":  max_tokens,
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(GROQ_URL, headers=HEADERS, json=payload)
        try:
            res.raise_for_status()
        except httpx.HTTPStatusError:
            detail = res.text
            try:
                detail = res.json()
            except Exception:
                pass
            raise RuntimeError(f"Groq {res.status_code}: {detail}")
    return res.json()["choices"][0]["message"]["content"]


async def generate_response(message: str, intent: str, data: dict, role: str) -> dict:
    from utils.prompt_builder import build_prompt

    model, max_tokens = _MODELS.get(role, _MODELS["user"])
    prompt = build_prompt(message, intent, data, role)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": prompt},
    ]

    raw = None
    try:
        raw    = await _call_groq(messages, model, max_tokens)
        extracted = _extract_json(raw)
        parsed = json.loads(extracted)
        return parsed

    except RuntimeError as e:
        return {"error": str(e)}

    except json.JSONDecodeError:
        # Last resort: return the raw text so the user sees something
        return {
            "insight": (raw or "The AI returned an unstructured response.").strip()
        }

    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}