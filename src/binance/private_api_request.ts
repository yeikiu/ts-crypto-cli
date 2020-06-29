import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../base_axios_config'
import debugHelper from '../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { binanceAxiosConfig } from './binance_axios_config'
import * as moment from 'moment'
import { getBinanceMessageSignature } from './message_signature'

const { print } = debugHelper(__filename)

const privateApiClient: AxiosInstance = axios.create(binanceAxiosConfig)
privateApiClient.defaults.headers['X-MBX-APIKEY'] = process.env.BINANCE_API_KEY
privateApiClient.interceptors.request.use((config: AxiosRequestConfig) => {

    const timestamp = moment().valueOf()
    // Sign payload
    config.data = {
        ...config.data,
        timestamp,
    }
    const dataSignature = getBinanceMessageSignature(config.data)
    config.data = {
        ...config.data,
        signature: dataSignature,
    }
    // Sign params
    config.params = {
        ...config.params,
        timestamp,
    }
    const paramsSignature = getBinanceMessageSignature(config.params)
    config.params = {
        ...config.params,
        signature: paramsSignature,
    }

    return baseAxiosRequestInterceptor(config)

}, baseAxiosRequestErrorInterceptor)
privateApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)

export const binancePrivateApiRequest = async ({ url, method, data, params }: AxiosRequestConfig): Promise<any> => {
    const { data: hitBTCresponse } = await privateApiClient.request({ url, method, params, data })
    print({ hitBTCresponse })
    return hitBTCresponse
}
