<img src=".ci_badges/npm-version-badge.svg" /> <img src=".ci_badges/npm-dependencies-badge.svg" /> <img src=".ci_badges/npm-devdependencies-badge.svg" />

# 🚨 This package has been deprecated

> This package is no longer supported. If you are still interested in a good cli/lib to operate on Kraken we recommend you check the ts-kraken project: https://github.com/yeikiu/ts-kraken

---

# TS Crypto Cli

> A handy npm to operate against some of the most known Crypto Exchanges

- *NEW:* Test it online on the [npm Interactive Playground Demo](https://runkit.com/yeikiu/5f728aa574e29b001b4259d1)

# Option 1 - Use it as a library

- `npm i ts-crypto-cli`

### Library usage demo

> Here is a little handler to perform a safe withdrawal from Kraken in <20 lines of code using the lib.

```typescript
import { krakenPrivateApiRequest } from 'ts-crypto-cli'

const krakenWithdrawAsset = async (asset: string, key: string, withdrawAmount: number): Promise<unknown> => {
  const withdrawInfo = await krakenPrivateApiRequest({ url: 'WithdrawInfo', data: {
      asset,
      key,
      amount: withdrawAmount
  }})

  const { limit } = withdrawInfo

  if (Number(limit) < Number(withdrawAmount)) {
    throw new Error(`Can´t withdraw ${withdrawAmount} ${asset}. Max. available ${limit}`)
  }

  return krakenPrivateApiRequest({ url: 'Withdraw', data: {
    asset,
    key,
    amount: withdrawAmount
  }})
}

export {
  krakenWithdrawAsset
}
```

# Option 2 - Launch the REPL cli on a shell

<img src=".github/menu_demo.png" />

---

## Option 2.1 - Provide a .env file

> Create a .env file under current working directory with your own API credentials and run

- `npx ts-crypto-cli`

### Environment Variables

```
##
# Each REST request/response can be optionally recorded to a log file if you set a path here
##
#TS_CRYPTO_CLI_LOGS_PATH=./ts_crypto_cli_logs

KRAKEN_API_KEY=<...>
KRAKEN_API_SECRET=<...>

HITBTC_API_KEY=<...>
HITBTC_API_SECRET=<...>

BINANCE_API_KEY=<...>
BINANCE_API_SECRET=<...>

##
# DEV only
##
#DEBUG=ts-crypto-cli:*
```


## Option 2.2 - Inject your keys/secrets to enable private methods

> This method is more secure as you won't need to persist the KEYS to a file

### Powershell (windows)

- `$env:KRAKEN_API_KEY="<...>" ; $env:KRAKEN_API_SECRET="<...>" ; $env:HITBTC_API_KEY="<...>" ; etc... ; npx ts-crypto-cli`

### cmd (windows)

- `set KRAKEN_API_KEY=<...> & set KRAKEN_API_SECRET=<...> & set HITBTC_API_KEY=<...> & etc... & npx ts-crypto-cli`

### Unix/OSx

- `KRAKEN_API_KEY=<...> KRAKEN_API_SECRET=<...> HITBTC_API_KEY=<...> etc.. npx ts-crypto-cli`


# [Documentation](https://yeikiu.github.io/ts-crypto-cli/)

### Handling multiple API credentials

You can use different API keys/secrets against the same exchange. Generate the new API client instances with one of the following methods:

- `createKrakenPrivateApiClient`
- `createHitBTCPrivateApiClient`
- `createBinancePrivateApiClient`
