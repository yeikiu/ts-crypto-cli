import WebSocket from 'ws'
import { webSocket } from 'rxjs/webSocket'
import { krakenPrivateApiRequest } from '../api_clients/private_api_request'
import debugHelper from '../../util/debug_helper'
import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject'
import { InjectedApiKeys } from '../../types/injected_api_keys'
import { filter } from 'rxjs/operators'

const { logError } = debugHelper(__filename)

export const onKrakenPrivateWSOpened = new Subject()
export const onKrakenPrivateWSClosed = new Subject()

export const krakenPrivateWS = webSocket({
    protocol: 'v1',
    url: 'wss://ws-auth.kraken.com/',
    WebSocketCtor: WebSocket,
    openObserver: onKrakenPrivateWSOpened,
    closeObserver: onKrakenPrivateWSClosed
})

export const onKrakenPrivateWSHeartbeat$ = krakenPrivateWS.pipe(filter(({ event = null }) => event && event === 'heartbeat'))

export const gethWsAuthToken = async (injectedApiKeys?: InjectedApiKeys): Promise<string> => {
    try {
        const { token } = await krakenPrivateApiRequest({ url: 'GetWebSocketsToken' }, injectedApiKeys) || {}
        if (!token) {
            throw ({ code: 'CUSTOM_ERROR', message: 'no token received' })
        }
        return token
        
    } catch({ code, message }) {
        logError('Kraken gethWsAuthToken error', { code, message })
        throw ({ code, message })
    }
}

export const getKrakenPrivateObservableFromWS = async (lastToken: string = null, subscriptionData: any = {}, filterFn: (data: unknown) => boolean = () => true, unsubscriptionData?: any, injectedApiKeys?: InjectedApiKeys): Promise<{ privateObservable$: Observable<any>; token: string }> => {
    const token = lastToken || await gethWsAuthToken(injectedApiKeys)

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
