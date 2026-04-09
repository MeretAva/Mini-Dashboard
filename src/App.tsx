import { useState } from "react";
import { Drawer } from "vaul";
import { useCoins } from "./hooks/useCoins";
import { useMediaQuery } from "./hooks/useMediaQuery";
import CoinTable from "./components/CoinTable";
import CoinDetail from "./components/CoinDetail";

export default function App() {
  const { coins, loading, error } = useCoins();
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const close = () => setSelectedCoinId(null);

  return (
    <div className="max-w-6xl mx-auto p-6 min-w-sm">
      <h1 className="text-2xl font-bold mb-6">Crypto Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Coin list — always visible */}
        <div className="flex-1">
          <CoinTable
            coins={coins}
            loading={loading}
            error={error}
            selectedCoinId={selectedCoinId}
            onSelectCoin={setSelectedCoinId}
          />
        </div>
        {/* Desktop: side panel */}
        {!isMobile && selectedCoinId && (
          <div className="w-96 shrink-0">
            <CoinDetail coinId={selectedCoinId} onClose={close} />
          </div>
        )}
      </div>

      {/* Mobile: vaul bottom-sheet drawer */}
      {isMobile && (
        <Drawer.Root
          open={!!selectedCoinId}
          onOpenChange={(open) => !open && close()}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />

            <Drawer.Content
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-white outline-none"
              style={{ maxHeight: "85vh" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1">
                <CoinDetail coinId={selectedCoinId!} onClose={close} />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
}
