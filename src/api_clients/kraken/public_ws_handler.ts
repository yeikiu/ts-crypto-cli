import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { Observable } from 'rxjs/internal/Observable'

export const krakenPublicWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws.kraken.com',
    WebSocketCtor: WebSocket,
})

export const getKrakenPublicObservableFromWS = (subscriptionData: any, filterFn: (data: unknown) => boolean, unsubscriptionData?: any): Observable<any> => {
    const publicObservable$ = krakenPublicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        filterFn
    )
    return publicObservable$
}
