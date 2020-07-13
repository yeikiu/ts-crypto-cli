import { createStream } from 'rotating-file-stream'
import { resolve } from 'path'
import * as moment from 'moment'
import { stringify } from 'qs'
import debugHelper from './util/debug_helper'
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const { logError } = debugHelper(__filename)

const baseAxiosConfig = {
    timeout: 10000,
    headers: {
        'User-Agent': 'ts-crypto-cli',
        'content-type': 'application/x-www-form-urlencoded',
    }
}

const { TS_CRYPTO_CLI_LOGS_PATH } = process.env
const dirPath = TS_CRYPTO_CLI_LOGS_PATH ? resolve(TS_CRYPTO_CLI_LOGS_PATH) : null

// Rotating filenames
const calculateFileName = (date: Date, index: number): string => {
    const fileName = `ts-crypto-cli_${moment().utc().format('YYYY_MMM')}`
    if (!date) return `${fileName}.csv`
    return `${fileName}_${index}.csv`
}

const stream = dirPath ? createStream(calculateFileName, {
    size: "100M", // rotate every 10 MegaBytes written
    interval: "1M", // rotate monthly
    path: dirPath,
    immutable: true,
    // compress: "gzip" // compress rotated files
}) : null;

const baseAxiosRequestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (['PUT', 'POST', 'PATCH'].includes(config.method.toUpperCase())) {
        delete config.params
        config.data = stringify(config.data)
    } else {
        delete config.data
    }
    const { method, baseURL, url, params = '-', data = '-' } = config
    if (stream) stream.write(`\n${moment().utc().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}${baseURL.endsWith('/') || url.startsWith('/') ? '' : '/'}${url}; ${params}; ${data}; -; -; -`)
    return config
}

const baseAxiosResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
    const { config: { method, baseURL, url, params = '-' }, status = null, statusText = '-', data = '-' } = response
    if (stream) stream.write(`\n${moment().utc().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}${baseURL.endsWith('/') || url.startsWith('/') ? '' : '/'}${url}; ${params}; ${typeof data}; ${status}; ${statusText}; -`)
    return response
}

const baseAxiosRequestErrorInterceptor = (axiosRequestError: AxiosError): void => {
    const { config: { method, baseURL, url, params = '-', data = '-' }, code = '-', response: { status = null, statusText = '-' } = {} } = axiosRequestError
    if (stream) stream.write(`\n${moment().utc().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}${baseURL.endsWith('/') || url.startsWith('/') ? '' : '/'}${url}; ${params}; ${JSON.stringify(data)}; ${status}; ${statusText}; ${code}`)
    logError({ axiosRequestError })
}

const baseAxiosResponseErrorInterceptor = (axiosResponseError: AxiosError): void => {
    const { config: { method, baseURL, url, params = '-', data = '-' }, code = '-', response: { status = null, statusText = '-' } = {} } = axiosResponseError
    if (stream) stream.write(`\n${moment().utc().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}${baseURL.endsWith('/') || url.startsWith('/') ? '' : '/'}${url}; ${params}; ${typeof data}; ${status}; ${statusText}; ${code}`)
    logError({ axiosResponseError })
}

export {
    baseAxiosConfig,
    baseAxiosRequestInterceptor,
    baseAxiosRequestErrorInterceptor,
    baseAxiosResponseInterceptor,
    baseAxiosResponseErrorInterceptor,
}
