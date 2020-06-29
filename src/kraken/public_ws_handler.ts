import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { Observable } from 'rxjs/internal/Observable'

const krakenPublicWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws.kraken.com',
    WebSocketCtor: WebSocket,
})

const getKrakenPublicObservableFromWS = (subscriptionData: any, subscriptionId: number, unsubscriptionData?: any): Observable<any> => {
    subscriptionData = {
        ...subscriptionData,
        reqid: subscriptionId
    }
    const publicObservable$ = krakenPublicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        ({ reqid }) => reqid === subscriptionId
    )
    return publicObservable$
}

export {
    getKrakenPublicObservableFromWS,
    krakenPublicWS,
}
