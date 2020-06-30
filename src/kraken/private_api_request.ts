import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../base_axios_config'
import {getKrakenMessageSignature} from './message_signature'
import debugHelper from '../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import {krakenAxiosConfig, apiVersion } from './kraken_axios_config'

const { print, logError } = debugHelper(__filename)

const privateApiClient: AxiosInstance = axios.create(krakenAxiosConfig)
privateApiClient.defaults.baseURL = `${privateApiClient.defaults.baseURL}/private`
privateApiClient.defaults.headers['API-Key'] = process.env.KRAKEN_API_KEY || ''
privateApiClient.interceptors.request.use((config) => {
        const { url } = config
        const nonce = new Date().getTime() * 1000
        config.data = {
            ...config.data,
            nonce
        }
        config.headers['API-Sign'] = getKrakenMessageSignature(`/${apiVersion}/private/${url}`, config.data)
        return baseAxiosRequestInterceptor(config)
    },
    baseAxiosRequestErrorInterceptor
)
privateApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)

export const krakenPrivateApiRequest = async ({ url, data }: AxiosRequestConfig): Promise<any> => {
    const { data: { result: krakenPrivateResponse, error }} = await privateApiClient.request({ url, data })
    if (error?.length) {
        const errorStr = error.join(' | ')
        logError(errorStr)
        throw new Error(errorStr)
    }
    print({ krakenPrivateResponse })
    return krakenPrivateResponse
}
