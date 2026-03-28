import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY    = os.getenv("GROQ_API_KEY")
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
NEWS_API_KEY    = os.getenv("NEWS_API_KEY")
MONGO_URI       = os.getenv("MONGO_URI")