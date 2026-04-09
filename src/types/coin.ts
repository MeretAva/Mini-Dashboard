// Represents single coin returned by coins/markets endpoint
export interface Coin {
    id: string
    name: string
    symbol: string
    image: string
    current_price: number
    market_cap: number
    market_cap_rank: number
    price_change_percentage_24h: number
}

// Represents detailed coin data returned by /coins/{id} endpoint
export interface CoinDetail {
    id: string
    name: string
    symbol: string
    image: { large: string }
    description: { en: string }
    categories: string[]
    links: { homepage: string[] }
    market_data: {
        current_price: { eur: number }
        market_cap_rank: number
        high_24h: { eur: number }
        low_24h: { eur: number }
    }
}