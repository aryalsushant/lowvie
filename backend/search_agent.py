import asyncio
from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv
import json

load_dotenv()

class SearchAgent:
    def __init__(self):
        self.client = AsyncDedalus()
        self.runner = DedalusRunner(self.client)

    async def search_alternatives(self, category, city, current_price):
        """Search for top 3 alternative suppliers in the given category and city."""
        
        prompt = f"""
        Find the top 3 alternative suppliers for {category} in or near {city}.
        Current price being paid: ${current_price}
        
        For each alternative, provide:
        - Business name
        - Location (city)
        - Estimated price
        - Contact email (if available)
        - Potential savings compared to current price
        
        Return in this exact JSON format:
        {{
            "alternatives": [
                {{
                    "business_name": "",
                    "city": "",
                    "estimated_price": 0.00,
                    "contact_email": "",
                    "potential_savings": 0.00,
                    "distance_from_original": "X miles"
                }}
            ]
        }}
        """

        response = await self.runner.run(
            input=prompt,
            model="openai/gpt-5",
            mcp_servers=["windsor/brave-search-mcp"]  # Using Brave Search MCP for web search
        )

        try:
            return json.loads(response.final_output)
        except json.JSONDecodeError:
            return {"error": "Failed to parse the response"}

async def test_search_agent():
    """Test function for the search agent"""
    agent = SearchAgent()
    # Test with sample data
    result = await agent.search_alternatives(
        category="material",
        city="San Francisco",
        current_price=25.00
    )
    print("Search Result:", json.dumps(result, indent=2))

if __name__ == "__main__":
    # Run test function
    asyncio.run(test_search_agent())
