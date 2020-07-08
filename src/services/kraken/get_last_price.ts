import { getKrakenLastOHLCCandle } from "./get_last_ohlc_candle"

export const getKrakenLastPrice = async (pair: string): Promise<number> => {
    const { close } = await getKrakenLastOHLCCandle(pair)
    return close
}
