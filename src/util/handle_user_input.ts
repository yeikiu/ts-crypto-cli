
import { parse } from 'qs'
import { Method } from 'axios'
import { binancePrivateApiRequest } from '../binance/api_clients/private_api_request'
import { binancePublicApiRequest } from '../binance/api_clients/public_api_request'
import { hitbtcPrivateApiRequest } from '../hitbtc/api_clients/private_api_request'
import { hitbtcPublicApiRequest } from '../hitbtc/api_clients/public_api_request'
import { krakenPrivateApiRequest } from '../kraken/api_clients/private_api_request'
import { krakenPublicApiRequest } from '../kraken/api_clients/public_api_request'
import { PublicEndpoint, PrivateEndpoint } from '../kraken/types/kraken_api_endpoints'

import debugHelper from './debug_helper'
const { print } = debugHelper(__filename)

const handleUserInput = async (endpoint: string, method: Method, exchange: 'kraken' | 'hitbtc' | 'binance', pOp: 'public' | 'private', params = ''): Promise<void> => {
    if (exchange === 'kraken') {
      if (pOp === 'public') {
        print(await krakenPublicApiRequest({ url: endpoint as PublicEndpoint, data: parse(params) }))
      } else {
        print(await krakenPrivateApiRequest({ url: endpoint as PrivateEndpoint, data: parse(params) }))
      }
      return
    }

    const dataOrParams = parse(params)
    switch (exchange) {
      case 'binance':
        if (pOp === 'public') {
          print(await binancePublicApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams }))
        } else {
          print(await binancePrivateApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams }))
        }
        return
      case 'hitbtc':
        if (pOp === 'public') {
          print(await hitbtcPublicApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams }))
        } else {
          print(await hitbtcPrivateApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams }))
        }
        return
    }
  }

export default handleUserInput
