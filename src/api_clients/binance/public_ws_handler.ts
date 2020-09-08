/* eslint-disable @typescript-eslint/no-use-before-define */
import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { baseWsURL } from './binance_axios_config'
import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject'

const onBinancePublicWSOpened = new Subject()
const onBinancePublicWSClosed = new Subject()
const binancePublicWS = webSocket({
    url: `${baseWsURL}/stream`,
    WebSocketCtor: WebSocket,
    openObserver: onBinancePublicWSOpened,
    closeObserver: onBinancePublicWSClosed
})

const getBinancePublicObservableFromWS = (streamNames: string[], filterFn: (data: unknown) => boolean = ({ stream = '' }): boolean => streamNames.includes(stream), unsubscriptionData?: any): Observable<any> => {
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

export {
    getBinancePublicObservableFromWS,
    onBinancePublicWSOpened,
    onBinancePublicWSClosed
}
