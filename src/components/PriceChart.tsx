import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  coinId: string;
}

interface ChartPoint {
  date: string;
  price: number;
}

export default function PriceChart({ coinId }: Props) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch7Day = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=7&interval=daily`,
        );
        const json = await res.json();
        // json.prices is an array of [timestamp, price] pairs
        const points: ChartPoint[] = json.prices
          .slice(0, -1) // Remove the last point which is today's duplicate
          .map(([ts, price]: [number, number]) => ({
            date: new Date(ts).toLocaleDateString("de-DE", {
              month: "short",
              day: "numeric",
            }),
            price: parseFloat(price.toFixed(2)),
          }));
        setData(points);
      } catch {
        // silently fail — chart is non-critical
      } finally {
        setLoading(false);
      }
    };
    fetch7Day();
  }, [coinId]);

  if (loading) return <p className="text-sm text-gray-400">Loading chart...</p>;
  if (!data.length) return null;

  return (
    <div>
      <h4 className="font-semibold mb-2">7-Day Price</h4>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            padding={{ left: 20, right: 20 }}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value) =>
              (value as number).toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR",
              })
            }
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#000"
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
