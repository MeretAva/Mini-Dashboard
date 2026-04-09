# Cryptocurrency Dashboard

Finanztip Coding Challenge
A React + TypeScript + Tailwind CSS mini dashboard for evaluating cryptocurrencies, built using the CoinGecko public API.

## Setup Instructions

**Prerequisites**

- Node.js (LTS version recommended)

**Install and run**

1. Clone the repository
2. Install dependencies:
   `npm install`
3. Start the development server:
   `npm run dev`
4. Open http://localhost:5173 in your browser

No API key is required. The CoinGecko free tier used.

## Approach

**Data:** Two custom hooks (useCoins, useCoinDetail) encapsulate all API fetching logic and expose loading, error, and data states. This keeps components clean and focused on rendering.

**State:** App-level state holds only the selected coin ID. Search, filter, and sort state live in CoinTable. The displayed list is derived via useMemo to avoid unnecessary recalculation.

**UI:** Components are kept small and focused. LoadingSpinner and the detail panel are reusable. Tailwind utility classes handle all styling without separate CSS files.

**Responsiveness:** A useMediaQuery hook detects the screen size at runtime
and adapts the layout accordingly. On mobile, coin details open in a Vaul
bottom drawer, and on desktop they appear as a side panel.

## What I Would Improve With More Time

- **Tests:** Add unit tests for hooks and utility functions using Vitest and React Testing Library
- **Pagination or infinite scroll:** Currently limited to 50 coins
- **Comparison view:** Allow selecting up to 3 coins side by side to compare
  price, market cap, and 24h change
- **Route-based navigation:** Use React Router so each coin has its own URL,
  enabling browser back/forward navigation and shareable links
- **Error Retry:** Add a retry button to refresh the page in addition to error message from failed fetch
- **Environmental variables:** Move API base URL into .env file for easier maintenance and adaption
