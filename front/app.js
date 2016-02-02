'use strict';

module.exports = {
    start() {
        this.setAliases();
        this.setVars();
        this.setRoutes();
        this.registerEvents();

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
        this.set('classPath', '/front');
        this.set('commonPath', process.cwd()+'/common');

        let templateEngine = require('../common/modules/template-engine/index');
        this.set('templateEngine', templateEngine.init());
    },

    setRoutes() {
        let getRouter = require('../common/routers/get'),
            routes = require('../configuration/routes'),
            routerObj = new getRouter();
        routerObj.routes = routes.getRouter;

        this.set('router', routerObj)
    },

    registerEvents() {
        $(document).on('click', 'a[href]:not(.link_external)', function(e) {
            let href = this.getAttribute('href');
            let navigate = href.indexOf('http') == -1
                && href.indexOf('www') == -1
                && href.indexOf('javascript') == -1;
            if(navigate) {
                e.preventDefault();
                this.get('router').navigate(href, {trigger:true});
            }
        });

        $(document).on('submit', 'form', function(e) {
            e.preventDefault();
        });
    }
};