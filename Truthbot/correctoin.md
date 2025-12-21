# Corrections / Fix Log

This file documents the fixes applied to get the 3-agent TruthBot architecture running.

## 1) Fixed `ConnectedAgentTool` initialization
**Problem**
- Runtime error:
  - `TypeError: ConnectedAgentTool.__init__() got an unexpected keyword argument 'agent_id'`

**Root cause**
- In the installed Azure Agents SDK, `ConnectedAgentTool` constructor signature is:
  - `ConnectedAgentTool(id: str, name: str, description: str)`
  - It does **not** accept `agent_id`.

**Fix**
- Use `id=<agent.id>` when creating connected tools.

**Where**
- Truthbot/agent.py

## 2) Fixed Tavily search return type mismatch
**Problem**
- Runtime error:
  - `AttributeError: 'str' object has no attribute 'get'`

**Root cause**
- `tavily_web_search()` returned a JSON string via `json.dumps(...)`, but the caller treated it as a Python dict and called `.get()`.

**Fix**
- Updated `tavily_web_search()` to always return a Python dict:
  - `{ success, error, results, total_results }`

**Where**
- Truthbot/agent.py

## 3) Fixed Azure Agents SDK method usage for threads/messages/runs
**Problem**
- The code used non-existing/incorrect methods like:
  - `threads.add_message(...)`
  - `run.create_and_process(...)`
  - `threads.get_messages(...)`

**Fix**
- Updated to use the correct SDK calls:
  - `FoundaryConnection.messages.create(...)`
  - `FoundaryConnection.runs.create_and_process(...)`
  - `FoundaryConnection.messages.list(...)`

**Where**
- Truthbot/agent.py

## 4) Updated SearchAgent orchestration instructions
**Problem**
- The SearchAgent needed explicit tool-calling instructions for the connected agents.

**Fix**
- Updated SearchAgent system message to call tools in order:
  1. `AccuracyCheckerTool`
  2. `VerificationAnalystTool`

**Where**
- Truthbot/systemMessage/SearchAgent.md

## 5) Added system messages for the two new agents
**Added**
- Truthbot/systemMessage/AccuracyChecker.md
- Truthbot/systemMessage/VerificationAnalyst.md

## How to run
From the `Truthbot/` folder:
- `./env/bin/python agent.py`
