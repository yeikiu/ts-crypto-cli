import debugHelper from './../util/debug_helper'
const { print } = debugHelper(__filename)

type HitBTCBalanceItem = {
  // HitBTC
  currency: string;
  available: string;
}
type BinanceBalanceItem = {
  // binance
  asset: string;
  free: string;
}
type StandardBalanceItem = HitBTCBalanceItem & BinanceBalanceItem

const filterBalances = (balancesArr: StandardBalanceItem[]): StandardBalanceItem[] => {
  const balances = balancesArr.filter(({ available, free }) => Number(available || free) > 0)
  print({ balances })
  return balances
}

export default filterBalances
