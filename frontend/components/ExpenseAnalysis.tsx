import { useState } from 'react';
import React from 'react';

interface Expense {
  category: string;
  business_name: string;
  city: string;
  price: number;
  contact: string;
  details: string;
}

interface ExpenseAnalysisProps {
  data: {
    expenses: Expense[];
    total_amount: number;
  };
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Expense;
}

function ContactModal({ isOpen, onClose, business }: ModalProps) {
  const [subject, setSubject] = React.useState(`Request for Price Negotiation - ${business.category}`);
  const [body, setBody] = React.useState(
    `Dear ${business.business_name},\n\n` +
    `We value our business relationship and would like to discuss our current pricing for ${business.category} services. Our market research shows competitive rates in the area averaging $${(business.price * 0.9).toFixed(2)}, with some suppliers offering rates as low as $${(business.price * 0.85).toFixed(2)}.\n\n` +
    `Would you be open to discussing a price adjustment to help us maintain a mutually beneficial partnership?\n\n` +
    `Best regards,\n` +
    `[Your Company Name]`
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Contact {business.business_name}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

                  <div className="space-y-6">
            <div className="relative">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Enter email subject"
              />
            </div>

            <div className="relative">
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white"
                placeholder="Enter your message"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => {
                  window.location.href = `mailto:${business.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
              >
                Send Email
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
              >
                Cancel
              </button>
      </div>
    </div>
  );
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm !text-gray-700 font-medium mb-1">Business Details</label>
            <p className="!text-gray-900 font-medium">{business.business_name}</p>
            <p className="!text-gray-700 text-sm">{business.city}</p>
          </div>
          
          <div>
            <label className="block text-sm !text-gray-700 font-medium mb-1">Contact Information</label>
            <p className="!text-gray-900">{business.contact || 'No contact information available'}</p>
          </div>

          <div>
            <label className="block text-sm !text-gray-700 font-medium mb-1">Category</label>
            <p className="!text-gray-900">{business.category}</p>
          </div>

          <div>
            <label className="block text-sm !text-gray-700 font-medium mb-1">Price</label>
            <p className="!text-gray-900">${business.price.toFixed(2)}</p>
          </div>

          {business.details && (
            <div>
              <label className="block text-sm !text-gray-700 font-medium mb-1">Additional Details</label>
              <p className="!text-gray-900">{business.details}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="emailSubject" className="block text-sm text-gray-700 font-medium mb-1">
                Email Subject
              </label>
              <input
                id="emailSubject"
                type="text"
                value={emailSubject}
                onChange={handleSubjectChange}
                className="w-full p-3 rounded border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <label htmlFor="emailBody" className="block text-sm text-gray-700 font-medium mb-1">
                Email Content
              </label>
              <textarea
                id="emailBody"
                value={emailBody}
                onChange={handleBodyChange}
                rows={10}
                className="w-full p-3 rounded border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter your message here"
              />
            </div>
          </div>
          <div className="pt-6 flex space-x-3">
            <button
              onClick={() => {
                window.location.href = `mailto:${business.contact}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 !text-white py-2 px-4 rounded transition-colors text-center"
            >
              Send Email
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:border-gray-400 !text-gray-700 hover:!text-gray-900 bg-white py-2 px-4 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpenseAnalysis({ data }: ExpenseAnalysisProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Expense | null>(null);
  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <h2 className="text-2xl font-semibold">Expense Summary</h2>
        <div className="text-right">
          <div className="text-sm text-text-secondary">Total Amount</div>
          <div className="text-2xl font-bold text-accent">
            ${data.total_amount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Expenses Grid */}
      <div className="grid gap-6">
        {data.expenses.map((expense, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {expense.business_name}
                </h3>
                <div className="text-sm text-text-secondary">
                  {expense.city} • {expense.category}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">${expense.price.toFixed(2)}</div>
              </div>
            </div>
            
            {expense.details && (
              <div className="text-sm text-text-secondary mt-2">
                {expense.details}
              </div>
            )}

            {/* Savings Suggestion */}
            <div className="mt-4 p-3 bg-accent/10 rounded-md border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="text-accent mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-accent mb-1">
                    Savings Opportunity
                  </div>
                  <div className="text-xs text-text-secondary">
                    Found similar services at lower prices in your area. Click to view alternatives.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setSelectedBusiness(expense)}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 transition-colors rounded"
              >
                Contact Supplier
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 transition-colors rounded"
              >
                View Alternatives
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
        <button className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          Download Report
        </button>
        <button className="px-4 py-2 text-sm bg-primary hover:bg-primary-dark transition-colors rounded-md">
          View All Alternatives
        </button>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={selectedBusiness !== null}
        onClose={() => setSelectedBusiness(null)}
        business={selectedBusiness || data.expenses[0]} // Fallback to first expense if null
      />
    </div>
  );
}