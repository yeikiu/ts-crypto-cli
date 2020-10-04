export type BinanceUserDataEventType = 'balanceUpdate' | 'outboundAccountPosition' | 'executionReport'

export type BinanceOpenOrderSnapshot = {
    eventType: BinanceUserDataEventType; // Event type
    eventTime: number; // Event time
    symbol: string; // Symbol
    clientOrderId: string; // Client order ID
    side: 'BUY' | 'SELL'; // Side
    orderType: string; // Order type
    timeInForce: string; // Time in force
    orderQuantity: string; // Order quantity
    orderPrice: string; // Order price
    stopPrice: string; // Stop price
    icebergQuantity: string; // Iceberg quantity
    orderListId: number; // OrderListId
    canceledOrderId: string; // Original client order ID; This is the ID of the order being canceled
    executionType: string; // Current execution type
    executionStatus: string; // Current order status
    rejectReason: string;  // Order reject reason; will be an error code.
    orderId: number; // Order ID
    lastExecutedQuantity: string; // Last executed quantity
    cumulativeFilledQuantity: string; // Cumulative filled quantity
    lastExecutedPrice: string; // Last executed price
    comissionAmount: string; // Commission amount
    comissionAsset: string | null;  // Commission asset
    transactionTime: number; // Transaction time
    tradeID: number; // Trade ID
    // I: number; // Ignore
    isOrderOnBook: boolean;  // Is the order on the book?
    isMakerTrade: boolean; // Is this trade the maker side?
    // M: boolean; // Ignore
    orderCreationTime: number; // Order creation time
    cumulativeQuoteQty: string; // Cumulative quote asset transacted quantity
    lastQuoteAssetTransactedQuantity: string; // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
    quoteOrderQty: string;  // Quote Order Qty
}