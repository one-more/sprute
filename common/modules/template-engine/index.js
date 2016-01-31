'use strict';

let smartPlurals = require('smart-plurals');
let pluralRule = smartPlurals.Plurals.getRule('ru');

let jSmart = require('jsmart');

module.exports = {
    init() {

        jSmart.prototype.registerPlugin(
            'function',
            'pluralize',
            params => {
                return pluralRule(+params['count'], [params['one'], params['few'], params['many']])
            }
        );

        return jSmart
    }
};