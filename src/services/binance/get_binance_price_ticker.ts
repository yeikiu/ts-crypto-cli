import { binancePublicApiRequest } from "../../api_clients/binance/public_api_request"
import { standardTicker } from "../../types/standard_ticker"
import * as moment from 'moment'

// 
// https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker
// 

export const getBinancePriceTicker = async (symbol: string): Promise<standardTicker> => {
    const { symbol: pair, price } = await binancePublicApiRequest({ 
        url: 'api/v3/ticker/price',
        params: { symbol }
    })
    return {
        exchange: 'binance',
        utcMoment: moment().utc(),
        pair,
        price
    }
}
