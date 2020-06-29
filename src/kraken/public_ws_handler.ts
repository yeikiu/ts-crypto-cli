import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { Observable } from 'rxjs/internal/Observable'

const krakenPublicWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws.kraken.com',
    WebSocketCtor: WebSocket,
})

const getKrakenPublicObservableFromWS = (subscriptionData: any, unsubscriptionData?: any): Observable<any> => {
    const { subscription: { name }} = subscriptionData
    const publicObservable$ = krakenPublicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        (responseArr: any) => Array.isArray(responseArr) && responseArr.some(v => v === name)
    )
    return publicObservable$
}

export {
    getKrakenPublicObservableFromWS,
    krakenPublicWS,
}
