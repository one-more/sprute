'use strict';

module.exports = {
    templatesEngine: require(app.get('commonPath')+'/modules/template-engine'),
    validationEngine: require(app.get('commonPath')+'/modules/validation-engine')
};