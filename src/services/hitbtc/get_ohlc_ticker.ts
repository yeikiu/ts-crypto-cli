import { stdOHLC } from "../../types/standard_ohlc"
import { hitbtcPublicApiRequest } from "../../api_clients/hitbtc/public_api_request"

const getHitBTCOHLCTicker = async (symbols: string): Promise<stdOHLC> => {
    const ticker = await hitbtcPublicApiRequest({ url: 'ticker', params: { symbols }})
    const { open, high, low, last: close } = ticker.find(({ symbol }) => symbol === symbols )
    
    return {
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
    }
}

export { getHitBTCOHLCTicker }
