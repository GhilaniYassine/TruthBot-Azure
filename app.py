import streamlit as st
from azure.identity import DefaultAzureCredential
from utils import tavily_web_search , run_agent_and_get_response, project, agent

import os
from dotenv import load_dotenv

load_dotenv()

# Page configuration
st.set_page_config(
    page_title="TruthBot - Fact Checker",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Modern Custom CSS
st.markdown("""
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .main {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .header-container {
            text-align: center;
            margin-bottom: 50px;
            animation: slideDown 0.8s ease-out;
        }
        
        .header-container h1 {
            font-size: 3.5em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            font-weight: 800;
            letter-spacing: -1px;
        }
        
        .header-container p {
            font-size: 1.2em;
            color: #666;
            font-weight: 500;
        }
        
        .input-container {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 40px;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.1);
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .input-container:hover {
            border-color: #667eea;
            box-shadow: 0 15px 50px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }
        
        .input-container label {
            color: #667eea;
            font-weight: 700;
            font-size: 1.1em;
            margin-bottom: 15px;
            display: block;
        }
        
        .input-container input {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1.05em;
            transition: all 0.3s ease;
            background: #f8f9fa;
        }
        
        .input-container input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background: white;
            outline: none;
        }
        
        .status-message {
            padding: 15px 20px;
            border-radius: 10px;
            margin: 20px 0;
            font-weight: 600;
            animation: slideIn 0.5s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-left: 5px solid #667eea;
        }
        
        .status-success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            border-left: 5px solid #11998e;
        }
        
        .status-error {
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
            color: white;
            border-left: 5px solid #eb3349;
        }
        
        .divider {
            height: 3px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
            margin: 40px 0;
            border-radius: 10px;
        }
        
        .result-container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border-left: 5px solid #667eea;
            animation: fadeIn 0.8s ease-out;
        }
        
        .result-container h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        
        .result-container h3 {
            color: #764ba2;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        
        .result-container p {
            color: #333;
            line-height: 1.8;
            font-size: 1.05em;
            margin-bottom: 15px;
        }
        
        .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid rgba(102, 126, 234, 0.2);
            color: #999;
            font-size: 0.95em;
            font-weight: 500;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .stTextInput > div > div > input {
            color: #333 !important;
            font-weight: 500 !important;
        }
        
        .stTextInput > label {
            color: #667eea !important;
            font-weight: 700 !important;
        }
    </style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
    <div class="header-container">
        <h1>🔍 TruthBot</h1>
        <p>AI-Powered Fact Checking at Lightning Speed</p>
    </div>
""", unsafe_allow_html=True)

# Input section
st.markdown("""
    <div class="input-container">
        <label>📝 What claim would you like to fact-check?</label>
    </div>
""", unsafe_allow_html=True)

claim = st.text_input(
    "What claim would you like to fact-check?",
    placeholder="e.g., 'The moon is made of cheese'",
    label_visibility="collapsed"
)

if claim:
    try:
        # PHASE 1: Web Search
        st.markdown('<div class="status-message status-info">🔎 Diving deep into the web... Searching with Tavily</div>', unsafe_allow_html=True)
        search_result = tavily_web_search(claim)
        
        if not search_result.get("success"):
            st.markdown(f'<div class="status-message status-error">❌ Search failed: {search_result.get("error")}</div>', unsafe_allow_html=True)
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
            
            st.markdown(f'<div class="status-message status-success">✓ Found {len(results)} credible sources</div>', unsafe_allow_html=True)
            
            # PHASE 2: Run agent
            st.markdown('<div class="status-message status-info">🤖 AI Agent is analyzing... Processing with deep reasoning</div>', unsafe_allow_html=True)
            response = run_agent_and_get_response(project, agent, claim, search_context)
            
            # Display verdict
            st.markdown('<div class="divider"></div>', unsafe_allow_html=True)
            st.markdown(f'<div class="result-container">{response}</div>', unsafe_allow_html=True)
    
    except Exception as e:
        st.markdown(f'<div class="status-message status-error">❌ Error: {str(e)}</div>', unsafe_allow_html=True)
        st.markdown('<div class="status-message status-error">Please try again or contact support.</div>', unsafe_allow_html=True)

# Footer
st.markdown("""
    <div class="footer">
        <p>✨ TruthBot © 2025 | Powered by Azure AI Agents & Tavily Search</p>
        <p style="margin-top: 10px; font-size: 0.85em;">Making the web safer, one fact at a time.</p>
    </div>
""", unsafe_allow_html=True)
