import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getKrakenPrivateObservableFromWS } from '../ws_clients/private_ws_handler'
import { InjectedApiKeys } from '../../types/injected_api_keys'
import { KrakenOpenOrderSnapshot } from '../types/kraken_open_order_snapshot'

const getKrakenOpenOrdersStream = async (lastToken?: string, injectedApiKeys?: InjectedApiKeys): Promise<Observable<KrakenOpenOrderSnapshot[]>> => {
    const subscribeData = {
        event: 'subscribe',
        subscription: {
            name: 'openOrders'
        }
    }
    const unsubscribeData = {
        event: 'unsubscribe',
        subscription: {
            name: 'openOrders'
        }
    }
    const filterStream = (response): boolean => Array.isArray(response) && response[response.length -1] === 'openOrders'
    const { privateObservable$ } = await getKrakenPrivateObservableFromWS(lastToken, subscribeData, filterStream, unsubscribeData, injectedApiKeys)
    
    return privateObservable$.pipe(
        map(([ordersSnapshot]) => ordersSnapshot.map(krakenOrder => {
                const [orderid] = Object.keys(krakenOrder)
                return {
                    orderid,
                    ...krakenOrder[orderid]
                } as KrakenOpenOrderSnapshot
            })
        )
    )
}

export {
    getKrakenOpenOrdersStream
}
