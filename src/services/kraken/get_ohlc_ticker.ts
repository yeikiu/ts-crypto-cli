import { krakenPublicApiRequest } from "../../api_clients/kraken/public_api_request"
import { stdOHLC } from "../../types/standard_ohlc"

const getKrakenOHLCTicker = async (pair: string): Promise<stdOHLC> => {
    const ticker = await krakenPublicApiRequest({ url: 'Ticker', data: { pair }})
    const [assetKey,] = Object.keys(ticker)
    const { o: open, h: [high,], l: [low,], h: [close,] } = ticker[assetKey]

    return {
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
    }
}

export { getKrakenOHLCTicker }
