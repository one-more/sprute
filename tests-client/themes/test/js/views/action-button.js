'use strict';

let BaseView = require(app.get('commonPath')+'/views/base');

module.exports = class extends BaseView {
    constructor() {
        super()
    }

    get el() {
        return '#action-button'
    }

    get events() {
        return {
            'click': 'showMessage'
        }
    }

    showMessage() {
        alert('awesome!')
    }
};