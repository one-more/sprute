'use strict';

let process = require('process');
let themePath = process.cwd()+'/themes/theme-light';

module.exports = {
    path: themePath,
    buildOptions: {
        stylus: {
            includes: [themePath+'/includes/stylus'],
            imports: [/*'_animations', '_variables', '_mixins',*/]
        }
    }
};