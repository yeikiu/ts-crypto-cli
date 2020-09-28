import { hitbtcPublicApiRequest } from '../../api_clients/hitbtc/public_api_request'
import { StandardTicker } from '../../types/standard_ticker'

// 
// https://api.hitbtc.com/#tickers
// 

export const getHitBTCPriceTicker = async (symbols: string): Promise<StandardTicker> => {
    const ticker = await hitbtcPublicApiRequest({ url: 'ticker', params: { symbols }})
    const { last: price } = ticker.find(({ symbol }) => symbol === symbols )
    
    return {
        exchange: 'hitbtc',
        utcTimestamp: new Date().getTime(),
        pair: symbols,
        price
    }
}
