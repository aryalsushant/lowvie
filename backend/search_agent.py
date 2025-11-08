import asyncio

class SearchAgent:
    def __init__(self):
        self.hardcoded_alternatives = {
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

    async def search_alternatives(self, category, city, current_price):
        """Return hardcoded alternatives for demo purposes"""
        # Simulate a delay for better UX
        await asyncio.sleep(5)  # Show loading state for 5 seconds
        
        alternatives = self.hardcoded_alternatives.get(category.lower(), [])
        
        # Adjust prices based on the current price if needed
        if alternatives and current_price > 0:
            for alt in alternatives:
                # Keep the same savings ratio but adjust based on current price
                savings_ratio = alt["potential_savings"] / alt["estimated_price"]
                alt["estimated_price"] = current_price - (current_price * savings_ratio)
                alt["potential_savings"] = current_price - alt["estimated_price"]
        
        return {
            "alternatives": alternatives
        }

async def test_search_agent():
    """Test function for the search agent"""
    agent = SearchAgent()
    # Test with sample data
    result = await agent.search_alternatives(
        category="material",
        city="San Francisco",
        current_price=25.00
    )
    print("Search Result:", result)

if __name__ == "__main__":
    # Run test function
    asyncio.run(test_search_agent())
