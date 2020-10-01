import debugHelper from '../../util/debug_helper'
import { getHitBTCPublicObservableFromWS } from './public_ws_handler'
import { Observable } from 'rxjs/internal/Observable'
import { take } from 'rxjs/operators'
import { InjectedApiKeys } from '../../types/injected_api_keys'

const { logError } = debugHelper(__filename)

export const getHitBTCPrivateObservableFromWS = async (subscriptionData: unknown, filterFn: (data: unknown) => boolean, unsubscriptionData?: unknown, injectedApiKeys?: InjectedApiKeys): Promise<Observable<unknown>> => {
    const defaultAuthData = {
        method: "login",
        id: "authRequest",
        params: {
            algo: "BASIC",
            pKey: process.env.HITBTC_API_KEY,
            sKey: process.env.HITBTC_API_SECRET
        }
    }

    const authData = injectedApiKeys ? {
        ...defaultAuthData,
        params: {
            algo: "BASIC",
            pKey: injectedApiKeys.apiKey,
            sKey: injectedApiKeys.apiSecret
        }
    } : defaultAuthData

    const auth$ = getHitBTCPublicObservableFromWS(authData, ({ id }) => id === "authRequest")
    const { result, error } = await auth$.pipe(take(1)).toPromise().catch((authError) => {
        logError({ authError })
        throw new Error(authError)
    })

    if (error) {
        logError({ error })
        throw new Error(error)
    }
    if (result !== true) {
        throw new Error('HitBTC WS auth error')
    }

    return getHitBTCPublicObservableFromWS(subscriptionData, filterFn, unsubscriptionData)
}
