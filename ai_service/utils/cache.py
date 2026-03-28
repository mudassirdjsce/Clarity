from cachetools import TTLCache

# Stock quotes cached for 60 seconds per ticker symbol
STOCK_CACHE = TTLCache(maxsize=256, ttl=60)

# News articles cached for 5 minutes per query string
NEWS_CACHE = TTLCache(maxsize=128, ttl=300)
