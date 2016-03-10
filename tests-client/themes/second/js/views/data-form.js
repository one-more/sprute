'use strict';

let FormView = require(app.get('commonPath')+'/views/form'),
    dataEvents = require('../events/data');

module.exports = class extends FormView {
    get el() {
        return '#data-form'
    }

    get validator() {
        if(!this._validator) {
            let vE = app.get('validationEngine');
            this._validator = new vE({
                field1: ['required', 'not_empty'],
                field2: ['required', 'integer'],
                field3: ['required', 'not_empty']
            })
        }
        return this._validator
    }

    validate(data) {
        return this.validator.validate(data)
    }

    onValidationError() {
        alert('invalid data')
    }

    onSuccess() {
        alert('success');
        dataEvents.emit('add')
    }

    onError() {
        alert('not success')
    }
};