'use strict';

let theme = require('./app').theme,
    process = require('process'),
    traceur = require('gulp-traceur');

let vendorPath = 'bower_components';
let vendorJS = [
    vendorPath+'/jquery/dist/jquery.min.js',
    vendorPath+'/underscore/underscore-min.js',
    vendorPath+'/backbone/backbone-min.js',
    vendorPath+'/jsmart/jsmart.min.js',
    vendorPath+'/smart-plurals/dist/Smart.Plurals/Smart.Plurals.all-min.js',
    traceur.RUNTIME_PATH
];
let vendorCSS = [];

let originJS = [
    'front/**/*.js',
    theme.path+'/**/*.js',
    'common/**/*.js',
    'configuration/routes.js',
    'configuration/app.js',
    'configuration/theme-light.js'
];

module.exports = {
    paths: {
        deletePath: 'static/build',
        svgSrc: 'static/build/images',
        js: originJS,
        css: [theme.path+'/**/*.styl', 'front/**/*.css'],
        dest: 'static/build',
        vendorJS,
        vendorCSS,
        templates: [theme.templatesPath+'/**/*.tpl.html']
    },
    buildResult: process.cwd()+'/static/build-result.js',
    main: './front/index.js'
};