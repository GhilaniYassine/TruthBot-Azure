from azure.ai.agents.models import ListSortOrder
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv
import os

load_dotenv()

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
