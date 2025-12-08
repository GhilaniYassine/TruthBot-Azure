# Connected Agents Architecture - Ticket Triage System

## Overview
This codebase implements a **multi-agent orchestration system** using Azure AI Foundry Agent Service. It demonstrates how multiple specialized agents can work together through a central orchestrator agent to automate ticket triage workflows.

---

## Architecture Pattern: Hierarchical Multi-Agent System

```
┌─────────────────────────────────────────────────────┐
│           User Input (Support Ticket)               │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Triage Orchestrator      │
        │   (Main Coordinator)       │
        └──┬──────────┬──────────┬───┘
           │          │          │
     ┌─────▼──┐  ┌────▼────┐  ┌─▼──────────┐
     │Priority │  │  Team   │  │   Effort   │
     │ Agent   │  │ Agent   │  │   Agent    │
     └─────────┘  └─────────┘  └────────────┘
           │          │          │
           └──────────┬──────────┘
                      │
                      ▼
        ┌────────────────────────────┐
        │  Aggregated Results:       │
        │  - Priority Level          │
        │  - Assigned Team           │
        │  - Effort Estimate         │
        └────────────────────────────┘
```

---

## Components Breakdown

### 1. **Initialization Phase** (Lines 1-16)

```python
from azure.ai.agents import AgentsClient
from azure.identity import DefaultAzureCredential
agents_client = AgentsClient(
    endpoint=project_endpoint,
    credential=DefaultAzureCredential(...)
)
```

**Purpose:** Establishes connection to Azure AI Foundry
- Creates an `AgentsClient` instance for managing agents
- Uses `DefaultAzureCredential` for secure authentication
- Retrieves configuration from environment variables:
  - `project_endpoint`: Azure AI Foundry project URL
  - `model_deployment`: LLM deployment name (e.g., GPT-4)

---

### 2. **Step 1: Create Specialized Agents** (Lines 19-46)

Three specialized agents are created, each with a focused responsibility:

#### **Priority Assessment Agent**
```python
priority_agent = agents_client.create_agent(
    model=model_deployment,
    name="priority_agent",
    instructions="Assess urgency: High/Medium/Low..."
)
```
- **Role:** Analyzes ticket urgency
- **Output:** Categorizes issues as High (blocking), Medium (time-sensitive), or Low (cosmetic)

#### **Team Assignment Agent**
```python
team_agent = agents_client.create_agent(
    model=model_deployment,
    name="team_agent",
    instructions="Assign to team: Frontend/Backend/Infrastructure/Marketing..."
)
```
- **Role:** Routes tickets to appropriate teams based on content
- **Output:** Team name and brief explanation

#### **Effort Estimation Agent**
```python
effort_agent = agents_client.create_agent(
    model=model_deployment,
    name="effort_agent",
    instructions="Estimate effort: Small/Medium/Large..."
)
```
- **Role:** Estimates work complexity
- **Output:** Effort level (1 day, 2-3 days, or multi-day work)

**Architecture Decision:** Each agent has a **single responsibility** (SRP), making them:
- Reusable across different workflows
- Easy to update independently
- Testable in isolation

---

### 3. **Step 2: Create Connected Agent Tools** (Lines 52-70)

```python
from azure.ai.agents.models import ConnectedAgentTool

priority_agent_tool = ConnectedAgentTool(
    id=priority_agent.id,
    name="priority_agent",
    description="Assess the priority of a ticket"
)
```

**Key Concept:** Connected Agent Tools
- Wraps each specialized agent as a **tool** that other agents can invoke
- The orchestrator agent doesn't directly run logic; it **calls other agents**
- Each tool contains:
  - `id`: The agent's unique identifier
  - `name`: Reference name for the orchestrator
  - `description`: LLM understands what this tool does

**Why This Approach?**
- Enables **separation of concerns**: Orchestrator focuses on workflow logic
- Allows **agent reusability**: The same specialized agents can be used in different workflows
- Provides **modularity**: Easy to add/remove agents without changing orchestrator logic

---

### 4. **Step 3: Create Orchestrator Agent** (Lines 77-88)

```python
triage_agent = agents_client.create_agent(
    model=model_deployment,
    name="triage-agent",
    instructions="Triage the given ticket. Use connected tools to: 1. Determine ticket priority...",
    tools=[
        priority_agent_tool.definitions[0],
        team_agent_tool.definitions[0],
        effort_agent_tool.definitions[0]
    ]
)
```

