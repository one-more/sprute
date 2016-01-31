'use strict';

let lazypipe = require('lazypipe'),
    traceur = require('gulp-traceur'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    cssnext = require('gulp-cssnext'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    process = require('process');

let theme = require('../../configuration/theme-light');
let vendorPath = '../vendor/';
let themePath = theme.path;
let commonPath = process.cwd()+'/common/';

module.exports = {
    bundle: {
        vendor: {
            scripts: [
                //vendorPath+'jquery/dist/jquery.min.js',
                //vendorPath+'underscore/underscore-min.js',
                //vendorPath+'backbone/backbone-min.js',
                //vendorPath+'jsmart/jsmart.min.js',
                //vendorPath+'bootstrap/dist/js/bootstrap.min.js',
                //vendorPath+'webrtc-adapter/adapter.js',
                //vendorPath+'socket.io.client/dist/socket.io-1.3.5.js',
                //vendorPath+'noty/js/noty/packaged/jquery.noty.packaged.min.js',
                //vendorPath+'uri.js/src/URI.min.js',
                //vendorPath+'smart-plurals/dist/Smart.Plurals/Smart.Plurals.all-min.js',
                traceur.RUNTIME_PATH
            ],
            styles: [
                //vendorPath+'bootstrap/dist/css/bootstrap.min.css',
                //vendorPath+'bootstrap/dist/css/bootstrap-theme.min.css'
            ],
            options: {
                useMin: true,
                uglify: false,
                minCSS: false,
                transforms: {
                    scripts: lazypipe().pipe(uglify),
                    styles: lazypipe().pipe(cssmin)
                },
                watch: {
                    scripts: false,
                    styles: false
                }
            }
        },
        origin: {
            scripts: [
                commonPath+'js/**/*.js',
                themePath+'js/**/*.js'
            ],
            styles: [
                commonPath+'styles/**/*.styl',
                themePath+'styles/**/*.styl'
            ],
            options: {
                useMin: true,
                uglify: false,
                minCSS: false,
                transforms: {
                    scripts: lazypipe().pipe(traceur).pipe(uglify),
                    styles: lazypipe().pipe(stylus.bind(null, {
                        include: [theme.path+'/includes/stylus'],
                        import: ['_animations', '_variables', '_mixins', 'nib'],
                        use: nib()
                    })).pipe(cssmin).pipe(cssnext.bind(null, {
                        compress: true
                    }))
                },
                watch: {
                    scripts: true,
                    styles: true
                }
            }
        }
    }
};