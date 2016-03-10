'use strict';

let BaseView = require('./base'),
    $ = require('jquery');

module.exports = class extends BaseView {
    get events() {
        return {
            'submit': 'submit'
        }
    }

    get statusOK() {
        return 1
    }

    get statusError() {
        return 0
    }

    submit(event) {
        event.preventDefault();

        let form = event.target,
            data = this.validate(this.processData(form));
        if(data) {
            this.send(form.action, data).then(result => {

            })
        } else {
            this.onValidationError()
        }
    }

    status(result) {
        return result
    }

    processData(form) {
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


        this.build = (base, key, value) => {
            base[key] = value;
            return base;
        };

        this.push_counter = key => {
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), () => {
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
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if(k.match(patterns.fixed)){
                    merge = self.build([], k, merge);
                }

                // named
                else if(k.match(patterns.named)){
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    }

    validate(data) {
        return data
    }

    onValidationError() {

    }
};