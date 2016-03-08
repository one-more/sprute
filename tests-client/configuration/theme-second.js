'use strict';

let process = require('process'),
    themePath = process.cwd()+'/tests-client/themes/second',
    templatesPath = themePath+'/templates',
    jsPath = themePath+'/js',
    stylesPath = themePath+'/styles',
    viewsPath = jsPath+'/views';

try {
    var lazypipe = require('lazypipe'),
        stylus = require('gulp-stylus'),
        nib = require('nib'),
        bundleOptions = {
            watchJS: true,
            watchTemplates: true,
            watchStyles: true,
            transforms: {
                styles: lazypipe().pipe(stylus, {
                    include: [themePath+'/includes/stylus'],
                    import: ['_variables', 'nib'],
                    use: nib()
                })
            }
        };
} catch(e) {
    bundleOptions = {}
}

module.exports = {
    path: themePath,
    templatesPath,
    viewsPath,
    bundles: {
        'tests-common': {},
        'theme-second': {
            templates: [templatesPath+'/**/*.html'],
            js: [jsPath+'/**/*.js'],
            styles: [stylesPath+'/**/*.styl'],
            options: Object.assign({}, bundleOptions)
        }
    }
};