var marked = require('marked');
var inherits = require('util').inherits;
var Renderer = require('./renderer');

/**
 * InlineLexer
 * 
 * @constructor
 * @extends marked.InlineLexer
 */
function InlineLexer() {
    marked.InlineLexer.apply(this, arguments);
}

inherits(InlineLexer, marked.InlineLexer);

InlineLexer.prototype.output = function (src) {
    var out = '';
    var link, text, herf, cap;

    while (src) {
        // @TODO: escape
        if (cap = this.rules.escape.exec(src)) {
            src = src.substring(cap[0].length);
            out += cap[1];

            continue;
        }

        // @TODO: autolink
        // if (cap = this.rules.autolink.exec(src)) {
        // }

        // url (gfm)
        if (cap = this.rules.url.exec(src)) {
            src = src.substring(cap[0].length);
            link = cap[1];
            out += this.renderer.link(null, link, null);

            continue;
        }

        // html tag
        if (cap = this.rules.tag.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.htmltag(cap[0]);

            continue;
        }

        // link
        if (cap = this.rules.link.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.link(cap[1], cap[2], cap[3]);

            continue;
        }

        // TODO: reflink, nolink

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

        // TODO: br
        // if (cap = this.rules.br.exec(src)) {
        // }

        // del (gfm)
        if (cap = this.rules.del.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.del(this.output(cap[1]));

            continue;
        }

        // text
        if ( cap = this.rules.text.exec( src ) ) {
            src = src.substring( cap[ 0 ].length );
            out += cap[ 0 ];

            continue;
        }

        if ( src ) {
            throw new Error( 'Infinite loop on byte: ' + src.charCodeAt( 0 ) );
        }
    }

    return out;
};

module.exports = InlineLexer;