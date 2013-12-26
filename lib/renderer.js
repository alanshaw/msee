/**
 * msee
 * Copyright (c) 2013 Firede. (MIT Licensed)
 * https://github.com/firede/msee
 */

var format = require( 'util' ).format;

/**
 * Renderer
 * 
 * @constructor
 */
function Renderer () {}

/**
 * Colorize
 * 
 * @return {string}
 */
Renderer.prototype.colorize = function () {
    if ( this.painter ) {
        return this.painter.paint.apply( this.painter, arguments );
    }
    return arguments[ 1 ] || '';
};

/**
 * hr renderer
 * 
 * @return {string}
 */
Renderer.prototype.hr = function () {
    var columns = process.stdout.columns || 80;
    var body = new Array( columns ).join( '-' );

    body = this.colorize( 'hr', body ) + '\n';

    return body;
};

/**
 * heading renderer
 * 
 * @param {string} text
 * @param {number} level
 * @return {string}
 */
Renderer.prototype.heading = function ( text, level ) {
    var flag = this.colorize(
        'syndax',
        Array( ++level ).join( '#' )
    );
    var body = format( '%s %s\n\n', flag, text );

    return body;
};

/**
 * heading text renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.headingText = function ( text ) {
    return this.colorize( 'heading', text );
};

/**
 * strong renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.strong = function ( text ) {
    return this.colorize( 'strong', text );
};

/**
 * em renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.em = function ( text ) {
    return this.colorize( 'em', text );
};

/**
 * codespan renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.codespan = function ( text ) {
    var flag = this.colorize( 'syndax', '`' );
    var body = format(
        '%s%s%s',
        flag,
        this.colorize( 'em', text ),
        flag
    );

    return body;
}

module.exports = Renderer;
