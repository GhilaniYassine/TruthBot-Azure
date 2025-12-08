from azure.ai.agents import AgentsClient
from azure.identity import DefaultAzureCredential
import os
from dotenv import load_dotenv
import json
import time
from tavily import TavilyClient

load_dotenv()
project_endpoint = os.getenv("project_endpoint")
model_deployment = os.getenv("model_deployment")
tavily_api_key = os.getenv("TAVILY_API_KEY")


# ============= TAVILY SEARCH IMPLEMENTATION =============
def tavily_web_search(query, include_domains=None, exclude_domains=None):
    """Direct Tavily web search function"""
    try:
        if not tavily_api_key:
            return json.dumps({
                "success": False,
                "error": "TAVILY_API_KEY not found in environment variables"
            })
        
        client = TavilyClient(api_key=tavily_api_key)
        
        response = client.search(
            query=query,
            include_domains=include_domains or [],
            exclude_domains=exclude_domains or [],
            max_results=10
        )
        
        if not response or "results" not in response or not response.get("results"):
            return json.dumps({
                "success": False,
                "error": f"No search results found for: {query}"
            })
        
        # Format results
        formatted_results = []
        for result in response.get("results", []):
            formatted_results.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "content": result.get("content", "")[:500],  # Truncate for brevity
                "source": result.get("source", "")
            })
        
        return json.dumps({
            "success": True,
            "results": formatted_results,
            "total_results": len(formatted_results)
        })
        
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": f"Tavily search error: {str(e)}"
        })


# ============= AGENT TOOL DEFINITION =============
tavily_search_tool = {
    "type": "function",
    "function": {
        "name": "tavily_web_search",
        "description": "Search the web using Tavily API to find verifiable sources and evidence for fact-checking",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to find relevant sources"
                },
                "include_domains": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Domains to prioritize (e.g., ['bbc.com', 'reuters.com', 'apnews.com'])"
                },
                "exclude_domains": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Domains to exclude from results"
                }
            },
            "required": ["query"]
        }
    }
}

#creating the connection 

FoundaryConnection = AgentsClient(
    endpoint=project_endpoint,
    credential=DefaultAzureCredential(
        exclude_environment_credential=True, 
        exclude_managed_identity_credential=True
    )
)

# let's create first an agent that will recive the user input and the websearch
SearchAgent = FoundaryConnection.create_agent(
    name="SearchAgent",
    model=model_deployment,
    instructions="""You are a Research Verification Agent specialized in fact-checking and evidence gathering.

Your task is to analyze the claim and provide a verdict based on common knowledge and general information.

## Your Analysis Should Include:

**CLAIM:** [Repeat the user's claim]

**ANALYSIS:**
- What would need to be true for this claim to be accurate?
- Based on your knowledge cutoff and general information, is this claim likely true or false?
- What are the supporting or contradicting factors?

**LIKELY VERDICT:** TRUE / FALSE / UNVERIFIABLE
[Brief explanation]

**NOTE:** For real-time fact-checking with current web sources, you would need web search capability.

Example: For "Cristiano Ronaldo is dead" - He is a world-famous footballer. Such a significant event would be globally reported. Without recent news, this is likely FALSE.""",
    tools=[]
)




# Function to call Tavily API
def tavily_search(query, include_domains=None, exclude_domains=None):
    """Execute Tavily web search with error handling"""
    try:
        if not tavily_api_key:
            return {
                "success": False,
                "error": "TAVILY_API_KEY not found in environment variables",
                "results": []
            }
        
        client = TavilyClient(api_key=tavily_api_key)
        
        if not query or not isinstance(query, str):
            return {
                "success": False,
                "error": "Invalid query: query must be a non-empty string",
                "results": []
            }
        
        response = client.search(
            query=query,
            include_domains=include_domains or [],
            exclude_domains=exclude_domains or [],
            max_results=10
        )
        
        if not response:
            return {
                "success": False,
                "error": "Tavily API returned empty response",
                "results": []
            }
        
        if "results" not in response or not response.get("results"):
            return {
                "success": False,
                "error": "No search results found for the query",
                "results": [],
                "query": query
            }
        
        return {
            "success": True,
            "error": None,
            "results": response.get("results", []),
            "query": query
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Tavily API error: {str(e)}",
            "results": []
        }

