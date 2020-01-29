import * as moment from 'moment';
import { KrakenPair } from "../models/kraken_pair";
import { OHLC } from '../models/api_methods';
declare const publicRequests: {
    getOHLC(pair: KrakenPair, interval?: "30-min" | "1-h" | "4-h" | "24-h", since?: moment.Moment): Promise<OHLC[]>;
};
export default publicRequests;
