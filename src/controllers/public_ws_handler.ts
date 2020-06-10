import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
// import debugHelper from '../util/debug_helper'

// const { debug, print, logError } = debugHelper(__filename)

const publicWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws.kraken.com',
    WebSocketCtor: WebSocket,
})

const getPublicObservableFromWS = (subscriptionData: any, unsubscriptionData?: any, filterFn?: any): any => {
    const publicObservable$ = publicWS.multiplex(
        () => subscriptionData, 
        () => unsubscriptionData,
        filterFn
    )
    return publicObservable$
}

export {
    getPublicObservableFromWS,
    publicWS,
}
