import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { krakenPrivateApiRequest } from './private_api_request'
import debugHelper from '../../util/debug_helper'
import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject'

const { logError } = debugHelper(__filename)

const onKrakenPrivateWSOpened = new Subject()
const onKrakenPrivateWSClosed = new Subject()
export const krakenPrivateWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws-auth.kraken.com/',
    WebSocketCtor: WebSocket,
    openObserver: onKrakenPrivateWSOpened,
    closeObserver: onKrakenPrivateWSClosed
})

export const gethWsAuthToken = async (): Promise<string> => {
    try {
        const { token } = await krakenPrivateApiRequest({ url: 'GetWebSocketsToken' })
        // debug({ token })
        return token
        
    } catch({ code, message }) {
        logError({ code, message })
        return 'tokenNetworkError'
    }
}

export const getKrakenPrivateObservableFromWS = async (lastToken: string, subscriptionData: any, filterFn: (data: unknown) => boolean, unsubscriptionData?: any): Promise<{ privateObservable$: Observable<any>; token: string; onKrakenPrivateWSOpened: Observable<any>; onKrakenPrivateWSClosed: Observable<any> }> => {
    const token = lastToken || await gethWsAuthToken()

    const subscriptionDataWithToken = subscriptionData.subscription ? {
        ...subscriptionData,
        subscription: {
            ...subscriptionData.subscription,
            token
        },
    } : {
        ...subscriptionData,
        token,
    }

    const privateObservable$ = krakenPrivateWS.multiplex(
        () => (subscriptionDataWithToken),
        () => (unsubscriptionData),
        filterFn
    )
    return {
        privateObservable$,
        token,
        onKrakenPrivateWSOpened,
        onKrakenPrivateWSClosed
    }
}
