import re
import httpx
from config import FINNHUB_API_KEY
from utils.cache import STOCK_CACHE

# ── Company Name → Ticker Dictionary ──────────────────────────────────────────
COMPANY_MAP = {
    "apple": "AAPL", "microsoft": "MSFT", "google": "GOOGL", "alphabet": "GOOGL",
    "amazon": "AMZN", "tesla": "TSLA", "meta": "META", "facebook": "META",
    "nvidia": "NVDA", "netflix": "NFLX", "adobe": "ADBE", "salesforce": "CRM",
    "intel": "INTC", "amd": "AMD", "qualcomm": "QCOM", "broadcom": "AVGO",
    "oracle": "ORCL", "ibm": "IBM", "cisco": "CSCO", "paypal": "PYPL",
    "uber": "UBER", "lyft": "LYFT", "airbnb": "ABNB", "spotify": "SPOT",
    "twitter": "X", "snapchat": "SNAP", "pinterest": "PINS", "palantir": "PLTR",
    "coinbase": "COIN", "robinhood": "HOOD", "square": "SQ", "block": "SQ",
    "shopify": "SHOP", "zoom": "ZM", "slack": "WORK", "snowflake": "SNOW",
    "datadog": "DDOG", "crowdstrike": "CRWD", "mongodb": "MDB", "okta": "OKTA",
    "twilio": "TWLO", "docusign": "DOCU", "cloudflare": "NET", "palo alto": "PANW",
    "ford": "F", "gm": "GM", "general motors": "GM", "toyota": "TM",
    "berkshire": "BRK.B", "jpmorgan": "JPM", "jp morgan": "JPM",
    "goldman sachs": "GS", "morgan stanley": "MS", "bank of america": "BAC",
    "wells fargo": "WFC", "citigroup": "C", "visa": "V", "mastercard": "MA",
    "american express": "AXP", "johnson & johnson": "JNJ", "johnson and johnson": "JNJ",
    "pfizer": "PFE", "moderna": "MRNA", "merck": "MRK", "abbvie": "ABBV",
    "unitedhealth": "UNH", "walmart": "WMT", "target": "TGT", "costco": "COST",
    "disney": "DIS", "comcast": "CMCSA", "at&t": "T", "verizon": "VZ",
    "exxon": "XOM", "chevron": "CVX", "bp": "BP", "shell": "SHEL",
    "reliance": "RELIANCE.BSE", "tcs": "TCS.BSE", "infosys": "INFY",
    "wipro": "WIT", "hdfc": "HDFCBANK.BSE", "icici": "IBN",
}

TICKER_REGEX = re.compile(r'\b([A-Z]{1,5})\b')


def extract_symbol(query: str) -> str:
    q_lower = query.lower()

    # 1. Multi-word company name match (longest match first)
    for name in sorted(COMPANY_MAP, key=len, reverse=True):
        if name in q_lower:
            return COMPANY_MAP[name]

    # 2. Uppercase ticker regex (e.g. user typed "TSLA" or "AAPL")
    tokens = TICKER_REGEX.findall(query)
    if tokens:
        return tokens[0]

    return "AAPL"  # final default


async def get_stock_data(query: str) -> dict:
    symbol = extract_symbol(query)

    # Cache hit
    if symbol in STOCK_CACHE:
        return STOCK_CACHE[symbol]

    url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url)
            res.raise_for_status()
            data = res.json()

        result = {
            "symbol":  symbol,
            "price":   data.get("c"),
            "high":    data.get("h"),
            "low":     data.get("l"),
            "open":    data.get("o"),
            "prev_close": data.get("pc"),
            "change_pct": round(((data.get("c", 0) - data.get("pc", 0)) / data.get("pc", 1)) * 100, 2),
            "source":  "Finnhub",
        }

        STOCK_CACHE[symbol] = result
        return result

    except Exception as e:
        return {"symbol": symbol, "error": str(e), "source": "Finnhub"}