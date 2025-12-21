from azure.ai.agents import AgentsClient
from azure.ai.agents.models import MessageRole, ListSortOrder ,ConnectedAgentTool
from azure.identity import DefaultAzureCredential
import os
from dotenv import load_dotenv
import json
import time
from utils import tavily_web_search

load_dotenv()
project_endpoint = os.getenv("project_endpoint")
model_deployment = os.getenv("model_deployment")

#creating the connection 

FoundaryConnection = AgentsClient(
    endpoint=project_endpoint,
    credential=DefaultAzureCredential(
        exclude_environment_credential=True, 
        exclude_managed_identity_credential=True
    )
)
# Read system messages from files
def read_system_message(filename):
    """Read system message from markdown file"""
    try:
        with open(f"systemMessage/{filename}", "r") as f:
            return f.read()
    except FileNotFoundError:
        print(f"Warning: {filename} not found, using default instructions")
        return ""

# ============= THREE-AGENT ORCHESTRATION SYSTEM =============



# AGENT 2: AccuracyChecker
AccuracyChecker = FoundaryConnection.create_agent(
    name="AccuracyChecker",
    model=model_deployment,
    instructions=read_system_message("AccuracyChecker.md"),
   
)
AccuracyChecker_tool = ConnectedAgentTool(
    id=AccuracyChecker.id,
    name="AccuracyCheckerTool",
    description="Tool to access the AccuracyChecker agent for source credibility assessments."
)


# AGENT 3: VerificationAnalyst
VerificationAnalyst = FoundaryConnection.create_agent(
    name="VerificationAnalyst",
    model=model_deployment,
    instructions=read_system_message("VerificationAnalyst.md"),
)
#connected agent and pass them to search agent as tool 
VerificationAnalyst_tool = ConnectedAgentTool(
    id=VerificationAnalyst.id,
    name="VerificationAnalystTool",
    description="Tool to access the VerificationAnalyst agent for final fact-check verdicts."
)

# AGENT 1: SearchAgent (Main Orchestrator)
SearchAgent = FoundaryConnection.create_agent(
    name="SearchAgent",
    model=model_deployment,
    instructions=read_system_message("SearchAgent.md"),
    tools=[
        AccuracyChecker_tool.definitions[0], 
        VerificationAnalyst_tool.definitions[0]],
)



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
        thread1 = FoundaryConnection.threads.create()

        FoundaryConnection.messages.create(
            thread_id=thread1.id,
            role=MessageRole.USER,
            content=(
                f"Fact-check the following claim: '{claim}'.\n\n"
                f"Use the search context below. You have connected tools: AccuracyCheckerTool and VerificationAnalystTool. "
                f"Call AccuracyCheckerTool first for credibility assessment, then call VerificationAnalystTool for final verdict.\n\n"
                f"SEARCH CONTEXT:\n{search_context}"
            ),
        )

        # Execute agent
        run = FoundaryConnection.runs.create_and_process(
            thread_id=thread1.id,
            agent_id=SearchAgent.id,
        )

        # Get the result back and print it
        messages = FoundaryConnection.messages.list(
            thread_id=thread1.id,
            order=ListSortOrder.ASCENDING,
        )
        print("\n" + "-"*70)
        print("FINAL VERDICT:")
        print("-"*70 + "\n")
        printed_any = False
        for message in messages:
            if message.role != MessageRole.USER and getattr(message, "text_messages", None):
                for text_msg in message.text_messages:
                    printed_any = True
                    print(text_msg.text.value)

        if not printed_any:
            print("[!] No response received from SearchAgent")
        
    except Exception as e:
        print(f"\n[✗] Error during execution: {str(e)}")
        import traceback
        traceback.print_exc()

# Run the truth-bot
if __name__ == "__main__":
    run_truth_bot()
