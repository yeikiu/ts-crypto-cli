import { hitbtcPublicApiRequest } from "../../api_clients/hitbtc/public_api_request"

export const getHitBTCLastPrice = async (symbols: string): Promise<number> => {
    const ticker = await hitbtcPublicApiRequest({ url: 'ticker', params: { symbols }})
    const { last: close } = ticker.find(({ symbol }) => symbol === symbols )
    
    return Number(close)
}
