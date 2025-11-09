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
        prompt = f"""
You are a procurement strategist. Write a concise outreach email to a potential new supplier: {supplier_info['business_name']} about {category}.
We currently pay ${current_price:.2f}. Ask for pricing tiers, MOQs, and sample availability.
Return ONLY valid JSON:
{{
  "subject": "string",
  "body": "string",
  "to_email": "{supplier_info['contact_email']}"
}}
"""

        response = await self.runner.run(
            input=prompt,
            model="openai/gpt-5-mini",
            stream=False
        )

        return self._safe_json(response.final_output)

    async def draft_negotiation_email(self, current_supplier, category, current_price, market_data):
        prompt = f"""
You are a procurement negotiator. Draft a firm but collaborative email to current supplier {current_supplier['business_name']} about {category} pricing.
Current price: ${current_price:.2f}
Market data (JSON): {json.dumps(market_data)}
Highlight competitive benchmarks, propose a revised price (not below lowest competitor), and signal intent for long-term volume if adjustment granted.
Return ONLY valid JSON:
{{
  "subject": "string",
  "body": "string",
  "to_email": "{current_supplier['contact_email']}"
}}
"""

        response = await self.runner.run(
            input=prompt,
            model="openai/gpt-5",
            stream=False
        )

        return self._safe_json(response.final_output)

    def _safe_json(self, raw: str):
        raw = (raw or "").strip()
        try:
            return json.loads(raw)
        except Exception:
            first = raw.find("{")
            last = raw.rfind("}")
            if first != -1 and last != -1:
                snippet = raw[first:last+1]
                try:
                    return json.loads(snippet)
                except Exception:
                    return {"subject": "", "body": "", "to_email": ""}
        return {"subject": "", "body": "", "to_email": ""}

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
