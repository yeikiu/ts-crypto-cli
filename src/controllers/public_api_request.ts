import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { PublicMethod } from '../models/api_methods'
import * as qs from 'qs'
import apiRequestsConfig from '../config/api_requests'

const { krakenBaseUrl, apiVersion, method, headers, timeout } = apiRequestsConfig

const publicClient: AxiosInstance = axios.create({
    baseURL: `${krakenBaseUrl}/${apiVersion}/public`,
    method,
    headers,
    timeout,
})

publicClient.interceptors.request.use(
    (config) => {
        config.data = qs.stringify(config.data)
        return config

    }, (error) => {
        throw new Error(error)
    }
)

export const publicApiRequest = async (url: PublicMethod, data: unknown = {}): Promise<any> => {
    const { data: { result, error }} = await publicClient.request({ url, data })
    if (error?.length) throw new Error(error.join(' | '))
    return result
}
