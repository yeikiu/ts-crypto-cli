import * as moment from 'moment';
export interface OHLC {
    time: moment.Moment;
    open: string;
    high: string;
    low: string;
    close: string;
    vwap: string;
    volume: string;
    count: number;
}
export declare enum MinutesIntervals {
    '30-min' = 30,
    '1-h' = 60,
    '4-h' = 240,
    '24-h' = 1440
}
