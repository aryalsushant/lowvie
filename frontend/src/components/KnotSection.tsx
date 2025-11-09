'use client';

import React, { useState } from 'react';
import Script from 'next/script';

interface Transaction {
  id?: string;
  amount?: number;
  description?: string;
  date?: string;
  [key: string]: any;
}

type Props = {
  // Instead of analyzing SDK transactions, simply trigger the existing upload workflow
  onTriggerUpload?: (file: File) => void | Promise<void>;
};

export default function KnotSection({ onTriggerUpload }: Props) {
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [log, setLog] = useState<string>('');
  const [externalUserId, setExternalUserId] = useState<string>('demo-user-1');

  const appendLog = (line: string) => setLog(prev => prev + line + '\n');

  async function createSession() {
    try {
      setLoading(true);
      appendLog('Creating session...');
      const resp = await fetch('http://localhost:8000/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'transaction_link', external_user_id: externalUserId }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        appendLog(`Create session failed: ${resp.status} ${text}`);
        return;
      }
      const data = await resp.json();
      setSessionId(data.sessionId);
      appendLog(`Session created: ${data.sessionId} (mock=${data.mock})`);
    } catch (e: any) {
      appendLog(`Create session exception: ${e?.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  async function openKnot() {
    if (!sessionId) return appendLog('No sessionId yet');
    appendLog('Opening Knot SDK...');
    const SDK = (window as any).KnotapiJS?.default;
    if (!SDK) {
      appendLog('Knot SDK not loaded');
      return;
    }
    const knotapi = new SDK();
    knotapi.open({
      sessionId,
      clientId: 'dda0778d-9486-47f8-bd80-6f2512f9bcdb',
      environment: 'development',
      product: 'transaction_link',
      merchantIds: [19, 44, 36, 12, 165, 45],
      entryPoint: 'demo',
      useCategories: false,
      useSearch: false,
      onSuccess: (product: string, details: any) => {
        appendLog('onSuccess ' + JSON.stringify({ product, details }));
      },
      onError: (product: string, errorCode: string, message: string) => {
        appendLog('onError ' + JSON.stringify({ product, errorCode, message }));
      },
      onEvent: (product: string, event: string, merchant: any, payload: any, taskId: any) => {
        appendLog('onEvent ' + JSON.stringify({ product, event, merchant, payload, taskId }));
      },
      onExit: (product: string) => appendLog('onExit ' + product),
    });
  }

  async function fetchTransactions() {
    // Instead of calling transactions API, invoke the existing upload/analysis workflow
    appendLog('Triggering existing receipt analysis workflow...');
    // Create a synthetic File object to align with handleFileUpload signature
    const blob = new Blob([JSON.stringify({ demo: true })], { type: 'application/json' });
    const syntheticFile = new File([blob], 'synthetic-receipt.json', { type: 'application/json' });
    try {
      await onTriggerUpload?.(syntheticFile);
      appendLog('Receipt analysis workflow triggered.');
    } catch (e: any) {
      appendLog('Workflow trigger failed: ' + (e?.message || String(e)));
    }
  }

  return (
    <div className="mt-12">
      <div className="glass-card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <div className="upload-icon-circle !w-10 !h-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Connect Your Merchant Account</h2>
            <p className="subtle-text">Login to your merchant account and retrieve transactions instantly.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
          <button
            className="px-4 py-2 rounded-md btn-primary-gradient disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={createSession}
            disabled={loading}
          >
            Create Session
          </button>
          <button
            className="px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={openKnot}
            disabled={!sessionId}
          >
            Open Knot SDK
          </button>
          <button
            className="px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition"
            onClick={fetchTransactions}
          >
            Fetch Transactions
          </button>
        </div>

        {/* External User ID */}
        <div className="mt-5">
          <label className="block text-sm subtle-text mb-1">External User ID</label>
          <input
            className="w-full max-w-xs px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/40 transition placeholder:text-text-secondary"
            value={externalUserId}
            onChange={e => setExternalUserId(e.target.value)}
            placeholder="demo-user-1"
          />
        </div>

        {/* Log */}
        <div className="mt-6 rounded-lg border border-white/10 bg-black/70">
          <pre className="p-4 md:p-5 font-mono text-sm text-green-400 whitespace-pre-wrap min-h-[150px]">{log}</pre>
        </div>
        {/* Transaction list removed since we now reuse receipt workflow */}
      </div>
      <Script src="https://unpkg.com/knotapi-js@next" strategy="afterInteractive" />
    </div>
  );
}
