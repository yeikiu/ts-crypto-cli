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
        map(([, {
        /* https://docs.kraken.com/websockets/#message-ticker
        
            a: [ask_best_price, ask_whole_volume, ask_lot_volume],
            b: [bid_best_price, bid_whole_volume, bid_lot_volume],
            c: [close_price, close_lot_vol],
            v: [volume_today, volume_24h],
            p: [weighted_avg_price_today, weighted_avg_price_24h],
            t: [num_trades_today, num_trades_24h],
            l: [low_price_today, low_price_24h],
            h: [high_price_today, high_price_24h],
            o: [open_price_today, open_price_24h],
        */
            c: [price],
        }, ]) => ({
            exchange: 'kraken',
            utcTimestamp: new Date().getTime(),
            pair,
            price,
        }))
    )
}

export {
    getKrakenTickerStream
}
