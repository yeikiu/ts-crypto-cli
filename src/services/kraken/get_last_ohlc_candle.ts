import { krakenPublicApiRequest } from "../../api_clients/kraken/public_api_request"
import { stdOHLC } from "../../types/standard_ohlc"

export const getKrakenLastOHLCCandle = async (pair: string): Promise<stdOHLC> => {
    const candles = await krakenPublicApiRequest({ url: 'OHLC', data: { pair }})
    const [pairKey,] = Object.keys(candles)
    const [lastCandle,] = candles[pairKey].reverse()
    const [/* lastId */, open, high, low, close ] = lastCandle

    return {
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
    }
}
