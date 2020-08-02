import { krakenPublicApiRequest } from "../../api_clients/kraken/public_api_request"
import { standardOHLC } from "../../types/standard_ohlc"
import * as moment from 'moment'

// 
// https://www.kraken.com/features/api#get-ohlc-data
// 

export const getKrakenOHLCCandles = async (pair: string, interval = 1): Promise<standardOHLC> => {
    const candles = await krakenPublicApiRequest({ url: 'OHLC', data: { pair, interval }})
    const [pairKey,] = Object.keys(candles)
    candles[pairKey].reverse()
    
    return candles[pairKey].map(([ open, high, low, close,, volume ]) => ({
        exchange: 'kraken',
        utcMoment: moment().utc(),
        open,
        high,
        low,
        close,
        volume
    }))
}
