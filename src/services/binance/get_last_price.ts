import { binancePublicApiRequest } from "../../api_clients/binance/public_api_request"

export const getBinanceLastPrice = async (symbol: string): Promise<number> => {
    const { price } = await binancePublicApiRequest({ url: 'api/v3/ticker/price', params: { symbol }})    
    return Number(price)
}
