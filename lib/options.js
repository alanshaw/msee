/**
 * msee
 * Copyright (c) 2013-2014 Firede. (MIT Licensed)
 * https://github.com/firede/msee
 */

var Renderer = require( './renderer' );

/**
 * default options
 * 
 * @type {Object}
 */
module.exports = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: false,
    silent: false,
    highlight: null,
    colorSchemes: null,
    renderer: new Renderer()
};
