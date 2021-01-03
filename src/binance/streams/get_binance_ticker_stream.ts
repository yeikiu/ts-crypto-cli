import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getBinancePublicObservableFromWS } from '../ws_clients/public_ws_handler'
import { StandardTicker } from '../../types/standard_ticker'

const getBinanceTickerStream = (baseAsset: string, quoteAsset: string): Observable<StandardTicker> => {
    const pair = `${baseAsset}${quoteAsset}`.toLowerCase()
    const streamName = `${pair}@miniTicker`

    return getBinancePublicObservableFromWS([streamName]).pipe(
        map(({ data: { 
        /* https://docs.binance.org/api-reference/dex-api/ws-streams.html#8-individual-symbol-ticker-streams
        
            // e: stream_name,
            E: ticker_time,
            // s: pair,
            // p: price_change,
            // P: price_change_percent,
            // w: weighted_avg_price,
            // x: first_trade_price,
            c: last_price,
            // Q: last_quantity,
            // b: best_bid_price,
            // B: best_bid_quantity,
            // a: best_ask_price,
            // A: best_ask_quantity,
            o: open_price,
            h: high_price,
            l: low_price,
            v: total_traded_base_asset_volume,
            q: total_traded_quote_asset_volume,
        */
            E: utcTimestamp,
            c: price, 
        }}) => ({
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
