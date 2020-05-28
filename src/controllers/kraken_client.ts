import axios, { AxiosInstance, AxiosResponse } from 'axios';
import getMessageSignature from '../util/message_signature';
import { PublicMethod, PrivateMethod } from '../models/api_methods';

import * as qs from 'qs';

const krakenBaseUrl = 'https://api.kraken.com';
const apiVersion = '0';
const timeout = 10000;
const method = 'POST';
const headers = {
  'User-Agent': 'ts-kraken-api',
  'content-type': 'application/x-www-form-urlencoded',
};

const publicClient: AxiosInstance = axios.create({
  baseURL: `${krakenBaseUrl}/${apiVersion}/public`,
  method,
  headers,
  timeout,
});

publicClient.interceptors.request.use((config) => {
  config.data = qs.stringify(config.data);
  return config;
}, (error) =>
  // Do something with request error
  Promise.reject(error)
);

const privateClient: AxiosInstance = axios.create({
  baseURL: `${krakenBaseUrl}/${apiVersion}/private`,
  method,
  headers: {
    ...headers,
    'API-Key': process.env.KRAKEN_API_KEY,
  },
  timeout,
});

privateClient.interceptors.request.use((config) => {
  const { url } = config;
  const nonce = new Date().getTime() * 1000;
  config.data = {
    ...config.data,
    nonce,
  };
  config.headers['API-Sign'] = getMessageSignature(`/${apiVersion}/private/${url}`, config.data);
  config.data = qs.stringify(config.data);
  return config;
}, (error) =>
  // Do something with request error
  Promise.reject(error)
);

const publicRequest = (url: PublicMethod, data: unknown = {}): Promise<AxiosResponse> => publicClient.request({ url, data });
const privateRequest = (url: PrivateMethod, data: unknown = {}): Promise<AxiosResponse> => privateClient.request({ url, data });

export const KrakenClient = {
  publicRequest,
  privateRequest,
};
