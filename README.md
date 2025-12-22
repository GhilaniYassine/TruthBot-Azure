# 🔍 TruthBot - AI-Powered Fact Checker

TruthBot is an intelligent fact-checking application that verifies claims using AI-powered agents and web search. It combines real-time web research with advanced AI analysis to provide detailed, credible fact-check verdicts through a modern web interface.

## ✨ What It Does

TruthBot works in three phases:

1. **🔎 Web Search**: Performs deep web searches using Tavily to find relevant sources and information about the claim
2. **🤖 AI Analysis**: Passes search results to a sophisticated three-agent orchestration system:
   - **SearchAgent** (Orchestrator): Coordinates the fact-checking process
   - **AccuracyChecker**: Assesses source credibility
   - **VerificationAnalyst**: Provides final fact-check verdicts
3. **📊 Detailed Verdict**: Returns a comprehensive analysis with:
   - Verdict (TRUE/FALSE/PARTIALLY TRUE/UNVERIFIABLE/MISLEADING)
   - Confidence level (High/Medium/Low)
   - Supporting evidence from sources with credibility tiers
   - Reasoning and limitations

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance REST API framework
- **Azure AI Agent Service** - Multi-agent AI orchestration
- **Tavily API** - Web search and information retrieval
- **Pydantic** - Data validation and serialization

### Frontend
- **Next.js / React** - Modern interactive web interface
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Beautiful styling
- **Vite** - Fast development server

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 16+ and npm/yarn/bun
- Azure account with AI Projects setup
- Tavily API key

### Installation

#### Backend Setup

1. Navigate to the endpoint directory:
   ```bash
   cd endpoint
   ```

2. Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r ../req.txt
   ```

4. Set up environment variables in `.env`:
   ```
   TAVILY_API_KEY=your_tavily_api_key
   project_endpoint=your_azure_project_endpoint
   model_deployment=your_model_deployment_name
   agent_project=your_agent_project_endpoint
   agent_id=your_agent_id
   ```

5. Start the backend server:
   ```bash
   python -m uvicorn fact:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or: yarn install / bun install
   ```

3. Set up environment variables in `.env.local`:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

### Running the Application

**Full Stack (Recommended)**:
- Terminal 1 - Backend: `cd endpoint && python -m uvicorn fact:app --host 0.0.0.0 --port 8000 --reload`
- Terminal 2 - Frontend: `cd frontend && npm run dev`
- Open: `http://localhost:5173`

**Streamlit Interface** (Alternative):
```bash
streamlit run streamlit/app.py
```

**Command Line** (Backend only):
```bash
python main.py
```

**Agent Creation** (Setup agents):
```bash
python draft/agent-creation.py
```

## 📁 Project Structure

```
TruthBot-Azure/
├── endpoint/                      # FastAPI backend
│   ├── fact.py                   # Main API endpoint
│   ├── utils.py                  # Tavily search utility
│   └── ...
├── frontend/                      # Next.js/React frontend
│   ├── src/
│   │   ├── services/api.ts       # API client & parsing
│   │   ├── pages/Index.tsx       # Main page with integration
│   │   ├── components/           # React components
│   │   └── ...
│   ├── .env.local                # Frontend config
│   └── package.json
├── streamlit/                     # Streamlit web interface
│   └── app.py
├── draft/                         # Agent creation utilities
│   └── agent-creation.py
├── systemMessage/                 # AI agent prompts
│   ├── SearchAgent.md
│   ├── AccuracyChecker.md
│   └── VerificationAnalyst.md
├── req.txt                        # Python dependencies
└── README.md
```

## 🎯 Key Features

- ✅ Modern, responsive web interface (Next.js/React)
- ✅ Real-time web search integration (Tavily)
- ✅ Multi-agent AI reasoning system
- ✅ Source credibility assessment
- ✅ Beautiful verdict display with confidence levels
- ✅ RESTful API backend (FastAPI)
- ✅ Dark mode support
- ✅ Azure cloud-native architecture
- ✅ Environment variable configuration
- ✅ Full TypeScript type safety
- ✅ CORS enabled for frontend-backend communication

## 🔗 API Integration

### Frontend to Backend

The frontend communicates with the backend via REST API:

**Endpoint**: `POST /fact-check`

**Request**:
```json
{
  "claim": "The moon is made of cheese"
}
```

**Response**:
```json
{
  "claim": "The moon is made of cheese",
  "search_results_count": 8,
  "verdict": "**VERDICT:** FALSE\n**CONFIDENCE:** High\n...",
  "success": true,
  "error": null
}
```

See [INTEGRATION_GUIDE.md](frontend/INTEGRATION_GUIDE.md) for detailed API documentation.

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - Quick setup guide
- [INTEGRATION_GUIDE.md](frontend/INTEGRATION_GUIDE.md) - Frontend-backend integration details
- [ERROR_FIXES.md](ERROR_FIXES.md) - Troubleshooting guide
- [CODE_EXAMPLES.md](CODE_EXAMPLES.md) - Code snippets and examples

## 🔧 Troubleshooting

### CORS Error
Ensure the backend CORS middleware is configured correctly in `endpoint/fact.py`.

### Frontend Won't Connect
Check that `.env.local` has the correct API URL and the backend is running on port 8000.

### React Router Warnings
Update to React Router v7 future flags (already included in the latest code).

See [ERROR_FIXES.md](ERROR_FIXES.md) for more troubleshooting solutions.

## 🌐 Deployment

### Build Frontend
```bash
cd frontend
npm run build  # Creates dist/ folder
```

### Deploy
- **Vercel** (recommended for Next.js): `vercel deploy`
- **Netlify**: Connect GitHub repo
- **AWS Amplify**: Similar to Netlify
- Any static host can serve the `dist/` folder

Remember to set `VITE_API_BASE_URL` to your production API endpoint.

## 📝 License

This project is part of the TruthBot initiative for combating misinformation.

---

**Made with ❤️ using Azure AI Agent Service & Tavily Search**
