export type HitBTCBalanceItem = {
    currency: string;
    available: string;
}

export type BinanceBalanceItem = {
    asset: string;
    free: string;
}

export type KrakenBalanceItems = { [asset: string]: string }

export type StandardBalanceItem = {
    asset: string;
    balance: string;
}

export const filterBinanceBalances = (balancesArr: BinanceBalanceItem[], outputFilterFn = ({ balance }: StandardBalanceItem): boolean => Number(balance) > 0): StandardBalanceItem[] => balancesArr
    .map(({ asset, free: balance}) => ({ asset, balance}))
    .filter(outputFilterFn)

export const filterHitBTCBalances = (balancesArr: HitBTCBalanceItem[], outputFilterFn = ({ balance }: StandardBalanceItem): boolean => Number(balance) > 0): StandardBalanceItem[] => balancesArr
    .map(({ currency: asset, available: balance}) => ({ asset, balance}))
    .filter(outputFilterFn)

export const filterKrakenBalances = (krakenBalancesObj: KrakenBalanceItems, outputFilterFn = ({ balance }: StandardBalanceItem): boolean => Number(balance) > 0): StandardBalanceItem[] => Object.keys(krakenBalancesObj)
    .map(asset => ({
        asset,
        balance: krakenBalancesObj[asset]
    })).filter(outputFilterFn)
