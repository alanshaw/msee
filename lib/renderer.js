/**
 * msee
 * Copyright (c) 2013-2014 Firede. (MIT Licensed)
 * https://github.com/firede/msee
 */

var format = require( 'util' ).format;
var cardinal = require('cardinal');

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
    text = this.colorize('heading', text);
    var body = format( '%s %s\n\n', flag, text );

    return body;
};

/**
 * code renderer
 * 
 * @param {string} text
 * @param {string} lang
 * @param {Object} options
 * @return {string}
 */
Renderer.prototype.code = function (text, lang, options) {
    var body = '';
    var highlightOptions = options.highlight;

    try {
        body = cardinal.highlight(text, highlightOptions);
    }
    catch (e) {
        body = this.colorize('code', text);
    }

    return body + '\n\n';
};

/**
 * blockquote renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.blockquote = function(text) {
    text = this.colorize('blockquote', text);
    var flag = this.colorize('syndax', '> ');
    var body = format('%s%s', flag, text);

    return body;
};

/**
 * paragraph renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.paragraph = function(text) {
    text = this.colorize('paragraph', text);
    var body = format('%s\n\n', text);

    return body;
};

Renderer.prototype.list = function(items, ordered) {
    var me = this;
    var body = '';
    var label = ordered ? 'ol' : 'ul';

    items.forEach(function( item, i ) {
        var flag = ordered ? i + 1 + '.' : '+';
        flag = me.colorize('syndax', flag);
        item = me.colorize(label, item);

        body += format('%s %s\n', flag, item);
    });

    body = format('%s\n', body);

    return body;
};

Renderer.prototype.listitem = function(text) {
    return text;
};

Renderer.prototype.htmltag = function(text) {
    return this.colorize('htmltag', text);
};

Renderer.prototype.link = function(text, link, title) {
    link = this.colorize('link', link);

    if (!text) {
        return link;
    }

    return format(
        '%s%s%s%s%s',
        this.colorize('syndax', '['),
        text,
        this.colorize('syndax', ']('),
        link,
        this.colorize('syndax', ')')
    );
};

/**
 * strong renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.strong = function (text) {
    text = this.colorize('strong', text);
    var flag = this.colorize('syndax', '**');
    var body = flag + text + flag;

    return body;
};

/**
 * em renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.em = function (text) {
    text = this.colorize('em', text);
    var flag = this.colorize('syndax', '*');
    var body = flag + text + flag;

    return body;
};

/**
 * del renderer
 * 
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.del = function (text) {
    text = this.colorize('del', text);
    var flag = this.colorize('syndax', '~~');
    var body = flag + text + flag;

    return body;
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
