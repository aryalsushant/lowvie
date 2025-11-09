'use client';

import { useId } from 'react';

interface UploadFormProps {
  onFileUpload: (file: File) => Promise<void>;
}

export default function UploadForm({ onFileUpload }: UploadFormProps) {
  const inputId = useId();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput.files && fileInput.files[0]) {
      await onFileUpload(fileInput.files[0]);
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor={inputId} className="block text-sm font-medium">
            Upload Receipt (PDF)
          </label>
          <input
            id={inputId}
            type="file"
            accept=".pdf"
            required
            className="block w-full text-sm rounded-lg border border-white/10 bg-white/5 text-text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/40 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:font-semibold file:bg-gradient-to-r file:from-violet-500 file:to-emerald-500 file:hover:opacity-95"
          />
          <p className="subtle-text text-xs">PDF only. We’ll analyze line items and surface savings opportunities.</p>
        </div>
        <button
          type="submit"
          className="w-full btn-primary-gradient py-3 rounded-md"
        >
          Upload and Analyze
        </button>
      </form>
    </div>
  );
}