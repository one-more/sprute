'use strict';

let process = require('process');

module.exports = {
    build: process.cwd()+'/static/build',
    bundleResult: process.cwd()+'/static/build-result.js',
    clean: 'static/build/*',
    prefix: '/build'
};