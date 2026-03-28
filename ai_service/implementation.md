# Clarity AI - Fintech Backend Implementation & Review

## 1. End-to-End System Flow

The system operates on an orchestrated retrieve-and-generate (RAG) architecture tailored for financial data:

1. **User Request (`API`)**: The client sends a POST request to `/api/chat` containing a query, role (`"user"` or `"company"`), and `sessionId`.
2. **Intent Detection (`Intent Service`)**: The query is parsed to route it to the correct domain (`stock_analysis`, `news`, `portfolio`, or `general`).
3. **Data Fetching (`Domain Services`)**: Based on intent, external APIs are queried (Finnhub for price data, NewsAPI for articles) or internal portfolio logic is triggered.
4. **Context Building (`Sentiment & Prompting`)**: News is analyzed via TextBlob for sentiment. All context is packaged by `prompt_builder.py` into a specialized template.
5. **AI Generation (`Grok Service`)**: xAI's Grok API processes the prompt and returns a structured JSON response (insights, risk, financials).
6. **Data Enrichment (`Source Service`)**: Source urls and attributions are appended to the AI's response for transparency.
7. **Storage (`MongoDB`)**: The final generated response and user message are saved asynchronously to the `chat_history` collection.

---

## 2. Architecture Explanation

The project uses a standard, structured FastAPI microservice architecture:

* **`routes/chat.py`**: The main orchestrator. It receives requests, links services conditionally, and handles the macro-level control flow.
* **`services/`**: The brain of the API integrations and core business logic.
  * **`stock/news/portfolio_service.py`**: Data fetching layers.
  * **`grok_service.py`**: External AI LLM adapter.
  * **`intent/sentiment_service.py`**: Internal classification and NLP layers.
  * **`source_service.py`**: Trust and attribution layer.
* **`utils/prompt_builder.py`**: The context engine. Converts raw JSON data and intents into LLM-digestible text constraints.
* **`models/` & `database.py`**: Direct PyMongo wrappers interacting with MongoDB for persistence.

**Data Flow**: `Request -> Route Controller -> Intent Analyzer -> Conditional Data Fetch -> Prompt Builder -> Grok LLM -> Source Appender -> DB Persistence -> JSON Response`.

---

## 3. Feature-wise Breakdown

### Conversational Financial Q&A
* **Internal Action**: Fallback for `general` intent. Bypasses external API fetching and asks Grok directly.
* **Why it’s useful**: Answers macro-economic queries ("What is a trailing stop-loss?").

### Stock Analysis
* **Internal Action**: Extracts ticker -> Fetches Finnhub Quote -> Prompts Grok.
* **Example**: "Analyze TSLA" -> `{"symbol": "TSLA", "price": 180... }` -> Grok explains support/resistance levels.
* **Why it’s useful**: Real-time snapshot combined with AI narrative generation.

### News-Based Intelligence
* **Internal Action**: Fetches NewsAPI based on query -> Runs Sentiment Analysis -> Prompts Grok.
* **Why it’s useful**: Saves analysts hours of reading by synthesizing 5 headlines into one clear market impact summary.

### Portfolio Suggestions
* **Internal Action**: Detects "risk" keywords to assign predefined allocations -> Updates DB.
* **Why it’s useful**: Simplifies asset allocation for retail users based on text-inferred risk tolerance.

---

## 4. API Integrations

* **Finnhub (`/quote`)**: Used for live pricing metrics (current, high, low). It grounds the AI in reality so it doesn't hallucinate stock prices.
* **NewsAPI (`/everything`)**: Used to fetch the 5 most recent articles matching the query. Required for real-time awareness and sentiment context.
* **Grok (`xAI endpoint`)**: The core reasoning engine. Used purely as a synthesizer and structurer, merging the hard data (prices, news) with financial knowledge to output JSON.

---

## 5. Sentiment Analysis Logic

* **Mechanism**: Uses `TextBlob`. Each headline is parsed, and its `polarity` score is calculated. 
* **Mapping**: The average score of all headlines determines the label (> 0.2 = Positive, < -0.2 = Negative, rest = Neutral).
* **⚠️ Critical Limitations**: `TextBlob` is untrained for finance. "Unemployment drops to record low" might be politically positive but market-negative because of rate hike fears. TextBlob misses these nuances completely.