**The Orchestrator's Role:**
- Receives user input (support ticket)
- Decides **when and how** to call specialized agents
- Aggregates responses into a comprehensive triage result
- The LLM in the orchestrator acts as the "decision maker"

**Execution Flow:**
```
Orchestrator: "I need to triage this ticket"
    ↓ (calls via tool)
Priority Agent: "This is HIGH priority"
    ↓ (calls via tool)
Team Agent: "Assign to Backend"
    ↓ (calls via tool)
Effort Agent: "Requires LARGE effort"
    ↓ (aggregates)
Orchestrator: Returns complete triage result
```

---

### 5. **Step 4: Execute Agent Collaboration** (Lines 92-119)

#### **Thread Creation**
```python
thread = agents_client.threads.create()
```
- Creates a **conversation thread** (similar to ChatGPT conversations)
- Maintains context across multiple agent interactions
- Each thread has its own message history

#### **User Input**
```python
prompt = input("\nWhat's the support problem you need to resolve?: ")
message = agents_client.messages.create(
    thread_id=thread.id,
    role=MessageRole.USER,
    content=prompt,
)
```
- Captures ticket description from user
- Sends it to the thread as a USER message

#### **Agent Execution**
```python
run = agents_client.runs.create_and_process(
    thread_id=thread.id, 
    agent_id=triage_agent.id
)
```
- `create_and_process()` executes the orchestrator agent
- The orchestrator automatically calls connected agents as needed
- Waits for all agents to complete

#### **Error Handling**
```python
if run.status == "failed":
    print(f"Run failed: {run.last_error}")
```
- Checks if execution succeeded or failed
- Displays error details if problems occurred

#### **Result Retrieval**
```python
messages = agents_client.messages.list(thread_id=thread.id, order=ListSortOrder.ASCENDING)
for message in messages:
    if message.text_messages:
        print(f"{message.role}:\n{last_msg.text.value}\n")
```
- Retrieves all messages from the thread (USER → AGENT responses)
- Displays conversation history in order

---

### 6. **Step 5: Cleanup** (Lines 126-133)

```python
agents_client.delete_agent(triage_agent.id)
agents_client.delete_agent(priority_agent.id)
agents_client.delete_agent(team_agent.id)
agents_client.delete_agent(effort_agent.id)
```

**Important:** Deletes agents from Foundry after use
- Prevents resource accumulation
- Cleans up billing
- Maintains account organization

---

## Data Flow Diagram

```
INPUT
  │
  ├─ Ticket Description
  │
  ▼
ORCHESTRATOR AGENT
  │
  ├─ Tool Call #1: Get Priority
  │   └─→ Priority Agent → "High"
  │
  ├─ Tool Call #2: Get Team
  │   └─→ Team Agent → "Backend"
  │
  ├─ Tool Call #3: Get Effort
  │   └─→ Effort Agent → "Large"
  │
  ▼
AGGREGATED RESPONSE
  │
  ├─ Priority: High
  ├─ Team: Backend
  ├─ Effort: Large
  │
  ▼
OUTPUT (Display to User)
```

---

## Key Architectural Patterns

| Pattern | Implementation | Benefit |
|---------|---|---|
| **Single Responsibility** | Each agent has ONE task | Focused, reusable, easy to test |
| **Composition** | Orchestrator uses specialized agents as tools | Scalable multi-agent workflows |
| **Separation of Concerns** | Logic separated from execution | Flexibility to change strategies |
| **Asynchronous Coordination** | Thread-based messaging | Agents can process independently |
| **Explicit Tool Definition** | ConnectedAgentTool wraps agents | LLM understands agent capabilities |

---

## Use Cases This Architecture Supports

1. **Ticket Triage** (Current): Auto-classify and route support tickets
2. **Content Moderation**: Multiple agents review different aspects
3. **Request Processing**: Parallel agent evaluation with aggregation
4. **Quality Assurance**: Multiple specialized agents validate output
5. **Multi-Step Workflows**: Orchestrate complex business processes

---

## Configuration Requirements

Create a `.env` file:
```
project_endpoint=https://<your-foundry-project>.cognitiveservices.azure.com/
model_deployment=gpt-4  # or your deployed LLM
```

---

## Summary

This codebase demonstrates **enterprise-grade multi-agent orchestration** using Azure AI Foundry. The architecture separates concerns, enables reusability, and provides a scalable framework for building complex AI workflows where multiple specialized agents collaborate to solve problems.
