import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { privateApiRequest } from './private_api_request'
import debugHelper from '../util/debug_helper'

const { debug, logError } = debugHelper(__filename)

const privateWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws-auth.kraken.com/',
    WebSocketCtor: WebSocket,
})

const gethWsAuthToken = async (): Promise<string> => {
    try {
        const { token } = await privateApiRequest('GetWebSocketsToken')
        debug({ token })
        return token
        
    } catch({ code, message }) {
        logError({ code, message })
        return 'tokenNetworkError'
    }
}

const getPrivateObservableFromWS = async (lastToken: string, tokenPath: string, subscriptionData: any, unsubscriptionData?: any, filterFn?: any): Promise<any> => {
    const token = lastToken || await gethWsAuthToken()

    let subscriptionDataWithToken = { ...subscriptionData }
    if (tokenPath) {
        subscriptionDataWithToken[tokenPath] = {
            ...subscriptionDataWithToken[tokenPath],
            token,
        }
    } else {
        subscriptionDataWithToken = {
            ...subscriptionDataWithToken,
            token
        }
    }

    const privateObservable$ = privateWS.multiplex(
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
    privateWS,
    gethWsAuthToken,
    getPrivateObservableFromWS,
}
