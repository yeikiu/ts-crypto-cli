import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getBinancePublicObservableFromWS } from '../ws_clients/public_ws_handler'
import { StandardTicker } from '../../types/standard_ticker'

const getBinanceTickerStream = (baseAsset: string, quoteAsset: string): Observable<StandardTicker> => {
    const pair = `${baseAsset}${quoteAsset}`.toLowerCase()
    const streamName = `${pair}@miniTicker`

    return getBinancePublicObservableFromWS([streamName]).pipe(
        map(({ data: { c: price = '', E: utcTimestamp = 0 } = {} }) => ({
            exchange: 'binance',
            utcTimestamp,
            pair,
            price,
        }))
    )
}

export {
    getBinanceTickerStream
}
