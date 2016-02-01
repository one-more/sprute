'use strict';

let theme = require('./app').theme,
    process = require('process');

let vendorPath = 'bower_components';
let vendorJS = [
    vendorPath+'/jquery/dist/jquery.min.js',
    vendorPath+'/underscore/underscore-min.js',
    vendorPath+'/backbone/backbone-min.js',
    vendorPath+'/jsmart/jsmart.min.js',
    vendorPath+'/smart-plurals/dist/Smart.Plurals/Smart.Plurals.all-min.js'
];
let vendorCSS = [];

module.exports = {
    paths: {
        deletePath: 'static/build',
        svgSrc: 'static/build/images',
        js: ['front/**/*.js', theme.path+'/**/*.js', 'common/**/*.js'],
        css: [theme.path+'/**/*.styl', 'front/**/*.css'],
        dest: 'static/build',
        vendorJS,
        vendorCSS
    },
    buildResult: process.cwd()+'/static/build-result.js',
    main: './front/index.js'
};