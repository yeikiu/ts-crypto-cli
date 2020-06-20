import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PrivateMethod } from '../models/api_methods';
import * as qs from 'qs';
import apiRequestsConfig from '../config/api_requests';
import getMessageSignature from '../util/message_signature';

const { krakenBaseUrl, apiVersion, method, headers, timeout } = apiRequestsConfig

const privateClient: AxiosInstance = axios.create({
    baseURL: `${krakenBaseUrl}/${apiVersion}/private`,
    method,
    headers: {
        ...headers,
        'API-Key': process.env.KRAKEN_API_KEY,
    },
    timeout,
})

privateClient.interceptors.request.use(
    (config) => {
        const { url } = config
        const nonce = new Date().getTime() * 1000
        config.data = {
            ...config.data,
            nonce,
        };
        config.headers['API-Sign'] = getMessageSignature(`/${apiVersion}/private/${url}`, config.data)
        config.data = qs.stringify(config.data)
        return config

    }, (error) => {
        throw new Error(error)
    }
)

export const privateApiRequest = async (url: PrivateMethod, data: unknown = {}): Promise<any> => {
    const { data: { result, error }} = await privateClient.request({ url, data })
    if (error?.length) throw new Error(error.join(' | '))
    return result
}
