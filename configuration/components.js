'use strict';

module.exports = {
    templatesEngine: require(app.get('commonPath')+'/modules/smarty'),
    validationEngine: require(app.get('commonPath')+'/modules/livr')
};