import { useState, useEffect } from 'react'
import type { CoinDetail } from '../types/coin'

// Accepts the selected coin's id, or null if no coin is selected
export function useCoinDetail(coinId: string | null) {
    const [coin, setCoin] = useState<CoinDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Don't fetch if no coin is selected — guards against fetching "coins/null"
        if (!coinId) return 

        const fetchDetail = async () => {
            setLoading(true)
            setError(null)
            setCoin(null) // Clear previous coin's data while loading new ones
            try {
                const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setCoin(data)
            } catch {
                setError('Could not load coin details.')
            } finally {
            setLoading(false)
        }
    }
    fetchDetail()
  }, [coinId]) // re-runs every time selected coin changes

    return { coin, loading, error }
}