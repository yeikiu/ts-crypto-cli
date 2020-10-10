# ts-crypto-cli

> All major changes will be added to this file top-to-bottom

- ### v0.8.13

    - #### features:

    - Added `getKrakenTradesHistory` method
    - Added `getBinanceOpenOrdersStream` method


- ### v0.8.8

    - #### features:

        - Added `getKrakenOpenOrdersStream` method


- ### v0.8.7

    - #### features:

        - Added optional `InjectedApiKeys` to methods for easier multi-account interaction


- ### v0.8.3

    - #### features:

        - Added methods to easily get different prices streams

            * `getKrakenTickerStream(pair: string): Observable<StandardTicker>`
            * `getBinanceTickerStream(pair: string): Observable<StandardTicker>`
            * `getHitBTCTickerStream(pair: string): Observable<StandardTicker>`

    - #### refactor:

        - Moment.js replaced for Vanilla UTC Date timestamps


- ### v0.7.5

    - #### chore:

        - started tracking changes
