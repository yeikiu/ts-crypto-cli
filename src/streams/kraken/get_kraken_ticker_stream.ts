import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getKrakenPublicObservableFromWS } from '../../api_clients/kraken/public_ws_handler'
import { StandardTicker } from '../../types/standard_ticker'

const getKrakenTickerStream = (pair: string): Observable<StandardTicker> => {
    const subscriptionData = {
        event: 'subscribe',
        pair: [pair],
        subscription: {
            name: 'ticker'
        }
    }
    const filterStream = (response): boolean => Array.isArray(response) && response.slice(-2).every(v => ['ticker', pair].includes(v))
    return getKrakenPublicObservableFromWS(subscriptionData, filterStream).pipe(
        map(([, { c: [lastKrakenPrice = '',] = [] } = {}, ]) => ({
            exchange: 'kraken',
            utcTimestamp: new Date().getTime(),
            pair: pair.toUpperCase(),
            price: Number(lastKrakenPrice).toFixed(2),
        }))
    )
}

export {
    getKrakenTickerStream
}
