import asyncio
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os

# Knot integration
try:
    from .knot_client import KnotClient
except Exception:
    # Support running as a script (python backend/main.py)
    from knot_client import KnotClient

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .parse_agent import ParseAgent
from .search_agent import SearchAgent
from .negotiation_agent import NegotiationAgent

class EmailRequest(BaseModel):
    supplier_info: Dict[str, Any]
    category: str
    current_price: float
    is_current_supplier: bool
    market_data: Dict[str, Any] = None

# ==== Knot API Models and Client ====
class SessionRequest(BaseModel):
    type: str = "transaction_link"
    external_user_id: str = "demo-user-1"
    card_id: str | None = None
    phone_number: str | None = None
    email: str | None = None
    processor_token: str | None = None


class SessionResponse(BaseModel):
    sessionId: str
    mock: bool


class TransactionsRequest(BaseModel):
    external_user_id: str
    limit: int = 5


knot = KnotClient()

parse_agent = ParseAgent()
search_agent = SearchAgent()
negotiation_agent = NegotiationAgent()


@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    """Handle receipt upload and return parsed data using AI agents."""
    try:
        content = await file.read()
        # Minimal agent call (parse agent currently returns empty list per user instruction)
        parsed = await parse_agent.parse_pdf(content)
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process receipt: {e}")

@app.get("/search-alternatives/{category}")
async def search_alternatives(category: str, city: str, current_price: float):
    try:
        results = await search_agent.search_alternatives(category=category, city=city, current_price=current_price)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch alternatives: {e}")

@app.post("/draft-email")
async def draft_email(request: EmailRequest):
    try:
        if request.is_current_supplier:
            email = await negotiation_agent.draft_negotiation_email(
                current_supplier=request.supplier_info,
                category=request.category,
                current_price=request.current_price,
                market_data=request.market_data or {}
            )
        else:
            email = await negotiation_agent.draft_new_supplier_email(
                supplier_info=request.supplier_info,
                category=request.category,
                current_price=request.current_price,
            )
        return email
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate email: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# ==== Knot Endpoints (mounted alongside existing routes) ====
@app.post("/api/session/create", response_model=SessionResponse)
async def create_session(req: SessionRequest):
    data = knot.create_session(
        session_type=req.type,
        external_user_id=req.external_user_id,
        card_id=req.card_id,
        phone_number=req.phone_number,
        email=req.email,
        processor_token=req.processor_token,
    )
    return SessionResponse(sessionId=data["sessionId"], mock=data.get("mock", False))


@app.post("/api/transactions/sync")
async def sync_transactions(req: TransactionsRequest):
    merchant_id = 44  # Amazon merchant ID provided
    data = knot.sync_transactions(merchant_id=merchant_id, external_user_id=req.external_user_id, limit=req.limit)
    if "error" in data:
        raise HTTPException(status_code=500, detail=data["error"])
    return data


@app.get("/api/health")
async def health():
    return {"ok": True}