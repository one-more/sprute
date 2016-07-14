'use strict';

const smartPlurals = require('smart-plurals'),
    _ = require('underscore');

require('jsmart');

if(typeof window != 'undefined') {
    var jSmart = window.jSmart
} else {
    jSmart = global.jSmart
}

module.exports = {
    init() {
        
        function translatePlugin(params) {
            let i18n = app.get('i18n');
            params = _.values(params).filter(param => _.isString(param));
            return i18n.translate.apply(i18n, params)
        }

        jSmart.prototype.registerPlugin(
            'function',
            'pluralize',
            params => {
                const i18n = app.get('i18n');
                const pluralRule = smartPlurals.Plurals.getRule(i18n.currentLanguage);
                params = _.values(params)
                    .filter(param => _.isString(param) || !isNaN(+param))
                    .map(param => {
                        return +param || param
                    });
                return pluralRule.call(null, params[0], params.slice(1))
            }
        );

        jSmart.prototype.registerPlugin(
            'function',
            'translate',
            translatePlugin
        );

        jSmart.prototype.registerPlugin(
            'function',
            't',
            translatePlugin
        );

        jSmart.prototype.registerPlugin(
            'function',
            'include',
            (params, data) => {
                let BaseView = require(app.get('commonPath')+'/views/base'),
                    view = new BaseView;
                view.templateDirs = data.templateDirs;
                return view.getTemplate(params.file, Object.assign(data, params));
            }
        );

        return jSmart
    }
};