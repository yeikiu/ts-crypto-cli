export type StandardTicker = {
    exchange: 'kraken' | 'binance' | 'hitbtc';
    utcTimestamp: number;
    pair: string;
    price: string;
}