# 🤖 TruthBot - AI-Powered Fact-Checking System

> **Challenge**: This project was proposed by **AI4GOOD** company at the **NUIT D'INFO Hackathon** as a challenge I wanted to work on again and push further.

---

## 📋 Overview

TruthBot is an intelligent fact-checking system that leverages **AI agents**, **web search**, and **multi-agent orchestration** to verify claims and deliver clear, evidence-backed verdicts. Built with modern technologies, it combines powerful backend services with an intuitive frontend interface.

---

## 🛠️ Tech Stack

### **Backend & AI Services**
- **FastAPI** - Modern, fast web framework for building APIs
- **Pydantic V2** - Data validation and serialization with Python type hints
- **Azure AI Agents SDK** - Multi-agent orchestration and coordination
- **Microsoft Foundry** - AI model hosting and deployment platform
- **Tavily Search API** - Intelligent web search for fact-gathering

### **Frontend**
- **React 18** - UI library with TypeScript for type safety
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **TypeScript** - Strongly typed JavaScript for reliability

### **DevOps & Version Control**
- **Git & GitHub** - Version control and collaboration

---

## 🤖 Agent Creation (`agent-creation.py`)

The `agent-creation.py` script initializes and configures AI agents within the **Microsoft Foundry** project. It sets up the orchestrator agent (SearchAgent) and specialized agents (AccuracyChecker, VerificationAnalyst) with system prompts and tool connections. This automated setup ensures agents are pre-configured with the right instructions and can seamlessly coordinate to analyze claims, verify sources, and generate decisive verdicts. The script handles authentication, agent registration, and tool linking within the Foundry infrastructure.

---

## 🎨 Frontend

The frontend delivers a **ChatGPT-style** interface for claim verification. Users input any claim, and the system processes it through multiple AI agents to deliver evidence-backed verdicts. The interface displays:
- **Clear verdict statements** (TRUE/FALSE) with reasoning
- **Clickable source links** for users to verify claims independently
- **Real-time processing indicators** with smooth animations
- **Responsive design** that works seamlessly on desktop and mobile
- **Modern glassmorphism styling** with gradient backgrounds and smooth transitions

---

## 🚀 How to Run

### **Prerequisites**
```bash
# Python 3.10+ and virtual environment
python3 --version
```

### **1. Setup Environment**
```bash
# Clone the repository
git clone https://github.com/GhilaniYassine/TruthBot-Azure.git
cd TruthBot-Azure

# Create and activate virtual environment
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r req.txt
```

### **2. Configure Azure & API Keys**
Create a `.env` file in the root directory:
```env
AZURE_SUBSCRIPTION_ID=your_subscription_id
AZURE_RESOURCE_GROUP=your_resource_group
TAVILY_API_KEY=your_tavily_api_key
```

### **3. Start Backend Server**
```bash
# From root directory
python3 -m uvicorn endpoint.fact:app --host 0.0.0.0 --port 8000 --reload
```

### **4. Start Frontend Development Server**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
TruthBot-Azure/
├── endpoint/
│   ├── fact.py              # FastAPI application & endpoints
│   └── utils.py             # Helper functions for agents & search
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API integration
│   │   └── App.tsx          # Main application
│   └── index.html
├── systemMessage/
│   ├── SearchAgent.md       # Main orchestrator instructions
│   ├── AccuracyChecker.md   # Source credibility analyzer
│   └── VerificationAnalyst.md # Verdict synthesizer
├── agent-creation.py        # Initialize agents in Foundry
├── main.py                  # CLI entry point
└── req.txt                  # Python dependencies
```

---

## 🔄 Workflow

1. **User Input** → User enters a claim to fact-check
2. **Web Search** → Tavily API gathers relevant sources
3. **Multi-Agent Analysis** → SearchAgent orchestrates AccuracyChecker and VerificationAnalyst
4. **Verdict Generation** → Agents produce evidence-backed verdict (TRUE/FALSE/PARTIALLY TRUE/etc.)
5. **Frontend Display** → Results shown with clickable sources and clear reasoning

---

## 📊 API Endpoints

### **POST /fact-check**
Verify a claim and receive a detailed fact-check verdict.

**Request:**
```json
{
  "claim": "The Earth is round"
}
```

**Response:**
```json
{
  "claim": "The Earth is round",
  "verdict": "YES, this claim is TRUE because...",
  "search_results": [
    {
      "title": "Source Title",
      "url": "https://example.com",
      "content": "Snippet content...",
      "source": "example.com"
    }
  ],
  "success": true
}
```

### **GET /health**
Check API health status.

---

## 🎯 Features

✅ **Multi-Agent Orchestration** - Coordinated AI agents for comprehensive analysis  
✅ **Real-time Web Search** - Tavily integration for current information  
✅ **Evidence-Backed Verdicts** - Clear TRUE/FALSE verdicts with reasoning  
✅ **Clickable Sources** - Users can verify claims independently  
✅ **Modern UI** - ChatGPT-style interface with smooth animations  
✅ **Type-Safe Backend** - Pydantic validation for robust API  
✅ **Azure Integration** - Secure cloud-based deployment ready  

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Yassine Ghilani** - AI ENGINEER
Challenge accepted and built with 🚀

---

**Built with ❤️ for AI4GOOD @ NUIT D'INFO Hackathon**
