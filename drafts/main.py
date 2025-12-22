from azure.ai.projects import AIProjectClient 
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder  
from endpoint.utils import tavily_web_search ,run_agent_and_get_response, project, agent
import os
from dotenv import load_dotenv

load_dotenv()



def run_truth_bot():
    
    
    # Get user input
    print("\n" + "="*70)
    print("TRUTHBOT ")
    print("="*70)
    claim = input("\nEnter the claim you want to fact-check:\n> ").strip()
    
    if not claim:
        print("Error: Please enter a valid claim")
        return
    
    print("\n" + "-"*70)
    print(f"Analyzing claim: '{claim}'")
    print("Initializing three-agent orchestration system...")
    print("-"*70 + "\n")
    
    try:
        # PHASE 1: Web Search
        print("[→] PHASE 1: Searching the web using Tavily...")
        search_result = tavily_web_search(claim)
        
        if not search_result.get("success"):
            print(f"[!] Search failed: {search_result.get('error')}")
            search_context = f"Search failed: {search_result.get('error')}. Please provide analysis based on your knowledge."
        else:
            results = search_result.get("results", [])
            print(f"[✓] Found {len(results)} sources")
            
            # Format search results for agents
            search_context = f"Search Results for '{claim}':\n\n"
            for i, result in enumerate(results, 1):
                search_context += f"{i}. Title: {result.get('title', 'N/A')}\n"
                search_context += f"   URL: {result.get('url', 'N/A')}\n"
                search_context += f"   Content: {result.get('content', 'N/A')[:300]}...\n"
                search_context += f"   Source: {result.get('source', 'N/A')}\n\n"
        
        # PHASE 2: SearchAgent (Orchestrator) analyzes and gathers info
        response = run_agent_and_get_response(project, agent, claim, search_context)
        
        # Print the result back
        print("\n" + "-"*70)
        print("FINAL VERDICT:")
        print("-"*70 + "\n")
        print(response)
    except Exception as e:
        print(f"\n[✗] Error during execution: {str(e)}")
        import traceback
        traceback.print_exc()

# Run the truth-bot
if __name__ == "__main__":
    run_truth_bot()

