from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils import tavily_web_search, run_agent_and_get_response, project, agent

app = FastAPI(title="TruthBot API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite dev server (default)
        "http://localhost:3000",      # Alternative port
        "http://localhost:8080",      # Another common port
        "http://localhost:8000",      # If frontend runs on same port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClaimRequest(BaseModel):
    """Request model for fact-checking a claim"""
    claim: str


class FactCheckResponse(BaseModel):
    """Response model for fact-checking results"""
    claim: str
    search_results_count: int
    verdict: str
    success: bool
    error: str = None


@app.post("/fact-check", response_model=FactCheckResponse)
async def fact_check(request: ClaimRequest):
    """
    Fact-check a claim using the TruthBot orchestration system.
    
    Args:
        request: ClaimRequest containing the claim to fact-check
        
    Returns:
        FactCheckResponse with the verdict and search results
    """
    claim = request.claim.strip()
    
    if not claim:
        raise HTTPException(status_code=400, detail="Claim cannot be empty")
    
    try:
        # PHASE 1: Web Search
        search_result = tavily_web_search(claim)
        
        if not search_result.get("success"):
            search_context = f"Search failed: {search_result.get('error')}. Please provide analysis based on your knowledge."
            results_count = 0
        else:
            results = search_result.get("results", [])
            results_count = len(results)
            
            # Format search results for agents
            search_context = f"Search Results for '{claim}':\n\n"
            for i, result in enumerate(results, 1):
                search_context += f"{i}. Title: {result.get('title', 'N/A')}\n"
                search_context += f"   URL: {result.get('url', 'N/A')}\n"
                search_context += f"   Content: {result.get('content', 'N/A')[:300]}...\n"
                search_context += f"   Source: {result.get('source', 'N/A')}\n\n"
        
        # PHASE 2: SearchAgent (Orchestrator) analyzes and gathers info
        verdict = run_agent_and_get_response(project, agent, claim, search_context)
        
        return FactCheckResponse(
            claim=claim,
            search_results_count=results_count,
            verdict=verdict,
            success=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during fact-checking: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "TruthBot API"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
