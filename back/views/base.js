'use strict';

module.exports = class {
    getTemplate(tpl, data) {
        return this.compile(tpl).fetch(data)
    }

    compile(tpl) {
        let tplEngine = app.get('templateEngine');
        console.log(tplEngine);
        return new tplEngine(tpl)
    }
};