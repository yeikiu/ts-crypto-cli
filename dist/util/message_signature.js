"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var qs = require("qs");
var crypto = require('crypto');
// Create a signature for a request
var getMessageSignature = function (path, params) {
    var message = qs.stringify(params);
    var secret_buffer = new Buffer(process.env.KRAKEN_API_SECRET, 'base64');
    var hash = new crypto.createHash('sha256');
    var hmac = new crypto.createHmac('sha512', secret_buffer);
    var hash_digest = hash.update(params.nonce + message).digest('binary');
    var hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64');
    return hmac_digest;
};
exports.default = getMessageSignature;
