'use strict';

let LIVR = require('livr');

module.exports = {
    init() {
        LIVR.Validator.defaultAutoTrim(true);

        return LIVR.Validator
    }
};