'use strict';

let BaseView = require('./base'),
    $ = require('jquery'),
    AjaxResponse = require('../classes/ajax-response');

module.exports = class extends BaseView {
    get events() {
        return {
            'submit': 'submit'
        }
    }

    submit(event) {
        event.preventDefault();

        let form = event.target,
            data = this.validate(this.serializeData(form));
        if(data) {
            this.send(form.action, data).then(result => {
                if(this.isRequestSuccess(result)) {
                    this.onSuccess(result)
                } else {
                    this.onError(result)
                }
            })
        } else {
            this.onValidationError()
        }
    }

    isRequestSuccess(result) {
        return result.status == AjaxResponse.statusOK
    }
    
    onSuccess() {}
    
    onError() {}

    serializeData(form) {
        return this.toJSON.call(form)
    }

    send(url, data) {
        return $.post(url, data, null, 'json')
    }

    toJSON() {
        let json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push":     /^$/,
                "fixed":    /^\d+$/,
                "named":    /^[a-zA-Z0-9_]+$/
            };


        let build = (base, key, value) => {
            base[key] = value;
            return base;
        };

        let pushCounter = key => {
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function() {
            // skip invalid keys
            if(!patterns.validate.test(this.name)){
                return;
            }

            let k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while((k = keys.pop()) !== undefined) {
                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if(k.match(patterns.push)){
                    merge = build([], pushCounter(reverse_key), merge);
                }

                // fixed
                else if(k.match(patterns.fixed)){
                    merge = build([], k, merge);
                }

                // named
                else if(k.match(patterns.named)){
                    merge = build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    }

    validate(data) {
        return data
    }

    onValidationError() {}
};