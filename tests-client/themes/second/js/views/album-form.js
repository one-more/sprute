'use strict';

const FileUploadView = require(app.get('commonPath')+'/views/file-upload-form');

module.exports = class extends FileUploadView {
    get el() {
        return '#album-form'
    }

    get concatFiles() {
        return false
    }

    onFileSelect(event) {
        if(event.target.files.length) {
            const clone = this.$el.find('input[type=file]').eq(0).clone();
            const _ = require('underscore');
            const name = _.uniqueId(clone.get(0).name);
            clone.attr('name', name);
            clone.appendTo('#album-previews')
        }
        console.log(this.files);
    }

    get validator() {
        if(!this._validator) {
            let vE = app.get('validationEngine');
            this._validator = new vE({
                title: ['required', 'not_empty'],
                'images[]': ['not_empty_list', {
                    'list_of_objects': {
                        type: ['required', {
                            'one_of': ['image/png']
                        }]
                    }
                }]
            })
        }
        return this._validator
    }

    validate(data) {
        console.log(data);
        return this.validator.validate(data)
    }

    onValidationError() {
        console.log(this.validator.getErrors());
        alert('invalid data')
    }

    onSuccess() {
        alert('success')
    }

    onError() {
        alert('not success')
    }
};