---

## 6. Role-Based Intelligence

The system utilizes structural prompt branching in `prompt_builder.py`:
* **User (Retail)**: Enforces "Explain simply." Returns `insight`, `risk`, and `suggestion`. Output is built for readability and actionable basics.
* **Company (Institutional)**: Enforces "Institutional analysis". The schema expands drastically required `financials`, `risk_analysis`, `sentiment`, and `outlook` nodes. It targets quants and analysts.

---

## 7. Database Design (MongoDB)

* **`chat_history` Collection**: Stores `session_id`, `user_message`, `bot_response`, and `timestamp`. Serves as the audit log and memory layer.
* **`portfolio` Collection**: Stores user risk profiles via `allocation` objects mapped to a `session_id` using `upsert=True` to maintain the latest state.

---

## 8. Explainability (VERY IMPORTANT)

For financial tools, trust is paramount. 
* **Transparency**: Enforced via `source_service.py`. Every response is explicitly tagged with the exact URLs or data providers ("Finnhub") used to construct the answer. If the AI hallucinates, the user can verify the source link.
* **Trustworthiness**: By utilizing a RAG architecture, Grok is constrained to the prompt data. It relies on the requested `data` object rather than its own pre-trained, outdated weights.

---

## 9. Error Handling & Edge Cases (Current Flaws)

* **Grok API Failures**: The `grok_service.py` wraps the request in a broad `try/except`. If the AI outputs malformed markdown instead of pure JSON, `json.loads(content)` crashes, and the user gets a generic `"Error parsing AI response"`.
* **API Timeouts**: No timeout handling on Finnhub/NewsAPI `requests.get()`. A slow third-party API will freeze the FastAPI thread.
* **Synchronous DB Calls**: `pymongo` is blocking. Doing `chat_collection.insert_one()` in a FastAPI async endpoint without a threadpool or Motor blocks other users.

---

## 10. Improvements & Scalability 🏗️

As an architect, here are the required upgrades for production:

1. **Replace TextBlob with FinBERT**: Sentiment analysis *must* be context-aware. FinBERT is specifically trained on financial sentiment.
2. **LLM-Based Intent Routing**: Keyword searching (`"analyze" in message`) is too brittle. Use a small, fast local LLM or Grok itself to classify intents via zero-shot classification before fetching data.
3. **Regex Ticker Extraction**: `if word.isupper(): return word` will fail for queries like "Is apple a good stock?". You need an NLP entity extractor (spaCy) or an LLM call to reliably grab tickers.
4. **Use Async I/O**: Replace `requests` with `aiohttp` or `httpx`, and replace `pymongo` with `motor`. FastAPI's performance is killed by synchronous I/O.
5. **Grok JSON Mode**: You must append system instructions strictly enforcing JSON format, and preferably utilize Grok's native API response formatting features if supported, to stop JSON parse crashes.
6. **Caching**: Wrap API routes with Redis. Frequent checks of `AAPL` should not hit Finnhub repeatedly within a 5-minute window.

---

## 11. Validation Checklist (CRITICAL)

* [x] **Are sources always returned?** Yes, `attach_sources` appends them securely to the final JSON.
* [x] **Is MongoDB storing data correctly?** Yes, session records are correctly isolated, though synchronously.
* [x] **Does role-based output actually differ?** Yes, the JSON schemas enforced by `prompt_builder.py` are drastically different.
* [ ] **Is sentiment correctly attached?** Partially. It attaches reliably, but the output's accuracy is questionable due to `TextBlob`.
* [ ] **Are APIs properly used?** Mostly. However, the NewsAPI query relies on the exact user string, which results in garbage-in/garbage-out fetching.

---

## 12. Final Verdict

**Verdict:** ⛔ **NOT Production-Ready (Protopyte Stage)**

**Summary:** You have successfully built a working, orchestratable RAG proof-of-concept. The macro level architecture (separating intent, fetching, reasoning, and sourcing) is excellent and follows industry patterns. 

**What is missing for real deployment:**
To move from prototype to production, you must fix the synchronous bottlenecks (implement `httpx` and `motor`), replace the brittle keyword extraction logic with robust NLP/LLMs, handle JSON parsing retries gracefully, and adopt a financial-native sentiment engine like FinBERT.
