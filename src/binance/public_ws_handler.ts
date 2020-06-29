import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { baseWsURL } from './binance_axios_config'
import { Observable } from 'rxjs/internal/Observable'

const binancePublicWS = webSocket({
    url: `${baseWsURL}/stream?streams=miniTicker`,
    WebSocketCtor: WebSocket,
})

const getBinancePublicObservableFromWS = (streamNames: string[], unsubscriptionData?: any): Observable<any> => {
    const subscriptionData = {
        method: "SUBSCRIBE",
        params: streamNames,
        id: 123
    }
    const publicObservable$ = binancePublicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        ({ stream = '' }): boolean => streamNames.includes(stream)
    )
    return publicObservable$
}

export {
    getBinancePublicObservableFromWS,
    binancePublicWS,
}
