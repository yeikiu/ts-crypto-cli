import debugHelper from '../util/debug_helper'
import { getHitBTCPublicObservableFromWS } from './public_ws_handler'
import { Observable } from 'rxjs/internal/Observable'

const { debug, logError } = debugHelper(__filename)

const authData = {
    method: "login",
    id: "authRequest",
    params: {
        algo: "BASIC",
        pKey: process.env.HITBTC_API_KEY,
        sKey: process.env.HITBTC_SECRET_KEY
    }
}

export const getHitBTCPrivateObservableFromWS = (subscriptionData: any, filterFn: (data: unknown) => boolean, unsubscriptionData?: any): Observable<any> => {
    const auth$ = getHitBTCPublicObservableFromWS(authData, ({ id }) => id === "authRequest")
    const authSubscription = auth$.subscribe(({ result, error }) => {
        authSubscription.unsubscribe()
        debug({ result, error })
        if (error) {
            logError({ error })
            throw new Error(error)
        }
        if (result !== true) throw new Error('HitBTC WS auth error')
        
    }, (authError) => {
        logError({ authError })
        throw new Error(authError)
    })

    return getHitBTCPublicObservableFromWS(subscriptionData, filterFn, unsubscriptionData)
}
