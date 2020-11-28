import { baseAxiosConfig } from '../base_axios_config'
import { AxiosRequestConfig } from 'axios'

export const baseWsURL = 'wss://stream.binance.com:9443'

export const binanceAxiosConfig: AxiosRequestConfig = {
    ...baseAxiosConfig,
    baseURL: 'https://api.binance.com/',
}
