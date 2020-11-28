import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getBinancePrivateObservableFromWS } from '../ws_clients/private_ws_handler'
import { BinanceOpenOrderSnapshot } from '../types/binance_open_order_snapshot'

import { InjectedApiKeys } from '../../types/injected_api_keys'

const getBinanceOpenOrdersStream = async (lastToken?: string, injectedApiKeys?: InjectedApiKeys): Promise<Observable<BinanceOpenOrderSnapshot>> => {
    const { privateObservable$ } = await getBinancePrivateObservableFromWS(lastToken, ['executionReport'], ({ e: eventType }) => ['executionReport'].includes(eventType), null, injectedApiKeys)
    
    return privateObservable$.pipe(
        map(({
            e: eventType,
            E: eventTime,
            s: symbol, 
            c: clientOrderId,
            S: side,
            o: orderType,
            f: timeInForce,
            q: orderQuantity,
            p: orderPrice,
            P: stopPrice,
            F: icebergQuantity,
            g: orderListId, 
            C: canceledOrderId,
            x: executionType,
            X: executionStatus,
            r: rejectReason,
            i: orderId,
            l: lastExecutedQuantity,
            z: cumulativeFilledQuantity,
            L: lastExecutedPrice,
            n: comissionAmount,
            N: comissionAsset,
            T: transactionTime,
            t: tradeID,
            I: ignore, 
            w: isOrderOnBook,
            m: isMakerTrade,
            O: orderCreationTime,
            Z: cumulativeQuoteQty,
            Y: lastQuoteAssetTransactedQuantity,
            Q: quoteOrderQty
        }) => ({
            eventType,
            eventTime,
            symbol,
            clientOrderId,
            side,
            orderType,
            timeInForce,
            orderQuantity,
            orderPrice,
            stopPrice,
            icebergQuantity,
            orderListId,
            canceledOrderId,
            executionType,
            executionStatus,
            rejectReason,
            orderId,
            lastExecutedQuantity,
            cumulativeFilledQuantity,
            lastExecutedPrice,
            comissionAmount,
            comissionAsset,  
            transactionTime,
            tradeID,
            ignore,
            isOrderOnBook,
            isMakerTrade,
            orderCreationTime,
            cumulativeQuoteQty,
            lastQuoteAssetTransactedQuantity,
            quoteOrderQty
        }))
    )
}

export {
    getBinanceOpenOrdersStream
}
