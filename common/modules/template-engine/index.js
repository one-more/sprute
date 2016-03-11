'use strict';

let smartPlurals = require('smart-plurals'),
    baseView = require(app.get('commonPath')+'/views/base');
let pluralRule = smartPlurals.Plurals.getRule('ru');

require('jsmart');

module.exports = {
    init() {

        jSmart.prototype.registerPlugin(
            'function',
            'pluralize',
            params => {
                return pluralRule(+params['count'], [params['one'], params['few'], params['many']])
            }
        );

        jSmart.prototype.registerPlugin(
            'function',
            'include',
            (params, data) => {
                let view = new baseView;
                view.templateDirs = data.templateDirs;
                return view.getTemplate(params.file, data);
            }
        );

        return jSmart
    }
};