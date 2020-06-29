#!/usr/bin/env node
'use strict';

import { readFileSync } from 'fs'
import { resolve } from 'path'
import debugHelper from './util/debug_helper'
const { print, logError } = debugHelper(__filename)

const [,, arg] = process.argv;
if (/-v.*/.test(arg)) {
    try {
      const { name, version } = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json')).toString());
      console.log(`    ${name} v${version} ✔️`);
    } catch (error) {
      logError({ error })
    }
    process.exit()
}

import { parse } from 'qs'
import { krakenPrivateApiRequest } from './kraken/private_api_request'
import { krakenPublicApiRequest } from './kraken/public_api_request'
import { PrivateEndpoint, PublicEndpoint } from './kraken/api_endpoints'
import { hitbtcPrivateApiRequest } from './hitbtc/private_api_request'
import { hitbtcPublicApiRequest } from './hitbtc/public_api_request'
import { Method } from 'axios'
import { binancePrivateApiRequest } from './binance/private_api_request'
import { binancePublicApiRequest } from './binance/public_api_request'
import * as nodeMenu from 'node-menu'

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

const pkgPath = resolve(__dirname, '..', 'package.json');
const { version } = JSON.parse(readFileSync(pkgPath).toString())

const filterBalances = (balancesArr: StandardBalanceItem[]): void => {
  const balances = balancesArr.filter(({ available, free }) => Number(available || free) > 0)
  print({ balances })
}

const handleUserInput = (input: string, exchange: 'kraken' | 'hitbtc' | 'binance', pOp: 'public' | 'private'): void => {
  if (exchange === 'kraken') {
    const [endpoint, rawParams] = input.split(';')
    if (pOp === 'public') {
      krakenPublicApiRequest({ url: endpoint as PublicEndpoint, data: parse(rawParams) })
    } else {
      krakenPrivateApiRequest({ url: endpoint as PrivateEndpoint, data: parse(rawParams) })
    }
    return
  }
  const [endpoint, method = 'GET', rawParams] = input.split(';')
  const dataOrParams = parse(rawParams)
  switch (exchange) {
    case 'binance':
      if (pOp === 'public') {
        binancePublicApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams })
      } else {
        binancePrivateApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams })
      }
      return
    case 'hitbtc':
      if (pOp === 'public') {
        const dataOrParams = parse(rawParams)
        hitbtcPublicApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams })
      } else {
        hitbtcPrivateApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams })
      }
      return
  }
}

nodeMenu
  .customHeader(() => {
    process.stdout.write(`                              <<<<<<     TS-CRYPTO-CLI v${version}     >>>>>>\n\n`);
  })

  .addDelimiter('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    Kraken API | https://www.kraken.com/features/api#general-usage\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { handleUserInput(input, 'kraken', 'public') }, null, [{ name: '<endpoint>;<query>', type: 'string' }])
  .addItem('PRIVATE API request', (input: string) => { handleUserInput(input, 'kraken', 'private') }, null, [{ name: '<endpoint>;<query>', type: 'string' }])
  .addItem('Show Balances', () => { krakenPrivateApiRequest({ url: 'Balance' }) })
  .addItem('BUY @ market', (pair: string, volume: number) => { krakenPrivateApiRequest({ url: 'AddOrder', data: { pair, type: 'buy', ordertype: 'market', volume } }) }, null, [{ name: 'pair', type: 'string' }, { name: 'amount', type: 'numeric' }])
  .addItem('SELL @ market', (pair: string, volume: number) => { krakenPrivateApiRequest({ url: 'AddOrder', data: { pair, type: 'sell', ordertype: 'market', volume } }) }, null, [{ name: 'pair', type: 'string' }, { name: 'amount', type: 'numeric' }])

  .addDelimiter(' ', 1)
  .addDelimiter('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    HitBTC API | https://api.hitbtc.com/#rest-api-reference\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { handleUserInput(input, 'hitbtc', 'public') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('PRIVATE API request', (input: string) => { handleUserInput(input, 'hitbtc', 'private') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('Show ACCOUNT Balances', async () => { filterBalances(await hitbtcPrivateApiRequest({ url: 'account/balance' })) })
  .addItem('Show TRADING Balances', async () => { filterBalances(await hitbtcPrivateApiRequest({ url: 'trading/balance' })) })
  .addItem('BUY @ market', (symbol: string, quantity: number) => { hitbtcPrivateApiRequest({ url: 'order', method: 'POST', data: { symbol, side: 'buy', type: 'market', quantity } }) }, null, [{ name: 'pair', type: 'string' }, { name: 'amount', type: 'numeric' }])
  .addItem('SELL @ market', (symbol: string, quantity: number) => { hitbtcPrivateApiRequest({ url: 'order', method: 'POST', data: { symbol, side: 'sell', type: 'market', quantity } }) }, null, [{ name: 'pair', type: 'string' }, { name: 'amount', type: 'numeric' }])

  .addDelimiter(' ', 1)
  .addDelimiter('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    Binance API | https://binance-docs.github.io/apidocs/spot/en/#general-api-information\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('PUBLIC API request', (input: string) => { handleUserInput(input, 'binance', 'public') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('PRIVATE API request', (input: string) => { handleUserInput(input, 'binance', 'private') }, null, [{ name: '<endpoint>;<method>;<query>', type: 'string' }])
  .addItem('Show Balances', async () => { filterBalances((await binancePrivateApiRequest({ url: 'api/v3/account' })).balances) })
  .addItem('BUY @ market', (symbol: string, quantity: number) => { binancePrivateApiRequest({ url: 'api/v3/order', method: 'POST', data: { symbol, side: 'buy', type: 'market', quantity } }) }, null, [{ name: 'pair', type: 'string' }, { name: 'amount', type: 'numeric' }])
  .addItem('SELL @ market', (symbol: string, quantity: number) => { binancePrivateApiRequest({ url: 'api/v3/order', method: 'POST', data: { symbol, side: 'sell', type: 'market', quantity } }) }, null, [{ name: 'pair', type: 'string' }, { name: 'amount', type: 'numeric' }])

  .addDelimiter(' ', 1)
  .addDelimiter('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n#    Extras/Config\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', 2)
  .addItem('Print current env', () => { const { env } = process; print({ env }) })
  .addItem('Set env value', (key: string, val: string) => { process.env[key] = val }, null, [{ name: 'key', type: 'string' }, { name: 'value', type: 'string' }])

  .addDelimiter(' ', 1)
  .customPrompt(() => {
    process.stdout.write('\nEnter your selection:\n');
  })
  .continueCallback(() => {
    // Runs between 'Press enter to continue' and the new menu render
  })
  .start()
