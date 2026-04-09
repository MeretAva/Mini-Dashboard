import { useState, useEffect } from "react";
import type { Coin } from "../types/coin";

export function useCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // useEffect cannot take an async function directly, so we define
    // fetchCoins inside it and call it immediately
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
        );
        // fetch() does not throw on HTTP errors like 429 (rate limit),
        // check res.ok manually and throw error
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCoins(data);
      } catch {
        setError("Could not load coins. Please try again.");
      } finally {
        // Always set loading to false whether the fetch succeeded or failed
        setLoading(false);
      }
    };
    fetchCoins();
  }, []); // Empty dependency array means this runs once when the component first mounts

  return { coins, loading, error };
}
