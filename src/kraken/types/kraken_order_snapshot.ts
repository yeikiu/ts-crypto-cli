// WS: https://docs.kraken.com/websockets/#message-openOrders
// REST API: https://www.kraken.com/features/api#get-open-orders

type KrakenOrderDescription = {
    pair: string; // asset pair
    position: string; // Optional - position ID (if applicable)
    type: 'buy' | 'sell'; // type of order (buy/sell)
    ordertype: string; // order type
    price: number; // primary price
    price2: number; // secondary price
    leverage: number; // amount of leverage
    order: string; // order description
    close: string; // conditional close order description (if conditional close set)
}

export type KrakenOrderSnapshot = {
    orderid: string; // Injected to original payload
    status:	string; // status of order
    refid?: string;	// Referral order transaction id that created this order
    userref?: number; // user reference ID
    opentm?: number; // unix timestamp of when order was placed
    closetm?: number; // unix timestamp of order close time
    starttm?: number; // unix timestamp of order start time (if set)
    expiretm?: number; //unix timestamp of order end time (if set)
    descr?: KrakenOrderDescription; // order description info
    vol?: string; // volume of order (base currency unless viqc set in oflags)
    vol_exec?: string; // total volume executed so far (base currency unless viqc set in oflags)
    cost?: string; // total cost (quote currency unless unless viqc set in oflags)
    fee?: string; // total fee (quote currency)
    avg_price?: string; // WS ONLY - average price (cumulative; quote currency unless viqc set in oflags)
    price?: string; // REST API ONLY - average price (cumulative; quote currency unless viqc set in oflags)
    stopprice?: string; // stop price (quote currency, for trailing stops)
    limitprice?: string; // triggered limit price (quote currency, when limit based order type triggered)
    misc?: string; // comma delimited list of miscellaneous info: stopped=triggered by stop price, touched=triggered by touch price, liquidation=liquidation, partial=partial fill
    oflags?: string; // Optional - comma delimited list of order flags. viqc = volume in quote currency (not currently available), fcib = prefer fee in base currency, fciq = prefer fee in quote currency, nompp = no market price protection, post = post only order (available when ordertype = limit)
    cancel_reason?: string; // WS ONLY - Optional - cancel reason, present for all cancellation updates (status="canceled") and for some close updates (status="closed")
}
