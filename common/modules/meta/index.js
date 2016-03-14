'use strict';

let _ = require('underscore');

class Tag {
    get attributes() {
        return this._attributes || (this._attributes = {}, this._attributes)
    }

    set attributes(val) {
        this._attributes = val
    }

    toString() {
        return ['<meta']
            .concat(_.pairs(this.attributes).map(pair => {
                return ` ${pair[0]}="${pair[1]}" `;
            })).concat('>')
            .join('')
    }
}

exports.Tag = class extends Tag {
    constructor(attributes) {
        super();

        this.attributes = attributes
    }
};

exports.Description = class extends Tag {
    constructor(description) {
        super();

        this.attributes.content = description;
        this.attributes.name = 'description'
    }
};

exports.Charset = class extends Tag {
    constructor(charset) {
        super();

        this.attributes.charset = charset
    }
};

exports.Keywords = class extends Tag {
    constructor(keywords) {
        super();

        this.attributes.name = 'keywords';
        if(typeof keywords == 'string') {
            this.attributes.content = keywords
        } else if(keywords instanceof Array) {
            this.attributes.content = keywords.join(', ')
        } else {
            throw new Error('keywords must be either string or array')
        }
    }
};