type HitBTCBalanceItem = {
    currency: string;
    available: string;
}
type BinanceBalanceItem = {
    asset: string;
    free: string;
}
type KrakenBalanceItems = { [asset: string]: string }

export type StandardBalanceItem = {
    asset: string;
    balance: string;
}

export const filterBalances = (balancesArr: (HitBTCBalanceItem & BinanceBalanceItem)[], outputFilterFn = ({ balance }: StandardBalanceItem): boolean => Number(balance) > 0): StandardBalanceItem[] => balancesArr
        .map(({ asset, currency, available, free }) => ({
            asset: asset || currency,
            balance: available || free
        })).filter(outputFilterFn)

export const filterKrakenBalances = (krakenBalancesObj: KrakenBalanceItems, outputFilterFn = ({ balance }: StandardBalanceItem): boolean => Number(balance) > 0): StandardBalanceItem[] => Object.keys(krakenBalancesObj)
    .map(asset => ({
        asset,
        balance: krakenBalancesObj[asset]
    })).filter(outputFilterFn)
