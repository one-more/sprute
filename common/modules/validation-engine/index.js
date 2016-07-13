'use strict';

const LIVR = require('livr');

module.exports = {
    init() {
        LIVR.Validator.defaultAutoTrim(true);

        return LIVR.Validator
    }
};