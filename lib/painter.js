/**
 * msee
 * Copyright (c) 2013 Firede. (MIT Licensed)
 * https://github.com/firede/msee
 */

var chalk = require( 'chalk' );
var extend = require( 'util-extend' );

/**
 * Default Color Scheme
 * 
 * @inner
 * @type {Object}
 */
var defaultSchemes = {
    // syndax padding
    "syndax": "grey",
    // block
    "hr": "grey",
    "heading": "cyan bold",
    "code": "yellow",
    "blockquote": "blue",
    "paragraph": null,
    // inline
    "link": "blue underline",
    "strong": "blue",
    "em": "green italic",
    "del": "grey strikethrough",
    "codespan": "yellow"
};

/**
 * Painter
 * 
 * @constructor
 * @param {Object} options
 * @param {Object.<Object>} options.colorSchemes
 */
function Painter ( options ) {
    options = options || {};
    this.colorSchemes = extend( defaultSchemes, options.colorSchemes );
}

/**
 * Colorize
 * 
 * @param {string} type
 * @param {string} text
 * @return {string}
 */
Painter.prototype.paint = function ( type, text ) {
    var scheme = this.colorSchemes[ type ];

    if ( !scheme ) {
        return text;
    }
    else if ( scheme.indexOf( ' ' ) !== -1 ) {
        // multi scheme
        scheme.split( ' ' ).forEach(
            function( curScheme ) {
                if ( chalk[ curScheme ] ) {
                    text = chalk[ curScheme ]( text );
                }
            }
        );
        return text;
    }
    else {
        if ( chalk[ scheme ] ) {
            text = chalk[ scheme ]( text );
        }
        return text;
    }
};


module.exports = Painter;
