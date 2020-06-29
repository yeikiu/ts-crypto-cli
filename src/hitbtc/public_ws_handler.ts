import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { baseWsURL } from './hitbtc_axios_config'
import { Observable } from 'rxjs/internal/Observable'

const hitBTCWS = webSocket({
    protocol: 'v1',
    url: baseWsURL,
    WebSocketCtor: WebSocket,
})

const getHitBTCPublicObservableFromWS = (subscriptionData: any, subscriptionId: string | number, unsubscriptionData?: any): Observable<any> => {
    subscriptionData = {
        ...subscriptionData,
        id: subscriptionId
    }
    const publicObservable$ = hitBTCWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        ({ id }) => id === subscriptionId
    )
    return publicObservable$
}

export {
    getHitBTCPublicObservableFromWS,
    hitBTCWS,
}
