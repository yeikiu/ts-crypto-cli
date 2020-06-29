import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../base_axios_config'
import debugHelper from '../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { binanceAxiosConfig } from './binance_axios_config'

const { print } = debugHelper(__filename)

const publicApiClient: AxiosInstance = axios.create(binanceAxiosConfig)
publicApiClient.interceptors.request.use(baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor)
publicApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)

export const binancePublicApiRequest = async ({ url, method, params, data }: AxiosRequestConfig): Promise<any> => {
    const { data: binancePublicResponse } = await publicApiClient.request({ url, method, params, data })
    print({ binancePublicResponse })
    return binancePublicResponse
}
