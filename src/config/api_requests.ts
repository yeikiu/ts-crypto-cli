import { Method } from 'axios'

const method: Method = 'POST'

const apiRequestsConfig = {
    krakenBaseUrl: 'https://api.kraken.com',
    apiVersion: '0',
    timeout: 10000,
    method,
    headers: {
        'User-Agent': 'ts-kraken-api',
        'content-type': 'application/x-www-form-urlencoded',
    },
}

export default apiRequestsConfig