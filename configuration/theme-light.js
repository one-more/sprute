'use strict';

let process = require('process'),
    themePath = process.cwd()+'/themes/theme-light',
    templatesPath = themePath+'/templates';

let bundleOptions = {
    minifyTemplates: true,
    watchTemplates: true
};

module.exports = {
    path: themePath,
    templatesPath: templatesPath,
    bundles: {
        'theme-light': {
            templates: [templatesPath+'/**/*.tpl.html'],
            options: bundleOptions
        }
    }
};