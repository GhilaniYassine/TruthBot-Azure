from azure.ai.agents import AgentsClient
from azure.identity import DefaultAzureCredential
import os
from dotenv import load_dotenv
load_dotenv()
project_endpoint = os.getenv("project_endpoint")
model_deployment = os.getenv("model_deployment")

"""
INITIALIZE AZURE AI AGENTS CLIENT FOR FOUNDRY AGENT SERVICE

WHY WE NEED THIS CODE:
The AgentsClient is the central hub that enables communication between your Python application and 
Azure AI Foundry Agent Service. Without it, you cannot create, configure, deploy, or execute any agents.
It acts as a bridge that translates your code commands into API calls to the Foundry platform.

WHAT EACH PARAMETER DOES:

• endpoint (project_endpoint):
  - The URL/address of your Azure AI Foundry project
  - Tells the client WHERE to send requests (which cloud service)
  - Example: https://your-project.cognitiveservices.azure.com/
  - Retrieved from .env file for security (never hardcode credentials)

• credential (DefaultAzureCredential):
  - Handles authentication with Azure securely
  - Determines HOW to authenticate (who you are)
  - Uses Azure's managed identity or service principal credentials
  - Prevents manual password/key management (more secure)

• exclude_environment_credential=True:
  - Disables authentication via environment variables
  - Prevents using plaintext credentials stored in system environment
  - Better security practice: avoids credential exposure in logs

• exclude_managed_identity_credential=True:
  - Disables automatic managed identity detection
  - Forces explicit service principal authentication
  - Better for hybrid/on-premises environments
  - Ensures explicit control over who accesses agents

AGENT OPERATIONS THIS CLIENT ENABLES:
• create_agent(): Create new specialized agents with LLM and instructions
• delete_agent(): Remove agents from Foundry (cleanup/resource management)
• run_agent(): Execute agents to process user input
• threads.create(): Create conversation threads for agent interactions
• messages.create(): Send messages to agent threads
• runs.create_and_process(): Execute agents and wait for results
• messages.list(): Retrieve agent responses and conversation history

SECURITY BENEFITS:
- Credentials never stored in code
- Azure manages token refresh automatically
- Audit trail of all agent operations
- Role-based access control (RBAC) support
"""

agents_client = AgentsClient(
    endpoint=project_endpoint,
    credential=DefaultAzureCredential(
        exclude_environment_credential=True, 
        exclude_managed_identity_credential=True
    )
)
#Step 1: Create Specialized Agents


# Priority Assessment Agent
priority_agent = agents_client.create_agent(
    model=model_deployment,
    name="priority_agent",
    instructions="""Assess urgency: High/Medium/Low
    - High: User-facing or blocking issues
    - Medium: Time-sensitive but not breaking
    - Low: Cosmetic or non-urgent
    Output only the urgency level and brief explanation."""
)

# Team Assignment Agent
team_agent = agents_client.create_agent(
    model=model_deployment,
    name="team_agent",
    instructions="""Assign to team: Frontend/Backend/Infrastructure/Marketing
    Base decision on ticket content.
    Output team name and brief explanation."""
)

# Effort Estimation Agent
effort_agent = agents_client.create_agent(
    model=model_deployment,
    name="effort_agent",
    instructions="""Estimate effort: Small/Medium/Large
    - Small: Can be completed in a day
    - Medium: 2-3 days of work
    - Large: Multi-day or cross-team effort
    Output effort level and brief justification."""
)
# Step 2: Create Orchestrator Agent




#Step 2: Create Connected Agent Tools

from azure.ai.agents.models import ConnectedAgentTool

priority_agent_tool = ConnectedAgentTool(
    id=priority_agent.id, 
    name="priority_agent",
    description="Assess the priority of a ticket"
)

team_agent_tool = ConnectedAgentTool(
    id=team_agent.id, 
    name="team_agent",
    description="Determines which team should take the ticket"
)

effort_agent_tool = ConnectedAgentTool(
    id=effort_agent.id, 
    name="effort_agent",
    description="Determines the effort required"
)

#Step 3: Create Orchestrator #Agent

# Primary agent that coordinates other agents
triage_agent = agents_client.create_agent(
    model=model_deployment,
    name="triage-agent",
    instructions="""Triage the given ticket. Use connected tools to:
    1. Determine ticket priority
    2. Assign to appropriate team
    3. Estimate effort required""",
    tools=[
        priority_agent_tool.definitions[0],
        team_agent_tool.definitions[0],
        effort_agent_tool.definitions[0]
    ]
)


#Step 4: Execute Agent Collaboration
from azure.ai.agents.models import MessageRole, ListSortOrder

# Create a thread for the conversation
thread = agents_client.threads.create()

# Get user input
prompt = input("\nWhat's the support problem you need to resolve?: ")

# Send message to thread
message = agents_client.messages.create(
    thread_id=thread.id,
    role=MessageRole.USER,
    content=prompt,
)

# Execute agents
print("\nProcessing agent thread. Please wait.")
run = agents_client.runs.create_and_process(
    thread_id=thread.id, 
    agent_id=triage_agent.id
)

# Handle errors
if run.status == "failed":
    print(f"Run failed: {run.last_error}")

# Retrieve and display results
messages = agents_client.messages.list(
    thread_id=thread.id, 
    order=ListSortOrder.ASCENDING
)

for message in messages:
    if message.text_messages:
        last_msg = message.text_messages[-1]
        print(f"{message.role}:\n{last_msg.text.value}\n")



#Step 5: Cleanup
# Delete agents when complete
agents_client.delete_agent(triage_agent.id)
print("Deleted triage agent.")
agents_client.delete_agent(priority_agent.id)
print("Deleted priority agent.")
agents_client.delete_agent(team_agent.id)
print("Deleted team agent.")
agents_client.delete_agent(effort_agent.id)
print("Deleted effort agent.")