# 🔍 TruthBot - AI-Powered Fact-Checking Platform

> Verify claims, expose misinformation, and discover the truth with TruthBot's multi-agent AI system backed by real-time web research.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Pydantic](https://img.shields.io/badge/Pydantic-V2-FF43A1.svg)](https://docs.pydantic.dev/)
[![Azure](https://img.shields.io/badge/Azure-0078D4.svg?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![Azure AI Agents](https://img.shields.io/badge/Azure%20AI%20Agents-0078D4.svg?logo=microsoft-azure&logoColor=white)](https://learn.microsoft.com/en-us/azure/ai-services/agents/)
[![Tavily API](https://img.shields.io/badge/Tavily%20Search-FF6B35.svg)](https://tavily.com/)

---

## 📋 Overview

TruthBot is an advanced fact-checking platform that combines:
- **Real-time Web Search** via Tavily API
- **Azure AI Multi-Agent System** for intelligent analysis
- **Modern React Frontend** with ChatGPT-style interface
- **FastAPI Backend** for seamless API integration

Simply enter a claim, and TruthBot will analyze it against reliable sources, provide evidence-based verdicts, and explain its reasoning.

---

## ✨ Features

### 🤖 Intelligent Analysis
- Multi-agent orchestration for comprehensive fact-checking
- Real-time web search integration (Tavily)
- Azure AI Agents for deep analysis
- Color-coded verdict system (True, False, Partial, Misleading, Unverifiable)


### 📊 Detailed Reporting
- Evidence-based conclusions
- Source citations with credibility ratings
- Confidence indicators
- Contextual explanations
- Search result summaries

### 🔧 Developer-Friendly
- RESTful API endpoints
- Type-safe TypeScript frontend
- Modular component architecture
- Comprehensive documentation

---

## 🛠️ Tech Stack
### Backend
| Technology | Purpose |
|-----------|---------|
| **Python 3.10+** | Core language |
| **FastAPI** | Web framework |
| **Uvicorn** | ASGI server |
| **Azure AI Agents** | Agent orchestration |
| **Tavily API** | Web search integration |
| **Azure Identity** | Authentication |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Azure OpenAI** | LLM & AI capabilities |
| **Azure AI Projects** | Agent management |
| **Tavily Search** | Real-time web search |
| **Azure Identity** | Identity & access |


## 📦 Project Structure

```
TruthBot-Azure/
├── frontend/                          # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx      # Main chat component
│   │   │   ├── ChatMessage.tsx        # Message display
│   │   │   └── VerdictMessage.tsx     # Verdict display
│   │   ├── services/
│   │   │   └── api.ts                 # API integration
│   │   ├── pages/
│   │   │   └── Index.tsx              # Main page
│   │   ├── App.tsx                    # App root
│   │   └── main.tsx                   # Entry point
│   └── package.json
│
├── endpoint/                          # FastAPI backend
│   ├── fact.py                        # API endpoints
│   └── utils.py                       # Utility functions
│
├── env/                               # Python virtual environment
├── systemMessage/                     # AI system prompts
│   ├── SearchAgent.md
│   ├── VerificationAnalyst.md
│   └── AccuracyChecker.md
│
├── main.py                            # CLI interface
├── utils.py                           # Core utilities
├── req.txt                            # Python dependencies
└── README.md                          # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 16+** & **npm** or **yarn**
- **Azure Account** with OpenAI & AI Projects access
- **Tavily API Key**

### Environment Setup

#### 1. Clone & Navigate
```bash
cd TruthBot-Azure
```

#### 2. Backend Setup

**Create Python Virtual Environment:**
```bash
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

**Install Dependencies:**
```bash
pip install -r req.txt
```

**Configure Environment Variables:**
Create a `.env` file in the root directory:
```env
# Azure Configuration
AZURE_SUBSCRIPTION_ID=your_subscription_id
AZURE_RESOURCE_GROUP=your_resource_group
AZURE_TENANT_ID=your_tenant_id
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret

# Agent Configuration
agent_project=https://your-resource.cognitiveservices.azure.com/
agent_id=your_agent_id

# Tavily API
TAVILY_API_KEY=your_tavily_api_key
```

#### 3. Frontend Setup

**Navigate to Frontend:**
```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Create Frontend .env:**
Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🏃 Running the Application

### Terminal 1: Start Backend (FastAPI)
```bash
cd /path/to/TruthBot-Azure/endpoint
python3 -m uvicorn fact:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Available Endpoints:**
- `POST /fact-check` - Submit a claim for fact-checking
- `GET /health` - Health check endpoint

### Terminal 2: Start Frontend (Vite Dev Server)
```bash
cd /path/to/TruthBot-Azure/frontend
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📡 API Documentation

### Fact-Check Endpoint

**Request:**
```http
POST /fact-check
Content-Type: application/json

{
  "claim": "The Earth is flat"
}
```

**Response:**
```json
{
  "claim": "The Earth is flat",
  "search_results_count": 10,
  "verdict": "This claim is FALSE...",
  "success": true,
  "error": null
}
```

### Verdict Types
- `TRUE` - Evidence strongly supports the claim
- `FALSE` - Evidence contradicts the claim
- `PARTIALLY_TRUE` - Some parts are accurate, others need context
- `UNVERIFIABLE` - Insufficient reliable information
- `MISLEADING` - Technically accurate but missing important context

---

## 🔄 How It Works

```
┌──────────────────────────────────────────────────────────┐
│  User enters claim in Frontend                           │
└─────────────────────┬──────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│  FastAPI Backend receives claim                          │
└─────────────────────┬──────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐
│ Tavily   │  │ Azure AI │  │ Verification│
│ Web      │  │ Agents   │  │ Analysis    │
│ Search   │  │ (Multi)  │  │ Agent       │
└────┬─────┘  └────┬─────┘  └──────┬───────┘
     │             │              │
     └─────────────┼──────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Generate Verdict with│
        │ Evidence & Sources   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Return to Frontend   │
        │ (Color-coded card)   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Display to User      │
        │ with Animations      │
        └──────────────────────┘
```

---


## 🔐 Security

- **CORS Enabled**: Frontend communication secured
- **Environment Variables**: Sensitive data in `.env`
- **Azure Authentication**: DefaultAzureCredential for secure access
- **API Validation**: Pydantic models for request validation

---

## 📊 Performance

- **Frontend**: Optimized React components with code splitting
- **Backend**: FastAPI with async support
- **Caching**: Message history in component state
- **Search**: Real-time results from Tavily

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

---

## 🎯 Future Enhancements

- [ ] Voice input/output
- [ ] Claim export to PDF
- [ ] User authentication & history
- [ ] Multi-language support
- [ ] Advanced filtering & analytics
- [ ] Integration with fact-checking databases
- [ ] Real-time collaboration features

---



---

## 📧 Questions?

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Made with ❤️ by the TruthBot Team (just me :) ) **

*Last Updated: December 22, 2025*
