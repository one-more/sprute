'use strict';

let FileUploadView = require(app.get('commonPath')+'/views/file-upload-form');

module.exports = class extends FileUploadView {
    get el() {
        return '#album-form'
    }

    get events() {
        return Object.assign(super.events, {
            'change input[type=file]': 'onFileChosen'
        })
    }

    onFileChosen(event) {
        if(event.target.files.length) {
            this.$el.find('input[type=file]').clone().appendTo('#album-previews')
        }
    }

    get validator() {
        if(!this._validator) {
            let vE = app.get('validationEngine');
            this._validator = new vE({
                title: ['required', 'not_empty'],
                images: ['not_empty_list', {
                    'list_of_objects': {
                        type: ['required', {
                            'one_of': ['image/png', 'image/jpg', 'image/jpeg']
                        }]
                    }
                }]
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
        alert('success')
    }

    onError() {
        alert('not success')
    }
};