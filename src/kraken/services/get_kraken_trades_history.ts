import { krakenPrivateApiRequest } from '../../kraken/api_clients/private_api_request'
import { KrakenTradesHistoryItem } from '../types/kraken_trade_history_item'
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

const getKrakenTradesHistory = async (maxResults = Infinity): Promise<KrakenTradesHistoryItem[]> => {
    let ofs = 0
    let tradesBlock: KrakenTradesHistoryItem[] = []
    let rawResult: KrakenTradesHistoryItem[] = []
    let keepFetching = true
    do {
        const { trades } = await krakenPrivateApiRequest({ url: 'TradesHistory', data: { ofs } })
        const tradesIds = Object.keys(trades)
        tradesBlock = tradesIds.map(tradeid => ({
            tradeid,
            ...trades[tradeid],
            time: new Date(trades[tradeid].time * 1000).getTime(),
            date: new Date(trades[tradeid].time * 1000)
        }) as KrakenTradesHistoryItem)
        rawResult = [...rawResult, ...tradesBlock]
        ofs = rawResult.length
        keepFetching = tradesBlock.length === 50 && rawResult.length < maxResults
        if (keepFetching) { await timer(7000).pipe(take(1)).toPromise() } // Avoid rate-limits by awaiting 7 seconds per iteration
    } while (keepFetching)

    const result: KrakenTradesHistoryItem[] = (maxResults < Infinity && rawResult.length > maxResults) ? rawResult.slice(0, maxResults) : rawResult
    return result
}

export {
    getKrakenTradesHistory
}
