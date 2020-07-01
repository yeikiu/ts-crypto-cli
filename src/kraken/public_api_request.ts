import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../base_axios_config'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import debugHelper from '../util/debug_helper'
import { krakenAxiosConfig } from './kraken_axios_config'
import { PublicEndpoint } from './api_endpoints'

const { debug, logError } = debugHelper(__filename)

const publicApiClient: AxiosInstance = axios.create(krakenAxiosConfig)
publicApiClient.defaults.baseURL = `${publicApiClient.defaults.baseURL}/public`
publicApiClient.interceptors.request.use(baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor)
publicApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)

export interface KrakenPublicRequestConfig extends AxiosRequestConfig {
    method?: 'POST' | 'post';
    url: PublicEndpoint;
    data?: any;
}

export const krakenPublicApiRequest = async ({ url, data }: KrakenPublicRequestConfig): Promise<any> => {
    const { data: { result: krakenPublicResponse, error }} = await publicApiClient.request({ url, data })
    if (error?.length) {
        const errorStr = error.join(' | ')
        logError(errorStr)
        throw new Error(errorStr)
    }
    debug({ krakenPublicResponse })
    return krakenPublicResponse
}
