import asyncio
import json
from typing import Dict, Any

from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv

load_dotenv()


class SearchAgent:
    """Find alternative suppliers using Dedalus (optionally via MCP search)."""

    def __init__(self):
        self.client = AsyncDedalus()
        self.runner = DedalusRunner(self.client)

    async def search_alternatives(self, category: str, city: str, current_price: float) -> Dict[str, Any]:
        prompt = f'''
You are a sourcing analyst. For the category "{category}" in city "{city}", find 3-5 alternative suppliers with indicative unit prices.
Return ONLY JSON with this shape:
{{
  "alternatives": [
    {{
      "business_name": "string",
      "city": "string",
      "estimated_price": float,
      "contact_email": "string",
      "distance_from_original": "string"
    }}
  ]
}}

Guidelines:
- Prefer reputable sources (official vendor sites, B2B marketplaces).
- Use realistic USD pricing.
- If price < {current_price}, it's a savings; distance can be a rough estimate.
'''

        try:
            result = await self.runner.run(
                input=prompt,
                model="openai/gpt-5",
                mcp_servers=["windsor/brave-search-mcp"],
                stream=False,
            )
            data = self._safe_json(result.final_output)
        except Exception:
            data = {"alternatives": []}

        alts = []
        for a in data.get("alternatives", [])[:5]:
            try:
                estimated = float(a.get("estimated_price", 0) or 0)
                savings = max(0.0, float(current_price) - estimated)
                alts.append({
                    "business_name": a.get("business_name", "Supplier"),
                    "city": a.get("city", city),
                    "estimated_price": round(estimated, 2),
                    "contact_email": a.get("contact_email", "sales@example.com"),
                    "potential_savings": round(savings, 2),
                    "distance_from_original": a.get("distance_from_original", "")
                })
            except Exception:
                continue

        return {"alternatives": alts}

    def _safe_json(self, raw: str) -> Dict[str, Any]:
        raw = (raw or "").strip()
        try:
            return json.loads(raw)
        except Exception:
            first = raw.find("{")
            last = raw.rfind("}")
            if first != -1 and last != -1:
                try:
                    return json.loads(raw[first:last + 1])
                except Exception:
                    return {"alternatives": []}
        return {"alternatives": []}
