'use strict';

module.exports = {
    server: require(app.get('commonPath')+'/modules/server'),
    templateEngine: require(app.get('commonPath')+'/modules/template-engine'),
    validationEngine: require(app.get('commonPath')+'/modules/validation-engine'),
    i18n: require(app.get('commonPath')+'/modules/i18n'),
    history: require(app.get('commonPath')+'/modules/history')
};