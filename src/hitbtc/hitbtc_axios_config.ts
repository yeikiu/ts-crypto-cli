import { baseAxiosConfig } from '../base_axios_config'
import { AxiosRequestConfig } from 'axios'

export const baseWsURL = 'wss://api.hitbtc.com/api/2/ws'

export const hitbtcAxiosConfig: AxiosRequestConfig = {
    ...baseAxiosConfig,
    baseURL: 'https://api.hitbtc.com/api/2/',
}
