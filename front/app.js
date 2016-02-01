'use strict';

module.exports = {
    start() {
        this.setAliases();
        this.setVars();
        this.setRoutes();

        Backbone.history.start({pushState: true, silent: true});
        return this
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
    },

    setVars() {
        let templateEngine = require('../common/modules/template-engine/index');
        this.set('templateEngine', templateEngine.init());
        this.set('classPath', '/front')
    },

    setRoutes() {
        let getRouter = require('../common/routers/get'),
            routes = require('../configuration/routes'),
            routerObj = new getRouter();
        routerObj.routes = routes.getRouter;

        this.set('router', routerObj)
    }
};