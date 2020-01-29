import { AxiosResponse } from 'axios';
import { PublicMethod, PrivateMethod } from '../models/api_methods';
export declare const KrakenClient: {
    publicRequest: (url: PublicMethod, data?: any) => Promise<AxiosResponse<any>>;
    privateRequest: (url: PrivateMethod, data?: any) => Promise<AxiosResponse<any>>;
};
