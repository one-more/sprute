'use strict';

let process = require('process'),
    _ = require('underscore'),
    routes = require('../configuration/routes'),
    $ = require('jquery');

module.exports = {
    start() {
        this.setVars();

        window.addEventListener('load', event => {
            this.loadComponents();
            this.setRoutes();
            this.registerEvents();

            this.get('history').start({pushState: true, silent: true})
        });

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
        this.set('commonPath', process.cwd()+'/common')
    },

    loadComponents() {
        let components = require('../configuration/components');

        _.pairs(components).forEach(pair => {
            this.set(pair[0], pair[1].init())
        })
    },

    setRoutes() {
        _.pairs(routes).forEach(pair => {
            let paths = [this.get('commonPath'), this.get('classPath')], path;
            while(path = paths.shift()) {
                try {
                    var router = require(`${path}/routers/${pair[0]}`),
                        routerObj = new router({
                            routes: pair[1]
                        });
                    break
                } catch(e) {
                    //console.log(e)
                }
            }
        })
    },

    registerEvents() {
        $(document).on('click', 'a[href]:not(.link_external)', e => {
            let link = e.target;
            let href = link.getAttribute('href');
            let navigate = href.indexOf('http') == -1
                && href.indexOf('www') == -1
                && href.indexOf('javascript') == -1;
            if(navigate) {
                e.preventDefault();
                this.get('history').navigate(href, {trigger: true})
            }
        });

        $(document).on('submit', 'form', function(e) {
            e.preventDefault();
        });
    },

    serverSide(callback) {

    },

    clientSide(callback) {
        callback()
    }
};