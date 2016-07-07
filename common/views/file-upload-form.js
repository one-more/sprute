'use strict';

const FormView = require('./form'),
    $ = require('jquery'),
    _ = require('underscore');

module.exports = class extends FormView {
    filesToObj() {
        //convert files to objects for validation purpose
        return _.mapObject(this.files, files => {
            return files.map(file => {
                let proto = file, i = 0, keys = [];
                while(proto) {
                    if(++i > 300) {
                        break
                    }
                    proto = Object.getPrototypeOf(proto);
                    keys = keys.concat(Object.keys(proto || {}))
                }
                return _.uniq(keys).reduce((obj, key) => {
                    obj[key] = file[key];
                    return obj
                }, {})
            })
        })
    }

    serializeData() {
        const data = super.serializeData.apply(this, arguments);
        return Object.assign(data, this.filesToObj())
    }

    get events() {
        return Object.assign(super.events, {
            'change input[type=file]': 'addFiles'
        })
    }

    get concatFiles() {
        return true
    }

    addFiles(e) {
        const target = e.currentTarget;
        if(!this.files) {
            this.files = {}
        }
        if(target.files.length) {
            const key = target.name;
            const inputFiles = Array.from(target.files);
            if(this.concatFiles) {
                const files = this.files[key] || [];
                this.files[key] = files.concat(inputFiles)
            } else {
                this.files[key] = inputFiles
            }
        }
        this.onFileSelect(e)
    }
    
    onFileSelect() {
        
    }

    removeFile(file) {
        for(let i in this.files) {
            if(this.files.hasOwnProperty(i)) {
                const files = this.files[i];
                if(files.indexOf(file) > -1) {
                    files.splice(files.indexOf(file), 1);
                    break
                }
            }
        }
    }

    clearFiles() {
        this.files = {}
    }

    processData(data, form) {
        data = Object.assign(data, this.files || {});
        return _.pairs(data).reduce((formData, pair) => {
            if(pair[1] instanceof Array) {
                const name = pair[0];
                _.pairs(pair[1]).forEach(pair => {
                    if(pair[1] instanceof File) {
                        const file = pair[1];
                        const fileName = this.formDataFileName(file, name);
                        formData.append(fileName, file)
                    } else {
                        formData.append(name, pair[1])
                    }
                })
            } else {
                formData.append(pair[0], pair[1])
            }
            return formData
        }, new FormData)
    }

    formDataFileName(file, inputName) {
        return inputName
    }

    send(url, data) {
        const progressHandler = this.onProgress.bind(this);
        return $.ajax({
            url,
            type: 'post',
            xhr() {
                const xhr = $.ajaxSettings.xhr();
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