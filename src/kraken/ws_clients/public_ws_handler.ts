import WebSocket from 'ws'
import { webSocket } from 'rxjs/webSocket'
import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject'
import { filter } from 'rxjs/operators'

export const onKrakenPublicWSOpened = new Subject()
export const onKrakenPublicWSClosed = new Subject()

export const krakenPublicWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws.kraken.com',
    WebSocketCtor: WebSocket,
    openObserver: onKrakenPublicWSOpened,
    closeObserver: onKrakenPublicWSClosed
})

export const onKrakenPublicWSHeartbeat$ = krakenPublicWS.pipe(filter(({ event = null }) => event && event === 'heartbeat'))

export const getKrakenPublicObservableFromWS = (subscriptionData: any, filterFn: (data: unknown) => boolean, unsubscriptionData?: any): Observable<any> => {
    const publicObservable$ = krakenPublicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        filterFn
    )
    return publicObservable$
}
