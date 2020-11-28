import { baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor, baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor } from '../../base_axios_config'
import debugHelper from '../../util/debug_helper'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { hitbtcAxiosConfig } from '../hitbtc_axios_config'

const { debug } = debugHelper(__filename)

const publicApiClient: AxiosInstance = axios.create(hitbtcAxiosConfig)
publicApiClient.defaults.baseURL = `${publicApiClient.defaults.baseURL}public/`
publicApiClient.interceptors.request.use(baseAxiosRequestInterceptor, baseAxiosRequestErrorInterceptor)
publicApiClient.interceptors.response.use(baseAxiosResponseInterceptor, baseAxiosResponseErrorInterceptor)

export const hitbtcPublicApiRequest = async ({ url, method, params, data }: AxiosRequestConfig): Promise<any> => {
    const { data: hitbtcPublicResponse } = await publicApiClient.request({ url, method, params, data })
    debug({ hitbtcPublicResponse })
    return hitbtcPublicResponse
}
