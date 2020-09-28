# ts-crypto-cli

## Unreleased (develop)

### 0.8.0

#### features:

- Added methods to easily get different prices streams

    * `getKrakenTickerStream(pair: string): Observable<StandardTicker>`
    * `getBinanceTickerStream(pair: string): Observable<StandardTicker>`
    * `getHitBTCTickerStream(pair: string): Observable<StandardTicker>`

#### refactor:

- Moment.js replaced for Vanilla UTC Date timestamps

---

## Released (master)

### 0.7.5

#### chore:

- started tracking changes
