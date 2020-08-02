#!/usr/bin/env node
'use strict';
import * as dotenv from "dotenv";
dotenv.config();

import { readFileSync } from 'fs'
import { resolve } from 'path'

import debugHelper from './util/debug_helper'
const { print, logError } = debugHelper(__filename)

const [,,arg1, arg2] = process.argv
const argsStr = [arg1, arg2].join(' ')

if (/\s-v(?:\s|$)/.test(argsStr)) {
    try {
      const { name, version } = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json')).toString());
      console.log(`    ${name} v${version} ✔️`);
    } catch (error) {
      logError({ error })
    }
    process.exit()
}

import { krakenPrivateApiRequest } from './api_clients/kraken/private_api_request'
import { hitbtcPrivateApiRequest } from './api_clients/hitbtc/private_api_request'
import { binancePrivateApiRequest } from './api_clients/binance/private_api_request'
import * as nodeMenu from 'node-menu'
import { filterKrakenBalances, filterBalances } from './util/filter_balances';
import handleUserInput from './util/handle_user_input';

import { getHitBTCPriceTicker } from './services/hitbtc/get_hitbtc_price_ticker';
import { getBinancePriceTicker } from './services/binance/get_binance_price_ticker';
import { getKrakenPriceTicker } from './services/kraken/get_kraken_price_ticker';
import { getKrakenOHLCCandles } from "./services/kraken/get_kraken_ohlc_candles";
import { getHitBTCOHLCCandles, getBinanceOHLCCandles } from ".";

const pkgPath = resolve(__dirname, '..', 'package.json');
const { version } = JSON.parse(readFileSync(pkgPath).toString())

nodeMenu
  .customHeader(() => {
    process.stdout.write(`                              <<<<<<     TS-CRYPTO-CLI v${version}     >>>>>>\n\n`);
  })

  .addDelimiter('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    Kraken API | https://www.kraken.com/features/api#general-usage\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { handleUserInput(input, 'kraken', 'public') }, null, [{ name: '<endpoint>;<query>', type: 'string' }])
  .addItem('PRIVATE API request', (input: string) => { handleUserInput(input, 'kraken', 'private') }, null, [{ name: '<endpoint>;<query>', type: 'string' }])
  .addItem('Get OHLC candles', async (symbol: string) => { print(await getKrakenOHLCCandles(symbol)) }, null, [{ name: '<symbol>', type: 'string' }])
  .addItem('Get price ticker', async (symbol: string) => { print(await getKrakenPriceTicker(symbol)) }, null, [{ name: '<symbol>', type: 'string' }])
  .addItem('Show Balances', async () => { print(filterKrakenBalances(await krakenPrivateApiRequest({ url: 'Balance' }))) })
  .addItem('BUY @ market', async (pair: string, volume: number) => {  print(await krakenPrivateApiRequest({ url: 'AddOrder', data: { pair, type: 'buy', ordertype: 'market', volume } })) }, null, [{ name: '<pair>', type: 'string' }, { name: '<amount>', type: 'numeric' }])
  .addItem('SELL @ market', async (pair: string, volume: number) => {  print(await krakenPrivateApiRequest({ url: 'AddOrder', data: { pair, type: 'sell', ordertype: 'market', volume } })) }, null, [{ name: '<pair>', type: 'string' }, { name: '<amount>', type: 'numeric' }])

  .addDelimiter(' ', 1)
  .addDelimiter('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    HitBTC API | https://api.hitbtc.com/#rest-api-reference\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { handleUserInput(input, 'hitbtc', 'public') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('PRIVATE API request', (input: string) => { handleUserInput(input, 'hitbtc', 'private') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('Get OHLC candles', async (symbol: string) => { print(await getHitBTCOHLCCandles(symbol)) }, null, [{ name: '<symbol>', type: 'string' }])
  .addItem('Get price ticker', async (symbol: string) => { print(await getHitBTCPriceTicker(symbol)) }, null, [{ name: '<symbol>', type: 'string' }])
  .addItem('Show ACCOUNT Balances', async () => { print(filterBalances(await hitbtcPrivateApiRequest({ url: 'account/balance' }))) })
  .addItem('Show TRADING Balances', async () => { print(filterBalances(await hitbtcPrivateApiRequest({ url: 'trading/balance' }))) })
  .addItem('BUY @ market',  async (symbol: string, quantity: number) => { print(await hitbtcPrivateApiRequest({ url: 'order', method: 'POST', data: { symbol, side: 'buy', type: 'market', quantity } })) }, null, [{ name: '<pair>', type: 'string' }, { name: '<amount>', type: 'numeric' }])
  .addItem('SELL @ market',  async (symbol: string, quantity: number) => { print(await hitbtcPrivateApiRequest({ url: 'order', method: 'POST', data: { symbol, side: 'sell', type: 'market', quantity } })) }, null, [{ name: '<pair>', type: 'string' }, { name: '<amount>', type: 'numeric' }])

  .addDelimiter(' ', 1)
  .addDelimiter('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    Binance API | https://binance-docs.github.io/apidocs/spot/en/#general-api-information\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { handleUserInput(input, 'binance', 'public') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('PRIVATE API request', (input: string) => { handleUserInput(input, 'binance', 'private') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('Get OHLC candles', async (symbol: string) => { print(await getBinanceOHLCCandles(symbol)) }, null, [{ name: '<symbol>', type: 'string' }])
  .addItem('Get price ticker', async (symbol: string) => { print(await getBinancePriceTicker(symbol)) }, null, [{ name: '<symbol>', type: 'string' }])
  .addItem('Show Balances', async () => { print(filterBalances((await binancePrivateApiRequest({ url: 'api/v3/account' })).balances)) })
  .addItem('BUY @ market',  async (symbol: string, quantity: number) => { print(await binancePrivateApiRequest({ url: 'api/v3/order', method: 'POST', data: { symbol, side: 'buy', type: 'market', quantity } })) }, null, [{ name: '<pair>', type: 'string' }, { name: '<amount>', type: 'numeric' }])
  .addItem('SELL @ market',  async (symbol: string, quantity: number) => { print(await binancePrivateApiRequest({ url: 'api/v3/order', method: 'POST', data: { symbol, side: 'sell', type: 'market', quantity } })) }, null, [{ name: '<pair>', type: 'string' }, { name: '<amount>', type: 'numeric' }])

  .addDelimiter(' ', 1) 
  .customPrompt(() => {
    process.stdout.write('\nEnter your selection:\n');
  })
  .continueCallback(() => {
    // Runs between 'Press enter to continue' and the new menu render
  })
  .start()
