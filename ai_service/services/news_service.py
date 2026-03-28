import httpx
from config import NEWS_API_KEY
from utils.cache import NEWS_CACHE

NEWS_URL = "https://newsapi.org/v2/everything"


async def get_news(query: str) -> dict:
    cache_key = query.lower().strip()

    # Cache hit
    if cache_key in NEWS_CACHE:
        return NEWS_CACHE[cache_key]

    params = {
        "q":        query,
        "apiKey":   NEWS_API_KEY,
        "language": "en",
        "sortBy":   "publishedAt",
        "pageSize": 5,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(NEWS_URL, params=params)
            res.raise_for_status()
            articles = res.json().get("articles", [])[:5]

        result = {
            "headlines": [a.get("title", "") for a in articles],
            "descriptions": [a.get("description", "") for a in articles],
            "sources": [a.get("source", {}).get("name", "Unknown") for a in articles],
            "urls": [a.get("url", "") for a in articles],
        }

        NEWS_CACHE[cache_key] = result
        return result

    except Exception as e:
        return {"headlines": [], "descriptions": [], "sources": [], "urls": [], "error": str(e)}