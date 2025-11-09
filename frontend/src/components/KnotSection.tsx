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

export default function KnotSection() {
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
      merchantIds: [19, 44, 36],
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
    try {
      appendLog('Fetching mock transactions...');
      const resp = await fetch('http://localhost:8000/api/transactions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ external_user_id: externalUserId, limit: 5 }),
      });
      const data = await resp.json();
      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        appendLog('Transactions loaded: ' + data.transactions.length);
      } else {
        appendLog('Unexpected transactions payload: ' + JSON.stringify(data));
      }
    } catch (e: any) {
      appendLog('Fetch transactions exception: ' + (e?.message || String(e)));
    }
  }

  return (
    <div className="mt-12">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-2">Knot Amazon Auth Demo</h2>
        <p className="text-text-secondary mb-4">Create a Knot session, open the SDK for Amazon (merchant 44), and retrieve mock transactions.</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={createSession} disabled={loading}>Create Session</button>
          <button className="btn" onClick={openKnot} disabled={!sessionId}>Open Knot SDK</button>
          <button className="btn" onClick={fetchTransactions}>Fetch Transactions</button>
        </div>
        <div className="mt-4">
          <label className="text-sm text-text-secondary">External User ID:&nbsp;
            <input className="px-2 py-1 rounded bg-white/5 border border-white/10" value={externalUserId} onChange={e => setExternalUserId(e.target.value)} />
          </label>
        </div>
        <pre className="mt-4 p-3 rounded bg-black/80 text-green-400 whitespace-pre-wrap min-h-[150px]">{log}</pre>
        <h3 className="text-lg font-semibold mt-4">Transactions</h3>
        {transactions.length === 0 && <p className="text-text-secondary">No transactions yet.</p>}
        <ul>
          {transactions.map((t, i) => (
            <li key={i} className="border-b border-white/10 py-2">
              <strong>{t.description || t.merchant || 'Purchase'}</strong><br />
              Amount: {t.amount || t.total || 'N/A'} | Date: {t.date || t.timestamp || 'N/A'}
            </li>
          ))}
        </ul>
      </div>
      <Script src="https://unpkg.com/knotapi-js@next" strategy="afterInteractive" />
    </div>
  );
}
