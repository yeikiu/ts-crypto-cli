"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-useless-catch */
/* eslint-disable global-require */
var path = require('path');
var debugLib = require('debug');
// Load package.json relative to this file location (or it´s 'dist' .js equivalent)
var parentModuleBase = path.resolve(__dirname, '../..');
var rootPkgPath = path.join(parentModuleBase, 'package.json');
var rootPkg = null;
try {
    rootPkg = require(rootPkgPath);
    if (!rootPkg.name) {
        throw new Error('Can´t load name from ./package.json file.\nDoes it exist under root directory?');
    }
}
catch (error) {
    throw error;
}
exports.default = (function (fileName, label) {
    if (label === void 0) { label = rootPkg.name; }
    var filePath = path.parse(fileName).name;
    var debug = debugLib(label + ":" + filePath);
    var logError = debugLib(label + ":" + filePath + ":error*");
    var print = debugLib(label + ":" + filePath + ":*");
    return { debug: debug, logError: logError, print: print };
});
