import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { baseWsURL } from './hitbtc_axios_config'
import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject'

const onHitBTCWSOpened = new Subject()
const onHitBTCWSClosed = new Subject()
const hitBTCWS = webSocket({
    protocol: 'v1',
    url: baseWsURL,
    WebSocketCtor: WebSocket,
    openObserver: onHitBTCWSOpened,
    closeObserver: onHitBTCWSClosed
})

const getHitBTCPublicObservableFromWS = (subscriptionData: any, filterFn?: (data: unknown) => boolean, unsubscriptionData?: any): Observable<any> => {
    const publicObservable$ = hitBTCWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        filterFn
    )
    return publicObservable$
}

export {
    getHitBTCPublicObservableFromWS,
    onHitBTCWSOpened,
    onHitBTCWSClosed
}
