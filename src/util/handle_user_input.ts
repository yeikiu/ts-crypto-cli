import { krakenPublicApiRequest, PublicEndpoint, krakenPrivateApiRequest, PrivateEndpoint, binancePublicApiRequest, binancePrivateApiRequest, hitbtcPublicApiRequest, hitbtcPrivateApiRequest } from ".."
import { parse } from "path"
import { Method } from "axios"
import debugHelper from './debug_helper'
const { print, logError } = debugHelper(__filename)

const handleUserInput = async (input: string, exchange: 'kraken' | 'hitbtc' | 'binance', pOp: 'public' | 'private'): Promise<void> => {
    if (exchange === 'kraken') {
      const [endpoint, rawParams] = input.split(';')
      if (pOp === 'public') {
        print(await krakenPublicApiRequest({ url: endpoint as PublicEndpoint, data: parse(rawParams) }))
      } else {
        print(await krakenPrivateApiRequest({ url: endpoint as PrivateEndpoint, data: parse(rawParams) }))
      }
      return
    }
    const [endpoint, method = 'GET', rawParams] = input.split(';')
    const dataOrParams = parse(rawParams)
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
          const dataOrParams = parse(rawParams)
          print(await hitbtcPublicApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams }))
        } else {
          print(await hitbtcPrivateApiRequest({ url: endpoint, method: method as Method, data: dataOrParams, params: dataOrParams }))
        }
        return
    }
  }

export default handleUserInput
