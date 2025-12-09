# TruthBot Tavily Integration

## Overview

This document explains how the TruthBot pipeline connects Tavily web search results to the Azure AI Foundry agent and why the agent is created without a tool reference.

## Flow Summary

1. Collect the user's claim from standard input.
2. Call `tavily_search(...)` directly in Python to fetch authoritative sources (the Tavily Python SDK performs the HTTP request).
3. Format the search results into a markdown-style context block that contains titles, URLs, and short excerpts.
4. Create an Azure AI Foundry thread and send a single user message that contains both the original claim and the formatted search context.
5. Run the `SearchAgent` against the thread. Because the search context is already embedded in the message, the agent only needs to reason over the supplied text and craft the final report.

## Why `tools=[]`

The Azure AI Agents SDK only executes tool calls when the runtime contains the required function handlers. In this project the agent is invoked through `create_and_process(...)`, which does **not** surface function-call hooks. Instead, the process performs a synchronous run and returns the agent response. Because we deliver the search context up front, there is no requirement for the orchestrator to expose tool definitions to the agent, so `tools` is left empty.

## Why the Tavily function is not registered as a tool

- The Tavily search is executed inside the Python host process before the agent run begins. The agent receives the precomputed evidence inside the message payload, so it never needs to invoke Tavily itself.
- Registering the function as a tool would require a polling loop that watches for `requires_action` states and manually submits tool outputs. The simplified synchronous flow avoids that complexity while still leveraging Tavily results.
- Keeping the Tavily call outside the agent ensures the host application controls API usage, retries, and error handling. The agent only reasons over trusted text and cannot accidentally trigger additional API calls.

In short, the orchestrator performs the search, packages the findings, and hands them to the agent for analysis. This design keeps the Azure AI Agent focused on reasoning while the Python layer manages all external integrations.
