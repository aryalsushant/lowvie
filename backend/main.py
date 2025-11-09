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

# Hardcoded demo data
DEMO_DATA = {
    "expenses": [
        {
            "category": "material",
            "business_name": "Premium Fabrics Inc.",
            "city": "San Francisco",
            "price": 25.00,
            "contact": "orders@premiumfabrics.com",
            "details": "High-quality cotton blend material"
        },
        {
            "category": "printing",
            "business_name": "FastPrint Solutions",
            "city": "San Francisco",
            "price": 8.50,
            "contact": "sales@fastprint.com",
            "details": "Screen printing services"
        },
        {
            "category": "shipping",
            "business_name": "QuickShip Logistics",
            "city": "San Francisco",
            "price": 5.75,
            "contact": "support@quickship.com",
            "details": "Standard 3-5 day shipping"
        }
    ],
    "total_amount": 39.25,
    "receipt_date": "2025-11-08",
    "vendor_details": {
        "name": "Wholesale Supply Co.",
        "address": "123 Market St, San Francisco, CA 94105",
        "phone": "(415) 555-0123",
        "email": "info@wholesalesupply.com"
    }
}

# Hardcoded alternatives data
DEMO_ALTERNATIVES = {
    "material": [
        {
            "business_name": "EcoHoodies Manufacturing",
            "city": "San Francisco",
            "estimated_price": 19.99,
            "contact_email": "sales@ecohoodies.com",
            "potential_savings": 5.01,
            "distance_from_original": "2 miles"
        },
        {
            "business_name": "Bay Area Apparel Co.",
            "city": "Oakland",
            "estimated_price": 21.50,
            "contact_email": "wholesale@bayapparel.com",
            "potential_savings": 3.50,
            "distance_from_original": "8 miles"
        },
        {
            "business_name": "Urban Fabric Solutions",
            "city": "San Jose",
            "estimated_price": 22.75,
            "contact_email": "info@urbanfabric.com",
            "potential_savings": 2.25,
            "distance_from_original": "15 miles"
        }
    ],
    "printing": [
        {
            "business_name": "Digital Print Masters",
            "city": "San Francisco",
            "estimated_price": 6.50,
            "contact_email": "orders@dprintmasters.com",
            "potential_savings": 2.00,
            "distance_from_original": "1 mile"
        },
        {
            "business_name": "ScreenPro Graphics",
            "city": "Berkeley",
            "estimated_price": 7.25,
            "contact_email": "sales@screenpro.com",
            "potential_savings": 1.25,
            "distance_from_original": "5 miles"
        },
        {
            "business_name": "InkWorks Pro",
            "city": "Palo Alto",
            "estimated_price": 7.75,
            "contact_email": "business@inkworkspro.com",
            "potential_savings": 0.75,
            "distance_from_original": "12 miles"
        }
    ],
    "shipping": [
        {
            "business_name": "SpeedShip Express",
            "city": "San Francisco",
            "estimated_price": 4.25,
            "contact_email": "quotes@speedship.com",
            "potential_savings": 1.50,
            "distance_from_original": "0.5 miles"
        },
        {
            "business_name": "Bay Logistics Co.",
            "city": "San Francisco",
            "estimated_price": 4.75,
            "contact_email": "dispatch@baylogistics.com",
            "potential_savings": 1.00,
            "distance_from_original": "3 miles"
        },
        {
            "business_name": "Swift Delivery Network",
            "city": "Daly City",
            "estimated_price": 5.00,
            "contact_email": "service@swiftdelivery.com",
            "potential_savings": 0.75,
            "distance_from_original": "7 miles"
        }
    ]
}

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

@app.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    """Handle receipt upload and return demo data"""
    try:
        # Simulate processing time
        await asyncio.sleep(2)
        
        # Create receipts directory if it doesn't exist
        os.makedirs(os.path.join(os.path.dirname(__file__), "receipts"), exist_ok=True)
        
        # Save the uploaded file (optional, for demo purposes)
        file_path = os.path.join(os.path.dirname(__file__), "receipts", file.filename)
        try:
            content = await file.read()
            with open(file_path, "wb") as buffer:
                buffer.write(content)
        except Exception:
            pass  # Ignore file saving errors
        
        # Return demo data
        return DEMO_DATA
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process receipt")

@app.get("/search-alternatives/{category}")
async def search_alternatives(category: str, city: str, current_price: float):
    """Return hardcoded alternatives for the given category"""
    try:
        # Simulate processing time
        await asyncio.sleep(5)
        
        # Return demo alternatives with adjusted prices
        alternatives = DEMO_ALTERNATIVES.get(category.lower(), [])
        for alt in alternatives:
            # Keep the same savings ratio but adjust based on current price
            savings_ratio = alt["potential_savings"] / alt["estimated_price"]
            alt["estimated_price"] = current_price - (current_price * savings_ratio)
            alt["potential_savings"] = current_price - alt["estimated_price"]
        
        return {"alternatives": alternatives}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch alternatives: {str(e)}")

@app.post("/draft-email")
async def draft_email(request: EmailRequest):
    """Generate a demo email draft"""
    try:
        # Simulate processing time
        await asyncio.sleep(1.5)
        
        # Generate email based on request type
        if request.is_current_supplier:
            subject = f"Request for Price Negotiation - {request.category}"
            body = f"""Dear {request.supplier_info['business_name']},

We value our business relationship and would like to discuss our current pricing for {request.category} services. Our market research shows competitive rates in the area averaging ${request.market_data['average_market_price']:.2f}, with some suppliers offering rates as low as ${request.market_data['lowest_competitor_price']:.2f}.

Would you be open to discussing a price adjustment to help us maintain a mutually beneficial partnership?

Best regards,
[Your Company Name]"""
        else:
            subject = f"Business Opportunity - {request.category} Services"
            body = f"""Dear {request.supplier_info['business_name']},

We are currently looking for competitive {request.category.lower()} services in your area. Your estimated rate of ${request.current_price:.2f} caught our attention.

Would you be available to discuss your services and pricing in more detail?

Best regards,
[Your Company Name]"""
            
        return {
            "to_email": request.supplier_info["contact_email"],
            "subject": subject,
            "body": body
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate email: {str(e)}")

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