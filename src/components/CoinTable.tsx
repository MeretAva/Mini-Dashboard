import { useMemo, useState } from "react";
import type { Coin } from "../types/coin";
import LoadingSpinner from "./LoadingSpinner";

type Filter = "all" | "gainers" | "losers";
type SortKey = "price" | "market_cap" | "change";
type SortDir = "asc" | "desc";

interface SortIconProps {
  colKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}

function SortIcon({ colKey, sortKey, sortDir }: SortIconProps) {
  if (sortKey !== colKey)
    return (
      // Neutral double arrow when column is not active
      <svg
        className="inline w-3 h-3 ml-1 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );

  return sortDir === "asc" ? (
    <svg
      className="inline w-3 h-3 ml-1 text-black"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="inline w-3 h-3 ml-1 text-black"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

interface Props {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  selectedCoinId: string | null;
  onSelectCoin: (id: string) => void;
}

export default function CoinTable({
  coins,
  loading,
  error,
  selectedCoinId,
  onSelectCoin,
}: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortDir, setSortDir] = useState<SortDir>("asc"); // Derive the displayed list from raw coins data

  const displayed = useMemo(() => {
    let result = [...coins]; // 1. Filter by search query — matches against name or symbol

    const q = search.toLowerCase();
    if (q)
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q),
      ); // 2. Filter by gainer/loser tab

    if (filter === "gainers")
      result = result.filter((c) => c.price_change_percentage_24h > 0);
    if (filter === "losers")
      result = result.filter((c) => c.price_change_percentage_24h < 0); // 3. Sort by the active column

    result.sort((a, b) => {
      const val = {
        price: [a.current_price, b.current_price],
        market_cap: [a.market_cap, b.market_cap],
        change: [a.price_change_percentage_24h, b.price_change_percentage_24h],
      }[sortKey];
      return sortDir === "asc" ? val[0] - val[1] : val[1] - val[0];
    });

    return result;
  }, [coins, search, filter, sortKey, sortDir]); // If the same column header is clicked again, flip the direction.
  // If a new column is clicked, switch to it and reset to ascending.

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const formatPrice = (n: number) =>
    n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

  const formatMarketCap = (n: number) =>
    n.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  return (
    <div>
      {/* Search input — filters list on every keystroke */}

      <input
        type="text"
        placeholder="Search by name or symbol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
      />
      {/* Filter tabs — All / Gainers / Losers */}
      <div className="flex gap-2 mb-4">
        {(["all", "gainers", "losers"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm capitalize ${
              filter === f ? "bg-black text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {/* Coin Table */}
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2 pr-3 w-[40%]">Coin</th>

            <th
              className="pb-2 px-3 cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price
              <SortIcon colKey="price" sortKey={sortKey} sortDir={sortDir} />
            </th>

            <th
              className="pb-2 px-3 cursor-pointer"
              onClick={() => handleSort("change")}
            >
              24h Change
              <SortIcon colKey="change" sortKey={sortKey} sortDir={sortDir} />
            </th>

            <th
              className="pb-2 px-3 cursor-pointer hidden lg:table-cell"
              onClick={() => handleSort("market_cap")}
            >
              Market Cap
              <SortIcon
                colKey="market_cap"
                sortKey={sortKey}
                sortDir={sortDir}
              />
            </th>
            <th className="pb-2 pl-3 hidden w-[10%]  text-right lg:table-cell">
              Rank
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Empty state when search/filter returns no results */}
          {displayed.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-400">
                No results found
              </td>
            </tr>
          )}
          {displayed.map((coin) => (
            <tr
              key={coin.id}
              onClick={() => onSelectCoin(coin.id)}
              className={`border-b cursor-pointer hover:bg-gray-50 ${
                selectedCoinId === coin.id ? "bg-gray-100" : ""
              }`}
            >
              <td className="py-2 pr-3">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 shrink-0"
                  />

                  <span className="font-medium truncate">{coin.name}</span>

                  <span className="text-gray-400 uppercase shrink-0">
                    {coin.symbol}
                  </span>
                </div>
              </td>

              <td className="py-2 px-3 whitespace-nowrap">
                {formatPrice(coin.current_price)}
              </td>
              <td
                className={`py-2 px-3 whitespace-nowrap ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {coin.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </td>
              <td className="py-2 px-3 hidden lg:table-cell">
                {formatMarketCap(coin.market_cap)}
              </td>
              <td className="py-2 pl-3 hidden  text-right lg:table-cell">
                #{coin.market_cap_rank}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
