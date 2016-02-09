'use strict';

module.exports = {
    db: {
        defaultConnection: 'mysql'
    },
    templatesEngine: require(app.get('commonPath')+'/modules/smarty-template-engine')
};