import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getKrakenPublicObservableFromWS } from '../../api_clients/kraken/public_ws_handler'
import { StandardTicker } from '../../types/standard_ticker'

const getKrakenTickerStream = (pair: string): Observable<StandardTicker> => {
    const subscribeData = {
        event: 'subscribe',
        pair: [pair.toUpperCase()],
        subscription: {
            name: 'ticker'
        }
    }
    const unsubscribeData = {
        event: 'unsubscribe',
        pair: [pair.toUpperCase()],
        subscription: {
            name: 'ticker'
        }
    }
    const filterStream = (response): boolean => Array.isArray(response) && response.slice(-2).every(v => ['ticker', pair.toUpperCase()].includes(v))
    return getKrakenPublicObservableFromWS(subscribeData, filterStream, unsubscribeData).pipe(
        map(([, { c: [lastKrakenPrice = '',] = [] } = {}, ]) => ({
            exchange: 'kraken',
            utcTimestamp: new Date().getTime(),
            pair,
            price: Number(lastKrakenPrice).toFixed(2),
        }))
    )
}

export {
    getKrakenTickerStream
}
