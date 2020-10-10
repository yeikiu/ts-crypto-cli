// https://docs.kraken.com/websockets/#message-openOrders

type KrakenOpenOrderDescription = {
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

export type KrakenOpenOrderSnapshot = {
    orderid: string; // Injected to original payload
    status:	string; // status of order
    refid?: string;	// Referral order transaction id that created this order
    userref?: number; // user reference ID
    opentm?:	number; // unix timestamp of when order was placed
    starttm?: number; // unix timestamp of order start time (if set)
    expiretm?: number; //unix timestamp of order end time (if set)
    descr?: KrakenOpenOrderDescription; // order description info
    vol?: number; // volume of order (base currency unless viqc set in oflags)
    vol_exec?: number; // total volume executed so far (base currency unless viqc set in oflags)
    cost?: number; // total cost (quote currency unless unless viqc set in oflags)
    fee?: number; // total fee (quote currency)
    avg_price?: number; // average price (cumulative; quote currency unless viqc set in oflags)
    price?: number; // average price (quote currency unless viqc set in oflags)
    stopprice?: number; // stop price (quote currency, for trailing stops)
    limitprice?: number; // triggered limit price (quote currency, when limit based order type triggered)
    misc?: string; // comma delimited list of miscellaneous info: stopped=triggered by stop price, touched=triggered by touch price, liquidation=liquidation, partial=partial fill
    oflags?: string; // Optional - comma delimited list of order flags. viqc = volume in quote currency (not currently available), fcib = prefer fee in base currency, fciq = prefer fee in quote currency, nompp = no market price protection, post = post only order (available when ordertype = limit)
    cancel_reason?: string; // Optional - cancel reason, present for all cancellation updates (status="canceled") and for some close updates (status="closed")
}
