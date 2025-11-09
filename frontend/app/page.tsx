'use client';

import { useState } from 'react';
import Image from 'next/image';
import UploadForm from '@/components/UploadForm';
import ExpenseAnalysis from '@/components/ExpenseAnalysis';
import KnotSection from '@/components/KnotSection';

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
      // Ensure the loading screen stays visible for at least 10 seconds
      const minDelay = new Promise((resolve) => setTimeout(resolve, 10000));
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
      // Wait for the minimum delay before showing results
      await minDelay;
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative w-14 h-14">
              <Image src="/logo.png" alt="Lobhi Logo" fill priority className="object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 text-transparent bg-clip-text">
              Lobhi
            </h1>
          </div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Lobhi tracks your purchases, researches the market, and automatically negotiates or finds better vendors to make sure you're getting the best deal.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!parsedData && !isLoading && (
            <div className="glass-card p-8 md:p-10">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="upload-icon-circle">
                  <div className="relative w-10 h-10">
                    <Image src="/icon-receipt.svg" alt="Receipt Icon" fill className="opacity-90" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Upload Receipts (PDF)</h3>
                  <p className="subtle-text mt-1">Drag and drop your receipt or choose a file to analyze expenses instantly</p>
                </div>
                <div className="w-full max-w-lg">
                  <UploadForm onFileUpload={handleFileUpload} />
                </div>
                <div className="flex items-center gap-2 text-xs subtle-text">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Secure upload • Processed on-device/server for this demo
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="glass-card p-8 text-center">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-lg loading-dots">
                  Analyzing your transactions
                </p>
              </div>
            </div>
          )}

          {parsedData && (
            <div className="glass-card p-8">
              <ExpenseAnalysis data={parsedData} />
            </div>
          )}
        </div>

        {/* Features Section */}
        {!parsedData && !isLoading && (
          <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="feature-card p-6 text-center">
              <div className="icon-wrap mx-auto mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Instant Analysis</h3>
              <p className="subtle-text">Upload a receipt or connect a merchant account and get insights immediately.</p>
            </div>
            <div className="feature-card p-6 text-center">
              <div className="icon-wrap mx-auto mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Cost Comparison</h3>
              <p className="subtle-text">Find alternative vendors at lower prices, tailored to your needs.</p>
            </div>
            <div className="feature-card p-6 text-center">
              <div className="icon-wrap mx-auto mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Negotiate & Save</h3>
              <p className="subtle-text">Generate strategies and let Lobhi negotiate on your behalf.</p>
            </div>
          </div>
        )}

        {/* Knot Section Below Project Cards */}
        {!parsedData && !isLoading && (
          <KnotSection onTriggerUpload={handleFileUpload} />
        )}
      </div>
    </main>
  );
}