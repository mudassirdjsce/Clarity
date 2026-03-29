# <img src="frontend/src/assets/CLARITY1.svg" alt="Clarity Logo" width="40" height="40"> Clarity

A comprehensive, AI-powered financial technology platform featuring dual portals for **Retail Users** and **Institutional/Corporate Teams**. Leveraging xAI's Grok for intelligent insights, real-time sentiment analysis, and multimodal interactions (Voice, Text, and Camera scanning).

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)

---

## ✨ Key Features

### 🧑‍💼 Corporate & Institutional Portal
* **Treasury Management:** Track institutional holdings and treasury accounts.
* **Risk Exposure Metrics:** Advanced dashboards for corporate risk assessment.
* **Institutional News Feed:** Filtered, high-credibility news specifically for corporate decision-making.

### 👤 Retail User Portal
* **Wealth & Portfolio Tracking:** Monitor stocks, mutual funds, and family financial goals.
* **Gamified Learning Path:** Interactive modules to improve financial literacy.
* **Spotify-Style Finance Wrapped:** A yearly/periodic visual summary of user portfolio behaviors and insights.
* **Family Goal Planning:** Plan and track festival budgets and family-oriented financial goals.

### 🤖 AI & Core Engine
* **Grok-Powered Assistant:** Multimodal chat assistant supporting text, voice inputs, and file uploads.
* **Automated News Pipeline:** Cron-job-driven ingestion, normalization, and deduplication of financial news.
* **Sentiment & Credibility Scoring:** AI-driven analysis to rank news sources and aggregate market sentiment.
* **Multilingual Support:** Full localization for English (`en`), Hindi (`hi`), and Marathi (`mr`).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, i18next (Localization) |
| **Backend** | Node.js, Express, MongoDB (Mongoose), Node-cron |
| **AI Services** | Python, FastAPI, xAI (Grok), Pydantic |
| **External APIs** | Finnhub (Stock Data), NewsAPI (Financial News) |
| **Features** | Web Speech API (TTS/STT), TensorFlow.js (Object Detection) |

---

## 📁 Project Architecture

### 1. Frontend (`/frontend`)
Built with React + Vite, structured by user roles and feature domains.

```text
├── public/
├── src/
│   ├── components/
│   │   ├── chat/          # FileUpload, SpeakButton, VoiceInput
│   │   ├── mutualfunds/   # Collections, CompareFunds, FundCards
│   │   ├── radar/         # RadarChart displays
│   │   ├── stocks/        # MarketTicker, MoversTable, StockCards
│   │   └── wrapped/       # Slides (Asset, Behavior, Insight, Intro, etc.)
│   ├── locales/           # en.json, hi.json, mr.json
│   ├── pages/
│   │   ├── common/        # LandingPage, Login, Signup, WrappedPage
│   │   ├── company/       # Dashboard, RiskExposureMetrics, NewsInstitution
│   │   └── user/          # Family, GamifiedLearningPath, MutualFunds, Stocks
│   ├── hooks/             # useObjectDetection, useTTS
│   └── services/          # api.js
```

### 2. Backend (`/backend`)
A robust Node.js/Express API handling complex cron jobs, data ingestion, and dual-tenancy.

```text
├── config/                # db.js, env.js
├── controllers/           # auth, insights, news, tts
├── cron/                  # insightsCron, newsCron
├── models/                # User, BankAccount, Holding, TreasuryAccount, etc.
├── routes/                # auth, insights, news, tts
├── services/
│   ├── ingestion/         # deduplicator, newsFetcher, normalizer
│   ├── insights/          # insightEngine, marketAnalyzer, sentimentAggregator
│   └── processing/        # aiService, credibilityService, filterService
├── scripts/               # seedNews.js
└── utils/                 # helpers, logger, sendEmail
```

### 3. AI Services (`/ai_service`)
A Python FastAPI microservice acting as the brain of the application using Grok LLMs.

```text
├── models/                # chat_model, portfolio_model
├── routes/                # chat.py
├── services/              # grok_service, intent_service, news_service, 
│                         # portfolio_service, sentiment_service, stock_service
├── utils/                 # cache.py, prompt_builder.py
├── config.py
├── database.py
└── main.py                # FastAPI entry point
```

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed and accounts set up:
* **Node.js** (v18+)
* **Python** (v3.9+)
* **MongoDB** (Local instance or MongoDB Atlas URI)
* **xAI Account** (For Grok API Key)
* **NewsAPI Account** (For fetching real-time financial news articles)
* **Finnhub Account** (For real-time stock quotes, market tickers, and institutional data)

### 1. Clone the Repository
```bash
git clone https://github.com/mudassirdjsce/Clarity.git
cd Clarity
```

### 2. Environment Variables
Copy the `.env.example` files located in `frontend/`, `backend/`, and `ai_service/` and fill in your credentials. 

Here are the **critical API keys** you will need to add:

#### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clarity_db
JWT_SECRET=your_jwt_secret

# Financial Data APIs (Used in cron jobs and routes)
NEWS_API_KEY=your_newsapi_org_key
FINHUB_API_KEY=your_finnhub_io_key
```

#### AI Services (`ai_service/.env`)
```env
# AI Models
XAI_API_KEY=your_xai_grok_api_key

# (Optional, if AI service also directly calls market data)
FINHUB_API_KEY=your_finnhub_io_key
NEWS_API_KEY=your_newsapi_org_key
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_AI_URL=http://localhost:8000
```

### 3. Run the Application (3 Terminals Required)

Open **three separate terminal windows** and run the following:

#### Terminal 1: Frontend
```bash
cd frontend
npm install
npm run dev
```
👉 Access at: `http://localhost:3000`

#### Terminal 2: Backend
```bash
cd backend
npm install
npm run dev
```
👉 Server running on: `http://localhost:5000` (or configured port)

#### Terminal 3: AI Services
```bash
cd ai_service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
👉 Server running on: `http://localhost:8000`
👉 Swagger Docs at: `http://localhost:8000/docs`

---

## 🔌 How the Services Connect

1. **Frontend** makes API calls to the **Backend** for standard CRUD operations (Auth, fetching saved Holdings, User profiles).
2. **Backend** uses the `FINHUB_API_KEY` to fetch stock metrics and the `NEWS_API_KEY` (via `newsCron.js` and `newsFetcher.js`) to ingest, deduplicate, and normalize news, storing them in MongoDB.
3. For heavy lifting (Chat Assistant, Sentiment Analysis, Portfolio Insights), the **Backend** forwards requests to the **AI Service**.
4. **AI Service** uses `prompt_builder.py` to format context, queries the **Grok API** (`grok_service.py`), and streams the response back to the backend and ultimately the frontend.
5. **Frontend** utilizes Web Speech APIs and custom React Hooks (`useTTS`, `useObjectDetection`) to handle voice inputs and camera scanning locally before sending payloads to the backend.

---

## 🤝 Contributing

1. Fork the Project (`https://github.com/mudassirdjsce/Clarity/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📬 Contact & Support

- **Maintainer:** [@mudassirdjsce]([https://github.com/mudassirdjsce](https://github.com/Kennethd21)https://github.com/mudassirdjscehttps://github.com/mudassirdjsce)
- **Issues:** [Report a bug or request a feature](https://github.com/mudassirdjsce/Clarity/issues)
