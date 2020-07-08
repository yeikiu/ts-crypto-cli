import { createHmac } from 'crypto'
import { stringify } from 'qs'

// Create a signature for a request
export const getBinanceMessageSignature = (params: any, apiSecret: string): string => createHmac('sha256', apiSecret)
    .update(stringify(params))
    .digest('hex');