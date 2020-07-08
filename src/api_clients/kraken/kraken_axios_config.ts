import { AxiosRequestConfig } from 'axios'
import { baseAxiosConfig } from '../../base_axios_config'
import { PublicEndpoint, PrivateEndpoint } from './api_endpoints'

export interface KrakenPublicAxiosRequest extends AxiosRequestConfig {
    url: PublicEndpoint;
}

export interface KrakenPrivateAxiosRequest extends AxiosRequestConfig {
    url: PrivateEndpoint;
}

export const apiVersion = '0'
export const krakenAxiosConfig: AxiosRequestConfig = {
    ...baseAxiosConfig,
    baseURL: `https://api.kraken.com/${apiVersion}`,
    method: 'POST',
}
