import { stdOHLC } from "../../types/standard_ohlc"
import { binancePublicApiRequest } from "../../api_clients/binance/public_api_request"

export const getBinanceLastOHLCCandle = async (symbol: string, interval = '1m'): Promise<stdOHLC> => {
    const candles = await binancePublicApiRequest({ url: 'api/v3/klines', params: { symbol, interval, limit: 1 }})
    const [lastCandle,] = candles.reverse()
    const [/* openTime */, open, high, low, close, /* volume, closeTime */] = lastCandle

    return {
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
    }
}
