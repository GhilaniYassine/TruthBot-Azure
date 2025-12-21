from tavily import TavilyClient
import os
from dotenv import load_dotenv
from azure.ai.agents.models import ListSortOrder
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv
import os

load_dotenv()
tavily_api_key = os.getenv("TAVILY_API_KEY")


# ============= TAVILY SEARCH IMPLEMENTATION =============
def tavily_web_search(query, include_domains=None, exclude_domains=None):
    """Direct Tavily web search function"""
    try:
        if not tavily_api_key:
            return {
                "success": False,
                "error": "TAVILY_API_KEY not found in environment variables",
                "results": [],
                "total_results": 0,
            }
        
        client = TavilyClient(api_key=tavily_api_key)
        
        response = client.search(
            query=query,
            include_domains=include_domains or [],
            exclude_domains=exclude_domains or [],
            max_results=10
        )
        
        if not response or "results" not in response or not response.get("results"):
            return {
                "success": False,
                "error": f"No search results found for: {query}",
                "results": [],
                "total_results": 0,
            }
        
        # Format results
        formatted_results = []
        for result in response.get("results", []):
            formatted_results.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "content": result.get("content", "")[:500],  # Truncate for brevity
                "source": result.get("source", "")
            })
        
        return {
            "success": True,
            "error": None,
            "results": formatted_results,
            "total_results": len(formatted_results),
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Tavily search error: {str(e)}",
            "results": [],
            "total_results": 0,
        }



# Load project and agent
project = AIProjectClient(
    credential=DefaultAzureCredential(),
    endpoint=os.getenv("agent_project"))

agent = project.agents.get_agent(os.getenv("agent_id"))


def run_agent_and_get_response(project, agent, claim, search_context):
    """
    Call the agent, create a thread, run the agent, and get the response.
    
    Args:
        project: AIProjectClient instance
        agent: Agent instance
        claim: The claim to fact-check
        search_context: The search results context
        
    Returns:
        str: The agent's response or error message
    """
    try:
        print("\n[→] PHASE 2: SearchAgent (Orchestrator) processing...")
        
        # Create thread
        thread = project.agents.threads.create()
        
        # Create message
        message = project.agents.messages.create(
            thread_id=thread.id,
            role="user",
            content=(f"this is the claim {claim} and those are the search results {search_context}")
        )
        
        # Run agent
        run = project.agents.runs.create_and_process(
            thread_id=thread.id,
            agent_id=agent.id,
        )
        
        # Get the result
        messages = project.agents.messages.list(
            thread_id=thread.id,
            order=ListSortOrder.ASCENDING,
        )
        
        if run.status == "failed":
            error_msg = f"Run failed: {run.last_error}"
            print(error_msg)
            return error_msg
        else:
            # Extract and return only the assistant's response (skip user messages)
            response_text = ""
            for message in messages:
                if message.role != "user" and message.text_messages:
                    response_text += message.text_messages[-1].text.value
            
            return response_text
            
    except Exception as e:
        error_msg = f"Error running agent: {str(e)}"
        print(error_msg)
        import traceback
        traceback.print_exc()
        return error_msg
