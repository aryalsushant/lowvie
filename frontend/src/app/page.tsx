'use client';

import { useState } from 'react';
import Image from "next/image";
import KnotConnect from '../components/KnotConnect';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  const handleUpload = () => {
    // Existing upload functionality
    console.log('Upload clicked');
  };

  const handleKnotSuccess = () => {
    setIsConnected(true);
    // Here you would typically process the mock transaction data
    console.log('PayPal connected successfully');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/lowvie.svg"
          alt="Lowvie logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Upload your receipts or connect your account
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Get started by uploading your receipts or connecting your PayPal account to automatically import your transactions.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={handleUpload}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Receipt
          </button>
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Connect PayPal
          </button>
          <KnotConnect onSuccess={handleKnotSuccess} />
        </div>
        {isConnected && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
            PayPal account connected successfully! Your transactions will be processed automatically.
          </div>
        )}
      </main>
    </div>
  );
}
