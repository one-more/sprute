'use strict';

let baseModel = require('./base');

module.exports = class extends baseModel {
    constructor() {
        super();
    }

    get templateDir() {
        return ''
    }
};