import { hitbtcPublicApiRequest } from '../../api_clients/hitbtc/public_api_request'
import { standardOHLC } from '../../types/standard_ohlc'
import * as moment from 'moment'

// 
// https://api.hitbtc.com/#candles
// 
// limit: Default 100; max 1000

export const getHitBTCOHLCCandles = async (symbol: string, period = 'M1', limit = 720): Promise<standardOHLC[]> => {
    const candles = await hitbtcPublicApiRequest({ url: 'candles', params: { symbols: symbol, period, sort: 'DESC', limit }})
    const [pairKey,] = Object.keys(candles)
    
    return candles[pairKey].map(({ open, max: high, min: low, close, volume }) => ({
        exchange: 'hitbtc',
        utcMoment: moment().utc(),
        open,
        high,
        low,
        close,
        volume
    }))
}
