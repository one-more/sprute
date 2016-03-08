'use strict';

let Backbone = require('backbone'),
    _ = require('underscore');

module.exports = class extends Backbone.Router {
    loadPage() {
        this.trigger('PageLoaded')
    }

    _bindRoutes() {
        if(!this.routes) {
            return
        }
        this.routes = _.pairs(this.routes).reduce((routes, pair) => {
            let [route, cb] = pair;
            if(route.startsWith('/')) {
                route = route.slice(1)
            }
            return (routes[route] = cb, routes)
        }, {});

        super._bindRoutes()
    }
};