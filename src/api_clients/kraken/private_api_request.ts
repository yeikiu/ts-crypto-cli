import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../../base_axios_config'
import { getKrakenMessageSignature } from './message_signature'
import debugHelper from '../../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { krakenAxiosConfig, apiVersion } from './kraken_axios_config'
import { PrivateEndpoint } from '../../types/kraken_api_endpoints'

const { logError, debug } = debugHelper(__filename)

export const createKrakenPrivateApiClient = (apikey = process.env.KRAKEN_API_KEY || '', apiSecret = process.env.KRAKEN_API_SECRET || ''): AxiosInstance => {
    const privateApiClient: AxiosInstance = axios.create(krakenAxiosConfig)
    privateApiClient.defaults.baseURL = `${privateApiClient.defaults.baseURL}/private`
    privateApiClient.defaults.headers['API-Key'] = apikey
    privateApiClient.interceptors.request.use((config) => {
        const { url } = config
        const nonce = new Date().getTime() * 1000
        config.data = {
            ...config.data,
            nonce
        }
        config.headers['API-Sign'] = getKrakenMessageSignature(`/${apiVersion}/private/${url}`, config.data, apiSecret)
        return baseAxiosRequestInterceptor(config)
    },
        baseAxiosRequestErrorInterceptor
    )
    privateApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)
    return privateApiClient
}

interface KrakenPrivateRequestConfig extends AxiosRequestConfig {
    method?: 'POST' | 'post';
    url: PrivateEndpoint;
    data?: any;
}

let defaultClient = createKrakenPrivateApiClient()
export const krakenPrivateApiRequest = async ({ url, data }: KrakenPrivateRequestConfig): Promise<any> => {
    const { data: { result: krakenPrivateResponse, error } } = await defaultClient.request({ url, data })
    if (error?.length) {
        const errorStr = error.join(' | ')
        logError(errorStr)
        throw new Error(errorStr)
    }
    debug({ krakenPrivateResponse })
    return krakenPrivateResponse
}

export const updateKrakenDefaultClient = (apikey: string, apiSecret: string): void => {
    defaultClient = createKrakenPrivateApiClient(apikey, apiSecret)
}
