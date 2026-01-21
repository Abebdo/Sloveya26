# Solveya — AI Scam Detection Platform

![Solveya Banner](https://via.placeholder.com/1200x600/0a0f1c/00f0ff?text=Solveya+AI+Security)

> **Solveya** is a next-generation cyber-security platform that uses advanced AI (Llama 3.1) running on the edge to detect scams, phishing attempts, and social engineering in text messages.

## 🚀 Features

*   **Deep AI Analysis**: Uses Llama 3.1 to understand context, intent, and psychological triggers.
*   **Risk Heatmap**: Visually highlights dangerous phrases and linguistic manipulation.
*   **Real-time Scoring**: Provides a 0-100 risk score and categorical assessment (Safe, Phishing, Investment Scam, etc.).
*   **Safe Rewrite**: Automatically generates a neutralized or "honest" version of the scam message.
*   **Privacy First**: All analysis happens on stateless Cloudflare Workers. No data is permanently stored.
*   **Modern UI**: Futuristic "Glass-morphism" design with smooth animations and responsive layout.

## 🛠 Tech Stack

*   **Frontend**: React 18, Vite, TypeScript
*   **Styling**: Tailwind CSS, Framer Motion
*   **Icons**: Lucide React
*   **Backend / AI**: Cloudflare Pages, Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`)
*   **Deployment**: Cloudflare Pages

## 📂 Project Structure

```
/
├── functions/              # Cloudflare Pages Functions (Backend)
│   └── api/
│       └── analyze.ts      # Main AI Analysis Endpoint
├── src/
│   ├── components/         # Reusable UI Components
│   │   ├── analyzer/       # Core Analysis Widgets (Heatmap, RiskMeter)
│   │   ├── common/         # Atomic Components (Button, Card, Badge)
│   │   └── layout/         # Layout Wrappers (Navbar, Footer)
│   ├── hooks/              # Custom React Hooks (useAnalyze)
│   ├── lib/                # Utilities & API Clients
│   │   ├── analyzer-service.ts # API Client & Mock Engine
│   │   └── types.ts        # TypeScript Interfaces
│   ├── pages/              # Application Pages (Home, About, Pricing, etc.)
│   └── styles/             # Global Styles
└── wrangler.toml           # Cloudflare Configuration
```

## 💻 Local Development

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

    > **Note:** In local development (without `wrangler`), the app automatically falls back to a **Mock Engine**. This simulates the AI response using advanced heuristics, allowing you to test the UI and flows without a live Cloudflare connection.

3.  **Build for Production**
    ```bash
    npm run build
    ```

## ☁️ Deployment

This project is optimized for **Cloudflare Pages**.

1.  **Push to GitHub**
2.  **Connect to Cloudflare Pages**
3.  **Configure Build Settings**:
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Bind AI Model**:
    *   Go to your Pages project settings -> Functions -> AI.
    *   Add a binding named `AI`.

## 📜 License

MIT License.
