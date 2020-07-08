import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { baseWsURL } from './binance_axios_config'
import { Observable } from 'rxjs/internal/Observable'

export const binancePublicWS = webSocket({
    url: `${baseWsURL}/stream`,
    WebSocketCtor: WebSocket,
})

export const getBinancePublicObservableFromWS = (streamNames: string[], filterFn: (data: unknown) => boolean = ({ stream = '' }): boolean => streamNames.includes(stream), unsubscriptionData?: any): Observable<any> => {
    const subscriptionData = {
        method: "SUBSCRIBE",
        params: streamNames,
        id: new Date().getTime()
    }
    const publicObservable$ = binancePublicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        filterFn
    )
    return publicObservable$
}
