import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../base_axios_config'
import debugHelper from '../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { binanceAxiosConfig } from './binance_axios_config'
import * as moment from 'moment'
import { getBinanceMessageSignature } from './message_signature'

const { debug } = debugHelper(__filename)

const createBinancePrivateApiClient = (apikey = process.env.BINANCE_API_KEY || '', apiSecret = process.env.BINANCE_API_SECRET || ''): AxiosInstance => {
    const privateApiClient: AxiosInstance = axios.create(binanceAxiosConfig)
    privateApiClient.defaults.headers['X-MBX-APIKEY'] = apikey
    privateApiClient.interceptors.request.use((config: AxiosRequestConfig) => {

        const timestamp = moment().valueOf()
        // Sign payload
        config.data = {
            ...config.data,
            timestamp,
        }
        const dataSignature = getBinanceMessageSignature(config.data, apiSecret)
        config.data = {
            ...config.data,
            signature: dataSignature,
        }
        // Sign params
        config.params = {
            ...config.params,
            timestamp,
        }
        const paramsSignature = getBinanceMessageSignature(config.params, apiSecret)
        config.params = {
            ...config.params,
            signature: paramsSignature,
        }

        return baseAxiosRequestInterceptor(config)

    }, baseAxiosRequestErrorInterceptor)
    privateApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)
    return privateApiClient
}

const defaultClient = createBinancePrivateApiClient()
const binancePrivateApiRequest = async ({ url, method, data, params }: AxiosRequestConfig): Promise<any> => {
    const { data: hitBTCresponse } = await defaultClient.request({ url, method, params, data })
    debug({ hitBTCresponse })
    return hitBTCresponse
}

export {
    createBinancePrivateApiClient,
    binancePrivateApiRequest
}
