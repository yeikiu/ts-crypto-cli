import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { krakenPrivateApiRequest } from './private_api_request'
import debugHelper from '../../util/debug_helper'
import { Observable } from 'rxjs/internal/Observable'

const { debug, logError } = debugHelper(__filename)

const krakenPrivateWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws-auth.kraken.com/',
    WebSocketCtor: WebSocket,
})

const gethWsAuthToken = async (): Promise<string> => {
    try {
        const { token } = await krakenPrivateApiRequest({ url: 'GetWebSocketsToken' })
        debug({ token })
        return token
        
    } catch({ code, message }) {
        logError({ code, message })
        return 'tokenNetworkError'
    }
}

const getKrakenPrivateObservableFromWS = async (lastToken: string, subscriptionData: any, filterFn: (data: unknown) => boolean, unsubscriptionData?: any): Promise<{ privateObservable$: Observable<any>; token: string }> => {
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
        token
    }
}

export {
    krakenPrivateWS,
    gethWsAuthToken,
    getKrakenPrivateObservableFromWS,
}
