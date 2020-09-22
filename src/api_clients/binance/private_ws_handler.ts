import * as WebSocket from 'ws'
import { webSocket } from "rxjs/webSocket"
import { binancePrivateApiRequest } from './private_api_request'
import debugHelper from '../../util/debug_helper'
import { Observable } from 'rxjs/internal/Observable'
import { baseWsURL } from './binance_axios_config'
import { Subject } from 'rxjs/internal/Subject'

const { logError } = debugHelper(__filename)

export const gethWsListenToken = async (): Promise<string> => {
    try {
        const { listenKey } = await binancePrivateApiRequest({ url: 'api/v3/userDataStream', method: 'POST' })
        // debug({ listenKey })
        return listenKey
        
    } catch({ code, message }) {
        logError({ code, message })
        return 'tokenNetworkError'
    }
}

type BinanceUserDataEvent = 'balanceUpdate' | 'outboundAccountPosition' | 'executionReport'
const allBinanceUserDataEvents: BinanceUserDataEvent[] = ['balanceUpdate', 'outboundAccountPosition', 'executionReport']

export const getBinancePrivateObservableFromWS = async (
    lastToken?: string,
    streamNames: BinanceUserDataEvent[] = allBinanceUserDataEvents,
    filterFn: (data: unknown) => boolean = ({ e }): boolean => allBinanceUserDataEvents.includes(e),
    unsubscriptionData?: any
): Promise<{ privateObservable$: Observable<any>; token: string; onBinancePrivateWSOpened: Observable<any>; onBinancePrivateWSClosed: Observable<any>  }> => {

    const token = lastToken || await gethWsListenToken()

    const subscriptionData = {
        method: "SUBSCRIBE",
        params: streamNames,
        id: new Date().getTime()
    }

    const onBinancePrivateWSOpened = new Subject()
    const onBinancePrivateWSClosed = new Subject()
    const binancePrivateWS = webSocket({
        url: `${baseWsURL}/ws/${token}`,
        WebSocketCtor: WebSocket,
        openObserver: onBinancePrivateWSOpened,
        closeObserver: onBinancePrivateWSClosed
    })

    const privateObservable$ = binancePrivateWS.multiplex(
        () => (subscriptionData),
        () => (unsubscriptionData),
        filterFn
    )
    return {
        privateObservable$,
        token,
        onBinancePrivateWSOpened,
        onBinancePrivateWSClosed
    }
}
