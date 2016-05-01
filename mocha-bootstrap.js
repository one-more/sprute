'use strict';

global.app = require('./common/classes/app');
app.setVars();
const components = require(process.cwd()+'/configuration/components'),
    _ = require('underscore'),
    filteredComponents = ['server', 'history'];
_.pairs(components).filter(pair => filteredComponents.indexOf(pair[0]) == -1)
    .forEach(pair => {
        app.set(pair[0], pair[1].init())
    });