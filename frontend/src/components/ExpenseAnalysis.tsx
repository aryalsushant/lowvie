'use client';

import { useState } from 'react';

interface Alternative {
  business_name: string;
  city: string;
  estimated_price: number;
  contact_email: string;
  potential_savings: number;
  distance_from_original: string;
}

interface Expense {
  category: string;
  business_name: string;
  city: string;
  price: number;
  contact: string;
  details: string;
}

interface ParsedData {
  expenses: Expense[];
  total_amount: number;
}

interface ExpenseAnalysisProps {
  data: ParsedData;
}

type CategoryAlternatives = {
  [key: string]: Alternative[];
};

export default function ExpenseAnalysis({ data }: ExpenseAnalysisProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [emailContent, setEmailContent] = useState<{ subject: string; body: string; to_email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlternatives = async (category: string, expense: Expense) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedCategory(category);
      
      // Simulate loading state
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Hardcoded alternatives for demo
      const demoAlternatives: CategoryAlternatives = {
        material: [
          {
            business_name: 'EcoHoodies Manufacturing',
            city: 'San Francisco',
            estimated_price: expense.price - 5.01,
            contact_email: 'sales@ecohoodies.com',
            potential_savings: 5.01,
            distance_from_original: '2 miles'
          },
          {
            business_name: 'Bay Area Apparel Co.',
            city: 'Oakland',
            estimated_price: expense.price - 3.50,
            contact_email: 'wholesale@bayapparel.com',
            potential_savings: 3.50,
            distance_from_original: '8 miles'
          },
          {
            business_name: 'Urban Fabric Solutions',
            city: 'San Jose',
            estimated_price: expense.price - 2.25,
            contact_email: 'info@urbanfabric.com',
            potential_savings: 2.25,
            distance_from_original: '15 miles'
          }
        ],
        printing: [
          {
            business_name: 'Digital Print Masters',
            city: 'San Francisco',
            estimated_price: expense.price - 2.00,
            contact_email: 'orders@dprintmasters.com',
            potential_savings: 2.00,
            distance_from_original: '1 mile'
          },
          {
            business_name: 'ScreenPro Graphics',
            city: 'Berkeley',
            estimated_price: expense.price - 1.25,
            contact_email: 'sales@screenpro.com',
            potential_savings: 1.25,
            distance_from_original: '5 miles'
          },
          {
            business_name: 'InkWorks Pro',
            city: 'Palo Alto',
            estimated_price: expense.price - 0.75,
            contact_email: 'business@inkworkspro.com',
            potential_savings: 0.75,
            distance_from_original: '12 miles'
          }
        ],
        shipping: [
          {
            business_name: 'SpeedShip Express',
            city: 'San Francisco',
            estimated_price: expense.price - 1.50,
            contact_email: 'quotes@speedship.com',
            potential_savings: 1.50,
            distance_from_original: '0.5 miles'
          },
          {
            business_name: 'Bay Logistics Co.',
            city: 'San Francisco',
            estimated_price: expense.price - 1.00,
            contact_email: 'dispatch@baylogistics.com',
            potential_savings: 1.00,
            distance_from_original: '3 miles'
          },
          {
            business_name: 'Swift Delivery Network',
            city: 'Daly City',
            estimated_price: expense.price - 0.75,
            contact_email: 'service@swiftdelivery.com',
            potential_savings: 0.75,
            distance_from_original: '7 miles'
          }
        ]
      };

      const alternatives = demoAlternatives[category.toLowerCase()];
      if (alternatives) {
        setAlternatives(alternatives);
      } else {
        setAlternatives([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch alternatives');
      setAlternatives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmailContent = (alternative: Alternative, isCurrentSupplier: boolean, currentExpense: Expense) => {
    const marketAverage = alternatives.reduce((acc, alt) => acc + alt.estimated_price, 0) / alternatives.length;
    const lowestPrice = Math.min(...alternatives.map(alt => alt.estimated_price));
    
    if (isCurrentSupplier) {
      setEmailContent({
        to_email: currentExpense.contact,
        subject: `Request for Price Negotiation - ${currentExpense.category}`,
        body: `Dear ${currentExpense.business_name},

We value our business relationship and would like to discuss our current pricing for ${currentExpense.category} services. Our market research shows competitive rates in the area averaging $${marketAverage.toFixed(2)}, with some suppliers offering rates as low as $${lowestPrice.toFixed(2)}.

Would you be open to discussing a price adjustment to help us maintain a mutually beneficial partnership?

Best regards,
[Your Company Name]`
      });
    } else {
      setEmailContent({
        to_email: alternative.contact_email,
        subject: `Business Opportunity - ${currentExpense.category} Services`,
        body: `Dear ${alternative.business_name},

We are currently looking for competitive ${currentExpense.category.toLowerCase()} services in the ${alternative.city} area. Your estimated rate of $${alternative.estimated_price.toFixed(2)} caught our attention.

Would you be available to discuss your services and pricing in more detail?

Best regards,
[Your Company Name]`
      });
    }
  };

  const handleEmailDraft = (alternative: Alternative, isCurrentSupplier: boolean, currentExpense: Expense) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      generateEmailContent(alternative, isCurrentSupplier, currentExpense);
      setIsLoading(false);
    }, 1500);
  };

  const handleSendEmail = () => {
    setIsLoading(true);
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false);
      alert('Email sent successfully!');
      setEmailContent(null); // Clear the email modal
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">Expense Analysis</h2>
      
      {/* Expense Categories */}
      {data.expenses.map((expense) => (
        <div key={expense.category} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold capitalize">{expense.category}</h3>
              <p className="text-gray-600">{expense.business_name}</p>
              <p className="text-lg font-medium">${expense.price.toFixed(2)}/piece</p>
            </div>
            <button
              onClick={() => fetchAlternatives(expense.category, expense)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Find Alternatives
            </button>
          </div>
        </div>
      ))}

      {/* Alternatives Display */}
      {selectedCategory && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Alternative Suppliers</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : alternatives.length > 0 ? (
            <>
              <div className="grid gap-4">
                {alternatives.map((alt, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold">{alt.business_name}</h4>
                        <p className="text-gray-600">{alt.city}</p>
                        <p className="text-lg font-medium">${alt.estimated_price.toFixed(2)}/piece</p>
                        <p className="text-green-600">Potential savings: ${alt.potential_savings.toFixed(2)}/piece</p>
                        <p className="text-gray-500">{alt.distance_from_original} away</p>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleEmailDraft(alt, false, data.expenses.find(e => e.category === selectedCategory)!)}
                          className="block w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Contact Supplier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Current Supplier Negotiation */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    const currentExpense = data.expenses.find(e => e.category === selectedCategory)!;
                    if (alternatives.length > 0) {
                      handleEmailDraft(alternatives[0], true, currentExpense);
                    }
                  }}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Negotiate with Current Supplier
                </button>
              </div>
            </>
          ) : !error && (
            <div className="text-center py-8 text-gray-600">
              No alternative suppliers found. Try searching in a different location.
            </div>
          )}
        </div>
      )}

      {/* Email Preview Modal */}
      {emailContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-4">Email Preview</h3>
            <div className="space-y-4">
              <p><strong>To:</strong> {emailContent.to_email}</p>
              <p><strong>Subject:</strong> {emailContent.subject}</p>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="whitespace-pre-wrap">{emailContent.body}</pre>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEmailContent(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}