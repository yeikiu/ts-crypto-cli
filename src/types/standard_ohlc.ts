export type StandardOHLC = {
    exchange: 'kraken' | 'binance' | 'hitbtc';
    utcTimestamp: number;
    pair: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}