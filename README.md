# Lowvie 📉✨

**Your AI assistant for cutting business costs. Analyze spending, find better prices, and let AI negotiate for you.**

Lowvie is an intelligent procurement dashboard designed for small to medium-sized businesses. Simply upload your supplier invoices, and our AI agent workflow will automatically parse the data, benchmark your costs against market rates, and identify exactly where you're overpaying. With a single click, Lowvie can even draft and send negotiation emails to get you a better deal.

---

## 🚀 Key Features

-   **📄 AI Invoice Parsing:** Automatically extracts vendor names, line items, and costs from uploaded invoices.
-   **📊 Market Benchmarking:** Compares your spending against industry averages to calculate a "Price Fairness Score."
-   **💰 Clear Savings Insights:** Visualizes potential monthly and annual savings for each overpriced supplier.
-   **🤖 Automated Negotiation:** Generates data-driven negotiation emails to your current suppliers or outreach messages to cheaper alternatives.

---

## 💻 Tech Stack

-   **Frontend:** Next.js, React, Tailwind CSS
-   **Backend:** Python, FastAPI
-   **AI Orchestration:** Dedalus Labs
-   **LLM:** OpenAI / Gemini

---

## 👕 Demo Use Case: `voidform`

Our demo showcases a trendy hoodie business named `voidform`. We analyze their three core suppliers—for blank hoodies, printing services, and shipping—to identify and negotiate a better price on their primary apparel costs, instantly increasing their profit margin.

---

## 📂 Repository Structure
lowvie/
├── backend/ # Python FastAPI server and AI agents
│ ├── agents/
│ ├── core/
│ ├── data/
│ ├── routers/
│ ├── workflows/
│ ├── main.py
│ └── requirements.txt
├── frontend/ # Next.js user interface
│ ├── app/
│ ├── components/
│ ├── public/
│ └── package.json
├── .gitignore
└── README.md
code
Code
---

## 🛠️ Getting Started

### **Prerequisites**

-   Node.js & npm
-   Python 3.9+ & pip

### **Backend Setup**

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### **Frontend Setup**

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
