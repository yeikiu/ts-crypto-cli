#!/usr/bin/env node
'use strict'

import * as dotenv from 'dotenv'
dotenv.config()

import { readFileSync } from 'fs'
import { resolve } from 'path'

import debugHelper from './util/debug_helper'
const { print } = debugHelper(__filename)

const [,arg1, arg2] = process.argv
const argsStr = [arg1, arg2].join(' ')
const { name, version } = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json')).toString())

if (/\s-v\s*$/.test(argsStr)) {
  console.log(`    ${name} v${version} ✔️`)
  process.exit()
}

import * as nodeMenu from 'node-menu'

import { krakenPrivateApiRequest, updateKrakenDefaultClient } from './api_clients/kraken/private_api_request'
import { hitbtcPrivateApiRequest, updateHitBTCDefaultClient } from './api_clients/hitbtc/private_api_request'
import { binancePrivateApiRequest, updateBinanceDefaultClient } from './api_clients/binance/private_api_request'

import { getBinancePriceTicker } from './services/binance/get_binance_price_ticker'
import { getBinanceOHLCCandles } from './services/binance/get_binance_ohlc_candles'
import { getKrakenPriceTicker } from './services/kraken/get_kraken_price_ticker'
import { getKrakenOHLCCandles } from './services/kraken/get_kraken_ohlc_candles'
import { getHitBTCPriceTicker } from './services/hitbtc/get_hitbtc_price_ticker'
import { getHitBTCOHLCCandles } from './services/hitbtc/get_hitbtc_ohlc_candles'

import { filterKrakenBalances, filterHitBTCBalances, filterBinanceBalances } from './util/filter_balances'
import handleUserInput from './util/handle_user_input'
import { Method } from 'axios'

