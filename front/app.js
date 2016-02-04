'use strict';

let process = require('process'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    routes = require('../configuration/routes'),
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

        let templateEngine = require(this.get('commonPath')+'/modules/template-engine/index');
        this.set('templateEngine', templateEngine.init());
    },

    setRoutes() {

        _.pairs(routes).forEach(pair => {
            try {
                let router = require(this.get('commonPath')+`/routers/${pair[0]}`),
                    routerObj = new router;
                routerObj.roites = pair[1]
            } catch(e) {}
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
    }
};