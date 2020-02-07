import qs = require('qs');
const crypto = require('crypto');

// Create a signature for a request
const getMessageSignature = (path, params): string => {
	const message       = qs.stringify(params);
	const secret_buffer = new Buffer(process.env.KRAKEN_API_SECRET, 'base64');
	const hash          = new crypto.createHash('sha256');
	const hmac          = new crypto.createHmac('sha512', secret_buffer);
	const hash_digest   = hash.update(params.nonce + message).digest('binary');
	const hmac_digest   = hmac.update(path + hash_digest, 'binary').digest('base64');

	return hmac_digest;
};

export default getMessageSignature;