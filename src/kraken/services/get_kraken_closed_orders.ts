import { timer } from 'rxjs'
import { take } from 'rxjs/operators'
import { krakenPrivateApiRequest } from '../api_clients/private_api_request'
import { KrakenOrderSnapshot } from '../types/kraken_order_snapshot'

// 
// https://www.kraken.com/features/api#get-closed-orders
//
type ApiClosedOrdersParams = {
    trades?: true | null;
    userref?: number;
    start?: number;
    end?: number;
    ofs?: number;
    closetime?: 'open' | 'close' | 'both';
}

export const getKrakenClosedOrders = async (params?: ApiClosedOrdersParams): Promise<KrakenOrderSnapshot[]> => {
    const { closed } = await krakenPrivateApiRequest({ url: 'ClosedOrders', data: { ...params ? params : {} }})
    const closedOrdersIds = Object.keys(closed)
    return closedOrdersIds.map(orderid => ({ orderid, ...closed[orderid] }) as KrakenOrderSnapshot)
}

export const getKrakenLastSuccessfullyClosedOrder = async (params?: ApiClosedOrdersParams): Promise<KrakenOrderSnapshot> => {
    const { closed } = await krakenPrivateApiRequest({ url: 'ClosedOrders', data: { ...params ? params : {} }})
    const closedOrdersIds = Object.keys(closed)
    if (closedOrdersIds.length === 0) {
        return null
    }
    const successfullyClosedOrders = closedOrdersIds.map(orderid => ({ orderid, ...closed[orderid] }) as KrakenOrderSnapshot).filter(({ status }) => status === 'closed')
    const lastSuccessfullyClosedOrder = successfullyClosedOrders.find(({ status }) => status === 'closed')
    if (lastSuccessfullyClosedOrder) {
        return lastSuccessfullyClosedOrder
    } else {
        // Delay exec. 1.5 seconds to avoid rate limits
        await timer(1500).pipe(take(1)).toPromise()
        const { ofs: lastOffset = 0 } = params
        return getKrakenLastSuccessfullyClosedOrder({
            ...params,
            ofs: closedOrdersIds.length + lastOffset
        })
    }
}
