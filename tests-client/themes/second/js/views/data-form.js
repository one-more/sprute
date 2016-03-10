'use strict';

let FormView = require(app.get('commonPath')+'/views/form');

module.exports = class extends FormView {
    get el() {
        return '#data-form'
    }
};