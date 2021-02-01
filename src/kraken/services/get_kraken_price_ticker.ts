import { krakenPublicApiRequest } from '../api_clients/public_api_request'
import { StandardTicker } from '../../types/standard_ticker'

// 
// https://www.kraken.com/features/api#get-ticker-info
// 

export const getKrakenPriceTicker = async (pair: string): Promise<StandardTicker> => {
    const rawTicker = await krakenPublicApiRequest({ url: 'Ticker', data: { pair }})
    const [pairKey,] = Object.keys(rawTicker)
    const ticker = rawTicker[pairKey]
    const { c: [price,] } = ticker || {}

    return {
        exchange: 'kraken',
        utcTimestamp: new Date().getTime(),
        pair,
        price
    }
}
