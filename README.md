<img src=".ci_badges/npm-version-badge.svg" /> <img src=".ci_badges/npm-dependencies-badge.svg" /> <img src=".ci_badges/npm-devdependencies-badge.svg" />

# TS Crypto Cli

> A handy npm to operate against some of the most known Crypto Exchanges

## Environment Variables

```
# Each REST request/response is recorded to a log file
TS_CRYPTO_CLI_LOGS_PATH=D:\DESKTOP\ts-crypto-cli_logs

KRAKEN_API_KEY=<...>
KRAKEN_API_SECRET=<...>

HITBTC_API_KEY=<...>
HITBTC_SECRET_KEY=<...>

BINANCE_API_KEY=<...>
BINANCE_SECRET_KEY=<...>
```

## Use it as a library

- `yarn add ts-crypto-cli`

### REST APIs

- [Kraken Public](https://yeikiu.github.io/ts-crypto-cli/modules/_kraken_public_api_request_.html)
- [Kraken Private](https://yeikiu.github.io/ts-crypto-cli/modules/_kraken_private_api_request_.html)
- [HitBTC Public](https://yeikiu.github.io/ts-crypto-cli/modules/_hitbtc_public_api_request_.html)
- [HitBTC Private](https://yeikiu.github.io/ts-crypto-cli/modules/_hitbtc_private_api_request_.html)
- [Binance Public](https://yeikiu.github.io/ts-crypto-cli/modules/_binance_public_api_request_.html)
- [Binance Private](https://yeikiu.github.io/ts-crypto-cli/modules/_binance_private_api_request_.html)

### WS APIs

- [Kraken Public](https://yeikiu.github.io/ts-crypto-cli/modules/_kraken_public_ws_handler_.html)
- [Kraken Private](https://yeikiu.github.io/ts-crypto-cli/modules/_kraken_private_ws_handler_.html)
- [HitBTC Public](https://yeikiu.github.io/ts-crypto-cli/modules/_hitbtc_public_ws_handler_.html)
- [HitBTC Private](https://yeikiu.github.io/ts-crypto-cli/modules/_hitbtc_private_ws_handler_.html)
- [Binance Public](https://yeikiu.github.io/ts-crypto-cli/modules/_binance_public_ws_handler_.html)
- Binance Private (TODO, WIP)

#### Demo

Here is a little handler to perform a 2-steps withdrawal from Kraken in 20 lines of code using the lib.

```typescript
import { krakenPrivateApiRequest } from 'ts-crypto-cli';

const krakenWithdrawAsset = async (asset: string, key: string, withdrawAmount: number): Promise<void> => {

  const withdrawInfo = await krakenPrivateApiRequest({ url: 'WithdrawInfo', data: {
      asset,
      key,
      amount: withdrawAmount
  }})

  const { limit } = withdrawInfo

  if (Number(limit) < Number(withdrawAmount)) {
    throw new Error(`Can´t withdraw ${withdrawAmount} ${asset}. Max. available ${limit}`)
  }

  krakenPrivateApiRequest({ url: 'Withdraw', data: {
    asset,
    key,
    amount: withdrawAmount
  }})
};

export {
  krakenWithdrawAsset
}
```

---

## Launch the REPL cli on a shell

- `yarn global add ts-crypto-cli` (setup globally)

- `npx crypto-cli` (you can pass -v to simply display installed version)

### Inject your keys/secrets to enable private methods

#### Powershell (windows)

- `$env:KRAKEN_API_KEY="<...>" ; $env:KRAKEN_API_SECRET="<...>" ; $env:HITBTC_API_KEY="<...>" ; etc... ; npx crypto-cli`

#### cmd (windows)

- `set KRAKEN_API_KEY=<...> & set KRAKEN_API_SECRET=<...> & set HITBTC_API_KEY=<...> $ etc... & npx crypto-cli`

#### Unix/OSx

- `KRAKEN_API_KEY=<...> KRAKEN_API_SECRET=<...> HITBTC_API_KEY=<...> npx crypto-cli`
