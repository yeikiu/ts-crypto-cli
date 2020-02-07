import axios, { AxiosInstance,  AxiosResponse } from 'axios';
import qs = require('qs');
import getMessageSignature from '../util/message_signature';
import { PublicMethod, PrivateMethod } from '../models/api_methods';

const krakenBaseUrl = 'https://api.kraken.com';
const apiVersion = '0';
const timeout = 10000;
const method = 'POST';
const headers = {
    'User-Agent': 'ts-kraken-api',
    'content-type': 'application/x-www-form-urlencoded'
};

const publicClient: AxiosInstance = axios.create({
    baseURL: `${krakenBaseUrl}/${apiVersion}/public`,
    method,
    headers,
    timeout,
});

publicClient.interceptors.request.use(function (config) {
    const nonce = new Date().getTime() * 1000;
    config.data = {
        ...config.data,
        nonce, 
    };
    config.data = qs.stringify(config.data);
    return config;

}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const privateClient: AxiosInstance = axios.create({
    baseURL: `${krakenBaseUrl}/${apiVersion}/private`,
    method,
    headers: {
        ...headers,
        'API-Key': process.env.KRAKEN_API_KEY
    },
    timeout,
});

privateClient.interceptors.request.use(function (config) {
    const { url } = config;
    const nonce = new Date().getTime() * 1000;
    config.data = {
        ...config.data,
        nonce, 
    };
    config.headers['API-Sign'] = getMessageSignature(`/${apiVersion}/private/${url}`, config.data);
    config.data = qs.stringify(config.data);
    return config;

}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const publicRequest = (url: PublicMethod, data: any = {}): Promise<AxiosResponse> => publicClient.request({url, data})
const privateRequest = (url: PrivateMethod, data: any = {}): Promise<AxiosResponse> => privateClient.request({url, data})

export const KrakenClient = {
    publicRequest,
    privateRequest,
}