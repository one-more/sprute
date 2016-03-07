'use strict';

let process = require('process'),
    themePath = process.cwd()+'/themes/theme-light',
    templatesPath = themePath+'/templates',
    stylesPath = themePath+'/styles',
    viewsPath = themePath+'/js/views',
    lazypipe = require('lazypipe'),
    stylus = require('gulp-stylus'),
    nib = require('nib');

let bundleOptions = {
    minifyTemplates: true,
    watchTemplates: true,
    minifyStyles: true,
    watchStyles: true,
    transforms: {
        styles: lazypipe().pipe(stylus, {
            include: [themePath+'/includes/stylus'],
            import: ['_variables', 'nib'],
            use: nib()
        })
    }
};

module.exports = {
    path: themePath,
    templatesPath,
    viewsPath,
    bundles: {
        'theme-light': {
            templates: [templatesPath+'/**/*.tpl.html'],
            styles: [stylesPath+'/**/*.styl'],
            options: Object.assign({}, bundleOptions)
        }
    }
};