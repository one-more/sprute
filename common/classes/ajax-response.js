'use strict';

module.exports = class {
    constructor() {
        this.status = null;
        this.errors = null;
        this.data = null;
    }

    static get statusOK() {
        return 'success'
    }

    static get statusError() {
        return 'error'
    }
};