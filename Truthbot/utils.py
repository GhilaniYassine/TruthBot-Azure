from tavily import TavilyClient
import os
from dotenv import load_dotenv

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
