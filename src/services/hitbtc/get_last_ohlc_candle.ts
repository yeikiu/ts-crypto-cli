import { hitbtcPublicApiRequest } from "../../api_clients/hitbtc/public_api_request"
import { stdOHLC } from "../../types/standard_ohlc"

export const getHitBTCLastOHLCCandle = async (symbols: string, period = 'M1'): Promise<stdOHLC> => {
    const candles = await hitbtcPublicApiRequest({ url: 'candles', params: { symbols, period, sort: 'DESC', limit: 1 }})
    const [pairKey,] = Object.keys(candles)
    const [{ open, max: high, min: low, close },] = candles[pairKey]
    
    return {
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
    }
}
