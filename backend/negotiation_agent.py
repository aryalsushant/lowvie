import asyncio
from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv
import json

load_dotenv()

class NegotiationAgent:
    def __init__(self):
        self.client = AsyncDedalus()
        self.runner = DedalusRunner(self.client)

    async def draft_new_supplier_email(self, supplier_info, category, current_price):
        """Draft an email to a potential new supplier."""
        prompt = f"""
        Draft a professional email to {supplier_info['business_name']} inquiring about their {category} services.
        Include:
        - Brief introduction of our business
        - Current supplier charges ${current_price}
        - Interest in potentially switching suppliers
        - Request for pricing details and minimum order quantities
        - Request for samples if applicable
        
        Return in this exact JSON format:
        {{
            "subject": "",
            "body": "",
            "to_email": "{supplier_info['contact_email']}"
        }}
        """

        response = await self.runner.run(
            input=prompt,
            model="openai/gpt-5"
        )

        try:
            return json.loads(response.final_output)
        except json.JSONDecodeError:
            return {"error": "Failed to parse the response"}

    async def draft_negotiation_email(self, current_supplier, category, current_price, market_data):
        """Draft a negotiation email to current supplier."""
        prompt = f"""
        Draft a professional negotiation email to our current supplier {current_supplier} for {category}.
        Use this market research data:
        {json.dumps(market_data, indent=2)}
        
        Current price: ${current_price}
        
        Include:
        - Value we place on our business relationship
        - Market research showing competitive prices
        - Request for price adjustment
        - Commitment to long-term partnership if terms are agreeable
        
        Return in this exact JSON format:
        {{
            "subject": "",
            "body": "",
            "to_email": "{current_supplier['contact_email']}"
        }}
        """

        response = await self.runner.run(
            input=prompt,
            model="openai/gpt-5"
        )

        try:
            return json.loads(response.final_output)
        except json.JSONDecodeError:
            return {"error": "Failed to parse the response"}

async def test_negotiation_agent():
    """Test function for the negotiation agent"""
    agent = NegotiationAgent()
    
    # Test data
    supplier_info = {
        "business_name": "Example Hoodies Inc",
        "contact_email": "sales@examplehoodies.com"
    }
    
    # Test new supplier email
    new_supplier_email = await agent.draft_new_supplier_email(
        supplier_info=supplier_info,
        category="material",
        current_price=25.00
    )
    print("New Supplier Email:", json.dumps(new_supplier_email, indent=2))
    
    # Test negotiation email
    market_data = {
        "average_market_price": 20.00,
        "lowest_competitor_price": 18.00,
        "highest_competitor_price": 28.00
    }
    
    negotiation_email = await agent.draft_negotiation_email(
        current_supplier=supplier_info,
        category="material",
        current_price=25.00,
        market_data=market_data
    )
    print("\nNegotiation Email:", json.dumps(negotiation_email, indent=2))

if __name__ == "__main__":
    # Run test function
    asyncio.run(test_negotiation_agent())
