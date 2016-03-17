/**
    This file contains code of Backbone.Router class.

    Copyright (c) 2010-2016 Jeremy Ashkenas, DocumentCloud

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

let _ = require('underscore'),
    history = app.get('history'),
    EventEmitter = require('events');

module.exports = class extends EventEmitter {
    constructor(options) {
        Object.assign(this, options);
        this._bindRoutes()
    }

    route(route, name, callback) {
        if(!_.isRegExp(route)) {
            route = this._routeToRegExp(route);
        }
        if(_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if(!callback) {
            callback = this[name];
        }
        history.route(route, fragment => {
            let args = this._extractParameters(route, fragment);
            if(this.execute(callback, args, name) !== false) {
                this.emit.apply(this, ['route:' + name].concat(args));
                this.emit('route', name, args);
                history.emit('route', this, name, args);
            }
        });
        return this
    }

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute(callback, args, name) {
        if(callback) {
            callback.apply(this, args)
        }
    }

    navigate(fragment, options) {
        history.navigate(fragment, options);
        return this
    }

    _bindRoutes() {
        if(!this.routes) {
            return
        }
        this.removeSlashes();
        this.routes = _.result(this, 'routes');
        let route,
            routes = _.keys(this.routes);
        while((route = routes.pop()) != null) {
            this.route(route, this.routes[route])
        }
    }

    removeSlashes() {
        this.routes = _.pairs(this.routes).reduce((routes, pair) => {
            let [route, cb] = pair;
            if(route.startsWith('/')) {
                route = route.slice(1)
            }
            return (routes[route] = cb, routes)
        }, {});
    }

    _routeToRegExp(route) {
        let optionalParam = /\((.*?)\)/g,
            namedParam    = /(\(\?)?:\w+/g,
            splatParam    = /\*\w+/g,
            escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        route = route.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, (match, optional) => {
                return optional ? match : '([^/?]+)'
            })
            .replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$')
    }

    _extractParameters(route, fragment) {
        let params = route.exec(fragment).slice(1);
        return _.map(params, (param, i) => {
            // Don't decode the search params.
            if (i === params.length - 1) return param || null;
            return param ? decodeURIComponent(param) : null
        });
    }

    loadPage() {
        this.emit('PageLoaded')
    }
};