# 🔍 TruthBot - AI-Powered Fact Checker

TruthBot is an intelligent fact-checking application that verifies claims using AI-powered agents and web search. It combines real-time web research with advanced AI analysis to provide detailed, credible fact-check verdicts.

## ✨ What It Does

TruthBot works in three phases:

1. **🔎 Web Search**: Performs deep web searches using Tavily to find relevant sources and information about the claim
2. **🤖 AI Analysis**: Passes search results to a sophisticated three-agent orchestration system:
   - **SearchAgent** (Orchestrator): Coordinates the fact-checking process
   - **AccuracyChecker**: Assesses source credibility
   - **VerificationAnalyst**: Provides final fact-check verdicts
3. **📊 Detailed Verdict**: Returns a comprehensive analysis with:
   - Verdict (TRUE/FALSE/PARTIALLY TRUE)
   - Confidence level
   - Supporting evidence from sources
   - Reasoning and limitations

## 🛠️ Tech Stack

- **Foundry Agent Service** - Microsoft Foundry for multi-agent AI orchestration
- **Tavily API** - Web search and information retrieval
- **Streamlit** - Modern, interactive web interface

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Azure account with AI Projects setup
- Tavily API key

### Installation

1. Clone the repository and navigate to the project directory
2. Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r req.txt
   ```

4. Set up environment variables in `.env`:
   ```
   TAVILY_API_KEY=your_tavily_api_key
   project_endpoint=your_azure_project_endpoint
   model_deployment=your_model_deployment_name
   agent_project=your_agent_project_endpoint
   agent_id=your_agent_id
   ```

### Running the Application

**Web Interface (Recommended)**:
```bash
streamlit run app.py
```

**Command Line**:
```bash
python main.py
```

**Agent Creation** (Setup agents):
```bash
python agent-creation.py
```

## 📁 Project Structure

- `app.py` - Modern Streamlit web interface
- `main.py` - Command-line version
- `agent-creation.py` - Azure AI Agent setup and configuration
- `call_agent.py` - Agent execution logic
- `utils.py` - Tavily web search utility function
- `systemMessage/` - AI agent system prompts
  - `SearchAgent.md` - Orchestrator agent instructions
  - `AccuracyChecker.md` - Source credibility assessment
  - `VerificationAnalyst.md` - Final verdict analysis

## 🎯 Key Features

- ✅ Real-time web search integration
- ✅ Multi-agent AI reasoning system
- ✅ Beautiful, modern Streamlit UI
- ✅ Comprehensive fact-check verdicts
- ✅ Source credibility assessment
- ✅ Azure cloud-native architecture
- ✅ Environment variable configuration

## 📝 License

This project is part of the TruthBot initiative for combating misinformation.

---

**Made with ❤️ using  Agent service  & Tavily Search**
