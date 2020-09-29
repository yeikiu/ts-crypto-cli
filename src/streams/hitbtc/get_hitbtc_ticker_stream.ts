import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getHitBTCPublicObservableFromWS } from '../../api_clients/hitbtc/public_ws_handler'
import { StandardTicker } from '../../types/standard_ticker'

const getHitBTCTickerStream = (pair: string): Observable<StandardTicker> => {
    const subscriptionData = {
        method: 'subscribeTicker',
        params: {
            symbol: pair.toUpperCase()
        }
    }
    const filterStream = ({ method, params: { symbol = '' } = {} }): boolean => method === 'ticker' && symbol.toUpperCase() === pair.toUpperCase()

    return getHitBTCPublicObservableFromWS(subscriptionData, filterStream).pipe(
        map(({ params: { last: lastHitBTCprice = '', timestamp } }) => ({
            exchange: 'hitbtc',
            utcTimestamp: new Date(timestamp).getTime(),
            pair,
            price: Number(lastHitBTCprice).toFixed(2),
        }))
    )
}

export {
    getHitBTCTickerStream
}
