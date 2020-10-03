import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getBinancePublicObservableFromWS } from '../../api_clients/binance/public_ws_handler'
import { StandardTicker } from '../../types/standard_ticker'

const getBinanceTickerStream = (pair: string): Observable<StandardTicker> => {
    const streamName = `${pair.toLowerCase()}@miniTicker`

    return getBinancePublicObservableFromWS([streamName]).pipe(
        map(({ data: { c: lastBinancePrice = '', E: utcTimestamp = 0 } = {} }) => ({
            exchange: 'binance',
            utcTimestamp,
            pair,
            price: Number(lastBinancePrice).toFixed(2),
        }))
    )
}

export {
    getBinanceTickerStream
}
