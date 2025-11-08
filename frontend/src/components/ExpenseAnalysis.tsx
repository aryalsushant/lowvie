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

export default function ExpenseAnalysis({ data }: ExpenseAnalysisProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [emailContent, setEmailContent] = useState<{ subject: string; body: string; to_email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlternatives = async (category: string, expense: Expense) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/search-alternatives/${category}?city=${expense.city}&current_price=${expense.price}`
      );
      const data = await response.json();
      setAlternatives(data.alternatives);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch alternatives');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailDraft = async (alternative: Alternative, isCurrentSupplier: boolean, currentExpense: Expense) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/draft-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_info: {
            business_name: isCurrentSupplier ? currentExpense.business_name : alternative.business_name,
            contact_email: isCurrentSupplier ? currentExpense.contact : alternative.contact_email,
          },
          category: currentExpense.category,
          current_price: currentExpense.price,
          is_current_supplier: isCurrentSupplier,
          market_data: {
            average_market_price: alternatives.reduce((acc, alt) => acc + alt.estimated_price, 0) / alternatives.length,
            lowest_competitor_price: Math.min(...alternatives.map(alt => alt.estimated_price)),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const emailData = await response.json();
      setEmailContent(emailData);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    if (emailContent) {
      const mailtoLink = `mailto:${emailContent.to_email}?subject=${encodeURIComponent(
        emailContent.subject
      )}&body=${encodeURIComponent(emailContent.body)}`;
      window.location.href = mailtoLink;
    }
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
      {selectedCategory && alternatives.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Alternative Suppliers</h3>
          <div className="grid gap-4">
            {alternatives.map((alt, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold">{alt.business_name}</h4>
                    <p className="text-gray-600">{alt.city}</p>
                    <p className="text-lg font-medium">${alt.estimated_price.toFixed(2)}/piece</p>
                    <p className="text-green-600">Potential savings: ${alt.potential_savings.toFixed(2)}/piece</p>
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
                handleEmailDraft(alternatives[0], true, currentExpense);
              }}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Negotiate with Current Supplier
            </button>
          </div>
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