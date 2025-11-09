<div align="center">

# Lowvie — Profit, Unlocked ⚡️📉

AI agents that turn messy receipts and vendor logins into savings. Built at HackPrinceton 2025.

</div>

---

## The Problem
SMBs bleed profit through invisible leaks: overpriced inputs, stale vendor contracts, and scattered transaction data. Finance stacks are fragmented across Amazon Business, Walmart, PayPal, etc.—which makes analysis and negotiation tedious and slow.

## The Insight
If you can unify transactions and receipts, you can automate three workflows that directly increase margin:
- Parse actual spend → see where money goes.
- Benchmark vs. market → know what “fair” looks like.
- Negotiate with leverage → reduce recurring costs.

## What Lowvie Does
- Upload a receipt or connect a merchant account (Amazon, Walmart, PayPal, …) via Knot TransactionLink.
- Lowvie parses line items, groups spend, and estimates fair-market pricing using web research.
- It drafts negotiation emails for current vendors and outreach to cheaper alternatives—ready to send.

Lowvie = “Frugal” in Nepali. The goal is simple: reduce the gap between revenue and profit.

---

## Why Lowvie Makes a Difference
- Direct ROI: every feature maps to measurable savings (price deltas × volumes).
- Operationally lightweight: no ERP migration; just receipts and merchant logins.

---

## Key Innovations
- Knot-powered Spend Unification: One-click auth into merchants using Knot TransactionLink; sessions created server-side per spec (basic auth, Knot-Version headers).
- Multi-Agent Workflow using Dedalus:
    1) Parse Agent → extracts vendors, categories, prices from receipts/transactions.
    2) Search Agent → finds comparable suppliers and market rates.
    3) Negotiation Agent → generates targeted, data-backed emails for either renegotiation or outreach.
- Seamless UX: Same analysis workflow whether you upload a receipt and/or connect a vendor account

---

## Architecture

```
frontend/ (Next.js + Tailwind)
    • app/ — Landing, upload flow, analysis UI, Knot section (SDK via CDN)
    • components/ — UploadForm, ExpenseAnalysis, KnotSection

backend/ (FastAPI)
    • main.py — API routes (upload, draft email, alternatives) + Knot endpoints (/api/session/create, /api/transactions/sync)
    • knot_client.py — Basic-auth client for Knot’s /session/create and a mock transactions sync
    • requirements.txt — FastAPI, Uvicorn, requests, python-dotenv
```

Data flow highlights
- Create session: backend calls `POST /session/create` with Basic auth (client_id:secret) and `Knot-Version` headers, returns `sessionId` to frontend.
- Open SDK: frontend loads Knot SDK via CDN and initializes with { sessionId, clientId, environment, merchantIds }.
- Unified analysis: “Fetch Transactions” routes into the same analysis UI used for receipt uploads (hackathon-friendly demo flow).

---

## Tech Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI (Python), Uvicorn
- APIs: Knot TransactionLink (Knot API)
- Agent Orchestration: Dedalus Labs (3 specialized agents)

---

## Getting Started (Local)

Prereqs
- Node.js 18+
- Python 3.11+

1) Backend
```bash
cd backend
pip install -r requirements.txt

# set env (development creds from Knot; do NOT commit)
export KNOT_CLIENT_ID=your_dev_client_id
export KNOT_SECRET=your_dev_secret
export KNOT_BASE_URL=https://development.knotapi.com
export KNOT_VERSION=2.0
export CORS_ORIGINS=http://localhost:3000

uvicorn backend.main:app --reload --port 8000
```

2) Frontend
```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

Sanity check
```bash
curl -s -X POST http://localhost:8000/api/session/create \
    -H 'Content-Type: application/json' \
    -d '{"type":"transaction_link","external_user_id":"demo-user-1"}'
# → { "sessionId": "...", "mock": false } when keys are valid
```

---

## Deploy

Recommended: Vercel (frontend) + Render/Railway (backend)
- Backend start: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Backend env: KNOT_CLIENT_ID, KNOT_SECRET, KNOT_BASE_URL, KNOT_VERSION, CORS_ORIGINS
- Frontend env: `NEXT_PUBLIC_BACKEND_URL=https://your-backend.example.com`
- Update fetches to use `process.env.NEXT_PUBLIC_BACKEND_URL` or add Next.js rewrites.

---

## Live Demo Flow
1) Upload a PDF receipt → see “Analyzing your receipt…” → ExpenseAnalysis with line-items and totals.
2) Create a Knot session → Open Knot SDK → authenticate to a merchant (e.g., Amazon).
3) Click “Fetch Transactions” → runs the same analysis UX as receipt upload (demo-friendly path).
4) Generate negotiation emails with market-backed arguments.

---

## Why Dedalus 
We use Dedalus Labs to structure the multi-agent system:
- Parse Agent: deterministic extraction from semi-structured inputs.
- Search Agent: targeted web queries + normalization for apples-to-apples comparisons.
- Negotiation Agent: prompt-engineered to produce concise, firm-but-friendly emails with data exhibits.

This division-of-labor is the smallest system that gets real savings, not just pretty charts.

---


## Project Structure (this repo)
```
backend/
    main.py
    knot_client.py
    requirements.txt
    receipts/

frontend/
    app/
        page.tsx
        layout.tsx
        globals.css
    src/components/
        UploadForm.tsx
        ExpenseAnalysis.tsx
        KnotSection.tsx
    public/
        logo.png
```

---

## License
MIT

---

## Thanks you
- Knot API — TransactionLink and SDK
- Dedalus Labs — Agent orchestration
- Capital One — Best Financial Hack track which inspired this project

Built with ❤️ at HackPrinceton 2025 by Sushant Aryal.
