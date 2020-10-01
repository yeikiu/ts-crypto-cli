import { StandardOHLC } from '../../types/standard_ohlc'
import { binancePublicApiRequest } from '../../api_clients/binance/public_api_request'

// 
// https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
// 
// limit: Default 500; max 1000

export const getBinanceOHLCCandles = async (symbol: string, interval = '1m', limit = 720): Promise<StandardOHLC[]> => {
    const candles = await binancePublicApiRequest({ url: 'api/v3/klines', params: { symbol, interval, limit }})
    candles.reverse()
    
    return candles.map(([, open, high, low, close, volume,]) => ({
        exchange: 'binance',
        utcTimestamp: new Date().getTime(),
        pair: symbol,
        open,
        high,
        low,
        close,
        volume,
    }))
}
