import { hitbtcPublicApiRequest } from '../../api_clients/hitbtc/public_api_request'
import { StandardOHLC } from '../../types/standard_ohlc'

// 
// https://api.hitbtc.com/#candles
// 
// limit: Default 100; max 1000

export const getHitBTCOHLCCandles = async (symbols: string, period = 'M1', limit = 720): Promise<StandardOHLC[]> => {
    const candles = await hitbtcPublicApiRequest({ url: 'candles', params: { symbols, period, sort: 'DESC', limit }})
    const [pairKey,] = Object.keys(candles)
    
    return candles[pairKey].map(({ open, max: high, min: low, close, volume }) => ({
        exchange: 'hitbtc',
        utcTimestamp: new Date().getTime(),
        pair: symbols,
        open,
        high,
        low,
        close,
        volume
    }))
}
