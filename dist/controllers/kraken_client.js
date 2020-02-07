"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var qs = require("qs");
var message_signature_1 = require("../util/message_signature");
var krakenBaseUrl = 'https://api.kraken.com';
var apiVersion = '0';
var timeout = 10000;
var method = 'POST';
var headers = {
    'User-Agent': 'ts-kraken-api',
    'content-type': 'application/x-www-form-urlencoded'
};
var publicClient = axios_1.default.create({
    baseURL: krakenBaseUrl + "/" + apiVersion + "/public",
    method: method,
    headers: headers,
    timeout: timeout,
});
publicClient.interceptors.request.use(function (config) {
    var nonce = new Date().getTime() * 1000;
    config.data = __assign(__assign({}, config.data), { nonce: nonce });
    config.data = qs.stringify(config.data);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
var privateClient = axios_1.default.create({
    baseURL: krakenBaseUrl + "/" + apiVersion + "/private",
    method: method,
    headers: __assign(__assign({}, headers), { 'API-Key': process.env.KRAKEN_API_KEY }),
    timeout: timeout,
});
privateClient.interceptors.request.use(function (config) {
    var url = config.url;
    var nonce = new Date().getTime() * 1000;
    config.data = __assign(__assign({}, config.data), { nonce: nonce });
    config.headers['API-Sign'] = message_signature_1.default("/" + apiVersion + "/private/" + url, config.data);
    config.data = qs.stringify(config.data);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
var publicRequest = function (url, data) {
    if (data === void 0) { data = {}; }
    return publicClient.request({ url: url, data: data });
};
var privateRequest = function (url, data) {
    if (data === void 0) { data = {}; }
    return privateClient.request({ url: url, data: data });
};
exports.KrakenClient = {
    publicRequest: publicRequest,
    privateRequest: privateRequest,
};
