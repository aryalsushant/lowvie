import asyncio
import os
import json

class ParsingAgent:
    def __init__(self):
        # Hardcoded demo data
        self.demo_data = {
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

    async def parse_receipt(self, file_path):
        """Parse receipt and return demo data for testing"""
        # Simulate processing delay
        await asyncio.sleep(2)
        
        # Save the file for demo purposes
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # For demo purposes, save the parsed result
        result_path = os.path.join(os.path.dirname(file_path), 'sample_receipt.json')
        with open(result_path, 'w') as f:
            json.dump(self.demo_data, f, indent=2)
        
        return self.demo_data

    async def save_parsed_data(self, parsed_data, output_path):
        """Save parsed data to JSON file"""
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(parsed_data, f, indent=2)

async def test_parse_agent():
    """Test function for the parse agent"""
    agent = ParsingAgent()
    # Test with sample data
    result = await agent.parse_receipt('receipts/sample_receipt.pdf')
    print("Parse Result:", json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_parse_agent())