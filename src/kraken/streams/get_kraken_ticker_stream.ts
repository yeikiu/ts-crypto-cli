import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getKrakenPublicObservableFromWS } from './../ws_clients/public_ws_handler'
import { StandardTicker } from '../../types/standard_ticker'

const getKrakenTickerStream = (baseAsset: string, quoteAsset: string): Observable<StandardTicker> => {
    const pair = `${baseAsset}/${quoteAsset}`.toUpperCase()
    const subscribeData = {
        event: 'subscribe',
        pair: [pair],
        subscription: {
            name: 'ticker'
        }
    }
    const unsubscribeData = {
        event: 'unsubscribe',
        pair: [pair],
        subscription: {
            name: 'ticker'
        }
    }
    const filterStream = (response): boolean => Array.isArray(response) && response.slice(-2).every(v => ['ticker', pair].includes(v))
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
