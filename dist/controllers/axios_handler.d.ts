import { AxiosResponse } from 'axios';
import { PublicMethod, PrivateMethod } from '../models/api_methods';
declare const _default: {
    publicRequest: (url: PublicMethod, data?: any) => Promise<AxiosResponse<any>>;
    privateRequest: (url: PrivateMethod, data?: any) => Promise<AxiosResponse<any>>;
};
export default _default;
