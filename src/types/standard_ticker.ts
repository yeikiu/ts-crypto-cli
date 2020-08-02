import { Moment } from "moment";

export type standardTicker = {
    utcMoment: Moment;
    exchange: 'kraken' | 'binance' | 'hitbtc';
    pair: string;
    price: string;
}