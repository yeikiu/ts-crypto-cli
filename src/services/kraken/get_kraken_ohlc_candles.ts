import { krakenPublicApiRequest } from "../../api_clients/kraken/public_api_request"
import { StandardOHLC } from "../../types/standard_ohlc"

// 
// https://www.kraken.com/features/api#get-ohlc-data
// 

export const getKrakenOHLCCandles = async (pair: string, interval = 1): Promise<StandardOHLC[]> => {
    const candles = await krakenPublicApiRequest({ url: 'OHLC', data: { pair, interval }})
    const [pairKey,] = Object.keys(candles)
    candles[pairKey].reverse()

    return candles[pairKey].map(([ utcTsInSeconds, open, high, low, close,, volume ]) => ({
        exchange: 'kraken',
        utcTimestamp: Number(utcTsInSeconds) * 1000,
        pair,
        open,
        high,
        low,
        close,
        volume
    }))
}
