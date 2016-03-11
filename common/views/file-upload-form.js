'use strict';

let FormView = require('./form'),
    $ = require('jquery');

module.exports = class extends FormView {
    serializeData(form) {
        return Object.assign(
            super.serializeData(form),
            Array.from(form.querySelectorAll('input[type=file]'))
                .reduce((fields, input) => {
                    return (
                        fields[input.name] = Array.from(input.files)
                            .map(file => {
                                return [
                                    'lastModifiedDate',
                                    'name',
                                    'lastModified',
                                    'size',
                                    'type'
                                ].reduce((hash, key) => {
                                    return (hash[key] = file[key], hash)
                                }, {})
                            }).concat(function() {
                                return fields[input.name] || []
                            }()),
                        fields
                    )
                }, {})
        )
    }

    processData(data, form) {
        return new FormData(form)
    }

    send(url, data) {
        let progressHandler = this.onProgress.bind(this);
        return $.ajax({
            url,
            type: 'post',
            xhr() {
                let xhr = $.ajaxSettings.xhr();
                if(xhr.upload){
                    xhr.upload.addEventListener('progress', progressHandler, false);
                }
                return xhr;
            },
            data,
            cache: false,
            contentType: false,
            processData: false
        }, 'json')
    }

    onProgress() {}
};