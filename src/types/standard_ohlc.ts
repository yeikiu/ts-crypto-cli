import { Moment } from "moment";

export type standardOHLC = {
    exchange: 'kraken' | 'binance' | 'hitbtc';
    utcMoment: Moment;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}