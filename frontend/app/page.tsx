'use client';

import { useState } from 'react';
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
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Business Expense Optimizer
      </h1>

      {!parsedData && !isLoading && (
        <UploadForm onFileUpload={handleFileUpload} />
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Parsing receipt...</p>
        </div>
      )}

      {parsedData && (
        <ExpenseAnalysis data={parsedData} />
      )}
    </main>
  );
}