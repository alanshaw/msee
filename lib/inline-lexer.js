var marked = require( 'marked' );
var inherits = require( 'util' ).inherits;
var Renderer = require( './renderer' );

/**
 * InlineLexer
 * 
 * @constructor
 * @extends marked.InlineLexer
 */
function InlineLexer() {
    marked.InlineLexer.apply( this, arguments );
}

inherits( InlineLexer, marked.InlineLexer );

InlineLexer.prototype.output = function ( src, wrapRenderer ) {
    var out = '';
    var link, text, herf, cap;

    while ( src ) {
        // @todo: escape
        if ( cap = this.rules.escape.exec( src ) ) {
            src = src.substring( cap[ 0 ].length );
            out += cap[ 1 ];

            continue;
        }

        // strong
        if ( cap = this.rules.strong.exec( src ) ) {
            src = src.substring( cap[ 0 ].length );
            out += this.renderer.strong(
                this.output( cap[ 2 ] || cap[ 1 ] )
            );

            continue;
        }

        // em
        if ( cap = this.rules.em.exec( src ) ) {
            src = src.substring( cap[ 0 ].length );
            out += this.renderer.em(
                this.output( cap[2] || cap[1] )
            );

            continue;
        }

        // code
        if ( cap = this.rules.code.exec( src ) ) {
            src = src.substring( cap[ 0 ].length );
            out += this.renderer.codespan( cap[ 2 ] );

            continue;
        }

        // text
        if ( cap = this.rules.text.exec( src ) ) {
            src = src.substring( cap[ 0 ].length );
            out += wrapRenderer
                ? wrapRenderer.call( this.renderer, cap[ 0 ] )
                : cap[ 0 ];

            continue;
        }

        if ( src ) {
            throw new Error( 'Infinite loop on byte: ' + src.charCodeAt( 0 ) );
        }
    }

    return out;
};

module.exports = InlineLexer;