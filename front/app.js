'use strict';

module.exports = {
    start() {
        this.setAliases();
        let templateEngine = require('../common/modules/template-engine/index');
        this.set('templateEngine', templateEngine.init())
    },

    set(name, val) {
        this[name] = val
    },

    get(name) {
        return this[name]
    },

    setAliases() {
        window['smart-plurals'] = Smart;
        window['jsmart'] = jSmart
    }
};