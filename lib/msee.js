/**
 * msee
 * Copyright (c) 2013-2014 Firede. (MIT Licensed)
 * https://github.com/firede/msee
 */

var fs = require('fs');
var path = require('path');

var Parser = require('./parser');
var Renderer = require('./renderer');

/**
 * Exports
 */

exports.Parser = Parser;
exports.Renderer = Renderer;

/**
 * Static Parse Method
 * 
 * @param {string} text
 * @param {Object} options
 * @return {string}
 */
exports.parse = function (text, options) {
    var parser = new Parser(options);
    return parser.parse(text);
};

exports.parseFile = function (file, options) {
    var filePath = path.resolve(__dirname, file);

    try {
        var text = fs.readFileSync(filePath).toString();
        return exports.parse(text, options);
    }
    catch (e) {
        throw e;
    }
};
