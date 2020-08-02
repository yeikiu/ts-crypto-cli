import { krakenPublicApiRequest } from "../../api_clients/kraken/public_api_request"
import { standardTicker } from "../../types/standard_ticker"
import * as moment from 'moment'

// 
// https://www.kraken.com/features/api#get-ticker-info
// 

export const getKrakenPriceTicker = async (pair: string): Promise<standardTicker> => {
    const rawTicker = await krakenPublicApiRequest({ url: 'Ticker', data: { pair }})
    const [pairKey,] = Object.keys(rawTicker)
    const ticker = rawTicker[pairKey]
    const { c: [price,] } = ticker

    return {
        exchange: 'kraken',
        utcMoment: moment().utc(),
        pair,
        price
    }
}
