'use client';

import { useState } from 'react';
import Image from 'next/image';
import UploadForm from '@/components/UploadForm';
import ExpenseAnalysis from '@/components/ExpenseAnalysis';

interface ParsedData {
  expenses: Array<{
    category: string;
    business_name: string;
    city: string;
    price: number;
    contact: string;
    details: string;
  }>;
  total_amount: number;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setParsedData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process receipt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">
                <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-orange-300 to-emerald-400 text-transparent bg-clip-text tracking-tight">
            Lowvie
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Upload your business receipts and let AI find cost-saving opportunities and better alternatives
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!parsedData && !isLoading && (
            <div className="glass-card glow-border p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 relative mb-4">
                  <Image
                    src="/icon-receipt.svg"
                    alt="Receipt Icon"
                    layout="fill"
                    className="opacity-80"
                  />
                </div>
                <UploadForm onFileUpload={handleFileUpload} />
                <div className="mt-4">
                  <button
                    className="glass-button flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-full transition-all duration-200 hover:bg-opacity-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Connect PayPal
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="glass-card glow-border p-8 text-center">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-lg loading-dots">
                  Analyzing your receipt
                </p>
              </div>
            </div>
          )}

          {parsedData && (
            <div className="glass-card glow-border p-8">
              <ExpenseAnalysis data={parsedData} />
            </div>
          )}
        </div>

        {/* Features Section */}
        {!parsedData && !isLoading && (
          <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm glow-border">
              <div className="w-12 h-12 mx-auto mb-4 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
              <p className="text-text-secondary">Get detailed expense breakdowns and insights in seconds</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm glow-border">
              <div className="w-12 h-12 mx-auto mb-4 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Cost Optimization</h3>
              <p className="text-text-secondary">Discover better alternatives and potential savings</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm glow-border">
              <div className="w-12 h-12 mx-auto mb-4 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Reports</h3>
              <p className="text-text-secondary">Get actionable insights and detailed spending analytics</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}