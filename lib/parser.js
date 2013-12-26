/**
 * msee
 * Copyright (c) 2013 Firede. (MIT Licensed)
 * https://github.com/firede/msee
 */

var marked = require( 'marked' );
var extend = require( 'util-extend' );
var Painter = require( './painter' );
var InlineLexer = require( './inline-lexer' );
var defaultOptions = require( './options' );

/**
 * Markdown Parser
 * 
 * @constructor
 * @param {Object} options
 */
function Parser( options ) {
    this.tokens = [];
    this.token = null;
    this.options = extend( defaultOptions, options );
    this.renderer = this.options.renderer;

    var painter = new Painter( this.options );
    this.renderer.painter = painter;
}

/**
 * Static Parse Method
 * 
 * @param {string} text
 * @param {Object} options
 * @return {string}
 */
Parser.parse = function ( text, options ) {
    var parser = new Parser( options );
    return parser.parse( text );
};

/**
 * Parse Text
 * 
 * @param {string} text
 * @return {string}
 */
Parser.prototype.parse = function ( text ) {
    var src = marked.lexer( text, this.options );
    this.inline = new InlineLexer(
        src.links,
        this.options,
        this.renderer
    );
    this.tokens = src.reverse();

    var out = '';
    while ( this.next() ) {
        out += this.tok();
    }

    return out;
};

/**
 * Next Token
 * 
 * @return {Object}
 */
Parser.prototype.next = function () {
    this.token = this.tokens.pop();
    // debug
    console.log( this.token || 'no token!' );
    return this.token;
};

/**
 * Preview Next Token
 * 
 * @return {Object}
 */
Parser.prototype.peek = function () {
    return this.tokens[ this.tokens.length - 1 ] || 0;
};

/**
 * Parse Text Tokens
 * 
 * @return {string}
 */
Parser.prototype.parseText = function () {
    var body = this.token.text;

    while ( this.peek().type === 'text' ) {
        body += '\n' + this.next().text;
    }

    return this.inline.output( body );
};

/**
 * Parse Current Token
 * 
 * @return {string}
 */
Parser.prototype.tok = function ( options ) {
    var type = this.token.type;

    switch ( type ) {
        case 'space': {
            return '';
        }
        case 'hr': {
            return this.renderer.hr();
        }
        case 'heading': {
            return this.renderer.heading(
                this.inline.output(
                    this.token.text,
                    this.renderer.headingText
                ),
                this.token.depth
            );
        }
        case 'code': {
            return this.renderer.code(
                this.token.text,
                this.token.lang,
                this.options
            );
        }
    }

    return '';
};


module.exports = Parser;

