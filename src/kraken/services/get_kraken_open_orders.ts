import { krakenPrivateApiRequest } from '../api_clients/private_api_request'
import { KrakenOrderSnapshot } from '../types/kraken_order_snapshot'

// 
// https://www.kraken.com/features/api#get-open-orders
// 
type ApiOpenOrdersParams = {
    trades?: true | null;
    userref?: number;
}

export const getKrakenOpenOrders = async (params?: ApiOpenOrdersParams): Promise<KrakenOrderSnapshot[]> => {
    const { open } = await krakenPrivateApiRequest({ url: 'OpenOrders', data: { ...params ? params : {} }}) || {}
    const openOrdersIds = Object.keys(open)
    return openOrdersIds.map(orderid => ({ orderid, ...open[orderid] }) as KrakenOrderSnapshot)
}
