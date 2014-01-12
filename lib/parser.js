/**
 * msee
 * Copyright (c) 2013-2014 Firede. (MIT Licensed)
 * https://github.com/firede/msee
 */

var marked = require( 'marked' );
var extend = require( 'util-extend' );
var recolor = require( 'recolor' );
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

    return recolor(out);
};

/**
 * Next Token
 * 
 * @return {Object}
 */
Parser.prototype.next = function () {
    this.token = this.tokens.pop();
    // debug
    // console.log( this.token );
    return this.token;
};

/**
 * Preview Next Token
 * 
 * @return {Object}
 */
Parser.prototype.peekNext = function () {
    return this.tokens[this.tokens.length - 1];
};

Parser.prototype.peekPrev = function () {
    return this.tokens[this.tokens.length + 1];
};

/**
 * Parse Text Tokens
 * 
 * @return {string}
 */
Parser.prototype.parseText = function () {
    var body = this.token.text;

    while (this.peekNext() && this.peekNext().type === 'text') {
        body += '\n' + this.peekNext().text;
    }

    return this.inline.output(body);
};

/**
 * Parse Current Token
 * 
 * @todo Block level margin
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
                this.inline.output(this.token.text),
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
        // TODO: support table
        case 'table': {
            return '';
        }
        case 'blockquote_start': {
            var body = '';

            while (this.next().type !== 'blockquote_end') {
                body += this.tok();
            }

            return this.renderer.blockquote(
                this.inline.output(body)
            );
        }
        case 'list_start': {
            var items = [];
            var ordered = this.token.ordered;

            while (this.next().type !== 'list_end') {
                items.push(this.tok());
            }

            return this.renderer.list(items, ordered);
        }
        // @TODO: support custom start index for ol
        case 'list_item_start': {
            var body = '';

            while (this.next().type !== 'list_item_end') {
                body += this.token.type === 'text'
                    ? this.parseText()
                    : this.tok();
            }
            return this.renderer.listitem(body);
        }
        case 'loose_item_start': {
            var body = '';

            while (this.next().type !== 'list_item_end') {
                body += this.tok();
            }

            return this.renderer.listitem(body);
        }
        case 'html': {
            var html = !this.token.pre
                ? this.inline.output(this.token.text)
                : this.token.text;

            return html;
        }
        case 'paragraph': {
            return this.renderer.paragraph(
                this.inline.output(this.token.text)
            );
        }
        case 'text': {
            return this.renderer.paragraph(this.parseText());
        }
    }

    return '';
};


module.exports = Parser;
