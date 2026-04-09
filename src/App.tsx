import { useState } from 'react'
import { useCoins } from './hooks/useCoins'
import CoinTable from './components/CoinTable'
import CoinDetail from './components/CoinDetail'

export default function App() {
  const { coins, loading, error } = useCoins()
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crypto Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left column: coin list with search, filter, and sort */}
        <div className="flex-1">
          <CoinTable
            coins={coins}
            loading={loading}
            error={error}
            selectedCoinId={selectedCoinId}
            onSelectCoin={setSelectedCoinId}
          />
        </div>

        {/* Right column: detail panel, conditionally rendered */}
        {selectedCoinId && (
          <div className="w-full md:w-96">
            <CoinDetail
              coinId={selectedCoinId}
              onClose={() => setSelectedCoinId(null)}
            />
          </div>
        )}

      </div>
    </div>
  )
}