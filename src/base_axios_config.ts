import { createStream } from 'rotating-file-stream'
import { resolve, join } from 'path'
import * as moment from 'moment'
import { stringify } from 'qs'
import * as firstline from 'firstline'
import debugHelper from './util/debug_helper'
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { writeFileSync } from 'fs'

const { debug, logError } = debugHelper(__filename)

const baseAxiosConfig = {
    timeout: 10000,
    headers: {
        'User-Agent': 'ts-crypto-cli',
        'content-type': 'application/x-www-form-urlencoded',
    }
}

const { TS_CRYPTO_CLI_LOGS_PATH = resolve(__dirname, '..', '.logs') } = process.env
const dirPath = resolve(TS_CRYPTO_CLI_LOGS_PATH)

// Rotating filenames
const calculateFileName = (date: Date, index: number): string => {
    const fileName = `ts-crypto-cli_${moment().format('YYYY_DD_MMM')}`

    if (!date) return `${fileName}.csv`

    const finalLogName = `${fileName}_${index}.csv`

    const finalLogPath = join(dirPath, finalLogName)
    firstline(finalLogPath).then(() => {
        debug(`Using existing log file series @ ${finalLogPath} ... _<N>.csv`)
    }).catch(() => {
        writeFileSync(finalLogPath, 'time; method; endpoint; params; data; status; status_text; error_code')
        debug(`Log file created @ ${finalLogPath}`)
    })

    return finalLogName
}

const stream = createStream(calculateFileName, {
    size: "100M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    path: dirPath,
    immutable: true,
    // compress: "gzip" // compress rotated files
});

const baseAxiosRequestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (['PUT', 'POST', 'PATCH'].includes(config.method.toUpperCase())) {
        delete config.params
        config.data = stringify(config.data)
    } else {
        delete config.data
    }
    const { method, baseURL, url, params = '-', data = '-' } = config
    stream.write(`\n${moment().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}/${url}; ${params}; ${data}; -; -; -`)
    return config
}

const baseAxiosResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
    const { config: { method, baseURL, url, params = '-' }, status, statusText = '-', data = '-' } = response
    stream.write(`\n${moment().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}/${url}; ${params}; ${typeof data}; ${status}; ${statusText}; -`)
    return response
}

const baseAxiosRequestErrorInterceptor = (axiosRequestError: AxiosError): void => {
    const { config: { method, baseURL, url, params = '-', data = '-' }, code = '-', response: { status, statusText = '-' } } = axiosRequestError
    stream.write(`\n${moment().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}/${url}; ${params}; ${JSON.stringify(data)}; ${status}; ${statusText}; ${code}`)
    logError({ axiosRequestError })
    throw axiosRequestError
}

const baseAxiosResponseErrorInterceptor = (axiosResponseError: AxiosError): void => {
    const { config: { method, baseURL, url, params = '-', data = '-' }, code = '-', response: { status, statusText = '-' } } = axiosResponseError
    stream.write(`\n${moment().format('DD MMM YYYY HH:mm:ss')}; ${method.toUpperCase()}; ${baseURL}/${url}; ${params}; ${typeof data}; ${status}; ${statusText}; ${code}`)
    logError({ axiosResponseError })
    throw axiosResponseError
}

export {
    baseAxiosConfig,
    baseAxiosRequestInterceptor,
    baseAxiosRequestErrorInterceptor,
    baseAxiosResponseInterceptor,
    baseAxiosResponseErrorInterceptor,
}
