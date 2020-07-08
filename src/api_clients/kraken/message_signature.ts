import { stringify } from 'qs'
import { createHash, createHmac } from 'crypto'

// Create a signature for a request
export const getKrakenMessageSignature = (path: string, params: any, privateKey: string): string => {
  const message = stringify(params)
  const secretBuffer = Buffer.from(privateKey, 'base64')
  const hash = createHash('sha256')
  const hmac = createHmac('sha512', secretBuffer)
  const hashDigest = hash.update(params.nonce + message).digest('latin1')
  const hmacDigest = hmac.update(path + hashDigest, 'latin1').digest('base64')

  return hmacDigest
}
