import { krakenPublicApiRequest } from "../../api_clients/kraken/public_api_request"

export const getKrakenLastPrice = async (pair: string): Promise<number> => {
    const ticker = await krakenPublicApiRequest({ url: 'Ticker', data: { pair }})
    const [assetKey,] = Object.keys(ticker)
    const { /* o: open, h: [high,], l: [low,],  */c: [close,] } = ticker[assetKey]

    return Number(close)
}
