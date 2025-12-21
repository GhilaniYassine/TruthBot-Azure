from azure.ai.projects import AIProjectClient 
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder  
from utils import tavily_web_search
import os
from dotenv import load_dotenv

load_dotenv()

project = AIProjectClient(
    credential=DefaultAzureCredential(),
    endpoint=os.getenv("agent_project"))

agent = project.agents.get_agent(os.getenv("agent_id"))



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
        print("\n[→] PHASE 2: SearchAgent (Orchestrator) processing...")
        thread = project.agents.threads.create()
        message = project.agents.messages.create(
                thread_id=thread.id,
                role="user",
               content=(f"this is the claim {claim} and those are the search results {search_context}")
            )
        run = project.agents.runs.create_and_process(
            thread_id=thread.id,
            agent_id=agent.id,
        )
        

      

      

        # Get the result back and print it
        messages = project.agents.messages.list(
            thread_id=thread.id,
            order=ListSortOrder.ASCENDING,
          )
        if run.status == "failed":
          print(f"Run failed: {run.last_error}")
        else:
            messages = project.agents.messages.list(thread_id=thread.id, order=ListSortOrder.ASCENDING)

        for message in messages:
            if message.text_messages:
                print(f"{message.role}: {message.text_messages[-1].text.value}")
    except Exception as e:
        print(f"\n[✗] Error during execution: {str(e)}")
        import traceback
        traceback.print_exc()

# Run the truth-bot
if __name__ == "__main__":
    run_truth_bot()

