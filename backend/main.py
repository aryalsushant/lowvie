import asyncio
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from parse_agent import ParsingAgent
from search_agent import SearchAgent
from negotiation_agent import NegotiationAgent

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
parsing_agent = ParsingAgent()
search_agent = SearchAgent()
negotiation_agent = NegotiationAgent()

class EmailRequest(BaseModel):
    supplier_info: Dict[str, Any]
    category: str
    current_price: float
    is_current_supplier: bool
    market_data: Dict[str, Any] = None

@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    """Handle receipt upload and parsing"""
    try:
        # Save the uploaded file
        file_path = os.path.join("backend", "receipts", file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Parse the receipt
        parsed_data = await parsing_agent.parse_pdf(file_path)
        if "error" in parsed_data:
            raise HTTPException(status_code=400, detail=parsed_data["error"])

        return parsed_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search-alternatives/{category}")
async def search_alternatives(category: str, city: str, current_price: float):
    """Search for alternative suppliers"""
    try:
        alternatives = await search_agent.search_alternatives(
            category=category,
            city=city,
            current_price=current_price
        )
        
        if "error" in alternatives:
            raise HTTPException(status_code=400, detail=alternatives["error"])
        
        return alternatives

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/draft-email")
async def draft_email(request: EmailRequest):
    """Draft either a new supplier inquiry or negotiation email"""
    try:
        if request.is_current_supplier:
            if not request.market_data:
                raise HTTPException(status_code=400, detail="Market data required for negotiation email")
            
            email_content = await negotiation_agent.draft_negotiation_email(
                current_supplier=request.supplier_info,
                category=request.category,
                current_price=request.current_price,
                market_data=request.market_data
            )
        else:
            email_content = await negotiation_agent.draft_new_supplier_email(
                supplier_info=request.supplier_info,
                category=request.category,
                current_price=request.current_price
            )

        if "error" in email_content:
            raise HTTPException(status_code=400, detail=email_content["error"])

        return email_content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
