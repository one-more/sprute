'use strict';

let process = require('process'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    routes = require('../configuration/routes'),
    components = require('../configuration/components'),
    $ = require('jquery');

module.exports = {
    start() {
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

    setVars() {
        this.set('classPath', '/front');
        this.set('commonPath', process.cwd()+'/common');

        let templateEngine = components.templatesEngine;
        this.set('templateEngine', templateEngine.init());
    },

    setRoutes() {
        _.pairs(routes).forEach(pair => {
            try {
                var router = require(this.get('commonPath')+`/routers/${pair[0]}`),
                    routerObj = new router;
            } catch(e) {
                try {
                    router = require(this.get('classPath')+`/routers/${pair[0]}`);
                    routerObj = new router
                } catch(e) {
                    return
                }
            }
            routerObj.routes = pair[1]
        })
    },

    registerEvents() {
        $(document).on('click', 'a[href]:not(.link_external)', function(e) {
            let href = this.getAttribute('href');
            let navigate = href.indexOf('http') == -1
                && href.indexOf('www') == -1
                && href.indexOf('javascript') == -1;
            if(navigate) {
                e.preventDefault();
                //this.get('router').navigate(href, {trigger:true});
                Backbone.history.pushState(href)
            }
        });

        $(document).on('submit', 'form', function(e) {
            e.preventDefault();
        });
    },

    serverSide(callback) {
        typeof global != 'undefined' && callback()
    },

    clientSide(callback) {
        typeof window != 'undefined' && callback()
    }
};