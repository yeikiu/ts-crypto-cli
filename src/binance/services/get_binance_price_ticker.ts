import { binancePublicApiRequest } from '../api_clients/public_api_request'
import { StandardTicker } from '../../types/standard_ticker'

// 
// https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker
// 

export const getBinancePriceTicker = async (symbol: string): Promise<StandardTicker> => {
    const { symbol: pair, price } = await binancePublicApiRequest({ 
        url: 'api/v3/ticker/price',
        params: { symbol }
    })
    return {
        exchange: 'binance',
        utcTimestamp: new Date().getTime(),
        pair,
        price
    }
}
