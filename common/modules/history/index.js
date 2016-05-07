/**
 This file contains code of Backbone.History class.

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

const _ = require('underscore'),
    routeStripper = /^[#\/]|\s+$/g,
    rootStripper = /^\/+|\/+$/g,
    pathStripper = /#.*$/;

module.exports = {
    handlers: [],

    get checkUrl() {
        return this._checkUrl.bind(this)
    },

    get location() {
        return window.location
    },

    get history() {
        return window.history
    },

    started: false,

    interval: 50,

    atRoot() {
        let path = this.location.pathname.replace(/[^\/]$/, '$&/');
        return path === this.root && !this.getSearch()
    },

    matchRoot() {
        let path = this.decodeFragment(this.location.pathname),
            rootPath = path.slice(0, this.root.length - 1) + '/';
        return rootPath === this.root
    },

    decodeFragment(fragment) {
        return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    getSearch() {
        let match = this.location.href.replace(/#.*/, '').match(/\?.+/);
        return match ? match[0] : ''
    },

    getHash(window) {
        let match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : ''
    },

    getPath() {
        let path = this.decodeFragment(
            this.location.pathname + this.getSearch()
        ).slice(this.root.length - 1);
        return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    getFragment(fragment) {
        if(fragment == null) {
            if(this._usePushState || !this._wantsHashChange) {
                fragment = this.getPath()
            } else {
                fragment = this.getHash()
            }
        }
        return fragment.replace(routeStripper, '');
    },

    start(options) {
        if(this.started) {
            throw new Error('history has already been started')
        }
        this.started = true;

        this.applyOptions(options);

        // Normalize root to always include a leading and trailing slash.
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');

        // Transition from hashChange to pushState or vice versa if both are
        // requested.
        if(this._wantsHashChange && this._wantsPushState) {

            // If we've started off with a route from a `pushState`-enabled
            // browser, but we're currently in a browser that doesn't support it...
            if(!this._hasPushState && !this.atRoot()) {
                var rootPath = this.root.slice(0, -1) || '/';
                this.location.replace(rootPath + '#' + this.getPath());
                // Return immediately as browser will do redirect to new url
                return true;

                // Or if we've started out with a hash-based route, but we're currently
                // in a browser where it could be `pushState`-based instead...
            } else if(this._hasPushState && this.atRoot()) {
                this.navigate(this.getHash(), {replace: true});
            }

        }

        this.hashChangeSupport();

        this.urlStateListeners();

        if(!this.options.silent) {
            return this.loadUrl()
        }
    },

    applyOptions(options) {
        // Figure out the initial configuration. Do we need an iframe?
        // Is pushState desired ... is it available?
        this.options = _.extend({root: '/'}, this.options, options);
        this.root = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._hasHashChange = 'onhashchange' in window &&
            (document.documentMode === void 0 || document.documentMode > 7);
        this._useHashChange = this._wantsHashChange && this._hasHashChange;
        this._wantsPushState = !!this.options.pushState;
        this._hasPushState = !!(this.history && this.history.pushState);
        this._usePushState = this._wantsPushState && this._hasPushState;
        this.fragment = this.getFragment()
    },

    hashChangeSupport() {
        // Proxy an iframe to handle location events if the browser doesn't
        // support the `hashchange` event, HTML5 history, or the user wants
        // `hashChange` but not `pushState`.
        if(!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
            this.iframe = document.createElement('iframe');
            this.iframe.src = 'javascript:0';
            this.iframe.style.display = 'none';
            this.iframe.tabIndex = -1;
            let body = document.body;
            // Using `appendChild` will throw on IE < 9 if the document is not ready.
            let iWindow = body.insertBefore(this.iframe, body.firstChild).contentWindow;
            iWindow.document.open();
            iWindow.document.close();
            iWindow.location.hash = '#' + this.fragment
        }
    },

    urlStateListeners() {
        // Add a cross-platform `addEventListener` shim for older browsers.
        const addEventListener = window.addEventListener ||
            ((eventName, listener) => {
                return window.attachEvent('on' + eventName, listener);
            });

        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if(this._usePushState) {
            addEventListener('popstate', this.checkUrl, false);
        } else if(this._useHashChange && !this.iframe) {
            addEventListener('hashchange', this.checkUrl, false);
        } else if(this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }
    },

    stop: function() {
        this.removeListeners();

        // Clean up the iframe if necessary.
        if(this.iframe) {
            document.body.removeChild(this.iframe);
            this.iframe = null;
        }

        // Some environments will throw when clearing an undefined interval.
        if(this._checkUrlInterval) {
            clearInterval(this._checkUrlInterval);
        }
        this.started = false;
    },

    removeListeners() {
        // Add a cross-platform `removeEventListener` shim for older browsers.
        const removeEventListener = window.removeEventListener ||
            ((eventName, listener) => {
                return window.detachEvent('on' + eventName, listener);
            });

        // Remove window listeners.
        if(this._usePushState) {
            removeEventListener('popstate', this.checkUrl, false);
        } else if(this._useHashChange && !this.iframe) {
            removeEventListener('hashchange', this.checkUrl, false);
        }
    },

    route(routeRegexp, callback) {
        this.handlers.unshift({route: routeRegexp, callback: callback});
    },

    _checkUrl() {
        let current = this.getFragment();

        // If the user pressed the back button, the iframe's hash will have
        // changed and we should use that for comparison.
        if(current === this.fragment && this.iframe) {
            current = this.getHash(this.iframe.contentWindow)
        }

        if(current === this.fragment) {
            return false
        }
        if(this.iframe) {
            this.navigate(current)
        }
        this.loadUrl()
    },

    loadUrl(fragment) {
        // If the root doesn't match, no routes can match either.
        if(!this.matchRoot()) {
            return false
        }
        fragment = this.fragment = this.getFragment(fragment);
        return this.handlers.some(handler => {
            if(handler.route.test(fragment)) {
                handler.callback(fragment);
                return true
            }
        });
    },

    navigate: function(fragment, options) {
        if(!this.started) {
            return false
        }
        if(!options || options === true) {
            options = {trigger: !!options}
        }

        // Normalize the fragment.
        fragment = this.getFragment(fragment || '');

        // Don't include a trailing slash on the root.
        let rootPath = this.root;
        if(fragment === '' || fragment.charAt(0) === '?') {
            rootPath = rootPath.slice(0, -1) || '/'
        }
        let url = rootPath + fragment;

        // Strip the hash and decode for matching.
        fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

        if(this.fragment === fragment) {
            return
        }
        this.fragment = fragment;

        // If pushState is available, we use it to set the fragment as a real URL.
        if(this._usePushState) {
            this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

            // If hash changes haven't been explicitly disabled, update the hash
            // fragment to store history.
        } else if(this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            if(this.iframe && fragment !== this.getHash(this.iframe.contentWindow)) {
                let iWindow = this.iframe.contentWindow;

                // Opening and closing the iframe tricks IE7 and earlier to push a
                // history entry on hash-tag change.  When replace is true, we don't
                // want this.
                if(!options.replace) {
                    iWindow.document.open();
                    iWindow.document.close();
                }

                this._updateHash(iWindow.location, fragment, options.replace)
            }

            // If you've told us that you explicitly don't want fallback hashchange-
            // based history, then `navigate` becomes a page refresh.
        } else {
            return this.location.assign(url)
        }
        if(options.trigger) {
            return this.loadUrl(fragment)
        }
    },

    _updateHash(location, fragment, replace) {
        if(replace) {
            let href = location.href.replace(/(javascript:|#).*$/, '');
            location.replace(href + '#' + fragment);
        } else {
            // Some browsers require that `hash` contains a leading #.
            location.hash = '#' + fragment;
        }
    },

    init() {
        this.setRoutes();
        app.clientSide(() => {
            this.registerEvents();
            this.start({pushState: true, silent: true})
        });
        return this
    },

    setRoutes() {
        const process = require('process'),
            routes = require(process.cwd() + '/configuration/routes'),
            fs = require('fs');
        _.pairs(routes).forEach(pair => {
            let paths = [app.get('commonPath'), app.get('classPath')],
                path, routerPath;
            while(path = paths.shift()) {
                routerPath = `${path}/routers/${pair[0]}.js`;
                try {
                    fs.accessSync(routerPath);
                } catch(e) {
                    continue
                }
                const router = require(routerPath);
                new router({
                    routes: pair[1]
                });
                break
            }
        })
    },

    registerEvents() {
        const $ = require('jquery');
        $(document).on('click', 'a[href]:not(.link_external)', e => {
            let link = e.currentTarget;
            let href = link.getAttribute('href');
            let navigate = href.indexOf('http') == -1
                && href.indexOf('www') == -1
                && href.indexOf('javascript') == -1;
            if(navigate) {
                e.preventDefault();
                this.navigate(href, {trigger: true})
            }
        })
    }
};