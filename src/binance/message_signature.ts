import { createHmac } from 'crypto'
import { stringify } from 'qs'

// Create a signature for a request
export const getBinanceMessageSignature = (params): string => createHmac('sha256', process.env.BINANCE_SECRET_KEY)
    .update(stringify(params))
    .digest('hex');