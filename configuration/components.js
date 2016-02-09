'use strict';

module.exports = {
    db: {
        defaultConnection: 'mysql'
    },
    templatesEngine: require(app.get('commonPath')+'/modules/smarty'),
    validationEngine: require(app.get('commonPath')+'/modules/livr')
};