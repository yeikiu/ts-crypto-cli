import WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject'

const onKrakenPublicWSOpened = new Subject()
const onKrakenPublicWSClosed = new Subject()
const krakenPublicWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws.kraken.com',
    WebSocketCtor: WebSocket,
    openObserver: onKrakenPublicWSOpened,
    closeObserver: onKrakenPublicWSClosed
})

const getKrakenPublicObservableFromWS = (subscriptionData: any, filterFn: (data: unknown) => boolean, unsubscriptionData?: any): Observable<any> => {
    const publicObservable$ = krakenPublicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        filterFn
    )
    return publicObservable$
}

export {
    getKrakenPublicObservableFromWS,
    onKrakenPublicWSOpened,
    onKrakenPublicWSClosed
}