# Tool execution handler
def execute_tool(tool_name, tool_input):
    """Execute the appropriate tool with error handling"""
    try:
        if tool_name == "tavily_web_search":
            result = tavily_search(
                query=tool_input.get("query"),
                include_domains=tool_input.get("include_domains"),
                exclude_domains=tool_input.get("exclude_domains")
            )
            
            if not result.get("success"):
                return {
                    "error": result.get("error", "Unknown error occurred"),
                    "results": [],
                    "status": "failed"
                }
            
            return result
        else:
            return {
                "error": f"Unknown tool: {tool_name}",
                "results": [],
                "status": "failed"
            }
    except Exception as e:
        return {
            "error": f"Tool execution error: {str(e)}",
            "results": [],
            "status": "failed"
        }


# Step 4: Execute Agent with User Input
from azure.ai.agents.models import MessageRole, ListSortOrder

def run_truth_bot():
    """Main function to run the truth-bot with Tavily search integration"""
    
    # Get user input
    print("\n" + "="*70)
    print("TRUTHBOT - Claim Verification System")
    print("="*70)
    claim = input("\nEnter the claim you want to fact-check:\n> ").strip()
    
    if not claim:
        print("Error: Please enter a valid claim")
        return
    
    print("\n" + "-"*70)
    print(f"Analyzing claim: '{claim}'")
    print("Searching for verifiable sources... This may take a moment.")
    print("-"*70 + "\n")
    
    try:
        # STEP 1: Perform Tavily search
        print("[→] Searching the web using Tavily...")
        search_result = tavily_search(claim)
        
        if not search_result.get("success"):
            print(f"[!] Search failed: {search_result.get('error')}")
            search_context = f"Search failed: {search_result.get('error')}. Please provide analysis based on your knowledge."
        else:
            results = search_result.get("results", [])
            print(f"[✓] Found {len(results)} sources")
            
            # Format search results for agent
            search_context = f"Search Results for '{claim}':\n\n"
            for i, result in enumerate(results, 1):
                search_context += f"{i}. Title: {result.get('title', 'N/A')}\n"
                search_context += f"   URL: {result.get('url', 'N/A')}\n"
                search_context += f"   Content: {result.get('content', 'N/A')[:300]}...\n\n"
        
        # STEP 2: Create thread with search results
        thread = FoundaryConnection.threads.create()
        print(f"[✓] Thread created: {thread.id}")
        
        # STEP 3: Send claim with search results to agent
        full_message = f"""Please analyze this claim and the search results:

CLAIM: {claim}

SEARCH RESULTS:
{search_context}

Please provide your fact-check analysis in this format:

**CLAIM:** {claim}

**SOURCES SUPPORTING:**
[List any supporting sources with URLs and key info]

**SOURCES CONTRADICTING:**
[List any contradicting sources with URLs and key info]

**SUMMARY:**
[Your verdict: TRUE/FALSE/PARTIALLY TRUE/UNVERIFIABLE with explanation]"""
        
        message = FoundaryConnection.messages.create(
            thread_id=thread.id,
            role=MessageRole.USER,
            content=full_message
        )
        print(f"[✓] Sent claim and search results to agent")
        
        # STEP 4: Run agent
        print("[→] Running SearchAgent...")
        run = FoundaryConnection.runs.create_and_process(
            thread_id=thread.id,
            agent_id=SearchAgent.id
        )
        
        # Check for errors
        if run.status == "failed":
            print(f"\n[✗] Agent execution failed: {run.last_error}")
            return
        
        if run.status == "completed":
            print(f"[✓] Agent execution completed successfully")
        else:
            print(f"[!] Agent status: {run.status}")
        
        # STEP 5: Display results
        print("\n" + "="*70)
        print("FACT-CHECK RESULTS")
        print("="*70 + "\n")
        
        messages = FoundaryConnection.messages.list(
            thread_id=thread.id,
            order=ListSortOrder.ASCENDING
        )
        
        # Display agent response
        has_agent_response = False
        for message in messages:
            if message.text_messages:
                for text_msg in message.text_messages:
                    role = "AGENT" if message.role != MessageRole.USER else "USER"
                    
                    if message.role != MessageRole.USER:
                        has_agent_response = True
                        print(text_msg.text.value)
        
        if not has_agent_response:
            print("[✗] No response received from SearchAgent")
            return
        
        print("\n" + "="*70)
        print("[✓] Fact-checking complete!")
        print("="*70 + "\n")
        
    except Exception as e:
        print(f"\n[✗] Error during execution: {str(e)}")
        import traceback
        traceback.print_exc()


# Run the truth-bot
if __name__ == "__main__":
    run_truth_bot()