nodeMenu
  .customHeader(() => {
    process.stdout.write(`                              <<<<<<     TS-CRYPTO-CLI v${version}     >>>>>>\n`)
  })

  .addDelimiter('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    Kraken API | https://www.kraken.com/features/api#general-usage \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { const [endpoint, params] = input.split(' '); handleUserInput(endpoint, 'POST', 'kraken', 'public', params) }, null, [{ name: 'endpoint params"  -->  i.e.  1 "Ticker pair=XBTUSDT', type: 'string' }])
  .addItem('Get Last OHLC candle', async (symbol: string) => { print((await getKrakenOHLCCandles(symbol))[0]) }, null, [{ name: 'symbol"  -->  i.e.  2 "XBTUSDT', type: 'string' }])
  .addItem('Get price ticker', async (symbol: string) => { print(await getKrakenPriceTicker(symbol)) }, null, [{ name: 'symbol"  -->  i.e.  3 "XBTUSDT', type: 'string' }])
  .addDelimiter(' ', 1)
  .addItem('PRIVATE API request', (input: string) => { const [endpoint, params] = input.split(' '); handleUserInput(endpoint, 'POST', 'kraken', 'private', params) }, null, [{ name: 'endpoint params"  -->  i.e.  4 "DepositMethods asset=XBT', type: 'string' }])
  .addItem('Load Kraken API credentials', (input: string) => { const [k, s] = input.split(' '); process.env.KRAKEN_API_KEY = k; process.env.KRAKEN_API_SECRET = s; updateKrakenDefaultClient(k, s) }, null, [{ name: 'API Key API Secret  -->  i.e.  5 "YOUR-KEY YOUR-SECRET', type: 'string' }])
  .addItem('Show Kraken API credentials in use', () => { print({apiKey: process.env.KRAKEN_API_KEY, apiSecret: process.env.KRAKEN_API_SECRET}) })
  .addItem('Show Balances', async () => { print(filterKrakenBalances(await krakenPrivateApiRequest({ url: 'Balance' }))) })
  .addItem('BUY @ market', async (input: string) => {  const [pair, volume] = input.split(' '); print(await krakenPrivateApiRequest({ url: 'AddOrder', data: { pair, type: 'buy', ordertype: 'market', volume } })) }, null, [{ name: 'pair amount"  -->  i.e.  8 "XBTUSDT 0.001', type: 'string' }])
  .addItem('SELL @ market', async (input: string) => {  const [pair, volume] = input.split(' '); print(await krakenPrivateApiRequest({ url: 'AddOrder', data: { pair, type: 'sell', ordertype: 'market', volume } })) }, null, [{ name: 'pair amount"  -->  i.e.  9 "XBTUSDT 0.001', type: 'string' }])

  .addDelimiter('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    HitBTC API | https://api.hitbtc.com/#rest-api-reference \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { const [method, endpoint, params] = input.split(' '); handleUserInput(endpoint, method as Method, 'hitbtc', 'public', params) }, null, [{ name: 'endpoint params"  -->  i.e.  10 "GET currency currencies=BTC,USD', type: 'string' }])
  .addItem('Get Last OHLC candle', async (symbol: string) => { print((await getHitBTCOHLCCandles(symbol))[0]) }, null, [{ name: 'symbol"  -->  i.e.  11 "BTCUSD', type: 'string' }])
  .addItem('Get price ticker', async (symbol: string) => { print(await getHitBTCPriceTicker(symbol)) }, null, [{ name: 'symbol"  -->  i.e.  12 "BTCUSD', type: 'string' }])
  .addDelimiter(' ', 1)
  .addItem('PRIVATE API request', (input: string) => { const [method, endpoint, params] = input.split(' '); handleUserInput(endpoint, method as Method, 'hitbtc', 'private', params) }, null, [{ name: 'endpoint params"  -->  i.e.  13 "GET account/transactions currency=BTC', type: 'string' }])
  .addItem('Load HitBTC API credentials', (input: string) => { const [k, s] = input.split(' '); process.env.HITBTC_API_KEY = k; process.env.HITBTC_API_SECRET = s; updateHitBTCDefaultClient(k, s) }, null, [{ name: 'API Key API Secret  -->  i.e.  14 "YOUR-KEY YOUR-SECRET', type: 'string' }])
  .addItem('Show HitBTC API credentials in use', () => { print({apiKey: process.env.HITBTC_API_KEY, apiSecret: process.env.HITBTC_API_SECRET}) })
  .addItem('Show ACCOUNT Balances', async () => { print(filterHitBTCBalances(await hitbtcPrivateApiRequest({ url: 'account/balance' }))) })
  .addItem('Show TRADING Balances', async () => { print(filterHitBTCBalances(await hitbtcPrivateApiRequest({ url: 'trading/balance' }))) })
  .addItem('BUY @ market', async (input: string) => {  const [symbol, quantity] = input.split(' '); print(await hitbtcPrivateApiRequest({ url: 'order', method: 'POST', data: { symbol, side: 'buy', type: 'market', quantity } })) }, null, [{ name: 'symbol quantity"  -->  i.e.  18 "BTCUSD 0.0015', type: 'string' }])
  .addItem('SELL @ market', async (input: string) => {  const [symbol, quantity] = input.split(' '); print(await hitbtcPrivateApiRequest({ url: 'order', method: 'POST', data: { symbol, side: 'sell', type: 'market', quantity } })) }, null, [{ name: 'symbol quantity"  -->  i.e.  19 "BTCUSD 0.0015', type: 'string' }])

  .addDelimiter('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    Binance API | https://binance-docs.github.io/apidocs/spot/en/#general-api-information \n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { const [method, endpoint, params] = input.split(' '); handleUserInput(endpoint, method as Method, 'binance', 'public', params) }, null, [{ name: 'endpoint params"  -->  i.e.  20 "GET api/v3/avgPrice symbol=BTCUSDT', type: 'string' }])
  .addItem('Get Last OHLC candle', async (symbol: string) => { print((await getBinanceOHLCCandles(symbol))[0]) }, null, [{ name: 'symbol"  -->  i.e.  21 "BTCUSDT', type: 'string' }])
  .addItem('Get price ticker', async (symbol: string) => { print(await getBinancePriceTicker(symbol)) }, null, [{ name: 'symbol"  -->  i.e.  22 "BTCUSDT', type: 'string' }])
  .addDelimiter(' ', 1)
  .addItem('PRIVATE API request', (input: string) => { const [method, endpoint, params] = input.split(' '); handleUserInput(endpoint, method as Method, 'binance', 'private', params) }, null, [{ name: 'endpoint params"  -->  i.e.  23 "GET api/v3/allOrders symbol=BTCUSDT&limit=100', type: 'string' }])
  .addItem('Load Binance API credentials', (input: string) => { const [k, s] = input.split(' '); process.env.BINANCE_API_KEY = k; process.env.BINANCE_API_SECRET = s; updateBinanceDefaultClient(k, s) }, null, [{ name: 'API Key API Secret  -->  i.e.  24 "YOUR-KEY YOUR-SECRET', type: 'string' }])
  .addItem('Show Binance API credentials in use', () => { print({apiKey: process.env.BINANCE_API_KEY, apiSecret: process.env.BINANCE_API_SECRET}) })
  .addItem('Show Balances', async () => { print(filterBinanceBalances((await binancePrivateApiRequest({ url: 'api/v3/account' })).balances)) })
  .addItem('BUY @ market', async (input: string) => {  const [symbol, quantity] = input.split(' '); print(await binancePrivateApiRequest({ url: 'api/v3/order', method: 'POST', data: { symbol, side: 'buy', type: 'market', quantity } })) }, null, [{ name: 'symbol quantity"  -->  i.e.  27 "BTCUSDT 0.0015', type: 'string' }])
  .addItem('SELL @ market', async (input: string) => {  const [symbol, quantity] = input.split(' '); print(await binancePrivateApiRequest({ url: 'api/v3/order', method: 'POST', data: { symbol, side: 'sell', type: 'market', quantity } })) }, null, [{ name: 'symbol quantity"  -->  i.e.  28 "BTCUSDT 0.0015', type: 'string' }])

  .addDelimiter(' ', 1)
  .customPrompt(() => {
    process.stdout.write('\n\nEnter your selection:\n')
  })
  .continueCallback(() => {
    // Runs between 'Press enter to continue' and the new menu render
  })
  .start()
