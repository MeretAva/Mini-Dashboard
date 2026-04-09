import { useCoinDetail } from "../hooks/useCoinDetail";
import LoadingSpinner from "./LoadingSpinner";
import PriceChart from "./PriceChart";

interface Props {
  coinId: string;
  onClose: () => void;
}

export default function CoinDetail({ coinId, onClose }: Props) {
  const { coin, loading, error } = useCoinDetail(coinId);

  const formatPrice = (n: number) =>
    n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

  // Strip HTML tags from CoinGecko descriptions
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  // Truncate description to a readable length after stripping HTML
  const shorten = (text: string, max = 300) => {
    const clean = stripHtml(text);
    return clean.length > max ? clean.slice(0, max) + "..." : clean;
  };

  return (
    <div className="md:border md:rounded-xl p-4">
      {/* Panel header with close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Coin Details</h2>
        <button
          onClick={onClose}
          className="cursor-pointer text-gray-400 hover:text-black text-xl"
        >
          ×
        </button>
      </div>

      {/* Loading and error states for the detail fetch */}
      {loading && <LoadingSpinner />}
      {error && <p className="text-gray-600">{error}</p>}

      {/* Only render content once the coin data has loaded */}
      {coin && (
        <div className="space-y-4">
          {/* Coin identity */}
          <div className="flex items-center gap-3">
            <img src={coin.image.large} alt={coin.name} className="w-10 h-10" />
            <div>
              <h3 className="font-bold text-xl">{coin.name}</h3>
              <span className="text-gray-400 uppercase text-sm">
                {coin.symbol}
              </span>
            </div>
          </div>

          {/* Price info */}
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">Current Price: </span>
              <strong>{formatPrice(coin.market_data.current_price.eur)}</strong>
            </p>
            <p>
              <span className="text-gray-500">Market Cap Rank: </span>
              <strong>#{coin.market_data.market_cap_rank}</strong>
            </p>
            <p>
              <span className="text-gray-500">24h High / Low: </span>
              <strong>
                {formatPrice(coin.market_data.high_24h.eur)} /{" "}
                {formatPrice(coin.market_data.low_24h.eur)}
              </strong>
            </p>
          </div>

          <PriceChart coinId={coin.id} />

          {/* Description – only show if one exists */}
          {coin.description.en && (
            <div>
              <h4 className="font-semibold mb-1">About {coin.name}</h4>
              <p className="text-sm text-gray-600">
                {shorten(coin.description.en)}
              </p>
            </div>
          )}

          {/* Category badges */}
          {coin.categories.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {coin.categories.slice(0, 4).map((cat) => (
                  <span
                    key={cat}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Homepage link */}
          {coin.links.homepage[0] && (
            <div>
              <h4 className="font-semibold mb-1">Links</h4>
              <a
                href={coin.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Website 🌐
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
