<img src=".ci_badges/npm-version-badge.svg" /> <img src=".ci_badges/npm-dependencies-badge.svg" /> <img src=".ci_badges/npm-devdependencies-badge.svg" />

# TS Kraken API

> TypeScript kraken.com API client library for NodeJS

This is an asynchronous NodeJS client for the kraken.com API.

It exposes all the API methods found here: https://www.kraken.com/help/api through 2 separated exported modules: `KrakenClient.publicRequest` and `KrakenClient.privateRequest`

## Installation
  `yarn add ts-kraken-api` OR `npm i ts-kraken-api`

## Usage

Generated [typedoc](https://www.npmjs.com/package/typedoc) available [here](https://yeikiu.github.io/ts-kraken-api/)

## TLDR;

### Public method's

```typescript
import { publicApiRequest, KrakenPair, getPublicObservableFromWS } from 'ts-kraken-api';

// Get last BTC/USD ticker
const pair: KrakenPair = 'XXBTZUSD';

(async () => {
  const { pair: pairTicker } = await publicApiRequest('Ticker', { pair });
  console.log({ pairTicker });
})();

// Listen to a WS ping subscription
const pingObservable$ = getPublicObservableFromWS(
    { event: "ping" },
    null,
    ({ event = null }) => event === 'pong'
)
pingObservable$.subscribe((pingData: any) => {
    console.log({ pingData })
})
```


### Private method's

```typescript
import { privateApiRequest } from 'ts-kraken-api';

// environment vars (you can use a .env file)
process.env.KRAKEN_API_KEY = 'YOUR_API_KEY';
process.env.KRAKEN_API_SECRET = 'YOUR_API_SECRET';

// Get current Kraken account Balance
(async () => {
  const balances = await privateApiRequest('Balance');
  console.log({ balances });
})();

// Listen to a WS openOrders subscription
const { privateObservable$: openOrdersObservable$, token }= await getPrivateObservableFromWS(
    null,
    'subscription',
    {
        event: "subscribe",
        subscription: {
            name: "openOrders",
        }
    },
    null,
    (data: any[]) => Array.isArray(data) && data.slice(-1).includes('openOrders')
)

openOrdersObservable$.subscribe(async ([freshOpenOrders = [],]) => {
    console.log({ freshOpenOrders })
})
```


## Credits

Thanks to @nothingisdead, I used his JS client as a base repo https://github.com/nothingisdead/npm-kraken-api 
