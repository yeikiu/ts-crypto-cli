import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../base_axios_config'
import debugHelper from '../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import {hitbtcAxiosConfig} from './hitbtc_axios_config'

const { print } = debugHelper(__filename)

const privateApiClient: AxiosInstance = axios.create(hitbtcAxiosConfig)
privateApiClient.defaults.headers.Authorization = 'Basic ' + Buffer.from(`${process.env.HITBTC_API_KEY}:${process.env.HITBTC_SECRET_KEY}`).toString('base64')
privateApiClient.interceptors.request.use(baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor)
privateApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)

export const hitbtcPrivateApiRequest = async ({ url, method, data, params }: AxiosRequestConfig): Promise<any> => {
    const { data: hitBTCresponse } = await privateApiClient.request({ url, method, params, data })
    print({ hitBTCresponse })
    return hitBTCresponse
}
