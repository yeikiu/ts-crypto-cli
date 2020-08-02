import { hitbtcPublicApiRequest } from "../../api_clients/hitbtc/public_api_request"
import { standardTicker } from "../../types/standard_ticker"
import * as moment from 'moment'

// 
// https://api.hitbtc.com/#tickers
// 

export const getHitBTCPriceTicker = async (symbols: string): Promise<standardTicker> => {
    const ticker = await hitbtcPublicApiRequest({ url: 'ticker', params: { symbols }})
    const { last: price } = ticker.find(({ symbol }) => symbol === symbols )
    
    return {
        exchange: 'hitbtc',
        utcMoment: moment().utc(),
        pair: symbols,
        price
    }
}
