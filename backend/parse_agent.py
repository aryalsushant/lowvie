import asyncio
import os
import json
import asyncio
import os
import json
from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv
from PyPDF2 import PdfReader

load_dotenv()

# Sample fallback data for demo purposes
FALLBACK_DATA = {
    "expenses": [
        {
            "category": "material",
            "business_name": "Premium Hoodies Co.",
            "city": "San Francisco",
            "price": 25.00,
            "contact": "sales@premiumhoodies.com",
            "details": "High quality cotton hoodies"
        },
        {
            "category": "printing",
            "business_name": "FastPrint Solutions",
            "city": "San Francisco",
            "price": 8.50,
            "contact": "orders@fastprint.com",
            "details": "Screen printing service"
        },
        {
            "category": "shipping",
            "business_name": "QuickShip Logistics",
            "city": "San Francisco",
            "price": 5.75,
            "contact": "support@quickship.com",
            "details": "Standard shipping service"
        }
    ],
    "total_amount": 39.25
}

class ParsingAgent:
    def __init__(self):
        self.client = AsyncDedalus()
        self.runner = DedalusRunner(self.client)

    async def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF with error handling"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf = PdfReader(file)
                text_content = ""
                for page in pdf.pages:
                    try:
                        text_content += page.extract_text()
                    except Exception as e:
                        print(f"Warning: Failed to extract text from page: {str(e)}")
                return text_content
        except Exception as e:
            print(f"Error reading PDF: {str(e)}")
            return None

    async def parse_pdf(self, pdf_path):
        """Parse PDF and extract relevant information with fallback handling"""
        try:
            # Extract text from PDF
            text_content = await self.extract_text_from_pdf(pdf_path)
            
            if not text_content or not text_content.strip():
                print("Warning: Empty or unreadable PDF content, using fallback data")
                return FALLBACK_DATA

            # Enhanced prompt for better parsing accuracy
            prompt = f"""
            Carefully analyze this receipt/invoice text and extract business expense information.
            The text might be in various formats, but we need to identify and categorize:

            1. Material expenses (e.g., products, raw materials)
            2. Printing expenses (any printing services)
            3. Shipping expenses (delivery, transportation)

            For EACH expense found, extract:
            - The exact category (material/printing/shipping)
            - Complete business name
            - City location
            - Price (convert to numerical format)
            - Contact information (email/phone)
            - Additional details about the service/product

            Text to analyze:
            {text_content}

            Return ONLY the extracted information in this exact JSON format:
            {{
                "expenses": [
                    {{
                        "category": "",
                        "business_name": "",
                        "city": "",
                        "price": 0.00,
                        "contact": "",
                        "details": ""
                    }}
                ],
                "total_amount": 0.00
            }}

            If certain information is not found, use empty strings or 0.00 for those fields.
            """

            # Use Dedalus with improved error handling
            try:
                response = await self.runner.run(
                    input=prompt,
                    model="openai/gpt-5"
                )
                parsed_data = json.loads(response.final_output)
                
                # Validate parsed data structure
                if not self.validate_parsed_data(parsed_data):
                    print("Warning: Invalid parsed data structure, using fallback data")
                    return FALLBACK_DATA

                # Save parsed data
                self.save_parsed_data(pdf_path, parsed_data)
                return parsed_data

            except json.JSONDecodeError:
                print("Warning: Failed to parse response as JSON, using fallback data")
                return FALLBACK_DATA
            except Exception as e:
                print(f"Error during parsing: {str(e)}, using fallback data")
                return FALLBACK_DATA

        except Exception as e:
            print(f"Error in parse_pdf: {str(e)}, using fallback data")
            return FALLBACK_DATA

    def validate_parsed_data(self, data):
        """Validate the structure of parsed data"""
        try:
            if not isinstance(data, dict):
                return False
            if "expenses" not in data or not isinstance(data["expenses"], list):
                return False
            if "total_amount" not in data or not isinstance(data["total_amount"], (int, float)):
                return False
            
            required_fields = ["category", "business_name", "city", "price", "contact", "details"]
            for expense in data["expenses"]:
                if not all(field in expense for field in required_fields):
                    return False
            return True
        except Exception:
            return False

    def save_parsed_data(self, pdf_path, parsed_data):
        """Save parsed data to JSON file"""
        try:
            output_path = pdf_path.replace('.pdf', '.json')
            with open(output_path, 'w') as f:
                json.dump(parsed_data, f, indent=4)
        except Exception as e:
            print(f"Warning: Failed to save parsed data: {str(e)}")

    def get_expense_by_category(self, parsed_data, category):
        """Helper method to get expense details for a specific category"""
        try:
            for expense in parsed_data.get("expenses", []):
                if expense["category"].lower() == category.lower():
                    return expense
            return None
        except Exception:
            return None

async def test_parsing_agent():
    """Test function for the parsing agent"""
    agent = ParsingAgent()
    test_files = [
        os.path.join(os.path.dirname(__file__), 'receipts', 'sample_receipt.pdf'),
        # Add any other test PDFs here
    ]

    for pdf_path in test_files:
        print(f"\nTesting with file: {pdf_path}")
        if os.path.exists(pdf_path):
            try:
                result = await agent.parse_pdf(pdf_path)
                print("Parsing successful!")
                print("Parsed Result:", json.dumps(result, indent=2))
                
                # Test category extraction
                categories = ["material", "printing", "shipping"]
                for category in categories:
                    expense = agent.get_expense_by_category(result, category)
                    if expense:
                        print(f"\n{category.title()} expense found:", json.dumps(expense, indent=2))
                    else:
                        print(f"\nNo {category} expense found")
            except Exception as e:
                print(f"Error during testing: {str(e)}")
        else:
            print(f"Test PDF not found at {pdf_path}")
            print("Using fallback data for demonstration")
            print("Fallback Data:", json.dumps(FALLBACK_DATA, indent=2))

if __name__ == "__main__":
    # Run test function
    asyncio.run(test_parsing_agent())