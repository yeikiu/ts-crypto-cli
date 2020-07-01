import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../base_axios_config'
import debugHelper from '../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { hitbtcAxiosConfig } from './hitbtc_axios_config'

const { print } = debugHelper(__filename)

const createHitBTCPrivateApiClient = (apikey = process.env.HITBTC_API_KEY || '', apiSecret = process.env.HITBTC_API_SECRET || ''): AxiosInstance => {
    const privateApiClient: AxiosInstance = axios.create(hitbtcAxiosConfig)
    privateApiClient.defaults.headers.Authorization = 'Basic ' + Buffer.from(`${apikey}:${apiSecret}`).toString('base64')
    privateApiClient.interceptors.request.use(baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor)
    privateApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)
    return privateApiClient
}

const defaultClient = createHitBTCPrivateApiClient()
const hitbtcPrivateApiRequest = async ({ url, method, data, params }: AxiosRequestConfig): Promise<any> => {
    const { data: hitBTCresponse } = await defaultClient.request({ url, method, params, data })
    print({ hitBTCresponse })
    return hitBTCresponse
}

export {
    createHitBTCPrivateApiClient,
    hitbtcPrivateApiRequest
}
