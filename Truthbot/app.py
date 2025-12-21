import streamlit as st
from azure.identity import DefaultAzureCredential
from utils import tavily_web_search
from call_agent import run_agent_and_get_response, project, agent
import os
from dotenv import load_dotenv

load_dotenv()

# Page configuration
st.set_page_config(
    page_title="TruthBot - Fact Checker",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .verdict-true {
        padding: 15px;
        border-radius: 5px;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    .verdict-false {
        padding: 15px;
        border-radius: 5px;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    .search-result {
        padding: 10px;
        border-left: 4px solid #007bff;
        margin: 10px 0;
        background-color: #f8f9fa;
    }
    </style>
""", unsafe_allow_html=True)

# Header
st.title("🔍 TruthBot - AI Fact Checker")
st.markdown("*Verify claims with AI-powered fact-checking powered by Azure AI Agents*")
st.divider()

# Sidebar
with st.sidebar:
    st.header("About")
    st.info(
        "TruthBot uses web search and AI agents to fact-check claims. "
        "It searches for relevant sources and provides a detailed verdict."
    )

# Main content
col1, col2 = st.columns([2, 1])

with col1:
    # Input section
    st.subheader("📝 Enter Your Claim")
    claim = st.text_input(
        "What claim would you like to fact-check?",
        placeholder="e.g., 'The moon is made of cheese'",
        label_visibility="collapsed"
    )

if claim:
    try:
        # PHASE 1: Web Search
        st.info("🔎 Doing deepweb search...")
        search_result = tavily_web_search(claim)
        
        if not search_result.get("success"):
            st.error(f"Search failed: {search_result.get('error')}")
            search_context = f"Search failed: {search_result.get('error')}. Please provide analysis based on your knowledge."
        else:
            results = search_result.get("results", [])
            
            # Format search results for agents
            search_context = f"Search Results for '{claim}':\n\n"
            for i, result in enumerate(results, 1):
                search_context += f"{i}. Title: {result.get('title', 'N/A')}\n"
                search_context += f"   URL: {result.get('url', 'N/A')}\n"
                search_context += f"   Content: {result.get('content', 'N/A')[:300]}...\n"
                search_context += f"   Source: {result.get('source', 'N/A')}\n\n"
            
            st.success(f"✓ Found {len(results)} sources")
            
            # PHASE 2: Run agent
            st.info("🤖 Agent checking the claim...")
            response = run_agent_and_get_response(project, agent, claim, search_context)
            
            # Display verdict
            st.divider()
            st.markdown(response)
    
    except Exception as e:
        st.error(f"❌ Error during execution: {str(e)}")
        st.error("Please try again or contact support.")

# Footer
st.divider()
st.markdown(
    "<p style='text-align: center; color: gray; font-size: 12px;'>"
    "TruthBot © 2025 - Powered by Azure AI Agents & Tavily Search"
    "</p>",
    unsafe_allow_html=True
)
